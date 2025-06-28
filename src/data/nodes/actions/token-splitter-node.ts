/**
 * Token Splitter Node
 * 
 * Splits text by token count rather than characters. It likely uses an LLM tokenizer to break the document into chunks of a specified number of tokens (for example, 512 tokens). This is useful to ensure chunks align with model tokenization, giving more precise control over chunk sizes for embeddings or model input.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const tokensplitterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.token-splitter',
  displayName: 'Token Splitter',
  description: 'Splits text by token count rather than characters. It likely uses an LLM tokenizer to break the document into chunks of a specified number of tokens (for example, 512 tokens). This is useful to ensure chunks align with model tokenization, giving more precise control over chunk sizes for embeddings or model input.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from Token Splitter'
    }
  ],

  credentials: [
    {
      name: 'token-splitterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Token Splitter'
  },

  aliases: ['token', 'splitter'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Token Splitter',
      workflow: {
        nodes: [
          {
            name: 'Token Splitter',
            type: 'n8n-nodes-base.token-splitter',
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

export default tokensplitterNode;