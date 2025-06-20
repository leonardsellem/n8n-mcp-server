/**
 * Auto Connect Nodes Tool
 *
 * This module provides intelligent node connection based on data flow.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from '../templates/base-handler.js';

/**
 * Handler for auto-connecting nodes
 */
export class AutoConnectNodesHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId']);
      
      const { workflowId, strategy = 'intelligent' } = args;

      try {
        // Get the workflow
        const workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new Error(`Workflow with ID "${workflowId}" not found`);
        }

        // Analyze nodes and suggest connections
        const connectionAnalysis = this.analyzeNodeConnections(workflow);
        const suggestedConnections = this.generateConnectionSuggestions(connectionAnalysis, strategy);

        // Apply connections if requested
        let updatedWorkflow = workflow;
        if (args.autoApply && suggestedConnections.length > 0) {
          updatedWorkflow = await this.applyConnections(workflow, suggestedConnections);
          await this.apiService.updateWorkflow(workflowId, updatedWorkflow);
        }

        const result = {
          workflowId,
          workflowName: workflow.name,
          analysis: connectionAnalysis,
          suggestedConnections: suggestedConnections.map(conn => ({
            from: conn.from,
            to: conn.to,
            type: conn.type,
            confidence: conn.confidence,
            reason: conn.reason
          })),
          applied: args.autoApply || false,
          summary: this.generateConnectionSummary(suggestedConnections)
        };

        return this.formatSuccess(result, `Generated ${suggestedConnections.length} connection suggestions for workflow "${workflow.name}"`);
      } catch (error) {
        throw new Error(`Failed to auto-connect nodes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Analyze current node connections
   */
  private analyzeNodeConnections(workflow: any): any {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};

    // Categorize nodes
    const triggerNodes = nodes.filter((node: any) => 
      this.isTriggerNode(node.type)
    );

    const actionNodes = nodes.filter((node: any) => 
      !this.isTriggerNode(node.type)
    );

    const unconnectedNodes = nodes.filter((node: any) => {
      const hasIncoming = this.hasIncomingConnection(node, connections);
      const hasOutgoing = connections[node.name];
      return !hasIncoming && !hasOutgoing && !this.isTriggerNode(node.type);
    });

    const dataFlowAnalysis = this.analyzeDataFlow(nodes);

    return {
      totalNodes: nodes.length,
      triggerNodes: triggerNodes.length,
      actionNodes: actionNodes.length,
      unconnectedNodes: unconnectedNodes.length,
      connectionDensity: this.calculateConnectionDensity(nodes, connections),
      dataFlowTypes: dataFlowAnalysis,
      nodeTypes: this.categorizeNodeTypes(nodes)
    };
  }

  /**
   * Generate connection suggestions
   */
  private generateConnectionSuggestions(analysis: any, strategy: string): any[] {
    const suggestions = [];

    // Strategy-specific logic
    switch (strategy) {
      case 'intelligent':
        suggestions.push(...this.intelligentConnectionSuggestions(analysis));
        break;
      case 'linear':
        suggestions.push(...this.linearConnectionSuggestions(analysis));
        break;
      case 'parallel':
        suggestions.push(...this.parallelConnectionSuggestions(analysis));
        break;
      default:
        suggestions.push(...this.intelligentConnectionSuggestions(analysis));
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Intelligent connection suggestions based on node types and data flow
   */
  private intelligentConnectionSuggestions(analysis: any): any[] {
    const suggestions = [];

    // Connect triggers to appropriate first actions
    analysis.nodeTypes.triggers.forEach((trigger: any) => {
      if (!this.hasOutgoingConnection(trigger)) {
        const bestTarget = this.findBestActionForTrigger(trigger, analysis.nodeTypes.actions);
        if (bestTarget) {
          suggestions.push({
            from: trigger.name,
            to: bestTarget.name,
            type: 'main',
            confidence: this.calculateConnectionConfidence(trigger, bestTarget),
            reason: `Connect ${trigger.type} trigger to ${bestTarget.type} action`
          });
        }
      }
    });

    // Connect data processors in logical order
    const processors = analysis.nodeTypes.processors || [];
    for (let i = 0; i < processors.length - 1; i++) {
      const current = processors[i];
      const next = processors[i + 1];
      
      if (!this.hasConnectionBetween(current, next)) {
        suggestions.push({
          from: current.name,
          to: next.name,
          type: 'main',
          confidence: 0.8,
          reason: 'Sequential data processing flow'
        });
      }
    }

    // Connect similar node types
    analysis.nodeTypes.similar.forEach((group: any) => {
      if (group.nodes.length > 1) {
        const [first, ...rest] = group.nodes;
        rest.forEach((node: any) => {
          if (!this.hasIncomingConnection(node)) {
            suggestions.push({
              from: first.name,
              to: node.name,
              type: 'main',
              confidence: 0.6,
              reason: `Connect similar ${group.type} nodes`
            });
          }
        });
      }
    });

    return suggestions;
  }

  /**
   * Linear connection suggestions (chain nodes sequentially)
   */
  private linearConnectionSuggestions(analysis: any): any[] {
    const suggestions = [];
    const allNodes = [
      ...analysis.nodeTypes.triggers,
      ...analysis.nodeTypes.actions,
      ...analysis.nodeTypes.processors
    ];

    for (let i = 0; i < allNodes.length - 1; i++) {
      const current = allNodes[i];
      const next = allNodes[i + 1];
      
      suggestions.push({
        from: current.name,
        to: next.name,
        type: 'main',
        confidence: 0.7,
        reason: 'Linear sequential connection'
      });
    }

    return suggestions;
  }

  /**
   * Parallel connection suggestions (connect trigger to multiple actions)
   */
  private parallelConnectionSuggestions(analysis: any): any[] {
    const suggestions: any[] = [];

    if (analysis.nodeTypes.triggers.length > 0 && analysis.nodeTypes.actions.length > 1) {
      const trigger = analysis.nodeTypes.triggers[0];
      analysis.nodeTypes.actions.forEach((action: any) => {
        suggestions.push({
          from: trigger.name,
          to: action.name,
          type: 'main',
          confidence: 0.6,
          reason: 'Parallel execution from trigger'
        });
      });
    }

    return suggestions;
  }

  /**
   * Apply connections to workflow
   */
  private async applyConnections(workflow: any, connections: any[]): Promise<any> {
    const updatedWorkflow = { ...workflow };
    const updatedConnections = { ...updatedWorkflow.connections };

    connections.forEach(conn => {
      if (!updatedConnections[conn.from]) {
        updatedConnections[conn.from] = { main: [[]] };
      }
      
      if (!updatedConnections[conn.from].main) {
        updatedConnections[conn.from].main = [[]];
      }

      // Add connection if it doesn't already exist
      const existingConnection = updatedConnections[conn.from].main[0].find((c: any) => c.node === conn.to);
      if (!existingConnection) {
        updatedConnections[conn.from].main[0].push({
          node: conn.to,
          type: conn.type,
          index: 0
        });
      }
    });

    updatedWorkflow.connections = updatedConnections;
    return updatedWorkflow;
  }

  // Helper methods
  private isTriggerNode(nodeType: string): boolean {
    return nodeType.includes('trigger') || nodeType.includes('webhook');
  }

  private hasIncomingConnection(node: any, connections?: any): boolean {
    if (!connections) return false;
    return Object.values(connections).some((conn: any) =>
      conn.main && conn.main[0] && conn.main[0].some((c: any) => c.node === node.name)
    );
  }

  private hasOutgoingConnection(node: any, connections?: any): boolean {
    if (!connections) return false;
    return connections[node.name] && connections[node.name].main;
  }

  private hasConnectionBetween(from: any, to: any, connections?: any): boolean {
    if (!connections || !connections[from.name]) return false;
    return connections[from.name].main?.[0]?.some((c: any) => c.node === to.name);
  }

  private calculateConnectionDensity(nodes: any[], connections: any): number {
    const totalPossibleConnections = nodes.length * (nodes.length - 1);
    const actualConnections = Object.values(connections).reduce((count: number, conn: any) => {
      return count + (conn.main?.[0]?.length || 0);
    }, 0);

    return totalPossibleConnections > 0 ? actualConnections / totalPossibleConnections : 0;
  }

  private analyzeDataFlow(nodes: any[]): any {
    const dataTypes = {
      json: nodes.filter((n: any) => n.type.includes('json') || n.type.includes('http')),
      text: nodes.filter((n: any) => n.type.includes('text') || n.type.includes('file')),
      email: nodes.filter((n: any) => n.type.includes('email')),
      database: nodes.filter((n: any) => n.type.includes('postgres') || n.type.includes('mysql'))
    };

    return dataTypes;
  }

  private categorizeNodeTypes(nodes: any[]): any {
    return {
      triggers: nodes.filter((node: any) => this.isTriggerNode(node.type)),
      actions: nodes.filter((node: any) => 
        !this.isTriggerNode(node.type) && 
        (node.type.includes('http') || node.type.includes('email') || node.type.includes('slack'))
      ),
      processors: nodes.filter((node: any) => 
        node.type.includes('function') || node.type.includes('set') || node.type.includes('code')
      ),
      similar: this.groupSimilarNodes(nodes)
    };
  }

  private groupSimilarNodes(nodes: any[]): any[] {
    const groups: any = {};
    
    nodes.forEach((node: any) => {
      const baseType = node.type.split('.').pop() || node.type;
      if (!groups[baseType]) {
        groups[baseType] = { type: baseType, nodes: [] };
      }
      groups[baseType].nodes.push(node);
    });

    return Object.values(groups).filter((group: any) => group.nodes.length > 1);
  }

  private findBestActionForTrigger(trigger: any, actions: any[]): any {
    // Simple heuristic: match webhook to HTTP, email to email, etc.
    if (trigger.type.includes('webhook')) {
      return actions.find((a: any) => a.type.includes('http')) || actions[0];
    }
    if (trigger.type.includes('email')) {
      return actions.find((a: any) => a.type.includes('email')) || actions[0];
    }
    return actions[0];
  }

  private calculateConnectionConfidence(from: any, to: any): number {
    // Calculate confidence based on node type compatibility
    let confidence = 0.5; // Base confidence

    // Boost confidence for logical connections
    if (from.type.includes('webhook') && to.type.includes('http')) confidence += 0.3;
    if (from.type.includes('email') && to.type.includes('email')) confidence += 0.3;
    if (from.type.includes('trigger') && !to.type.includes('trigger')) confidence += 0.2;

    return Math.min(1.0, confidence);
  }

  private generateConnectionSummary(connections: any[]): string {
    const high = connections.filter(c => c.confidence > 0.8).length;
    const medium = connections.filter(c => c.confidence > 0.6 && c.confidence <= 0.8).length;
    const low = connections.filter(c => c.confidence <= 0.6).length;

    return `${connections.length} connections suggested: ${high} high confidence, ${medium} medium confidence, ${low} low confidence`;
  }
}

/**
 * Get the tool definition for auto-connecting nodes
 */
export function getAutoConnectNodesToolDefinition(): ToolDefinition {
  return {
    name: 'auto_connect_nodes',
    description: 'Intelligent node connection based on data flow analysis and node types',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to analyze and connect'
        },
        strategy: {
          type: 'string',
          enum: ['intelligent', 'linear', 'parallel'],
          description: 'Connection strategy to use',
          default: 'intelligent'
        },
        autoApply: {
          type: 'boolean',
          description: 'Whether to automatically apply suggested connections',
          default: false
        }
      },
      required: ['workflowId']
    }
  };
}