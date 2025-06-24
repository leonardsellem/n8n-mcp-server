/**
 * Resilient API Client
 * 
 * Enhanced client with comprehensive retry logic, circuit breaker pattern,
 * connection pooling, and graceful degradation for external API integrations.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EnhancedN8nApiClient } from './enhanced-client.js';
import { EnvConfig } from '../config/environment.js';
import { handleAxiosError, N8nApiError } from '../errors/index.js';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export interface ConnectionPoolConfig {
  maxConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
}

export interface ApiCallMetrics {
  endpoint: string;
  method: string;
  startTime: number;
  endTime?: number;
  statusCode?: number;
  success: boolean;
  retryCount: number;
  error?: string;
}

/**
 * Circuit breaker states
 */
enum CircuitBreakerState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open'
}

/**
 * Circuit breaker for API endpoints
 */
class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private nextAttemptTime = 0;
  
  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN - requests blocked');
      }
      this.state = CircuitBreakerState.HALF_OPEN;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitBreakerState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.resetTimeout;
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getMetrics() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}

/**
 * Enhanced connection pool for managing concurrent requests
 */
class EnhancedConnectionPool {
  private activeConnections = new Map<string, number>();
  private waitingQueue = new Map<string, Array<() => void>>();
  
  constructor(private config: ConnectionPoolConfig) {}

  async acquireConnection(endpoint: string): Promise<string> {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const current = this.activeConnections.get(endpoint) || 0;
    
    if (current < this.config.maxConnections) {
      this.activeConnections.set(endpoint, current + 1);
      return connectionId;
    }

    // Wait for available connection
    return new Promise((resolve) => {
      if (!this.waitingQueue.has(endpoint)) {
        this.waitingQueue.set(endpoint, []);
      }
      this.waitingQueue.get(endpoint)!.push(() => resolve(connectionId));
    });
  }

  releaseConnection(endpoint: string, connectionId: string): void {
    const current = this.activeConnections.get(endpoint) || 0;
    this.activeConnections.set(endpoint, Math.max(0, current - 1));
    
    // Process waiting queue
    const waiting = this.waitingQueue.get(endpoint);
    if (waiting && waiting.length > 0) {
      const next = waiting.shift();
      if (next) {
        this.activeConnections.set(endpoint, (this.activeConnections.get(endpoint) || 0) + 1);
        next();
      }
    }
  }

  getStats() {
    return {
      activeConnections: Object.fromEntries(this.activeConnections),
      waitingQueues: Object.fromEntries(
        Array.from(this.waitingQueue.entries()).map(([key, value]) => [key, value.length])
      )
    };
  }
}

/**
 * Resilient n8n API Client with enhanced error handling and resilience patterns
 */
export class ResilientN8nApiClient extends EnhancedN8nApiClient {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private connectionPool: EnhancedConnectionPool;
  private metrics: ApiCallMetrics[] = [];
  private retryConfig: RetryConfig;
  private circuitBreakerConfig: CircuitBreakerConfig;

