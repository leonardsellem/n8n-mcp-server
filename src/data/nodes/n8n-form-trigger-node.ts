/**
 * n8n Form Trigger Node - Trigger
 * 
 * Starts a workflow when a user submits an n8n form. It works in conjunction with the Form node—once a form is displayed and filled, this trigger receives the submitted form data to continue the workflow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const n8nformtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.n8n-form-trigger',
  displayName: 'n8n Form Trigger',
  description: 'Starts a workflow when a user submits an n8n form. It works in conjunction with the Form node—once a form is displayed and filled, this trigger receives the submitted form data to continue the workflow.',
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
      name: 'n8n-form-triggerApi',
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
    name: 'n8n Form Trigger'
  },

  aliases: ['n8n', 'form', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in n8n Form Trigger',
      workflow: {
        nodes: [
          {
            name: 'n8n Form Trigger Trigger',
            type: 'n8n-nodes-base.n8n-form-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default n8nformtriggerNode;