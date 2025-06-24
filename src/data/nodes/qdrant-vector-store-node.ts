/**
 * Qdrant Vector Store Node
 * 
 * Uses Qdrant (open-source vector DB) for storing and searching embeddings. You can push vectors to Qdrant and query for the nearest ones. Great for building semantic search or clustering into workflows using Qdrant as storage.
 */

import { NodeTypeInfo } from '../node-types.js';

export const qdrantvectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.qdrant-vector-store',
  displayName: 'Qdrant Vector Store',
  description: 'Uses Qdrant (open-source vector DB) for storing and searching embeddings. You can push vectors to Qdrant and query for the nearest ones. Great for building semantic search or clustering into workflows using Qdrant as storage.',
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
      description: 'Processed data from Qdrant Vector Store'
    }
  ],

  credentials: [
    {
      name: 'qdrant-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Qdrant Vector Store'
  },

  aliases: ['qdrant', 'vector', 'store'],
  
  examples: [
        {
      name: 'Push Item',
      description: 'Push an item from Qdrant Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Qdrant Vector Store',
            type: 'n8n-nodes-base.qdrant-vector-store',
            parameters: {
              operation: 'push',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default qdrantvectorstoreNode;