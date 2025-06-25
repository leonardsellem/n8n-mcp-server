/**
 * Clockify Trigger Node - Trigger
 * 
 * Fires when a Clockify time tracker entry is started or stopped by a user. This allows you to react to time tracking events, for example, to log them in a database, update a status board when someone starts working on a task, etc.
 */

import { NodeTypeInfo } from '../node-types.js';

export const clockifytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clockify-trigger',
  displayName: 'Clockify Trigger',
  description: 'Fires when a Clockify time tracker entry is started or stopped by a user. This allows you to react to time tracking events, for example, to log them in a database, update a status board when someone starts working on a task, etc.',
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
      name: 'clockify-triggerApi',
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
    name: 'Clockify Trigger'
  },

  aliases: ['clockify', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Clockify Trigger',
      workflow: {
        nodes: [
          {
            name: 'Clockify Trigger Trigger',
            type: 'n8n-nodes-base.clockify-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default clockifytriggerNode;