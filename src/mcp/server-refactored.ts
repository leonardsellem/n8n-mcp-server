import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { n8nDocumentationToolsFinal } from './tools';
import { n8nManagementTools } from './tools-n8n-manager';
import { browserTools, handleBrowserTool } from './browser-tools';
import { visualVerificationTools, handleVisualVerificationTool } from './tools-visual-verification';
import { logger } from '../utils/logger';
import { NodeRepository } from '../database/node-repository';
import { DatabaseAdapter, createDatabaseAdapter } from '../database/database-adapter';
import { SimpleCache } from '../utils/simple-cache';
import { TemplateService } from '../templates/template-service';
import { ConfigService } from '../services/config-service';
import { HandlerRegistry } from './handlers/handler-registry';
import * as n8nHandlers from './handlers-n8n-manager';
import { handleUpdatePartialWorkflow } from './handlers-workflow-diff';
import { PROJECT_VERSION } from '../utils/version';

export class N8NDocumentationMCPServerRefactored {
  private server: Server;
  private db: DatabaseAdapter | null = null;
  private repository: NodeRepository | null = null;
  private templateService: TemplateService | null = null;
  private handlerRegistry: HandlerRegistry | null = null;
  private initialized: Promise<void>;
  private cache: SimpleCache;
  private config: ConfigService;

