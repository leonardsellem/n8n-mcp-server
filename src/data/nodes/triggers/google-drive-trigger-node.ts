/**
 * Google Drive Trigger Node - Trigger
 * 
 * Fires when files are added or modified in a specific Google Drive folder:contentReference[oaicite:65]{index=65}:contentReference[oaicite:66]{index=66}. Using Google Drive’s push notifications, the trigger can respond whenever someone uploads a file or edits a file in that folder. This enables automated processing of files as they come in (like reading data from a spreadsheet when updated, etc.).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googledrivetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-drive-trigger',
  displayName: 'Google Drive Trigger',
  description: 'Fires when files are added or modified in a specific Google Drive folder:contentReference[oaicite:65]{index=65}:contentReference[oaicite:66]{index=66}. Using Google Drive’s push notifications, the trigger can respond whenever someone uploads a file or edits a file in that folder. This enables automated processing of files as they come in (like reading data from a spreadsheet when updated, etc.).',
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
      name: 'google-drive-triggerApi',
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
    name: 'Google Drive Trigger'
  },

  aliases: ['google', 'drive', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Google Drive Trigger',
      workflow: {
        nodes: [
          {
            name: 'Google Drive Trigger Trigger',
            type: 'n8n-nodes-base.google-drive-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default googledrivetriggerNode;