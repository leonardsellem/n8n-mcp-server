import { logger } from '../utils/logger';

export interface PerformanceMetrics {
  toolExecutions: {
    total: number;
    byTool: Record<string, number>;
    averageTime: Record<string, number>;
    errors: Record<string, number>;
  };
  database: {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;
    cacheHits: number;
    cacheMisses: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  system: {
    uptime: number;
    startTime: number;
    cpuUsage: NodeJS.CpuUsage;
  };
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private toolTimers: Map<string, number> = new Map();
  private startTime: number;
  private cpuUsageStart: NodeJS.CpuUsage;

  private constructor() {
    this.startTime = Date.now();
    this.cpuUsageStart = process.cpuUsage();
    this.metrics = {
      toolExecutions: {
        total: 0,
        byTool: {},
        averageTime: {},
        errors: {}
      },
      database: {
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueries: 0,
        cacheHits: 0,
        cacheMisses: 0
      },
      memory: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0
      },
      system: {
        uptime: 0,
        startTime: this.startTime,
        cpuUsage: { user: 0, system: 0 }
      }
    };
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startToolTimer(toolName: string): void {
    this.toolTimers.set(toolName, Date.now());
  }

  public endToolTimer(toolName: string, success: boolean = true): void {
    const startTime = this.toolTimers.get(toolName);
    if (!startTime) {
      return;
    }

    const duration = Date.now() - startTime;
    this.toolTimers.delete(toolName);

    // Update metrics
    this.metrics.toolExecutions.total++;
    this.metrics.toolExecutions.byTool[toolName] = (this.metrics.toolExecutions.byTool[toolName] || 0) + 1;
    
    // Calculate average time
    const currentAvg = this.metrics.toolExecutions.averageTime[toolName] || 0;
    const count = this.metrics.toolExecutions.byTool[toolName];
    this.metrics.toolExecutions.averageTime[toolName] = (currentAvg * (count - 1) + duration) / count;

    // Track errors
    if (!success) {
      this.metrics.toolExecutions.errors[toolName] = (this.metrics.toolExecutions.errors[toolName] || 0) + 1;
    }

    // Log slow operations
    if (duration > 5000) { // 5 seconds
      logger.warn(`Slow tool execution: ${toolName} took ${duration}ms`);
    }
  }

  public recordDatabaseQuery(duration: number): void {
    this.metrics.database.totalQueries++;
    
    // Calculate average query time
    const currentAvg = this.metrics.database.averageQueryTime;
    const count = this.metrics.database.totalQueries;
    this.metrics.database.averageQueryTime = (currentAvg * (count - 1) + duration) / count;
    
    // Track slow queries (>100ms)
    if (duration > 100) {
      this.metrics.database.slowQueries++;
    }
  }

  public recordCacheHit(): void {
    this.metrics.database.cacheHits++;
  }

  public recordCacheMiss(): void {
    this.metrics.database.cacheMisses++;
  }

  public updateSystemMetrics(): void {
    const memUsage = process.memoryUsage();
    this.metrics.memory = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss
    };

    this.metrics.system.uptime = Date.now() - this.startTime;
    this.metrics.system.cpuUsage = process.cpuUsage(this.cpuUsageStart);
  }

  public getMetrics(): PerformanceMetrics {
    this.updateSystemMetrics();
    return { ...this.metrics };
  }

  public getFormattedMetrics(): string {
    this.updateSystemMetrics();
    
    const cacheHitRate = this.metrics.database.cacheHits + this.metrics.database.cacheMisses > 0
      ? (this.metrics.database.cacheHits / (this.metrics.database.cacheHits + this.metrics.database.cacheMisses) * 100).toFixed(2)
      : '0';

    return `
Performance Metrics:
===================
Tool Executions:
  Total: ${this.metrics.toolExecutions.total}
  Top Tools: ${Object.entries(this.metrics.toolExecutions.byTool)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tool, count]) => `${tool}: ${count}`)
    .join(', ')}
  
Database:
  Total Queries: ${this.metrics.database.totalQueries}
  Average Query Time: ${this.metrics.database.averageQueryTime.toFixed(2)}ms
  Slow Queries: ${this.metrics.database.slowQueries}
  Cache Hit Rate: ${cacheHitRate}%

Memory:
  Heap Used: ${(this.metrics.memory.heapUsed / 1024 / 1024).toFixed(2)} MB
  Heap Total: ${(this.metrics.memory.heapTotal / 1024 / 1024).toFixed(2)} MB
  RSS: ${(this.metrics.memory.rss / 1024 / 1024).toFixed(2)} MB

System:
  Uptime: ${(this.metrics.system.uptime / 1000).toFixed(2)} seconds
  CPU User: ${(this.metrics.system.cpuUsage.user / 1000).toFixed(2)}ms
  CPU System: ${(this.metrics.system.cpuUsage.system / 1000).toFixed(2)}ms
`;
  }

  public getHealthStatus(): { healthy: boolean; issues: string[] } {
    this.updateSystemMetrics();
    
    const issues: string[] = [];
    
    // Check memory usage
    const heapUsagePercent = (this.metrics.memory.heapUsed / this.metrics.memory.heapTotal) * 100;
    if (heapUsagePercent > 80) {
      issues.push(`High heap usage: ${heapUsagePercent.toFixed(2)}%`);
    }
    
    // Check for slow queries
    const slowQueryPercent = this.metrics.database.totalQueries > 0 
      ? (this.metrics.database.slowQueries / this.metrics.database.totalQueries) * 100
      : 0;
    if (slowQueryPercent > 10) {
      issues.push(`High slow query rate: ${slowQueryPercent.toFixed(2)}%`);
    }
    
    // Check cache hit rate
    const totalCacheRequests = this.metrics.database.cacheHits + this.metrics.database.cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 
      ? (this.metrics.database.cacheHits / totalCacheRequests) * 100
      : 0;
    if (cacheHitRate < 50 && totalCacheRequests > 100) {
      issues.push(`Low cache hit rate: ${cacheHitRate.toFixed(2)}%`);
    }
    
    // Check error rate
    const totalErrors = Object.values(this.metrics.toolExecutions.errors).reduce((sum, count) => sum + count, 0);
    const errorRate = this.metrics.toolExecutions.total > 0 
      ? (totalErrors / this.metrics.toolExecutions.total) * 100
      : 0;
    if (errorRate > 5) {
      issues.push(`High error rate: ${errorRate.toFixed(2)}%`);
    }
    
    return {
      healthy: issues.length === 0,
      issues
    };
  }

  public reset(): void {
    this.metrics = {
      toolExecutions: {
        total: 0,
        byTool: {},
        averageTime: {},
        errors: {}
      },
      database: {
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueries: 0,
        cacheHits: 0,
        cacheMisses: 0
      },
      memory: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0
      },
      system: {
        uptime: 0,
        startTime: Date.now(),
        cpuUsage: { user: 0, system: 0 }
      }
    };
    
    this.startTime = Date.now();
    this.cpuUsageStart = process.cpuUsage();
    this.toolTimers.clear();
  }

  public logMetrics(): void {
    logger.info('Performance metrics:', this.getFormattedMetrics());
  }
}