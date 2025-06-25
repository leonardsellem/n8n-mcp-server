/**
 * Cache Manager
 * 
 * Provides in-memory and persistent caching capabilities for improved
 * performance and reduced API calls to n8n.
 */

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  maxSize?: number; // Maximum number of entries
  defaultTtl?: number; // Default TTL in milliseconds
  cleanupInterval?: number; // Cleanup interval in milliseconds
  enablePersistence?: boolean; // Enable file-based persistence
  persistencePath?: string; // Path for cache persistence
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
}

/**
 * High-performance in-memory cache with LRU eviction and persistence
 */
export class CacheManager<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats = { hits: 0, misses: 0 };
  private cleanupTimer?: NodeJS.Timeout;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: config.maxSize || 1000,
      defaultTtl: config.defaultTtl || 300000, // 5 minutes
      cleanupInterval: config.cleanupInterval || 60000, // 1 minute
      enablePersistence: config.enablePersistence || false,
      persistencePath: config.persistencePath || './cache/cache.json'
    };

    this.startCleanupTimer();
    
    if (this.config.enablePersistence) {
      this.loadFromPersistence();
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    const now = Date.now();
    
    // Check if entry is expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entryTtl = ttl || this.config.defaultTtl;

    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    // Add new entry
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      ttl: entryTtl,
      accessCount: 1,
      lastAccessed: now
    };

    this.cache.set(key, entry);

    if (this.config.enablePersistence) {
      this.schedulePersistence();
    }
  }

  /**
   * Check if key exists in cache (without updating access stats)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    return (now - entry.timestamp) <= entry.ttl;
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (deleted && this.config.enablePersistence) {
      this.schedulePersistence();
    }
    
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    
    if (this.config.enablePersistence) {
      this.schedulePersistence();
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const now = Date.now();
    let oldestEntry = now;
    let newestEntry = 0;
    let memoryUsage = 0;

    for (const [key, entry] of this.cache.entries()) {
      memoryUsage += this.estimateEntrySize(key, entry);
      if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
      if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
    }

    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage,
      oldestEntry: oldestEntry === now ? 0 : oldestEntry,
      newestEntry
    };
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all values in cache
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.value);
  }

  /**
   * Get cache entries that match a pattern
   */
  getByPattern(pattern: RegExp): Array<{ key: string; value: T }> {
    const results: Array<{ key: string; value: T }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (pattern.test(key)) {
        const now = Date.now();
        if (now - entry.timestamp <= entry.ttl) {
          results.push({ key, value: entry.value });
        }
      }
    }
    
    return results;
  }

  /**
   * Remove expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    if (removedCount > 0 && this.config.enablePersistence) {
      this.schedulePersistence();
    }
    
    return removedCount;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    // Get the first entry (least recently used due to Map insertion order)
    const firstEntry = this.cache.keys().next();
    if (!firstEntry.done) {
      this.cache.delete(firstEntry.value);
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    
    if (this.config.enablePersistence) {
      this.saveToPersistence();
    }
  }

  /**
   * Estimate memory usage of a cache entry
   */
  private estimateEntrySize(key: string, entry: CacheEntry<T>): number {
    // Rough estimation in bytes
    const keySize = key.length * 2; // Assuming 2 bytes per character
    const valueSize = JSON.stringify(entry.value).length * 2;
    const metadataSize = 64; // Rough estimate for timestamps and counters
    
    return keySize + valueSize + metadataSize;
  }

  /**
   * Load cache from persistence
   */
  private async loadFromPersistence(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Ensure directory exists
      const dir = path.dirname(this.config.persistencePath);
      await fs.mkdir(dir, { recursive: true });
      
      const data = await fs.readFile(this.config.persistencePath, 'utf8');
      const persistedData = JSON.parse(data);
      
      // Restore cache entries
      for (const [key, entry] of Object.entries(persistedData.cache || {})) {
        const cacheEntry = entry as CacheEntry<T>;
        
        // Check if entry is still valid
        const now = Date.now();
        if (now - cacheEntry.timestamp <= cacheEntry.ttl) {
          this.cache.set(key, cacheEntry);
        }
      }
      
      // Restore stats
      if (persistedData.stats) {
        this.stats = persistedData.stats;
      }
      
      console.log(`Loaded ${this.cache.size} entries from cache persistence`);
    } catch (error) {
      // Ignore errors (file might not exist on first run)
      console.log('No existing cache persistence found, starting with empty cache');
    }
  }

  /**
   * Save cache to persistence
   */
  private async saveToPersistence(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Ensure directory exists
      const dir = path.dirname(this.config.persistencePath);
      await fs.mkdir(dir, { recursive: true });
      
      const persistedData = {
        cache: Object.fromEntries(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now()
      };
      
      await fs.writeFile(this.config.persistencePath, JSON.stringify(persistedData, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save cache to persistence:', error);
    }
  }

  /**
   * Schedule persistence save (debounced)
   */
  private persistenceTimeout?: NodeJS.Timeout;
  private schedulePersistence(): void {
    if (this.persistenceTimeout) {
      clearTimeout(this.persistenceTimeout);
    }
    
    this.persistenceTimeout = setTimeout(() => {
      this.saveToPersistence();
    }, 5000); // Save after 5 seconds of inactivity
  }
}

/**
 * Specialized cache managers for different data types
 */
export class WorkflowCacheManager extends CacheManager<any> {
  constructor() {
    super({
      maxSize: 200,
      defaultTtl: 600000, // 10 minutes
      enablePersistence: true,
      persistencePath: './cache/workflows.json'
    });
  }

  cacheWorkflow(workflowId: string, workflow: any): void {
    this.set(`workflow:${workflowId}`, workflow);
  }

  getWorkflow(workflowId: string): any | undefined {
    return this.get(`workflow:${workflowId}`);
  }

  cacheWorkflowList(filters: any, workflows: any[]): void {
    const key = `workflows:${JSON.stringify(filters)}`;
    this.set(key, workflows, 300000); // 5 minutes for lists
  }

  getWorkflowList(filters: any): any[] | undefined {
    const key = `workflows:${JSON.stringify(filters)}`;
    return this.get(key);
  }
}

export class NodeCacheManager extends CacheManager<any> {
  constructor() {
    super({
      maxSize: 500,
      defaultTtl: 1800000, // 30 minutes (node info changes less frequently)
      enablePersistence: true,
      persistencePath: './cache/nodes.json'
    });
  }

  cacheNodeTypes(nodeTypes: any[]): void {
    this.set('node-types:all', nodeTypes, 3600000); // 1 hour
  }

  getNodeTypes(): any[] | undefined {
    return this.get('node-types:all');
  }

  cacheNodeInfo(nodeType: string, nodeInfo: any): void {
    this.set(`node:${nodeType}`, nodeInfo);
  }

  getNodeInfo(nodeType: string): any | undefined {
    return this.get(`node:${nodeType}`);
  }
}

export class ExecutionCacheManager extends CacheManager<any> {
  constructor() {
    super({
      maxSize: 100,
      defaultTtl: 180000, // 3 minutes (execution data is more volatile)
      enablePersistence: false // Don't persist execution data
    });
  }

  cacheExecution(executionId: string, execution: any): void {
    this.set(`execution:${executionId}`, execution);
  }

  getExecution(executionId: string): any | undefined {
    return this.get(`execution:${executionId}`);
  }

  cacheExecutionList(workflowId: string, filters: any, executions: any[]): void {
    const key = `executions:${workflowId}:${JSON.stringify(filters)}`;
    this.set(key, executions, 60000); // 1 minute for execution lists
  }

  getExecutionList(workflowId: string, filters: any): any[] | undefined {
    const key = `executions:${workflowId}:${JSON.stringify(filters)}`;
    return this.get(key);
  }
}

// Global cache manager instances
let workflowCache: WorkflowCacheManager | null = null;
let nodeCache: NodeCacheManager | null = null;
let executionCache: ExecutionCacheManager | null = null;

/**
 * Get or create workflow cache manager
 */
export function getWorkflowCache(): WorkflowCacheManager {
  if (!workflowCache) {
    workflowCache = new WorkflowCacheManager();
  }
  return workflowCache;
}

/**
 * Get or create node cache manager
 */
export function getNodeCache(): NodeCacheManager {
  if (!nodeCache) {
    nodeCache = new NodeCacheManager();
  }
  return nodeCache;
}

/**
 * Get or create execution cache manager
 */
export function getExecutionCache(): ExecutionCacheManager {
  if (!executionCache) {
    executionCache = new ExecutionCacheManager();
  }
  return executionCache;
}

/**
 * Stop all cache managers
 */
export function stopAllCaches(): void {
  if (workflowCache) {
    workflowCache.stop();
  }
  if (nodeCache) {
    nodeCache.stop();
  }
  if (executionCache) {
    executionCache.stop();
  }
}

/**
 * Get combined cache statistics
 */
export function getAllCacheStats(): {
  workflow: CacheStats;
  node: CacheStats;
  execution: CacheStats;
  total: {
    size: number;
    memoryUsage: number;
    hitRate: number;
  };
} {
  const workflowStats = getWorkflowCache().getStats();
  const nodeStats = getNodeCache().getStats();
  const executionStats = getExecutionCache().getStats();

  const totalHits = workflowStats.hits + nodeStats.hits + executionStats.hits;
  const totalMisses = workflowStats.misses + nodeStats.misses + executionStats.misses;
  const totalRequests = totalHits + totalMisses;
  const totalHitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;

  return {
    workflow: workflowStats,
    node: nodeStats,
    execution: executionStats,
    total: {
      size: workflowStats.size + nodeStats.size + executionStats.size,
      memoryUsage: workflowStats.memoryUsage + nodeStats.memoryUsage + executionStats.memoryUsage,
      hitRate: Math.round(totalHitRate * 100) / 100
    }
  };
}