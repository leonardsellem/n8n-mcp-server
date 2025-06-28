/**
 * Ghost Node
 * 
 * Works with Ghost (CMS/blog platform). You can create new blog posts (in draft), retrieve or update post content, and publish posts. Great for automating content publishing on a Ghost blog (e.g., from an external source or CMS).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ghostNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ghost',
  displayName: 'Ghost',
  description: 'Works with Ghost (CMS/blog platform). You can create new blog posts (in draft), retrieve or update post content, and publish posts. Great for automating content publishing on a Ghost blog (e.g., from an external source or CMS).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Post',
      description: 'The operation to perform',
      options: [
        { name: 'Create Post', value: 'Create Post' },
        { name: 'Get Post', value: 'Get Post' },
        { name: 'Update Post', value: 'Update Post' },
        { name: 'Publish Post', value: 'Publish Post' }
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
      description: 'Processed data from Ghost'
    }
  ],

  credentials: [
    {
      name: 'ghostApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Ghost'
  },

  aliases: ['ghost'],
  
  examples: [
        {
      name: 'Create Post Item',
      description: 'Create Post an item from Ghost',
      workflow: {
        nodes: [
          {
            name: 'Ghost',
            type: 'n8n-nodes-base.ghost',
            parameters: {
              operation: 'Create Post',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default ghostNode;