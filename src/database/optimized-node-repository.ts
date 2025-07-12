import { DatabaseAdapter } from './database-adapter';
import { OptimizedDatabaseAdapter, DatabaseConnectionPool } from './optimized-database-adapter';
import { ParsedNode } from '../parsers/node-parser';
import { PerformanceMonitor } from '../services/performance-monitor';
import { logger } from '../utils/logger';

export interface NodeQueryOptions {
  category?: string;
  isAiTool?: boolean;
  isTrigger?: boolean;
  isWebhook?: boolean;
  packageName?: string;
  limit?: number;
  offset?: number;
}

export interface NodeSearchOptions {
  query: string;
  limit?: number;
  includeDocumentation?: boolean;
  includeProperties?: boolean;
}

export class OptimizedNodeRepository {
  private db: OptimizedDatabaseAdapter;
  private connectionPool?: DatabaseConnectionPool;
  private performanceMonitor: PerformanceMonitor;

  constructor(db: DatabaseAdapter, connectionPool?: DatabaseConnectionPool) {
    this.db = db instanceof OptimizedDatabaseAdapter ? db : new OptimizedDatabaseAdapter(db);
    this.connectionPool = connectionPool;
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  /**
   * Save node with optimized batch operations
   */
  saveNode(node: ParsedNode): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO nodes (
        node_type, package_name, display_name, description,
        category, development_style, is_ai_tool, is_trigger,
        is_webhook, is_versioned, version, documentation,
        properties_schema, operations, credentials_required
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      node.nodeType,
      node.packageName,
      node.displayName,
      node.description,
      node.category,
      node.style,
      node.isAITool ? 1 : 0,
      node.isTrigger ? 1 : 0,
      node.isWebhook ? 1 : 0,
      node.isVersioned ? 1 : 0,
      node.version,
      node.documentation || null,
      JSON.stringify(node.properties, null, 2),
      JSON.stringify(node.operations, null, 2),
      JSON.stringify(node.credentials, null, 2)
    );
  }

