/**
 * Documentation & Knowledge Management Base Handler
 * 
 * Base class for all documentation and knowledge management tool handlers.
 */

import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { ToolCallResult } from '../../types/index.js';
import { getEnvConfig } from '../../config/environment.js';

export abstract class DocumentationBaseHandler extends BaseWorkflowToolHandler {
  protected client: EnhancedN8nApiClient;

  constructor() {
    super();
    const config = getEnvConfig();
    this.client = new EnhancedN8nApiClient(config);
  }

  /**
   * Validate documentation parameters
   */
  protected validateDocumentationParams(params: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }

  /**
   * Handle documentation API errors
   */
  protected handleDocumentationError(error: any, operation: string): ToolCallResult {
    console.error(`Documentation ${operation} error:`, error);
    return {
      content: [{
        type: 'text',
        text: `Documentation ${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }

  /**
   * Format documentation response
   */
  protected formatDocumentationResponse(data: any, message: string): ToolCallResult {
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
   * Extract workflow metadata for documentation
   */
  protected extractWorkflowMetadata(workflow: any): any {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || 'No description provided',
      active: workflow.active,
      created: workflow.createdAt,
      modified: workflow.updatedAt,
      author: workflow.createdBy || 'Unknown',
      tags: workflow.tags || [],
      folder: workflow.folder,
      nodeCount: workflow.nodes?.length || 0,
      triggerCount: this.countTriggerNodes(workflow),
      complexity: this.assessComplexity(workflow)
    };
  }

  /**
   * Count trigger nodes in workflow
   */
  private countTriggerNodes(workflow: any): number {
    if (!workflow.nodes) return 0;
    
    const triggerTypes = [
      'n8n-nodes-base.webhook',
      'n8n-nodes-base.cron',
      'n8n-nodes-base.trigger',
      'n8n-nodes-base.manualTrigger'
    ];

    return workflow.nodes.filter((node: any) => 
      triggerTypes.some(type => node.type.includes(type))
    ).length;
  }

  /**
   * Assess workflow complexity
   */
  protected assessComplexity(workflow: any): 'low' | 'medium' | 'high' {
    const nodeCount = workflow.nodes?.length || 0;
    const connectionCount = Object.keys(workflow.connections || {}).length;
    
    if (nodeCount <= 5 && connectionCount <= 5) {
      return 'low';
    } else if (nodeCount <= 15 && connectionCount <= 15) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Generate workflow description from nodes
   */
  protected generateWorkflowDescription(workflow: any): string {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return 'Empty workflow with no nodes.';
    }

    const nodeTypes = workflow.nodes.map((node: any) => this.getNodeTypeDescription(node.type));
    const uniqueTypes = [...new Set(nodeTypes)];

    let description = `This workflow contains ${workflow.nodes.length} nodes and performs the following operations: `;
    description += uniqueTypes.join(', ') + '.';

    // Add trigger information
    const triggerNodes = workflow.nodes.filter((node: any) => 
      node.type.includes('webhook') || node.type.includes('cron') || node.type.includes('trigger')
    );

    if (triggerNodes.length > 0) {
      description += ` It is triggered by ${triggerNodes.length} trigger(s).`;
    }

    return description;
  }

  /**
   * Get human-readable description for node type
   */
  protected getNodeTypeDescription(nodeType: string): string {
    const descriptions: Record<string, string> = {
      'n8n-nodes-base.webhook': 'webhook handling',
      'n8n-nodes-base.httpRequest': 'HTTP API calls',
      'n8n-nodes-base.set': 'data transformation',
      'n8n-nodes-base.function': 'custom JavaScript logic',
      'n8n-nodes-base.code': 'custom code execution',
      'n8n-nodes-base.if': 'conditional branching',
      'n8n-nodes-base.switch': 'multi-way branching',
      'n8n-nodes-base.emailSend': 'email sending',
      'n8n-nodes-base.spreadsheetFile': 'spreadsheet operations',
      'n8n-nodes-base.cron': 'scheduled execution',
      'n8n-nodes-base.merge': 'data merging',
      'n8n-nodes-base.split': 'data splitting'
    };

    return descriptions[nodeType] || 'data processing';
  }

  /**
   * Generate node documentation
   */
  protected generateNodeDocumentation(node: any): any {
    return {
      name: node.name,
      type: node.type,
      description: this.getNodeTypeDescription(node.type),
      position: node.position || [0, 0],
      parameters: this.sanitizeNodeParameters(node.parameters || {}),
      credentials: node.credentials || [],
      connections: {
        incoming: this.getIncomingConnections(node),
        outgoing: this.getOutgoingConnections(node)
      }
    };
  }

  /**
   * Sanitize node parameters for documentation
   */
  private sanitizeNodeParameters(parameters: any): any {
    const sanitized = { ...parameters };
    
    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'api_key'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Get incoming connections for a node
   */
  private getIncomingConnections(node: any): string[] {
    // This would be implemented based on workflow connection data
    return [];
  }

  /**
   * Get outgoing connections for a node
   */
  private getOutgoingConnections(node: any): string[] {
    // This would be implemented based on workflow connection data
    return [];
  }

  /**
   * Format markdown content
   */
  protected formatMarkdown(content: string): string {
    // Basic markdown formatting improvements
    return content
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks
      .replace(/^#\s+/gm, '# ') // Ensure proper heading spacing
      .trim();
  }

  /**
   * Generate table of contents
   */
  protected generateTableOfContents(headings: string[]): string {
    let toc = '## Table of Contents\n\n';
    
    headings.forEach((heading, index) => {
      const anchor = heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc += `${index + 1}. [${heading}](#${anchor})\n`;
    });

    return toc + '\n';
  }
}