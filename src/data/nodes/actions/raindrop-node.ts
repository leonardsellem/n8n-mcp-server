/**
 * Raindrop Node
 * 
 * Integrates with Raindrop.io (bookmark manager). You can add a new bookmark (with URL, title, tags, etc.) to your collection and retrieve a list of existing bookmarks. Useful for automating link saving or curating content from various sources into Raindrop.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const raindropNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.raindrop',
  displayName: 'Raindrop',
  description: 'Integrates with Raindrop.io (bookmark manager). You can add a new bookmark (with URL, title, tags, etc.) to your collection and retrieve a list of existing bookmarks. Useful for automating link saving or curating content from various sources into Raindrop.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Add Bookmark',
      description: 'The operation to perform',
      options: [
        { name: 'Add Bookmark', value: 'Add Bookmark' },
        { name: 'List Bookmarks', value: 'List Bookmarks' }
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
      description: 'Processed data from Raindrop'
    }
  ],

  credentials: [
    {
      name: 'raindropApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Raindrop'
  },

  aliases: ['raindrop'],
  
  examples: [
        {
      name: 'Add Bookmark Item',
      description: 'Add Bookmark an item from Raindrop',
      workflow: {
        nodes: [
          {
            name: 'Raindrop',
            type: 'n8n-nodes-base.raindrop',
            parameters: {
              operation: 'Add Bookmark',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default raindropNode;