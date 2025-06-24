/**
 * Gumroad Trigger Node - Trigger
 * 
 * Triggers on Gumroad events via webhook, such as when a new product sale occurs or a refund is issued. The workflow can start with the sale details (buyer info, product, price) which is useful for fulfilling orders (sending files, adding to a course, etc.) or updating records when transactions happen.
 */

import { NodeTypeInfo } from '../node-types.js';

export const gumroadtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gumroad-trigger',
  displayName: 'Gumroad Trigger',
  description: 'Triggers on Gumroad events via webhook, such as when a new product sale occurs or a refund is issued. The workflow can start with the sale details (buyer info, product, price) which is useful for fulfilling orders (sending files, adding to a course, etc.) or updating records when transactions happen.',
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
      name: 'gumroad-triggerApi',
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
    name: 'Gumroad Trigger'
  },

  aliases: ['gumroad', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Gumroad Trigger',
      workflow: {
        nodes: [
          {
            name: 'Gumroad Trigger Trigger',
            type: 'n8n-nodes-base.gumroad-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default gumroadtriggerNode;