/**
 * Compare Datasets Node
 * 
 * Compares two incoming data sets and outputs differences or matches. Useful for finding added, removed, or changed items between two sets of data.
 */

import { NodeTypeInfo } from '../node-types.js';

export const comparedatasetsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.compare-datasets',
  displayName: 'Compare Datasets',
  description: 'Compares two incoming data sets and outputs differences or matches. Useful for finding added, removed, or changed items between two sets of data.',
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
      description: 'Processed data from Compare Datasets'
    }
  ],

  credentials: [
    {
      name: 'compare-datasetsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Compare Datasets'
  },

  aliases: ['compare', 'datasets'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Compare Datasets',
      workflow: {
        nodes: [
          {
            name: 'Compare Datasets',
            type: 'n8n-nodes-base.compare-datasets',
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

export default comparedatasetsNode;