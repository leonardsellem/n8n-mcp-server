/**
 * LangChain Code Node
 * 
 * An advanced chain that allows execution of code (like Python) via an LLM’s reasoning process (similar to the ReAct with a code tool). It might use an LLM to generate code and then execute it to get results, useful for tasks requiring calculations or structured output beyond the LLM’s direct capabilities.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const langchaincodeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.langchain-code',
  displayName: 'LangChain Code',
  description: 'An advanced chain that allows execution of code (like Python) via an LLM’s reasoning process (similar to the ReAct with a code tool). It might use an LLM to generate code and then execute it to get results, useful for tasks requiring calculations or structured output beyond the LLM’s direct capabilities.',
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
      description: 'Processed data from LangChain Code'
    }
  ],

  credentials: [
    {
      name: 'langchain-codeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'LangChain Code'
  },

  aliases: ['langchain', 'code'],
  
  examples: [
        {
      name: 'Execution Item',
      description: 'Execution an item from LangChain Code',
      workflow: {
        nodes: [
          {
            name: 'LangChain Code',
            type: 'n8n-nodes-base.langchain-code',
            parameters: {
              operation: 'execution',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default langchaincodeNode;