/**
 * # AWS DynamoDB
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the AWS DynamoDB node to automate work in AWS DynamoDB and integrate AWS DynamoDB 
 * with other applications. n8n has built-in support for a wide range of AWS DynamoDB features, 
 * including creating, reading, updating, deleting items, and records on a database. 
 * DynamoDB is Amazon's fully managed NoSQL database service that provides fast and 
 * predictable performance with seamless scalability.
 * 
 * ## Key Features
 * 
 * - **Fully Managed**: No server maintenance, patching, or administration required
 * - **Serverless**: Automatic scaling with pay-per-use pricing model
 * - **High Performance**: Single-digit millisecond latency at any scale
 * - **Global Tables**: Multi-region, fully replicated tables for global applications
 * - **ACID Transactions**: Support for complex business logic with full consistency
 * - **Point-in-Time Recovery**: Continuous backups for data protection and compliance
 * - **Encryption at Rest**: Built-in security with AWS Key Management Service
 * - **DynamoDB Streams**: Real-time data change notifications and triggers
 * - **Auto Scaling**: Automatic capacity adjustment based on traffic patterns
 * - **DAX Integration**: Microsecond latency with DynamoDB Accelerator
 * - **PartiQL Support**: SQL-like query language for familiar syntax
 * - **Global Secondary Indexes**: Flexible querying patterns beyond primary key
 * - **Local Secondary Indexes**: Additional sort key options for complex queries
 * - **Time to Live (TTL)**: Automatic item expiration for temporal data
 * - **On-Demand Billing**: Pay only for read and write requests you use
 * 
 * ## Credentials
 * 
 * Refer to [AWS credentials](../../credentials/aws/) for guidance on setting up authentication.
 * Supports AWS Access Key ID and Secret Access Key or IAM roles for secure access.
 * 
 * ## Operations
 * 
 * ### Item Operations
 * - **Upsert/Put Item**: Create a new record or update existing one if it already exists
 * - **Delete Item**: Remove an item from the table using primary key
 * - **Get Item**: Retrieve a single item by primary key with eventual or strong consistency
 * - **Get All Items**: Query or scan table to retrieve multiple items with filtering
 * 
 * ## Common Integration Patterns
 * 
 * ### Real-time Application Data
 * - User session management and authentication state storage
 * - Real-time chat and messaging systems with conversation history
 * - Gaming leaderboards and player statistics tracking
 * - IoT device data collection and sensor reading storage
 * - Live event tracking and analytics data aggregation
 * - Shopping cart and e-commerce transaction processing
 * - Content recommendation engine data and user preferences
 * - Social media timeline and activity feed management
 * - Financial transaction logging and audit trail maintenance
 * - Inventory management and stock level monitoring
 * - Customer support ticket tracking and case management
 * - Multi-tenant application data isolation and management
 * 
 * ### Microservices Architecture
 * - Service-specific data storage with independent scaling capabilities
 * - Event sourcing and CQRS pattern implementation for complex workflows
 * - API rate limiting and throttling data with time-based expiration
 * - Distributed session management across multiple application instances
 * - Configuration management and feature flag storage for dynamic updates
 * - Message queuing and task scheduling with priority handling
 * - Distributed locking mechanisms for coordinated resource access
 * - Service discovery and health check status tracking
 * - Audit logging and compliance data retention for regulatory requirements
 * - Cross-service data sharing and synchronization patterns
 * - Circuit breaker pattern implementation with failure state tracking
 * - Metrics and monitoring data collection for operational insights
 * 
 * ### Data Processing Pipelines
 * - Stream processing intermediate results and checkpoint storage
 * - ETL pipeline metadata and processing status tracking
 * - Data quality validation results and error logging
 * - Batch job coordination and distributed task management
 * - Machine learning model metadata and training data indexing
 * - Data lineage tracking and dependency mapping for governance
 * - Real-time analytics aggregation and summary table maintenance
 * - Data archival scheduling and lifecycle management automation
 * - Backup and disaster recovery orchestration data
 * - Performance monitoring and optimization metrics collection
 * - Data transformation rule storage and versioning control
 * - Pipeline scheduling and dependency resolution information
 * 
 * ## Example Use Cases
 * 
 * ### E-commerce Platform
 * ```typescript
 * // Product catalog management
 * const product = await dynamodb.putItem({
 *   tableName: 'products',
 *   item: {
 *     productId: 'PROD-12345',
 *     name: 'Wireless Headphones',
 *     category: 'electronics',
 *     price: 99.99,
 *     inventory: 150,
 *     lastUpdated: new Date().toISOString()
 *   }
 * });
 * 
 * // Shopping cart operations
 * await dynamodb.upsertItem({
 *   tableName: 'shopping-carts',
 *   key: { userId: 'user-456', sessionId: 'sess-789' },
 *   updateExpression: 'ADD items :item SET lastModified = :timestamp',
 *   values: {
 *     item: [{ productId: 'PROD-12345', quantity: 2 }],
 *     timestamp: Date.now()
 *   }
 * });
 * ```
 * 
 * ### IoT Data Collection
 * ```typescript
 * // Sensor data ingestion
 * const sensorReading = await dynamodb.putItem({
 *   tableName: 'sensor-data',
 *   item: {
 *     deviceId: 'sensor-001',
 *     timestamp: Date.now(),
 *     temperature: 22.5,
 *     humidity: 65.2,
 *     location: { lat: 40.7128, lng: -74.0060 },
 *     ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
 *   }
 * });
 * 
 * // Device status tracking
 * await dynamodb.updateItem({
 *   tableName: 'device-status',
 *   key: { deviceId: 'sensor-001' },
 *   updateExpression: 'SET lastSeen = :timestamp, status = :status',
 *   values: {
 *     timestamp: new Date().toISOString(),
 *     status: 'online'
 *   }
 * });
 * ```
 * 
 * ### User Management System
 * ```typescript
 * // User profile operations
 * const userProfile = await dynamodb.getItem({
 *   tableName: 'user-profiles',
 *   key: { userId: 'user-123' },
 *   projectionExpression: 'userId, email, firstName, lastName, preferences'
 * });
 * 
 * // Session management
 * await dynamodb.putItem({
 *   tableName: 'user-sessions',
 *   item: {
 *     sessionId: 'sess-abc123',
 *     userId: 'user-123',
 *     createdAt: Date.now(),
 *     expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
 *     ipAddress: '192.168.1.100',
 *     userAgent: 'Mozilla/5.0...'
 *   }
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Transcribe Audio Files from Cloud Storage**: Audio processing with metadata storage
 * - **Extract and Store Text from Chat Images**: OCR processing with result storage
 * - **Sync Data Between Google Drive and AWS S3**: Multi-cloud data synchronization
 * - **Real-time Chat Application**: Message storage and retrieval system
 * - **IoT Sensor Data Pipeline**: Device data collection and aggregation
 * - **User Session Management**: Authentication and session tracking
 * - **E-commerce Product Catalog**: Inventory and pricing management
 * - **Gaming Leaderboard System**: Player statistics and ranking storage
 * - **Content Management System**: Article and media metadata storage
 * - **Financial Transaction Log**: Payment processing and audit trails
 * - **Customer Support Ticketing**: Case management and history tracking
 * - **Social Media Timeline**: User activity and content feed management
 * 
 * ## Best Practices
 * 
 * ### Table Design and Schema
 * - Design single-table patterns to minimize costs and improve performance
 * - Use composite primary keys (partition key + sort key) for flexible access patterns
 * - Implement proper data modeling with entity-attribute-value patterns when appropriate
 * - Plan for query patterns upfront and design GSIs accordingly
 * - Use sparse indexes to optimize storage and query performance
 * - Implement hierarchical data structures using sort key prefixes
 * - Design for high cardinality partition keys to ensure even data distribution
 * - Use time-based partitioning for time-series data to manage hot partitions
 * - Implement proper naming conventions for consistent schema management
 * - Plan for data growth and access pattern evolution over time
 * - Use DynamoDB best practices for item size and attribute optimization
 * - Implement proper data validation and constraint checking in application logic
 * 
 * ### Performance Optimization
 * - Use batch operations for multiple item reads and writes to improve throughput
 * - Implement exponential backoff for retry logic to handle throttling gracefully
 * - Optimize query patterns to avoid expensive scan operations when possible
 * - Use projection expressions to retrieve only required attributes
 * - Implement proper pagination for large result sets to manage memory usage
 * - Cache frequently accessed data to reduce DynamoDB read costs
 * - Use DynamoDB Accelerator (DAX) for microsecond latency requirements
 * - Monitor and optimize read/write capacity units based on traffic patterns
 * - Implement proper error handling and circuit breaker patterns
 * - Use consistent naming conventions for efficient attribute access
 * - Optimize item size and structure for network transfer efficiency
 * - Implement proper indexing strategies for complex query requirements
 * 
 * ### Security and Compliance
 * - Implement least privilege access with specific IAM policies and roles
 * - Use AWS KMS for encryption at rest with customer-managed keys
 * - Enable encryption in transit for all client communications
 * - Implement proper data masking and anonymization for sensitive information
 * - Use VPC endpoints for secure communication within AWS network
 * - Implement proper audit logging with CloudTrail for compliance requirements
 * - Use fine-grained access control with condition-based IAM policies
 * - Implement data classification and tagging for regulatory compliance
 * - Set up proper backup and point-in-time recovery for data protection
 * - Monitor access patterns and implement anomaly detection for security
 * - Use AWS Config for compliance monitoring and configuration management
 * - Implement proper data retention and deletion policies for privacy regulations
 */

export const awsDynamodbNode = {
  displayName: 'AWS DynamoDB',
  name: 'awsDynamodb',
  group: ['transform'],
  version: 1,
  icon: 'file:awsdynamodb.svg',
  description: 'Fully managed NoSQL database service with fast performance and seamless scalability',
  defaults: {
    name: 'AWS DynamoDB',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'aws',
      required: true,
    },
  ],
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Item',
          value: 'item',
          description: 'Perform operations on DynamoDB items',
        },
      ],
      default: 'item',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['item'],
        },
      },
      options: [
        {
          name: 'Create/Update (Upsert)',
          value: 'upsert',
          description: 'Create a new record or update existing one',
          action: 'Create or update an item',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an item',
          action: 'Delete an item',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an item',
          action: 'Get an item',
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all items',
          action: 'Get all items',
        },
      ],
      default: 'upsert',
    },
  ],
};
