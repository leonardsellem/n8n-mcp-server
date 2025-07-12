import { NodeRepository } from '../../database/node-repository';
import { SimpleCache } from '../../utils/simple-cache';
import { logger } from '../../utils/logger';

export class SearchHandlers {
  constructor(
    private repository: NodeRepository,
    private cache: SimpleCache
  ) {}

  async listNodes(args: any): Promise<any> {
    const { category, isAiTool, isTrigger, isWebhook, packageName, limit, offset } = args || {};
    
    const cacheKey = `list-nodes-${JSON.stringify(args)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const nodes = await this.repository.listNodes({
      category,
      isAiTool,
      isTrigger,
      isWebhook,
      packageName,
      limit,
      offset
    });

    this.cache.set(cacheKey, nodes);
    return nodes;
  }

  async searchNodes(query: string, limit?: number): Promise<any> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    const cacheKey = `search-nodes-${query}-${limit || 50}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const results = await this.repository.searchNodes(query, limit);
    
    this.cache.set(cacheKey, results);
    return results;
  }

  async searchNodeProperties(nodeType: string, query: string, maxResults?: number): Promise<any> {
    const cacheKey = `search-props-${nodeType}-${query}-${maxResults || 10}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }

    const properties = nodeInfo.propertiesSchema?.properties || {};
    const operations = nodeInfo.operations || [];
    
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Search in properties
    for (const [key, prop] of Object.entries(properties)) {
      const propData = prop as any;
      const displayName = propData.displayName || key;
      const description = propData.description || '';
      
      if (displayName.toLowerCase().includes(queryLower) || 
          description.toLowerCase().includes(queryLower) ||
          key.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'property',
          key,
          displayName,
          description,
          required: propData.required || false,
          propertyType: propData.type,
          default: propData.default,
          options: propData.options || []
        });
      }
    }

    // Search in operations
    for (const operation of operations) {
      const name = operation.name || '';
      const description = operation.description || '';
      
      if (name.toLowerCase().includes(queryLower) || 
          description.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'operation',
          name,
          description,
          properties: operation.properties || []
        });
      }
    }

    const limitedResults = results.slice(0, maxResults || 10);
    
    this.cache.set(cacheKey, limitedResults);
    return limitedResults;
  }

  async listAITools(): Promise<any> {
    const cacheKey = 'ai-tools-list';
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const aiTools = await this.repository.getAITools();
    
    this.cache.set(cacheKey, aiTools);
    return aiTools;
  }

  async listTasks(category?: string): Promise<any> {
    const cacheKey = `tasks-${category || 'all'}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // This would normally come from TaskTemplates service
    const tasks = [
      {
        task: 'send_http_request',
        description: 'Send HTTP requests to APIs',
        category: 'http',
        nodeType: 'n8n-nodes-base.httpRequest'
      },
      {
        task: 'webhook_trigger',
        description: 'Receive webhook data',
        category: 'trigger',
        nodeType: 'n8n-nodes-base.webhook'
      },
      {
        task: 'conditional_logic',
        description: 'Add conditional branching',
        category: 'logic',
        nodeType: 'n8n-nodes-base.if'
      },
      {
        task: 'transform_data',
        description: 'Transform and manipulate data',
        category: 'data',
        nodeType: 'n8n-nodes-base.code'
      }
    ];

    const filteredTasks = category 
      ? tasks.filter(task => task.category === category)
      : tasks;

    this.cache.set(cacheKey, filteredTasks);
    return filteredTasks;
  }
}