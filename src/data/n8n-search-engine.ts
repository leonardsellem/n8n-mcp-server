/**
 * N8N Node Search Engine
 * 
 * This replicates how n8n's actual node search functionality works in the browser,
 * including the real-time filtering, categorization, and discovery features.
 */

import { NodeTypeInfo } from './node-types.js';

export interface SearchResult {
  node: NodeTypeInfo;
  score: number;
  matchReasons: string[];
  category: string;
  isTrigger: boolean;
  isPopular: boolean;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  nodeTypes?: ('trigger' | 'regular' | 'webhook')[];
  showTriggerOnly?: boolean;
  showPopularOnly?: boolean;
}

export interface NodeSearchIndex {
  displayName: string;
  name: string;
  description: string;
  aliases: string[];
  category: string;
  subcategory?: string;
  operations: string[];
  resources: string[];
  searchableText: string;
}

export class N8NSearchEngine {
  private nodes: NodeTypeInfo[];
  private searchIndex: Map<string, NodeSearchIndex>;
  private popularNodes: Set<string>;
  private categoryGroups: Map<string, NodeTypeInfo[]>;

  constructor(nodes: NodeTypeInfo[]) {
    this.nodes = nodes;
    this.searchIndex = new Map();
    this.categoryGroups = new Map();
    this.popularNodes = new Set([
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.code',
      'n8n-nodes-base.webhook',
      'n8n-nodes-base.scheduleTrigger',
      'n8n-nodes-base.set',
      'n8n-nodes-base.if',
      'n8n-nodes-base.merge',
      'n8n-nodes-base.slack',
      'n8n-nodes-base.github',
      'n8n-nodes-langchain.openai',
      'n8n-nodes-base.gmail',
      'n8n-nodes-base.googleSheets'
    ]);
    
    this.buildSearchIndex();
    this.buildCategoryGroups();
  }

  /**
   * Build searchable index for all nodes - matches n8n's indexing strategy
   */
  private buildSearchIndex(): void {
    this.nodes.forEach(node => {
      // Extract operations from properties
      const operations = this.extractOperations(node);
      const resources = this.extractResources(node);

      // Build aliases array (matches codex files)
      const aliases = this.extractAliases(node);

      // Create comprehensive searchable text
      const searchableText = [
        node.displayName,
        node.name.replace('n8n-nodes-base.', '').replace('n8n-nodes-langchain.', ''),
        node.description,
        ...aliases,
        ...operations,
        ...resources,
        node.category,
        node.subcategory || ''
      ].join(' ').toLowerCase();

      this.searchIndex.set(node.name, {
        displayName: node.displayName,
        name: node.name,
        description: node.description,
        aliases,
        category: node.category,
        subcategory: node.subcategory,
        operations,
        resources,
        searchableText
      });
    });
  }

  /**
   * Extract operations from node properties (like n8n does)
   */
  private extractOperations(node: NodeTypeInfo): string[] {
    const operations: string[] = [];
    
    node.properties.forEach(prop => {
      if (prop.name === 'operation' && prop.options) {
        prop.options.forEach(option => {
          if (typeof option.name === 'string') {
            operations.push(option.name.toLowerCase());
          }
          if (option.description) {
            operations.push(option.description.toLowerCase());
          }
        });
      }
    });

    return operations;
  }

  /**
   * Extract resources from node properties
   */
  private extractResources(node: NodeTypeInfo): string[] {
    const resources: string[] = [];
    
    node.properties.forEach(prop => {
      if (prop.name === 'resource' && prop.options) {
        prop.options.forEach(option => {
          if (typeof option.name === 'string') {
            resources.push(option.name.toLowerCase());
          }
        });
      }
    });

    return resources;
  }

  /**
   * Extract search aliases - mimics codex file aliases
   */
  private extractAliases(node: NodeTypeInfo): string[] {
    const aliases: string[] = [];
    
    // Common aliases based on node type
    const aliasMap: Record<string, string[]> = {
      'github': ['git', 'repository', 'version control', 'code'],
      'slack': ['team chat', 'messaging', 'communication'],
      'openai': ['chatgpt', 'gpt', 'ai', 'dalle', 'whisper'],
      'claude': ['anthropic', 'ai', 'chat', 'assistant'],
      'httpRequest': ['api', 'rest', 'fetch', 'curl', 'get', 'post'],
      'code': ['javascript', 'python', 'function', 'script'],
      'webhook': ['api endpoint', 'trigger', 'http'],
      'scheduleTrigger': ['cron', 'timer', 'schedule', 'recurring'],
      'gmail': ['email', 'google mail', 'send email'],
      'googleSheets': ['spreadsheet', 'google sheets', 'excel'],
      'twitter': ['x', 'social media', 'tweets'],
      'youtube': ['video', 'google video', 'upload'],
      'facebook': ['meta', 'social media', 'posts']
    };

    const nodeName = node.name.replace('n8n-nodes-base.', '').replace('n8n-nodes-langchain.', '');
    if (aliasMap[nodeName]) {
      aliases.push(...aliasMap[nodeName]);
    }

    return aliases;
  }

