/**
 * Node Parameter Validator - Enhanced validation for node configurations
 * 
 * Provides comprehensive validation for n8n node parameters and configurations
 * with AI-friendly error messages and suggestions.
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { DiscoveredNode } from '../data/dynamic-node-registry.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  severity: 'error' | 'warning' | 'info';
}

export interface NodeParameterValidationOptions {
  strictMode?: boolean;
  checkRequired?: boolean;
  validateTypes?: boolean;
  suggestAlternatives?: boolean;
}

export class NodeParameterValidator {
  private static readonly REQUIRED_FIELDS = ['name', 'displayName', 'description'];
  private static readonly RECOMMENDED_FIELDS = ['version', 'category', 'properties'];
  
  /**
   * Validate a complete node configuration
   */
  static validateNodeConfiguration(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    options: NodeParameterValidationOptions = {}
  ): ValidationResult {
    const {
      strictMode = false,
      checkRequired = true,
      validateTypes = true,
      suggestAlternatives = true
    } = options;

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if node is null or undefined
    if (!node || typeof node !== 'object') {
      return {
        valid: false,
        errors: ['Node configuration must be a valid object'],
        warnings: [],
        suggestions: ['Provide a proper node configuration object with required fields'],
        severity: 'error'
      };
    }

    // Validate required fields
    if (checkRequired) {
      this.validateRequiredFields(node, errors, warnings);
    }

    // Validate field types
    if (validateTypes) {
      this.validateFieldTypes(node, errors, warnings);
    }

    // Check recommended fields
    this.validateRecommendedFields(node, warnings, suggestions);

    // Validate node properties if present
    if (node.properties && Array.isArray(node.properties)) {
      this.validateNodeProperties(node.properties, errors, warnings, suggestions);
    }

    // Validate inputs/outputs
    this.validateNodeConnections(node, warnings, suggestions);

    // Strict mode additional checks
    if (strictMode) {
      this.performStrictValidation(node, errors, warnings, suggestions);
    }

    // Generate suggestions for improvements
    if (suggestAlternatives) {
      this.generateImprovementSuggestions(node, suggestions);
    }

    const valid = errors.length === 0;
    const severity = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'info';

    return {
      valid,
      errors,
      warnings,
      suggestions,
      severity
    };
  }

  /**
   * Validate required fields
   */
  private static validateRequiredFields(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    errors: string[],
    warnings: string[]
  ): void {
    this.REQUIRED_FIELDS.forEach(field => {
      if (!node[field as keyof typeof node]) {
        if (field === 'name') {
          errors.push('Node name is required and must be unique');
        } else if (field === 'displayName') {
          warnings.push('Display name is recommended for better user experience');
        } else if (field === 'description') {
          warnings.push('Description is recommended to explain node functionality');
        }
      }
    });

    // Validate name format
    if (node.name && typeof node.name === 'string') {
      if (!node.name.match(/^[a-zA-Z0-9\-_.]+$/)) {
        errors.push('Node name should contain only alphanumeric characters, hyphens, dots, and underscores');
      }
      
      if (node.name.length < 3) {
        errors.push('Node name should be at least 3 characters long');
      }
      
      if (node.name.length > 100) {
        warnings.push('Node name is quite long, consider shortening for better readability');
      }
    }
  }

  /**
   * Validate field types
   */
  private static validateFieldTypes(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    errors: string[],
    warnings: string[]
  ): void {
    // Validate name type
    if (node.name && typeof node.name !== 'string') {
      errors.push('Node name must be a string');
    }

    // Validate displayName type
    if (node.displayName && typeof node.displayName !== 'string') {
      errors.push('Display name must be a string');
    }

    // Validate description type
    if (node.description && typeof node.description !== 'string') {
      errors.push('Description must be a string');
    }

    // Validate version
    if (node.version !== undefined) {
      if (typeof node.version !== 'number' || node.version < 1) {
        errors.push('Version must be a positive number');
      }
    }

    // Validate properties array
    if (node.properties && !Array.isArray(node.properties)) {
      errors.push('Properties must be an array');
    }

    // Validate boolean fields
    const booleanFields = ['triggerNode', 'regularNode', 'webhookSupport'];
    booleanFields.forEach(field => {
      const value = node[field as keyof typeof node];
      if (value !== undefined && typeof value !== 'boolean') {
        warnings.push(`${field} should be a boolean value`);
      }
    });
  }

  /**
   * Validate recommended fields
   */
  private static validateRecommendedFields(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    warnings: string[],
    suggestions: string[]
  ): void {
    // Check for recommended fields
    if (!node.version) {
      warnings.push('Version number is recommended for tracking changes');
      suggestions.push('Add a version number starting from 1');
    }

    if (!node.category) {
      warnings.push('Category helps organize nodes in the interface');
      suggestions.push('Add a category like "action", "trigger", "core", or "cluster"');
    }

    // Check for enhanced fields in DiscoveredNode
    const discoveredNode = node as Partial<DiscoveredNode>;
    if (discoveredNode.category) {
      if (!discoveredNode.useCases || discoveredNode.useCases.length === 0) {
        suggestions.push('Add use cases to help AI agents understand when to use this node');
      }

      if (!discoveredNode.searchTags || discoveredNode.searchTags.length === 0) {
        suggestions.push('Add search tags to improve node discoverability');
      }
    }
  }

  /**
   * Validate node properties
   */
  private static validateNodeProperties(
    properties: any[],
    errors: string[],
    warnings: string[],
    suggestions: string[]
  ): void {
    if (properties.length === 0) {
      warnings.push('Node has no properties defined');
      suggestions.push('Consider adding properties if the node needs configuration parameters');
      return;
    }

    properties.forEach((prop, index) => {
      if (!prop || typeof prop !== 'object') {
        errors.push(`Property at index ${index} must be an object`);
        return;
      }

      // Validate property name
      if (!prop.name) {
        errors.push(`Property at index ${index} must have a name`);
      } else if (typeof prop.name !== 'string') {
        errors.push(`Property name at index ${index} must be a string`);
      }

      // Validate property type
      if (!prop.type) {
        warnings.push(`Property '${prop.name || index}' should have a type specified`);
      }

      // Validate displayName
      if (!prop.displayName) {
        warnings.push(`Property '${prop.name || index}' should have a displayName for better UX`);
      }

      // Check for required properties without default values
      if (prop.required && prop.default === undefined) {
        suggestions.push(`Consider adding a default value for required property '${prop.name}'`);
      }
    });
  }

  /**
   * Validate node connections (inputs/outputs)
   */
  private static validateNodeConnections(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    warnings: string[],
    suggestions: string[]
  ): void {
    // Check inputs
    if (!node.inputs || !Array.isArray(node.inputs) || node.inputs.length === 0) {
      if (!node.triggerNode) {
        warnings.push('Non-trigger nodes should typically have at least one input');
        suggestions.push('Add an input definition for data flow');
      }
    }

    // Check outputs
    if (!node.outputs || !Array.isArray(node.outputs) || node.outputs.length === 0) {
      warnings.push('Node should typically have at least one output');
      suggestions.push('Add an output definition for data flow');
    }

    // Validate trigger node configuration
    if (node.triggerNode === true) {
      if (node.inputs && node.inputs.length > 0) {
        warnings.push('Trigger nodes typically do not have inputs');
      }
      
      if (!node.webhookSupport && !node.regularNode) {
        suggestions.push('Consider specifying webhook support or trigger type for trigger nodes');
      }
    }
  }

  /**
   * Perform strict validation
   */
  private static performStrictValidation(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    errors: string[],
    warnings: string[],
    suggestions: string[]
  ): void {
    // Strict description requirements
    if (node.description && node.description.length < 20) {
      warnings.push('Description should be more descriptive (at least 20 characters)');
    }

    // Strict naming conventions
    if (node.name && !node.name.includes('.')) {
      suggestions.push('Consider using namespaced names (e.g., "n8n-nodes-base.nodeName")');
    }

    // Check for common typos in field names
    const commonTypos: Record<string, string> = {
      'dispayName': 'displayName',
      'descripion': 'description',
      'porperties': 'properties',
      'triger': 'trigger'
    };

    Object.keys(node).forEach(key => {
      if (commonTypos[key]) {
        errors.push(`Possible typo: '${key}' should be '${commonTypos[key]}'`);
      }
    });
  }

  /**
   * Generate improvement suggestions
   */
  private static generateImprovementSuggestions(
    node: Partial<NodeTypeInfo | DiscoveredNode>,
    suggestions: string[]
  ): void {
    // Suggest authentication information
    const discoveredNode = node as Partial<DiscoveredNode>;
    if (discoveredNode.authRequired === undefined && node.name) {
      if (this.likelyRequiresAuth(node.name)) {
        suggestions.push('This node likely requires authentication - consider setting authRequired: true');
      }
    }

    // Suggest rate limiting information
    if (discoveredNode.rateLimit === undefined && node.name) {
      if (this.likelyHasRateLimit(node.name)) {
        suggestions.push('This service likely has rate limits - consider setting rateLimit: true');
      }
    }

    // Suggest complexity assessment
    if (discoveredNode.integrationComplexity === undefined) {
      suggestions.push('Consider setting integration complexity (simple/medium/complex) to help users');
    }

    // Suggest AI description
    if (!discoveredNode.aiDescription && node.description) {
      suggestions.push('Consider adding an AI-friendly description for better agent understanding');
    }
  }

  /**
   * Check if a node likely requires authentication
   */
  private static likelyRequiresAuth(nodeName: string): boolean {
    const authServices = [
      'github', 'gitlab', 'slack', 'discord', 'google', 'microsoft',
      'salesforce', 'hubspot', 'stripe', 'paypal', 'twitter', 'facebook'
    ];
    
    return authServices.some(service => 
      nodeName.toLowerCase().includes(service)
    );
  }

  /**
   * Check if a service likely has rate limits
   */
  private static likelyHasRateLimit(nodeName: string): boolean {
    const rateLimitedServices = [
      'twitter', 'github', 'openai', 'google', 'salesforce', 'stripe'
    ];
    
    return rateLimitedServices.some(service => 
      nodeName.toLowerCase().includes(service)
    );
  }

  /**
   * Validate a workflow configuration
   */
  static validateWorkflow(workflow: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!workflow || typeof workflow !== 'object') {
      return {
        valid: false,
        errors: ['Workflow must be an object'],
        warnings: [],
        suggestions: ['Provide a valid workflow configuration'],
        severity: 'error'
      };
    }

    // Check required workflow fields
    if (!workflow.nodes) {
      errors.push('Workflow must have nodes');
    } else if (!Array.isArray(workflow.nodes)) {
      errors.push('Workflow nodes must be an array');
    } else if (workflow.nodes.length === 0) {
      warnings.push('Workflow has no nodes');
    }

    // Validate connections
    if (!workflow.connections) {
      warnings.push('Workflow should define connections between nodes');
    }

    // Validate version
    if (!workflow.version) {
      warnings.push('Workflow should have a version number');
      suggestions.push('Add version: 1 to your workflow configuration');
    }

    const valid = errors.length === 0;
    const severity = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'info';

    return {
      valid,
      errors,
      warnings,
      suggestions,
      severity
    };
  }

  /**
   * Get validation summary for reporting
   */
  static getValidationSummary(results: ValidationResult[]): string {
    const totalNodes = results.length;
    const validNodes = results.filter(r => r.valid).length;
    const errorNodes = results.filter(r => r.errors.length > 0).length;
    const warningNodes = results.filter(r => r.warnings.length > 0).length;

    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const totalSuggestions = results.reduce((sum, r) => sum + r.suggestions.length, 0);

    return `
📊 Node Validation Summary
═══════════════════════════

✅ Valid Nodes: ${validNodes}/${totalNodes} (${((validNodes/totalNodes)*100).toFixed(1)}%)
❌ Nodes with Errors: ${errorNodes}
⚠️  Nodes with Warnings: ${warningNodes}

📋 Issue Breakdown:
   • Total Errors: ${totalErrors}
   • Total Warnings: ${totalWarnings}
   • Total Suggestions: ${totalSuggestions}

${validNodes === totalNodes ? '🎉 All nodes passed validation!' : '🔧 Some nodes need attention'}
═══════════════════════════
`;
  }
}

export default NodeParameterValidator;
