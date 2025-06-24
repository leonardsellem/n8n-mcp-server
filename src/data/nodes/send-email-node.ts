/**
 * Send Email Node
 * 
 * Sends an email through an SMTP server or email service. You can specify recipients, subject, body (plaintext or HTML), and attachments. Requires an email credential (SMTP, or services like Gmail, etc.) to send the message.
 */

import { NodeTypeInfo } from '../node-types.js';

export const sendemailNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.send-email',
  displayName: 'Send Email',
  description: 'Sends an email through an SMTP server or email service. You can specify recipients, subject, body (plaintext or HTML), and attachments. Requires an email credential (SMTP, or services like Gmail, etc.) to send the message.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from Send Email'
    }
  ],

  credentials: [
    {
      name: 'send-emailApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Send Email'
  },

  aliases: ['send', 'email'],
  
  examples: [
        {
      name: 'Send via SMTP Item',
      description: 'Send via SMTP an item from Send Email',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.send-email',
            parameters: {
              operation: 'Send via SMTP',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sendemailNode;