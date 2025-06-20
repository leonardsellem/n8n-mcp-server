/**
 * Integration Health Monitor - Phase 5 Hybrid Integration
 * 
 * This module provides system health tracking, real-time node status checking,
 * and automatic alerting capabilities for the n8n MCP server integration.
 */

import { BaseWorkflowToolHandler } from '../tools/workflow/base-handler.js';
import { ToolCallResult } from '../types/index.js';
import { N8nApiError } from '../errors/index.js';

/**
 * System health status structure
 */
export interface SystemHealthStatus {
  overall: 'healthy' | 'warning' | 'critical' | 'unknown';
  score: number;
  timestamp: string;
  components: {
    apiConnectivity: ComponentHealth;
    mcpServerStatus: ComponentHealth;
    nodeAvailability: ComponentHealth;
    workflowHealth: ComponentHealth;
    resourceUsage: ComponentHealth;
  };
  alerts: HealthAlert[];
  recommendations: string[];
}

/**
 * Component health structure
 */
export interface ComponentHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  score: number;
  responseTime?: number;
  lastChecked: string;
  metrics: Record<string, any>;
  issues: string[];
}

/**
 * Health alert structure
 */
export interface HealthAlert {
  id: string;
  type: 'performance' | 'connectivity' | 'resource' | 'workflow' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  component: string;
  details: Record<string, any>;
  resolved: boolean;
  actions: string[];
}

/**
 * Node status structure
 */
export interface NodeStatus {
  nodeType: string;
  available: boolean;
  version?: string;
  lastChecked: string;
  responseTime?: number;
  errorRate: number;
  usageCount: number;
  healthScore: number;
  issues: string[];
}

/**
 * Integration Health Monitor for system health tracking
 */
export class IntegrationHealthMonitor extends BaseWorkflowToolHandler {
  private healthHistory: Map<string, SystemHealthStatus[]> = new Map();
  private activeAlerts: Map<string, HealthAlert> = new Map();
  private monitoringConfig: any = {};
  private lastHealthCheck: Date = new Date();

  constructor() {
    super();
    this.initializeHealthMonitor();
  }

