/**
 * QuickBooks Online Node
 * 
 * Works with QuickBooks Online (accounting software). Allows creating invoices, retrieving invoice details, creating new customer records, fetching customer info, and recording payments for invoices. Enables accounting automation like invoicing customers or updating financial records from other triggers.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const quickbooksonlineNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.quickbooks-online',
  displayName: 'QuickBooks Online',
  description: 'Works with QuickBooks Online (accounting software). Allows creating invoices, retrieving invoice details, creating new customer records, fetching customer info, and recording payments for invoices. Enables accounting automation like invoicing customers or updating financial records from other triggers.',
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
        { name: 'Create Customer', value: 'Create Customer' },
        { name: 'Get Customer', value: 'Get Customer' },
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
      description: 'Processed data from QuickBooks Online'
    }
  ],

  credentials: [
    {
      name: 'quickbooks-onlineApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'QuickBooks Online'
  },

  aliases: ['quickbooks', 'online'],
  
  examples: [
        {
      name: 'Create Invoice Item',
      description: 'Create Invoice an item from QuickBooks Online',
      workflow: {
        nodes: [
          {
            name: 'QuickBooks Online',
            type: 'n8n-nodes-base.quickbooks-online',
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

export default quickbooksonlineNode;