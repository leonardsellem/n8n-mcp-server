/**
 * Bannerbear Node
 * 
 * Uses Bannerbear (image/video generation API) to create media from templates. You can generate images or videos by supplying template IDs and modifications (text, images to insert), and optionally create modification sets. Great for automated graphic generation (e.g. personalized social images).
 */

import { NodeTypeInfo } from '../node-types.js';

export const bannerbearNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bannerbear',
  displayName: 'Bannerbear',
  description: 'Uses Bannerbear (image/video generation API) to create media from templates. You can generate images or videos by supplying template IDs and modifications (text, images to insert), and optionally create modification sets. Great for automated graphic generation (e.g. personalized social images).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Generate Image',
      description: 'The operation to perform',
      options: [
        { name: 'Generate Image', value: 'Generate Image' },
        { name: 'Generate Video', value: 'Generate Video' },
        { name: 'Create Modification', value: 'Create Modification' }
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
      description: 'Processed data from Bannerbear'
    }
  ],

  credentials: [
    {
      name: 'bannerbearApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Bannerbear'
  },

  aliases: ['bannerbear'],
  
  examples: [
        {
      name: 'Generate Image Item',
      description: 'Generate Image an item from Bannerbear',
      workflow: {
        nodes: [
          {
            name: 'Bannerbear',
            type: 'n8n-nodes-base.bannerbear',
            parameters: {
              operation: 'Generate Image',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default bannerbearNode;