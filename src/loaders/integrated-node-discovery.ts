import { RemoteNodeDiscovery } from './remote-node-discovery.js';
import { NodeParser, ParsedNode } from '../parsers/node-parser.js';
import { NodeCacheService } from '../database/node-cache.js';
import { NodeMetadata } from '../types/index.js';
import { loadEnvironmentVariables } from '../config/environment.js';

// Load environment early
loadEnvironmentVariables();

export interface DiscoveryStats {
  totalNodes: number;
  totalCredentials: number;
  lastSync: string;
  cacheHits: number;
  cacheMisses: number;
  lastCommitSha?: string;
}

export interface NodeSummary {
  nodeType: string;
  displayName: string;
  description?: string;
  category: string;
  packageName: string;
  version: string;
  isTrigger: boolean;
  isWebhook: boolean;
  isAITool: boolean;
}

/**
 * Integrated node discovery system that combines:
 * - Timeout-safe RemoteNodeDiscovery for GitHub operations
 * - NodeParser for TypeScript AST parsing
 * - NodeCache for high-performance caching
 * - Compatible interface with existing MCP server
 */
export class IntegratedNodeDiscovery {
  private remoteDiscovery: RemoteNodeDiscovery;
  private nodeParser: NodeParser;
  private cache: NodeCacheService;
  private lastSyncTime: Date | null = null;
  private stats: DiscoveryStats = {
    totalNodes: 0,
    totalCredentials: 0,
    lastSync: '',
    cacheHits: 0,
    cacheMisses: 0
  };

  constructor() {
    const githubToken = process.env.GITHUB_TOKEN;
    this.remoteDiscovery = new RemoteNodeDiscovery(githubToken);
    this.nodeParser = new NodeParser();
    this.cache = new NodeCacheService();
  }

  /**
   * Discover nodes with intelligent caching and timeout prevention
   */
  async discoverNodes(): Promise<NodeSummary[]> {
    try {
      console.log('🔍 Starting intelligent node discovery...');
      
      // Check if we need to refresh from GitHub
      const shouldRefresh = await this.shouldRefreshFromGitHub();
      
      if (shouldRefresh) {
        console.log('📡 Refreshing from GitHub...');
        await this.refreshFromGitHub();
      } else {
        console.log('⚡ Using cached data (GitHub unchanged)');
        this.stats.cacheHits++;
      }

      // Get nodes from cache (always fast)
      const nodes = await this.cache.getAllNodes();
      console.log(`✅ Retrieved ${nodes.length} nodes from cache`);

      return nodes.map(node => this.nodeToSummary(node));
    } catch (error) {
      console.error('❌ Node discovery failed:', error);
      // Fallback to cache even if GitHub fails
      const cachedNodes = await this.cache.getAllNodes();
      console.log(`🔄 Fallback: Using ${cachedNodes.length} cached nodes`);
      return cachedNodes.map(node => this.nodeToSummary(node));
    }
  }

  /**
   * Search nodes by query (cache-based, always fast)
   */
  async searchNodes(query: string): Promise<NodeSummary[]> {
    console.log(`🔍 Searching nodes for: ${query}`);
    
    const allNodes = await this.cache.searchNodes(query);
    console.log(`✅ Found ${allNodes.length} matching nodes`);
    return allNodes.map(node => this.nodeToSummary(node));
  }

  /**
   * Get nodes by category (cache-based, always fast)
   */
  async getNodesByCategory(category: string): Promise<NodeSummary[]> {
    console.log(`📂 Getting nodes for category: ${category}`);
    
    const matches = await this.cache.getNodesByCategory(category);
    console.log(`✅ Found ${matches.length} nodes in category ${category}`);
    return matches.map(node => this.nodeToSummary(node));
  }

  /**
   * Get detailed node information (cache-based, always fast)
   */
  async getNodeDetails(nodeName: string): Promise<NodeMetadata | null> {
    console.log(`📋 Getting details for node: ${nodeName}`);
    
    const node = await this.cache.getNode(nodeName);
    if (!node) {
      console.log(`❌ Node not found: ${nodeName}`);
      return null;
    }

    console.log(`✅ Retrieved details for ${node.displayName}`);
    return node;
  }

