/**
 * Calculator Node
 * 
 * A tool that can evaluate mathematical expressions. Often used by an AI agent that when encountering a math problem, can delegate computation to this calculator and get the result. It handles arithmetic or maybe more complex calculations reliably instead of forcing the LLM to do math.
 */

import { NodeTypeInfo } from '../node-types.js';

export const calculatorNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.calculator',
  displayName: 'Calculator',
  description: 'A tool that can evaluate mathematical expressions. Often used by an AI agent that when encountering a math problem, can delegate computation to this calculator and get the result. It handles arithmetic or maybe more complex calculations reliably instead of forcing the LLM to do math.',
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
      description: 'Processed data from Calculator'
    }
  ],

  credentials: [
    {
      name: 'calculatorApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Calculator'
  },

  aliases: ['calculator'],
  
  examples: [
        {
      name: 'Evaluate Item',
      description: 'Evaluate an item from Calculator',
      workflow: {
        nodes: [
          {
            name: 'Calculator',
            type: 'n8n-nodes-base.calculator',
            parameters: {
              operation: 'evaluate',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default calculatorNode;