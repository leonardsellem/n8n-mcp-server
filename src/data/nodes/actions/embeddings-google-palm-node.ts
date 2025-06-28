/**
 * Embeddings Google PaLM Node
 * 
 * Gets embeddings from Google’s PaLM model (via Vertex AI). You send text and get an embedding vector using Google’s language model. This integrates with Google’s AI platform for semantic understanding tasks.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsgooglepalmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-google-palm',
  displayName: 'Embeddings Google PaLM',
  description: 'Gets embeddings from Google’s PaLM model (via Vertex AI). You send text and get an embedding vector using Google’s language model. This integrates with Google’s AI platform for semantic understanding tasks.',
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
      description: 'Processed data from Embeddings Google PaLM'
    }
  ],

  credentials: [
    {
      name: 'embeddings-google-palmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Google PaLM'
  },

  aliases: ['embeddings', 'google', 'palm'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Google PaLM',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Google PaLM',
            type: 'n8n-nodes-base.embeddings-google-palm',
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

export default embeddingsgooglepalmNode;