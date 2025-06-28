/**
 * Dynamic Node Registry - Auto-Discovery System for AI Agents
 * 
 * Automatically discovers all 533+ nodes from organized folder structure
 * and makes them available through the MCP server's discover_nodes tool
 */

import { readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { NodeTypeInfo } from './node-types.js';

export interface DiscoveredNode extends NodeTypeInfo {
  category: 'action' | 'trigger' | 'core' | 'cluster';
  subcategory?: string;
  filePath: string;
  isPopular: boolean;
  searchTags: string[];
  aiDescription: string;
  useCases: string[];
  integrationComplexity: 'simple' | 'medium' | 'complex';
  authRequired: boolean;
  rateLimit: boolean;
}

export class DynamicNodeRegistry {
  private nodes: Map<string, DiscoveredNode> = new Map();
  private categoryMap: Map<string, DiscoveredNode[]> = new Map();
  private searchIndex: Map<string, string[]> = new Map();
  
  // Popular nodes that AI agents frequently use
  private popularNodes = new Set([
    'http-request', 'webhook', 'schedule-trigger', 'code', 'set', 'if', 'merge',
    'openai', 'slack', 'github', 'gmail', 'google-sheets', 'discord', 'notion',
    'microsoft-outlook', 'microsoft-teams', 'shopify', 'stripe', 'airtable',
    'hubspot', 'salesforce', 'trello', 'asana', 'typeform', 'mailchimp'
  ]);

  constructor() {
    this.discoverAllNodes();
    this.buildSearchIndex();
  }

  /**
   * Discover all nodes from organized folder structure
   */
  private discoverAllNodes(): void {
    const nodesBasePath = 'src/data/nodes';
    const categories = ['actions', 'triggers', 'core', 'clusters'];

    categories.forEach(category => {
      const categoryPath = join(nodesBasePath, category);
      
      if (!existsSync(categoryPath)) {
        console.warn(`Category folder not found: ${categoryPath}`);
        return;
      }

      try {
        const files = readdirSync(categoryPath);
        const nodeFiles = files.filter(file => 
          extname(file) === '.ts' && 
          !file.includes('index') && 
          !file.includes('template')
        );

        console.log(`Found ${nodeFiles.length} nodes in ${category}`);

        const categoryNodes: DiscoveredNode[] = [];

        nodeFiles.forEach(file => {
          const nodeId = basename(file, '.ts');
          const discoveredNode = this.createNodeFromFile(nodeId, category as any, categoryPath, file);
          
          this.nodes.set(nodeId, discoveredNode);
          categoryNodes.push(discoveredNode);
        });

        this.categoryMap.set(category, categoryNodes);
      } catch (error) {
        console.error(`Error reading category ${category}:`, error);
      }
    });

    console.log(`Total discovered nodes: ${this.nodes.size}`);
  }

  /**
   * Create a node definition from file information
   */
  private createNodeFromFile(
    nodeId: string, 
    category: 'action' | 'trigger' | 'core' | 'cluster',
    categoryPath: string,
    fileName: string
  ): DiscoveredNode {
    const displayName = this.generateDisplayName(nodeId);
    const service = this.extractServiceName(nodeId);
    const isPopular = this.popularNodes.has(nodeId);
    
    return {
      name: `n8n-nodes-base.${nodeId.replace(/-/g, '')}`,
      displayName,
      description: this.generateDescription(displayName, service, category),
      aiDescription: this.generateAIDescription(displayName, service, category),
      version: 1,
      category,
      subcategory: this.determineSubcategory(nodeId, category),
      filePath: join(categoryPath, fileName),
      isPopular,
      searchTags: this.generateSearchTags(nodeId, displayName, service),
      useCases: this.generateUseCases(nodeId, service, category),
      
      // Node structure
      properties: [],
      inputs: [{ type: 'main', displayName: 'Main', required: true }],
      outputs: [{ type: 'main', displayName: 'Main' }],
      triggerNode: category === 'trigger',
      regularNode: category !== 'trigger',
      webhookSupport: category === 'trigger' && nodeId.includes('webhook'),
      
      // Additional metadata for AI agents
      aliases: this.generateAliases(nodeId, service),
      integrationComplexity: this.assessComplexity(nodeId, service),
      authRequired: this.requiresAuth(service),
      rateLimit: this.hasRateLimit(service)
    };
  }

  /**
   * Generate basic description from display name and service
   */
  private generateDescription(displayName: string, service: string | undefined, category: string): string {
    if (service) {
      return `Integrate with ${service} in your n8n workflows. ${displayName} ${category} node provides seamless connectivity to ${service} services.`;
    }
    
    return `${displayName} ${category} node for n8n workflows. Provides essential functionality for automation and integration.`;
  }

  /**
   * Generate human-readable display name
   */
  private generateDisplayName(nodeId: string): string {
    return nodeId
      .split('-')
      .map(word => {
        // Handle special cases
        if (word === 'api') return 'API';
        if (word === 'ai') return 'AI';
        if (word === 'crm') return 'CRM';
        if (word === 'sms') return 'SMS';
        if (word === 'http') return 'HTTP';
        if (word === 'ftp') return 'FTP';
        if (word === 'ssh') return 'SSH';
        if (word === 'xml') return 'XML';
        if (word === 'json') return 'JSON';
        if (word === 'csv') return 'CSV';
        if (word === 'pdf') return 'PDF';
        
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')
      .replace(/\s+Trigger$/, ' Trigger')
      .replace(/\s+Node$/, '');
  }

  /**
   * Extract service name from node ID
   */
  private extractServiceName(nodeId: string): string | undefined {
    // Remove common suffixes
    const cleanId = nodeId
      .replace(/-trigger$/, '')
      .replace(/-node$/, '')
      .replace(/-api$/, '');

    // Map of known services
    const serviceMap: Record<string, string> = {
      'github': 'GitHub',
      'gitlab': 'GitLab',
      'slack': 'Slack',
      'discord': 'Discord',
      'microsoft-outlook': 'Microsoft Outlook',
      'microsoft-teams': 'Microsoft Teams',
      'google-sheets': 'Google Sheets',
      'google-drive': 'Google Drive',
      'google-calendar': 'Google Calendar',
      'salesforce': 'Salesforce',
      'hubspot': 'HubSpot',
      'mailchimp': 'Mailchimp',
      'shopify': 'Shopify',
      'woocommerce': 'WooCommerce',
      'stripe': 'Stripe',
      'paypal': 'PayPal',
      'openai': 'OpenAI',
      'anthropic': 'Anthropic'
    };

    return serviceMap[cleanId] || this.generateDisplayName(cleanId);
  }

  /**
   * Generate AI-friendly description
   */
  private generateAIDescription(displayName: string, service: string | undefined, category: string): string {
    const categoryDesc: Record<string, string> = {
      action: 'Performs actions and integrates with external services',
      trigger: 'Monitors for events and triggers workflow execution',
      core: 'Provides essential workflow functionality and data processing',
      cluster: 'Enables distributed processing and coordination'
    };

    const description = categoryDesc[category] || 'Provides workflow functionality';

    if (service) {
      return `${description} using ${service}. Enables seamless integration with ${service} for automation workflows.`;
    }
    
    return `${description}. ${displayName} node for n8n workflows.`;
  }

  /**
   * Generate search tags for better discoverability
   */
  private generateSearchTags(nodeId: string, displayName: string, service: string | undefined): string[] {
    const tags = new Set<string>();
    
    // Add node ID parts
    nodeId.split('-').forEach(part => tags.add(part));
    
    // Add display name parts
    displayName.toLowerCase().split(' ').forEach(part => tags.add(part));
    
    // Add service name
    if (service) {
      tags.add(service.toLowerCase());
    }
    
    // Add category-specific tags
    if (nodeId.includes('email') || nodeId.includes('mail')) {
      tags.add('email');
      tags.add('communication');
    }
    
    if (nodeId.includes('database') || nodeId.includes('db') || nodeId.includes('sql')) {
      tags.add('database');
      tags.add('storage');
    }
    
    if (nodeId.includes('ai') || nodeId.includes('openai') || nodeId.includes('langchain')) {
      tags.add('ai');
      tags.add('machine-learning');
      tags.add('nlp');
    }
    
    if (nodeId.includes('webhook') || nodeId.includes('http')) {
      tags.add('api');
      tags.add('webhook');
      tags.add('integration');
    }

    return Array.from(tags);
  }

  /**
   * Generate use cases for AI agent understanding
   */
  private generateUseCases(nodeId: string, service: string | undefined, category: string): string[] {
    const useCases: string[] = [];
    
    if (category === 'trigger') {
      useCases.push('Automatically start workflows when specific events occur');
      useCases.push('Monitor external systems for changes');
      useCases.push('Schedule automated tasks');
    } else {
      useCases.push('Process and transform data');
      useCases.push('Integrate with external services');
      useCases.push('Automate business processes');
    }
    
    // Service-specific use cases
    if (service) {
      if (service.includes('Email') || service.includes('Mail')) {
        useCases.push('Send automated email notifications');
        useCases.push('Process incoming emails');
        useCases.push('Email marketing automation');
      }
      
      if (service.includes('CRM') || service === 'Salesforce' || service === 'HubSpot') {
        useCases.push('Sync customer data');
        useCases.push('Lead management automation');
        useCases.push('Sales pipeline updates');
      }
      
      if (service.includes('AI') || service === 'OpenAI') {
        useCases.push('Generate AI-powered content');
        useCases.push('Analyze and classify text');
        useCases.push('Automate customer support');
      }
    }
    
    return useCases;
  }

  /**
   * Generate aliases for better search
   */
  private generateAliases(nodeId: string, service: string | undefined): string[] {
    const aliases: string[] = [];
    
    // Common aliases mapping
    const aliasMap: Record<string, string[]> = {
      'http-request': ['api', 'rest', 'fetch', 'curl', 'request'],
      'webhook': ['api endpoint', 'http trigger', 'rest endpoint'],
      'code': ['javascript', 'function', 'script', 'custom code'],
      'schedule-trigger': ['cron', 'timer', 'recurring', 'scheduler'],
      'openai': ['chatgpt', 'gpt', 'ai', 'llm'],
      'slack': ['team chat', 'messaging', 'collaboration'],
      'github': ['git', 'version control', 'repository', 'code'],
      'gmail': ['google mail', 'email', 'google email']
    };
    
    const key = nodeId.replace(/-trigger$/, '').replace(/-node$/, '');
    if (aliasMap[key]) {
      aliases.push(...aliasMap[key]);
    }
    
    if (service) {
      aliases.push(service.toLowerCase());
    }
    
    return aliases;
  }

  /**
   * Determine subcategory for better organization
   */
  private determineSubcategory(nodeId: string, category: string): string | undefined {
    if (category === 'action') {
      if (nodeId.includes('email') || nodeId.includes('mail')) return 'communication';
      if (nodeId.includes('database') || nodeId.includes('sql')) return 'database';
      if (nodeId.includes('ai') || nodeId.includes('openai')) return 'ai-ml';
      if (nodeId.includes('crm') || nodeId.includes('sales')) return 'crm';
      if (nodeId.includes('social') || nodeId.includes('twitter')) return 'social-media';
      if (nodeId.includes('payment') || nodeId.includes('stripe')) return 'finance';
      if (nodeId.includes('storage') || nodeId.includes('cloud')) return 'storage';
    }
    
    return undefined;
  }

  /**
   * Assess integration complexity for AI agent planning
   */
  private assessComplexity(nodeId: string, service: string | undefined): 'simple' | 'medium' | 'complex' {
    if (['set', 'if', 'merge', 'code'].some(simple => nodeId.includes(simple))) {
      return 'simple';
    }
    
    if (service && ['Stripe', 'Salesforce', 'SAP'].some(complex => service.includes(complex))) {
      return 'complex';
    }
    
    return 'medium';
  }

  /**
   * Check if service requires authentication
   */
  private requiresAuth(service: string | undefined): boolean {
    if (!service) return false;
    
    const noAuthServices = ['webhook', 'schedule', 'set', 'if', 'merge', 'code'];
    return !noAuthServices.some(noAuth => service.toLowerCase().includes(noAuth));
  }

  /**
   * Check if service has rate limits
   */
  private hasRateLimit(service: string | undefined): boolean {
    if (!service) return false;
    
    const rateLimitedServices = ['twitter', 'github', 'openai', 'google', 'salesforce'];
    return rateLimitedServices.some(limited => service.toLowerCase().includes(limited));
  }

  /**
   * Build search index for fast queries
   */
  private buildSearchIndex(): void {
    this.nodes.forEach((node, nodeId) => {
      const searchTerms = new Set<string>();
      
      // Add basic identifiers
      searchTerms.add(nodeId);
      searchTerms.add(node.displayName.toLowerCase());
      searchTerms.add(node.description.toLowerCase());
      
      // Add search tags
      node.searchTags.forEach(tag => searchTerms.add(tag));
      
      // Add aliases
      node.aliases?.forEach(alias => searchTerms.add(alias));
      
      // Add use cases
      node.useCases.forEach(useCase => searchTerms.add(useCase.toLowerCase()));
      
      this.searchIndex.set(nodeId, Array.from(searchTerms));
    });
  }

  /**
   * Search nodes with AI-friendly scoring
   */
  searchNodes(query: string, options: {
    category?: string;
    limit?: number;
    includePopular?: boolean;
  } = {}): DiscoveredNode[] {
    const { category, limit = 50, includePopular = false } = options;
    
    if (!query || query.trim() === '') {
      return this.getAllNodes(category, limit, includePopular);
    }
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: Array<{ node: DiscoveredNode; score: number }> = [];
    
    this.nodes.forEach((node, nodeId) => {
      if (category && node.category !== category) return;
      
      const searchText = this.searchIndex.get(nodeId) || [];
      let score = 0;
      
      searchTerms.forEach(term => {
        // Exact matches get highest score
        if (nodeId === term) score += 100;
        if (node.displayName.toLowerCase() === term) score += 90;
        
        // Partial matches
        if (nodeId.includes(term)) score += 70;
        if (node.displayName.toLowerCase().includes(term)) score += 60;
        if (node.description.toLowerCase().includes(term)) score += 40;
        
        // Search tags and aliases
        if (node.searchTags.some(tag => tag.includes(term))) score += 50;
        if (node.aliases?.some(alias => alias.includes(term))) score += 45;
        
        // Use cases
        if (node.useCases.some(useCase => useCase.toLowerCase().includes(term))) score += 30;
      });
      
      // Boost popular nodes
      if (node.isPopular) score += 20;
      
      if (score > 0) {
        results.push({ node, score });
      }
    });
    
    // Sort by score and apply limit
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.node);
  }

  /**
   * Get all nodes with optional filtering
   */
  getAllNodes(category?: string, limit: number = 50, includePopular: boolean = false): DiscoveredNode[] {
    let nodes = Array.from(this.nodes.values());
    
    if (category) {
      nodes = nodes.filter(node => node.category === category);
    }
    
    if (includePopular) {
      nodes = nodes.filter(node => node.isPopular);
    }
    
    // Sort by popularity, then alphabetically
    nodes.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
    
    return nodes.slice(0, limit);
  }

  /**
   * Get nodes by category
   */
  getNodesByCategory(category: string): DiscoveredNode[] {
    return this.categoryMap.get(category) || [];
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): DiscoveredNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Get statistics for AI agent reporting
   */
  getStats() {
    return {
      totalNodes: this.nodes.size,
      categories: {
        actions: this.categoryMap.get('actions')?.length || 0,
        triggers: this.categoryMap.get('triggers')?.length || 0,
        core: this.categoryMap.get('core')?.length || 0,
        clusters: this.categoryMap.get('clusters')?.length || 0
      },
      popularNodes: Array.from(this.nodes.values()).filter(n => n.isPopular).length,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const dynamicNodeRegistry = new DynamicNodeRegistry();

// Export for MCP server usage
export const allDiscoveredNodes = Array.from(dynamicNodeRegistry['nodes'].values());

export default dynamicNodeRegistry;
