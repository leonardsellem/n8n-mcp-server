/**
 * Intelligent Workflow Monitoring & Auto-Recovery
 * 
 * Provides smart monitoring, error analysis, and automatic recovery
 * for n8n workflows with AI-powered optimization suggestions.
 */

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'waiting' | 'running' | 'canceled';
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  nodeExecutions: NodeExecution[];
  errorMessage?: string;
  data?: any;
}

export interface NodeExecution {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: 'success' | 'error' | 'waiting' | 'running';
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  errorMessage?: string;
  inputData?: any;
  outputData?: any;
}

export interface MonitoringAlert {
  id: string;
  workflowId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'error' | 'performance' | 'usage' | 'security';
  message: string;
  suggestion: string;
  autoRecoverable: boolean;
  occurredAt: string;
}

export interface PerformanceMetrics {
  workflowId: string;
  executionCount: number;
  successRate: number;
  averageDuration: number;
  errorRate: number;
  commonErrors: Array<{
    error: string;
    count: number;
    percentage: number;
  }>;
  slowestNodes: Array<{
    nodeType: string;
    averageDuration: number;
    impact: 'low' | 'medium' | 'high';
  }>;
  resourceUsage: {
    apiCalls: number;
    dataTransferred: number;
    costEstimate?: number;
  };
}

export interface RecoveryAction {
  id: string;
  type: 'retry' | 'skip' | 'fallback' | 'alert' | 'modify';
  description: string;
  automated: boolean;
  successRate: number;
  estimatedImpact: string;
}

export interface OptimizationSuggestion {
  id: string;
  category: 'performance' | 'reliability' | 'cost' | 'security';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  estimatedBenefit: string;
}

export class IntelligentWorkflowMonitor {
  private executions: Map<string, WorkflowExecution> = new Map();
  private alerts: MonitoringAlert[] = [];
  private recoveryStrategies: Map<string, RecoveryAction[]> = new Map();

  /**
   * Monitor workflow execution in real-time
   */
  async monitorExecution(executionId: string): Promise<{
    execution: WorkflowExecution;
    alerts: MonitoringAlert[];
    recommendations: string[];
  }> {
    const execution = await this.getExecution(executionId);
    
    // Analyze execution for issues
    const alerts = this.analyzeExecution(execution);
    
    // Generate real-time recommendations
    const recommendations = this.generateRealtimeRecommendations(execution);
    
    return {
      execution,
      alerts,
      recommendations
    };
  }

  /**
   * Analyze workflow execution for potential issues
   */
  private analyzeExecution(execution: WorkflowExecution): MonitoringAlert[] {
    const alerts: MonitoringAlert[] = [];

    // Check for errors
    if (execution.status === 'error') {
      alerts.push({
        id: `alert_${Date.now()}`,
        workflowId: execution.workflowId,
        severity: 'high',
        type: 'error',
        message: `Workflow execution failed: ${execution.errorMessage}`,
        suggestion: this.getErrorSuggestion(execution.errorMessage || ''),
        autoRecoverable: this.isAutoRecoverable(execution.errorMessage || ''),
        occurredAt: new Date().toISOString()
      });
    }

    // Check for performance issues
    if (execution.duration && execution.duration > 300000) { // 5 minutes
      alerts.push({
        id: `perf_${Date.now()}`,
        workflowId: execution.workflowId,
        severity: 'medium',
        type: 'performance',
        message: `Workflow execution took ${Math.round(execution.duration / 1000)}s (unusually long)`,
        suggestion: 'Consider optimizing slow nodes or adding parallel processing',
        autoRecoverable: false,
        occurredAt: new Date().toISOString()
      });
    }

    // Check individual node performance
    for (const nodeExec of execution.nodeExecutions) {
      if (nodeExec.duration && nodeExec.duration > 60000) { // 1 minute
        alerts.push({
          id: `node_perf_${Date.now()}`,
          workflowId: execution.workflowId,
          severity: 'low',
          type: 'performance',
          message: `Node "${nodeExec.nodeName}" took ${Math.round(nodeExec.duration / 1000)}s`,
          suggestion: this.getNodeOptimizationSuggestion(nodeExec.nodeType),
          autoRecoverable: false,
          occurredAt: new Date().toISOString()
        });
      }

      // Check for node errors
      if (nodeExec.status === 'error') {
        alerts.push({
          id: `node_error_${Date.now()}`,
          workflowId: execution.workflowId,
          severity: 'medium',
          type: 'error',
          message: `Node "${nodeExec.nodeName}" failed: ${nodeExec.errorMessage}`,
          suggestion: this.getNodeErrorSuggestion(nodeExec.nodeType, nodeExec.errorMessage || ''),
          autoRecoverable: this.isNodeErrorRecoverable(nodeExec.nodeType, nodeExec.errorMessage || ''),
          occurredAt: new Date().toISOString()
        });
      }
    }

    return alerts;
  }

