/**
 * Input Validation Utility
 * Provides secure input validation and sanitization
 */

export class InputValidator {
  /**
   * Validate and sanitize string input
   */
  static sanitizeString(input: unknown): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    
    // Remove null bytes and limit length
    const sanitized = input.replace(/\0/g, '').slice(0, 10000);
    
    // Basic XSS prevention
    return sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate node type format
   */
  static validateNodeType(nodeType: unknown): string {
    const sanitized = this.sanitizeString(nodeType);
    
    // Node types must match specific patterns
    const validPattern = /^(@?[a-zA-Z0-9-_]+\/)?[a-zA-Z0-9-_.]+$/;
    if (!validPattern.test(sanitized)) {
      throw new Error(`Invalid node type format: ${sanitized}`);
    }
    
    // Prevent path traversal
    if (sanitized.includes('..') || sanitized.includes('/')) {
      throw new Error(`Potential path traversal in node type: ${sanitized}`);
    }
    
    return sanitized;
  }

  /**
   * Validate workflow ID
   */
  static validateWorkflowId(workflowId: unknown): string {
    const sanitized = this.sanitizeString(workflowId);
    
    // Workflow IDs should be alphanumeric with hyphens/underscores
    const validPattern = /^[a-zA-Z0-9-_]{1,100}$/;
    if (!validPattern.test(sanitized)) {
      throw new Error(`Invalid workflow ID format: ${sanitized}`);
    }
    
    return sanitized;
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: unknown): string {
    const sanitized = this.sanitizeString(url);
    
    try {
      const parsed = new URL(sanitized);
      
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(`Invalid protocol: ${parsed.protocol}`);
      }
      
      return sanitized;
    } catch (error) {
      throw new Error(`Invalid URL format: ${sanitized}`);
    }
  }

  /**
   * Validate object input with size limits
   */
  static validateObject(obj: unknown, maxSizeKB = 1024): object {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      throw new Error('Input must be a non-null object');
    }
    
    // Check serialized size
    const serialized = JSON.stringify(obj);
    const sizeKB = Buffer.byteLength(serialized, 'utf8') / 1024;
    
    if (sizeKB > maxSizeKB) {
      throw new Error(`Object too large: ${sizeKB.toFixed(1)}KB (max: ${maxSizeKB}KB)`);
    }
    
    return obj as object;
  }

  /**
   * Validate number with range limits
   */
  static validateNumber(num: unknown, min = -Infinity, max = Infinity): number {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      throw new Error(`Invalid number: ${num}`);
    }
    
    if (num < min || num > max) {
      throw new Error(`Number out of range: ${num} (min: ${min}, max: ${max})`);
    }
    
    return num;
  }

  /**
   * Validate enum value
   */
  static validateEnum<T extends string>(value: unknown, allowedValues: T[]): T {
    const sanitized = this.sanitizeString(value);
    
    if (!allowedValues.includes(sanitized as T)) {
      throw new Error(`Invalid value: ${sanitized}. Allowed: ${allowedValues.join(', ')}`);
    }
    
    return sanitized as T;
  }
}