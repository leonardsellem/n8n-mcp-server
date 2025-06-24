/**
 * Webex by Cisco Node
 * 
 * Works with Cisco Webex. You can create chat rooms, list existing rooms, post messages to a room, or retrieve messages. This enables workflows to send notifications to Webex teams or integrate Webex messaging with other tools.
 */

import { NodeTypeInfo } from '../node-types.js';

export const webexbyciscoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webex-by-cisco',
  displayName: 'Webex by Cisco',
  description: 'Works with Cisco Webex. You can create chat rooms, list existing rooms, post messages to a room, or retrieve messages. This enables workflows to send notifications to Webex teams or integrate Webex messaging with other tools.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Room',
      description: 'The operation to perform',
      options: [
        { name: 'Create Room', value: 'Create Room' },
        { name: 'List Rooms', value: 'List Rooms' },
        { name: 'Post Message', value: 'Post Message' },
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
      description: 'Processed data from Webex by Cisco'
    }
  ],

  credentials: [
    {
      name: 'webex-by-ciscoApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Webex by Cisco'
  },

  aliases: ['webex', 'cisco'],
  
  examples: [
        {
      name: 'Create Room Item',
      description: 'Create Room an item from Webex by Cisco',
      workflow: {
        nodes: [
          {
            name: 'Webex by Cisco',
            type: 'n8n-nodes-base.webex-by-cisco',
            parameters: {
              operation: 'Create Room',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default webexbyciscoNode;