  /**
   * Batch save nodes with transaction for better performance
   */
  saveNodes(nodes: ParsedNode[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO nodes (
        node_type, package_name, display_name, description,
        category, development_style, is_ai_tool, is_trigger,
        is_webhook, is_versioned, version, documentation,
        properties_schema, operations, credentials_required
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.db.transaction(() => {
      for (const node of nodes) {
        stmt.run(
          node.nodeType,
          node.packageName,
          node.displayName,
          node.description,
          node.category,
          node.style,
          node.isAITool ? 1 : 0,
          node.isTrigger ? 1 : 0,
          node.isWebhook ? 1 : 0,
          node.isVersioned ? 1 : 0,
          node.version,
          node.documentation || null,
          JSON.stringify(node.properties, null, 2),
          JSON.stringify(node.operations, null, 2),
          JSON.stringify(node.credentials, null, 2)
        );
      }
    });

    logger.debug(`Batch saved ${nodes.length} nodes`);
  }

  /**
   * Get node with optimized query and proper JSON deserialization
   */
  getNode(nodeType: string): any {
    const stmt = this.db.prepare(`
      SELECT * FROM nodes WHERE node_type = ? LIMIT 1
    `);
    
    const row = stmt.get(nodeType) as any;
    if (!row) return null;
    
    return this.mapRowToNode(row);
  }

  /**
   * Get node info with minimal fields for better performance
   */
  getNodeInfo(nodeType: string): any {
    const stmt = this.db.prepare(`
      SELECT 
        node_type, display_name, description, category, package_name,
        is_ai_tool, is_trigger, is_webhook, is_versioned, version,
        properties_schema, operations, credentials_required
      FROM nodes 
      WHERE node_type = ? LIMIT 1
    `);
    
    const row = stmt.get(nodeType) as any;
    if (!row) return null;
    
    return {
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      packageName: row.package_name,
      isAiTool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version,
      propertiesSchema: this.safeJsonParse(row.properties_schema, {}),
      operations: this.safeJsonParse(row.operations, []),
      credentialsRequired: this.safeJsonParse(row.credentials_required, [])
    };
  }

  /**
   * List nodes with optimized filtering and pagination
   */
  listNodes(options: NodeQueryOptions = {}): any[] {
    const {
      category,
      isAiTool,
      isTrigger,
      isWebhook,
      packageName,
      limit = 100,
      offset = 0
    } = options;

    let sql = `
      SELECT 
        node_type, display_name, description, category, package_name,
        is_ai_tool, is_trigger, is_webhook, is_versioned, version
      FROM nodes
      WHERE 1 = 1
    `;
    
    const params: any[] = [];

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    if (isAiTool !== undefined) {
      sql += ` AND is_ai_tool = ?`;
      params.push(isAiTool ? 1 : 0);
    }

    if (isTrigger !== undefined) {
      sql += ` AND is_trigger = ?`;
      params.push(isTrigger ? 1 : 0);
    }

    if (isWebhook !== undefined) {
      sql += ` AND is_webhook = ?`;
      params.push(isWebhook ? 1 : 0);
    }

    if (packageName) {
      sql += ` AND package_name = ?`;
      params.push(packageName);
    }

    sql += ` ORDER BY display_name LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      packageName: row.package_name,
      isAiTool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version
    }));
  }

  /**
   * Search nodes with FTS5 optimization
   */
  searchNodes(query: string, limit: number = 20): any[] {
    // Use FTS5 for better search performance
    const stmt = this.db.prepare(`
      SELECT 
        node_type, display_name, description, category, package_name,
        is_ai_tool, is_trigger, is_webhook, is_versioned, version,
        rank
      FROM nodes_fts 
      WHERE nodes_fts MATCH ? 
      ORDER BY rank 
      LIMIT ?
    `);
    
    const rows = stmt.all(query, limit) as any[];
    
    return rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      packageName: row.package_name,
      isAiTool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version,
      relevance: row.rank
    }));
  }

  /**
   * Get AI tools with optimized query
   */
  getAITools(): any[] {
    const stmt = this.db.prepare(`
      SELECT 
        node_type, display_name, description, package_name, version
      FROM nodes 
      WHERE is_ai_tool = 1
      ORDER BY display_name
    `);
    
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      packageName: row.package_name,
      version: row.version
    }));
  }

  /**
   * Get node documentation with optimized query
   */
  getNodeDocumentation(nodeType: string): any {
    const stmt = this.db.prepare(`
      SELECT documentation FROM nodes WHERE node_type = ? LIMIT 1
    `);
    
    const row = stmt.get(nodeType) as any;
    return row?.documentation || null;
  }

  /**
   * Get database statistics with performance metrics
   */
  getDatabaseStatistics(): any {
    const stats = {
      totalNodes: 0,
      nodesByCategory: {},
      nodesByPackage: {},
      aiToolsCount: 0,
      triggersCount: 0,
      webhooksCount: 0,
      versionedNodes: 0,
      queryCount: this.db.getQueryCount(),
      performanceMetrics: this.performanceMonitor.getMetrics()
    };

    // Get total nodes
    const totalStmt = this.db.prepare(`SELECT COUNT(*) as count FROM nodes`);
    stats.totalNodes = totalStmt.get().count;

    // Get nodes by category
    const categoryStmt = this.db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM nodes 
      WHERE category IS NOT NULL 
      GROUP BY category
    `);
    const categoryRows = categoryStmt.all() as any[];
    stats.nodesByCategory = categoryRows.reduce((acc, row) => {
      acc[row.category] = row.count;
      return acc;
    }, {});

    // Get nodes by package
    const packageStmt = this.db.prepare(`
      SELECT package_name, COUNT(*) as count 
      FROM nodes 
      GROUP BY package_name
    `);
    const packageRows = packageStmt.all() as any[];
    stats.nodesByPackage = packageRows.reduce((acc, row) => {
      acc[row.package_name] = row.count;
      return acc;
    }, {});

    // Get special counts
    const countsStmt = this.db.prepare(`
      SELECT 
        SUM(is_ai_tool) as ai_tools,
        SUM(is_trigger) as triggers,
        SUM(is_webhook) as webhooks,
        SUM(is_versioned) as versioned
      FROM nodes
    `);
    const counts = countsStmt.get() as any;
    stats.aiToolsCount = counts.ai_tools || 0;
    stats.triggersCount = counts.triggers || 0;
    stats.webhooksCount = counts.webhooks || 0;
    stats.versionedNodes = counts.versioned || 0;

    return stats;
  }

  /**
   * Execute query with connection pooling if available
   */
  async executeWithPool<T>(fn: (db: OptimizedDatabaseAdapter) => T): Promise<T> {
    if (this.connectionPool) {
      return this.connectionPool.executeWithConnection(async (connection) => {
        return fn(connection);
      });
    } else {
      return fn(this.db);
    }
  }

  private mapRowToNode(row: any): any {
    return {
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      developmentStyle: row.development_style,
      packageName: row.package_name,
      isAiTool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version,
      properties: this.safeJsonParse(row.properties_schema, {}),
      operations: this.safeJsonParse(row.operations, []),
      credentials: this.safeJsonParse(row.credentials_required, []),
      documentation: row.documentation,
      hasDocumentation: !!row.documentation
    };
  }

  private safeJsonParse(json: string, defaultValue: any): any {
    try {
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }
}