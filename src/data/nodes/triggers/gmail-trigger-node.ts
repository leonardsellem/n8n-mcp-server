/**
 * Gmail Trigger Node - Trigger
 * 
 * Fires when a new email arrives in a Gmail mailbox (via Gmail’s push notifications):contentReference[oaicite:62]{index=62}:contentReference[oaicite:63]{index=63}. You set up which mailbox/label to watch, and when a new message meets the criteria, the workflow triggers with the email content. This is useful for automating processing of inbound emails—like parsing orders or creating support tickets as emails come in.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const gmailtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gmail-trigger',
  displayName: 'Gmail Trigger',
  description: 'Fires when a new email arrives in a Gmail mailbox (via Gmail’s push notifications):contentReference[oaicite:62]{index=62}:contentReference[oaicite:63]{index=63}. You set up which mailbox/label to watch, and when a new message meets the criteria, the workflow triggers with the email content. This is useful for automating processing of inbound emails—like parsing orders or creating support tickets as emails come in.',
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
      name: 'gmail-triggerApi',
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
    name: 'Gmail Trigger'
  },

  aliases: ['gmail', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Gmail Trigger',
      workflow: {
        nodes: [
          {
            name: 'Gmail Trigger Trigger',
            type: 'n8n-nodes-base.gmail-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default gmailtriggerNode;