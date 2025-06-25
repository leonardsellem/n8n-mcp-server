/**
 * Eventbrite Trigger Node - Trigger
 * 
 * Starts workflows based on Eventbrite events. For example, when a new order (ticket purchase) is made for your event, or when an attendee checks in via Eventbrite, the trigger will fire with relevant data. Great for syncing attendee lists with CRMs or sending welcome messages to new registrants.
 */

import { NodeTypeInfo } from '../node-types.js';

export const eventbritetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.eventbrite-trigger',
  displayName: 'Eventbrite Trigger',
  description: 'Starts workflows based on Eventbrite events. For example, when a new order (ticket purchase) is made for your event, or when an attendee checks in via Eventbrite, the trigger will fire with relevant data. Great for syncing attendee lists with CRMs or sending welcome messages to new registrants.',
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
      name: 'eventbrite-triggerApi',
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
    name: 'Eventbrite Trigger'
  },

  aliases: ['eventbrite', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Eventbrite Trigger',
      workflow: {
        nodes: [
          {
            name: 'Eventbrite Trigger Trigger',
            type: 'n8n-nodes-base.eventbrite-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default eventbritetriggerNode;