/**
 * Xero Node
 * 
 * Integrates with Xero (accounting software). Allows creating invoices, retrieving invoice details, creating new contacts (clients or suppliers), listing contacts, and recording payments against invoices. This enables accounting and invoicing automation in workflows for businesses using Xero.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const xeroNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.xero',
  displayName: 'Xero',
  description: 'Integrates with Xero (accounting software). Allows creating invoices, retrieving invoice details, creating new contacts (clients or suppliers), listing contacts, and recording payments against invoices. This enables accounting and invoicing automation in workflows for businesses using Xero.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Invoice',
      description: 'The operation to perform',
      options: [
        { name: 'Create Invoice', value: 'Create Invoice' },
        { name: 'Get Invoice', value: 'Get Invoice' },
        { name: 'Create Contact', value: 'Create Contact' },
        { name: 'List Contacts', value: 'List Contacts' },
        { name: 'Record Payment', value: 'Record Payment' }
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
      description: 'Processed data from Xero'
    }
  ],

  credentials: [
    {
      name: 'xeroApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Xero'
  },

  aliases: ['xero'],
  
  examples: [
        {
      name: 'Create Invoice Item',
      description: 'Create Invoice an item from Xero',
      workflow: {
        nodes: [
          {
            name: 'Xero',
            type: 'n8n-nodes-base.xero',
            parameters: {
              operation: 'Create Invoice',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default xeroNode;