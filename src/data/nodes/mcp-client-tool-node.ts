/**
 * MCP Client Tool Node
 * 
 * Likely a tool to interact with n8n’s Multi-Component Protocol or some Multi-Chain Orchestration. Perhaps it allows an AI agent to perform operations in a multi-component environment (maybe controlling other workflows or interacting with the n8n engine itself). Not entirely sure, but possibly for advanced orchestration tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mcpclienttoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mcp-client-tool',
  displayName: 'MCP Client Tool',
  description: 'Likely a tool to interact with n8n’s Multi-Component Protocol or some Multi-Chain Orchestration. Perhaps it allows an AI agent to perform operations in a multi-component environment (maybe controlling other workflows or interacting with the n8n engine itself). Not entirely sure, but possibly for advanced orchestration tasks.',
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
      description: 'Processed data from MCP Client Tool'
    }
  ],

  credentials: [
    {
      name: 'mcp-client-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MCP Client Tool'
  },

  aliases: ['mcp', 'client', 'tool'],
  
  examples: [
        {
      name: 'An Item',
      description: 'An an item from MCP Client Tool',
      workflow: {
        nodes: [
          {
            name: 'MCP Client Tool',
            type: 'n8n-nodes-base.mcp-client-tool',
            parameters: {
              operation: 'an',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mcpclienttoolNode;