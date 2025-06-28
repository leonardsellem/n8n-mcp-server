/**
 * Pushcut Trigger Node - Trigger
 * 
 * Starts a workflow when a user taps an action button on a Pushcut notification. Pushcut can send interactive notifications to iOS devices with custom actions, and if the user triggers one, that event comes back to n8n via this trigger. This allows a human-in-the-loop step where a mobile user’s response can drive the next step in an automation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const pushcuttriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pushcut-trigger',
  displayName: 'Pushcut Trigger',
  description: 'Starts a workflow when a user taps an action button on a Pushcut notification. Pushcut can send interactive notifications to iOS devices with custom actions, and if the user triggers one, that event comes back to n8n via this trigger. This allows a human-in-the-loop step where a mobile user’s response can drive the next step in an automation.',
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
      name: 'pushcut-triggerApi',
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
    name: 'Pushcut Trigger'
  },

  aliases: ['pushcut', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Pushcut Trigger',
      workflow: {
        nodes: [
          {
            name: 'Pushcut Trigger Trigger',
            type: 'n8n-nodes-base.pushcut-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default pushcuttriggerNode;