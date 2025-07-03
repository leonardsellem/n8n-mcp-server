import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { MCPClient } from '../utils/mcp-client';
import { N8NMCPBridge } from '../utils/bridge';

export class MCPNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MCP',
    name: 'mcp',
    icon: 'file:mcp.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with Model Context Protocol (MCP) servers',
    defaults: {
      name: 'MCP',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'mcpApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Call Tool',
            value: 'callTool',
            description: 'Execute an MCP tool',
          },
          {
            name: 'List Tools',
            value: 'listTools',
            description: 'List available MCP tools',
          },
          {
            name: 'Read Resource',
            value: 'readResource',
            description: 'Read an MCP resource',
          },
          {
            name: 'List Resources',
            value: 'listResources',
            description: 'List available MCP resources',
          },
          {
            name: 'Get Prompt',
            value: 'getPrompt',
            description: 'Get an MCP prompt',
          },
          {
            name: 'List Prompts',
            value: 'listPrompts',
            description: 'List available MCP prompts',
          },
        ],
        default: 'callTool',
      },
      // Tool-specific fields
      {
        displayName: 'Tool Name',
        name: 'toolName',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['callTool'],
          },
        },
        default: '',
        description: 'Name of the MCP tool to execute',
      },
      {
        displayName: 'Tool Arguments',
        name: 'toolArguments',
        type: 'json',
        required: false,
        displayOptions: {
          show: {
            operation: ['callTool'],
          },
        },
        default: '{}',
        description: 'Arguments to pass to the MCP tool',
      },
      // Resource-specific fields
      {
        displayName: 'Resource URI',
        name: 'resourceUri',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['readResource'],
          },
        },
        default: '',
        description: 'URI of the MCP resource to read',
      },
      // Prompt-specific fields
      {
        displayName: 'Prompt Name',
        name: 'promptName',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getPrompt'],
          },
        },
        default: '',
        description: 'Name of the MCP prompt to retrieve',
      },
      {
        displayName: 'Prompt Arguments',
        name: 'promptArguments',
        type: 'json',
        required: false,
        displayOptions: {
          show: {
            operation: ['getPrompt'],
          },
        },
        default: '{}',
        description: 'Arguments to pass to the MCP prompt',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    // Get credentials
    const credentials = await this.getCredentials('mcpApi');
    
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        let result: any;

        switch (operation) {
          case 'callTool':
            const toolName = this.getNodeParameter('toolName', itemIndex) as string;
            const toolArgumentsJson = this.getNodeParameter('toolArguments', itemIndex) as string;
            const toolArguments = JSON.parse(toolArgumentsJson);
            
            result = await (this as any).callMCPTool(credentials, toolName, toolArguments);
            break;

          case 'listTools':
            result = await (this as any).listMCPTools(credentials);
            break;

          case 'readResource':
            const resourceUri = this.getNodeParameter('resourceUri', itemIndex) as string;
            result = await (this as any).readMCPResource(credentials, resourceUri);
            break;

          case 'listResources':
            result = await (this as any).listMCPResources(credentials);
            break;

          case 'getPrompt':
            const promptName = this.getNodeParameter('promptName', itemIndex) as string;
            const promptArgumentsJson = this.getNodeParameter('promptArguments', itemIndex) as string;
            const promptArguments = JSON.parse(promptArgumentsJson);
            
            result = await (this as any).getMCPPrompt(credentials, promptName, promptArguments);
            break;

          case 'listPrompts':
            result = await (this as any).listMCPPrompts(credentials);
            break;

          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        returnData.push({
          json: result,
          pairedItem: itemIndex,
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            pairedItem: itemIndex,
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }

  // MCP client methods
  private async getMCPClient(credentials: any): Promise<MCPClient> {
    const client = new MCPClient({
      serverUrl: credentials.serverUrl,
      authToken: credentials.authToken,
      connectionType: credentials.connectionType || 'websocket',
    });
    await client.connect();
    return client;
  }

  private async callMCPTool(credentials: any, toolName: string, args: any): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      const result = await client.callTool(toolName, args);
      return N8NMCPBridge.mcpToN8NExecutionData(result).json;
    } finally {
      await client.disconnect();
    }
  }

  private async listMCPTools(credentials: any): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      return await client.listTools();
    } finally {
      await client.disconnect();
    }
  }

  private async readMCPResource(credentials: any, uri: string): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      const result = await client.readResource(uri);
      return N8NMCPBridge.mcpToN8NExecutionData(result).json;
    } finally {
      await client.disconnect();
    }
  }

  private async listMCPResources(credentials: any): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      return await client.listResources();
    } finally {
      await client.disconnect();
    }
  }

  private async getMCPPrompt(credentials: any, promptName: string, args: any): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      const result = await client.getPrompt(promptName, args);
      return N8NMCPBridge.mcpPromptArgsToN8N(result);
    } finally {
      await client.disconnect();
    }
  }

  private async listMCPPrompts(credentials: any): Promise<any> {
    const client = await this.getMCPClient(credentials);
    try {
      return await client.listPrompts();
    } finally {
      await client.disconnect();
    }
  }
}