/**
 * Wise Trigger Node - Trigger
 * 
 * Fires on events in Wise (TransferWise), such as when a new money transfer is initiated or when a transfer completes successfully. By catching these via webhook, you can automate actions like notifying the recipient that funds are on the way or updating your accounting records once a transfer is done.
 */

import { NodeTypeInfo } from '../node-types.js';

export const wisetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wise-trigger',
  displayName: 'Wise Trigger',
  description: 'Fires on events in Wise (TransferWise), such as when a new money transfer is initiated or when a transfer completes successfully. By catching these via webhook, you can automate actions like notifying the recipient that funds are on the way or updating your accounting records once a transfer is done.',
  category: 'Core',
  subcategory: 'Trigger',
  
  properties: [
        {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }
  ],

  inputs: [
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when events occur'
    }
  ],

  credentials: [
    {
      name: 'wise-triggerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  version: [1],
  defaults: {
    name: 'Wise Trigger'
  },

  aliases: ['wise', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Wise Trigger',
      workflow: {
        nodes: [
          {
            name: 'Wise Trigger Trigger',
            type: 'n8n-nodes-base.wise-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default wisetriggerNode;