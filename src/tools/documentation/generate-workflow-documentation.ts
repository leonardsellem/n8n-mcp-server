/**
 * Generate Workflow Documentation Tool
 * 
 * Tool for auto-generating comprehensive workflow documentation.
 */

import { DocumentationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface GenerateDocumentationArgs {
  workflowId?: string;
  format?: 'markdown' | 'html' | 'pdf' | 'json';
  includeNodeDetails?: boolean;
  includeExecutionHistory?: boolean;
  includeCredentials?: boolean;
  includePerformanceMetrics?: boolean;
  templateStyle?: 'basic' | 'detailed' | 'technical' | 'user_guide';
  outputPath?: string;
}

interface WorkflowDocumentation {
  metadata: any;
  overview: string;
  nodeDocumentation: any[];
  workflowDiagram: string;
  executionFlow: string;
  configuration: any;
  troubleshooting: string[];
  bestPractices: string[];
  performanceMetrics?: any;
  executionHistory?: any[];
  changeLog?: any[];
}

export class GenerateWorkflowDocumentationHandler extends DocumentationBaseHandler {
  async execute(args: GenerateDocumentationArgs): Promise<ToolCallResult> {
    try {
      const {
        workflowId,
        format = 'markdown',
        includeNodeDetails = true,
        includeExecutionHistory = false,
        includeCredentials = false,
        includePerformanceMetrics = false,
        templateStyle = 'detailed',
        outputPath
      } = args;

      let workflowsToDocument: any[] = [];

      if (workflowId) {
        const workflow = await this.getWorkflow(workflowId);
        if (!workflow) {
          return this.formatError(`Workflow ${workflowId} not found`);
        }
        workflowsToDocument = [workflow];
      } else {
        workflowsToDocument = await this.getAllActiveWorkflows();
      }

      const documentations: Array<{ workflowId: string; documentation: any; content: string }> = [];

      for (const workflow of workflowsToDocument) {
        const documentation = await this.generateDocumentation(
          workflow,
          includeNodeDetails,
          includeExecutionHistory,
          includeCredentials,
          includePerformanceMetrics,
          templateStyle
        );

        const content = await this.formatDocumentation(documentation, format);
        
        documentations.push({
          workflowId: workflow.id,
          documentation,
          content
        });

        // Save to file if output path specified
        if (outputPath) {
          await this.saveDocumentation(workflow, content, format, outputPath);
        }
      }

      return this.formatDocumentationResponse(
        {
          generatedDocuments: documentations.length,
          format,
          templateStyle,
          documentations: documentations.map(d => ({
            workflowId: d.workflowId,
            size: d.content.length,
            preview: d.content.substring(0, 200) + '...'
          }))
        },
        `Generated documentation for ${documentations.length} workflow(s)`
      );

    } catch (error) {
      return this.handleDocumentationError(error, 'generate workflow documentation');
    }
  }

  private async getWorkflow(workflowId: string): Promise<any> {
    // Mock workflow data
    return {
      id: workflowId,
      name: 'User Registration Workflow',
      description: 'Handles new user registrations and sends welcome emails',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      createdBy: 'admin',
      tags: ['user-management', 'email', 'registration'],
      folder: 'production',
      nodes: [
        {
          name: 'Registration Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [100, 100],
          parameters: {
            httpMethod: 'POST',
            path: '/register',
            responseMode: 'responseNode'
          }
        },
        {
          name: 'Validate User Data',
          type: 'n8n-nodes-base.function',
          position: [300, 100],
          parameters: {
            functionCode: 'return items.map(item => ({ ...item.json, validated: true }));'
          }
        },
        {
          name: 'Save to Database',
          type: 'n8n-nodes-base.httpRequest',
          position: [500, 100],
          parameters: {
            url: 'https://api.example.com/users',
            method: 'POST'
          }
        },
        {
          name: 'Send Welcome Email',
          type: 'n8n-nodes-base.emailSend',
          position: [700, 100],
          parameters: {
            subject: 'Welcome to our platform!',
            fromEmail: 'welcome@example.com'
          }
        }
      ],
      connections: {
        'Registration Webhook': {
          main: [{ node: 'Validate User Data', type: 'main', index: 0 }]
        },
        'Validate User Data': {
          main: [{ node: 'Save to Database', type: 'main', index: 0 }]
        },
        'Save to Database': {
          main: [{ node: 'Send Welcome Email', type: 'main', index: 0 }]
        }
      }
    };
  }

  private async getAllActiveWorkflows(): Promise<any[]> {
    // Mock multiple workflows
    return [await this.getWorkflow('workflow1')];
  }

  private async generateDocumentation(
    workflow: any,
    includeNodeDetails: boolean,
    includeExecutionHistory: boolean,
    includeCredentials: boolean,
    includePerformanceMetrics: boolean,
    templateStyle: string
  ): Promise<WorkflowDocumentation> {

    const metadata = this.extractWorkflowMetadata(workflow);
    const overview = this.generateWorkflowOverview(workflow, templateStyle);
    const nodeDocumentation = includeNodeDetails ? this.generateNodesDocumentation(workflow) : [];
    const workflowDiagram = this.generateTextDiagram(workflow);
    const executionFlow = this.generateExecutionFlow(workflow);
    const configuration = this.generateConfigurationSection(workflow, includeCredentials);
    const troubleshooting = this.generateTroubleshootingSection(workflow);
    const bestPractices = this.generateBestPracticesSection(workflow);

    const documentation: WorkflowDocumentation = {
      metadata,
      overview,
      nodeDocumentation,
      workflowDiagram,
      executionFlow,
      configuration,
      troubleshooting,
      bestPractices
    };

    if (includePerformanceMetrics) {
      documentation.performanceMetrics = await this.getPerformanceMetrics(workflow.id);
    }

    if (includeExecutionHistory) {
      documentation.executionHistory = await this.getExecutionHistory(workflow.id);
    }

    return documentation;
  }

  private generateWorkflowOverview(workflow: any, templateStyle: string): string {
    let overview = this.generateWorkflowDescription(workflow);

    if (templateStyle === 'detailed' || templateStyle === 'technical') {
      overview += `\n\n**Purpose**: ${workflow.description || 'No description provided'}`;
      overview += `\n\n**Status**: ${workflow.active ? 'Active' : 'Inactive'}`;
      overview += `\n\n**Complexity**: ${this.assessComplexity(workflow)}`;
      
      if (workflow.tags && workflow.tags.length > 0) {
        overview += `\n\n**Tags**: ${workflow.tags.join(', ')}`;
      }
    }

    if (templateStyle === 'user_guide') {
      overview += '\n\n**What this workflow does**:\n';
      overview += this.generateUserFriendlyDescription(workflow);
    }

    return overview;
  }

  private generateUserFriendlyDescription(workflow: any): string {
    // Generate user-friendly description based on node types
    const descriptions = [];
    
    if (workflow.nodes.some((n: any) => n.type.includes('webhook'))) {
      descriptions.push('- Receives data from external systems via webhooks');
    }
    
    if (workflow.nodes.some((n: any) => n.type.includes('email'))) {
      descriptions.push('- Sends email notifications');
    }
    
    if (workflow.nodes.some((n: any) => n.type.includes('http'))) {
      descriptions.push('- Communicates with external APIs');
    }
    
    if (workflow.nodes.some((n: any) => n.type.includes('function') || n.type.includes('set'))) {
      descriptions.push('- Processes and transforms data');
    }

    return descriptions.join('\n');
  }

  private generateNodesDocumentation(workflow: any): any[] {
    if (!workflow.nodes) return [];
    
    return workflow.nodes.map((node: any) => this.generateNodeDocumentation(node));
  }

  private generateTextDiagram(workflow: any): string {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return 'No nodes in workflow';
    }

    let diagram = '```\n';
    diagram += 'Workflow Flow:\n\n';
    
    // Simple text representation
    for (let i = 0; i < workflow.nodes.length; i++) {
      const node = workflow.nodes[i];
      const prefix = i === 0 ? '┌─' : i === workflow.nodes.length - 1 ? '└─' : '├─';
      diagram += `${prefix} ${node.name} (${this.getNodeTypeDescription(node.type)})\n`;
      
      if (i < workflow.nodes.length - 1) {
        diagram += '│\n';
      }
    }
    
    diagram += '```';
    return diagram;
  }

  private generateExecutionFlow(workflow: any): string {
    let flow = '## Execution Flow\n\n';
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return flow + 'No execution flow available - workflow has no nodes.';
    }

    flow += '1. **Trigger**: The workflow starts when ';
    
    const triggerNodes = workflow.nodes.filter((n: any) => 
      n.type.includes('webhook') || n.type.includes('cron') || n.type.includes('trigger')
    );
    
    if (triggerNodes.length > 0) {
      flow += `${triggerNodes[0].name} receives data or is activated.\n`;
    } else {
      flow += 'manually started or triggered by another workflow.\n';
    }

    // Generate step-by-step flow
    workflow.nodes.forEach((node: any, index: number) => {
      if (index > 0) { // Skip first node as it's covered in trigger
        flow += `${index + 1}. **${node.name}**: ${this.getNodeActionDescription(node)}\n`;
      }
    });

    return flow;
  }

  private getNodeActionDescription(node: any): string {
    const descriptions: Record<string, string> = {
      'n8n-nodes-base.function': 'Executes custom JavaScript code to process data',
      'n8n-nodes-base.httpRequest': 'Makes HTTP request to external API',
      'n8n-nodes-base.emailSend': 'Sends email notification',
      'n8n-nodes-base.set': 'Transforms and sets data properties',
      'n8n-nodes-base.if': 'Evaluates condition and branches execution',
      'n8n-nodes-base.webhook': 'Receives HTTP request from external source'
    };

    return descriptions[node.type] || 'Processes data';
  }

  private generateConfigurationSection(workflow: any, includeCredentials: boolean): any {
    const config: any = {
      workflowSettings: {
        active: workflow.active,
        errorWorkflow: workflow.settings?.errorWorkflow || 'None',
        timezone: workflow.settings?.timezone || 'UTC'
      },
      nodes: workflow.nodes?.length || 0,
      connections: Object.keys(workflow.connections || {}).length
    };

    if (includeCredentials) {
      config.credentials = this.extractCredentialInfo(workflow);
    }

    return config;
  }

  private extractCredentialInfo(workflow: any): string[] {
    const credentials = new Set<string>();
    
    if (workflow.nodes) {
      workflow.nodes.forEach((node: any) => {
        if (node.credentials) {
          Object.keys(node.credentials).forEach(cred => credentials.add(cred));
        }
      });
    }
    
    return Array.from(credentials);
  }

  private generateTroubleshootingSection(workflow: any): string[] {
    const tips = [
      'Check that all required credentials are configured and valid',
      'Verify that webhook URLs are accessible if using webhook triggers',
      'Monitor execution history for error patterns',
      'Ensure all HTTP requests have proper error handling'
    ];

    // Add specific tips based on node types
    if (workflow.nodes?.some((n: any) => n.type.includes('email'))) {
      tips.push('Verify SMTP settings and email credentials for email nodes');
    }

    if (workflow.nodes?.some((n: any) => n.type.includes('http'))) {
      tips.push('Check API endpoints and authentication for HTTP request nodes');
    }

    return tips;
  }

  private generateBestPracticesSection(workflow: any): string[] {
    const practices = [
      'Add descriptive names to all nodes',
      'Include error handling for external API calls',
      'Use Set nodes instead of Function nodes for simple data transformations',
      'Test workflow thoroughly before activating in production'
    ];

    // Add specific practices based on complexity
    const complexity = this.assessComplexity(workflow);
    if (complexity === 'high') {
      practices.push('Consider breaking complex workflows into smaller sub-workflows');
      practices.push('Add comments and documentation for complex logic');
    }

    return practices;
  }

  private async getPerformanceMetrics(workflowId: string): Promise<any> {
    // Mock performance metrics
    return {
      averageExecutionTime: '2.5 seconds',
      successRate: '98.5%',
      totalExecutions: 1250,
      lastExecution: '2024-01-15T14:30:00Z',
      errorRate: '1.5%'
    };
  }

  private async getExecutionHistory(workflowId: string): Promise<any[]> {
    // Mock execution history
    return [
      {
        id: 'exec1',
        startedAt: '2024-01-15T14:30:00Z',
        finishedAt: '2024-01-15T14:30:03Z',
        status: 'success',
        mode: 'webhook'
      },
      {
        id: 'exec2',
        startedAt: '2024-01-15T13:15:00Z',
        finishedAt: '2024-01-15T13:15:02Z',
        status: 'success',
        mode: 'webhook'
      }
    ];
  }

  private async formatDocumentation(documentation: WorkflowDocumentation, format: string): Promise<string> {
    switch (format) {
      case 'markdown':
        return this.formatAsMarkdown(documentation);
      case 'html':
        return this.formatAsHtml(documentation);
      case 'json':
        return JSON.stringify(documentation, null, 2);
      default:
        return this.formatAsMarkdown(documentation);
    }
  }

  private formatAsMarkdown(doc: WorkflowDocumentation): string {
    let md = `# ${doc.metadata.name}\n\n`;
    
    md += `**Description**: ${doc.metadata.description}\n\n`;
    md += `**Status**: ${doc.metadata.active ? 'Active' : 'Inactive'}\n\n`;
    md += `**Last Modified**: ${doc.metadata.modified}\n\n`;
    
    md += `## Overview\n\n${doc.overview}\n\n`;
    
    md += `## Workflow Diagram\n\n${doc.workflowDiagram}\n\n`;
    
    md += `${doc.executionFlow}\n\n`;
    
    if (doc.nodeDocumentation.length > 0) {
      md += `## Node Documentation\n\n`;
      doc.nodeDocumentation.forEach(node => {
        md += `### ${node.name}\n\n`;
        md += `- **Type**: ${node.type}\n`;
        md += `- **Description**: ${node.description}\n`;
        if (Object.keys(node.parameters).length > 0) {
          md += `- **Parameters**: ${JSON.stringify(node.parameters, null, 2)}\n`;
        }
        md += '\n';
      });
    }
    
    md += `## Configuration\n\n\`\`\`json\n${JSON.stringify(doc.configuration, null, 2)}\n\`\`\`\n\n`;
    
    md += `## Troubleshooting\n\n`;
    doc.troubleshooting.forEach(tip => {
      md += `- ${tip}\n`;
    });
    md += '\n';
    
    md += `## Best Practices\n\n`;
    doc.bestPractices.forEach(practice => {
      md += `- ${practice}\n`;
    });
    
    return this.formatMarkdown(md);
  }

  private formatAsHtml(doc: WorkflowDocumentation): string {
    // Basic HTML conversion
    const markdown = this.formatAsMarkdown(doc);
    return `<!DOCTYPE html>
<html>
<head>
    <title>${doc.metadata.name} - Workflow Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1, h2, h3 { color: #333; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 2px; }
    </style>
</head>
<body>
    ${markdown.replace(/\n/g, '<br>').replace(/```/g, '<pre>').replace(/`([^`]+)`/g, '<code>$1</code>')}
</body>
</html>`;
  }

  private async saveDocumentation(workflow: any, content: string, format: string, outputPath: string): Promise<void> {
    // Mock file saving
    const filename = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}_documentation.${format}`;
    console.log(`Saving documentation to ${outputPath}/${filename}`);
  }

  

  
}

export function getGenerateWorkflowDocumentationToolDefinition(): ToolDefinition {
  return {
    name: 'generate_workflow_documentation',
    description: 'Auto-generate comprehensive workflow documentation with multiple output formats',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to document (if not provided, documents all active workflows)'
        },
        format: {
          type: 'string',
          enum: ['markdown', 'html', 'pdf', 'json'],
          description: 'Output format for documentation (default: markdown)',
          default: 'markdown'
        },
        includeNodeDetails: {
          type: 'boolean',
          description: 'Include detailed documentation for each node',
          default: true
        },
        includeExecutionHistory: {
          type: 'boolean',
          description: 'Include recent execution history in documentation',
          default: false
        },
        includeCredentials: {
          type: 'boolean',
          description: 'Include credential information (names only, no sensitive data)',
          default: false
        },
        includePerformanceMetrics: {
          type: 'boolean',
          description: 'Include performance metrics and statistics',
          default: false
        },
        templateStyle: {
          type: 'string',
          enum: ['basic', 'detailed', 'technical', 'user_guide'],
          description: 'Documentation template style (default: detailed)',
          default: 'detailed'
        },
        outputPath: {
          type: 'string',
          description: 'Optional file path to save documentation'
        }
      },
      required: []
    }
  };
}