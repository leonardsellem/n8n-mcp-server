/**
 * SeaTable Trigger Node - Trigger
 * 
 * Starts a workflow when a new row is added or an existing row is modified in a SeaTable base. SeaTable can send webhooks for such events, and this trigger catches them, providing the row data. It allows real-time integration of SeaTable (spreadsheet) data changes with external processes, similar to Airtable or Google Sheets triggers.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const seatabletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.seatable-trigger',
  displayName: 'SeaTable Trigger',
  description: 'Starts a workflow when a new row is added or an existing row is modified in a SeaTable base. SeaTable can send webhooks for such events, and this trigger catches them, providing the row data. It allows real-time integration of SeaTable (spreadsheet) data changes with external processes, similar to Airtable or Google Sheets triggers.',
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
      name: 'seatable-triggerApi',
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
    name: 'SeaTable Trigger'
  },

  aliases: ['seatable', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in SeaTable Trigger',
      workflow: {
        nodes: [
          {
            name: 'SeaTable Trigger Trigger',
            type: 'n8n-nodes-base.seatable-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default seatabletriggerNode;