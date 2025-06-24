/**
 * Workflow Pattern Suggester - Phase 3 Universal Node Discovery
 * 
 * This module provides intelligent workflow pattern suggestions for common tasks,
 * leveraging the Phase 1 Enhanced Discovery system to recommend optimal node sequences.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Workflow pattern request interface
 */
export interface WorkflowPatternRequest {
  taskDescription: string;
  complexity?: 'simple' | 'intermediate' | 'advanced';
  industry?: string;
  useCase?: string;
  constraints?: string[];
  preferences?: {
    reliability?: 'high' | 'medium' | 'low';
    performance?: 'fast' | 'balanced' | 'thorough';
    maintenance?: 'minimal' | 'standard' | 'extensive';
  };
  includeBestPractices?: boolean;
  includeAlternatives?: boolean;
}

/**
 * Workflow pattern suggestion interface
 */
export interface WorkflowPatternSuggestion {
  pattern: {
    name: string;
    category: string;
    description: string;
    complexity: 'simple' | 'intermediate' | 'advanced';
    useCases: string[];
  };
  nodeSequence: Array<{
    position: number;
    node: {
      name: string;
      displayName: string;
      type: string;
      category: string;
      purpose: string;
    };
    configuration: {
      parameters: any;
      connections: string[];
      conditionalLogic?: string;
    };
    bestPractices: string[];
    alternatives: string[];
  }>;
  implementation: {
    estimatedTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    commonPitfalls: string[];
  };
  optimization: {
    performanceConsiderations: string[];
    scalabilityNotes: string[];
    maintenanceRecommendations: string[];
  };
  variations: Array<{
    name: string;
    description: string;
    modifications: string[];
    benefits: string[];
  }>;
}

/**
 * Workflow Pattern Suggester Handler
 */
export class WorkflowPatternSuggester extends BaseDiscoveryToolHandler {
  private commonPatterns: Map<string, any>;
  
