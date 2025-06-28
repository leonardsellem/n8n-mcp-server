/**
 * Mailjet Trigger Node - Trigger
 * 
 * Starts a workflow on Mailjet email events via webhook. For instance, when an email is delivered to a recipient, opened, or a link is clicked, Mailjet can notify n8n through this trigger. This allows real-time engagement tracking – you could update a CRM when an email is opened or log clicks for analytics.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mailjettriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailjet-trigger',
  displayName: 'Mailjet Trigger',
  description: 'Starts a workflow on Mailjet email events via webhook. For instance, when an email is delivered to a recipient, opened, or a link is clicked, Mailjet can notify n8n through this trigger. This allows real-time engagement tracking – you could update a CRM when an email is opened or log clicks for analytics.',
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
      name: 'mailjet-triggerApi',
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
    name: 'Mailjet Trigger'
  },

  aliases: ['mailjet', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Mailjet Trigger',
      workflow: {
        nodes: [
          {
            name: 'Mailjet Trigger Trigger',
            type: 'n8n-nodes-base.mailjet-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mailjettriggerNode;