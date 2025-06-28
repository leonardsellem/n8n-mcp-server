/**
 * Keap Trigger Node - Trigger
 * 
 * Fires on Keap (Infusionsoft) CRM events, such as when a new contact is added or when an opportunity/sale moves stages. This allows near real-time integration of Keap with other tools, like adding new contacts to a mailing list or triggering a notification when a sale is closed in Keap.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const keaptriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.keap-trigger',
  displayName: 'Keap Trigger',
  description: 'Fires on Keap (Infusionsoft) CRM events, such as when a new contact is added or when an opportunity/sale moves stages. This allows near real-time integration of Keap with other tools, like adding new contacts to a mailing list or triggering a notification when a sale is closed in Keap.',
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
      name: 'keap-triggerApi',
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
    name: 'Keap Trigger'
  },

  aliases: ['keap', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Keap Trigger',
      workflow: {
        nodes: [
          {
            name: 'Keap Trigger Trigger',
            type: 'n8n-nodes-base.keap-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default keaptriggerNode;