/**
 * Wolfram|Alpha Node
 * 
 * Integrates with Wolfram|Alpha (computational knowledge engine). The agent can send a natural language query (especially math, science, factual queries) to WolframAlpha and get a result which could be a numeric answer or data. This is essential for precise calculations, factual lookups (like country populations, equation solving) beyond the LLM’s trained knowledge.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const wolframalphaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wolframalpha',
  displayName: 'Wolfram|Alpha',
  description: 'Integrates with Wolfram|Alpha (computational knowledge engine). The agent can send a natural language query (especially math, science, factual queries) to WolframAlpha and get a result which could be a numeric answer or data. This is essential for precise calculations, factual lookups (like country populations, equation solving) beyond the LLM’s trained knowledge.',
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
      description: 'Processed data from Wolfram|Alpha'
    }
  ],

  credentials: [
    {
      name: 'wolframalphaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Wolfram|Alpha'
  },

  aliases: ['wolfram|alpha'],
  
  examples: [
        {
      name: 'Send Item',
      description: 'Send an item from Wolfram|Alpha',
      workflow: {
        nodes: [
          {
            name: 'Wolfram|Alpha',
            type: 'n8n-nodes-base.wolframalpha',
            parameters: {
              operation: 'send',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default wolframalphaNode;