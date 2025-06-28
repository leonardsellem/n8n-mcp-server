/**
 * Postmark Trigger Node - Trigger
 * 
 * Fires on Postmark (email service) events. For example, when an email sent via Postmark is delivered, opened by the recipient, or bounces (fails delivery), Postmark’s webhook will notify this trigger. This allows you to react to email engagement or issues, like logging bounces or updating a contact’s status upon email opens.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const postmarktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postmark-trigger',
  displayName: 'Postmark Trigger',
  description: 'Fires on Postmark (email service) events. For example, when an email sent via Postmark is delivered, opened by the recipient, or bounces (fails delivery), Postmark’s webhook will notify this trigger. This allows you to react to email engagement or issues, like logging bounces or updating a contact’s status upon email opens.',
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
      name: 'postmark-triggerApi',
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
    name: 'Postmark Trigger'
  },

  aliases: ['postmark', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Postmark Trigger',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger Trigger',
            type: 'n8n-nodes-base.postmark-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default postmarktriggerNode;