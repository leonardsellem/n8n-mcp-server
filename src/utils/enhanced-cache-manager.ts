import { nodeInfoCache, searchCache, templateCache, QueryCache } from './query-cache';
import { logger } from './logger';
import { EventEmitter } from 'events';

export interface CacheInvalidationRule {
  pattern: string;
  trigger: 'node_change' | 'github_sync' | 'manual' | 'time_based';
  scope: 'specific' | 'pattern' | 'all';
  metadata?: any;
}

export interface CacheStats {
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  size: number;
  memoryUsage: number;
}

export interface CacheEvent {
  type: 'invalidated' | 'warmed' | 'hit' | 'miss' | 'evicted';
  cacheType: string;
  key?: string;
  reason?: string;
  timestamp: Date;
}

/**
 * Enhanced Cache Manager with GitHub integration and automatic invalidation
 * 
 * This manager provides:
 * - Unified cache control across all cache instances
 * - Automatic invalidation based on GitHub changes
 * - Real-time cache statistics and monitoring
 * - Pattern-based cache warming and eviction
 * - Event-driven cache updates
 */
export class EnhancedCacheManager extends EventEmitter {
  private invalidationRules: Map<string, CacheInvalidationRule> = new Map();
  private nodeChangeListeners: Map<string, Function> = new Map();
  private cacheInstances: Map<string, any> = new Map();
  private stats: Map<string, CacheStats> = new Map();
  private lastGitHubSync: Date | null = null;
  private autoInvalidationEnabled = true;

  constructor() {
    super();
    this.initializeCacheInstances();
    this.setupDefaultInvalidationRules();
    this.startStatisticsCollection();
  }

  /**
   * Initialize all cache instances
   */
  private initializeCacheInstances(): void {
    this.cacheInstances.set('nodeInfo', nodeInfoCache);
    this.cacheInstances.set('search', searchCache);
    this.cacheInstances.set('template', templateCache);
    
    // Initialize stats for each cache
    for (const [name, cache] of this.cacheInstances) {
      this.stats.set(name, {
        hitRate: 0,
        totalHits: 0,
        totalMisses: 0,
        size: cache.size || 0,
        memoryUsage: this.estimateMemoryUsage(cache)
      });
    }
    
    logger.info('[Cache Manager] Initialized with cache instances', {
      caches: Array.from(this.cacheInstances.keys())
    });
  }

  /**
   * Setup default invalidation rules
   */
  private setupDefaultInvalidationRules(): void {
    // Invalidate node info cache when specific nodes change
    this.addInvalidationRule('node_change_specific', {
      pattern: 'node:*',
      trigger: 'node_change',
      scope: 'specific'
    });
    
    // Invalidate search cache when any node changes
    this.addInvalidationRule('node_change_search', {
      pattern: 'search:*',
      trigger: 'node_change',
      scope: 'all'
    });
    
    // Invalidate all caches on GitHub sync
    this.addInvalidationRule('github_sync_all', {
      pattern: '*',
      trigger: 'github_sync',
      scope: 'all'
    });
    
    // Time-based invalidation for search results (1 hour)
    this.addInvalidationRule('search_time_based', {
      pattern: 'search:*',
      trigger: 'time_based',
      scope: 'pattern',
      metadata: { ttl: 3600000 } // 1 hour
    });
    
    logger.info('[Cache Manager] Default invalidation rules setup completed');
  }

  /**
   * Add a cache invalidation rule
   */
  addInvalidationRule(name: string, rule: CacheInvalidationRule): void {
    this.invalidationRules.set(name, rule);
    logger.debug(`[Cache Manager] Added invalidation rule: ${name}`, rule);
  }

  /**
   * Remove an invalidation rule
   */
  removeInvalidationRule(name: string): boolean {
    const removed = this.invalidationRules.delete(name);
    if (removed) {
      logger.debug(`[Cache Manager] Removed invalidation rule: ${name}`);
    }
    return removed;
  }

