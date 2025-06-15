/**
 * Learn From Usage Tool Handler
 *
 * Tracks AI usage patterns and workflow interaction history to improve future recommendations.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseAdaptiveLearningHandler, UsageAnalytics } from './base-handler.js';

/**
 * Handler for learning from usage patterns
 */
export class LearnFromUsageHandler extends BaseAdaptiveLearningHandler {
  /**
   * Execute the learn from usage tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return await this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['action']);

      const { action, tool_name, workflow_id, context, metadata } = args;

      // Validate action type
      const validActions = ['tool_used', 'workflow_created', 'workflow_executed', 'workflow_failed', 'workflow_optimized'];
      if (!validActions.includes(action)) {
        throw new Error(`Invalid action. Must be one of: ${validActions.join(', ')}`);
      }

      // Create usage record
      const usageRecord: UsageAnalytics = {
        timestamp: new Date().toISOString(),
        action,
        tool_name,
        workflow_id,
        context: context || {},
        metadata: metadata || {}
      };

      // Add additional context based on action type
      switch (action) {
        case 'tool_used':
          if (tool_name) {
            usageRecord.context = {
              ...usageRecord.context,
              category: this.getToolCategory(tool_name),
              usage_frequency: await this.getToolUsageFrequency(tool_name)
            };
          }
          break;

        case 'workflow_created':
        case 'workflow_executed':
        case 'workflow_failed':
          if (workflow_id) {
            try {
              const workflowData = await this.apiService.getWorkflow(workflow_id);
              usageRecord.context = {
                ...usageRecord.context,
                workflow_name: workflowData.name,
                node_count: workflowData.nodes?.length || 0,
                active: workflowData.active,
                tags: workflowData.tags || []
              };
            } catch (error) {
              // Workflow might not exist, continue without additional context
            }
          }
          break;

        case 'workflow_optimized':
          // Track optimization success/failure and metrics
          usageRecord.context = {
            ...usageRecord.context,
            optimization_type: context?.optimization_type || 'unknown',
            performance_improvement: context?.performance_improvement || null
          };
          break;
      }

      // Store the usage record
      this.addUsageRecord(usageRecord);

      // Update AI patterns based on new data
      this.updateAIPatterns();

      // Generate insights from recent usage
      const insights = await this.generateUsageInsights();

      const result = {
        success: true,
        message: 'Usage pattern recorded successfully',
        record_id: this.generateRecordId(usageRecord),
        insights: insights,
        patterns_updated: true,
        analytics_summary: {
          total_records: this.loadUsageAnalytics().length,
          recent_actions: this.getRecentActionsSummary(),
          learning_status: this.getLearningStatus()
        }
      };

      return this.formatSuccess(result, 'Usage pattern learning completed');
    }, args);
  }

  /**
   * Get tool category based on tool name
   */
  private getToolCategory(toolName: string): string {
    const categories: Record<string, string> = {
      // Workflow tools
      'list_workflows': 'workflow_management',
      'get_workflow': 'workflow_management',
      'create_workflow': 'workflow_management',
      'update_workflow': 'workflow_management',
      'delete_workflow': 'workflow_management',
      'activate_workflow': 'workflow_management',
      'deactivate_workflow': 'workflow_management',

      // Execution tools
      'list_executions': 'execution',
      'get_execution': 'execution',
      'run_webhook': 'execution',

      // AI Generation tools
      'generate_workflow_from_description': 'ai_generation',
      'suggest_workflow_improvements': 'ai_generation',
      'auto_connect_nodes': 'ai_generation',
      'explain_workflow': 'ai_generation',

      // Discovery tools
      'discover_nodes': 'discovery',
      'get_node_info': 'discovery',
      'suggest_nodes': 'discovery',

      // Templates
      'list_workflow_templates': 'templates',
      'create_workflow_from_template': 'templates',

      // Monitoring
      'monitor_workflow_health': 'monitoring',
      'get_workflow_performance_metrics': 'monitoring',

      // Testing
      'test_workflow_with_sample_data': 'testing',
      'validate_workflow_performance': 'testing',

      // Optimization
      'optimize_workflow_performance': 'optimization',
      'suggest_node_alternatives': 'optimization'
    };

    return categories[toolName] || 'other';
  }

  /**
   * Get tool usage frequency
   */
  private async getToolUsageFrequency(toolName: string): Promise<number> {
    const analytics = this.loadUsageAnalytics();
    return analytics.filter(record => record.tool_name === toolName).length;
  }

