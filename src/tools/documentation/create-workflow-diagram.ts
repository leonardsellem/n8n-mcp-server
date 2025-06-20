/**
 * Create Workflow Diagram Tool
 * 
 * Tool for creating visual workflow representations and flowcharts.
 */

import { DocumentationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface CreateDiagramArgs {
  workflowId: string;
  format?: 'mermaid' | 'svg' | 'png' | 'ascii';
  includeLabels?: boolean;
  includeParameters?: boolean;
  theme?: 'default' | 'dark' | 'neutral';
}

export class CreateWorkflowDiagramHandler extends DocumentationBaseHandler {
  async execute(args: CreateDiagramArgs): Promise<ToolCallResult> {
    try {
      this.validateDocumentationParams(args, ['workflowId']);
      
      const { workflowId, format = 'mermaid', includeLabels = true, includeParameters = false, theme = 'default' } = args;

      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        return this.formatError(`Workflow ${workflowId} not found`);
      }

      const diagram = this.generateDiagram(workflow, format, includeLabels, includeParameters, theme);

      return this.formatDocumentationResponse(
        { workflowId, format, diagram },
        `Generated ${format} diagram for workflow ${workflow.name}`
      );

    } catch (error) {
      return this.handleDocumentationError(error, 'create workflow diagram');
    }
  }

  private async getWorkflow(workflowId: string): Promise<any> {
    // Mock workflow data
    return {
      id: workflowId,
      name: 'Sample Workflow',
      nodes: [
        { name: 'Start', type: 'n8n-nodes-base.webhook' },
        { name: 'Process', type: 'n8n-nodes-base.function' },
        { name: 'Send Email', type: 'n8n-nodes-base.emailSend' }
      ],
      connections: {
        'Start': { main: [{ node: 'Process', type: 'main', index: 0 }] },
        'Process': { main: [{ node: 'Send Email', type: 'main', index: 0 }] }
      }
    };
  }

  private generateDiagram(workflow: any, format: string, includeLabels: boolean, includeParameters: boolean, theme: string): string {
    switch (format) {
      case 'mermaid':
        return this.generateMermaidDiagram(workflow, includeLabels, theme);
      case 'ascii':
        return this.generateAsciiDiagram(workflow, includeLabels);
      default:
        return this.generateMermaidDiagram(workflow, includeLabels, theme);
    }
  }

  private generateMermaidDiagram(workflow: any, includeLabels: boolean, theme: string): string {
    let diagram = 'graph TD\n';
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return diagram + '    A[Empty Workflow]';
    }

    // Add nodes
    workflow.nodes.forEach((node: any, index: number) => {
      const nodeId = `N${index}`;
      const label = includeLabels ? `${node.name}` : `Node ${index + 1}`;
      diagram += `    ${nodeId}[${label}]\n`;
    });

    // Add connections
    if (workflow.connections) {
      Object.entries(workflow.connections).forEach(([fromNode, connections]: [string, any]) => {
        const fromIndex = workflow.nodes.findIndex((n: any) => n.name === fromNode);
        if (fromIndex >= 0 && connections.main) {
          connections.main.forEach((conn: any) => {
            const toIndex = workflow.nodes.findIndex((n: any) => n.name === conn.node);
            if (toIndex >= 0) {
              diagram += `    N${fromIndex} --> N${toIndex}\n`;
            }
          });
        }
      });
    }

    return diagram;
  }

  private generateAsciiDiagram(workflow: any, includeLabels: boolean): string {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return 'Empty Workflow';
    }

    let diagram = '';
    workflow.nodes.forEach((node: any, index: number) => {
      const prefix = index === 0 ? '┌─' : index === workflow.nodes.length - 1 ? '└─' : '├─';
      const label = includeLabels ? node.name : `Node ${index + 1}`;
      diagram += `${prefix} ${label}\n`;
      if (index < workflow.nodes.length - 1) {
        diagram += '│\n';
      }
    });

    return diagram;
  }
}

export function getCreateWorkflowDiagramToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow_diagram',
    description: 'Create visual workflow representations and flowcharts in various formats',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to create diagram for'
        },
        format: {
          type: 'string',
          enum: ['mermaid', 'svg', 'png', 'ascii'],
          description: 'Output format for the diagram (default: mermaid)',
          default: 'mermaid'
        },
        includeLabels: {
          type: 'boolean',
          description: 'Include node labels in the diagram',
          default: true
        },
        includeParameters: {
          type: 'boolean',
          description: 'Include node parameters in the diagram',
          default: false
        },
        theme: {
          type: 'string',
          enum: ['default', 'dark', 'neutral'],
          description: 'Visual theme for the diagram',
          default: 'default'
        }
      },
      required: ['workflowId']
    }
  };
}