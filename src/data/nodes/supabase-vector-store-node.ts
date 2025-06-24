/**
 * Supabase Vector Store Node
 * 
 * A vector store using Supabase’s Postgres (with PGVector under the hood). It stores embeddings via Supabase and allows similarity queries. Essentially, it’s similar to PGVector node but tailored to a Supabase instance as the vector DB.
 */

import { NodeTypeInfo } from '../node-types.js';

export const supabasevectorstoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.supabase-vector-store',
  displayName: 'Supabase Vector Store',
  description: 'A vector store using Supabase’s Postgres (with PGVector under the hood). It stores embeddings via Supabase and allows similarity queries. Essentially, it’s similar to PGVector node but tailored to a Supabase instance as the vector DB.',
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
      description: 'Processed data from Supabase Vector Store'
    }
  ],

  credentials: [
    {
      name: 'supabase-vector-storeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Supabase Vector Store'
  },

  aliases: ['supabase', 'vector', 'store'],
  
  examples: [
        {
      name: 'Similarity Item',
      description: 'Similarity an item from Supabase Vector Store',
      workflow: {
        nodes: [
          {
            name: 'Supabase Vector Store',
            type: 'n8n-nodes-base.supabase-vector-store',
            parameters: {
              operation: 'similarity',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default supabasevectorstoreNode;