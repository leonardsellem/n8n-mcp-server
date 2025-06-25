/**
 * Execute Sub-workflow Node
 * 
 * Calls another workflow (sub-workflow) from the current workflow and returns its result. Allows reusing workflows as subroutines. This node executes the specified workflow and waits for it to finish before continuing.
 */

import { NodeTypeInfo } from '../node-types.js';

export const executesubworkflowNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.execute-subworkflow',
  displayName: 'Execute Sub-workflow',
  description: 'Calls another workflow (sub-workflow) from the current workflow and returns its result. Allows reusing workflows as subroutines. This node executes the specified workflow and waits for it to finish before continuing.',
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
      description: 'Processed data from Execute Sub-workflow'
    }
  ],

  credentials: [
    {
      name: 'execute-subworkflowApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Execute Sub-workflow'
  },

  aliases: ['execute', 'sub', 'workflow'],
  
  examples: [
        {
      name: 'Reusing Item',
      description: 'Reusing an item from Execute Sub-workflow',
      workflow: {
        nodes: [
          {
            name: 'Execute Sub-workflow',
            type: 'n8n-nodes-base.execute-subworkflow',
            parameters: {
              operation: 'reusing',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default executesubworkflowNode;