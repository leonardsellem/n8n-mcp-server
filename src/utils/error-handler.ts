// src/utils/error-handler.ts

import { logger } from './logger';
import { MCPError } from '../types/visual-types';

/**
 * Centralized error handling for the MCP server
 * 
 * This class provides consistent error formatting and logging across
 * all components of the server. It ensures that errors are properly
 * logged and formatted correctly for the MCP protocol.
 */
export class ErrorHandler {
  /**
   * Handle and format errors for MCP protocol responses
   */
  static handleError(error: any): any {
    // Always log to stderr for debugging
    logger.error('[Error Handler] Handling error', error);
    
    // If it's already an MCPError, use its structure
    if (error instanceof MCPError) {
      return {
        error: {
          code: error.code,
          message: error.message,
          data: error.details
        }
      };
    }
    
    // Handle specific error types
    if (error.response) {
      // Axios/HTTP errors
      return this.handleHttpError(error);
    }
    
    if (error.code === 'ECONNREFUSED') {
      return {
        error: {
          code: 'CONNECTION_ERROR',
          message: 'Cannot connect to n8n. Please ensure n8n is running and accessible.',
          data: { 
            host: error.address, 
            port: error.port,
            suggestion: 'Check N8N_BASE_URL in your .env file'
          }
        }
      };
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'Request timed out. The operation took too long to complete.',
          data: { 
            timeout: error.timeout,
            suggestion: 'Try increasing the timeout or check network connectivity'
          }
        }
      };
    }
    
    if (error.message?.includes('rate limit')) {
      return {
        error: {
          code: 'RATE_LIMIT_ERROR',
          message: 'Rate limit exceeded. Please wait before trying again.',
          data: { 
            retryAfter: error.retryAfter || 60,
            suggestion: 'Implement request throttling or wait before retrying'
          }
        }
      };
    }
    
    // Generic error handling
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        data: {
          type: error.constructor.name,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }
    };
  }

  /**
   * Handle HTTP/API errors specifically
   */
  private static handleHttpError(error: any): any {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    
    // Map HTTP status codes to meaningful error codes
    const statusCodeMap: Record<number, { code: string; message: string }> = {
      400: { 
        code: 'BAD_REQUEST', 
        message: 'Invalid request. Please check your input parameters.' 
      },
      401: { 
        code: 'AUTHENTICATION_ERROR', 
        message: 'Authentication failed. Please check your API credentials.' 
      },
      403: { 
        code: 'PERMISSION_ERROR', 
        message: 'You do not have permission to perform this action.' 
      },
      404: { 
        code: 'NOT_FOUND', 
        message: 'The requested resource was not found.' 
      },
      409: { 
        code: 'CONFLICT_ERROR', 
        message: 'The request conflicts with the current state.' 
      },
      422: { 
        code: 'VALIDATION_ERROR', 
        message: 'The request contains invalid data.' 
      },
      429: { 
        code: 'RATE_LIMIT_ERROR', 
        message: 'Too many requests. Please slow down.' 
      },
      500: { 
        code: 'SERVER_ERROR', 
        message: 'The server encountered an internal error.' 
      },
      502: { 
        code: 'BAD_GATEWAY', 
        message: 'The server received an invalid response from the upstream server.' 
      },
      503: { 
        code: 'SERVICE_UNAVAILABLE', 
        message: 'The service is temporarily unavailable.' 
      }
    };
    
    const errorInfo = statusCodeMap[status] || { 
      code: 'HTTP_ERROR', 
      message: `HTTP ${status} ${statusText}` 
    };
    
    return {
      error: {
        code: errorInfo.code,
        message: data?.message || errorInfo.message,
        data: {
          status,
          statusText,
          url: error.config?.url,
          method: error.config?.method,
          details: data
        }
      }
    };
  }

  /**
   * Create a user-friendly error message with suggestions
   */
  static createUserFriendlyError(error: any): string {
    const suggestions: Record<string, string[]> = {
      CONNECTION_ERROR: [
        'Ensure n8n is running',
        'Check the N8N_BASE_URL in your .env file',
        'Verify firewall settings allow the connection'
      ],
      AUTHENTICATION_ERROR: [
        'Check your N8N_API_KEY is correct',
        'Ensure the API key has the necessary permissions',
        'Try regenerating your API key in n8n settings'
      ],
      NODE_NOT_FOUND: [
        'Run sync_github_nodes to update node definitions',
        'Check if the node name is spelled correctly',
        'Verify the node is available in your n8n version'
      ],
      WORKFLOW_NOT_FOUND: [
        'Check the workflow ID is correct',
        'Ensure the workflow hasn\'t been deleted',
        'List available workflows to find the correct ID'
      ],
      VISUAL_VERIFICATION_ERROR: [
        'Ensure n8n is accessible via web browser',
        'Check N8N_USERNAME and N8N_PASSWORD are correct',
        'Verify Playwright/Chromium is properly installed'
      ],
      BROWSER_ERROR: [
        'Check if Playwright is properly installed',
        'Ensure browser dependencies are available',
        'Try restarting the browser session'
      ],
      GITHUB_SYNC_ERROR: [
        'Check your GITHUB_TOKEN if using private repositories',
        'Verify internet connectivity',
        'Check if GitHub API rate limits are exceeded'
      ]
    };
    
    let message = `❌ Error: ${error.message || 'An error occurred'}`;
    
    if (error instanceof MCPError && suggestions[error.code]) {
      message += '\n\n💡 Suggestions:';
      suggestions[error.code].forEach(suggestion => {
        message += `\n  • ${suggestion}`;
      });
    }
    
    return message;
  }

  /**
   * Log error with context
   */
  static logError(context: string, error: any): void {
    const errorInfo = {
      context,
      message: error.message,
      code: error.code || 'UNKNOWN',
      stack: error.stack
    };
    
    logger.error(`[${context}] Error occurred`, errorInfo);
  }

  /**
   * Wrap async functions with error handling
   */
  static wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context: string
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error: any) {
        this.logError(context, error);
        throw error;
      }
    }) as T;
  }

  /**
   * Create a retry wrapper for flaky operations
   */
  static async retry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delay?: number;
      backoff?: number;
      onRetry?: (attempt: number, error: any) => void;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoff = 2,
      onRetry
    } = options;
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        if (onRetry) {
          onRetry(attempt, error);
        }
        
        // Calculate delay with exponential backoff
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        logger.warn(`[Retry] Attempt ${attempt} failed, retrying in ${waitTime}ms...`, { error: error.message });
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError;
  }

  /**
   * Validate required environment variables
   */
  static validateEnvironment(): void {
    const required = [
      'N8N_BASE_URL',
      'N8N_API_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new MCPError(
        `Missing required environment variables: ${missing.join(', ')}`,
        'CONFIGURATION_ERROR',
        { missing }
      );
    }
    
    // Validate URLs
    try {
      new URL(process.env.N8N_BASE_URL!);
    } catch {
      throw new MCPError(
        'N8N_BASE_URL must be a valid URL',
        'CONFIGURATION_ERROR'
      );
    }
    
    // Warn about optional configurations
    if (!process.env.GITHUB_TOKEN) {
      logger.warn('[Warning] GITHUB_TOKEN not set. GitHub sync may be rate limited.');
    }
    
    if (process.env.ENABLE_VISUAL_VERIFICATION === 'true' && 
        (!process.env.N8N_USERNAME || !process.env.N8N_PASSWORD)) {
      logger.warn('[Warning] Visual verification enabled but n8n credentials not set.');
    }
  }

  /**
   * Handle browser-specific errors
   */
  static handleBrowserError(error: any, context: string): MCPError {
    let message = `Browser error in ${context}: ${error.message}`;
    let code = 'BROWSER_ERROR';
    
    if (error.message?.includes('timeout')) {
      code = 'BROWSER_TIMEOUT';
      message = `Browser operation timed out in ${context}. The page may be loading slowly.`;
    } else if (error.message?.includes('Connection closed')) {
      code = 'BROWSER_CONNECTION_CLOSED';
      message = `Browser connection was closed during ${context}. This may indicate a browser crash.`;
    } else if (error.message?.includes('Element not found')) {
      code = 'ELEMENT_NOT_FOUND';
      message = `Could not find the expected UI element during ${context}. The n8n interface may have changed.`;
    } else if (error.message?.includes('Navigation failed')) {
      code = 'NAVIGATION_ERROR';
      message = `Failed to navigate to the target page during ${context}. Check the URL and network connectivity.`;
    }
    
    return new MCPError(message, code, { originalError: error.message, context });
  }

  /**
   * Handle validation errors with specific suggestions
   */
  static handleValidationError(errors: string[], context: string): MCPError {
    const message = `Validation failed in ${context}: ${errors.join(', ')}`;
    return new MCPError(message, 'VALIDATION_ERROR', { errors, context });
  }

  /**
   * Create a timeout wrapper for operations
   */
  static withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    context: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new MCPError(
            `Operation timed out after ${timeoutMs}ms in ${context}`,
            'TIMEOUT_ERROR',
            { timeout: timeoutMs, context }
          ));
        }, timeoutMs);
      })
    ]);
  }

  /**
   * Safe execution wrapper that catches and logs errors
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.logError(context, error);
      return fallback;
    }
  }

  /**
   * Check if an error is recoverable
   */
  static isRecoverableError(error: any): boolean {
    const recoverableCodes = [
      'TIMEOUT_ERROR',
      'RATE_LIMIT_ERROR',
      'SERVICE_UNAVAILABLE',
      'BROWSER_TIMEOUT',
      'NETWORK_ERROR'
    ];
    
    return recoverableCodes.includes(error.code) || 
           error.message?.includes('timeout') ||
           error.message?.includes('rate limit') ||
           (error.response?.status >= 500 && error.response?.status < 600);
  }

  /**
   * Format error for user display
   */
  static formatForUser(error: any): string {
    if (error instanceof MCPError) {
      return this.createUserFriendlyError(error);
    }
    
    // For generic errors, provide a simple message
    return `❌ ${error.message || 'An error occurred'}`;
  }
}

/**
 * Decorator for automatic error handling in MCP tool functions
 */
export function withErrorHandling(context: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error: any) {
        ErrorHandler.logError(`${context}.${propertyName}`, error);
        return ErrorHandler.handleError(error);
      }
    };
    
    return descriptor;
  };
}

/**
 * Utility function to create typed MCP errors
 */
export function createMCPError(
  message: string,
  code: string,
  details?: any
): MCPError {
  return new MCPError(message, code, details);
}
