/**
 * Performance Monitor - Track MCP Server Performance
 */

export interface PerformanceMetrics {
  startupTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  nodeLoadTimes: Record<string, number>;
  discoveryStats: {
    totalNodes: number;
    loadedNodes: number;
    cacheHits: number;
    cacheMisses: number;
  };
  requestStats: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export class PerformanceMonitor {
  private startTime: number;
  private metrics: PerformanceMetrics;
  private requestTimes: number[] = [];
  private requestErrors: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private nodeLoadTimes: Map<string, number> = new Map();

  constructor() {
    this.startTime = Date.now();
    this.metrics = this.initializeMetrics();
    
    // Start periodic monitoring
    this.startPeriodicMonitoring();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      startupTime: 0,
      memoryUsage: process.memoryUsage(),
      nodeLoadTimes: {},
      discoveryStats: {
        totalNodes: 0,
        loadedNodes: 0,
        cacheHits: 0,
        cacheMisses: 0
      },
      requestStats: {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0
      }
    };
  }

  /**
   * Mark server as fully started
   */
  markStartupComplete(): void {
    this.metrics.startupTime = Date.now() - this.startTime;
    console.log(`[Performance] Server startup completed in ${this.metrics.startupTime}ms`);
  }

  /**
   * Track node load time
   */
  trackNodeLoad(nodeName: string, loadTime: number): void {
    this.nodeLoadTimes.set(nodeName, loadTime);
    this.metrics.nodeLoadTimes[nodeName] = loadTime;
    
    if (loadTime > 1000) {
      console.warn(`[Performance] Slow node load: ${nodeName} took ${loadTime}ms`);
    }
  }

  /**
   * Track cache performance
   */
  recordCacheHit(): void {
    this.cacheHits++;
    this.metrics.discoveryStats.cacheHits = this.cacheHits;
  }

  recordCacheMiss(): void {
    this.cacheMisses++;
    this.metrics.discoveryStats.cacheMisses = this.cacheMisses;
  }

  /**
   * Track request performance
   */
  trackRequest(responseTime: number, isError: boolean = false): void {
    this.requestTimes.push(responseTime);
    if (isError) {
      this.requestErrors++;
    }

    // Keep only last 100 requests for averaging
    if (this.requestTimes.length > 100) {
      this.requestTimes.shift();
    }

    this.updateRequestStats();
  }

  private updateRequestStats(): void {
    const totalRequests = this.requestTimes.length;
    const averageResponseTime = totalRequests > 0 
      ? this.requestTimes.reduce((sum, time) => sum + time, 0) / totalRequests 
      : 0;
    const errorRate = totalRequests > 0 
      ? (this.requestErrors / (totalRequests + this.requestErrors)) * 100 
      : 0;

    this.metrics.requestStats = {
      totalRequests: totalRequests + this.requestErrors,
      averageResponseTime,
      errorRate
    };
  }

  /**
   * Update discovery stats
   */
  updateDiscoveryStats(totalNodes: number, loadedNodes: number): void {
    this.metrics.discoveryStats.totalNodes = totalNodes;
    this.metrics.discoveryStats.loadedNodes = loadedNodes;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    this.metrics.memoryUsage = process.memoryUsage();
    return { ...this.metrics };
  }

  /**
   * Get formatted performance report
   */
  getFormattedReport(): string {
    const metrics = this.getMetrics();
    const memoryMB = {
      rss: Math.round(metrics.memoryUsage.rss / 1024 / 1024),
      heapUsed: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(metrics.memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(metrics.memoryUsage.external / 1024 / 1024)
    };

    const cacheEfficiency = metrics.discoveryStats.cacheHits + metrics.discoveryStats.cacheMisses > 0
      ? (metrics.discoveryStats.cacheHits / (metrics.discoveryStats.cacheHits + metrics.discoveryStats.cacheMisses) * 100).toFixed(1)
      : '0';

    return `
🔍 MCP Server Performance Report
════════════════════════════════

⏱️  Startup Time: ${metrics.startupTime}ms
💾 Memory Usage:
   • RSS: ${memoryMB.rss}MB
   • Heap Used: ${memoryMB.heapUsed}MB
   • Heap Total: ${memoryMB.heapTotal}MB
   • External: ${memoryMB.external}MB

📊 Discovery Statistics:
   • Total Nodes: ${metrics.discoveryStats.totalNodes}
   • Loaded Nodes: ${metrics.discoveryStats.loadedNodes}
   • Cache Hits: ${metrics.discoveryStats.cacheHits}
   • Cache Misses: ${metrics.discoveryStats.cacheMisses}
   • Cache Efficiency: ${cacheEfficiency}%

🌐 Request Statistics:
   • Total Requests: ${metrics.requestStats.totalRequests}
   • Average Response Time: ${metrics.requestStats.averageResponseTime.toFixed(1)}ms
   • Error Rate: ${metrics.requestStats.errorRate.toFixed(1)}%

🚀 Node Load Performance:
${this.getTopSlowNodes(5)}
════════════════════════════════
`;
  }

  private getTopSlowNodes(count: number): string {
    const sortedNodes = Array.from(this.nodeLoadTimes.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count);

    if (sortedNodes.length === 0) {
      return '   • No node load times recorded yet';
    }

    return sortedNodes
      .map(([name, time]) => `   • ${name}: ${time}ms`)
      .join('\n');
  }

  /**
   * Log performance warnings
   */
  checkPerformanceThresholds(): void {
    const metrics = this.getMetrics();
    const memoryMB = metrics.memoryUsage.heapUsed / 1024 / 1024;

    // Memory usage warning
    if (memoryMB > 500) {
      console.warn(`[Performance] High memory usage: ${Math.round(memoryMB)}MB`);
    }

    // Response time warning
    if (metrics.requestStats.averageResponseTime > 5000) {
      console.warn(`[Performance] Slow response times: ${metrics.requestStats.averageResponseTime.toFixed(1)}ms average`);
    }

    // Error rate warning
    if (metrics.requestStats.errorRate > 5) {
      console.warn(`[Performance] High error rate: ${metrics.requestStats.errorRate.toFixed(1)}%`);
    }
  }

  /**
   * Start periodic monitoring
   */
  private startPeriodicMonitoring(): void {
    // Check performance every 30 seconds
    setInterval(() => {
      this.checkPerformanceThresholds();
    }, 30000);

    // Log detailed report every 5 minutes
    setInterval(() => {
      console.log(this.getFormattedReport());
    }, 300000);
  }

  /**
   * Create a timer for measuring operation duration
   */
  createTimer(operationName: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      if (operationName.includes('node')) {
        this.trackNodeLoad(operationName, duration);
      } else {
        console.log(`[Performance] ${operationName} completed in ${duration}ms`);
      }
    };
  }

  /**
   * Middleware wrapper for tracking request performance
   */
  wrapRequest<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    const startTime = Date.now();
    
    return operation()
      .then(result => {
        const duration = Date.now() - startTime;
        this.trackRequest(duration, false);
        
        if (duration > 2000) {
          console.warn(`[Performance] Slow operation: ${operationName} took ${duration}ms`);
        }
        
        return result;
      })
      .catch(error => {
        const duration = Date.now() - startTime;
        this.trackRequest(duration, true);
        console.error(`[Performance] Failed operation: ${operationName} took ${duration}ms`);
        throw error;
      });
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;