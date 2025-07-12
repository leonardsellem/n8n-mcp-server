import { PerformanceMonitor } from '../services/performance-monitor';
import { logger } from './logger';

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize: number;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

export class EnhancedCache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private performanceMonitor: PerformanceMonitor;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: CacheConfig) {
    this.config = config;
    this.performanceMonitor = PerformanceMonitor.getInstance();
    
    if (this.config.enabled) {
      // Start cleanup interval every 5 minutes
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 5 * 60 * 1000);
    }
  }

  set(key: string, value: T, ttl?: number): void {
    if (!this.config.enabled) {
      return;
    }

    const entryTtl = ttl || this.config.ttl;
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: entryTtl,
      hits: 0,
      lastAccessed: Date.now()
    };

    // Check if cache is at max size
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, entry);
    
    logger.debug(`Cache set: ${key} (TTL: ${entryTtl}s)`);
  }

  get(key: string): T | undefined {
    if (!this.config.enabled) {
      return undefined;
    }

    const entry = this.cache.get(key);
    
    if (!entry) {
      this.performanceMonitor.recordCacheMiss();
      return undefined;
    }

    const now = Date.now();
    const age = (now - entry.timestamp) / 1000;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      this.performanceMonitor.recordCacheMiss();
      logger.debug(`Cache expired: ${key} (age: ${age}s, ttl: ${entry.ttl}s)`);
      return undefined;
    }

    // Update entry stats
    entry.hits++;
    entry.lastAccessed = now;
    
    this.performanceMonitor.recordCacheHit();
    logger.debug(`Cache hit: ${key} (hits: ${entry.hits})`);
    
    return entry.value;
  }

  has(key: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const age = (now - entry.timestamp) / 1000;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const result = this.cache.delete(key);
    if (result) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return result;
  }

  clear(): void {
    if (!this.config.enabled) {
      return;
    }

    const size = this.cache.size;
    this.cache.clear();
    logger.debug(`Cache cleared: ${size} entries removed`);
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{
      key: string;
      size: number;
      hits: number;
      age: number;
      ttl: number;
    }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: this.estimateSize(entry.value),
      hits: entry.hits,
      age: (Date.now() - entry.timestamp) / 1000,
      ttl: entry.ttl
    }));

    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const totalRequests = totalHits + entries.length; // Approximate
    const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      entries: entries.sort((a, b) => b.hits - a.hits)
    };
  }

  private cleanup(): void {
    if (!this.config.enabled) {
      return;
    }

    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = (now - entry.timestamp) / 1000;
      if (age > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      logger.debug(`Cache cleanup: removed ${removedCount} expired entries`);
    }
  }

  private evictLeastUsed(): void {
    if (this.cache.size === 0) {
      return;
    }

    // Find the least recently used entry
    let lruKey: string | null = null;
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      logger.debug(`Cache evicted LRU: ${lruKey}`);
    }
  }

  private estimateSize(value: any): number {
    // Rough estimate of object size in bytes
    const json = JSON.stringify(value);
    return json.length * 2; // UTF-16 encoding
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}