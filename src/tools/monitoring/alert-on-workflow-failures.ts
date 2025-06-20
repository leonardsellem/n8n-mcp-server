/**
 * Alert on Workflow Failures Tool
 * 
 * This tool sets up monitoring alerts with configurable thresholds.
 */

import { BaseMonitoringToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the alert_on_workflow_failures tool
 */
export class AlertOnWorkflowFailuresHandler extends BaseMonitoringToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing alert configuration
   * @returns Alert configuration and monitoring setup
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        workflowId, 
        alertType,
        thresholds,
        notificationChannels,
        alertFrequency,
        testMode 
      } = args;
      
      this.validateRequiredParams(args, ['alertType']);

      if (workflowId) {
        // Verify workflow exists
        const workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
        }
      }

      const alertConfig = await this.setupWorkflowAlerts({
        workflowId,
        alertType,
        thresholds: thresholds || this.getDefaultAlertThresholds(),
        notificationChannels: notificationChannels || ['console'],
        alertFrequency: alertFrequency || 'immediate',
        testMode: testMode || false
      });

      return this.formatSuccess(
        alertConfig,
        workflowId 
          ? `Alerts configured for workflow: ${workflowId}`
          : 'Global workflow alerts configured'
      );
    }, args);
  }

  /**
   * Set up workflow monitoring alerts
   */
  private async setupWorkflowAlerts(config: any): Promise<any> {
    const { workflowId, alertType, thresholds, notificationChannels, alertFrequency, testMode } = config;

    const alertSetup: Record<string, any> = {
      alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflowId || 'global',
      alertType,
      configuration: {
        thresholds,
        notificationChannels,
        alertFrequency,
        enabled: true,
        testMode
      },
      createdAt: new Date().toISOString(),
      status: 'active',
      monitoringResults: {}
    };

    // Perform initial monitoring check
    alertSetup.monitoringResults = await this.performMonitoringCheck(config);

    // Set up alert triggers based on type
    alertSetup.triggers = this.setupAlertTriggers(alertType, thresholds);

    // Configure notification handlers
    alertSetup.notifications = this.setupNotificationHandlers(notificationChannels);

    // Generate alert summary
    alertSetup.summary = this.generateAlertSummary(alertSetup);

    // If test mode, simulate alerts
    if (testMode) {
      alertSetup.testResults = await this.runAlertTests(config);
    }

    return alertSetup;
  }

  /**
   * Perform monitoring check to establish baseline
   */
  private async performMonitoringCheck(config: any): Promise<any> {
    const { workflowId, thresholds } = config;

    try {
      if (workflowId) {
        // Monitor specific workflow
        return await this.monitorSingleWorkflow(workflowId, thresholds);
      } else {
        // Monitor all workflows
        return await this.monitorAllWorkflows(thresholds);
      }
    } catch (error) {
      return {
        error: 'Failed to perform monitoring check',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Monitor single workflow
   */
  private async monitorSingleWorkflow(workflowId: string, thresholds: any): Promise<any> {
    // Get recent executions (last 24 hours)
    const timeRange = 86400000; // 24 hours
    const executions = await this.getRecentExecutions(workflowId, timeRange);

    // Calculate current metrics
    const metrics = this.calculateCurrentMetrics(executions);

    // Check against thresholds
    const alerts = this.checkThresholds(metrics, thresholds, workflowId);

    return {
      workflowId,
      metrics,
      alerts,
      timestamp: new Date().toISOString(),
      executionCount: executions.length
    };
  }

  /**
   * Monitor all workflows
   */
  private async monitorAllWorkflows(thresholds: any): Promise<any> {
    const workflows = await this.apiService.getWorkflows({ active: true });
    const results: any[] = [];
    const globalAlerts: any[] = [];

    for (const workflow of workflows) {
      try {
        const workflowResult = await this.monitorSingleWorkflow(workflow.id, thresholds);
        results.push(workflowResult);
        globalAlerts.push(...workflowResult.alerts);
      } catch (error) {
        results.push({
          workflowId: workflow.id,
          error: error instanceof Error ? error.message : 'Monitoring failed',
          timestamp: new Date().toISOString()
        });
      }
    }

    return {
      totalWorkflows: workflows.length,
      monitoredWorkflows: results.length,
      globalAlerts,
      workflowResults: results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recent executions for monitoring
   */
  private async getRecentExecutions(workflowId: string, timeRange: number): Promise<any[]> {
    try {
      const executions = await this.apiService.getExecutions({
        workflowId,
        limit: 100,
        includeData: false
      });

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
   * Calculate current metrics for alerting
   */
  private calculateCurrentMetrics(executions: any[]): any {
    if (executions.length === 0) {
      return {
        executionCount: 0,
        successRate: 0,
        failureRate: 0,
        averageExecutionTime: 0,
        lastExecutionAge: Date.now(),
        consecutiveFailures: 0
      };
    }

    const successful = executions.filter(exec => exec.finished && !exec.data?.resultData?.error);
    const failed = executions.filter(exec => exec.finished && exec.data?.resultData?.error);

    // Calculate execution times
    const executionTimes = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());

    // Find consecutive failures
    const sortedExecutions = executions
      .sort((a, b) => new Date(b.startedAt || b.createdAt).getTime() - new Date(a.startedAt || a.createdAt).getTime());
    
    let consecutiveFailures = 0;
    for (const execution of sortedExecutions) {
      if (execution.finished && execution.data?.resultData?.error) {
        consecutiveFailures++;
      } else {
        break;
      }
    }

    // Find last execution
    const lastExecution = sortedExecutions[0];
    const lastExecutionAge = lastExecution 
      ? Date.now() - new Date(lastExecution.startedAt || lastExecution.createdAt).getTime()
      : Date.now();

    return {
      executionCount: executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      successRate: (successful.length / executions.length) * 100,
      failureRate: (failed.length / executions.length) * 100,
      averageExecutionTime: executionTimes.length > 0 
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
        : 0,
      lastExecutionAge,
      consecutiveFailures
    };
  }

  /**
   * Check metrics against thresholds
   */
  private checkThresholds(metrics: any, thresholds: any, workflowId?: string): any[] {
    const alerts: any[] = [];

    // Success rate threshold
    if (metrics.successRate < thresholds.minSuccessRate) {
      alerts.push({
        type: 'success_rate',
        severity: metrics.successRate < 50 ? 'critical' : 'high',
        message: `Success rate (${metrics.successRate.toFixed(1)}%) below threshold (${thresholds.minSuccessRate}%)`,
        workflowId,
        threshold: thresholds.minSuccessRate,
        current: metrics.successRate,
        timestamp: new Date().toISOString()
      });
    }

    // Execution time threshold
    if (metrics.averageExecutionTime > thresholds.maxExecutionTime) {
      alerts.push({
        type: 'execution_time',
        severity: metrics.averageExecutionTime > thresholds.maxExecutionTime * 2 ? 'critical' : 'high',
        message: `Average execution time (${this.formatExecutionTime(metrics.averageExecutionTime)}) exceeds threshold`,
        workflowId,
        threshold: thresholds.maxExecutionTime,
        current: metrics.averageExecutionTime,
        timestamp: new Date().toISOString()
      });
    }

    // Consecutive failures threshold
    if (metrics.consecutiveFailures >= thresholds.maxConsecutiveFailures) {
      alerts.push({
        type: 'consecutive_failures',
        severity: 'critical',
        message: `${metrics.consecutiveFailures} consecutive failures detected`,
        workflowId,
        threshold: thresholds.maxConsecutiveFailures,
        current: metrics.consecutiveFailures,
        timestamp: new Date().toISOString()
      });
    }

    // Inactivity threshold
    if (metrics.lastExecutionAge > thresholds.maxInactivityTime) {
      const ageInHours = metrics.lastExecutionAge / (1000 * 60 * 60);
      alerts.push({
        type: 'inactivity',
        severity: ageInHours > 168 ? 'high' : 'medium', // 1 week = high
        message: `No executions for ${ageInHours.toFixed(1)} hours`,
        workflowId,
        threshold: thresholds.maxInactivityTime,
        current: metrics.lastExecutionAge,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Set up alert triggers
   */
  private setupAlertTriggers(alertType: string, thresholds: any): any[] {
    const triggers: any[] = [];

    switch (alertType) {
      case 'failure_rate':
        triggers.push({
          type: 'failure_rate',
          condition: `failure_rate > ${thresholds.maxFailureRate || 10}%`,
          action: 'send_notification'
        });
        break;

      case 'execution_time':
        triggers.push({
          type: 'slow_execution',
          condition: `execution_time > ${thresholds.maxExecutionTime || 300000}ms`,
          action: 'send_notification'
        });
        break;

      case 'consecutive_failures':
        triggers.push({
          type: 'consecutive_failures',
          condition: `consecutive_failures >= ${thresholds.maxConsecutiveFailures || 3}`,
          action: 'send_immediate_notification'
        });
        break;

      case 'inactivity':
        triggers.push({
          type: 'workflow_inactive',
          condition: `last_execution_age > ${thresholds.maxInactivityTime || 86400000}ms`,
          action: 'send_notification'
        });
        break;

      case 'comprehensive':
        // Set up multiple triggers
        triggers.push(
          {
            type: 'failure_rate',
            condition: `failure_rate > ${thresholds.maxFailureRate || 10}%`,
            action: 'send_notification'
          },
          {
            type: 'consecutive_failures',
            condition: `consecutive_failures >= ${thresholds.maxConsecutiveFailures || 3}`,
            action: 'send_immediate_notification'
          },
          {
            type: 'slow_execution',
            condition: `execution_time > ${thresholds.maxExecutionTime || 300000}ms`,
            action: 'send_notification'
          }
        );
        break;

      default:
        triggers.push({
          type: 'general',
          condition: 'any_failure_detected',
          action: 'send_notification'
        });
    }

    return triggers;
  }

  /**
   * Set up notification handlers
   */
  private setupNotificationHandlers(channels: string[]): any[] {
    const handlers: any[] = [];

    for (const channel of channels) {
      switch (channel) {
        case 'console':
          handlers.push({
            type: 'console',
            enabled: true,
            config: { logLevel: 'error' }
          });
          break;

        case 'email':
          handlers.push({
            type: 'email',
            enabled: true,
            config: { 
              placeholder: 'Email configuration would be set up here',
              note: 'Requires SMTP configuration in production'
            }
          });
          break;

        case 'webhook':
          handlers.push({
            type: 'webhook',
            enabled: true,
            config: { 
              placeholder: 'Webhook URL would be configured here',
              note: 'Requires webhook endpoint configuration'
            }
          });
          break;

        case 'slack':
          handlers.push({
            type: 'slack',
            enabled: true,
            config: { 
              placeholder: 'Slack webhook URL would be configured here',
              note: 'Requires Slack app and webhook configuration'
            }
          });
          break;

        default:
          handlers.push({
            type: channel,
            enabled: false,
            config: { error: 'Unknown notification channel' }
          });
      }
    }

    return handlers;
  }

  /**
   * Generate alert summary
   */
  private generateAlertSummary(alertSetup: any): any {
    const monitoringResults = alertSetup.monitoringResults;
    
    return {
      alertType: alertSetup.alertType,
      status: alertSetup.status,
      scope: alertSetup.workflowId === 'global' ? 'All workflows' : `Workflow ${alertSetup.workflowId}`,
      activeAlerts: Array.isArray(monitoringResults.alerts) ? monitoringResults.alerts.length : 0,
      criticalAlerts: Array.isArray(monitoringResults.alerts) 
        ? monitoringResults.alerts.filter((alert: any) => alert.severity === 'critical').length 
        : 0,
      notificationChannels: alertSetup.configuration.notificationChannels.join(', '),
      nextCheck: this.calculateNextCheckTime(alertSetup.configuration.alertFrequency)
    };
  }

  /**
   * Calculate next check time based on frequency
   */
  private calculateNextCheckTime(frequency: string): string {
    const now = new Date();
    let nextCheck = new Date(now);

    switch (frequency) {
      case 'immediate':
        nextCheck.setMinutes(now.getMinutes() + 1);
        break;
      case 'every_5_minutes':
        nextCheck.setMinutes(now.getMinutes() + 5);
        break;
      case 'every_15_minutes':
        nextCheck.setMinutes(now.getMinutes() + 15);
        break;
      case 'hourly':
        nextCheck.setHours(now.getHours() + 1);
        break;
      case 'daily':
        nextCheck.setDate(now.getDate() + 1);
        break;
      default:
        nextCheck.setMinutes(now.getMinutes() + 5);
    }

    return nextCheck.toISOString();
  }

  /**
   * Run alert tests
   */
  private async runAlertTests(config: any): Promise<any> {
    const tests = {
      connectivityTest: await this.testConnectivity(),
      thresholdTests: this.testThresholds(config.thresholds),
      notificationTests: this.testNotifications(config.notificationChannels),
      overallStatus: 'unknown'
    };

    // Determine overall test status
    const allPassed = tests.connectivityTest.passed && 
                     tests.thresholdTests.passed && 
                     tests.notificationTests.passed;
    
    tests.overallStatus = allPassed ? 'passed' : 'failed';

    return tests;
  }

  /**
   * Test API connectivity
   */
  private async testConnectivity(): Promise<any> {
    try {
      const startTime = Date.now();
      await this.apiService.checkConnectivity();
      const responseTime = Date.now() - startTime;

      return {
        passed: true,
        responseTime,
        message: `API connectivity test passed (${responseTime}ms)`
      };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Connectivity test failed',
        message: 'API connectivity test failed'
      };
    }
  }

  /**
   * Test threshold configuration
   */
  private testThresholds(thresholds: any): any {
    const issues: string[] = [];

    if (thresholds.minSuccessRate < 0 || thresholds.minSuccessRate > 100) {
      issues.push('Invalid success rate threshold (must be 0-100)');
    }

    if (thresholds.maxExecutionTime < 1000) {
      issues.push('Execution time threshold too low (minimum 1 second)');
    }

    if (thresholds.maxConsecutiveFailures < 1) {
      issues.push('Consecutive failures threshold too low (minimum 1)');
    }

    return {
      passed: issues.length === 0,
      issues,
      message: issues.length === 0 ? 'Threshold validation passed' : 'Threshold validation failed'
    };
  }

  /**
   * Test notification configuration
   */
  private testNotifications(channels: string[]): any {
    const supportedChannels = ['console', 'email', 'webhook', 'slack'];
    const invalidChannels = channels.filter(channel => !supportedChannels.includes(channel));

    return {
      passed: invalidChannels.length === 0,
      supportedChannels: channels.filter(channel => supportedChannels.includes(channel)),
      invalidChannels,
      message: invalidChannels.length === 0 
        ? 'Notification configuration valid' 
        : `Invalid notification channels: ${invalidChannels.join(', ')}`
    };
  }

  /**
   * Get default alert thresholds
   */
  private getDefaultAlertThresholds(): any {
    return {
      minSuccessRate: 90, // 90%
      maxFailureRate: 10, // 10%
      maxExecutionTime: 300000, // 5 minutes
      maxConsecutiveFailures: 3,
      maxInactivityTime: 86400000 // 24 hours
    };
  }
}

/**
 * Get tool definition for the alert_on_workflow_failures tool
 * 
 * @returns Tool definition
 */
export function getAlertOnWorkflowFailuresToolDefinition(): ToolDefinition {
  return {
    name: 'alert_on_workflow_failures',
    description: 'Set up monitoring alerts with configurable thresholds',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of specific workflow to monitor (optional for global alerts)',
        },
        alertType: {
          type: 'string',
          description: 'Type of alert to configure',
          enum: ['failure_rate', 'execution_time', 'consecutive_failures', 'inactivity', 'comprehensive'],
        },
        thresholds: {
          type: 'object',
          description: 'Alert threshold configuration',
          properties: {
            minSuccessRate: { type: 'number', default: 90 },
            maxFailureRate: { type: 'number', default: 10 },
            maxExecutionTime: { type: 'number', default: 300000 },
            maxConsecutiveFailures: { type: 'number', default: 3 },
            maxInactivityTime: { type: 'number', default: 86400000 }
          }
        },
        notificationChannels: {
          type: 'array',
          description: 'Notification channels for alerts',
          items: {
            type: 'string',
            enum: ['console', 'email', 'webhook', 'slack']
          },
          default: ['console']
        },
        alertFrequency: {
          type: 'string',
          description: 'How often to check for alerts',
          enum: ['immediate', 'every_5_minutes', 'every_15_minutes', 'hourly', 'daily'],
          default: 'every_5_minutes'
        },
        testMode: {
          type: 'boolean',
          description: 'Run in test mode to validate configuration',
          default: false
        }
      },
      required: ['alertType'],
    },
  };
}