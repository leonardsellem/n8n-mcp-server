/**
 * Email Trigger (IMAP) Node - Trigger
 * 
 * Watches an email inbox via IMAP and triggers the workflow when new emails arrive:contentReference[oaicite:4]{index=4}. It supplies the email content as workflow data for downstream processing.
 */

import { NodeTypeInfo } from '../node-types.js';

export const emailtriggerimapNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.email-trigger-imap',
  displayName: 'Email Trigger (IMAP)',
  description: 'Watches an email inbox via IMAP and triggers the workflow when new emails arrive:contentReference[oaicite:4]{index=4}. It supplies the email content as workflow data for downstream processing.',
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
      name: 'email-trigger-imapApi',
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
    name: 'Email Trigger (IMAP)'
  },

  aliases: ['email', 'trigger', 'imap'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Email Trigger (IMAP)',
      workflow: {
        nodes: [
          {
            name: 'Email Trigger (IMAP) Trigger',
            type: 'n8n-nodes-base.email-trigger-imap',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default emailtriggerimapNode;