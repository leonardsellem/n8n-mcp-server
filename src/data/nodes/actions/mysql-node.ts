/**
 * # MySQL
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the MySQL node to automate work in MySQL, and integrate MySQL with other applications. 
 * n8n has built-in support for a wide range of MySQL features, including executing an SQL query, 
 * as well as inserting, and updating rows in a database.
 * 
 * ## Key Features
 * 
 * - **Complete CRUD Operations**: Delete, Execute SQL, Insert, Insert or Update, Select, Update
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Secure Query Parameters**: Sanitized parameters to prevent SQL injection attacks
 * - **Flexible SQL Execution**: Execute any SQL query with full MySQL feature support
 * - **Batch Operations**: Handle multiple records efficiently with bulk operations
 * - **Advanced Data Types**: Support for all MySQL data types and structures
 * - **Connection Management**: Secure and efficient database connections
 * - **Transaction Support**: Execute multiple operations atomically
 * - **Schema Operations**: Create, modify, and manage database structures
 * - **Performance Optimization**: Optimized for high-throughput database operations
 * - **Error Handling**: Comprehensive error reporting and debugging capabilities
 * - **Version Compatibility**: Support for multiple MySQL versions and configurations
 * 
 * ## Credentials
 * 
 * Refer to [MySQL credentials](../../credentials/mysql/) for guidance on setting up authentication.
 * Supports standard MySQL connection parameters including host, port, username, password, and database.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * - **Delete**: Delete records from database tables
 * - **Execute SQL**: Execute any SQL query with full flexibility
 * - **Insert**: Insert new records into database tables
 * - **Insert or Update**: Insert new records or update existing ones (UPSERT operations)
 * - **Select**: Query and retrieve data from database tables
 * - **Update**: Update existing records in database tables
 * 
 * ## Query Parameters
 * 
 * When creating a query to run on a MySQL database, you can use the **Query Parameters** field 
 * in the **Options** section to load data into the query. n8n sanitizes data in query parameters, 
 * which prevents SQL injection.
 * 
 * ### Example Usage:
 * ```sql
 * SELECT * FROM $1:name WHERE email = $2;
 * ```
 * 
 * With Query Parameters:
 * - `users` (table name)
 * - `{{ $json.email }}` (dynamic email from input data)
 * 
 * ## Related Resources
 * 
 * Refer to [MySQL's Connectors and APIs documentation](https://dev.mysql.com/doc/index-connectors.html) 
 * for more information about the service.
 * 
 * Refer to MySQL's [SELECT statement documentation](https://dev.mysql.com/doc/refman/8.4/en/select.html) 
 * for more information on writing SQL queries.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common issues documentation.
 * Common challenges include connection timeouts, permission issues, and data type compatibility.
 * 
 * ## Use Cases
 * 
 * - **Data Synchronization**: Sync data between MySQL and other systems, CRMs, or APIs
 * - **Business Intelligence**: Generate reports, analytics, and dashboards from MySQL data
 * - **E-commerce Operations**: Manage products, orders, customers, and inventory data
 * - **User Management**: Handle authentication, user profiles, and permission systems
 * - **Content Management**: Store and retrieve articles, media metadata, and content structures
 * - **Financial Systems**: Process transactions, accounting data, and financial reporting
 * - **IoT & Monitoring**: Store sensor data, logs, and monitoring information
 * - **Educational Platforms**: Manage courses, students, grades, and learning analytics
 * - **Healthcare Systems**: Handle patient data, medical records, and healthcare analytics
 * - **Supply Chain Management**: Track inventory, shipments, and logistics data
 * - **AI & Machine Learning**: Store training data, model results, and ML pipelines
 * - **Migration & ETL**: Extract, transform, and load data for data warehouse operations
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mysqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mysql',
  displayName: 'MySQL',
  description: 'Connect to MySQL database to execute queries and manage data.',
  category: 'Action Nodes',
  subcategory: 'Databases',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'executeQuery',
      description: 'Operation to perform on MySQL database',
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
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the table',
      displayOptions: {
        show: {
          operation: ['insert', 'update', 'delete']
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
      name: 'mysql',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'MySQL'
  },

  aliases: ['database', 'sql', 'db'],
  
  examples: [
    {
      name: 'Select Data',
      description: 'Select records from MySQL table',
      workflow: {
        nodes: [
          {
            name: 'MySQL',
            type: 'n8n-nodes-base.mysql',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT * FROM users WHERE active = 1'
            }
          }
        ]
      }
    }
  ]
};

export default mysqlNode;
