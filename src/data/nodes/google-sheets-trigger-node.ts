/**
 * Google Sheets Trigger Node - Trigger
 * 
 * Fires when a new row is added to a specified Google Sheet (using the Google Sheets API or an Apps Script trigger):contentReference[oaicite:67]{index=67}. When someone appends a row (e.g., via a Google Form submission or manual input), this trigger provides the row’s data. Great for reacting instantly to form submissions or data collection in Sheets.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlesheetstriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-sheets-trigger',
  displayName: 'Google Sheets Trigger',
  description: 'Fires when a new row is added to a specified Google Sheet (using the Google Sheets API or an Apps Script trigger):contentReference[oaicite:67]{index=67}. When someone appends a row (e.g., via a Google Form submission or manual input), this trigger provides the row’s data. Great for reacting instantly to form submissions or data collection in Sheets.',
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
      name: 'google-sheets-triggerApi',
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
    name: 'Google Sheets Trigger'
  },

  aliases: ['google', 'sheets', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Google Sheets Trigger',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets Trigger Trigger',
            type: 'n8n-nodes-base.google-sheets-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default googlesheetstriggerNode;