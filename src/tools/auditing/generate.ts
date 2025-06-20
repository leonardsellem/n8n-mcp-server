/**
 * Generate Audit Tool
 * 
 * This tool generates a security audit for n8n workflows and configurations.
 */

import { BaseAuditingToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the generate_audit tool
 */
export class GenerateAuditHandler extends BaseAuditingToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing audit options
   * @returns Audit report
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        additionalOptions = {},
        daysAbandonedWorkflow = 30,
        categories = ['security', 'performance', 'compliance']
      } = args;
      
      // Merge additional options with defaults
      const auditOptions = {
        daysAbandonedWorkflow,
        categories,
        ...additionalOptions
      };
      
      // Generate the audit using direct API call
      const response = await this.apiService.getAxiosInstance().post('/audit', auditOptions);
      const auditReport = response.data;
      
      return this.formatSuccess(
        auditReport,
        'Security audit generated successfully'
      );
    }, args);
  }
}

/**
 * Get tool definition for the generate_audit tool
 * 
 * @returns Tool definition
 */
export function getGenerateAuditToolDefinition(): ToolDefinition {
  return {
    name: 'generate_audit',
    description: 'Generate a comprehensive security audit for n8n workflows and configurations',
    inputSchema: {
      type: 'object',
      properties: {
        daysAbandonedWorkflow: {
          type: 'number',
          description: 'Number of days to consider a workflow abandoned',
          default: 30,
        },
        categories: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Categories to include in the audit',
          default: ['security', 'performance', 'compliance'],
        },
        additionalOptions: {
          type: 'object',
          description: 'Additional audit options',
          properties: {
            includeCredentials: {
              type: 'boolean',
              description: 'Include credential security analysis',
              default: true,
            },
            includeWorkflows: {
              type: 'boolean',
              description: 'Include workflow security analysis',
              default: true,
            },
            includeExecutions: {
              type: 'boolean',
              description: 'Include execution history analysis',
              default: false,
            },
          },
        },
      },
      required: [],
    },
  };
}

/**
 * Create and export the generate audit tool
 */
export const generateAuditTool = {
  definition: getGenerateAuditToolDefinition(),
  handler: GenerateAuditHandler,
};
