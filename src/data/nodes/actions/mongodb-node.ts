/**
 * # MongoDB
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Databases
 * 
 * ## Description
 * 
 * Use the MongoDB node to automate work in MongoDB, and integrate MongoDB with other applications. 
 * n8n has built-in support for a wide range of MongoDB features, including aggregating, updating, 
 * finding, deleting, and getting documents.
 * 
 * ## Key Features
 * 
 * - **Complete Document Operations**: Aggregate, Delete, Find, Find and Replace, Find and Update, Insert, Update
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Aggregation Pipeline**: Complex data processing, analytics, and transformation operations
 * - **Flexible Document Management**: Schema-less document storage with dynamic structures
 * - **Advanced Querying**: Rich query language with complex filters and conditions
 * - **Atomic Operations**: Find and replace, find and update operations in single atomic actions
 * - **Bulk Operations**: Efficient handling of multiple documents in single operations
 * - **Index Support**: Leverage MongoDB indexes for optimized query performance
 * - **Geospatial Capabilities**: Location-based queries and geographic data operations
 * - **GridFS Integration**: Large file storage and retrieval capabilities
 * - **JSON/BSON Native**: Native support for JSON documents and BSON data types
 * - **Scalable Architecture**: Horizontal scaling and distributed database support
 * - **Real-time Operations**: High-performance operations for real-time applications
 * 
 * ## Credentials
 * 
 * Refer to [MongoDB credentials](../../credentials/mongodb/) for guidance on setting up authentication.
 * Supports MongoDB connection strings, authentication methods, and SSL/TLS configurations.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * - **Aggregate documents**: Execute complex aggregation pipelines for data analysis and transformation
 * - **Delete documents**: Remove documents from collections based on filter criteria
 * - **Find documents**: Query and retrieve documents with flexible filtering and sorting
 * - **Find and replace documents**: Atomically find and replace documents in a single operation
 * - **Find and update documents**: Atomically find and update documents with upsert capabilities
 * - **Insert documents**: Add new documents to collections with validation and indexing
 * - **Update documents**: Modify existing documents with flexible update operators
 * 
 * ## Advanced Features
 * 
 * ### Aggregation Pipeline
 * Execute sophisticated data processing pipelines with stages like:
 * - `$match`: Filter documents
 * - `$group`: Group and aggregate data
 * - `$project`: Transform document structure
 * - `$sort`: Sort results
 * - `$lookup`: Join collections
 * - `$unwind`: Deconstruct arrays
 * 
 * ### Atomic Operations
 * - **Find and Replace**: Atomically find and replace entire documents
 * - **Find and Update**: Atomically find and update specific fields with upsert support
 * 
 * ### Query Capabilities
 * - Complex filter expressions with MongoDB query operators
 * - Regular expressions and text search
 * - Geospatial queries for location-based data
 * - Range queries and compound conditions
 * 
 * ## Related Resources
 * 
 * Refer to [MongoDB's official documentation](https://docs.mongodb.com/) for comprehensive guides 
 * on query syntax, aggregation framework, and best practices.
 * 
 * ## Use Cases
 * 
 * - **Real-time Applications**: Chat systems, live dashboards, and real-time analytics
 * - **Content Management**: Media storage, article management, and digital asset organization
 * - **IoT & Sensor Data**: Time-series data, device monitoring, and sensor data aggregation
 * - **E-commerce Platforms**: Product catalogs, inventory management, and recommendation engines
 * - **User Management**: Profile storage, authentication, and personalization data
 * - **Analytics & Logging**: Event tracking, log aggregation, and business intelligence
 * - **Social Networks**: User profiles, social graphs, and activity feeds
 * - **Gaming Applications**: Player data, game state, and leaderboards
 * - **Mobile Applications**: Offline-first data, synchronization, and user-generated content
 * - **AI & Machine Learning**: Feature stores, training data, and model metadata
 * - **Document Storage**: Flexible schema document management and version control
 * - **API Backend**: RESTful API data layer with flexible document structures
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mongodbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mongodb',
  displayName: 'MongoDB',
  description: 'Perform operations on MongoDB NoSQL database collections and documents.',
  category: 'Action Nodes',
  subcategory: 'Databases',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'find',
      description: 'Operation to perform on MongoDB',
      options: [
        {
          name: 'Find',
          value: 'find',
          description: 'Find documents in collection'
        },
        {
          name: 'Insert',
          value: 'insert',
          description: 'Insert documents into collection'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update documents in collection'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete documents from collection'
        },
        {
          name: 'Aggregate',
          value: 'aggregate',
          description: 'Execute aggregation pipeline'
        }
      ]
    },
    {
      name: 'collection',
      displayName: 'Collection',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the collection'
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
      name: 'mongoDb',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'MongoDB'
  },

  aliases: ['mongo', 'nosql', 'document'],
  
  examples: [
    {
      name: 'Find Documents',
      description: 'Find documents in MongoDB collection',
      workflow: {
        nodes: [
          {
            name: 'MongoDB',
            type: 'n8n-nodes-base.mongodb',
            parameters: {
              operation: 'find',
              collection: 'users',
              query: '{"active": true}'
            }
          }
        ]
      }
    }
  ]
};

export default mongodbNode;
