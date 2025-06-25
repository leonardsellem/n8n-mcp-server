/**
 * Workflow Trigger Node - Trigger
 * 
 * Triggers the workflow via the n8n API or CLI. When this node is present, the workflow can be started by an external call to n8n’s REST API (or via the Editor UI’s “Execute Workflow” function with a specific trigger) to programmatically kick off the workflow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const workflowtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.workflow-trigger',
  displayName: 'Workflow Trigger',
  description: 'Triggers the workflow via the n8n API or CLI. When this node is present, the workflow can be started by an external call to n8n’s REST API (or via the Editor UI’s “Execute Workflow” function with a specific trigger) to programmatically kick off the workflow.',
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
      name: 'workflow-triggerApi',
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
    name: 'Workflow Trigger'
  },

  aliases: ['workflow', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Workflow Trigger',
      workflow: {
        nodes: [
          {
            name: 'Workflow Trigger Trigger',
            type: 'n8n-nodes-base.workflow-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default workflowtriggerNode;