/**
 * Basic LLM Chain Node
 * 
 * A simple chain that feeds a prompt to an LLM (Large Language Model) and returns the completion. It’s essentially one step of prompt -> LLM -> response, possibly with minor formatting. Use for straightforward prompt-response tasks.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const basicllmchainNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.basic-llm-chain',
  displayName: 'Basic LLM Chain',
  description: 'A simple chain that feeds a prompt to an LLM (Large Language Model) and returns the completion. It’s essentially one step of prompt -> LLM -> response, possibly with minor formatting. Use for straightforward prompt-response tasks.',
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
      description: 'Processed data from Basic LLM Chain'
    }
  ],

  credentials: [
    {
      name: 'basic-llm-chainApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Basic LLM Chain'
  },

  aliases: ['basic', 'llm', 'chain'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Basic LLM Chain',
      workflow: {
        nodes: [
          {
            name: 'Basic LLM Chain',
            type: 'n8n-nodes-base.basic-llm-chain',
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

export default basicllmchainNode;