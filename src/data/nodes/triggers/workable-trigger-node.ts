/**
 * Workable Trigger Node - Trigger
 * 
 * Fires when a new candidate application is submitted via Workable (recruitment platform) for a job posting. The trigger provides the candidate’s details and answers. You can automate parts of hiring workflows, like sending a confirmation email, adding the candidate to an HRIS, or notifying interviewers upon new applicants.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const workabletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.workable-trigger',
  displayName: 'Workable Trigger',
  description: 'Fires when a new candidate application is submitted via Workable (recruitment platform) for a job posting. The trigger provides the candidate’s details and answers. You can automate parts of hiring workflows, like sending a confirmation email, adding the candidate to an HRIS, or notifying interviewers upon new applicants.',
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
      name: 'workable-triggerApi',
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
    name: 'Workable Trigger'
  },

  aliases: ['workable', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Workable Trigger',
      workflow: {
        nodes: [
          {
            name: 'Workable Trigger Trigger',
            type: 'n8n-nodes-base.workable-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default workabletriggerNode;