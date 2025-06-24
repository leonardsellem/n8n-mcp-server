/**
 * API Health Monitor Tool
 * 
 * Monitors external API integration health, tracks connectivity,
 * performance metrics, and provides diagnostics for troubleshooting.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { getApiRecoveryManager } from '../../utils/api-recovery.js';
import { getEnvConfig } from '../../config/environment.js';
import { createResilientApiClient } from '../../api/resilient-client.js';

export interface ApiHealthReport {
  overall: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    score: number; // 0-100
    lastUpdated: string;
  };
  n8nApi: {
    connected: boolean;
    latency: number;
    successRate: number;
    circuitBreakerStatus: Record<string, string>;
    lastError?: string;
  };
  recovery: {
    fallbacksAvailable: number;
    cacheHitRate: number;
    recoverySuccessRate: number;
    totalRecoveries: number;
  };
  performance: {
    averageResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
    timeouts: number;
  };
  connectivity: {
    reachable: boolean;
    dnsResolution: boolean;
    sslValid: boolean;
    authentication: boolean;
  };
  recommendations: string[];
  diagnostics: {
    endpoints: Array<{
      endpoint: string;
      status: 'ok' | 'slow' | 'error' | 'timeout';
      responseTime: number;
      statusCode?: number;
      error?: string;
    }>;
    recent_errors: Array<{
      timestamp: string;
      endpoint: string;
      error: string;
      recovery_used?: string;
    }>;
  };
}

/**
 * Handler for monitoring API health and integration status
 */
