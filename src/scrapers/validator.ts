/**
 * Data Validation Schema
 * 
 * Validates scraped data quality and format compliance using
 * existing patterns from the project.
 */

import { NodeTypeInfo } from '../data/accurate-massive-registry.js';
import { RawNodeData, ValidationResult } from './interfaces.js';
import { QUALITY_THRESHOLDS, VALIDATION_RULES } from './config.js';

/**
 * Comprehensive data validator for scraped nodes
 */
export class NodeValidator {

  /**
   * Validate a single NodeTypeInfo object
   */
  validateNode(node: NodeTypeInfo): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Required field validation
    const requiredFields = this.validateRequiredFields(node);
    errors.push(...requiredFields.errors);
    warnings.push(...requiredFields.warnings);
    score -= requiredFields.penalty;

    // Data quality validation
    const qualityCheck = this.validateDataQuality(node);
    errors.push(...qualityCheck.errors);
    warnings.push(...qualityCheck.warnings);
    score -= qualityCheck.penalty;

    // Structure validation
    const structureCheck = this.validateStructure(node);
    errors.push(...structureCheck.errors);
    warnings.push(...structureCheck.warnings);
    score -= structureCheck.penalty;

    // Node type specific validation
    const typeCheck = this.validateNodeType(node);
    errors.push(...typeCheck.errors);
    warnings.push(...typeCheck.warnings);
    score -= typeCheck.penalty;

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Validate multiple nodes in batch
   */
  validateBatch(nodes: NodeTypeInfo[]): ValidationResult[] {
    return nodes.map(node => this.validateNode(node));
  }

  /**
   * Validate raw scraped data before transformation
   */
  validateRawData(rawData: RawNodeData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Basic data presence
    if (!rawData.name) {
      errors.push('Missing node name');
      score -= 25;
    }

    if (!rawData.displayName) {
      errors.push('Missing display name');
      score -= 20;
    }

    if (!rawData.description || rawData.description.length < QUALITY_THRESHOLDS.minDescriptionLength) {
      errors.push('Insufficient description');
      score -= 15;
    }

    if (!rawData.category) {
      errors.push('Missing category');
      score -= 10;
    }

    // Content quality
    if (!rawData.rawContent || rawData.rawContent.length < 100) {
      warnings.push('Limited raw content extracted');
      score -= 10;
    }

    if (!rawData.operations || rawData.operations.length === 0) {
      warnings.push('No operations found');
      score -= 15;
    }

    if (!rawData.examples || rawData.examples.length === 0) {
      warnings.push('No examples found');
      score -= 5;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Validate required fields
   */
  private validateRequiredFields(node: NodeTypeInfo): { errors: string[]; warnings: string[]; penalty: number } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let penalty = 0;

    if (!node.name) {
      errors.push('Missing node name');
      penalty += 25;
    } else if (!node.name.startsWith('n8n-nodes-base.')) {
      warnings.push('Node name should follow n8n naming convention');
      penalty += 5;
    }

    if (!node.displayName) {
      errors.push('Missing display name');
      penalty += 20;
    }

    if (!node.description) {
      errors.push('Missing description');
      penalty += 15;
    } else if (node.description.length < QUALITY_THRESHOLDS.minDescriptionLength) {
      errors.push('Description too short');
      penalty += 10;
    }

    if (!node.category) {
      errors.push('Missing category');
      penalty += 10;
    }

    if (!node.properties || node.properties.length === 0) {
      errors.push('Missing properties');
      penalty += 15;
    }

    if (!node.inputs) {
      errors.push('Missing inputs definition');
      penalty += 10;
    }

    if (!node.outputs) {
      errors.push('Missing outputs definition');
      penalty += 10;
    }

    return { errors, warnings, penalty };
  }

  /**
   * Validate data quality
   */
  private validateDataQuality(node: NodeTypeInfo): { errors: string[]; warnings: string[]; penalty: number } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let penalty = 0;

    // Description quality
    if (node.description === 'Integration node for workflow automation') {
      warnings.push('Using generic description');
      penalty += 5;
    }

    if (node.description && node.description.length > 1000) {
      warnings.push('Description might be too long');
      penalty += 2;
    }

    // Properties quality
    if (node.properties && node.properties.length < QUALITY_THRESHOLDS.minParameterCount) {
      warnings.push('Very few properties defined');
      penalty += 5;
    }

    // Check for duplicate properties
    if (node.properties) {
      const propertyNames = node.properties.map(p => p.name);
      const uniqueNames = new Set(propertyNames);
      if (propertyNames.length !== uniqueNames.size) {
        errors.push('Duplicate property names found');
        penalty += 15;
      }
    }

    // Node type consistency
    if (node.triggerNode && node.regularNode) {
      errors.push('Node cannot be both trigger and regular');
      penalty += 20;
    }

    if (!node.triggerNode && !node.regularNode) {
      warnings.push('Node type not clearly defined');
      penalty += 5;
    }

    return { errors, warnings, penalty };
  }

