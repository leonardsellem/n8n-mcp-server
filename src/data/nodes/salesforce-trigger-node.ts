/**
 * Salesforce Trigger Node - Trigger
 * 
 * Fires on Salesforce CRM changes via Platform Events or Change Data Capture. For example, when a new object record (Lead, Contact, etc.) is created or when a record is updated in Salesforce, it triggers with the record data:contentReference[oaicite:74]{index=74}. This enables tight coupling between Salesforce and other tools, like automatically notifying Slack on high-value leads or syncing updated data to a database.
 */

import { NodeTypeInfo } from '../node-types.js';

export const salesforcetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.salesforce-trigger',
  displayName: 'Salesforce Trigger',
  description: 'Fires on Salesforce CRM changes via Platform Events or Change Data Capture. For example, when a new object record (Lead, Contact, etc.) is created or when a record is updated in Salesforce, it triggers with the record data:contentReference[oaicite:74]{index=74}. This enables tight coupling between Salesforce and other tools, like automatically notifying Slack on high-value leads or syncing updated data to a database.',
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
      name: 'salesforce-triggerApi',
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
    name: 'Salesforce Trigger'
  },

  aliases: ['salesforce', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Salesforce Trigger',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger Trigger',
            type: 'n8n-nodes-base.salesforce-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default salesforcetriggerNode;