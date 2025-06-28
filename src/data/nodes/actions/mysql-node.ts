import { NodeTypeInfo } from '../../node-types.js';

export const mysqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mysql',
  displayName: 'MySQL',
  description: 'Use the MySQL node to automate work in MySQL, and integrate MySQL with other applications. n8n has built-in support for a wide range of MySQL features, including executing an SQL query, as well as inserting, and updating rows in a database.',
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
        { name: 'Delete', value: 'delete', description: 'Delete rows from table' },
        { name: 'Execute SQL', value: 'executeQuery', description: 'Execute a custom SQL query' },
        { name: 'Insert', value: 'insert', description: 'Insert rows into table' },
        { name: 'Insert or Update', value: 'insertOrUpdate', description: 'Insert new rows or update existing ones' },
        { name: 'Select', value: 'select', description: 'Select rows from table' },
        { name: 'Update', value: 'update', description: 'Update rows in table' }
      ]
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'string',
      required: true,
      default: '',
      description: 'MySQL table to operate on'
    },
    {
      name: 'query',
      displayName: 'Query',
      type: 'string',
      required: false,
      default: '',
      description: 'SQL query to execute'
    },
    {
      name: 'columns',
      displayName: 'Columns',
      type: 'string',
      required: false,
      default: '*',
      description: 'Comma-separated list of columns to select'
    },
    {
      name: 'where',
      displayName: 'WHERE Condition',
      type: 'string',
      required: false,
      default: '',
      description: 'WHERE condition for filtering rows'
    },
    {
      name: 'orderBy',
      displayName: 'ORDER BY',
      type: 'string',
      required: false,
      default: '',
      description: 'Column(s) to order results by'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of rows to return (0 = no limit)'
    },
    {
      name: 'insertData',
      displayName: 'Insert Data',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Data to insert as key-value pairs'
    },
    {
      name: 'updateData',
      displayName: 'Update Data',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Data to update as key-value pairs'
    },
    {
      name: 'columnToMatchOn',
      displayName: 'Column to Match On',
      type: 'string',
      required: false,
      default: 'id',
      description: 'Column to use for matching in UPDATE operations'
    },
    {
      name: 'valueToMatchOn',
      displayName: 'Value to Match On',
      type: 'string',
      required: false,
      default: '',
      description: 'Value to match for UPDATE operations'
    },
    {
      name: 'queryParameters',
      displayName: 'Query Parameters',
      type: 'string',
      required: false,
      default: '',
      description: 'Parameters for prepared statements (comma-separated)'
    },
    {
      name: 'outputDecimals',
      displayName: 'Output Decimals as Numbers',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Output DECIMAL values as numbers instead of strings'
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
      description: 'The processed MySQL data'
    }
  ],
  credentials: ['mysql'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Select Users with Age Filter',
      description: 'Select users from database with age-based filtering using query parameters',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'select',
              table: 'users',
              columns: 'name, email, age',
              where: 'age >= ?',
              queryParameters: '25',
              orderBy: 'name ASC',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Insert New User',
      description: 'Insert a new user record into the database',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'insert',
              table: 'users',
              insertData: '{"name": "John Doe", "email": "john@example.com", "age": 30, "status": "active"}'
            }
          }
        ]
      }
    },
    {
      name: 'Update User Status',
      description: 'Update user status based on email address',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'update',
              table: 'users',
              updateData: '{"status": "inactive", "updated_at": "NOW()"}',
              columnToMatchOn: 'email',
              valueToMatchOn: 'john@example.com'
            }
          }
        ]
      }
    },
    {
      name: 'Execute Custom SQL Query',
      description: 'Execute a complex SQL query with joins and aggregation',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= ? GROUP BY u.id ORDER BY total_spent DESC',
              queryParameters: '2024-01-01'
            }
          }
        ]
      }
    },
    {
      name: 'Insert or Update Product',
      description: 'Insert new product or update existing one based on SKU',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'insertOrUpdate',
              table: 'products',
              insertData: '{"sku": "PROD001", "name": "Widget", "price": 19.99, "stock": 100}',
              columnToMatchOn: 'sku',
              valueToMatchOn: 'PROD001'
            }
          }
        ]
      }
    },
    {
      name: 'Delete Inactive Users',
      description: 'Remove users who have been inactive for over a year',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'delete',
              table: 'users',
              where: 'status = ? AND last_login < DATE_SUB(NOW(), INTERVAL 1 YEAR)',
              queryParameters: 'inactive'
            }
          }
        ]
      }
    }
  ]
};

// Export all MySQL nodes as an array for easier importing
export const mysqlNodes: NodeTypeInfo[] = [
  mysqlNode
];

// Export individual actions for the main MySQL node
export const mysqlActions = [
  'delete_rows',
  'execute_sql_query',
  'insert_rows',
  'insert_or_update_rows',
  'select_rows',
  'update_rows'
];

// Export supported authentication methods
export const mysqlAuthMethods = [
  'database_connection',
  'ssl_connection',
  'ssh_tunnel'
];

// Export common issues and solutions
export const mysqlCommonIssues = [
  {
    issue: 'composite_key_updates',
    description: 'Cannot update rows by composite key using standard Update operation',
    solution: 'Use Execute SQL operation with custom WHERE clause matching multiple columns'
  },
  {
    issue: 'docker_connectivity',
    description: 'Cannot connect to MySQL server when using Docker',
    solution: 'Configure network properly based on Docker setup (localhost, host.docker.internal, or container names)'
  },
  {
    issue: 'decimal_as_strings',
    description: 'DECIMAL values returned as strings instead of numbers',
    solution: 'Enable "Output Decimals as Numbers" option or use toFloat() function for conversion'
  }
];

// Template workflows for common MySQL patterns
export const mysqlTemplates = [
  {
    name: 'Generate SQL queries from schema - AI-powered',
    description: 'Use AI to generate SQL queries based on database schema',
    category: 'AI/Database',
    author: 'Yulia'
  },
  {
    name: 'Import CSV into MySQL',
    description: 'Import CSV data into MySQL database with validation',
    category: 'Data Import',
    author: 'Eduard'
  },
  {
    name: 'AI-Powered Tech Radar Advisor with SQL DB',
    description: 'Build an AI-powered tech radar advisor using MySQL, RAG, and routing agents',
    category: 'AI/ML',
    author: 'Sean Lon'
  },
  {
    name: 'Real-time Data Sync',
    description: 'Sync data between MySQL and external systems',
    category: 'Integration'
  },
  {
    name: 'Database Backup and Migration',
    description: 'Automated MySQL backup and data migration workflows',
    category: 'DevOps'
  }
];

// Export credential requirements
export const mysqlCredentials = {
  required: ['host', 'database', 'user', 'password'],
  optional: ['port', 'connectTimeout', 'ssl', 'sshTunnel'],
  default_port: 3306,
  default_timeout: 10000
};

// Export query parameter usage patterns
export const mysqlQueryPatterns = [
  {
    pattern: 'SELECT * FROM $1:name WHERE email = $2',
    description: 'Using query parameters to prevent SQL injection',
    parameters: ['table_name', 'email_value']
  },
  {
    pattern: 'UPDATE $1:name SET quantity = $2 WHERE customer_id = $3 AND product_id = $4',
    description: 'Composite key matching with multiple parameters',
    parameters: ['table_name', 'quantity', 'customer_id', 'product_id']
  }
];