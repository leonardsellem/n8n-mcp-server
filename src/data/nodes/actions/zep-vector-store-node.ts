/**
 * Zep Vector Store Node
 * 
 * Integrates with Zep (a vector memory store for LLMs). You can save conversation or document embeddings to Zep and query them later. Often used to give AI agents long-term memory by storing embeddings of previous dialogues or knowledge and retrieving them when needed.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const zepvectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zep-vector-store',
  displayName: 'Zep Vector Store',
  description: 'Integrates with Zep (a vector memory store for LLMs). You can save conversation or document embeddings to Zep and query them later. Often used to give AI agents long-term memory by storing embeddings of previous dialogues or knowledge and retrieving them when needed.',
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
      description: 'Processed data from Zep Vector Store'
    }
  ],

  credentials: [
    {
      name: 'zep-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zep Vector Store'
  },

  aliases: ['zep', 'vector', 'store'],
  
  examples: [
        {
      name: 'Save Item',
      description: 'Save an item from Zep Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Zep Vector Store',
            type: 'n8n-nodes-base.zep-vector-store',
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

export default zepvectorstoreNode;