// Real-Time Execution Monitoring System

import { EventEmitter } from 'events';
import { 
  ExecutionVisualization,
  ExecutionStep,
  TimestampedScreenshot,
  ExecutionPerformanceMetrics,
  ExecutionIssue,
  NodeVisualState,
  ScreenshotAnnotation
} from '../types/enhanced-visual-types';
import { logger } from '../utils/logger';
import { N8nApiClient } from './n8n-api-client';
import { Page } from 'playwright';

/**
 * Real-Time Execution Monitor
 * 
 * Monitors workflow executions in real-time, capturing:
 * - Visual state changes during execution
 * - Performance metrics per step
 * - Error detection and screenshots
 * - Live execution progress
 */
export class ExecutionMonitor extends EventEmitter {
  private apiClient: N8nApiClient;
  private page: Page;
  private activeMonitors = new Map<string, ExecutionMonitorSession>();
  private isMonitoring = false;
  private config: {
    screenshotInterval: number;
    performanceTracking: boolean;
    autoStop: boolean;
    maxDuration: number;
    errorDetection: boolean;
  };

  constructor(
    apiClient: N8nApiClient,
    page: Page,
    config: Partial<{
      screenshotInterval: number;
      performanceTracking: boolean;
      autoStop: boolean;
      maxDuration: number;
      errorDetection: boolean;
    }> = {}
  ) {
    super();
    this.apiClient = apiClient;
    this.page = page;
    this.config = {
      screenshotInterval: 2000,
      performanceTracking: true,
      autoStop: true,
      maxDuration: 300000, // 5 minutes
      errorDetection: true,
      ...config
    };
  }

  /**
   * Start monitoring a workflow execution
   */
  async startMonitoring(workflowId: string, executionId?: string): Promise<ExecutionVisualization> {
    try {
      logger.info(`[Execution Monitor] Starting monitoring for workflow ${workflowId}`);
      
      // Create monitoring session
      const session = new ExecutionMonitorSession(
        workflowId,
        executionId || '',
        this.apiClient,
        this.page,
        this.config
      );
      
      // Initialize execution visualization
      const execution: ExecutionVisualization = {
        workflowId,
        executionId: executionId || '',
        startTime: new Date(),
        currentStatus: 'waiting',
        steps: [],
        realTimeScreenshots: [],
        performanceMetrics: {
          totalDuration: 0,
          averageStepTime: 0,
          slowestStep: { nodeId: '', duration: 0 },
          memoryPeakUsage: 0,
          networkRequests: 0,
          errorRate: 0,
          throughput: 0
        },
        issues: []
      };
      
      // Set up event handlers
      session.on('step-start', (step: ExecutionStep) => {
        execution.steps.push(step);
        this.emit('step-start', workflowId, step);
      });
      
      session.on('step-complete', (step: ExecutionStep) => {
        const existingStep = execution.steps.find(s => s.nodeId === step.nodeId);
        if (existingStep) {
          Object.assign(existingStep, step);
        }
        this.emit('step-complete', workflowId, step);
      });
      
      session.on('screenshot', (screenshot: TimestampedScreenshot) => {
        execution.realTimeScreenshots.push(screenshot);
        this.emit('screenshot', workflowId, screenshot);
      });
      
      session.on('performance-update', (metrics: ExecutionPerformanceMetrics) => {
        execution.performanceMetrics = metrics;
        this.emit('performance-update', workflowId, metrics);
      });
      
      session.on('issue-detected', (issue: ExecutionIssue) => {
        execution.issues.push(issue);
        this.emit('issue-detected', workflowId, issue);
      });
      
      session.on('status-change', (status: string) => {
        execution.currentStatus = status as any;
        this.emit('status-change', workflowId, status);
      });
      
      // Start the monitoring session
      await session.start();
      
      // Store active session
      this.activeMonitors.set(workflowId, session);
      this.isMonitoring = true;
      
      logger.info(`[Execution Monitor] Monitoring started for workflow ${workflowId}`);
      return execution;
      
    } catch (error) {
      logger.error(`[Execution Monitor] Failed to start monitoring:`, error);
      throw error;
    }
  }

