/**
 * Input Validation and Sanitization
 * 
 * Comprehensive input validation to prevent injection attacks,
 * ensure data integrity, and provide secure parameter handling.
 */

import { z } from 'zod';

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized?: any;
  warnings?: string[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

/**
 * Security validation patterns
 */
export class SecurityPatterns {
  // Dangerous patterns that should be rejected
  static readonly DANGEROUS_PATTERNS = [
    // SQL injection patterns
    /(['"])\s*(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+/i,
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+.*\s+(from|into|where|set|values)/i,
    
    // Script injection patterns  
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    
    // Command injection patterns
    /[;&|`$(){}[\]\\]/,
    /\.\.\//,
    /\/etc\/passwd/i,
    /\/proc\//i,
    
    // Path traversal patterns
    /\.\.[/\\]/,
    /~[/\\]/,
    
    // LDAP injection patterns
    /[()&|!]/,
    
    // NoSQL injection patterns
    /\$where/i,
    /\$regex/i,
    /\$ne/i,
  ];

  // Safe characters for different contexts
  static readonly ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
  static readonly ALPHANUMERIC_WITH_SPACES = /^[a-zA-Z0-9\s]+$/;
  static readonly ALPHANUMERIC_WITH_COMMON = /^[a-zA-Z0-9\s\-_.@]+$/;
  static readonly WORKFLOW_NAME = /^[a-zA-Z0-9\s\-_.()[\]]+$/;
  static readonly NODE_TYPE = /^[a-zA-Z0-9\-_.]+$/;
  static readonly URL_SAFE = /^[a-zA-Z0-9\-_.~:/?#[\]@!$&'()*+,;=%]+$/;
}

/**
 * Zod schemas for common input types
 */
export const ValidationSchemas = {
  // Basic types
  safeString: z.string().min(1).max(1000).refine(
    val => !SecurityPatterns.DANGEROUS_PATTERNS.some(pattern => pattern.test(val)),
    { message: "String contains potentially dangerous content" }
  ),

  workflowName: z.string().min(1).max(255).regex(
    SecurityPatterns.WORKFLOW_NAME,
    "Workflow name contains invalid characters"
  ),

  nodeType: z.string().min(1).max(100).regex(
    SecurityPatterns.NODE_TYPE,
    "Node type contains invalid characters"
  ),

  workflowId: z.string().uuid().or(z.string().regex(/^[a-zA-Z0-9\-_]+$/)),

  executionId: z.string().uuid().or(z.string().regex(/^[a-zA-Z0-9\-_]+$/)),

  credentialId: z.string().uuid().or(z.string().regex(/^[a-zA-Z0-9\-_]+$/)),

  // URL validation
  apiUrl: z.string().url().refine(
    val => val.startsWith('http://') || val.startsWith('https://'),
    { message: "URL must use HTTP or HTTPS protocol" }
  ),

  // JSON validation
  safeJson: z.any().refine(
    val => {
      try {
        const str = JSON.stringify(val);
        return !SecurityPatterns.DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
      } catch {
        return false;
      }
    },
    { message: "JSON contains potentially dangerous content" }
  ),

  // Pagination
  limit: z.number().int().min(1).max(1000).default(50),
  offset: z.number().int().min(0).default(0),

  // Boolean with string fallback
  boolean: z.boolean().or(z.string().transform(val => val.toLowerCase() === 'true')),

  // Array of safe strings
  stringArray: z.array(z.string().max(100)).max(100),

  // Search query
  searchQuery: z.string().min(1).max(500).refine(
    val => !/[<>'"&]/.test(val),
    { message: "Search query contains invalid characters" }
  )
};

/**
 * Input validator with sanitization capabilities
 */
export class InputValidator {
  
  /**
   * Validate and sanitize input against a schema
   */
  static validate<T>(schema: z.ZodSchema<T>, input: unknown): ValidationResult {
    try {
      const result = schema.safeParse(input);
      
      if (result.success) {
        return {
          valid: true,
          errors: [],
          sanitized: result.data
        };
      } else {
        return {
          valid: false,
          errors: result.error.errors.map(err => ({
            field: err.path.join('.'),
            code: err.code,
            message: err.message,
            value: 'received' in err ? err.received : undefined
          }))
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [{
          field: 'unknown',
          code: 'validation_error',
          message: error instanceof Error ? error.message : 'Unknown validation error'
        }]
      };
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string, options: {
    maxLength?: number;
    allowSpecialChars?: boolean;
    removeHtml?: boolean;
    trimWhitespace?: boolean;
  } = {}): string {
    const {
      maxLength = 1000,
      allowSpecialChars = false,
      removeHtml = true,
      trimWhitespace = true
    } = options;

    let sanitized = input;

    // Trim whitespace
    if (trimWhitespace) {
      sanitized = sanitized.trim();
    }

    // Remove HTML tags
    if (removeHtml) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    // Remove dangerous characters if not allowing special chars
    if (!allowSpecialChars) {
      sanitized = sanitized.replace(/[<>'"&`${}[\]\\]/g, '');
    }

    // Truncate to max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Validate workflow parameters
   */
  static validateWorkflowParams(params: any): ValidationResult {
    const schema = z.object({
      name: ValidationSchemas.workflowName.optional(),
      active: ValidationSchemas.boolean.optional(),
      tags: ValidationSchemas.stringArray.optional(),
      search: ValidationSchemas.searchQuery.optional(),
      limit: ValidationSchemas.limit.optional(),
      offset: ValidationSchemas.offset.optional()
    });

    return this.validate(schema, params);
  }

  /**
   * Validate node parameters
   */
  static validateNodeParams(params: any): ValidationResult {
    const schema = z.object({
      nodeType: ValidationSchemas.nodeType,
      parameters: ValidationSchemas.safeJson.optional(),
      includeAiOptimizations: ValidationSchemas.boolean.optional(),
      includeAlternatives: ValidationSchemas.boolean.optional()
    });

    return this.validate(schema, params);
  }

  /**
   * Validate execution parameters
   */
  static validateExecutionParams(params: any): ValidationResult {
    const schema = z.object({
      workflowId: ValidationSchemas.workflowId.optional(),
      status: z.enum(['success', 'error', 'waiting', 'running', 'canceled']).optional(),
      limit: ValidationSchemas.limit.optional(),
      lastId: ValidationSchemas.executionId.optional(),
      includeData: ValidationSchemas.boolean.optional()
    });

    return this.validate(schema, params);
  }

  /**
   * Validate credential parameters
   */
  static validateCredentialParams(params: any): ValidationResult {
    const schema = z.object({
      type: ValidationSchemas.safeString.optional(),
      name: ValidationSchemas.workflowName.optional(),
      data: ValidationSchemas.safeJson.optional()
    });

    return this.validate(schema, params);
  }

  /**
   * Check for dangerous patterns in any input
   */
  static containsDangerousContent(input: any): boolean {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    return SecurityPatterns.DANGEROUS_PATTERNS.some(pattern => pattern.test(inputStr));
  }

  /**
   * Deep sanitize an object recursively
   */
  static deepSanitize(obj: any, maxDepth = 10): any {
    if (maxDepth <= 0) {
      return '[MAX_DEPTH_EXCEEDED]';
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item, maxDepth - 1));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.sanitizeString(key, { allowSpecialChars: false });
        sanitized[sanitizedKey] = this.deepSanitize(value, maxDepth - 1);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Validate file upload parameters
   */
  static validateFileParams(params: any): ValidationResult {
    const schema = z.object({
      filename: z.string().min(1).max(255).regex(
        /^[a-zA-Z0-9\-_.()[\] ]+$/,
        "Filename contains invalid characters"
      ),
      mimetype: z.string().regex(
        /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-^]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^]*$/,
        "Invalid MIME type"
      ),
      size: z.number().int().min(1).max(10 * 1024 * 1024) // Max 10MB
    });

    return this.validate(schema, params);
  }

  /**
   * Validate webhook parameters
   */
  static validateWebhookParams(params: any): ValidationResult {
    const schema = z.object({
      path: z.string().min(1).max(200).regex(
        /^[a-zA-Z0-9\-_./]+$/,
        "Webhook path contains invalid characters"
      ),
      httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      responseMode: z.enum(['onReceived', 'lastNode', 'responseNode']).optional(),
      authentication: z.enum(['none', 'basicAuth', 'headerAuth']).optional()
    });

    return this.validate(schema, params);
  }
}

/**
 * Validation middleware for tool handlers
 */
export function validateInput(
  validator: (params: any) => ValidationResult,
  options: {
    sanitize?: boolean;
    throwOnError?: boolean;
  } = {}
) {
  const { sanitize = true, throwOnError = true } = options;

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const params = args[0] || {};
      
      // Validate input
      const validationResult = validator(params);
      
      if (!validationResult.valid) {
        const errorMessage = validationResult.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('; ');
        
        if (throwOnError) {
          throw new Error(`Input validation failed: ${errorMessage}`);
        } else {
          console.warn(`Input validation warning for ${propertyName}: ${errorMessage}`);
        }
      }

      // Use sanitized input if available and sanitization is enabled
      const processedParams = sanitize && validationResult.sanitized 
        ? validationResult.sanitized 
        : params;

      // Call original method with processed parameters
      return method.apply(this, [processedParams, ...args.slice(1)]);
    };

    return descriptor;
  };
}
