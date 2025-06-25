/**
 * Spontit Node
 * 
 * Uses Spontit (push notification service) to send notifications to subscribers/devices. You provide a channel and message (and optional title) and it pushes it out via the Spontit app. Useful for mobile notifications to user groups from workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const spontitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.spontit',
  displayName: 'Spontit',
  description: 'Uses Spontit (push notification service) to send notifications to subscribers/devices. You provide a channel and message (and optional title) and it pushes it out via the Spontit app. Useful for mobile notifications to user groups from workflows.',
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
      description: 'Processed data from Spontit'
    }
  ],

  credentials: [
    {
      name: 'spontitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Spontit'
  },

  aliases: ['spontit'],
  
  examples: [
        {
      name: 'Send Notification Item',
      description: 'Send Notification an item from Spontit',
      workflow: {
        nodes: [
          {
            name: 'Spontit',
            type: 'n8n-nodes-base.spontit',
            parameters: {
              operation: 'Send Notification',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default spontitNode;