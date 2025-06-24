/**
 * AI Agent Node
 * 
 * An AI Agent node that autonomously decides which AI tools to use to achieve a given objective:contentReference[oaicite:87]{index=87}. It receives a goal or question and can utilize connected Tools (sub-nodes like web search, calculators, etc.) to gather info and produce an answer or perform tasks. The AI Agent orchestrates multiple AI calls and actions to reach the desired outcome.
 */

import { NodeTypeInfo } from '../node-types.js';

export const aiagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ai-agent',
  displayName: 'AI Agent',
  description: 'An AI Agent node that autonomously decides which AI tools to use to achieve a given objective:contentReference[oaicite:87]{index=87}. It receives a goal or question and can utilize connected Tools (sub-nodes like web search, calculators, etc.) to gather info and produce an answer or perform tasks. The AI Agent orchestrates multiple AI calls and actions to reach the desired outcome.',
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
      description: 'Processed data from AI Agent'
    }
  ],

  credentials: [
    {
      name: 'ai-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AI Agent'
  },

  aliases: ['agent'],
  
  examples: [
        {
      name: 'Utilize Item',
      description: 'Utilize an item from AI Agent',
      workflow: {
        nodes: [
          {
            name: 'AI Agent',
            type: 'n8n-nodes-base.ai-agent',
            parameters: {
              operation: 'utilize',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default aiagentNode;