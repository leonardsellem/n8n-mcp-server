/**
 * Wufoo Trigger Node - Trigger
 * 
 * Starts a workflow whenever a Wufoo form receives a new entry (submission). Wufoo can send the form fields to this trigger via webhook immediately after submission. Similar to other form triggers, this lets you process form data in real time — e.g., adding a contact to CRM, or emailing a response.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const wufootriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wufoo-trigger',
  displayName: 'Wufoo Trigger',
  description: 'Starts a workflow whenever a Wufoo form receives a new entry (submission). Wufoo can send the form fields to this trigger via webhook immediately after submission. Similar to other form triggers, this lets you process form data in real time — e.g., adding a contact to CRM, or emailing a response.',
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
      name: 'wufoo-triggerApi',
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
    name: 'Wufoo Trigger'
  },

  aliases: ['wufoo', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Wufoo Trigger',
      workflow: {
        nodes: [
          {
            name: 'Wufoo Trigger Trigger',
            type: 'n8n-nodes-base.wufoo-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default wufootriggerNode;