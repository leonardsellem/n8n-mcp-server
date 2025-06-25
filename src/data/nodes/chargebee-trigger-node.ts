/**
 * Chargebee Trigger Node - Trigger
 * 
 * Fires on Chargebee subscription billing events. For example, when a new subscription starts, one is canceled/ended, or a payment attempt fails (invoice failed), the trigger receives the event data. This allows automated responses like provisioning accounts on new subscription or notifying finance on failures:contentReference[oaicite:57]{index=57}.
 */

import { NodeTypeInfo } from '../node-types.js';

export const chargebeetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.chargebee-trigger',
  displayName: 'Chargebee Trigger',
  description: 'Fires on Chargebee subscription billing events. For example, when a new subscription starts, one is canceled/ended, or a payment attempt fails (invoice failed), the trigger receives the event data. This allows automated responses like provisioning accounts on new subscription or notifying finance on failures:contentReference[oaicite:57]{index=57}.',
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
      name: 'chargebee-triggerApi',
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
    name: 'Chargebee Trigger'
  },

  aliases: ['chargebee', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Chargebee Trigger',
      workflow: {
        nodes: [
          {
            name: 'Chargebee Trigger Trigger',
            type: 'n8n-nodes-base.chargebee-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default chargebeetriggerNode;