/**
 * Affinity Trigger Node - Trigger
 * 
 * Triggers a workflow for events in Affinity (relationship CRM). E.g., when a new person contact is added or a new organization is added in Affinity, it will start the workflow with that record’s details. This allows syncing new entries from Affinity out to other systems in real time.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const affinitytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.affinity-trigger',
  displayName: 'Affinity Trigger',
  description: 'Triggers a workflow for events in Affinity (relationship CRM). E.g., when a new person contact is added or a new organization is added in Affinity, it will start the workflow with that record’s details. This allows syncing new entries from Affinity out to other systems in real time.',
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
      name: 'affinity-triggerApi',
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
    name: 'Affinity Trigger'
  },

  aliases: ['affinity', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Affinity Trigger',
      workflow: {
        nodes: [
          {
            name: 'Affinity Trigger Trigger',
            type: 'n8n-nodes-base.affinity-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default affinitytriggerNode;