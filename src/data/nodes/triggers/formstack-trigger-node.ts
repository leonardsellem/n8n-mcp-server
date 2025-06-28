/**
 * Formstack Trigger Node - Trigger
 * 
 * Fires when a Formstack form is submitted. It catches the submission via Formstack’s webhook and provides the form fields data to the workflow. You can then automate actions such as adding to a mailing list, generating a document, or sending a Slack message with the submitted info.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const formstacktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.formstack-trigger',
  displayName: 'Formstack Trigger',
  description: 'Fires when a Formstack form is submitted. It catches the submission via Formstack’s webhook and provides the form fields data to the workflow. You can then automate actions such as adding to a mailing list, generating a document, or sending a Slack message with the submitted info.',
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
      name: 'formstack-triggerApi',
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
    name: 'Formstack Trigger'
  },

  aliases: ['formstack', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Formstack Trigger',
      workflow: {
        nodes: [
          {
            name: 'Formstack Trigger Trigger',
            type: 'n8n-nodes-base.formstack-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default formstacktriggerNode;