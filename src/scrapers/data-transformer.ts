/**
 * Data Transformer
 * 
 * Transforms raw scraped data into the structured NodeInfo format
 * used by the existing n8n MCP server.
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { RawNodeData, TransformationResult, ValidationResult } from './interfaces.js';

/**
 * Transforms raw scraped data into NodeTypeInfo objects
 */
export class DataTransformer {
  
  /**
   * Transform raw node data into NodeTypeInfo format
   */
  transform(rawData: RawNodeData): TransformationResult {
    try {
      const nodeInfo = this.convertToNodeInfo(rawData);
      const validation = this.validateTransformation(nodeInfo, rawData);
      
      return {
        success: validation.valid,
        nodeInfo: validation.valid ? nodeInfo : undefined,
        errors: validation.errors,
        warnings: validation.warnings,
        rawData
      };
      
    } catch (error) {
      return {
        success: false,
        errors: [`Transformation failed: ${error}`],
        warnings: [],
        rawData
      };
    }
  }

  /**
   * Transform multiple raw nodes in batch
   */
  transformBatch(rawDataArray: RawNodeData[]): TransformationResult[] {
    const results: TransformationResult[] = [];
    
    for (const rawData of rawDataArray) {
      results.push(this.transform(rawData));
    }
    
    return results;
  }

  /**
   * Convert RawNodeData to NodeTypeInfo
   */
  private convertToNodeInfo(raw: RawNodeData): NodeTypeInfo {
    return {
      name: this.generateNodeName(raw),
      displayName: raw.displayName || raw.name,
      description: this.processDescription(raw.description),
      category: this.mapCategory(raw.category),
      subcategory: raw.subcategory,
      properties: this.convertProperties(raw),
      inputs: this.convertInputs(raw),
      outputs: this.convertOutputs(raw),
      credentials: this.convertCredentials(raw),
      webhookSupport: raw.hasWebhook,
      triggerNode: raw.isTrigger,
      regularNode: !raw.isTrigger,
      codeable: this.isCodeable(raw),
      polling: raw.hasPolling,
      examples: this.convertExamples(raw)
    };
  }

  /**
   * Generate standardized node name
   */
  private generateNodeName(raw: RawNodeData): string {
    // Extract base name from URL or existing name
    const baseName = raw.name.toLowerCase()
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/^n8n-nodes-base\./, '');
    
