/**
 * Medium Node
 * 
 * Integrates with Medium (blogging platform). Allows publishing a new story on Medium (under your profile or publication) and listing your publications. Useful for auto-posting blog content to Medium from your workflow or cross-posting articles.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mediumNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.medium',
  displayName: 'Medium',
  description: 'Integrates with Medium (blogging platform). Allows publishing a new story on Medium (under your profile or publication) and listing your publications. Useful for auto-posting blog content to Medium from your workflow or cross-posting articles.',
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
        { name: 'Get Publications', value: 'Get Publications' }
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
      description: 'Processed data from Medium'
    }
  ],

  credentials: [
    {
      name: 'mediumApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Medium'
  },

  aliases: ['medium'],
  
  examples: [
        {
      name: 'Create Post Item',
      description: 'Create Post an item from Medium',
      workflow: {
        nodes: [
          {
            name: 'Medium',
            type: 'n8n-nodes-base.medium',
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

export default mediumNode;