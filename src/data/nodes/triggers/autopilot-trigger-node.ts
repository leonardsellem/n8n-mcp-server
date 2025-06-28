/**
 * Autopilot Trigger Node - Trigger
 * 
 * Starts a workflow on events from Autopilot (marketing automation). E.g., when a contact is added to a list or a journey is triggered in Autopilot, this can catch that event and run the n8n workflow with the contact’s info. This enables real-time responses to Autopilot’s marketing events.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const autopilottriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.autopilot-trigger',
  displayName: 'Autopilot Trigger',
  description: 'Starts a workflow on events from Autopilot (marketing automation). E.g., when a contact is added to a list or a journey is triggered in Autopilot, this can catch that event and run the n8n workflow with the contact’s info. This enables real-time responses to Autopilot’s marketing events.',
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
      name: 'autopilot-triggerApi',
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
    name: 'Autopilot Trigger'
  },

  aliases: ['autopilot', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Autopilot Trigger',
      workflow: {
        nodes: [
          {
            name: 'Autopilot Trigger Trigger',
            type: 'n8n-nodes-base.autopilot-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default autopilottriggerNode;