/**
 * Get Personalized Suggestions Tool Handler
 *
 * Provides AI-specific recommendations based on past usage patterns and preferences.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseAdaptiveLearningHandler } from './base-handler.js';

/**
 * Handler for getting personalized suggestions
 */
export class GetPersonalizedSuggestionsHandler extends BaseAdaptiveLearningHandler {
  /**
   * Execute the get personalized suggestions tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return await this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['context']);

      const { 
        context, 
        current_workflow_id, 
        user_goals = [], 
        complexity_preference = 'adaptive',
        limit = 5 
      } = args;

      // Validate context
      const validContexts = ['workflow_creation', 'tool_selection', 'optimization', 'troubleshooting', 'general'];
      if (!validContexts.includes(context)) {
        throw new Error(`Invalid context. Must be one of: ${validContexts.join(', ')}`);
      }

      // Load analytics and patterns
      const analytics = this.loadUsageAnalytics();
      const patterns = this.loadAIPatterns();

      // Generate suggestions based on context
      const suggestions = await this.generateSuggestions(
        context, 
        patterns, 
        analytics, 
        current_workflow_id, 
        user_goals, 
        complexity_preference,
        limit
      );

      // Get contextual insights
      const contextualInsights = await this.getContextualInsights(
        context, 
        patterns, 
        analytics, 
        current_workflow_id
      );

      const result = {
        success: true,
        context,
        suggestions,
        insights: contextualInsights,
        personalization_score: this.calculatePersonalizationScore(analytics),
        confidence: this.calculateSuggestionConfidence(patterns, analytics),
        learning_metadata: {
          patterns_age: this.getPatternAge(patterns),
          data_points_used: analytics.length,
          suggestion_basis: this.getSuggestionBasis(context, patterns)
        }
      };

      return this.formatSuccess(result, `Generated ${suggestions.length} personalized suggestions for ${context}`);
    }, args);
  }

  /**
   * Generate suggestions based on context and patterns
   */
  private async generateSuggestions(
    context: string,
    patterns: any,
    analytics: any[],
    currentWorkflowId?: string,
    userGoals: string[] = [],
    complexityPreference: string = 'adaptive',
    limit: number = 5
  ): Promise<any[]> {
    let suggestions: any[] = [];

    switch (context) {
      case 'workflow_creation':
        suggestions = await this.getWorkflowCreationSuggestions(patterns, analytics, userGoals, complexityPreference);
        break;
      case 'tool_selection':
        suggestions = await this.getToolSelectionSuggestions(patterns, analytics, currentWorkflowId);
        break;
      case 'optimization':
        suggestions = await this.getOptimizationSuggestions(patterns, analytics, currentWorkflowId);
        break;
      case 'troubleshooting':
        suggestions = await this.getTroubleshootingSuggestions(patterns, analytics, currentWorkflowId);
        break;
      case 'general':
        suggestions = await this.getGeneralSuggestions(patterns, analytics, userGoals);
        break;
    }

    // Apply personalization scoring and limit
    return suggestions
      .map(suggestion => ({
        ...suggestion,
        personalization_score: this.scorePersonalization(suggestion, patterns, analytics)
      }))
      .sort((a, b) => b.personalization_score - a.personalization_score)
      .slice(0, limit);
  }

