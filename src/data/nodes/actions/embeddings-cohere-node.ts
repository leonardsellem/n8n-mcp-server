/**
 * Embeddings Cohere Node
 * 
 * Uses Cohere’s API to create embeddings from text. You supply text and get an embedding vector from Cohere’s language model. Suitable for semantic search or clustering tasks using Cohere’s representation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingscohereNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-cohere',
  displayName: 'Embeddings Cohere',
  description: 'Uses Cohere’s API to create embeddings from text. You supply text and get an embedding vector from Cohere’s language model. Suitable for semantic search or clustering tasks using Cohere’s representation.',
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
      description: 'Processed data from Embeddings Cohere'
    }
  ],

  credentials: [
    {
      name: 'embeddings-cohereApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Cohere'
  },

  aliases: ['embeddings', 'cohere'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Cohere',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Cohere',
            type: 'n8n-nodes-base.embeddings-cohere',
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

export default embeddingscohereNode;