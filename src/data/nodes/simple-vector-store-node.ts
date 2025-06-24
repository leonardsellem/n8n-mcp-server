/**
 * Simple Vector Store Node
 * 
 * A minimal vector database to store and retrieve embeddings (text vectors). Likely used to create an in-memory or file-based store of vectors for semantic search. It can save embeddings from texts and later fetch similar items for a query.
 */

import { NodeTypeInfo } from '../node-types.js';

export const simplevectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.simple-vector-store',
  displayName: 'Simple Vector Store',
  description: 'A minimal vector database to store and retrieve embeddings (text vectors). Likely used to create an in-memory or file-based store of vectors for semantic search. It can save embeddings from texts and later fetch similar items for a query.',
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
      description: 'Processed data from Simple Vector Store'
    }
  ],

  credentials: [
    {
      name: 'simple-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Simple Vector Store'
  },

  aliases: ['simple', 'vector', 'store'],
  
  examples: [
        {
      name: 'Save Item',
      description: 'Save an item from Simple Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Simple Vector Store',
            type: 'n8n-nodes-base.simple-vector-store',
            parameters: {
              operation: 'save',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default simplevectorstoreNode;