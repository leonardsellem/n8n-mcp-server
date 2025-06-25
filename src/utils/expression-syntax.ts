/**
 * n8n Expression Syntax Support
 * 
 * This module provides utilities for working with n8n expression syntax,
 * validation, and common patterns for AI agents to generate proper expressions.
 */

/**
 * n8n Expression Types and Patterns
 */
export interface ExpressionContext {
  // Previous node data
  $json: Record<string, any>;
  $binary: Record<string, any>;
  $input: {
    all(): any[];
    first(): any;
    last(): any;
    item(index: number): any;
  };
  
  // Workflow context
  $workflow: {
    id: string;
    name: string;
    active: boolean;
  };
  
  // Execution context
  $execution: {
    id: string;
    mode: string;
    resumeUrl?: string;
  };
  
  // Node context
  $node: {
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
  };
  
  // Item context
  $item: (index: number, runIndex?: number) => any;
  $items: (nodeName?: string, outputIndex?: number, runIndex?: number) => any[];
  
  // Utility functions
  $now: string;
  $today: string;
  $randomString: (length: number) => string;
  $jmespath: (data: any, expression: string) => any;
}

/**
 * Common n8n Expression Patterns
 */
export const EXPRESSION_PATTERNS = {
  // Data access patterns
  JSON_FIELD: '={{$json.fieldName}}',
  NESTED_FIELD: '={{$json.user.email}}',
  ARRAY_ACCESS: '={{$json.items[0].name}}',
  BINARY_DATA: '={{$binary.data}}',
  
  // Input data patterns
  ALL_INPUT: '={{$input.all()}}',
  FIRST_INPUT: '={{$input.first()}}',
  LAST_INPUT: '={{$input.last()}}',
  SPECIFIC_ITEM: '={{$input.item(0)}}',
  
  // Node data patterns
  PREVIOUS_NODE: '={{$("Previous Node").first()}}',
  SPECIFIC_NODE: '={{$("Node Name").all()}}',
  NODE_OUTPUT: '={{$("HTTP Request").first().$json}}',
  
  // Utility patterns
  TIMESTAMP: '={{$now}}',
  TODAY_DATE: '={{$today}}',
  RANDOM_STRING: '={{$randomString(8)}}',
  RANDOM_ID: '={{$randomString(12)}}',
  
  // Conditional patterns
  IF_CONDITION: '={{$json.status === "active"}}',
  TERNARY: '={{$json.priority === "high" ? "urgent" : "normal"}}',
  BOOLEAN_CHECK: '={{!!$json.isActive}}',
  
  // String manipulation
  CONCAT: '={{$json.firstName + " " + $json.lastName}}',
  UPPERCASE: '={{$json.name.toUpperCase()}}',
  LOWERCASE: '={{$json.email.toLowerCase()}}',
  SUBSTRING: '={{$json.description.substring(0, 100)}}',
  REPLACE: '={{$json.text.replace(/old/g, "new")}}',
  
  // Number operations
  MATH_ADD: '={{$json.price + $json.tax}}',
  MATH_MULTIPLY: '={{$json.quantity * $json.price}}',
  MATH_ROUND: '={{Math.round($json.value)}}',
  PARSE_INT: '={{parseInt($json.stringNumber)}}',
  
  // Date operations
  DATE_FORMAT: '={{new Date($json.timestamp).toISOString()}}',
  DATE_ADD: '={{new Date(Date.now() + 24*60*60*1000).toISOString()}}',
  DATE_PARSE: '={{new Date($json.dateString)}}',
  
  // Array operations
  ARRAY_LENGTH: '={{$json.items.length}}',
  ARRAY_MAP: '={{$json.users.map(u => u.email)}}',
  ARRAY_FILTER: '={{$json.items.filter(item => item.active)}}',
  ARRAY_JOIN: '={{$json.tags.join(", ")}}',
  
  // Object operations
  OBJECT_KEYS: '={{Object.keys($json)}}',
  OBJECT_VALUES: '={{Object.values($json.data)}}',
  MERGE_OBJECTS: '={{Object.assign({}, $json, {newField: "value"})}}',
  
  // Complex expressions
  EMAIL_DOMAIN: '={{$json.email.split("@")[1]}}',
  FULL_NAME: '={{($json.firstName || "") + " " + ($json.lastName || "")}}',
  SLUG_CREATE: '={{$json.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}}',
  
  // JMESPath expressions
  JMESPATH_SIMPLE: '={{$jmespath($json, "users[*].email")}}',
  JMESPATH_FILTER: '={{$jmespath($json, "items[?price > `10`].name")}}',
  
  // Error handling
  SAFE_ACCESS: '={{$json.user?.profile?.email || "unknown"}}',
  DEFAULT_VALUE: '={{$json.optionalField || "default"}}',
  TYPE_CHECK: '={{typeof $json.value === "string" ? $json.value : String($json.value)}}'
};

