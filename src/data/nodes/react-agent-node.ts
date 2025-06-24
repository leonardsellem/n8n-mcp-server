/**
 * ReAct Agent Node
 * 
 * An AI Agent using the ReAct (Reason+Act) framework. It interleaves reasoning (thought) and tool usage. The agent will think about what to do, then use a tool (sub-node) if needed, then think again, etc., until it arrives at an answer:contentReference[oaicite:88]{index=88}. It’s effective for problems where the AI needs to gather info via tools and reason in steps.
 */

import { NodeTypeInfo } from '../node-types.js';

export const reactagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.react-agent',
  displayName: 'ReAct Agent',
  description: 'An AI Agent using the ReAct (Reason+Act) framework. It interleaves reasoning (thought) and tool usage. The agent will think about what to do, then use a tool (sub-node) if needed, then think again, etc., until it arrives at an answer:contentReference[oaicite:88]{index=88}. It’s effective for problems where the AI needs to gather info via tools and reason in steps.',
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
      description: 'Processed data from ReAct Agent'
    }
  ],

  credentials: [
    {
      name: 'react-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'ReAct Agent'
  },

  aliases: ['react', 'agent'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from ReAct Agent',
      workflow: {
        nodes: [
          {
            name: 'ReAct Agent',
            type: 'n8n-nodes-base.react-agent',
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

export default reactagentNode;