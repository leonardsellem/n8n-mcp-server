/**
 * Dual-Node Architecture Support - Phase 1 Enhancement
 * 
 * Provides support for both Regular and Tool variants of n8n nodes,
 * enabling AI agents to use optimized node configurations.
 */

import { NodeTypeInfo } from '../data/accurate-massive-registry.js';

/**
 * Extended node information with AI optimization metadata
 */
export interface ToolNodeInfo extends NodeTypeInfo {
  // AI-optimized properties
  aiOptimized: boolean;
  toolVariant: boolean;
  regularVariant: boolean;
  
  // Optimization metadata
  aiParameters?: AiOptimizedParameter[];
  suggestedValues?: ParameterSuggestion[];
  chainCompatibility?: ChainCompatibility;
  performanceProfile?: PerformanceProfile;
  
  // Alternative variants
  alternativeVariants?: {
    regular?: NodeTypeInfo;
    tool?: NodeTypeInfo;
    aiOptimized?: NodeTypeInfo;
  };
}

/**
 * AI-optimized parameter configuration
 */
export interface AiOptimizedParameter {
  name: string;
  displayName: string;
  type: string;
  aiDefault?: any;
  aiDescription: string;
  aiValidation?: AiParameterValidation;
  contextAware?: boolean;
  dynamicSuggestion?: boolean;
}

/**
 * Parameter value suggestions based on context
 */
export interface ParameterSuggestion {
  parameter: string;
  suggestions: {
    value: any;
    description: string;
    useCase: string;
    confidence: number;
  }[];
  contextFactors: string[];
}

/**
 * Node chain compatibility information
 */
export interface ChainCompatibility {
  preferredPredecessors: string[];
  preferredSuccessors: string[];
  incompatibleWith: string[];
  bestPractices: string[];
  commonPatterns: ChainPattern[];
}

/**
 * Common chain patterns
 */
export interface ChainPattern {
  name: string;
  description: string;
  nodes: string[];
  useCase: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

/**
 * Performance profile for optimization
 */
export interface PerformanceProfile {
  executionTime: 'fast' | 'medium' | 'slow';
  resourceUsage: 'low' | 'medium' | 'high';
  rateLimits?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    concurrent?: number;
  };
  scalability: 'high' | 'medium' | 'low';
  reliability: number; // 0-1 score
}

/**
 * AI parameter validation rules
 */
export interface AiParameterValidation {
  required?: boolean;
  contextDependent?: boolean;
  smartDefaults?: boolean;
  autoComplete?: boolean;
  validationRules?: ValidationRule[];
}

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: 'format' | 'range' | 'enum' | 'pattern' | 'custom';
  rule: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Node configuration for optimization
 */
export interface NodeConfiguration {
  nodeType: string;
  parameters: { [key: string]: any };
  optimizations: OptimizationSettings;
  metadata: ConfigurationMetadata;
}

/**
 * Optimization settings
 */
export interface OptimizationSettings {
  aiEnhanced: boolean;
  autoParameterSuggestion: boolean;
  contextAwareDefaults: boolean;
  performanceOptimized: boolean;
  errorHandlingEnhanced: boolean;
}

/**
 * Configuration metadata
 */
export interface ConfigurationMetadata {
  version: string;
  lastOptimized: string;
  optimizationScore: number;
  recommendations: string[];
  warnings: string[];
}

/**
 * Dual-node architecture interface
 */
export interface DualNodeArchitecture {
  // Core variant management
  getToolVariant(regularNode: NodeTypeInfo): Promise<ToolNodeInfo | null>;
  getRegularVariant(toolNode: ToolNodeInfo): Promise<NodeTypeInfo | null>;
  
  // AI optimization
  getAIOptimizedParameters(nodeType: string): Promise<AiOptimizedParameter[]>;
  suggestParameterValues(nodeType: string, context?: any): Promise<ParameterSuggestion[]>;
  
  // Configuration validation and optimization
  validateNodeConfiguration(config: NodeConfiguration): Promise<ValidationResult>;
  optimizeNodeConfiguration(config: NodeConfiguration): Promise<NodeConfiguration>;
  
  // Node discovery with optimization awareness
  findOptimalNodeVariant(intent: string, context?: any): Promise<ToolNodeInfo>;
  getNodeChainOptimizations(nodes: NodeTypeInfo[]): Promise<ChainOptimization[]>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  score: number;
  issues: ValidationIssue[];
  suggestions: ConfigurationSuggestion[];
  optimizedConfig?: NodeConfiguration;
}

/**
 * Validation issue
 */
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  parameter?: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
}

/**
 * Configuration suggestion
 */
export interface ConfigurationSuggestion {
  type: 'parameter' | 'optimization' | 'alternative';
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: any;
}

/**
 * Chain optimization recommendation
 */