  constructor() {
    super();
    this.commonPatterns = this.initializeCommonPatterns();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const {
        taskDescription,
        complexity = 'intermediate',
        industry,
        useCase,
        constraints = [],
        preferences = {},
        includeBestPractices = true,
        includeAlternatives = true,
        maxSuggestions = 3
      } = args;

      if (!taskDescription) {
        throw new Error('Task description is required for pattern suggestions');
      }

      console.error(`[WorkflowPatternSuggester] Generating patterns for: "${taskDescription}"`);

      const request: WorkflowPatternRequest = {
        taskDescription,
        complexity,
        industry,
        useCase,
        constraints,
        preferences,
        includeBestPractices,
        includeAlternatives
      };

      // Analyze task intent to identify relevant patterns
      const relevantPatterns = await this.identifyRelevantPatterns(request);
      console.error(`[WorkflowPatternSuggester] Found ${relevantPatterns.length} relevant patterns`);

      // Generate detailed pattern suggestions
      const patternSuggestions = await this.generatePatternSuggestions(
        relevantPatterns,
        request
      );

      // Enhance with Phase 1 Enhanced Discovery insights
      const enhancedSuggestions = await this.enhanceWithDiscoveryInsights(
        patternSuggestions,
        request
      );

      // Limit results
      const finalSuggestions = enhancedSuggestions.slice(0, maxSuggestions);

      const result = {
        taskDescription,
        analysisMetadata: {
          patternsAnalyzed: relevantPatterns.length,
          suggestionsGenerated: finalSuggestions.length,
          complexity,
          industry: industry || 'general',
          timestamp: new Date().toISOString()
        },
        suggestions: finalSuggestions,
        generalRecommendations: this.generateGeneralRecommendations(request, finalSuggestions),
        resourcesAndLearning: this.generateLearningResources(finalSuggestions)
      };

      return this.formatSuccess(
        result,
        `Generated ${finalSuggestions.length} workflow pattern suggestions for ${complexity} complexity`
      );
    }, args);
  }

  private async identifyRelevantPatterns(request: WorkflowPatternRequest): Promise<string[]> {
    const description = request.taskDescription.toLowerCase();
    const relevantPatterns = [];

    // Pattern matching based on keywords and intent
    for (const [patternName, pattern] of this.commonPatterns.entries()) {
      if (this.patternMatchesTask(pattern, description, request)) {
        relevantPatterns.push(patternName);
      }
    }

    // Use Phase 1 Universal Node Catalog for intent-based pattern discovery
    try {
      const intentNodes = await universalNodeCatalog.discoverByIntent(description);
      const chainSuggestions = await universalNodeCatalog.getNodeChainSuggestions(description);

      // Add patterns based on chain suggestions
      for (const chainSuggestion of chainSuggestions.slice(0, 2)) {
        const inferredPattern = this.inferPatternFromChain(chainSuggestion);
        if (inferredPattern && !relevantPatterns.includes(inferredPattern)) {
          relevantPatterns.push(inferredPattern);
        }
      }
    } catch (error) {
      console.error(`[WorkflowPatternSuggester] Intent-based pattern discovery failed:`, error);
    }

    return relevantPatterns.length > 0 ? relevantPatterns : ['basic-automation'];
  }

  private async generatePatternSuggestions(
    patternNames: string[],
    request: WorkflowPatternRequest
  ): Promise<WorkflowPatternSuggestion[]> {
    const suggestions = [];

    for (const patternName of patternNames.slice(0, 5)) { // Limit to 5 patterns
      try {
        const basePattern = this.commonPatterns.get(patternName);
        if (!basePattern) continue;

        const suggestion = await this.buildPatternSuggestion(basePattern, request);
        suggestions.push(suggestion);
      } catch (error) {
        console.error(`[WorkflowPatternSuggester] Pattern generation failed for ${patternName}:`, error);
      }
    }

    return suggestions;
  }

  private async buildPatternSuggestion(
    basePattern: any,
    request: WorkflowPatternRequest
  ): Promise<WorkflowPatternSuggestion> {
    // Build node sequence using Dynamic Discovery
    const nodeSequence = await this.buildOptimalNodeSequence(basePattern, request);

    // Generate implementation details
    const implementation = this.generateImplementationDetails(basePattern, request);

    // Generate optimization recommendations
    const optimization = await this.generateOptimizationRecommendations(basePattern, request);

    // Generate pattern variations
    const variations = this.generatePatternVariations(basePattern, request);

    return {
      pattern: {
        name: basePattern.name,
        category: basePattern.category,
        description: basePattern.description,
        complexity: basePattern.complexity,
        useCases: basePattern.useCases
      },
      nodeSequence,
      implementation,
      optimization,
      variations
    };
  }

  private async buildOptimalNodeSequence(
    basePattern: any,
    request: WorkflowPatternRequest
  ): Promise<any[]> {
    try {
      // Use Dynamic Discovery for optimal node sequence
      const workflowGoal = {
        objective: request.taskDescription,
        success_criteria: basePattern.successCriteria || ['Workflow executes successfully'],
        input_specification: {
          type: 'any',
          format: 'json',
          example: {},
          validation: []
        },
        output_specification: {
          type: 'any',
          format: 'json',
          schema: {},
          requirements: ['Valid output']
        },
        constraints: (request.constraints || []).map(constraint => ({
          type: 'compliance' as const,
          description: constraint,
          priority: 'should' as const,
          impact: 'medium' as const,
          limit: constraint,
          critical: false
        })),
        context: {
          domain: request.industry || 'automation',
          use_case: request.useCase || 'general',
          user_skill_level: this.mapComplexityToSkillLevel(request.complexity),
          environment: 'production' as const,
          existing_systems: []
        }
      };

      const nodeSequenceResult = await dynamicNodeDiscovery.recommendNodeSequence(workflowGoal);
      
      const sequencePromises = nodeSequenceResult.sequence.map(async (step: any, index: number) => ({
        position: index + 1,
        node: {
          name: step.node.name,
          displayName: step.node.displayName,
          type: step.node.name,
          category: step.node.category,
          purpose: step.purpose
        },
        configuration: {
          parameters: step.configuration,
          connections: step.dependencies,
          conditionalLogic: step.conditionalLogic
        },
        bestPractices: this.generateNodeBestPractices(step.node, basePattern),
        alternatives: await this.findNodeAlternatives(step.node)
      }));
      
      return Promise.all(sequencePromises);
    } catch (error) {
      console.error(`[WorkflowPatternSuggester] Node sequence building failed:`, error);
      
      // Fallback to pattern-based sequence
      return this.buildFallbackNodeSequence(basePattern, request);
    }
  }

  private async enhanceWithDiscoveryInsights(
    suggestions: WorkflowPatternSuggestion[],
    request: WorkflowPatternRequest
  ): Promise<WorkflowPatternSuggestion[]> {
    const enhanced = [];

    for (const suggestion of suggestions) {
      try {
        // Enhance node sequence with AI optimizations
        const enhancedNodeSequence = await this.enhanceNodeSequenceWithAI(
          suggestion.nodeSequence,
          request
        );

        // Add enhanced insights
        const enhancedSuggestion = {
          ...suggestion,
          nodeSequence: enhancedNodeSequence,
          aiInsights: await this.generateAIInsights(suggestion, request)
        };

        enhanced.push(enhancedSuggestion);
      } catch (error) {
        console.error(`[WorkflowPatternSuggester] Enhancement failed for pattern ${suggestion.pattern.name}:`, error);
        enhanced.push(suggestion); // Include original if enhancement fails
      }
    }

    return enhanced;
  }

  private async enhanceNodeSequenceWithAI(
    nodeSequence: any[],
    request: WorkflowPatternRequest
  ): Promise<any[]> {
    const enhanced = [];

    for (const step of nodeSequence) {
      try {
        // Get AI optimizations for each node
        const aiOptimizations = await dualNodeArchitecture.getAIOptimizedParameters(step.node.name);
        
        const enhancedStep = {
          ...step,
          aiOptimizations: aiOptimizations.slice(0, 3), // Top 3 optimizations
          enhancedConfiguration: {
            ...step.configuration,
            aiSuggestions: await dualNodeArchitecture.suggestParameterValues(
              step.node.name,
              { context: request.taskDescription }
            )
          }
        };

        enhanced.push(enhancedStep);
      } catch (error) {
        console.error(`[WorkflowPatternSuggester] AI enhancement failed for node ${step.node.name}:`, error);
        enhanced.push(step);
      }
    }

    return enhanced;
  }

  private initializeCommonPatterns(): Map<string, any> {
    const patterns = new Map();

    patterns.set('webhook-api-integration', {
      name: 'Webhook to API Integration',
      category: 'Data Integration',
      description: 'Receive webhooks and forward data to external APIs',
      complexity: 'simple',
      useCases: ['API integration', 'Real-time data sync', 'Event-driven automation'],
      successCriteria: ['Webhook received', 'API call successful', 'Data transformed correctly'],
      keywords: ['webhook', 'api', 'integration', 'forward', 'sync']
    });

    patterns.set('scheduled-data-processing', {
      name: 'Scheduled Data Processing',
      category: 'Data Automation',
      description: 'Regularly fetch, process, and store data from various sources',
      complexity: 'intermediate',
      useCases: ['Data ETL', 'Report generation', 'Monitoring', 'Backup automation'],
      successCriteria: ['Data fetched', 'Processing completed', 'Results stored'],
      keywords: ['schedule', 'cron', 'data', 'process', 'etl', 'regular']
    });

    patterns.set('notification-workflow', {
      name: 'Smart Notification System',
      category: 'Communication',
      description: 'Monitor conditions and send targeted notifications',
      complexity: 'simple',
      useCases: ['Alert systems', 'Status updates', 'Emergency notifications'],
      successCriteria: ['Condition monitored', 'Notification sent', 'Delivery confirmed'],
      keywords: ['notification', 'alert', 'email', 'slack', 'monitor', 'condition']
    });

    patterns.set('ai-content-generation', {
      name: 'AI-Powered Content Generation',
      category: 'AI Automation',
      description: 'Generate, review, and publish content using AI',
      complexity: 'intermediate',
      useCases: ['Content creation', 'Social media automation', 'Documentation'],
      successCriteria: ['Content generated', 'Quality reviewed', 'Published successfully'],
      keywords: ['ai', 'generate', 'content', 'gpt', 'claude', 'text', 'create']
    });

    patterns.set('data-synchronization', {
      name: 'Multi-Platform Data Sync',
      category: 'Data Integration',
      description: 'Keep data synchronized across multiple platforms',
      complexity: 'advanced',
      useCases: ['CRM sync', 'Database replication', 'Multi-platform updates'],
      successCriteria: ['Data fetched from source', 'Transformed correctly', 'Synced to targets'],
      keywords: ['sync', 'synchronize', 'database', 'crm', 'platform', 'update']
    });

    patterns.set('form-to-action', {
      name: 'Form Submission to Action',
      category: 'Lead Processing',
      description: 'Process form submissions and trigger appropriate actions',
      complexity: 'simple',
      useCases: ['Lead capture', 'Support tickets', 'Registration processing'],
      successCriteria: ['Form data received', 'Validation passed', 'Actions executed'],
      keywords: ['form', 'submission', 'lead', 'contact', 'register', 'capture']
    });

    patterns.set('error-handling-retry', {
      name: 'Robust Error Handling',
      category: 'Reliability',
      description: 'Handle errors gracefully with retry logic and notifications',
      complexity: 'intermediate',
      useCases: ['API reliability', 'Data processing safety', 'System monitoring'],
      successCriteria: ['Errors caught', 'Retries attempted', 'Fallback executed'],
      keywords: ['error', 'retry', 'failure', 'robust', 'reliable', 'fallback']
    });

    patterns.set('basic-automation', {
      name: 'Basic Automation Workflow',
      category: 'General',
      description: 'Simple trigger-action automation pattern',
      complexity: 'simple',
      useCases: ['General automation', 'Simple integrations', 'Basic processing'],
      successCriteria: ['Trigger activated', 'Action executed', 'Process completed'],
      keywords: ['automation', 'basic', 'simple', 'trigger', 'action']
    });

    return patterns;
  }

  private patternMatchesTask(pattern: any, description: string, request: WorkflowPatternRequest): boolean {
    // Check keyword matches
    const keywordMatches = pattern.keywords.some((keyword: string) => 
      description.includes(keyword.toLowerCase())
    );

    // Check complexity compatibility
    const complexityOrder = ['simple', 'intermediate', 'advanced'];
    const patternComplexity = complexityOrder.indexOf(pattern.complexity);
    const requestComplexity = complexityOrder.indexOf(request.complexity || 'intermediate');
    const complexityMatch = Math.abs(patternComplexity - requestComplexity) <= 1;

    // Check use case matches
    const useCaseMatch = request.useCase ? 
      pattern.useCases.some((useCase: string) => 
        useCase.toLowerCase().includes(request.useCase!.toLowerCase()) ||
        request.useCase!.toLowerCase().includes(useCase.toLowerCase())
      ) : true;

    return keywordMatches && complexityMatch && useCaseMatch;
  }

  private inferPatternFromChain(chainSuggestion: any): string | null {
    if (!chainSuggestion.chain || chainSuggestion.chain.length === 0) {
      return null;
    }

    const firstNode = chainSuggestion.chain[0];
    const hasWebhook = chainSuggestion.chain.some((node: any) => 
      node.name.toLowerCase().includes('webhook')
    );
    const hasSchedule = chainSuggestion.chain.some((node: any) => 
      node.name.toLowerCase().includes('schedule')
    );
    const hasAI = chainSuggestion.chain.some((node: any) => 
      node.category?.toLowerCase().includes('ai')
    );

    if (hasWebhook) return 'webhook-api-integration';
    if (hasSchedule) return 'scheduled-data-processing';
    if (hasAI) return 'ai-content-generation';
    
    return 'basic-automation';
  }

  private buildFallbackNodeSequence(basePattern: any, request: WorkflowPatternRequest): any[] {
    const fallbackSequences: { [key: string]: any[] } = {
      'webhook-api-integration': [
        {
          position: 1,
          node: {
            name: 'n8n-nodes-base.webhook',
            displayName: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            category: 'Trigger',
            purpose: 'Receive incoming webhook data'
          },
          configuration: {
            parameters: { path: 'webhook-endpoint', httpMethod: 'POST' },
            connections: ['n8n-nodes-base.httpRequest']
          },
          bestPractices: ['Validate incoming data', 'Set response mode', 'Configure authentication'],
          alternatives: ['n8n-nodes-base.httpRequest']
        },
        {
          position: 2,
          node: {
            name: 'n8n-nodes-base.httpRequest',
            displayName: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            category: 'Regular',
            purpose: 'Forward data to external API'
          },
          configuration: {
            parameters: { method: 'POST', url: 'https://api.example.com' },
            connections: []
          },
          bestPractices: ['Set proper headers', 'Handle rate limits', 'Add error handling'],
          alternatives: ['n8n-nodes-base.function']
        }
      ]
    };

    return fallbackSequences[basePattern.name] || [];
  }

  private generateImplementationDetails(basePattern: any, request: WorkflowPatternRequest): any {
    const complexityTimeMap = {
      'simple': '15-30 minutes',
      'intermediate': '1-2 hours',
      'advanced': '3-6 hours'
    };

    return {
      estimatedTime: complexityTimeMap[request.complexity || 'intermediate'],
      difficulty: this.mapComplexityToSkillLevel(request.complexity) as any,
      prerequisites: this.generatePrerequisites(basePattern, request),
      commonPitfalls: this.generateCommonPitfalls(basePattern)
    };
  }

  private async generateOptimizationRecommendations(basePattern: any, request: WorkflowPatternRequest): Promise<any> {
    return {
      performanceConsiderations: [
        'Minimize external API calls',
        'Use efficient data transformation',
        'Implement proper caching strategies'
      ],
      scalabilityNotes: [
        'Design for horizontal scaling',
        'Implement queue management for high volume',
        'Monitor resource usage'
      ],
      maintenanceRecommendations: [
        'Add comprehensive logging',
        'Implement health checks',
        'Document configuration parameters'
      ]
    };
  }

  private generatePatternVariations(basePattern: any, request: WorkflowPatternRequest): any[] {
    const variations = [
      {
        name: 'Simplified Version',
        description: 'Reduced complexity with essential features only',
        modifications: ['Remove optional steps', 'Simplified error handling', 'Basic configuration'],
        benefits: ['Faster implementation', 'Easier maintenance', 'Lower resource usage']
      },
      {
        name: 'Enterprise Version',
        description: 'Enhanced with enterprise features and robustness',
        modifications: ['Advanced error handling', 'Comprehensive logging', 'Security enhancements'],
        benefits: ['Production-ready', 'Better monitoring', 'Enhanced security']
      }
    ];

    if (request.complexity === 'advanced') {
      variations.push({
        name: 'AI-Enhanced Version',
        description: 'Integrated with AI capabilities for intelligent processing',
        modifications: ['AI-powered decision making', 'Intelligent routing', 'Predictive optimization'],
        benefits: ['Smarter automation', 'Adaptive behavior', 'Better outcomes']
      });
    }

    return variations;
  }

  private generateNodeBestPractices(node: any, basePattern: any): string[] {
    const practices = [
      'Configure appropriate timeouts',
      'Add input validation',
      'Implement error handling'
    ];

    if (node.name.includes('webhook')) {
      practices.push('Set up proper authentication', 'Validate webhook signatures');
    }

    if (node.name.includes('http')) {
      practices.push('Handle rate limiting', 'Set retry policies');
    }

    if (node.category?.toLowerCase().includes('ai')) {
      practices.push('Optimize prompt templates', 'Handle API quota limits');
    }

    return practices;
  }

  private async findNodeAlternatives(node: any): Promise<string[]> {
    try {
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      return allNodes
        .filter(n => n.category === node.category && n.name !== node.name)
        .slice(0, 2)
        .map(n => n.name);
    } catch (error) {
      return [];
    }
  }

  private async generateAIInsights(suggestion: WorkflowPatternSuggestion, request: WorkflowPatternRequest): Promise<any> {
    return {
      aiOptimizationOpportunities: [
        'Parameter auto-tuning available',
        'Smart error recovery possible',
        'Intelligent routing can be added'
      ],
      recommendedEnhancements: [
        'Add AI-powered validation',
        'Implement predictive scaling',
        'Use intelligent retry strategies'
      ],
      futureUpgrades: [
        'Machine learning integration',
        'Advanced analytics',
        'Automated optimization'
      ]
    };
  }

  private mapComplexityToSkillLevel(complexity?: string): 'beginner' | 'intermediate' | 'expert' {
    const mapping = {
      'simple': 'beginner' as const,
      'intermediate': 'intermediate' as const,
      'advanced': 'expert' as const
    };
    return mapping[complexity as keyof typeof mapping] || 'intermediate';
  }

  private generatePrerequisites(basePattern: any, request: WorkflowPatternRequest): string[] {
    const prerequisites = ['Basic n8n knowledge', 'Understanding of workflow concepts'];

    if (basePattern.category === 'Data Integration') {
      prerequisites.push('API knowledge', 'Data transformation concepts');
    }

    if (basePattern.category === 'AI Automation') {
      prerequisites.push('AI/ML basics', 'Prompt engineering knowledge');
    }

    if (request.complexity === 'advanced') {
      prerequisites.push('Advanced workflow patterns', 'Error handling strategies');
    }

    return prerequisites;
  }

  private generateCommonPitfalls(basePattern: any): string[] {
    return [
      'Insufficient error handling',
      'Missing input validation',
      'Inadequate testing',
      'Poor documentation',
      'Ignoring rate limits'
    ];
  }

  private generateGeneralRecommendations(request: WorkflowPatternRequest, suggestions: WorkflowPatternSuggestion[]): string[] {
    const recommendations = [];

    if (suggestions.length > 1) {
      recommendations.push('Compare multiple patterns to find the best fit');
    }

    if (request.complexity === 'simple') {
      recommendations.push('Start with simple patterns and gradually add complexity');
    }

    recommendations.push(
      'Test workflows with sample data before production deployment',
      'Implement comprehensive monitoring and logging',
      'Document your workflow configurations and customizations',
      'Regular review and optimization of workflow performance'
    );

    return recommendations;
  }

  private generateLearningResources(suggestions: WorkflowPatternSuggestion[]): any {
    return {
      documentation: [
        'n8n Official Documentation',
        'Workflow Best Practices Guide',
        'Node Configuration Reference'
      ],
      tutorials: [
        'Building Your First Automation',
        'Advanced Workflow Patterns',
        'Error Handling Strategies'
      ],
      community: [
        'n8n Community Forum',
        'Discord Support Channel',
        'GitHub Examples Repository'
      ]
    };
  }
}

