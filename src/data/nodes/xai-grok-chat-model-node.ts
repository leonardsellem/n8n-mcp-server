/**
 * xAI Grok Chat Model Node
 * 
 * Interfaces with xAI’s Grok model (Elon Musk’s AI venture announced a model named “Grok”). This node sends a chat prompt to the Grok model and returns its answer. It integrates the distinctive capabilities of xAI’s model (which presumably might have browsing or humor features) into workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const xaigrokchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.xai-grok-chat-model',
  displayName: 'xAI Grok Chat Model',
  description: 'Interfaces with xAI’s Grok model (Elon Musk’s AI venture announced a model named “Grok”). This node sends a chat prompt to the Grok model and returns its answer. It integrates the distinctive capabilities of xAI’s model (which presumably might have browsing or humor features) into workflows.',
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
      description: 'Processed data from xAI Grok Chat Model'
    }
  ],

  credentials: [
    {
      name: 'xai-grok-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'xAI Grok Chat Model'
  },

  aliases: ['xai', 'grok', 'chat', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from xAI Grok Chat Model',
      workflow: {
        nodes: [
          {
            name: 'xAI Grok Chat Model',
            type: 'n8n-nodes-base.xai-grok-chat-model',
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

export default xaigrokchatmodelNode;