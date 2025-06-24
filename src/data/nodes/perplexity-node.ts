/**
 * Perplexity Node
 * 
 * Integrates with the Perplexity AI answer engine. You ask a natural language question and it returns an answer (with cited sources). Useful for Q&A automation, where you want an AI to research and answer questions with references.
 */

import { NodeTypeInfo } from '../node-types.js';

export const perplexityNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.perplexity',
  displayName: 'Perplexity',
  description: 'Integrates with the Perplexity AI answer engine. You ask a natural language question and it returns an answer (with cited sources). Useful for Q&A automation, where you want an AI to research and answer questions with references.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from Perplexity'
    }
  ],

  credentials: [
    {
      name: 'perplexityApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Perplexity'
  },

  aliases: ['perplexity'],
  
  examples: [
        {
      name: 'Ask Question Item',
      description: 'Ask Question an item from Perplexity',
      workflow: {
        nodes: [
          {
            name: 'Perplexity',
            type: 'n8n-nodes-base.perplexity',
            parameters: {
              operation: 'Ask Question',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default perplexityNode;