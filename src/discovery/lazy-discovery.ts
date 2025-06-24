/**
 * Lazy Discovery System - Optimized Memory Usage
 * 
 * This system implements lazy loading to avoid loading all 532 nodes simultaneously,
 * which improves startup time and reduces memory usage.
 */

import { NodeTypeInfo } from '../data/node-types.js';

// Core node imports (always loaded)
import { webhookNode } from '../data/nodes/webhook-node.js';
import { functionNode } from '../data/nodes/function-node.js';
import { setNode } from '../data/nodes/set-node.js';
import { ifNode } from '../data/nodes/if-node.js';
import { httprequestNode } from '../data/nodes/http-request-node.js';

// Lazy loading registry - paths to all nodes organized by category
const NODE_REGISTRY: Record<string, Record<string, () => Promise<NodeTypeInfo>>> = {
  'Core Nodes': {
    'webhook': () => import('../data/nodes/webhook-node.js').then(m => m.webhookNode),
    'function': () => import('../data/nodes/function-node.js').then(m => m.functionNode),
    'set': () => import('../data/nodes/set-node.js').then(m => m.setNode),
    'if': () => import('../data/nodes/if-node.js').then(m => m.ifNode),
    'switch': () => import('../data/nodes/switch-node.js').then(m => m.switchNode),
    'merge': () => import('../data/nodes/merge-node.js').then(m => m.mergeNode),
    'http-request': () => import('../data/nodes/http-request-node.js').then(m => m.httprequestNode),
  },
  
  'AI Nodes': {
    'openai': () => import('../data/nodes/openai-node.js').then(m => m.openaiNode),
    'claude': () => import('../data/nodes/claude-node.js').then(m => m.claudeNode),
    'anthropic-chat-model': () => import('../data/nodes/anthropic-chat-model-node.js').then(m => m.anthropicchatmodelNode),
    'langchain-openai': () => import('../data/nodes/langchain-openai-node.js').then(m => m.langchainOpenAINode),
    'ai-agent': () => import('../data/nodes/ai-agent-node.js').then(m => m.aiagentNode),
    'ai-transform': () => import('../data/nodes/ai-transform-node.js').then(m => m.aitransformNode),
  },
  
  'Database Nodes': {
    'postgres': () => import('../data/nodes/postgres-node.js').then(m => m.postgresNode),
    'mysql': () => import('../data/nodes/mysql-node.js').then(m => m.mysqlNode),
    'mongodb': () => import('../data/nodes/mongodb-node.js').then(m => m.mongodbNode),
    'redis': () => import('../data/nodes/redis-node.js').then(m => m.redisNode),
  },
  
  'Communication Nodes': {
    'slack': () => import('../data/nodes/slack-node.js').then(m => m.slackNode),
    'discord': () => import('../data/nodes/discord-node.js').then(m => m.discordNode),
    'telegram': () => import('../data/nodes/telegram-node.js').then(m => m.telegramNode),
    'gmail': () => import('../data/nodes/gmail-node.js').then(m => m.gmailNode),
    'twilio': () => import('../data/nodes/twilio-node.js').then(m => m.twilioNode),
  },
  
  'Productivity Nodes': {
    'google-sheets': () => import('../data/nodes/google-sheets-node.js').then(m => m.googleSheetsNode),
    'notion': () => import('../data/nodes/notion-node.js').then(m => m.notionNode),
    'airtable': () => import('../data/nodes/airtable-node.js').then(m => m.airtableNode),
    'trello': () => import('../data/nodes/trello-node.js').then(m => m.trelloNode),
    'asana': () => import('../data/nodes/asana-node.js').then(m => m.asanaNode),
  }
};

// Cache for loaded nodes
const nodeCache = new Map<string, NodeTypeInfo>();
const categoryCache = new Map<string, NodeTypeInfo[]>();

// Core nodes that are always available (pre-loaded)
const CORE_NODES: NodeTypeInfo[] = [
  webhookNode,
  functionNode,
  setNode,
  ifNode,
  httprequestNode
];

