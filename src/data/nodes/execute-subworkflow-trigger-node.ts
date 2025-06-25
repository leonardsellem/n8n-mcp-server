/**
 * Execute Sub-workflow Trigger Node - Trigger
 * 
 * Used inside a sub-workflow to mark its start when invoked by an Execute Sub-workflow node:contentReference[oaicite:6]{index=6}. It triggers the sub-workflow execution when the parent workflow calls it (passing along incoming data).
 */

import { NodeTypeInfo } from '../node-types.js';

export const executesubworkflowtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.execute-subworkflow-trigger',
  displayName: 'Execute Sub-workflow Trigger',
  description: 'Used inside a sub-workflow to mark its start when invoked by an Execute Sub-workflow node:contentReference[oaicite:6]{index=6}. It triggers the sub-workflow execution when the parent workflow calls it (passing along incoming data).',
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
      name: 'execute-subworkflow-triggerApi',
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
    name: 'Execute Sub-workflow Trigger'
  },

  aliases: ['execute', 'sub', 'workflow', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Execute Sub-workflow Trigger',
      workflow: {
        nodes: [
          {
            name: 'Execute Sub-workflow Trigger Trigger',
            type: 'n8n-nodes-base.execute-subworkflow-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default executesubworkflowtriggerNode;