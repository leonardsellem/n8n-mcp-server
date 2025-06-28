/**
 * Tapfiliate Node
 * 
 * Integrates with Tapfiliate (affiliate tracking platform). Allows adding new affiliates (partners), retrieving conversion records (sales referred by affiliates), and creating a conversion record. Useful for automating affiliate program management, e.g., importing affiliates or logging sales events.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const tapfiliateNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.tapfiliate',
  displayName: 'Tapfiliate',
  description: 'Integrates with Tapfiliate (affiliate tracking platform). Allows adding new affiliates (partners), retrieving conversion records (sales referred by affiliates), and creating a conversion record. Useful for automating affiliate program management, e.g., importing affiliates or logging sales events.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Affiliate',
      description: 'The operation to perform',
      options: [
        { name: 'Create Affiliate', value: 'Create Affiliate' },
        { name: 'Get Conversions', value: 'Get Conversions' },
        { name: 'Create Conversion', value: 'Create Conversion' }
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
      description: 'Processed data from Tapfiliate'
    }
  ],

  credentials: [
    {
      name: 'tapfiliateApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Tapfiliate'
  },

  aliases: ['tapfiliate'],
  
  examples: [
        {
      name: 'Create Affiliate Item',
      description: 'Create Affiliate an item from Tapfiliate',
      workflow: {
        nodes: [
          {
            name: 'Tapfiliate',
            type: 'n8n-nodes-base.tapfiliate',
            parameters: {
              operation: 'Create Affiliate',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default tapfiliateNode;