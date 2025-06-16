/**
 * Advanced Node Search Tools - Phase 3 Universal Node Discovery
 * 
 * This module provides advanced search capabilities for complex node discovery scenarios,
 * leveraging the Phase 1 Enhanced Discovery system for intelligent search and filtering.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { universalNodeCatalog } from '../../discovery/live-node-catalog.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Advanced search criteria interface
 */
export interface AdvancedSearchCriteria {
  query: string;
  capabilities?: string[];
  integrationTypes?: string[];
  performanceRequirements?: {
    minReliability?: number;
    maxExecutionTime?: number;
    resourceEfficiency?: 'low' | 'medium' | 'high';
  };
  compatibilityRequirements?: {
    inputTypes?: string[];
    outputTypes?: string[];
    chainCompatible?: boolean;
  };
  aiOptimization?: {
    includeAiOptimized?: boolean;
    requireAiOptimized?: boolean;
    aiCapabilities?: string[];
  };
  contextualFilters?: {
    useCase?: string;
    industry?: string;
    complexity?: 'simple' | 'medium' | 'complex';
    environment?: 'development' | 'staging' | 'production';
  };
}

/**
 * Enhanced search result with relevance scoring
 */
export interface EnhancedSearchResult {
  nodes: Array<{
    node: any;
    relevanceScore: number;
    matchingCriteria: string[];
    aiOptimizations?: any;
    compatibilityInfo?: any;
    usageRecommendations?: string[];
  }>;
  searchMetadata: {
    totalFound: number;
    searchTime: number;
    criteriaUsed: string[];
    suggestionEngine: string;
    confidence: number;
  };
  relatedSearches: string[];
  alternativeApproaches: Array<{
    approach: string;
    description: string;
    benefits: string[];
  }>;
}

/**
 * Advanced Node Search Handler
 */