  /**
   * Get workflow creation suggestions
   */
  private async getWorkflowCreationSuggestions(
    patterns: any,
    analytics: any[],
    userGoals: string[],
    complexityPreference: string
  ): Promise<any[]> {
    const suggestions = [];

    // Template suggestions based on successful patterns
    if (patterns.preferred_workflow_types.length > 0) {
      suggestions.push({
        type: 'template',
        title: 'Use proven workflow templates',
        description: `Based on your patterns, consider templates for: ${patterns.preferred_workflow_types.slice(0, 3).join(', ')}`,
        action: 'list_workflow_templates',
        priority: 'high',
        reasoning: 'Templates reduce development time and improve success rates',
        estimated_time_saved: '15-30 minutes'
      });
    }

    // AI generation suggestions
    if (patterns.frequently_used_tools.includes('create_workflow')) {
      suggestions.push({
        type: 'ai_assistance',
        title: 'Generate workflow from description',
        description: 'Use AI to create workflow structure from natural language description',
        action: 'generate_workflow_from_description',
        priority: 'medium',
        reasoning: 'AI generation aligns with your workflow creation patterns',
        estimated_time_saved: '10-20 minutes'
      });
    }

    // Node suggestions based on goals
    if (userGoals.includes('automation')) {
      suggestions.push({
        type: 'node_recommendation',
        title: 'Add trigger nodes for automation',
        description: 'Consider Webhook, Schedule Trigger, or File Trigger nodes',
        action: 'discover_nodes',
        priority: 'medium',
        reasoning: 'Automation goals require reliable trigger mechanisms',
        recommended_nodes: ['Webhook', 'Schedule Trigger', 'File Trigger']
      });
    }

    if (userGoals.includes('data_processing')) {
      suggestions.push({
        type: 'node_recommendation',
        title: 'Include data transformation nodes',
        description: 'Add Function, Set, or Code nodes for data manipulation',
        action: 'suggest_nodes',
        priority: 'medium',
        reasoning: 'Data processing workflows benefit from transformation capabilities',
        recommended_nodes: ['Function', 'Set', 'Code']
      });
    }

    // Complexity-based suggestions
    if (complexityPreference === 'simple' || complexityPreference === 'adaptive') {
      suggestions.push({
        type: 'best_practice',
        title: 'Start with simple workflow structure',
        description: 'Begin with 3-5 nodes and expand gradually',
        priority: 'low',
        reasoning: 'Simple workflows are easier to debug and maintain',
        best_practices: ['Use clear node names', 'Add error handling', 'Test incrementally']
      });
    }

    return suggestions;
  }

  /**
   * Get tool selection suggestions
   */
  private async getToolSelectionSuggestions(
    patterns: any,
    analytics: any[],
    currentWorkflowId?: string
  ): Promise<any[]> {
    const suggestions = [];

    // Frequently used tools
    if (patterns.frequently_used_tools.length > 0) {
      suggestions.push({
        type: 'tool_recommendation',
        title: 'Your most effective tools',
        description: `Consider using: ${patterns.frequently_used_tools.slice(0, 3).join(', ')}`,
        tools: patterns.frequently_used_tools.slice(0, 5),
        priority: 'high',
        reasoning: 'These tools have shown consistent success in your workflow patterns'
      });
    }

    // Complementary tools
    const recentTools = analytics
      .filter(record => record.tool_name)
      .slice(-10)
      .map(record => record.tool_name);

    if (recentTools.length > 0) {
      const complementaryTools = this.getComplementaryTools(recentTools);
      if (complementaryTools.length > 0) {
        suggestions.push({
          type: 'complementary_tools',
          title: 'Tools that work well together',
          description: 'Based on your recent usage, these tools complement your workflow',
          tools: complementaryTools,
          priority: 'medium',
          reasoning: 'Tool combinations that have proven successful in similar contexts'
        });
      }
    }

    // Workflow-specific suggestions
    if (currentWorkflowId) {
      try {
        const workflow = await this.apiService.getWorkflow(currentWorkflowId);
        const workflowSuggestions = this.getWorkflowSpecificToolSuggestions(workflow);
        suggestions.push(...workflowSuggestions);
      } catch (error) {
        // Workflow not found, skip workflow-specific suggestions
      }
    }

    // Underused powerful tools
    const powerfulTools = [
      'generate_workflow_from_description',
      'auto_connect_nodes', 
      'optimize_workflow_performance',
      'monitor_workflow_health'
    ];
    
    const underusedTools = powerfulTools.filter(tool => 
      !patterns.frequently_used_tools.includes(tool)
    );

    if (underusedTools.length > 0) {
      suggestions.push({
        type: 'discovery',
        title: 'Powerful tools to explore',
        description: 'Advanced tools that could enhance your workflow development',
        tools: underusedTools.slice(0, 3),
        priority: 'low',
        reasoning: 'These tools offer advanced capabilities you haven\'t fully explored'
      });
    }

    return suggestions;
  }

