/**
 * Query Result Cache
 * High-performance in-memory cache with TTL and size limits
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalRequests: number;
  hitRate: number;
  size: number;
  maxSize: number;
}

export class QueryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };
  
  constructor(
    private maxSize = 1000,
    private ttlMs = 5 * 60 * 1000, // 5 minutes default
    private cleanupIntervalMs = 60 * 1000 // 1 minute
  ) {
    // Periodic cleanup of expired entries
    setInterval(() => this.cleanup(), this.cleanupIntervalMs);
    
    // Memory pressure monitoring
    setInterval(() => this.checkMemoryPressure(), 30 * 1000); // Check every 30 seconds
  }

  /**
   * Get cached value or execute function and cache result
   */
  async getOrSet<R extends T>(
    key: string, 
    fetchFn: () => Promise<R>,
    customTtl?: number
  ): Promise<R> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached as R;
    }

    const result = await fetchFn();
    this.set(key, result, customTtl);
    return result;
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access tracking
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    
    return entry.data;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, customTtl?: number): void {
    const now = Date.now();
    
    // Enforce size limit with LRU eviction
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, {
      data: value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now
    });
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      totalRequests,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(prefix: string, ...params: (string | number | boolean)[]): string {
    return `${prefix}:${params.map(p => String(p)).join(':')}`;
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        toDelete.push(key);
      }
    }

    toDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Evict least recently used entry
   */
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Check memory pressure and clear cache if needed
   */
  private checkMemoryPressure(): void {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const usageRatio = memUsage.heapUsed / memUsage.heapTotal;

    // If using more than 80% of heap, start aggressive eviction
    if (usageRatio > 0.8) {
      const evictCount = Math.floor(this.cache.size * 0.3); // Evict 30%
      
      // Sort by last accessed time and evict oldest entries
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
        .slice(0, evictCount);

      for (const [key] of entries) {
        this.cache.delete(key);
        this.stats.evictions++;
      }

      console.warn(`[Cache] Memory pressure detected (${heapUsedMB.toFixed(1)}MB/${heapTotalMB.toFixed(1)}MB), evicted ${evictCount} entries`);
    }

    // If using more than 90% of heap, emergency clear
    if (usageRatio > 0.9) {
      const beforeSize = this.cache.size;
      this.cache.clear();
      this.stats.evictions += beforeSize;
      
      console.error(`[Cache] Emergency memory clear (${heapUsedMB.toFixed(1)}MB/${heapTotalMB.toFixed(1)}MB), cleared ${beforeSize} entries`);
    }
  }
}

// Global cache instances
export const nodeInfoCache = new QueryCache(500, 10 * 60 * 1000); // 10 min TTL
export const searchCache = new QueryCache(200, 5 * 60 * 1000);    // 5 min TTL  
export const templateCache = new QueryCache(100, 30 * 60 * 1000); // 30 min TTL