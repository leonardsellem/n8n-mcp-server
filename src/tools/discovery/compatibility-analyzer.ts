/**
 * Node Compatibility Analyzer - Phase 3 Universal Node Discovery
 * 
 * This module provides intelligent compatibility analysis between multiple nodes
 * for workflow planning, leveraging the Phase 1 Enhanced Discovery system.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { universalNodeCatalog } from '../../discovery/live-node-catalog.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Compatibility analysis request interface
 */
export interface CompatibilityAnalysisRequest {
  sourceNode: string | any;
  targetNodes: string[] | any[];
  workflowContext?: {
    purpose?: string;
    dataFlow?: string;
    constraints?: string[];
  };
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
  includeAlternatives?: boolean;
  includeSolutions?: boolean;
}

/**
 * Compatibility analysis result interface
 */
export interface CompatibilityAnalysisResult {
  sourceNode: {
    name: string;
    type: string;
    outputs: any[];
    capabilities: string[];
  };
  compatibilityResults: Array<{
    targetNode: {
      name: string;
      type: string;
      inputs: any[];
      capabilities: string[];
    };
    compatibility: {
      score: number;
      level: 'excellent' | 'good' | 'fair' | 'poor' | 'incompatible';
      directConnection: boolean;
      dataFlowCompatible: boolean;
      parameterMappingRequired: boolean;
    };
    analysis: {
      strengths: string[];
      challenges: string[];
      recommendations: string[];
    };
    solutions?: {
      intermediateNodes?: string[];
      transformations?: string[];
      configurations?: any;
    };
    alternatives?: Array<{
      node: string;
      reason: string;
      benefit: string;
    }>;
  }>;
  overallAssessment: {
    bestMatches: string[];
    averageCompatibility: number;
    workflowViability: 'high' | 'medium' | 'low';
    recommendations: string[];
  };
  suggestedWorkflow?: {
    sequence: Array<{
      node: string;
      purpose: string;
      connections: string[];
    }>;
    reasoning: string;
  };
}

/**
 * Data flow compatibility interface
 */
export interface DataFlowCompatibility {
  compatible: boolean;
  mappingRequired: boolean;
  transformationNeeded: boolean;
  supportedFormats: string[];
  potentialIssues: string[];
  mappingSuggestions: Array<{
    sourceField: string;
    targetField: string;
    transformation?: string;
  }>;
}

/**
 * Node Compatibility Analyzer Handler
 */
