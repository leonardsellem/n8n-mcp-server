/**
 * Error Trigger Node - Trigger
 * 
 * Fires when an error occurs in the workflow. Use this node at the start of a workflow to catch errors from other workflows (configured in their settings) and handle those errors (for example, to send notifications).
 */

import { NodeTypeInfo } from '../node-types.js';

export const errortriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.error-trigger',
  displayName: 'Error Trigger',
  description: 'Fires when an error occurs in the workflow. Use this node at the start of a workflow to catch errors from other workflows (configured in their settings) and handle those errors (for example, to send notifications).',
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
      name: 'error-triggerApi',
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
    name: 'Error Trigger'
  },

  aliases: ['error', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Error Trigger',
      workflow: {
        nodes: [
          {
            name: 'Error Trigger Trigger',
            type: 'n8n-nodes-base.error-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default errortriggerNode;