  /**
   * Handle node change event (from GitHub or NPM updates)
   */
  onNodeChange(nodeType: string, changeType: 'added' | 'updated' | 'removed'): void {
    logger.info(`[Cache Manager] Node change detected: ${nodeType} (${changeType})`);
    
    if (!this.autoInvalidationEnabled) {
      return;
    }
    
    // Apply invalidation rules for node changes
    for (const [ruleName, rule] of this.invalidationRules) {
      if (rule.trigger === 'node_change') {
        this.applyInvalidationRule(ruleName, rule, { nodeType, changeType });
      }
    }
    
    this.emit('node_change', { nodeType, changeType });
  }

  /**
   * Handle GitHub sync completion
   */
  onGitHubSync(syncResult: any): void {
    logger.info('[Cache Manager] GitHub sync completed', {
      added: syncResult.added,
      updated: syncResult.updated,
      removed: syncResult.removed
    });
    
    this.lastGitHubSync = new Date();
    
    if (!this.autoInvalidationEnabled) {
      return;
    }
    
    // Apply GitHub sync invalidation rules
    for (const [ruleName, rule] of this.invalidationRules) {
      if (rule.trigger === 'github_sync') {
        this.applyInvalidationRule(ruleName, rule, syncResult);
      }
    }
    
    this.emit('github_sync', syncResult);
  }

