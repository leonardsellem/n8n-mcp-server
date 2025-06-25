/**
 * Redis Chat Memory Node
 * 
 * Uses Redis to store chat conversation state. Each conversation’s messages could be stored in Redis (with quick access to recent ones or a summary), providing fast, ephemeral memory storage. Useful for scaling chat memory where Redis can handle rapid reads/writes.
 */

import { NodeTypeInfo } from '../node-types.js';

export const redischatmemoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.redis-chat-memory',
  displayName: 'Redis Chat Memory',
  description: 'Uses Redis to store chat conversation state. Each conversation’s messages could be stored in Redis (with quick access to recent ones or a summary), providing fast, ephemeral memory storage. Useful for scaling chat memory where Redis can handle rapid reads/writes.',
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
      description: 'Processed data from Redis Chat Memory'
    }
  ],

  credentials: [
    {
      name: 'redis-chat-memoryApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Redis Chat Memory'
  },

  aliases: ['redis', 'chat', 'memory'],
  
  examples: [
        {
      name: 'Handle Item',
      description: 'Handle an item from Redis Chat Memory',
      workflow: {
        nodes: [
          {
            name: 'Redis Chat Memory',
            type: 'n8n-nodes-base.redis-chat-memory',
            parameters: {
              operation: 'handle',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default redischatmemoryNode;