  constructor(config: EnvConfig) {
    super(config);
    
    // Initialize resilience configurations
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504]
    };

    this.circuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 30000,
      monitoringPeriod: 60000
    };

    this.connectionPool = new EnhancedConnectionPool({
      maxConnections: 10,
      connectionTimeout: 30000,
      idleTimeout: 60000
    });

    this.setupInterceptors();
  }

  /**
   * Make a resilient API request with retry logic and circuit breaker
   */
  async makeResilientRequest<T = any>(
    config: AxiosRequestConfig,
    options: {
      skipCircuitBreaker?: boolean;
      skipRetry?: boolean;
      customRetryConfig?: Partial<RetryConfig>;
    } = {}
  ): Promise<AxiosResponse<T>> {
    const endpoint = this.getEndpointKey(config);
    const startTime = Date.now();
    
    const metric: ApiCallMetrics = {
      endpoint,
      method: config.method?.toUpperCase() || 'GET',
      startTime,
      success: false,
      retryCount: 0
    };

    try {
      // Acquire connection from pool
      const connectionId = await this.connectionPool.acquireConnection(endpoint);
      
      try {
        let result: AxiosResponse<T>;
        
        if (options.skipCircuitBreaker) {
          result = await this.executeWithRetry(config, options.customRetryConfig, metric);
        } else {
          const circuitBreaker = this.getCircuitBreaker(endpoint);
          result = await circuitBreaker.execute(() => 
            this.executeWithRetry(config, options.customRetryConfig, metric)
          );
        }

        metric.success = true;
        metric.statusCode = result.status;
        metric.endTime = Date.now();
        
        return result;
      } finally {
        this.connectionPool.releaseConnection(endpoint, connectionId);
      }
    } catch (error) {
      metric.success = false;
      metric.endTime = Date.now();
      metric.error = error instanceof Error ? error.message : 'Unknown error';
      
      throw error;
    } finally {
      this.metrics.push(metric);
      this.cleanupOldMetrics();
    }
  }

  /**
   * Execute request with exponential backoff retry logic
   */
  private async executeWithRetry<T = any>(
    config: AxiosRequestConfig,
    customRetryConfig?: Partial<RetryConfig>,
    metric?: ApiCallMetrics
  ): Promise<AxiosResponse<T>> {
    const retryConfig = { ...this.retryConfig, ...customRetryConfig };
    let lastError: any;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        if (metric) {
          metric.retryCount = attempt;
        }
        
        const response = await this.getAxiosInstance().request<T>(config);
        return response;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on non-retryable errors
        if (!this.isRetryableError(error, retryConfig)) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === retryConfig.maxRetries) {
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
          retryConfig.maxDelay
        );
        
        console.warn(`[ResilientClient] Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${error.message}`);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any, config: RetryConfig): boolean {
    // Network errors are retryable
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return true;
    }
    
    // Check status codes
    if (error.response?.status) {
      return config.retryableStatusCodes.includes(error.response.status);
    }
    
    return false;
  }

  /**
   * Get or create circuit breaker for endpoint
   */
  private getCircuitBreaker(endpoint: string): CircuitBreaker {
    if (!this.circuitBreakers.has(endpoint)) {
      this.circuitBreakers.set(endpoint, new CircuitBreaker(this.circuitBreakerConfig));
    }
    return this.circuitBreakers.get(endpoint)!;
  }

  /**
   * Get endpoint key for metrics and circuit breaker
   */
  private getEndpointKey(config: AxiosRequestConfig): string {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    return `${method} ${url}`;
  }

  /**
   * Setup axios interceptors for enhanced logging and monitoring
   */
  private setupInterceptors(): void {
    const instance = this.getAxiosInstance();
    
    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        // Add timeout if not specified
        if (!config.timeout) {
          config.timeout = 30000;
        }
        
        // Add retry identifier
        (config as any).metadata = {
          startTime: Date.now(),
          ...(config as any).metadata
        };
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => {
        const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);
        console.log(`[ResilientClient] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
        return response;
      },
      (error) => {
        const duration = Date.now() - ((error.config as any)?.metadata?.startTime || 0);
        console.error(`[ResilientClient] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'NETWORK_ERROR'} (${duration}ms): ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Enhanced connectivity check with detailed diagnostics
   */
  async checkConnectivityDetailed(): Promise<{
    connected: boolean;
    latency: number;
    circuitBreakerStates: Record<string, any>;
    connectionPoolStats: any;
    recentMetrics: ApiCallMetrics[];
  }> {
    const startTime = Date.now();
    let connected = false;
    
    try {
      await this.makeResilientRequest({
        method: 'GET',
        url: '/workflows',
        params: { limit: 1 }
      });
      connected = true;
    } catch (error) {
      console.error('[ResilientClient] Connectivity check failed:', error instanceof Error ? error.message : error);
    }
    
    const latency = Date.now() - startTime;
    
    return {
      connected,
      latency,
      circuitBreakerStates: Object.fromEntries(
        Array.from(this.circuitBreakers.entries()).map(([key, cb]) => [key, cb.getMetrics()])
      ),
      connectionPoolStats: this.connectionPool.getStats(),
      recentMetrics: this.getRecentMetrics(10)
    };
  }

  /**
   * Override base checkConnectivity to maintain compatibility
   */
  async checkConnectivity(): Promise<void> {
    const result = await this.checkConnectivityDetailed();
    if (!result.connected) {
      throw new Error('n8n API connectivity check failed');
    }
  }

  /**
   * Get recent API call metrics
   */
  getRecentMetrics(limit = 50): ApiCallMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get API health statistics
   */
  getHealthStats(): {
    totalRequests: number;
    successRate: number;
    averageLatency: number;
    circuitBreakerStatus: Record<string, string>;
    connectionPoolUtilization: number;
  } {
    const recentMetrics = this.getRecentMetrics(100);
    const successfulRequests = recentMetrics.filter(m => m.success).length;
    const totalRequests = recentMetrics.length;
    
    const averageLatency = totalRequests > 0 
      ? recentMetrics.reduce((sum, m) => sum + ((m.endTime || m.startTime) - m.startTime), 0) / totalRequests
      : 0;
    
    const circuitBreakerStatus = Object.fromEntries(
      Array.from(this.circuitBreakers.entries()).map(([key, cb]) => [key, cb.getState()])
    );
    
    const poolStats = this.connectionPool.getStats();
    const totalConnections = Object.values(poolStats.activeConnections).reduce((sum: number, count: any) => sum + count, 0);
    const connectionPoolUtilization = totalConnections / (Object.keys(poolStats.activeConnections).length * 10) * 100;
    
    return {
      totalRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      averageLatency,
      circuitBreakerStatus,
      connectionPoolUtilization
    };
  }

  /**
   * Reset circuit breakers (for manual recovery)
   */
  resetCircuitBreakers(): void {
    this.circuitBreakers.clear();
    console.log('[ResilientClient] All circuit breakers reset');
  }

  /**
   * Configure retry behavior
   */
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Configure circuit breaker behavior
   */
  setCircuitBreakerConfig(config: Partial<CircuitBreakerConfig>): void {
    this.circuitBreakerConfig = { ...this.circuitBreakerConfig, ...config };
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(): void {
    const maxMetrics = 1000;
    if (this.metrics.length > maxMetrics) {
      this.metrics = this.metrics.slice(-maxMetrics);
    }
  }

  // Override parent methods to use resilient requests
  
  async getWorkflows(params?: any): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.tags) params.tags.forEach((tag: string) => queryParams.append('tags[]', tag));

      const url = `/workflows${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.makeResilientRequest({ method: 'GET', url });
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch workflows');
    }
  }

  async getWorkflow(id: string): Promise<any> {
    try {
      const response = await this.makeResilientRequest({ 
        method: 'GET', 
        url: `/workflows/${id}` 
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch workflow ${id}`);
    }
  }

  async executeWorkflow(id: string, data?: Record<string, any>): Promise<any> {
    try {
      const response = await this.makeResilientRequest({ 
        method: 'POST', 
        url: `/workflows/${id}/execute`,
        data: data || {},
        timeout: 60000 // Longer timeout for workflow execution
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to execute workflow ${id}`);
    }
  }
}

/**
 * Create a resilient n8n API client
 */
export function createResilientApiClient(config: EnvConfig): ResilientN8nApiClient {
  return new ResilientN8nApiClient(config);
}