/**
 * Hugging Face Inference Model Node
 * 
 * Calls a Hugging Face Inference API for text generation (or possibly other tasks if configured). This node can send a prompt to a HuggingFace-hosted model (like BLOOM or GPT-J) and get the generated text. Useful if you want to use open-source models via HuggingFace’s cloud instead of OpenAI or others.
 */

import { NodeTypeInfo } from '../node-types.js';

export const huggingfaceinferencemodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hugging-face-inference-model',
  displayName: 'Hugging Face Inference Model',
  description: 'Calls a Hugging Face Inference API for text generation (or possibly other tasks if configured). This node can send a prompt to a HuggingFace-hosted model (like BLOOM or GPT-J) and get the generated text. Useful if you want to use open-source models via HuggingFace’s cloud instead of OpenAI or others.',
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
      description: 'Processed data from Hugging Face Inference Model'
    }
  ],

  credentials: [
    {
      name: 'hugging-face-inference-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Hugging Face Inference Model'
  },

  aliases: ['hugging', 'face', 'inference', 'model'],
  
  examples: [
        {
      name: 'Send Item',
      description: 'Send an item from Hugging Face Inference Model',
      workflow: {
        nodes: [
          {
            name: 'Hugging Face Inference Model',
            type: 'n8n-nodes-base.hugging-face-inference-model',
            parameters: {
              operation: 'send',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default huggingfaceinferencemodelNode;