/**
 * Embeddings Google Vertex Node
 * 
 * Generates embeddings through Google Vertex AI’s models (which could include PaLM or other available embedding models on Vertex). Essentially, it’s a node to obtain vector representations from Google’s managed AI services.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsgooglevertexNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-google-vertex',
  displayName: 'Embeddings Google Vertex',
  description: 'Generates embeddings through Google Vertex AI’s models (which could include PaLM or other available embedding models on Vertex). Essentially, it’s a node to obtain vector representations from Google’s managed AI services.',
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
      description: 'Processed data from Embeddings Google Vertex'
    }
  ],

  credentials: [
    {
      name: 'embeddings-google-vertexApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Google Vertex'
  },

  aliases: ['embeddings', 'google', 'vertex'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Google Vertex',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Google Vertex',
            type: 'n8n-nodes-base.embeddings-google-vertex',
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

export default embeddingsgooglevertexNode;