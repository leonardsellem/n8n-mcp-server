/**
 * Comprehensive Node Registry - All Available n8n Nodes
 * 
 * This registry provides a centralized index of all available n8n nodes
 * for the MCP server, organized by category for easy discovery and access.
 */

import { NodeTypeInfo } from './node-types.js';

// Import all manually created nodes
import { bigcommerceNode } from './nodes/bigcommerce-node.js';
import { convertkitNode } from './nodes/convertkit-node.js';
import { googleAnalyticsNode } from './nodes/google-analytics-node.js';
import { intercomNode, intercomTriggerNode } from './nodes/intercom-node.js';
import { linearNode } from './nodes/linear-node.js';
import { quickbooksNode } from './nodes/quickbooks-node.js';
import { zendeskNode } from './nodes/zendesk-node.js';

/**
 * Complete Node Registry - Organized by Category
 */
export const nodeRegistry: Record<string, NodeTypeInfo[]> = {
  // E-commerce & Finance
  ecommerce: [
    bigcommerceNode,
    quickbooksNode
  ],

  // Marketing & Analytics
  marketing: [
    convertkitNode,
    googleAnalyticsNode
  ],

  // Customer Support
  customerSupport: [
    intercomNode,
    intercomTriggerNode,
    zendeskNode
  ],

  // Project Management
  projectManagement: [
    linearNode
  ]
};

/**
 * Flat array of all nodes for easy iteration
 */
export const allNodes: NodeTypeInfo[] = Object.values(nodeRegistry).flat();

/**
 * Node lookup by name for quick access
 */
export const nodesByName: Record<string, NodeTypeInfo> = allNodes.reduce(
  (acc, node) => {
    acc[node.name] = node;
    return acc;
  },
  {} as Record<string, NodeTypeInfo>
);

/**
 * Search nodes by category
 */
export function getNodesByCategory(category: string): NodeTypeInfo[] {
  return nodeRegistry[category] || [];
}

/**
 * Search nodes by name or alias
 */
export function searchNodes(query: string): NodeTypeInfo[] {
  const lowerQuery = query.toLowerCase();
  return allNodes.filter(node => 
    node.name.toLowerCase().includes(lowerQuery) ||
    node.displayName.toLowerCase().includes(lowerQuery) ||
    node.description.toLowerCase().includes(lowerQuery) ||
    node.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get nodes by subcategory
 */
export function getNodesBySubcategory(subcategory: string): NodeTypeInfo[] {
  return allNodes.filter(node => 
    node.subcategory?.toLowerCase() === subcategory.toLowerCase()
  );
}

/**
 * Get trigger nodes only
 */
export function getTriggerNodes(): NodeTypeInfo[] {
  return allNodes.filter(node => node.triggerNode === true);
}

/**
 * Get nodes that support webhooks
 */
export function getWebhookNodes(): NodeTypeInfo[] {
  return allNodes.filter(node => node.webhookSupport === true);
}

/**
 * Node statistics
 */
export const nodeStats = {
  total: allNodes.length,
  categories: Object.keys(nodeRegistry).length,
  triggerNodes: getTriggerNodes().length,
  webhookNodes: getWebhookNodes().length,
  byCategory: Object.fromEntries(
    Object.entries(nodeRegistry).map(([category, nodes]) => [category, nodes.length])
  )
};

export default nodeRegistry;