  /**
   * Stop monitoring a specific workflow
   */
  async stopMonitoring(workflowId: string): Promise<void> {
    const session = this.activeMonitors.get(workflowId);
    if (session) {
      await session.stop();
      this.activeMonitors.delete(workflowId);
      logger.info(`[Execution Monitor] Stopped monitoring workflow ${workflowId}`);
    }
    
    if (this.activeMonitors.size === 0) {
      this.isMonitoring = false;
    }
  }

  /**
   * Stop all monitoring sessions
   */
  async stopAllMonitoring(): Promise<void> {
    for (const [workflowId, session] of this.activeMonitors) {
      await session.stop();
    }
    this.activeMonitors.clear();
    this.isMonitoring = false;
    logger.info('[Execution Monitor] All monitoring sessions stopped');
  }

  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): {
    isActive: boolean;
    activeWorkflows: string[];
    totalSessions: number;
  } {
    return {
      isActive: this.isMonitoring,
      activeWorkflows: Array.from(this.activeMonitors.keys()),
      totalSessions: this.activeMonitors.size
    };
  }

  /**
   * Get live execution data for a workflow
   */
  getLiveExecutionData(workflowId: string): ExecutionVisualization | null {
    const session = this.activeMonitors.get(workflowId);
    return session ? session.getCurrentExecution() : null;
  }
}

/**
 * Individual execution monitoring session
 */
class ExecutionMonitorSession extends EventEmitter {
  private workflowId: string;
  private executionId: string;
  private apiClient: N8nApiClient;
  private page: Page;
  private config: any;
  private isActive = false;
  private monitoringTimer?: NodeJS.Timeout;
  private performanceTimer?: NodeJS.Timeout;
  private startTime = new Date();
  private currentExecution: ExecutionVisualization;
  private lastScreenshot?: string;
  private nodeStates = new Map<string, NodeVisualState>();

  constructor(
    workflowId: string,
    executionId: string,
    apiClient: N8nApiClient,
    page: Page,
    config: any
  ) {
    super();
    this.workflowId = workflowId;
    this.executionId = executionId;
    this.apiClient = apiClient;
    this.page = page;
    this.config = config;
    
    this.currentExecution = {
      workflowId,
      executionId,
      startTime: this.startTime,
      currentStatus: 'waiting',
      steps: [],
      realTimeScreenshots: [],
      performanceMetrics: {
        totalDuration: 0,
        averageStepTime: 0,
        slowestStep: { nodeId: '', duration: 0 },
        memoryPeakUsage: 0,
        networkRequests: 0,
        errorRate: 0,
        throughput: 0
      },
      issues: []
    };
  }

  /**
   * Start the monitoring session
   */
  async start(): Promise<void> {
    if (this.isActive) return;
    
    try {
      this.isActive = true;
      
      // Navigate to workflow execution view
      await this.navigateToExecution();
      
      // Start screenshot monitoring
      this.startScreenshotMonitoring();
      
      // Start performance monitoring
      if (this.config.performanceTracking) {
        this.startPerformanceMonitoring();
      }
      
      // Start execution state monitoring
      this.startExecutionStateMonitoring();
      
      // Set auto-stop timer
      if (this.config.autoStop) {
        setTimeout(() => {
          if (this.isActive) {
            this.stop();
          }
        }, this.config.maxDuration);
      }
      
      logger.info(`[Execution Session] Monitoring started for ${this.workflowId}`);
      
    } catch (error) {
      logger.error(`[Execution Session] Failed to start:`, error);
      throw error;
    }
  }

  /**
   * Stop the monitoring session
   */
  async stop(): Promise<void> {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Clear timers
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
    if (this.performanceTimer) {
      clearInterval(this.performanceTimer);
    }
    
    // Final screenshot
    await this.captureScreenshot('session_end');
    
    // Calculate final metrics
    this.calculateFinalMetrics();
    
    logger.info(`[Execution Session] Monitoring stopped for ${this.workflowId}`);
  }

  /**
   * Get current execution data
   */
  getCurrentExecution(): ExecutionVisualization {
    return { ...this.currentExecution };
  }

