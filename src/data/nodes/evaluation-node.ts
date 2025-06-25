/**
 * Evaluation Node
 * 
 * Evaluates a condition or expression on incoming data and outputs the result. (Often used in conjunction with AI/LLM outputs—e.g., to evaluate or rate a response. Similar to an IF, but typically specific to AI evaluation use cases.)
 */

import { NodeTypeInfo } from '../node-types.js';

export const evaluationNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.evaluation',
  displayName: 'Evaluation',
  description: 'Evaluates a condition or expression on incoming data and outputs the result. (Often used in conjunction with AI/LLM outputs—e.g., to evaluate or rate a response. Similar to an IF, but typically specific to AI evaluation use cases.)',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Evaluation'
    }
  ],

  credentials: [
    {
      name: 'evaluationApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Evaluation'
  },

  aliases: ['evaluation'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Evaluation',
      workflow: {
        nodes: [
          {
            name: 'Evaluation',
            type: 'n8n-nodes-base.evaluation',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default evaluationNode;