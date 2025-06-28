/**
 * WooCommerce Trigger Node - Trigger
 * 
 * Starts a workflow on WooCommerce store events via its webhooks. For example, triggers when a new order is placed (with order details) or when an order’s status changes (like from Processing to Completed). This enables automated fulfillment processes, inventory updates, or customer communication to kick in as soon as orders come in or progress:contentReference[oaicite:85]{index=85}.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const woocommercetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.woocommerce-trigger',
  displayName: 'WooCommerce Trigger',
  description: 'Starts a workflow on WooCommerce store events via its webhooks. For example, triggers when a new order is placed (with order details) or when an order’s status changes (like from Processing to Completed). This enables automated fulfillment processes, inventory updates, or customer communication to kick in as soon as orders come in or progress:contentReference[oaicite:85]{index=85}.',
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
      name: 'woocommerce-triggerApi',
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
    name: 'WooCommerce Trigger'
  },

  aliases: ['woocommerce', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in WooCommerce Trigger',
      workflow: {
        nodes: [
          {
            name: 'WooCommerce Trigger Trigger',
            type: 'n8n-nodes-base.woocommerce-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default woocommercetriggerNode;