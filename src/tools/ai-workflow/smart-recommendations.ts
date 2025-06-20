/**
 * Smart Node Recommendation Engine
 * 
 * Provides intelligent node suggestions based on workflow context,
 * user intent, and best practices for optimal automation design.
 */

import { NodeTypeInfo } from '../../data/node-types.js';
import { ALL_COMPLETE_NODES } from '../../data/final-complete-catalog.js';

export interface RecommendationRequest {
  context: {
    existingNodes?: string[];
    intent?: string;
    dataTypes?: string[];
    constraints?: {
      complexity?: 'low' | 'medium' | 'high';
      performance?: 'speed' | 'reliability' | 'cost';
      environment?: 'development' | 'staging' | 'production';
    };
  };
  query?: string;
}

export interface NodeRecommendation {
  node: NodeTypeInfo;
  confidence: number;
  reasoning: string[];
  suggestedParameters?: Record<string, any>;
  alternatives?: NodeTypeInfo[];
  integrationPattern?: string;
  estimatedComplexity: 'low' | 'medium' | 'high';
  prerequisites?: string[];
}

export interface RecommendationResult {
  primary: NodeRecommendation[];
  alternatives: NodeRecommendation[];
  workflowSuggestions: string[];
  bestPractices: string[];
}

/**
 * Node recommendation patterns based on common use cases
 */
const RECOMMENDATION_PATTERNS = [
  {
    pattern: 'trigger_start',
    condition: (nodes: string[]) => nodes.length === 0,
    recommendations: [
      'n8n-nodes-base.manualTrigger',
      'n8n-nodes-base.scheduleTrigger', 
      'n8n-nodes-base.webhook'
    ],
    reasoning: 'Every workflow needs a trigger to initiate execution'
  },
  {
    pattern: 'data_processing',
    condition: (nodes: string[], intent?: string) => 
      intent?.includes('process') || intent?.includes('transform'),
    recommendations: [
      'n8n-nodes-base.code',
      'n8n-nodes-base.set',
      'n8n-nodes-base.if'
    ],
    reasoning: 'Data processing workflows benefit from transformation and logic nodes'
  },
  {
    pattern: 'notification_flow',
    condition: (nodes: string[], intent?: string) => 
      intent?.includes('notify') || intent?.includes('alert'),
    recommendations: [
      'n8n-nodes-base.slack',
      'n8n-nodes-base.gmail',
      'n8n-nodes-base.webhook'
    ],
    reasoning: 'Notification workflows require communication channels'
  },
  {
    pattern: 'api_integration',
    condition: (nodes: string[], intent?: string) => 
      intent?.includes('api') || intent?.includes('integration'),
    recommendations: [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.code',
      'n8n-nodes-base.if'
    ],
    reasoning: 'API integrations need HTTP requests and data handling'
  },
  {
    pattern: 'error_handling',
    condition: (nodes: string[]) => 
      nodes.length > 2 && !nodes.some(n => n.includes('if')),
    recommendations: [
      'n8n-nodes-base.if',
      'n8n-nodes-base.slack',
      'n8n-nodes-base.set'
    ],
    reasoning: 'Complex workflows should include error handling and monitoring'
  }
];

/**
 * Node affinity matrix - which nodes work well together
 */
const NODE_AFFINITY = {
  'n8n-nodes-base.github': {
    'n8n-nodes-base.slack': 0.9,
    'n8n-nodes-base.webhook': 0.8,
    'n8n-nodes-base.if': 0.7,
    'n8n-nodes-base.set': 0.6
  },
  'n8n-nodes-langchain.openai': {
    'n8n-nodes-base.code': 0.9,
    'n8n-nodes-base.set': 0.8,
    'n8n-nodes-base.slack': 0.7,
    'n8n-nodes-base.if': 0.6
  },
  'n8n-nodes-base.httpRequest': {
    'n8n-nodes-base.code': 0.9,
    'n8n-nodes-base.if': 0.8,
    'n8n-nodes-base.set': 0.7,
    'n8n-nodes-base.slack': 0.6
  },
  'n8n-nodes-base.scheduleTrigger': {
    'n8n-nodes-base.httpRequest': 0.8,
    'n8n-nodes-base.code': 0.7,
    'n8n-nodes-base.slack': 0.9,
    'n8n-nodes-base.if': 0.6
  }
};

export class SmartRecommendationEngine {
  private nodes: NodeTypeInfo[];
  
  constructor() {
    this.nodes = ALL_COMPLETE_NODES;
  }

