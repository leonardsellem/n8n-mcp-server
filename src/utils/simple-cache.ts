/**
 * Simple in-memory cache with TTL support
 * No external dependencies needed
 */
export class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();
  
  constructor() {
    // Clean up expired entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (item.expires < now) this.cache.delete(key);
      }
    }, 60000);
  }
  
  get(key: string): any {
    const item = this.cache.get(key);
    if (!item || item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}