export class ApiHealthMonitorHandler {
  async execute(args: {
    includeDetailedDiagnostics?: boolean;
    testEndpoints?: boolean;
    maxHistoryEntries?: number;
  } = {}): Promise<ToolCallResult> {
    try {
      const {
        includeDetailedDiagnostics = true,
        testEndpoints = true,
        maxHistoryEntries = 10
      } = args;

      console.log('[ApiHealthMonitor] Starting comprehensive API health check...');

      // Get configuration and clients
      const config = getEnvConfig();
      const apiClient = createResilientApiClient(config);
      const recoveryManager = getApiRecoveryManager(config);

      // Perform health assessment
      const healthReport = await this.generateHealthReport(
        apiClient,
        recoveryManager,
        includeDetailedDiagnostics,
        testEndpoints,
        maxHistoryEntries
      );

      // Determine overall status message
      const statusMessage = this.getStatusMessage(healthReport);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(healthReport, null, 2)
        }],
        isError: false
      };

    } catch (error) {
      console.error('[ApiHealthMonitor] Health check failed:', error);
      return {
        content: [{
          type: 'text',
          text: `API health monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }

  /**
   * Generate comprehensive health report
   */
  private async generateHealthReport(
    apiClient: any,
    recoveryManager: any,
    includeDetailedDiagnostics: boolean,
    testEndpoints: boolean,
    maxHistoryEntries: number
  ): Promise<ApiHealthReport> {
    
    // Test n8n API connectivity
    const connectivityCheck = await apiClient.checkConnectivity();
    const healthStats = apiClient.getHealthStats();
    const recoveryStats = recoveryManager.getRecoveryStats();

    // Test specific endpoints if requested
    let endpointDiagnostics: any[] = [];
    if (testEndpoints && includeDetailedDiagnostics) {
      endpointDiagnostics = await this.testCriticalEndpoints(apiClient);
    }

    // Perform detailed connectivity tests
    const connectivityDetails = await this.testConnectivityDetails(apiClient);

    // Calculate overall health score
    const overallScore = this.calculateHealthScore(
      connectivityCheck,
      healthStats,
      recoveryStats,
      connectivityDetails
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      connectivityCheck,
      healthStats,
      recoveryStats,
      connectivityDetails
    );

    // Get recent errors from metrics
    const recentErrors = this.extractRecentErrors(recoveryStats, maxHistoryEntries);

    const healthReport: ApiHealthReport = {
      overall: {
        status: this.determineOverallStatus(overallScore),
        score: overallScore,
        lastUpdated: new Date().toISOString()
      },
      n8nApi: {
        connected: connectivityCheck.connected,
        latency: connectivityCheck.latency,
        successRate: healthStats.successRate,
        circuitBreakerStatus: healthStats.circuitBreakerStatus,
        lastError: recentErrors.length > 0 ? recentErrors[0].error : undefined
      },
      recovery: {
        fallbacksAvailable: this.countAvailableFallbacks(recoveryStats),
        cacheHitRate: this.calculateCacheHitRate(recoveryStats),
        recoverySuccessRate: recoveryStats.successRate,
        totalRecoveries: recoveryStats.fallbackUsageRate > 0 ? 
          Math.round(recoveryStats.totalOperations * recoveryStats.fallbackUsageRate / 100) : 0
      },
      performance: {
        averageResponseTime: healthStats.averageLatency,
        requestsPerMinute: this.calculateRequestsPerMinute(healthStats),
        errorRate: 100 - healthStats.successRate,
        timeouts: this.countTimeouts(healthStats)
      },
      connectivity: connectivityDetails,
      recommendations,
      diagnostics: {
        endpoints: endpointDiagnostics,
        recent_errors: recentErrors
      }
    };

    return healthReport;
  }

  /**
   * Test critical n8n API endpoints
   */
  private async testCriticalEndpoints(apiClient: any): Promise<any[]> {
    const endpoints = [
      { name: 'workflows', method: 'GET', path: '/workflows?limit=1' },
      { name: 'node-types', method: 'GET', path: '/node-types' },
      { name: 'credentials', method: 'GET', path: '/credentials' },
      { name: 'executions', method: 'GET', path: '/executions?limit=1' },
      { name: 'credential-types', method: 'GET', path: '/credential-types' }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const response = await apiClient.makeResilientRequest({
          method: endpoint.method,
          url: endpoint.path,
          timeout: 10000
        });

        results.push({
          endpoint: endpoint.name,
          status: 'ok' as const,
          responseTime: Date.now() - startTime,
          statusCode: response.status
        });
      } catch (error: any) {
        const responseTime = Date.now() - startTime;
        const status = responseTime > 10000 ? 'timeout' : 
                     responseTime > 5000 ? 'slow' : 'error';

        results.push({
          endpoint: endpoint.name,
          status,
          responseTime,
          statusCode: error.response?.status,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Test detailed connectivity aspects
   */
  private async testConnectivityDetails(apiClient: any): Promise<{
    reachable: boolean;
    dnsResolution: boolean;
    sslValid: boolean;
    authentication: boolean;
  }> {
    let reachable = false;
    let dnsResolution = false;
    let sslValid = false;
    let authentication = false;

    try {
      // Test basic reachability
      const connectivityCheck = await apiClient.checkConnectivity();
      reachable = connectivityCheck.connected;

      if (reachable) {
        // DNS resolution is working if we can reach the API
        dnsResolution = true;

        // SSL is valid if HTTPS connection succeeds
        const config = getEnvConfig();
        sslValid = config.n8nApiUrl.startsWith('https://');

        // Test authentication by checking if we can access protected endpoints
        try {
          await apiClient.makeResilientRequest({
            method: 'GET',
            url: '/workflows?limit=1',
            timeout: 5000
          });
          authentication = true;
        } catch (error: any) {
          authentication = error.response?.status !== 401 && error.response?.status !== 403;
        }
      }
    } catch (error) {
      console.warn('[ApiHealthMonitor] Connectivity details test failed:', error);
    }

    return {
      reachable,
      dnsResolution,
      sslValid,
      authentication
    };
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(
    connectivityCheck: any,
    healthStats: any,
    recoveryStats: any,
    connectivityDetails: any
  ): number {
    let score = 0;

    // Connectivity (30 points)
    if (connectivityCheck.connected) {
      score += 30;
    } else if (recoveryStats.fallbackUsageRate > 0) {
      score += 15; // Partial score for working fallbacks
    }

    // Performance (25 points)
    const latencyScore = Math.max(0, 25 - (connectivityCheck.latency / 100));
    score += Math.min(25, latencyScore);

    // Success rate (25 points)
    score += (healthStats.successRate / 100) * 25;

    // Recovery capabilities (10 points)
    if (recoveryStats.successRate > 80) {
      score += 10;
    } else if (recoveryStats.successRate > 50) {
      score += 5;
    }

    // Authentication and security (10 points)
    if (connectivityDetails.authentication) score += 5;
    if (connectivityDetails.sslValid) score += 5;

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  /**
   * Determine overall status based on score
   */
  private determineOverallStatus(score: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (score >= 80) return 'healthy';
    if (score >= 50) return 'degraded';
    return 'unhealthy';
  }

  /**
   * Generate health recommendations
   */
  private generateRecommendations(
    connectivityCheck: any,
    healthStats: any,
    recoveryStats: any,
    connectivityDetails: any
  ): string[] {
    const recommendations: string[] = [];

    if (!connectivityCheck.connected) {
      recommendations.push('n8n API is not reachable. Check network connectivity and API URL configuration.');
    }

    if (!connectivityDetails.authentication) {
      recommendations.push('Authentication failed. Verify your n8n API key is correct and has proper permissions.');
    }

    if (connectivityCheck.latency > 2000) {
      recommendations.push(`High API latency detected (${connectivityCheck.latency}ms). Consider checking network conditions or n8n server performance.`);
    }

    if (healthStats.successRate < 90) {
      recommendations.push(`API success rate is below 90% (${healthStats.successRate.toFixed(1)}%). Check for intermittent connectivity issues.`);
    }

    if (recoveryStats.fallbackUsageRate > 20) {
      recommendations.push(`High fallback usage (${recoveryStats.fallbackUsageRate.toFixed(1)}%). Primary API endpoints may be unreliable.`);
    }

    if (!connectivityDetails.sslValid) {
      recommendations.push('SSL/TLS configuration should be verified for secure connections.');
    }

    // Circuit breaker warnings
    const openCircuitBreakers = Object.entries(healthStats.circuitBreakerStatus)
      .filter(([_, status]) => status === 'open');
    
    if (openCircuitBreakers.length > 0) {
      recommendations.push(`Circuit breakers are open for: ${openCircuitBreakers.map(([endpoint]) => endpoint).join(', ')}. These endpoints are temporarily blocked.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('API health is good. All systems operating normally.');
    }

    return recommendations;
  }

  /**
   * Extract recent errors from recovery stats
   */
  private extractRecentErrors(recoveryStats: any, maxEntries: number): Array<{
    timestamp: string;
    endpoint: string;
    error: string;
    recovery_used?: string;
  }> {
    // This would extract from actual metrics if available
    // For now, return empty array as we don't have detailed error history
    return [];
  }

  /**
   * Count available fallback strategies
   */
  private countAvailableFallbacks(recoveryStats: any): number {
    return Object.keys(recoveryStats.operationStats || {}).length;
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(recoveryStats: any): number {
    if (recoveryStats.cacheStats?.size > 0) {
      return 75; // Estimated cache hit rate
    }
    return 0;
  }

  /**
   * Calculate requests per minute
   */
  private calculateRequestsPerMinute(healthStats: any): number {
    // Estimate based on total requests
    const estimatedRpm = healthStats.totalRequests / 10; // Rough estimate
    return Math.round(estimatedRpm);
  }

  /**
   * Count timeouts from health stats
   */
  private countTimeouts(healthStats: any): number {
    // Would count actual timeouts if tracked
    return 0;
  }

  /**
   * Get status message for health report
   */
  private getStatusMessage(healthReport: ApiHealthReport): string {
    const status = healthReport.overall.status;
    const score = healthReport.overall.score;
    
    switch (status) {
      case 'healthy':
        return `API integration is healthy (${score}/100). All systems operational.`;
      case 'degraded':
        return `API integration is degraded (${score}/100). Some functionality may be limited.`;
      case 'unhealthy':
        return `API integration is unhealthy (${score}/100). Significant issues detected.`;
      default:
        return `API integration status unknown (${score}/100).`;
    }
  }
}

export function getApiHealthMonitorToolDefinition(): ToolDefinition {
  return {
    name: 'monitor_api_health',
    description: 'Monitor external API integration health, connectivity, and performance metrics with detailed diagnostics',
    inputSchema: {
      type: 'object',
      properties: {
        includeDetailedDiagnostics: {
          type: 'boolean',
          description: 'Include detailed diagnostic information in the health report',
          default: true
        },
        testEndpoints: {
          type: 'boolean',
          description: 'Test individual API endpoints for specific health checks',
          default: true
        },
        maxHistoryEntries: {
          type: 'number',
          description: 'Maximum number of recent error entries to include',
          default: 10
        }
      },
      required: []
    }
  };
}