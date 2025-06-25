/**
 * n8n MCP Server Data Export
 * 
 * Central export point for all node definitions, types, and utilities
 */

// Core types and interfaces
export type { NodeTypeInfo, NodeProperty } from './node-types.js';

// Node registry and utilities
export {
  nodeRegistry,
  allNodes,
  nodesByName,
  nodeStats,
  getNodesByCategory,
  searchNodes,
  getNodesBySubcategory,
  getTriggerNodes,
  getWebhookNodes
} from './node-registry.js';

// Individual node exports for direct access
export { bigcommerceNode } from './nodes/bigcommerce-node.js';
export { convertkitNode } from './nodes/convertkit-node.js';
export { googleAnalyticsNode } from './nodes/google-analytics-node.js';
export { intercomNode, intercomTriggerNode, intercomNodes } from './nodes/intercom-node.js';
export { linearNode } from './nodes/linear-node.js';
export { quickbooksNode } from './nodes/quickbooks-node.js';
export { zendeskNode } from './nodes/zendesk-node.js';

/**
 * Default export provides the complete node registry
 */
export { default } from './node-registry.js';