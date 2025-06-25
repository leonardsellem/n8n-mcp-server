/**
 * OpenAI Chat Model Node
 * 
 * Uses OpenAI’s ChatGPT-style models (GPT-3.5, GPT-4 etc.) to have a conversation:contentReference[oaicite:95]{index=95}. You provide system, user, and possibly assistant messages, and it returns the assistant’s next reply. It’s the core of building GPT-powered assistants in workflows, leveraging OpenAI’s capability.
 */

import { NodeTypeInfo } from '../node-types.js';

export const openaichatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openai-chat-model',
  displayName: 'OpenAI Chat Model',
  description: 'Uses OpenAI’s ChatGPT-style models (GPT-3.5, GPT-4 etc.) to have a conversation:contentReference[oaicite:95]{index=95}. You provide system, user, and possibly assistant messages, and it returns the assistant’s next reply. It’s the core of building GPT-powered assistants in workflows, leveraging OpenAI’s capability.',
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
      description: 'Processed data from OpenAI Chat Model'
    }
  ],

  credentials: [
    {
      name: 'openai-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'OpenAI Chat Model'
  },

  aliases: ['openai', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from OpenAI Chat Model',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Chat Model',
            type: 'n8n-nodes-base.openai-chat-model',
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

export default openaichatmodelNode;