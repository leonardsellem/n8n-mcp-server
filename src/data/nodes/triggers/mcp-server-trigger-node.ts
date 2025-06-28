/**
 * MCP Server Trigger Node - Trigger
 * 
 * Triggers workflows based on internal n8n Multi-Processing (MCP) server events. (This is specific to n8n’s multi-process coordination; it listens for internal events in an MCP setup. Typically used in advanced scenarios for inter-process triggers.)
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mcpservertriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mcp-server-trigger',
  displayName: 'MCP Server Trigger',
  description: 'Triggers workflows based on internal n8n Multi-Processing (MCP) server events. (This is specific to n8n’s multi-process coordination; it listens for internal events in an MCP setup. Typically used in advanced scenarios for inter-process triggers.)',
  category: 'Core',
  subcategory: 'Trigger',
  
  properties: [
        {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }
  ],

  inputs: [
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when events occur'
    }
  ],

  credentials: [
    {
      name: 'mcp-server-triggerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  version: [1],
  defaults: {
    name: 'MCP Server Trigger'
  },

  aliases: ['mcp', 'server', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in MCP Server Trigger',
      workflow: {
        nodes: [
          {
            name: 'MCP Server Trigger Trigger',
            type: 'n8n-nodes-base.mcp-server-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mcpservertriggerNode;