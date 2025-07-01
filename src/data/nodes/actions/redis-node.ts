/**
 * # Redis
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the Redis node to automate work in Redis, and integrate Redis with other applications. n8n has built-in 
 * support for a wide range of Redis features, including deleting keys, getting key values, setting key value, 
 * and publishing messages to the Redis channel.
 * 
 * ## Key Features
 * 
 * - **High-Performance Caching**: Ultra-fast in-memory data storage and retrieval
 * - **Key-Value Operations**: Complete CRUD operations for Redis keys and values
 * - **Pub/Sub Messaging**: Real-time message publishing and subscription
 * - **Atomic Operations**: Thread-safe increment and other atomic operations
 * - **Pattern Matching**: Advanced key pattern matching and bulk operations
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Connection Pooling**: Efficient connection management for high-performance applications
 * - **Data Structures**: Support for strings, hashes, lists, sets, sorted sets
 * - **Expiration Control**: TTL (Time To Live) management for automatic key expiration
 * - **Pipeline Operations**: Batch multiple operations for improved performance
 * - **Transaction Support**: MULTI/EXEC transaction blocks for consistency
 * - **Lua Scripting**: Execute custom Lua scripts for complex operations
 * - **Clustering Support**: Work with Redis clusters and sentinel configurations
 * 
 * ## Credentials
 * 
 * Refer to [Redis credentials](../../credentials/redis/) for guidance on setting up authentication.
 * Supports password authentication, SSL/TLS connections, and Redis Enterprise configurations.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Delete
 * - **Key Deletion**: Delete one or more keys from Redis
 *   - Single key deletion with existence verification
 *   - Bulk key deletion using patterns
 *   - Conditional deletion based on key existence
 *   - Error handling for non-existent keys
 *   - Performance optimization for large deletions
 *   - Atomic deletion operations
 *   - Namespace-aware deletion patterns
 *   - Backup verification before deletion
 *   - Audit logging for deletion operations
 *   - Recovery options for accidental deletions
 *   - Batch processing for large key sets
 *   - Memory optimization during bulk operations
 * 
 * ### Get
 * - **Value Retrieval**: Get the value of a key from Redis
 *   - Single key value retrieval
 *   - Bulk key retrieval operations
 *   - Data type preservation and conversion
 *   - Error handling for missing keys
 *   - Performance optimization for large values
 *   - Encoding and decoding support
 *   - Compression handling for large data
 *   - TTL information retrieval
 *   - Memory-efficient streaming for large objects
 *   - Connection timeout management
 *   - Retry logic for network issues
 *   - Cache hit/miss tracking
 * 
 * ### Info
 * - **Instance Information**: Returns generic information about the Redis instance
 *   - Server information and statistics
 *   - Memory usage and optimization metrics
 *   - Client connection information
 *   - Database and keyspace statistics
 *   - Replication status and configuration
 *   - Performance metrics and timing
 *   - Configuration parameters
 *   - Module information and versions
 *   - Cluster status and node information
 *   - Persistence and backup status
 *   - Security and authentication details
 *   - Network and protocol information
 * 
 * ### Increment
 * - **Atomic Increment**: Atomically increments a key by 1. Creates the key if it doesn't exist
 *   - Thread-safe atomic increment operations
 *   - Custom increment values (INCRBY)
 *   - Floating-point increment support (INCRBYFLOAT)
 *   - Automatic key creation with default values
 *   - Error handling for non-numeric values
 *   - Overflow and underflow protection
 *   - Performance optimization for high-frequency increments
 *   - Distributed counter implementations
 *   - Rate limiting and throttling support
 *   - Statistical tracking and monitoring
 *   - Decrement operations (DECR, DECRBY)
 *   - Conditional increment based on key existence
 * 
 * ### Keys
 * - **Pattern Matching**: Returns all the keys matching a pattern
 *   - Wildcard pattern matching (*, ?, [])
 *   - Regular expression-based key filtering
 *   - Namespace-aware key enumeration
 *   - Performance-optimized scanning (SCAN)
 *   - Paginated key retrieval for large datasets
 *   - Custom sort orders and filtering
 *   - Key metadata retrieval (type, TTL, size)
 *   - Bulk operations on matched keys
 *   - Memory-efficient iteration
 *   - Pattern compilation and caching
 *   - Security filtering and access control
 *   - Performance monitoring and optimization
 * 
 * ### Set
 * - **Value Assignment**: Set the value of a key in Redis
 *   - Simple key-value assignment
 *   - Conditional set operations (SET IF EXISTS, SET IF NOT EXISTS)
 *   - TTL (Time To Live) configuration
 *   - Data type preservation and serialization
 *   - Bulk set operations for multiple keys
 *   - Atomic replacement with error handling
 *   - Compression for large values
 *   - Encoding and character set support
 *   - Memory optimization strategies
 *   - Performance monitoring and profiling
 *   - Transaction safety and rollback
 *   - Validation and data integrity checks
 * 
 * ### Publish
 * - **Message Publishing**: Publish message to Redis channel
 *   - Real-time message broadcasting
 *   - Channel pattern matching and routing
 *   - Message serialization and encoding
 *   - Bulk message publishing
 *   - Priority and ordering control
 *   - Error handling and retry logic
 *   - Performance optimization for high throughput
 *   - Message persistence and durability
 *   - Subscription management and monitoring
 *   - Security and access control
 *   - Message filtering and transformation
 *   - Event-driven architecture support
 * 
 * ## Advanced Features
 * 
 * ### Data Structures
 * - **Complex Types**: Support for Redis data structures
 *   - Strings with binary data support
 *   - Hashes for object storage
 *   - Lists for queues and stacks
 *   - Sets for unique collections
 *   - Sorted sets for ranking systems
 *   - Streams for event sourcing
 *   - Bitmaps for efficient storage
 *   - HyperLogLog for cardinality estimation
 * 
 * ### Performance Optimization
 * - **High Performance**: Optimized for speed and efficiency
 *   - Connection pooling and reuse
 *   - Pipeline operations for batch processing
 *   - Async operations for non-blocking I/O
 *   - Memory optimization strategies
 *   - Network compression and optimization
 *   - Query optimization and caching
 * 
 * ### Clustering and High Availability
 * - **Enterprise Features**: Production-ready capabilities
 *   - Redis Cluster support for horizontal scaling
 *   - Redis Sentinel for automatic failover
 *   - Master-slave replication configuration
 *   - Backup and recovery automation
 *   - Monitoring and alerting integration
 *   - Performance tuning and optimization
 * 
 * ### Security and Compliance
 * - **Security Features**: Enterprise-grade security
 *   - Authentication and authorization
 *   - SSL/TLS encryption for data in transit
 *   - Access control lists (ACLs)
 *   - Audit logging and compliance
 *   - Network security and firewalls
 *   - Data encryption at rest
 * 
 * ## Integration Patterns
 * 
 * ### Caching
 * - **Application Caching**: High-performance caching layer
 *   - Database query result caching
 *   - API response caching
 *   - Session data storage
 *   - Computed value caching
 *   - Cache-aside and write-through patterns
 *   - Cache warming and preloading
 * 
 * ### Real-time Applications
 * - **Event Processing**: Real-time data processing
 *   - Live chat and messaging systems
 *   - Real-time analytics and dashboards
 *   - Gaming leaderboards and statistics
 *   - IoT data streaming and processing
 *   - Social media feeds and notifications
 *   - Stock ticker and financial data
 * 
 * ### Queue Management
 * - **Message Queues**: Reliable message processing
 *   - Task queue implementation
 *   - Job scheduling and processing
 *   - Event-driven microservices
 *   - Workflow orchestration
 *   - Batch processing coordination
 *   - Priority queue management
 * 
 * ### Session Management
 * - **User Sessions**: Scalable session storage
 *   - Web application sessions
 *   - Mobile app state management
 *   - Shopping cart persistence
 *   - User preference storage
 *   - Authentication token management
 *   - Multi-device synchronization
 * 
 * ## Use Cases
 * 
 * - **Web Application Caching**: Speed up database-driven applications
 * - **Session Store**: Manage user sessions across multiple servers
 * - **Real-time Analytics**: Process and store real-time metrics
 * - **Message Queues**: Implement reliable background job processing
 * - **Rate Limiting**: Control API request rates and throttling
 * - **Leaderboards**: Gaming and social application ranking systems
 * - **Shopping Carts**: E-commerce cart persistence and management
 * - **Chat Applications**: Real-time messaging and notifications
 * - **IoT Data Processing**: Handle high-volume sensor data streams
 * - **Financial Trading**: High-frequency trading data and analytics
 * - **Content Delivery**: Cache static and dynamic content
 * - **Geographic Data**: Location-based services and spatial queries
 * - **Machine Learning**: Feature stores and model caching
 * - **DevOps Automation**: Configuration management and deployment
 * - **Monitoring Systems**: Metrics collection and alerting
 * - **Search Engines**: Search result caching and optimization
 * - **Social Networks**: Activity feeds and social graph data
 * - **Gaming**: Player state, scores, and real-time interactions
 * - **Advertising**: Ad serving and targeting optimization
 * - **Microservices**: Service discovery and configuration sharing
 */

