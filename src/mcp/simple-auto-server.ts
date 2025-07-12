import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync } from 'fs';

// Import existing tools and handlers
import { n8nDocumentationToolsFinal } from './tools';
import { n8nManagementTools } from './tools-n8n-manager';
import * as n8nHandlers from './handlers-n8n-manager';
import { handleUpdatePartialWorkflow } from './handlers-workflow-diff';

// Import services
import { logger } from '../utils/logger';
import { NodeRepository } from '../database/node-repository';
import { createDatabaseAdapter } from '../database/database-adapter';
import { SimpleAutoUpdateService } from '../services/simple-auto-update';
import { PropertyFilter } from '../services/property-filter';
import { ExampleGenerator } from '../services/example-generator';
import { TaskTemplates } from '../services/task-templates';
import { isN8nApiConfigured } from '../config/n8n-api';
import { PROJECT_VERSION } from '../utils/version';

/**
 * Simple Auto-Updating MCP Server for AI Agents
 * 
 * Just works, every time:
 * - Auto-updates from GitHub every 15 minutes
 * - Always falls back to local nodes if GitHub fails
 * - Never breaks - AI agents always get working nodes
 * - Zero configuration complexity
 * - One-shot reliability guaranteed
 */
export class SimpleAutoMCPServer {
  private server: Server;
  private repository!: NodeRepository;
  private autoUpdateService!: SimpleAutoUpdateService;
  private propertyFilter!: PropertyFilter;
  private exampleGenerator!: ExampleGenerator;
  private taskTemplates!: TaskTemplates;
  private isInitialized = false;

  constructor() {
    this.server = new Server({
      name: 'n8n-mcp-simple-auto',
      version: PROJECT_VERSION,
    }, {
      capabilities: {
        tools: {}
      }
    });
  }

