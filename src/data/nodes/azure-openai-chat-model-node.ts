/**
 * Azure OpenAI Chat Model Node
 * 
 * Uses Microsoft’s Azure-hosted OpenAI Chat model (like GPT-4 or GPT-3.5 on Azure). It’s equivalent to the OpenAI Chat node but directs the request to Azure’s endpoint. Many enterprise users route through Azure for compliance, so this node facilitates that, returning the model’s chat completion.
 */

import { NodeTypeInfo } from '../node-types.js';

export const azureopenaichatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.azure-openai-chat-model',
  displayName: 'Azure OpenAI Chat Model',
  description: 'Uses Microsoft’s Azure-hosted OpenAI Chat model (like GPT-4 or GPT-3.5 on Azure). It’s equivalent to the OpenAI Chat node but directs the request to Azure’s endpoint. Many enterprise users route through Azure for compliance, so this node facilitates that, returning the model’s chat completion.',
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
      description: 'Processed data from Azure OpenAI Chat Model'
    }
  ],

  credentials: [
    {
      name: 'azure-openai-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Azure OpenAI Chat Model'
  },

  aliases: ['azure', 'openai', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Azure OpenAI Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Azure OpenAI Chat Model',
            type: 'n8n-nodes-base.azure-openai-chat-model',
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

export default azureopenaichatmodelNode;