export class AdvancedNodeSearchHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const {
        query,
        capabilities = [],
        integrationTypes = [],
        performanceRequirements = {},
        compatibilityRequirements = {},
        aiOptimization = {},
        contextualFilters = {},
        maxResults = 20,
        includeRelevanceScoring = true
      } = args;

      if (!query) {
        throw new Error('Search query is required');
      }

      console.error(`[AdvancedNodeSearchHandler] Performing advanced search: "${query}"`);
      
      const startTime = Date.now();
      const searchCriteria: AdvancedSearchCriteria = {
        query,
        capabilities,
        integrationTypes,
        performanceRequirements,
        compatibilityRequirements,
        aiOptimization,
        contextualFilters
      };

      // Perform capability-based search
      const capabilityResults = await this.searchByCapabilities(searchCriteria);
      console.error(`[AdvancedNodeSearchHandler] Capability search found ${capabilityResults.length} nodes`);

      // Perform semantic search using Phase 1 Universal Node Catalog
      const semanticResults = await this.performSemanticSearch(query, searchCriteria);
      console.error(`[AdvancedNodeSearchHandler] Semantic search found ${semanticResults.length} nodes`);

      // Perform integration-type filtering
      const integrationResults = await this.filterByIntegrationType(searchCriteria);
      console.error(`[AdvancedNodeSearchHandler] Integration filtering found ${integrationResults.length} nodes`);

      // Merge and deduplicate results
      const mergedResults = await this.mergeAndRankResults(
        [capabilityResults, semanticResults, integrationResults],
        searchCriteria,
        includeRelevanceScoring
      );

      // Apply performance and compatibility filters
      const filteredResults = await this.applyAdvancedFilters(mergedResults, searchCriteria);

      // Enhance results with AI optimization data
      const enhancedResults = await this.enhanceWithAIOptimizations(
        filteredResults.slice(0, maxResults),
        searchCriteria
      );

      // Generate search metadata and suggestions
      const searchTime = Date.now() - startTime;
      const result: EnhancedSearchResult = {
        nodes: enhancedResults,
        searchMetadata: {
          totalFound: mergedResults.length,
          searchTime,
          criteriaUsed: this.extractUsedCriteria(searchCriteria),
          suggestionEngine: 'Phase 3 Advanced Search',
          confidence: this.calculateSearchConfidence(enhancedResults, searchCriteria)
        },
        relatedSearches: await this.generateRelatedSearches(query, searchCriteria),
        alternativeApproaches: await this.generateAlternativeApproaches(searchCriteria)
      };

      return this.formatSuccess(
        result,
        `Advanced search completed: ${enhancedResults.length} nodes found with ${Math.round(result.searchMetadata.confidence * 100)}% confidence`
      );
    }, args);
  }

  private async searchByCapabilities(criteria: AdvancedSearchCriteria): Promise<any[]> {
    try {
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      
      if (criteria.capabilities && criteria.capabilities.length > 0) {
        return allNodes.filter(node => {
          const nodeCapabilities = this.extractNodeCapabilities(node);
          return criteria.capabilities!.some(cap => 
            nodeCapabilities.some(nodeCap => 
              nodeCap.toLowerCase().includes(cap.toLowerCase()) ||
              cap.toLowerCase().includes(nodeCap.toLowerCase())
            )
          );
        });
      }

      return allNodes;
    } catch (error) {
      console.error(`[AdvancedNodeSearchHandler] Capability search failed:`, error);
      return [];
    }
  }

  private async performSemanticSearch(query: string, criteria: AdvancedSearchCriteria): Promise<any[]> {
    try {
      // Use Phase 1 Universal Node Catalog for enhanced semantic search
      const searchResult = await universalNodeCatalog.searchNodes(query, {
        maxResults: 50,
        fuzzySearch: true,
        categories: criteria.integrationTypes || [],
        includeAiOptimized: criteria.aiOptimization?.includeAiOptimized !== false
      });

      return searchResult.nodes;
    } catch (error) {
      console.error(`[AdvancedNodeSearchHandler] Semantic search failed:`, error);
      return [];
    }
  }

  private async filterByIntegrationType(criteria: AdvancedSearchCriteria): Promise<any[]> {
    try {
      if (!criteria.integrationTypes || criteria.integrationTypes.length === 0) {
        return [];
      }

      const results: any[] = [];
      
      for (const integrationType of criteria.integrationTypes) {
        const categoryNodes = await universalNodeCatalog.discoverByCategory(integrationType);
        results.push(...categoryNodes);
      }

      // Remove duplicates
      const uniqueResults = Array.from(
        new Map(results.map(node => [node.name, node])).values()
      );

      return uniqueResults;
    } catch (error) {
      console.error(`[AdvancedNodeSearchHandler] Integration type filtering failed:`, error);
      return [];
    }
  }

  private async mergeAndRankResults(
    resultSets: any[][],
    criteria: AdvancedSearchCriteria,
    includeRelevanceScoring: boolean
  ): Promise<any[]> {
    // Merge all results and remove duplicates
    const allResults = resultSets.flat();
    const uniqueResults = Array.from(
      new Map(allResults.map(node => [node.name, node])).values()
    );

    if (!includeRelevanceScoring) {
      return uniqueResults;
    }

    // Calculate relevance scores
    const rankedResults = uniqueResults.map(node => ({
      ...node,
      relevanceScore: this.calculateRelevanceScore(node, criteria)
    }));

    // Sort by relevance score
    return rankedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async applyAdvancedFilters(nodes: any[], criteria: AdvancedSearchCriteria): Promise<any[]> {
    let filteredNodes = nodes;

    // Apply performance requirements
    if (criteria.performanceRequirements?.minReliability) {
      filteredNodes = filteredNodes.filter(node => {
        const reliability = this.estimateNodeReliability(node);
        return reliability >= criteria.performanceRequirements!.minReliability!;
      });
    }

    // Apply compatibility requirements
    if (criteria.compatibilityRequirements?.inputTypes) {
      filteredNodes = filteredNodes.filter(node => {
        const nodeInputs = this.extractNodeInputTypes(node);
        return criteria.compatibilityRequirements!.inputTypes!.some(inputType =>
          nodeInputs.includes(inputType)
        );
      });
    }

    // Apply AI optimization requirements
    if (criteria.aiOptimization?.requireAiOptimized) {
      filteredNodes = filteredNodes.filter(node => this.isAiOptimized(node));
    }

    return filteredNodes;
  }

  private async enhanceWithAIOptimizations(
    nodes: any[],
    criteria: AdvancedSearchCriteria
  ): Promise<Array<{
    node: any;
    relevanceScore: number;
    matchingCriteria: string[];
    aiOptimizations?: any;
    compatibilityInfo?: any;
    usageRecommendations?: string[];
  }>> {
    const enhancedResults = [];

    for (const node of nodes) {
      const enhanced: any = {
        node,
        relevanceScore: node.relevanceScore || 0.5,
        matchingCriteria: this.identifyMatchingCriteria(node, criteria)
      };

      // Get AI optimizations if requested
      if (criteria.aiOptimization?.includeAiOptimized !== false) {
        try {
          const toolVariant = await dualNodeArchitecture.getToolVariant(node);
          if (toolVariant) {
            enhanced.aiOptimizations = {
              available: true,
              optimizedParameters: await dualNodeArchitecture.getAIOptimizedParameters(node.name),
              performanceProfile: toolVariant.performanceProfile,
              optimizationScore: toolVariant.aiOptimized ? 0.9 : 0.5
            };
          }
        } catch (error) {
          console.error(`[AdvancedNodeSearchHandler] AI optimization lookup failed for ${node.name}:`, error);
        }
      }

      // Add compatibility information
      enhanced.compatibilityInfo = {
        inputTypes: this.extractNodeInputTypes(node),
        outputTypes: this.extractNodeOutputTypes(node),
        chainCompatible: this.assessChainCompatibility(node),
        reliabilityScore: this.estimateNodeReliability(node)
      };

      // Generate usage recommendations
      enhanced.usageRecommendations = this.generateUsageRecommendations(node, criteria);

      enhancedResults.push(enhanced);
    }

    return enhancedResults;
  }

  private calculateRelevanceScore(node: any, criteria: AdvancedSearchCriteria): number {
    let score = 0.5; // Base score

    // Query matching
    const nodeText = `${node.displayName} ${node.description} ${node.category}`.toLowerCase();
    const queryWords = criteria.query.toLowerCase().split(' ');
    const queryMatches = queryWords.filter(word => nodeText.includes(word)).length;
    score += (queryMatches / queryWords.length) * 0.3;

    // Capability matching
    if (criteria.capabilities && criteria.capabilities.length > 0) {
      const nodeCapabilities = this.extractNodeCapabilities(node);
      const capabilityMatches = criteria.capabilities.filter(cap =>
        nodeCapabilities.some(nodeCap => 
          nodeCap.toLowerCase().includes(cap.toLowerCase())
        )
      ).length;
      score += (capabilityMatches / criteria.capabilities.length) * 0.2;
    }

    // Integration type matching
    if (criteria.integrationTypes && criteria.integrationTypes.length > 0) {
      const integrationMatches = criteria.integrationTypes.filter(type =>
        node.category.toLowerCase().includes(type.toLowerCase()) ||
        node.subcategory?.toLowerCase().includes(type.toLowerCase())
      ).length;
      score += (integrationMatches / criteria.integrationTypes.length) * 0.15;
    }

    // AI optimization bonus
    if (criteria.aiOptimization?.includeAiOptimized && this.isAiOptimized(node)) {
      score += 0.1;
    }

    // Context matching
    if (criteria.contextualFilters?.useCase) {
      const useCaseMatch = nodeText.includes(criteria.contextualFilters.useCase.toLowerCase());
      if (useCaseMatch) score += 0.1;
    }

    return Math.min(1.0, score);
  }

  private extractNodeCapabilities(node: any): string[] {
    const capabilities = [];
    
    if (node.webhookSupport) capabilities.push('webhook');
    if (node.triggerNode) capabilities.push('trigger');
    if (node.regularNode) capabilities.push('processing');
    if (node.codeable) capabilities.push('custom-code');
    if (node.subcategory) capabilities.push(node.subcategory.toLowerCase());
    
    // Extract from description
    const description = node.description.toLowerCase();
    if (description.includes('poll')) capabilities.push('polling');
    if (description.includes('schedule')) capabilities.push('scheduling');
    if (description.includes('transform')) capabilities.push('transformation');
    if (description.includes('validate')) capabilities.push('validation');
    if (description.includes('filter')) capabilities.push('filtering');
    
    return capabilities;
  }

  private extractNodeInputTypes(node: any): string[] {
    const inputTypes = ['json']; // Default
    
    if (node.inputs) {
      return node.inputs.map((input: any) => input.type || 'main');
    }
    
    return inputTypes;
  }

  private extractNodeOutputTypes(node: any): string[] {
    const outputTypes = ['json']; // Default
    
    if (node.outputs) {
      return node.outputs.map((output: any) => output.type || 'main');
    }
    
    return outputTypes;
  }

  private assessChainCompatibility(node: any): boolean {
    // Simple assessment - nodes with standard inputs/outputs are chain compatible
    return node.inputs && node.outputs && 
           node.inputs.length > 0 && node.outputs.length > 0;
  }

  private estimateNodeReliability(node: any): number {
    let reliability = 0.7; // Base reliability
    
    // Boost for well-established integrations
    if (node.category === 'Core Utilities') reliability += 0.2;
    if (node.triggerNode) reliability += 0.1;
    if (node.description.includes('enterprise')) reliability += 0.1;
    
    return Math.min(1.0, reliability);
  }

  private isAiOptimized(node: any): boolean {
    return node.subcategory?.includes('AI') || 
           node.category?.includes('AI') ||
           node.description.toLowerCase().includes('ai') ||
           node.description.toLowerCase().includes('artificial intelligence');
  }

  private identifyMatchingCriteria(node: any, criteria: AdvancedSearchCriteria): string[] {
    const matches = [];
    
    if (criteria.query && node.displayName.toLowerCase().includes(criteria.query.toLowerCase())) {
      matches.push('query-match');
    }
    
    if (criteria.capabilities && this.extractNodeCapabilities(node).some(cap => 
      criteria.capabilities!.includes(cap))) {
      matches.push('capability-match');
    }
    
    if (criteria.integrationTypes && criteria.integrationTypes.some(type =>
      node.category.toLowerCase().includes(type.toLowerCase()))) {
      matches.push('integration-type-match');
    }
    
    if (criteria.aiOptimization?.includeAiOptimized && this.isAiOptimized(node)) {
      matches.push('ai-optimization-match');
    }
    
    return matches;
  }

  private generateUsageRecommendations(node: any, criteria: AdvancedSearchCriteria): string[] {
    const recommendations = [];
    
    if (node.triggerNode) {
      recommendations.push('Ideal as workflow entry point');
    } else {
      recommendations.push('Best used in workflow processing chain');
    }
    
    if (this.isAiOptimized(node)) {
      recommendations.push('AI-optimized variant available for enhanced performance');
    }
    
    if (node.webhookSupport) {
      recommendations.push('Supports real-time webhook processing');
    }
    
    if (criteria.contextualFilters?.environment === 'production') {
      recommendations.push('Production-ready with enterprise support');
    }
    
    return recommendations;
  }

  private extractUsedCriteria(criteria: AdvancedSearchCriteria): string[] {
    const used = ['query'];
    
    if (criteria.capabilities?.length) used.push('capabilities');
    if (criteria.integrationTypes?.length) used.push('integration-types');
    if (criteria.performanceRequirements && Object.keys(criteria.performanceRequirements).length) {
      used.push('performance-requirements');
    }
    if (criteria.compatibilityRequirements && Object.keys(criteria.compatibilityRequirements).length) {
      used.push('compatibility-requirements');
    }
    if (criteria.aiOptimization && Object.keys(criteria.aiOptimization).length) {
      used.push('ai-optimization');
    }
    if (criteria.contextualFilters && Object.keys(criteria.contextualFilters).length) {
      used.push('contextual-filters');
    }
    
    return used;
  }

  private calculateSearchConfidence(results: any[], criteria: AdvancedSearchCriteria): number {
    if (results.length === 0) return 0.1;
    
    const avgRelevanceScore = results.reduce((sum, result) => sum + result.relevanceScore, 0) / results.length;
    const criteriaWeight = this.extractUsedCriteria(criteria).length * 0.1;
    
    return Math.min(1.0, avgRelevanceScore + criteriaWeight);
  }

  private async generateRelatedSearches(query: string, criteria: AdvancedSearchCriteria): Promise<string[]> {
    const relatedSearches = [];
    
    // Add capability-based suggestions
    if (criteria.capabilities?.length) {
      relatedSearches.push(`${query} with advanced capabilities`);
    }
    
    // Add integration-specific suggestions
    if (criteria.integrationTypes?.length) {
      for (const integrationType of criteria.integrationTypes.slice(0, 2)) {
        relatedSearches.push(`${integrationType} integration alternatives`);
      }
    }
    
    // Add AI-related suggestions
    if (criteria.aiOptimization?.includeAiOptimized) {
      relatedSearches.push(`AI-optimized ${query}`);
    }
    
    // Add generic suggestions
    relatedSearches.push(
      `${query} best practices`,
      `${query} performance optimization`,
      `${query} alternatives`
    );
    
    return relatedSearches.slice(0, 5);
  }

  private async generateAlternativeApproaches(criteria: AdvancedSearchCriteria): Promise<Array<{
    approach: string;
    description: string;
    benefits: string[];
  }>> {
    const alternatives = [];
    
    alternatives.push({
      approach: 'Simplified Search',
      description: 'Use basic keyword search with fewer filters',
      benefits: ['Broader results', 'Faster search', 'Less complex setup']
    });
    
    if (criteria.aiOptimization?.includeAiOptimized) {
      alternatives.push({
        approach: 'AI-First Approach',
        description: 'Focus exclusively on AI-optimized nodes',
        benefits: ['Enhanced performance', 'Better parameter suggestions', 'Future-proof']
      });
    }
    
    if (criteria.integrationTypes?.length) {
      alternatives.push({
        approach: 'Integration-Specific Search',
        description: 'Search within specific integration categories only',
        benefits: ['More focused results', 'Domain expertise', 'Better compatibility']
      });
    }
    
    alternatives.push({
      approach: 'Workflow Pattern Matching',
      description: 'Search based on common workflow patterns',
      benefits: ['Proven solutions', 'Best practices included', 'Easier implementation']
    });
    
    return alternatives.slice(0, 3);
  }
}

