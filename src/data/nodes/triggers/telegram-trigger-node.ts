/**
 * Telegram Trigger Node - Trigger
 * 
 * Fires whenever your Telegram Bot receives a new message (either in a one-on-one chat or a command in a group):contentReference[oaicite:78]{index=78}:contentReference[oaicite:79]{index=79}. This provides the message text and sender info to the workflow. It’s essential for building Telegram bots with n8n, allowing you to parse commands or messages and respond or act on them.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const telegramtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.telegram-trigger',
  displayName: 'Telegram Trigger',
  description: 'Fires whenever your Telegram Bot receives a new message (either in a one-on-one chat or a command in a group):contentReference[oaicite:78]{index=78}:contentReference[oaicite:79]{index=79}. This provides the message text and sender info to the workflow. It’s essential for building Telegram bots with n8n, allowing you to parse commands or messages and respond or act on them.',
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
      name: 'telegram-triggerApi',
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
    name: 'Telegram Trigger'
  },

  aliases: ['telegram', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Telegram Trigger',
      workflow: {
        nodes: [
          {
            name: 'Telegram Trigger Trigger',
            type: 'n8n-nodes-base.telegram-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default telegramtriggerNode;