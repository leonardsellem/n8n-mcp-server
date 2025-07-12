import { EnhancedCache, CacheConfig } from './enhanced-cache';

/**
 * Simple in-memory cache with TTL support
 * Enhanced with performance monitoring and better eviction policies
 */
export class SimpleCache {
  private enhancedCache: EnhancedCache;
  private hits: number = 0;
  private misses: number = 0;
  
  constructor(config?: CacheConfig) {
    const defaultConfig: CacheConfig = {
      enabled: true,
      ttl: 300, // 5 minutes
      maxSize: 1000
    };
    
    this.enhancedCache = new EnhancedCache(config || defaultConfig);
  }
  
  get(key: string): any {
    const result = this.enhancedCache.get(key);
    if (result !== undefined) {
      this.hits++;
      return result;
    } else {
      this.misses++;
      return null;
    }
  }
  
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.enhancedCache.set(key, data, ttlSeconds);
  }
  
  has(key: string): boolean {
    return this.enhancedCache.has(key);
  }
  
  delete(key: string): boolean {
    return this.enhancedCache.delete(key);
  }
  
  clear(): void {
    this.enhancedCache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  size(): number {
    return this.enhancedCache.size();
  }
  
  keys(): string[] {
    return this.enhancedCache.keys();
  }
  
  getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }
  
  getStats(): {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
    details: any;
  } {
    return {
      size: this.size(),
      hits: this.hits,
      misses: this.misses,
      hitRate: this.getHitRate(),
      details: this.enhancedCache.getStats()
    };
  }
  
  destroy(): void {
    this.enhancedCache.destroy();
  }
}