/**
 * Storyblok Node
 * 
 * Integrates with Storyblok (headless CMS). You can retrieve content entries (stories), create new stories (content entries), update them, and publish them (make content live). Useful for automating content management, deployments, or updates in a Storyblok-driven website.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const storyblokNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.storyblok',
  displayName: 'Storyblok',
  description: 'Integrates with Storyblok (headless CMS). You can retrieve content entries (stories), create new stories (content entries), update them, and publish them (make content live). Useful for automating content management, deployments, or updates in a Storyblok-driven website.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Story',
      description: 'The operation to perform',
      options: [
        { name: 'Get Story', value: 'Get Story' },
        { name: 'Create Story', value: 'Create Story' },
        { name: 'Update Story', value: 'Update Story' },
        { name: 'Publish Story', value: 'Publish Story' }
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
      description: 'Processed data from Storyblok'
    }
  ],

  credentials: [
    {
      name: 'storyblokApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Storyblok'
  },

  aliases: ['storyblok'],
  
  examples: [
        {
      name: 'Get Story Item',
      description: 'Get Story an item from Storyblok',
      workflow: {
        nodes: [
          {
            name: 'Storyblok',
            type: 'n8n-nodes-base.storyblok',
            parameters: {
              operation: 'Get Story',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default storyblokNode;