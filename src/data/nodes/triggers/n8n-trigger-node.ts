/**
 * n8n Trigger Node - Trigger
 * 
 * Starts the workflow when another workflow executes an external trigger for it. This is used for one workflow to trigger another (distinct from Sub-workflow; it’s more like an event trigger that another workflow can emit via an **n8n node**).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const n8ntriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.n8n-trigger',
  displayName: 'n8n Trigger',
  description: 'Starts the workflow when another workflow executes an external trigger for it. This is used for one workflow to trigger another (distinct from Sub-workflow; it’s more like an event trigger that another workflow can emit via an **n8n node**).',
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
      name: 'n8n-triggerApi',
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
    name: 'n8n Trigger'
  },

  aliases: ['n8n', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in n8n Trigger',
      workflow: {
        nodes: [
          {
            name: 'n8n Trigger Trigger',
            type: 'n8n-nodes-base.n8n-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default n8ntriggerNode;