  /**
   * Get node recommendations based on context and intent
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    const { context, query } = request;
    const existingNodes = context.existingNodes || [];
    
    // Get pattern-based recommendations
    const patternRecommendations = this.getPatternRecommendations(existingNodes, context.intent);
    
    // Get affinity-based recommendations
    const affinityRecommendations = this.getAffinityRecommendations(existingNodes);
    
    // Get query-based recommendations
    const queryRecommendations = query ? this.getQueryRecommendations(query) : [];
    
    // Combine and rank recommendations
    const allRecommendations = this.combineRecommendations([
      ...patternRecommendations,
      ...affinityRecommendations,
      ...queryRecommendations
    ]);

    // Split into primary and alternatives
    const primary = allRecommendations.slice(0, 3);
    const alternatives = allRecommendations.slice(3, 6);
    
    return {
      primary,
      alternatives,
      workflowSuggestions: this.generateWorkflowSuggestions(existingNodes, context),
      bestPractices: this.generateBestPractices(existingNodes, context)
    };
  }

  /**
   * Get recommendations based on workflow patterns
   */
  private getPatternRecommendations(existingNodes: string[], intent?: string): NodeRecommendation[] {
    const recommendations: NodeRecommendation[] = [];
    
    for (const pattern of RECOMMENDATION_PATTERNS) {
      if (pattern.condition(existingNodes, intent)) {
        for (const nodeType of pattern.recommendations) {
          const node = this.findNode(nodeType);
          if (node && !existingNodes.includes(nodeType)) {
            recommendations.push({
              node,
              confidence: 0.8,
              reasoning: [pattern.reasoning],
              estimatedComplexity: this.estimateNodeComplexity(node),
              integrationPattern: pattern.pattern
            });
          }
        }
      }
    }
    
    return recommendations;
  }

  /**
   * Get recommendations based on node affinity
   */
  private getAffinityRecommendations(existingNodes: string[]): NodeRecommendation[] {
    const recommendations: NodeRecommendation[] = [];
    
    for (const existingNode of existingNodes) {
      const affinities = NODE_AFFINITY[existingNode as keyof typeof NODE_AFFINITY];
      if (affinities) {
        for (const [nodeType, affinity] of Object.entries(affinities)) {
          if (!existingNodes.includes(nodeType)) {
            const node = this.findNode(nodeType);
            if (node) {
              recommendations.push({
                node,
                confidence: affinity as number,
                reasoning: [`Works well with ${this.getNodeDisplayName(existingNode)}`],
                estimatedComplexity: this.estimateNodeComplexity(node),
                integrationPattern: 'affinity_based'
              });
            }
          }
        }
      }
    }
    
    return recommendations;
  }

  /**
   * Get recommendations based on natural language query
   */
  private getQueryRecommendations(query: string): NodeRecommendation[] {
    const recommendations: NodeRecommendation[] = [];
    const queryLower = query.toLowerCase();
    
    // Keyword matching
    const keywordMappings = {
      'slack': 'n8n-nodes-base.slack',
      'github': 'n8n-nodes-base.github', 
      'email': 'n8n-nodes-base.gmail',
      'ai': 'n8n-nodes-langchain.openai',
      'openai': 'n8n-nodes-langchain.openai',
      'api': 'n8n-nodes-base.httpRequest',
      'http': 'n8n-nodes-base.httpRequest',
      'schedule': 'n8n-nodes-base.scheduleTrigger',
      'webhook': 'n8n-nodes-base.webhook',
      'code': 'n8n-nodes-base.code',
      'transform': 'n8n-nodes-base.code',
      'condition': 'n8n-nodes-base.if',
      'if': 'n8n-nodes-base.if'
    };

    for (const [keyword, nodeType] of Object.entries(keywordMappings)) {
      if (queryLower.includes(keyword)) {
        const node = this.findNode(nodeType);
        if (node) {
          recommendations.push({
            node,
            confidence: 0.9,
            reasoning: [`Matches query keyword: "${keyword}"`],
            estimatedComplexity: this.estimateNodeComplexity(node),
            integrationPattern: 'query_based'
          });
        }
      }
    }

    // Semantic matching for node descriptions
    for (const node of this.nodes) {
      const descWords = node.description.toLowerCase().split(' ');
      const queryWords = queryLower.split(' ');
      const overlap = queryWords.filter(word => 
        descWords.some(descWord => descWord.includes(word) || word.includes(descWord))
      ).length;
      
      if (overlap >= 2) {
        recommendations.push({
          node,
          confidence: Math.min(overlap * 0.2, 0.8),
          reasoning: [`Description matches query intent`],
          estimatedComplexity: this.estimateNodeComplexity(node),
          integrationPattern: 'semantic_match'
        });
      }
    }
    
    return recommendations;
  }

  /**
   * Combine and deduplicate recommendations
   */
  private combineRecommendations(recommendations: NodeRecommendation[]): NodeRecommendation[] {
    const nodeMap = new Map<string, NodeRecommendation>();
    
    // Merge recommendations for the same node
    for (const rec of recommendations) {
      const nodeType = rec.node.name;
      const existing = nodeMap.get(nodeType);
      
      if (existing) {
        // Combine reasoning and take higher confidence
        existing.confidence = Math.max(existing.confidence, rec.confidence);
        existing.reasoning = [...existing.reasoning, ...rec.reasoning];
      } else {
        nodeMap.set(nodeType, rec);
      }
    }
    
    // Sort by confidence and add suggested parameters
    return Array.from(nodeMap.values())
      .sort((a, b) => b.confidence - a.confidence)
      .map(rec => ({
        ...rec,
        suggestedParameters: this.generateSuggestedParameters(rec.node),
        alternatives: this.getAlternativeNodes(rec.node),
        prerequisites: this.getNodePrerequisites(rec.node)
      }));
  }

