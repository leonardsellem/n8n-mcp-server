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
import { allNodes } from '../data/index.js';

// Load environment variables early
loadEnvironmentVariables();

class MCPServer {
  private server: Server;
  private config: ReturnType<typeof getEnvConfig>;

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
            description: 'Discover available n8n node types by category or search query',
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
      let filteredNodes = [...allNodes];

      // Apply search filter
      if (args?.search) {
        const searchTerm = args.search.toLowerCase();
        filteredNodes = filteredNodes.filter(node => 
          node.name.toLowerCase().includes(searchTerm) ||
          node.displayName?.toLowerCase().includes(searchTerm) ||
          node.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (args?.category) {
        filteredNodes = filteredNodes.filter(node => 
          node.category === args.category
        );
      }

      // Apply limit
      const limit = args?.limit || 50;
      filteredNodes = filteredNodes.slice(0, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              nodes: filteredNodes,
              total: filteredNodes.length,
              searchTerm: args?.search,
              category: args?.category
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
