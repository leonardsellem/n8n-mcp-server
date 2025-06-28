/**
 * Embeddings Azure OpenAI Node
 * 
 * Generates text embeddings via Azure’s hosted OpenAI service. It’s like the OpenAI Embeddings node but uses Azure’s endpoint (which might be preferred by enterprise users). You provide text and get back embedding vectors using, say, Azure-deployed Ada model.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsazureopenaiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-azure-openai',
  displayName: 'Embeddings Azure OpenAI',
  description: 'Generates text embeddings via Azure’s hosted OpenAI service. It’s like the OpenAI Embeddings node but uses Azure’s endpoint (which might be preferred by enterprise users). You provide text and get back embedding vectors using, say, Azure-deployed Ada model.',
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
      description: 'Processed data from Embeddings Azure OpenAI'
    }
  ],

  credentials: [
    {
      name: 'embeddings-azure-openaiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Azure OpenAI'
  },

  aliases: ['embeddings', 'azure', 'openai'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Azure OpenAI',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Azure OpenAI',
            type: 'n8n-nodes-base.embeddings-azure-openai',
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

export default embeddingsazureopenaiNode;