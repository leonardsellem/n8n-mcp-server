import { NodeRepository } from '../../database/node-repository';
import { TemplateService } from '../../templates/template-service';
import { SimpleCache } from '../../utils/simple-cache';
import { DocumentationHandlers } from './documentation-handlers';
import { SearchHandlers } from './search-handlers';
import { ValidationHandlers } from './validation-handlers';
import { TemplateHandlers } from './template-handlers';
import { logger } from '../../utils/logger';

export class HandlerRegistry {
  private documentationHandlers: DocumentationHandlers;
  private searchHandlers: SearchHandlers;
  private validationHandlers: ValidationHandlers;
  private templateHandlers: TemplateHandlers;

  constructor(
    private repository: NodeRepository,
    private templateService: TemplateService,
    private cache: SimpleCache
  ) {
    this.documentationHandlers = new DocumentationHandlers(repository, cache);
    this.searchHandlers = new SearchHandlers(repository, cache);
    this.validationHandlers = new ValidationHandlers(repository, cache);
    this.templateHandlers = new TemplateHandlers(templateService, cache);
  }

  async executeDocumentationTool(name: string, args: any): Promise<any> {
    logger.debug(`Executing documentation tool: ${name}`, { args });
    
    switch (name) {
      case 'start_here_workflow_guide':
        return this.documentationHandlers.getWorkflowGuide(args.topic);
      case 'get_node_info':
        return this.documentationHandlers.getNodeInfo(args.nodeType);
      case 'get_node_essentials':
        return this.documentationHandlers.getNodeEssentials(args.nodeType);
      case 'get_node_documentation':
        return this.documentationHandlers.getNodeDocumentation(args.nodeType);
      case 'get_node_as_tool_info':
        return this.documentationHandlers.getNodeAsToolInfo(args.nodeType);
      case 'get_node_for_task':
        return this.documentationHandlers.getNodeForTask(args.task);
      case 'get_property_dependencies':
        return this.documentationHandlers.getPropertyDependencies(args.nodeType, args.config);
      case 'get_database_statistics':
        return this.documentationHandlers.getDatabaseStatistics();
      default:
        throw new Error(`Unknown documentation tool: ${name}`);
    }
  }

  async executeSearchTool(name: string, args: any): Promise<any> {
    logger.debug(`Executing search tool: ${name}`, { args });
    
    switch (name) {
      case 'list_nodes':
        return this.searchHandlers.listNodes(args);
      case 'search_nodes':
        return this.searchHandlers.searchNodes(args.query, args.limit);
      case 'search_node_properties':
        return this.searchHandlers.searchNodeProperties(args.nodeType, args.query, args.maxResults);
      case 'list_ai_tools':
        return this.searchHandlers.listAITools();
      case 'list_tasks':
        return this.searchHandlers.listTasks(args.category);
      default:
        throw new Error(`Unknown search tool: ${name}`);
    }
  }

  async executeValidationTool(name: string, args: any): Promise<any> {
    logger.debug(`Executing validation tool: ${name}`, { args });
    
    switch (name) {
      case 'validate_node_operation':
        return this.validationHandlers.validateNodeConfig(args.nodeType, args.config, 'operation', args.profile);
      case 'validate_node_minimal':
        return this.validationHandlers.validateNodeMinimal(args.nodeType, args.config);
      case 'validate_workflow':
        return this.validationHandlers.validateWorkflow(args.workflow, args.options);
      case 'validate_workflow_connections':
        return this.validationHandlers.validateWorkflowConnections(args.workflow);
      case 'validate_workflow_expressions':
        return this.validationHandlers.validateWorkflowExpressions(args.workflow);
      case 'validate_workflow_structure':
        return this.validationHandlers.validateWorkflowStructure(args.workflow);
      case 'validate_node_types':
        return this.validationHandlers.validateNodeTypes(args.workflow);
      default:
        throw new Error(`Unknown validation tool: ${name}`);
    }
  }

  async executeTemplateTool(name: string, args: any): Promise<any> {
    logger.debug(`Executing template tool: ${name}`, { args });
    
    switch (name) {
      case 'list_node_templates':
        return this.templateHandlers.listNodeTemplates(args.nodeTypes, args.limit);
      case 'get_template':
        return this.templateHandlers.getTemplate(args.templateId);
      case 'search_templates':
        return this.templateHandlers.searchTemplates(args.query, args.limit);
      case 'get_templates_for_task':
        return this.templateHandlers.getTemplatesForTask(args.task);
      case 'get_templates_by_category':
        return this.templateHandlers.getTemplatesByCategory(args.category, args.limit);
      case 'get_popular_templates':
        return this.templateHandlers.getPopularTemplates(args.limit);
      case 'get_template_stats':
        return this.templateHandlers.getTemplateStats();
      default:
        throw new Error(`Unknown template tool: ${name}`);
    }
  }

  async executeTool(name: string, args: any): Promise<any> {
    try {
      // Documentation tools
      if (this.isDocumentationTool(name)) {
        return await this.executeDocumentationTool(name, args);
      }
      
      // Search tools
      if (this.isSearchTool(name)) {
        return await this.executeSearchTool(name, args);
      }
      
      // Validation tools
      if (this.isValidationTool(name)) {
        return await this.executeValidationTool(name, args);
      }
      
      // Template tools
      if (this.isTemplateTool(name)) {
        return await this.executeTemplateTool(name, args);
      }
      
      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      throw error;
    }
  }

  private isDocumentationTool(name: string): boolean {
    return [
      'start_here_workflow_guide',
      'get_node_info',
      'get_node_essentials',
      'get_node_documentation',
      'get_node_as_tool_info',
      'get_node_for_task',
      'get_property_dependencies',
      'get_database_statistics'
    ].includes(name);
  }

  private isSearchTool(name: string): boolean {
    return [
      'list_nodes',
      'search_nodes',
      'search_node_properties',
      'list_ai_tools',
      'list_tasks'
    ].includes(name);
  }

  private isValidationTool(name: string): boolean {
    return [
      'validate_node_operation',
      'validate_node_minimal',
      'validate_workflow',
      'validate_workflow_connections',
      'validate_workflow_expressions',
      'validate_workflow_structure',
      'validate_node_types'
    ].includes(name);
  }

  private isTemplateTool(name: string): boolean {
    return [
      'list_node_templates',
      'get_template',
      'search_templates',
      'get_templates_for_task',
      'get_templates_by_category',
      'get_popular_templates',
      'get_template_stats'
    ].includes(name);
  }
}