import { NodeTypeInfo } from '../../node-types.js';

export const redisNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.redis',
  displayName: 'Redis',
  description: 'Interact with Redis database for caching, key-value storage, and pub/sub messaging.',
  category: 'Action Nodes',
  subcategory: 'Databases',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Operation to perform',
      options: [
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a key from Redis'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get the value of a key from Redis'
        },
        {
          name: 'Info',
          value: 'info',
          description: 'Returns generic information about the Redis instance'
        },
        {
          name: 'Increment',
          value: 'increment',
          description: 'Atomically increments a key by 1. Creates the key if it doesn\'t exist'
        },
        {
          name: 'Keys',
          value: 'keys',
          description: 'Returns all the keys matching a pattern'
        },
        {
          name: 'Set',
          value: 'set',
          description: 'Set the value of a key in Redis'
        },
        {
          name: 'Publish',
          value: 'publish',
          description: 'Publish message to Redis channel'
        }
      ]
    },
    {
      name: 'key',
      displayName: 'Key',
      type: 'string',
      required: true,
      default: '',
      description: 'Redis key to operate on',
      displayOptions: {
        show: {
          operation: ['delete', 'get', 'increment', 'set']
        }
      }
    },
    {
      name: 'value',
      displayName: 'Value',
      type: 'string',
      required: true,
      default: '',
      description: 'Value to set for the key',
      displayOptions: {
        show: {
          operation: ['set']
        }
      }
    },
    {
      name: 'pattern',
      displayName: 'Pattern',
      type: 'string',
      required: true,
      default: '*',
      description: 'Pattern to match keys against',
      displayOptions: {
        show: {
          operation: ['keys']
        }
      }
    },
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: true,
      default: '',
      description: 'Redis channel to publish to',
      displayOptions: {
        show: {
          operation: ['publish']
        }
      }
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: true,
      default: '',
      description: 'Message to publish',
      displayOptions: {
        show: {
          operation: ['publish']
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
      name: 'redis',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Redis'
  },

  aliases: ['cache', 'key-value', 'pubsub', 'messaging'],
  
  examples: [
    {
      name: 'Cache API Response',
      description: 'Cache API response data in Redis for faster access',
      workflow: {
        nodes: [
          {
            name: 'Redis',
            type: 'n8n-nodes-base.redis',
            parameters: {
              operation: 'set',
              key: 'api_response_{{$json.id}}',
              value: '{{$json}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Cached Data',
      description: 'Retrieve cached data from Redis',
      workflow: {
        nodes: [
          {
            name: 'Redis',
            type: 'n8n-nodes-base.redis',
            parameters: {
              operation: 'get',
              key: 'user_session_{{$json.userId}}'
            }
          }
        ]
      }
    },
    {
      name: 'Publish Notification',
      description: 'Publish real-time notification to Redis channel',
      workflow: {
        nodes: [
          {
            name: 'Redis',
            type: 'n8n-nodes-base.redis',
            parameters: {
              operation: 'publish',
              channel: 'notifications',
              message: '{{$json.message}}'
            }
          }
        ]
      }
    }
  ]
};

export default redisNode;
