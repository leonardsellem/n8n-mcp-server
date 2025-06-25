/**
 * Customer.io Node
 * 
 * Integrates with Customer.io (customer engagement platform). Allows adding or updating customer profiles, retrieving customer data, and triggering broadcast messages or campaigns. Useful for marketing automation and personalized messaging via Customer.io.
 */

import { NodeTypeInfo } from '../node-types.js';

export const customerioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.customerio',
  displayName: 'Customer.io',
  description: 'Integrates with Customer.io (customer engagement platform). Allows adding or updating customer profiles, retrieving customer data, and triggering broadcast messages or campaigns. Useful for marketing automation and personalized messaging via Customer.io.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create/Update Customer',
      description: 'The operation to perform',
      options: [
        { name: 'Create/Update Customer', value: 'Create/Update Customer' },
        { name: 'Get Customer', value: 'Get Customer' },
        { name: 'Trigger Broadcast', value: 'Trigger Broadcast' }
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
      description: 'Processed data from Customer.io'
    }
  ],

  credentials: [
    {
      name: 'customerioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Customer.io'
  },

  aliases: ['customer.io'],
  
  examples: [
        {
      name: 'Create/Update Customer Item',
      description: 'Create/Update Customer an item from Customer.io',
      workflow: {
        nodes: [
          {
            name: 'Customer.io',
            type: 'n8n-nodes-base.customerio',
            parameters: {
              operation: 'Create/Update Customer',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default customerioNode;