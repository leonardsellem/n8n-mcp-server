/**
 * Form.io Trigger Node - Trigger
 * 
 * Starts a workflow when a new form submission is received on a Form.io form. Whenever someone fills out and submits your Form.io form, this trigger will fire with the submission data, enabling you to process or store that info (like saving to a DB or sending a confirmation email).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const formiotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.formio-trigger',
  displayName: 'Form.io Trigger',
  description: 'Starts a workflow when a new form submission is received on a Form.io form. Whenever someone fills out and submits your Form.io form, this trigger will fire with the submission data, enabling you to process or store that info (like saving to a DB or sending a confirmation email).',
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
      name: 'formio-triggerApi',
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
    name: 'Form.io Trigger'
  },

  aliases: ['form.io', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Form.io Trigger',
      workflow: {
        nodes: [
          {
            name: 'Form.io Trigger Trigger',
            type: 'n8n-nodes-base.formio-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default formiotriggerNode;