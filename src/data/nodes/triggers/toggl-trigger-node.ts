/**
 * Toggl Trigger Node - Trigger
 * 
 * Fires when a Toggl time tracking entry is stopped (i.e., you stop the timer for a task). Once a user stops a timer, this trigger can get the entry’s data (project, duration, description). It lets you automate what happens after finishing a time block—like logging it in a spreadsheet or updating a task’s status.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const toggltriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.toggl-trigger',
  displayName: 'Toggl Trigger',
  description: 'Fires when a Toggl time tracking entry is stopped (i.e., you stop the timer for a task). Once a user stops a timer, this trigger can get the entry’s data (project, duration, description). It lets you automate what happens after finishing a time block—like logging it in a spreadsheet or updating a task’s status.',
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
      name: 'toggl-triggerApi',
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
    name: 'Toggl Trigger'
  },

  aliases: ['toggl', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Toggl Trigger',
      workflow: {
        nodes: [
          {
            name: 'Toggl Trigger Trigger',
            type: 'n8n-nodes-base.toggl-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default toggltriggerNode;