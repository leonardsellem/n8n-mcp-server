/**
 * MultiQuery Retriever Node
 * 
 * A retriever that reformulates a query into multiple sub-queries to perform a more comprehensive search in a vector store. It might take the user question and generate several related queries (covering different angles), retrieve results for each, and merge them. This often yields more relevant context pieces when a single query might miss some info.
 */

import { NodeTypeInfo } from '../node-types.js';

export const multiqueryretrieverNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.multiquery-retriever',
  displayName: 'MultiQuery Retriever',
  description: 'A retriever that reformulates a query into multiple sub-queries to perform a more comprehensive search in a vector store. It might take the user question and generate several related queries (covering different angles), retrieve results for each, and merge them. This often yields more relevant context pieces when a single query might miss some info.',
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
      description: 'Processed data from MultiQuery Retriever'
    }
  ],

  credentials: [
    {
      name: 'multiquery-retrieverApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MultiQuery Retriever'
  },

  aliases: ['multiquery', 'retriever'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from MultiQuery Retriever',
      workflow: {
        nodes: [
          {
            name: 'MultiQuery Retriever',
            type: 'n8n-nodes-base.multiquery-retriever',
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

export default multiqueryretrieverNode;