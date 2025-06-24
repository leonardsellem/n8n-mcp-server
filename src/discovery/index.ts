/**
 * Discovery Module Index - Patched for All 532 Nodes
 */

export { 
  EnhancedNodeDiscovery as default,
  ALL_COMPLETE_NODES,
  getAllAvailableNodes,
  getNodesByCategory, 
  searchNodes,
  getNodeStatistics,
  universalNodeCatalog
} from './enhanced-discovery.js';

export { NodeTypeInfo } from '../data/node-types.js';

// Compatibility export for legacy code
export const completeN8NCatalog = {
  getAllAvailableNodes: () => import('./enhanced-discovery.js').then(m => m.getAllAvailableNodes()),
  getNodesByCategory: (category: string) => import('./enhanced-discovery.js').then(m => m.getNodesByCategory(category)),
  searchNodes: (query: string, options?: any) => import('./enhanced-discovery.js').then(m => m.searchNodes(query, options))
};
