/**
 * Keap Node
 * 
 * Integrates with Keap (Infusionsoft). Supports adding/updating contacts, listing contacts, and creating orders/transactions. Useful for sales and marketing workflows where you keep CRM (Keap) updated or trigger actions based on e-commerce events.
 */

import { NodeTypeInfo } from '../node-types.js';

export const keapNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.keap',
  displayName: 'Keap',
  description: 'Integrates with Keap (Infusionsoft). Supports adding/updating contacts, listing contacts, and creating orders/transactions. Useful for sales and marketing workflows where you keep CRM (Keap) updated or trigger actions based on e-commerce events.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Create Contact', value: 'Create Contact' },
        { name: 'Update Contact', value: 'Update Contact' },
        { name: 'List Contacts', value: 'List Contacts' },
        { name: 'Create Order', value: 'Create Order' }
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
      description: 'Processed data from Keap'
    }
  ],

  credentials: [
    {
      name: 'keapApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Keap'
  },

  aliases: ['keap'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Keap',
      workflow: {
        nodes: [
          {
            name: 'Keap',
            type: 'n8n-nodes-base.keap',
            parameters: {
              operation: 'Create Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default keapNode;