  /**
   * Navigate to execution view
   */
  private async navigateToExecution(): Promise<void> {
    let url: string;
    
    if (this.executionId) {
      // Navigate to specific execution
      url = `${this.apiClient.baseUrl}/execution/${this.executionId}`;
    } else {
      // Navigate to workflow and wait for execution
      url = `${this.apiClient.baseUrl}/workflow/${this.workflowId}`;
    }
    
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Start screenshot monitoring
   */
  private startScreenshotMonitoring(): void {
    this.monitoringTimer = setInterval(async () => {
      if (!this.isActive) return;
      
      try {
        await this.captureScreenshot('monitoring');
        await this.analyzeVisualChanges();
        
      } catch (error) {
        logger.error('[Execution Session] Screenshot monitoring error:', error);
      }
    }, this.config.screenshotInterval);
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    this.performanceTimer = setInterval(async () => {
      if (!this.isActive) return;
      
      try {
        await this.updatePerformanceMetrics();
        
      } catch (error) {
        logger.error('[Execution Session] Performance monitoring error:', error);
      }
    }, 5000); // Every 5 seconds
  }

  /**
   * Start execution state monitoring
   */
  private startExecutionStateMonitoring(): void {
    // Use API polling to track execution state
    const stateMonitor = setInterval(async () => {
      if (!this.isActive) return;
      
      try {
        const executionData = await this.getExecutionState();
        if (executionData) {
          await this.processExecutionState(executionData);
        }
        
      } catch (error) {
        logger.error('[Execution Session] State monitoring error:', error);
      }
    }, 1000); // Every second
    
    // Store timer for cleanup
    setTimeout(() => clearInterval(stateMonitor), this.config.maxDuration);
  }

  /**
   * Capture screenshot with annotations
   */
  private async captureScreenshot(context: string): Promise<void> {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      const base64 = screenshot.toString('base64');
      
      // Detect visual elements and annotate
      const annotations = await this.detectAndAnnotateElements();
      
      const timestampedScreenshot: TimestampedScreenshot = {
        timestamp: new Date(),
        screenshot: base64,
        annotations,
        context
      };
      
      this.currentExecution.realTimeScreenshots.push(timestampedScreenshot);
      this.lastScreenshot = base64;
      
      this.emit('screenshot', timestampedScreenshot);
      
    } catch (error) {
      logger.error('[Execution Session] Screenshot capture failed:', error);
    }
  }

  /**
   * Detect and annotate visual elements
   */
  private async detectAndAnnotateElements(): Promise<ScreenshotAnnotation[]> {
    const annotations: ScreenshotAnnotation[] = [];
    
    try {
      // Detect error states
      const errorElements = await this.page.$$('[class*="error"], [class*="Error"], .error-badge');
      for (const element of errorElements) {
        const box = await element.boundingBox();
        if (box) {
          annotations.push({
            type: 'circle',
            coordinates: { x: box.x + box.width/2, y: box.y + box.height/2 },
            color: '#ff0000',
            text: 'Error Detected',
            purpose: 'error'
          });
        }
      }
      
      // Detect success states
      const successElements = await this.page.$$('[class*="success"], [class*="Success"], .success-badge');
      for (const element of successElements) {
        const box = await element.boundingBox();
        if (box) {
          annotations.push({
            type: 'circle',
            coordinates: { x: box.x + box.width/2, y: box.y + box.height/2 },
            color: '#00ff00',
            text: 'Success',
            purpose: 'success'
          });
        }
      }
      
      // Detect running/active states
      const runningElements = await this.page.$$('[class*="running"], [class*="active"], .spinner');
      for (const element of runningElements) {
        const box = await element.boundingBox();
        if (box) {
          annotations.push({
            type: 'arrow',
            coordinates: { x: box.x, y: box.y },
            color: '#0066ff',
            text: 'Running',
            purpose: 'info'
          });
        }
      }
      
    } catch (error) {
      logger.error('[Execution Session] Element detection failed:', error);
    }
    
    return annotations;
  }

