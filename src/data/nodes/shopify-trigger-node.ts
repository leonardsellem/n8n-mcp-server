/**
 * Shopify Trigger Node - Trigger
 * 
 * Fires on Shopify store events via webhooks:contentReference[oaicite:75]{index=75}. For example, when a new order is placed, when an order’s payment is completed, or when a product’s details are updated, it triggers the workflow with relevant details. This allows automatic post-order processes (like fulfillment, notifications) or syncing product changes to other platforms.
 */

import { NodeTypeInfo } from '../node-types.js';

export const shopifytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.shopify-trigger',
  displayName: 'Shopify Trigger',
  description: 'Fires on Shopify store events via webhooks:contentReference[oaicite:75]{index=75}. For example, when a new order is placed, when an order’s payment is completed, or when a product’s details are updated, it triggers the workflow with relevant details. This allows automatic post-order processes (like fulfillment, notifications) or syncing product changes to other platforms.',
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
      name: 'shopify-triggerApi',
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
    name: 'Shopify Trigger'
  },

  aliases: ['shopify', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Shopify Trigger',
      workflow: {
        nodes: [
          {
            name: 'Shopify Trigger Trigger',
            type: 'n8n-nodes-base.shopify-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default shopifytriggerNode;