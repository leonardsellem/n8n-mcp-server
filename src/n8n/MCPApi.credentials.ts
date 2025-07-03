import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MCPApi implements ICredentialType {
  name = 'mcpApi';
  displayName = 'MCP API';
  documentationUrl = 'mcp';
  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'serverUrl',
      type: 'string',
      default: 'http://localhost:3000',
      placeholder: 'http://localhost:3000',
      description: 'The URL of the MCP server',
    },
    {
      displayName: 'Authentication Token',
      name: 'authToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Authentication token for the MCP server (if required)',
    },
    {
      displayName: 'Connection Type',
      name: 'connectionType',
      type: 'options',
      options: [
        {
          name: 'HTTP',
          value: 'http',
        },
        {
          name: 'WebSocket',
          value: 'websocket',
        },
        {
          name: 'STDIO',
          value: 'stdio',
        },
      ],
      default: 'http',
      description: 'How to connect to the MCP server',
    },
  ];
}