  /**
   * Analyze visual changes between screenshots
   */
  private async analyzeVisualChanges(): Promise<void> {
    if (!this.lastScreenshot || this.currentExecution.realTimeScreenshots.length < 2) {
      return;
    }
    
    try {
      // Get current and previous screenshots
      const current = this.currentExecution.realTimeScreenshots[this.currentExecution.realTimeScreenshots.length - 1];
      const previous = this.currentExecution.realTimeScreenshots[this.currentExecution.realTimeScreenshots.length - 2];
      
      // Simple change detection (could be enhanced with image diff algorithms)
      if (current.annotations.length !== previous.annotations.length) {
        const issue: ExecutionIssue = {
          type: 'warning',
          nodeId: 'visual_change',
          message: 'Visual state change detected',
          timestamp: new Date(),
          severity: 'low',
          resolved: false
        };
        
        this.currentExecution.issues.push(issue);
        this.emit('issue-detected', issue);
      }
      
      // Detect new errors
      const newErrors = current.annotations.filter(a => a.purpose === 'error');
      const previousErrors = previous.annotations.filter(a => a.purpose === 'error');
      
      if (newErrors.length > previousErrors.length) {
        const issue: ExecutionIssue = {
          type: 'error',
          nodeId: 'execution_error',
          message: 'New execution error detected visually',
          timestamp: new Date(),
          severity: 'high',
          resolved: false
        };
        
        this.currentExecution.issues.push(issue);
        this.emit('issue-detected', issue);
      }
      
    } catch (error) {
      logger.error('[Execution Session] Visual change analysis failed:', error);
    }
  }

  /**
   * Update performance metrics
   */
  private async updatePerformanceMetrics(): Promise<void> {
    try {
      const currentTime = new Date();
      const duration = currentTime.getTime() - this.startTime.getTime();
      
      // Calculate basic metrics
      const completedSteps = this.currentExecution.steps.filter(s => s.status === 'success' || s.status === 'error');
      const avgStepTime = completedSteps.length > 0 
        ? completedSteps.reduce((sum, step) => sum + (step.duration || 0), 0) / completedSteps.length
        : 0;
      
      const slowestStep = completedSteps.reduce((slowest: {nodeId: string, duration: number}, step) => 
        (step.duration || 0) > slowest.duration ? { nodeId: step.nodeId, duration: step.duration || 0 } : slowest,
        { nodeId: '', duration: 0 }
      );
      
      const errorSteps = completedSteps.filter(s => s.status === 'error');
      const errorRate = completedSteps.length > 0 ? errorSteps.length / completedSteps.length : 0;
      
      // Get memory usage (simplified)
      const memoryUsage = await this.getMemoryUsage();
      
      const metrics: ExecutionPerformanceMetrics = {
        totalDuration: duration,
        averageStepTime: avgStepTime,
        slowestStep,
        memoryPeakUsage: memoryUsage,
        networkRequests: this.countNetworkRequests(),
        errorRate,
        throughput: completedSteps.length / (duration / 1000) // steps per second
      };
      
      this.currentExecution.performanceMetrics = metrics;
      this.emit('performance-update', metrics);
      
    } catch (error) {
      logger.error('[Execution Session] Performance update failed:', error);
    }
  }

  /**
   * Get execution state from API
   */
  private async getExecutionState(): Promise<any> {
    try {
      if (this.executionId) {
        return await this.apiClient.getExecution(this.executionId);
      } else {
        // Get latest execution for workflow
        const executions = await this.apiClient.listExecutions({ 
          workflowId: this.workflowId, 
          limit: 1 
        });
        return executions.data[0];
      }
    } catch (error) {
      logger.warn('[Execution Session] Failed to get execution state:', error);
      return null;
    }
  }

  /**
   * Process execution state data
   */
  private async processExecutionState(executionData: any): Promise<void> {
    try {
      // Update execution ID if we didn't have it
      if (!this.executionId && executionData.id) {
        this.executionId = executionData.id;
        this.currentExecution.executionId = executionData.id;
      }
      
      // Update status
      const newStatus = this.mapExecutionStatus(executionData.status);
      if (newStatus !== this.currentExecution.currentStatus) {
        this.currentExecution.currentStatus = newStatus;
        this.emit('status-change', newStatus);
      }
      
      // Process execution steps
      if (executionData.data?.executionData?.nodeExecutionStack) {
        await this.processExecutionSteps(executionData.data.executionData.nodeExecutionStack);
      }
      
      // Check for completion
      if (['success', 'error', 'canceled'].includes(newStatus)) {
        await this.handleExecutionCompletion(executionData);
      }
      
    } catch (error) {
      logger.error('[Execution Session] State processing failed:', error);
    }
  }

