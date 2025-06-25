/**
 * Groq Chat Model Node
 * 
 * Connects to a “Groq” chat model – likely referring to an AI service from Groq (an AI hardware company) or possibly an internal experimental model. It would function like other chat nodes: provide conversation context, get AI response. Not widely known in mainstream as of 2025, so likely a specialized integration.
 */

import { NodeTypeInfo } from '../node-types.js';

export const groqchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.groq-chat-model',
  displayName: 'Groq Chat Model',
  description: 'Connects to a “Groq” chat model – likely referring to an AI service from Groq (an AI hardware company) or possibly an internal experimental model. It would function like other chat nodes: provide conversation context, get AI response. Not widely known in mainstream as of 2025, so likely a specialized integration.',
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
      description: 'Processed data from Groq Chat Model'
    }
  ],

  credentials: [
    {
      name: 'groq-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Groq Chat Model'
  },

  aliases: ['groq', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Groq Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Groq Chat Model',
            type: 'n8n-nodes-base.groq-chat-model',
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

export default groqchatmodelNode;