  /**
   * Generate record ID
   */
  private generateRecordId(record: UsageAnalytics): string {
    return `${record.action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate insights from recent usage
   */
  private async generateUsageInsights(): Promise<Record<string, any>> {
    const analytics = this.loadUsageAnalytics();
    const patterns = this.loadAIPatterns();
    
    // Get recent data (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAnalytics = analytics.filter(record => 
      new Date(record.timestamp) > weekAgo
    );

    return {
      recent_activity: {
        total_actions: recentAnalytics.length,
        unique_tools_used: new Set(recentAnalytics.map(r => r.tool_name).filter(Boolean)).size,
        most_active_day: this.getMostActiveDay(recentAnalytics),
        success_rate: this.calculateSuccessRate(recentAnalytics)
      },
      trending_tools: this.getTrendingTools(recentAnalytics),
      learning_insights: {
        complexity_preference: patterns.success_patterns.preferred_complexity || 'unknown',
        common_workflow_patterns: patterns.preferred_workflow_types.slice(0, 3),
        optimization_opportunities: this.identifyOptimizationOpportunities(analytics)
      },
      recommendations: {
        suggested_tools: this.getSuggestedTools(patterns),
        workflow_improvements: this.getWorkflowImprovements(recentAnalytics),
        efficiency_tips: this.getEfficiencyTips(patterns)
      }
    };
  }

  /**
   * Get recent actions summary
   */
  private getRecentActionsSummary(): Record<string, number> {
    const analytics = this.loadUsageAnalytics();
    const recentAnalytics = analytics.slice(-50); // Last 50 actions
    
    const summary: Record<string, number> = {};
    recentAnalytics.forEach(record => {
      summary[record.action] = (summary[record.action] || 0) + 1;
    });
    
    return summary;
  }

  /**
   * Get learning status
   */
  private getLearningStatus(): Record<string, any> {
    const analytics = this.loadUsageAnalytics();
    const patterns = this.loadAIPatterns();
    
    return {
      total_data_points: analytics.length,
      learning_maturity: analytics.length > 100 ? 'mature' : analytics.length > 50 ? 'developing' : 'initial',
      pattern_confidence: this.calculatePatternConfidence(analytics),
      last_pattern_update: patterns.last_updated,
      data_quality: this.assessDataQuality(analytics)
    };
  }

  /**
   * Helper methods for insights generation
   */
  private getMostActiveDay(analytics: UsageAnalytics[]): string {
    const dayCounts: Record<string, number> = {};
    analytics.forEach(record => {
      const day = new Date(record.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    
    return Object.entries(dayCounts).reduce((a, b) => dayCounts[a[0]] > dayCounts[b[0]] ? a : b)[0] || 'Unknown';
  }

  private calculateSuccessRate(analytics: UsageAnalytics[]): number {
    const actionsWithSuccess = analytics.filter(record => record.context?.success !== undefined);
    if (actionsWithSuccess.length === 0) return 0;
    
    const successful = actionsWithSuccess.filter(record => record.context?.success === true).length;
    return Math.round((successful / actionsWithSuccess.length) * 100);
  }

  private getTrendingTools(analytics: UsageAnalytics[]): string[] {
    const toolCounts: Record<string, number> = {};
    analytics.forEach(record => {
      if (record.tool_name) {
        toolCounts[record.tool_name] = (toolCounts[record.tool_name] || 0) + 1;
      }
    });
    
    return Object.entries(toolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tool]) => tool);
  }

  private identifyOptimizationOpportunities(analytics: UsageAnalytics[]): string[] {
    const opportunities: string[] = [];
    
    // Check for slow executions
    const slowExecutions = analytics.filter(record => 
      record.context?.execution_time > 30000 // 30 seconds
    );
    if (slowExecutions.length > 0) {
      opportunities.push('Optimize slow workflow executions');
    }
    
    // Check for failed workflows
    const failures = analytics.filter(record => record.action === 'workflow_failed');
    if (failures.length > analytics.length * 0.1) { // More than 10% failure rate
      opportunities.push('Investigate and fix recurring workflow failures');
    }
    
    // Check for underused tools
    const toolUsage = analytics.filter(record => record.tool_name).length;
    if (toolUsage < analytics.length * 0.3) { // Less than 30% tool usage
      opportunities.push('Explore more automation tools to increase efficiency');
    }
    
    return opportunities;
  }

  private getSuggestedTools(patterns: any): string[] {
    // Return tools that complement frequently used ones
    const suggestions: string[] = [];
    
    if (patterns.frequently_used_tools.includes('create_workflow')) {
      suggestions.push('generate_workflow_from_description', 'auto_connect_nodes');
    }
    
    if (patterns.frequently_used_tools.includes('list_workflows')) {
      suggestions.push('workflow_analytics', 'optimize_workflow_performance');
    }
    
    return suggestions.slice(0, 3);
  }

  private getWorkflowImprovements(analytics: UsageAnalytics[]): string[] {
    const improvements: string[] = [];
    
    const workflowActions = analytics.filter(record => 
      record.action.includes('workflow')
    );
    
    if (workflowActions.length > 0) {
      improvements.push('Add error handling to workflows');
      improvements.push('Implement workflow monitoring');
      improvements.push('Use templates for common patterns');
    }
    
    return improvements;
  }

  private getEfficiencyTips(patterns: any): string[] {
    return [
      'Use batch operations for multiple workflows',
      'Leverage AI generation tools for faster development',
      'Monitor workflow performance regularly',
      'Create reusable templates for common tasks'
    ];
  }

  private calculatePatternConfidence(analytics: UsageAnalytics[]): number {
    // Simple confidence based on data volume and recency
    const dataPoints = analytics.length;
    const recentData = analytics.filter(record => 
      new Date(record.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    let confidence = Math.min(dataPoints / 100, 1) * 70; // Up to 70% based on volume
    confidence += Math.min(recentData / 20, 1) * 30; // Up to 30% based on recency
    
    return Math.round(confidence);
  }

  private assessDataQuality(analytics: UsageAnalytics[]): string {
    const withContext = analytics.filter(record => 
      record.context && Object.keys(record.context).length > 0
    ).length;
    
    const qualityRatio = withContext / analytics.length;
    
    if (qualityRatio > 0.8) return 'high';
    if (qualityRatio > 0.5) return 'medium';
    return 'low';
  }
}