/**
 * SIGNL4 Node
 * 
 * Uses SIGNL4 (mobile alerting app) to send out alerts to on-call teams. You can trigger an alert with title, message, and priority, which then notifies team members via the SIGNL4 app (including push, SMS, voice depending on setup). Useful for critical incident notifications from workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const signl4Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.signl4',
  displayName: 'SIGNL4',
  description: 'Uses SIGNL4 (mobile alerting app) to send out alerts to on-call teams. You can trigger an alert with title, message, and priority, which then notifies team members via the SIGNL4 app (including push, SMS, voice depending on setup). Useful for critical incident notifications from workflows.',
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
      description: 'Processed data from SIGNL4'
    }
  ],

  credentials: [
    {
      name: 'signl4Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SIGNL4'
  },

  aliases: ['signl4'],
  
  examples: [
        {
      name: 'Send Alert Item',
      description: 'Send Alert an item from SIGNL4',
      workflow: {
        nodes: [
          {
            name: 'SIGNL4',
            type: 'n8n-nodes-base.signl4',
            parameters: {
              operation: 'Send Alert',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default signl4Node;