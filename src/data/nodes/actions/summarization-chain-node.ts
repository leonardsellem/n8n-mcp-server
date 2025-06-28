/**
 * Summarization Chain Node
 * 
 * An LLM chain for summarizing text. It takes long text or multiple documents and guides the LLM to produce a concise summary. Often uses a map-reduce or refine approach behind the scenes for longer texts.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const summarizationchainNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.summarization-chain',
  displayName: 'Summarization Chain',
  description: 'An LLM chain for summarizing text. It takes long text or multiple documents and guides the LLM to produce a concise summary. Often uses a map-reduce or refine approach behind the scenes for longer texts.',
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
      description: 'Processed data from Summarization Chain'
    }
  ],

  credentials: [
    {
      name: 'summarization-chainApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Summarization Chain'
  },

  aliases: ['summarization', 'chain'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Summarization Chain',
      workflow: {
        nodes: [
          {
            name: 'Summarization Chain',
            type: 'n8n-nodes-base.summarization-chain',
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

export default summarizationchainNode;