    // Ensure it follows n8n naming convention
    return `n8n-nodes-base.${baseName}`;
  }

  /**
   * Process and clean description
   */
  private processDescription(description: string): string {
    if (!description || description === 'No description available') {
      return 'Integration node for workflow automation';
    }
    
    return description
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-\.\,\!\?]/g, '')
      .trim()
      .substring(0, 500); // Limit length
  }

  /**
   * Map raw category to standard categories
   */
  private mapCategory(rawCategory: string): string {
    const categoryMap: Record<string, string> = {
      'Core Nodes': 'Core',
      'App Nodes': 'Communication',
      'Trigger Nodes': 'Trigger',
      'Cluster Nodes': 'Utility',
      'Sub Nodes': 'Utility',
      'Main': 'Communication',
      'main': 'Communication'
    };
    
    return categoryMap[rawCategory] || 'Communication';
  }

  /**
   * Convert operations to NodeProperty format
   */
  private convertProperties(raw: RawNodeData): Array<{
    name: string;
    displayName: string;
    type: string;
    required: boolean;
    default?: any;
    description: string;
    options?: Array<{ name: string; value: string | number | boolean; description?: string; }>;
    validation?: {
      type: string;
      min?: number;
      max?: number;
      pattern?: string;
      enum?: string[];
    };
  }> {
    const properties = [];
    
    // Always add operation property for regular nodes
    if (!raw.isTrigger) {
      properties.push({
        name: 'operation',
        displayName: 'Operation',
        type: 'options',
        required: true,
        default: raw.operations?.[0]?.name || 'execute',
        description: 'The operation to perform',
        options: this.convertOperationsToOptions(raw)
      });
    }
    
    // Convert operation parameters to properties
    if (raw.operations) {
      for (const operation of raw.operations) {
        if (operation.parameters) {
          for (const param of operation.parameters) {
            properties.push({
              name: param.name,
              displayName: param.displayName,
              type: this.mapParameterType(param.type),
              required: param.required,
              default: param.default,
              description: param.description,
              options: param.options?.map(opt => ({
                name: opt.name,
                value: opt.value,
                description: opt.description
              }))
            });
          }
        }
      }
    }
    
    // Add default properties if none exist
    if (properties.length === 0) {
      properties.push({
        name: 'operation',
        displayName: 'Operation',
        type: 'string',
        required: true,
        default: 'execute',
        description: 'Operation to perform'
      });
    }
    
    return properties;
  }

  /**
   * Convert operations to dropdown options
   */
  private convertOperationsToOptions(raw: RawNodeData): Array<{ name: string; value: string; description?: string; }> {
    if (!raw.operations || raw.operations.length === 0) {
      return [{ name: 'Execute', value: 'execute' }];
    }
    
    return raw.operations.map(op => ({
      name: op.displayName,
      value: op.name,
      description: op.description
    }));
  }

  /**
   * Map parameter types to n8n types
   */
  private mapParameterType(rawType: string): string {
    const typeMap: Record<string, string> = {
      'text': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'select': 'options',
      'multiselect': 'multiOptions',
      'json': 'json',
      'credential': 'credentials'
    };
    
    return typeMap[rawType.toLowerCase()] || 'string';
  }

  /**
   * Convert to standard inputs format
   */
  private convertInputs(raw: RawNodeData): Array<{
    type: string;
    displayName: string;
    required: boolean;
    maxConnections?: number;
  }> {
    // Trigger nodes typically have no inputs
    if (raw.isTrigger) {
      return [];
    }
    
    // Regular nodes have at least one main input
    return [
      {
        type: 'main',
        displayName: 'Input',
        required: false
      }
    ];
  }

  /**
   * Convert to standard outputs format
   */
  private convertOutputs(raw: RawNodeData): Array<{
    type: string;
    displayName: string;
    description?: string;
  }> {
    // All nodes have at least one main output
    const outputs = [
      {
        type: 'main',
        displayName: 'Output',
        description: 'Main data output'
      }
    ];
    
    // Some nodes might have error outputs
    if (this.hasErrorHandling(raw)) {
      outputs.push({
        type: 'main',
        displayName: 'Error',
        description: 'Error output'
      });
    }
    
    return outputs;
  }

  /**
   * Check if node has error handling
   */
  private hasErrorHandling(raw: RawNodeData): boolean {
    return raw.rawContent.toLowerCase().includes('error') ||
           raw.rawContent.toLowerCase().includes('fail') ||
           raw.operations?.some(op => 
             op.description.toLowerCase().includes('error') ||
             op.parameters?.some(p => p.name.toLowerCase().includes('error'))
           ) || false;
  }

  /**
   * Convert credentials information
   */
  private convertCredentials(raw: RawNodeData): string[] | undefined {
    if (!raw.credentials || raw.credentials.length === 0) {
      return undefined;
    }
    
    return raw.credentials.map(cred => cred.name);
  }

  /**
   * Check if node supports code execution
   */
  private isCodeable(raw: RawNodeData): boolean {
    const codeKeywords = ['function', 'code', 'javascript', 'expression', 'script'];
    const content = raw.rawContent.toLowerCase();
    
    return codeKeywords.some(keyword => content.includes(keyword)) ||
           raw.name.toLowerCase().includes('function') ||
           raw.name.toLowerCase().includes('code');
  }

  /**
   * Convert examples to NodeExample format
   */
  private convertExamples(raw: RawNodeData): Array<{
    name: string;
    description: string;
    workflow: any;
  }> | undefined {
    if (!raw.examples || raw.examples.length === 0) {
      return undefined;
    }
    
    return raw.examples.map(example => ({
      name: example.title,
      description: example.description,
      workflow: example.workflowData || this.generateBasicWorkflow(raw)
    }));
  }

  /**
   * Generate a basic workflow example
   */
  private generateBasicWorkflow(raw: RawNodeData): any {
    return {
      nodes: [
        {
          name: 'Start',
          type: 'n8n-nodes-base.manualTrigger',
          position: [240, 300],
          parameters: {}
        },
        {
          name: raw.displayName,
          type: raw.name,
          position: [460, 300],
          parameters: raw.operations?.[0]?.parameters?.reduce((acc, param) => {
            acc[param.name] = param.default || '';
            return acc;
          }, {} as any) || {}
        }
      ],
      connections: {
        'Start': {
          main: [[{ node: raw.displayName, type: 'main', index: 0 }]]
        }
      }
    };
  }

  /**
   * Validate the transformation result
   */
  private validateTransformation(nodeInfo: NodeTypeInfo, rawData: RawNodeData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check required fields
    if (!nodeInfo.name) {
      errors.push('Missing node name');
      score -= 25;
    }

    if (!nodeInfo.displayName) {
      errors.push('Missing display name');
      score -= 20;
    }

    if (!nodeInfo.description || nodeInfo.description.length < 20) {
      errors.push('Insufficient description');
      score -= 15;
    }

    if (!nodeInfo.properties || nodeInfo.properties.length === 0) {
      warnings.push('No properties defined');
      score -= 10;
    }

    // Check data quality
    if (nodeInfo.description === 'Integration node for workflow automation') {
      warnings.push('Using generic description');
      score -= 5;
    }

    if (!rawData.operations || rawData.operations.length === 0) {
      warnings.push('No operations extracted');
      score -= 10;
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
   * Get transformation statistics
   */
  public getStats(results: TransformationResult[]): any {
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    const scores = results.map(r => r.nodeInfo ? 85 : 0);
    const averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / results.length;
    
    const errorCounts: Record<string, number> = {};
    results.forEach(r => {
      r.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
    });
    
    return {
      total: results.length,
      successful,
      failed,
      successRate: successful / results.length,
      averageQualityScore: averageScore,
      commonErrors: Object.entries(errorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([error, count]) => ({ error, count }))
    };
  }

  /**
   * Merge with existing catalog data
   */
  public mergeWithExisting(
    newNodes: NodeTypeInfo[], 
    existingNodes: NodeTypeInfo[]
  ): NodeTypeInfo[] {
    const merged: NodeTypeInfo[] = [...existingNodes];
    const existingNames = new Set(existingNodes.map(n => n.name));
    
    for (const newNode of newNodes) {
      if (!existingNames.has(newNode.name)) {
        merged.push(newNode);
      } else {
        // Update existing node with new information
        const existingIndex = merged.findIndex(n => n.name === newNode.name);
        if (existingIndex >= 0) {
          merged[existingIndex] = this.mergeNodeInfo(merged[existingIndex], newNode);
        }
      }
    }
    
    return merged;
  }

  /**
   * Merge two NodeInfo objects intelligently
   */
  private mergeNodeInfo(existing: NodeTypeInfo, updated: NodeTypeInfo): NodeTypeInfo {
    return {
      ...existing,
      // Update description if the new one is longer/better
      description: updated.description.length > existing.description.length ? 
        updated.description : existing.description,
      // Merge properties
      properties: this.mergeProperties(existing.properties, updated.properties),
      // Update credentials if new ones are found
      credentials: updated.credentials && updated.credentials.length > 0 ? 
        updated.credentials : existing.credentials,
      // Update boolean flags
      webhookSupport: existing.webhookSupport || updated.webhookSupport,
      polling: existing.polling || updated.polling,
      // Merge examples
      examples: this.mergeExamples(existing.examples, updated.examples)
    };
  }

  /**
   * Merge property arrays
   */
  private mergeProperties(existing: any[], updated: any[]): any[] {
    const merged = [...existing];
    const existingNames = new Set(existing.map(p => p.name));
    
    for (const prop of updated) {
      if (!existingNames.has(prop.name)) {
        merged.push(prop);
      }
    }
    
    return merged;
  }

  /**
   * Merge example arrays
   */
  private mergeExamples(existing: any[] | undefined, updated: any[] | undefined): any[] | undefined {
    if (!existing && !updated) return undefined;
    if (!existing) return updated;
    if (!updated) return existing;
    
    const merged = [...existing];
    const existingNames = new Set(existing.map(e => e.name));
    
    for (const example of updated) {
      if (!existingNames.has(example.name)) {
        merged.push(example);
      }
    }
    
    return merged;
  }
}