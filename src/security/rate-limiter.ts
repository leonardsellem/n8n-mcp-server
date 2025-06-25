/**
 * Rate Limiter for MCP Server
 * 
 * Implements rate limiting to prevent API abuse and ensure fair usage
 * across different operations and users.
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (context: any) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalRequests: number;
}

/**
 * In-memory rate limiter with configurable windows and limits
 */
export class RateLimiter {
  private requests = new Map<string, Array<{ timestamp: number; success: boolean }>>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old entries periodically
    setInterval(() => this.cleanup(), Math.min(this.config.windowMs, 60000));
  }

  /**
   * Check if request should be allowed
   */
  checkLimit(key: string, isSuccess?: boolean): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get or create request history for this key
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requestHistory = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = requestHistory.filter(req => req.timestamp > windowStart);
    this.requests.set(key, validRequests);
    
    // Count requests based on configuration
    let countableRequests = validRequests;
    if (this.config.skipSuccessfulRequests) {
      countableRequests = countableRequests.filter(req => !req.success);
    }
    if (this.config.skipFailedRequests) {
      countableRequests = countableRequests.filter(req => req.success);
    }
    
    const currentCount = countableRequests.length;
    const allowed = currentCount < this.config.maxRequests;
    
    // Add current request to history if it should be tracked
    const shouldTrack = !(
      (this.config.skipSuccessfulRequests && isSuccess) ||
      (this.config.skipFailedRequests && !isSuccess)
    );
    
    if (shouldTrack) {
      validRequests.push({ timestamp: now, success: isSuccess ?? true });
    }
    
    return {
      allowed,
      remaining: Math.max(0, this.config.maxRequests - currentCount - (shouldTrack ? 1 : 0)),
      resetTime: windowStart + this.config.windowMs,
      totalRequests: currentCount + (shouldTrack ? 1 : 0)
    };
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    const requestHistory = this.requests.get(key) || [];
    const validRequests = requestHistory.filter(req => req.timestamp > windowStart);
    
    let countableRequests = validRequests;
    if (this.config.skipSuccessfulRequests) {
      countableRequests = countableRequests.filter(req => !req.success);
    }
    if (this.config.skipFailedRequests) {
      countableRequests = countableRequests.filter(req => req.success);
    }
    
    const currentCount = countableRequests.length;
    
    return {
      allowed: currentCount < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - currentCount),
      resetTime: windowStart + this.config.windowMs,
      totalRequests: currentCount
    };
  }

  /**
   * Reset limits for a specific key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.requests.clear();
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalKeys: number;
    totalRequests: number;
    activeKeys: string[];
    memoryUsage: number;
  } {
    let totalRequests = 0;
    for (const requests of this.requests.values()) {
      totalRequests += requests.length;
    }
    
    return {
      totalKeys: this.requests.size,
      totalRequests,
      activeKeys: Array.from(this.requests.keys()),
      memoryUsage: JSON.stringify(Array.from(this.requests.entries())).length
    };
  }

  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(req => req.timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

/**
 * Rate limit manager with different limits for different operations
 */
export class RateLimitManager {
  private limiters = new Map<string, RateLimiter>();
  private defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  constructor() {
    this.initializeDefaultLimiters();
  }

  /**
   * Initialize default rate limiters for different operation types
   */
  private initializeDefaultLimiters(): void {
    // General API operations
    this.addLimiter('general', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100 // 100 requests per minute
    });

    // Workflow operations (more permissive)
    this.addLimiter('workflow', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 200 // 200 requests per minute
    });

    // Execution operations (more restrictive)
    this.addLimiter('execution', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 50 // 50 executions per minute
    });

    // Discovery operations (very permissive)
    this.addLimiter('discovery', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 500 // 500 requests per minute
    });

    // Credential operations (restrictive)
    this.addLimiter('credentials', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30 // 30 requests per minute
    });

    // Monitoring operations (permissive)
    this.addLimiter('monitoring', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 150 // 150 requests per minute
    });
  }

  /**
   * Add a rate limiter for a specific operation type
   */
  addLimiter(operationType: string, config: Partial<RateLimitConfig>): void {
    const fullConfig = { ...this.defaultConfig, ...config };
    this.limiters.set(operationType, new RateLimiter(fullConfig));
  }

  /**
   * Check rate limit for an operation
   */
  checkLimit(
    operationType: string, 
    identifier: string, 
    isSuccess?: boolean
  ): RateLimitResult {
    const limiter = this.limiters.get(operationType) || this.limiters.get('general')!;
    return limiter.checkLimit(identifier, isSuccess);
  }

  /**
   * Get rate limit status
   */
  getStatus(operationType: string, identifier: string): RateLimitResult {
    const limiter = this.limiters.get(operationType) || this.limiters.get('general')!;
    return limiter.getStatus(identifier);
  }

  /**
   * Reset limits for a specific operation and identifier
   */
  reset(operationType: string, identifier: string): void {
    const limiter = this.limiters.get(operationType);
    if (limiter) {
      limiter.reset(identifier);
    }
  }

  /**
   * Get comprehensive statistics
   */
  getStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [operationType, limiter] of this.limiters.entries()) {
      stats[operationType] = limiter.getStats();
    }
    
    return stats;
  }

  /**
   * Generate rate limit key from context
   */
  generateKey(context: {
    toolName?: string;
    clientId?: string;
    sessionId?: string;
    ipAddress?: string;
  }): string {
    // Use clientId if available, fallback to sessionId, then toolName
    return context.clientId || 
           context.sessionId || 
           context.ipAddress || 
           context.toolName || 
           'anonymous';
  }
}

// Global rate limit manager instance
let globalRateLimitManager: RateLimitManager | null = null;

/**
 * Get or create global rate limit manager
 */
export function getRateLimitManager(): RateLimitManager {
  if (!globalRateLimitManager) {
    globalRateLimitManager = new RateLimitManager();
  }
  return globalRateLimitManager;
}

/**
 * Rate limiting decorator for tool handlers
 */
export function withRateLimit(
  operationType: string,
  keyExtractor?: (args: any) => string
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const rateLimitManager = getRateLimitManager();
      
      // Generate rate limit key
      const context = {
        toolName: propertyName,
        clientId: args[0]?.clientId,
        sessionId: args[0]?.sessionId,
        ipAddress: args[0]?.ipAddress
      };
      
      const key = keyExtractor ? keyExtractor(args[0]) : rateLimitManager.generateKey(context);
      
      // Check rate limit
      const limitResult = rateLimitManager.checkLimit(operationType, key);
      
      if (!limitResult.allowed) {
        const resetDate = new Date(limitResult.resetTime);
        throw new Error(
          `Rate limit exceeded for ${operationType}. ` +
          `Limit resets at ${resetDate.toISOString()}. ` +
          `Remaining: ${limitResult.remaining}/${limitResult.totalRequests}`
        );
      }

      try {
        const result = await method.apply(this, args);
        
        // Update with success
        rateLimitManager.checkLimit(operationType, key, true);
        
        return result;
      } catch (error) {
        // Update with failure
        rateLimitManager.checkLimit(operationType, key, false);
        throw error;
      }
    };

    return descriptor;
  };
}