/**
 * Get AI Agent Templates Tool Handler
 *
 * Provides pre-built workflow templates specifically designed for common AI agent tasks.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseAIAgentTemplateHandler, AIAgentTemplate } from './base-handler.js';

/**
 * Handler for getting AI agent templates
 */
export class GetAiAgentTemplatesHandler extends BaseAIAgentTemplateHandler {
  constructor() {
    super();
  }
  /**
   * Execute the get AI agent templates tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return await this.handleExecution(async (args) => {
      const {
        category = 'all',
        complexity = 'all',
        execution_mode = 'all',
        include_metadata = true,
        ai_optimization_level = 'all'
      } = args;

      // Get only AI agent templates (no user template storage)
      const allTemplates = this.getAIAgentTemplates();

      // Filter templates based on criteria
      const filteredTemplates = this.filterTemplates(
        allTemplates,
        category,
        complexity,
        execution_mode,
        ai_optimization_level
      );

      // Process templates for response
      const processedTemplates = filteredTemplates.map(template => 
        this.processTemplate(template, include_metadata)
      );

      // Generate summary statistics
      const summary = this.generateTemplateSummary(filteredTemplates, allTemplates);

      // Get recommendations based on filtering criteria
      const recommendations = this.generateRecommendations(
        filteredTemplates,
        category,
        complexity,
        execution_mode
      );

      const result = {
        success: true,
        total_templates: processedTemplates.length,
        available_total: allTemplates.length,
        filters_applied: {
          category: category !== 'all' ? category : null,
          complexity: complexity !== 'all' ? complexity : null,
          execution_mode: execution_mode !== 'all' ? execution_mode : null,
          ai_optimization_level: ai_optimization_level !== 'all' ? ai_optimization_level : null
        },
        templates: processedTemplates,
        summary,
        recommendations,
        categories_available: this.getAvailableCategories(allTemplates),
        usage_guide: this.getUsageGuide()
      };

      return this.formatSuccess(
        result, 
        `Retrieved ${processedTemplates.length} AI agent templates${category !== 'all' ? ` for ${category}` : ''}`
      );
    }, args);
  }

  /**
   * Process template for response
   */
  private processTemplate(template: AIAgentTemplate, includeMetadata: boolean): any {
    const baseTemplate = {
      id: template.id,
      name: template.name,
      category: template.category,
      complexity: template.complexity,
      description: template.description,
      use_cases: template.use_cases,
      execution_mode: template.execution_mode,
      ai_optimization_level: template.ai_optimization_level,
      tags: template.tags
    };

    if (includeMetadata) {
      return {
        ...baseTemplate,
        metadata: template.metadata,
        workflow_structure: this.analyzeWorkflowStructure(template.workflow_definition),
        ai_features: this.extractAIFeatures(template),
        implementation_guide: this.generateImplementationGuide(template),
        created_date: template.created_date,
        last_updated: template.last_updated
      };
    }

    return baseTemplate;
  }

  /**
   * Analyze workflow structure
   */
  private analyzeWorkflowStructure(workflowDef: any): any {
    if (!workflowDef || !workflowDef.nodes) {
      return {
        node_count: 0,
        node_types: [],
        complexity_score: 0,
        has_error_handling: false
      };
    }

    const nodes = workflowDef.nodes;
    const nodeTypes = [...new Set(nodes.map((node: any) => node.type))] as string[];
    const hasErrorHandling = nodes.some((node: any) =>
      node.id.includes('error') || node.type === 'Error Trigger'
    );

    return {
      node_count: nodes.length,
      node_types: nodeTypes,
      complexity_score: this.calculateComplexityScore(nodes, workflowDef.connections),
      has_error_handling: hasErrorHandling,
      estimated_setup_time: this.estimateSetupTime(nodes.length, nodeTypes),
      resource_requirements: this.assessResourceRequirements(nodes, nodeTypes)
    };
  }

  /**
   * Extract AI-specific features
   */
  private extractAIFeatures(template: AIAgentTemplate): any {
    const features = {
      error_recovery: template.metadata.retry_capability,
      timeout_handling: template.metadata.timeout_handling,
      monitoring: template.metadata.monitoring_included,
      optimization_level: template.ai_optimization_level,
      automated_execution: template.execution_mode.includes('triggered') || template.execution_mode.includes('scheduled'),
      parallel_processing: this.hasParallelProcessing(template.workflow_definition),
      data_validation: this.hasDataValidation(template.workflow_definition),
      performance_tracking: template.metadata.monitoring_included
    };

    return {
      ...features,
      ai_readiness_score: this.calculateAIReadinessScore(features),
      automation_capabilities: this.getAutomationCapabilities(template),
      integration_points: this.getIntegrationPoints(template.workflow_definition)
    };
  }

