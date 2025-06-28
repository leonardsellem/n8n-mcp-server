/**
 * Trello Trigger Node - Trigger
 * 
 * Starts a workflow on Trello board events:contentReference[oaicite:81]{index=81}. For example, triggers when a card is moved to another list (indicating a stage change) or when a new card is created. It uses Trello’s webhook. This way, you can respond to task movements (like “Done”) to notify stakeholders or to new tasks to kick off related processes.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const trellotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.trello-trigger',
  displayName: 'Trello Trigger',
  description: 'Starts a workflow on Trello board events:contentReference[oaicite:81]{index=81}. For example, triggers when a card is moved to another list (indicating a stage change) or when a new card is created. It uses Trello’s webhook. This way, you can respond to task movements (like “Done”) to notify stakeholders or to new tasks to kick off related processes.',
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
      name: 'trello-triggerApi',
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
    name: 'Trello Trigger'
  },

  aliases: ['trello', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Trello Trigger',
      workflow: {
        nodes: [
          {
            name: 'Trello Trigger Trigger',
            type: 'n8n-nodes-base.trello-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default trellotriggerNode;