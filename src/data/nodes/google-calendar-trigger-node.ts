/**
 * Google Calendar Trigger Node - Trigger
 * 
 * Starts a workflow for Google Calendar events. For instance, when an event in a watched calendar is about to start (at a specified lead time) or when a new event is created/changed, this trigger fires with the event details:contentReference[oaicite:64]{index=64}. You might use this to send reminders or sync events to another system in real time.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlecalendartriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-calendar-trigger',
  displayName: 'Google Calendar Trigger',
  description: 'Starts a workflow for Google Calendar events. For instance, when an event in a watched calendar is about to start (at a specified lead time) or when a new event is created/changed, this trigger fires with the event details:contentReference[oaicite:64]{index=64}. You might use this to send reminders or sync events to another system in real time.',
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
      name: 'google-calendar-triggerApi',
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
    name: 'Google Calendar Trigger'
  },

  aliases: ['google', 'calendar', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Google Calendar Trigger',
      workflow: {
        nodes: [
          {
            name: 'Google Calendar Trigger Trigger',
            type: 'n8n-nodes-base.google-calendar-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default googlecalendartriggerNode;