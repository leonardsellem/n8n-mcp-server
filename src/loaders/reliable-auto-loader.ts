import path from 'path';
import { N8nNodeLoader, LoadedNode } from './node-loader';
import { GitHubSync, GitHubSyncConfig } from '../services/github-sync';
import { logger } from '../utils/logger';
import { promises as fs } from 'fs';

export interface ReliableAutoLoaderConfig {
  github: GitHubSyncConfig;
  alwaysFallbackToLocal: boolean;
  maxSyncTimeMs: number;
  retryAttempts: number;
}

export interface LoadResult {
  nodes: LoadedNode[];
  source: 'npm' | 'github' | 'mixed';
  syncSuccess: boolean;
  loadTime: number;
  errors: string[];
}

/**
 * Reliable Auto-Loader for AI Agents
 * 
 * Simple, bulletproof node loading that works every time:
 * - Always tries GitHub first (if configured)
 * - Always falls back to local NPM on any issue
 * - Never fails completely - AI agents always get nodes
 * - Self-updating when possible, reliable when not
 * - Zero configuration complexity
 */
export class ReliableAutoLoader extends N8nNodeLoader {
  private githubSync: GitHubSync | null = null;
  private config: ReliableAutoLoaderConfig;
  private lastSuccessfulSync: Date | null = null;

  constructor(config: Partial<ReliableAutoLoaderConfig> = {}) {
    super();
    
    this.config = {
      github: {
        token: process.env.GITHUB_TOKEN || '',
        localCachePath: './data/github-cache',
        enabled: !!process.env.GITHUB_TOKEN
      },
      alwaysFallbackToLocal: true,
      maxSyncTimeMs: 30000, // 30 seconds max for GitHub sync
      retryAttempts: 3,
      ...config
    };

    // Only setup GitHub if token is available
    if (this.config.github.token && this.config.github.enabled) {
      try {
        this.githubSync = new GitHubSync(this.config.github);
      } catch (error) {
        logger.warn('[Reliable Auto Loader] GitHub sync setup failed, using local only', error);
      }
    }
  }

  /**
   * Load all nodes with automatic GitHub sync and guaranteed fallback
   */
  async loadAllNodesWithResult(): Promise<LoadResult> {
    const startTime = Date.now();
    const result: LoadResult = {
      nodes: [],
      source: 'npm',
      syncSuccess: false,
      loadTime: 0,
      errors: []
    };

    try {
      // Try GitHub sync first (with timeout)
      if (this.githubSync) {
        result.syncSuccess = await this.tryGitHubSync();
        if (result.syncSuccess) {
          logger.info('[Reliable Auto Loader] GitHub sync successful');
        } else {
          logger.warn('[Reliable Auto Loader] GitHub sync failed, using local nodes');
        }
      }

      // Load nodes (local is always reliable)
      result.nodes = await this.loadNodesReliably();
      result.source = this.determineSource(result.syncSuccess);
      result.loadTime = Date.now() - startTime;

      logger.info(`[Reliable Auto Loader] Loaded ${result.nodes.length} nodes in ${result.loadTime}ms (${result.source})`);
      
      return result;

    } catch (error) {
      // This should never happen due to fallbacks, but just in case
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      logger.error('[Reliable Auto Loader] Critical error, attempting emergency load', error);
      
      try {
        result.nodes = await super.loadAllNodes(); // Emergency fallback
        result.source = 'npm';
        result.loadTime = Date.now() - startTime;
      } catch (emergencyError) {
        logger.error('[Reliable Auto Loader] Emergency load failed', emergencyError);
        result.errors.push('Emergency load failed');
      }
      
      return result;
    }
  }

