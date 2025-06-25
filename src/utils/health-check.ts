/**
 * Health Check Utilities
 * 
 * Provides health monitoring and status reporting for the MCP server,
 * including API connectivity, system resources, and component status.
 */

import { getEnvConfig } from '../config/environment.js';
import { createResilientApiClient } from '../api/resilient-client.js';
import { getRateLimitManager } from '../security/rate-limiter.js';
import { getAuditLogger } from '../security/audit-logger.js';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  components: {
    n8nApi: ComponentHealth;
    database: ComponentHealth;
    rateLimiter: ComponentHealth;
    auditLogger: ComponentHealth;
    memory: ComponentHealth;
    disk: ComponentHealth;
  };
  details?: {
    environment: string;
    nodeVersion: string;
    platformArch: string;
    totalMemory: number;
    freeMemory: number;
    cpuUsage: number;
  };
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastChecked: string;
  message?: string;
  details?: any;
}

/**
 * Comprehensive health checker for the MCP server
 */
export class HealthChecker {
  private startTime = Date.now();
  private lastHealthCheck: HealthStatus | null = null;

  /**
   * Perform a complete health check
   */
  async performHealthCheck(includeDetails = false): Promise<HealthStatus> {
    const _startTime = Date.now();
    
    try {
      // Check all components in parallel
      const [
        n8nApiHealth,
        rateLimiterHealth,
        auditLoggerHealth,
        memoryHealth,
        diskHealth
      ] = await Promise.allSettled([
        this.checkN8nApi(),
        this.checkRateLimiter(),
        this.checkAuditLogger(),
        this.checkMemory(),
        this.checkDisk()
      ]);

      const components = {
        n8nApi: this.getResult(n8nApiHealth),
        database: { status: 'healthy' as const, lastChecked: new Date().toISOString(), message: 'In-memory storage operational' },
        rateLimiter: this.getResult(rateLimiterHealth),
        auditLogger: this.getResult(auditLoggerHealth),
        memory: this.getResult(memoryHealth),
        disk: this.getResult(diskHealth)
      };

      // Determine overall status
      const componentStatuses = Object.values(components).map(c => c.status);
      const overallStatus = this.determineOverallStatus(componentStatuses);

      const healthStatus: HealthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '0.1.4',
        components
      };

      // Add detailed information if requested
      if (includeDetails) {
        healthStatus.details = {
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version,
          platformArch: `${process.platform}/${process.arch}`,
          totalMemory: process.memoryUsage().heapTotal,
          freeMemory: process.memoryUsage().heapUsed,
          cpuUsage: process.cpuUsage().user + process.cpuUsage().system
        };
      }

      this.lastHealthCheck = healthStatus;
      return healthStatus;

    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '0.1.4',
        components: {
          n8nApi: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' },
          database: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' },
          rateLimiter: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' },
          auditLogger: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' },
          memory: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' },
          disk: { status: 'unhealthy', lastChecked: new Date().toISOString(), message: 'Health check failed' }
        }
      };
    }
  }

  /**
   * Quick health check for Docker health command
   */
  async quickHealthCheck(): Promise<boolean> {
    try {
      const health = await this.performHealthCheck(false);
      return health.status !== 'unhealthy';
    } catch {
      return false;
    }
  }

  /**
   * Get the last health check result
   */
  getLastHealthCheck(): HealthStatus | null {
    return this.lastHealthCheck;
  }

  /**
   * Check n8n API connectivity
   */
  private async checkN8nApi(): Promise<ComponentHealth> {
    const _startTime = Date.now();
    
    try {
      const envConfig = getEnvConfig();
      const apiClient = createResilientApiClient(envConfig);
      
      const connectivity = await apiClient.checkConnectivityDetailed();
      const responseTime = Date.now() - _startTime;

      if (connectivity.connected) {
        return {
          status: connectivity.latency > 5000 ? 'degraded' : 'healthy',
          responseTime,
          lastChecked: new Date().toISOString(),
          message: `Connected (${connectivity.latency}ms)`,
          details: {
            latency: connectivity.latency,
            circuitBreakerStates: connectivity.circuitBreakerStates
          }
        };
      } else {
        return {
          status: 'degraded', // Degraded because we have fallbacks
          responseTime,
          lastChecked: new Date().toISOString(),
          message: 'API unavailable, using fallbacks',
          details: { 
            latency: connectivity.latency,
            recentMetrics: connectivity.recentMetrics.length
          }
        };
      }
    } catch (error) {
      return {
        status: 'degraded',
        responseTime: Date.now() - _startTime,
        lastChecked: new Date().toISOString(),
        message: 'API check failed, fallback mode active',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Check rate limiter health
   */
  private async checkRateLimiter(): Promise<ComponentHealth> {
    try {
      const rateLimitManager = getRateLimitManager();
      const stats = rateLimitManager.getStats();
      
      const totalKeys = Object.values(stats).reduce((sum, stat) => sum + stat.totalKeys, 0);
      const memoryUsage = Object.values(stats).reduce((sum, stat) => sum + stat.memoryUsage, 0);
      
      return {
        status: memoryUsage > 50 * 1024 * 1024 ? 'degraded' : 'healthy', // 50MB threshold
        lastChecked: new Date().toISOString(),
        message: `${totalKeys} active rate limit keys`,
        details: {
          totalKeys,
          memoryUsage,
          stats
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        message: 'Rate limiter check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Check audit logger health
   */
  private async checkAuditLogger(): Promise<ComponentHealth> {
    try {
      const auditLogger = getAuditLogger();
      const stats = auditLogger.getStatistics();
      
      return {
        status: stats.totalEvents > 100000 ? 'degraded' : 'healthy', // 100k events threshold
        lastChecked: new Date().toISOString(),
        message: `${stats.totalEvents} audit events logged`,
        details: {
          totalEvents: stats.totalEvents,
          recentErrors: stats.recentErrors.length,
          eventsByResult: stats.eventsByResult
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        message: 'Audit logger check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(): Promise<ComponentHealth> {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (heapUsedPercent > 90) status = 'unhealthy';
      else if (heapUsedPercent > 80) status = 'degraded';
      
      return {
        status,
        lastChecked: new Date().toISOString(),
        message: `Heap usage: ${heapUsedPercent.toFixed(1)}%`,
        details: {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          external: memUsage.external,
          rss: memUsage.rss,
          heapUsedPercent: Math.round(heapUsedPercent)
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        message: 'Memory check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Check disk space (if possible)
   */
  private async checkDisk(): Promise<ComponentHealth> {
    try {
      // Simple check - try to write a small test file
      const fs = await import('fs/promises');
      const testFile = '/tmp/health-check-test';
      
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
      
      return {
        status: 'healthy',
        lastChecked: new Date().toISOString(),
        message: 'Disk write successful'
      };
    } catch (error) {
      return {
        status: 'degraded',
        lastChecked: new Date().toISOString(),
        message: 'Disk check failed or read-only filesystem',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Extract result from Promise.allSettled
   */
  private getResult(settledResult: PromiseSettledResult<ComponentHealth>): ComponentHealth {
    if (settledResult.status === 'fulfilled') {
      return settledResult.value;
    } else {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        message: 'Component check failed',
        details: { error: settledResult.reason }
      };
    }
  }

  /**
   * Determine overall status from component statuses
   */
  private determineOverallStatus(statuses: Array<'healthy' | 'degraded' | 'unhealthy'>): 'healthy' | 'degraded' | 'unhealthy' {
    if (statuses.some(s => s === 'unhealthy')) return 'unhealthy';
    if (statuses.some(s => s === 'degraded')) return 'degraded';
    return 'healthy';
  }
}

// Global health checker instance
let globalHealthChecker: HealthChecker | null = null;

/**
 * Get or create global health checker
 */
export function getHealthChecker(): HealthChecker {
  if (!globalHealthChecker) {
    globalHealthChecker = new HealthChecker();
  }
  return globalHealthChecker;
}

/**
 * Simple health check function for Docker
 */
export async function healthCheck(): Promise<void> {
  const checker = getHealthChecker();
  const isHealthy = await checker.quickHealthCheck();
  
  if (!isHealthy) {
    process.exit(1);
  }
  
  console.log('Health check passed');
}

/**
 * Detailed health check for monitoring endpoints
 */
export async function detailedHealthCheck(): Promise<HealthStatus> {
  const checker = getHealthChecker();
  return checker.performHealthCheck(true);
}
