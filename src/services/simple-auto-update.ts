import { ReliableAutoLoader, LoadResult } from '../loaders/reliable-auto-loader';
import { NodeRepository } from '../database/node-repository';
import { NodeParser } from '../parsers/node-parser';
import { DocsMapper } from '../mappers/docs-mapper';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface SimpleAutoUpdateConfig {
  enabled: boolean;
  checkIntervalMinutes: number;
  maxUpdateTimeMs: number;
  githubToken?: string;
}

export interface UpdateStatus {
  isUpdating: boolean;
  lastUpdate: Date | null;
  lastCheck: Date | null;
  nodeCount: number;
  updateSuccess: boolean;
  errors: string[];
}

/**
 * Simple Auto-Update Service for AI Agents
 * 
 * No complexity, just works:
 * - Checks GitHub every 15 minutes by default
 * - Updates database when new nodes available
 * - AI agents always get working nodes
 * - Never breaks, always falls back
 * - Zero configuration needed
 */
export class SimpleAutoUpdateService extends EventEmitter {
  private config: SimpleAutoUpdateConfig;
  private loader: ReliableAutoLoader;
  private repository: NodeRepository;
  private nodeParser: NodeParser;
  private docsMapper: DocsMapper;
  
  private checkInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;
  private status: UpdateStatus = {
    isUpdating: false,
    lastUpdate: null,
    lastCheck: null,
    nodeCount: 0,
    updateSuccess: false,
    errors: []
  };

  constructor(
    config: Partial<SimpleAutoUpdateConfig>,
    repository: NodeRepository
  ) {
    super();
    
    this.config = {
      enabled: !!process.env.GITHUB_TOKEN,
      checkIntervalMinutes: 15,
      maxUpdateTimeMs: 60000, // 1 minute max
      githubToken: process.env.GITHUB_TOKEN,
      ...config
    };

    this.repository = repository;
    this.nodeParser = new NodeParser();
    this.docsMapper = new DocsMapper();
    
    this.loader = new ReliableAutoLoader({
      github: {
        token: this.config.githubToken || '',
        localCachePath: './data/github-cache',
        enabled: this.config.enabled
      }
    });

    if (this.config.enabled) {
      this.startPeriodicChecks();
      logger.info(`[Simple Auto Update] Started with ${this.config.checkIntervalMinutes}min intervals`);
    } else {
      logger.info('[Simple Auto Update] Disabled - no GitHub token provided');
    }
  }

  /**
   * Start periodic GitHub checks
   */
  private startPeriodicChecks(): void {
    if (this.checkInterval) return;

    const intervalMs = this.config.checkIntervalMinutes * 60 * 1000;
    
    this.checkInterval = setInterval(() => {
      this.checkForUpdates().catch(error => {
        logger.error('[Simple Auto Update] Periodic check failed', error);
      });
    }, intervalMs);

    // Do initial check after 30 seconds (let server start up first)
    setTimeout(() => {
      this.checkForUpdates().catch(error => {
        logger.debug('[Simple Auto Update] Initial check failed', error);
      });
    }, 30000);
  }

  /**
   * Check for updates and apply if available
   */
  async checkForUpdates(): Promise<boolean> {
    if (this.isUpdating) {
      logger.debug('[Simple Auto Update] Update already in progress, skipping check');
      return false;
    }

    this.status.lastCheck = new Date();
    
    try {
      logger.info('[Simple Auto Update] Checking for updates...');
      
      const updateAvailable = await this.isUpdateAvailable();
      if (!updateAvailable) {
        logger.debug('[Simple Auto Update] No updates available');
        return false;
      }

      logger.info('[Simple Auto Update] Updates available, applying...');
      return await this.applyUpdates();

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.status.errors.push(errorMsg);
      logger.error('[Simple Auto Update] Check failed', error);
      return false;
    }
  }

  /**
   * Check if updates are available (simple GitHub check)
   */
  private async isUpdateAvailable(): Promise<boolean> {
    try {
      // Simple check: try to load nodes and see if we get GitHub content
      const result = await this.withTimeout(
        this.loader.loadAllNodesWithResult(),
        this.config.maxUpdateTimeMs
      );

      // If we got GitHub sync, there might be new content
      return result.syncSuccess && result.source !== 'npm';
    } catch (error) {
      logger.debug('[Simple Auto Update] Update check failed', error);
      return false;
    }
  }

