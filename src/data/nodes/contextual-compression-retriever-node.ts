/**
 * Contextual Compression Retriever Node
 * 
 * A retriever that first compresses or summarizes documents with an LLM before vector searching. When retrieving context for a query, it uses a smaller model to condense text, preserving relevant info, then stores or searches the compressed version. This way, the final LLM gets a concise context rather than full docs, improving relevance.
 */

import { NodeTypeInfo } from '../node-types.js';

export const contextualcompressionretrieverNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.contextual-compression-retriever',
  displayName: 'Contextual Compression Retriever',
  description: 'A retriever that first compresses or summarizes documents with an LLM before vector searching. When retrieving context for a query, it uses a smaller model to condense text, preserving relevant info, then stores or searches the compressed version. This way, the final LLM gets a concise context rather than full docs, improving relevance.',
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
      description: 'Processed data from Contextual Compression Retriever'
    }
  ],

  credentials: [
    {
      name: 'contextual-compression-retrieverApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Contextual Compression Retriever'
  },

  aliases: ['contextual', 'compression', 'retriever'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Contextual Compression Retriever',
      workflow: {
        nodes: [
          {
            name: 'Contextual Compression Retriever',
            type: 'n8n-nodes-base.contextual-compression-retriever',
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

export default contextualcompressionretrieverNode;