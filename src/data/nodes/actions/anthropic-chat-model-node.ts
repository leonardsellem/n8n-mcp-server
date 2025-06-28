/**
 * Anthropic Chat Model Node
 * 
 * An LLM sub-node that interfaces with Anthropic’s chat model (Claude). It takes a conversation prompt and returns a completion, in a manner similar to OpenAI Chat but using Claude’s API. Useful for using Claude as the AI assistant in workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const anthropicchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.anthropic-chat-model',
  displayName: 'Anthropic Chat Model',
  description: 'An LLM sub-node that interfaces with Anthropic’s chat model (Claude). It takes a conversation prompt and returns a completion, in a manner similar to OpenAI Chat but using Claude’s API. Useful for using Claude as the AI assistant in workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
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
      description: 'Processed data from Anthropic Chat Model'
    }
  ],

  credentials: [
    {
      name: 'anthropic-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Anthropic Chat Model'
  },

  aliases: ['anthropic', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Anthropic Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Anthropic Chat Model',
            type: 'n8n-nodes-base.anthropic-chat-model',
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

export default anthropicchatmodelNode;