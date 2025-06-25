/**
 * Embeddings Ollama Node
 * 
 * Creates embeddings using the Ollama local model server. Ollama can host large language models on local hardware; this node sends text to Ollama for an embedding (if the model supports it). This is great for privacy or offline scenarios using local models.
 */

import { NodeTypeInfo } from '../node-types.js';

export const embeddingsollamaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-ollama',
  displayName: 'Embeddings Ollama',
  description: 'Creates embeddings using the Ollama local model server. Ollama can host large language models on local hardware; this node sends text to Ollama for an embedding (if the model supports it). This is great for privacy or offline scenarios using local models.',
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
      description: 'Processed data from Embeddings Ollama'
    }
  ],

  credentials: [
    {
      name: 'embeddings-ollamaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Ollama'
  },

  aliases: ['embeddings', 'ollama'],
  
  examples: [
        {
      name: 'It Item',
      description: 'It an item from Embeddings Ollama',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Ollama',
            type: 'n8n-nodes-base.embeddings-ollama',
            parameters: {
              operation: 'it',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default embeddingsollamaNode;