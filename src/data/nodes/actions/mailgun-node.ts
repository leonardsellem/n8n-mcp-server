/**
 * Mailgun Node
 * 
 * Uses Mailgun (email sending service) to send emails and to retrieve email event logs. You can specify recipients, subject, body (text or HTML) for sending, and query events like delivered, opened, failed emails for tracking purposes.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mailgunNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailgun',
  displayName: 'Mailgun',
  description: 'Uses Mailgun (email sending service) to send emails and to retrieve email event logs. You can specify recipients, subject, body (text or HTML) for sending, and query events like delivered, opened, failed emails for tracking purposes.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Email',
      description: 'The operation to perform',
      options: [
        { name: 'Send Email', value: 'Send Email' },
        { name: 'List Events', value: 'List Events' }
      ]
    },

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
      description: 'Processed data from Mailgun'
    }
  ],

  credentials: [
    {
      name: 'mailgunApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Mailgun'
  },

  aliases: ['mailgun'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from Mailgun',
      workflow: {
        nodes: [
          {
            name: 'Mailgun',
            type: 'n8n-nodes-base.mailgun',
            parameters: {
              operation: 'Send Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mailgunNode;