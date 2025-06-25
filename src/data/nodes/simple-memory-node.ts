/**
 * Simple Memory Node
 * 
 * A basic in-memory store for conversation or state:contentReference[oaicite:97]{index=97}. Likely just keeps all prior messages or data in the workflow’s memory (or a vector of them) up to a limit. Use for when you want the agent to have short-term recall of earlier parts of the conversation by simply storing them.
 */

import { NodeTypeInfo } from '../node-types.js';

export const simplememoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.simple-memory',
  displayName: 'Simple Memory',
  description: 'A basic in-memory store for conversation or state:contentReference[oaicite:97]{index=97}. Likely just keeps all prior messages or data in the workflow’s memory (or a vector of them) up to a limit. Use for when you want the agent to have short-term recall of earlier parts of the conversation by simply storing them.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ]
    },

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
      description: 'Processed data from Simple Memory'
    }
  ],

  credentials: [
    {
      name: 'simple-memoryApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Simple Memory'
  },

  aliases: ['simple', 'memory'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Simple Memory',
      workflow: {
        nodes: [
          {
            name: 'Simple Memory',
            type: 'n8n-nodes-base.simple-memory',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default simplememoryNode;