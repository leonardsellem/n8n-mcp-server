/**
 * Summarize Node
 * 
 * Generates a summary of input text using AI. It sends the content to an AI model (like OpenAI GPT) and returns a summarized version. Useful for condensing long text (e.g., articles, emails) into a brief summary.
 */

import { NodeTypeInfo } from '../node-types.js';

export const summarizeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.summarize',
  displayName: 'Summarize',
  description: 'Generates a summary of input text using AI. It sends the content to an AI model (like OpenAI GPT) and returns a summarized version. Useful for condensing long text (e.g., articles, emails) into a brief summary.',
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
      description: 'Processed data from Summarize'
    }
  ],

  credentials: [
    {
      name: 'summarizeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Summarize'
  },

  aliases: ['summarize'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Summarize',
      workflow: {
        nodes: [
          {
            name: 'Summarize',
            type: 'n8n-nodes-base.summarize',
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

export default summarizeNode;