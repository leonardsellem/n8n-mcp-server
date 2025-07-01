/**
 * # Postgres
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the Postgres node to automate work in Postgres, and integrate Postgres with other applications. 
 * n8n has built-in support for a wide range of Postgres features, including executing queries, 
 * as well as inserting and updating rows in a database.
 * 
 * ## Key Features
 * 
 * - **Complete CRUD Operations**: Delete, Execute Query, Insert, Insert or Update, Select, Update
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Advanced Delete Options**: Truncate, Delete with conditions, Drop with cascade support
 * - **Flexible Schema Management**: Work with multiple schemas and dynamic table selection
 * - **Query Parameters**: Sanitized parameters to prevent SQL injection attacks
 * - **Batch Processing**: Single query, independent, or transaction-based query execution
 * - **Column Mapping**: Manual and automatic column mapping for data operations
 * - **Large Number Support**: Handle NUMERIC and BIGINT with precision options
 * - **Connection Management**: Configurable timeouts and idle connection handling
 * - **Output Control**: Select specific columns and format output data
 * - **Conflict Resolution**: Skip on conflict options for insert operations
 * - **Data Transformation**: Replace empty strings with NULL for data consistency
 * - **Prepared Statements**: Full support for secure parameterized queries
 * 
 * ## Credentials
 * 
 * Refer to [Postgres credentials](../../credentials/postgres/) for guidance on setting up authentication.
 * Supports standard PostgreSQL connection parameters including host, port, username, password, and database.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Delete
 * Delete an entire table or rows in a table with multiple command options:
 * - **Truncate**: Removes table data but preserves structure (with sequence restart option)
 * - **Delete**: Delete rows matching conditions with WHERE clauses
 * - **Drop**: Permanently delete table data and structure (with cascade option)
 * 
 * ### Execute Query
 * Execute any SQL query with full PostgreSQL feature support and prepared statement capabilities.
 * 
 * ### Insert
 * Insert rows into tables with manual or automatic column mapping and conflict resolution.
 * 
 * ### Insert or Update
 * Perform UPSERT operations to insert new records or update existing ones.
 * 
 * ### Select
 * Select rows from tables with conditions, sorting, limiting, and flexible output options.
 * 
 * ### Update
 * Update existing rows in tables with flexible column mapping and condition-based updates.
 * 
 * ## Advanced Features
 * 
 * ### Query Parameters
 * When creating a query to run on a Postgres database, you can use the **Query Parameters** field 
 * in the **Options** section to load data into the query. n8n sanitizes data in query parameters, 
 * which prevents SQL injection.
 * 
 * Example usage:
 * ```sql
 * SELECT * FROM $1:name WHERE email = $2;
 * ```
 * 
 * With Query Parameters:
 * ```javascript
 * {{ [ 'users', $json.email ] }}
 * ```
 * 
 * ### Query Batching Options
 * - **Single Query**: Execute one query for all incoming items
 * - **Independently**: Execute one query per incoming item
 * - **Transaction**: Execute all queries in a transaction with rollback on failure
 * 
 * ### Column Mapping Modes
 * - **Map Each Column Manually**: Select values for each column individually
 * - **Map Automatically**: Auto-map incoming data to matching column names
 * 
 * ## Related Resources
 * 
 * n8n provides a trigger node for Postgres for real-time database monitoring and event handling.
 * 
 * ## Common Issues & Solutions
 * 
 * For common questions or issues and suggested resolution steps, refer to the Common issues documentation.
 * Common challenges include connection timeouts, schema permissions, and data type compatibility.
 * 
 * ## Use Cases
 * 
 * - **Enterprise Data Management**: Complex data operations, reporting, and business intelligence
 * - **Real-time Analytics**: Data warehousing, OLAP operations, and analytical processing
 * - **GIS & Spatial Data**: Geographic information systems and location-based applications
 * - **JSON/NoSQL Hybrid**: Leverage JSONB for flexible document storage with relational benefits
 * - **Multi-tenant Applications**: Schema-based isolation and complex permission systems
 * - **Financial Systems**: ACID compliance for banking, trading, and financial applications
 * - **Scientific Computing**: Large dataset processing and statistical analysis
 * - **E-commerce Platforms**: Product catalogs, inventory management, and order processing
 * - **Content Management**: Media storage, metadata management, and content workflows
 * - **IoT & Time Series**: Sensor data storage, monitoring, and time-based analytics
 * - **AI & Machine Learning**: Feature stores, model training data, and ML pipeline integration
 * - **API Backend**: RESTful API data layer with complex querying capabilities
 */

import { NodeTypeInfo } from '../../node-types.js';

export const postgresqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postgresql',
  displayName: 'PostgreSQL',
  description: 'Connect to PostgreSQL database for advanced data operations and queries.',
  category: 'Action Nodes',
  subcategory: 'Databases',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'executeQuery',
      description: 'Operation to perform on PostgreSQL database',
      options: [
        {
          name: 'Execute Query',
          value: 'executeQuery',
          description: 'Execute a SQL query'
        },
        {
          name: 'Insert',
          value: 'insert',
          description: 'Insert data into table'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update existing records'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete records from table'
        }
      ]
    },
    {
      name: 'query',
      displayName: 'Query',
      type: 'string',
      required: true,
      default: '',
      description: 'SQL query to execute',
      displayOptions: {
        show: {
          operation: ['executeQuery']
        }
      }
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'postgres',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'PostgreSQL'
  },

  aliases: ['postgres', 'database', 'sql'],
  
  examples: [
    {
      name: 'Complex Query',
      description: 'Execute advanced PostgreSQL query',
      workflow: {
        nodes: [
          {
            name: 'PostgreSQL',
            type: 'n8n-nodes-base.postgresql',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT u.*, p.name as profile_name FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.created_at > NOW() - INTERVAL \'7 days\''
            }
          }
        ]
      }
    }
  ]
};

export default postgresqlNode;
