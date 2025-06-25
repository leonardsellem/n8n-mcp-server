/**
 * Ollama Chat Model Node
 * 
 * Runs a chat conversation using a model served by Ollama on local hardware:contentReference[oaicite:93]{index=93}:contentReference[oaicite:94]{index=94}. It sends the dialogue to the local model (maybe Llama or others managed by Ollama) and returns the model’s answer. This allows private, offline chatbot interactions using local models with n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const ollamachatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ollama-chat-model',
  displayName: 'Ollama Chat Model',
  description: 'Runs a chat conversation using a model served by Ollama on local hardware:contentReference[oaicite:93]{index=93}:contentReference[oaicite:94]{index=94}. It sends the dialogue to the local model (maybe Llama or others managed by Ollama) and returns the model’s answer. This allows private, offline chatbot interactions using local models with n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'private',
      description: 'The operation to perform',
      options: [
        { name: 'Private', value: 'private' },
        { name: 'Offline', value: 'offline' }
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
      description: 'Processed data from Ollama Chat Model'
    }
  ],

  credentials: [
    {
      name: 'ollama-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Ollama Chat Model'
  },

  aliases: ['ollama', 'chat', 'model'],
  
  examples: [
        {
      name: 'Private Item',
      description: 'Private an item from Ollama Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Ollama Chat Model',
            type: 'n8n-nodes-base.ollama-chat-model',
            parameters: {
              operation: 'private',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default ollamachatmodelNode;