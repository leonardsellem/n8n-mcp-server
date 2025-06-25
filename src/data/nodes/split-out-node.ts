/**
 * Split Out Node
 * 
 * Splits a single item that contains multiple elements (e.g., an array) into separate items. This is useful if a previous node returned data grouped in an array and you want to process each element individually in subsequent nodes.
 */

import { NodeTypeInfo } from '../node-types.js';

export const splitoutNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.split-out',
  displayName: 'Split Out',
  description: 'Splits a single item that contains multiple elements (e.g., an array) into separate items. This is useful if a previous node returned data grouped in an array and you want to process each element individually in subsequent nodes.',
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
      description: 'Processed data from Split Out'
    }
  ],

  credentials: [
    {
      name: 'split-outApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Split Out'
  },

  aliases: ['split', 'out'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Split Out',
      workflow: {
        nodes: [
          {
            name: 'Split Out',
            type: 'n8n-nodes-base.split-out',
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

export default splitoutNode;