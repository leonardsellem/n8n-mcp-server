/**
 * Line Node
 * 
 * Uses the LINE Messaging API (popular in Asia) to send messages to users or chats via a LINE bot. You can automate notifications or interactive messages to LINE users as part of a workflow (requires LINE bot credentials).
 */

import { NodeTypeInfo } from '../node-types.js';

export const lineNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.line',
  displayName: 'Line',
  description: 'Uses the LINE Messaging API (popular in Asia) to send messages to users or chats via a LINE bot. You can automate notifications or interactive messages to LINE users as part of a workflow (requires LINE bot credentials).',
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
      description: 'Processed data from Line'
    }
  ],

  credentials: [
    {
      name: 'lineApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Line'
  },

  aliases: ['line'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Line',
      workflow: {
        nodes: [
          {
            name: 'Line',
            type: 'n8n-nodes-base.line',
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

export default lineNode;