  /**
   * Get available categories (cache-based, always fast)
   */
  async getAvailableCategories(): Promise<string[]> {
    console.log('📂 Getting available categories...');
    
    const stats = await this.cache.getCacheStats();
    const categories = Object.keys(stats.categoryCounts);
    categories.sort();

    console.log(`✅ Found ${categories.length} categories`);
    return categories;
  }

  /**
   * Force refresh from GitHub (only when explicitly requested)
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refreshing from GitHub...');
    await this.refreshFromGitHub();
    console.log('✅ Force refresh completed');
  }

  /**
   * Get cache and discovery statistics
   */
  async getCacheStats(): Promise<DiscoveryStats> {
    const cacheStats = await this.cache.getCacheStats();
    
    return {
      ...this.stats,
      totalNodes: cacheStats.totalNodes,
      lastSync: this.lastSyncTime?.toISOString() || 'Never'
    };
  }

  /**
   * Check if we should refresh from GitHub (prevents unnecessary API calls)
   */
  private async shouldRefreshFromGitHub(): Promise<boolean> {
    try {
      // Always refresh if we have no cached nodes
      const isEmpty = await this.cache.isEmpty();
      if (isEmpty) {
        console.log('💾 No cached nodes, refresh required');
        return true;
      }

      // Check if repository has changed
      const lastKnownSha = await this.cache.getCommitSha();
      const hasChanged = await this.remoteDiscovery.hasRepositoryChanged(lastKnownSha || undefined);
      
      if (hasChanged) {
        console.log('🔄 Repository has changed, refresh required');
        return true;
      }

      console.log('✅ Repository unchanged, using cache');
      return false;
    } catch (error) {
      console.error('⚠️ Failed to check repository status, using cache:', error);
      return false; // Fallback to cache if GitHub check fails
    }
  }

  /**
   * Refresh data from GitHub repository (timeout-safe)
   */
  private async refreshFromGitHub(): Promise<void> {
    try {
      console.log('📡 Fetching latest commit SHA...');
      const currentSha = await this.remoteDiscovery.getLatestCommitSha();
      this.stats.lastCommitSha = currentSha;

      console.log('📥 Discovering nodes from GitHub...');
      const remoteNodes = await this.remoteDiscovery.discoverAllNodes();
      
      console.log('🔍 Parsing TypeScript nodes...');
      const parsedNodes: NodeMetadata[] = [];
      
      for (const remoteNode of remoteNodes) {
        try {
          const parsed = this.remoteDiscovery.parseNodeFromSource(remoteNode);
          if (parsed) {
            // Convert parsed node to NodeMetadata format
            const nodeMetadata: NodeMetadata = {
              name: parsed.nodeType,
              displayName: parsed.displayName,
              description: parsed.description || '',
              category: (parsed.category as any) || 'Action',
              version: parseInt(parsed.version || '1', 10),
              properties: parsed.properties,
              credentials: parsed.credentials,
              operations: parsed.operations,
              lastUpdated: new Date().toISOString()
            };
            parsedNodes.push(nodeMetadata);
          }
        } catch (error) {
          console.error(`⚠️ Failed to parse ${remoteNode.name}:`, error);
        }
      }

      console.log(`💾 Caching ${parsedNodes.length} parsed nodes...`);
      await this.cache.saveNodes(parsedNodes, currentSha);

      // Update stats
      this.stats.totalNodes = parsedNodes.length;
      this.stats.lastSync = new Date().toISOString();
      this.stats.cacheMisses++;
      this.lastSyncTime = new Date();

      console.log(`✅ Successfully cached ${parsedNodes.length} nodes`);
    } catch (error) {
      console.error('❌ Failed to refresh from GitHub:', error);
      throw error;
    }
  }

  /**
   * Convert parsed node to summary format for MCP responses
   */
  private nodeToSummary(node: any): NodeSummary {
    return {
      nodeType: node.nodeType,
      displayName: node.displayName,
      description: node.description,
      category: node.category,
      packageName: node.packageName,
      version: node.version,
      isTrigger: node.isTrigger,
      isWebhook: node.isWebhook,
      isAITool: node.isAITool
    };
  }
}