/**
 * Lazy Node Discovery Service
 */
export class LazyNodeDiscovery {
  private initialized = false;
  
  constructor() {
    this.preloadCoreNodes();
  }
  
  private preloadCoreNodes() {
    CORE_NODES.forEach(node => {
      nodeCache.set(node.name, node);
    });
    this.initialized = true;
  }
  
  /**
   * Get all available nodes (returns core nodes immediately, loads others on demand)
   */
  async getAllAvailableNodes(): Promise<NodeTypeInfo[]> {
    console.log('[LazyDiscovery] Getting all available nodes...');
    
    // Return core nodes immediately for fast response
    const coreNodes = [...CORE_NODES];
    
    // Optionally load more nodes in background
    this.preloadPopularNodes().catch(err => 
      console.warn('[LazyDiscovery] Background preload failed:', err.message)
    );
    
    return coreNodes;
  }
  
  /**
   * Get node by name (lazy load if not cached)
   */
  async getNodeByName(name: string): Promise<NodeTypeInfo | null> {
    // Check cache first
    if (nodeCache.has(name)) {
      return nodeCache.get(name)!;
    }
    
    // Find in registry and load
    for (const [category, nodes] of Object.entries(NODE_REGISTRY)) {
      for (const [nodeName, loader] of Object.entries(nodes)) {
        if (nodeName === name || `n8n-nodes-base.${nodeName}` === name) {
          try {
            const node = await loader();
            nodeCache.set(name, node);
            nodeCache.set(node.name, node);
            return node;
          } catch (error) {
            console.warn(`[LazyDiscovery] Failed to load node ${name}:`, error);
            return null;
          }
        }
      }
    }
    
    return null;
  }
  
  /**
   * Search nodes with lazy loading
   */
  async searchNodes(query: string, options: { limit?: number; categories?: string[] } = {}): Promise<NodeTypeInfo[]> {
    const limit = options.limit || 20;
    const results: NodeTypeInfo[] = [];
    const queryLower = query.toLowerCase();
    
    // Search core nodes first (fast)
    const coreResults = CORE_NODES.filter(node =>
      node.name.toLowerCase().includes(queryLower) ||
      node.displayName.toLowerCase().includes(queryLower) ||
      node.description.toLowerCase().includes(queryLower)
    );
    
    results.push(...coreResults.slice(0, limit));
    
    if (results.length >= limit) {
      return results;
    }
    
    // Search by category if needed
    const categoriesToSearch = options.categories || Object.keys(NODE_REGISTRY);
    
    for (const category of categoriesToSearch) {
      if (results.length >= limit) break;
      
      const categoryNodes = NODE_REGISTRY[category] || {};
      
      for (const [nodeName, loader] of Object.entries(categoryNodes)) {
        if (results.length >= limit) break;
        
        // Quick name-based matching first
        if (nodeName.toLowerCase().includes(queryLower)) {
          try {
            const node = await this.getNodeByName(nodeName);
            if (node && !results.find(r => r.name === node.name)) {
              results.push(node);
            }
          } catch (error) {
            console.warn(`[LazyDiscovery] Failed to load node ${nodeName} for search:`, error);
          }
        }
      }
    }
    
    console.log(`[LazyDiscovery] Search '${query}' found ${results.length} results`);
    return results.slice(0, limit);
  }
  
