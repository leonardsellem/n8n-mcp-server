import { logger } from './logger';

/**
 * Base domain error class with enhanced context
 */
export abstract class DomainError extends Error {
  public readonly timestamp: Date;
  public readonly context: Record<string, any>;
  
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    context: Record<string, any> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = this.sanitizeContext(context);
    
    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Sanitize context to prevent sensitive data leakage
   */
  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    
    for (const [key, value] of Object.entries(context)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000) + '...[TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Get serializable error data for logging
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack?.split('\n').slice(0, 10) // Limit stack trace size
    };
  }
}

/**
 * Security-related errors
 */
export class SecurityError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'SECURITY_ERROR', 403, context);
  }
}

/**
 * GitHub integration errors
 */
export class GitHubError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'GITHUB_ERROR', 502, context);
  }
}

/**
 * Database operation errors
 */
export class DatabaseError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'DATABASE_ERROR', 500, context);
  }
}

/**
 * Cache operation errors
 */
export class CacheError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'CACHE_ERROR', 500, context);
  }
}

/**
 * Node loading/compilation errors
 */
export class NodeLoadingError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'NODE_LOADING_ERROR', 500, context);
  }
}

/**
 * Webhook processing errors
 */
export class WebhookError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'WEBHOOK_ERROR', 400, context);
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'CONFIGURATION_ERROR', 500, context);
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'TIMEOUT_ERROR', 408, context);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'VALIDATION_ERROR', 400, context);
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends DomainError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'RATE_LIMIT_ERROR', 429, context);
  }
}

/**
 * Error handler with retry logic and circuit breaker
 */
export class ErrorHandler {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private errorCounts = new Map<string, number>();
  private lastErrorReset = Date.now();

  /**
   * Execute operation with comprehensive error handling
   */
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    options: {
      operationName: string;
      maxRetries?: number;
      retryDelayMs?: number;
      timeoutMs?: number;
      circuitBreakerEnabled?: boolean;
      context?: Record<string, any>;
    }
  ): Promise<T> {
    const {
      operationName,
      maxRetries = 3,
      retryDelayMs = 1000,
      timeoutMs = 30000,
      circuitBreakerEnabled = true,
      context = {}
    } = options;

    // Check circuit breaker
    if (circuitBreakerEnabled) {
      const circuitBreaker = this.getCircuitBreaker(operationName);
      if (circuitBreaker.isOpen()) {
        throw new DomainError(
          `Circuit breaker is open for operation: ${operationName}`,
          'CIRCUIT_BREAKER_OPEN',
          503,
          { operationName, ...context }
        );
      }
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout wrapper
        const result = await this.withTimeout(operation(), timeoutMs, operationName);
        
        // Reset circuit breaker on success
        if (circuitBreakerEnabled) {
          this.getCircuitBreaker(operationName).recordSuccess();
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Record error in circuit breaker
        if (circuitBreakerEnabled) {
          this.getCircuitBreaker(operationName).recordFailure();
        }
        
        // Increment error count
        this.incrementErrorCount(operationName);
        
        // Log retry attempt
        if (attempt < maxRetries) {
          logger.warn(`[Error Handler] Operation ${operationName} failed, retrying (${attempt}/${maxRetries})`, {
            error: lastError.message,
            attempt,
            context
          });
          
          // Wait before retry with exponential backoff
          await this.delay(retryDelayMs * Math.pow(2, attempt - 1));
        }
      }
    }

    // All retries exhausted, throw final error
    const finalError = this.enhanceError(lastError!, operationName, context);
    logger.error(`[Error Handler] Operation ${operationName} failed after ${maxRetries} attempts`, {
      error: finalError.toJSON ? finalError.toJSON() : finalError.message,
      context
    });
    
    throw finalError;
  }

  /**
   * Wrap operation with timeout
   */
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new TimeoutError(
          `Operation timed out after ${timeoutMs}ms: ${operationName}`,
          { timeoutMs, operationName }
        ));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  /**
   * Enhance error with additional context
   */
  private enhanceError(error: Error, operationName: string, context: Record<string, any>): DomainError {
    if (error instanceof DomainError) {
      return error;
    }

    // Convert specific error types
    if (error.message.includes('timeout')) {
      return new TimeoutError(error.message, { operationName, originalError: error.name, ...context });
    }
    
    if (error.message.toLowerCase().includes('unauthorized') || error.message.toLowerCase().includes('forbidden')) {
      return new SecurityError(error.message, { operationName, originalError: error.name, ...context });
    }
    
    if (error.message.toLowerCase().includes('rate limit')) {
      return new RateLimitError(error.message, { operationName, originalError: error.name, ...context });
    }

    // Default to generic domain error
    return new DomainError(
      error.message,
      'OPERATION_FAILED',
      500,
      { operationName, originalError: error.name, ...context }
    );
  }

  /**
   * Get or create circuit breaker for operation
   */
  private getCircuitBreaker(operationName: string): CircuitBreaker {
    if (!this.circuitBreakers.has(operationName)) {
      this.circuitBreakers.set(operationName, new CircuitBreaker({
        failureThreshold: 5,
        resetTimeoutMs: 60000 // 1 minute
      }));
    }
    return this.circuitBreakers.get(operationName)!;
  }

  /**
   * Increment error count for monitoring
   */
  private incrementErrorCount(operationName: string): void {
    const current = this.errorCounts.get(operationName) || 0;
    this.errorCounts.set(operationName, current + 1);
    
    // Reset counts every hour
    if (Date.now() - this.lastErrorReset > 60 * 60 * 1000) {
      this.errorCounts.clear();
      this.lastErrorReset = Date.now();
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): Record<string, any> {
    const stats: Record<string, any> = {
      errorCounts: Object.fromEntries(this.errorCounts),
      circuitBreakers: {}
    };

    for (const [name, cb] of this.circuitBreakers) {
      stats.circuitBreakers[name] = {
        state: cb.getState(),
        failureCount: cb.getFailureCount(),
        lastFailureTime: cb.getLastFailureTime()
      };
    }

    return stats;
  }

  /**
   * Reset all circuit breakers
   */
  resetCircuitBreakers(): void {
    for (const cb of this.circuitBreakers.values()) {
      cb.reset();
    }
    logger.info('[Error Handler] All circuit breakers reset');
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Circuit breaker implementation
 */
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: Date | null = null;
  private nextAttemptTime: Date | null = null;

  constructor(
    private config: {
      failureThreshold: number;
      resetTimeoutMs: number;
    }
  ) {}

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = new Date(Date.now() + this.config.resetTimeoutMs);
    }
  }

  isOpen(): boolean {
    if (this.state === 'OPEN' && this.nextAttemptTime && Date.now() >= this.nextAttemptTime.getTime()) {
      this.state = 'HALF_OPEN';
      return false;
    }
    
    return this.state === 'OPEN';
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  getLastFailureTime(): Date | null {
    return this.lastFailureTime;
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }
}