export class NodeCompatibilityAnalyzer extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const {
        sourceNode,
        targetNodes,
        workflowContext = {},
        analysisDepth = 'detailed',
        includeAlternatives = true,
        includeSolutions = true
      } = args;

      if (!sourceNode) {
        throw new Error('Source node is required for compatibility analysis');
      }

      if (!targetNodes || !Array.isArray(targetNodes) || targetNodes.length === 0) {
        throw new Error('Target nodes array is required and must not be empty');
      }

      console.error(`[NodeCompatibilityAnalyzer] Analyzing compatibility: ${sourceNode} -> ${targetNodes.length} targets`);

      const request: CompatibilityAnalysisRequest = {
        sourceNode,
        targetNodes,
        workflowContext,
        analysisDepth,
        includeAlternatives,
        includeSolutions
      };

      // Resolve source node information
      const sourceNodeInfo = await this.resolveNodeInfo(sourceNode);
      if (!sourceNodeInfo) {
        throw new Error(`Source node not found: ${sourceNode}`);
      }

      // Analyze compatibility with each target node
      const compatibilityResults = await this.analyzeCompatibilityWithTargets(
        sourceNodeInfo,
        targetNodes,
        request
      );

      // Generate overall assessment
      const overallAssessment = this.generateOverallAssessment(
        sourceNodeInfo,
        compatibilityResults
      );

      // Generate suggested workflow if requested
      let suggestedWorkflow;
      if (analysisDepth === 'comprehensive') {
        suggestedWorkflow = await this.generateSuggestedWorkflow(
          sourceNodeInfo,
          compatibilityResults,
          workflowContext
        );
      }

      const result: CompatibilityAnalysisResult = {
        sourceNode: {
          name: sourceNodeInfo.name,
          type: sourceNodeInfo.name,
          outputs: sourceNodeInfo.outputs || [],
          capabilities: this.extractNodeCapabilities(sourceNodeInfo)
        },
        compatibilityResults,
        overallAssessment,
        suggestedWorkflow
      };

      return this.formatSuccess(
        result,
        `Compatibility analysis completed: ${compatibilityResults.length} nodes analyzed, average compatibility ${Math.round(overallAssessment.averageCompatibility * 100)}%`
      );
    }, args);
  }

  private async resolveNodeInfo(nodeIdentifier: string | any): Promise<any> {
    try {
      if (typeof nodeIdentifier === 'object') {
        return nodeIdentifier;
      }

      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      return allNodes.find(node => 
        node.name === nodeIdentifier || 
        node.displayName === nodeIdentifier
      );
    } catch (error) {
      console.error(`[NodeCompatibilityAnalyzer] Node resolution failed:`, error);
      return null;
    }
  }

  private async analyzeCompatibilityWithTargets(
    sourceNode: any,
    targetNodes: any[],
    request: CompatibilityAnalysisRequest
  ): Promise<any[]> {
    const results = [];

    for (const targetNodeId of targetNodes) {
      try {
        const targetNode = await this.resolveNodeInfo(targetNodeId);
        if (!targetNode) {
          console.error(`[NodeCompatibilityAnalyzer] Target node not found: ${targetNodeId}`);
          continue;
        }

        const compatibility = await this.analyzeNodePairCompatibility(
          sourceNode,
          targetNode,
          request
        );

        results.push(compatibility);
      } catch (error) {
        console.error(`[NodeCompatibilityAnalyzer] Compatibility analysis failed for ${targetNodeId}:`, error);
      }
    }

    return results;
  }

  private async analyzeNodePairCompatibility(
    sourceNode: any,
    targetNode: any,
    request: CompatibilityAnalysisRequest
  ): Promise<any> {
    // Analyze data flow compatibility
    const dataFlowCompatibility = await this.analyzeDataFlowCompatibility(
      sourceNode,
      targetNode
    );

    // Calculate compatibility score
    const compatibilityScore = this.calculateCompatibilityScore(
      sourceNode,
      targetNode,
      dataFlowCompatibility
    );

    // Determine compatibility level
    const compatibilityLevel = this.determineCompatibilityLevel(compatibilityScore);

    // Analyze strengths and challenges
    const analysis = await this.generateCompatibilityAnalysis(
      sourceNode,
      targetNode,
      dataFlowCompatibility,
      request.workflowContext
    );

    // Generate solutions if requested
    let solutions;
    if (request.includeSolutions && compatibilityScore < 0.8) {
      solutions = await this.generateCompatibilitySolutions(
        sourceNode,
        targetNode,
        dataFlowCompatibility
      );
    }

    // Find alternatives if requested
    let alternatives;
    if (request.includeAlternatives && compatibilityScore < 0.7) {
      alternatives = await this.findAlternativeNodes(targetNode, sourceNode);
    }

    return {
      targetNode: {
        name: targetNode.name,
        type: targetNode.name,
        inputs: targetNode.inputs || [],
        capabilities: this.extractNodeCapabilities(targetNode)
      },
      compatibility: {
        score: compatibilityScore,
        level: compatibilityLevel,
        directConnection: dataFlowCompatibility.compatible,
        dataFlowCompatible: dataFlowCompatibility.compatible,
        parameterMappingRequired: dataFlowCompatibility.mappingRequired
      },
      analysis,
      solutions,
      alternatives
    };
  }

  private async analyzeDataFlowCompatibility(
    sourceNode: any,
    targetNode: any
  ): Promise<DataFlowCompatibility> {
    try {
      // Use Dual Architecture for parameter mapping analysis
      const parameterMapping = await dualNodeArchitecture.suggestParameterValues(
        targetNode.name,
        { sourceNode: sourceNode.name }
      );

      const sourceOutputs = sourceNode.outputs || [{ type: 'main' }];
      const targetInputs = targetNode.inputs || [{ type: 'main' }];

      // Check basic type compatibility
      const compatible = sourceOutputs.some((output: any) =>
        targetInputs.some((input: any) =>
          this.areTypesCompatible(output.type || 'main', input.type || 'main')
        )
      );

      // Determine if parameter mapping is required
      const mappingRequired = parameterMapping && parameterMapping.length > 0;

      // Check for transformation needs
      const transformationNeeded = this.requiresDataTransformation(sourceNode, targetNode);

      // Get supported formats
      const supportedFormats = this.getSupportedDataFormats(sourceNode, targetNode);

      // Identify potential issues
      const potentialIssues = this.identifyPotentialIssues(sourceNode, targetNode);

      // Generate mapping suggestions
      const mappingSuggestions = this.generateMappingSuggestions(sourceNode, targetNode);

      return {
        compatible,
        mappingRequired,
        transformationNeeded,
        supportedFormats,
        potentialIssues,
        mappingSuggestions
      };
    } catch (error) {
      console.error(`[NodeCompatibilityAnalyzer] Data flow analysis failed:`, error);
      return {
        compatible: false,
        mappingRequired: true,
        transformationNeeded: true,
        supportedFormats: ['json'],
        potentialIssues: ['Analysis failed'],
        mappingSuggestions: []
      };
    }
  }

  private calculateCompatibilityScore(
    sourceNode: any,
    targetNode: any,
    dataFlowCompatibility: DataFlowCompatibility
  ): number {
    let score = 0.0;

    // Base compatibility from data flow analysis
    if (dataFlowCompatibility.compatible) {
      score += 0.4;
    } else if (dataFlowCompatibility.transformationNeeded) {
      score += 0.2; // Possible with transformation
    }

    // Category compatibility
    if (this.areCategoriesCompatible(sourceNode.category, targetNode.category)) {
      score += 0.2;
    }

    // Capability overlap
    const sourceCapabilities = this.extractNodeCapabilities(sourceNode);
    const targetCapabilities = this.extractNodeCapabilities(targetNode);
    const capabilityOverlap = this.calculateCapabilityOverlap(sourceCapabilities, targetCapabilities);
    score += capabilityOverlap * 0.2;

    // Penalize for complex mapping requirements
    if (dataFlowCompatibility.mappingRequired) {
      score -= 0.1;
    }

    // Bonus for common workflow patterns
    if (this.isCommonWorkflowPattern(sourceNode, targetNode)) {
      score += 0.2;
    }

    return Math.max(0.0, Math.min(1.0, score));
  }

  private determineCompatibilityLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'incompatible' {
    if (score >= 0.9) return 'excellent';
    if (score >= 0.7) return 'good';
    if (score >= 0.5) return 'fair';
    if (score >= 0.3) return 'poor';
    return 'incompatible';
  }

  private async generateCompatibilityAnalysis(
    sourceNode: any,
    targetNode: any,
    dataFlowCompatibility: DataFlowCompatibility,
    workflowContext?: any
  ): Promise<{ strengths: string[]; challenges: string[]; recommendations: string[] }> {
    const strengths = [];
    const challenges = [];
    const recommendations = [];

    // Analyze strengths
    if (dataFlowCompatibility.compatible) {
      strengths.push('Direct data flow compatibility');
    }

    if (this.areCategoriesCompatible(sourceNode.category, targetNode.category)) {
      strengths.push('Complementary node categories');
    }

    if (this.isCommonWorkflowPattern(sourceNode, targetNode)) {
      strengths.push('Common workflow pattern - proven compatibility');
    }

    // Analyze challenges
    if (dataFlowCompatibility.mappingRequired) {
      challenges.push('Parameter mapping required for optimal data flow');
    }

    if (dataFlowCompatibility.transformationNeeded) {
      challenges.push('Data transformation may be needed');
    }

    if (dataFlowCompatibility.potentialIssues.length > 0) {
      challenges.push(...dataFlowCompatibility.potentialIssues);
    }

    // Generate recommendations
    if (dataFlowCompatibility.mappingRequired) {
      recommendations.push('Use Function node to transform data between nodes');
    }

    if (!dataFlowCompatibility.compatible) {
      recommendations.push('Consider adding intermediate processing node');
    }

    if (workflowContext?.purpose) {
      recommendations.push(`Optimize configuration for ${workflowContext.purpose} use case`);
    }

    // Add AI optimization recommendations
    try {
      const aiOptimizations = await dualNodeArchitecture.getAIOptimizedParameters(targetNode.name);
      if (aiOptimizations.length > 0) {
        recommendations.push('AI-optimized parameters available for enhanced performance');
      }
    } catch (error) {
      // Silent fail for AI optimization lookup
    }

    return { strengths, challenges, recommendations };
  }

  private async generateCompatibilitySolutions(
    sourceNode: any,
    targetNode: any,
    dataFlowCompatibility: DataFlowCompatibility
  ): Promise<any> {
    const solutions: any = {};

    // Suggest intermediate nodes if needed
    if (!dataFlowCompatibility.compatible) {
      const intermediateNodes = await this.suggestIntermediateNodes(sourceNode, targetNode);
      if (intermediateNodes.length > 0) {
        solutions.intermediateNodes = intermediateNodes;
      }
    }

    // Suggest data transformations
    if (dataFlowCompatibility.transformationNeeded) {
      solutions.transformations = this.suggestDataTransformations(sourceNode, targetNode);
    }

    // Suggest configuration optimizations
    if (dataFlowCompatibility.mappingRequired) {
      solutions.configurations = {
        sourceNodeConfig: this.suggestSourceNodeConfig(sourceNode, targetNode),
        targetNodeConfig: this.suggestTargetNodeConfig(sourceNode, targetNode),
        mappingCode: this.generateMappingCode(dataFlowCompatibility.mappingSuggestions)
      };
    }

    return Object.keys(solutions).length > 0 ? solutions : undefined;
  }

  private async findAlternativeNodes(targetNode: any, sourceNode: any): Promise<any[]> {
    try {
      // Use Dynamic Discovery to find alternatives
      const alternatives = await dynamicNodeDiscovery.findAlternativeNodes(targetNode, {
        exclude_categories: [],
        require_features: this.extractNodeCapabilities(sourceNode),
        performance_requirements: []
      });

      return alternatives.slice(0, 3).map(alt => ({
        node: alt.alternative.name,
        reason: alt.reason,
        benefit: alt.benefits.join(', ')
      }));
    } catch (error) {
      console.error(`[NodeCompatibilityAnalyzer] Alternative node search failed:`, error);
      return [];
    }
  }

  private generateOverallAssessment(sourceNode: any, compatibilityResults: any[]): any {
    const scores = compatibilityResults.map(result => result.compatibility.score);
    const averageCompatibility = scores.length > 0 ? 
      scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;

    const bestMatches = compatibilityResults
      .filter(result => result.compatibility.score >= 0.7)
      .sort((a, b) => b.compatibility.score - a.compatibility.score)
      .slice(0, 3)
      .map(result => result.targetNode.name);

    const workflowViability = averageCompatibility >= 0.7 ? 'high' : 
                             averageCompatibility >= 0.4 ? 'medium' : 'low';

    const recommendations = this.generateOverallRecommendations(
      sourceNode,
      compatibilityResults,
      averageCompatibility
    );

    return {
      bestMatches,
      averageCompatibility,
      workflowViability,
      recommendations
    };
  }

  private async generateSuggestedWorkflow(
    sourceNode: any,
    compatibilityResults: any[],
    workflowContext?: any
  ): Promise<any> {
    try {
      // Use the best compatible nodes to suggest a workflow sequence
      const bestNodes = compatibilityResults
        .filter(result => result.compatibility.score >= 0.5)
        .sort((a, b) => b.compatibility.score - a.compatibility.score);

      const sequence = [
        {
          node: sourceNode.name,
          purpose: 'Data source/trigger',
          connections: bestNodes.slice(0, 2).map(node => node.targetNode.name)
        }
      ];

      // Add best target nodes
      for (const result of bestNodes.slice(0, 3)) {
        sequence.push({
          node: result.targetNode.name,
          purpose: this.determinePurpose(result.targetNode),
          connections: []
        });
      }

      const reasoning = `Suggested workflow based on compatibility analysis. ` +
        `${bestNodes.length} compatible nodes found with average compatibility of ` +
        `${Math.round((bestNodes.reduce((sum, node) => sum + node.compatibility.score, 0) / bestNodes.length) * 100)}%.`;

      return { sequence, reasoning };
    } catch (error) {
      console.error(`[NodeCompatibilityAnalyzer] Workflow suggestion failed:`, error);
      return undefined;
    }
  }

  // Helper methods
  private extractNodeCapabilities(node: any): string[] {
    const capabilities = [];
    
    if (node.webhookSupport) capabilities.push('webhook');
    if (node.triggerNode) capabilities.push('trigger');
    if (node.regularNode) capabilities.push('processing');
    if (node.codeable) capabilities.push('custom-code');
    if (node.subcategory) capabilities.push(node.subcategory.toLowerCase());
    
    return capabilities;
  }

  private areTypesCompatible(sourceType: string, targetType: string): boolean {
    // Simple type compatibility check
    if (sourceType === targetType) return true;
    if (sourceType === 'main' || targetType === 'main') return true;
    return false;
  }

  private areCategoriesCompatible(sourceCategory: string, targetCategory: string): boolean {
    // Categories that work well together
    const compatibleCategories: { [key: string]: string[] } = {
      'Trigger Nodes': ['Core Utilities', 'Communication', 'Data'],
      'Communication': ['Core Utilities', 'Data', 'Business'],
      'Data': ['Communication', 'Business', 'AI'],
      'AI': ['Data', 'Core Utilities', 'Communication']
    };

    return compatibleCategories[sourceCategory]?.includes(targetCategory) || false;
  }

  private calculateCapabilityOverlap(source: string[], target: string[]): number {
    const overlap = source.filter(cap => target.includes(cap));
    const total = new Set([...source, ...target]).size;
    return total > 0 ? overlap.length / total : 0;
  }

  private isCommonWorkflowPattern(sourceNode: any, targetNode: any): boolean {
    // Common patterns like webhook -> http request, trigger -> processing, etc.
    const patterns = [
      { source: 'webhook', target: 'function' },
      { source: 'webhook', target: 'httpRequest' },
      { source: 'schedule', target: 'email' },
      { source: 'trigger', target: 'processing' }
    ];

    return patterns.some(pattern => 
      sourceNode.name.includes(pattern.source) && targetNode.name.includes(pattern.target)
    );
  }

  private requiresDataTransformation(sourceNode: any, targetNode: any): boolean {
    // Simple heuristic - if categories are very different, transformation may be needed
    const categoriesRequiringTransformation = ['AI', 'Data Transformation'];
    return categoriesRequiringTransformation.includes(targetNode.category);
  }

  private getSupportedDataFormats(sourceNode: any, targetNode: any): string[] {
    // Most n8n nodes support JSON, some support XML, CSV, etc.
    return ['json', 'text', 'binary'];
  }

  private identifyPotentialIssues(sourceNode: any, targetNode: any): string[] {
    const issues = [];
    
    if (sourceNode.triggerNode && targetNode.triggerNode) {
      issues.push('Both nodes are triggers - only one trigger allowed per workflow');
    }
    
    if (!sourceNode.outputs || sourceNode.outputs.length === 0) {
      issues.push('Source node may not produce output data');
    }
    
    return issues;
  }

  private generateMappingSuggestions(sourceNode: any, targetNode: any): any[] {
    // Basic mapping suggestions
    return [
      { sourceField: 'id', targetField: 'identifier', transformation: 'string conversion' },
      { sourceField: 'data', targetField: 'payload', transformation: 'direct mapping' }
    ];
  }

  private async suggestIntermediateNodes(sourceNode: any, targetNode: any): Promise<string[]> {
    // Common intermediate nodes for data processing
    return ['n8n-nodes-base.function', 'n8n-nodes-base.set', 'n8n-nodes-base.merge'];
  }

  private suggestDataTransformations(sourceNode: any, targetNode: any): string[] {
    return [
      'Convert data format using Function node',
      'Apply data filtering and validation',
      'Normalize field names and structures'
    ];
  }

  private suggestSourceNodeConfig(sourceNode: any, targetNode: any): any {
    return {
      outputFormat: 'json',
      includeMetadata: true
    };
  }

  private suggestTargetNodeConfig(sourceNode: any, targetNode: any): any {
    return {
      inputValidation: true,
      errorHandling: 'continue'
    };
  }

  private generateMappingCode(mappingSuggestions: any[]): string {
    return `
// Data mapping function
return mappingSuggestions.map(item => ({
  // Transform data based on mapping suggestions
  [item.targetField]: $json[item.sourceField]
}));
    `;
  }

  private generateOverallRecommendations(
    sourceNode: any,
    compatibilityResults: any[],
    averageCompatibility: number
  ): string[] {
    const recommendations = [];
    
    if (averageCompatibility >= 0.7) {
      recommendations.push('High compatibility - workflow should execute smoothly');
    } else if (averageCompatibility >= 0.4) {
      recommendations.push('Medium compatibility - consider intermediate processing nodes');
    } else {
      recommendations.push('Low compatibility - significant configuration required');
    }
    
    const excellentMatches = compatibilityResults.filter(r => r.compatibility.score >= 0.9);
    if (excellentMatches.length > 0) {
      recommendations.push(`${excellentMatches.length} excellent compatibility matches found`);
    }
    
    return recommendations;
  }

  private determinePurpose(node: any): string {
    if (node.name.includes('http')) return 'HTTP request/API call';
    if (node.name.includes('email')) return 'Email communication';
    if (node.name.includes('function')) return 'Data processing';
    if (node.name.includes('database')) return 'Data storage/retrieval';
    return 'Data processing';
  }
}

