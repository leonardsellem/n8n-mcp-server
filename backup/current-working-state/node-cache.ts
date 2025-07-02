import Database from 'better-sqlite3';
import { NodeMetadata, NodeCacheEntry } from '../types/index.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export class NodeCacheService {
  private db: Database.Database;
  private readonly dbPath: string;

  constructor(dbPath?: string) {
    // Create cache directory if it doesn't exist
    const cacheDir = join(process.cwd(), 'cache');
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }

    this.dbPath = dbPath || join(cacheDir, 'node-cache.db');
    this.db = new Database(this.dbPath);
    this.initializeDatabase();
  }

  /**
   * Initialize the database schema
   */
  private initializeDatabase(): void {
    // Create nodes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_name TEXT UNIQUE NOT NULL,
        metadata TEXT NOT NULL,
        category TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sync metadata table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sync_metadata (
        id INTEGER PRIMARY KEY,
        commit_sha TEXT,
        last_sync TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_nodes_category ON nodes(category);
      CREATE INDEX IF NOT EXISTS idx_nodes_name ON nodes(node_name);
    `);
  }

  /**
   * Save nodes to cache with commit SHA
   */
  async saveNodes(nodes: NodeMetadata[], commitSha: string): Promise<void> {
    const transaction = this.db.transaction((nodes: NodeMetadata[], sha: string) => {
      // Clear existing nodes
      this.db.prepare('DELETE FROM nodes').run();

      // Insert new nodes
      const insertNode = this.db.prepare(`
        INSERT OR REPLACE INTO nodes (node_name, metadata, category, last_updated)
        VALUES (?, ?, ?, ?)
      `);

      for (const node of nodes) {
        insertNode.run(
          node.name,
          JSON.stringify(node),
          node.category,
          node.lastUpdated
        );
      }

      // Update sync metadata
      this.db.prepare('DELETE FROM sync_metadata').run();
      this.db.prepare(`
        INSERT INTO sync_metadata (id, commit_sha, last_sync)
        VALUES (1, ?, datetime('now'))
      `).run(sha);
    });

    transaction(nodes, commitSha);
    console.log(`💾 Cached ${nodes.length} nodes with commit SHA: ${commitSha.substring(0, 8)}`);
  }

  /**
   * Get all nodes from cache
   */
  async getAllNodes(): Promise<NodeMetadata[]> {
    const rows = this.db.prepare(`
      SELECT metadata FROM nodes ORDER BY node_name
    `).all() as { metadata: string }[];

    return rows.map(row => JSON.parse(row.metadata) as NodeMetadata);
  }

  /**
   * Get nodes by category
   */
  async getNodesByCategory(category: string): Promise<NodeMetadata[]> {
    const rows = this.db.prepare(`
      SELECT metadata FROM nodes WHERE category = ? ORDER BY node_name
    `).all(category) as { metadata: string }[];

    return rows.map(row => JSON.parse(row.metadata) as NodeMetadata);
  }

  /**
   * Search nodes by name or description
   */
  async searchNodes(query: string): Promise<NodeMetadata[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const rows = this.db.prepare(`
      SELECT metadata FROM nodes 
      WHERE LOWER(node_name) LIKE ? 
         OR LOWER(metadata) LIKE ? 
      ORDER BY node_name
    `).all(lowerQuery, lowerQuery) as { metadata: string }[];

    return rows.map(row => JSON.parse(row.metadata) as NodeMetadata);
  }

  /**
   * Get a specific node by name
   */
  async getNode(nodeName: string): Promise<NodeMetadata | null> {
    const row = this.db.prepare(`
      SELECT metadata FROM nodes WHERE LOWER(node_name) = LOWER(?)
    `).get(nodeName) as { metadata: string } | undefined;

    return row ? JSON.parse(row.metadata) as NodeMetadata : null;
  }

  /**
   * Get the current commit SHA from cache
   */
  async getCommitSha(): Promise<string | null> {
    const row = this.db.prepare(`
      SELECT commit_sha FROM sync_metadata WHERE id = 1
    `).get() as { commit_sha: string } | undefined;

    return row ? row.commit_sha : null;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalNodes: number;
    categoryCounts: Record<string, number>;
    lastSync: string | null;
    commitSha: string | null;
  }> {
    const totalResult = this.db.prepare(`
      SELECT COUNT(*) as count FROM nodes
    `).get() as { count: number };

    const categoryResults = this.db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM nodes 
      GROUP BY category 
      ORDER BY count DESC
    `).all() as { category: string; count: number }[];

    const syncResult = this.db.prepare(`
      SELECT commit_sha, last_sync FROM sync_metadata WHERE id = 1
    `).get() as { commit_sha: string; last_sync: string } | undefined;

    const categoryCounts: Record<string, number> = {};
    categoryResults.forEach(result => {
      categoryCounts[result.category] = result.count;
    });

    return {
      totalNodes: totalResult.count,
      categoryCounts,
      lastSync: syncResult?.last_sync || null,
      commitSha: syncResult?.commit_sha || null
    };
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    this.db.prepare('DELETE FROM nodes').run();
    this.db.prepare('DELETE FROM sync_metadata').run();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Check if cache is empty
   */
  async isEmpty(): Promise<boolean> {
    const result = this.db.prepare(`
      SELECT COUNT(*) as count FROM nodes
    `).get() as { count: number };

    return result.count === 0;
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Get database file path for debugging
   */
  getDatabasePath(): string {
    return this.dbPath;
  }
}
