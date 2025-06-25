/**
 * OpenRouter Chat Model Node
 * 
 * Connects to OpenRouter (an API router that allows access to multiple AI models via one interface). This node likely allows you to use OpenRouter to choose among various models (Anthropic, OpenAI, etc.) through their unified endpoint for chat. It sends the conversation to OpenRouter specifying which model or letting it route, and returns the response.
 */

import { NodeTypeInfo } from '../node-types.js';

export const openrouterchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openrouter-chat-model',
  displayName: 'OpenRouter Chat Model',
  description: 'Connects to OpenRouter (an API router that allows access to multiple AI models via one interface). This node likely allows you to use OpenRouter to choose among various models (Anthropic, OpenAI, etc.) through their unified endpoint for chat. It sends the conversation to OpenRouter specifying which model or letting it route, and returns the response.',
  category: 'Utility',
  subcategory: 'Integration',
  
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
      description: 'Processed data from OpenRouter Chat Model'
    }
  ],

  credentials: [
    {
      name: 'openrouter-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'OpenRouter Chat Model'
  },

  aliases: ['openrouter', 'chat', 'model'],
  
  examples: [
        {
      name: 'Access Item',
      description: 'Access an item from OpenRouter Chat Model',
      workflow: {
        nodes: [
          {
            name: 'OpenRouter Chat Model',
            type: 'n8n-nodes-base.openrouter-chat-model',
            parameters: {
              operation: 'access',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default openrouterchatmodelNode;