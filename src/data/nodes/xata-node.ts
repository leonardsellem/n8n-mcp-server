/**
 * Xata Node
 * 
 * Integration with Xata (a serverless database with vector support). Possibly used here as a memory store or a vector search for memory or knowledge. It could store chat history or other data that the agent can query. Essentially, connecting n8n’s AI flows to Xata’s flexible, scalable database features.
 */

import { NodeTypeInfo } from '../node-types.js';

export const xataNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.xata',
  displayName: 'Xata',
  description: 'Integration with Xata (a serverless database with vector support). Possibly used here as a memory store or a vector search for memory or knowledge. It could store chat history or other data that the agent can query. Essentially, connecting n8n’s AI flows to Xata’s flexible, scalable database features.',
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
      description: 'Processed data from Xata'
    }
  ],

  credentials: [
    {
      name: 'xataApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Xata'
  },

  aliases: ['xata'],
  
  examples: [
        {
      name: 'Query Item',
      description: 'Query an item from Xata',
      workflow: {
        nodes: [
          {
            name: 'Xata',
            type: 'n8n-nodes-base.xata',
            parameters: {
              operation: 'query',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default xataNode;