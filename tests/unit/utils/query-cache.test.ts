/**
 * Unit tests for QueryCache utility
 */

import { QueryCache } from '../../../src/utils/query-cache';

describe('QueryCache', () => {
  let cache: QueryCache<any>;

  beforeEach(() => {
    cache = new QueryCache(3, 100); // Small cache with 100ms TTL for testing
  });

  afterEach(() => {
    cache.clear();
  });

  describe('basic operations', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should delete specific keys', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeNull();
    });

    it('should clear all cache entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.get('key1')).toBeNull();
    });

    it('should respect custom TTL', () => {
      cache.set('key1', 'value1', 50); // 50ms custom TTL
      setTimeout(() => {
        expect(cache.get('key1')).toBeNull();
      }, 80);
    });
  });

  describe('size limits and LRU eviction', () => {
    it('should enforce maximum size', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict oldest
      
      expect(cache.get('key1')).toBeNull(); // Evicted
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('should update access time on get', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it recently used
      cache.get('key1');
      
      cache.set('key4', 'value4'); // Should evict key2 (least recently used)
      
      expect(cache.get('key1')).toBe('value1'); // Still there
      expect(cache.get('key2')).toBeNull(); // Evicted
    });
  });

  describe('getOrSet functionality', () => {
    it('should return cached value if available', async () => {
      cache.set('key1', 'cached');
      
      const result = await cache.getOrSet('key1', async () => 'fresh');
      expect(result).toBe('cached');
    });

    it('should fetch and cache if not available', async () => {
      const fetchFn = jest.fn().mockResolvedValue('fresh');
      
      const result = await cache.getOrSet('key1', fetchFn);
      expect(result).toBe('fresh');
      expect(fetchFn).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      const result2 = await cache.getOrSet('key1', fetchFn);
      expect(result2).toBe('fresh');
      expect(fetchFn).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('statistics', () => {
    it('should track hit and miss statistics', () => {
      cache.set('key1', 'value1');
      
      cache.get('key1'); // Hit
      cache.get('key2'); // Miss
      cache.get('key1'); // Hit
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.totalRequests).toBe(3);
      expect(stats.hitRate).toBeCloseTo(66.67, 1);
    });

    it('should track cache size', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(3);
    });
  });

  describe('key generation', () => {
    it('should generate consistent keys', () => {
      const key1 = QueryCache.generateKey('test', 'param1', 'param2');
      const key2 = QueryCache.generateKey('test', 'param1', 'param2');
      expect(key1).toBe(key2);
      expect(key1).toBe('test:param1:param2');
    });

    it('should handle different parameter types', () => {
      const key = QueryCache.generateKey('test', 'str', 123, true);
      expect(key).toBe('test:str:123:true');
    });
  });
});