  /**
   * Generate suggested parameters for a node
   */
  private generateSuggestedParameters(node: NodeTypeInfo): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Use node defaults as base
    if (node.defaults) {
      Object.assign(params, node.defaults);
    }
    
    // Add common parameter suggestions based on node type
    if (node.name === 'n8n-nodes-base.slack') {
      params.resource = 'message';
      params.operation = 'send';
      params.channel = '#general';
    } else if (node.name === 'n8n-nodes-base.scheduleTrigger') {
      params.rule = '0 9 * * 1-5'; // Weekdays at 9 AM
      params.timezone = 'UTC';
    } else if (node.name === 'n8n-nodes-langchain.openai') {
      params.resource = 'text';
      params.operation = 'chat';
      params.model = 'gpt-4o-mini';
    }
    
    return params;
  }

  /**
   * Get alternative nodes for similar functionality
   */
  private getAlternativeNodes(node: NodeTypeInfo): NodeTypeInfo[] {
    const alternatives: NodeTypeInfo[] = [];
    
    // Find nodes in same category/subcategory
    const sameCategory = this.nodes.filter(n => 
      n.category === node.category && 
      n.name !== node.name
    ).slice(0, 2);
    
    alternatives.push(...sameCategory);
    
    // Add specific alternatives based on node type
    if (node.name === 'n8n-nodes-base.slack') {
      const emailNode = this.findNode('n8n-nodes-base.gmail');
      if (emailNode) alternatives.push(emailNode);
    }
    
    return alternatives;
  }

  /**
   * Get prerequisites for using a node
   */
  private getNodePrerequisites(node: NodeTypeInfo): string[] {
    const prerequisites: string[] = [];
    
    if (node.credentials && node.credentials.length > 0) {
      prerequisites.push('Valid authentication credentials required');
    }
    
    if (node.aiMetadata?.prerequisites) {
      prerequisites.push(...node.aiMetadata.prerequisites);
    }
    
    // Add common prerequisites based on node type
    if (node.name.includes('trigger')) {
      prerequisites.push('Should be used as the first node in workflow');
    }
    
    if (node.category === 'AI') {
      prerequisites.push('API credits/quota available');
    }
    
    return prerequisites;
  }

  /**
   * Generate workflow improvement suggestions
   */
  private generateWorkflowSuggestions(existingNodes: string[], context: any): string[] {
    const suggestions: string[] = [];
    
    if (existingNodes.length === 0) {
      suggestions.push('Start with a trigger node to define when the workflow runs');
    }
    
    if (!existingNodes.some(n => n.includes('trigger'))) {
      suggestions.push('Add a trigger node to start workflow execution');
    }
    
    if (existingNodes.length > 3 && !existingNodes.some(n => n.includes('if'))) {
      suggestions.push('Consider adding conditional logic with IF node for error handling');
    }
    
    if (existingNodes.some(n => n.includes('http')) && !existingNodes.some(n => n.includes('slack'))) {
      suggestions.push('Add notification node to monitor API call results');
    }
    
    if (context.constraints?.environment === 'production') {
      suggestions.push('Implement comprehensive error handling and monitoring');
      suggestions.push('Add retry logic for external API calls');
    }
    
    return suggestions;
  }

  /**
   * Generate best practices based on current workflow
   */
  private generateBestPractices(existingNodes: string[], context: any): string[] {
    const practices: string[] = [
      'Test workflow with sample data before production deployment',
      'Use meaningful node names for better workflow documentation',
      'Implement error handling for external API dependencies'
    ];
    
    if (existingNodes.some(n => n.includes('http'))) {
      practices.push('Set appropriate timeout values for HTTP requests');
      practices.push('Handle rate limiting with retry mechanisms');
    }
    
    if (existingNodes.some(n => n.includes('openai'))) {
      practices.push('Monitor token usage to control AI costs');
      practices.push('Use appropriate temperature settings for consistent outputs');
    }
    
    if (context.constraints?.environment === 'production') {
      practices.push('Use environment variables for sensitive configuration');
      practices.push('Implement workflow monitoring and alerting');
    }
    
    return practices;
  }

  /**
   * Estimate complexity of a node
   */
  private estimateNodeComplexity(node: NodeTypeInfo): 'low' | 'medium' | 'high' {
    if (node.aiMetadata?.integrationComplexity) {
      return node.aiMetadata.integrationComplexity;
    }
    
    // Fallback estimation
    if (node.triggerNode) return 'low';
    if (node.properties.length > 10) return 'high';
    if (node.properties.length > 5) return 'medium';
    return 'low';
  }

  /**
   * Find node by type name
   */
  private findNode(nodeType: string): NodeTypeInfo | undefined {
    return this.nodes.find(node => node.name === nodeType);
  }

  /**
   * Get display name for a node type
   */
  private getNodeDisplayName(nodeType: string): string {
    const node = this.findNode(nodeType);
    return node?.displayName || nodeType;
  }
}

export default SmartRecommendationEngine;