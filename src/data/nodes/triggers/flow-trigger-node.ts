/**
 * Flow Trigger Node - Trigger
 * 
 * Triggers on events in Microsoft Planner/Flow (assuming the “Flow” refers to that context). For example, when a new task card is created or moved to a different bucket/stage, it triggers. This allows integration of tasks with other systems (like creating a related item when a task moves to 'Done').
 */

import { NodeTypeInfo } from '../../node-types.js';

export const flowtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.flow-trigger',
  displayName: 'Flow Trigger',
  description: 'Triggers on events in Microsoft Planner/Flow (assuming the “Flow” refers to that context). For example, when a new task card is created or moved to a different bucket/stage, it triggers. This allows integration of tasks with other systems (like creating a related item when a task moves to \'Done\').',
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
      name: 'flow-triggerApi',
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
    name: 'Flow Trigger'
  },

  aliases: ['flow', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Flow Trigger',
      workflow: {
        nodes: [
          {
            name: 'Flow Trigger Trigger',
            type: 'n8n-nodes-base.flow-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default flowtriggerNode;