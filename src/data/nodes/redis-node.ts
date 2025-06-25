/**
 * Redis Node
 * 
 * Connects to a Redis in-memory datastore. You can set key-value pairs, get values by key, and publish messages to a Redis channel (for pub/sub). Useful for caching data between workflow runs, sharing state, or sending events to other systems via Redis pub/sub.
 */

import { NodeTypeInfo } from '../node-types.js';

export const redisNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.redis',
  displayName: 'Redis',
  description: 'Connects to a Redis in-memory datastore. You can set key-value pairs, get values by key, and publish messages to a Redis channel (for pub/sub). Useful for caching data between workflow runs, sharing state, or sending events to other systems via Redis pub/sub.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Set Key',
      description: 'The operation to perform',
      options: [
        { name: 'Set Key', value: 'Set Key' },
        { name: 'Get Key', value: 'Get Key' },
        { name: 'Publish Message', value: 'Publish Message' }
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
      description: 'Processed data from Redis'
    }
  ],

  credentials: [
    {
      name: 'redisApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Redis'
  },

  aliases: ['redis'],
  
  examples: [
        {
      name: 'Set Key Item',
      description: 'Set Key an item from Redis',
      workflow: {
        nodes: [
          {
            name: 'Redis',
            type: 'n8n-nodes-base.redis',
            parameters: {
              operation: 'Set Key',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default redisNode;