/**
 * Embeddings AWS Bedrock Node
 * 
 * Generates embeddings using Amazon Bedrock’s AI services. AWS Bedrock offers foundation models; this node likely calls an embedding model (like Titan Text Embeddings) on Bedrock to get vector representations of text for use in vector stores or semantic search.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const embeddingsawsbedrockNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.embeddings-aws-bedrock',
  displayName: 'Embeddings AWS Bedrock',
  description: 'Generates embeddings using Amazon Bedrock’s AI services. AWS Bedrock offers foundation models; this node likely calls an embedding model (like Titan Text Embeddings) on Bedrock to get vector representations of text for use in vector stores or semantic search.',
  category: 'Cloud',
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
      description: 'Processed data from Embeddings AWS Bedrock'
    }
  ],

  credentials: [
    {
      name: 'embeddings-aws-bedrockApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Embeddings AWS Bedrock'
  },

  aliases: ['embeddings', 'aws', 'bedrock'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Embeddings AWS Bedrock',
      workflow: {
        nodes: [
          {
            name: 'Embeddings AWS Bedrock',
            type: 'n8n-nodes-base.embeddings-aws-bedrock',
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

export default embeddingsawsbedrockNode;