// Tool definitions
export function getAnalyzeNodeCompatibilityToolDefinition(): ToolDefinition {
  return {
    name: 'analyze_node_compatibility',
    description: 'Analyze compatibility between a source node and multiple target nodes for workflow planning',
    inputSchema: {
      type: 'object',
      properties: {
        sourceNode: {
          type: 'string',
          description: 'Source node name or type to analyze compatibility from'
        },
        targetNodes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of target node names to analyze compatibility with'
        },
        workflowContext: {
          type: 'object',
          properties: {
            purpose: {
              type: 'string',
              description: 'Purpose or goal of the workflow'
            },
            dataFlow: {
              type: 'string',
              description: 'Expected data flow pattern'
            },
            constraints: {
              type: 'array',
              items: { type: 'string' },
              description: 'Any constraints or requirements'
            }
          },
          description: 'Workflow context for enhanced analysis'
        },
        analysisDepth: {
          type: 'string',
          enum: ['basic', 'detailed', 'comprehensive'],
          description: 'Depth of compatibility analysis to perform',
          default: 'detailed'
        },
        includeAlternatives: {
          type: 'boolean',
          description: 'Include alternative node suggestions for poor compatibility matches',
          default: true
        },
        includeSolutions: {
          type: 'boolean',
          description: 'Include solutions for compatibility issues',
          default: true
        }
      },
      required: ['sourceNode', 'targetNodes']
    }
  };
}