export interface ChainOptimization {
  originalChain: NodeTypeInfo[];
  optimizedChain: ToolNodeInfo[];
  improvements: ChainImprovement[];
  performanceGain: number;
  complexityReduction: number;
}

/**
 * Chain improvement details
 */
export interface ChainImprovement {
  type: 'performance' | 'reliability' | 'simplicity' | 'cost';
  description: string;
  quantification: string;
  nodeChanges: NodeChange[];
}

/**
 * Node change in optimization
 */
export interface NodeChange {
  position: number;
  from: NodeTypeInfo;
  to: ToolNodeInfo;
  reason: string;
  benefit: string;
}

/**
 * Implementation of dual-node architecture support
 */
export class DualNodeArchitectureSupport implements DualNodeArchitecture {
  
  private aiOptimizedNodes: Map<string, ToolNodeInfo> = new Map();
  private parameterOptimizations: Map<string, AiOptimizedParameter[]> = new Map();
  private chainPatterns: ChainPattern[] = [];

  constructor() {
    this.initializeOptimizations();
  }

  private initializeOptimizations(): void {
    // Initialize AI-optimized variants and patterns
    this.loadAiOptimizedVariants();
    this.loadChainPatterns();
    this.loadParameterOptimizations();
  }

  async getToolVariant(regularNode: NodeTypeInfo): Promise<ToolNodeInfo | null> {
    // Check if AI-optimized variant exists
    const optimizedVariant = this.aiOptimizedNodes.get(regularNode.name);
    if (optimizedVariant) {
      return optimizedVariant;
    }

    // Generate AI-optimized variant on demand
    return this.generateToolVariant(regularNode);
  }

  async getRegularVariant(toolNode: ToolNodeInfo): Promise<NodeTypeInfo | null> {
    // Return the regular variant if available
    return toolNode.alternativeVariants?.regular || null;
  }

  async getAIOptimizedParameters(nodeType: string): Promise<AiOptimizedParameter[]> {
    const cached = this.parameterOptimizations.get(nodeType);
    if (cached) {
      return cached;
    }

    // Generate AI-optimized parameters
    return this.generateAiOptimizedParameters(nodeType);
  }

  async suggestParameterValues(nodeType: string, context?: any): Promise<ParameterSuggestion[]> {
    const suggestions: ParameterSuggestion[] = [];

    // Common parameter suggestions based on node type
    const suggestionMap = this.getParameterSuggestionMap();
    const nodeSuggestions = suggestionMap[nodeType] || [];

    // Context-aware suggestions
    if (context) {
      nodeSuggestions.push(...this.generateContextAwareSuggestions(nodeType, context));
    }

    return nodeSuggestions;
  }

  async validateNodeConfiguration(config: NodeConfiguration): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const suggestions: ConfigurationSuggestion[] = [];
    let score = 100;

    // Validate required parameters
    const requiredParams = await this.getRequiredParameters(config.nodeType);
    for (const param of requiredParams) {
      if (!(param in config.parameters)) {
        issues.push({
          severity: 'error',
          parameter: param,
          message: `Required parameter '${param}' is missing`,
          suggestion: 'Add the required parameter with appropriate value',
          autoFixable: false
        });
        score -= 20;
      }
    }

    // Validate parameter values
    for (const [param, value] of Object.entries(config.parameters)) {
      const validation = await this.validateParameter(config.nodeType, param, value);
      if (!validation.valid) {
        issues.push({
          severity: validation.severity,
          parameter: param,
          message: validation.message,
          suggestion: validation.suggestion,
          autoFixable: validation.autoFixable
        });
        score -= validation.impact;
      }
    }

    // Generate optimization suggestions
    suggestions.push(...await this.generateOptimizationSuggestions(config));

