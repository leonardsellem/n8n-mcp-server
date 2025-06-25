/**
 * PayPal Trigger Node - Trigger
 * 
 * Starts workflows based on PayPal IPN/Webhook events. For example, when a payment is completed (for an order or invoice), or a subscription is canceled/expired, PayPal’s webhook will send the data here. This enables automatic fulfillment or record updates upon transactions, like granting access after payment or alerting a team when a subscription ends.
 */

import { NodeTypeInfo } from '../node-types.js';

export const paypaltriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.paypal-trigger',
  displayName: 'PayPal Trigger',
  description: 'Starts workflows based on PayPal IPN/Webhook events. For example, when a payment is completed (for an order or invoice), or a subscription is canceled/expired, PayPal’s webhook will send the data here. This enables automatic fulfillment or record updates upon transactions, like granting access after payment or alerting a team when a subscription ends.',
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
      name: 'paypal-triggerApi',
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
    name: 'PayPal Trigger'
  },

  aliases: ['paypal', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in PayPal Trigger',
      workflow: {
        nodes: [
          {
            name: 'PayPal Trigger Trigger',
            type: 'n8n-nodes-base.paypal-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default paypaltriggerNode;