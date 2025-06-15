/**
 * Base Monitoring Tool Handler
 *
 * This module provides a base handler for workflow monitoring and analytics tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base class for workflow monitoring tool handlers
 */
export abstract class BaseMonitoringToolHandler {
  protected apiService: EnhancedN8nApiClient;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    // Return structured data directly without string formatting to ensure valid JSON
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing monitoring tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   *
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Calculate health score based on various metrics
   * 
   * @param metrics Object containing various health metrics
   * @returns Health score from 0-100
   */
  protected calculateHealthScore(metrics: any): number {
    let score = 100;

    // Success rate impact (40% of score)
    if (metrics.successRate !== undefined) {
      score = score * 0.6 + (metrics.successRate * 0.4);
    }

    // Execution time impact (20% of score)
    if (metrics.averageExecutionTime !== undefined) {
      const timeScore = Math.max(0, 100 - (metrics.averageExecutionTime / 1000)); // Penalty for slow executions
      score = score * 0.8 + (timeScore * 0.2);
    }

    // Error frequency impact (20% of score)
    if (metrics.errorFrequency !== undefined) {
      const errorScore = Math.max(0, 100 - (metrics.errorFrequency * 10)); // 10 point penalty per % error rate
      score = score * 0.8 + (errorScore * 0.2);
    }

    // Recent activity impact (20% of score)
    if (metrics.lastExecutionAge !== undefined) {
      const ageInHours = metrics.lastExecutionAge / (1000 * 60 * 60);
      const activityScore = ageInHours > 24 ? 50 : Math.max(0, 100 - ageInHours * 2);
      score = score * 0.8 + (activityScore * 0.2);
    }

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Determine health status based on score
   * 
   * @param score Health score from 0-100
   * @returns Health status string
   */
  protected getHealthStatus(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 25) return 'poor';
    return 'critical';
  }

  /**
   * Get time-based execution statistics
   * 
   * @param executions Array of execution records
   * @param timeRange Time range in milliseconds
   * @returns Time-based statistics
   */
  protected getTimeBasedStats(executions: any[], timeRange: number): any {
    const now = Date.now();
    const cutoffTime = now - timeRange;
    
    const recentExecutions = executions.filter(exec => {
      const execTime = new Date(exec.startedAt || exec.createdAt).getTime();
      return execTime >= cutoffTime;
    });

    const successful = recentExecutions.filter(exec => 
      exec.finished && !exec.data?.resultData?.error
    );

    const failed = recentExecutions.filter(exec => 
      exec.finished && exec.data?.resultData?.error
    );

    const running = recentExecutions.filter(exec => !exec.finished);

    return {
      total: recentExecutions.length,
      successful: successful.length,
      failed: failed.length,
      running: running.length,
      successRate: recentExecutions.length > 0 ? (successful.length / recentExecutions.length) * 100 : 0,
      failureRate: recentExecutions.length > 0 ? (failed.length / recentExecutions.length) * 100 : 0
    };
  }

  /**
   * Analyze execution trends
   * 
   * @param executions Array of execution records
   * @returns Trend analysis
   */
  protected analyzeExecutionTrends(executions: any[]): any {
    if (executions.length < 2) {
      return {
        trend: 'insufficient_data',
        direction: 'stable',
        confidence: 0
      };
    }

    // Sort by execution time
    const sortedExecutions = executions
      .filter(exec => exec.startedAt)
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

    if (sortedExecutions.length < 5) {
      return {
        trend: 'insufficient_data',
        direction: 'stable',
        confidence: 0.3
      };
    }

    // Split into two halves for comparison
    const midpoint = Math.floor(sortedExecutions.length / 2);
    const firstHalf = sortedExecutions.slice(0, midpoint);
    const secondHalf = sortedExecutions.slice(midpoint);

    // Calculate success rates for each half
    const firstHalfSuccess = this.calculateSuccessRate(firstHalf);
    const secondHalfSuccess = this.calculateSuccessRate(secondHalf);

    const improvementRate = secondHalfSuccess - firstHalfSuccess;

    let direction = 'stable';
    let trend = 'stable';

    if (Math.abs(improvementRate) > 10) {
      direction = improvementRate > 0 ? 'improving' : 'declining';
      trend = improvementRate > 0 ? 'positive' : 'negative';
    }

    return {
      trend,
      direction,
      improvementRate,
      confidence: Math.min(1, sortedExecutions.length / 20) // Higher confidence with more data
    };
  }

  /**
   * Calculate success rate for executions
   * 
   * @param executions Array of execution records
   * @returns Success rate percentage
   */
  private calculateSuccessRate(executions: any[]): number {
    if (executions.length === 0) return 0;
    
    const successful = executions.filter(exec => 
      exec.finished && !exec.data?.resultData?.error
    );
    
    return (successful.length / executions.length) * 100;
  }

