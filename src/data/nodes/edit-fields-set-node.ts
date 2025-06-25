/**
 * Edit Fields (Set) Node
 * 
 * Sets or updates fields on workflow items. Use the Set node to add new fields or overwrite existing data in the items passing through:contentReference[oaicite:3]{index=3}. This is useful for mapping and restructuring data within the workflow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const editfieldssetNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.edit-fields-set',
  displayName: 'Edit Fields (Set)',
  description: 'Sets or updates fields on workflow items. Use the Set node to add new fields or overwrite existing data in the items passing through:contentReference[oaicite:3]{index=3}. This is useful for mapping and restructuring data within the workflow.',
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
      description: 'Processed data from Edit Fields (Set)'
    }
  ],

  credentials: [
    {
      name: 'edit-fields-setApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Edit Fields (Set)'
  },

  aliases: ['edit', 'fields', 'set'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Edit Fields (Set)',
      workflow: {
        nodes: [
          {
            name: 'Edit Fields (Set)',
            type: 'n8n-nodes-base.edit-fields-set',
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

export default editfieldssetNode;