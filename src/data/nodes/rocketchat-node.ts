/**
 * Rocket.Chat Node
 * 
 * Integrates with Rocket.Chat (open-source Slack-like chat). You can send a message to a channel or user on Rocket.Chat and list available channels. Useful for self-hosted chat notifications and chatops, similar to Slack or Mattermost integrations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const rocketchatNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rocketchat',
  displayName: 'Rocket.Chat',
  description: 'Integrates with Rocket.Chat (open-source Slack-like chat). You can send a message to a channel or user on Rocket.Chat and list available channels. Useful for self-hosted chat notifications and chatops, similar to Slack or Mattermost integrations.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Post Message',
      description: 'The operation to perform',
      options: [
        { name: 'Post Message', value: 'Post Message' },
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
      description: 'Processed data from Rocket.Chat'
    }
  ],

  credentials: [
    {
      name: 'rocketchatApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Rocket.Chat'
  },

  aliases: ['rocket.chat'],
  
  examples: [
        {
      name: 'Post Message Item',
      description: 'Post Message an item from Rocket.Chat',
      workflow: {
        nodes: [
          {
            name: 'Rocket.Chat',
            type: 'n8n-nodes-base.rocketchat',
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

export default rocketchatNode;