/**
 * Hubspot Trigger Node - Trigger
 * 
 * Starts a workflow on HubSpot CRM events. For example, when a new contact is created in HubSpot, or when a deal moves to a new stage in the pipeline, this trigger will fire with relevant data. This allows syncing HubSpot updates (leads, deal progress) with external systems or internal notifications the moment they happen.
 */

import { NodeTypeInfo } from '../node-types.js';

export const hubspottriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hubspot-trigger',
  displayName: 'Hubspot Trigger',
  description: 'Starts a workflow on HubSpot CRM events. For example, when a new contact is created in HubSpot, or when a deal moves to a new stage in the pipeline, this trigger will fire with relevant data. This allows syncing HubSpot updates (leads, deal progress) with external systems or internal notifications the moment they happen.',
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
      name: 'hubspot-triggerApi',
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
    name: 'Hubspot Trigger'
  },

  aliases: ['hubspot', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Hubspot Trigger',
      workflow: {
        nodes: [
          {
            name: 'Hubspot Trigger Trigger',
            type: 'n8n-nodes-base.hubspot-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default hubspottriggerNode;