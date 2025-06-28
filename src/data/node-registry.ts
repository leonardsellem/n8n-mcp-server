/**
 * Legacy Node Registry - Backward Compatibility Only
 * 
 * This registry provides minimal backward compatibility.
 * For the full 533+ node catalog, use the dynamic registry instead.
 * 
 * @deprecated Use dynamic registry for full node access
 */

import { NodeTypeInfo } from './node-types.js';

/**
 * Legacy Node Registry - All nodes now auto-discovered
 * @deprecated Use dynamicNodeRegistry.getNodesByCategory() instead
 */
export const nodeRegistry: Record<string, NodeTypeInfo[]> = {
  // All nodes now auto-discovered by dynamic registry
  actions: [],
  triggers: [],
  core: [],
  clusters: [],
  
  // Legacy categories for backward compatibility
  aiProductivity: [],
  ecommerce: [],
  marketing: [],
  customerSupport: [],
  projectManagement: []
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
