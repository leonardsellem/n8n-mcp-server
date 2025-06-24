/**
 * Manual Trigger Node - Trigger
 * 
 * Starts the workflow manually when you click “Execute Workflow” for testing. It does not run automatically on any external event:contentReference[oaicite:11]{index=11}. Use this for developing or running workflows on-demand (it prevents any automatic triggers from firing).
 */

import { NodeTypeInfo } from '../node-types.js';

export const manualtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.manual-trigger',
  displayName: 'Manual Trigger',
  description: 'Starts the workflow manually when you click “Execute Workflow” for testing. It does not run automatically on any external event:contentReference[oaicite:11]{index=11}. Use this for developing or running workflows on-demand (it prevents any automatic triggers from firing).',
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
      name: 'manual-triggerApi',
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
    name: 'Manual Trigger'
  },

  aliases: ['manual', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Manual Trigger',
      workflow: {
        nodes: [
          {
            name: 'Manual Trigger Trigger',
            type: 'n8n-nodes-base.manual-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default manualtriggerNode;