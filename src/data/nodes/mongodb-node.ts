import { NodeTypeInfo } from '../node-types.js';

export const mongodbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mongodb',
  displayName: 'MongoDB',
  description: 'Use the MongoDB node to automate work in MongoDB, and integrate MongoDB with other applications. n8n has built-in support for a wide range of MongoDB features, including aggregating, updating, finding, deleting, and getting documents.',
  category: 'Database',
  subcategory: 'NoSQL',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'find',
      description: 'The operation to perform',
      options: [
        { name: 'Aggregate', value: 'aggregate', description: 'Aggregate documents using pipeline operations' },
        { name: 'Delete', value: 'delete', description: 'Delete documents from collection' },
        { name: 'Find', value: 'find', description: 'Find documents in collection' },
        { name: 'Find and Replace', value: 'findOneAndReplace', description: 'Find and replace a document' },
        { name: 'Find and Update', value: 'findOneAndUpdate', description: 'Find and update a document' },
        { name: 'Insert', value: 'insert', description: 'Insert documents into collection' },
        { name: 'Update', value: 'update', description: 'Update documents in collection' }
      ]
    },
    {
      name: 'collection',
      displayName: 'Collection',
      type: 'string',
      required: true,
      default: '',
      description: 'MongoDB collection to operate on'
    },
    {
      name: 'query',
      displayName: 'Query',
      type: 'json',
      required: false,
      default: '{}',
      description: 'MongoDB query to filter documents'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to return'
    },
    {
      name: 'sort',
      displayName: 'Sort',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Sort order for query results'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 0,
      description: 'Limit number of documents returned (0 = no limit)'
    },
    {
      name: 'skip',
      displayName: 'Skip',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of documents to skip'
    },
    {
      name: 'documents',
      displayName: 'Documents',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Documents to insert or update'
    },
    {
      name: 'updateDocument',
      displayName: 'Update Document',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Document with update operations'
    },
    {
      name: 'upsert',
      displayName: 'Upsert',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Create document if it does not exist'
    },
    {
      name: 'multi',
      displayName: 'Update Multiple',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Update multiple documents'
    },
    {
      name: 'pipeline',
      displayName: 'Aggregation Pipeline',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Array of aggregation pipeline stages'
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
      description: 'The processed MongoDB data'
    }
  ],
  credentials: ['mongodb'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Insert Documents',
      description: 'Insert multiple documents into a MongoDB collection',
      workflow: {
        nodes: [
          {
            name: 'MongoDB',
            type: 'n8n-nodes-base.mongodb',
            parameters: {
              operation: 'insert',
              collection: 'users',
              documents: '[{"name": "John Doe", "email": "john@example.com", "age": 30}, {"name": "Jane Smith", "email": "jane@example.com", "age": 25}]'
            }
          }
        ]
      }
    },
    {
      name: 'Find Documents',
      description: 'Find documents matching specific criteria',
      workflow: {
        nodes: [
          {
            name: 'MongoDB',
            type: 'n8n-nodes-base.mongodb',
            parameters: {
              operation: 'find',
              collection: 'users',
              query: '{"age": {"$gte": 25}}',
              sort: '{"name": 1}',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Update Documents',
      description: 'Update documents matching query criteria',
      workflow: {
        nodes: [
          {
            name: 'MongoDB',
            type: 'n8n-nodes-base.mongodb',
            parameters: {
              operation: 'update',
              collection: 'users',
              query: '{"age": {"$lt": 30}}',
              updateDocument: '{"$set": {"status": "young"}}',
              multi: true
            }
          }
        ]
      }
    },
    {
      name: 'Aggregate Documents',
      description: 'Use aggregation pipeline to process documents',
      workflow: {
        nodes: [
          {
            name: 'MongoDB',
            type: 'n8n-nodes-base.mongodb',
            parameters: {
              operation: 'aggregate',
              collection: 'sales',
              pipeline: '[{"$match": {"status": "completed"}}, {"$group": {"_id": "$product", "total": {"$sum": "$amount"}}}, {"$sort": {"total": -1}}]'
            }
          }
        ]
      }
    }
  ]
};

export const mongodbAtlasVectorStoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.vectorstoremongodbatlas',
  displayName: 'MongoDB Atlas Vector Store',
  description: 'MongoDB Atlas Vector Search is a feature of MongoDB Atlas that enables users to store and query vector embeddings. Use this node to interact with Vector Search indexes in your MongoDB Atlas collections.',
  category: 'AI',
  subcategory: 'Vector Stores',
  properties: [
    {
      name: 'mode',
      displayName: 'Operation Mode',
      type: 'options',
      required: true,
      default: 'load',
      description: 'The mode determines the operations available',
      options: [
        { name: 'Get Many', value: 'load', description: 'Retrieve multiple documents by providing a prompt' },
        { name: 'Insert Documents', value: 'insert', description: 'Insert new documents into vector database' },
        { name: 'Retrieve Documents (As Vector Store for Chain/Tool)', value: 'retrieve', description: 'Use with vector-store retriever for chains' },
        { name: 'Retrieve Documents (As Tool for AI Agent)', value: 'retrieveGenerative', description: 'Use as tool resource for AI agents' }
      ]
    },
    {
      name: 'mongoCollection',
      displayName: 'Mongo Collection',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the MongoDB collection to use'
    },
    {
      name: 'indexName',
      displayName: 'Vector Index Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the Vector Search index in your MongoDB Atlas collection'
    },
    {
      name: 'embeddingField',
      displayName: 'Embedding Field',
      type: 'string',
      required: true,
      default: 'embedding',
      description: 'Field name in documents that contains vector embeddings'
    },
    {
      name: 'textField',
      displayName: 'Metadata Field',
      type: 'string',
      required: true,
      default: 'text',
      description: 'Field name in documents that contains text metadata'
    },
    {
      name: 'toolName',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: 'mongodb_vector_store',
      description: 'Name of the vector store tool (for AI agent mode)'
    },
    {
      name: 'toolDescription',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: 'Search and retrieve documents from MongoDB Atlas vector store',
      description: 'Explain to the LLM what this tool does'
    },
    {
      name: 'topK',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 4,
      description: 'Number of results to retrieve from vector store'
    },
    {
      name: 'metadataFilter',
      displayName: 'Metadata Filter',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Filter results based on metadata'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Documents',
      required: false
    },
    {
      type: 'ai_embedding',
      displayName: 'Embedding',
      required: true
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Documents',
      description: 'Retrieved or processed documents'
    }
  ],
  credentials: ['mongodb'],
  regularNode: false,
  examples: [
    {
      name: 'Insert Documents into Vector Store',
      description: 'Insert documents with embeddings into MongoDB Atlas Vector Store',
      workflow: {
        nodes: [
          {
            name: 'MongoDB Atlas Vector Store',
            type: 'n8n-nodes-langchain.vectorstoremongodbatlas',
            parameters: {
              mode: 'insert',
              mongoCollection: 'documents',
              indexName: 'vector_index',
              embeddingField: 'embedding',
              textField: 'content'
            }
          }
        ]
      }
    },
    {
      name: 'Search Vector Store',
      description: 'Search for similar documents in vector store',
      workflow: {
        nodes: [
          {
            name: 'MongoDB Atlas Vector Store',
            type: 'n8n-nodes-langchain.vectorstoremongodbatlas',
            parameters: {
              mode: 'load',
              mongoCollection: 'documents',
              indexName: 'vector_index',
              embeddingField: 'embedding',
              textField: 'content',
              topK: 5
            }
          }
        ]
      }
    }
  ]
};

export const mongodbChatMemoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.memorymongochat',
  displayName: 'MongoDB Chat Memory',
  description: 'Use the MongoDB Chat Memory node to use MongoDB as a memory server for storing chat history.',
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
      name: 'collectionName',
      displayName: 'Collection Name',
      type: 'string',
      required: true,
      default: 'chat_history',
      description: 'Name of the collection to store chat history in'
    },
    {
      name: 'databaseName',
      displayName: 'Database Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the database to store chat history in (uses credential database if not provided)'
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
  credentials: ['mongodb'],
  regularNode: false,
  examples: [
    {
      name: 'Store Chat History',
      description: 'Store conversation history in MongoDB for AI memory',
      workflow: {
        nodes: [
          {
            name: 'MongoDB Chat Memory',
            type: 'n8n-nodes-langchain.memorymongochat',
            parameters: {
              sessionKey: 'user_chat_session',
              collectionName: 'conversations',
              contextWindowLength: 20
            }
          }
        ]
      }
    }
  ]
};

