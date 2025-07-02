import { DatabaseAdapter } from '../database/database-adapter';
import { TemplateRepository, StoredTemplate } from './template-repository';
import { logger } from '../utils/logger';

export interface TemplateInfo {
  id: number;
  name: string;
  description: string;
  author: {
    name: string;
    username: string;
    verified: boolean;
  };
  nodes: string[];
  views: number;
  created: string;
  url: string;
}

export interface TemplateWithWorkflow extends TemplateInfo {
  workflow: any;
}

export class TemplateService {
  private repository: TemplateRepository;
  
  constructor(db: DatabaseAdapter) {
    this.repository = new TemplateRepository(db);
  }
  
  /**
   * List templates that use specific node types
   */
  async listNodeTemplates(nodeTypes: string[], limit: number = 10): Promise<TemplateInfo[]> {
    const templates = this.repository.getTemplatesByNodes(nodeTypes, limit);
    return templates.map(this.formatTemplateInfo);
  }
  
  /**
   * Get a specific template with full workflow
   */
  async getTemplate(templateId: number): Promise<TemplateWithWorkflow | null> {
    const template = this.repository.getTemplate(templateId);
    if (!template) {
      return null;
    }
    
    return {
      ...this.formatTemplateInfo(template),
      workflow: JSON.parse(template.workflow_json)
    };
  }
  
  /**
   * Search templates by query
   */
  async searchTemplates(query: string, limit: number = 20): Promise<TemplateInfo[]> {
    const templates = this.repository.searchTemplates(query, limit);
    return templates.map(this.formatTemplateInfo);
  }
  
  /**
   * Get templates for a specific task
   */
  async getTemplatesForTask(task: string): Promise<TemplateInfo[]> {
    const templates = this.repository.getTemplatesForTask(task);
    return templates.map(this.formatTemplateInfo);
  }
  
  /**
   * List available tasks
   */
  listAvailableTasks(): string[] {
    return [
      'ai_automation',
      'data_sync',
      'webhook_processing',
      'email_automation',
      'slack_integration',
      'data_transformation',
      'file_processing',
      'scheduling',
      'api_integration',
      'database_operations'
    ];
  }
  
  /**
   * Get template statistics
   */
  async getTemplateStats(): Promise<Record<string, any>> {
    return this.repository.getTemplateStats();
  }
  
  /**
   * Fetch and update templates from n8n.io
   */
  async fetchAndUpdateTemplates(
    progressCallback?: (message: string, current: number, total: number) => void
  ): Promise<void> {
    try {
      // Dynamically import fetcher only when needed (requires axios)
      const { TemplateFetcher } = await import('./template-fetcher');
      const fetcher = new TemplateFetcher();
      
      // Clear existing templates
      this.repository.clearTemplates();
      
      // Fetch template list
      logger.info('Fetching template list from n8n.io');
      const templates = await fetcher.fetchTemplates((current, total) => {
        progressCallback?.('Fetching template list', current, total);
      });
      
      logger.info(`Found ${templates.length} templates from last year`);
      
      // Fetch details for each template
      logger.info('Fetching template details');
      const details = await fetcher.fetchAllTemplateDetails(templates, (current, total) => {
        progressCallback?.('Fetching template details', current, total);
      });
      
      // Save to database
      logger.info('Saving templates to database');
      let saved = 0;
      for (const template of templates) {
        const detail = details.get(template.id);
        if (detail) {
          this.repository.saveTemplate(template, detail);
          saved++;
        }
      }
      
      logger.info(`Successfully saved ${saved} templates to database`);
      progressCallback?.('Complete', saved, saved);
    } catch (error) {
      logger.error('Error fetching templates:', error);
      throw error;
    }
  }
  
  /**
   * Format stored template for API response
   */
  private formatTemplateInfo(template: StoredTemplate): TemplateInfo {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      author: {
        name: template.author_name,
        username: template.author_username,
        verified: template.author_verified === 1
      },
      nodes: JSON.parse(template.nodes_used),
      views: template.views,
      created: template.created_at,
      url: template.url
    };
  }
}