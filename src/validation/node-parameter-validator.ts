/**
 * Comprehensive Node Parameter Validator
 * 
 * Provides detailed validation for n8n node parameters, including:
 * - Required parameter checking
 * - Type validation  
 * - Value constraint validation
 * - Conditional parameter validation
 * - Best practice recommendations
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { getAllAvailableNodes } from '../discovery/enhanced-discovery.js';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  score: number; // 0-100 validation score
}

export interface ValidationError {
  parameter: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface ValidationWarning {
  parameter: string;
  message: string;
  recommendation: string;
}

export interface ParameterDefinition {
  name: string;
  displayName: string;
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
  options?: Array<{ name: string; value?: any }>;
  placeholder?: string;
  typeOptions?: {
    multipleValues?: boolean;
    minValue?: number;
    maxValue?: number;
    numberPrecision?: number;
    rows?: number;
  };
  displayOptions?: {
    show?: { [key: string]: any[] };
    hide?: { [key: string]: any[] };
  };
}

export class NodeParameterValidator {
  private nodeDefinitions: Map<string, NodeTypeInfo> = new Map();
  
  constructor() {
    this.initializeNodeDefinitions();
  }

  private async initializeNodeDefinitions(): Promise<void> {
    try {
      const allNodes = await getAllAvailableNodes();
      allNodes.forEach(node => {
        this.nodeDefinitions.set(node.name, node);
      });
      console.log(`[NodeParameterValidator] Loaded ${allNodes.length} node definitions for validation`);
    } catch (error) {
      console.error('[NodeParameterValidator] Failed to load node definitions:', error);
    }
  }

  /**
   * Validate node parameters comprehensively
   */
  async validateNodeParameters(
    nodeType: string, 
    parameters: Record<string, any>
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Get node definition
    const nodeDefinition = this.nodeDefinitions.get(nodeType);
    if (!nodeDefinition) {
      errors.push({
        parameter: 'nodeType',
        message: `Unknown node type: ${nodeType}`,
        severity: 'error',
        suggestion: 'Use the discover_nodes tool to find valid node types'
      });
      return {
        valid: false,
        errors,
        warnings,
        suggestions,
        score: 0
      };
    }

    // Enhanced validation for specific node types
    await this.validateByNodeType(nodeType, parameters, errors, warnings, suggestions);
    
    // Validate parameters against node definition  
    if (nodeDefinition.properties) {
      for (const property of nodeDefinition.properties) {
        await this.validateParameter(property, parameters, errors, warnings, suggestions);
      }
    }

    // Check for unknown parameters
    this.validateUnknownParameters(nodeDefinition, parameters, warnings);

    // Generate best practice suggestions
    this.generateBestPractices(nodeType, parameters, suggestions);

    // Calculate validation score
    const score = this.calculateValidationScore(errors, warnings, suggestions);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score
    };
  }

  /**
   * Node-specific validation rules
   */
  private async validateByNodeType(
    nodeType: string,
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): Promise<void> {
    switch (nodeType) {
      case 'n8n-nodes-base.webhook':
        this.validateWebhookNode(parameters, errors, warnings, suggestions);
        break;
      
      case 'n8n-nodes-base.httpRequest':
        this.validateHttpRequestNode(parameters, errors, warnings, suggestions);
        break;
      
      case 'n8n-nodes-base.function':
        this.validateFunctionNode(parameters, errors, warnings, suggestions);
        break;
      
      case 'n8n-nodes-base.switch':
        this.validateSwitchNode(parameters, errors, warnings, suggestions);
        break;
      
      case 'n8n-nodes-base.set':
        this.validateSetNode(parameters, errors, warnings, suggestions);
        break;
      
      case 'n8n-nodes-base.scheduleTrigger':
        this.validateScheduleTriggerNode(parameters, errors, warnings, suggestions);
        break;

      default:
        // Generic validation for unknown node types
        this.validateGenericNode(parameters, errors, warnings, suggestions);
    }
  }

  /**
   * Validate individual parameter
   */
  private async validateParameter(
    paramDef: ParameterDefinition,
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): Promise<void> {
    const value = parameters[paramDef.name];
    
    // Required parameter check
    if (paramDef.required && (value === undefined || value === null || value === '')) {
      errors.push({
        parameter: paramDef.name,
        message: `Required parameter '${paramDef.displayName || paramDef.name}' is missing`,
        severity: 'error',
        suggestion: paramDef.description || `Set a value for ${paramDef.displayName || paramDef.name}`
      });
      return;
    }

    // Skip validation if parameter is not provided and not required
    if (value === undefined || value === null) {
      return;
    }

    // Type validation
    this.validateParameterType(paramDef, value, errors, warnings);

    // Options validation
    if (paramDef.options && paramDef.options.length > 0) {
      this.validateParameterOptions(paramDef, value, errors, warnings);
    }

    // Type-specific validation
    this.validateParameterConstraints(paramDef, value, errors, warnings);
  }

  /**
   * Validate parameter type
   */
  private validateParameterType(
    paramDef: ParameterDefinition,
    value: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const expectedType = paramDef.type;
    const actualType = typeof value;

    switch (expectedType) {
      case 'string':
        if (actualType !== 'string') {
          errors.push({
            parameter: paramDef.name,
            message: `Expected string, got ${actualType}`,
            severity: 'error'
          });
        }
        break;

      case 'number':
        if (actualType !== 'number' || isNaN(value)) {
          errors.push({
            parameter: paramDef.name,
            message: `Expected number, got ${actualType}`,
            severity: 'error'
          });
        }
        break;

      case 'boolean':
        if (actualType !== 'boolean') {
          errors.push({
            parameter: paramDef.name,
            message: `Expected boolean, got ${actualType}`,
            severity: 'error'
          });
        }
        break;

      case 'json':
      case 'object':
        if (actualType !== 'object' || Array.isArray(value)) {
          errors.push({
            parameter: paramDef.name,
            message: `Expected object, got ${actualType}`,
            severity: 'error'
          });
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push({
            parameter: paramDef.name,
            message: `Expected array, got ${actualType}`,
            severity: 'error'
          });
        }
        break;
    }
  }

  /**
   * Validate parameter options
   */
  private validateParameterOptions(
    paramDef: ParameterDefinition,
    value: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const validValues = paramDef.options!
      .map(opt => opt.value !== undefined ? opt.value : opt.name)
      .filter(val => val !== undefined);
    
    if (validValues.length > 0 && !validValues.includes(value)) {
      errors.push({
        parameter: paramDef.name,
        message: `Invalid value '${value}'. Valid options: ${validValues.join(', ')}`,
        severity: 'error',
        suggestion: `Use one of: ${validValues.join(', ')}`
      });
    }
  }

  /**
   * Validate parameter constraints
   */
  private validateParameterConstraints(
    paramDef: ParameterDefinition,
    value: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const typeOptions = paramDef.typeOptions;
    if (!typeOptions) return;

    // Number constraints
    if (paramDef.type === 'number') {
      if (typeOptions.minValue !== undefined && value < typeOptions.minValue) {
        errors.push({
          parameter: paramDef.name,
          message: `Value ${value} is below minimum ${typeOptions.minValue}`,
          severity: 'error'
        });
      }
      
      if (typeOptions.maxValue !== undefined && value > typeOptions.maxValue) {
        errors.push({
          parameter: paramDef.name,
          message: `Value ${value} exceeds maximum ${typeOptions.maxValue}`,
          severity: 'error'
        });
      }
    }

    // String length constraints
    if (paramDef.type === 'string' && typeof value === 'string') {
      if (value.length === 0 && paramDef.required) {
        warnings.push({
          parameter: paramDef.name,
          message: 'Empty string provided for required parameter',
          recommendation: 'Provide a meaningful value'
        });
      }
      
      if (value.length > 10000) {
        warnings.push({
          parameter: paramDef.name,
          message: 'Very long string value detected',
          recommendation: 'Consider using a shorter value for better performance'
        });
      }
    }
  }

  /**
   * Node-specific validation methods
   */
  private validateWebhookNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    // Validate webhook path
    if (parameters.path) {
      if (typeof parameters.path !== 'string') {
        errors.push({
          parameter: 'path',
          message: 'Webhook path must be a string',
          severity: 'error'
        });
      } else {
        // Check for valid path format
        if (parameters.path.includes(' ')) {
          warnings.push({
            parameter: 'path',
            message: 'Webhook path contains spaces',
            recommendation: 'Use hyphens or underscores instead of spaces'
          });
        }
        
        if (parameters.path.length > 100) {
          warnings.push({
            parameter: 'path',
            message: 'Very long webhook path',
            recommendation: 'Use shorter, more descriptive paths'
          });
        }
      }
    }

    // Validate HTTP method
    if (parameters.httpMethod) {
      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      if (!validMethods.includes(parameters.httpMethod)) {
        errors.push({
          parameter: 'httpMethod',
          message: `Invalid HTTP method: ${parameters.httpMethod}`,
          severity: 'error',
          suggestion: `Use one of: ${validMethods.join(', ')}`
        });
      }
    }

    suggestions.push('Consider adding authentication for webhook security');
    suggestions.push('Set appropriate response mode for your use case');
  }

  private validateHttpRequestNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    // Validate URL
    if (parameters.url) {
      if (typeof parameters.url !== 'string') {
        errors.push({
          parameter: 'url',
          message: 'URL must be a string',
          severity: 'error'
        });
      } else {
        try {
          new URL(parameters.url);
        } catch {
          errors.push({
            parameter: 'url',
            message: 'Invalid URL format',
            severity: 'error',
            suggestion: 'Provide a valid URL starting with http:// or https://'
          });
        }
      }
    }

    // Validate method
    if (parameters.method) {
      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
      if (!validMethods.includes(parameters.method)) {
        errors.push({
          parameter: 'method',
          message: `Invalid HTTP method: ${parameters.method}`,
          severity: 'error'
        });
      }
    }

    suggestions.push('Add appropriate timeout settings for reliability');
    suggestions.push('Consider adding retry logic for critical requests');
  }

  private validateFunctionNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    if (parameters.functionCode) {
      if (typeof parameters.functionCode !== 'string') {
        errors.push({
          parameter: 'functionCode',
          message: 'Function code must be a string',
          severity: 'error'
        });
      } else {
        // Basic JavaScript syntax validation
        try {
          new Function(parameters.functionCode);
        } catch (error) {
          errors.push({
            parameter: 'functionCode',
            message: `JavaScript syntax error: ${(error as Error).message}`,
            severity: 'error',
            suggestion: 'Fix JavaScript syntax errors'
          });
        }

        // Check for potential issues
        if (parameters.functionCode.includes('while(true)')) {
          warnings.push({
            parameter: 'functionCode',
            message: 'Infinite loop detected',
            recommendation: 'Avoid infinite loops as they can hang the workflow'
          });
        }

        if (parameters.functionCode.length > 5000) {
          warnings.push({
            parameter: 'functionCode',
            message: 'Very long function code',
            recommendation: 'Consider breaking down into smaller functions'
          });
        }
      }
    }

    suggestions.push('Use console.log() for debugging function behavior');
    suggestions.push('Handle errors gracefully with try-catch blocks');
  }

  private validateSwitchNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    if (parameters.conditions && parameters.conditions.conditions) {
      const conditions = parameters.conditions.conditions;
      
      if (!Array.isArray(conditions)) {
        errors.push({
          parameter: 'conditions',
          message: 'Conditions must be an array',
          severity: 'error'
        });
      } else if (conditions.length === 0) {
        warnings.push({
          parameter: 'conditions',
          message: 'No conditions defined',
          recommendation: 'Add at least one condition for the switch to be useful'
        });
      }

      // Validate each condition
      conditions.forEach((condition: any, index: number) => {
        if (!condition.leftValue) {
          warnings.push({
            parameter: `conditions[${index}].leftValue`,
            message: 'Empty left value in condition',
            recommendation: 'Specify a value or expression to compare'
          });
        }
        
        if (!condition.operator || !condition.operator.operation) {
          errors.push({
            parameter: `conditions[${index}].operator`,
            message: 'Missing operator in condition',
            severity: 'error'
          });
        }
      });
    }

    suggestions.push('Add a fallback output for unmatched conditions');
    suggestions.push('Use meaningful condition descriptions for clarity');
  }

  private validateSetNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    if (parameters.values) {
      const values = parameters.values;
      let hasValues = false;

      ['string', 'number', 'boolean'].forEach(type => {
        if (values[type] && Array.isArray(values[type]) && values[type].length > 0) {
          hasValues = true;
        }
      });

      if (!hasValues) {
        warnings.push({
          parameter: 'values',
          message: 'No values configured',
          recommendation: 'Add at least one value to set data'
        });
      }
    }

    suggestions.push('Use descriptive names for set values');
    suggestions.push('Consider using expressions for dynamic values');
  }

  private validateScheduleTriggerNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    if (parameters.rule && parameters.rule.interval) {
      const intervals = parameters.rule.interval;
      
      if (!Array.isArray(intervals) || intervals.length === 0) {
        errors.push({
          parameter: 'rule.interval',
          message: 'Schedule interval must be defined',
          severity: 'error'
        });
      }
    }

    suggestions.push('Consider timezone settings for scheduled workflows');
    suggestions.push('Test schedule triggers with appropriate intervals');
  }

  private validateGenericNode(
    parameters: Record<string, any>,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): void {
    // Generic validation for unknown node types
    if (Object.keys(parameters).length === 0) {
      warnings.push({
        parameter: 'general',
        message: 'No parameters configured',
        recommendation: 'Review node documentation for required parameters'
      });
    }

    suggestions.push('Refer to n8n documentation for node-specific configuration');
  }

  /**
   * Check for unknown parameters
   */
  private validateUnknownParameters(
    nodeDefinition: NodeTypeInfo,
    parameters: Record<string, any>,
    warnings: ValidationWarning[]
  ): void {
    const knownParams = new Set(
      nodeDefinition.properties?.map(p => p.name) || []
    );

    Object.keys(parameters).forEach(paramName => {
      if (!knownParams.has(paramName)) {
        warnings.push({
          parameter: paramName,
          message: `Unknown parameter '${paramName}'`,
          recommendation: 'Remove unknown parameters or check parameter name spelling'
        });
      }
    });
  }

  /**
   * Generate best practice suggestions
   */
  private generateBestPractices(
    nodeType: string,
    parameters: Record<string, any>,
    suggestions: string[]
  ): void {
    // Add general best practices
    suggestions.push('Use descriptive node names for better workflow readability');
    suggestions.push('Add error handling for critical workflow paths');
    
    // Node-specific best practices
    if (nodeType.includes('trigger')) {
      suggestions.push('Test trigger configurations before activating workflows');
    }
    
    if (nodeType.includes('http')) {
      suggestions.push('Implement proper authentication and rate limiting');
    }
  }

  /**
   * Calculate validation score (0-100)
   */
  private calculateValidationScore(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: string[]
  ): number {
    let score = 100;
    
    // Deduct points for errors
    score -= errors.length * 20;
    
    // Deduct points for warnings
    score -= warnings.length * 5;
    
    // Bonus points for having suggestions (shows thorough analysis)
    score += Math.min(suggestions.length * 2, 10);
    
    return Math.max(0, Math.min(100, score));
  }
}

// Export singleton instance
export const nodeParameterValidator = new NodeParameterValidator();