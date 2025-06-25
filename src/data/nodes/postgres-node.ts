import { NodeTypeInfo } from '../node-types.js';

export const postgresNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postgres',
  displayName: 'Postgres',
  description: 'Use the Postgres node to automate work in Postgres, and integrate Postgres with other applications. n8n has built-in support for a wide range of Postgres features, including executing queries, as well as inserting and updating rows in a database.',
  category: 'Database',
  subcategory: 'SQL',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'select',
      description: 'The operation to perform',
      options: [
        { name: 'Delete', value: 'delete', description: 'Delete an entire table or rows in a table' },
        { name: 'Execute Query', value: 'executeQuery', description: 'Execute an SQL query' },
        { name: 'Insert', value: 'insert', description: 'Insert rows in a table' },
        { name: 'Insert or Update', value: 'insertOrUpdate', description: 'Insert or update rows in a table' },
        { name: 'Select', value: 'select', description: 'Select rows from a table' },
        { name: 'Update', value: 'update', description: 'Update rows in a table' }
      ]
    },
    {
      name: 'schema',
      displayName: 'Schema',
      type: 'options',
      required: false,
      default: 'fromList',
      description: 'Choose the schema that contains the table you want to work on',
      options: [
        { name: 'From List', value: 'fromList', description: 'Choose the schema from the dropdown list' },
        { name: 'By Name', value: 'byName', description: 'Enter the schema name' }
      ]
    },
    {
      name: 'schemaName',
      displayName: 'Schema Name',
      type: 'string',
      required: false,
      default: 'public',
      description: 'Name of the schema to use'
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'options',
      required: true,
      default: 'fromList',
      description: 'Choose the table that you want to work on',
      options: [
        { name: 'From List', value: 'fromList', description: 'Choose the table from the dropdown list' },
        { name: 'By Name', value: 'byName', description: 'Enter the table name' }
      ]
    },
    {
      name: 'tableName',
      displayName: 'Table Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the table to operate on'
    },
    {
      name: 'query',
      displayName: 'Query',
      type: 'string',
      required: false,
      default: '',
      description: 'SQL query to execute. You can use expressions and tokens like $1, $2, $3 for prepared statements'
    },
    {
      name: 'command',
      displayName: 'Command',
      type: 'options',
      required: false,
      default: 'delete',
      description: 'The deletion action to take',
      options: [
        { name: 'Truncate', value: 'truncate', description: 'Removes the table data but preserves the table structure' },
        { name: 'Delete', value: 'delete', description: 'Delete the rows that match the Select Rows condition' },
        { name: 'Drop', value: 'drop', description: 'Deletes the table data and structure permanently' }
      ]
    },
    {
      name: 'restartSequences',
      displayName: 'Restart Sequences',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to reset auto increment columns to their initial values as part of the Truncate process'
    },
    {
      name: 'cascade',
      displayName: 'Cascade',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to also drop all objects that depend on the table, like views and sequences'
    },
    {
      name: 'mappingColumnMode',
      displayName: 'Mapping Column Mode',
      type: 'options',
      required: false,
      default: 'mapManually',
      description: 'How to map column names to incoming data',
      options: [
        { name: 'Map Each Column Manually', value: 'mapManually', description: 'Select the values to use for each column' },
        { name: 'Map Automatically', value: 'mapAutomatically', description: 'Automatically map incoming data to matching column names' }
      ]
    },
    {
      name: 'returnAll',
      displayName: 'Return All',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to return all results or only up to a given limit'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of items to return when Return All is disabled'
    },
    {
      name: 'selectRows',
      displayName: 'Select Rows',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Set the conditions to select rows. Define Column, Operator, and Value to match rows on'
    },
    {
      name: 'combineConditions',
      displayName: 'Combine Conditions',
      type: 'options',
      required: false,
      default: 'AND',
      description: 'How to combine the conditions in Select Rows',
      options: [
        { name: 'AND', value: 'AND', description: 'All conditions must be true' },
        { name: 'OR', value: 'OR', description: 'At least one condition must be true' }
      ]
    },
    {
      name: 'sort',
      displayName: 'Sort',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Choose how to sort the selected rows. Choose a Column and sort Direction'
    },
    {
      name: 'connectionTimeout',
      displayName: 'Connection Timeout',
      type: 'number',
      required: false,
      default: 10,
      description: 'The number of seconds to try to connect to the database'
    },
    {
      name: 'delayClosingIdleConnection',
      displayName: 'Delay Closing Idle Connection',
      type: 'number',
      required: false,
      default: 0,
      description: 'The number of seconds to wait before considering idle connections eligible for closing'
    },
    {
      name: 'queryBatching',
      displayName: 'Query Batching',
      type: 'options',
      required: false,
      default: 'single',
      description: 'The way to send queries to the database',
      options: [
        { name: 'Single Query', value: 'single', description: 'A single query for all incoming items' },
        { name: 'Independently', value: 'independently', description: 'Execute one query per incoming item' },
        { name: 'Transaction', value: 'transaction', description: 'Execute all queries in a transaction' }
      ]
    },
    {
      name: 'queryParameters',
      displayName: 'Query Parameters',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of values to use as query parameters'
    },
    {
      name: 'outputLargeNumbers',
      displayName: 'Output Large-Format Numbers As',
      type: 'options',
      required: false,
      default: 'numbers',
      description: 'The format to output NUMERIC and BIGINT columns as',
      options: [
        { name: 'Numbers', value: 'numbers', description: 'Use this for standard numbers' },
        { name: 'Text', value: 'text', description: 'Use this if you expect numbers longer than 16 digits' }
      ]
    },
    {
      name: 'replaceEmptyStrings',
      displayName: 'Replace Empty Strings with NULL',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to replace empty strings with NULL in input'
    },
    {
      name: 'outputColumns',
      displayName: 'Output Columns',
      type: 'string',
      required: false,
      default: '',
      description: 'Choose which columns to output. Comma-separated list or use expressions'
    },
    {
      name: 'skipOnConflict',
      displayName: 'Skip on Conflict',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to skip the row if the insert violates a unique or exclusion constraint'
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
      description: 'The processed Postgres data'
    }
  ],
  credentials: ['postgres'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Select Users with Query Parameters',
      description: 'Select users from database with email filtering using query parameters to prevent SQL injection',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT * FROM users WHERE email = $1 AND age >= $2',
              queryParameters: 'john@example.com, 25'
            }
          }
        ]
      }
    },
    {
      name: 'Insert New User',
      description: 'Insert a new user record into the database with automatic column mapping',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'insert',
              schema: 'byName',
              schemaName: 'public',
              table: 'byName',
              tableName: 'users',
              mappingColumnMode: 'mapAutomatically'
            }
          }
        ]
      }
    },
    {
      name: 'Update User Status',
      description: 'Update user status with conditional matching',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'update',
              table: 'byName',
              tableName: 'users',
              selectRows: '[{"column": "email", "operator": "=", "value": "john@example.com"}]',
              mappingColumnMode: 'mapManually'
            }
          }
        ]
      }
    },
    {
      name: 'Complex Join Query',
      description: 'Execute a complex SQL query with joins and aggregation using query parameters',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= $1 GROUP BY u.id ORDER BY total_spent DESC',
              queryParameters: '2024-01-01'
            }
          }
        ]
      }
    },
    {
      name: 'Bulk Insert with Transaction',
      description: 'Insert multiple records using transaction batching',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'insert',
              table: 'byName',
              tableName: 'products',
              mappingColumnMode: 'mapAutomatically',
              queryBatching: 'transaction'
            }
          }
        ]
      }
    },
    {
      name: 'Truncate Table with Restart Sequences',
      description: 'Clear table data while preserving structure and resetting auto-increment',
      workflow: {
        nodes: [
          {
            name: 'Postgres',
            type: 'n8n-nodes-base.postgres',
            parameters: {
              operation: 'delete',
              table: 'byName',
              tableName: 'temp_data',
              command: 'truncate',
              restartSequences: true,
              cascade: false
            }
          }
        ]
      }
    }
  ]
};

