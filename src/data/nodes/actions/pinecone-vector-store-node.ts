/**
 * Pinecone Vector Store Node
 * 
 * Integration with Pinecone, a managed vector database service:contentReference[oaicite:91]{index=91}. Allows indexing embeddings into Pinecone and querying them. Pinecone is optimized for large-scale, high-performance vector search, so this node enables workflows to use Pinecone for tasks like semantic document retrieval.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const pineconevectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pinecone-vector-store',
  displayName: 'Pinecone Vector Store',
  description: 'Integration with Pinecone, a managed vector database service:contentReference[oaicite:91]{index=91}. Allows indexing embeddings into Pinecone and querying them. Pinecone is optimized for large-scale, high-performance vector search, so this node enables workflows to use Pinecone for tasks like semantic document retrieval.',
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
      description: 'Processed data from Pinecone Vector Store'
    }
  ],

  credentials: [
    {
      name: 'pinecone-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Pinecone Vector Store'
  },

  aliases: ['pinecone', 'vector', 'store'],
  
  examples: [
        {
      name: 'Indexing Item',
      description: 'Indexing an item from Pinecone Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Pinecone Vector Store',
            type: 'n8n-nodes-base.pinecone-vector-store',
            parameters: {
              operation: 'indexing',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default pineconevectorstoreNode;