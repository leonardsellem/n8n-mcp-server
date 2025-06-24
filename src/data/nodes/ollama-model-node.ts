/**
 * Ollama Model Node
 * 
 * Generates text using an Ollama-served model in a single prompt-response manner (not chat):contentReference[oaicite:96]{index=96}. Essentially like a completion model call to a locally hosted model via Ollama. You give a prompt and get the model’s output. This could be used for single-turn tasks or prompt-based transformations using local models.
 */

import { NodeTypeInfo } from '../node-types.js';

export const ollamamodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ollama-model',
  displayName: 'Ollama Model',
  description: 'Generates text using an Ollama-served model in a single prompt-response manner (not chat):contentReference[oaicite:96]{index=96}. Essentially like a completion model call to a locally hosted model via Ollama. You give a prompt and get the model’s output. This could be used for single-turn tasks or prompt-based transformations using local models.',
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
      description: 'Processed data from Ollama Model'
    }
  ],

  credentials: [
    {
      name: 'ollama-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Ollama Model'
  },

  aliases: ['ollama', 'model'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Ollama Model',
      workflow: {
        nodes: [
          {
            name: 'Ollama Model',
            type: 'n8n-nodes-base.ollama-model',
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

export default ollamamodelNode;