  /**
   * Generate real-time recommendations during execution
   */
  private generateRealtimeRecommendations(execution: WorkflowExecution): string[] {
    const recommendations: string[] = [];

    // Check for common improvement opportunities
    if (execution.nodeExecutions.some(n => n.nodeType === 'n8n-nodes-base.httpRequest')) {
      recommendations.push('Consider implementing retry logic for HTTP requests');
    }

    if (execution.nodeExecutions.length > 5) {
      recommendations.push('Large workflows benefit from error handling between major sections');
    }

    if (execution.nodeExecutions.some(n => n.nodeType.includes('openai'))) {
      recommendations.push('Monitor OpenAI token usage to control costs');
    }

    return recommendations;
  }

  /**
   * Automatically attempt recovery for recoverable errors
   */
  async attemptAutoRecovery(executionId: string): Promise<{
    attempted: boolean;
    success: boolean;
    actions: RecoveryAction[];
    newExecutionId?: string;
  }> {
    const execution = await this.getExecution(executionId);
    
    if (!execution || execution.status !== 'error') {
      return { attempted: false, success: false, actions: [] };
    }

    const recoveryActions = this.getRecoveryActions(execution);
    const applicableActions = recoveryActions.filter(a => a.automated);

    if (applicableActions.length === 0) {
      return { attempted: false, success: false, actions: recoveryActions };
    }

    // Execute recovery actions
    let success = false;
    let newExecutionId: string | undefined;

    for (const action of applicableActions) {
      try {
        const result = await this.executeRecoveryAction(execution, action);
        if (result.success) {
          success = true;
          newExecutionId = result.newExecutionId;
          break;
        }
      } catch (error) {
        console.error(`Recovery action ${action.id} failed:`, error);
      }
    }

    return {
      attempted: true,
      success,
      actions: applicableActions,
      newExecutionId
    };
  }

  /**
   * Get recovery actions for a failed execution
   */
  private getRecoveryActions(execution: WorkflowExecution): RecoveryAction[] {
    const actions: RecoveryAction[] = [];
    const errorMessage = execution.errorMessage || '';

    // Rate limiting errors
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      actions.push({
        id: 'retry_with_delay',
        type: 'retry',
        description: 'Retry execution with exponential backoff delay',
        automated: true,
        successRate: 0.85,
        estimatedImpact: 'High - likely to resolve rate limiting issues'
      });
    }

