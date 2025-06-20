/**
 * Monitor Workflow Health Tool
 * 
 * This tool provides real-time health monitoring with status checks and alerts.
 */

import { BaseMonitoringToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the monitor_workflow_health tool
 */
export class MonitorWorkflowHealthHandler extends BaseMonitoringToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing monitoring options
   * @returns Health monitoring results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        workflowId, 
        checkAllWorkflows, 
        timeRange, 
        includeDetails,
        alertThresholds 
      } = args;
      
      if (!workflowId && !checkAllWorkflows) {
        throw new N8nApiError('Either workflowId or checkAllWorkflows must be provided');
      }

      const healthReport = await this.performHealthCheck({
        workflowId,
        checkAllWorkflows: checkAllWorkflows || false,
        timeRange: timeRange || 86400000, // 24 hours default
        includeDetails: includeDetails || false,
        alertThresholds: alertThresholds || this.getDefaultThresholds()
      });

      return this.formatSuccess(
        healthReport,
        checkAllWorkflows 
          ? 'Health check completed for all workflows'
          : `Health check completed for workflow: ${workflowId}`
      );
    }, args);
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(options: any): Promise<any> {
    const { workflowId, checkAllWorkflows, timeRange, includeDetails, alertThresholds } = options;

    const healthReport: Record<string, any> = {
      timestamp: new Date().toISOString(),
      timeRange: this.formatExecutionTime(timeRange),
      overallHealth: {
        status: 'unknown',
        score: 0,
        summary: ''
      },
      workflows: [] as any[],
      systemHealth: await this.checkSystemHealth(),
      alerts: [] as any[],
      recommendations: [] as string[]
    };

    if (checkAllWorkflows) {
      // Get all workflows
      const workflows = await this.apiService.getWorkflows({ active: true });
      
      for (const workflow of workflows) {
        const workflowHealth = await this.checkWorkflowHealth(
          workflow.id, 
          timeRange, 
          alertThresholds,
          includeDetails
        );
        healthReport.workflows.push(workflowHealth);
        healthReport.alerts.push(...workflowHealth.alerts);
      }
    } else if (workflowId) {
      const workflowHealth = await this.checkWorkflowHealth(
        workflowId, 
        timeRange, 
        alertThresholds,
        includeDetails
      );
      healthReport.workflows.push(workflowHealth);
      healthReport.alerts.push(...workflowHealth.alerts);
    }

    // Calculate overall health
    healthReport.overallHealth = this.calculateOverallHealth(healthReport.workflows);
    
    // Generate recommendations
    healthReport.recommendations = this.generateHealthRecommendations(healthReport);

    return healthReport;
  }

  /**
   * Check health of individual workflow
   */
  private async checkWorkflowHealth(
    workflowId: string, 
    timeRange: number, 
    thresholds: any,
    includeDetails: boolean
  ): Promise<any> {
    try {
      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        return this.createUnhealthyWorkflowReport(workflowId, 'Workflow not found');
      }

      // Get recent executions
      const executions = await this.getRecentExecutions(workflowId, timeRange);
      
      // Calculate health metrics
      const metrics = this.calculateHealthMetrics(executions, timeRange);
      
      // Generate alerts
      const alerts = this.generatePerformanceAlerts(metrics, thresholds);
      
      // Get execution trends
      const trends = this.analyzeExecutionTrends(executions);

      const healthReport: Record<string, any> = {
        workflowId,
        workflowName: workflow.name,
        isActive: workflow.active,
        healthScore: this.calculateHealthScore(metrics),
        status: '',
        metrics,
        trends,
        alerts,
        lastExecution: executions.length > 0 ? executions[0] : null,
        nodeHealth: this.assessNodeHealth(workflow, executions)
      };

      healthReport.status = this.getHealthStatus(healthReport.healthScore);

      if (includeDetails) {
        healthReport.detailedMetrics = {
          executionHistory: executions.slice(0, 10), // Last 10 executions
          errorAnalysis: this.analyzeErrors(executions),
          performanceBreakdown: this.analyzePerformanceByNode(workflow, executions)
        };
      }

      return healthReport;
    } catch (error) {
      return this.createUnhealthyWorkflowReport(
        workflowId, 
        `Error checking workflow health: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get recent executions for a workflow
   */
  private async getRecentExecutions(workflowId: string, timeRange: number): Promise<any[]> {
    try {
      const executions = await this.apiService.getExecutions({
        workflowId,
        limit: 100,
        includeData: false
      });
      
      // Filter by time range
      const cutoffTime = Date.now() - timeRange;
      return (Array.isArray(executions) ? executions : (executions as any)?.data || [])
        .filter((exec: any) => {
          const execTime = new Date(exec.startedAt || exec.createdAt).getTime();
          return execTime >= cutoffTime;
        });
    } catch (error) {
      console.warn(`Could not fetch executions for workflow ${workflowId}:`, error);
      return [];
    }
  }

  /**
   * Calculate health metrics from executions
   */
  private calculateHealthMetrics(executions: any[], timeRange: number): any {
    if (executions.length === 0) {
      return {
        executionCount: 0,
        successRate: 0,
        failureRate: 0,
        averageExecutionTime: 0,
        errorFrequency: 0,
        lastExecutionAge: Date.now() // Assume very old
      };
    }

    const successful = executions.filter(exec => 
      exec.finished && !exec.data?.resultData?.error
    );
    const failed = executions.filter(exec => 
      exec.finished && exec.data?.resultData?.error
    );

    // Calculate execution times
    const executionTimes = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());

    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
      : 0;

    // Find last execution
    const lastExecution = executions.sort((a, b) => 
      new Date(b.startedAt || b.createdAt).getTime() - new Date(a.startedAt || a.createdAt).getTime()
    )[0];

    const lastExecutionAge = lastExecution 
      ? Date.now() - new Date(lastExecution.startedAt || lastExecution.createdAt).getTime()
      : Date.now();

    return {
      executionCount: executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      successRate: (successful.length / executions.length) * 100,
      failureRate: (failed.length / executions.length) * 100,
      averageExecutionTime,
      errorFrequency: (failed.length / executions.length) * 100,
      lastExecutionAge,
      timeStats: this.getTimeBasedStats(executions, timeRange)
    };
  }

  /**
   * Assess node health within a workflow
   */
  private assessNodeHealth(workflow: any, executions: any[]): any {
    const nodeHealth: Record<string, any> = {};

    if (!workflow.nodes || executions.length === 0) {
      return nodeHealth;
    }

    // Initialize node health tracking
    for (const node of workflow.nodes) {
      nodeHealth[node.name] = {
        nodeName: node.name,
        nodeType: node.type,
        executionCount: 0,
        errorCount: 0,
        averageExecutionTime: 0,
        healthScore: 100,
        status: 'healthy'
      };
    }

    // Analyze node performance from executions
    for (const execution of executions) {
      if (execution.data?.resultData?.runData) {
        for (const [nodeName, nodeData] of Object.entries(execution.data.resultData.runData)) {
          if (nodeHealth[nodeName]) {
            nodeHealth[nodeName].executionCount++;
            
            const nodeArray = nodeData as any[];
            if (nodeArray && nodeArray[0]) {
              if (nodeArray[0].error) {
                nodeHealth[nodeName].errorCount++;
              }
              if (nodeArray[0].executionTime) {
                nodeHealth[nodeName].averageExecutionTime = 
                  (nodeHealth[nodeName].averageExecutionTime + nodeArray[0].executionTime) / 2;
              }
            }
          }
        }
      }
    }

    // Calculate health scores for each node
    for (const [nodeName, health] of Object.entries(nodeHealth)) {
      const nodeHealthData = health as any;
      if (nodeHealthData.executionCount > 0) {
        const errorRate = (nodeHealthData.errorCount / nodeHealthData.executionCount) * 100;
        nodeHealthData.healthScore = Math.max(0, 100 - errorRate * 2); // 2 point penalty per % error rate
        nodeHealthData.status = this.getHealthStatus(nodeHealthData.healthScore);
      }
    }

    return nodeHealth;
  }

  /**
   * Check overall system health
   */
  private async checkSystemHealth(): Promise<any> {
    const systemHealth = {
      apiConnectivity: 'unknown',
      responseTime: 0,
      status: 'unknown',
      lastChecked: new Date().toISOString()
    };

    try {
      const startTime = Date.now();
      await this.apiService.checkConnectivity();
      const responseTime = Date.now() - startTime;
      
      systemHealth.apiConnectivity = 'healthy';
      systemHealth.responseTime = responseTime;
      systemHealth.status = responseTime < 1000 ? 'excellent' : responseTime < 3000 ? 'good' : 'slow';
    } catch (error) {
      systemHealth.apiConnectivity = 'unhealthy';
      systemHealth.status = 'critical';
    }

    return systemHealth;
  }

  /**
   * Create unhealthy workflow report
   */
  private createUnhealthyWorkflowReport(workflowId: string, reason: string): any {
    return {
      workflowId,
      workflowName: 'Unknown',
      isActive: false,
      healthScore: 0,
      status: 'critical',
      error: reason,
      metrics: {
        executionCount: 0,
        successRate: 0,
        failureRate: 100
      },
      alerts: [{
        type: 'workflow_error',
        severity: 'critical',
        message: reason
      }]
    };
  }

  /**
   * Calculate overall health from multiple workflows
   */
  private calculateOverallHealth(workflows: any[]): any {
    if (workflows.length === 0) {
      return {
        status: 'unknown',
        score: 0,
        summary: 'No workflows to monitor'
      };
    }

    const averageScore = workflows.reduce((sum, wf) => sum + (wf.healthScore || 0), 0) / workflows.length;
    
    const healthyCount = workflows.filter(wf => wf.healthScore >= 75).length;
    const unhealthyCount = workflows.filter(wf => wf.healthScore < 50).length;

    return {
      status: this.getHealthStatus(averageScore),
      score: Math.round(averageScore),
      summary: `${healthyCount} healthy, ${unhealthyCount} unhealthy out of ${workflows.length} workflows`,
      breakdown: {
        total: workflows.length,
        healthy: healthyCount,
        fair: workflows.filter(wf => wf.healthScore >= 50 && wf.healthScore < 75).length,
        unhealthy: unhealthyCount
      }
    };
  }

  /**
   * Analyze errors from executions
   */
  private analyzeErrors(executions: any[]): any {
    const errorAnalysis = {
      totalErrors: 0,
      errorTypes: {} as Record<string, number>,
      commonErrors: [] as any[],
      errorTrend: 'stable'
    };

    const errors: any[] = [];

    for (const execution of executions) {
      if (execution.data?.resultData?.error) {
        const error = execution.data.resultData.error;
        errors.push({
          executionId: execution.id,
          timestamp: execution.startedAt,
          error: error.message || 'Unknown error',
          type: error.type || 'unknown'
        });

        errorAnalysis.totalErrors++;
        const errorType = error.type || 'unknown';
        errorAnalysis.errorTypes[errorType] = (errorAnalysis.errorTypes[errorType] || 0) + 1;
      }
    }

    // Find most common errors
    const sortedErrorTypes = Object.entries(errorAnalysis.errorTypes)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);

    errorAnalysis.commonErrors = sortedErrorTypes.map(([type, count]) => ({ type, count }));

    return errorAnalysis;
  }

  /**
   * Analyze performance by individual nodes
   */
  private analyzePerformanceByNode(workflow: any, executions: any[]): any {
    const nodePerformance: Record<string, any> = {};

    if (!workflow.nodes) return nodePerformance;

    // Initialize tracking for all nodes
    for (const node of workflow.nodes) {
      nodePerformance[node.name] = {
        nodeName: node.name,
        nodeType: node.type,
        executionTimes: [] as number[],
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        errorCount: 0
      };
    }

    // Collect performance data from executions
    for (const execution of executions) {
      if (execution.data?.resultData?.runData) {
        for (const [nodeName, nodeData] of Object.entries(execution.data.resultData.runData)) {
          if (nodePerformance[nodeName]) {
            const nodeArray = nodeData as any[];
            if (nodeArray && nodeArray[0]) {
              if (nodeArray[0].executionTime) {
                nodePerformance[nodeName].executionTimes.push(nodeArray[0].executionTime);
              }
              if (nodeArray[0].error) {
                nodePerformance[nodeName].errorCount++;
              }
            }
          }
        }
      }
    }

    // Calculate statistics for each node
    for (const [nodeName, perf] of Object.entries(nodePerformance)) {
      const nodePerf = perf as any;
      if (nodePerf.executionTimes.length > 0) {
        nodePerf.averageTime = nodePerf.executionTimes.reduce((sum: number, time: number) => sum + time, 0) / nodePerf.executionTimes.length;
        nodePerf.minTime = Math.min(...nodePerf.executionTimes);
        nodePerf.maxTime = Math.max(...nodePerf.executionTimes);
      }
    }

    return nodePerformance;
  }

  /**
   * Generate health recommendations
   */
  private generateHealthRecommendations(healthReport: any): string[] {
    const recommendations: string[] = [];

    // Overall health recommendations
    if (healthReport.overallHealth.score < 50) {
      recommendations.push('Overall system health is poor - immediate attention required');
    }

    // System connectivity recommendations
    if (healthReport.systemHealth.status === 'critical') {
      recommendations.push('n8n API connectivity issues detected - check system status');
    } else if (healthReport.systemHealth.responseTime > 3000) {
      recommendations.push('Slow API response times detected - check system performance');
    }

    // Workflow-specific recommendations
    const unhealthyWorkflows = healthReport.workflows.filter((wf: any) => wf.healthScore < 50);
    if (unhealthyWorkflows.length > 0) {
      recommendations.push(`${unhealthyWorkflows.length} workflows require attention`);
    }

    const inactiveWorkflows = healthReport.workflows.filter((wf: any) => !wf.isActive);
    if (inactiveWorkflows.length > 0) {
      recommendations.push(`${inactiveWorkflows.length} workflows are inactive`);
    }

    // Alert-based recommendations
    const criticalAlerts = healthReport.alerts.filter((alert: any) => alert.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(`${criticalAlerts.length} critical alerts require immediate attention`);
    }

    return recommendations.length > 0 ? recommendations : ['System appears healthy - continue monitoring'];
  }

  /**
   * Get default alert thresholds
   */
  private getDefaultThresholds(): any {
    return {
      minSuccessRate: 90,
      maxExecutionTime: 300000, // 5 minutes
      maxErrorRate: 5,
      maxInactivityTime: 86400000 // 24 hours
    };
  }
}

/**
 * Get tool definition for the monitor_workflow_health tool
 * 
 * @returns Tool definition
 */
export function getMonitorWorkflowHealthToolDefinition(): ToolDefinition {
  return {
    name: 'monitor_workflow_health',
    description: 'Real-time health monitoring with status checks and alerts',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of specific workflow to monitor',
        },
        checkAllWorkflows: {
          type: 'boolean',
          description: 'Monitor all active workflows',
          default: false,
        },
        timeRange: {
          type: 'number',
          description: 'Time range in milliseconds for health analysis',
          default: 86400000, // 24 hours
        },
        includeDetails: {
          type: 'boolean',
          description: 'Include detailed metrics and execution history',
          default: false,
        },
        alertThresholds: {
          type: 'object',
          description: 'Custom alert thresholds',
          properties: {
            minSuccessRate: { type: 'number', default: 90 },
            maxExecutionTime: { type: 'number', default: 300000 },
            maxErrorRate: { type: 'number', default: 5 },
            maxInactivityTime: { type: 'number', default: 86400000 }
          }
        },
      },
      // Note: Either workflowId OR checkAllWorkflows must be provided
      required: [],
    },
  };
}