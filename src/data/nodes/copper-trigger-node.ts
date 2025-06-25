/**
 * Copper Trigger Node - Trigger
 * 
 * Starts a workflow when a new lead or contact is created in Copper CRM. It delivers the lead’s details to n8n, allowing immediate actions like sending a welcome email or creating a follow-up task when sales team adds a lead.
 */

import { NodeTypeInfo } from '../node-types.js';

export const coppertriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.copper-trigger',
  displayName: 'Copper Trigger',
  description: 'Starts a workflow when a new lead or contact is created in Copper CRM. It delivers the lead’s details to n8n, allowing immediate actions like sending a welcome email or creating a follow-up task when sales team adds a lead.',
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
      name: 'copper-triggerApi',
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
    name: 'Copper Trigger'
  },

  aliases: ['copper', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Copper Trigger',
      workflow: {
        nodes: [
          {
            name: 'Copper Trigger Trigger',
            type: 'n8n-nodes-base.copper-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default coppertriggerNode;