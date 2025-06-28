/**
 * JotForm Trigger Node - Trigger
 * 
 * Fires when a JotForm form receives a new submission. It catches the form data via JotForm’s webhook, starting the workflow with all the submission answers. This is excellent for instantly processing form results—e.g., saving them to a database, or sending an email to the respondent.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const jotformtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jotform-trigger',
  displayName: 'JotForm Trigger',
  description: 'Fires when a JotForm form receives a new submission. It catches the form data via JotForm’s webhook, starting the workflow with all the submission answers. This is excellent for instantly processing form results—e.g., saving them to a database, or sending an email to the respondent.',
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
      name: 'jotform-triggerApi',
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
    name: 'JotForm Trigger'
  },

  aliases: ['jotform', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in JotForm Trigger',
      workflow: {
        nodes: [
          {
            name: 'JotForm Trigger Trigger',
            type: 'n8n-nodes-base.jotform-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default jotformtriggerNode;