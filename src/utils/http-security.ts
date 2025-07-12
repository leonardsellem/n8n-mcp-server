/**
 * HTTP Security Middleware
 * Provides rate limiting, CORS, and security headers
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
}

interface CorsConfig {
  origin: string | string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  constructor(private config: RateLimitConfig) {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  isAllowed(clientId: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const entry = this.requests.get(clientId);
    
    if (!entry || now > entry.resetTime) {
      // New window or expired
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return { allowed: true };
    }
    
    if (entry.count >= this.config.maxRequests) {
      return { allowed: false, resetTime: entry.resetTime };
    }
    
    entry.count++;
    return { allowed: true };
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export class HttpSecurityMiddleware {
  private rateLimiter: RateLimiter;
  
  constructor(
    private corsConfig: CorsConfig,
    rateLimitConfig: RateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  ) {
    this.rateLimiter = new RateLimiter(rateLimitConfig);
  }

  /**
   * Apply CORS headers
   */
  applyCors(req: any, res: any): boolean {
    const origin = req.headers.origin;
    
    // Handle CORS origin
    if (this.corsConfig.origin === true) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (typeof this.corsConfig.origin === 'string') {
      res.setHeader('Access-Control-Allow-Origin', this.corsConfig.origin);
    } else if (Array.isArray(this.corsConfig.origin)) {
      if (this.corsConfig.origin.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    }
    
    // Apply other CORS headers
    res.setHeader('Access-Control-Allow-Methods', this.corsConfig.methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', this.corsConfig.allowedHeaders.join(', '));
    
    if (this.corsConfig.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return false; // Don't process further
    }
    
    return true;
  }

  /**
   * Apply rate limiting
   */
  applyRateLimit(req: any, res: any): boolean {
    const clientId = this.getClientId(req);
    const result = this.rateLimiter.isAllowed(clientId);
    
    if (!result.allowed) {
      res.setHeader('X-RateLimit-Limit', this.rateLimiter['config'].maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', result.resetTime);
      
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime! - Date.now()) / 1000)
      }));
      return false;
    }
    
    return true;
  }

  /**
   * Apply security headers
   */
  applySecurityHeaders(res: any): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  }

  /**
   * Complete middleware application
   */
  apply(req: any, res: any): boolean {
    // Apply security headers first
    this.applySecurityHeaders(res);
    
    // Apply CORS
    if (!this.applyCors(req, res)) {
      return false; // Preflight handled
    }
    
    // Apply rate limiting
    if (!this.applyRateLimit(req, res)) {
      return false; // Rate limited
    }
    
    return true; // Continue processing
  }

  private getClientId(req: any): string {
    // Try to get real IP from common headers
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const clientIp = forwarded || realIp || req.connection?.remoteAddress || 'unknown';
    
    // Include user agent for better fingerprinting
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    return `${clientIp}:${userAgent}`.slice(0, 100); // Limit length
  }
}

// Default configuration
export const defaultSecurityConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN || false),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100')
  }
};