/**
 * Bubble Node
 * 
 * Connects to Bubble (no-code app platform) Data API. Allows creating a new Thing (Bubble’s data object), retrieving a Thing by ID, updating a Thing, or deleting a Thing. This lets you integrate and manipulate data in Bubble apps from n8n.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const bubbleNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bubble',
  displayName: 'Bubble',
  description: 'Connects to Bubble (no-code app platform) Data API. Allows creating a new Thing (Bubble’s data object), retrieving a Thing by ID, updating a Thing, or deleting a Thing. This lets you integrate and manipulate data in Bubble apps from n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Thing',
      description: 'The operation to perform',
      options: [
        { name: 'Create Thing', value: 'Create Thing' },
        { name: 'Get Thing', value: 'Get Thing' },
        { name: 'Update Thing', value: 'Update Thing' },
        { name: 'Delete Thing', value: 'Delete Thing' }
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
      description: 'Processed data from Bubble'
    }
  ],

  credentials: [
    {
      name: 'bubbleApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Bubble'
  },

  aliases: ['bubble'],
  
  examples: [
        {
      name: 'Create Thing Item',
      description: 'Create Thing an item from Bubble',
      workflow: {
        nodes: [
          {
            name: 'Bubble',
            type: 'n8n-nodes-base.bubble',
            parameters: {
              operation: 'Create Thing',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default bubbleNode;