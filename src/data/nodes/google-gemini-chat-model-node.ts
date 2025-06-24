/**
 * Google Gemini Chat Model Node
 * 
 * Communicates with Google’s Gemini chat model (Google’s advanced conversational AI). It sends a user prompt (and context) to the Gemini model (likely via Vertex AI) and returns the model’s reply. It enables using Google’s state-of-the-art AI for dialogues in n8n workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlegeminichatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-gemini-chat-model',
  displayName: 'Google Gemini Chat Model',
  description: 'Communicates with Google’s Gemini chat model (Google’s advanced conversational AI). It sends a user prompt (and context) to the Gemini model (likely via Vertex AI) and returns the model’s reply. It enables using Google’s state-of-the-art AI for dialogues in n8n workflows.',
  category: 'Productivity',
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
      description: 'Processed data from Google Gemini Chat Model'
    }
  ],

  credentials: [
    {
      name: 'google-gemini-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Gemini Chat Model'
  },

  aliases: ['google', 'gemini', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Google Gemini Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Google Gemini Chat Model',
            type: 'n8n-nodes-base.google-gemini-chat-model',
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

export default googlegeminichatmodelNode;