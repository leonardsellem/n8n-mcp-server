/**
 * Google Calendar Node
 * 
 * Connects to Google Calendar. Supports creating calendar events, retrieving event details, updating events (e.g., rescheduling or changing participants), deleting events, and listing events on a calendar:contentReference[oaicite:25]{index=25}:contentReference[oaicite:26]{index=26}. Useful for calendar management and scheduling automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlecalendarNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-calendar',
  displayName: 'Google Calendar',
  description: 'Connects to Google Calendar. Supports creating calendar events, retrieving event details, updating events (e.g., rescheduling or changing participants), deleting events, and listing events on a calendar:contentReference[oaicite:25]{index=25}:contentReference[oaicite:26]{index=26}. Useful for calendar management and scheduling automation.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Event',
      description: 'The operation to perform',
      options: [
        { name: 'Create Event', value: 'Create Event' },
        { name: 'Get Event', value: 'Get Event' },
        { name: 'Update Event', value: 'Update Event' },
        { name: 'Delete Event', value: 'Delete Event' },
        { name: 'List Events', value: 'List Events' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from Google Calendar'
    }
  ],

  credentials: [
    {
      name: 'google-calendarApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Calendar'
  },

  aliases: ['google', 'calendar'],
  
  examples: [
        {
      name: 'Create Event Item',
      description: 'Create Event an item from Google Calendar',
      workflow: {
        nodes: [
          {
            name: 'Google Calendar',
            type: 'n8n-nodes-base.google-calendar',
            parameters: {
              operation: 'Create Event',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlecalendarNode;