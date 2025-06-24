/**
 * OpenAI Functions Agent Node
 * 
 * An AI Agent variant that can utilize OpenAI’s function calling. It plans tasks and can invoke predefined n8n Tools via OpenAI function calls. This agent interprets the user’s request and leverages OpenAI’s structured function output to decide which sub-node (tool) to call, enabling complex operations using natural language instructions.
 */

import { NodeTypeInfo } from '../node-types.js';

export const openaifunctionsagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openai-functions-agent',
  displayName: 'OpenAI Functions Agent',
  description: 'An AI Agent variant that can utilize OpenAI’s function calling. It plans tasks and can invoke predefined n8n Tools via OpenAI function calls. This agent interprets the user’s request and leverages OpenAI’s structured function output to decide which sub-node (tool) to call, enabling complex operations using natural language instructions.',
  category: 'Core',
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
      description: 'Processed data from OpenAI Functions Agent'
    }
  ],

  credentials: [
    {
      name: 'openai-functions-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'OpenAI Functions Agent'
  },

  aliases: ['openai', 'functions', 'agent'],
  
  examples: [
        {
      name: 'Utilize Item',
      description: 'Utilize an item from OpenAI Functions Agent',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Functions Agent',
            type: 'n8n-nodes-base.openai-functions-agent',
            parameters: {
              operation: 'utilize',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default openaifunctionsagentNode;