  /**
   * Apply updates to database
   */
  private async applyUpdates(): Promise<boolean> {
    if (this.isUpdating) return false;
    
    this.isUpdating = true;
    this.status.isUpdating = true;
    
    try {
      logger.info('[Simple Auto Update] Loading nodes from GitHub...');
      
      // Load nodes with auto-update
      const result = await this.withTimeout(
        this.loader.loadAllNodesWithResult(),
        this.config.maxUpdateTimeMs
      );

      if (result.nodes.length === 0) {
        throw new Error('No nodes loaded from any source');
      }

      // Parse and update database
      await this.updateDatabase(result);
      
      this.status.lastUpdate = new Date();
      this.status.nodeCount = result.nodes.length;
      this.status.updateSuccess = true;
      this.status.errors = result.errors;
      
      this.emit('update_completed', {
        nodeCount: result.nodes.length,
        source: result.source,
        loadTime: result.loadTime
      });
      
      logger.info(`[Simple Auto Update] Update completed: ${result.nodes.length} nodes (${result.source})`);
      return true;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.status.errors.push(errorMsg);
      this.status.updateSuccess = false;
      
      this.emit('update_failed', { error: errorMsg });
      logger.error('[Simple Auto Update] Update failed', error);
      return false;
      
    } finally {
      this.isUpdating = false;
      this.status.isUpdating = false;
    }
  }

  /**
   * Update database with new nodes
   */
  private async updateDatabase(result: LoadResult): Promise<void> {
    let successCount = 0;
    let errorCount = 0;

    for (const { packageName, nodeName, NodeClass } of result.nodes) {
      try {
        // Parse node
        const parsed = this.nodeParser.parse(NodeClass, packageName);
        
        if (!parsed.nodeType || !parsed.displayName) {
          throw new Error('Invalid node structure');
        }
        
        // Get documentation (quick attempt only)
        try {
          const docs = await this.docsMapper.fetchDocumentation(parsed.nodeType);
          parsed.documentation = docs || undefined;
        } catch (docError) {
          // Don't fail the whole update for missing docs
          logger.debug(`[Simple Auto Update] No docs for ${parsed.nodeType}`);
        }
        
        // Save to database
        this.repository.saveNode(parsed);
        successCount++;
        
      } catch (error) {
        errorCount++;
        logger.debug(`[Simple Auto Update] Failed to process ${nodeName}`, error);
      }
    }

    logger.info(`[Simple Auto Update] Database updated: ${successCount} success, ${errorCount} errors`);
  }

  /**
   * Force immediate update (for AI agents)
   */
  async forceUpdate(): Promise<boolean> {
    logger.info('[Simple Auto Update] Force update requested');
    
    try {
      // Force GitHub sync first
      await this.loader.forceSync();
      
      // Then apply updates
      return await this.applyUpdates();
    } catch (error) {
      logger.error('[Simple Auto Update] Force update failed', error);
      return false;
    }
  }

  /**
   * Get current status (for AI agents)
   */
  getStatus(): UpdateStatus {
    return { ...this.status };
  }

  /**
   * Health check (for AI agents)
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'error';
    message: string;
    autoUpdateWorking: boolean;
    nodeCount: number;
  }> {
    try {
      const loaderHealth = await this.loader.healthCheck();
      
      return {
        status: loaderHealth.status,
        message: loaderHealth.message,
        autoUpdateWorking: this.config.enabled && !this.isUpdating,
        nodeCount: loaderHealth.details.nodeCount || this.status.nodeCount
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Health check failed',
        autoUpdateWorking: false,
        nodeCount: this.status.nodeCount
      };
    }
  }

  /**
   * Simple statistics for monitoring
   */
  getStats(): {
    enabled: boolean;
    lastUpdate: Date | null;
    lastCheck: Date | null;
    nodeCount: number;
    errorCount: number;
    isWorking: boolean;
  } {
    return {
      enabled: this.config.enabled,
      lastUpdate: this.status.lastUpdate,
      lastCheck: this.status.lastCheck,
      nodeCount: this.status.nodeCount,
      errorCount: this.status.errors.length,
      isWorking: this.config.enabled && !this.isUpdating
    };
  }

  /**
   * Stop auto-updates
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    this.removeAllListeners();
    logger.info('[Simple Auto Update] Stopped');
  }

  /**
   * Timeout wrapper
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeout));
    });
  }
}