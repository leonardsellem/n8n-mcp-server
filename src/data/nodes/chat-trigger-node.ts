/**
 * Chat Trigger Node - Trigger
 * 
 * Starts the workflow when a chat message is received in the built-in n8n chat (for example, when using n8n’s live chat interface). Allows workflows to be triggered by chat commands or messages.
 */

import { NodeTypeInfo } from '../node-types.js';

export const chattriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.chat-trigger',
  displayName: 'Chat Trigger',
  description: 'Starts the workflow when a chat message is received in the built-in n8n chat (for example, when using n8n’s live chat interface). Allows workflows to be triggered by chat commands or messages.',
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
      name: 'chat-triggerApi',
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
    name: 'Chat Trigger'
  },

  aliases: ['chat', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Chat Trigger',
      workflow: {
        nodes: [
          {
            name: 'Chat Trigger Trigger',
            type: 'n8n-nodes-base.chat-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default chattriggerNode;