  /**
   * Apply an invalidation rule
   */
  private applyInvalidationRule(ruleName: string, rule: CacheInvalidationRule, context: any): void {
    logger.debug(`[Cache Manager] Applying invalidation rule: ${ruleName}`, { rule, context });
    
    try {
      switch (rule.scope) {
        case 'specific':
          this.invalidateSpecific(rule.pattern, context);
          break;
        case 'pattern':
          this.invalidateByPattern(rule.pattern);
          break;
        case 'all':
          this.invalidateAll();
          break;
      }
      
      this.emit('invalidated', {
        type: 'invalidated',
        cacheType: 'multiple',
        reason: ruleName,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error(`[Cache Manager] Failed to apply invalidation rule ${ruleName}`, error);
    }
  }

  /**
   * Invalidate specific cache entries
   */
  private invalidateSpecific(pattern: string, context: any): void {
    if (pattern.startsWith('node:') && context.nodeType) {
      // Invalidate specific node entries
      const nodeKey = QueryCache.generateKey('node', context.nodeType);
      const nodeInfoKey = QueryCache.generateKey('node_info', context.nodeType);
      
      nodeInfoCache.delete(nodeKey);
      nodeInfoCache.delete(nodeInfoKey);
      
      logger.debug(`[Cache Manager] Invalidated specific node cache: ${context.nodeType}`);
    }
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  private invalidateByPattern(pattern: string): void {
    const cachePattern = pattern.replace('*', '');
    
    for (const [cacheName, cache] of this.cacheInstances) {
      if (pattern.startsWith('search:') && cacheName === 'search') {
        cache.clear();
        logger.debug(`[Cache Manager] Cleared search cache by pattern`);
      } else if (pattern === '*') {
        cache.clear();
        logger.debug(`[Cache Manager] Cleared ${cacheName} cache by wildcard pattern`);
      }
    }
  }

  /**
   * Invalidate all caches
   */
  invalidateAll(): void {
    for (const [cacheName, cache] of this.cacheInstances) {
      cache.clear();
      logger.debug(`[Cache Manager] Cleared ${cacheName} cache`);
    }
    
    logger.info('[Cache Manager] All caches invalidated');
  }

  /**
   * Warm cache for popular nodes
   */
  async warmCache(nodeTypes: string[]): Promise<void> {
    logger.info(`[Cache Manager] Starting cache warming for ${nodeTypes.length} nodes`);
    
    for (const nodeType of nodeTypes) {
      try {
        // This would trigger cache population by calling the actual services
        // For now, we'll emit an event for services to handle
        this.emit('warm_request', { nodeType });
        
        this.emit('warmed', {
          type: 'warmed',
          cacheType: 'nodeInfo',
          key: nodeType,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error(`[Cache Manager] Failed to warm cache for ${nodeType}`, error);
      }
    }
    
    logger.info('[Cache Manager] Cache warming completed');
  }

  /**
   * Get cache statistics
   */
  getCacheStatistics(): Map<string, CacheStats> {
    // Update current statistics
    for (const [name, cache] of this.cacheInstances) {
      const stats = this.stats.get(name)!;
      stats.size = cache.size || 0;
      stats.memoryUsage = this.estimateMemoryUsage(cache);
      
      // Calculate hit rate if available
      if (cache.getStats) {
        const cacheStats = cache.getStats();
        stats.totalHits = cacheStats.hits || 0;
        stats.totalMisses = cacheStats.misses || 0;
        stats.hitRate = stats.totalHits + stats.totalMisses > 0 
          ? stats.totalHits / (stats.totalHits + stats.totalMisses) 
          : 0;
      }
    }
    
    return new Map(this.stats);
  }

  /**
   * Get cache health report
   */
  getCacheHealthReport(): any {
    const stats = this.getCacheStatistics();
    const totalMemory = Array.from(stats.values()).reduce((sum, stat) => sum + stat.memoryUsage, 0);
    const averageHitRate = Array.from(stats.values()).reduce((sum, stat) => sum + stat.hitRate, 0) / stats.size;
    
    return {
      totalCaches: stats.size,
      totalMemoryUsage: totalMemory,
      averageHitRate,
      lastGitHubSync: this.lastGitHubSync,
      autoInvalidationEnabled: this.autoInvalidationEnabled,
      activeRules: this.invalidationRules.size,
      cacheDetails: Object.fromEntries(stats),
      recommendations: this.generateHealthRecommendations(stats)
    };
  }

  /**
   * Generate health recommendations
   */
  private generateHealthRecommendations(stats: Map<string, CacheStats>): string[] {
    const recommendations: string[] = [];
    
    for (const [name, stat] of stats) {
      if (stat.hitRate < 0.7) {
        recommendations.push(`Low hit rate (${Math.round(stat.hitRate * 100)}%) for ${name} cache - consider cache warming`);
      }
      
      if (stat.memoryUsage > 50 * 1024 * 1024) { // 50MB
        recommendations.push(`High memory usage (${Math.round(stat.memoryUsage / 1024 / 1024)}MB) for ${name} cache - consider size limits`);
      }
    }
    
    if (this.lastGitHubSync && Date.now() - this.lastGitHubSync.getTime() > 24 * 60 * 60 * 1000) {
      recommendations.push('GitHub sync is more than 24 hours old - consider manual sync');
    }
    
    return recommendations;
  }

  /**
   * Estimate memory usage of a cache
   */
  private estimateMemoryUsage(cache: any): number {
    try {
      if (cache.size === 0) return 0;
      
      // Rough estimation - each entry ~2KB average
      return (cache.size || 0) * 2048;
    } catch {
      return 0;
    }
  }

  /**
   * Start collecting statistics periodically
   */
  private startStatisticsCollection(): void {
    setInterval(() => {
      this.getCacheStatistics(); // This updates internal stats
    }, 60000); // Every minute
  }

  /**
   * Enable/disable automatic invalidation
   */
  setAutoInvalidation(enabled: boolean): void {
    this.autoInvalidationEnabled = enabled;
    logger.info(`[Cache Manager] Auto-invalidation ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get invalidation rules
   */
  getInvalidationRules(): Map<string, CacheInvalidationRule> {
    return new Map(this.invalidationRules);
  }

  /**
   * Manual cache clear with reason tracking
   */
  clearCache(cacheName?: string, reason = 'manual'): void {
    if (cacheName && this.cacheInstances.has(cacheName)) {
      const cache = this.cacheInstances.get(cacheName);
      cache.clear();
      
      this.emit('invalidated', {
        type: 'invalidated',
        cacheType: cacheName,
        reason,
        timestamp: new Date()
      });
      
      logger.info(`[Cache Manager] Manually cleared ${cacheName} cache (${reason})`);
    } else {
      this.invalidateAll();
      logger.info(`[Cache Manager] Manually cleared all caches (${reason})`);
    }
  }

  /**
   * Get cache events (last 100)
   */
  private recentEvents: CacheEvent[] = [];
  
  getRecentCacheEvents(): CacheEvent[] {
    return [...this.recentEvents];
  }

  /**
   * Log cache event
   */
  private logCacheEvent(event: CacheEvent): void {
    this.recentEvents.push(event);
    
    // Keep only last 100 events
    if (this.recentEvents.length > 100) {
      this.recentEvents.shift();
    }
  }
}

// Export singleton instance
export const cacheManager = new EnhancedCacheManager();