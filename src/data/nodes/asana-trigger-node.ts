/**
 * Asana Trigger Node - Trigger
 * 
 * Fires when certain events happen in Asana. For example, when a new task is created in a project or when a task is marked complete. It uses Asana’s event webhooks, providing task details to the workflow. Useful for reacting to project updates, like notifying someone or syncing tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const asanatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.asana-trigger',
  displayName: 'Asana Trigger',
  description: 'Fires when certain events happen in Asana. For example, when a new task is created in a project or when a task is marked complete. It uses Asana’s event webhooks, providing task details to the workflow. Useful for reacting to project updates, like notifying someone or syncing tasks.',
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
      name: 'asana-triggerApi',
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
    name: 'Asana Trigger'
  },

  aliases: ['asana', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Asana Trigger',
      workflow: {
        nodes: [
          {
            name: 'Asana Trigger Trigger',
            type: 'n8n-nodes-base.asana-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default asanatriggerNode;