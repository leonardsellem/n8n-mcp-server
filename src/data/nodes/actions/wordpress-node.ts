/**
 * WordPress Node
 * 
 * Integrates with WordPress (via REST API). Supports creating new blog posts (or other post types), retrieving post content, updating posts (for edits or status changes), deleting posts, and listing posts with filters. Useful for content publishing workflows, cross-posting, or headless CMS uses of WordPress.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const wordpressNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wordpress',
  displayName: 'WordPress',
  description: 'Integrates with WordPress (via REST API). Supports creating new blog posts (or other post types), retrieving post content, updating posts (for edits or status changes), deleting posts, and listing posts with filters. Useful for content publishing workflows, cross-posting, or headless CMS uses of WordPress.',
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
        { name: 'Delete Post', value: 'Delete Post' },
        { name: 'List Posts', value: 'List Posts' }
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
      description: 'Processed data from WordPress'
    }
  ],

  credentials: [
    {
      name: 'wordpressApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'WordPress'
  },

  aliases: ['wordpress'],
  
  examples: [
        {
      name: 'Create Post Item',
      description: 'Create Post an item from WordPress',
      workflow: {
        nodes: [
          {
            name: 'WordPress',
            type: 'n8n-nodes-base.wordpress',
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

export default wordpressNode;