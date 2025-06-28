/**
 * Box Trigger Node - Trigger
 * 
 * Starts a workflow for events in Box (cloud storage). E.g., when a new file is uploaded to a watched folder, or an existing file is updated, the trigger will fire with file details:contentReference[oaicite:55]{index=55}. Useful for document-driven flows, like processing files as soon as they appear.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const boxtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.box-trigger',
  displayName: 'Box Trigger',
  description: 'Starts a workflow for events in Box (cloud storage). E.g., when a new file is uploaded to a watched folder, or an existing file is updated, the trigger will fire with file details:contentReference[oaicite:55]{index=55}. Useful for document-driven flows, like processing files as soon as they appear.',
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
      name: 'box-triggerApi',
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
    name: 'Box Trigger'
  },

  aliases: ['box', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Box Trigger',
      workflow: {
        nodes: [
          {
            name: 'Box Trigger Trigger',
            type: 'n8n-nodes-base.box-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default boxtriggerNode;