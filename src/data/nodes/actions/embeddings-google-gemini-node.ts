/**
 * Embeddings Google Gemini Node
 * 
 * Generates embeddings with Google’s Gemini (next-gen foundation model). Likely uses an API to Google’s model to transform input text into a vector embedding. It’s part of experimental AI offerings from Google (not widely available as of early 2025).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsgooglegeminiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-google-gemini',
  displayName: 'Embeddings Google Gemini',
  description: 'Generates embeddings with Google’s Gemini (next-gen foundation model). Likely uses an API to Google’s model to transform input text into a vector embedding. It’s part of experimental AI offerings from Google (not widely available as of early 2025).',
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
      description: 'Processed data from Embeddings Google Gemini'
    }
  ],

  credentials: [
    {
      name: 'embeddings-google-geminiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Google Gemini'
  },

  aliases: ['embeddings', 'google', 'gemini'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Google Gemini',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Google Gemini',
            type: 'n8n-nodes-base.embeddings-google-gemini',
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

export default embeddingsgooglegeminiNode;