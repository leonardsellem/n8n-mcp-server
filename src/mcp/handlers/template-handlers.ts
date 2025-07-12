import { TemplateService } from '../../templates/template-service';
import { SimpleCache } from '../../utils/simple-cache';
import { logger } from '../../utils/logger';

export class TemplateHandlers {
  constructor(
    private templateService: TemplateService,
    private cache: SimpleCache
  ) {}

  async listNodeTemplates(nodeTypes?: string[], limit?: number): Promise<any> {
    const cacheKey = `node-templates-${JSON.stringify(nodeTypes)}-${limit || 50}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const templates = await this.templateService.getTemplatesForNodes(nodeTypes || [], limit);
    
    this.cache.set(cacheKey, templates);
    return templates;
  }

  async getTemplate(templateId: string): Promise<any> {
    const cacheKey = `template-${templateId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const template = await this.templateService.getTemplate(parseInt(templateId));
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    this.cache.set(cacheKey, template);
    return template;
  }

  async searchTemplates(query: string, limit?: number): Promise<any> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    const cacheKey = `search-templates-${query}-${limit || 20}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const templates = await this.templateService.searchTemplates(query, limit);
    
    this.cache.set(cacheKey, templates);
    return templates;
  }

  async getTemplatesForTask(task: string): Promise<any> {
    const cacheKey = `templates-for-task-${task}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const templates = await this.templateService.getTemplatesForTask(task);
    
    this.cache.set(cacheKey, templates);
    return templates;
  }

  async getTemplatesByCategory(category: string, limit?: number): Promise<any> {
    const cacheKey = `templates-category-${category}-${limit || 20}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const templates = await this.templateService.getTemplatesByCategory(category, limit);
    
    this.cache.set(cacheKey, templates);
    return templates;
  }

  async getPopularTemplates(limit?: number): Promise<any> {
    const cacheKey = `popular-templates-${limit || 10}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const templates = await this.templateService.getPopularTemplates(limit);
    
    this.cache.set(cacheKey, templates);
    return templates;
  }

  async getTemplateStats(): Promise<any> {
    const cacheKey = 'template-stats';
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const stats = await this.templateService.getTemplateStatistics();
    
    this.cache.set(cacheKey, stats);
    return stats;
  }
}