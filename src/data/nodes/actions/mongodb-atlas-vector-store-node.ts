/**
 * MongoDB Atlas Vector Store Node
 * 
 * Uses MongoDB Atlas’s vector search capability as a vector store. You can store embeddings in a MongoDB collection and query for nearest vectors. Great if you want to use your existing MongoDB as the backend for semantic search in workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mongodbatlasvectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mongodb-atlas-vector-store',
  displayName: 'MongoDB Atlas Vector Store',
  description: 'Uses MongoDB Atlas’s vector search capability as a vector store. You can store embeddings in a MongoDB collection and query for nearest vectors. Great if you want to use your existing MongoDB as the backend for semantic search in workflows.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
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
      displayName: 'Output',
      description: 'Processed data from MongoDB Atlas Vector Store'
    }
  ],

  credentials: [
    {
      name: 'mongodb-atlas-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MongoDB Atlas Vector Store'
  },

  aliases: ['mongodb', 'atlas', 'vector', 'store'],
  
  examples: [
        {
      name: 'Store Item',
      description: 'Store an item from MongoDB Atlas Vector Store',
      workflow: {
        nodes: [
          {
            name: 'MongoDB Atlas Vector Store',
            type: 'n8n-nodes-base.mongodb-atlas-vector-store',
            parameters: {
              operation: 'store',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mongodbatlasvectorstoreNode;