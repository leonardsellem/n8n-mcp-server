/**
 * ClickUp Trigger Node - Trigger
 * 
 * Starts a workflow on ClickUp workspace events. For instance, when a new task is created in ClickUp or an existing task is updated (status change, etc.), this trigger will fire with the task info. Useful for syncing tasks to other systems or sending alerts on important task changes.
 */

import { NodeTypeInfo } from '../node-types.js';

export const clickuptriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clickup-trigger',
  displayName: 'ClickUp Trigger',
  description: 'Starts a workflow on ClickUp workspace events. For instance, when a new task is created in ClickUp or an existing task is updated (status change, etc.), this trigger will fire with the task info. Useful for syncing tasks to other systems or sending alerts on important task changes.',
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
      name: 'clickup-triggerApi',
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
    name: 'ClickUp Trigger'
  },

  aliases: ['clickup', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in ClickUp Trigger',
      workflow: {
        nodes: [
          {
            name: 'ClickUp Trigger Trigger',
            type: 'n8n-nodes-base.clickup-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default clickuptriggerNode;