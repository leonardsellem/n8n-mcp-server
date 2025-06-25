/**
 * PGVector Vector Store Node
 * 
 * A vector store that leverages PGVector (Postgres extension for vector similarity). It stores and retrieves embedding vectors in a PostgreSQL database. This lets you use a Postgres DB for AI similarity search (handy if you prefer not to run a separate vector DB).
 */

import { NodeTypeInfo } from '../node-types.js';

export const pgvectorvectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pgvector-vector-store',
  displayName: 'PGVector Vector Store',
  description: 'A vector store that leverages PGVector (Postgres extension for vector similarity). It stores and retrieves embedding vectors in a PostgreSQL database. This lets you use a Postgres DB for AI similarity search (handy if you prefer not to run a separate vector DB).',
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
      description: 'Processed data from PGVector Vector Store'
    }
  ],

  credentials: [
    {
      name: 'pgvector-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'PGVector Vector Store'
  },

  aliases: ['pgvector', 'vector', 'store'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from PGVector Vector Store',
      workflow: {
        nodes: [
          {
            name: 'PGVector Vector Store',
            type: 'n8n-nodes-base.pgvector-vector-store',
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

export default pgvectorvectorstoreNode;