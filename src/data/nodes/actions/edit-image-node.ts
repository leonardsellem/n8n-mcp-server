/**
 * Edit Image Node
 * 
 * Applies basic image manipulations to binary image data. Supports operations such as resize, rotate, or flip images within the workflow.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const editimageNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.edit-image',
  displayName: 'Edit Image',
  description: 'Applies basic image manipulations to binary image data. Supports operations such as resize, rotate, or flip images within the workflow.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
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
      description: 'Processed data from Edit Image'
    }
  ],

  credentials: [
    {
      name: 'edit-imageApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Edit Image'
  },

  aliases: ['edit', 'image'],
  
  examples: [
        {
      name: 'Operations Item',
      description: 'Operations an item from Edit Image',
      workflow: {
        nodes: [
          {
            name: 'Edit Image',
            type: 'n8n-nodes-base.edit-image',
            parameters: {
              operation: 'operations',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default editimageNode;