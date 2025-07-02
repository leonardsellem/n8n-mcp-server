import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

// Basic tool definitions for testing
const basicTools = [
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
];

export class N8NDocumentationMCPServer {
  private server: Server;

  constructor() {
    logger.info('Initializing n8n Documentation MCP server (Basic)');
    
    this.server = new Server(
      {
        name: 'n8n-documentation-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
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
          name: 'n8n-documentation-mcp',
          version: '1.0.0',
        },
      };
      
      logger.debug('Initialize handler called', { response });
      return response;
    });

    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug(`Tool listing: ${basicTools.length} tools available`);
      return { tools: basicTools };
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
    switch (name) {
      case 'list_workflows':
        return this.listWorkflows(args);
      case 'get_workflow':
        return this.getWorkflow(args);
      case 'discover_nodes':
        return this.discoverNodes(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async listWorkflows(args: any): Promise<any> {
    logger.info('Listing workflows', { args });
    return {
      workflows: [
        {
          id: '1',
          name: 'Sample Workflow',
          active: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      totalCount: 1,
      message: 'Basic MCP server - limited functionality for testing'
    };
  }

  private async getWorkflow(args: any): Promise<any> {
    logger.info('Getting workflow', { args });
    const { workflowId } = args;
    
    if (!workflowId) {
      throw new Error('workflowId is required');
    }

    return {
      id: workflowId,
      name: 'Sample Workflow',
      active: true,
      nodes: [
        {
          id: '1',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          position: [250, 300],
          parameters: {}
        }
      ],
      connections: {},
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      message: 'Basic MCP server - limited functionality for testing'
    };
  }

  private async discoverNodes(args: any): Promise<any> {
    logger.info('Discovering nodes', { args });
    const { category, search, limit = 50 } = args;
    
    // Basic mock nodes for testing
    const mockNodes = [
      {
        name: 'n8n-nodes-base.slack',
        displayName: 'Slack',
        description: 'Send messages and interact with Slack',
        category: 'Communication'
      },
      {
        name: 'n8n-nodes-base.googleSheets',
        displayName: 'Google Sheets',
        description: 'Read and write data to Google Sheets',
        category: 'Productivity'
      },
      {
        name: 'n8n-nodes-base.httpRequest',
        displayName: 'HTTP Request',
        description: 'Make HTTP requests to external APIs',
        category: 'Core'
      }
    ];

    let filteredNodes = mockNodes;

    // Apply category filter
    if (category) {
      filteredNodes = filteredNodes.filter(node => 
        node.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNodes = filteredNodes.filter(node =>
        node.name.toLowerCase().includes(searchLower) ||
        node.displayName.toLowerCase().includes(searchLower) ||
        node.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply limit
    filteredNodes = filteredNodes.slice(0, limit);

    return {
      nodes: filteredNodes,
      totalCount: filteredNodes.length,
      query: { category, search, limit },
      message: 'Basic MCP server - limited node discovery for testing'
    };
  }

  // Add connect method to accept any transport
  async connect(transport: any): Promise<void> {
    await this.server.connect(transport);
    logger.info('MCP Server connected', { 
      transportType: transport.constructor.name 
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('n8n Documentation MCP Server running on stdio transport (Basic mode)');
    
    // Keep the process alive and listening
    process.stdin.resume();
  }
}
