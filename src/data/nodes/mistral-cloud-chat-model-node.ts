/**
 * Mistral Cloud Chat Model Node
 * 
 * Interfaces with Mistral AI’s chat model via their cloud API. Mistral (a newer AI startup) might offer a powerful open-model accessible via API. This node would let you send a chat prompt to Mistral’s model and receive the conversational reply, using them as an alternative to OpenAI/Anthropic.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mistralcloudchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mistral-cloud-chat-model',
  displayName: 'Mistral Cloud Chat Model',
  description: 'Interfaces with Mistral AI’s chat model via their cloud API. Mistral (a newer AI startup) might offer a powerful open-model accessible via API. This node would let you send a chat prompt to Mistral’s model and receive the conversational reply, using them as an alternative to OpenAI/Anthropic.',
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
      description: 'Processed data from Mistral Cloud Chat Model'
    }
  ],

  credentials: [
    {
      name: 'mistral-cloud-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Mistral Cloud Chat Model'
  },

  aliases: ['mistral', 'cloud', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Mistral Cloud Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Mistral Cloud Chat Model',
            type: 'n8n-nodes-base.mistral-cloud-chat-model',
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

export default mistralcloudchatmodelNode;