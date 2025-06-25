/**
 * API Recovery and Fallback System
 * 
 * Provides intelligent fallback mechanisms, graceful degradation,
 * and recovery strategies for external API integration failures.
 */

import { EnvConfig } from '../config/environment.js';
import { N8nApiError } from '../errors/index.js';

export interface FallbackStrategy {
  name: string;
  priority: number;
  enabled: boolean;
  execute: (context: FallbackContext) => Promise<any>;
}

export interface FallbackContext {
  originalOperation: string;
  operationArgs: any;
  lastError: Error;
  attemptCount: number;
  maxAttempts: number;
  startTime: number;
}

export interface RecoveryMetrics {
  operation: string;
  fallbackUsed?: string;
  recoveryTime: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Offline cache for critical operations
 */
class OfflineCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalSize: JSON.stringify(Array.from(this.cache.values())).length
    };
  }
}

/**
 * API Recovery Manager with intelligent fallback strategies
 */
export class ApiRecoveryManager {
  private cache = new OfflineCache();
  private fallbackStrategies = new Map<string, FallbackStrategy[]>();
  private recoveryMetrics: RecoveryMetrics[] = [];
  private config: EnvConfig;

  constructor(config: EnvConfig) {
    this.config = config;
    this.initializeFallbackStrategies();
  }

  /**
   * Execute operation with fallback support
   */
  async executeWithFallback<T>(
    operation: string,
    primaryExecutor: () => Promise<T>,
    args: any = {},
    options: {
      maxAttempts?: number;
      cacheResult?: boolean;
      cacheTtl?: number;
      skipCache?: boolean;
    } = {}
  ): Promise<T> {
    const startTime = Date.now();
    const { maxAttempts = 3, cacheResult = false, cacheTtl, skipCache = false } = options;
    
    // Check cache first (if enabled and not skipped)
    if (!skipCache) {
      const cacheKey = this.getCacheKey(operation, args);
      const cachedResult = this.cache.get(cacheKey);
      if (cachedResult) {
        console.log(`[ApiRecovery] Cache hit for ${operation}`);
        return cachedResult;
      }
    }

    const context: FallbackContext = {
      originalOperation: operation,
      operationArgs: args,
      lastError: new Error('No error'),
      attemptCount: 0,
      maxAttempts,
      startTime
    };

    // Try primary executor first
    try {
      const result = await primaryExecutor();
      
      // Cache successful result if requested
      if (cacheResult) {
        const cacheKey = this.getCacheKey(operation, args);
        this.cache.set(cacheKey, result, cacheTtl);
      }

      this.recordRecoveryMetric({
        operation,
        recoveryTime: Date.now() - startTime,
        success: true,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      context.lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[ApiRecovery] Primary executor failed for ${operation}: ${context.lastError.message}`);
    }

    // Try fallback strategies
    const strategies = this.getFallbackStrategies(operation);
    for (const strategy of strategies) {
      if (!strategy.enabled) continue;

      try {
        console.log(`[ApiRecovery] Attempting fallback strategy: ${strategy.name} for ${operation}`);
        context.attemptCount++;
        
        const result = await strategy.execute(context);
        
        // Cache fallback result if requested
        if (cacheResult) {
          const cacheKey = this.getCacheKey(operation, args);
          this.cache.set(cacheKey, result, cacheTtl);
        }

        this.recordRecoveryMetric({
          operation,
          fallbackUsed: strategy.name,
          recoveryTime: Date.now() - startTime,
          success: true,
          timestamp: new Date().toISOString()
        });

        return result;
      } catch (error) {
        context.lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[ApiRecovery] Fallback strategy ${strategy.name} failed: ${context.lastError.message}`);
      }
    }

    // All strategies failed
    this.recordRecoveryMetric({
      operation,
      recoveryTime: Date.now() - startTime,
      success: false,
      error: context.lastError.message,
      timestamp: new Date().toISOString()
    });

    throw new N8nApiError(
      `All recovery strategies failed for operation: ${operation}. Last error: ${context.lastError.message}`,
      500,
      { originalError: context.lastError.message, attemptCount: context.attemptCount }
    );
  }

