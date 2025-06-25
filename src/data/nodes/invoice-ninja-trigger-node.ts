/**
 * Invoice Ninja Trigger Node - Trigger
 * 
 * Fires on events in Invoice Ninja (invoicing system), such as when an invoice is marked paid or when a new invoice is created. This lets you automate tasks like sending a thank-you email upon payment or updating accounting records as soon as an invoice is issued or paid.
 */

import { NodeTypeInfo } from '../node-types.js';

export const invoiceninjatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.invoice-ninja-trigger',
  displayName: 'Invoice Ninja Trigger',
  description: 'Fires on events in Invoice Ninja (invoicing system), such as when an invoice is marked paid or when a new invoice is created. This lets you automate tasks like sending a thank-you email upon payment or updating accounting records as soon as an invoice is issued or paid.',
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
      name: 'invoice-ninja-triggerApi',
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
    name: 'Invoice Ninja Trigger'
  },

  aliases: ['invoice', 'ninja', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Invoice Ninja Trigger',
      workflow: {
        nodes: [
          {
            name: 'Invoice Ninja Trigger Trigger',
            type: 'n8n-nodes-base.invoice-ninja-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default invoiceninjatriggerNode;