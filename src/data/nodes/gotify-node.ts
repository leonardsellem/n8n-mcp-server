/**
 * Gotify Node
 * 
 * Sends push notifications via Gotify (self-hosted notification service). You can push a message (with title and priority) to a Gotify server/application. Useful for real-time alerts to devices using Gotify.
 */

import { NodeTypeInfo } from '../node-types.js';

export const gotifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gotify',
  displayName: 'Gotify',
  description: 'Sends push notifications via Gotify (self-hosted notification service). You can push a message (with title and priority) to a Gotify server/application. Useful for real-time alerts to devices using Gotify.',
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
      description: 'Processed data from Gotify'
    }
  ],

  credentials: [
    {
      name: 'gotifyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Gotify'
  },

  aliases: ['gotify'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Gotify',
      workflow: {
        nodes: [
          {
            name: 'Gotify',
            type: 'n8n-nodes-base.gotify',
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

export default gotifyNode;