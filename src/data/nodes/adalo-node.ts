/**
 * Adalo Node
 * 
 * Works with Adalo (app-building platform) collections. You can create new collection records, read or update existing records, or delete them. This node uses Adalo’s API to allow managing data in Adalo apps.
 */

import { NodeTypeInfo } from '../node-types.js';

export const adaloNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.adalo',
  displayName: 'Adalo',
  description: 'Works with Adalo (app-building platform) collections. You can create new collection records, read or update existing records, or delete them. This node uses Adalo’s API to allow managing data in Adalo apps.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Record',
      description: 'The operation to perform',
      options: [
        { name: 'Create Record', value: 'Create Record' },
        { name: 'Get Record', value: 'Get Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'Delete Record', value: 'Delete Record' }
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
      description: 'Processed data from Adalo'
    }
  ],

  credentials: [
    {
      name: 'adaloApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Adalo'
  },

  aliases: ['adalo'],
  
  examples: [
        {
      name: 'Create Record Item',
      description: 'Create Record an item from Adalo',
      workflow: {
        nodes: [
          {
            name: 'Adalo',
            type: 'n8n-nodes-base.adalo',
            parameters: {
              operation: 'Create Record',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default adaloNode;