  /**
   * Generate performance alerts based on metrics
   * 
   * @param metrics Performance metrics object
   * @param thresholds Alert thresholds
   * @returns Array of alerts
   */
  protected generatePerformanceAlerts(metrics: any, thresholds: any): any[] {
    const alerts: any[] = [];

    // Success rate alerts
    if (metrics.successRate < (thresholds.minSuccessRate || 90)) {
      alerts.push({
        type: 'success_rate',
        severity: metrics.successRate < 50 ? 'critical' : metrics.successRate < 75 ? 'high' : 'medium',
        message: `Success rate (${metrics.successRate.toFixed(1)}%) below threshold`,
        threshold: thresholds.minSuccessRate || 90,
        actual: metrics.successRate
      });
    }

    // Execution time alerts
    if (metrics.averageExecutionTime > (thresholds.maxExecutionTime || 300000)) {
      alerts.push({
        type: 'execution_time',
        severity: metrics.averageExecutionTime > 600000 ? 'critical' : 'high',
        message: `Average execution time (${(metrics.averageExecutionTime / 1000).toFixed(1)}s) exceeds threshold`,
        threshold: thresholds.maxExecutionTime || 300000,
        actual: metrics.averageExecutionTime
      });
    }

    // Error frequency alerts
    if (metrics.errorFrequency > (thresholds.maxErrorRate || 5)) {
      alerts.push({
        type: 'error_frequency',
        severity: metrics.errorFrequency > 20 ? 'critical' : metrics.errorFrequency > 10 ? 'high' : 'medium',
        message: `Error frequency (${metrics.errorFrequency.toFixed(1)}%) exceeds threshold`,
        threshold: thresholds.maxErrorRate || 5,
        actual: metrics.errorFrequency
      });
    }

    // Inactivity alerts
    if (metrics.lastExecutionAge > (thresholds.maxInactivityTime || 86400000)) {
      const ageInHours = metrics.lastExecutionAge / (1000 * 60 * 60);
      alerts.push({
        type: 'inactivity',
        severity: ageInHours > 168 ? 'high' : 'medium', // 1 week = high
        message: `No executions for ${ageInHours.toFixed(1)} hours`,
        threshold: thresholds.maxInactivityTime || 86400000,
        actual: metrics.lastExecutionAge
      });
    }

    return alerts;
  }

  /**
   * Format execution time in human-readable format
   * 
   * @param milliseconds Time in milliseconds
   * @returns Formatted time string
   */
  protected formatExecutionTime(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else if (milliseconds < 3600000) {
      return `${(milliseconds / 60000).toFixed(1)}m`;
    } else {
      return `${(milliseconds / 3600000).toFixed(1)}h`;
    }
  }

  /**
   * Get resource usage estimates
   * 
   * @param executions Array of execution records
   * @returns Resource usage estimates
   */
  protected getResourceUsageEstimates(executions: any[]): any {
    const totalExecutions = executions.length;
    const avgExecutionTime = executions.reduce((sum, exec) => {
      if (exec.startedAt && exec.stoppedAt) {
        return sum + (new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());
      }
      return sum;
    }, 0) / (totalExecutions || 1);

    return {
      executionCount: totalExecutions,
      averageExecutionTime: avgExecutionTime,
      totalExecutionTime: avgExecutionTime * totalExecutions,
      estimatedCpuHours: (avgExecutionTime * totalExecutions) / (1000 * 60 * 60),
      resourceEfficiency: this.calculateResourceEfficiency(avgExecutionTime),
      costEstimate: this.estimateExecutionCost(avgExecutionTime, totalExecutions)
    };
  }

  /**
   * Calculate resource efficiency score
   * 
   * @param averageExecutionTime Average execution time in milliseconds
   * @returns Efficiency score from 0-100
   */
  private calculateResourceEfficiency(averageExecutionTime: number): number {
    // Efficient executions are under 10 seconds
    if (averageExecutionTime < 10000) return 100;
    if (averageExecutionTime < 30000) return 80;
    if (averageExecutionTime < 60000) return 60;
    if (averageExecutionTime < 300000) return 40;
    return 20;
  }

  /**
   * Estimate execution cost (simplified model)
   * 
   * @param averageExecutionTime Average execution time in milliseconds
   * @param executionCount Number of executions
   * @returns Cost estimate object
   */
  private estimateExecutionCost(averageExecutionTime: number, executionCount: number): any {
    // Simplified cost model - real implementation would depend on actual infrastructure
    const baseExecutionCost = 0.001; // $0.001 per execution
    const timeCost = (averageExecutionTime / 1000) * 0.0001; // $0.0001 per second
    
    const costPerExecution = baseExecutionCost + timeCost;
    const totalCost = costPerExecution * executionCount;

    return {
      costPerExecution: costPerExecution.toFixed(6),
      totalCost: totalCost.toFixed(4),
      currency: 'USD',
      model: 'simplified'
    };
  }
}