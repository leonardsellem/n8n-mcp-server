/**
 * Google Chat Node
 * 
 * Sends a message to Google Chat (formerly Hangouts Chat) spaces or DMs. You can automate posting notifications or alerts to a Google Chat room by specifying the space/webhook and message content.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlechatNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-chat',
  displayName: 'Google Chat',
  description: 'Sends a message to Google Chat (formerly Hangouts Chat) spaces or DMs. You can automate posting notifications or alerts to a Google Chat room by specifying the space/webhook and message content.',
  category: 'Productivity',
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
      description: 'Processed data from Google Chat'
    }
  ],

  credentials: [
    {
      name: 'google-chatApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Chat'
  },

  aliases: ['google', 'chat'],
  
  examples: [
        {
      name: 'Post Message Item',
      description: 'Post Message an item from Google Chat',
      workflow: {
        nodes: [
          {
            name: 'Google Chat',
            type: 'n8n-nodes-base.google-chat',
            parameters: {
              operation: 'Post Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlechatNode;