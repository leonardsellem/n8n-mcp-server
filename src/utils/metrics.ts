/**
 * Metrics Collection and Monitoring
 * Provides performance monitoring and operational metrics
 */

interface MetricEntry {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

interface PerformanceMetrics {
  requestCount: number;
  errorCount: number;
  responseTimeP50: number;
  responseTimeP95: number;
  responseTimeP99: number;
  cacheHitRate: number;
  memoryUsageMB: number;
  uptime: number;
}

export class MetricsCollector {
  private metrics = new Map<string, MetricEntry[]>();
  private startTime = Date.now();
  
  // Performance counters
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];
  
  constructor(private maxHistorySize = 1000) {
    // Cleanup old metrics every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Record a counter metric
   */
  incrementCounter(name: string, labels?: Record<string, string>): void {
    this.recordMetric(name, 1, labels);
  }

  /**
   * Record a gauge metric
   */
  recordGauge(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric(name, value, labels);
  }

  /**
   * Record request timing
   */
  recordRequestTime(durationMs: number, success: boolean = true): void {
    this.requestCount++;
    if (!success) this.errorCount++;
    
    this.responseTimes.push(durationMs);
    
    // Keep only recent response times for percentile calculation
    if (this.responseTimes.length > this.maxHistorySize) {
      this.responseTimes = this.responseTimes.slice(-this.maxHistorySize);
    }
    
    this.recordMetric('request_duration_ms', durationMs);
    this.recordMetric('request_total', 1, { status: success ? 'success' : 'error' });
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const count = sortedTimes.length;
    
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      responseTimeP50: count > 0 ? sortedTimes[Math.floor(count * 0.5)] : 0,
      responseTimeP95: count > 0 ? sortedTimes[Math.floor(count * 0.95)] : 0,
      responseTimeP99: count > 0 ? sortedTimes[Math.floor(count * 0.99)] : 0,
      cacheHitRate: this.getCacheHitRate(),
      memoryUsageMB: this.getMemoryUsageMB(),
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get metric history
   */
  getMetric(name: string): MetricEntry[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get all metrics for monitoring export
   */
  getAllMetrics(): Record<string, MetricEntry[]> {
    const result: Record<string, MetricEntry[]> = {};
    for (const [key, value] of this.metrics.entries()) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Record timing for a function execution
   */
  async timeFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    let success = true;
    
    try {
      const result = await fn();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - start;
      this.recordRequestTime(duration, success);
      this.recordMetric(`${name}_duration_ms`, duration);
    }
  }

  /**
   * Create a timer for manual timing
   */
  startTimer(name: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.recordMetric(`${name}_duration_ms`, duration);
    };
  }

  private recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const entries = this.metrics.get(name)!;
    entries.push({
      timestamp: Date.now(),
      value,
      labels
    });
    
    // Keep only recent entries
    if (entries.length > this.maxHistorySize) {
      entries.splice(0, entries.length - this.maxHistorySize);
    }
  }

  private getCacheHitRate(): number {
    // Import cache stats if available
    try {
      const { nodeInfoCache, searchCache } = require('./query-cache');
      const nodeStats = nodeInfoCache.getStats();
      const searchStats = searchCache.getStats();
      
      const totalRequests = nodeStats.totalRequests + searchStats.totalRequests;
      const totalHits = nodeStats.hits + searchStats.hits;
      
      return totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
    } catch {
      return 0;
    }
  }

  private getMemoryUsageMB(): number {
    const usage = process.memoryUsage();
    return Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100;
  }

  private cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [name, entries] of this.metrics.entries()) {
      const filtered = entries.filter(entry => entry.timestamp > cutoff);
      this.metrics.set(name, filtered);
    }
  }
}

// Global metrics instance
export const metricsCollector = new MetricsCollector();

/**
 * Enhanced logger with metrics integration
 */
export class StructuredLogger {
  constructor(private serviceName: string = 'n8n-mcp') {}

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
    metricsCollector.incrementCounter('log_warnings', { service: this.serviceName });
  }

  error(message: string, error?: any): void {
    this.log('error', message, error);
    metricsCollector.incrementCounter('log_errors', { service: this.serviceName });
  }

  debug(message: string, data?: any): void {
    if (process.env.DEBUG === 'true' || process.env.LOG_LEVEL === 'debug') {
      this.log('debug', message, data);
    }
  }

  private log(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...(data && { data })
    };

    // In stdio mode, log to stderr to avoid interfering with MCP protocol
    const output = process.env.MCP_MODE === 'stdio' ? process.stderr : process.stdout;
    
    if (process.env.LOG_FORMAT === 'json') {
      output.write(JSON.stringify(logEntry) + '\n');
    } else {
      output.write(`${timestamp} [${level.toUpperCase()}] ${this.serviceName}: ${message}\n`);
      if (data) {
        output.write(`  Data: ${JSON.stringify(data, null, 2)}\n`);
      }
    }
  }
}

// Global enhanced logger
export const structuredLogger = new StructuredLogger();