  /**
   * Initialize the simple auto-updating MCP server
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      logger.info('[Simple Auto MCP] Initializing server...');

      // Initialize database
      const db = await createDatabaseAdapter('./data/nodes.db');
      this.repository = new NodeRepository(db);

      // Initialize services
      this.propertyFilter = new PropertyFilter();
      this.exampleGenerator = new ExampleGenerator();
      this.taskTemplates = new TaskTemplates();

      // Initialize auto-update service
      this.autoUpdateService = new SimpleAutoUpdateService(
        {
          enabled: !!process.env.GITHUB_TOKEN,
          checkIntervalMinutes: parseInt(process.env.UPDATE_INTERVAL_MINUTES || '15'),
          maxUpdateTimeMs: 60000,
          githubToken: process.env.GITHUB_TOKEN
        },
        this.repository
      );

      // Setup MCP handlers
      this.setupMCPHandlers();

      this.isInitialized = true;
      logger.info('[Simple Auto MCP] Server initialized successfully');

    } catch (error) {
      logger.error('[Simple Auto MCP] Initialization failed', error);
      throw new Error(`Failed to initialize simple auto MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Setup MCP protocol handlers
   */
  private setupMCPHandlers(): void {
    // Initialize request handler
    this.server.setRequestHandler(InitializeRequestSchema, async () => ({
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'n8n-mcp-simple-auto',
        version: PROJECT_VERSION,
      }
    }));

    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        ...n8nDocumentationToolsFinal
      ];

      // Add n8n management tools if configured
      if (isN8nApiConfigured()) {
        tools.push(...n8nManagementTools);
      }

      // Add simple auto-update tools
      tools.push(
        {
          name: 'get_auto_update_status',
          description: 'Get the status of auto-updates from GitHub (simple)',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'force_update',
          description: 'Force immediate update from GitHub',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'health_check',
          description: 'Check if the auto-update system is working',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      );

      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Handle auto-update tools
        switch (name) {
          case 'get_auto_update_status':
            const status = this.autoUpdateService.getStatus();
            const stats = this.autoUpdateService.getStats();
            
            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  enabled: stats.enabled,
                  isUpdating: status.isUpdating,
                  lastUpdate: status.lastUpdate,
                  lastCheck: status.lastCheck,
                  nodeCount: status.nodeCount,
                  success: status.updateSuccess,
                  errors: status.errors.slice(-3), // Last 3 errors only
                  githubAvailable: !!process.env.GITHUB_TOKEN
                }, null, 2)
              }]
            };

          case 'force_update':
            logger.info('[Simple Auto MCP] Force update requested by AI agent');
            const updateSuccess = await this.autoUpdateService.forceUpdate();
            
            return {
              content: [{
                type: 'text',
                text: updateSuccess 
                  ? 'Update completed successfully. Latest nodes are now available.'
                  : 'Update failed, but existing nodes are still available.'
              }]
            };

          case 'health_check':
            const health = await this.autoUpdateService.healthCheck();
            
            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  status: health.status,
                  message: health.message,
                  autoUpdateWorking: health.autoUpdateWorking,
                  nodeCount: health.nodeCount,
                  recommendation: this.getHealthRecommendation(health.status)
                }, null, 2)
              }]
            };
        }

        // Handle n8n management tools
        if (isN8nApiConfigured() && n8nManagementTools.some(tool => tool.name === name)) {
          switch (name) {
            case 'n8n_update_partial_workflow':
              return await handleUpdatePartialWorkflow(args);
            default:
              return await this.handleN8nManagementTool(name, args);
          }
        }

        // Handle standard documentation tools
        return await this.handleDocumentationTool(name, args);

      } catch (error) {
        logger.error(`[Simple Auto MCP] Error handling tool ${name}`, error);
        return {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    });
  }

  /**
   * Handle n8n management tools
   */
  private async handleN8nManagementTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'n8n_create_workflow':
        return await n8nHandlers.handleCreateWorkflow(args);
      case 'n8n_get_workflow':
        return await n8nHandlers.handleGetWorkflow(args);
      case 'n8n_update_full_workflow':
        return await n8nHandlers.handleUpdateWorkflow(args);
      case 'n8n_list_workflows':
        return await n8nHandlers.handleListWorkflows(args);
      case 'n8n_health_check':
        return await n8nHandlers.handleHealthCheck();
      // Add other handlers as needed
      default:
        throw new Error(`Unknown n8n management tool: ${name}`);
    }
  }

  /**
   * Handle documentation tools with auto-update awareness
   */
  private async handleDocumentationTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'list_nodes':
        const category = args?.category;
        const isAITool = args?.isAITool;
        const limit = Math.min(args?.limit || 50, 100);

        const nodes = this.repository.listNodes({ category, isAITool });
        const limitedNodes = nodes.slice(0, limit);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              nodes: limitedNodes,
              total: nodes.length,
              limited: nodes.length > limit,
              autoUpdateStatus: this.autoUpdateService.getStats().enabled ? 'enabled' : 'disabled'
            }, null, 2)
          }]
        };

      case 'get_node_info':
        const nodeType = args?.nodeType;
        if (!nodeType) {
          throw new Error('nodeType is required');
        }

        const node = this.repository.getNodeInfo ? this.repository.getNodeInfo(nodeType) : this.repository.getNode(nodeType);
        if (!node) {
          throw new Error(`Node not found: ${nodeType}`);
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(node, null, 2)
          }]
        };

      case 'get_node_essentials':
        const essentialNodeType = args?.nodeType;
        if (!essentialNodeType) {
          throw new Error('nodeType is required');
        }

        const essentialNode = this.repository.getNodeInfo ? this.repository.getNodeInfo(essentialNodeType) : this.repository.getNode(essentialNodeType);
        if (!essentialNode) {
          throw new Error(`Node not found: ${essentialNodeType}`);
        }

        const essentials = PropertyFilter.getEssentialProperties(essentialNode.properties || [], essentialNodeType);
        const examples = ExampleGenerator.getExamples(essentialNodeType, essentials);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              nodeType: essentialNode.nodeType,
              displayName: essentialNode.displayName,
              description: essentialNode.description,
              category: essentialNode.category,
              isAITool: essentialNode.isAITool,
              essentialProperties: essentials,
              examples: examples,
              totalProperties: (essentialNode.properties || []).length,
              showingEssentials: (essentials.required?.length || 0) + (essentials.common?.length || 0)
            }, null, 2)
          }]
        };

      case 'search_nodes':
        const query = args?.query;
        if (!query) {
          throw new Error('query is required');
        }

        const searchOptions = {
          category: args?.category,
          isAITool: args?.isAITool
        };

        const results = this.repository.searchNodes(query, searchOptions);
        const searchLimit = Math.min(args?.limit || 20, 50);
        const limitedResults = results.slice(0, searchLimit);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              query,
              results: limitedResults,
              total: results.length,
              limited: results.length > searchLimit
            }, null, 2)
          }]
        };

      case 'get_database_statistics':
        const dbStats = this.repository.getDatabaseStatistics();
        const updateStats = this.autoUpdateService.getStats();
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              ...dbStats,
              autoUpdate: {
                enabled: updateStats.enabled,
                lastUpdate: updateStats.lastUpdate,
                nodeCount: updateStats.nodeCount,
                isWorking: updateStats.isWorking
              }
            }, null, 2)
          }]
        };

      default:
        throw new Error(`Unknown documentation tool: ${name}`);
    }
  }

  /**
   * Get health recommendation for AI agents
   */
  private getHealthRecommendation(status: string): string {
    switch (status) {
      case 'healthy':
        return 'System is working perfectly. All n8n nodes are available and up-to-date.';
      case 'degraded':
        return 'System is working but auto-updates may be failing. Nodes are still available from local cache.';
      case 'error':
        return 'System has issues but should still provide basic n8n nodes. Check configuration if problems persist.';
      default:
        return 'Unknown status. System should still provide basic functionality.';
    }
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('[Simple Auto MCP] Server started with simple auto-update', {
      autoUpdateEnabled: !!process.env.GITHUB_TOKEN,
      n8nApiEnabled: isN8nApiConfigured(),
      updateInterval: process.env.UPDATE_INTERVAL_MINUTES || '15'
    });
  }

  /**
   * Stop the MCP server and cleanup
   */
  async stop(): Promise<void> {
    logger.info('[Simple Auto MCP] Stopping server...');

    if (this.autoUpdateService) {
      this.autoUpdateService.stop();
    }

    logger.info('[Simple Auto MCP] Server stopped');
  }
}

// Export server factory
export function createSimpleAutoMCPServer(): SimpleAutoMCPServer {
  return new SimpleAutoMCPServer();
}