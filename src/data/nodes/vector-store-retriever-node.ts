/**
 * Vector Store Retriever Node
 * 
 * A retriever that uses a vector store (like Pinecone, Qdrant, etc.) to fetch relevant documents for a given query embedding. It’s basically the component that given an input question, finds the top-k similar vectors (chunks of text) from the knowledge base. Standard component for open-book QA or knowledge retrieval.
 */

import { NodeTypeInfo } from '../node-types.js';

export const vectorstoreretrieverNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.vector-store-retriever',
  displayName: 'Vector Store Retriever',
  description: 'A retriever that uses a vector store (like Pinecone, Qdrant, etc.) to fetch relevant documents for a given query embedding. It’s basically the component that given an input question, finds the top-k similar vectors (chunks of text) from the knowledge base. Standard component for open-book QA or knowledge retrieval.',
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
      description: 'Processed data from Vector Store Retriever'
    }
  ],

  credentials: [
    {
      name: 'vector-store-retrieverApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Vector Store Retriever'
  },

  aliases: ['vector', 'store', 'retriever'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Vector Store Retriever',
      workflow: {
        nodes: [
          {
            name: 'Vector Store Retriever',
            type: 'n8n-nodes-base.vector-store-retriever',
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

export default vectorstoreretrieverNode;