/**
 * Reranker Cohere Node
 * 
 * A reranking tool that uses Cohere’s rerank model to sort a list of retrieved documents by relevance to a query. After initial retrieval of, say, 10 docs from vector search, this tool can take the query and docs and reorder them in the order of likely relevance. It helps ensure the most relevant info is considered first by the chain.
 */

import { NodeTypeInfo } from '../node-types.js';

export const rerankercohereNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.reranker-cohere',
  displayName: 'Reranker Cohere',
  description: 'A reranking tool that uses Cohere’s rerank model to sort a list of retrieved documents by relevance to a query. After initial retrieval of, say, 10 docs from vector search, this tool can take the query and docs and reorder them in the order of likely relevance. It helps ensure the most relevant info is considered first by the chain.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from Reranker Cohere'
    }
  ],

  credentials: [
    {
      name: 'reranker-cohereApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Reranker Cohere'
  },

  aliases: ['reranker', 'cohere'],
  
  examples: [
        {
      name: 'Take Item',
      description: 'Take an item from Reranker Cohere',
      workflow: {
        nodes: [
          {
            name: 'Reranker Cohere',
            type: 'n8n-nodes-base.reranker-cohere',
            parameters: {
              operation: 'take',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default rerankercohereNode;