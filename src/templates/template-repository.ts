import { DatabaseAdapter } from '../database/database-adapter';
import { TemplateWorkflow, TemplateDetail } from './template-fetcher';
import { logger } from '../utils/logger';

export interface StoredTemplate {
  id: number;
  workflow_id: number;
  name: string;
  description: string;
  author_name: string;
  author_username: string;
  author_verified: number;
  nodes_used: string; // JSON string
  workflow_json: string; // JSON string
  categories: string; // JSON string
  views: number;
  created_at: string;
  updated_at: string;
  url: string;
  scraped_at: string;
}

export class TemplateRepository {
  constructor(private db: DatabaseAdapter) {}
  
  /**
   * Save a template to the database
   */
  saveTemplate(workflow: TemplateWorkflow, detail: TemplateDetail, categories: string[] = []): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO templates (
        id, workflow_id, name, description, author_name, author_username,
        author_verified, nodes_used, workflow_json, categories, views,
        created_at, updated_at, url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Extract node types from workflow
    const nodeTypes = workflow.nodes.map(n => n.name);
    
    // Build URL
    const url = `https://n8n.io/workflows/${workflow.id}`;
    
    stmt.run(
      workflow.id,
      workflow.id,
      workflow.name,
      workflow.description || '',
      workflow.user.name,
      workflow.user.username,
      workflow.user.verified ? 1 : 0,
      JSON.stringify(nodeTypes),
      JSON.stringify(detail.workflow),
      JSON.stringify(categories),
      workflow.totalViews || 0,
      workflow.createdAt,
      workflow.createdAt, // Using createdAt as updatedAt since API doesn't provide updatedAt
      url
    );
  }
  
  /**
   * Get templates that use specific node types
   */
  getTemplatesByNodes(nodeTypes: string[], limit: number = 10): StoredTemplate[] {
    // Build query for multiple node types
    const conditions = nodeTypes.map(() => "nodes_used LIKE ?").join(" OR ");
    const query = `
      SELECT * FROM templates 
      WHERE ${conditions}
      ORDER BY views DESC, created_at DESC
      LIMIT ?
    `;
    
    const params = [...nodeTypes.map(n => `%"${n}"%`), limit];
    return this.db.prepare(query).all(...params) as StoredTemplate[];
  }
  
  /**
   * Get a specific template by ID
   */
  getTemplate(templateId: number): StoredTemplate | null {
    const row = this.db.prepare(`
      SELECT * FROM templates WHERE id = ?
    `).get(templateId) as StoredTemplate | undefined;
    
    return row || null;
  }
  
  /**
   * Search templates by name or description
   */
  searchTemplates(query: string, limit: number = 20): StoredTemplate[] {
    // Use FTS for search
    const ftsQuery = query.split(' ').map(term => `"${term}"`).join(' OR ');
    
    return this.db.prepare(`
      SELECT t.* FROM templates t
      JOIN templates_fts ON t.id = templates_fts.rowid
      WHERE templates_fts MATCH ?
      ORDER BY rank, t.views DESC
      LIMIT ?
    `).all(ftsQuery, limit) as StoredTemplate[];
  }
  
  /**
   * Get templates for a specific task/use case
   */
  getTemplatesForTask(task: string): StoredTemplate[] {
    // Map tasks to relevant node combinations
    const taskNodeMap: Record<string, string[]> = {
      'ai_automation': ['@n8n/n8n-nodes-langchain.openAi', '@n8n/n8n-nodes-langchain.agent', 'n8n-nodes-base.openAi'],
      'data_sync': ['n8n-nodes-base.googleSheets', 'n8n-nodes-base.postgres', 'n8n-nodes-base.mysql'],
      'webhook_processing': ['n8n-nodes-base.webhook', 'n8n-nodes-base.httpRequest'],
      'email_automation': ['n8n-nodes-base.gmail', 'n8n-nodes-base.emailSend', 'n8n-nodes-base.emailReadImap'],
      'slack_integration': ['n8n-nodes-base.slack', 'n8n-nodes-base.slackTrigger'],
      'data_transformation': ['n8n-nodes-base.code', 'n8n-nodes-base.set', 'n8n-nodes-base.merge'],
      'file_processing': ['n8n-nodes-base.readBinaryFile', 'n8n-nodes-base.writeBinaryFile', 'n8n-nodes-base.googleDrive'],
      'scheduling': ['n8n-nodes-base.scheduleTrigger', 'n8n-nodes-base.cron'],
      'api_integration': ['n8n-nodes-base.httpRequest', 'n8n-nodes-base.graphql'],
      'database_operations': ['n8n-nodes-base.postgres', 'n8n-nodes-base.mysql', 'n8n-nodes-base.mongodb']
    };
    
    const nodes = taskNodeMap[task];
    if (!nodes) {
      return [];
    }
    
    return this.getTemplatesByNodes(nodes, 10);
  }
  
  /**
   * Get all templates with limit
   */
  getAllTemplates(limit: number = 10): StoredTemplate[] {
    return this.db.prepare(`
      SELECT * FROM templates 
      ORDER BY views DESC, created_at DESC
      LIMIT ?
    `).all(limit) as StoredTemplate[];
  }
  
  /**
   * Get total template count
   */
  getTemplateCount(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number };
    return result.count;
  }
  
  /**
   * Get template statistics
   */
  getTemplateStats(): Record<string, any> {
    const count = this.getTemplateCount();
    const avgViews = this.db.prepare('SELECT AVG(views) as avg FROM templates').get() as { avg: number };
    const topNodes = this.db.prepare(`
      SELECT nodes_used FROM templates 
      ORDER BY views DESC 
      LIMIT 100
    `).all() as { nodes_used: string }[];
    
    // Count node usage
    const nodeCount: Record<string, number> = {};
    topNodes.forEach(t => {
      const nodes = JSON.parse(t.nodes_used);
      nodes.forEach((n: string) => {
        nodeCount[n] = (nodeCount[n] || 0) + 1;
      });
    });
    
    // Get top 10 most used nodes
    const topUsedNodes = Object.entries(nodeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([node, count]) => ({ node, count }));
    
    return {
      totalTemplates: count,
      averageViews: Math.round(avgViews.avg || 0),
      topUsedNodes
    };
  }
  
  /**
   * Clear all templates (for testing or refresh)
   */
  clearTemplates(): void {
    this.db.exec('DELETE FROM templates');
    logger.info('Cleared all templates from database');
  }
}