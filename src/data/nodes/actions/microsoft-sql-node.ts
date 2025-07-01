/**
 * # Microsoft SQL Server
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the Microsoft SQL node to automate work in Microsoft SQL, and integrate Microsoft SQL with other applications. 
 * n8n has built-in support for a wide range of Microsoft SQL features, including executing SQL queries, and inserting 
 * rows into the database.
 * 
 * ## Key Features
 * 
 * - **SQL Query Execution**: Execute complex SQL queries and stored procedures
 * - **CRUD Operations**: Complete Create, Read, Update, Delete operations
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Transaction Support**: Handle database transactions and rollbacks
 * - **Connection Pooling**: Efficient connection management for high-performance applications
 * - **Prepared Statements**: Secure parameterized queries to prevent SQL injection
 * - **Bulk Operations**: Efficient bulk insert and update operations
 * - **Data Type Support**: Full support for all SQL Server data types
 * - **Error Handling**: Comprehensive error handling and debugging capabilities
 * - **Performance Optimization**: Query optimization and performance monitoring
 * - **Schema Operations**: Database schema introspection and management
 * - **Stored Procedures**: Execute stored procedures with input/output parameters
 * 
 * ## Credentials
 * 
 * Refer to [Microsoft SQL credentials](../../credentials/microsoftsql/) for guidance on setting up authentication.
 * Supports Windows Authentication, SQL Server Authentication, and Azure Active Directory authentication.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Execute Query
 * - **SQL Execution**: Execute any SQL query including SELECT, stored procedures, and complex joins
 *   - Support for parameterized queries
 *   - Multiple result set handling
 *   - Query timeout configuration
 *   - Connection string customization
 *   - Error handling and debugging
 *   - Performance monitoring and optimization
 *   - Schema introspection capabilities
 *   - Data type mapping and conversion
 *   - Pagination support for large result sets
 *   - Transaction isolation level control
 *   - Connection pooling management
 *   - Async query execution for long-running operations
 * 
 * ### Insert
 * - **Data Insertion**: Insert single or multiple rows into database tables
 *   - Bulk insert operations for high performance
 *   - Identity column handling
 *   - Default value management
 *   - Constraint validation
 *   - Error handling for duplicate keys
 *   - Data transformation before insertion
 *   - Batch processing capabilities
 *   - Foreign key relationship handling
 *   - Trigger execution management
 *   - Transaction safety and rollback
 *   - Performance optimization for large datasets
 *   - Data validation and cleansing
 * 
 * ### Update
 * - **Data Modification**: Update existing records with new values
 *   - Conditional updates with WHERE clauses
 *   - Bulk update operations
 *   - Optimistic concurrency control
 *   - Change tracking and auditing
 *   - Performance optimization
 *   - Error handling and rollback
 *   - Data validation before updates
 *   - Join-based updates for complex scenarios
 *   - Trigger management
 *   - Transaction isolation
 *   - Batch processing for large updates
 * 
 * ### Delete
 * - **Data Removal**: Delete records from database tables
 *   - Conditional deletes with WHERE clauses
 *   - Cascade delete handling
 *   - Soft delete implementations
 *   - Bulk delete operations
 *   - Foreign key constraint management
 *   - Transaction safety and rollback
 *   - Audit trail maintenance
 *   - Performance optimization
 *   - Error handling and recovery
 *   - Backup verification before deletion
 *   - Related data cleanup
 * 
 * ## Advanced Features
 * 
 * ### Database Management
 * - **Schema Operations**: Database schema introspection and management
 * - **Index Management**: Query optimization through proper indexing
 * - **Constraint Handling**: Primary key, foreign key, and check constraints
 * - **Data Types**: Full support for SQL Server data types including JSON, XML, spatial
 * 
 * ### Performance and Optimization
 * - **Query Optimization**: Automatic query plan optimization
 * - **Connection Pooling**: Efficient connection management and reuse
 * - **Batch Processing**: High-performance batch operations
 * - **Caching Strategies**: Result caching for frequently accessed data
 * 
 * ### Security and Compliance
 * - **Authentication**: Multiple authentication methods including Azure AD
 * - **Authorization**: Role-based access control and permissions
 * - **Encryption**: Data encryption in transit and at rest
 * - **Audit Logging**: Complete audit trails for compliance
 * 
 * ### Integration Patterns
 * - **ETL Operations**: Extract, transform, and load data workflows
 * - **Real-time Sync**: Synchronize data between systems
 * - **Data Warehousing**: Support for data warehouse operations
 * - **Business Intelligence**: Integration with BI and reporting tools
 * 
 * ## Integration Patterns
 * 
 * ### Data Processing
 * - **ETL Workflows**: Extract, transform, and load data from various sources
 * - **Data Synchronization**: Keep databases synchronized across systems
 * - **Data Migration**: Migrate data between different database systems
 * - **Data Cleansing**: Clean and validate data during processing
 * 
 * ### Business Intelligence
 * - **Reporting**: Generate reports from database data
 * - **Analytics**: Perform data analysis and generate insights
 * - **Dashboard Integration**: Feed data to business dashboards
 * - **KPI Tracking**: Monitor key performance indicators
 * 
 * ### Application Integration
 * - **API Backend**: Use as backend for REST APIs
 * - **Microservices**: Database layer for microservices architecture
 * - **Event Processing**: Process events and store results
 * - **Workflow Automation**: Automate business processes with database operations
 * 
 * ### Enterprise Features
 * - **High Availability**: Support for AlwaysOn and clustering
 * - **Disaster Recovery**: Backup and recovery integration
 * - **Compliance**: Support for regulatory compliance requirements
 * - **Monitoring**: Integration with monitoring and alerting systems
 * 
 * ## Use Cases
 * 
 * - **Enterprise Applications**: Backend database for enterprise applications
 * - **Data Warehousing**: Central repository for business data
 * - **Business Intelligence**: Source for BI and analytics platforms
 * - **Financial Systems**: Transaction processing and financial reporting
 * - **Inventory Management**: Track and manage inventory across systems
 * - **Customer Management**: Store and manage customer information
 * - **Order Processing**: Handle e-commerce and order management
 * - **HR Systems**: Employee data management and reporting
 * - **Supply Chain**: Track products through supply chain
 * - **Quality Control**: Monitor and track quality metrics
 * - **Compliance Reporting**: Generate regulatory compliance reports
 * - **Real-time Analytics**: Process and analyze data in real-time
 * - **Data Integration**: Integrate data from multiple sources
 * - **Backup and Archival**: Automated backup and data archival
 * - **Performance Monitoring**: Monitor application and database performance
 * - **Security Auditing**: Track and audit database access and changes
 * - **Content Management**: Backend for content management systems
 * - **IoT Data Processing**: Store and process IoT sensor data
 * - **Machine Learning**: Feature engineering and model training data
 * - **Document Management**: Store and retrieve document metadata
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftSqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftSql',
  displayName: 'Microsoft SQL Server',
  description: 'Execute SQL queries, insert, update, and delete data in Microsoft SQL Server databases.',
  category: 'Action Nodes',
  subcategory: 'Databases',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'executeQuery',
      description: 'Operation to perform',
      options: [
        {
          name: 'Execute Query',
          value: 'executeQuery',
          description: 'Execute an SQL query'
        },
        {
          name: 'Insert',
          value: 'insert',
          description: 'Insert rows in database'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update rows in database'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete rows in database'
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
      description: 'Name of the table to operate on',
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
      name: 'microsoftSql',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Microsoft SQL'
  },

  aliases: ['mssql', 'sql server', 'tsql', 'database'],
  
  examples: [
    {
      name: 'Execute SQL Query',
      description: 'Execute a SELECT query to retrieve data',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SQL',
            type: 'n8n-nodes-base.microsoftSql',
            parameters: {
              operation: 'executeQuery',
              query: 'SELECT * FROM users WHERE active = 1'
            }
          }
        ]
      }
    },
    {
      name: 'Insert Data',
      description: 'Insert new records into a database table',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SQL',
            type: 'n8n-nodes-base.microsoftSql',
            parameters: {
              operation: 'insert',
              table: 'users'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftSqlNode;