export const postgresTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postgrestrigger',
  displayName: 'Postgres Trigger',
  description: 'Use the Postgres Trigger node to respond to events in Postgres and integrate Postgres with other applications. n8n has built-in support responding to insert, update, and delete events.',
  category: 'Database',
  subcategory: 'SQL',
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'listenAndCreateTrigger',
      description: 'How the node should listen for events',
      options: [
        { name: 'Listen and Create Trigger Rule', value: 'listenAndCreateTrigger', description: 'Create trigger rules for specific events' },
        { name: 'Listen to Channel', value: 'listenToChannel', description: 'Monitor a specific channel for notifications' }
      ]
    },
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: false,
      default: ['insert'],
      description: 'The events to listen for',
      options: [
        { name: 'Insert', value: 'insert', description: 'Triggered when new rows are inserted' },
        { name: 'Update', value: 'update', description: 'Triggered when existing rows are updated' },
        { name: 'Delete', value: 'delete', description: 'Triggered when rows are deleted' }
      ]
    },
    {
      name: 'channelName',
      displayName: 'Channel Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the channel to monitor for notifications'
    },
    {
      name: 'tableName',
      displayName: 'Table Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the table to create triggers for'
    },
    {
      name: 'schemaName',
      displayName: 'Schema Name',
      type: 'string',
      required: false,
      default: 'public',
      description: 'Name of the schema containing the table'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Postgres events occur'
    }
  ],
  credentials: ['postgres'],
  triggerNode: true,
  polling: false,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor User Table Changes',
      description: 'Trigger workflow when users table is modified',
      workflow: {
        nodes: [
          {
            name: 'Postgres Trigger',
            type: 'n8n-nodes-base.postgrestrigger',
            parameters: {
              mode: 'listenAndCreateTrigger',
              events: ['insert', 'update', 'delete'],
              tableName: 'users',
              schemaName: 'public'
            }
          }
        ]
      }
    },
    {
      name: 'Listen to Custom Channel',
      description: 'Monitor a custom notification channel',
      workflow: {
        nodes: [
          {
            name: 'Postgres Trigger',
            type: 'n8n-nodes-base.postgrestrigger',
            parameters: {
              mode: 'listenToChannel',
              channelName: 'order_notifications'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Inventory Updates',
      description: 'Trigger when inventory levels change',
      workflow: {
        nodes: [
          {
            name: 'Postgres Trigger',
            type: 'n8n-nodes-base.postgrestrigger',
            parameters: {
              mode: 'listenAndCreateTrigger',
              events: ['update'],
              tableName: 'inventory',
              schemaName: 'warehouse'
            }
          }
        ]
      }
    }
  ]
};

export const postgresChatMemoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.memorypostgreschat',
  displayName: 'Postgres Chat Memory',
  description: 'Use the Postgres Chat Memory node to use Postgres as a memory server for storing chat history.',
  category: 'AI',
  subcategory: 'Memory',
  properties: [
    {
      name: 'sessionKey',
      displayName: 'Session Key',
      type: 'string',
      required: true,
      default: 'chat_session',
      description: 'Key to use to store the memory in the workflow data'
    },
    {
      name: 'tableName',
      displayName: 'Table Name',
      type: 'string',
      required: true,
      default: 'chat_history',
      description: 'Name of the table to store chat history in. The system will create the table if it doesn\'t exist'
    },
    {
      name: 'contextWindowLength',
      displayName: 'Context Window Length',
      type: 'number',
      required: false,
      default: 10,
      description: 'Number of previous interactions to consider for context'
    }
  ],
  inputs: [
    {
      type: 'ai_memory',
      displayName: 'Memory',
      required: true
    }
  ],
  outputs: [],
  credentials: ['postgres'],
  regularNode: false,
  examples: [
    {
      name: 'Store AI Chat History',
      description: 'Store conversation history in Postgres for AI memory',
      workflow: {
        nodes: [
          {
            name: 'Postgres Chat Memory',
            type: 'n8n-nodes-langchain.memorypostgreschat',
            parameters: {
              sessionKey: 'user_chat_session',
              tableName: 'ai_conversations',
              contextWindowLength: 20
            }
          }
        ]
      }
    },
    {
      name: 'Customer Support Memory',
      description: 'Maintain conversation context for customer support chatbot',
      workflow: {
        nodes: [
          {
            name: 'Postgres Chat Memory',
            type: 'n8n-nodes-langchain.memorypostgreschat',
            parameters: {
              sessionKey: 'support_session',
              tableName: 'support_chat_history',
              contextWindowLength: 15
            }
          }
        ]
      }
    }
  ]
};

// Export all Postgres nodes as an array for easier importing
export const postgresNodes: NodeTypeInfo[] = [
  postgresNode,
  postgresTriggerNode,
  postgresChatMemoryNode
];

// Export individual actions for the main Postgres node
export const postgresActions = [
  'delete_rows',
  'delete_table_drop',
  'delete_table_truncate',
  'execute_sql_query',
  'insert_rows',
  'insert_or_update_rows',
  'select_rows',
  'update_rows'
];

// Export trigger events
export const postgresTriggerEvents = [
  'insert_events',
  'update_events',
  'delete_events',
  'channel_notifications'
];

// Export memory operations
export const postgresMemoryActions = [
  'store_chat_history',
  'retrieve_chat_context'
];

// Export supported authentication methods
export const postgresAuthMethods = [
  'database_connection',
  'ssl_connection',
  'ssh_tunnel'
];

// Export common issues and solutions
export const postgresCommonIssues = [
  {
    issue: 'large_number_precision',
    description: 'NUMERIC and BIGINT values longer than 16 digits may be incorrect',
    solution: 'Set "Output Large-Format Numbers As" to "Text" for numbers longer than 16 digits'
  },
  {
    issue: 'connection_timeout',
    description: 'Database connection timeouts in high-load scenarios',
    solution: 'Adjust Connection Timeout and Delay Closing Idle Connection settings based on your database performance'
  },
  {
    issue: 'transaction_rollback',
    description: 'Transaction queries fail and roll back all changes',
    solution: 'Use "Independently" query batching for operations that should not be rolled back together'
  },
  {
    issue: 'empty_string_handling',
    description: 'Empty strings from spreadsheet data causing issues',
    solution: 'Enable "Replace Empty Strings with NULL" option when working with data exported from spreadsheet software'
  },
  {
    issue: 'ssh_tunnel_agent_incompatibility',
    description: 'SSH tunnels not supported with Agent nodes',
    solution: 'Agent nodes do not support SSH tunnels. Use direct connections or configure network access differently'
  }
];

// Template workflows for common Postgres patterns
export const postgresTemplates = [
  {
    name: 'Chat with PostgreSQL Database',
    description: 'AI-powered database interaction using natural language queries',
    category: 'AI/Database',
    author: 'KumoHQ'
  },
  {
    name: 'Generate Instagram Content from Top Trends with AI Image Generation',
    description: 'Social media content generation pipeline with Postgres storage',
    category: 'AI/Social Media',
    author: 'mustafa kendigüzel'
  },
  {
    name: 'AI Customer Support Assistant · WhatsApp Ready · Works for Any Business',
    description: 'Customer support automation with Postgres chat memory',
    category: 'AI/Customer Support',
    author: 'Matt F.'
  },
  {
    name: 'Real-time Data Pipeline with Postgres Triggers',
    description: 'Event-driven data processing using Postgres triggers',
    category: 'Data Processing'
  },
  {
    name: 'User Analytics Dashboard',
    description: 'Comprehensive user behavior tracking and analytics',
    category: 'Analytics'
  },
  {
    name: 'E-commerce Order Processing',
    description: 'Automated order management with inventory tracking',
    category: 'E-commerce'
  }
];

// Export credential requirements
export const postgresCredentials = {
  required: ['host', 'database', 'user', 'password'],
  optional: ['port', 'ssl', 'ignoreSSLIssues', 'sshTunnel'],
  default_port: 5432,
  ssl_modes: ['allow', 'disable', 'require']
};

// Export query parameter usage patterns
export const postgresQueryPatterns = [
  {
    pattern: 'SELECT * FROM $1:name WHERE email = $2',
    description: 'Using query parameters to prevent SQL injection with table name identifier',
    parameters: ['table_name', 'email_value']
  },
  {
    pattern: 'UPDATE users SET status = $1 WHERE customer_id = $2 AND product_id = $3',
    description: 'Composite key matching with multiple parameters',
    parameters: ['status', 'customer_id', 'product_id']
  },
  {
    pattern: 'INSERT INTO $1:name (name, email, created_at) VALUES ($2, $3, NOW())',
    description: 'Insert with mixed parameters and SQL functions',
    parameters: ['table_name', 'name_value', 'email_value']
  }
];

// Export AI integration capabilities
export const postgresAIIntegration = {
  ai_tool_support: true,
  description: 'This node can be used to enhance the capabilities of an AI agent. Many parameters can be set automatically with AI-directed information.',
  use_cases: [
    'Natural language to SQL query generation',
    'Automated database schema analysis',
    'Intelligent data validation and processing',
    'Context-aware database operations'
  ]
};