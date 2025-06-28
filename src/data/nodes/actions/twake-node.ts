/**
 * Twake Node
 * 
 * Works with Twake (collaboration platform). You can send a message to a Twake channel and list channels in a Twake workspace. Useful for notifications in a Twake environment or integrating Twake with other chat/notification systems.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const twakeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twake',
  displayName: 'Twake',
  description: 'Works with Twake (collaboration platform). You can send a message to a Twake channel and list channels in a Twake workspace. Useful for notifications in a Twake environment or integrating Twake with other chat/notification systems.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Message',
      description: 'The operation to perform',
      options: [
        { name: 'Send Message', value: 'Send Message' },
        { name: 'List Channels', value: 'List Channels' }
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
      description: 'Processed data from Twake'
    }
  ],

  credentials: [
    {
      name: 'twakeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Twake'
  },

  aliases: ['twake'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Twake',
      workflow: {
        nodes: [
          {
            name: 'Twake',
            type: 'n8n-nodes-base.twake',
            parameters: {
              operation: 'Send Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default twakeNode;