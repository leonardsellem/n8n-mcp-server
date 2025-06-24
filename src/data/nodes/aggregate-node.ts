/**
 * Aggregate Node
 * 
 * Groups multiple incoming items (or selected fields of items) into single combined items:contentReference[oaicite:1]{index=1}. Useful for bundling data (via modes like **Individual Fields** or **All Item Data**) before passing it to the next node.
 */

import { NodeTypeInfo } from '../node-types.js';

export const aggregateNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aggregate',
  displayName: 'Aggregate',
  description: 'Groups multiple incoming items (or selected fields of items) into single combined items:contentReference[oaicite:1]{index=1}. Useful for bundling data (via modes like **Individual Fields** or **All Item Data**) before passing it to the next node.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Aggregate'
    }
  ],

  credentials: [
    {
      name: 'aggregateApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Aggregate'
  },

  aliases: ['aggregate'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Aggregate',
      workflow: {
        nodes: [
          {
            name: 'Aggregate',
            type: 'n8n-nodes-base.aggregate',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default aggregateNode;