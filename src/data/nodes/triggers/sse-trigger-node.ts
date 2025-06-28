/**
 * SSE Trigger Node - Trigger
 * 
 * Listens to a Server-Sent Events (SSE) stream. It opens a persistent HTTP connection to an SSE endpoint and triggers the workflow whenever an event is received on that stream. Useful for real-time triggers from SSE sources.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ssetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sse-trigger',
  displayName: 'SSE Trigger',
  description: 'Listens to a Server-Sent Events (SSE) stream. It opens a persistent HTTP connection to an SSE endpoint and triggers the workflow whenever an event is received on that stream. Useful for real-time triggers from SSE sources.',
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
      name: 'sse-triggerApi',
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
    name: 'SSE Trigger'
  },

  aliases: ['sse', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in SSE Trigger',
      workflow: {
        nodes: [
          {
            name: 'SSE Trigger Trigger',
            type: 'n8n-nodes-base.sse-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default ssetriggerNode;