  /**
   * Validate structure
   */
  private validateStructure(node: NodeTypeInfo): { errors: string[]; warnings: string[]; penalty: number } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let penalty = 0;

    // Properties structure
    if (node.properties) {
      for (const prop of node.properties) {
        if (!prop.name) {
          errors.push('Property missing name');
          penalty += 5;
        }

        if (!prop.displayName) {
          errors.push('Property missing display name');
          penalty += 3;
        }

        if (!prop.type) {
          errors.push('Property missing type');
          penalty += 5;
        }

        if (prop.required === undefined) {
          warnings.push('Property missing required flag');
          penalty += 1;
        }
      }
    }

    // Inputs structure
    if (node.inputs) {
      for (const input of node.inputs) {
        if (!input.type) {
          errors.push('Input missing type');
          penalty += 3;
        }

        if (!input.displayName) {
          errors.push('Input missing display name');
          penalty += 2;
        }
      }
    }

    // Outputs structure
    if (node.outputs) {
      for (const output of node.outputs) {
        if (!output.type) {
          errors.push('Output missing type');
          penalty += 3;
        }

        if (!output.displayName) {
          errors.push('Output missing display name');
          penalty += 2;
        }
      }
    }

    return { errors, warnings, penalty };
  }

  /**
   * Validate node type specific rules
   */
  private validateNodeType(node: NodeTypeInfo): { errors: string[]; warnings: string[]; penalty: number } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let penalty = 0;

    if (node.triggerNode) {
      // Trigger node validation
      const rules = VALIDATION_RULES.trigger;
      
      if (node.inputs && node.inputs.length > 0) {
        warnings.push('Trigger nodes typically have no inputs');
        penalty += 3;
      }

      if (node.description.length < rules.minDescriptionLength) {
        warnings.push('Trigger node description should be more detailed');
        penalty += 5;
      }

    } else if (node.regularNode) {
      // Regular node validation
      const rules = VALIDATION_RULES.regular;
      
      if (!node.inputs || node.inputs.length === 0) {
        warnings.push('Regular nodes typically have inputs');
        penalty += 5;
      }

      if (node.description.length < rules.minDescriptionLength) {
        warnings.push('Regular node description should be more detailed');
        penalty += 3;
      }
    }

    // Core node validation
    if (node.name.includes('function') || node.name.includes('code')) {
      if (!node.codeable) {
        warnings.push('Code-related nodes should have codeable flag');
        penalty += 3;
      }
    }

    return { errors, warnings, penalty };
  }

  /**
   * Get validation statistics for a batch
   */
  getValidationStats(results: ValidationResult[]): any {
    const total = results.length;
    const valid = results.filter(r => r.valid).length;
    const invalid = total - valid;
    
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / total;
    
    const errorCounts: Record<string, number> = {};
    const warningCounts: Record<string, number> = {};
    
    results.forEach(result => {
      result.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
      
      result.warnings.forEach(warning => {
        warningCounts[warning] = (warningCounts[warning] || 0) + 1;
      });
    });

    const scoreDistribution = {
      excellent: results.filter(r => r.score >= 90).length,
      good: results.filter(r => r.score >= 70 && r.score < 90).length,
      fair: results.filter(r => r.score >= 50 && r.score < 70).length,
      poor: results.filter(r => r.score < 50).length
    };

    return {
      total,
      valid,
      invalid,
      validationRate: valid / total,
      averageScore: Math.round(averageScore),
      scoreDistribution,
      topErrors: Object.entries(errorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([error, count]) => ({ error, count })),
      topWarnings: Object.entries(warningCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([warning, count]) => ({ warning, count }))
    };
  }

  /**
   * Validate against existing catalog for consistency
   */
  validateConsistency(newNodes: NodeTypeInfo[], existingNodes: NodeTypeInfo[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check for naming conflicts
    const existingNames = new Set(existingNodes.map(n => n.name));
    const newNames = newNodes.map(n => n.name);
    const duplicates = newNames.filter(name => existingNames.has(name));
    
    if (duplicates.length > 0) {
      warnings.push(`Found ${duplicates.length} duplicate node names`);
      score -= duplicates.length * 2;
    }

    // Check category consistency
    const existingCategories = new Set(existingNodes.map(n => n.category));
    const newCategories = new Set(newNodes.map(n => n.category));
    const unknownCategories = [...newCategories].filter(cat => !existingCategories.has(cat));
    
    if (unknownCategories.length > 0) {
      warnings.push(`Found ${unknownCategories.length} new categories: ${unknownCategories.join(', ')}`);
      score -= unknownCategories.length * 3;
    }

    // Check for structural consistency
    const avgPropertiesExisting = existingNodes.reduce((sum, n) => sum + n.properties.length, 0) / existingNodes.length;
    const avgPropertiesNew = newNodes.reduce((sum, n) => sum + n.properties.length, 0) / newNodes.length;
    
    if (Math.abs(avgPropertiesExisting - avgPropertiesNew) > 5) {
      warnings.push('Significant difference in average property count compared to existing nodes');
      score -= 5;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Generate validation report
   */
  generateReport(results: ValidationResult[], nodes: NodeTypeInfo[]): string {
    const stats = this.getValidationStats(results);
    
    let report = `# Node Validation Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += `## Summary\n`;
    report += `- Total nodes validated: ${stats.total}\n`;
    report += `- Valid nodes: ${stats.valid} (${Math.round(stats.validationRate * 100)}%)\n`;
    report += `- Invalid nodes: ${stats.invalid}\n`;
    report += `- Average quality score: ${stats.averageScore}/100\n\n`;
    
    report += `## Score Distribution\n`;
    report += `- Excellent (90-100): ${stats.scoreDistribution.excellent}\n`;
    report += `- Good (70-89): ${stats.scoreDistribution.good}\n`;
    report += `- Fair (50-69): ${stats.scoreDistribution.fair}\n`;
    report += `- Poor (<50): ${stats.scoreDistribution.poor}\n\n`;
    
    if (stats.topErrors.length > 0) {
      report += `## Top Errors\n`;
      stats.topErrors.forEach(({ error, count }: { error: string; count: number }) => {
        report += `- ${error}: ${count} occurrences\n`;
      });
      report += `\n`;
    }
    
    if (stats.topWarnings.length > 0) {
      report += `## Top Warnings\n`;
      stats.topWarnings.forEach(({ warning, count }: { warning: string; count: number }) => {
        report += `- ${warning}: ${count} occurrences\n`;
      });
      report += `\n`;
    }
    
    // Sample of invalid nodes
    const invalidNodes = results
      .map((result, index) => ({ result, node: nodes[index] }))
      .filter(({ result }) => !result.valid)
      .slice(0, 5);
    
    if (invalidNodes.length > 0) {
      report += `## Sample Invalid Nodes\n`;
      invalidNodes.forEach(({ result, node }, index) => {
        report += `### ${index + 1}. ${node.displayName}\n`;
        report += `Score: ${result.score}/100\n`;
        result.errors.forEach(error => {
          report += `- Error: ${error}\n`;
        });
        report += `\n`;
      });
    }
    
    return report;
  }
}