  /**
   * Get optimization suggestions
   */
  private async getOptimizationSuggestions(
    patterns: any,
    analytics: any[],
    currentWorkflowId?: string
  ): Promise<any[]> {
    const suggestions = [];

    // Performance optimization
    const slowExecutions = analytics.filter(record => 
      record.context?.execution_time > 30000
    );

    if (slowExecutions.length > 0) {
      suggestions.push({
        type: 'performance',
        title: 'Optimize slow workflow executions',
        description: 'Several workflows are taking longer than expected to execute',
        action: 'optimize_workflow_performance',
        priority: 'high',
        reasoning: 'Slow executions impact user experience and resource usage',
        affected_workflows: slowExecutions.length,
        potential_improvement: '40-60% execution time reduction'
      });
    }

    // Error rate optimization
    const failedExecutions = analytics.filter(record => 
      record.action === 'workflow_failed'
    );

    if (failedExecutions.length > analytics.length * 0.05) {
      suggestions.push({
        type: 'reliability',
        title: 'Improve workflow reliability',
        description: 'Error rates suggest opportunities for better error handling',
        priority: 'high',
        reasoning: 'High error rates indicate systemic issues that need attention',
        failure_rate: Math.round((failedExecutions.length / analytics.length) * 100),
        recommendations: ['Add error handling nodes', 'Implement retry logic', 'Validate inputs']
      });
    }

    // Node optimization
    if (currentWorkflowId) {
      suggestions.push({
        type: 'node_optimization',
        title: 'Alternative node suggestions',
        description: 'Consider more efficient nodes for your workflow',
        action: 'suggest_node_alternatives',
        priority: 'medium',
        reasoning: 'Updated nodes may offer better performance or features'
      });
    }

    // Workflow consolidation
    const workflowCount = new Set(
      analytics
        .filter(record => record.workflow_id)
        .map(record => record.workflow_id)
    ).size;

    if (workflowCount > 20) {
      suggestions.push({
        type: 'consolidation',
        title: 'Consider workflow consolidation',
        description: 'You have many workflows that might be consolidated',
        action: 'consolidate_workflows',
        priority: 'low',
        reasoning: 'Fewer, more comprehensive workflows are easier to maintain',
        workflow_count: workflowCount
      });
    }

    return suggestions;
  }

  /**
   * Get troubleshooting suggestions
   */
  private async getTroubleshootingSuggestions(
    patterns: any,
    analytics: any[],
    currentWorkflowId?: string
  ): Promise<any[]> {
    const suggestions = [];

    // Common error patterns
    const errorPatterns = patterns.error_patterns || {};
    
    if (Object.keys(errorPatterns).length > 0) {
      suggestions.push({
        type: 'error_diagnosis',
        title: 'Common error patterns detected',
        description: 'Based on your history, here are common issues and solutions',
        patterns: errorPatterns,
        priority: 'high',
        reasoning: 'Previous error patterns can help diagnose current issues'
      });
    }

    // Diagnostic tools
    suggestions.push({
      type: 'diagnostic',
      title: 'Run workflow diagnostics',
      description: 'Use validation tools to identify potential issues',
      actions: ['validate_workflow', 'test_workflow_with_sample_data'],
      priority: 'medium',
      reasoning: 'Systematic diagnosis helps identify root causes'
    });

    // Execution monitoring
    if (currentWorkflowId) {
      suggestions.push({
        type: 'monitoring',
        title: 'Monitor workflow execution',
        description: 'Set up monitoring to catch issues early',
        action: 'monitor_workflow_health',
        priority: 'medium',
        reasoning: 'Proactive monitoring prevents issues from becoming problems'
      });
    }

    // Historical success patterns
    const successfulPatterns = patterns.success_patterns || {};
    if (Object.keys(successfulPatterns).length > 0) {
      suggestions.push({
        type: 'success_pattern',
        title: 'Apply successful patterns',
        description: 'Based on your successful workflows, try these approaches',
        patterns: successfulPatterns,
        priority: 'low',
        reasoning: 'Replicating successful patterns increases likelihood of resolution'
      });
    }

    return suggestions;
  }

