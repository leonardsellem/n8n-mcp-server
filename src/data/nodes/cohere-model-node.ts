/**
 * Cohere Model Node
 * 
 * Runs text generation or completion using Cohere’s large language model. You provide a prompt and it returns a continuation (not necessarily chat context, but pure text completion). Useful for tasks like writing assistance or any free-form text generation leveraging Cohere’s API.
 */

import { NodeTypeInfo } from '../node-types.js';

export const coheremodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cohere-model',
  displayName: 'Cohere Model',
  description: 'Runs text generation or completion using Cohere’s large language model. You provide a prompt and it returns a continuation (not necessarily chat context, but pure text completion). Useful for tasks like writing assistance or any free-form text generation leveraging Cohere’s API.',
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
      description: 'Processed data from Cohere Model'
    }
  ],

  credentials: [
    {
      name: 'cohere-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Cohere Model'
  },

  aliases: ['cohere', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Cohere Model',
      workflow: {
        nodes: [
          {
            name: 'Cohere Model',
            type: 'n8n-nodes-base.cohere-model',
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

export default coheremodelNode;