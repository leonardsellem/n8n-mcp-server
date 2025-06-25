/**
 * Customer.io Trigger Node - Trigger
 * 
 * Triggers on Customer.io events (via webhook). For example, when a new customer profile is added or a custom event (like a purchase or sign-in) is tracked in Customer.io, this trigger can receive that data. It enables integration of Customer.io’s real-time events with other systems (e.g., logging, or triggering non-email actions).
 */

import { NodeTypeInfo } from '../node-types.js';

export const customeriotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.customerio-trigger',
  displayName: 'Customer.io Trigger',
  description: 'Triggers on Customer.io events (via webhook). For example, when a new customer profile is added or a custom event (like a purchase or sign-in) is tracked in Customer.io, this trigger can receive that data. It enables integration of Customer.io’s real-time events with other systems (e.g., logging, or triggering non-email actions).',
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
      name: 'customerio-triggerApi',
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
    name: 'Customer.io Trigger'
  },

  aliases: ['customer.io', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Customer.io Trigger',
      workflow: {
        nodes: [
          {
            name: 'Customer.io Trigger Trigger',
            type: 'n8n-nodes-base.customerio-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default customeriotriggerNode;