/**
 * Limit Node
 * 
 * Limits the number of items passing through. You can configure it to only let a maximum X number of items continue, or to skip a certain number. Useful for pagination or testing with a subset of data.
 */

import { NodeTypeInfo } from '../node-types.js';

export const limitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.limit',
  displayName: 'Limit',
  description: 'Limits the number of items passing through. You can configure it to only let a maximum X number of items continue, or to skip a certain number. Useful for pagination or testing with a subset of data.',
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
      description: 'Processed data from Limit'
    }
  ],

  credentials: [
    {
      name: 'limitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Limit'
  },

  aliases: ['limit'],
  
  examples: [
        {
      name: 'Configure Item',
      description: 'Configure an item from Limit',
      workflow: {
        nodes: [
          {
            name: 'Limit',
            type: 'n8n-nodes-base.limit',
            parameters: {
              operation: 'configure',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default limitNode;