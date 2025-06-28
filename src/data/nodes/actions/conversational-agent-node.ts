/**
 * Conversational Agent Node
 * 
 * A specialized AI Agent geared for conversation. It maintains context over a dialogue and responds conversationally to user inputs (like a chatbot). It uses a conversation chain to generate replies that feel coherent and context-aware (was previously a mode in AI Agent, now a separate cluster node).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const conversationalagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.conversational-agent',
  displayName: 'Conversational Agent',
  description: 'A specialized AI Agent geared for conversation. It maintains context over a dialogue and responds conversationally to user inputs (like a chatbot). It uses a conversation chain to generate replies that feel coherent and context-aware (was previously a mode in AI Agent, now a separate cluster node).',
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
      description: 'Processed data from Conversational Agent'
    }
  ],

  credentials: [
    {
      name: 'conversational-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Conversational Agent'
  },

  aliases: ['conversational', 'agent'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Conversational Agent',
      workflow: {
        nodes: [
          {
            name: 'Conversational Agent',
            type: 'n8n-nodes-base.conversational-agent',
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

export default conversationalagentNode;