/**
 * Universal Node Catalog - Phase 1 of n8n MCP Server Enhancement
 * 
 * This system provides universal node discovery capabilities for any AI agent,
 * enabling discovery of 1000+ n8n integrations organized by functional categories.
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { 
  ALL_COMPLETE_NODES,
  getNodesByCategory,
  completeN8NCatalog
} from '../data/final-complete-catalog.js';

/**
 * Universal node catalog interface for AI agent integration
 */
export interface UniversalNodeCatalog {
  // Core discovery methods
  discoverByCategory(category: string): Promise<NodeTypeInfo[]>;
  discoverByIntent(intent: string): Promise<NodeTypeInfo[]>;
  searchNodes(query: string, options?: SearchOptions): Promise<SearchResult>;
  getNodeChainSuggestions(workflow: WorkflowDescription): Promise<NodeChainSuggestion[]>;
  
  // Ecosystem access
  getAiEcosystem(): AiEcosystemNodes;
  getPlatformIntegrations(): PlatformIntegrationNodes;
  getCoreWorkflow(): CoreWorkflowNodes;
  getMcpIntegration(): McpIntegrationNodes;
  
  // Universal utilities
  getAllAvailableNodes(): Promise<NodeTypeInfo[]>;
  getNodeCategories(): string[];
  getNodeStatistics(): CatalogStatistics;
}

/**
 * AI Ecosystem nodes for language models, vectors, embeddings, chains
 */
export interface AiEcosystemNodes {
  chatModels: NodeTypeInfo[];
  vectorStores: NodeTypeInfo[];
  embeddings: NodeTypeInfo[];
  chains: NodeTypeInfo[];
  retrievers: NodeTypeInfo[];
  documentLoaders: NodeTypeInfo[];
  textSplitters: NodeTypeInfo[];
  memory: NodeTypeInfo[];
  agents: NodeTypeInfo[];
  tools: NodeTypeInfo[];
}

/**
 * Platform integration nodes organized by domain
 */
export interface PlatformIntegrationNodes {
  communication: NodeTypeInfo[];
  databases: NodeTypeInfo[];
  cloud: NodeTypeInfo[];
  productivity: NodeTypeInfo[];
  business: NodeTypeInfo[];
  ecommerce: NodeTypeInfo[];
  marketing: NodeTypeInfo[];
  analytics: NodeTypeInfo[];
  finance: NodeTypeInfo[];
  hr: NodeTypeInfo[];
  sales: NodeTypeInfo[];
  crm: NodeTypeInfo[];
  support: NodeTypeInfo[];
}

/**
 * Core workflow building nodes
 */
export interface CoreWorkflowNodes {
  triggers: NodeTypeInfo[];
  utilities: NodeTypeInfo[];
  flow: NodeTypeInfo[];
  dataTransformation: NodeTypeInfo[];
  conditions: NodeTypeInfo[];
  loops: NodeTypeInfo[];
  errorHandling: NodeTypeInfo[];
}

/**
 * Native MCP integration capabilities
 */
export interface McpIntegrationNodes {
  mcpServerTrigger: NodeTypeInfo[];
  mcpClientTool: NodeTypeInfo[];
  mcpResourceAccess: NodeTypeInfo[];
  mcpToolExecution: NodeTypeInfo[];
}

/**
 * Search options for node discovery
 */
export interface SearchOptions {
  categories?: string[];
  subcategories?: string[];
  tags?: string[];
  includeAiOptimized?: boolean;
  includeRegular?: boolean;
  maxResults?: number;
  fuzzySearch?: boolean;
}

/**
 * Search result with enhanced metadata
 */
export interface SearchResult {
  nodes: NodeTypeInfo[];
  totalCount: number;
  categories: string[];
  suggestions: string[];
  relatedNodes: NodeTypeInfo[];
  aiOptimizedVariants: NodeTypeInfo[];
}

/**
 * Workflow description for chain suggestions
 */