  /**
   * Get general suggestions
   */
  private async getGeneralSuggestions(
    patterns: any,
    analytics: any[],
    userGoals: string[]
  ): Promise<any[]> {
    const suggestions = [];

    // Learning opportunities
    const underexploredCategories = this.getUnderexploredCategories(analytics);
    if (underexploredCategories.length > 0) {
      suggestions.push({
        type: 'learning',
        title: 'Explore new capabilities',
        description: `Consider exploring: ${underexploredCategories.join(', ')}`,
        categories: underexploredCategories,
        priority: 'low',
        reasoning: 'Expanding your toolkit increases automation possibilities'
      });
    }

    // Best practices
    suggestions.push({
      type: 'best_practices',
      title: 'Recommended best practices',
      description: 'General recommendations for workflow development',
      practices: [
        'Use descriptive workflow and node names',
        'Implement error handling for all workflows',
        'Test workflows with realistic data',
        'Monitor workflow performance regularly',
        'Document complex workflows'
      ],
      priority: 'low',
      reasoning: 'Following best practices improves long-term maintainability'
    });

    // Goal-based suggestions
    if (userGoals.length > 0) {
      const goalSuggestions = this.getGoalBasedSuggestions(userGoals, patterns);
      suggestions.push(...goalSuggestions);
    }

    return suggestions;
  }

  /**
   * Helper methods
   */
  private getComplementaryTools(recentTools: string[]): string[] {
    const complementaryMap: Record<string, string[]> = {
      'create_workflow': ['auto_connect_nodes', 'generate_workflow_from_description'],
      'list_workflows': ['workflow_analytics', 'optimize_workflow_performance'],
      'get_workflow': ['explain_workflow', 'suggest_workflow_improvements'],
      'run_webhook': ['monitor_workflow_health', 'get_execution'],
      'discover_nodes': ['get_node_info', 'suggest_nodes']
    };

    const complementary = new Set<string>();
    recentTools.forEach(tool => {
      (complementaryMap[tool] || []).forEach(comp => complementary.add(comp));
    });

    return Array.from(complementary);
  }

  private getWorkflowSpecificToolSuggestions(workflow: any): any[] {
    const suggestions = [];

    if (workflow.nodes && workflow.nodes.length > 10) {
      suggestions.push({
        type: 'workflow_specific',
        title: 'Complex workflow optimization',
        description: 'This workflow has many nodes and could benefit from optimization',
        action: 'optimize_workflow_performance',
        priority: 'medium',
        reasoning: 'Complex workflows often have optimization opportunities'
      });
    }

    if (!workflow.active) {
      suggestions.push({
        type: 'workflow_specific',
        title: 'Consider activating workflow',
        description: 'This workflow is inactive - activate it if ready for production',
        action: 'activate_workflow',
        priority: 'low',
        reasoning: 'Inactive workflows don\'t provide value until activated'
      });
    }

    return suggestions;
  }

  private getUnderexploredCategories(analytics: any[]): string[] {
    const usedCategories = new Set(
      analytics
        .filter(record => record.tool_name)
        .map(record => this.getToolCategory(record.tool_name))
    );

    const allCategories = [
      'ai_generation', 'templates', 'monitoring', 'testing', 
      'optimization', 'security', 'collaboration', 'documentation'
    ];

    return allCategories.filter(category => !usedCategories.has(category));
  }

