/**
 * Bulk Operations Tools
 *
 * Tools for performing bulk operations on workflows and other resources.
 */

import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for bulk workflow operations
 */
export class BulkWorkflowOperationsHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['operation', 'workflowIds']);
      
      const { operation, workflowIds } = args;
      const results = [];
      const errors = [];

      for (const workflowId of workflowIds) {
        try {
          let result;
          switch (operation) {
            case 'activate':
              result = await this.apiService.activateWorkflow(workflowId);
              results.push({ workflowId, operation: 'activate', success: true });
              break;
            
            case 'deactivate':
              result = await this.apiService.deactivateWorkflow(workflowId);
              results.push({ workflowId, operation: 'deactivate', success: true });
              break;
            
            case 'delete':
              result = await this.apiService.deleteWorkflow(workflowId);
              results.push({ workflowId, operation: 'delete', success: true });
              break;
            
            default:
              throw new Error(`Unsupported operation: ${operation}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push({ workflowId, operation, error: errorMessage });
        }
      }

      return this.formatSuccess(
        { 
          successful: results, 
          failed: errors,
          summary: {
            total: workflowIds.length,
            successful: results.length,
            failed: errors.length
          }
        },
        `Bulk ${operation} completed: ${results.length} successful, ${errors.length} failed`
      );
    }, args);
  }
}

/**
 * Handler for searching workflows with advanced filters
 */
export class AdvancedWorkflowSearchHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        namePattern, 
        tags, 
        active, 
        nodeTypes, 
        hasErrors,
        createdAfter,
        createdBefore,
        limit = 50 
      } = args;

      // Get all workflows
      const allWorkflows = await this.apiService.getWorkflows();
      let filteredWorkflows = allWorkflows;

      // Apply filters
      if (namePattern) {
        const regex = new RegExp(namePattern, 'i');
        filteredWorkflows = filteredWorkflows.filter(w => regex.test(w.name));
      }

      if (active !== undefined) {
        filteredWorkflows = filteredWorkflows.filter(w => w.active === active);
      }

      if (tags && tags.length > 0) {
        filteredWorkflows = filteredWorkflows.filter(w => 
          w.tags && tags.some((tag: string) => w.tags.includes(tag))
        );
      }

      if (nodeTypes && nodeTypes.length > 0) {
        filteredWorkflows = filteredWorkflows.filter(w => {
          if (!w.nodes || w.nodes.length === 0) return false;
          return nodeTypes.some((nodeType: string) =>
            w.nodes.some((node: any) => node.type === nodeType)
          );
        });
      }

      if (createdAfter) {
        const afterDate = new Date(createdAfter);
        filteredWorkflows = filteredWorkflows.filter(w => 
          new Date(w.createdAt) > afterDate
        );
      }

      if (createdBefore) {
        const beforeDate = new Date(createdBefore);
        filteredWorkflows = filteredWorkflows.filter(w => 
          new Date(w.createdAt) < beforeDate
        );
      }

      // Limit results
      const results = filteredWorkflows.slice(0, limit);

      const summary = results.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflow.nodes ? workflow.nodes.length : 0,
        tags: workflow.tags || [],
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      }));

      return this.formatSuccess(
        { 
          workflows: summary,
          count: summary.length,
          totalFound: filteredWorkflows.length,
          searchCriteria: {
            namePattern,
            tags,
            active,
            nodeTypes,
            hasErrors,
            createdAfter,
            createdBefore,
            limit
          }
        },
        `Found ${filteredWorkflows.length} workflows matching criteria (showing ${summary.length})`
      );
    }, args);
  }
}

/**
 * Handler for workflow statistics and analytics
 */
export class WorkflowAnalyticsHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { includeExecutions = true, days = 30 } = args;

      // Get all workflows
      const workflows = await this.apiService.getWorkflows();
      
      // Basic workflow stats
      const stats = {
        total: workflows.length,
        active: workflows.filter(w => w.active).length,
        inactive: workflows.filter(w => !w.active).length,
        nodeStats: this.analyzeNodeUsage(workflows),
        tagStats: this.analyzeTagUsage(workflows),
        creationStats: this.analyzeCreationDates(workflows, days)
      };

      let executionStats = null;
      if (includeExecutions) {
        try {
          const executions = await this.apiService.getExecutions({ limit: 1000 });
          executionStats = this.analyzeExecutions(executions, days);
        } catch (error) {
          // Execution analysis is optional
          console.warn('Could not fetch execution statistics:', error);
        }
      }

      return this.formatSuccess(
        { 
          workflowStats: stats,
          executionStats,
          analysisDate: new Date().toISOString(),
          analysisPeriod: `${days} days`
        },
        `Analytics completed for ${workflows.length} workflows`
      );
    }, args);
  }

  private analyzeNodeUsage(workflows: any[]) {
    const nodeTypeCount: Record<string, number> = {};
    let totalNodes = 0;

    workflows.forEach(workflow => {
      if (workflow.nodes) {
        workflow.nodes.forEach((node: any) => {
          nodeTypeCount[node.type] = (nodeTypeCount[node.type] || 0) + 1;
          totalNodes++;
        });
      }
    });

    const sortedNodeTypes = Object.entries(nodeTypeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10 most used node types

    return {
      totalNodes,
      uniqueNodeTypes: Object.keys(nodeTypeCount).length,
      mostUsedNodeTypes: sortedNodeTypes.map(([type, count]) => ({ type, count }))
    };
  }

  private analyzeTagUsage(workflows: any[]) {
    const tagCount: Record<string, number> = {};
    
    workflows.forEach(workflow => {
      if (workflow.tags) {
        workflow.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    const sortedTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a);

    return {
      totalTags: Object.keys(tagCount).length,
      tagUsage: sortedTags.map(([tag, count]) => ({ tag, count }))
    };
  }

  private analyzeCreationDates(workflows: any[], days: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentWorkflows = workflows.filter(w => 
      new Date(w.createdAt) > cutoffDate
    );

    return {
      createdInPeriod: recentWorkflows.length,
      totalWorkflows: workflows.length,
      creationRate: recentWorkflows.length / days
    };
  }

  private analyzeExecutions(executions: any[], days: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentExecutions = executions.filter(e => 
      new Date(e.startedAt) > cutoffDate
    );

    const byStatus = {
      success: recentExecutions.filter(e => e.finished && !e.stoppedAt).length,
      error: recentExecutions.filter(e => e.stoppedAt).length,
      running: recentExecutions.filter(e => !e.finished && !e.stoppedAt).length
    };

    return {
      totalExecutions: recentExecutions.length,
      executionsByStatus: byStatus,
      dailyAverage: recentExecutions.length / days,
      successRate: byStatus.success / (byStatus.success + byStatus.error) * 100
    };
  }
}

// Tool definitions
export function getBulkWorkflowOperationsToolDefinition(): ToolDefinition {
  return {
    name: 'bulk_workflow_operations',
    description: 'Perform bulk operations on multiple workflows (activate, deactivate, delete)',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['activate', 'deactivate', 'delete'],
          description: 'Operation to perform on all workflows'
        },
        workflowIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of workflow IDs to operate on'
        }
      },
      required: ['operation', 'workflowIds']
    }
  };
}

export function getAdvancedWorkflowSearchToolDefinition(): ToolDefinition {
  return {
    name: 'advanced_workflow_search',
    description: 'Search workflows with advanced filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        namePattern: {
          type: 'string',
          description: 'Regex pattern to match workflow names'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to filter by'
        },
        active: {
          type: 'boolean',
          description: 'Filter by active/inactive status'
        },
        nodeTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter workflows containing specific node types'
        },
        hasErrors: {
          type: 'boolean',
          description: 'Filter workflows with execution errors'
        },
        createdAfter: {
          type: 'string',
          description: 'ISO date string - filter workflows created after this date'
        },
        createdBefore: {
          type: 'string',
          description: 'ISO date string - filter workflows created before this date'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 50
        }
      },
      required: []
    }
  };
}

export function getWorkflowAnalyticsToolDefinition(): ToolDefinition {
  return {
    name: 'workflow_analytics',
    description: 'Get comprehensive analytics and statistics about workflows and executions',
    inputSchema: {
      type: 'object',
      properties: {
        includeExecutions: {
          type: 'boolean',
          description: 'Include execution statistics in the analysis',
          default: true
        },
        days: {
          type: 'number',
          description: 'Number of days to analyze for trends',
          default: 30
        }
      },
      required: []
    }
  };
}