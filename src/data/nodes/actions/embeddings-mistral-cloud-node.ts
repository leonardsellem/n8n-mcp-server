/**
 * Embeddings Mistral Cloud Node
 * 
 * Generates embeddings from Mistral’s cloud API (Mistral AI is a model provider). This likely uses Mistral’s models to vectorize input text. It reflects integration with newer AI model vendors (Mistral AI being a notable startup).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsmistralcloudNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-mistral-cloud',
  displayName: 'Embeddings Mistral Cloud',
  description: 'Generates embeddings from Mistral’s cloud API (Mistral AI is a model provider). This likely uses Mistral’s models to vectorize input text. It reflects integration with newer AI model vendors (Mistral AI being a notable startup).',
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
      description: 'Processed data from Embeddings Mistral Cloud'
    }
  ],

  credentials: [
    {
      name: 'embeddings-mistral-cloudApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings Mistral Cloud'
  },

  aliases: ['embeddings', 'mistral', 'cloud'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings Mistral Cloud',
      workflow: {
        nodes: [
          {
            name: 'Embeddings Mistral Cloud',
            type: 'n8n-nodes-base.embeddings-mistral-cloud',
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

export default embeddingsmistralcloudNode;