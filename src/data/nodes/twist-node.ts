/**
 * Twist Node
 * 
 * Connects to Twist (team communication app). You can post a comment to an existing thread or create a new thread in a Twist channel. Useful for sending notifications or starting discussions in Twist as part of automated processes (Twist is similar to Slack but asynchronous).
 */

import { NodeTypeInfo } from '../node-types.js';

export const twistNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twist',
  displayName: 'Twist',
  description: 'Connects to Twist (team communication app). You can post a comment to an existing thread or create a new thread in a Twist channel. Useful for sending notifications or starting discussions in Twist as part of automated processes (Twist is similar to Slack but asynchronous).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Post Comment',
      description: 'The operation to perform',
      options: [
        { name: 'Post Comment', value: 'Post Comment' },
        { name: 'Create Thread', value: 'Create Thread' }
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
      description: 'Processed data from Twist'
    }
  ],

  credentials: [
    {
      name: 'twistApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Twist'
  },

  aliases: ['twist'],
  
  examples: [
        {
      name: 'Post Comment Item',
      description: 'Post Comment an item from Twist',
      workflow: {
        nodes: [
          {
            name: 'Twist',
            type: 'n8n-nodes-base.twist',
            parameters: {
              operation: 'Post Comment',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default twistNode;