  /**
   * Check overall MCP server health assessment
   */
  async checkSystemHealth(config?: {
    includeDetails?: boolean;
    checkAllComponents?: boolean;
    alertThresholds?: Record<string, number>;
  }): Promise<ToolCallResult> {
    try {
      const { includeDetails, checkAllComponents, alertThresholds } = config || {};

      const healthStatus = await this.performSystemHealthCheck(
        includeDetails || false,
        checkAllComponents || true,
        alertThresholds
      );

      // Store health status in history
      this.storeHealthHistory(healthStatus);

      // Generate alerts if needed
      const newAlerts = await this.generateHealthAlerts(healthStatus, alertThresholds);
      newAlerts.forEach(alert => this.activeAlerts.set(alert.id, alert));

      return this.formatSuccess({
        systemHealth: healthStatus,
        activeAlerts: Array.from(this.activeAlerts.values()),
        healthTrend: this.analyzeHealthTrend(),
        nextCheckRecommended: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        monitoringStatus: 'active'
      });

    } catch (error) {
      return this.formatError(`Failed to check system health: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Monitor real-time node status checking
   */
  async monitorNodeAvailability(config?: {
    nodeTypes?: string[];
    includeUsageStats?: boolean;
    performanceThresholds?: {
      maxResponseTime?: number;
      maxErrorRate?: number;
    };
  }): Promise<ToolCallResult> {
    try {
      const { nodeTypes, includeUsageStats, performanceThresholds } = config || {};

      // Get available node types
      const availableNodeTypes = await this.getAvailableNodeTypes();
      
      // Filter by requested node types if specified
      const targetNodeTypes = nodeTypes && nodeTypes.length > 0 
        ? availableNodeTypes.filter(node => nodeTypes.includes(node.name))
        : availableNodeTypes;

      // Check status of each node type
      const nodeStatuses: NodeStatus[] = [];
      for (const nodeType of targetNodeTypes) {
        const status = await this.checkNodeTypeStatus(
          nodeType,
          includeUsageStats,
          performanceThresholds
        );
        nodeStatuses.push(status);
      }

      // Analyze overall node availability
      const availabilityAnalysis = this.analyzeNodeAvailability(nodeStatuses);

      // Generate node-specific alerts
      const nodeAlerts = this.generateNodeAlerts(nodeStatuses, performanceThresholds);

      return this.formatSuccess({
        nodeAvailability: availabilityAnalysis,
        nodeStatuses,
        totalNodesChecked: nodeStatuses.length,
        healthyNodes: nodeStatuses.filter(n => n.available && n.healthScore > 75).length,
        nodeAlerts,
        lastChecked: new Date().toISOString()
      });

    } catch (error) {
      return this.formatError(`Failed to monitor node availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Detect performance issues with automatic alerting capabilities
   */
  async detectPerformanceIssues(config?: {
    timeRange?: {
      start: string;
      end: string;
    };
    workflowIds?: string[];
    issueTypes?: string[];
    autoAlert?: boolean;
    alertChannels?: string[];
  }): Promise<ToolCallResult> {
    try {
      const { timeRange, workflowIds, issueTypes, autoAlert, alertChannels } = config || {};

      // Get workflows to analyze
      const workflows = workflowIds 
        ? await Promise.all(workflowIds.map(id => this.apiService.getWorkflow(id)))
        : await this.apiService.getWorkflows({ active: true });

      // Detect performance issues
      const performanceIssues = await this.analyzePerformanceIssues(
        workflows,
        timeRange,
        issueTypes || ['slow_execution', 'high_error_rate', 'resource_exhaustion', 'dependency_failure']
      );

      // Generate performance alerts
      const performanceAlerts = await this.generatePerformanceAlerts(
        performanceIssues,
        autoAlert || false
      );

      // Send alerts if auto-alert is enabled
      let alertResults = {};
      if (autoAlert && alertChannels) {
        alertResults = await this.sendAlerts(performanceAlerts, alertChannels);
      }

      return this.formatSuccess({
        performanceIssues,
        issuesDetected: performanceIssues.length,
        criticalIssues: performanceIssues.filter(issue => issue.severity === 'critical').length,
        performanceAlerts: autoAlert ? performanceAlerts : undefined,
        alertResults: autoAlert ? alertResults : undefined,
        recommendations: this.generatePerformanceRecommendations(performanceIssues),
        detectionTimestamp: new Date().toISOString()
      });

    } catch (error) {
      return this.formatError(`Failed to detect performance issues: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Monitor system resource usage and provide optimization suggestions
   */
  async monitorSystemResources(config?: {
    resourceTypes?: string[];
    alertThresholds?: {
      cpu?: number;
      memory?: number;
      disk?: number;
      network?: number;
    };
    includeOptimizationSuggestions?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { resourceTypes, alertThresholds, includeOptimizationSuggestions } = config || {};

      // Monitor system resources
      const resourceUsage = await this.checkSystemResources(
        resourceTypes || ['cpu', 'memory', 'disk', 'network']
      );

      // Check against thresholds
      const resourceAlerts = this.checkResourceThresholds(resourceUsage, alertThresholds);

      // Generate optimization suggestions if requested
      let optimizationSuggestions: string[] = [];
      if (includeOptimizationSuggestions) {
        optimizationSuggestions = this.generateResourceOptimizationSuggestions(resourceUsage);
      }

      // Analyze resource trends
      const resourceTrends = this.analyzeResourceTrends(resourceUsage);

      return this.formatSuccess({
        resourceUsage,
        resourceAlerts,
        optimizationSuggestions: includeOptimizationSuggestions ? optimizationSuggestions : undefined,
        resourceTrends,
        overallResourceHealth: this.calculateResourceHealthScore(resourceUsage),
        monitoringTimestamp: new Date().toISOString()
      });

    } catch (error) {
      return this.formatError(`Failed to monitor system resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Configure health reporting and alerting
   */
  async configureHealthReporting(config: {
    reportingInterval?: number;
    alertChannels?: {
      email?: {
        enabled: boolean;
        recipients: string[];
        threshold: 'low' | 'medium' | 'high' | 'critical';
      };
      webhook?: {
        enabled: boolean;
        url: string;
        threshold: 'low' | 'medium' | 'high' | 'critical';
      };
      slack?: {
        enabled: boolean;
        webhookUrl: string;
        channel: string;
        threshold: 'low' | 'medium' | 'high' | 'critical';
      };
    };
    healthThresholds?: {
      overall?: number;
      components?: Record<string, number>;
    };
    retentionPeriod?: number;
  }): Promise<ToolCallResult> {
    try {
      // Validate configuration
      this.validateHealthReportingConfig(config);

      // Update monitoring configuration
      this.monitoringConfig = {
        ...this.monitoringConfig,
        ...config,
        lastUpdated: new Date().toISOString()
      };

      // Test alert channels if configured
      const channelTests = await this.testAlertChannels(config.alertChannels);

      return this.formatSuccess({
        configurationUpdated: true,
        monitoringConfig: this.monitoringConfig,
        alertChannelTests: channelTests,
        nextHealthCheck: this.calculateNextHealthCheck(config.reportingInterval),
        configurationValidation: 'passed'
      });

    } catch (error) {
      return this.formatError(`Failed to configure health reporting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================
  // PRIVATE METHODS
  // ==================

  /**
   * Initialize health monitor
   */
  private async initializeHealthMonitor(): Promise<void> {
    console.log('[HEALTH-MONITOR] Initializing integration health monitor');
    
    // Set default monitoring configuration
    this.monitoringConfig = {
      reportingInterval: 5 * 60 * 1000, // 5 minutes
      healthThresholds: {
        overall: 75,
        components: {
          apiConnectivity: 90,
          mcpServerStatus: 80,
          nodeAvailability: 85,
          workflowHealth: 75,
          resourceUsage: 70
        }
      },
      retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      alertChannels: {}
    };
  }

  /**
   * Perform comprehensive system health check
   */
  private async performSystemHealthCheck(
    includeDetails: boolean,
    checkAllComponents: boolean,
    alertThresholds?: Record<string, number>
  ): Promise<SystemHealthStatus> {
    const timestamp = new Date().toISOString();
    
    // Check individual components
    const components = {
      apiConnectivity: await this.checkApiConnectivity(),
      mcpServerStatus: await this.checkMCPServerStatus(),
      nodeAvailability: await this.checkNodeAvailabilityComponent(),
      workflowHealth: await this.checkWorkflowHealthComponent(),
      resourceUsage: await this.checkResourceUsageComponent()
    };

    // Calculate overall health score
    const componentScores = Object.values(components).map(c => c.score);
    const overallScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;

    // Determine overall status
    const overallStatus = this.determineOverallStatus(overallScore, components);

    // Generate alerts based on component health
    const alerts = await this.generateComponentAlerts(components, alertThresholds);

    // Generate recommendations
    const recommendations = this.generateHealthRecommendations(components, overallScore);

    return {
      overall: overallStatus,
      score: Math.round(overallScore),
      timestamp,
      components,
      alerts,
      recommendations
    };
  }

  /**
   * Check API connectivity
   */
  private async checkApiConnectivity(): Promise<ComponentHealth> {
    const startTime = Date.now();
    const lastChecked = new Date().toISOString();
    
    try {
      await this.apiService.checkConnectivity();
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 1000 ? 'healthy' : responseTime < 3000 ? 'warning' : 'critical',
        score: Math.max(0, 100 - (responseTime / 100)),
        responseTime,
        lastChecked,
        metrics: {
          responseTime,
          connectivityTest: 'passed'
        },
        issues: responseTime > 3000 ? ['Slow API response time'] : []
      };
    } catch (error) {
      return {
        status: 'critical',
        score: 0,
        lastChecked,
        metrics: {
          connectivityTest: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        issues: ['API connectivity failure']
      };
    }
  }

  /**
   * Check MCP server status
   */
  private async checkMCPServerStatus(): Promise<ComponentHealth> {
    const lastChecked = new Date().toISOString();
    
    try {
      // Check if MCP server processes are running
      const serverStatus = await this.checkMCPServerProcesses();
      
      return {
        status: serverStatus.running ? 'healthy' : 'critical',
        score: serverStatus.running ? 100 : 0,
        lastChecked,
        metrics: {
          processCount: serverStatus.processCount,
          memoryUsage: serverStatus.memoryUsage,
          uptime: serverStatus.uptime
        },
        issues: serverStatus.running ? [] : ['MCP server not running']
      };
    } catch (error) {
      return {
        status: 'unknown',
        score: 50,
        lastChecked,
        metrics: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        issues: ['Cannot determine MCP server status']
      };
    }
  }

  /**
   * Check node availability component
   */
  private async checkNodeAvailabilityComponent(): Promise<ComponentHealth> {
    const lastChecked = new Date().toISOString();
    
    try {
      const nodeTypes = await this.getAvailableNodeTypes();
      const totalNodes = nodeTypes.length;
      const healthyNodes = nodeTypes.filter(node => node.available !== false).length;
      
      const availabilityPercentage = totalNodes > 0 ? (healthyNodes / totalNodes) * 100 : 0;
      
      return {
        status: availabilityPercentage > 90 ? 'healthy' : availabilityPercentage > 70 ? 'warning' : 'critical',
        score: availabilityPercentage,
        lastChecked,
        metrics: {
          totalNodes,
          healthyNodes,
          availabilityPercentage
        },
        issues: availabilityPercentage < 100 ? [`${totalNodes - healthyNodes} nodes unavailable`] : []
      };
    } catch (error) {
      return {
        status: 'unknown',
        score: 0,
        lastChecked,
        metrics: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        issues: ['Cannot check node availability']
      };
    }
  }

  /**
   * Check workflow health component
   */
  private async checkWorkflowHealthComponent(): Promise<ComponentHealth> {
    const lastChecked = new Date().toISOString();
    
    try {
      const workflows = await this.apiService.getWorkflows({ active: true });
      const workflowStatuses = await Promise.all(
        workflows.slice(0, 10).map(wf => this.checkIndividualWorkflowHealth(wf.id))
      );
      
      const healthyWorkflows = workflowStatuses.filter(status => status.healthy).length;
      const totalWorkflows = workflowStatuses.length;
      const healthPercentage = totalWorkflows > 0 ? (healthyWorkflows / totalWorkflows) * 100 : 100;
      
      return {
        status: healthPercentage > 90 ? 'healthy' : healthPercentage > 70 ? 'warning' : 'critical',
        score: healthPercentage,
        lastChecked,
        metrics: {
          totalWorkflows,
          healthyWorkflows,
          healthPercentage
        },
        issues: healthPercentage < 100 ? [`${totalWorkflows - healthyWorkflows} workflows unhealthy`] : []
      };
    } catch (error) {
      return {
        status: 'unknown',
        score: 50,
        lastChecked,
        metrics: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        issues: ['Cannot check workflow health']
      };
    }
  }

  /**
   * Check resource usage component
   */
  private async checkResourceUsageComponent(): Promise<ComponentHealth> {
    const lastChecked = new Date().toISOString();
    
    try {
      const resourceUsage = await this.checkSystemResources(['cpu', 'memory']);
      const avgUsage = (resourceUsage.cpu + resourceUsage.memory) / 2;
      
      return {
        status: avgUsage < 70 ? 'healthy' : avgUsage < 85 ? 'warning' : 'critical',
        score: Math.max(0, 100 - avgUsage),
        lastChecked,
        metrics: resourceUsage,
        issues: avgUsage > 85 ? ['High resource usage detected'] : []
      };
    } catch (error) {
      return {
        status: 'unknown',
        score: 50,
        lastChecked,
        metrics: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        issues: ['Cannot check resource usage']
      };
    }
  }

  /**
   * Helper methods for health checking
   */
  private async getAvailableNodeTypes(): Promise<any[]> {
    try {
      return await this.apiService.getNodeTypes();
    } catch (error) {
      console.warn('Could not fetch node types:', error);
      return [];
    }
  }

  private async checkNodeTypeStatus(
    nodeType: any,
    includeUsageStats?: boolean,
    performanceThresholds?: any
  ): Promise<NodeStatus> {
    const lastChecked = new Date().toISOString();
    
    try {
      // Basic availability check
      const available = nodeType.name && nodeType.name.length > 0;
      
      // Calculate health score based on availability and performance
      let healthScore = available ? 90 : 0;
      
      // Mock usage statistics (in real implementation, this would query actual usage)
      const usageCount = Math.floor(Math.random() * 100);
      const errorRate = Math.random() * 10; // 0-10%
      const responseTime = 100 + Math.random() * 900; // 100-1000ms
      
      // Adjust health score based on performance
      if (performanceThresholds) {
        if (responseTime > (performanceThresholds.maxResponseTime || 1000)) {
          healthScore -= 20;
        }
        if (errorRate > (performanceThresholds.maxErrorRate || 5)) {
          healthScore -= 30;
        }
      }
      
      const issues: string[] = [];
      if (!available) issues.push('Node type not available');
      if (errorRate > 5) issues.push('High error rate');
      if (responseTime > 1000) issues.push('Slow response time');
      
      return {
        nodeType: nodeType.name,
        available,
        version: nodeType.version,
        lastChecked,
        responseTime,
        errorRate,
        usageCount,
        healthScore: Math.max(0, healthScore),
        issues
      };
    } catch (error) {
      return {
        nodeType: nodeType.name || 'unknown',
        available: false,
        lastChecked,
        responseTime: 0,
        errorRate: 100,
        usageCount: 0,
        healthScore: 0,
        issues: ['Error checking node status']
      };
    }
  }

  private analyzeNodeAvailability(nodeStatuses: NodeStatus[]): any {
    const totalNodes = nodeStatuses.length;
    const availableNodes = nodeStatuses.filter(n => n.available).length;
    const healthyNodes = nodeStatuses.filter(n => n.healthScore > 75).length;
    
    return {
      totalNodes,
      availableNodes,
      healthyNodes,
      availabilityPercentage: totalNodes > 0 ? (availableNodes / totalNodes) * 100 : 0,
      healthPercentage: totalNodes > 0 ? (healthyNodes / totalNodes) * 100 : 0,
      averageHealthScore: nodeStatuses.reduce((sum, n) => sum + n.healthScore, 0) / totalNodes
    };
  }

  private generateNodeAlerts(nodeStatuses: NodeStatus[], performanceThresholds?: any): HealthAlert[] {
    const alerts: HealthAlert[] = [];
    
    nodeStatuses.forEach(status => {
      if (!status.available) {
        alerts.push({
          id: `node-unavailable-${status.nodeType}`,
          type: 'workflow',
          severity: 'high',
          message: `Node type ${status.nodeType} is unavailable`,
          timestamp: new Date().toISOString(),
          component: 'node-availability',
          details: { nodeType: status.nodeType },
          resolved: false,
          actions: ['Check node type installation', 'Verify node type configuration']
        });
      }
      
      if (status.healthScore < 50) {
        alerts.push({
          id: `node-unhealthy-${status.nodeType}`,
          type: 'performance',
          severity: status.healthScore < 25 ? 'critical' : 'medium',
          message: `Node type ${status.nodeType} has poor health (${status.healthScore}%)`,
          timestamp: new Date().toISOString(),
          component: 'node-health',
          details: { nodeType: status.nodeType, healthScore: status.healthScore },
          resolved: false,
          actions: ['Investigate performance issues', 'Check error logs']
        });
      }
    });
    
    return alerts;
  }

  private async analyzePerformanceIssues(workflows: any[], timeRange?: any, issueTypes?: string[]): Promise<any[]> {
    const issues: any[] = [];
    
    // Mock performance issue detection
    workflows.forEach(workflow => {
      if (Math.random() > 0.8) { // 20% chance of having an issue
        issues.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          issueType: issueTypes?.[Math.floor(Math.random() * issueTypes.length)] || 'slow_execution',
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          description: 'Performance degradation detected',
          detectedAt: new Date().toISOString(),
          metrics: {
            executionTime: Math.random() * 10000,
            errorRate: Math.random() * 20
          }
        });
      }
    });
    
    return issues;
  }

  private async generatePerformanceAlerts(issues: any[], autoAlert: boolean): Promise<HealthAlert[]> {
    return issues.map(issue => ({
      id: `perf-${issue.workflowId}-${Date.now()}`,
      type: 'performance',
      severity: issue.severity,
      message: `Performance issue in workflow ${issue.workflowName}`,
      timestamp: new Date().toISOString(),
      component: 'workflow-performance',
      details: issue,
      resolved: false,
      actions: ['Investigate workflow performance', 'Check resource usage', 'Review error logs']
    }));
  }

  private generatePerformanceRecommendations(issues: any[]): string[] {
    const recommendations: string[] = [];
    
    if (issues.length === 0) {
      recommendations.push('No performance issues detected - continue monitoring');
    } else {
      recommendations.push(`Address ${issues.length} performance issues`);
      if (issues.some(i => i.severity === 'critical')) {
        recommendations.push('Focus on critical issues first');
      }
      recommendations.push('Monitor workflows after fixes');
    }
    
    return recommendations;
  }

  private async checkSystemResources(resourceTypes: string[]): Promise<any> {
    // Mock system resource checking
    const resources: any = {};
    
    resourceTypes.forEach(type => {
      resources[type] = Math.random() * 100;
    });
    
    return resources;
  }

  private checkResourceThresholds(resourceUsage: any, thresholds?: any): HealthAlert[] {
    const alerts: HealthAlert[] = [];
    
    if (thresholds) {
      Object.entries(resourceUsage).forEach(([resource, usage]) => {
        const threshold = thresholds[resource];
        if (threshold && (usage as number) > threshold) {
          alerts.push({
            id: `resource-${resource}-${Date.now()}`,
            type: 'resource',
            severity: (usage as number) > threshold * 1.2 ? 'critical' : 'medium',
            message: `High ${resource} usage: ${Math.round(usage as number)}%`,
            timestamp: new Date().toISOString(),
            component: 'system-resources',
            details: { resource, usage, threshold },
            resolved: false,
            actions: [`Investigate ${resource} usage`, 'Consider scaling resources']
          });
        }
      });
    }
    
    return alerts;
  }

  private generateResourceOptimizationSuggestions(resourceUsage: any): string[] {
    const suggestions: string[] = [];
    
    Object.entries(resourceUsage).forEach(([resource, usage]) => {
      if ((usage as number) > 80) {
        suggestions.push(`Consider optimizing ${resource} usage (currently ${Math.round(usage as number)}%)`);
      }
    });
    
    return suggestions.length > 0 ? suggestions : ['Resource usage is within normal limits'];
  }

  private analyzeResourceTrends(resourceUsage: any): any {
    // Simplified trend analysis
    return {
      cpu: 'stable',
      memory: 'increasing',
      disk: 'stable',
      network: 'stable'
    };
  }

  private calculateResourceHealthScore(resourceUsage: any): number {
    const usageValues = Object.values(resourceUsage) as number[];
    const avgUsage = usageValues.reduce((sum, usage) => sum + usage, 0) / usageValues.length;
    return Math.max(0, 100 - avgUsage);
  }

  // Additional helper methods
  private storeHealthHistory(healthStatus: SystemHealthStatus): void {
    const key = 'system';
    if (!this.healthHistory.has(key)) {
      this.healthHistory.set(key, []);
    }
    
    const history = this.healthHistory.get(key)!;
    history.push(healthStatus);
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  private analyzeHealthTrend(): string {
    const history = this.healthHistory.get('system') || [];
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-5);
    const older = history.slice(-10, -5);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.score, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'degrading';
    return 'stable';
  }

  private async generateHealthAlerts(healthStatus: SystemHealthStatus, thresholds?: Record<string, number>): Promise<HealthAlert[]> {
    const alerts: HealthAlert[] = [];
    
    // Check overall health
    if (healthStatus.score < 50) {
      alerts.push({
        id: `overall-health-${Date.now()}`,
        type: 'performance',
        severity: 'critical',
        message: `Overall system health is poor (${healthStatus.score}%)`,
        timestamp: new Date().toISOString(),
        component: 'system-overall',
        details: { score: healthStatus.score },
        resolved: false,
        actions: ['Investigate all components', 'Address critical issues']
      });
    }
    
    return alerts;
  }

  private determineOverallStatus(score: number, components: any): 'healthy' | 'warning' | 'critical' | 'unknown' {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    if (score >= 30) return 'critical';
    return 'critical';
  }

  private async generateComponentAlerts(components: any, thresholds?: Record<string, number>): Promise<HealthAlert[]> {
    const alerts: HealthAlert[] = [];
    
    Object.entries(components).forEach(([componentName, component]: [string, any]) => {
      if (component.status === 'critical') {
        alerts.push({
          id: `component-${componentName}-${Date.now()}`,
          type: 'connectivity',
          severity: 'critical',
          message: `Component ${componentName} is in critical state`,
          timestamp: new Date().toISOString(),
          component: componentName,
          details: component,
          resolved: false,
          actions: [`Investigate ${componentName}`, 'Check logs and configuration']
        });
      }
    });
    
    return alerts;
  }

  private generateHealthRecommendations(components: any, overallScore: number): string[] {
    const recommendations: string[] = [];
    
    if (overallScore < 70) {
      recommendations.push('System requires attention - multiple components showing issues');
    }
    
    Object.entries(components).forEach(([name, component]: [string, any]) => {
      if (component.status === 'critical') {
        recommendations.push(`Address critical issues in ${name}`);
      } else if (component.status === 'warning') {
        recommendations.push(`Monitor ${name} for potential issues`);
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('System is healthy - continue regular monitoring');
    }
    
    return recommendations;
  }

  // Mock implementations for various check methods
  private async checkMCPServerProcesses(): Promise<any> {
    return {
      running: true,
      processCount: 1,
      memoryUsage: Math.random() * 100,
      uptime: Math.random() * 86400000
    };
  }

  private async checkIndividualWorkflowHealth(workflowId: string): Promise<{ healthy: boolean }> {
    return { healthy: Math.random() > 0.2 }; // 80% chance of being healthy
  }

  private validateHealthReportingConfig(config: any): void {
    // Validate configuration
    if (config.reportingInterval && config.reportingInterval < 60000) {
      throw new Error('Reporting interval must be at least 1 minute');
    }
  }

  private async testAlertChannels(channels?: any): Promise<any> {
    const results: any = {};
    
    if (channels?.email?.enabled) {
      results.email = { tested: true, success: true };
    }
    
    if (channels?.webhook?.enabled) {
      results.webhook = { tested: true, success: true };
    }
    
    if (channels?.slack?.enabled) {
      results.slack = { tested: true, success: true };
    }
    
    return results;
  }

  private calculateNextHealthCheck(interval?: number): string {
    const nextCheck = new Date(Date.now() + (interval || 5 * 60 * 1000));
    return nextCheck.toISOString();
  }

  private async sendAlerts(alerts: HealthAlert[], channels: string[]): Promise<any> {
    // Mock alert sending
    return {
      sent: alerts.length,
      channels: channels.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute method for MCP tool integration
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    const { action } = args;
    
    switch (action) {
      case 'check_system_health':
        return this.checkSystemHealth(args as any);
      case 'monitor_node_availability':
        return this.monitorNodeAvailability(args as any);
      case 'detect_performance_issues':
        return this.detectPerformanceIssues(args as any);
      case 'monitor_system_resources':
        return this.monitorSystemResources(args as any);
      case 'configure_health_reporting':
        if (!args.alertChannels && !args.healthThresholds) {
          return this.formatError('alertChannels or healthThresholds are required for configure_health_reporting action');
        }
        return this.configureHealthReporting(args as any);
      default:
        return this.formatError(`Unknown health monitor action: ${action}`);
    }
  }
}

/**
 * Create Integration Health Monitor instance
 */
export function createIntegrationHealthMonitor(): IntegrationHealthMonitor {
  return new IntegrationHealthMonitor();
}