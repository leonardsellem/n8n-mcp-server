/**
 * Get Workflow Performance Metrics Tool
 * 
 * This tool provides detailed performance analytics including execution times and resource usage.
 */

import { BaseMonitoringToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the get_workflow_performance_metrics tool
 */
export class GetWorkflowPerformanceMetricsHandler extends BaseMonitoringToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing performance analysis options
   * @returns Performance metrics and analytics
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        workflowId, 
        timeRange, 
        granularity,
        includeNodeMetrics,
        includeComparison,
        exportFormat 
      } = args;
      
      this.validateRequiredParams(args, ['workflowId']);

      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
      }

      const performanceReport = await this.generatePerformanceReport({
        workflow,
        timeRange: timeRange || 604800000, // 7 days default
        granularity: granularity || 'daily',
        includeNodeMetrics: includeNodeMetrics || false,
        includeComparison: includeComparison || false,
        exportFormat: exportFormat || 'json'
      });

      return this.formatSuccess(
        performanceReport,
        `Performance metrics generated for workflow: ${workflow.name}`
      );
    }, args);
  }

  /**
   * Generate comprehensive performance report
   */
  private async generatePerformanceReport(options: any): Promise<any> {
    const { workflow, timeRange, granularity, includeNodeMetrics, includeComparison } = options;

    // Get execution data
    const executions = await this.getExecutionData(workflow.id, timeRange);

    const performanceReport: Record<string, any> = {
      workflowInfo: {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflow.nodes?.length || 0
      },
      analysisInfo: {
        timeRange: this.formatExecutionTime(timeRange),
        granularity,
        executionCount: executions.length,
        analysisTimestamp: new Date().toISOString()
      },
      executionMetrics: this.calculateExecutionMetrics(executions),
      performanceTrends: this.analyzePerformanceTrends(executions, granularity),
      resourceUsage: this.getResourceUsageEstimates(executions),
      errorAnalysis: this.analyzeExecutionErrors(executions),
      performanceDistribution: this.analyzePerformanceDistribution(executions)
    };

    // Add node-level metrics if requested
    if (includeNodeMetrics) {
      performanceReport.nodeMetrics = this.calculateNodeMetrics(workflow, executions);
    }

    // Add comparison with previous period if requested
    if (includeComparison) {
      performanceReport.comparison = await this.generatePerformanceComparison(
        workflow.id, 
        timeRange, 
        executions
      );
    }

    // Add performance insights
    performanceReport.insights = this.generatePerformanceInsights(performanceReport);

    return performanceReport;
  }

  /**
   * Get execution data for analysis
   */
  private async getExecutionData(workflowId: string, timeRange: number): Promise<any[]> {
    try {
      const executions = await this.apiService.getExecutions({
        workflowId,
        limit: 1000, // Get more data for analysis
        includeData: true
      });

      // Filter by time range
      const cutoffTime = Date.now() - timeRange;
      return (Array.isArray(executions) ? executions : (executions as any)?.data || [])
        .filter((exec: any) => {
          const execTime = new Date(exec.startedAt || exec.createdAt).getTime();
          return execTime >= cutoffTime;
        })
        .sort((a: any, b: any) => 
          new Date(b.startedAt || b.createdAt).getTime() - new Date(a.startedAt || a.createdAt).getTime()
        );
    } catch (error) {
      console.warn(`Could not fetch executions for workflow ${workflowId}:`, error);
      return [];
    }
  }

  /**
   * Calculate comprehensive execution metrics
   */
  private calculateExecutionMetrics(executions: any[]): any {
    if (executions.length === 0) {
      return {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        runningExecutions: 0,
        successRate: 0,
        failureRate: 0,
        averageExecutionTime: 0,
        medianExecutionTime: 0,
        minExecutionTime: 0,
        maxExecutionTime: 0,
        p95ExecutionTime: 0,
        p99ExecutionTime: 0
      };
    }

    const successful = executions.filter(exec => exec.finished && !exec.data?.resultData?.error);
    const failed = executions.filter(exec => exec.finished && exec.data?.resultData?.error);
    const running = executions.filter(exec => !exec.finished);

    // Calculate execution times
    const executionTimes = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime())
      .sort((a, b) => a - b);

    const metrics = {
      totalExecutions: executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      runningExecutions: running.length,
      successRate: (successful.length / executions.length) * 100,
      failureRate: (failed.length / executions.length) * 100,
      averageExecutionTime: 0,
      medianExecutionTime: 0,
      minExecutionTime: 0,
      maxExecutionTime: 0,
      p95ExecutionTime: 0,
      p99ExecutionTime: 0
    };

    if (executionTimes.length > 0) {
      metrics.averageExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length;
      metrics.medianExecutionTime = this.calculatePercentile(executionTimes, 50);
      metrics.minExecutionTime = executionTimes[0];
      metrics.maxExecutionTime = executionTimes[executionTimes.length - 1];
      metrics.p95ExecutionTime = this.calculatePercentile(executionTimes, 95);
      metrics.p99ExecutionTime = this.calculatePercentile(executionTimes, 99);
    }

    return metrics;
  }

  /**
   * Calculate percentile value from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
  }

  /**
   * Analyze performance trends over time
   */
  private analyzePerformanceTrends(executions: any[], granularity: string): any {
    const trends: Record<string, any> = {
      granularity,
      periods: [] as any[],
      overallTrend: 'stable'
    };

    if (executions.length === 0) return trends;

    // Group executions by time period
    const groupedExecutions = this.groupExecutionsByTime(executions, granularity);

    // Calculate metrics for each period
    for (const [period, periodExecutions] of Object.entries(groupedExecutions)) {
      const periodArray = periodExecutions as any[];
      const periodMetrics = this.calculateExecutionMetrics(periodArray);
      
      trends.periods.push({
        period,
        executionCount: periodArray.length,
        successRate: periodMetrics.successRate,
        averageExecutionTime: periodMetrics.averageExecutionTime,
        failureRate: periodMetrics.failureRate
      });
    }

    // Sort periods by time
    trends.periods.sort((a: any, b: any) => new Date(a.period).getTime() - new Date(b.period).getTime());

    // Analyze overall trend
    if (trends.periods.length >= 2) {
      const firstPeriod = trends.periods[0];
      const lastPeriod = trends.periods[trends.periods.length - 1];
      
      const successRateChange = lastPeriod.successRate - firstPeriod.successRate;
      const executionTimeChange = lastPeriod.averageExecutionTime - firstPeriod.averageExecutionTime;

      if (successRateChange > 5 && executionTimeChange < 1000) {
        trends.overallTrend = 'improving';
      } else if (successRateChange < -5 || executionTimeChange > 5000) {
        trends.overallTrend = 'degrading';
      } else {
        trends.overallTrend = 'stable';
      }
    }

    return trends;
  }

  /**
   * Group executions by time period
   */
  private groupExecutionsByTime(executions: any[], granularity: string): Record<string, any[]> {
    const groups: Record<string, any[]> = {};

    for (const execution of executions) {
      const executionDate = new Date(execution.startedAt || execution.createdAt);
      let periodKey: string;

      switch (granularity) {
        case 'hourly':
          periodKey = `${executionDate.getFullYear()}-${String(executionDate.getMonth() + 1).padStart(2, '0')}-${String(executionDate.getDate()).padStart(2, '0')} ${String(executionDate.getHours()).padStart(2, '0')}:00`;
          break;
        case 'daily':
          periodKey = `${executionDate.getFullYear()}-${String(executionDate.getMonth() + 1).padStart(2, '0')}-${String(executionDate.getDate()).padStart(2, '0')}`;
          break;
        case 'weekly':
          const weekStart = new Date(executionDate);
          weekStart.setDate(executionDate.getDate() - executionDate.getDay());
          periodKey = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
          break;
        case 'monthly':
          periodKey = `${executionDate.getFullYear()}-${String(executionDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          periodKey = executionDate.toISOString().split('T')[0];
      }

      if (!groups[periodKey]) {
        groups[periodKey] = [];
      }
      groups[periodKey].push(execution);
    }

    return groups;
  }

  /**
   * Analyze execution errors
   */
  private analyzeExecutionErrors(executions: any[]): any {
    const errorAnalysis = {
      totalErrors: 0,
      errorRate: 0,
      errorTypes: {} as Record<string, number>,
      errorsByNode: {} as Record<string, number>,
      recentErrors: [] as any[],
      errorTrends: 'stable'
    };

    const failedExecutions = executions.filter(exec => 
      exec.finished && exec.data?.resultData?.error
    );

    errorAnalysis.totalErrors = failedExecutions.length;
    errorAnalysis.errorRate = executions.length > 0 ? (failedExecutions.length / executions.length) * 100 : 0;

    // Analyze error types and sources
    for (const execution of failedExecutions) {
      const error = execution.data?.resultData?.error;
      if (error) {
        // Count error types
        const errorType = error.type || error.name || 'Unknown';
        errorAnalysis.errorTypes[errorType] = (errorAnalysis.errorTypes[errorType] || 0) + 1;

        // Count errors by node
        const errorNode = error.node || 'Unknown';
        errorAnalysis.errorsByNode[errorNode] = (errorAnalysis.errorsByNode[errorNode] || 0) + 1;

        // Collect recent errors
        if (errorAnalysis.recentErrors.length < 10) {
          errorAnalysis.recentErrors.push({
            executionId: execution.id,
            timestamp: execution.startedAt,
            node: errorNode,
            type: errorType,
            message: error.message || 'No error message'
          });
        }
      }
    }

    return errorAnalysis;
  }

  /**
   * Analyze performance distribution
   */
  private analyzePerformanceDistribution(executions: any[]): any {
    const distribution = {
      executionTimeBuckets: {} as Record<string, number>,
      successRateByTimeOfDay: {} as Record<number, any>,
      executionsByDayOfWeek: {} as Record<number, number>,
      seasonalPatterns: this.analyzeSeasonalPatterns(executions)
    };

    const executionTimes = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());

    // Create execution time buckets
    for (const time of executionTimes) {
      let bucket: string;
      if (time < 1000) bucket = '< 1s';
      else if (time < 5000) bucket = '1-5s';
      else if (time < 10000) bucket = '5-10s';
      else if (time < 30000) bucket = '10-30s';
      else if (time < 60000) bucket = '30s-1m';
      else if (time < 300000) bucket = '1-5m';
      else bucket = '> 5m';

      distribution.executionTimeBuckets[bucket] = (distribution.executionTimeBuckets[bucket] || 0) + 1;
    }

    // Analyze by time of day
    for (let hour = 0; hour < 24; hour++) {
      const hourExecutions = executions.filter(exec => {
        const execDate = new Date(exec.startedAt || exec.createdAt);
        return execDate.getHours() === hour;
      });

      if (hourExecutions.length > 0) {
        const successful = hourExecutions.filter(exec => exec.finished && !exec.data?.resultData?.error);
        distribution.successRateByTimeOfDay[hour] = {
          executionCount: hourExecutions.length,
          successRate: (successful.length / hourExecutions.length) * 100
        };
      }
    }

    // Analyze by day of week
    for (let day = 0; day < 7; day++) {
      const dayExecutions = executions.filter(exec => {
        const execDate = new Date(exec.startedAt || exec.createdAt);
        return execDate.getDay() === day;
      });
      distribution.executionsByDayOfWeek[day] = dayExecutions.length;
    }

    return distribution;
  }

  /**
   * Analyze seasonal patterns
   */
  private analyzeSeasonalPatterns(executions: any[]): any {
    const patterns = {
      monthlyDistribution: {} as Record<number, number>,
      weekdayVsWeekend: { weekday: 0, weekend: 0 },
      peakHours: [] as number[]
    };

    // Monthly distribution
    for (let month = 0; month < 12; month++) {
      const monthExecutions = executions.filter(exec => {
        const execDate = new Date(exec.startedAt || exec.createdAt);
        return execDate.getMonth() === month;
      });
      patterns.monthlyDistribution[month] = monthExecutions.length;
    }

    // Weekday vs weekend
    for (const execution of executions) {
      const execDate = new Date(execution.startedAt || execution.createdAt);
      const dayOfWeek = execDate.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        patterns.weekdayVsWeekend.weekend++;
      } else {
        patterns.weekdayVsWeekend.weekday++;
      }
    }

    // Find peak hours
    const hourCounts: Record<number, number> = {};
    for (const execution of executions) {
      const execDate = new Date(execution.startedAt || execution.createdAt);
      const hour = execDate.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    // Get top 3 peak hours
    patterns.peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return patterns;
  }

  /**
   * Calculate node-level metrics
   */
  private calculateNodeMetrics(workflow: any, executions: any[]): Record<string, any> {
    const nodeMetrics: Record<string, any> = {};

    if (!workflow.nodes || executions.length === 0) {
      return nodeMetrics;
    }

    // Initialize metrics for all nodes
    for (const node of workflow.nodes) {
      nodeMetrics[node.name] = {
        nodeName: node.name,
        nodeType: node.type,
        executionCount: 0,
        successCount: 0,
        errorCount: 0,
        executionTimes: [] as number[],
        averageExecutionTime: 0,
        minExecutionTime: 0,
        maxExecutionTime: 0,
        successRate: 0,
        throughput: 0
      };
    }

    // Collect data from executions
    for (const execution of executions) {
      if (execution.data?.resultData?.runData) {
        for (const [nodeName, nodeData] of Object.entries(execution.data.resultData.runData)) {
          if (nodeMetrics[nodeName]) {
            nodeMetrics[nodeName].executionCount++;
            
            const nodeArray = nodeData as any[];
            if (nodeArray && nodeArray[0]) {
              if (nodeArray[0].error) {
                nodeMetrics[nodeName].errorCount++;
              } else {
                nodeMetrics[nodeName].successCount++;
              }
              
              if (nodeArray[0].executionTime) {
                nodeMetrics[nodeName].executionTimes.push(nodeArray[0].executionTime);
              }
            }
          }
        }
      }
    }

    // Calculate derived metrics
    for (const [nodeName, metrics] of Object.entries(nodeMetrics)) {
      const nodeMetric = metrics as any;
      
      if (nodeMetric.executionCount > 0) {
        nodeMetric.successRate = (nodeMetric.successCount / nodeMetric.executionCount) * 100;
        
        if (nodeMetric.executionTimes.length > 0) {
          const times = nodeMetric.executionTimes;
          nodeMetric.averageExecutionTime = times.reduce((sum: number, time: number) => sum + time, 0) / times.length;
          nodeMetric.minExecutionTime = Math.min(...times);
          nodeMetric.maxExecutionTime = Math.max(...times);
        }
        
        // Calculate throughput (executions per hour)
        const timeSpanHours = (Date.now() - new Date(executions[executions.length - 1]?.startedAt || Date.now()).getTime()) / (1000 * 60 * 60);
        nodeMetric.throughput = timeSpanHours > 0 ? nodeMetric.executionCount / timeSpanHours : 0;
      }
    }

    return nodeMetrics;
  }

  /**
   * Generate performance comparison with previous period
   */
  private async generatePerformanceComparison(workflowId: string, timeRange: number, currentExecutions: any[]): Promise<any> {
    try {
      // Get executions from previous period
      const previousTimeStart = Date.now() - (timeRange * 2);
      const previousTimeEnd = Date.now() - timeRange;
      
      const allHistoricalExecutions = await this.apiService.getExecutions({
        workflowId,
        limit: 1000,
        includeData: false
      });

      const previousExecutions = (Array.isArray(allHistoricalExecutions) ? allHistoricalExecutions : (allHistoricalExecutions as any)?.data || [])
        .filter((exec: any) => {
          const execTime = new Date(exec.startedAt || exec.createdAt).getTime();
          return execTime >= previousTimeStart && execTime <= previousTimeEnd;
        });

      const currentMetrics = this.calculateExecutionMetrics(currentExecutions);
      const previousMetrics = this.calculateExecutionMetrics(previousExecutions);

      return {
        currentPeriod: currentMetrics,
        previousPeriod: previousMetrics,
        changes: {
          executionCountChange: currentMetrics.totalExecutions - previousMetrics.totalExecutions,
          successRateChange: currentMetrics.successRate - previousMetrics.successRate,
          executionTimeChange: currentMetrics.averageExecutionTime - previousMetrics.averageExecutionTime,
          errorRateChange: currentMetrics.failureRate - previousMetrics.failureRate
        },
        percentageChanges: {
          executionCountChange: previousMetrics.totalExecutions > 0 
            ? ((currentMetrics.totalExecutions - previousMetrics.totalExecutions) / previousMetrics.totalExecutions) * 100 
            : 0,
          executionTimeChange: previousMetrics.averageExecutionTime > 0 
            ? ((currentMetrics.averageExecutionTime - previousMetrics.averageExecutionTime) / previousMetrics.averageExecutionTime) * 100 
            : 0
        }
      };
    } catch (error) {
      return {
        error: 'Could not generate comparison data',
        reason: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate performance insights
   */
  private generatePerformanceInsights(performanceReport: any): any {
    const insights = {
      keyFindings: [] as string[],
      recommendations: [] as string[],
      performanceScore: 0,
      healthIndicators: {
        reliability: 'unknown',
        performance: 'unknown',
        efficiency: 'unknown'
      }
    };

    const metrics = performanceReport.executionMetrics;

    // Reliability insights
    if (metrics.successRate >= 99) {
      insights.keyFindings.push('Excellent reliability with 99%+ success rate');
      insights.healthIndicators.reliability = 'excellent';
    } else if (metrics.successRate >= 95) {
      insights.keyFindings.push('Good reliability with 95%+ success rate');
      insights.healthIndicators.reliability = 'good';
    } else if (metrics.successRate < 90) {
      insights.keyFindings.push(`Low reliability detected (${metrics.successRate.toFixed(1)}% success rate)`);
      insights.recommendations.push('Investigate and fix failing executions');
      insights.healthIndicators.reliability = 'poor';
    }

    // Performance insights
    if (metrics.averageExecutionTime < 10000) {
      insights.keyFindings.push('Fast execution times (< 10 seconds average)');
      insights.healthIndicators.performance = 'excellent';
    } else if (metrics.averageExecutionTime > 300000) {
      insights.keyFindings.push(`Slow execution times (${this.formatExecutionTime(metrics.averageExecutionTime)} average)`);
      insights.recommendations.push('Optimize workflow performance');
      insights.healthIndicators.performance = 'poor';
    } else {
      insights.healthIndicators.performance = 'good';
    }

    // Efficiency insights
    const resourceUsage = performanceReport.resourceUsage;
    if (resourceUsage.resourceEfficiency >= 80) {
      insights.healthIndicators.efficiency = 'excellent';
    } else if (resourceUsage.resourceEfficiency < 40) {
      insights.keyFindings.push('Low resource efficiency detected');
      insights.recommendations.push('Review workflow design for optimization opportunities');
      insights.healthIndicators.efficiency = 'poor';
    } else {
      insights.healthIndicators.efficiency = 'good';
    }

    // Trend insights
    if (performanceReport.performanceTrends.overallTrend === 'degrading') {
      insights.keyFindings.push('Performance is degrading over time');
      insights.recommendations.push('Monitor closely and investigate recent changes');
    } else if (performanceReport.performanceTrends.overallTrend === 'improving') {
      insights.keyFindings.push('Performance is improving over time');
    }

    // Calculate overall performance score
    const reliabilityScore = Math.min(100, metrics.successRate);
    const performanceScore = Math.max(0, 100 - (metrics.averageExecutionTime / 3000)); // 5 minutes = 0 score
    const efficiencyScore = resourceUsage.resourceEfficiency;

    insights.performanceScore = Math.round((reliabilityScore + performanceScore + efficiencyScore) / 3);

    return insights;
  }
}

/**
 * Get tool definition for the get_workflow_performance_metrics tool
 * 
 * @returns Tool definition
 */
export function getGetWorkflowPerformanceMetricsToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_performance_metrics',
    description: 'Detailed performance analytics including execution times and resource usage',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to analyze',
        },
        timeRange: {
          type: 'number',
          description: 'Time range in milliseconds for analysis',
          default: 604800000, // 7 days
        },
        granularity: {
          type: 'string',
          description: 'Time granularity for trend analysis',
          enum: ['hourly', 'daily', 'weekly', 'monthly'],
          default: 'daily',
        },
        includeNodeMetrics: {
          type: 'boolean',
          description: 'Include individual node performance metrics',
          default: false,
        },
        includeComparison: {
          type: 'boolean',
          description: 'Include comparison with previous time period',
          default: false,
        },
        exportFormat: {
          type: 'string',
          description: 'Format for exported data',
          enum: ['json', 'csv', 'summary'],
          default: 'json',
        },
      },
      required: ['workflowId'],
    },
  };
}