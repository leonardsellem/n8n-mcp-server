/**
 * Local File Trigger Node - Trigger
 * 
 * Monitors the local filesystem for changes. It can trigger the workflow when new files are added to a folder or when an existing file is modified. Useful for reacting to files dropped in a directory (if n8n has access to the disk).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const localfiletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.local-file-trigger',
  displayName: 'Local File Trigger',
  description: 'Monitors the local filesystem for changes. It can trigger the workflow when new files are added to a folder or when an existing file is modified. Useful for reacting to files dropped in a directory (if n8n has access to the disk).',
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
      name: 'local-file-triggerApi',
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
    name: 'Local File Trigger'
  },

  aliases: ['local', 'file', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Local File Trigger',
      workflow: {
        nodes: [
          {
            name: 'Local File Trigger Trigger',
            type: 'n8n-nodes-base.local-file-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default localfiletriggerNode;