/**
 * Expression Builder Class
 */
export class ExpressionBuilder {
  /**
   * Build a simple field access expression
   */
  static field(fieldPath: string): string {
    if (fieldPath.includes('.')) {
      return `={{$json.${fieldPath}}}`;
    }
    return `={{$json.${fieldPath}}}`;
  }
  
  /**
   * Build a conditional expression
   */
  static conditional(condition: string, trueValue: string, falseValue: string): string {
    return `={{${condition} ? ${JSON.stringify(trueValue)} : ${JSON.stringify(falseValue)}}}`;
  }
  
  /**
   * Build a string concatenation expression
   */
  static concat(...parts: string[]): string {
    const expression = parts.map(part => {
      if (part.startsWith('$json.') || part.startsWith('$')) {
        return part;
      }
      return JSON.stringify(part);
    }).join(' + ');
    return `={{${expression}}}`;
  }
  
  /**
   * Build an array access expression
   */
  static arrayAccess(arrayField: string, index: number | string): string {
    if (typeof index === 'number') {
      return `={{$json.${arrayField}[${index}]}}`;
    }
    return `={{$json.${arrayField}[${index}]}}`;
  }
  
  /**
   * Build a function call expression
   */
  static functionCall(functionName: string, ...args: any[]): string {
    const argString = args.map(arg => {
      if (typeof arg === 'string' && !arg.startsWith('$')) {
        return JSON.stringify(arg);
      }
      return String(arg);
    }).join(', ');
    return `={{${functionName}(${argString})}}`;
  }
  
  /**
   * Build a node reference expression
   */
  static nodeReference(nodeName: string, method: 'first' | 'all' | 'last' = 'first'): string {
    return `={{$("${nodeName}").${method}()}}`;
  }
  
  /**
   * Build a date expression
   */
  static dateExpression(operation: 'now' | 'today' | 'format' | 'add', value?: string): string {
    switch (operation) {
      case 'now':
        return '={{$now}}';
      case 'today':
        return '={{$today}}';
      case 'format':
        return `={{new Date(${value || '$json.date'}).toISOString()}}`;
      case 'add':
        return `={{new Date(Date.now() + ${value || '24*60*60*1000'}).toISOString()}}`;
      default:
        return '={{$now}}';
    }
  }
}

/**
 * Expression Validator
 */
export class ExpressionValidator {
  /**
   * Check if a string is a valid n8n expression
   */
  static isExpression(value: string): boolean {
    return typeof value === 'string' && value.startsWith('={{') && value.endsWith('}}');
  }
  
  /**
   * Extract the expression content (without {{ }})
   */
  static extractExpression(value: string): string {
    if (!this.isExpression(value)) {
      return value;
    }
    return value.slice(3, -2); // Remove ={{ and }}
  }
  
