import { NodeRepository } from '../../database/node-repository';
import { PropertyFilter } from '../../services/property-filter';
import { ExampleGenerator } from '../../services/example-generator';
import { TaskTemplates } from '../../services/task-templates';
import { PropertyDependencies } from '../../services/property-dependencies';
import { SimpleCache } from '../../utils/simple-cache';
import { logger } from '../../utils/logger';

export class DocumentationHandlers {
  constructor(
    private repository: NodeRepository,
    private cache: SimpleCache
  ) {}

  async getWorkflowGuide(topic?: string): Promise<any> {
    const guide = {
      title: "n8n Workflow Creation Guide",
      description: "A comprehensive guide for creating effective n8n workflows",
      sections: [
        {
          title: "Getting Started",
          content: "Use get_node_essentials() to explore nodes with minimal configuration overhead"
        },
        {
          title: "Node Discovery",
          content: "Use search_nodes() to find nodes by functionality or list_nodes() to browse categories"
        },
        {
          title: "Workflow Validation",
          content: "Always validate your workflows with validate_workflow() before deployment"
        },
        {
          title: "AI Tool Integration",
          content: "Use list_ai_tools() to discover AI-capable nodes for enhanced automation"
        }
      ]
    };

    if (topic) {
      guide.sections = guide.sections.filter(section => 
        section.title.toLowerCase().includes(topic.toLowerCase()) ||
        section.content.toLowerCase().includes(topic.toLowerCase())
      );
    }

    return guide;
  }

  async getNodeInfo(nodeType: string): Promise<any> {
    const cacheKey = `node-info-${nodeType}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }

    this.cache.set(cacheKey, nodeInfo);
    return nodeInfo;
  }

  async getNodeEssentials(nodeType: string): Promise<any> {
    const cacheKey = `node-essentials-${nodeType}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }

    const essentials = PropertyFilter.getEssentialProperties(nodeInfo.properties || [], nodeType);
    
    this.cache.set(cacheKey, essentials);
    return essentials;
  }

  async getNodeDocumentation(nodeType: string): Promise<any> {
    const cacheKey = `node-docs-${nodeType}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const docs = await this.repository.getNodeDocumentation(nodeType);
    if (!docs) {
      throw new Error(`Documentation for node type ${nodeType} not found`);
    }

    this.cache.set(cacheKey, docs);
    return docs;
  }

  async getNodeAsToolInfo(nodeType: string): Promise<any> {
    const cacheKey = `node-tool-info-${nodeType}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }

    // Filter for AI tool specific information
    const toolInfo = {
      nodeType,
      displayName: nodeInfo.displayName,
      description: nodeInfo.description,
      isAiTool: nodeInfo.isAiTool,
      aiCapabilities: nodeInfo.aiToolCapabilities || [],
      usageGuidance: nodeInfo.usageGuidance || "No specific usage guidance available",
      requiredCredentials: nodeInfo.credentialsRequired || [],
      commonParameters: nodeInfo.commonParameters || {},
      examples: nodeInfo.examples || []
    };

    this.cache.set(cacheKey, toolInfo);
    return toolInfo;
  }

  async getNodeForTask(task: string): Promise<any> {
    const cacheKey = `node-for-task-${task}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const taskTemplates = new TaskTemplates();
    const template = taskTemplates.getTaskTemplate(task);
    
    if (!template) {
      throw new Error(`Task template for '${task}' not found`);
    }

    this.cache.set(cacheKey, template);
    return template;
  }

  async getPropertyDependencies(nodeType: string, config: any): Promise<any> {
    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }
    return PropertyDependencies.analyzeDependencies(nodeInfo.properties || []);
  }

  async getDatabaseStatistics(): Promise<any> {
    const stats = await this.repository.getDatabaseStatistics();
    return {
      ...stats,
      lastUpdated: new Date().toISOString(),
      cacheSize: this.cache.size(),
      cacheHitRate: this.cache.getHitRate()
    };
  }
}