/**
 * WooCommerce Node
 * 
 * Connects to WooCommerce (e-commerce plugin for WordPress). Allows creating orders, retrieving order details, updating order status or info, listing products in the store, and creating new customers. This helps automate online store operations, like processing orders or syncing product info with other systems.
 */

import { NodeTypeInfo } from '../node-types.js';

export const woocommerceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.woocommerce',
  displayName: 'WooCommerce',
  description: 'Connects to WooCommerce (e-commerce plugin for WordPress). Allows creating orders, retrieving order details, updating order status or info, listing products in the store, and creating new customers. This helps automate online store operations, like processing orders or syncing product info with other systems.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Order',
      description: 'The operation to perform',
      options: [
        { name: 'Create Order', value: 'Create Order' },
        { name: 'Get Order', value: 'Get Order' },
        { name: 'Update Order', value: 'Update Order' },
        { name: 'List Products', value: 'List Products' },
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
      description: 'Processed data from WooCommerce'
    }
  ],

  credentials: [
    {
      name: 'woocommerceApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'WooCommerce'
  },

  aliases: ['woocommerce'],
  
  examples: [
        {
      name: 'Create Order Item',
      description: 'Create Order an item from WooCommerce',
      workflow: {
        nodes: [
          {
            name: 'WooCommerce',
            type: 'n8n-nodes-base.woocommerce',
            parameters: {
              operation: 'Create Order',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default woocommerceNode;