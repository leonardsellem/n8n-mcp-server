/**
 * n8n MCP Server Data Export
 * 
 * Central export point for all node definitions, types, and utilities
 * Now powered by dynamic node discovery for 533+ nodes from organized folders
 */

// Core types and interfaces
export type { NodeTypeInfo, NodeProperty } from './node-types.js';

// Dynamic node registry (NEW - discovers all 533+ nodes automatically)
export {
  dynamicNodeRegistry,
  allDiscoveredNodes,
  type DiscoveredNode
} from './dynamic-node-registry.js';

// Legacy node registry for backward compatibility
export {
  nodeRegistry,
  nodesByName,
  nodeStats,
  getNodesByCategory,
  searchNodes,
  getNodesBySubcategory,
  getTriggerNodes,
  getWebhookNodes
} from './node-registry.js';

// Legacy allNodes export from node-registry (keeping for backward compatibility)
export { allNodes as legacyNodes } from './node-registry.js';

/**
 * Main export for AI agents - uses dynamic registry with all discovered nodes
 * This is now the primary source of truth with 533+ auto-discovered nodes
 */
export { allDiscoveredNodes as allNodes } from './dynamic-node-registry.js';

/**
 * Default export provides the dynamic node registry for AI agents
 */
export { default } from './dynamic-node-registry.js';