  /**
   * Process execution steps
   */
  private async processExecutionSteps(nodeStack: any[]): Promise<void> {
    for (const stackItem of nodeStack) {
      for (const nodeExecution of stackItem.nodeExecutions) {
        const nodeId = nodeExecution.node.id;
        const nodeName = nodeExecution.node.name;
        
        // Find or create step
        let step = this.currentExecution.steps.find(s => s.nodeId === nodeId);
        if (!step) {
          step = {
            nodeId,
            nodeName,
            status: 'waiting',
            startTime: new Date(),
            visualState: {
              position: { x: 0, y: 0 },
              status: 'idle',
              hasError: false,
              hasWarning: false,
              isConnected: true,
              visualElements: {}
            }
          };
          this.currentExecution.steps.push(step);
          this.emit('step-start', step);
        }
        
        // Update step status
        const previousStatus = step.status;
        step.status = this.mapNodeExecutionStatus(nodeExecution.status);
        
        if (nodeExecution.startTime) {
          step.startTime = new Date(nodeExecution.startTime);
        }
        if (nodeExecution.endTime) {
          step.endTime = new Date(nodeExecution.endTime);
          step.duration = step.endTime.getTime() - step.startTime.getTime();
        }
        
        // Update visual state
        step.visualState.status = step.status === 'waiting' ? 'idle' : step.status as any;
        step.visualState.hasError = step.status === 'error';
        
        // Emit step complete if status changed to final state
        if (previousStatus !== step.status && ['success', 'error', 'skipped'].includes(step.status)) {
          this.emit('step-complete', step);
        }
      }
    }
  }

  /**
   * Handle execution completion
   */
  private async handleExecutionCompletion(executionData: any): Promise<void> {
    // Capture final screenshot
    await this.captureScreenshot('execution_complete');
    
    // Calculate final metrics
    this.calculateFinalMetrics();
    
    // Auto-stop if configured
    if (this.config.autoStop) {
      await this.stop();
    }
  }

  /**
   * Calculate final metrics
   */
  private calculateFinalMetrics(): void {
    const completedSteps = this.currentExecution.steps.filter(s => s.endTime);
    
    if (completedSteps.length > 0) {
      const totalStepTime = completedSteps.reduce((sum, step) => sum + (step.duration || 0), 0);
      this.currentExecution.performanceMetrics.averageStepTime = totalStepTime / completedSteps.length;
      
      const slowest = completedSteps.reduce((max, step) => 
        (step.duration || 0) > (max.duration || 0) ? step : max
      );
      this.currentExecution.performanceMetrics.slowestStep = {
        nodeId: slowest.nodeId,
        duration: slowest.duration || 0
      };
    }
    
    const errorSteps = this.currentExecution.steps.filter(s => s.status === 'error');
    this.currentExecution.performanceMetrics.errorRate = 
      this.currentExecution.steps.length > 0 ? errorSteps.length / this.currentExecution.steps.length : 0;
  }

  /**
   * Map execution status to our types
   */
  private mapExecutionStatus(status: string): 'waiting' | 'running' | 'success' | 'error' | 'canceled' {
    switch (status) {
      case 'waiting': return 'waiting';
      case 'running': return 'running';
      case 'success': return 'success';
      case 'error': return 'error';
      case 'canceled': return 'canceled';
      default: return 'waiting';
    }
  }

  /**
   * Map node execution status
   */
  private mapNodeExecutionStatus(status: string): 'waiting' | 'running' | 'success' | 'error' | 'skipped' {
    switch (status) {
      case 'waiting': return 'waiting';
      case 'running': return 'running';
      case 'success': return 'success';
      case 'error': return 'error';
      case 'skipped': return 'skipped';
      default: return 'waiting';
    }
  }

  /**
   * Get memory usage (simplified implementation)
   */
  private async getMemoryUsage(): Promise<number> {
    try {
      // Use browser performance API to get memory info
      const memoryInfo = await this.page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory;
        }
        return { usedJSHeapSize: 0 };
      });
      
      return memoryInfo.usedJSHeapSize || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Count network requests (simplified)
   */
  private countNetworkRequests(): number {
    // This would require network monitoring setup
    // For now, return estimated count based on steps
    return this.currentExecution.steps.length * 2; // Rough estimate
  }
}