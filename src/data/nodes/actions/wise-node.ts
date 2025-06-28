/**
 * Wise Node
 * 
 * Integrates with Wise (formerly TransferWise, online banking/payments). You can create a money transfer, check the status of a transfer, and list account balances in different currencies. Useful for automating international payment processes or financial reconciliations using Wise.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const wiseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wise',
  displayName: 'Wise',
  description: 'Integrates with Wise (formerly TransferWise, online banking/payments). You can create a money transfer, check the status of a transfer, and list account balances in different currencies. Useful for automating international payment processes or financial reconciliations using Wise.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Transfer',
      description: 'The operation to perform',
      options: [
        { name: 'Create Transfer', value: 'Create Transfer' },
        { name: 'Get Transfer Status', value: 'Get Transfer Status' },
        { name: 'List Balances', value: 'List Balances' }
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
      description: 'Processed data from Wise'
    }
  ],

  credentials: [
    {
      name: 'wiseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Wise'
  },

  aliases: ['wise'],
  
  examples: [
        {
      name: 'Create Transfer Item',
      description: 'Create Transfer an item from Wise',
      workflow: {
        nodes: [
          {
            name: 'Wise',
            type: 'n8n-nodes-base.wise',
            parameters: {
              operation: 'Create Transfer',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default wiseNode;