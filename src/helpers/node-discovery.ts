/**
 * Dynamic Node Discovery - Enhanced System with 533+ Auto-Discovered Nodes
 * 
 * Now powered by dynamic node registry that automatically discovers all nodes
 * from organized folder structure (actions/, triggers/, core/, clusters/)
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { dynamicNodeRegistry, allDiscoveredNodes } from '../data/index.js';
import { performanceMonitor } from '../monitoring/performance-monitor.js';

export class NodeDiscoveryService {
  private nodeCache = new Map<string, NodeTypeInfo>();
  private allNodesCache: NodeTypeInfo[] | null = null;

  constructor(_apiClient?: any) {
    console.log('[NodeDiscovery] Initializing with enhanced discovery and performance monitoring');
    
    // Initialize performance monitoring
    performanceMonitor.updateDiscoveryStats(532, 0);
  }

  async getAvailableNodes(): Promise<NodeTypeInfo[]> {
    return performanceMonitor.wrapRequest(async () => {
      if (this.allNodesCache) {
        performanceMonitor.recordCacheHit();
        return this.allNodesCache;
      }
      
      performanceMonitor.recordCacheMiss();
      const timer = performanceMonitor.createTimer('load-all-nodes');
      
      const nodes = allDiscoveredNodes as NodeTypeInfo[];
      this.allNodesCache = nodes;
      
      // Update cache
      nodes.forEach((node: NodeTypeInfo) => {
        this.nodeCache.set(node.name, node);
        this.nodeCache.set(node.displayName, node);
      });
      
      timer();
      performanceMonitor.updateDiscoveryStats(nodes.length, nodes.length);
      
      console.log(`[NodeDiscovery] Returning ${nodes.length} available nodes from dynamic registry`);
      return nodes;
    }, 'getAvailableNodes');
  }

  async getNodeByName(name: string): Promise<NodeTypeInfo | null> {
    return performanceMonitor.wrapRequest(async () => {
      if (this.nodeCache.has(name)) {
        performanceMonitor.recordCacheHit();
        return this.nodeCache.get(name)!;
      }
      
      performanceMonitor.recordCacheMiss();
      const timer = performanceMonitor.createTimer(`load-node-${name}`);
      
      // Load all nodes if not loaded, then find the specific one
      const allNodes = await this.getAvailableNodes();
      const node = allNodes.find(n => n.name === name || n.displayName === name);
      
      if (node) {
        this.nodeCache.set(name, node);
      }
      
      timer();
      return node || null;
    }, `getNodeByName-${name}`);
  }

  async searchNodes(query: string, options: any = {}): Promise<NodeTypeInfo[]> {
    return performanceMonitor.wrapRequest(async () => {
      const timer = performanceMonitor.createTimer(`search-${query}`);
      
      const results = dynamicNodeRegistry.searchNodes(query, options) as NodeTypeInfo[];
      
      timer();
      console.log(`[NodeDiscovery] Search '${query}' found ${results.length} results`);
      return results;
    }, `searchNodes-${query}`);
  }

  async getNodesByCategory(category: string): Promise<NodeTypeInfo[]> {
    return performanceMonitor.wrapRequest(async () => {
      const timer = performanceMonitor.createTimer(`category-${category}`);
      
      const results = dynamicNodeRegistry.getNodesByCategory(category) as NodeTypeInfo[];
      
      timer();
      console.log(`[NodeDiscovery] Category '${category}' has ${results.length} nodes`);
      return results;
    }, `getNodesByCategory-${category}`);
  }

  getCategories(): string[] {
    // Get categories from cached nodes if available
    if (this.allNodesCache) {
      const categories = new Set(this.allNodesCache.map(node => node.category).filter(Boolean));
      return Array.from(categories);
    }
    
    // Return basic categories
    return ['Core Nodes', 'AI Nodes', 'Database Nodes', 'Communication Nodes', 'Productivity Nodes'];
  }

  getStatistics() {
    const stats = performanceMonitor.getMetrics();
    const nodeCount = this.allNodesCache ? this.allNodesCache.length : 0;
    
    return {
      totalNodes: nodeCount || 532,
      loadedNodes: this.nodeCache.size,
      categories: this.getCategories().length,
      cacheHits: stats.discoveryStats.cacheHits,
      cacheMisses: stats.discoveryStats.cacheMisses,
      cacheEfficiency: stats.discoveryStats.cacheHits + stats.discoveryStats.cacheMisses > 0 
        ? (stats.discoveryStats.cacheHits / (stats.discoveryStats.cacheHits + stats.discoveryStats.cacheMisses) * 100).toFixed(1)
        : '0'
    };
  }

  // Performance optimization methods
  async preloadPopularNodes(): Promise<void> {
    const popularNodes = ['webhook', 'function', 'set', 'if', 'http-request'];
    console.log('[NodeDiscovery] Preloading popular nodes...');
    
    const loadPromises = popularNodes.map(name => 
      this.getNodeByName(name).catch(err => 
        console.warn(`[NodeDiscovery] Failed to preload ${name}:`, err.message)
      )
    );
    
    await Promise.allSettled(loadPromises);
    console.log('[NodeDiscovery] Popular nodes preloaded');
  }

  clearCache(): void {
    this.nodeCache.clear();
    this.allNodesCache = null;
    console.log('[NodeDiscovery] Cache cleared');
  }

  /**
   * Validate a node configuration
   */
  validateNode(nodeConfig: any, _context?: any): any {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    if (!nodeConfig || typeof nodeConfig !== 'object') {
      errors.push('Node configuration must be an object');
    } else {
      if (!nodeConfig.name) errors.push('Node name is required');
      if (!nodeConfig.displayName) warnings.push('Display name is recommended');
      if (!nodeConfig.description) warnings.push('Description is recommended');
    }
    
    const valid = errors.length === 0;
    
    return {
      valid,
      errors,
      warnings,
      suggestions: valid ? suggestions : ['Fix errors before proceeding']
    };
  }

  /**
   * Generate workflow skeleton based on node types
   */
  generateWorkflowSkeleton(nodeTypes: string[]): any {
    return {
      version: 1,
      nodes: nodeTypes.map((nodeType, index) => ({
        id: `node-${index}`,
        name: nodeType,
        type: nodeType,
        position: [100 + index * 200, 100],
        parameters: {}
      })),
      connections: {}
    };
  }

  /**
   * Validate workflow configuration
   */
  validateWorkflow(workflow: any): any {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!workflow || typeof workflow !== 'object') {
      errors.push('Workflow must be an object');
    } else {
      if (!workflow.nodes) {
        errors.push('Workflow must have nodes');
      } else if (!Array.isArray(workflow.nodes)) {
        errors.push('Workflow nodes must be an array');
      } else if (workflow.nodes.length === 0) {
        warnings.push('Workflow has no nodes');
      }
    }
    
    const valid = errors.length === 0;
    
    return {
      valid,
      errors,
      warnings
    };
  }

  /**
   * Get node type information
   */
  async getNodeType(nodeTypeName: string): Promise<NodeTypeInfo | null> {
    return this.getNodeByName(nodeTypeName);
  }
}

export const nodeDiscovery = new NodeDiscoveryService();

// Initialize function for server setup
export function initializeNodeDiscovery(_apiClient?: any): void {
  console.log('[NodeDiscovery] Enhanced discovery system initialized with performance monitoring');
  
  // Preload popular nodes for better performance
  nodeDiscovery.preloadPopularNodes().catch(err => 
    console.warn('[NodeDiscovery] Failed to preload popular nodes:', err.message)
  );
}

export default nodeDiscovery;
