/**
 * Discourse Node
 * 
 * Works with Discourse (forum platform). Allows creating a new discussion topic, listing topics in a category, and posting replies. This helps automate community forum interactions, like posting updates or syncing content to a Discourse forum.
 */

import { NodeTypeInfo } from '../node-types.js';

export const discourseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.discourse',
  displayName: 'Discourse',
  description: 'Works with Discourse (forum platform). Allows creating a new discussion topic, listing topics in a category, and posting replies. This helps automate community forum interactions, like posting updates or syncing content to a Discourse forum.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Topic',
      description: 'The operation to perform',
      options: [
        { name: 'Create Topic', value: 'Create Topic' },
        { name: 'Get Topics', value: 'Get Topics' },
        { name: 'Create Post', value: 'Create Post' }
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
      description: 'Processed data from Discourse'
    }
  ],

  credentials: [
    {
      name: 'discourseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Discourse'
  },

  aliases: ['discourse'],
  
  examples: [
        {
      name: 'Create Topic Item',
      description: 'Create Topic an item from Discourse',
      workflow: {
        nodes: [
          {
            name: 'Discourse',
            type: 'n8n-nodes-base.discourse',
            parameters: {
              operation: 'Create Topic',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default discourseNode;