  /**
   * Validate expression syntax (basic check)
   */
  static validateSyntax(expression: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const content = this.isExpression(expression) ? this.extractExpression(expression) : expression;
    
    // Check for balanced parentheses
    let parenthesesCount = 0;
    let braceCount = 0;
    let bracketCount = 0;
    
    for (const char of content) {
      switch (char) {
        case '(':
          parenthesesCount++;
          break;
        case ')':
          parenthesesCount--;
          break;
        case '{':
          braceCount++;
          break;
        case '}':
          braceCount--;
          break;
        case '[':
          bracketCount++;
          break;
        case ']':
          bracketCount--;
          break;
      }
    }
    
    if (parenthesesCount !== 0) {
      errors.push('Unbalanced parentheses in expression');
    }
    if (braceCount !== 0) {
      errors.push('Unbalanced braces in expression');
    }
    if (bracketCount !== 0) {
      errors.push('Unbalanced brackets in expression');
    }
    
    // Check for common n8n variables
    const hasValidContext = /\$json|\$input|\$node|\$workflow|\$execution|\$now|\$today|\$randomString/.test(content);
    if (!hasValidContext && !content.includes('$') && content.includes('json')) {
      errors.push('Expression should use $json instead of json');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get suggestions for common expression patterns
   */
  static getSuggestions(fieldName?: string): string[] {
    const suggestions = [
      '={{$json.fieldName}}',
      '={{$now}}',
      '={{$randomString(8)}}',
      '={{$input.first()}}',
      '={{$json.status === "active"}}'
    ];
    
    if (fieldName) {
      suggestions.unshift(`={{$json.${fieldName}}}`);
      suggestions.push(`={{$json.${fieldName} || "default"}}`);
      suggestions.push(`={{$json.${fieldName}.toString()}}`);
    }
    
    return suggestions;
  }
}

/**
 * Common Expression Helpers for AI Agents
 */
export class AIExpressionHelper {
  /**
   * Generate expressions for common field mapping scenarios
   */
  static generateFieldMapping(sourceField: string, targetType: 'string' | 'number' | 'boolean' | 'array' | 'object' = 'string'): string {
    const baseExpression = `$json.${sourceField}`;
    
    switch (targetType) {
      case 'string':
        return `={{${baseExpression}.toString()}}`;
      case 'number':
        return `={{parseInt(${baseExpression}) || 0}}`;
      case 'boolean':
        return `={{!!${baseExpression}}}`;
      case 'array':
        return `={{Array.isArray(${baseExpression}) ? ${baseExpression} : [${baseExpression}]}}`;
      case 'object':
        return `={{typeof ${baseExpression} === 'object' ? ${baseExpression} : {value: ${baseExpression}}}}`;
      default:
        return `={{${baseExpression}}}`;
    }
  }
  
  /**
   * Generate expressions for data transformation
   */
  static generateTransformation(operation: string, field: string, value?: any): string {
    switch (operation) {
      case 'uppercase':
        return `={{$json.${field}.toUpperCase()}}`;
      case 'lowercase':
        return `={{$json.${field}.toLowerCase()}}`;
      case 'trim':
        return `={{$json.${field}.trim()}}`;
      case 'replace':
        return `={{$json.${field}.replace(${JSON.stringify(value.search)}, ${JSON.stringify(value.replace)})}}`;
      case 'concat':
        return `={{$json.${field} + ${JSON.stringify(value)}}}`;
      case 'default':
        return `={{$json.${field} || ${JSON.stringify(value)}}}`;
      case 'format_date':
        return `={{new Date($json.${field}).toISOString()}}`;
      case 'add_days':
        return `={{new Date(new Date($json.${field}).getTime() + ${value} * 24 * 60 * 60 * 1000).toISOString()}}`;
      default:
        return `={{$json.${field}}}`;
    }
  }
  
  /**
   * Generate expressions for common API scenarios
   */
  static generateAPIExpression(scenario: string, _context: Record<string, any> = {}): string {
    switch (scenario) {
      case 'authorization_header':
        return `={{"Bearer " + $json.access_token}}`;
      case 'user_agent':
        return '={{"n8n-workflow/" + $workflow.id}}';
      case 'timestamp_header':
        return '={{$now}}';
      case 'content_type_json':
        return '="application/json"';
      case 'query_string':
        return `={{Object.keys($json).map(k => k + "=" + encodeURIComponent($json[k])).join("&")}}`;
      case 'webhook_url':
        return `={{$execution.resumeUrl}}`;
      case 'pagination_offset':
        return `={{($json.page - 1) * $json.limit}}`;
      default:
        return '={{$json}}';
    }
  }
}

/**
 * Export commonly used expression constants
 */
export const COMMON_EXPRESSIONS = {
  // Timestamps
  NOW: '={{$now}}',
  TODAY: '={{$today}}',
  UNIX_TIMESTAMP: '={{Math.floor(Date.now() / 1000)}}',
  
  // Random values
  UUID: '={{$randomString(36)}}',
  SHORT_ID: '={{$randomString(8)}}',
  RANDOM_NUMBER: '={{Math.floor(Math.random() * 1000)}}',
  
  // Data access
  FIRST_ITEM: '={{$input.first()}}',
  ALL_ITEMS: '={{$input.all()}}',
  ITEM_COUNT: '={{$input.all().length}}',
  
  // Node references
  PREVIOUS_NODE_DATA: '={{$input.first().$json}}',
  HTTP_RESPONSE: '={{$("HTTP Request").first().$json}}',
  
  // Common transformations
  EMAIL_TO_LOWERCASE: '={{$json.email.toLowerCase()}}',
  NAME_TITLE_CASE: '={{$json.name.replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}}',
  PHONE_DIGITS_ONLY: '={{$json.phone.replace(/\\D/g, "")}}',
  
  // Error handling
  SAFE_STRING: '={{$json.value ? $json.value.toString() : ""}}',
  DEFAULT_EMAIL: '={{$json.email || "noreply@example.com"}}',
  DEFAULT_NAME: '={{$json.name || "Unknown User"}}',
  
  // API helpers
  BEARER_TOKEN: '={{"Bearer " + $json.token}}',
  JSON_CONTENT_TYPE: '="application/json"',
  FORM_CONTENT_TYPE: '="application/x-www-form-urlencoded"'
};

export default {
  ExpressionBuilder,
  ExpressionValidator,
  AIExpressionHelper,
  EXPRESSION_PATTERNS,
  COMMON_EXPRESSIONS
};