// Tool definitions
export function getSuggestWorkflowPatternsToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_workflow_patterns',
    description: 'Get intelligent workflow pattern suggestions based on task description with recommended node sequences and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: {
          type: 'string',
          description: 'Description of the task or workflow you want to create'
        },
        complexity: {
          type: 'string',
          enum: ['simple', 'intermediate', 'advanced'],
          description: 'Desired complexity level of the workflow',
          default: 'intermediate'
        },
        industry: {
          type: 'string',
          description: 'Industry or domain context (e.g., "ecommerce", "healthcare", "finance")'
        },
        useCase: {
          type: 'string',
          description: 'Specific use case or application context'
        },
        constraints: {
          type: 'array',
          items: { type: 'string' },
          description: 'Any constraints or requirements (e.g., "no cloud services", "must use webhooks")'
        },
        preferences: {
          type: 'object',
          properties: {
            reliability: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Required reliability level'
            },
            performance: {
              type: 'string',
              enum: ['fast', 'balanced', 'thorough'],
              description: 'Performance preference'
            },
            maintenance: {
              type: 'string',
              enum: ['minimal', 'standard', 'extensive'],
              description: 'Acceptable maintenance level'
            }
          },
          description: 'Workflow preferences and priorities'
        },
        includeBestPractices: {
          type: 'boolean',
          description: 'Include best practices and implementation guidance',
          default: true
        },
        includeAlternatives: {
          type: 'boolean',
          description: 'Include alternative approaches and variations',
          default: true
        },
        maxSuggestions: {
          type: 'number',
          description: 'Maximum number of pattern suggestions to return',
          default: 3
        }
      },
      required: ['taskDescription']
    }
  };
}