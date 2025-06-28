/**
 * Embeddings HuggingFace Inference Node
 * 
 * Uses Hugging Face’s Inference API to get embeddings from a specified model (perhaps Sentence Transformers or similar). You provide text and it returns an embedding vector using a model hosted on HuggingFace’s API. Good for custom or community models for embeddings.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingshuggingfaceinferenceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-huggingface-inference',
  displayName: 'Embeddings HuggingFace Inference',
  description: 'Uses Hugging Face’s Inference API to get embeddings from a specified model (perhaps Sentence Transformers or similar). You provide text and it returns an embedding vector using a model hosted on HuggingFace’s API. Good for custom or community models for embeddings.',
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
      description: 'Processed data from Embeddings HuggingFace Inference'
    }
  ],

  credentials: [
    {
      name: 'embeddings-huggingface-inferenceApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings HuggingFace Inference'
  },

  aliases: ['embeddings', 'huggingface', 'inference'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings HuggingFace Inference',
      workflow: {
        nodes: [
          {
            name: 'Embeddings HuggingFace Inference',
            type: 'n8n-nodes-base.embeddings-huggingface-inference',
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

export default embeddingshuggingfaceinferenceNode;