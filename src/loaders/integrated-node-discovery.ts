import { RemoteNodeDiscovery } from './remote-node-discovery';
import { NodeParser, ParsedNode } from '../parsers/node-parser';
import { DatabaseAdapter, createDatabaseAdapter } from '../database/database-adapter';
import { NodeRepository } from '../database/node-repository';
import { NodeMetadata } from '../types/index';
import { loadEnvironmentVariables } from '../config/environment';
import path from 'path';

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
 * - DatabaseAdapter with NodeRepository for high-performance caching
 * - Compatible interface with existing MCP server
 */
export class IntegratedNodeDiscovery {
  private remoteDiscovery: RemoteNodeDiscovery;
  private nodeParser: NodeParser;
  private db: DatabaseAdapter | null = null;
  private nodeRepo: NodeRepository | null = null;
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
  }

  /**
   * Initialize the database connection
   */
  private async initializeDatabase(): Promise<void> {
    if (!this.db) {
      const dbPath = path.join(process.cwd(), 'cache', 'node-cache.db');
      this.db = await createDatabaseAdapter(dbPath);
      this.nodeRepo = new NodeRepository(this.db);
      
      // Initialize database schema if needed
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS nodes (
          node_type TEXT PRIMARY KEY,
          display_name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          package_name TEXT,
          version TEXT,
          is_trigger INTEGER DEFAULT 0,
          is_webhook INTEGER DEFAULT 0,
          is_ai_tool INTEGER DEFAULT 0,
          properties TEXT,
          credentials TEXT,
          operations TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS metadata (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for performance
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_nodes_category ON nodes(category)`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_nodes_display_name ON nodes(display_name)`);
    }
  }

  /**
   * Discover nodes with intelligent caching and timeout prevention
   */
  async discoverNodes(): Promise<NodeSummary[]> {
    try {
      console.log('🔍 Starting intelligent node discovery...');
      await this.initializeDatabase();
      
      // Check if we need to refresh from GitHub
      const shouldRefresh = await this.shouldRefreshFromGitHub();
      
      if (shouldRefresh) {
        console.log('📡 Refreshing from GitHub...');
        await this.refreshFromGitHub();
      } else {
        console.log('⚡ Using cached data (GitHub unchanged)');
        this.stats.cacheHits++;
      }

      // Get nodes from database (always fast)
      const nodes = this.getAllNodesFromCache();
      console.log(`✅ Retrieved ${nodes.length} nodes from cache`);

      return nodes.map(node => this.nodeToSummary(node));
    } catch (error) {
      console.error('❌ Node discovery failed:', error);
      // Fallback to cache even if GitHub fails
      await this.initializeDatabase();
      const cachedNodes = this.getAllNodesFromCache();
      console.log(`🔄 Fallback: Using ${cachedNodes.length} cached nodes`);
      return cachedNodes.map(node => this.nodeToSummary(node));
    }
  }

  /**
   * Search nodes by query (cache-based, always fast)
   */
  async searchNodes(query: string): Promise<NodeSummary[]> {
    console.log(`🔍 Searching nodes for: ${query}`);
    await this.initializeDatabase();
    
    const allNodes = this.searchNodesInCache(query);
    console.log(`✅ Found ${allNodes.length} matching nodes`);
    return allNodes.map(node => this.nodeToSummary(node));
  }

  /**
   * Get nodes by category (cache-based, always fast)
   */
  async getNodesByCategory(category: string): Promise<NodeSummary[]> {
    console.log(`📂 Getting nodes for category: ${category}`);
    await this.initializeDatabase();
    
    const matches = this.getNodesByCategoryFromCache(category);
    console.log(`✅ Found ${matches.length} nodes in category ${category}`);
    return matches.map(node => this.nodeToSummary(node));
  }

  /**
   * Get detailed node information (cache-based, always fast)
   */
  async getNodeDetails(nodeName: string): Promise<NodeMetadata | null> {
    console.log(`📋 Getting details for node: ${nodeName}`);
    await this.initializeDatabase();
    
    if (!this.nodeRepo) {
      console.log(`❌ NodeRepository not initialized`);
      return null;
    }

    const node = this.nodeRepo.getNode(nodeName);
    if (!node) {
      console.log(`❌ Node not found: ${nodeName}`);
      return null;
    }

    console.log(`✅ Retrieved details for ${node.displayName}`);
    return this.dbNodeToMetadata(node);
  }

  /**
   * Get available categories (cache-based, always fast)
   */
  async getAvailableCategories(): Promise<string[]> {
    console.log('📂 Getting available categories...');
    await this.initializeDatabase();
    
    const categories = this.getDistinctCategories();
    categories.sort();

    console.log(`✅ Found ${categories.length} categories`);
    return categories;
  }

  /**
   * Force refresh from GitHub (only when explicitly requested)
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refreshing from GitHub...');
    await this.initializeDatabase();
    await this.refreshFromGitHub();
    console.log('✅ Force refresh completed');
  }

  /**
   * Get cache and discovery statistics
   */
  async getCacheStats(): Promise<DiscoveryStats> {
    await this.initializeDatabase();
    const nodeCount = this.getNodeCount();
    
    return {
      ...this.stats,
      totalNodes: nodeCount,
      lastSync: this.lastSyncTime?.toISOString() || 'Never'
    };
  }

  /**
   * Check if we should refresh from GitHub (prevents unnecessary API calls)
   */
  private async shouldRefreshFromGitHub(): Promise<boolean> {
    try {
      // Always refresh if we have no cached nodes
      const isEmpty = this.getNodeCount() === 0;
      if (isEmpty) {
        console.log('💾 No cached nodes, refresh required');
        return true;
      }

      // Check if repository has changed
      const lastKnownSha = this.getLastCommitSha();
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
      const parsedNodes: ParsedNode[] = [];
      
      for (const remoteNode of remoteNodes) {
        try {
          const parsed = this.remoteDiscovery.parseNodeFromSource(remoteNode);
          if (parsed) {
            parsedNodes.push(parsed);
          }
        } catch (error) {
          console.error(`⚠️ Failed to parse ${remoteNode.name}:`, error);
        }
      }

      console.log(`💾 Caching ${parsedNodes.length} parsed nodes...`);
      
      // Clear existing data and save new nodes
      this.clearCache();
      if (this.nodeRepo) {
        for (const node of parsedNodes) {
          this.nodeRepo.saveNode(node);
        }
      }
      this.saveCommitSha(currentSha);

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
   * Database operations (using DatabaseAdapter directly for performance)
   */
  private getAllNodesFromCache(): any[] {
    if (!this.db) return [];
    
    try {
      const rows = this.db.prepare(`
        SELECT node_type, display_name, description, category, 
               package_name, version, is_trigger, is_webhook, is_ai_tool
        FROM nodes 
        ORDER BY display_name
      `).all();
      
      return rows.map((row: any) => ({
        nodeType: row.node_type,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        packageName: row.package_name,
        version: row.version,
        isTrigger: !!row.is_trigger,
        isWebhook: !!row.is_webhook,
        isAITool: !!row.is_ai_tool
      }));
    } catch (error) {
      console.error('Error getting nodes from cache:', error);
      return [];
    }
  }

  private searchNodesInCache(query: string): any[] {
    if (!this.db) return [];
    
    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      const rows = this.db.prepare(`
        SELECT node_type, display_name, description, category, 
               package_name, version, is_trigger, is_webhook, is_ai_tool
        FROM nodes 
        WHERE LOWER(display_name) LIKE ? 
           OR LOWER(description) LIKE ? 
           OR LOWER(node_type) LIKE ?
        ORDER BY display_name
      `).all(searchTerm, searchTerm, searchTerm);
      
      return rows.map((row: any) => ({
        nodeType: row.node_type,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        packageName: row.package_name,
        version: row.version,
        isTrigger: !!row.is_trigger,
        isWebhook: !!row.is_webhook,
        isAITool: !!row.is_ai_tool
      }));
    } catch (error) {
      console.error('Error searching nodes:', error);
      return [];
    }
  }

  private getNodesByCategoryFromCache(category: string): any[] {
    if (!this.db) return [];
    
    try {
      const rows = this.db.prepare(`
        SELECT node_type, display_name, description, category, 
               package_name, version, is_trigger, is_webhook, is_ai_tool
        FROM nodes 
        WHERE category = ?
        ORDER BY display_name
      `).all(category);
      
      return rows.map((row: any) => ({
        nodeType: row.node_type,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        packageName: row.package_name,
        version: row.version,
        isTrigger: !!row.is_trigger,
        isWebhook: !!row.is_webhook,
        isAITool: !!row.is_ai_tool
      }));
    } catch (error) {
      console.error('Error getting nodes by category:', error);
      return [];
    }
  }

  private getDistinctCategories(): string[] {
    if (!this.db) return [];
    
    try {
      const rows = this.db.prepare(`
        SELECT DISTINCT category FROM nodes ORDER BY category
      `).all();
      
      return rows.map((row: any) => row.category);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  private getNodeCount(): number {
    if (!this.db) return 0;
    
    try {
      const result = this.db.prepare(`SELECT COUNT(*) as count FROM nodes`).get() as any;
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting node count:', error);
      return 0;
    }
  }

  private getLastCommitSha(): string | null {
    if (!this.db) return null;
    
    try {
      const result = this.db.prepare(`
        SELECT value FROM metadata WHERE key = 'last_commit_sha'
      `).get() as any;
      return result?.value || null;
    } catch (error) {
      console.error('Error getting commit SHA:', error);
      return null;
    }
  }

  private saveCommitSha(sha: string): void {
    if (!this.db) return;
    
    try {
      this.db.prepare(`
        INSERT OR REPLACE INTO metadata (key, value) VALUES ('last_commit_sha', ?)
      `).run(sha);
    } catch (error) {
      console.error('Error saving commit SHA:', error);
    }
  }

  private clearCache(): void {
    if (!this.db) return;
    
    try {
      this.db.prepare(`DELETE FROM nodes`).run();
      console.log('🗑️ Cleared existing node cache');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Convert database node to summary format for MCP responses
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

  /**
   * Convert database node to NodeMetadata format
   */
  private dbNodeToMetadata(node: any): NodeMetadata {
    return {
      name: node.nodeType,
      displayName: node.displayName,
      description: node.description || '',
      category: node.category || 'misc',
      version: parseInt(node.version || '1', 10),
      properties: node.properties || [],
      credentials: node.credentials || [],
      operations: node.operations || [],
      lastUpdated: new Date().toISOString()
    };
  }
}
