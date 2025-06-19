import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const nocodbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.nocodb',
  displayName: 'NocoDB',
  description: 'Use the NocoDB node to automate work in NocoDB, and integrate NocoDB with other applications. n8n has built-in support for a wide range of NocoDB features, including creating, updating, deleting, and retrieving rows.',
  category: 'Database',
  subcategory: 'NoSQL',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'row',
      description: 'The resource to operate on',
      options: [
        { name: 'Row', value: 'row', description: 'Work with database rows' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new row' },
        { name: 'Delete', value: 'delete', description: 'Delete a row' },
        { name: 'Get', value: 'get', description: 'Get a single row' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple rows' },
        { name: 'Update', value: 'update', description: 'Update a row' }
      ]
    },
    {
      name: 'tableId',
      displayName: 'Table ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the table to operate on'
    },
    {
      name: 'rowId',
      displayName: 'Row ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the row to operate on (for get, update, delete operations)'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing the field values for the row'
    },
    {
      name: 'where',
      displayName: 'Where Condition',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter condition for queries (for get many operation)'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 25,
      description: 'Maximum number of rows to return'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of rows to skip'
    },
    {
      name: 'sort',
      displayName: 'Sort',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of columns to sort by'
    },
    {
      name: 'returnAll',
      displayName: 'Return All',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return all results or use limit/offset'
    },
    {
      name: 'additionalFields',
      displayName: 'Additional Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Additional fields for advanced configurations'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The processed NocoDB data'
    }
  ],
  credentials: ['nocodb'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Row',
      description: 'Create a new row in a NocoDB table',
      workflow: {
        nodes: [
          {
            name: 'NocoDB',
            type: 'n8n-nodes-base.nocodb',
            parameters: {
              resource: 'row',
              operation: 'create',
              tableId: '{{$json["tableId"]}}',
              fields: '{"name": "John Doe", "email": "john@example.com", "status": "active"}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Multiple Rows',
      description: 'Retrieve multiple rows from a NocoDB table',
      workflow: {
        nodes: [
          {
            name: 'NocoDB',
            type: 'n8n-nodes-base.nocodb',
            parameters: {
              resource: 'row',
              operation: 'getAll',
              tableId: '{{$json["tableId"]}}',
              limit: 50,
              where: '(status,eq,active)',
              sort: 'created_at'
            }
          }
        ]
      }
    },
    {
      name: 'Update Row',
      description: 'Update an existing row in a NocoDB table',
      workflow: {
        nodes: [
          {
            name: 'NocoDB',
            type: 'n8n-nodes-base.nocodb',
            parameters: {
              resource: 'row',
              operation: 'update',
              tableId: '{{$json["tableId"]}}',
              rowId: '{{$json["rowId"]}}',
              fields: '{"status": "completed", "updated_at": "{{new Date().toISOString()}}"}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Single Row',
      description: 'Retrieve a specific row by ID',
      workflow: {
        nodes: [
          {
            name: 'NocoDB',
            type: 'n8n-nodes-base.nocodb',
            parameters: {
              resource: 'row',
              operation: 'get',
              tableId: '{{$json["tableId"]}}',
              rowId: '{{$json["rowId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Delete Row',
      description: 'Delete a row from a NocoDB table',
      workflow: {
        nodes: [
          {
            name: 'NocoDB',
            type: 'n8n-nodes-base.nocodb',
            parameters: {
              resource: 'row',
              operation: 'delete',
              tableId: '{{$json["tableId"]}}',
              rowId: '{{$json["rowId"]}}'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the NocoDB node
export const nocodbActions = [
  'create_row',
  'delete_row',
  'get_row',
  'get_many_rows',
  'update_row'
];

// Export supported authentication methods
export const nocodbAuthMethods = [
  'api_token',
  'user_auth_token' // deprecated but still supported
];

// Template workflows for common NocoDB patterns
export const nocodbTemplates = [
  {
    name: 'News Site Scraper with AI Summarization',
    description: 'Scrape and summarize posts of a news site without RSS feed using AI and save them to a NocoDB',
    category: 'Content Management'
  },
  {
    name: 'Multilanguage Data Storage',
    description: 'Store and manage multilingual content in NocoDB tables',
    category: 'Internationalization'
  },
  {
    name: 'AI-Powered Content Creation Pipeline',
    description: 'Create LinkedIn contributions with AI and store results in NocoDB',
    category: 'AI/ML'
  },
  {
    name: 'Data Collection and Analysis',
    description: 'Collect data from various sources and store in NocoDB for analysis',
    category: 'Data Processing'
  }
];

// Export capabilities and features
export const nocodbCapabilities = [
  'row_management',
  'data_filtering',
  'sorting_and_pagination',
  'ai_tool_integration',
  'bulk_operations',
  'real_time_updates'
];

// Export API information
export const nocodbApiInfo = {
  baseUrl: 'configurable_host',
  authMethods: ['api_token', 'user_auth_token'],
  supportedOperations: ['create', 'read', 'update', 'delete'],
  dataFormat: 'json',
  rateLimit: 'depends_on_instance'
};