  constructor() {
    this.config = ConfigService.getInstance();
    this.cache = new SimpleCache(this.config.getCacheConfig());
    this.initialized = this.initializeServices();
    
    logger.info('Initializing n8n Documentation MCP server (refactored)');
    this.config.logConfiguration();
    
    // Validate configuration
    const validation = this.config.validateConfiguration();
    if (!validation.valid) {
      logger.error('Configuration validation failed:', validation.errors);
      throw new Error(`Configuration errors: ${validation.errors.join(', ')}`);
    }

    this.server = new Server(
      {
        name: this.config.getConfig().server.name,
        version: this.config.getConfig().server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }
  
  private async initializeServices(): Promise<void> {
    try {
      const dbPath = this.config.getDatabasePath();
      this.db = await createDatabaseAdapter(dbPath);
      this.repository = new NodeRepository(this.db);
      this.templateService = new TemplateService(this.db);
      this.handlerRegistry = new HandlerRegistry(
        this.repository,
        this.templateService,
        this.cache
      );
      
      logger.info(`Initialized services from database: ${dbPath}`);
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      throw new Error(`Failed to initialize services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async ensureInitialized(): Promise<void> {
    await this.initialized;
    if (!this.db || !this.repository || !this.handlerRegistry) {
      throw new Error('Services not initialized');
    }
  }

  private setupHandlers(): void {
    // Handle initialization
    this.server.setRequestHandler(InitializeRequestSchema, async () => {
      const response = {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: this.config.getConfig().server.name,
          version: PROJECT_VERSION,
        },
      };
      
      if (this.config.getConfig().logging.debug) {
        logger.debug('Initialize handler called', { response });
      }
      
      return response;
    });

    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [...n8nDocumentationToolsFinal];
      
      // Add optional tools based on feature flags
      if (this.config.isFeatureEnabled('browserTools')) {
        tools.push(...browserTools);
      }
      
      if (this.config.isFeatureEnabled('visualVerification')) {
        tools.push(...visualVerificationTools);
      }
      
      if (this.config.isFeatureEnabled('managementTools')) {
        tools.push(...n8nManagementTools);
      }
      
      logger.debug(`Tool listing: ${tools.length} tools available`, {
        documentation: n8nDocumentationToolsFinal.length,
        browser: this.config.isFeatureEnabled('browserTools') ? browserTools.length : 0,
        visual: this.config.isFeatureEnabled('visualVerification') ? visualVerificationTools.length : 0,
        management: this.config.isFeatureEnabled('managementTools') ? n8nManagementTools.length : 0
      });
      
      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        logger.debug(`Executing tool: ${name}`, { args });
        const result = await this.executeTool(name, args);
        logger.debug(`Tool ${name} executed successfully`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error executing tool ${name}`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async executeTool(name: string, args: any): Promise<any> {
    await this.ensureInitialized();
    
    // Use handler registry for core tools
    try {
      return await this.handlerRegistry!.executeTool(name, args);
    } catch (error) {
      // If handler registry doesn't handle it, try other handlers
      if (error instanceof Error && error.message.includes('Unknown tool')) {
        return await this.executeSpecializedTool(name, args);
      }
      throw error;
    }
  }

  private async executeSpecializedTool(name: string, args: any): Promise<any> {
    // n8n Management Tools (if configured)
    if (this.config.isFeatureEnabled('managementTools')) {
      const managementTools = [
        'n8n_create_workflow',
        'n8n_get_workflow',
        'n8n_get_workflow_details',
        'n8n_get_workflow_structure',
        'n8n_get_workflow_minimal',
        'n8n_update_full_workflow',
        'n8n_update_partial_workflow',
        'n8n_delete_workflow',
        'n8n_list_workflows',
        'n8n_validate_workflow',
        'n8n_trigger_webhook_workflow',
        'n8n_get_execution',
        'n8n_list_executions',
        'n8n_delete_execution',
        'n8n_health_check',
        'n8n_list_available_tools',
        'n8n_diagnostic'
      ];
      
      if (managementTools.includes(name)) {
        return await this.executeN8nManagementTool(name, args);
      }
    }
    
    // Browser tools (if enabled)
    if (this.config.isFeatureEnabled('browserTools')) {
      const browserToolNames = [
        'browser_create_session',
        'browser_navigate',
        'browser_take_screenshot',
        'browser_click',
        'browser_type',
        'browser_fill',
        'browser_wait',
        'browser_get_text',
        'browser_get_attribute',
        'browser_evaluate',
        'browser_login',
        'browser_store_credentials',
        'browser_save_session',
        'browser_restore_session',
        'browser_close_session',
        'browser_list_sessions',
        'browser_get_page_info',
        'browser_hover',
        'browser_select_option',
        'browser_upload_file',
        'browser_get_cookies'
      ];
      
      if (browserToolNames.includes(name)) {
        return await handleBrowserTool(name, args);
      }
    }
    
    // Visual verification tools (if enabled)
    if (this.config.isFeatureEnabled('visualVerification')) {
      const visualToolNames = [
        'visual_verify_workflow',
        'visual_take_screenshot',
        'visual_compare_screenshots',
        'visual_verify_element',
        'visual_verify_text',
        'visual_extract_text',
        'visual_detect_changes'
      ];
      
      if (visualToolNames.includes(name)) {
        return await handleVisualVerificationTool(name, args);
      }
    }
    
    throw new Error(`Unknown tool: ${name}`);
  }

  private async executeN8nManagementTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'n8n_create_workflow':
        return n8nHandlers.handleCreateWorkflow(args);
      case 'n8n_get_workflow':
        return n8nHandlers.handleGetWorkflow(args);
      case 'n8n_get_workflow_details':
        return n8nHandlers.handleGetWorkflowDetails(args);
      case 'n8n_get_workflow_structure':
        return n8nHandlers.handleGetWorkflowStructure(args);
      case 'n8n_get_workflow_minimal':
        return n8nHandlers.handleGetWorkflowMinimal(args);
      case 'n8n_update_full_workflow':
        return n8nHandlers.handleUpdateWorkflow(args);
      case 'n8n_update_partial_workflow':
        return handleUpdatePartialWorkflow(args);
      case 'n8n_delete_workflow':
        return n8nHandlers.handleDeleteWorkflow(args);
      case 'n8n_list_workflows':
        return n8nHandlers.handleListWorkflows(args);
      case 'n8n_validate_workflow':
        if (!this.repository) throw new Error('Repository not initialized');
        return n8nHandlers.handleValidateWorkflow(args, this.repository);
      case 'n8n_trigger_webhook_workflow':
        return n8nHandlers.handleTriggerWebhookWorkflow(args);
      case 'n8n_get_execution':
        return n8nHandlers.handleGetExecution(args);
      case 'n8n_list_executions':
        return n8nHandlers.handleListExecutions(args);
      case 'n8n_delete_execution':
        return n8nHandlers.handleDeleteExecution(args);
      case 'n8n_health_check':
        return n8nHandlers.handleHealthCheck();
      case 'n8n_list_available_tools':
        return n8nHandlers.handleListAvailableTools();
      case 'n8n_diagnostic':
        return n8nHandlers.handleDiagnostic({ params: { arguments: args } });
      default:
        throw new Error(`Unknown n8n management tool: ${name}`);
    }
  }

  async run(): Promise<void> {
    await this.ensureInitialized();
    
    if (this.config.getServerMode() === 'stdio') {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      logger.info('n8n Documentation MCP server running on stdio');
    } else {
      throw new Error('HTTP mode not supported in refactored server yet');
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
    logger.info('n8n Documentation MCP server closed');
  }
}