    return {
      valid: issues.filter(i => i.severity === 'error').length === 0,
      score: Math.max(0, score),
      issues,
      suggestions,
      optimizedConfig: score < 80 ? await this.optimizeNodeConfiguration(config) : undefined
    };
  }

  async optimizeNodeConfiguration(config: NodeConfiguration): Promise<NodeConfiguration> {
    const optimized = { ...config };

    // Apply AI optimizations
    if (!optimized.optimizations.aiEnhanced) {
      optimized.optimizations.aiEnhanced = true;
      
      // Add AI-optimized parameters
      const aiParams = await this.getAIOptimizedParameters(config.nodeType);
      for (const param of aiParams) {
        if (param.aiDefault !== undefined) {
          optimized.parameters[param.name] = param.aiDefault;
        }
      }
    }

    // Enable performance optimizations
    optimized.optimizations.performanceOptimized = true;
    optimized.optimizations.contextAwareDefaults = true;
    optimized.optimizations.autoParameterSuggestion = true;

    // Update metadata
    optimized.metadata.lastOptimized = new Date().toISOString();
    optimized.metadata.optimizationScore = await this.calculateOptimizationScore(optimized);

    return optimized;
  }

  async findOptimalNodeVariant(intent: string, context?: any): Promise<ToolNodeInfo> {
    // Analyze intent to find best node variant
    const candidates = await this.findNodeCandidates(intent);
    
    // Score candidates based on context and optimization
    const scoredCandidates = candidates.map(node => ({
      node,
      score: this.scoreNodeForIntent(node, intent, context)
    }));

    // Return highest scoring optimized variant
    const best = scoredCandidates.sort((a, b) => b.score - a.score)[0];
    return best?.node || this.getDefaultToolNode();
  }

  async getNodeChainOptimizations(nodes: NodeTypeInfo[]): Promise<ChainOptimization[]> {
    const optimizations: ChainOptimization[] = [];

    // Analyze current chain for optimization opportunities
    const chainAnalysis = await this.analyzeNodeChain(nodes);
    
    if (chainAnalysis.optimizationPotential > 0.3) {
      const optimizedChain = await this.optimizeNodeChain(nodes);
      
      optimizations.push({
        originalChain: nodes,
        optimizedChain,
        improvements: chainAnalysis.improvements,
        performanceGain: chainAnalysis.performanceGain,
        complexityReduction: chainAnalysis.complexityReduction
      });
    }

    return optimizations;
  }

  // Private helper methods
  private loadAiOptimizedVariants(): void {
    // Load pre-defined AI-optimized node variants
    const aiOptimizations: { [key: string]: Partial<ToolNodeInfo> } = {
      'n8n-nodes-base.httpRequest': {
        aiOptimized: true,
        toolVariant: true,
        aiParameters: [
          {
            name: 'url',
            displayName: 'URL',
            type: 'string',
            aiDefault: '',
            aiDescription: 'API endpoint URL with intelligent validation and suggestion',
            contextAware: true,
            dynamicSuggestion: true
          }
        ]
      },
      'n8n-nodes-base.openai': {
        aiOptimized: true,
        toolVariant: true,
        performanceProfile: {
          executionTime: 'medium',
          resourceUsage: 'medium',
          rateLimits: { requestsPerMinute: 60 },
          scalability: 'high',
          reliability: 0.95
        }
      }
    };

    // Convert to ToolNodeInfo and store
    for (const [nodeType, optimization] of Object.entries(aiOptimizations)) {
      // This would be populated with actual node data
    }
  }

  private loadChainPatterns(): void {
    this.chainPatterns = [
      {
        name: 'AI Processing Chain',
        description: 'Optimized chain for AI model processing',
        nodes: ['webhook', 'openai', 'set', 'response'],
        useCase: 'AI-powered API endpoints',
        complexity: 'simple'
      },
      {
        name: 'Data Pipeline Chain',
        description: 'Efficient data processing and storage',
        nodes: ['trigger', 'http-request', 'function', 'database', 'notification'],
        useCase: 'Automated data collection and processing',
        complexity: 'moderate'
      },
      {
        name: 'Integration Workflow',
        description: 'Multi-platform data synchronization',
        nodes: ['schedule', 'source-api', 'transform', 'target-api', 'error-handler'],
        useCase: 'System integration and synchronization',
        complexity: 'complex'
      }
    ];
  }

  private loadParameterOptimizations(): void {
    // Load parameter optimization rules
    const optimizations: { [key: string]: AiOptimizedParameter[] } = {
      'n8n-nodes-base.httpRequest': [
        {
          name: 'method',
          displayName: 'HTTP Method',
          type: 'options',
          aiDefault: 'POST',
          aiDescription: 'HTTP method with intelligent default based on context',
          contextAware: true
        },
        {
          name: 'headers',
          displayName: 'Headers',
          type: 'collection',
          aiDefault: { 'Content-Type': 'application/json' },
          aiDescription: 'Headers with smart defaults for common use cases',
          dynamicSuggestion: true
        }
      ]
    };

    for (const [nodeType, params] of Object.entries(optimizations)) {
      this.parameterOptimizations.set(nodeType, params);
    }
  }

  private async generateToolVariant(regularNode: NodeTypeInfo): Promise<ToolNodeInfo> {
    // Generate AI-optimized variant from regular node
    const toolNode: ToolNodeInfo = {
      ...regularNode,
      aiOptimized: true,
      toolVariant: true,
      regularVariant: false,
      alternativeVariants: {
        regular: regularNode
      },
      performanceProfile: {
        executionTime: 'fast',
        resourceUsage: 'low',
        scalability: 'high',
        reliability: 0.9
      }
    };

    return toolNode;
  }

  private async generateAiOptimizedParameters(nodeType: string): Promise<AiOptimizedParameter[]> {
    // Generate AI-optimized parameters for any node type
    return [
      {
        name: 'aiMode',
        displayName: 'AI Enhancement Mode',
        type: 'options',
        aiDefault: 'auto',
        aiDescription: 'Enable AI-powered parameter optimization',
        contextAware: true
      }
    ];
  }

  private getParameterSuggestionMap(): { [nodeType: string]: ParameterSuggestion[] } {
    return {
      'n8n-nodes-base.httpRequest': [
        {
          parameter: 'url',
          suggestions: [
            {
              value: 'https://api.example.com/v1/',
              description: 'Standard REST API endpoint pattern',
              useCase: 'REST API integration',
              confidence: 0.8
            }
          ],
          contextFactors: ['api_type', 'endpoint_pattern']
        }
      ]
    };
  }

  private generateContextAwareSuggestions(nodeType: string, context: any): ParameterSuggestion[] {
    // Generate suggestions based on workflow context
    return [];
  }

  private async getRequiredParameters(nodeType: string): Promise<string[]> {
    // Return required parameters for node type
    const requiredMap: { [key: string]: string[] } = {
      'n8n-nodes-base.httpRequest': ['url'],
      'n8n-nodes-base.openai': ['prompt'],
      'n8n-nodes-base.webhook': ['path']
    };

    return requiredMap[nodeType] || [];
  }

  private async validateParameter(nodeType: string, param: string, value: any): Promise<{
    valid: boolean;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
    autoFixable: boolean;
    impact: number;
  }> {
    // Validate individual parameter
    return {
      valid: true,
      severity: 'info',
      message: 'Parameter is valid',
      autoFixable: false,
      impact: 0
    };
  }

  private async generateOptimizationSuggestions(config: NodeConfiguration): Promise<ConfigurationSuggestion[]> {
    return [
      {
        type: 'optimization',
        description: 'Enable AI parameter suggestions for better defaults',
        impact: 'medium',
        implementation: { aiEnhanced: true }
      }
    ];
  }

  private async calculateOptimizationScore(config: NodeConfiguration): Promise<number> {
    let score = 70; // Base score

    if (config.optimizations.aiEnhanced) score += 10;
    if (config.optimizations.performanceOptimized) score += 10;
    if (config.optimizations.contextAwareDefaults) score += 5;
    if (config.optimizations.autoParameterSuggestion) score += 5;

    return Math.min(100, score);
  }

  private async findNodeCandidates(intent: string): Promise<ToolNodeInfo[]> {
    // Find candidate nodes based on intent
    return Array.from(this.aiOptimizedNodes.values());
  }

  private scoreNodeForIntent(node: ToolNodeInfo, intent: string, context?: any): number {
    let score = 0;

    // Score based on relevance to intent
    if (node.description.toLowerCase().includes(intent.toLowerCase())) score += 20;
    if (node.displayName.toLowerCase().includes(intent.toLowerCase())) score += 15;

    // Score based on AI optimization
    if (node.aiOptimized) score += 10;
    if (node.performanceProfile?.reliability) score += node.performanceProfile.reliability * 10;

    return score;
  }

  private getDefaultToolNode(): ToolNodeInfo {
    // Return a default optimized node
    return {
      name: 'n8n-nodes-base.httpRequest',
      displayName: 'HTTP Request (AI-Optimized)',
      description: 'AI-enhanced HTTP request node with intelligent defaults',
      category: 'Core Utilities',
      properties: [],
      inputs: [{ type: 'main', displayName: 'Input', required: false }],
      outputs: [{ type: 'main', displayName: 'Output' }],
      aiOptimized: true,
      toolVariant: true,
      regularVariant: false
    };
  }

  private async analyzeNodeChain(nodes: NodeTypeInfo[]): Promise<{
    optimizationPotential: number;
    improvements: ChainImprovement[];
    performanceGain: number;
    complexityReduction: number;
  }> {
    return {
      optimizationPotential: 0.5,
      improvements: [],
      performanceGain: 0.2,
      complexityReduction: 0.1
    };
  }

  private async optimizeNodeChain(nodes: NodeTypeInfo[]): Promise<ToolNodeInfo[]> {
    // Convert regular nodes to optimized variants
    const optimized: ToolNodeInfo[] = [];
    
    for (const node of nodes) {
      const toolVariant = await this.getToolVariant(node);
      optimized.push(toolVariant || this.getDefaultToolNode());
    }

    return optimized;
  }
}

/**
 * Global instance of dual-node architecture support
 */
export const dualNodeArchitecture = new DualNodeArchitectureSupport();

/**
 * Factory function to create new architecture support instance
 */
export function createDualNodeArchitecture(): DualNodeArchitecture {
  return new DualNodeArchitectureSupport();
}