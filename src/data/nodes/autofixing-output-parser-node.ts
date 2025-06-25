/**
 * Auto-fixing Output Parser Node
 * 
 * A parser that wraps LLM output parsing and automatically handles slight format deviations. If the LLM’s output doesn’t exactly match the expected format/schema, this parser can attempt to fix or re-ask to get a correct format:contentReference[oaicite:98]{index=98}. This ensures robust extraction of structured info from the AI’s responses.
 */

import { NodeTypeInfo } from '../node-types.js';

export const autofixingoutputparserNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.autofixing-output-parser',
  displayName: 'Auto-fixing Output Parser',
  description: 'A parser that wraps LLM output parsing and automatically handles slight format deviations. If the LLM’s output doesn’t exactly match the expected format/schema, this parser can attempt to fix or re-ask to get a correct format:contentReference[oaicite:98]{index=98}. This ensures robust extraction of structured info from the AI’s responses.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from Auto-fixing Output Parser'
    }
  ],

  credentials: [
    {
      name: 'autofixing-output-parserApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Auto-fixing Output Parser'
  },

  aliases: ['auto', 'fixing', 'output', 'parser'],
  
  examples: [
        {
      name: 'Attempt Item',
      description: 'Attempt an item from Auto-fixing Output Parser',
      workflow: {
        nodes: [
          {
            name: 'Auto-fixing Output Parser',
            type: 'n8n-nodes-base.autofixing-output-parser',
            parameters: {
              operation: 'attempt',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default autofixingoutputparserNode;