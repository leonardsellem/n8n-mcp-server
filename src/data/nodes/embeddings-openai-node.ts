/**
 * Embeddings OpenAI Node
 * 
 * Generates a vector embedding for given text using OpenAI’s embedding models (like text-embedding-ada-002):contentReference[oaicite:92]{index=92}. The output vector can be used for semantic search or as input to vector stores. This is the standard cloud embedding generation from OpenAI.
 */

import { NodeTypeInfo } from '../node-types.js';

export const embeddingsopenaiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-openai',
  displayName: 'Embeddings OpenAI',
  description: 'Generates a vector embedding for given text using OpenAI’s embedding models (like text-embedding-ada-002):contentReference[oaicite:92]{index=92}. The output vector can be used for semantic search or as input to vector stores. This is the standard cloud embedding generation from OpenAI.',
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
      description: 'Processed data from Embeddings OpenAI'
    }
  ],

  credentials: [
    {
      name: 'embeddings-openaiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings OpenAI'
  },

  aliases: ['embeddings', 'openai'],
  
  examples: [
        {
      name: 'Be Item',
      description: 'Be an item from Embeddings OpenAI',
      workflow: {
        nodes: [
          {
            name: 'Embeddings OpenAI',
            type: 'n8n-nodes-base.embeddings-openai',
            parameters: {
              operation: 'be',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default embeddingsopenaiNode;