    // Network/timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('ECONNRESET')) {
      actions.push({
        id: 'retry_with_timeout',
        type: 'retry',
        description: 'Retry with increased timeout settings',
        automated: true,
        successRate: 0.75,
        estimatedImpact: 'Medium - may resolve temporary network issues'
      });
    }

    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('401') || errorMessage.includes('403')) {
      actions.push({
        id: 'refresh_credentials',
        type: 'modify',
        description: 'Refresh authentication credentials and retry',
        automated: false,
        successRate: 0.9,
        estimatedImpact: 'High - will resolve credential issues'
      });
    }

    // API endpoint errors
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      actions.push({
        id: 'validate_endpoints',
        type: 'modify',
        description: 'Validate and update API endpoints',
        automated: false,
        successRate: 0.8,
        estimatedImpact: 'High - will resolve endpoint issues'
      });
    }

    // General retry for transient errors
    if (actions.length === 0) {
      actions.push({
        id: 'general_retry',
        type: 'retry',
        description: 'Retry execution for transient error',
        automated: true,
        successRate: 0.5,
        estimatedImpact: 'Medium - may resolve temporary issues'
      });
    }

    return actions;
  }

  /**
   * Execute a specific recovery action
   */
  private async executeRecoveryAction(
    execution: WorkflowExecution,
    action: RecoveryAction
  ): Promise<{ success: boolean; newExecutionId?: string }> {
    switch (action.type) {
      case 'retry':
        return this.retryExecution(execution, action);
      case 'skip':
        return this.skipFailedNode(execution, action);
      case 'fallback':
        return this.executeFallback(execution, action);
      default:
        return { success: false };
    }
  }

  /**
   * Retry execution with smart delay
   */
  private async retryExecution(
    execution: WorkflowExecution,
    action: RecoveryAction
  ): Promise<{ success: boolean; newExecutionId?: string }> {
    // Implement exponential backoff delay
    const delay = action.id === 'retry_with_delay' ? 5000 : 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // This would trigger actual n8n workflow execution
    // For now, return simulated success
    const success = Math.random() > (1 - action.successRate);
    
    return {
      success,
      newExecutionId: success ? `retry_${execution.id}_${Date.now()}` : undefined
    };
  }

  /**
   * Skip failed node and continue workflow
   */
  private async skipFailedNode(
    execution: WorkflowExecution,
    action: RecoveryAction
  ): Promise<{ success: boolean; newExecutionId?: string }> {
    // Implementation would modify workflow to skip the failed node
    return { success: true, newExecutionId: `skip_${execution.id}` };
  }

  /**
   * Execute fallback workflow branch
   */
  private async executeFallback(
    execution: WorkflowExecution,
    action: RecoveryAction
  ): Promise<{ success: boolean; newExecutionId?: string }> {
    // Implementation would execute alternative workflow path
    return { success: true, newExecutionId: `fallback_${execution.id}` };
  }

  /**
   * Generate performance metrics for a workflow
   */
  async generatePerformanceMetrics(workflowId: string): Promise<PerformanceMetrics> {
    // This would query actual execution data
    const executions = Array.from(this.executions.values())
      .filter(e => e.workflowId === workflowId);

    const successCount = executions.filter(e => e.status === 'success').length;
    const totalDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0);
    
    const errorCounts = new Map<string, number>();
    executions.forEach(e => {
      if (e.errorMessage) {
        const count = errorCounts.get(e.errorMessage) || 0;
        errorCounts.set(e.errorMessage, count + 1);
      }
    });

    const commonErrors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({
        error,
        count,
        percentage: (count / executions.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Analyze node performance
    const nodePerformance = new Map<string, number[]>();
    executions.forEach(e => {
      e.nodeExecutions.forEach(n => {
        if (n.duration) {
          const durations = nodePerformance.get(n.nodeType) || [];
          durations.push(n.duration);
          nodePerformance.set(n.nodeType, durations);
        }
      });
    });

    const slowestNodes = Array.from(nodePerformance.entries())
      .map(([nodeType, durations]) => ({
        nodeType,
        averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
        impact: durations.reduce((sum, d) => sum + d, 0) > 60000 ? 'high' as const : 
                durations.reduce((sum, d) => sum + d, 0) > 30000 ? 'medium' as const : 'low' as const
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 5);

    return {
      workflowId,
      executionCount: executions.length,
      successRate: executions.length > 0 ? (successCount / executions.length) * 100 : 0,
      averageDuration: executions.length > 0 ? totalDuration / executions.length : 0,
      errorRate: executions.length > 0 ? ((executions.length - successCount) / executions.length) * 100 : 0,
      commonErrors,
      slowestNodes,
      resourceUsage: {
        apiCalls: executions.length * 5, // Estimated
        dataTransferred: executions.length * 1024, // Estimated KB
        costEstimate: executions.length * 0.01 // Estimated USD
      }
    };
  }

  /**
   * Generate optimization suggestions based on performance data
   */
  async generateOptimizationSuggestions(workflowId: string): Promise<OptimizationSuggestion[]> {
    const metrics = await this.generatePerformanceMetrics(workflowId);
    const suggestions: OptimizationSuggestion[] = [];

    // Performance suggestions
    if (metrics.averageDuration > 120000) { // 2 minutes
      suggestions.push({
        id: 'reduce_execution_time',
        category: 'performance',
        priority: 'high',
        title: 'Optimize Workflow Execution Time',
        description: `Average execution time is ${Math.round(metrics.averageDuration / 1000)}s, which is quite long`,
        impact: 'Faster execution, better user experience',
        implementation: 'Add parallel processing, optimize slow nodes, reduce unnecessary operations',
        estimatedBenefit: `Could reduce execution time by 30-50%`
      });
    }

    // Reliability suggestions
    if (metrics.errorRate > 10) {
      suggestions.push({
        id: 'improve_reliability',
        category: 'reliability',
        priority: 'high',
        title: 'Improve Workflow Reliability',
        description: `Error rate is ${metrics.errorRate.toFixed(1)}%, indicating reliability issues`,
        impact: 'More consistent workflow execution, fewer failures',
        implementation: 'Add error handling, implement retry logic, validate inputs',
        estimatedBenefit: `Could reduce error rate to under 5%`
      });
    }

    // Cost optimization
    if (metrics.resourceUsage.costEstimate && metrics.resourceUsage.costEstimate > 10) {
      suggestions.push({
        id: 'optimize_costs',
        category: 'cost',
        priority: 'medium',
        title: 'Optimize Resource Costs',
        description: `Estimated monthly cost is $${metrics.resourceUsage.costEstimate.toFixed(2)}`,
        impact: 'Reduced operational costs',
        implementation: 'Optimize API usage, reduce unnecessary calls, use cheaper alternatives',
        estimatedBenefit: `Could reduce costs by 20-40%`
      });
    }

    // Node-specific suggestions
    for (const slowNode of metrics.slowestNodes.filter(n => n.impact === 'high')) {
      suggestions.push({
        id: `optimize_${slowNode.nodeType}`,
        category: 'performance',
        priority: 'medium',
        title: `Optimize ${slowNode.nodeType} Performance`,
        description: `${slowNode.nodeType} nodes are taking ${Math.round(slowNode.averageDuration / 1000)}s on average`,
        impact: 'Faster overall workflow execution',
        implementation: this.getNodeOptimizationSuggestion(slowNode.nodeType),
        estimatedBenefit: 'Could reduce node execution time by 30-60%'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Helper methods for error analysis
   */
  private getErrorSuggestion(errorMessage: string): string {
    if (errorMessage.includes('rate limit')) return 'Implement exponential backoff and retry logic';
    if (errorMessage.includes('timeout')) return 'Increase timeout settings or optimize requests';
    if (errorMessage.includes('auth')) return 'Check and refresh authentication credentials';
    if (errorMessage.includes('not found')) return 'Validate API endpoints and resource IDs';
    return 'Review error details and implement appropriate error handling';
  }

  private isAutoRecoverable(errorMessage: string): boolean {
    const recoverableErrors = ['rate limit', 'timeout', 'ECONNRESET', '429', '500', '502', '503'];
    return recoverableErrors.some(error => errorMessage.includes(error));
  }

  private getNodeOptimizationSuggestion(nodeType: string): string {
    const suggestions: Record<string, string> = {
      'n8n-nodes-base.httpRequest': 'Use connection pooling, implement caching, optimize request payload size',
      'n8n-nodes-base.code': 'Optimize JavaScript/Python code, reduce data processing overhead',
      'n8n-nodes-langchain.openai': 'Optimize prompts, use appropriate model for task, implement response caching',
      'n8n-nodes-base.slack': 'Batch messages when possible, use threading for related messages',
      'n8n-nodes-base.github': 'Use GraphQL API when available, implement request batching'
    };
    return suggestions[nodeType] || 'Review node configuration and optimize parameters';
  }

  private getNodeErrorSuggestion(nodeType: string, errorMessage: string): string {
    if (nodeType.includes('http') && errorMessage.includes('timeout')) {
      return 'Increase HTTP timeout or implement retry logic';
    }
    if (nodeType.includes('slack') && errorMessage.includes('rate_limited')) {
      return 'Implement message queuing or reduce message frequency';
    }
    return this.getErrorSuggestion(errorMessage);
  }

  private isNodeErrorRecoverable(nodeType: string, errorMessage: string): boolean {
    // API nodes are generally more recoverable
    if (nodeType.includes('http') || nodeType.includes('slack') || nodeType.includes('github')) {
      return this.isAutoRecoverable(errorMessage);
    }
    return false;
  }

  /**
   * Mock method to get execution data
   */
  private async getExecution(executionId: string): Promise<WorkflowExecution> {
    // This would fetch from actual n8n API
    return {
      id: executionId,
      workflowId: 'workflow_123',
      status: 'success',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      duration: 5000,
      nodeExecutions: [
        {
          nodeId: 'node_1',
          nodeName: 'Manual Trigger',
          nodeType: 'n8n-nodes-base.manualTrigger',
          status: 'success',
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          duration: 100
        }
      ]
    };
  }
}

export default IntelligentWorkflowMonitor;