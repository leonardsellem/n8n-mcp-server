/**
 * DeepSeek Chat Model Node
 * 
 * Connects to a DeepSeek chat model (DeepSeek might refer to a specialized domain-specific chat model or an AI vendor’s service). This node would send the conversation to the DeepSeek API and yield the chatbot’s reply, integrating perhaps a model optimized for a certain type of Q&A.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const deepseekchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.deepseek-chat-model',
  displayName: 'DeepSeek Chat Model',
  description: 'Connects to a DeepSeek chat model (DeepSeek might refer to a specialized domain-specific chat model or an AI vendor’s service). This node would send the conversation to the DeepSeek API and yield the chatbot’s reply, integrating perhaps a model optimized for a certain type of Q&A.',
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
      description: 'Processed data from DeepSeek Chat Model'
    }
  ],

  credentials: [
    {
      name: 'deepseek-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'DeepSeek Chat Model'
  },

  aliases: ['deepseek', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from DeepSeek Chat Model',
      workflow: {
        nodes: [
          {
            name: 'DeepSeek Chat Model',
            type: 'n8n-nodes-base.deepseek-chat-model',
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

export default deepseekchatmodelNode;