/**
 * Mailjet Node
 * 
 * Integrates with Mailjet (email service). Allows sending emails via Mailjet, retrieving contacts, and adding contacts to Mailjet contact lists. Good for email automation flows using Mailjet for both transactional emails and contact management.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mailjetNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailjet',
  displayName: 'Mailjet',
  description: 'Integrates with Mailjet (email service). Allows sending emails via Mailjet, retrieving contacts, and adding contacts to Mailjet contact lists. Good for email automation flows using Mailjet for both transactional emails and contact management.',
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
        { name: 'Get Contacts', value: 'Get Contacts' },
        { name: 'Add Contact to List', value: 'Add Contact to List' }
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
      description: 'Processed data from Mailjet'
    }
  ],

  credentials: [
    {
      name: 'mailjetApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Mailjet'
  },

  aliases: ['mailjet'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from Mailjet',
      workflow: {
        nodes: [
          {
            name: 'Mailjet',
            type: 'n8n-nodes-base.mailjet',
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

export default mailjetNode;