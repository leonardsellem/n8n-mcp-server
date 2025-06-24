/**
 * Zep Node
 * 
 * Uses Zep (vector memory store) as an external memory. Zep is designed for long-term memory for LLMs (embedding and storing conversational data). The agent can push conversation chunks and retrieve relevant pieces via Zep. Ensures your chatbot can remember older context by leveraging Zep’s memory store.
 */

import { NodeTypeInfo } from '../node-types.js';

export const zepNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zep',
  displayName: 'Zep',
  description: 'Uses Zep (vector memory store) as an external memory. Zep is designed for long-term memory for LLMs (embedding and storing conversational data). The agent can push conversation chunks and retrieve relevant pieces via Zep. Ensures your chatbot can remember older context by leveraging Zep’s memory store.',
  category: 'Utility',
  subcategory: 'Integration',
  
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
      description: 'Processed data from Zep'
    }
  ],

  credentials: [
    {
      name: 'zepApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zep'
  },

  aliases: ['zep'],
  
  examples: [
        {
      name: 'Push Item',
      description: 'Push an item from Zep',
      workflow: {
        nodes: [
          {
            name: 'Zep',
            type: 'n8n-nodes-base.zep',
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

export default zepNode;