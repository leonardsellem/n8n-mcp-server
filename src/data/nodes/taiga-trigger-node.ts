/**
 * Taiga Trigger Node - Trigger
 * 
 * Starts a workflow on events from Taiga (project management). For example, triggers when a new issue/task is created or when an issue is updated. This can facilitate integration between Taiga and other tools, like creating a linked ticket elsewhere or notifying a team when an issue status changes.
 */

import { NodeTypeInfo } from '../node-types.js';

export const taigatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.taiga-trigger',
  displayName: 'Taiga Trigger',
  description: 'Starts a workflow on events from Taiga (project management). For example, triggers when a new issue/task is created or when an issue is updated. This can facilitate integration between Taiga and other tools, like creating a linked ticket elsewhere or notifying a team when an issue status changes.',
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
      name: 'taiga-triggerApi',
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
    name: 'Taiga Trigger'
  },

  aliases: ['taiga', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Taiga Trigger',
      workflow: {
        nodes: [
          {
            name: 'Taiga Trigger Trigger',
            type: 'n8n-nodes-base.taiga-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default taigatriggerNode;