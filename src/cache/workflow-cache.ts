/**
 * Workflow Cache
 *
 * In-memory cache for workflows to improve performance.
 * Reduces API calls by caching workflow data with a configurable TTL.
 */

import { Workflow } from '../types/index.js';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Generic cache class with TTL support
 */
export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private ttl: number;

  /**
   * Create a new cache instance
   * @param ttlMs Time-to-live in milliseconds (default: 60000 = 1 minute)
   */
  constructor(ttlMs: number = 60000) {
    this.ttl = ttlMs;
  }

  /**
   * Get a cached value by key
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cached value
   * @param key Cache key
   * @param value Value to cache
   */
  set(key: string, value: T): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if a key exists and is not expired
   * @param key Cache key
   * @returns True if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Invalidate a specific cache entry or all entries
   * @param key Optional key to invalidate. If not provided, clears all.
   */
  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; ttlMs: number } {
    return {
      size: this.cache.size,
      ttlMs: this.ttl,
    };
  }
}

/**
 * Singleton workflow cache instance
 */
class WorkflowCacheManager {
  private static instance: WorkflowCacheManager;

  private workflowListCache: Cache<Workflow[]>;
  private workflowCache: Cache<Workflow>;
  private hitCount: number = 0;
  private missCount: number = 0;

  private constructor() {
    // 1 minute TTL for workflow list, 2 minutes for individual workflows
    this.workflowListCache = new Cache<Workflow[]>(60000);
    this.workflowCache = new Cache<Workflow>(120000);
  }

  static getInstance(): WorkflowCacheManager {
    if (!WorkflowCacheManager.instance) {
      WorkflowCacheManager.instance = new WorkflowCacheManager();
    }
    return WorkflowCacheManager.instance;
  }

  /**
   * Get cached workflow list
   */
  getWorkflowList(): Workflow[] | null {
    const cached = this.workflowListCache.get('all');
    if (cached) {
      this.hitCount++;
      return cached;
    }
    this.missCount++;
    return null;
  }

  /**
   * Set cached workflow list
   */
  setWorkflowList(workflows: Workflow[]): void {
    this.workflowListCache.set('all', workflows);
    // Also cache individual workflows
    workflows.forEach(w => this.workflowCache.set(w.id, w));
  }

  /**
   * Get a cached workflow by ID
   */
  getWorkflow(id: string): Workflow | null {
    const cached = this.workflowCache.get(id);
    if (cached) {
      this.hitCount++;
      return cached;
    }
    this.missCount++;
    return null;
  }

  /**
   * Set a cached workflow
   */
  setWorkflow(workflow: Workflow): void {
    this.workflowCache.set(workflow.id, workflow);
  }

  /**
   * Invalidate cache after mutations (create, update, delete, activate, deactivate)
   */
  invalidateAll(): void {
    this.workflowListCache.invalidate();
    this.workflowCache.invalidate();
  }

  /**
   * Invalidate a specific workflow
   */
  invalidateWorkflow(id: string): void {
    this.workflowCache.invalidate(id);
    this.workflowListCache.invalidate(); // Also invalidate list as it contains this workflow
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): { hits: number; misses: number; hitRate: string; listCacheSize: number; workflowCacheSize: number } {
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? ((this.hitCount / total) * 100).toFixed(1) + '%' : 'N/A';

    return {
      hits: this.hitCount,
      misses: this.missCount,
      hitRate,
      listCacheSize: this.workflowListCache.getStats().size,
      workflowCacheSize: this.workflowCache.getStats().size,
    };
  }
}

// Export singleton instance
export const workflowCache = WorkflowCacheManager.getInstance();
