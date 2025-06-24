/**
 * Stripe Trigger Node - Trigger
 * 
 * Starts workflows on Stripe events via webhook. For example, when a payment is successful or fails (e.g., charge succeeded or failed), or when a customer subscription is created or canceled, the trigger receives the event data:contentReference[oaicite:77]{index=77}. This allows automatic handling of billing events like sending thank-you emails on payment, alerting on failed payments, provisioning services on new subscriptions, etc.
 */

import { NodeTypeInfo } from '../node-types.js';

export const stripetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stripe-trigger',
  displayName: 'Stripe Trigger',
  description: 'Starts workflows on Stripe events via webhook. For example, when a payment is successful or fails (e.g., charge succeeded or failed), or when a customer subscription is created or canceled, the trigger receives the event data:contentReference[oaicite:77]{index=77}. This allows automatic handling of billing events like sending thank-you emails on payment, alerting on failed payments, provisioning services on new subscriptions, etc.',
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
      name: 'stripe-triggerApi',
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
    name: 'Stripe Trigger'
  },

  aliases: ['stripe', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Stripe Trigger',
      workflow: {
        nodes: [
          {
            name: 'Stripe Trigger Trigger',
            type: 'n8n-nodes-base.stripe-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default stripetriggerNode;