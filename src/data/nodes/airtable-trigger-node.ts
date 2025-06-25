/**
 * Airtable Trigger Node - Trigger
 * 
 * Triggers when a new record is added or an existing record is updated in a specified Airtable base/table:contentReference[oaicite:51]{index=51}:contentReference[oaicite:52]{index=52}. It uses Airtable’s webhook or polling to detect changes. This allows workflows to respond to Airtable data changes (for example, when a new form submission appears in Airtable).
 */

import { NodeTypeInfo } from '../node-types.js';

export const airtabletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.airtable-trigger',
  displayName: 'Airtable Trigger',
  description: 'Triggers when a new record is added or an existing record is updated in a specified Airtable base/table:contentReference[oaicite:51]{index=51}:contentReference[oaicite:52]{index=52}. It uses Airtable’s webhook or polling to detect changes. This allows workflows to respond to Airtable data changes (for example, when a new form submission appears in Airtable).',
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
      name: 'airtable-triggerApi',
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
    name: 'Airtable Trigger'
  },

  aliases: ['airtable', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Airtable Trigger',
      workflow: {
        nodes: [
          {
            name: 'Airtable Trigger Trigger',
            type: 'n8n-nodes-base.airtable-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default airtabletriggerNode;