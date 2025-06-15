/**
 * Export Workflow Knowledge Base Tool
 * 
 * Tool for creating searchable documentation databases.
 */

import { DocumentationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface ExportKnowledgeBaseArgs {
  format?: 'json' | 'markdown' | 'html';
  includeExecutionData?: boolean;
  searchableIndex?: boolean;
}

export class ExportWorkflowKnowledgeBaseHandler extends DocumentationBaseHandler {
  async execute(args: ExportKnowledgeBaseArgs): Promise<ToolCallResult> {
    try {
      const { format = 'json', includeExecutionData = false, searchableIndex = true } = args;

      const workflows = await this.getAllWorkflows();
      const knowledgeBase = await this.buildKnowledgeBase(workflows, includeExecutionData, searchableIndex);

      return this.formatDocumentationResponse(
        { format, knowledgeBase, totalWorkflows: workflows.length },
        `Exported knowledge base for ${workflows.length} workflows`
      );

    } catch (error) {
      return this.handleDocumentationError(error, 'export workflow knowledge base');
    }
  }

  private async getAllWorkflows(): Promise<any[]> {
    // Mock workflow data
    return [
      { id: 'wf1', name: 'User Registration', nodes: [{ type: 'webhook' }, { type: 'email' }] },
      { id: 'wf2', name: 'Data Processing', nodes: [{ type: 'cron' }, { type: 'http' }] }
    ];
  }

  private async buildKnowledgeBase(workflows: any[], includeExecutionData: boolean, searchableIndex: boolean): Promise<any> {
    const knowledgeBase = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalWorkflows: workflows.length,
        searchable: searchableIndex
      },
      workflows: workflows.map(workflow => this.extractWorkflowMetadata(workflow)),
      searchIndex: searchableIndex ? this.buildSearchIndex(workflows) : null
    };

    return knowledgeBase;
  }

  private buildSearchIndex(workflows: any[]): any {
    const index: any = {
      terms: {},
      workflows: {}
    };

    workflows.forEach(workflow => {
      const terms = [workflow.name, ...workflow.nodes.map((n: any) => n.type)];
      terms.forEach(term => {
        if (!index.terms[term]) index.terms[term] = [];
        index.terms[term].push(workflow.id);
      });
      index.workflows[workflow.id] = workflow.name;
    });

    return index;
  }
}

export function getExportWorkflowKnowledgeBaseToolDefinition(): ToolDefinition {
  return {
    name: 'export_workflow_knowledge_base',
    description: 'Create searchable documentation databases from workflow data',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['json', 'markdown', 'html'],
          description: 'Export format (default: json)',
          default: 'json'
        },
        includeExecutionData: {
          type: 'boolean',
          description: 'Include execution history in knowledge base',
          default: false
        },
        searchableIndex: {
          type: 'boolean',
          description: 'Build searchable index for workflows',
          default: true
        }
      },
      required: []
    }
  };
}