// Export all MongoDB nodes as an array for easier importing
export const mongodbNodes: NodeTypeInfo[] = [
  mongodbNode,
  mongodbAtlasVectorStoreNode,
  mongodbChatMemoryNode
];

// Export individual actions for the main MongoDB node
export const mongodbActions = [
  'aggregate_documents',
  'delete_documents',
  'find_documents',
  'find_and_replace_document',
  'find_and_update_document',
  'insert_documents',
  'update_documents'
];

// Export vector store operations
export const mongodbVectorStoreActions = [
  'get_many_documents',
  'insert_documents',
  'retrieve_for_chain',
  'retrieve_for_agent'
];

// Export memory operations
export const mongodbMemoryActions = [
  'store_chat_history',
  'retrieve_chat_context'
];

// Export supported authentication methods
export const mongodbAuthMethods = [
  'connection_string',
  'connection_values'
];

// Template workflows for common MongoDB patterns
export const mongodbTemplates = [
  {
    name: 'Data Pipeline with MongoDB',
    description: 'Process and store data in MongoDB with aggregation',
    category: 'Data Processing'
  },
  {
    name: 'AI Chatbot with MongoDB Memory',
    description: 'AI chatbot using MongoDB for conversation history',
    category: 'AI/ML'
  },
  {
    name: 'Vector Search RAG System',
    description: 'Retrieval-Augmented Generation with MongoDB Atlas Vector Search',
    category: 'AI/ML'
  },
  {
    name: 'Real-time Data Sync',
    description: 'Sync data between MongoDB and external systems',
    category: 'Integration'
  }
];