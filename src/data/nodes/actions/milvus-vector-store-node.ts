/**
 * Milvus Vector Store Node
 * 
 * Integration with Milvus (an open-source vector database) for storing and querying vector embeddings. It allows adding embeddings to a Milvus collection and performing similarity searches. Useful for large-scale AI semantic search and retrieval tasks.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const milvusvectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.milvus-vector-store',
  displayName: 'Milvus Vector Store',
  description: 'Integration with Milvus (an open-source vector database) for storing and querying vector embeddings. It allows adding embeddings to a Milvus collection and performing similarity searches. Useful for large-scale AI semantic search and retrieval tasks.',
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
      description: 'Processed data from Milvus Vector Store'
    }
  ],

  credentials: [
    {
      name: 'milvus-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Milvus Vector Store'
  },

  aliases: ['milvus', 'vector', 'store'],
  
  examples: [
        {
      name: 'Adding Item',
      description: 'Adding an item from Milvus Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Milvus Vector Store',
            type: 'n8n-nodes-base.milvus-vector-store',
            parameters: {
              operation: 'adding',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default milvusvectorstoreNode;