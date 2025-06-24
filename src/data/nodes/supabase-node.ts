/**
 * Supabase Node
 * 
 * Connects to Supabase (backend as a service, with Postgres). Allows performing CRUD on tables via Supabase REST: selecting rows with filters, inserting new rows, updating existing rows, and deleting rows:contentReference[oaicite:45]{index=45}. It’s essentially a convenient way to use a cloud Postgres DB in workflows without direct SQL (using Supabase’s API).
 */

import { NodeTypeInfo } from '../node-types.js';

export const supabaseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.supabase',
  displayName: 'Supabase',
  description: 'Connects to Supabase (backend as a service, with Postgres). Allows performing CRUD on tables via Supabase REST: selecting rows with filters, inserting new rows, updating existing rows, and deleting rows:contentReference[oaicite:45]{index=45}. It’s essentially a convenient way to use a cloud Postgres DB in workflows without direct SQL (using Supabase’s API).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Select Rows',
      description: 'The operation to perform',
      options: [
        { name: 'Select Rows', value: 'Select Rows' },
        { name: 'Insert Row', value: 'Insert Row' },
        { name: 'Update Row', value: 'Update Row' },
        { name: 'Delete Row', value: 'Delete Row' }
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
      description: 'Processed data from Supabase'
    }
  ],

  credentials: [
    {
      name: 'supabaseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Supabase'
  },

  aliases: ['supabase'],
  
  examples: [
        {
      name: 'Select Rows Item',
      description: 'Select Rows an item from Supabase',
      workflow: {
        nodes: [
          {
            name: 'Supabase',
            type: 'n8n-nodes-base.supabase',
            parameters: {
              operation: 'Select Rows',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default supabaseNode;