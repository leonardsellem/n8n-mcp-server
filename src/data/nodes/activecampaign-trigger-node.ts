/**
 * ActiveCampaign Trigger Node - Trigger
 * 
 * Starts a workflow when specified events happen in ActiveCampaign:contentReference[oaicite:50]{index=50}. For example, when a new contact is added or when a tag is added to a contact in ActiveCampaign, this trigger fires and provides the contact data. It allows real-time automation on ActiveCampaign events.
 */

import { NodeTypeInfo } from '../node-types.js';

export const activecampaigntriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.activecampaign-trigger',
  displayName: 'ActiveCampaign Trigger',
  description: 'Starts a workflow when specified events happen in ActiveCampaign:contentReference[oaicite:50]{index=50}. For example, when a new contact is added or when a tag is added to a contact in ActiveCampaign, this trigger fires and provides the contact data. It allows real-time automation on ActiveCampaign events.',
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
      name: 'activecampaign-triggerApi',
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
    name: 'ActiveCampaign Trigger'
  },

  aliases: ['activecampaign', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in ActiveCampaign Trigger',
      workflow: {
        nodes: [
          {
            name: 'ActiveCampaign Trigger Trigger',
            type: 'n8n-nodes-base.activecampaign-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default activecampaigntriggerNode;