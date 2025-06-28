/**
 * Onfleet Trigger Node - Trigger
 * 
 * Fires on Onfleet delivery task events. For example, when a delivery task is started (courier picked up item) or completed (item delivered to customer), Onfleet can send a webhook that this trigger captures. This allows automation such as notifying a customer on completion or updating an order status when delivery is done.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const onfleettriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.onfleet-trigger',
  displayName: 'Onfleet Trigger',
  description: 'Fires on Onfleet delivery task events. For example, when a delivery task is started (courier picked up item) or completed (item delivered to customer), Onfleet can send a webhook that this trigger captures. This allows automation such as notifying a customer on completion or updating an order status when delivery is done.',
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
      name: 'onfleet-triggerApi',
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
    name: 'Onfleet Trigger'
  },

  aliases: ['onfleet', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Onfleet Trigger',
      workflow: {
        nodes: [
          {
            name: 'Onfleet Trigger Trigger',
            type: 'n8n-nodes-base.onfleet-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default onfleettriggerNode;