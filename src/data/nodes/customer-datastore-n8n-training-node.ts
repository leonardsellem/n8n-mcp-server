/**
 * Customer Datastore (n8n Training) Node
 * 
 * A demo/training node representing a Customer Datastore (for n8n learning purposes). It can fetch a customer record or list all customers in this mock datastore. (Primarily used in n8n training scenarios to simulate a database of customers.)
 */

import { NodeTypeInfo } from '../node-types.js';

export const customerdatastoren8ntrainingNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.customer-datastore-n8n-training',
  displayName: 'Customer Datastore (n8n Training)',
  description: 'A demo/training node representing a Customer Datastore (for n8n learning purposes). It can fetch a customer record or list all customers in this mock datastore. (Primarily used in n8n training scenarios to simulate a database of customers.)',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Customer',
      description: 'The operation to perform',
      options: [
        { name: 'Get Customer', value: 'Get Customer' },
        { name: 'List Customers', value: 'List Customers' }
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
      description: 'Processed data from Customer Datastore (n8n Training)'
    }
  ],

  credentials: [
    {
      name: 'customer-datastore-n8n-trainingApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Customer Datastore (n8n Training)'
  },

  aliases: ['customer', 'datastore', 'n8n', 'training'],
  
  examples: [
        {
      name: 'Get Customer Item',
      description: 'Get Customer an item from Customer Datastore (n8n Training)',
      workflow: {
        nodes: [
          {
            name: 'Customer Datastore (n8n Training)',
            type: 'n8n-nodes-base.customer-datastore-n8n-training',
            parameters: {
              operation: 'Get Customer',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default customerdatastoren8ntrainingNode;