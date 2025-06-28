/**
 * Google Vertex Chat Model Node
 * 
 * Uses a conversation model provided by Google Vertex AI. Possibly the fine-tuned chat version of PaLM or similar. It sends a conversation turn to Vertex AI and returns the model’s answer. Essentially for using Google’s managed chat models (which could include third-party ones) in a conversation chain.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlevertexchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-vertex-chat-model',
  displayName: 'Google Vertex Chat Model',
  description: 'Uses a conversation model provided by Google Vertex AI. Possibly the fine-tuned chat version of PaLM or similar. It sends a conversation turn to Vertex AI and returns the model’s answer. Essentially for using Google’s managed chat models (which could include third-party ones) in a conversation chain.',
  category: 'Productivity',
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
      description: 'Processed data from Google Vertex Chat Model'
    }
  ],

  credentials: [
    {
      name: 'google-vertex-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Vertex Chat Model'
  },

  aliases: ['google', 'vertex', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Google Vertex Chat Model',
      workflow: {
        nodes: [
          {
            name: 'Google Vertex Chat Model',
            type: 'n8n-nodes-base.google-vertex-chat-model',
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

export default googlevertexchatmodelNode;