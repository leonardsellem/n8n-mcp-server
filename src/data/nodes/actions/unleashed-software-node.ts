/**
 * Unleashed Software Node
 * 
 * Integrates with Unleashed (inventory management). Allows retrieving product list and stock levels, and creating sales orders. Useful for e-commerce or inventory workflows, like checking stock before sale or logging new orders into Unleashed.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const unleashedsoftwareNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.unleashed-software',
  displayName: 'Unleashed Software',
  description: 'Integrates with Unleashed (inventory management). Allows retrieving product list and stock levels, and creating sales orders. Useful for e-commerce or inventory workflows, like checking stock before sale or logging new orders into Unleashed.',
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
        { name: 'Get Stock', value: 'Get Stock' },
        { name: 'Create Sales Order', value: 'Create Sales Order' }
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
      description: 'Processed data from Unleashed Software'
    }
  ],

  credentials: [
    {
      name: 'unleashed-softwareApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Unleashed Software'
  },

  aliases: ['unleashed', 'software'],
  
  examples: [
        {
      name: 'List Products Item',
      description: 'List Products an item from Unleashed Software',
      workflow: {
        nodes: [
          {
            name: 'Unleashed Software',
            type: 'n8n-nodes-base.unleashed-software',
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

export default unleashedsoftwareNode;