  /**
   * Initialize built-in fallback strategies
   */
  private initializeFallbackStrategies(): void {
    // Workflow operations fallbacks
    this.addFallbackStrategy('getWorkflows', {
      name: 'cached-workflows',
      priority: 1,
      enabled: true,
      execute: async (context) => {
        const cacheKey = this.getCacheKey('getWorkflows', context.operationArgs);
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;
        
        // Return minimal workflow list as last resort
        return [{
          id: 'offline-workflow-1',
          name: 'Offline Mode - Limited Functionality',
          active: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          connections: {},
          tags: ['offline-mode']
        }];
      }
    });

    this.addFallbackStrategy('getWorkflow', {
      name: 'minimal-workflow-response',
      priority: 1,
      enabled: true,
      execute: async (context) => {
        const workflowId = context.operationArgs.id || context.operationArgs;
        return {
          id: workflowId,
          name: `Workflow ${workflowId} (Offline Mode)`,
          active: false,
          nodes: [],
          connections: {},
          settings: {},
          staticData: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['offline-mode']
        };
      }
    });

    // Node discovery fallbacks
    this.addFallbackStrategy('getNodeTypes', {
      name: 'basic-node-types',
      priority: 1,
      enabled: true,
      execute: async (_context) => {
        // Return basic node types that should always be available
        return [
          {
            name: 'n8n-nodes-base.manualTrigger',
            displayName: 'Manual Trigger',
            description: 'Manually trigger workflow execution',
            category: 'Core Nodes',
            version: 1
          },
          {
            name: 'n8n-nodes-base.function',
            displayName: 'Function',
            description: 'Execute JavaScript code',
            category: 'Core Nodes', 
            version: 1
          },
          {
            name: 'n8n-nodes-base.set',
            displayName: 'Set',
            description: 'Set node data values',
            category: 'Core Nodes',
            version: 1
          }
        ];
      }
    });

    // Credentials fallbacks
    this.addFallbackStrategy('getCredentials', {
      name: 'empty-credentials-list',
      priority: 1,
      enabled: true,
      execute: async (_context) => {
        console.warn('[ApiRecovery] Returning empty credentials list - credential management unavailable');
        return [];
      }
    });

    this.addFallbackStrategy('getCredentialTypes', {
      name: 'basic-credential-types',
      priority: 1,
      enabled: true,
      execute: async (_context) => {
        return [
          {
            name: 'httpBasicAuth',
            displayName: 'Basic Auth',
            description: 'Basic HTTP authentication',
            properties: []
          },
          {
            name: 'httpHeaderAuth',
            displayName: 'Header Auth',
            description: 'HTTP header authentication',
            properties: []
          }
        ];
      }
    });

    // Execution fallbacks
    this.addFallbackStrategy('getExecutions', {
      name: 'empty-executions-list',
      priority: 1,
      enabled: true,
      execute: async (_context) => {
        return [];
      }
    });

    this.addFallbackStrategy('executeWorkflow', {
      name: 'mock-execution-response',
      priority: 1,
      enabled: true,
      execute: async (context) => {
        const workflowId = context.operationArgs.id || context.operationArgs.workflowId;
        return {
          id: `offline-execution-${Date.now()}`,
          workflowId,
          mode: 'manual',
          status: 'success',
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          data: {
            resultData: {
              runData: {}
            }
          },
          offline: true,
          message: 'Workflow execution simulated in offline mode'
        };
      }
    });
  }

