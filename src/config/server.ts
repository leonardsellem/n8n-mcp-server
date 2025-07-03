/**
 * MCP Server Configuration
 * Simplified server setup without complex tool dependencies
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { loadEnvironmentVariables, getEnvConfig } from './environment.js';
import { EnhancedRemoteNodeDiscovery } from '../loaders/enhanced-remote-node-discovery.js';

// Load environment variables early
loadEnvironmentVariables();

class MCPServer {
  private server: Server;
  private config: ReturnType<typeof getEnvConfig>;
  private nodeDiscovery: EnhancedRemoteNodeDiscovery;

  constructor() {
    this.server = new Server(
      {
        name: '@leonardsellem/n8n-mcp-server',
        version: '0.1.4',
      },
      {
        capabilities: {
          resources: {
            subscribe: false,
            listChanged: false,
          },
          tools: {},
        },
      }
    );
    
    this.config = getEnvConfig();
    this.nodeDiscovery = new EnhancedRemoteNodeDiscovery(this.config.githubToken);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_workflows',
            description: 'Retrieve a list of all workflows available in n8n',
            inputSchema: {
              type: 'object',
              properties: {
                active: {
                  type: 'boolean',
                  description: 'Optional filter to show only active or inactive workflows'
                }
              },
              required: []
            }
          },
          {
            name: 'get_workflow',
            description: 'Retrieve a specific workflow by ID',
            inputSchema: {
              type: 'object',
              properties: {
                workflowId: {
                  type: 'string',
                  description: 'ID of the workflow to retrieve'
                }
              },
              required: ['workflowId']
            }
          },
          {
            name: 'discover_nodes',
            description: 'Discover available n8n node types by category or search query (Live from GitHub)',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Filter by node category'
                },
                search: {
                  type: 'string',
                  description: 'Search query to find nodes by name or description'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 50)',
                  default: 50
                }
              },
              required: []
            }
          },
          {
            name: 'get_node_details',
            description: 'Get detailed information about a specific n8n node',
            inputSchema: {
              type: 'object',
              properties: {
                nodeName: {
                  type: 'string',
                  description: 'Name of the node to get details for'
                }
              },
              required: ['nodeName']
            }
          },
          {
            name: 'sync_nodes_from_github',
            description: 'Force refresh nodes from GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_cache_stats',
            description: 'Get statistics about the node cache',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'list_node_categories',
            description: 'List all available node categories',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_workflows':
            return await this.handleListWorkflows(args);
          case 'get_workflow':
            return await this.handleGetWorkflow(args);
          case 'discover_nodes':
            return await this.handleDiscoverNodes(args);
          case 'get_node_details':
            return await this.handleGetNodeDetails(args);
          case 'sync_nodes_from_github':
            return await this.handleSyncNodesFromGitHub(args);
          case 'get_cache_stats':
            return await this.handleGetCacheStats(args);
          case 'list_node_categories':
            return await this.handleListNodeCategories(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        console.error(`Error handling tool ${name}:`, error);
        throw error;
      }
    });

    // List resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'n8n://workflows',
            mimeType: 'application/json',
            name: 'n8n Workflows',
            description: 'List of all workflows in the n8n instance'
          },
          {
            uri: 'n8n://execution-stats',
            mimeType: 'application/json',
            name: 'n8n Execution Statistics',
            description: 'Summary statistics of workflow executions'
          }
        ]
      };
    });

    // List resource templates
    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
      return {
        resourceTemplates: [
          {
            uriTemplate: 'n8n://workflows/{id}',
            mimeType: 'application/json',
            name: 'n8n Workflow Details',
            description: 'Detailed information about a specific n8n workflow'
          },
          {
            uriTemplate: 'n8n://executions/{id}',
            mimeType: 'application/json',
            name: 'n8n Execution Details',
            description: 'Detailed information about a specific n8n workflow execution'
          }
        ]
      };
    });

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      
      if (uri === 'n8n://workflows') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                workflows: [],
                message: 'Workflow listing requires n8n API connection'
              }, null, 2)
            }
          ]
        };
      }

      if (uri === 'n8n://execution-stats') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                stats: {
                  totalExecutions: 0,
                  successRate: 0,
                  avgDuration: 0
                },
                message: 'Execution stats require n8n API connection'
              }, null, 2)
            }
          ]
        };
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${uri}`
      );
    });
  }

  private async handleListWorkflows(args: any) {
    try {
      const response = await fetch(`${this.config.n8nApiUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.config.n8nApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      let workflows = data.data || data;
      
      // Apply active filter if provided
      if (args?.active !== undefined) {
        workflows = workflows.filter((wf: any) => wf.active === args.active);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ workflows }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to list workflows: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleGetWorkflow(args: any) {
    if (!args?.workflowId) {
      throw new McpError(ErrorCode.InvalidParams, 'workflowId is required');
    }

    try {
      const response = await fetch(`${this.config.n8nApiUrl}/api/v1/workflows/${args.workflowId}`, {
        headers: {
          'X-N8N-API-KEY': this.config.n8nApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const workflow = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workflow, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleDiscoverNodes(args: any) {
    try {
      let nodes;

      // Use different discovery methods based on args
      if (args?.search) {
        nodes = await this.nodeDiscovery.searchNodes(args.search);
      } else if (args?.category) {
        nodes = await this.nodeDiscovery.getNodesByCategory(args.category);
      } else {
        nodes = await this.nodeDiscovery.discoverNodes();
      }

      // Apply limit
      const limit = args?.limit || 50;
      const filteredNodes = nodes.slice(0, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              nodes: filteredNodes,
              total: filteredNodes.length,
              searchTerm: args?.search,
              category: args?.category,
              source: 'GitHub n8n Repository',
              lastUpdated: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to discover nodes: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleGetNodeDetails(args: any) {
    if (!args?.nodeName) {
      throw new McpError(ErrorCode.InvalidParams, 'nodeName is required');
    }

    try {
      const node = await this.nodeDiscovery.getNodeDetails(args.nodeName);
      
      if (!node) {
        throw new McpError(ErrorCode.InvalidParams, `Node '${args.nodeName}' not found`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              node,
              source: 'GitHub n8n Repository',
              lastUpdated: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get node details: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleSyncNodesFromGitHub(args: any) {
    try {
      console.error('🔄 Starting GitHub node sync...');
      await this.nodeDiscovery.forceRefresh();
      const stats = await this.nodeDiscovery.getCacheStats();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: 'Successfully synced nodes from GitHub',
              stats,
              syncedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to sync nodes from GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleGetCacheStats(args: any) {
    try {
      const stats = await this.nodeDiscovery.getCacheStats();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              cacheStats: stats,
              retrievedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get cache stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleListNodeCategories(args: any) {
    try {
      const categories = await this.nodeDiscovery.getAvailableCategories();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              categories,
              total: categories.length,
              source: 'GitHub n8n Repository',
              lastUpdated: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to list node categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('n8n MCP Server running on stdio');
  }
}

export async function startServer(): Promise<void> {
  const server = new MCPServer();
  await server.start();
}

export default MCPServer;
