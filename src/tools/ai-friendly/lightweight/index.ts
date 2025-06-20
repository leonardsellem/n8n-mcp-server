/**
 * Lightweight Data Access Module
 * 
 * These tools provide condensed, efficient data access methods that reduce
 * cognitive load and processing time for AI models.
 */

import { ToolDefinition, ToolCallResult } from '../../../types/index.js';
import { getEnvConfig } from '../../../config/environment.js';
import { EnhancedN8nApiClient } from '../../../api/enhanced-client.js';

/**
 * Get Workflow Summary Handler
 * Returns condensed workflow overviews with essential info only
 */
export class GetWorkflowSummaryHandler {
  async execute(args: { workflow_id: string; include_stats?: boolean }): Promise<ToolCallResult> {
    try {
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const { workflow_id, include_stats = false } = args;
      
      // Get basic workflow info
      const workflow = await apiClient.getWorkflow(workflow_id);
      
      // Create condensed summary
      const summary: any = {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        node_count: workflow.nodes?.length || 0,
        has_trigger: workflow.nodes?.some((node: any) =>
          node.type?.includes('trigger') || node.type?.includes('webhook')
        ) || false,
        created: workflow.createdAt,
        updated: workflow.updatedAt,
        tags: workflow.tags || []
      };
      
      // Add stats if requested
      if (include_stats) {
        try {
          const executions = await apiClient.getExecutions({ workflowId: workflow_id, limit: 10 });
          const recentExecutions = executions.slice(0, 10);
          
          summary['recent_stats'] = {
            total_executions: recentExecutions.length,
            success_rate: recentExecutions.length > 0 
              ? (recentExecutions.filter((e: any) => e.finished && !e.stoppedAt).length / recentExecutions.length * 100).toFixed(1) + '%'
              : 'No data',
            last_execution: recentExecutions[0]?.startedAt || 'Never',
            avg_duration: 'N/A' // Could calculate if execution data includes duration
          };
        } catch (error) {
          summary['recent_stats'] = { error: 'Unable to fetch execution stats' };
        }
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(summary, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting workflow summary: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Lightweight Workflow List Handler
 * Returns minimal metadata for large workflow lists
 */
export class GetLightweightWorkflowListHandler {
  async execute(args: { 
    limit?: number; 
    active_only?: boolean; 
    include_tags?: boolean;
    folder?: string;
  }): Promise<ToolCallResult> {
    try {
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const { limit = 50, active_only = false, include_tags = false, folder } = args;
      
      // Get workflows with basic filtering
      const workflows = await apiClient.getWorkflows();
      
      let filteredWorkflows = workflows;
      
      // Apply filters
      if (active_only) {
        filteredWorkflows = filteredWorkflows.filter((w: any) => w.active);
      }
      
      if (folder) {
        filteredWorkflows = filteredWorkflows.filter((w: any) => 
          w.folder?.name?.toLowerCase().includes(folder.toLowerCase())
        );
      }
      
      // Limit results
      const limitedWorkflows = filteredWorkflows.slice(0, limit);
      
      // Create lightweight list
      const lightweightList = limitedWorkflows.map((workflow: any) => {
        const item: any = {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          nodes: workflow.nodes?.length || 0,
          updated: workflow.updatedAt
        };
        
        if (include_tags && workflow.tags) {
          item.tags = workflow.tags;
        }
        
        if (workflow.folder) {
          item.folder = workflow.folder.name;
        }
        
        return item;
      });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            workflows: lightweightList,
            metadata: {
              total_shown: lightweightList.length,
              total_available: filteredWorkflows.length,
              filters_applied: {
                active_only,
                folder: folder || null,
                limit
              }
            }
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting lightweight workflow list: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Workflow Quick Stats Handler
 * Returns key metrics without heavy analysis
 */
export class GetWorkflowQuickStatsHandler {
  async execute(args: { workflow_ids?: string[]; summary_only?: boolean }): Promise<ToolCallResult> {
    try {
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const { workflow_ids, summary_only = false } = args;
      
      let workflows;
      if (workflow_ids && workflow_ids.length > 0) {
        // Get specific workflows
        workflows = await Promise.all(
          workflow_ids.map(id => apiClient.getWorkflow(id).catch(() => null))
        );
        workflows = workflows.filter(w => w !== null);
      } else {
        // Get all workflows
        workflows = await apiClient.getWorkflows();
      }
      
      const stats: any = {
        total_workflows: workflows.length,
        active_workflows: workflows.filter((w: any) => w.active).length,
        inactive_workflows: workflows.filter((w: any) => !w.active).length,
        avg_nodes_per_workflow: workflows.length > 0
          ? (workflows.reduce((sum: number, w: any) => sum + (w.nodes?.length || 0), 0) / workflows.length).toFixed(1)
          : 0,
        workflows_with_triggers: workflows.filter((w: any) =>
          w.nodes?.some((node: any) =>
            node.type?.includes('trigger') || node.type?.includes('webhook')
          )
        ).length
      };
      
      if (!summary_only) {
        // Add breakdown by node count
        const nodeCountRanges = {
          '1-5 nodes': 0,
          '6-10 nodes': 0,
          '11-20 nodes': 0,
          '20+ nodes': 0
        };
        
        workflows.forEach((w: any) => {
          const nodeCount = w.nodes?.length || 0;
          if (nodeCount <= 5) nodeCountRanges['1-5 nodes']++;
          else if (nodeCount <= 10) nodeCountRanges['6-10 nodes']++;
          else if (nodeCount <= 20) nodeCountRanges['11-20 nodes']++;
          else nodeCountRanges['20+ nodes']++;
        });
        
        stats['workflow_complexity'] = nodeCountRanges;
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(stats, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting workflow quick stats: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Check Workflow Status Handler
 * Fast status checks for multiple workflows
 */
export class CheckWorkflowStatusHandler {
  async execute(args: { workflow_ids: string[]; include_last_execution?: boolean }): Promise<ToolCallResult> {
    try {
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const { workflow_ids, include_last_execution = false } = args;
      
      // Get workflow statuses in parallel
      const statusChecks = await Promise.allSettled(
        workflow_ids.map(async (id) => {
          try {
            const workflow = await apiClient.getWorkflow(id);
            const result: any = {
              id,
              name: workflow.name,
              active: workflow.active,
              status: workflow.active ? 'active' : 'inactive',
              node_count: workflow.nodes?.length || 0
            };
            
            if (include_last_execution) {
              try {
                const executions = await apiClient.getExecutions({ workflowId: id, limit: 1 });
                if (executions.length > 0) {
                  const lastExecution = executions[0];
                  result.last_execution = {
                    id: lastExecution.id,
                    status: lastExecution.finished ? 'completed' : 'running',
                    started: lastExecution.startedAt,
                    finished: lastExecution.stoppedAt
                  };
                }
              } catch (execError) {
                result.last_execution = { error: 'Unable to fetch execution info' };
              }
            }
            
            return result;
          } catch (error) {
            return {
              id,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );
      
      const results = statusChecks.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            id: workflow_ids[index],
            status: 'error',
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          };
        }
      });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status_checks: results,
            summary: {
              total_checked: workflow_ids.length,
              active: results.filter(r => r.status === 'active').length,
              inactive: results.filter(r => r.status === 'inactive').length,
              errors: results.filter(r => r.status === 'error').length
            }
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error checking workflow status: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Essential Node Info Handler
 * Core node information without overwhelming details
 */
export class GetEssentialNodeInfoHandler {
  async execute(args: { node_type: string; include_examples?: boolean }): Promise<ToolCallResult> {
    try {
      const { node_type, include_examples = false } = args;
      
      // Simulate node info (in real implementation, this would call n8n API)
      const nodeInfo: any = {
        type: node_type,
        category: this.getNodeCategory(node_type),
        description: this.getNodeDescription(node_type),
        input_types: this.getNodeInputTypes(node_type),
        output_types: this.getNodeOutputTypes(node_type),
        required_credentials: this.getRequiredCredentials(node_type),
        key_parameters: this.getKeyParameters(node_type)
      };
      
      if (include_examples) {
        nodeInfo['common_use_cases'] = this.getCommonUseCases(node_type);
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(nodeInfo, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting essential node info: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private getNodeCategory(nodeType: string): string {
    if (nodeType.includes('trigger') || nodeType.includes('webhook')) return 'trigger';
    if (nodeType.includes('http')) return 'communication';
    if (nodeType.includes('database') || nodeType.includes('sql')) return 'database';
    if (nodeType.includes('email')) return 'communication';
    if (nodeType.includes('file')) return 'file-operations';
    return 'utility';
  }
  
  private getNodeDescription(nodeType: string): string {
    // Simplified descriptions for common nodes
    const descriptions: Record<string, string> = {
      'n8n-nodes-base.webhook': 'Receives HTTP requests to trigger workflows',
      'n8n-nodes-base.httpRequest': 'Makes HTTP requests to external APIs',
      'n8n-nodes-base.emailSend': 'Sends emails via SMTP or email services',
      'n8n-nodes-base.function': 'Executes custom JavaScript code',
      'n8n-nodes-base.set': 'Sets or modifies data values',
      'n8n-nodes-base.if': 'Creates conditional logic branches'
    };
    return descriptions[nodeType] || 'Node for workflow automation';
  }
  
  private getNodeInputTypes(nodeType: string): string[] {
    if (nodeType.includes('trigger') || nodeType.includes('webhook')) return [];
    return ['main'];
  }
  
  private getNodeOutputTypes(nodeType: string): string[] {
    if (nodeType.includes('if')) return ['true', 'false'];
    return ['main'];
  }
  
  private getRequiredCredentials(nodeType: string): string[] {
    if (nodeType.includes('email')) return ['smtp'];
    if (nodeType.includes('http') && !nodeType.includes('webhook')) return ['httpBasicAuth', 'apiKey'];
    return [];
  }
  
  private getKeyParameters(nodeType: string): string[] {
    const params: Record<string, string[]> = {
      'n8n-nodes-base.webhook': ['httpMethod', 'path'],
      'n8n-nodes-base.httpRequest': ['url', 'method', 'headers'],
      'n8n-nodes-base.emailSend': ['fromEmail', 'toEmail', 'subject'],
      'n8n-nodes-base.function': ['functionCode'],
      'n8n-nodes-base.set': ['values'],
      'n8n-nodes-base.if': ['conditions']
    };
    return params[nodeType] || ['parameters'];
  }
  
  private getCommonUseCases(nodeType: string): string[] {
    const useCases: Record<string, string[]> = {
      'n8n-nodes-base.webhook': ['API endpoint creation', 'Form submission handling', 'Third-party integrations'],
      'n8n-nodes-base.httpRequest': ['API data fetching', 'External service notifications', 'Data synchronization'],
      'n8n-nodes-base.emailSend': ['Automated notifications', 'Report delivery', 'Alert systems'],
      'n8n-nodes-base.function': ['Data transformation', 'Custom calculations', 'Complex logic implementation']
    };
    return useCases[nodeType] || ['General workflow automation'];
  }
}

// Tool definitions
export function getGetWorkflowSummaryToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_summary',
    description: 'Get condensed workflow overview with essential info only to reduce cognitive load',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to summarize'
        },
        include_stats: {
          type: 'boolean',
          description: 'Whether to include execution statistics',
          default: false
        }
      },
      required: ['workflow_id']
    }
  };
}

export function getGetLightweightWorkflowListToolDefinition(): ToolDefinition {
  return {
    name: 'get_lightweight_workflow_list',
    description: 'Get minimal metadata for large workflow lists to improve processing efficiency',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of workflows to return',
          default: 50
        },
        active_only: {
          type: 'boolean',
          description: 'Only return active workflows',
          default: false
        },
        include_tags: {
          type: 'boolean',
          description: 'Include workflow tags in response',
          default: false
        },
        folder: {
          type: 'string',
          description: 'Filter by folder name'
        }
      },
      required: []
    }
  };
}

export function getGetWorkflowQuickStatsToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_quick_stats',
    description: 'Get key metrics without heavy analysis for fast overview',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific workflow IDs to analyze (optional, analyzes all if not provided)'
        },
        summary_only: {
          type: 'boolean',
          description: 'Return only high-level summary without detailed breakdowns',
          default: false
        }
      },
      required: []
    }
  };
}

export function getCheckWorkflowStatusToolDefinition(): ToolDefinition {
  return {
    name: 'check_workflow_status',
    description: 'Fast status checks for multiple workflows without full data retrieval',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of workflow IDs to check'
        },
        include_last_execution: {
          type: 'boolean',
          description: 'Include information about the last execution',
          default: false
        }
      },
      required: ['workflow_ids']
    }
  };
}

export function getGetEssentialNodeInfoToolDefinition(): ToolDefinition {
  return {
    name: 'get_essential_node_info',
    description: 'Get core node information without overwhelming details',
    inputSchema: {
      type: 'object',
      properties: {
        node_type: {
          type: 'string',
          description: 'Type identifier of the node (e.g., n8n-nodes-base.webhook)'
        },
        include_examples: {
          type: 'boolean',
          description: 'Include common use case examples',
          default: false
        }
      },
      required: ['node_type']
    }
  };
}