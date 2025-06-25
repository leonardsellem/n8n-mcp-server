/**
 * Loop Over Items (Split in Batches) Node
 * 
 * Loops through incoming items in controllable batch sizes. It allows you to split a large list of items into smaller batches and process them sequentially, which is useful for rate limiting or handling paginated processing.
 */

import { NodeTypeInfo } from '../node-types.js';

export const loopoveritemssplitinbatchesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.loop-over-items-split-in-batches',
  displayName: 'Loop Over Items (Split in Batches)',
  description: 'Loops through incoming items in controllable batch sizes. It allows you to split a large list of items into smaller batches and process them sequentially, which is useful for rate limiting or handling paginated processing.',
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
      description: 'Processed data from Loop Over Items (Split in Batches)'
    }
  ],

  credentials: [
    {
      name: 'loop-over-items-split-in-batchesApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Loop Over Items (Split in Batches)'
  },

  aliases: ['loop', 'over', 'items', 'split', 'batches'],
  
  examples: [
        {
      name: 'You Item',
      description: 'You an item from Loop Over Items (Split in Batches)',
      workflow: {
        nodes: [
          {
            name: 'Loop Over Items (Split in Batches)',
            type: 'n8n-nodes-base.loop-over-items-split-in-batches',
            parameters: {
              operation: 'you',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default loopoveritemssplitinbatchesNode;