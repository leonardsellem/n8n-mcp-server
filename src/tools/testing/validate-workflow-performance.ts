/**
 * Validate Workflow Performance Tool
 * 
 * This tool analyzes workflows for performance bottlenecks and inefficiencies.
 */

import { BaseTestingToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the validate_workflow_performance tool
 */
export class ValidateWorkflowPerformanceHandler extends BaseTestingToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow ID and analysis options
   * @returns Performance analysis results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, includeExecutions, executionLimit, analysisDepth } = args;
      
      this.validateRequiredParams(args, ['workflowId']);
      
      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
      }

      // Get recent executions for performance analysis
      let executions: any[] = [];
      if (includeExecutions !== false) {
        try {
          const executionData = await this.apiService.getExecutions({
            workflowId,
            limit: executionLimit || 20,
            includeData: true
          });
          executions = Array.isArray(executionData) ? executionData : ((executionData as any)?.data || []);
        } catch (error) {
          console.warn('Could not fetch executions for performance analysis:', error);
        }
      }

      // Perform comprehensive performance analysis
      const analysis = this.performPerformanceAnalysis(workflow, executions, analysisDepth);

      return this.formatSuccess(
        analysis,
        `Performance analysis completed for workflow: ${workflow.name}`
      );
    }, args);
  }

  /**
   * Perform comprehensive performance analysis
   */
  private performPerformanceAnalysis(workflow: any, executions: any[], depth: string = 'standard'): any {
    const analysis: Record<string, any> = {
      workflowInfo: {
        id: workflow.id,
        name: workflow.name,
        nodeCount: workflow.nodes?.length || 0,
        active: workflow.active
      },
      performanceMetrics: this.calculatePerformanceMetrics(executions),
      bottleneckAnalysis: this.analyzePerformanceBottlenecks(workflow, executions),
      nodeAnalysis: this.analyzeNodes(workflow.nodes || []),
      recommendations: [] as string[],
      score: {
        overall: 0,
        efficiency: 0,
        reliability: 0,
        maintainability: 0
      }
    };

    // Add detailed analysis if requested
    if (depth === 'detailed') {
      analysis.detailedNodeMetrics = this.getDetailedNodeMetrics(workflow.nodes || [], executions);
      analysis.executionPatterns = this.analyzeExecutionPatterns(executions);
      analysis.resourceUsage = this.analyzeResourceUsage(executions);
    }

    // Generate recommendations
    analysis.recommendations = this.generatePerformanceRecommendations(analysis);

    // Calculate scores
    analysis.score = this.calculatePerformanceScores(analysis);

    return analysis;
  }

  /**
   * Calculate performance metrics from executions
   */
  private calculatePerformanceMetrics(executions: any[]): any {
    if (executions.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 0,
        averageExecutionTime: 0,
        medianExecutionTime: 0,
        failureRate: 0
      };
    }

    const successfulExecutions = executions.filter(e => e.finished && !e.data?.resultData?.error);
    const executionTimes = executions
      .filter(e => e.startedAt && e.stoppedAt)
      .map(e => new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime());

    const sortedTimes = executionTimes.sort((a, b) => a - b);
    const medianTime = sortedTimes.length > 0 
      ? sortedTimes[Math.floor(sortedTimes.length / 2)]
      : 0;

    return {
      totalExecutions: executions.length,
      successRate: (successfulExecutions.length / executions.length) * 100,
      averageExecutionTime: executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length || 0,
      medianExecutionTime: medianTime,
      failureRate: ((executions.length - successfulExecutions.length) / executions.length) * 100,
      minExecutionTime: Math.min(...executionTimes) || 0,
      maxExecutionTime: Math.max(...executionTimes) || 0
    };
  }

  /**
   * Analyze individual nodes for performance issues
   */
  private analyzeNodes(nodes: any[]): any {
    const analysis = {
      totalNodes: nodes.length,
      nodeTypes: {} as Record<string, number>,
      potentialBottlenecks: [] as Array<{nodeName: any, nodeType: any, risk: number, reasons: string[]}>,
      complexNodes: [] as Array<{nodeName: any, nodeType: any, complexity: any}>,
      recommendations: [] as string[]
    };

    for (const node of nodes) {
      // Count node types
      const nodeType = node.type || 'unknown';
      analysis.nodeTypes[nodeType] = (analysis.nodeTypes[nodeType] || 0) + 1;

      // Identify potential bottlenecks
      const bottleneckRisk = this.assessNodeBottleneckRisk(node);
      if (bottleneckRisk.risk > 5) {
        analysis.potentialBottlenecks.push({
          nodeName: node.name,
          nodeType: node.type,
          risk: bottleneckRisk.risk,
          reasons: bottleneckRisk.reasons
        });
      }

      // Identify complex nodes
      if (this.isNodeComplex(node)) {
        analysis.complexNodes.push({
          nodeName: node.name,
          nodeType: node.type,
          complexity: this.getNodeComplexity(node)
        });
      }
    }

    return analysis;
  }

  /**
   * Assess bottleneck risk for a node
   */
  private assessNodeBottleneckRisk(node: any): { risk: number; reasons: string[] } {
    let risk = 0;
    const reasons: string[] = [];

    // HTTP Request nodes can be slow
    if (node.type === 'n8n-nodes-base.httpRequest') {
      risk += 6;
      reasons.push('HTTP requests can be slow and unreliable');
    }

    // Function nodes with complex code
    if (node.type === 'n8n-nodes-base.function' || node.type === 'n8n-nodes-base.code') {
      risk += 4;
      reasons.push('Custom code execution can be resource intensive');
    }

    // Database operations
    if (node.type.includes('database') || node.type.includes('sql') || node.type.includes('mysql') || node.type.includes('postgres')) {
      risk += 5;
      reasons.push('Database operations can be slow without proper optimization');
    }

    // Wait nodes
    if (node.type === 'n8n-nodes-base.wait') {
      risk += 3;
      reasons.push('Wait nodes introduce deliberate delays');
    }

    // Nested workflow execution
    if (node.type === 'n8n-nodes-base.executeWorkflow') {
      risk += 7;
      reasons.push('Nested workflow execution adds significant overhead');
    }

    // Large parameter sets
    if (node.parameters && Object.keys(node.parameters).length > 15) {
      risk += 2;
      reasons.push('Node has many parameters which may indicate complexity');
    }

    return { risk, reasons };
  }

  /**
   * Check if a node is complex
   */
  private isNodeComplex(node: any): boolean {
    const complexTypes = [
      'n8n-nodes-base.function',
      'n8n-nodes-base.code',
      'n8n-nodes-base.executeWorkflow',
      'n8n-nodes-base.httpRequest'
    ];

    return complexTypes.includes(node.type) || 
           (node.parameters && Object.keys(node.parameters).length > 10);
  }

  /**
   * Get node complexity score
   */
  private getNodeComplexity(node: any): any {
    return {
      parameterCount: node.parameters ? Object.keys(node.parameters).length : 0,
      hasCustomCode: node.type.includes('function') || node.type.includes('code'),
      hasExternalDependencies: node.type.includes('http') || node.type.includes('webhook'),
      isConditional: node.type.includes('if') || node.type.includes('switch')
    };
  }

  /**
   * Get detailed node metrics from execution data
   */
  private getDetailedNodeMetrics(nodes: any[], executions: any[]): any {
    const metrics: Record<string, any> = {};

    for (const node of nodes) {
      metrics[node.name] = {
        executionCount: 0,
        totalExecutionTime: 0,
        averageExecutionTime: 0,
        failureCount: 0,
        successRate: 0
      };
    }

    // Analyze execution data
    for (const execution of executions) {
      if (execution.data?.resultData?.runData) {
        for (const [nodeName, nodeData] of Object.entries(execution.data.resultData.runData)) {
          if (metrics[nodeName]) {
            metrics[nodeName].executionCount++;
            
            const nodeArray = nodeData as any[];
            if (nodeArray && nodeArray[0]) {
              if (nodeArray[0].error) {
                metrics[nodeName].failureCount++;
              } else if (nodeArray[0].executionTime) {
                metrics[nodeName].totalExecutionTime += nodeArray[0].executionTime;
              }
            }
          }
        }
      }
    }

    // Calculate averages and rates
    for (const nodeName of Object.keys(metrics)) {
      const metric = metrics[nodeName];
      if (metric.executionCount > 0) {
        metric.averageExecutionTime = metric.totalExecutionTime / metric.executionCount;
        metric.successRate = ((metric.executionCount - metric.failureCount) / metric.executionCount) * 100;
      }
    }

    return metrics;
  }

  /**
   * Analyze execution patterns
   */
  private analyzeExecutionPatterns(executions: any[]): any {
    const patterns = {
      peakHours: {} as Record<number, number>,
      dayOfWeekDistribution: {} as Record<number, number>,
      executionFrequency: 'unknown',
      trends: 'stable'
    };

    if (executions.length === 0) return patterns;

    // Analyze execution times
    for (const execution of executions) {
      if (execution.startedAt) {
        const date = new Date(execution.startedAt);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();

        patterns.peakHours[hour] = (patterns.peakHours[hour] || 0) + 1;
        patterns.dayOfWeekDistribution[dayOfWeek] = (patterns.dayOfWeekDistribution[dayOfWeek] || 0) + 1;
      }
    }

    return patterns;
  }

  /**
   * Analyze resource usage
   */
  private analyzeResourceUsage(executions: any[]): any {
    return {
      memoryUsage: 'Not available in current n8n API',
      cpuUsage: 'Not available in current n8n API',
      networkRequests: this.countNetworkRequests(executions),
      estimatedCost: this.estimateExecutionCost(executions)
    };
  }

  /**
   * Count network requests in executions
   */
  private countNetworkRequests(executions: any[]): number {
    let count = 0;
    for (const execution of executions) {
      if (execution.data?.resultData?.runData) {
        for (const nodeData of Object.values(execution.data.resultData.runData)) {
          const nodeArray = nodeData as any[];
          if (nodeArray && nodeArray[0] && nodeArray[0].data) {
            // Approximate network requests based on HTTP-related nodes
            count++;
          }
        }
      }
    }
    return count;
  }

  /**
   * Estimate execution cost (simplified)
   */
  private estimateExecutionCost(executions: any[]): any {
    const avgExecutionTime = executions.length > 0 
      ? executions.reduce((sum, exec) => {
          if (exec.startedAt && exec.stoppedAt) {
            return sum + (new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());
          }
          return sum;
        }, 0) / executions.length
      : 0;

    return {
      averageExecutionTimeMs: avgExecutionTime,
      estimatedMonthlyCost: 'Depends on hosting infrastructure',
      resourceEfficiency: avgExecutionTime < 10000 ? 'Good' : avgExecutionTime < 60000 ? 'Fair' : 'Poor'
    };
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    // Based on execution metrics
    if (analysis.performanceMetrics.successRate < 90) {
      recommendations.push('Low success rate detected - review error handling and node configurations');
    }

    if (analysis.performanceMetrics.averageExecutionTime > 60000) {
      recommendations.push('High average execution time - consider optimizing slow nodes or breaking into smaller workflows');
    }

    // Based on node analysis
    if (analysis.nodeAnalysis.potentialBottlenecks.length > 0) {
      recommendations.push(`${analysis.nodeAnalysis.potentialBottlenecks.length} potential bottlenecks identified - review highlighted nodes`);
    }

    if (analysis.nodeAnalysis.totalNodes > 20) {
      recommendations.push('Large workflow detected - consider breaking into smaller, more manageable workflows');
    }

    // Based on complexity
    if (analysis.nodeAnalysis.complexNodes.length > 5) {
      recommendations.push('High number of complex nodes - consider simplifying logic where possible');
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Workflow appears to be well-optimized - monitor performance regularly');
    }

    return recommendations;
  }

  /**
   * Calculate performance scores
   */
  private calculatePerformanceScores(analysis: any): any {
    let efficiency = 100;
    let reliability = 100;
    let maintainability = 100;

    // Efficiency score
    if (analysis.performanceMetrics.averageExecutionTime > 60000) efficiency -= 20;
    if (analysis.performanceMetrics.averageExecutionTime > 300000) efficiency -= 30;
    if (analysis.nodeAnalysis.potentialBottlenecks.length > 0) efficiency -= (analysis.nodeAnalysis.potentialBottlenecks.length * 10);

    // Reliability score
    if (analysis.performanceMetrics.successRate < 95) reliability -= 20;
    if (analysis.performanceMetrics.successRate < 80) reliability -= 30;

    // Maintainability score
    if (analysis.nodeAnalysis.totalNodes > 15) maintainability -= 15;
    if (analysis.nodeAnalysis.totalNodes > 25) maintainability -= 25;
    if (analysis.nodeAnalysis.complexNodes.length > 3) maintainability -= (analysis.nodeAnalysis.complexNodes.length * 5);

    // Ensure scores are between 0 and 100
    efficiency = Math.max(0, Math.min(100, efficiency));
    reliability = Math.max(0, Math.min(100, reliability));
    maintainability = Math.max(0, Math.min(100, maintainability));

    const overall = Math.round((efficiency + reliability + maintainability) / 3);

    return { overall, efficiency, reliability, maintainability };
  }
}

/**
 * Get tool definition for the validate_workflow_performance tool
 * 
 * @returns Tool definition
 */
export function getValidateWorkflowPerformanceToolDefinition(): ToolDefinition {
  return {
    name: 'validate_workflow_performance',
    description: 'Analyze workflows for performance bottlenecks and inefficiencies',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to analyze',
        },
        includeExecutions: {
          type: 'boolean',
          description: 'Include execution data in performance analysis',
          default: true,
        },
        executionLimit: {
          type: 'number',
          description: 'Maximum number of recent executions to analyze',
          default: 20,
        },
        analysisDepth: {
          type: 'string',
          description: 'Depth of analysis to perform',
          enum: ['standard', 'detailed'],
          default: 'standard',
        },
      },
      required: ['workflowId'],
    },
  };
}