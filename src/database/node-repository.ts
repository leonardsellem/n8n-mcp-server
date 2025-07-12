import { DatabaseAdapter } from './database-adapter';
import { ParsedNode } from '../parsers/node-parser';
import { nodeInfoCache, searchCache, QueryCache } from '../utils/query-cache';

export class NodeRepository {
  constructor(private db: DatabaseAdapter) {}
  
  /**
   * Save node with proper JSON serialization
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
   * Get node with proper JSON deserialization and caching
   */
  getNode(nodeType: string): any {
    // Check cache first
    const cacheKey = QueryCache.generateKey('node', nodeType);
    const cached = nodeInfoCache.get(cacheKey);
    if (cached) return cached;
    
    const row = this.db.prepare(`
      SELECT * FROM nodes WHERE node_type = ?
    `).get(nodeType) as any;
    
    if (!row) return null;
    
    const result = {
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      developmentStyle: row.development_style,
      package: row.package_name,
      isAITool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version,
      properties: this.safeJsonParse(row.properties_schema, []),
      operations: this.safeJsonParse(row.operations, []),
      credentials: this.safeJsonParse(row.credentials_required, []),
      hasDocumentation: !!row.documentation
    };
    
    // Cache the result
    nodeInfoCache.set(cacheKey, result);
    return result;
  }
  
  /**
   * Get AI tools with proper filtering
   */
  getAITools(): any[] {
    const rows = this.db.prepare(`
      SELECT node_type, display_name, description, package_name
      FROM nodes 
      WHERE is_ai_tool = 1
      ORDER BY display_name
    `).all() as any[];
    
    return rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      package: row.package_name
    }));
  }
  
  /**
   * Get node info (alias for getNode with more comprehensive data)
   */
  getNodeInfo(nodeType: string): any {
    // Check cache first
    const cacheKey = QueryCache.generateKey('node_info', nodeType);
    const cached = nodeInfoCache.get(cacheKey);
    if (cached) return cached;
    
    const row = this.db.prepare(`
      SELECT * FROM nodes WHERE node_type = ?
    `).get(nodeType) as any;
    
    if (!row) return null;
    
    const result = {
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      developmentStyle: row.development_style,
      package: row.package_name,
      isAITool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version,
      properties: this.safeJsonParse(row.properties_schema, []),
      operations: this.safeJsonParse(row.operations, []),
      credentials: this.safeJsonParse(row.credentials_required, []),
      documentation: row.documentation,
      hasDocumentation: !!row.documentation
    };
    
    // Cache the result
    nodeInfoCache.set(cacheKey, result);
    return result;
  }

  /**
   * List nodes with optional filtering
   */
  listNodes(options: any = {}): any[] {
    let query = 'SELECT * FROM nodes';
    const params: any[] = [];
    
    if (options.category) {
      query += ' WHERE category = ?';
      params.push(options.category);
    }
    
    if (options.isAITool) {
      query += params.length ? ' AND' : ' WHERE';
      query += ' is_ai_tool = 1';
    }
    
    query += ' ORDER BY display_name';
    
    const rows = this.db.prepare(query).all(...params) as any[];
    
    return rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      package: row.package_name,
      isAITool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version
    }));
  }

  /**
   * Search nodes with full-text search and caching
   */
  searchNodes(query: string, options: any = {}): any[] {
    // Check cache first
    const cacheKey = QueryCache.generateKey('search', query, JSON.stringify(options));
    const cached = searchCache.get(cacheKey);
    if (cached) return cached;
    
    const searchQuery = `
      SELECT * FROM nodes 
      WHERE (display_name LIKE ? OR description LIKE ? OR node_type LIKE ?)
      ORDER BY display_name
    `;
    
    const searchTerm = `%${query}%`;
    const rows = this.db.prepare(searchQuery).all(searchTerm, searchTerm, searchTerm) as any[];
    
    const result = rows.map(row => ({
      nodeType: row.node_type,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      package: row.package_name,
      isAITool: !!row.is_ai_tool,
      isTrigger: !!row.is_trigger,
      isWebhook: !!row.is_webhook,
      isVersioned: !!row.is_versioned,
      version: row.version
    }));
    
    // Cache the search results
    searchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get node documentation
   */
  getNodeDocumentation(nodeType: string): string | null {
    const row = this.db.prepare(`
      SELECT documentation FROM nodes WHERE node_type = ?
    `).get(nodeType) as any;
    
    return row?.documentation || null;
  }

  /**
   * Get database statistics
   */
  getDatabaseStatistics(): any {
    const totalNodes = this.db.prepare('SELECT COUNT(*) as count FROM nodes').get() as any;
    const aiTools = this.db.prepare('SELECT COUNT(*) as count FROM nodes WHERE is_ai_tool = 1').get() as any;
    const triggers = this.db.prepare('SELECT COUNT(*) as count FROM nodes WHERE is_trigger = 1').get() as any;
    const webhooks = this.db.prepare('SELECT COUNT(*) as count FROM nodes WHERE is_webhook = 1').get() as any;
    const withDocs = this.db.prepare('SELECT COUNT(*) as count FROM nodes WHERE documentation IS NOT NULL').get() as any;
    
    return {
      totalNodes: totalNodes.count,
      aiTools: aiTools.count,
      triggers: triggers.count,
      webhooks: webhooks.count,
      withDocumentation: withDocs.count,
      categories: this.getCategories()
    };
  }

  /**
   * Get all categories
   */
  private getCategories(): string[] {
    const rows = this.db.prepare(`
      SELECT DISTINCT category FROM nodes WHERE category IS NOT NULL ORDER BY category
    `).all() as any[];
    
    return rows.map(row => row.category);
  }

  private safeJsonParse(json: string, defaultValue: any): any {
    try {
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }
}