/**
 * Lightweight Node Validator for MCP Server
 * Validates nodes at runtime without heavy processing
 */

import { NodeTypeInfo } from '../data/node-types.js';

export class NodeValidator {
  private static cache = new Map<string, boolean>();
  
  /**
   * Quick validation of node structure
   */
  static validateNode(node: NodeTypeInfo): { valid: boolean; issues: string[] } {
    const cacheKey = node.name;
    
    if (this.cache.has(cacheKey)) {
      return { valid: this.cache.get(cacheKey)!, issues: [] };
    }
    
    const issues: string[] = [];
    
    // Essential checks only
    if (!node.name) issues.push('Missing name');
    if (!node.displayName) issues.push('Missing displayName');
    if (!node.description) issues.push('Missing description');
    if (!node.category) issues.push('Missing category');
    if (!Array.isArray(node.properties)) issues.push('Invalid properties');
    if (!Array.isArray(node.inputs)) issues.push('Invalid inputs');
    if (!Array.isArray(node.outputs)) issues.push('Invalid outputs');
    
    const valid = issues.length === 0;
    this.cache.set(cacheKey, valid);
    
    return { valid, issues };
  }
  
  /**
   * Batch validate multiple nodes efficiently
   */
  static validateBatch(nodes: NodeTypeInfo[]): {
    validCount: number;
    invalidCount: number;
    invalidNodes: string[];
  } {
    let validCount = 0;
    let invalidCount = 0;
    const invalidNodes: string[] = [];
    
    for (const node of nodes) {
      const result = this.validateNode(node);
      if (result.valid) {
        validCount++;
      } else {
        invalidCount++;
        invalidNodes.push(node.name || 'unknown');
      }
    }
    
    return { validCount, invalidCount, invalidNodes };
  }
  
  /**
   * Clear validation cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? 1.0 : 0.0 // Simplified for lightweight implementation
    };
  }
}