export interface WorkflowDescription {
  intent: string;
  inputData?: any;
  expectedOutput?: any;
  constraints?: string[];
  preferences?: {
    speed?: 'fast' | 'balanced' | 'thorough';
    reliability?: 'high' | 'medium' | 'low';
    cost?: 'low' | 'medium' | 'high';
  };
}

/**
 * Node chain suggestion with reasoning
 */
export interface NodeChainSuggestion {
  chain: NodeTypeInfo[];
  reasoning: string;
  confidence: number;
  estimatedTime: string;
  complexity: 'simple' | 'moderate' | 'complex';
  alternatives: NodeTypeInfo[][];
}

/**
 * Catalog statistics
 */
export interface CatalogStatistics {
  totalNodes: number;
  aiNodes: number;
  regularNodes: number;
  categories: { [category: string]: number };
  topIntegrations: { name: string; count: number }[];
  coverage: {
    ai: number;
    communication: number;
    business: number;
    database: number;
    cloud: number;
    developer: number;
  };
}

/**
 * Implementation of the Universal Node Catalog
 */
export class LiveNodeCatalog implements UniversalNodeCatalog {
  
  constructor() {
    this.initializeCatalog();
  }

  private initializeCatalog(): void {
    // Initialize any necessary indexes or caches here
  }

  async discoverByCategory(category: string): Promise<NodeTypeInfo[]> {
    const normalizedCategory = category.toLowerCase();
    
    // Map common category requests to our organized collections
    const categoryMap: { [key: string]: NodeTypeInfo[] } = {
      'ai': MASSIVE_AI_NODES,
      'artificial intelligence': MASSIVE_AI_NODES,
      'machine learning': MASSIVE_AI_NODES,
      'communication': MASSIVE_COMMUNICATION_NODES,
      'messaging': MASSIVE_COMMUNICATION_NODES,
      'chat': MASSIVE_COMMUNICATION_NODES,
      'business': MASSIVE_BUSINESS_NODES,
      'crm': MASSIVE_BUSINESS_NODES,
      'productivity': MASSIVE_BUSINESS_NODES,
      'database': MASSIVE_DATABASE_NODES,
      'storage': MASSIVE_DATABASE_NODES,
      'data': MASSIVE_DATABASE_NODES,
      'cloud': MASSIVE_CLOUD_NODES,
      'cloud services': MASSIVE_CLOUD_NODES,
      'aws': MASSIVE_CLOUD_NODES.filter(n => n.name.includes('aws')),
      'google cloud': MASSIVE_CLOUD_NODES.filter(n => n.name.includes('googleCloud')),
      'azure': MASSIVE_CLOUD_NODES.filter(n => n.name.includes('azure')),
      'ecommerce': MASSIVE_ECOMMERCE_NODES,
      'e-commerce': MASSIVE_ECOMMERCE_NODES,
      'shopping': MASSIVE_ECOMMERCE_NODES,
      'developer': MASSIVE_DEVELOPER_NODES,
      'developer tools': MASSIVE_DEVELOPER_NODES,
      'development': MASSIVE_DEVELOPER_NODES
    };

    // Return exact matches or filter from all nodes
    return categoryMap[normalizedCategory] || 
           ALL_MASSIVE_NODES.filter(node => 
             node.category.toLowerCase().includes(normalizedCategory) ||
             node.subcategory?.toLowerCase().includes(normalizedCategory)
           );
  }