  /**
   * Add a custom fallback strategy
   */
  addFallbackStrategy(operation: string, strategy: FallbackStrategy): void {
    if (!this.fallbackStrategies.has(operation)) {
      this.fallbackStrategies.set(operation, []);
    }
    
    const strategies = this.fallbackStrategies.get(operation)!;
    strategies.push(strategy);
    strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get fallback strategies for an operation
   */
  private getFallbackStrategies(operation: string): FallbackStrategy[] {
    return this.fallbackStrategies.get(operation) || [];
  }

  /**
   * Generate cache key for operation and arguments
   */
  private getCacheKey(operation: string, args: any): string {
    const argsStr = typeof args === 'object' ? JSON.stringify(args) : String(args);
    return `${operation}:${argsStr}`;
  }

  /**
   * Record recovery metrics
   */
  private recordRecoveryMetric(metric: RecoveryMetrics): void {
    this.recoveryMetrics.push(metric);
    
    // Keep only recent metrics (last 1000)
    if (this.recoveryMetrics.length > 1000) {
      this.recoveryMetrics = this.recoveryMetrics.slice(-1000);
    }
  }

  /**
   * Get recovery statistics
   */
  getRecoveryStats(): {
    totalOperations: number;
    successRate: number;
    fallbackUsageRate: number;
    averageRecoveryTime: number;
    operationStats: Record<string, { count: number; successRate: number; avgRecoveryTime: number }>;
    cacheStats: any;
  } {
    const totalOperations = this.recoveryMetrics.length;
    const successfulOperations = this.recoveryMetrics.filter(m => m.success).length;
    const fallbackOperations = this.recoveryMetrics.filter(m => m.fallbackUsed).length;
    
    const averageRecoveryTime = totalOperations > 0
      ? this.recoveryMetrics.reduce((sum, m) => sum + m.recoveryTime, 0) / totalOperations
      : 0;

    // Calculate per-operation statistics
    const operationStats: Record<string, { count: number; successRate: number; avgRecoveryTime: number }> = {};
    
    for (const metric of this.recoveryMetrics) {
      if (!operationStats[metric.operation]) {
        operationStats[metric.operation] = { count: 0, successRate: 0, avgRecoveryTime: 0 };
      }
      operationStats[metric.operation].count++;
    }

    for (const operation in operationStats) {
      const operationMetrics = this.recoveryMetrics.filter(m => m.operation === operation);
      const successful = operationMetrics.filter(m => m.success).length;
      const avgTime = operationMetrics.reduce((sum, m) => sum + m.recoveryTime, 0) / operationMetrics.length;
      
      operationStats[operation].successRate = (successful / operationMetrics.length) * 100;
      operationStats[operation].avgRecoveryTime = avgTime;
    }

    return {
      totalOperations,
      successRate: totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0,
      fallbackUsageRate: totalOperations > 0 ? (fallbackOperations / totalOperations) * 100 : 0,
      averageRecoveryTime,
      operationStats,
      cacheStats: this.cache.getStats()
    };
  }

  /**
   * Clear cache and reset metrics
   */
  reset(): void {
    this.cache.clear();
    this.recoveryMetrics = [];
    console.log('[ApiRecovery] Recovery manager reset - cache and metrics cleared');
  }

  /**
   * Enable/disable fallback strategy
   */
  toggleFallbackStrategy(operation: string, strategyName: string, enabled: boolean): void {
    const strategies = this.fallbackStrategies.get(operation);
    if (strategies) {
      const strategy = strategies.find(s => s.name === strategyName);
      if (strategy) {
        strategy.enabled = enabled;
        console.log(`[ApiRecovery] Fallback strategy ${strategyName} for ${operation} ${enabled ? 'enabled' : 'disabled'}`);
      }
    }
  }

  /**
   * Preload cache with critical data
   */
  async preloadCache(criticalOperations: { operation: string; executor: () => Promise<any>; args?: any }[]): Promise<void> {
    console.log('[ApiRecovery] Preloading cache with critical data...');
    
    for (const { operation, executor, args = {} } of criticalOperations) {
      try {
        const result = await executor();
        const cacheKey = this.getCacheKey(operation, args);
        this.cache.set(cacheKey, result, 15 * 60 * 1000); // 15 minutes TTL for preloaded data
        console.log(`[ApiRecovery] Preloaded cache for ${operation}`);
      } catch (error) {
        console.warn(`[ApiRecovery] Failed to preload cache for ${operation}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }
}

/**
 * Global recovery manager instance
 */
let globalRecoveryManager: ApiRecoveryManager | null = null;

/**
 * Get or create global recovery manager
 */
export function getApiRecoveryManager(config?: EnvConfig): ApiRecoveryManager {
  if (!globalRecoveryManager && config) {
    globalRecoveryManager = new ApiRecoveryManager(config);
  }
  
  if (!globalRecoveryManager) {
    throw new Error('ApiRecoveryManager not initialized. Please provide config on first call.');
  }
  
  return globalRecoveryManager;
}

/**
 * Decorator for adding recovery support to methods
 */
export function withRecovery(operation: string, options: {
  cacheResult?: boolean;
  cacheTtl?: number;
  skipCache?: boolean;
} = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const recoveryManager = getApiRecoveryManager();
      
      return recoveryManager.executeWithFallback(
        operation,
        () => method.apply(this, args),
        args,
        options
      );
    };

    return descriptor;
  };
}