  private getToolCategory(toolName: string): string {
    // Reuse the categorization logic from learn-from-usage.ts
    const categories: Record<string, string> = {
      'generate_workflow_from_description': 'ai_generation',
      'list_workflow_templates': 'templates',
      'monitor_workflow_health': 'monitoring',
      'test_workflow_with_sample_data': 'testing',
      'optimize_workflow_performance': 'optimization',
      'scan_workflow_security': 'security',
      'share_workflow': 'collaboration',
      'generate_workflow_documentation': 'documentation'
    };

    return categories[toolName] || 'workflow_management';
  }

  private getGoalBasedSuggestions(userGoals: string[], patterns: any): any[] {
    const suggestions = [];

    if (userGoals.includes('automation')) {
      suggestions.push({
        type: 'goal_based',
        title: 'Automation enhancement',
        description: 'Set up triggers and monitoring for full automation',
        recommended_tools: ['run_webhook', 'monitor_workflow_health'],
        priority: 'medium',
        reasoning: 'Automation goals require reliable triggers and monitoring'
      });
    }

    if (userGoals.includes('integration')) {
      suggestions.push({
        type: 'goal_based',
        title: 'Integration opportunities',
        description: 'Explore integration tools and API connections',
        recommended_tools: ['browse_integrations', 'test_integration_connectivity'],
        priority: 'medium',
        reasoning: 'Integration goals benefit from exploring available connectors'
      });
    }

    return suggestions;
  }

  private scorePersonalization(suggestion: any, patterns: any, analytics: any[]): number {
    let score = 0;

    // Base score
    score += 50;

    // Priority bonus
    if (suggestion.priority === 'high') score += 30;
    else if (suggestion.priority === 'medium') score += 20;
    else score += 10;

    // Pattern alignment
    if (suggestion.tools) {
      const alignedTools = suggestion.tools.filter((tool: string) => 
        patterns.frequently_used_tools.includes(tool)
      );
      score += alignedTools.length * 10;
    }

    // Recent usage bonus
    if (suggestion.action) {
      const recentUsage = analytics
        .slice(-20)
        .filter(record => record.tool_name === suggestion.action)
        .length;
      score += Math.min(recentUsage * 5, 20);
    }

    return Math.min(score, 100);
  }

  private calculatePersonalizationScore(analytics: any[]): number {
    // Simple scoring based on data richness
    const dataPoints = analytics.length;
    const contextRichData = analytics.filter(record => 
      record.context && Object.keys(record.context).length > 2
    ).length;

    const richness = contextRichData / Math.max(dataPoints, 1);
    return Math.round((Math.min(dataPoints / 50, 1) * 70) + (richness * 30));
  }

  private calculateSuggestionConfidence(patterns: any, analytics: any[]): number {
    // Confidence based on pattern maturity and data consistency
    const dataPoints = analytics.length;
    const patternAge = this.getPatternAge(patterns);
    
    let confidence = Math.min(dataPoints / 100, 1) * 60; // Data volume component
    confidence += Math.min(patternAge / 7, 1) * 40; // Pattern maturity component
    
    return Math.round(confidence);
  }

