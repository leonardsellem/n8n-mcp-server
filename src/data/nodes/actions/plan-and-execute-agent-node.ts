/**
 * Plan and Execute Agent Node
 * 
 * An AI Agent that explicitly plans a multi-step solution before executing. It first devises a plan (a sequence of steps or sub-questions) and then executes each step possibly using different tools or prompts. This improves handling of complex tasks by first strategizing (plan) and then acting stepwise.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const planandexecuteagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.plan-and-execute-agent',
  displayName: 'Plan and Execute Agent',
  description: 'An AI Agent that explicitly plans a multi-step solution before executing. It first devises a plan (a sequence of steps or sub-questions) and then executes each step possibly using different tools or prompts. This improves handling of complex tasks by first strategizing (plan) and then acting stepwise.',
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
      description: 'Processed data from Plan and Execute Agent'
    }
  ],

  credentials: [
    {
      name: 'plan-and-execute-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Plan and Execute Agent'
  },

  aliases: ['plan', 'and', 'execute', 'agent'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Plan and Execute Agent',
      workflow: {
        nodes: [
          {
            name: 'Plan and Execute Agent',
            type: 'n8n-nodes-base.plan-and-execute-agent',
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

export default planandexecuteagentNode;