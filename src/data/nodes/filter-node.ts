/**
 * Filter Node
 * 
 * Filters items based on conditions. This node passes through only the items that meet the specified criteria (conditions can be numeric, string, boolean comparisons, etc.), allowing conditional branching of data in workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const filterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.filter',
  displayName: 'Filter',
  description: 'Filters items based on conditions. This node passes through only the items that meet the specified criteria (conditions can be numeric, string, boolean comparisons, etc.), allowing conditional branching of data in workflows.',
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
      description: 'Processed data from Filter'
    }
  ],

  credentials: [
    {
      name: 'filterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Filter'
  },

  aliases: ['filter'],
  
  examples: [
        {
      name: 'Be Item',
      description: 'Be an item from Filter',
      workflow: {
        nodes: [
          {
            name: 'Filter',
            type: 'n8n-nodes-base.filter',
            parameters: {
              operation: 'be',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default filterNode;