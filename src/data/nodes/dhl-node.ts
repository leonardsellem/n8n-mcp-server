/**
 * DHL Node
 * 
 * Integrates with DHL APIs. Enables tracking a DHL shipment by tracking number (returning status and location updates) and obtaining shipping rate quotes. Useful for logistics workflows to monitor packages or calculate shipping costs.
 */

import { NodeTypeInfo } from '../node-types.js';

export const dhlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.dhl',
  displayName: 'DHL',
  description: 'Integrates with DHL APIs. Enables tracking a DHL shipment by tracking number (returning status and location updates) and obtaining shipping rate quotes. Useful for logistics workflows to monitor packages or calculate shipping costs.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Track Shipment',
      description: 'The operation to perform',
      options: [
        { name: 'Track Shipment', value: 'Track Shipment' },
        { name: 'Get Shipping Quote', value: 'Get Shipping Quote' }
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
      description: 'Processed data from DHL'
    }
  ],

  credentials: [
    {
      name: 'dhlApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'DHL'
  },

  aliases: ['dhl'],
  
  examples: [
        {
      name: 'Track Shipment Item',
      description: 'Track Shipment an item from DHL',
      workflow: {
        nodes: [
          {
            name: 'DHL',
            type: 'n8n-nodes-base.dhl',
            parameters: {
              operation: 'Track Shipment',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default dhlNode;