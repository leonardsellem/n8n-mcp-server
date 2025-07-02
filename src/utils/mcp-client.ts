import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';
import {
  CallToolRequest,
  ListToolsRequest,
  ListResourcesRequest,
  ReadResourceRequest,
  ListPromptsRequest,
  GetPromptRequest,
  CallToolResultSchema,
  ListToolsResultSchema,
  ListResourcesResultSchema,
  ReadResourceResultSchema,
  ListPromptsResultSchema,
  GetPromptResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

export interface MCPClientConfig {
  serverUrl: string;
  authToken?: string;
  connectionType: 'http' | 'websocket' | 'stdio';
}

export class MCPClient {
  private client: Client;
  private config: MCPClientConfig;
  private connected: boolean = false;

  constructor(config: MCPClientConfig) {
    this.config = config;
    this.client = new Client(
      {
        name: 'n8n-mcp-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    let transport;
    
    switch (this.config.connectionType) {
      case 'websocket':
        const wsUrl = this.config.serverUrl.replace(/^http/, 'ws');
        transport = new WebSocketClientTransport(new URL(wsUrl));
        break;
      
      case 'stdio':
        // For stdio, the serverUrl should be the command to execute
        const [command, ...args] = this.config.serverUrl.split(' ');
        transport = new StdioClientTransport({
          command,
          args,
        });
        break;
      
      default:
        throw new Error(`HTTP transport is not yet supported for MCP clients`);
    }

    await this.client.connect(transport);
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }

  async listTools(): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      { method: 'tools/list' } as ListToolsRequest,
      ListToolsResultSchema
    );
  }

  async callTool(name: string, args: any): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      {
        method: 'tools/call',
        params: {
          name,
          arguments: args,
        },
      } as CallToolRequest,
      CallToolResultSchema
    );
  }

  async listResources(): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      { method: 'resources/list' } as ListResourcesRequest,
      ListResourcesResultSchema
    );
  }

  async readResource(uri: string): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      {
        method: 'resources/read',
        params: {
          uri,
        },
      } as ReadResourceRequest,
      ReadResourceResultSchema
    );
  }

  async listPrompts(): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      { method: 'prompts/list' } as ListPromptsRequest,
      ListPromptsResultSchema
    );
  }

  async getPrompt(name: string, args?: any): Promise<any> {
    await this.ensureConnected();
    return await this.client.request(
      {
        method: 'prompts/get',
        params: {
          name,
          arguments: args,
        },
      } as GetPromptRequest,
      GetPromptResultSchema
    );
  }

  private async ensureConnected(): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }
  }
}