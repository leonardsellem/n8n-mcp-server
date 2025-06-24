/**
 * Chat Memory Manager Node
 * 
 * Manages conversation history for AI Agents. It decides what past messages (user or assistant) to keep or summarize as the conversation grows, to handle token limits. It might combine old messages into a summary and maintain recent messages fully, ensuring the agent has context without exceeding size limits.
 */

import { NodeTypeInfo } from '../node-types.js';

export const chatmemorymanagerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.chat-memory-manager',
  displayName: 'Chat Memory Manager',
  description: 'Manages conversation history for AI Agents. It decides what past messages (user or assistant) to keep or summarize as the conversation grows, to handle token limits. It might combine old messages into a summary and maintain recent messages fully, ensuring the agent has context without exceeding size limits.',
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
      description: 'Processed data from Chat Memory Manager'
    }
  ],

  credentials: [
    {
      name: 'chat-memory-managerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Chat Memory Manager'
  },

  aliases: ['chat', 'memory', 'manager'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Chat Memory Manager',
      workflow: {
        nodes: [
          {
            name: 'Chat Memory Manager',
            type: 'n8n-nodes-base.chat-memory-manager',
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

export default chatmemorymanagerNode;