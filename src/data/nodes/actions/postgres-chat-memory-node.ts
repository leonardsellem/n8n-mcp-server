/**
 * Postgres Chat Memory Node
 * 
 * Keeps conversation memory in a PostgreSQL database table. Messages or summaries are saved as rows in Postgres. This provides durable memory storage for chats that persists beyond the workflow’s runtime, useful for multi-session chatbots that remember context between sessions or for auditing.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const postgreschatmemoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postgres-chat-memory',
  displayName: 'Postgres Chat Memory',
  description: 'Keeps conversation memory in a PostgreSQL database table. Messages or summaries are saved as rows in Postgres. This provides durable memory storage for chats that persists beyond the workflow’s runtime, useful for multi-session chatbots that remember context between sessions or for auditing.',
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
      description: 'Processed data from Postgres Chat Memory'
    }
  ],

  credentials: [
    {
      name: 'postgres-chat-memoryApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Postgres Chat Memory'
  },

  aliases: ['postgres', 'chat', 'memory'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Postgres Chat Memory',
      workflow: {
        nodes: [
          {
            name: 'Postgres Chat Memory',
            type: 'n8n-nodes-base.postgres-chat-memory',
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

export default postgreschatmemoryNode;