// Tool definitions
export function getAdvancedNodeSearchToolDefinition(): ToolDefinition {
  return {
    name: 'search_nodes_advanced',
    description: 'Perform advanced node search with multiple criteria including capabilities, integration types, performance requirements, and AI optimization filters',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Primary search query'
        },
        capabilities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific capabilities to search for (e.g., ["webhook", "polling", "transformation"])'
        },
        integrationTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Integration types to filter by (e.g., ["database", "communication", "ai"])'
        },
        performanceRequirements: {
          type: 'object',
          properties: {
            minReliability: {
              type: 'number',
              description: 'Minimum reliability score (0.0 to 1.0)'
            },
            maxExecutionTime: {
              type: 'number',
              description: 'Maximum acceptable execution time in milliseconds'
            },
            resourceEfficiency: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Required resource efficiency level'
            }
          }
        },
        compatibilityRequirements: {
          type: 'object',
          properties: {
            inputTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Required input data types'
            },
            outputTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Required output data types'
            },
            chainCompatible: {
              type: 'boolean',
              description: 'Must be compatible with workflow chaining'
            }
          }
        },
        aiOptimization: {
          type: 'object',
          properties: {
            includeAiOptimized: {
              type: 'boolean',
              description: 'Include AI-optimized variants in results'
            },
            requireAiOptimized: {
              type: 'boolean',
              description: 'Only return AI-optimized nodes'
            },
            aiCapabilities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific AI capabilities required'
            }
          }
        },
        contextualFilters: {
          type: 'object',
          properties: {
            useCase: {
              type: 'string',
              description: 'Specific use case context'
            },
            industry: {
              type: 'string',
              description: 'Industry or domain context'
            },
            complexity: {
              type: 'string',
              enum: ['simple', 'medium', 'complex'],
              description: 'Acceptable complexity level'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'Target environment'
            }
          }
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 20)',
          default: 20
        },
        includeRelevanceScoring: {
          type: 'boolean',
          description: 'Include relevance scoring and ranking (default: true)',
          default: true
        }
      },
      required: ['query']
    }
  };
}