  /**
   * Build category groups for organized browsing
   */
  private buildCategoryGroups(): void {
    this.categoryGroups = new Map();
    
    this.nodes.forEach(node => {
      if (!this.categoryGroups.has(node.category)) {
        this.categoryGroups.set(node.category, []);
      }
      this.categoryGroups.get(node.category)!.push(node);
    });

    // Sort nodes within each category by popularity and name
    this.categoryGroups.forEach(nodes => {
      nodes.sort((a, b) => {
        const aPopular = this.popularNodes.has(a.name);
        const bPopular = this.popularNodes.has(b.name);
        
        if (aPopular && !bPopular) return -1;
        if (!aPopular && bPopular) return 1;
        
        return a.displayName.localeCompare(b.displayName);
      });
    });
  }

  /**
   * Main search function - replicates n8n's search algorithm
   */
  search(filters: SearchFilters = {}): SearchResult[] {
    let results: SearchResult[] = [];

    // If no query, return categorized results
    if (!filters.query || filters.query.trim() === '') {
      results = this.getAllNodesSorted(filters);
    } else {
      results = this.performTextSearch(filters.query, filters);
    }

    // Apply filters
    results = this.applyFilters(results, filters);

    // Sort by relevance score
    results.sort((a, b) => {
      // Popular nodes get boost
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      
      // Then by score
      if (b.score !== a.score) return b.score - a.score;
      
      // Finally by name
      return a.node.displayName.localeCompare(b.node.displayName);
    });

    return results;
  }

  /**
   * Get all nodes sorted by category and popularity
   */
  private getAllNodesSorted(filters: SearchFilters): SearchResult[] {
    const results: SearchResult[] = [];

    this.nodes.forEach(node => {
      const isPopular = this.popularNodes.has(node.name);
      const isTrigger = !!node.triggerNode;

      results.push({
        node,
        score: isPopular ? 100 : 50,
        matchReasons: ['category'],
        category: node.category,
        isTrigger,
        isPopular
      });
    });

    return results;
  }

  /**
   * Perform text-based search with scoring
   */
  private performTextSearch(query: string, filters: SearchFilters): SearchResult[] {
    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    this.nodes.forEach(node => {
      const index = this.searchIndex.get(node.name)!;
      const score = this.calculateRelevanceScore(index, searchTerms);
      
      if (score > 0) {
        const matchReasons = this.getMatchReasons(index, searchTerms);
        const isPopular = this.popularNodes.has(node.name);
        const isTrigger = !!node.triggerNode;

        results.push({
          node,
          score: isPopular ? score + 20 : score,
          matchReasons,
          category: node.category,
          isTrigger,
          isPopular
        });
      }
    });

    return results;
  }

  /**
   * Calculate relevance score based on matches
   */
  private calculateRelevanceScore(index: NodeSearchIndex, searchTerms: string[]): number {
    let score = 0;

    searchTerms.forEach(term => {
      // Exact display name match (highest score)
      if (index.displayName.toLowerCase() === term) {
        score += 100;
      }
      // Display name starts with term
      else if (index.displayName.toLowerCase().startsWith(term)) {
        score += 80;
      }
      // Display name contains term
      else if (index.displayName.toLowerCase().includes(term)) {
        score += 60;
      }
      // Node name match
      else if (index.name.toLowerCase().includes(term)) {
        score += 70;
      }
      // Alias exact match
      else if (index.aliases.some(alias => alias === term)) {
        score += 90;
      }
      // Alias partial match
      else if (index.aliases.some(alias => alias.includes(term))) {
        score += 50;
      }
      // Description match
      else if (index.description.toLowerCase().includes(term)) {
        score += 40;
      }
      // Operation match
      else if (index.operations.some(op => op.includes(term))) {
        score += 30;
      }
      // Resource match
      else if (index.resources.some(res => res.includes(term))) {
        score += 30;
      }
      // Category match
      else if (index.category.toLowerCase().includes(term)) {
        score += 20;
      }
      // Subcategory match
      else if (index.subcategory?.toLowerCase().includes(term)) {
        score += 15;
      }
    });

    // Boost for multi-term matches
    const matchedTerms = searchTerms.filter(term => 
      index.searchableText.includes(term)
    );
    
    if (matchedTerms.length > 1) {
      score += matchedTerms.length * 10;
    }

    return score;
  }

