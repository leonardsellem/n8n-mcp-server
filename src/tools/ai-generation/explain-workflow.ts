/**
 * Explain Workflow Tool
 *
 * This module provides functionality to generate human-readable explanations of complex workflows.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from '../templates/base-handler.js';

/**
 * Handler for explaining workflows
 */
export class ExplainWorkflowHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId']);
      
      const { workflowId, detail = 'comprehensive', format = 'markdown' } = args;

      try {
        // Get the workflow
        const workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new Error(`Workflow with ID "${workflowId}" not found`);
        }

        // Analyze workflow structure
        const analysis = this.analyzeWorkflowStructure(workflow);
        
        // Generate explanation based on detail level
        const explanation = this.generateExplanation(workflow, analysis, detail, format);

        const result = {
          workflowId,
          workflowName: workflow.name,
          explanation,
          analysis: {
            nodeCount: analysis.nodeCount,
            complexity: analysis.complexity,
            estimatedRuntime: analysis.estimatedRuntime,
            triggers: analysis.triggers,
            mainActions: analysis.mainActions
          },
          format,
          detailLevel: detail
        };

        return this.formatSuccess(result, `Generated ${detail} explanation for workflow "${workflow.name}"`);
      } catch (error) {
        throw new Error(`Failed to explain workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Analyze workflow structure for explanation
   */
  private analyzeWorkflowStructure(workflow: any): any {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};

    // Categorize nodes
    const triggers = nodes.filter((node: any) => 
      node.type.includes('trigger') || node.type.includes('webhook')
    );

    const actions = nodes.filter((node: any) => 
      !node.type.includes('trigger') && !node.type.includes('webhook')
    );

    // Analyze flow
    const flowAnalysis = this.analyzeFlow(nodes, connections);
    
    // Estimate complexity and runtime
    const complexity = this.estimateComplexity(nodes, connections);
    const estimatedRuntime = this.estimateRuntime(nodes);

    return {
      nodeCount: nodes.length,
      triggers: triggers.map((node: any) => ({
        name: node.name,
        type: this.getNodeTypeDescription(node.type),
        purpose: this.getNodePurpose(node)
      })),
      mainActions: actions.slice(0, 5).map((node: any) => ({
        name: node.name,
        type: this.getNodeTypeDescription(node.type),
        purpose: this.getNodePurpose(node)
      })),
      flowStructure: flowAnalysis,
      complexity,
      estimatedRuntime,
      dataTypes: this.analyzeDataTypes(nodes),
      integrations: this.analyzeIntegrations(nodes)
    };
  }

  /**
   * Generate workflow explanation
   */
  private generateExplanation(workflow: any, analysis: any, detail: string, format: string): string {
    if (format === 'markdown') {
      return this.generateMarkdownExplanation(workflow, analysis, detail);
    } else if (format === 'plain') {
      return this.generatePlainTextExplanation(workflow, analysis, detail);
    } else {
      return this.generateStructuredExplanation(workflow, analysis, detail);
    }
  }

  /**
   * Generate markdown explanation
   */
  private generateMarkdownExplanation(workflow: any, analysis: any, detail: string): string {
    const lines: string[] = [];

    lines.push(`# Workflow: ${workflow.name}`);
    lines.push('');

    // Overview
    lines.push('## Overview');
    lines.push(`This workflow contains ${analysis.nodeCount} nodes with ${analysis.complexity} complexity.`);
    if (workflow.description) {
      lines.push(`**Description:** ${workflow.description}`);
    }
    lines.push(`**Estimated Runtime:** ${analysis.estimatedRuntime}`);
    lines.push('');

    // Triggers
    if (analysis.triggers.length > 0) {
      lines.push('## Triggers');
      analysis.triggers.forEach((trigger: any) => {
        lines.push(`- **${trigger.name}** (${trigger.type}): ${trigger.purpose}`);
      });
      lines.push('');
    }

    // Main Flow
    lines.push('## Workflow Flow');
    if (detail === 'comprehensive') {
      lines.push(this.generateDetailedFlow(analysis.flowStructure));
    } else {
      lines.push(this.generateSimpleFlow(analysis.flowStructure));
    }
    lines.push('');

    // Key Actions
    if (analysis.mainActions.length > 0) {
      lines.push('## Key Actions');
      analysis.mainActions.forEach((action: any) => {
        lines.push(`- **${action.name}** (${action.type}): ${action.purpose}`);
      });
      lines.push('');
    }

    // Integrations
    if (analysis.integrations.length > 0) {
      lines.push('## External Integrations');
      analysis.integrations.forEach((integration: string) => {
        lines.push(`- ${integration}`);
      });
      lines.push('');
    }

    // Data Flow
    if (detail === 'comprehensive' && analysis.dataTypes.length > 0) {
      lines.push('## Data Types Processed');
      analysis.dataTypes.forEach((dataType: string) => {
        lines.push(`- ${dataType}`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate plain text explanation
   */
  private generatePlainTextExplanation(workflow: any, analysis: any, detail: string): string {
    const parts: string[] = [];

    parts.push(`Workflow: ${workflow.name}`);
    parts.push(`This workflow has ${analysis.nodeCount} nodes and ${analysis.complexity} complexity.`);

    if (analysis.triggers.length > 0) {
      parts.push(`It is triggered by: ${analysis.triggers.map((t: any) => t.name).join(', ')}.`);
    }

    parts.push(`The main purpose is to ${this.inferWorkflowPurpose(analysis)}.`);

    if (analysis.mainActions.length > 0) {
      parts.push(`Key actions include: ${analysis.mainActions.map((a: any) => a.name).join(', ')}.`);
    }

    if (analysis.integrations.length > 0) {
      parts.push(`It integrates with: ${analysis.integrations.join(', ')}.`);
    }

    parts.push(`Estimated runtime: ${analysis.estimatedRuntime}.`);

    return parts.join(' ');
  }

  /**
   * Generate structured explanation
   */
  private generateStructuredExplanation(workflow: any, analysis: any, detail: string): string {
    const structured = {
      summary: {
        name: workflow.name,
        nodeCount: analysis.nodeCount,
        complexity: analysis.complexity,
        purpose: this.inferWorkflowPurpose(analysis)
      },
      triggers: analysis.triggers,
      flow: analysis.flowStructure,
      actions: analysis.mainActions,
      integrations: analysis.integrations,
      estimatedRuntime: analysis.estimatedRuntime
    };

    return JSON.stringify(structured, null, 2);
  }

  // Helper methods
  private analyzeFlow(nodes: any[], connections: any): any {
    const flowSteps: string[] = [];
    const triggers = nodes.filter((node: any) => 
      node.type.includes('trigger') || node.type.includes('webhook')
    );

    if (triggers.length > 0) {
      flowSteps.push(`Starts with ${triggers[0].name}`);
      
      // Trace flow from triggers
      const visited = new Set<string>();
      const flow = this.traceFlow(triggers[0].name, connections, nodes, visited);
      flowSteps.push(...flow);
    }

    return {
      steps: flowSteps,
      branchingPoints: this.findBranchingPoints(connections),
      parallelPaths: this.findParallelPaths(connections)
    };
  }

  private traceFlow(startNode: string, connections: any, nodes: any[], visited: Set<string>, depth = 0): string[] {
    if (depth > 10 || visited.has(startNode)) return []; // Prevent infinite loops
    
    visited.add(startNode);
    const steps: string[] = [];
    
    if (connections[startNode]?.main?.[0]) {
      connections[startNode].main[0].forEach((conn: any) => {
        const targetNode = nodes.find((n: any) => n.name === conn.node);
        if (targetNode) {
          steps.push(`→ ${targetNode.name} (${this.getNodeTypeDescription(targetNode.type)})`);
          steps.push(...this.traceFlow(conn.node, connections, nodes, visited, depth + 1));
        }
      });
    }
    
    return steps;
  }

  private getNodeTypeDescription(nodeType: string): string {
    const typeMap: Record<string, string> = {
      'n8n-nodes-base.webhook': 'Webhook Trigger',
      'n8n-nodes-base.scheduleTrigger': 'Schedule Trigger',
      'n8n-nodes-base.httpRequest': 'HTTP Request',
      'n8n-nodes-base.emailSend': 'Send Email',
      'n8n-nodes-base.function': 'Custom Function',
      'n8n-nodes-base.set': 'Set Data',
      'n8n-nodes-base.slack': 'Slack Integration',
      'n8n-nodes-base.postgres': 'PostgreSQL Database'
    };

    return typeMap[nodeType] || nodeType.split('.').pop() || nodeType;
  }

  private getNodePurpose(node: any): string {
    const type = node.type;
    const name = node.name;

    if (type.includes('webhook')) return 'Receives incoming HTTP requests';
    if (type.includes('schedule')) return 'Runs on a scheduled interval';
    if (type.includes('httpRequest')) return 'Makes HTTP API calls';
    if (type.includes('emailSend')) return 'Sends email notifications';
    if (type.includes('function')) return 'Processes data with custom logic';
    if (type.includes('set')) return 'Sets or transforms data values';
    if (type.includes('slack')) return 'Sends messages to Slack';
    if (type.includes('postgres')) return 'Interacts with PostgreSQL database';

    return `Performs ${name.toLowerCase()} operations`;
  }

  private estimateComplexity(nodes: any[], connections: any): string {
    const nodeCount = nodes.length;
    const connectionCount = Object.keys(connections).length;
    const complexity = nodeCount + connectionCount;

    if (complexity <= 5) return 'Simple';
    if (complexity <= 15) return 'Medium';
    if (complexity <= 30) return 'Complex';
    return 'Very Complex';
  }

  private estimateRuntime(nodes: any[]): string {
    // Rough estimation based on node types
    let estimatedMs = 1000; // Base time

    nodes.forEach((node: any) => {
      if (node.type.includes('http')) estimatedMs += 2000;
      if (node.type.includes('database')) estimatedMs += 1500;
      if (node.type.includes('email')) estimatedMs += 3000;
      if (node.type.includes('function')) estimatedMs += 500;
      if (node.type.includes('file')) estimatedMs += 1000;
    });

    if (estimatedMs < 5000) return 'Fast (< 5 seconds)';
    if (estimatedMs < 15000) return 'Medium (5-15 seconds)';
    if (estimatedMs < 60000) return 'Slow (15-60 seconds)';
    return 'Very Slow (> 1 minute)';
  }

  private analyzeDataTypes(nodes: any[]): string[] {
    const types = new Set<string>();
    
    nodes.forEach((node: any) => {
      if (node.type.includes('json') || node.type.includes('http')) types.add('JSON');
      if (node.type.includes('xml')) types.add('XML');
      if (node.type.includes('csv')) types.add('CSV');
      if (node.type.includes('email')) types.add('Email');
      if (node.type.includes('file')) types.add('Files');
      if (node.type.includes('text')) types.add('Text');
    });

    return Array.from(types);
  }

  private analyzeIntegrations(nodes: any[]): string[] {
    const integrations = new Set<string>();
    
    nodes.forEach((node: any) => {
      if (node.type.includes('slack')) integrations.add('Slack');
      if (node.type.includes('email')) integrations.add('Email');
      if (node.type.includes('postgres')) integrations.add('PostgreSQL');
      if (node.type.includes('mysql')) integrations.add('MySQL');
      if (node.type.includes('mongodb')) integrations.add('MongoDB');
      if (node.type.includes('github')) integrations.add('GitHub');
      if (node.type.includes('google')) integrations.add('Google Services');
      if (node.type.includes('aws')) integrations.add('AWS');
    });

    return Array.from(integrations);
  }

  private findBranchingPoints(connections: any): string[] {
    return Object.entries(connections)
      .filter(([_, conn]: [string, any]) => conn.main?.[0]?.length > 1)
      .map(([nodeName, _]) => nodeName);
  }

  private findParallelPaths(connections: any): number {
    return Math.max(
      ...Object.values(connections).map((conn: any) => conn.main?.[0]?.length || 0),
      1
    );
  }

  private inferWorkflowPurpose(analysis: any): string {
    const triggers = analysis.triggers;
    const actions = analysis.mainActions;

    if (triggers.some((t: any) => t.type.includes('webhook')) && actions.some((a: any) => a.type.includes('email'))) {
      return 'process webhook data and send email notifications';
    }
    if (triggers.some((t: any) => t.type.includes('schedule')) && actions.some((a: any) => a.type.includes('http'))) {
      return 'periodically sync data between systems';
    }
    if (actions.some((a: any) => a.type.includes('database'))) {
      return 'process and store data in a database';
    }
    
    return 'automate data processing and integration tasks';
  }

  private generateDetailedFlow(flowStructure: any): string {
    const lines: string[] = [];
    
    flowStructure.steps.forEach((step: string, index: number) => {
      lines.push(`${index + 1}. ${step}`);
    });

    if (flowStructure.branchingPoints.length > 0) {
      lines.push('');
      lines.push('**Branching Points:**');
      flowStructure.branchingPoints.forEach((point: string) => {
        lines.push(`- ${point} creates multiple execution paths`);
      });
    }

    return lines.join('\n');
  }

  private generateSimpleFlow(flowStructure: any): string {
    return flowStructure.steps.slice(0, 3).join(' ');
  }
}

/**
 * Get the tool definition for explaining workflows
 */
export function getExplainWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'explain_workflow',
    description: 'Generate human-readable explanations of complex workflows with different detail levels and formats',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to explain'
        },
        detail: {
          type: 'string',
          enum: ['simple', 'comprehensive'],
          description: 'Level of detail in the explanation',
          default: 'comprehensive'
        },
        format: {
          type: 'string',
          enum: ['markdown', 'plain', 'structured'],
          description: 'Output format for the explanation',
          default: 'markdown'
        }
      },
      required: ['workflowId']
    }
  };
}