  /**
   * Generate implementation guide
   */
  private generateImplementationGuide(template: AIAgentTemplate): any {
    return {
      setup_steps: this.getSetupSteps(template),
      configuration_requirements: this.getConfigurationRequirements(template),
      prerequisites: this.getPrerequisites(template),
      testing_recommendations: this.getTestingRecommendations(template),
      deployment_considerations: this.getDeploymentConsiderations(template),
      troubleshooting_tips: this.getTroubleshootingTips(template)
    };
  }

  /**
   * Generate template summary
   */
  private generateTemplateSummary(filteredTemplates: AIAgentTemplate[], allTemplates: AIAgentTemplate[]): any {
    const categoryCounts = this.getCategoryCounts(filteredTemplates);
    const complexityCounts = this.getComplexityCounts(filteredTemplates);
    const optimizationCounts = this.getOptimizationCounts(filteredTemplates);

    return {
      by_category: categoryCounts,
      by_complexity: complexityCounts,
      by_optimization_level: optimizationCounts,
      most_popular: this.getMostPopularTemplates(filteredTemplates),
      newest_templates: this.getNewestTemplates(filteredTemplates),
      recommended_starting_points: this.getRecommendedStartingPoints(filteredTemplates)
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    templates: AIAgentTemplate[],
    category: string,
    complexity: string,
    executionMode: string
  ): any {
    const recommendations = [];

    // Category-based recommendations
    if (category !== 'all') {
      const relatedCategories = this.getRelatedCategories(category);
      if (relatedCategories.length > 0) {
        recommendations.push({
          type: 'related_categories',
          title: 'Related categories to explore',
          categories: relatedCategories,
          reasoning: `Templates in these categories often complement ${category} workflows`
        });
      }
    }

    // Complexity progression recommendations
    if (complexity !== 'all') {
      const nextComplexity = this.getNextComplexityLevel(complexity);
      if (nextComplexity) {
        recommendations.push({
          type: 'complexity_progression',
          title: `Consider ${nextComplexity} templates next`,
          templates: templates.filter(t => t.complexity === nextComplexity).slice(0, 3).map(t => t.id),
          reasoning: `Natural progression from ${complexity} to ${nextComplexity} complexity`
        });
      }
    }

    // Execution mode recommendations
    if (executionMode !== 'all') {
      const complementaryModes = this.getComplementaryExecutionModes(executionMode);
      recommendations.push({
        type: 'execution_modes',
        title: 'Complementary execution modes',
        modes: complementaryModes,
        reasoning: `These execution modes work well with ${executionMode} workflows`
      });
    }

    // AI optimization recommendations
    const lowOptimizationTemplates = templates.filter(t => t.ai_optimization_level === 'basic');
    if (lowOptimizationTemplates.length > 0) {
      recommendations.push({
        type: 'optimization_upgrade',
        title: 'Consider enhanced AI optimization',
        templates: lowOptimizationTemplates.slice(0, 3).map(t => ({
          id: t.id,
          current_level: t.ai_optimization_level,
          upgrade_benefits: this.getOptimizationUpgradeBenefits(t)
        })),
        reasoning: 'Enhanced optimization provides better AI agent compatibility'
      });
    }

    return recommendations;
  }

  /**
   * Helper methods for calculations and analysis
   */
  private calculateComplexityScore(nodes: any[], connections: any): number {
    const nodeCount = nodes.length;
    const connectionCount = Object.keys(connections || {}).length;
    const conditionalNodes = nodes.filter((node: any) => 
      node.type === 'Switch' || node.type === 'If'
    ).length;
    
    return Math.min(((nodeCount * 2) + (connectionCount * 1.5) + (conditionalNodes * 3)) / 10, 10);
  }

  private estimateSetupTime(nodeCount: number, nodeTypes: string[]): string {
    const baseTime = nodeCount * 5; // 5 minutes per node
    const complexityMultiplier = nodeTypes.some(type => 
      ['Function', 'Code', 'HTTP Request'].includes(type)
    ) ? 1.5 : 1;
    
    const totalMinutes = Math.round(baseTime * complexityMultiplier);
    
    if (totalMinutes < 30) return 'Under 30 minutes';
    if (totalMinutes < 60) return '30-60 minutes';
    if (totalMinutes < 120) return '1-2 hours';
    return '2+ hours';
  }

  private assessResourceRequirements(nodes: any[], nodeTypes: string[]): string {
    const heavyNodes = nodeTypes.filter(type => 
      ['HTTP Request', 'Function', 'Code', 'Wait'].includes(type)
    ).length;
    
    if (nodes.length < 5 && heavyNodes < 2) return 'low';
    if (nodes.length < 15 && heavyNodes < 5) return 'medium';
    return 'high';
  }

  private hasParallelProcessing(workflowDef: any): boolean {
    if (!workflowDef?.connections) return false;
    
    // Check if any node has multiple output connections
    return Object.values(workflowDef.connections).some((connections: any) => 
      connections.main && connections.main.length > 1
    );
  }

  private hasDataValidation(workflowDef: any): boolean {
    if (!workflowDef?.nodes) return false;
    
    return workflowDef.nodes.some((node: any) => 
      node.type === 'Function' && 
      node.parameters?.functionCode?.includes('validation')
    );
  }

  private calculateAIReadinessScore(features: any): number {
    let score = 0;
    if (features.error_recovery) score += 20;
    if (features.timeout_handling) score += 15;
    if (features.monitoring) score += 15;
    if (features.automated_execution) score += 20;
    if (features.parallel_processing) score += 10;
    if (features.data_validation) score += 10;
    if (features.performance_tracking) score += 10;
    
    return Math.min(score, 100);
  }

  private getAutomationCapabilities(template: AIAgentTemplate): string[] {
    const capabilities = [];
    
    if (template.execution_mode.includes('triggered')) capabilities.push('Event-driven execution');
    if (template.execution_mode.includes('scheduled')) capabilities.push('Time-based automation');
    if (template.execution_mode.includes('webhook')) capabilities.push('Real-time API responses');
    if (template.metadata.retry_capability) capabilities.push('Automatic retry on failure');
    if (template.metadata.monitoring_included) capabilities.push('Performance monitoring');
    
    return capabilities;
  }

  private getIntegrationPoints(workflowDef: any): string[] {
    if (!workflowDef?.nodes) return [];
    
    const integrationTypes = new Set<string>();
    
    workflowDef.nodes.forEach((node: any) => {
      switch (node.type) {
        case 'HTTP Request':
          integrationTypes.add('REST APIs');
          break;
        case 'Webhook':
          integrationTypes.add('Webhook endpoints');
          break;
        case 'Read Binary File':
        case 'Write Binary File':
          integrationTypes.add('File systems');
          break;
        case 'Email':
          integrationTypes.add('Email services');
          break;
        default:
          if (node.type.includes('Database')) {
            integrationTypes.add('Databases');
          }
      }
    });
    
    return Array.from(integrationTypes);
  }

  private getSetupSteps(template: AIAgentTemplate): string[] {
    const steps = [
      'Import workflow template into n8n',
      'Configure required credentials',
      'Update endpoint URLs and parameters'
    ];

    if (template.metadata.monitoring_included) {
      steps.push('Set up monitoring and alerting');
    }

    if (template.execution_mode.includes('webhook')) {
      steps.push('Configure webhook endpoints');
    }

    if (template.execution_mode.includes('scheduled')) {
      steps.push('Set up execution schedule');
    }

    steps.push('Test workflow with sample data');
    steps.push('Deploy to production environment');

    return steps;
  }

  private getConfigurationRequirements(template: AIAgentTemplate): any {
    const requirements = {
      credentials: [] as string[],
      environment_variables: [] as string[],
      external_dependencies: [] as string[]
    };

    // Analyze workflow to determine requirements
    if (template.workflow_definition?.nodes) {
      template.workflow_definition.nodes.forEach((node: any) => {
        switch (node.type) {
          case 'HTTP Request':
            requirements.credentials.push('API authentication credentials');
            requirements.environment_variables.push('API_ENDPOINT_URL');
            break;
          case 'Email':
            requirements.credentials.push('Email service credentials');
            break;
          case 'Webhook':
            requirements.environment_variables.push('WEBHOOK_URL');
            break;
        }
      });
    }

    return requirements;
  }

  private getPrerequisites(template: AIAgentTemplate): string[] {
    const prerequisites = ['n8n instance (version 1.0+)'];

    if (template.complexity === 'advanced') {
      prerequisites.push('Understanding of n8n advanced features');
    }

    if (template.metadata.resource_requirements === 'high') {
      prerequisites.push('Adequate server resources (2+ CPU cores, 4GB+ RAM)');
    }

    if (template.execution_mode.includes('webhook')) {
      prerequisites.push('Public-facing URL for webhook access');
    }

    return prerequisites;
  }

  private getTestingRecommendations(template: AIAgentTemplate): string[] {
    return [
      'Test with sample data in development environment',
      'Verify error handling scenarios',
      'Test timeout and retry mechanisms',
      'Validate output format and structure',
      'Performance test with expected load',
      'Test all execution modes if applicable'
    ];
  }

  private getDeploymentConsiderations(template: AIAgentTemplate): string[] {
    const considerations = [
      'Ensure all credentials are properly configured',
      'Set appropriate timeout values for production',
      'Configure monitoring and alerting'
    ];

    if (template.metadata.resource_requirements === 'high') {
      considerations.push('Monitor resource usage and scale as needed');
    }

    if (template.execution_mode.includes('webhook')) {
      considerations.push('Implement rate limiting for webhook endpoints');
    }

    return considerations;
  }

  private getTroubleshootingTips(template: AIAgentTemplate): string[] {
    return [
      'Check execution logs for detailed error information',
      'Verify all required credentials are valid',
      'Test individual nodes in isolation',
      'Check network connectivity for external APIs',
      'Monitor execution times for performance issues',
      'Review n8n documentation for node-specific issues'
    ];
  }

  /**
   * Utility methods for summary and recommendations
   */
  private getCategoryCounts(templates: AIAgentTemplate[]): Record<string, number> {
    const counts: Record<string, number> = {};
    templates.forEach(template => {
      counts[template.category] = (counts[template.category] || 0) + 1;
    });
    return counts;
  }

  private getComplexityCounts(templates: AIAgentTemplate[]): Record<string, number> {
    const counts: Record<string, number> = {};
    templates.forEach(template => {
      counts[template.complexity] = (counts[template.complexity] || 0) + 1;
    });
    return counts;
  }

  private getOptimizationCounts(templates: AIAgentTemplate[]): Record<string, number> {
    const counts: Record<string, number> = {};
    templates.forEach(template => {
      counts[template.ai_optimization_level] = (counts[template.ai_optimization_level] || 0) + 1;
    });
    return counts;
  }

  private getMostPopularTemplates(templates: AIAgentTemplate[]): string[] {
    // For now, return templates with 'enhanced' or 'advanced' optimization
    return templates
      .filter(t => ['enhanced', 'advanced'].includes(t.ai_optimization_level))
      .slice(0, 3)
      .map(t => t.id);
  }

  private getNewestTemplates(templates: AIAgentTemplate[]): string[] {
    return templates
      .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
      .slice(0, 3)
      .map(t => t.id);
  }

  private getRecommendedStartingPoints(templates: AIAgentTemplate[]): string[] {
    return templates
      .filter(t => t.complexity === 'simple' || t.complexity === 'intermediate')
      .slice(0, 3)
      .map(t => t.id);
  }

  private getRelatedCategories(category: string): string[] {
    const relatedMap: Record<string, string[]> = {
      'data_processing': ['api_integration', 'file_operations'],
      'api_integration': ['data_processing', 'webhook_handlers'],
      'file_operations': ['data_processing', 'batch_processing'],
      'notification_systems': ['monitoring_automation', 'webhook_handlers'],
      'monitoring_automation': ['notification_systems', 'scheduled_tasks']
    };

    return relatedMap[category] || [];
  }

  private getNextComplexityLevel(complexity: string): string | null {
    const progression = { 'simple': 'intermediate', 'intermediate': 'advanced' };
    return (progression as any)[complexity] || null;
  }

  private getComplementaryExecutionModes(mode: string): string[] {
    const complementaryMap: Record<string, string[]> = {
      'manual': ['triggered', 'webhook'],
      'triggered': ['manual', 'scheduled'],
      'scheduled': ['triggered', 'webhook'],
      'webhook': ['manual', 'triggered']
    };

    return complementaryMap[mode] || [];
  }

  private getOptimizationUpgradeBenefits(template: AIAgentTemplate): string[] {
    return [
      'Better error handling and recovery',
      'Enhanced monitoring and logging',
      'Improved performance optimization',
      'Advanced timeout management',
      'Better AI agent compatibility'
    ];
  }

  private getAvailableCategories(templates: AIAgentTemplate[]): string[] {
    return [...new Set(templates.map(t => t.category))].sort();
  }

  private getUsageGuide(): any {
    return {
      getting_started: 'Choose a simple template that matches your use case',
      best_practices: [
        'Start with simple templates and progress to more complex ones',
        'Always test templates in a development environment first',
        'Customize templates to fit your specific requirements',
        'Monitor template performance and optimize as needed'
      ],
      common_pitfalls: [
        'Not configuring proper error handling',
        'Insufficient testing before production deployment',
        'Ignoring resource requirements',
        'Not setting appropriate timeouts'
      ],
      optimization_tips: [
        'Use AI-optimized templates for automated execution',
        'Implement proper monitoring and alerting',
        'Configure retry logic for external API calls',
        'Use parallel processing where applicable'
      ]
    };
  }

}