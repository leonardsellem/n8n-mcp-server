/**
 * Rename Keys Node
 * 
 * Renames fields (keys) in the JSON data of items. You specify old key names and new names, and this node will output items with those fields renamed. It’s helpful for mapping data to expected field names for other nodes.
 */

import { NodeTypeInfo } from '../node-types.js';

export const renamekeysNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rename-keys',
  displayName: 'Rename Keys',
  description: 'Renames fields (keys) in the JSON data of items. You specify old key names and new names, and this node will output items with those fields renamed. It’s helpful for mapping data to expected field names for other nodes.',
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
      description: 'Processed data from Rename Keys'
    }
  ],

  credentials: [
    {
      name: 'rename-keysApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Rename Keys'
  },

  aliases: ['rename', 'keys'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Rename Keys',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.rename-keys',
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

export default renamekeysNode;