/**
 * Activation Trigger Node - Trigger
 * 
 * Triggers the workflow on certain lifecycle events: when the workflow is activated, when the n8n instance starts or restarts, or when an active workflow is saved:contentReference[oaicite:0]{index=0}.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const activationtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.activation-trigger',
  displayName: 'Activation Trigger',
  description: 'Triggers the workflow on certain lifecycle events: when the workflow is activated, when the n8n instance starts or restarts, or when an active workflow is saved:contentReference[oaicite:0]{index=0}.',
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
      name: 'activation-triggerApi',
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
    name: 'Activation Trigger'
  },

  aliases: ['activation', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Activation Trigger',
      workflow: {
        nodes: [
          {
            name: 'Activation Trigger Trigger',
            type: 'n8n-nodes-base.activation-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default activationtriggerNode;