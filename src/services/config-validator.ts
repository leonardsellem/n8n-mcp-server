/**
 * Configuration Validator Service
 * 
 * Validates node configurations to catch errors before execution.
 * Provides helpful suggestions and identifies missing or misconfigured properties.
 */

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  visibleProperties: string[];
  hiddenProperties: string[];
  autofix?: Record<string, any>;
}

export interface ValidationError {
  type: 'missing_required' | 'invalid_type' | 'invalid_value' | 'incompatible';
  property: string;
  message: string;
  fix?: string;
}

export interface ValidationWarning {
  type: 'missing_common' | 'deprecated' | 'inefficient' | 'security';
  property?: string;
  message: string;
  suggestion?: string;
}

export class ConfigValidator {
  /**
   * Validate a node configuration
   */
  static validate(
    nodeType: string, 
    config: Record<string, any>, 
    properties: any[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];
    const visibleProperties: string[] = [];
    const hiddenProperties: string[] = [];
    const autofix: Record<string, any> = {};
    
    // Check required properties
    this.checkRequiredProperties(properties, config, errors);
    
    // Check property visibility
    const { visible, hidden } = this.getPropertyVisibility(properties, config);
    visibleProperties.push(...visible);
    hiddenProperties.push(...hidden);
    
    // Validate property types and values
    this.validatePropertyTypes(properties, config, errors);
    
    // Node-specific validations
    this.performNodeSpecificValidation(nodeType, config, errors, warnings, suggestions, autofix);
    
    // Check for common issues
    this.checkCommonIssues(nodeType, config, properties, warnings, suggestions);
    
    // Security checks
    this.performSecurityChecks(nodeType, config, warnings);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      visibleProperties,
      hiddenProperties,
      autofix: Object.keys(autofix).length > 0 ? autofix : undefined
    };
  }
  
  /**
   * Check for missing required properties
   */
  private static checkRequiredProperties(
    properties: any[], 
    config: Record<string, any>, 
    errors: ValidationError[]
  ): void {
    for (const prop of properties) {
      if (prop.required && !(prop.name in config)) {
        errors.push({
          type: 'missing_required',
          property: prop.name,
          message: `Required property '${prop.displayName || prop.name}' is missing`,
          fix: `Add ${prop.name} to your configuration`
        });
      }
    }
  }
  
  /**
   * Get visible and hidden properties based on displayOptions
   */
  private static getPropertyVisibility(
    properties: any[], 
    config: Record<string, any>
  ): { visible: string[]; hidden: string[] } {
    const visible: string[] = [];
    const hidden: string[] = [];
    
    for (const prop of properties) {
      if (this.isPropertyVisible(prop, config)) {
        visible.push(prop.name);
      } else {
        hidden.push(prop.name);
      }
    }
    
    return { visible, hidden };
  }
  
  /**
   * Check if a property is visible given current config
   */
  protected static isPropertyVisible(prop: any, config: Record<string, any>): boolean {
    if (!prop.displayOptions) return true;
    
    // Check show conditions
    if (prop.displayOptions.show) {
      for (const [key, values] of Object.entries(prop.displayOptions.show)) {
        const configValue = config[key];
        const expectedValues = Array.isArray(values) ? values : [values];
        
        if (!expectedValues.includes(configValue)) {
          return false;
        }
      }
    }
    
    // Check hide conditions
    if (prop.displayOptions.hide) {
      for (const [key, values] of Object.entries(prop.displayOptions.hide)) {
        const configValue = config[key];
        const expectedValues = Array.isArray(values) ? values : [values];
        
        if (expectedValues.includes(configValue)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Validate property types and values
   */
  private static validatePropertyTypes(
    properties: any[], 
    config: Record<string, any>, 
    errors: ValidationError[]
  ): void {
    for (const [key, value] of Object.entries(config)) {
      const prop = properties.find(p => p.name === key);
      if (!prop) continue;
      
      // Type validation
      if (prop.type === 'string' && typeof value !== 'string') {
        errors.push({
          type: 'invalid_type',
          property: key,
          message: `Property '${key}' must be a string, got ${typeof value}`,
          fix: `Change ${key} to a string value`
        });
      } else if (prop.type === 'number' && typeof value !== 'number') {
        errors.push({
          type: 'invalid_type',
          property: key,
          message: `Property '${key}' must be a number, got ${typeof value}`,
          fix: `Change ${key} to a number`
        });
      } else if (prop.type === 'boolean' && typeof value !== 'boolean') {
        errors.push({
          type: 'invalid_type',
          property: key,
          message: `Property '${key}' must be a boolean, got ${typeof value}`,
          fix: `Change ${key} to true or false`
        });
      }
      
      // Options validation
      if (prop.type === 'options' && prop.options) {
        const validValues = prop.options.map((opt: any) => 
          typeof opt === 'string' ? opt : opt.value
        );
        
        if (!validValues.includes(value)) {
          errors.push({
            type: 'invalid_value',
            property: key,
            message: `Invalid value for '${key}'. Must be one of: ${validValues.join(', ')}`,
            fix: `Change ${key} to one of the valid options`
          });
        }
      }
    }
  }
  
  /**
   * Perform node-specific validation
   */
  private static performNodeSpecificValidation(
    nodeType: string,
    config: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[],
    autofix: Record<string, any>
  ): void {
    switch (nodeType) {
      case 'nodes-base.httpRequest':
        this.validateHttpRequest(config, errors, warnings, suggestions, autofix);
        break;
      
      case 'nodes-base.webhook':
        this.validateWebhook(config, warnings, suggestions);
        break;
        
      case 'nodes-base.postgres':
      case 'nodes-base.mysql':
        this.validateDatabase(config, warnings, suggestions);
        break;
        
      case 'nodes-base.code':
        this.validateCode(config, errors, warnings);
        break;
    }
  }
  
  /**
   * Validate HTTP Request configuration
   */
  private static validateHttpRequest(
    config: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[],
    autofix: Record<string, any>
  ): void {
    // URL validation
    if (config.url && typeof config.url === 'string') {
      if (!config.url.startsWith('http://') && !config.url.startsWith('https://')) {
        errors.push({
          type: 'invalid_value',
          property: 'url',
          message: 'URL must start with http:// or https://',
          fix: 'Add https:// to the beginning of your URL'
        });
      }
    }
    
    // POST/PUT/PATCH without body
    if (['POST', 'PUT', 'PATCH'].includes(config.method) && !config.sendBody) {
      warnings.push({
        type: 'missing_common',
        property: 'sendBody',
        message: `${config.method} requests typically send a body`,
        suggestion: 'Set sendBody=true and configure the body content'
      });
      
      autofix.sendBody = true;
      autofix.contentType = 'json';
    }
    
    // Authentication warnings
    if (!config.authentication || config.authentication === 'none') {
      if (config.url?.includes('api.') || config.url?.includes('/api/')) {
        warnings.push({
          type: 'security',
          message: 'API endpoints typically require authentication',
          suggestion: 'Consider setting authentication if the API requires it'
        });
      }
    }
    
    // JSON body validation
    if (config.sendBody && config.contentType === 'json' && config.jsonBody) {
      try {
        JSON.parse(config.jsonBody);
      } catch (e) {
        errors.push({
          type: 'invalid_value',
          property: 'jsonBody',
          message: 'jsonBody contains invalid JSON',
          fix: 'Ensure jsonBody contains valid JSON syntax'
        });
      }
    }
  }
  
  /**
   * Validate Webhook configuration
   */
  private static validateWebhook(
    config: Record<string, any>,
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    // Basic webhook validation - moved detailed validation to NodeSpecificValidators
    if (config.responseMode === 'responseNode' && !config.responseData) {
      suggestions.push('When using responseMode=responseNode, add a "Respond to Webhook" node to send custom responses');
    }
  }
  
  /**
   * Validate database queries
   */
  private static validateDatabase(
    config: Record<string, any>,
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    if (config.query) {
      const query = config.query.toLowerCase();
      
      // SQL injection warning
      if (query.includes('${') || query.includes('{{')) {
        warnings.push({
          type: 'security',
          message: 'Query contains template expressions that might be vulnerable to SQL injection',
          suggestion: 'Use parameterized queries with additionalFields.queryParams instead'
        });
      }
      
      // DELETE without WHERE
      if (query.includes('delete') && !query.includes('where')) {
        warnings.push({
          type: 'security',
          message: 'DELETE query without WHERE clause will delete all records',
          suggestion: 'Add a WHERE clause to limit the deletion'
        });
      }
      
      // SELECT * warning
      if (query.includes('select *')) {
        suggestions.push('Consider selecting specific columns instead of * for better performance');
      }
    }
  }
  
  /**
   * Validate Code node
   */
  private static validateCode(
    config: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const codeField = config.language === 'python' ? 'pythonCode' : 'jsCode';
    const code = config[codeField];
    
    if (!code || code.trim() === '') {
      errors.push({
        type: 'missing_required',
        property: codeField,
        message: 'Code cannot be empty',
        fix: 'Add your code logic'
      });
      return;
    }
    
    // Security checks
    if (code?.includes('eval(') || code?.includes('exec(')) {
      warnings.push({
        type: 'security',
        message: 'Code contains eval/exec which can be a security risk',
        suggestion: 'Avoid using eval/exec with untrusted input'
      });
    }
    
    // Basic syntax validation
    if (config.language === 'python') {
      this.validatePythonSyntax(code, errors, warnings);
    } else {
      this.validateJavaScriptSyntax(code, errors, warnings);
    }
    
    // n8n-specific patterns
    this.validateN8nCodePatterns(code, config.language || 'javascript', warnings);
  }
  
  /**
   * Check for common configuration issues
   */
  private static checkCommonIssues(
    _nodeType: string,
    config: Record<string, any>,
    properties: any[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    // Check for properties that won't be used
    const visibleProps = properties.filter(p => this.isPropertyVisible(p, config));
    const configuredKeys = Object.keys(config);
    
    for (const key of configuredKeys) {
      // Skip internal properties that are always present
      if (key === '@version' || key.startsWith('_')) {
        continue;
      }
      
      if (!visibleProps.find(p => p.name === key)) {
        warnings.push({
          type: 'inefficient',
          property: key,
          message: `Property '${key}' is configured but won't be used due to current settings`,
          suggestion: 'Remove this property or adjust other settings to make it visible'
        });
      }
    }
    
    // Suggest commonly used properties
    const commonProps = ['authentication', 'errorHandling', 'timeout'];
    for (const prop of commonProps) {
      const propDef = properties.find(p => p.name === prop);
      if (propDef && this.isPropertyVisible(propDef, config) && !(prop in config)) {
        suggestions.push(`Consider setting '${prop}' for better control`);
      }
    }
  }
  
  /**
   * Perform security checks
   */
  private static performSecurityChecks(
    nodeType: string,
    config: Record<string, any>,
    warnings: ValidationWarning[]
  ): void {
    // Check for hardcoded credentials
    const sensitivePatterns = [
      /api[_-]?key/i,
      /password/i,
      /secret/i,
      /token/i,
      /credential/i
    ];
    
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        for (const pattern of sensitivePatterns) {
          if (pattern.test(key) && value.length > 0 && !value.includes('{{')) {
            warnings.push({
              type: 'security',
              property: key,
              message: `Hardcoded ${key} detected`,
              suggestion: 'Use n8n credentials or expressions instead of hardcoding sensitive values'
            });
            break;
          }
        }
      }
    }
  }
  
  /**
   * Basic JavaScript syntax validation
   */
  private static validateJavaScriptSyntax(
    code: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check for common syntax errors
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        type: 'invalid_value',
        property: 'jsCode',
        message: 'Unbalanced braces detected',
        fix: 'Check that all { have matching }'
      });
    }
    
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        type: 'invalid_value',
        property: 'jsCode',
        message: 'Unbalanced parentheses detected',
        fix: 'Check that all ( have matching )'
      });
    }
    
    // Check for unterminated strings
    const stringMatches = code.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g) || [];
    const quotesInStrings = stringMatches.join('').match(/["'`]/g)?.length || 0;
    const totalQuotes = (code.match(/["'`]/g) || []).length;
    if ((totalQuotes - quotesInStrings) % 2 !== 0) {
      warnings.push({
        type: 'inefficient',
        message: 'Possible unterminated string detected',
        suggestion: 'Check that all strings are properly closed'
      });
    }
  }
  
  /**
   * Basic Python syntax validation
   */
  private static validatePythonSyntax(
    code: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check indentation consistency
    const lines = code.split('\n');
    const indentTypes = new Set<string>();
    
    lines.forEach(line => {
      const indent = line.match(/^(\s+)/);
      if (indent) {
        if (indent[1].includes('\t')) indentTypes.add('tabs');
        if (indent[1].includes(' ')) indentTypes.add('spaces');
      }
    });
    
    if (indentTypes.size > 1) {
      errors.push({
        type: 'invalid_value',
        property: 'pythonCode',
        message: 'Mixed tabs and spaces in indentation',
        fix: 'Use either tabs or spaces consistently, not both'
      });
    }
    
    // Check for colons after control structures
    const controlStructures = /^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\s+.*[^:]\s*$/gm;
    if (controlStructures.test(code)) {
      warnings.push({
        type: 'inefficient',
        message: 'Missing colon after control structure',
        suggestion: 'Add : at the end of if/for/def/class statements'
      });
    }
  }
  
  /**
   * Validate n8n-specific code patterns
   */
  private static validateN8nCodePatterns(
    code: string,
    language: string,
    warnings: ValidationWarning[]
  ): void {
    // Check for return statement
    const hasReturn = language === 'python' 
      ? /return\s+/.test(code)
      : /return\s+/.test(code);
    
    if (!hasReturn) {
      warnings.push({
        type: 'missing_common',
        message: 'No return statement found',
        suggestion: 'Code node should return data for the next node. Add: return items (Python) or return items; (JavaScript)'
      });
    }
    
    // Check for common n8n patterns
    if (language === 'javascript') {
      if (!code.includes('items') && !code.includes('$input')) {
        warnings.push({
          type: 'missing_common',
          message: 'Code doesn\'t reference input items',
          suggestion: 'Access input data with: items or $input.all()'
        });
      }
    } else if (language === 'python') {
      if (!code.includes('items') && !code.includes('_input')) {
        warnings.push({
          type: 'missing_common',
          message: 'Code doesn\'t reference input items',
          suggestion: 'Access input data with: items variable'
        });
      }
    }
  }
}