/**
 * # Elasticsearch
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Search & Analytics
 * 
 * ## Description
 * 
 * Use the Elasticsearch node to automate work in Elasticsearch, and integrate Elasticsearch with other applications. 
 * n8n has built-in support for a wide range of Elasticsearch features, including creating, updating, deleting, and 
 * getting documents and indexes. Elasticsearch is a distributed, RESTful search and analytics engine capable of 
 * addressing a growing number of use cases including real-time search, analytics, logging, and data exploration.
 * 
 * ## Key Features
 * 
 * - **Full-Text Search**: Advanced text search capabilities with relevance scoring and complex queries
 * - **Real-Time Data**: Near real-time search and indexing for immediate data availability
 * - **Scalable Architecture**: Horizontally scalable with automatic sharding and replication
 * - **RESTful API**: Simple HTTP/JSON API for all operations and integrations
 * - **Multi-Tenant**: Support for multiple indexes and types within a single cluster
 * - **Analytics Engine**: Powerful aggregations for data analysis and visualization
 * - **Distributed System**: Built-in clustering with automatic node discovery and load balancing
 * - **Document Store**: JSON document storage with flexible schema and dynamic mapping
 * - **Query DSL**: Rich query language supporting complex searches and filters
 * - **Geospatial Search**: Location-based search and geo-distance calculations
 * - **Auto-Completion**: Suggest and completion features for search-as-you-type functionality
 * - **Machine Learning**: Anomaly detection and data frame analytics capabilities
 * - **Security**: Authentication, authorization, and encryption for enterprise deployments
 * - **Monitoring**: Built-in monitoring and alerting for cluster health and performance
 * - **Index Management**: Lifecycle policies for automated index rotation and cleanup
 * 
 * ## Credentials
 * 
 * Refer to [Elasticsearch credentials](../../credentials/elasticsearch/) for guidance on setting up authentication.
 * Supports various authentication methods including basic auth, API key, and certificate-based authentication.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI - find out more in the 
 * [AI tool parameters documentation](../../../../advanced-ai/examples/using-the-fromai-function/).
 * 
 * ## Operations
 * 
 * ### Document Operations
 * - **Create**: Create a new document in an index with automatic or custom ID
 * - **Delete**: Remove a document from an index by ID
 * - **Get**: Retrieve a specific document by ID with optional field filtering
 * - **Get All**: Search and retrieve multiple documents with query and pagination
 * - **Update**: Modify existing document fields or perform scripted updates
 * 
 * ### Index Operations
 * - **Create**: Create a new index with custom settings and mappings
 * - **Delete**: Remove an index and all its documents permanently
 * - **Get**: Retrieve index information including settings and mappings
 * - **Get All**: List all available indexes in the cluster with metadata
 * 
 * ## Common Integration Patterns
 * 
 * ### Search and Discovery Systems
 * - E-commerce product search with faceted navigation and filtering capabilities
 * - Content management system search for articles, documents, and media files
 * - Knowledge base search for documentation, FAQs, and help articles
 * - Website search functionality with auto-complete and suggestion features
 * - Enterprise search across multiple data sources and document repositories
 * - Academic research databases with advanced query and citation capabilities
 * - Legal document search with case law and regulation indexing
 * - Medical literature search with specialized terminology and classification
 * - Real estate property search with location and feature-based filtering
 * - Job board search with skill matching and salary range filtering
 * - Social media content search with hashtag and mention indexing
 * - News and media search with temporal and topic-based organization
 * 
 * ### Analytics and Business Intelligence
 * - Real-time dashboard data aggregation and metric calculation
 * - User behavior analytics with session tracking and conversion funnels
 * - Application performance monitoring with error tracking and alerting
 * - Financial transaction analysis with fraud detection and pattern recognition
 * - Marketing campaign analytics with attribution and ROI measurement
 * - Customer segmentation analysis with demographic and behavioral clustering
 * - Inventory analytics with demand forecasting and optimization insights
 * - Web analytics with page views, bounce rates, and user journey mapping
 * - Sales performance analytics with territory and product line analysis
 * - Supply chain analytics with logistics and delivery performance tracking
 * - Quality assurance analytics with defect tracking and root cause analysis
 * - Security analytics with threat detection and incident response metrics
 * 
 * ### Logging and Monitoring Infrastructure
 * - Centralized application log aggregation from multiple services and environments
 * - System metrics collection with server performance and resource utilization
 * - Security event logging with intrusion detection and audit trail maintenance
 * - Error tracking and exception monitoring with stack trace analysis
 * - Performance monitoring with response time and throughput measurements
 * - Infrastructure monitoring with network, storage, and compute resource tracking
 * - Container and microservices logging with distributed tracing correlation
 * - API usage monitoring with rate limiting and quota management analytics
 * - Database query performance monitoring with slow query identification
 * - Network traffic analysis with bandwidth usage and protocol distribution
 * - Compliance logging with regulatory requirement tracking and reporting
 * - DevOps pipeline monitoring with build, test, and deployment metrics
 * 
 * ## Example Use Cases
 * 
 * ### E-commerce Product Search
 * ```typescript
 * // Index product data
 * const product = await elasticsearch.create({
 *   index: 'products',
 *   body: {
 *     name: 'Wireless Bluetooth Headphones',
 *     description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
 *     category: 'Electronics',
 *     subcategory: 'Audio',
 *     brand: 'TechBrand',
 *     price: 199.99,
 *     availability: 'in-stock',
 *     ratings: {
 *       average: 4.5,
 *       count: 1247
 *     },
 *     features: ['noise-canceling', 'wireless', 'long-battery', 'premium-sound'],
 *     specifications: {
 *       batteryLife: '30 hours',
 *       connectivity: 'Bluetooth 5.0',
 *       weight: '250g'
 *     },
 *     location: {
 *       warehouse: 'US-East',
 *       coordinates: {
 *         lat: 40.7128,
 *         lon: -74.0060
 *       }
 *     }
 *   }
 * });
 * 
 * // Search products with filters and aggregations
 * const searchResults = await elasticsearch.getAll({
 *   index: 'products',
 *   body: {
 *     query: {
 *       bool: {
 *         must: [
 *           {
 *             multi_match: {
 *               query: 'wireless headphones',
 *               fields: ['name^3', 'description^2', 'features']
 *             }
 *           }
 *         ],
 *         filter: [
 *           { range: { price: { gte: 50, lte: 300 } } },
 *           { term: { availability: 'in-stock' } },
 *           { range: { 'ratings.average': { gte: 4.0 } } }
 *         ]
 *       }
 *     },
 *     aggs: {
 *       categories: {
 *         terms: { field: 'category.keyword' }
 *       },
 *       priceRanges: {
 *         range: {
 *           field: 'price',
 *           ranges: [
 *             { from: 0, to: 100 },
 *             { from: 100, to: 300 },
 *             { from: 300 }
 *           ]
 *         }
 *       },
 *       brands: {
 *         terms: { field: 'brand.keyword' }
 *       }
 *     },
 *     sort: [
 *       { '_score': { order: 'desc' } },
 *       { 'ratings.average': { order: 'desc' } }
 *     ]
 *   }
 * });
 * ```
 * 
 * ### Application Logging and Monitoring
 * ```typescript
 * // Index application logs
 * const logEntry = await elasticsearch.create({
 *   index: 'app-logs-2024.01',
 *   body: {
 *     timestamp: new Date().toISOString(),
 *     level: 'ERROR',
 *     service: 'user-authentication',
 *     environment: 'production',
 *     message: 'Failed to authenticate user: Invalid credentials',
 *     error: {
 *       type: 'AuthenticationError',
 *       code: 'INVALID_CREDENTIALS',
 *       stack: 'AuthenticationError: Invalid credentials...'
 *     },
 *     user: {
 *       id: 'user123',
 *       email: 'user@example.com',
 *       ipAddress: '192.168.1.100'
 *     },
 *     request: {
 *       method: 'POST',
 *       path: '/api/auth/login',
 *       userAgent: 'Mozilla/5.0...',
 *       duration: 234
 *     },
 *     metadata: {
 *       version: '1.2.3',
 *       nodeId: 'app-node-01',
 *       traceId: 'trace-abc123'
 *     }
 *   }
 * });
 * 
 * // Query for error patterns and trends
 * const errorAnalysis = await elasticsearch.getAll({
 *   index: 'app-logs-*',
 *   body: {
 *     query: {
 *       bool: {
 *         filter: [
 *           { term: { level: 'ERROR' } },
 *           { range: { timestamp: { gte: 'now-24h' } } }
 *         ]
 *       }
 *     },
 *     aggs: {
 *       errorsByService: {
 *         terms: { field: 'service.keyword' }
 *       },
 *       errorsByType: {
 *         terms: { field: 'error.type.keyword' }
 *       },
 *       errorsOverTime: {
 *         date_histogram: {
 *           field: 'timestamp',
 *           interval: '1h'
 *         }
 *       },
 *       topErrors: {
 *         terms: {
 *           field: 'error.code.keyword',
 *           size: 10
 *         }
 *       }
 *     }
 *   }
 * });
 * ```
 * 
 * ### Content Management and Search
 * ```typescript
 * // Index content documents
 * const article = await elasticsearch.create({
 *   index: 'content',
 *   body: {
 *     title: 'Getting Started with Elasticsearch',
 *     content: 'Elasticsearch is a powerful search engine that enables...',
 *     author: {
 *       name: 'John Smith',
 *       id: 'author123',
 *       email: 'john@company.com'
 *     },
 *     publishedDate: '2024-01-15T10:00:00Z',
 *     lastModified: '2024-01-16T14:30:00Z',
 *     status: 'published',
 *     categories: ['Technology', 'Search', 'Database'],
 *     tags: ['elasticsearch', 'search-engine', 'tutorial', 'beginner'],
 *     metadata: {
 *       wordCount: 1250,
 *       readingTime: 5,
 *       difficulty: 'beginner',
 *       language: 'en'
 *     },
 *     seo: {
 *       metaDescription: 'Learn the basics of Elasticsearch...',
 *       keywords: ['elasticsearch', 'search', 'indexing', 'queries']
 *     },
 *     engagement: {
 *       views: 1523,
 *       likes: 89,
 *       shares: 34,
 *       comments: 12
 *     }
 *   }
 * });
 * 
 * // Search content with highlighting and suggestions
 * const contentSearch = await elasticsearch.getAll({
 *   index: 'content',
 *   body: {
 *     query: {
 *       bool: {
 *         should: [
 *           {
 *             multi_match: {
 *               query: 'elasticsearch tutorial',
 *               fields: ['title^3', 'content', 'tags^2'],
 *               type: 'best_fields',
 *               fuzziness: 'AUTO'
 *             }
 *           },
 *           {
 *             match: {
 *               categories: 'Technology'
 *             }
 *           }
 *         ],
 *         filter: [
 *           { term: { status: 'published' } },
 *           { range: { publishedDate: { gte: 'now-1y' } } }
 *         ]
 *       }
 *     },
 *     highlight: {
 *       fields: {
 *         title: {},
 *         content: {
 *           fragment_size: 150,
 *           number_of_fragments: 3
 *         }
 *       }
 *     },
 *     suggest: {
 *       title_suggest: {
 *         text: 'elasticsearch tutorial',
 *         term: {
 *           field: 'title'
 *         }
 *       }
 *     }
 *   }
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Product Search Engine**: E-commerce search with faceting and recommendations
 * - **Log Analysis Dashboard**: Centralized logging with error tracking and alerting
 * - **Content Discovery Platform**: Knowledge base search with relevance ranking
 * - **User Behavior Analytics**: Session tracking and conversion funnel analysis
 * - **Security Event Monitoring**: Threat detection and incident response system
 * - **Performance Monitoring**: Application metrics and performance optimization
 * - **Inventory Management**: Real-time stock tracking and demand forecasting
 * - **Customer Support Search**: Ticket and knowledge base search integration
 * - **Financial Transaction Analysis**: Fraud detection and pattern recognition
 * - **Social Media Monitoring**: Brand mention tracking and sentiment analysis
 * - **Research Database**: Academic paper and citation search system
 * - **Real Estate Search**: Property listing with location-based filtering
 * 
 * ## Best Practices
 * 
 * ### Index Design and Management
 * - Design index mappings based on query patterns and data types
 * - Use appropriate field types (text, keyword, numeric, date, geo) for optimal performance
 * - Implement index templates for consistent mapping across time-based indexes
 * - Set up index lifecycle management (ILM) for automated rollover and cleanup
 * - Use index aliases for zero-downtime reindexing and version management
 * - Configure proper shard sizing (target 10-50GB per shard for optimal performance)
 * - Implement hot-warm-cold architecture for cost-effective data tiering
 * - Use custom analyzers for domain-specific text processing and tokenization
 * - Set appropriate refresh intervals based on real-time requirements
 * - Monitor index health and performance metrics regularly
 * - Implement backup and restore strategies for data protection
 * - Use index patterns and wildcards for efficient multi-index operations
 * 
 * ### Query Optimization and Performance
 * - Use filter contexts instead of query contexts for exact matches when possible
 * - Implement query caching strategies for frequently accessed data
 * - Optimize aggregations by using appropriate bucket sizes and sampling
 * - Use scroll or search_after for efficient large result set pagination
 * - Implement query profiling to identify and optimize slow queries
 * - Use bool queries to combine multiple query clauses efficiently
 * - Minimize the use of wildcard and regex queries on large datasets
 * - Implement proper field selection to reduce network overhead
 * - Use routing for better query distribution in multi-shard indexes
 * - Configure appropriate timeout values for long-running queries
 * - Implement query result caching at the application level when appropriate
 * - Use async search for long-running analytical queries
 * 
 * ### Security and Monitoring
 * - Implement proper authentication and authorization controls
 * - Use encrypted communication (TLS/SSL) for all client connections
 * - Configure audit logging for security compliance and investigation
 * - Implement field-level and document-level security when required
 * - Monitor cluster health, performance, and capacity metrics
 * - Set up alerting for critical errors, performance degradation, and capacity issues
 * - Implement proper backup and disaster recovery procedures
 * - Use security roles and privileges following the principle of least access
 * - Monitor and limit resource usage to prevent cluster overload
 * - Implement proper log retention and data governance policies
 * - Use anomaly detection for proactive issue identification
 * - Regular security updates and vulnerability assessments
 */

export const elasticsearchNode = {
  displayName: 'Elasticsearch',
  name: 'elasticsearch',
  group: ['transform'],
  version: 1,
  icon: 'file:elasticsearch.svg',
  description: 'Distributed search and analytics engine for real-time data processing',
  defaults: {
    name: 'Elasticsearch',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'elasticsearch',
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
          name: 'Document',
          value: 'document',
          description: 'Manage documents',
        },
        {
          name: 'Index',
          value: 'index',
          description: 'Manage indexes',
        },
      ],
      default: 'document',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['document'],
        },
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a document',
          action: 'Create a document',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a document',
          action: 'Delete a document',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a document',
          action: 'Get a document',
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all documents',
          action: 'Get all documents',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a document',
          action: 'Update a document',
        },
      ],
      default: 'create',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['index'],
        },
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create an index',
          action: 'Create an index',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an index',
          action: 'Delete an index',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an index',
          action: 'Get an index',
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all indexes',
          action: 'Get all indexes',
        },
      ],
      default: 'create',
    },
  ],
};
