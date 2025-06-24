/**
 * Invoice Ninja Node
 * 
 * Works with Invoice Ninja (invoicing platform). You can create new invoices, email/send an invoice to a client, list clients, and record payments. Useful for automating billing processes (e.g., auto-generate invoices from orders).
 */

import { NodeTypeInfo } from '../node-types.js';

export const invoiceninjaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.invoice-ninja',
  displayName: 'Invoice Ninja',
  description: 'Works with Invoice Ninja (invoicing platform). You can create new invoices, email/send an invoice to a client, list clients, and record payments. Useful for automating billing processes (e.g., auto-generate invoices from orders).',
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
        { name: 'Send Invoice', value: 'Send Invoice' },
        { name: 'List Clients', value: 'List Clients' },
        { name: 'Create Payment', value: 'Create Payment' }
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
      description: 'Processed data from Invoice Ninja'
    }
  ],

  credentials: [
    {
      name: 'invoice-ninjaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Invoice Ninja'
  },

  aliases: ['invoice', 'ninja'],
  
  examples: [
        {
      name: 'Create Invoice Item',
      description: 'Create Invoice an item from Invoice Ninja',
      workflow: {
        nodes: [
          {
            name: 'Invoice Ninja',
            type: 'n8n-nodes-base.invoice-ninja',
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

export default invoiceninjaNode;