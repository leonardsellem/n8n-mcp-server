/**
 * Final Complete Catalog - Redirected to Enhanced Discovery
 */

export { allNodes as ALL_COMPLETE_NODES, searchNodes, getNodesByCategory } from './index.js';
export type { NodeTypeInfo } from './node-types.js';

// Legacy exports for compatibility
export const ENHANCED_CORE_NODES = [];
export const ENHANCED_APP_NODES = [];
export const getTriggerNodes = () => [];
export const getPopularNodes = () => [];

// Main catalog export
export const completeN8NCatalog = {
  getAllAvailableNodes: () => import('./index.js').then(m => m.allNodes)
};

export class CompleteN8NCatalog {
  static async getAllAvailableNodes() {
    const { allNodes } = await import('./index.js');
    return allNodes;
  }
}
