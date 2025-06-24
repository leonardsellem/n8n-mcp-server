/**
 * Final Complete Catalog - Redirected to Enhanced Discovery
 */

export { ALL_COMPLETE_NODES, searchNodes, getNodesByCategory } from '../discovery/enhanced-discovery.js';
export { NodeTypeInfo } from './node-types.js';

// Legacy exports for compatibility
export const ENHANCED_CORE_NODES = [];
export const ENHANCED_APP_NODES = [];
export const getTriggerNodes = () => [];
export const getPopularNodes = () => [];

// Main catalog export
export const completeN8NCatalog = {
  getAllAvailableNodes: () => import('../discovery/enhanced-discovery.js').then(m => m.getAllAvailableNodes())
};

export class CompleteN8NCatalog {
  static async getAllAvailableNodes() {
    const { getAllAvailableNodes } = await import('../discovery/enhanced-discovery.js');
    return getAllAvailableNodes();
  }
}
