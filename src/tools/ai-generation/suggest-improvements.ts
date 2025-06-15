/**
 * Suggest Workflow Improvements Tool
 *
 * This module provides AI analysis of workflows with optimization suggestions.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from '../templates/base-handler.js';

/**
 * Handler for suggesting workflow improvements
 */
export class SuggestWorkflowImprovementsHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId']);
      
      const { workflowId, analysisType = 'comprehensive' } = args;

      try {
        // Get the workflow
        const workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new Error(`Workflow with ID "${workflowId}" not found`);
        }

        // Get workflow executions for performance analysis
        const executions = await this.apiService.getExecutions({ 
          workflowId, 
          limit: 10 
        });

        // Analyze workflow and generate suggestions
        const analysis = this.analyzeWorkflow(workflow, executions);
        const suggestions = this.generateSuggestions(analysis, analysisType);

        const result = {
          workflowId,
          workflowName: workflow.name,
          analysis,
          suggestions: suggestions.map((suggestion: any) => ({
            type: suggestion.type,
            priority: suggestion.priority,
            title: suggestion.title,
            description: suggestion.description,
            impact: suggestion.impact,
            implementation: suggestion.implementation,
            estimatedEffort: suggestion.estimatedEffort
          })),
          overallScore: this.calculateOverallScore(analysis),
          summary: this.generateSummary(suggestions)
        };

        return this.formatSuccess(result, `Generated ${suggestions.length} improvement suggestions for workflow "${workflow.name}"`);
      } catch (error) {
        throw new Error(`Failed to analyze workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Analyze workflow structure and performance
   */
  private analyzeWorkflow(workflow: any, executions: any[]): any {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    
    return {
      structure: this.analyzeStructure(nodes, connections),
      performance: this.analyzePerformance(executions),
      security: this.analyzeSecurity(nodes),
      maintainability: this.analyzeMaintainability(workflow),
      errorHandling: this.analyzeErrorHandling(nodes, connections),
      efficiency: this.analyzeEfficiency(nodes, connections)
    };
  }

  /**
   * Analyze workflow structure
   */
  private analyzeStructure(nodes: any[], connections: any): any {
    const triggerNodes = nodes.filter((node: any) => 
      node.type.includes('trigger') || node.type.includes('webhook')
    );
    
    const actionNodes = nodes.filter((node: any) => 
      !node.type.includes('trigger') && !node.type.includes('webhook')
    );

    const orphanedNodes = nodes.filter((node: any) => {
      const hasIncoming = Object.values(connections).some((conn: any) =>
        conn.main && conn.main[0] && conn.main[0].some((c: any) => c.node === node.name)
      );
      const hasOutgoing = connections[node.name];
      return !hasIncoming && !hasOutgoing && !node.type.includes('trigger');
    });

    return {
      totalNodes: nodes.length,
      triggerNodes: triggerNodes.length,
      actionNodes: actionNodes.length,
      orphanedNodes: orphanedNodes.length,
      maxDepth: this.calculateMaxDepth(connections),
      parallelBranches: this.calculateParallelBranches(connections),
      complexity: this.calculateComplexityScore(nodes, connections)
    };
  }

  /**
   * Analyze workflow performance
   */
  private analyzePerformance(executions: any[]): any {
    if (executions.length === 0) {
      return {
        avgExecutionTime: 0,
        successRate: 100,
        errorRate: 0,
        lastExecution: null,
        trends: 'insufficient_data'
      };
    }

    const successful = executions.filter((e: any) => e.finished && !e.stoppedAt);
    const failed = executions.filter((e: any) => e.finished && e.stoppedAt);
    
    const executionTimes = executions
      .filter((e: any) => e.startedAt && e.stoppedAt)
      .map((e: any) => new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime());

    return {
      avgExecutionTime: executionTimes.length > 0 ? 
        executionTimes.reduce((a: number, b: number) => a + b, 0) / executionTimes.length : 0,
      successRate: (successful.length / executions.length) * 100,
      errorRate: (failed.length / executions.length) * 100,
      lastExecution: executions[0]?.startedAt,
      trends: this.analyzeTrends(executions)
    };
  }

  /**
   * Analyze security aspects
   */
  private analyzeSecurity(nodes: any[]): any {
    const securityIssues: any[] = [];
    const credentialNodes = nodes.filter((node: any) => node.credentials && Object.keys(node.credentials).length > 0);
    
    // Check for hardcoded credentials
    nodes.forEach((node: any) => {
      if (node.parameters) {
        const paramStr = JSON.stringify(node.parameters);
        if (paramStr.includes('password') || paramStr.includes('apikey') || paramStr.includes('secret')) {
          securityIssues.push({
            node: node.name,
            issue: 'potential_hardcoded_credentials',
            severity: 'high'
          });
        }
      }
    });

    // Check for unencrypted HTTP requests
    nodes.forEach((node: any) => {
      if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters?.url?.startsWith('http://')) {
        securityIssues.push({
          node: node.name,
          issue: 'unencrypted_http',
          severity: 'medium'
        });
      }
    });

    return {
      credentialNodesCount: credentialNodes.length,
      securityIssues,
      securityScore: Math.max(0, 100 - (securityIssues.length * 20))
    };
  }

  /**
   * Analyze maintainability
   */
  private analyzeMaintainability(workflow: any): any {
    const nodes = workflow.nodes || [];
    
    // Check for descriptive names
    const poorlyNamedNodes = nodes.filter((node: any) => 
      /^(Node|HTTP Request|Function)\d*$/.test(node.name)
    );

    // Check for documentation
    const documentedNodes = nodes.filter((node: any) => 
      node.parameters?.notes || node.parameters?.description
    );

    // Check for complex functions
    const complexFunctions = nodes.filter((node: any) => 
      node.type === 'n8n-nodes-base.function' && 
      node.parameters?.functionCode && 
      node.parameters.functionCode.split('\n').length > 20
    );

    return {
      poorlyNamedNodes: poorlyNamedNodes.length,
      documentationCoverage: (documentedNodes.length / nodes.length) * 100,
      complexFunctions: complexFunctions.length,
      maintainabilityScore: Math.max(0, 100 - (poorlyNamedNodes.length * 10) - (complexFunctions.length * 15))
    };
  }

  /**
   * Analyze error handling
   */
  private analyzeErrorHandling(nodes: any[], connections: any): any {
    const errorHandlingNodes = nodes.filter((node: any) => 
      node.type === 'n8n-nodes-base.errorTrigger' ||
      node.continueOnFail === true
    );

    const criticalNodes = nodes.filter((node: any) => 
      node.type.includes('http') || 
      node.type.includes('database') ||
      node.type.includes('api')
    );

    return {
      errorHandlingNodes: errorHandlingNodes.length,
      criticalNodesWithoutErrorHandling: criticalNodes.filter((node: any) => 
        !node.continueOnFail && 
        !this.hasErrorHandling(node, connections)
      ).length,
      errorHandlingCoverage: criticalNodes.length > 0 ? 
        (criticalNodes.filter((node: any) => node.continueOnFail || this.hasErrorHandling(node, connections)).length / criticalNodes.length) * 100 : 100
    };
  }

  /**
   * Analyze efficiency
   */
  private analyzeEfficiency(nodes: any[], connections: any): any {
    const inefficiencies = [];
    
    // Check for sequential operations that could be parallel
    const sequentialChains = this.findSequentialChains(connections);
    if (sequentialChains.length > 3) {
      inefficiencies.push('long_sequential_chains');
    }

    // Check for redundant HTTP requests
    const httpNodes = nodes.filter((node: any) => node.type === 'n8n-nodes-base.httpRequest');
    const duplicateRequests = this.findDuplicateRequests(httpNodes);
    if (duplicateRequests.length > 0) {
      inefficiencies.push('duplicate_http_requests');
    }

    return {
      inefficiencies,
      sequentialChainLength: Math.max(...sequentialChains, 0),
      duplicateRequests: duplicateRequests.length,
      efficiencyScore: Math.max(0, 100 - (inefficiencies.length * 20))
    };
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(analysis: any, analysisType: string): any[] {
    const suggestions = [];

    // Structure improvements
    if (analysis.structure.orphanedNodes > 0) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        title: 'Remove Orphaned Nodes',
        description: `Found ${analysis.structure.orphanedNodes} orphaned nodes that are not connected to the workflow`,
        impact: 'Reduces confusion and improves workflow clarity',
        implementation: 'Delete unused nodes or connect them to the workflow',
        estimatedEffort: 'low'
      });
    }

    if (analysis.structure.complexity > 8) {
      suggestions.push({
        type: 'structure',
        priority: 'medium',
        title: 'Reduce Workflow Complexity',
        description: 'Workflow complexity is high, consider breaking it into smaller sub-workflows',
        impact: 'Improves maintainability and debugging',
        implementation: 'Split complex workflow into multiple simpler workflows',
        estimatedEffort: 'high'
      });
    }

    // Performance improvements
    if (analysis.performance.avgExecutionTime > 30000) {
      suggestions.push({
        type: 'performance',
        priority: 'high',
        title: 'Optimize Execution Time',
        description: 'Average execution time is over 30 seconds',
        impact: 'Faster workflow execution and better user experience',
        implementation: 'Add parallel processing, optimize database queries, or cache results',
        estimatedEffort: 'medium'
      });
    }

    if (analysis.performance.errorRate > 10) {
      suggestions.push({
        type: 'reliability',
        priority: 'high',
        title: 'Improve Error Rate',
        description: `Error rate is ${analysis.performance.errorRate.toFixed(1)}%`,
        impact: 'More reliable workflow execution',
        implementation: 'Add error handling, input validation, and retry logic',
        estimatedEffort: 'medium'
      });
    }

    // Security improvements
    analysis.security.securityIssues.forEach((issue: any) => {
      suggestions.push({
        type: 'security',
        priority: issue.severity === 'high' ? 'high' : 'medium',
        title: `Security Issue: ${issue.issue}`,
        description: `Security issue found in node "${issue.node}"`,
        impact: 'Reduces security vulnerabilities',
        implementation: issue.issue === 'potential_hardcoded_credentials' ? 
          'Move credentials to n8n credential system' : 
          'Use HTTPS instead of HTTP',
        estimatedEffort: 'low'
      });
    });

    // Maintainability improvements
    if (analysis.maintainability.documentationCoverage < 50) {
      suggestions.push({
        type: 'maintainability',
        priority: 'medium',
        title: 'Improve Documentation',
        description: `Only ${analysis.maintainability.documentationCoverage.toFixed(1)}% of nodes have documentation`,
        impact: 'Easier workflow understanding and maintenance',
        implementation: 'Add descriptions and notes to workflow nodes',
        estimatedEffort: 'low'
      });
    }

    // Error handling improvements
    if (analysis.errorHandling.errorHandlingCoverage < 80) {
      suggestions.push({
        type: 'reliability',
        priority: 'high',
        title: 'Add Error Handling',
        description: `${analysis.errorHandling.criticalNodesWithoutErrorHandling} critical nodes lack error handling`,
        impact: 'More robust workflow execution',
        implementation: 'Enable "Continue on Fail" for critical nodes or add Error Trigger nodes',
        estimatedEffort: 'medium'
      });
    }

    // Efficiency improvements
    analysis.efficiency.inefficiencies.forEach((inefficiency: string) => {
      if (inefficiency === 'long_sequential_chains') {
        suggestions.push({
          type: 'performance',
          priority: 'medium',
          title: 'Add Parallel Processing',
          description: 'Long sequential chains could benefit from parallel execution',
          impact: 'Faster workflow execution',
          implementation: 'Restructure workflow to process independent operations in parallel',
          estimatedEffort: 'high'
        });
      }
    });

    return suggestions.slice(0, analysisType === 'quick' ? 5 : 15);
  }

  /**
   * Calculate overall workflow score
   */
  private calculateOverallScore(analysis: any): number {
    const weights = {
      structure: 0.2,
      performance: 0.25,
      security: 0.2,
      maintainability: 0.15,
      errorHandling: 0.15,
      efficiency: 0.05
    };

    const structureScore = Math.max(0, 100 - (analysis.structure.complexity * 5) - (analysis.structure.orphanedNodes * 10));
    const performanceScore = Math.max(0, 100 - analysis.performance.errorRate * 2);
    
    return Math.round(
      structureScore * weights.structure +
      performanceScore * weights.performance +
      analysis.security.securityScore * weights.security +
      analysis.maintainability.maintainabilityScore * weights.maintainability +
      analysis.errorHandling.errorHandlingCoverage * weights.errorHandling +
      analysis.efficiency.efficiencyScore * weights.efficiency
    );
  }

  /**
   * Generate summary
   */
  private generateSummary(suggestions: any[]): string {
    const priorities = suggestions.reduce((acc: any, s: any) => {
      acc[s.priority] = (acc[s.priority] || 0) + 1;
      return acc;
    }, {});

    return `Found ${suggestions.length} improvement opportunities: ${priorities.high || 0} high priority, ${priorities.medium || 0} medium priority, ${priorities.low || 0} low priority.`;
  }

  // Helper methods
  private calculateMaxDepth(connections: any): number {
    // Simplified depth calculation
    return Object.keys(connections).length;
  }

  private calculateParallelBranches(connections: any): number {
    // Simplified parallel branch calculation
    return Math.max(...Object.values(connections).map((conn: any) => 
      conn.main?.[0]?.length || 0
    ), 0);
  }

  private calculateComplexityScore(nodes: any[], connections: any): number {
    return nodes.length + Object.keys(connections).length;
  }

  private analyzeTrends(executions: any[]): string {
    return executions.length > 5 ? 'stable' : 'insufficient_data';
  }

  private hasErrorHandling(node: any, connections: any): boolean {
    // Check if node has error handling connections
    return false; // Simplified for now
  }

  private findSequentialChains(connections: any): number[] {
    // Simplified sequential chain detection
    return [Object.keys(connections).length];
  }

  private findDuplicateRequests(httpNodes: any[]): any[] {
    // Simplified duplicate request detection
    return [];
  }
}

/**
 * Get the tool definition for suggesting workflow improvements
 */
export function getSuggestWorkflowImprovementsToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_workflow_improvements',
    description: 'AI analysis of workflows with optimization suggestions for performance, security, and maintainability',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to analyze'
        },
        analysisType: {
          type: 'string',
          enum: ['quick', 'comprehensive'],
          description: 'Type of analysis to perform',
          default: 'comprehensive'
        }
      },
      required: ['workflowId']
    }
  };
}