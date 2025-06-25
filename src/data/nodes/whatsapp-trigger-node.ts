/**
 * WhatsApp Trigger Node - Trigger
 * 
 * Starts a workflow when a new WhatsApp message is received by your WhatsApp Business API setup:contentReference[oaicite:84]{index=84}. For instance, using the WhatsApp Cloud API, an incoming message from a customer can hit this trigger with the message text and sender info. You can then automate replies or log the message in a system. (This requires a WhatsApp Business API webhook configuration.)
 */

import { NodeTypeInfo } from '../node-types.js';

export const whatsapptriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.whatsapp-trigger',
  displayName: 'WhatsApp Trigger',
  description: 'Starts a workflow when a new WhatsApp message is received by your WhatsApp Business API setup:contentReference[oaicite:84]{index=84}. For instance, using the WhatsApp Cloud API, an incoming message from a customer can hit this trigger with the message text and sender info. You can then automate replies or log the message in a system. (This requires a WhatsApp Business API webhook configuration.)',
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
      name: 'whatsapp-triggerApi',
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
    name: 'WhatsApp Trigger'
  },

  aliases: ['whatsapp', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in WhatsApp Trigger',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Trigger Trigger',
            type: 'n8n-nodes-base.whatsapp-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default whatsapptriggerNode;