  /**
   * Try GitHub sync with timeout and error handling
   */
  private async tryGitHubSync(): Promise<boolean> {
    if (!this.githubSync) return false;

    try {
      // Initialize GitHub sync if not already done
      if (!this.githubSync.getSyncStats().lastSyncTime) {
        await this.withTimeout(
          this.githubSync.initialize(),
          this.config.maxSyncTimeMs,
          'GitHub initialization'
        );
      }

      // Perform sync with timeout
      const syncResult = await this.withTimeout(
        this.githubSync.syncNodes(),
        this.config.maxSyncTimeMs,
        'GitHub sync'
      );

      this.lastSuccessfulSync = new Date();
      logger.info(`[Reliable Auto Loader] GitHub sync: +${syncResult.added} ~${syncResult.updated} -${syncResult.removed}`);
      
      return true;

    } catch (error) {
      logger.warn('[Reliable Auto Loader] GitHub sync failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lastSuccess: this.lastSuccessfulSync
      });
      return false;
    }
  }

  /**
   * Load nodes with multiple fallback strategies
   */
  private async loadNodesReliably(): Promise<LoadedNode[]> {
    // Strategy 1: Try GitHub + NPM combined (if GitHub sync worked)
    if (this.githubSync && this.lastSuccessfulSync) {
      try {
        const npmNodes = await super.loadAllNodes();
        const githubNodes = await this.loadGitHubNodesSimple();
        
        // Combine but prioritize NPM (more reliable)
        const combined = [...npmNodes];
        
        // Add GitHub nodes that don't conflict
        for (const githubNode of githubNodes) {
          if (!npmNodes.find(n => n.nodeName === githubNode.nodeName)) {
            combined.push(githubNode);
          }
        }
        
        if (combined.length > npmNodes.length) {
          logger.info(`[Reliable Auto Loader] Enhanced with ${combined.length - npmNodes.length} GitHub nodes`);
        }
        
        return combined;
      } catch (error) {
        logger.warn('[Reliable Auto Loader] Combined loading failed, falling back to NPM only', error);
      }
    }

    // Strategy 2: NPM only (always works)
    try {
      const nodes = await super.loadAllNodes();
      logger.info(`[Reliable Auto Loader] Loaded ${nodes.length} nodes from NPM packages`);
      return nodes;
    } catch (error) {
      logger.error('[Reliable Auto Loader] NPM loading failed', error);
      throw new Error('All loading strategies failed');
    }
  }

  /**
   * Simple GitHub node loading without complex compilation
   */
  private async loadGitHubNodesSimple(): Promise<LoadedNode[]> {
    if (!this.githubSync) return [];

    try {
      const nodeFiles = await this.githubSync.getCachedNodeFiles();
      const nodes: LoadedNode[] = [];

      // Only process a few files to avoid issues
      for (const fileName of nodeFiles.slice(0, 10)) {
        try {
          const content = await this.githubSync.readCachedFile(fileName, 'nodes');
          
          // Simple validation - just check if it looks like a node file
          if (this.isValidNodeFile(content, fileName)) {
            const nodeName = fileName.replace('.node.ts', '').replace('.node.js', '');
            
            // Create a placeholder node class (not executed for security)
            nodes.push({
              packageName: 'github-n8n-nodes-base',
              nodeName,
              NodeClass: this.createPlaceholderNodeClass(nodeName, content)
            });
          }
        } catch (error) {
          logger.debug(`[Reliable Auto Loader] Skipped GitHub file ${fileName}: ${error}`);
        }
      }

      return nodes;
    } catch (error) {
      logger.warn('[Reliable Auto Loader] GitHub node loading failed', error);
      return [];
    }
  }

  /**
   * Simple validation without code execution
   */
  private isValidNodeFile(content: string, fileName: string): boolean {
    if (!content || content.length < 100) return false;
    
    // Basic checks for node file structure
    const hasClass = /class\s+\w+/.test(content);
    const hasDescription = /description\s*[:=]/.test(content);
    const hasNodeStructure = /node|Node/.test(fileName);
    
    return hasClass && hasDescription && hasNodeStructure;
  }

  /**
   * Create placeholder node class for AI agents (metadata only)
   */
  private createPlaceholderNodeClass(nodeName: string, content: string): any {
    // Extract basic metadata without executing code
    const displayName = this.extractDisplayName(content) || nodeName;
    const description = this.extractDescription(content) || `GitHub node: ${nodeName}`;
    
    return class PlaceholderNode {
      static description = {
        displayName,
        name: nodeName,
        group: ['GitHub'],
        version: 1,
        description,
        defaults: {
          name: displayName
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: []
      };
    };
  }

  /**
   * Extract display name from source code
   */
  private extractDisplayName(content: string): string | null {
    const patterns = [
      /displayName:\s*['"`]([^'"`]+)['"`]/,
      /name:\s*['"`]([^'"`]+)['"`]/,
      /class\s+(\w+)/
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Extract description from source code
   */
  private extractDescription(content: string): string | null {
    const patterns = [
      /description:\s*['"`]([^'"`]+)['"`]/,
      /\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  /**
   * Determine the source of loaded nodes
   */
  private determineSource(syncSuccess: boolean): 'npm' | 'github' | 'mixed' {
    if (!this.githubSync) return 'npm';
    if (!syncSuccess) return 'npm';
    return 'mixed'; // NPM + GitHub metadata
  }

  /**
   * Timeout wrapper for promises
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    operation: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeout));
    });
  }

  /**
   * Check if auto-update is working
   */
  getAutoUpdateStatus(): {
    enabled: boolean;
    lastSync: Date | null;
    githubAvailable: boolean;
    nodeCount: number;
  } {
    return {
      enabled: !!this.githubSync,
      lastSync: this.lastSuccessfulSync,
      githubAvailable: !!this.githubSync,
      nodeCount: 0 // Will be filled by calling code
    };
  }

  /**
   * Force a sync (for AI agents that want latest)
   */
  async forceSync(): Promise<boolean> {
    if (!this.githubSync) {
      logger.warn('[Reliable Auto Loader] No GitHub sync available for force sync');
      return false;
    }

    try {
      logger.info('[Reliable Auto Loader] Force syncing from GitHub...');
      await this.githubSync.syncNodes(true); // Force sync
      this.lastSuccessfulSync = new Date();
      logger.info('[Reliable Auto Loader] Force sync completed successfully');
      return true;
    } catch (error) {
      logger.error('[Reliable Auto Loader] Force sync failed', error);
      return false;
    }
  }

  /**
   * Simple health check for AI agents
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'error';
    message: string;
    details: any;
  }> {
    try {
      // Quick test load using the correct method
      const testResult = await this.loadAllNodesWithResult();
      
      if (testResult.nodes.length === 0) {
        return {
          status: 'error',
          message: 'No nodes loaded',
          details: { errors: testResult.errors }
        };
      }

      if (testResult.errors.length > 0) {
        return {
          status: 'degraded',
          message: 'Working but with errors',
          details: { 
            nodeCount: testResult.nodes.length,
            errors: testResult.errors,
            source: testResult.source
          }
        };
      }

      return {
        status: 'healthy',
        message: 'All systems working',
        details: {
          nodeCount: testResult.nodes.length,
          source: testResult.source,
          syncSuccess: testResult.syncSuccess,
          loadTime: testResult.loadTime
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Health check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}