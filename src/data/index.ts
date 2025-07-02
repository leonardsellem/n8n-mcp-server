/**
 * n8n MCP Server Data Export
 * 
 * Basic exports for the simplified MCP server
 */

// Core types and interfaces
export type { NodeTypeInfo, NodeProperty } from './node-types.js';

// Basic node information for the simplified server
export interface BasicNodeInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
}

// Basic node registry for the simplified server
export const basicNodes: BasicNodeInfo[] = [
  {
    name: 'n8n-nodes-base.slack',
    displayName: 'Slack',
    description: 'Send messages and interact with Slack',
    category: 'Communication'
  },
  {
    name: 'n8n-nodes-base.googleSheets',
    displayName: 'Google Sheets',
    description: 'Read and write data to Google Sheets',
    category: 'Productivity'
  },
  {
    name: 'n8n-nodes-base.httpRequest',
    displayName: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    category: 'Core'
  }
];

// Export basic nodes as allNodes for compatibility
export const allNodes = basicNodes;

// Default export
export default basicNodes;