/**
 * Global error handler instance
 */
export const errorHandler = new ErrorHandler();

/**
 * Express error handler middleware
 */
export function expressErrorHandler(err: any, req: any, res: any, next: any): void {
  if (res.headersSent) {
    return next(err);
  }

  let error: DomainError;
  if (err instanceof DomainError) {
    error = err;
  } else {
    error = new DomainError(
      err.message || 'Internal server error',
      'INTERNAL_ERROR',
      500,
      { originalError: err.name, path: req.path, method: req.method }
    );
  }

  logger.error('[Express Error Handler] Request failed', {
    error: error.toJSON(),
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp
    }
  });
}

/**
 * Async wrapper for express route handlers
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Let express error handler deal with it
      throw error;
    }
  };
}

/**
 * Graceful shutdown handler
 */
export class GracefulShutdownHandler {
  private shutdownHandlers: Array<() => Promise<void>> = [];
  private isShuttingDown = false;

  constructor() {
    this.setupSignalHandlers();
  }

  /**
   * Register a cleanup handler
   */
  onShutdown(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler);
  }

  /**
   * Setup process signal handlers
   */
  private setupSignalHandlers(): void {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`[Graceful Shutdown] Received ${signal}, starting graceful shutdown...`);
        await this.shutdown();
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('[Graceful Shutdown] Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('[Graceful Shutdown] Unhandled rejection', { reason, promise });
      process.exit(1);
    });
  }

  /**
   * Execute graceful shutdown
   */
  private async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn('[Graceful Shutdown] Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    const shutdownTimeout = 30000; // 30 seconds

    try {
      // Execute all shutdown handlers with timeout
      await Promise.race([
        Promise.all(this.shutdownHandlers.map(handler => handler())),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Shutdown timeout')), shutdownTimeout)
        )
      ]);

      logger.info('[Graceful Shutdown] Shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('[Graceful Shutdown] Shutdown failed', error);
      process.exit(1);
    }
  }
}

/**
 * Global graceful shutdown handler
 */
export const gracefulShutdown = new GracefulShutdownHandler();