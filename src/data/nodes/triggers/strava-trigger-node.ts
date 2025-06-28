/**
 * Strava Trigger Node - Trigger
 * 
 * Fires when a connected Strava athlete finishes recording a new activity (run, ride, etc.). Using Strava’s webhook, when a user you’ve subscribed to uploads or completes an activity, this trigger provides the activity data (distance, duration, etc.). You can automate things like logging workouts in a spreadsheet or congratulating via text when an activity is done.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const stravatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.strava-trigger',
  displayName: 'Strava Trigger',
  description: 'Fires when a connected Strava athlete finishes recording a new activity (run, ride, etc.). Using Strava’s webhook, when a user you’ve subscribed to uploads or completes an activity, this trigger provides the activity data (distance, duration, etc.). You can automate things like logging workouts in a spreadsheet or congratulating via text when an activity is done.',
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
      name: 'strava-triggerApi',
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
    name: 'Strava Trigger'
  },

  aliases: ['strava', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Strava Trigger',
      workflow: {
        nodes: [
          {
            name: 'Strava Trigger Trigger',
            type: 'n8n-nodes-base.strava-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default stravatriggerNode;