  /**
   * Get nodes by category with lazy loading
   */
  async getNodesByCategory(category: string): Promise<NodeTypeInfo[]> {
    // Check cache first
    if (categoryCache.has(category)) {
      return categoryCache.get(category)!;
    }
    
    const results: NodeTypeInfo[] = [];
    
    // Add matching core nodes
    const coreMatches = CORE_NODES.filter(node => 
      node.category === category || node.subcategory === category
    );
    results.push(...coreMatches);
    
    // Load category nodes if they exist in registry
    if (NODE_REGISTRY[category]) {
      const categoryNodes = NODE_REGISTRY[category];
      
      // Load up to 20 nodes from this category
      const nodeNames = Object.keys(categoryNodes).slice(0, 20);
      
      for (const nodeName of nodeNames) {
        try {
          const node = await this.getNodeByName(nodeName);
          if (node && !results.find(r => r.name === node.name)) {
            results.push(node);
          }
        } catch (error) {
          console.warn(`[LazyDiscovery] Failed to load ${nodeName} from category ${category}:`, error);
        }
      }
    }
    
    // Cache results
    categoryCache.set(category, results);
    
    console.log(`[LazyDiscovery] Category '${category}' loaded ${results.length} nodes`);
    return results;
  }
  
  /**
   * Get available categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    
    // Add core node categories
    CORE_NODES.forEach(node => {
      if (node.category) categories.add(node.category);
      if (node.subcategory) categories.add(node.subcategory);
    });
    
    // Add registry categories
    Object.keys(NODE_REGISTRY).forEach(category => {
      categories.add(category);
    });
    
    return Array.from(categories);
  }
  
  /**
   * Get statistics (based on loaded nodes and registry)
   */
  getStatistics() {
    const loadedNodes = Array.from(nodeCache.values());
    const totalRegistryNodes = Object.values(NODE_REGISTRY)
      .reduce((sum, category) => sum + Object.keys(category).length, 0);
    
    return {
      totalNodes: CORE_NODES.length, // Conservative estimate
      registryNodes: totalRegistryNodes,
      loadedNodes: loadedNodes.length,
      categories: this.getCategories().length,
      cacheEfficiency: nodeCache.size > 0 ? (nodeCache.size / Math.max(1, totalRegistryNodes)) * 100 : 0
    };
  }
  
  /**
   * Preload popular/commonly used nodes in background
   */
  private async preloadPopularNodes(): Promise<void> {
    const popularNodes = [
      'http-request', 'openai', 'postgres', 'slack', 'google-sheets'
    ];
    
    const loadPromises = popularNodes.map(nodeName => 
      this.getNodeByName(nodeName).catch(err => 
        console.warn(`[LazyDiscovery] Failed to preload ${nodeName}:`, err.message)
      )
    );
    
    await Promise.allSettled(loadPromises);
    console.log('[LazyDiscovery] Popular nodes preloaded');
  }
  
  /**
   * Force load all nodes (for testing or full discovery)
   */
  async loadAllNodes(): Promise<NodeTypeInfo[]> {
    console.log('[LazyDiscovery] Force loading all nodes...');
    const allNodes: NodeTypeInfo[] = [...CORE_NODES];
    
    for (const [category, nodes] of Object.entries(NODE_REGISTRY)) {
      console.log(`[LazyDiscovery] Loading category: ${category} (${Object.keys(nodes).length} nodes)`);
      
      for (const [nodeName, loader] of Object.entries(nodes)) {
        try {
          const node = await loader();
          if (!allNodes.find(n => n.name === node.name)) {
            allNodes.push(node);
          }
        } catch (error) {
          console.warn(`[LazyDiscovery] Failed to load ${nodeName}:`, error instanceof Error ? error.message : String(error));
        }
      }
    }
    
    console.log(`[LazyDiscovery] Loaded ${allNodes.length} total nodes`);
    return allNodes;
  }
}

// Export singleton instance
export const lazyNodeDiscovery = new LazyNodeDiscovery();

// Compatibility exports
export const getAllAvailableNodes = () => lazyNodeDiscovery.getAllAvailableNodes();
export const getNodesByCategory = (category: string) => lazyNodeDiscovery.getNodesByCategory(category);
export const searchNodes = (query: string, options?: any) => lazyNodeDiscovery.searchNodes(query, options);
export const getNodeStatistics = () => lazyNodeDiscovery.getStatistics();

export default lazyNodeDiscovery;