  async discoverByIntent(intent: string): Promise<NodeTypeInfo[]> {
    const intentKeywords = intent.toLowerCase();
    
    // Intent-based node discovery using semantic matching
    const intentMap: { [key: string]: NodeTypeInfo[] } = {
      // AI/ML intents
      'chat with ai': MASSIVE_AI_NODES.filter(n => n.subcategory === 'Language Models'),
      'generate text': MASSIVE_AI_NODES.filter(n => n.subcategory === 'Language Models'),
      'analyze sentiment': MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('sentiment')),
      'generate images': MASSIVE_AI_NODES.filter(n => n.subcategory === 'Image Generation'),
      'search documents': MASSIVE_AI_NODES.filter(n => n.subcategory === 'Vector Databases'),
      'embed text': MASSIVE_AI_NODES.filter(n => n.subcategory === 'Embeddings'),
      
      // Communication intents
      'send message': MASSIVE_COMMUNICATION_NODES.filter(n => n.name.includes('slack') || n.name.includes('teams')),
      'send email': MASSIVE_COMMUNICATION_NODES.filter(n => n.subcategory === 'Email'),
      'post to social media': MASSIVE_COMMUNICATION_NODES.filter(n => n.subcategory === 'Social Media'),
      'schedule meeting': MASSIVE_COMMUNICATION_NODES.filter(n => n.name.includes('zoom') || n.name.includes('calendar')),
      
      // Business intents
      'manage contacts': MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'CRM'),
      'track sales': MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'CRM'),
      'manage projects': MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'Project Management'),
      'handle support tickets': MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'Customer Support'),
      
      // Data intents
      'store data': MASSIVE_DATABASE_NODES,
      'query database': MASSIVE_DATABASE_NODES.filter(n => n.subcategory === 'SQL'),
      'cache data': MASSIVE_DATABASE_NODES.filter(n => n.name.includes('redis')),
      'search data': MASSIVE_DATABASE_NODES.filter(n => n.name.includes('elasticsearch')),
      
      // Cloud intents
      'store files': MASSIVE_CLOUD_NODES.filter(n => n.subcategory === 'Storage'),
      'run function': MASSIVE_CLOUD_NODES.filter(n => n.subcategory === 'Compute'),
      'send notification': MASSIVE_CLOUD_NODES.filter(n => n.subcategory === 'Messaging')
    };

    // Find best matches for the intent
    for (const [key, nodes] of Object.entries(intentMap)) {
      if (intentKeywords.includes(key) || key.includes(intentKeywords)) {
        return nodes;
      }
    }

    // Fallback to fuzzy search
    return this.fuzzySearchByIntent(intent);
  }

  async searchNodes(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const {
      categories = [],
      subcategories = [],
      maxResults = 50,
      fuzzySearch = true
    } = options;

    let searchResults = ALL_MASSIVE_NODES;

    // Filter by categories if specified
    if (categories.length > 0) {
      searchResults = searchResults.filter(node =>
        categories.some(cat => node.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Filter by subcategories if specified
    if (subcategories.length > 0) {
      searchResults = searchResults.filter(node =>
        subcategories.some(subcat => 
          node.subcategory?.toLowerCase().includes(subcat.toLowerCase())
        )
      );
    }

    // Text search
    const lowerQuery = query.toLowerCase();
    const exactMatches = searchResults.filter(node =>
      node.displayName.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery) ||
      node.name.toLowerCase().includes(lowerQuery)
    );

    // Fuzzy search if enabled and needed
    let fuzzyMatches: NodeTypeInfo[] = [];
    if (fuzzySearch && exactMatches.length < maxResults) {
      fuzzyMatches = this.performFuzzySearch(query, searchResults, exactMatches);
    }

    const allMatches = [...exactMatches, ...fuzzyMatches].slice(0, maxResults);

    return {
      nodes: allMatches,
      totalCount: allMatches.length,
      categories: [...new Set(allMatches.map(n => n.category))],
      suggestions: this.generateSearchSuggestions(query),
      relatedNodes: this.findRelatedNodes(allMatches),
      aiOptimizedVariants: allMatches.filter(n => n.subcategory?.includes('AI'))
    };
  }

  async getNodeChainSuggestions(workflow: WorkflowDescription): Promise<NodeChainSuggestion[]> {
    const suggestions: NodeChainSuggestion[] = [];
    
    // Analyze intent to suggest appropriate node chains
    const intent = workflow.intent.toLowerCase();
    
    if (intent.includes('ai') || intent.includes('chat') || intent.includes('generate')) {
      suggestions.push({
        chain: [
          MASSIVE_AI_NODES.find(n => n.displayName === 'OpenAI')!,
          ALL_MASSIVE_NODES.find(n => n.displayName === 'Set')!
        ].filter(Boolean),
        reasoning: 'AI workflow typically starts with AI model and processes results',
        confidence: 0.9,
        estimatedTime: '< 1 minute',
        complexity: 'simple',
        alternatives: [
          [MASSIVE_AI_NODES.find(n => n.displayName === 'Anthropic Claude')!].filter(Boolean)
        ]
      });
    }

    if (intent.includes('data') || intent.includes('database')) {
      suggestions.push({
        chain: [
          MASSIVE_DATABASE_NODES.find(n => n.displayName === 'PostgreSQL')!,
          ALL_MASSIVE_NODES.find(n => n.displayName === 'Function')!
        ].filter(Boolean),
        reasoning: 'Data workflows benefit from database operations followed by processing',
        confidence: 0.8,
        estimatedTime: '2-5 minutes',
        complexity: 'moderate',
        alternatives: [
          [MASSIVE_DATABASE_NODES.find(n => n.displayName === 'MySQL')!].filter(Boolean)
        ]
      });
    }

    if (intent.includes('notification') || intent.includes('alert')) {
      suggestions.push({
        chain: [
          ALL_MASSIVE_NODES.find(n => n.displayName === 'IF')!,
          MASSIVE_COMMUNICATION_NODES.find(n => n.displayName === 'Slack')!
        ].filter(Boolean),
        reasoning: 'Notification workflows typically check conditions before sending alerts',
        confidence: 0.85,
        estimatedTime: '< 30 seconds',
        complexity: 'simple',
        alternatives: [
          [MASSIVE_COMMUNICATION_NODES.find(n => n.displayName === 'Discord')!].filter(Boolean)
        ]
      });
    }

    return suggestions.filter(s => s.chain.length > 0);
  }

  getAiEcosystem(): AiEcosystemNodes {
    return {
      chatModels: MASSIVE_AI_NODES.filter(n => 
        n.subcategory === 'Language Models' || 
        n.displayName.includes('GPT') || 
        n.displayName.includes('Claude')
      ),
      vectorStores: MASSIVE_AI_NODES.filter(n => n.subcategory === 'Vector Databases'),
      embeddings: MASSIVE_AI_NODES.filter(n => n.subcategory === 'Embeddings'),
      chains: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('chain')),
      retrievers: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('retriev')),
      documentLoaders: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('loader')),
      textSplitters: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('split')),
      memory: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('memory')),
      agents: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('agent')),
      tools: MASSIVE_AI_NODES.filter(n => n.description.toLowerCase().includes('tool'))
    };
  }

  getPlatformIntegrations(): PlatformIntegrationNodes {
    return {
      communication: MASSIVE_COMMUNICATION_NODES,
      databases: MASSIVE_DATABASE_NODES,
      cloud: MASSIVE_CLOUD_NODES,
      productivity: MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'Productivity'),
      business: MASSIVE_BUSINESS_NODES,
      ecommerce: MASSIVE_ECOMMERCE_NODES,
      marketing: MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'Marketing'),
      analytics: ALL_MASSIVE_NODES.filter(n => n.category === 'Analytics'),
      finance: MASSIVE_BUSINESS_NODES.filter(n => n.description.toLowerCase().includes('financ')),
      hr: MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'HR'),
      sales: MASSIVE_BUSINESS_NODES.filter(n => n.description.toLowerCase().includes('sales')),
      crm: MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'CRM'),
      support: MASSIVE_BUSINESS_NODES.filter(n => n.subcategory === 'Customer Support')
    };
  }

  getCoreWorkflow(): CoreWorkflowNodes {
    return {
      triggers: ALL_MASSIVE_NODES.filter(n => n.triggerNode || n.category === 'Trigger Nodes'),
      utilities: ALL_MASSIVE_NODES.filter(n => n.category === 'Core Utilities'),
      flow: ALL_MASSIVE_NODES.filter(n => 
        n.displayName === 'IF' || 
        n.displayName === 'Switch' || 
        n.displayName === 'Merge'
      ),
      dataTransformation: ALL_MASSIVE_NODES.filter(n => 
        n.displayName === 'Set' || 
        n.displayName === 'Function' || 
        n.displayName === 'Code'
      ),
      conditions: ALL_MASSIVE_NODES.filter(n => n.displayName === 'IF'),
      loops: ALL_MASSIVE_NODES.filter(n => n.displayName === 'Split In Batches'),
      errorHandling: ALL_MASSIVE_NODES.filter(n => n.description.toLowerCase().includes('error'))
    };
  }

  getMcpIntegration(): McpIntegrationNodes {
    // These are discovered native MCP capabilities that should be implemented
    return {
      mcpServerTrigger: [], // To be implemented
      mcpClientTool: [], // To be implemented  
      mcpResourceAccess: [], // To be implemented
      mcpToolExecution: [] // To be implemented
    };
  }

  async getAllAvailableNodes(): Promise<NodeTypeInfo[]> {
    return ALL_MASSIVE_NODES;
  }

  getNodeCategories(): string[] {
    const categories = new Set(ALL_MASSIVE_NODES.map(node => node.category));
    return Array.from(categories).sort();
  }

  getNodeStatistics(): CatalogStatistics {
    const categories: { [category: string]: number } = {};
    ALL_MASSIVE_NODES.forEach(node => {
      categories[node.category] = (categories[node.category] || 0) + 1;
    });

    const topIntegrations = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalNodes: ALL_MASSIVE_NODES.length,
      aiNodes: MASSIVE_AI_NODES.length,
      regularNodes: ALL_MASSIVE_NODES.length - MASSIVE_AI_NODES.length,
      categories,
      topIntegrations,
      coverage: {
        ai: MASSIVE_AI_NODES.length,
        communication: MASSIVE_COMMUNICATION_NODES.length,
        business: MASSIVE_BUSINESS_NODES.length,
        database: MASSIVE_DATABASE_NODES.length,
        cloud: MASSIVE_CLOUD_NODES.length,
        developer: MASSIVE_DEVELOPER_NODES.length
      }
    };
  }

  // Private helper methods
  private fuzzySearchByIntent(intent: string): NodeTypeInfo[] {
    const keywords = intent.toLowerCase().split(' ');
    return ALL_MASSIVE_NODES.filter(node => {
      const nodeText = `${node.displayName} ${node.description} ${node.category}`.toLowerCase();
      return keywords.some(keyword => nodeText.includes(keyword));
    }).slice(0, 20);
  }

  private performFuzzySearch(query: string, searchSpace: NodeTypeInfo[], exclude: NodeTypeInfo[]): NodeTypeInfo[] {
    const excludeNames = new Set(exclude.map(n => n.name));
    const queryWords = query.toLowerCase().split(' ');
    
    return searchSpace
      .filter(node => !excludeNames.has(node.name))
      .filter(node => {
        const nodeText = `${node.displayName} ${node.description}`.toLowerCase();
        return queryWords.some(word => 
          nodeText.includes(word) || 
          this.calculateSimilarity(word, nodeText) > 0.6
        );
      })
      .slice(0, 10);
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple similarity calculation - can be enhanced with more sophisticated algorithms
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions = [
      'AI language models',
      'database operations', 
      'communication tools',
      'cloud storage',
      'workflow automation',
      'data transformation',
      'email marketing',
      'social media',
      'project management',
      'customer support'
    ];

    return suggestions
      .filter(s => !s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  private findRelatedNodes(nodes: NodeTypeInfo[]): NodeTypeInfo[] {
    if (nodes.length === 0) return [];
    
    const categories = new Set(nodes.map(n => n.category));
    const subcategories = new Set(nodes.map(n => n.subcategory).filter(Boolean));
    
    return ALL_MASSIVE_NODES
      .filter(node => 
        categories.has(node.category) || 
        (node.subcategory && subcategories.has(node.subcategory))
      )
      .filter(node => !nodes.find(n => n.name === node.name))
      .slice(0, 10);
  }
}

/**
 * Global instance of the Universal Node Catalog
 */
export const universalNodeCatalog = new LiveNodeCatalog();

/**
 * Factory function to create a new catalog instance
 */
export function createUniversalNodeCatalog(): UniversalNodeCatalog {
  return new LiveNodeCatalog();
}