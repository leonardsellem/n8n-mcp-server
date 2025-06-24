/**
 * Sort Node
 * 
 * Sorts items based on one or more fields. You can choose the field(s) and sort order (ascending/descending). After this node, the items will be reordered according to the sort criteria.
 */

import { NodeTypeInfo } from '../node-types.js';

export const sortNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sort',
  displayName: 'Sort',
  description: 'Sorts items based on one or more fields. You can choose the field(s) and sort order (ascending/descending). After this node, the items will be reordered according to the sort criteria.',
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
      description: 'Processed data from Sort'
    }
  ],

  credentials: [
    {
      name: 'sortApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Sort'
  },

  aliases: ['sort'],
  
  examples: [
        {
      name: 'Choose Item',
      description: 'Choose an item from Sort',
      workflow: {
        nodes: [
          {
            name: 'Sort',
            type: 'n8n-nodes-base.sort',
            parameters: {
              operation: 'choose',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sortNode;