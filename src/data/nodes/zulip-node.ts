/**
 * Zulip Node
 * 
 * Integrates with Zulip (open-source team chat). You can send messages to a stream (channel) or private message, list available streams, and fetch messages from a stream or topic. This supports notifications and chatops in Zulip similar to Slack/Teams, for workflows that need to communicate or retrieve info from team chats.
 */

import { NodeTypeInfo } from '../node-types.js';

export const zulipNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zulip',
  displayName: 'Zulip',
  description: 'Integrates with Zulip (open-source team chat). You can send messages to a stream (channel) or private message, list available streams, and fetch messages from a stream or topic. This supports notifications and chatops in Zulip similar to Slack/Teams, for workflows that need to communicate or retrieve info from team chats.',
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
        { name: 'List Streams', value: 'List Streams' },
        { name: 'Get Messages', value: 'Get Messages' }
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
      description: 'Processed data from Zulip'
    }
  ],

  credentials: [
    {
      name: 'zulipApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zulip'
  },

  aliases: ['zulip'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Zulip',
      workflow: {
        nodes: [
          {
            name: 'Zulip',
            type: 'n8n-nodes-base.zulip',
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

export default zulipNode;