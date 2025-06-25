/**
 * Remove Duplicates Node
 * 
 * Eliminates duplicate items from a list of data based on specified fields. It will output only unique items (for chosen key fields) and drop any subsequent duplicates:contentReference[oaicite:12]{index=12}:contentReference[oaicite:13]{index=13}. Useful for data cleansing.
 */

import { NodeTypeInfo } from '../node-types.js';

export const removeduplicatesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.remove-duplicates',
  displayName: 'Remove Duplicates',
  description: 'Eliminates duplicate items from a list of data based on specified fields. It will output only unique items (for chosen key fields) and drop any subsequent duplicates:contentReference[oaicite:12]{index=12}:contentReference[oaicite:13]{index=13}. Useful for data cleansing.',
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
      description: 'Processed data from Remove Duplicates'
    }
  ],

  credentials: [
    {
      name: 'remove-duplicatesApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Remove Duplicates'
  },

  aliases: ['remove', 'duplicates'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Remove Duplicates',
      workflow: {
        nodes: [
          {
            name: 'Remove Duplicates',
            type: 'n8n-nodes-base.remove-duplicates',
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

export default removeduplicatesNode;