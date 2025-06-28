/**
 * Magento 2 Node
 * 
 * Connects to Magento 2 (e-commerce platform). Supports operations such as listing products in the catalog, retrieving order details, updating product stock levels, and creating new customer accounts. Enables e-commerce store automation like syncing stock or orders with other systems.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const magento2Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.magento-2',
  displayName: 'Magento 2',
  description: 'Connects to Magento 2 (e-commerce platform). Supports operations such as listing products in the catalog, retrieving order details, updating product stock levels, and creating new customer accounts. Enables e-commerce store automation like syncing stock or orders with other systems.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Products',
      description: 'The operation to perform',
      options: [
        { name: 'List Products', value: 'List Products' },
        { name: 'Get Order', value: 'Get Order' },
        { name: 'Update Stock', value: 'Update Stock' },
        { name: 'Create Customer', value: 'Create Customer' }
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
      description: 'Processed data from Magento 2'
    }
  ],

  credentials: [
    {
      name: 'magento-2Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Magento 2'
  },

  aliases: ['magento'],
  
  examples: [
        {
      name: 'List Products Item',
      description: 'List Products an item from Magento 2',
      workflow: {
        nodes: [
          {
            name: 'Magento 2',
            type: 'n8n-nodes-base.magento-2',
            parameters: {
              operation: 'List Products',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default magento2Node;