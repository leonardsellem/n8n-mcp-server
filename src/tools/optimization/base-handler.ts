/**
 * Workflow Optimization Base Handler
 * 
 * Base class for all workflow optimization tool handlers.
 */

import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { ToolCallResult } from '../../types/index.js';
import { getEnvConfig } from '../../config/environment.js';

export abstract class OptimizationBaseHandler extends BaseWorkflowToolHandler {
  protected client: EnhancedN8nApiClient;

  constructor() {
    super();
    const config = getEnvConfig();
    this.client = new EnhancedN8nApiClient(config);
  }

  /**
   * Validate optimization parameters
   */
  protected validateOptimizationParams(params: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }

  /**
   * Handle optimization API errors
   */
  protected handleOptimizationError(error: any, operation: string): ToolCallResult {
    console.error(`Optimization ${operation} error:`, error);
    return {
      content: [{
        type: 'text',
        text: `Optimization ${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }

  /**
   * Format optimization response
   */
  protected formatOptimizationResponse(data: any, message: string): ToolCallResult {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString()
        }, null, 2)
      }],
      isError: false
    };
  }

  /**
   * Analyze workflow complexity
   */
  protected analyzeComplexity(workflow: any): {
    nodeCount: number;
    connectionCount: number;
    maxDepth: number;
    cyclomaticComplexity: number;
    score: 'low' | 'medium' | 'high';
  } {
    const nodeCount = workflow.nodes?.length || 0;
    const connectionCount = Object.keys(workflow.connections || {}).length;
    
    // Calculate maximum depth (longest path)
    const maxDepth = this.calculateMaxDepth(workflow.nodes, workflow.connections);
    
    // Simplified cyclomatic complexity
    const cyclomaticComplexity = connectionCount - nodeCount + 2;
    
    // Determine complexity score
    let score: 'low' | 'medium' | 'high' = 'low';
    if (nodeCount > 20 || maxDepth > 10 || cyclomaticComplexity > 15) {
      score = 'high';
    } else if (nodeCount > 10 || maxDepth > 5 || cyclomaticComplexity > 8) {
      score = 'medium';
    }

    return {
      nodeCount,
      connectionCount,
      maxDepth,
      cyclomaticComplexity,
      score
    };
  }

  /**
   * Calculate the maximum depth of a workflow
   */
  private calculateMaxDepth(nodes: any[], connections: any): number {
    if (!nodes || nodes.length === 0) return 0;
    
    // Find trigger nodes (nodes with no incoming connections)
    const hasIncoming = new Set();
    Object.values(connections || {}).forEach((nodeConnections: any) => {
      Object.values(nodeConnections).forEach((outputConnections: any) => {
        outputConnections.forEach((connection: any) => {
          hasIncoming.add(connection.node);
        });
      });
    });

    const triggerNodes = nodes.filter(node => !hasIncoming.has(node.name));
    if (triggerNodes.length === 0) return 0;

    // Calculate depth from each trigger node
    let maxDepth = 0;
    for (const triggerNode of triggerNodes) {
      const depth = this.calculateNodeDepth(triggerNode.name, connections, new Set());
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  /**
   * Calculate depth from a specific node
   */
  private calculateNodeDepth(nodeName: string, connections: any, visited: Set<string>): number {
    if (visited.has(nodeName)) return 0; // Prevent infinite loops
    visited.add(nodeName);

    const nodeConnections = connections[nodeName];
    if (!nodeConnections) return 1;

    let maxChildDepth = 0;
    Object.values(nodeConnections).forEach((outputConnections: any) => {
      outputConnections.forEach((connection: any) => {
        const childDepth = this.calculateNodeDepth(connection.node, connections, new Set(visited));
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      });
    });

    return 1 + maxChildDepth;
  }

  /**
   * Identify performance bottlenecks in workflow
   */
  protected identifyBottlenecks(workflow: any, executionData?: any): string[] {
    const bottlenecks: string[] = [];

    // Check for synchronous heavy operations
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (this.isHeavyOperation(node)) {
          bottlenecks.push(`Node "${node.name}" may cause performance issues: ${node.type}`);
        }
      }
    }

    // Check for excessive loops
    const complexity = this.analyzeComplexity(workflow);
    if (complexity.score === 'high') {
      bottlenecks.push('Workflow has high complexity which may impact performance');
    }

    // Check execution data if available
    if (executionData?.data) {
      for (const [nodeName, nodeData] of Object.entries(executionData.data)) {
        if (this.isSlowExecution(nodeData)) {
          bottlenecks.push(`Node "${nodeName}" has slow execution times`);
        }
      }
    }

    return bottlenecks;
  }

  /**
   * Check if a node represents a heavy operation
   */
  private isHeavyOperation(node: any): boolean {
    const heavyNodeTypes = [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.code',
      'n8n-nodes-base.function',
      'n8n-nodes-base.spreadsheetFile',
      'n8n-nodes-base.executeWorkflow'
    ];

    return heavyNodeTypes.includes(node.type);
  }

  /**
   * Check if execution data indicates slow performance
   */
  private isSlowExecution(nodeData: any): boolean {
    if (!nodeData || !Array.isArray(nodeData)) return false;
    
    // Check if any execution took longer than 5 seconds
    return nodeData.some((execution: any) => {
      if (execution.startTime && execution.endTime) {
        const duration = new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime();
        return duration > 5000; // 5 seconds
      }
      return false;
    });
  }

  /**
   * Generate optimization recommendations
   */
  protected generateOptimizationRecommendations(
    workflow: any,
    bottlenecks: string[],
    executionData?: any
  ): string[] {
    const recommendations: string[] = [];

    // Performance recommendations
    if (bottlenecks.length > 0) {
      recommendations.push('Consider optimizing identified performance bottlenecks');
    }

    const complexity = this.analyzeComplexity(workflow);
    if (complexity.score === 'high') {
      recommendations.push('Break down complex workflow into smaller, manageable sub-workflows');
    }

    if (complexity.nodeCount > 25) {
      recommendations.push('Consider using sub-workflows to reduce node count');
    }

    // Node-specific recommendations
    if (workflow.nodes) {
      const httpNodes = workflow.nodes.filter((n: any) => n.type === 'n8n-nodes-base.httpRequest');
      if (httpNodes.length > 5) {
        recommendations.push('Consider consolidating HTTP requests or using batch operations');
      }

      const functionNodes = workflow.nodes.filter((n: any) => n.type === 'n8n-nodes-base.function');
      if (functionNodes.length > 3) {
        recommendations.push('Multiple function nodes detected - consider consolidating logic');
      }
    }

    return recommendations;
  }
}