  private getPatternAge(patterns: any): number {
    if (!patterns.last_updated) return 0;
    
    const lastUpdate = new Date(patterns.last_updated);
    const now = new Date();
    const ageDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, 30 - ageDays); // More recent patterns get higher scores
  }

  private getSuggestionBasis(context: string, patterns: any): string[] {
    const basis = [];
    
    if (patterns.frequently_used_tools.length > 0) {
      basis.push('tool_usage_patterns');
    }
    
    if (patterns.success_patterns && Object.keys(patterns.success_patterns).length > 0) {
      basis.push('success_patterns');
    }
    
    basis.push(`${context}_context`);
    
    return basis;
  }

  /**
   * Get contextual insights
   */
  private async getContextualInsights(
    context: string,
    patterns: any,
    analytics: any[],
    currentWorkflowId?: string
  ): Promise<Record<string, any>> {
    const insights: Record<string, any> = {
      context_analysis: {
        primary_focus: context,
        relevant_patterns: this.getRelevantPatterns(context, patterns),
        historical_success_rate: this.getContextSuccessRate(context, analytics)
      }
    };

    // Add context-specific insights
    if (context === 'workflow_creation') {
      insights.creation_insights = {
        average_nodes_per_workflow: this.getAverageNodeCount(analytics),
        most_successful_templates: patterns.preferred_workflow_types?.slice(0, 3) || [],
        common_starting_points: this.getCommonStartingNodes(analytics)
      };
    }

    if (currentWorkflowId) {
      try {
        const workflow = await this.apiService.getWorkflow(currentWorkflowId);
        insights.current_workflow = {
          name: workflow.name,
          node_count: workflow.nodes?.length || 0,
          active: workflow.active,
          complexity_assessment: this.assessWorkflowComplexity(workflow)
        };
      } catch (error) {
        // Workflow not accessible
      }
    }

    return insights;
  }

  private getRelevantPatterns(context: string, patterns: any): string[] {
    const relevantPatterns = [];
    
    if (context === 'workflow_creation' && patterns.preferred_workflow_types) {
      relevantPatterns.push(...patterns.preferred_workflow_types.slice(0, 3));
    }
    
    if (patterns.frequently_used_tools) {
      const contextRelevantTools = patterns.frequently_used_tools.filter((tool: string) => {
        return this.isToolRelevantToContext(tool, context);
      });
      relevantPatterns.push(...contextRelevantTools.slice(0, 3));
    }
    
    return relevantPatterns;
  }

  private isToolRelevantToContext(tool: string, context: string): boolean {
    const relevanceMap: Record<string, string[]> = {
      'workflow_creation': ['create_workflow', 'generate_workflow_from_description', 'auto_connect_nodes'],
      'tool_selection': ['discover_nodes', 'suggest_nodes', 'get_node_info'],
      'optimization': ['optimize_workflow_performance', 'suggest_node_alternatives'],
      'troubleshooting': ['validate_workflow', 'test_workflow_with_sample_data', 'monitor_workflow_health']
    };

    return relevanceMap[context]?.includes(tool) || false;
  }

  private getContextSuccessRate(context: string, analytics: any[]): number {
    const contextActions = analytics.filter(record => {
      if (context === 'workflow_creation') return record.action === 'workflow_created';
      if (context === 'optimization') return record.action === 'workflow_optimized';
      return record.tool_name && this.isToolRelevantToContext(record.tool_name, context);
    });

    if (contextActions.length === 0) return 0;

    const successful = contextActions.filter(record => record.context?.success === true).length;
    return Math.round((successful / contextActions.length) * 100);
  }

  private getAverageNodeCount(analytics: any[]): number {
    const workflowCreations = analytics.filter(record => 
      record.action === 'workflow_created' && record.context?.node_count
    );

    if (workflowCreations.length === 0) return 0;

    const totalNodes = workflowCreations.reduce((sum, record) => 
      sum + (record.context.node_count || 0), 0
    );

    return Math.round(totalNodes / workflowCreations.length);
  }

  private getCommonStartingNodes(analytics: any[]): string[] {
    // This would require more detailed analytics about workflow structures
    // For now, return common trigger nodes
    return ['Webhook', 'Schedule Trigger', 'Manual Trigger'];
  }

  private assessWorkflowComplexity(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    
    if (nodeCount < 5) return 'simple';
    if (nodeCount < 15) return 'moderate';
    return 'complex';
  }
}