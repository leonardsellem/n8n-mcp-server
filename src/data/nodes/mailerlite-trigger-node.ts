/**
 * MailerLite Trigger Node - Trigger
 * 
 * Fires on MailerLite events like someone subscribing to a list or unsubscribing. It feeds the subscriber info into the workflow immediately. Great for keeping an external database updated with newsletter members or sending a custom welcome when someone subscribes via MailerLite.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mailerlitetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailerlite-trigger',
  displayName: 'MailerLite Trigger',
  description: 'Fires on MailerLite events like someone subscribing to a list or unsubscribing. It feeds the subscriber info into the workflow immediately. Great for keeping an external database updated with newsletter members or sending a custom welcome when someone subscribes via MailerLite.',
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
      name: 'mailerlite-triggerApi',
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
    name: 'MailerLite Trigger'
  },

  aliases: ['mailerlite', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in MailerLite Trigger',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger Trigger',
            type: 'n8n-nodes-base.mailerlite-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mailerlitetriggerNode;