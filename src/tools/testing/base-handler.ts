/**
 * Base Testing Tool Handler
 *
 * This module provides a base handler for workflow testing and validation tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base class for workflow testing tool handlers
 */
export abstract class BaseTestingToolHandler {
  protected apiService: EnhancedN8nApiClient;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    const formattedData = typeof data === 'object' 
      ? JSON.stringify(data, null, 2)
      : String(data);
      
    return {
      content: [
        {
          type: 'text',
          text: message ? `${message}\n\n${formattedData}` : formattedData,
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing testing tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   *
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Generate sample data for a node type
   * 
   * @param nodeType The type of node to generate data for
   * @param schema Optional schema to follow
   * @returns Generated sample data
   */
  protected generateSampleDataForNode(nodeType: string, schema?: any): any {
    const sampleData: Record<string, any> = {};

    // Common sample data patterns based on node types
    const patterns: Record<string, any> = {
      'n8n-nodes-base.httpRequest': {
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: { key: 'value' }
      },
      'n8n-nodes-base.webhook': {
        body: { message: 'Hello World', timestamp: new Date().toISOString() },
        headers: { 'Content-Type': 'application/json' },
        query: { param: 'value' }
      },
      'n8n-nodes-base.set': {
        value1: 'Sample String',
        value2: 123,
        value3: true,
        value4: new Date().toISOString()
      },
      'n8n-nodes-base.function': {
        input: { data: 'Sample input data' }
      },
      'n8n-nodes-base.if': {
        condition: true,
        value1: 'test',
        value2: 'test'
      }
    };

    return patterns[nodeType] || {
      sampleField: 'Sample data',
      timestamp: new Date().toISOString(),
      id: Math.floor(Math.random() * 1000)
    };
  }

  /**
   * Analyze workflow performance bottlenecks
   * 
   * @param workflow Workflow to analyze
   * @param executions Recent executions data
   * @returns Performance analysis
   */
  protected analyzePerformanceBottlenecks(workflow: any, executions: any[]): any {
    const analysis = {
      totalNodes: workflow.nodes?.length || 0,
      complexNodes: [] as Array<{name: any, type: any, reason: string}>,
      slowNodes: [] as Array<any>,
      recommendations: [] as string[],
      performanceScore: 100
    };

    // Analyze node complexity
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (this.isComplexNode(node)) {
          analysis.complexNodes.push({
            name: node.name,
            type: node.type,
            reason: this.getComplexityReason(node)
          });
          analysis.performanceScore -= 5;
        }
      }
    }

    // Analyze execution times
    if (executions.length > 0) {
      const avgExecutionTime = executions.reduce((sum, exec) => 
        sum + (exec.executionTime || 0), 0) / executions.length;
      
      if (avgExecutionTime > 60000) { // > 1 minute
        analysis.recommendations.push('Consider optimizing workflow - average execution time exceeds 1 minute');
        analysis.performanceScore -= 15;
      }
    }

    // Add general recommendations
    if (analysis.totalNodes > 20) {
      analysis.recommendations.push('Large workflow detected - consider breaking into smaller workflows');
      analysis.performanceScore -= 10;
    }

    return analysis;
  }

  /**
   * Check if a node is complex and might impact performance
   */
  private isComplexNode(node: any): boolean {
    const complexNodeTypes = [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.function',
      'n8n-nodes-base.code',
      'n8n-nodes-base.executeWorkflow'
    ];
    
    return complexNodeTypes.includes(node.type) || 
           (node.parameters && Object.keys(node.parameters).length > 10);
  }

  /**
   * Get the reason why a node is considered complex
   */
  private getComplexityReason(node: any): string {
    if (node.type === 'n8n-nodes-base.httpRequest') return 'HTTP requests can be slow depending on external API';
    if (node.type === 'n8n-nodes-base.function') return 'Custom JavaScript functions may have performance implications';
    if (node.type === 'n8n-nodes-base.code') return 'Custom code execution can be resource intensive';
    if (node.type === 'n8n-nodes-base.executeWorkflow') return 'Nested workflow execution adds complexity';
    return 'Node has many parameters configured';
  }
}