/**
 * Acuity Scheduling Trigger Node - Trigger
 * 
 * Fires when an event occurs in Acuity Scheduling (online appointment scheduling). For instance, when a new appointment is scheduled or an existing appointment is canceled/rescheduled, this trigger provides the appointment details, enabling follow-up actions (like sending a confirmation or updating a CRM).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const acuityschedulingtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.acuity-scheduling-trigger',
  displayName: 'Acuity Scheduling Trigger',
  description: 'Fires when an event occurs in Acuity Scheduling (online appointment scheduling). For instance, when a new appointment is scheduled or an existing appointment is canceled/rescheduled, this trigger provides the appointment details, enabling follow-up actions (like sending a confirmation or updating a CRM).',
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
      name: 'acuity-scheduling-triggerApi',
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
    name: 'Acuity Scheduling Trigger'
  },

  aliases: ['acuity', 'scheduling', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Acuity Scheduling Trigger',
      workflow: {
        nodes: [
          {
            name: 'Acuity Scheduling Trigger Trigger',
            type: 'n8n-nodes-base.acuity-scheduling-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default acuityschedulingtriggerNode;