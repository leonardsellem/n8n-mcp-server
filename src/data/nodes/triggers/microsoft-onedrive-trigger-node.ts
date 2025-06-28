/**
 * Microsoft OneDrive Trigger Node - Trigger
 * 
 * Starts a workflow when a new file is uploaded or an existing file is modified in a OneDrive folder:contentReference[oaicite:70]{index=70}. Using Microsoft’s webhook notifications, this trigger catches changes in OneDrive. Useful for processing incoming files (like parsing a spreadsheet as soon as it’s dropped in a drive) or keeping systems synchronized with the latest files.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftonedrivetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-onedrive-trigger',
  displayName: 'Microsoft OneDrive Trigger',
  description: 'Starts a workflow when a new file is uploaded or an existing file is modified in a OneDrive folder:contentReference[oaicite:70]{index=70}. Using Microsoft’s webhook notifications, this trigger catches changes in OneDrive. Useful for processing incoming files (like parsing a spreadsheet as soon as it’s dropped in a drive) or keeping systems synchronized with the latest files.',
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
      name: 'microsoft-onedrive-triggerApi',
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
    name: 'Microsoft OneDrive Trigger'
  },

  aliases: ['microsoft', 'onedrive', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Microsoft OneDrive Trigger',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive Trigger Trigger',
            type: 'n8n-nodes-base.microsoft-onedrive-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftonedrivetriggerNode;