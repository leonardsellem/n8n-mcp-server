/**
 * Mailchimp Trigger Node - Trigger
 * 
 * Starts the workflow on Mailchimp events:contentReference[oaicite:69]{index=69}. For example, when a new subscriber joins a Mailchimp list, or when an email campaign has finished sending, this trigger fires with related data. This enables reacting to mailing list signups instantly or doing things like logging campaign performance once sent.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mailchimptriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailchimp-trigger',
  displayName: 'Mailchimp Trigger',
  description: 'Starts the workflow on Mailchimp events:contentReference[oaicite:69]{index=69}. For example, when a new subscriber joins a Mailchimp list, or when an email campaign has finished sending, this trigger fires with related data. This enables reacting to mailing list signups instantly or doing things like logging campaign performance once sent.',
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
      name: 'mailchimp-triggerApi',
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
    name: 'Mailchimp Trigger'
  },

  aliases: ['mailchimp', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Mailchimp Trigger',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp Trigger Trigger',
            type: 'n8n-nodes-base.mailchimp-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mailchimptriggerNode;