  /**
   * Get reasons why a node matched the search
   */
  private getMatchReasons(index: NodeSearchIndex, searchTerms: string[]): string[] {
    const reasons: string[] = [];

    searchTerms.forEach(term => {
      if (index.displayName.toLowerCase().includes(term)) {
        reasons.push('name');
      }
      if (index.description.toLowerCase().includes(term)) {
        reasons.push('description');
      }
      if (index.aliases.some(alias => alias.includes(term))) {
        reasons.push('alias');
      }
      if (index.operations.some(op => op.includes(term))) {
        reasons.push('operation');
      }
      if (index.category.toLowerCase().includes(term)) {
        reasons.push('category');
      }
    });

    return Array.from(new Set(reasons)); // Remove duplicates
  }

  /**
   * Apply additional filters to search results
   */
  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    let filtered = results;

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(result => 
        filters.categories!.includes(result.node.category)
      );
    }

    // Filter by node types
    if (filters.nodeTypes && filters.nodeTypes.length > 0) {
      filtered = filtered.filter(result => {
        const isTrigger = !!result.node.triggerNode;
        const isRegular = !!result.node.regularNode;
        const hasWebhook = !!result.node.webhookSupport;

        return filters.nodeTypes!.some(type => {
          switch (type) {
            case 'trigger': return isTrigger;
            case 'regular': return isRegular;
            case 'webhook': return hasWebhook;
            default: return false;
          }
        });
      });
    }

    // Show only triggers
    if (filters.showTriggerOnly) {
      filtered = filtered.filter(result => !!result.node.triggerNode);
    }

    // Show only popular nodes
    if (filters.showPopularOnly) {
      filtered = filtered.filter(result => result.isPopular);
    }

    return filtered;
  }

  /**
   * Get nodes by category (for browsing interface)
   */
  getNodesByCategory(): Map<string, NodeTypeInfo[]> {
    return this.categoryGroups;
  }

  /**
   * Get popular/featured nodes
   */
  getPopularNodes(): NodeTypeInfo[] {
    return this.nodes.filter(node => this.popularNodes.has(node.name));
  }

  /**
   * Get trigger nodes only
   */
  getTriggerNodes(): NodeTypeInfo[] {
    return this.nodes.filter(node => !!node.triggerNode);
  }

  /**
   * Get recently used nodes (would be based on user history)
   */
  getRecentNodes(): NodeTypeInfo[] {
    // In real implementation, this would come from user data
    return this.getPopularNodes().slice(0, 5);
  }

  /**
   * Get recommended nodes based on current workflow context
   */
  getRecommendations(currentNodes: string[]): NodeTypeInfo[] {
    const recommendations = new Set<NodeTypeInfo>();

    // Simple recommendation logic based on current nodes
    currentNodes.forEach(nodeName => {
      if (nodeName === 'n8n-nodes-base.httpRequest') {
        // Recommend data processing nodes
        recommendations.add(this.nodes.find(n => n.name === 'n8n-nodes-base.set')!);
        recommendations.add(this.nodes.find(n => n.name === 'n8n-nodes-base.if')!);
      }
      
      if (nodeName === 'n8n-nodes-base.webhook') {
        // Recommend response node
        recommendations.add(this.nodes.find(n => n.name === 'n8n-nodes-base.respondToWebhook')!);
      }

      if (nodeName.includes('langchain')) {
        // Recommend code node for AI workflows
        recommendations.add(this.nodes.find(n => n.name === 'n8n-nodes-base.code')!);
      }
    });

    return Array.from(recommendations).filter(Boolean);
  }

  /**
   * Get search suggestions (auto-complete)
   */
  getSuggestions(partialQuery: string): string[] {
    if (partialQuery.length < 2) return [];

    const suggestions = new Set<string>();
    const query = partialQuery.toLowerCase();

    // Add node names
    this.nodes.forEach(node => {
      if (node.displayName.toLowerCase().startsWith(query)) {
        suggestions.add(node.displayName);
      }
    });

    // Add aliases
    this.searchIndex.forEach(index => {
      index.aliases.forEach(alias => {
        if (alias.startsWith(query)) {
          suggestions.add(alias);
        }
      });
    });

    // Add categories
    this.categoryGroups.forEach((_, category) => {
      if (category.toLowerCase().startsWith(query)) {
        suggestions.add(category);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }
}

// Factory function to create search engine with enhanced nodes
export function createN8NSearchEngine(nodes: NodeTypeInfo[]): N8NSearchEngine {
  return new N8NSearchEngine(nodes);
}

export default N8NSearchEngine;