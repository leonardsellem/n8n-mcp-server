/**
 * AI Context Management Module
 * 
 * These tools help AI models maintain context between sessions
 * and quickly restore working state for continued tasks.
 */

import { ToolDefinition, ToolCallResult } from '../../../types/index.js';
import { getEnvConfig } from '../../../config/environment.js';
import { EnhancedN8nApiClient } from '../../../api/enhanced-client.js';

// In-memory storage for AI context (in production, this could be persisted)
const AI_CONTEXT_STORAGE = new Map<string, any>();
const BOOKMARKED_WORKFLOWS = new Set<string>();

/**
 * Save Workflow Context Handler
 * Save AI session context about current workflows
 */
export class SaveWorkflowContextHandler {
  async execute(args: { 
    context_id: string; 
    workflow_ids: string[]; 
    notes?: string; 
    session_data?: any;
    tags?: string[];
  }): Promise<ToolCallResult> {
    try {
      const { context_id, workflow_ids, notes, session_data, tags = [] } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      // Get basic info about the workflows to save with context
      const workflowSummaries = await Promise.allSettled(
        workflow_ids.map(async (id) => {
          try {
            const workflow = await apiClient.getWorkflow(id);
            return {
              id,
              name: workflow.name,
              active: workflow.active,
              node_count: workflow.nodes?.length || 0,
              last_updated: workflow.updatedAt
            };
          } catch (error) {
            return {
              id,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );
      
      const contextData = {
        context_id,
        created_at: new Date().toISOString(),
        workflow_ids,
        workflow_summaries: workflowSummaries.map(result => 
          result.status === 'fulfilled' ? result.value : result.reason
        ),
        notes: notes || '',
        session_data: session_data || {},
        tags,
        last_accessed: new Date().toISOString()
      };
      
      AI_CONTEXT_STORAGE.set(context_id, contextData);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: 'Context saved successfully',
            context_id,
            workflows_saved: workflow_ids.length,
            created_at: contextData.created_at
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error saving workflow context: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Restore Workflow Context Handler
 * Restore previous working context to continue tasks
 */
export class RestoreWorkflowContextHandler {
  async execute(args: { context_id?: string; list_contexts?: boolean }): Promise<ToolCallResult> {
    try {
      const { context_id, list_contexts = false } = args;
      
      if (list_contexts) {
        // List all available contexts
        const contexts = Array.from(AI_CONTEXT_STORAGE.entries()).map(([id, data]) => ({
          context_id: id,
          created_at: data.created_at,
          workflow_count: data.workflow_ids.length,
          notes: data.notes,
          tags: data.tags,
          last_accessed: data.last_accessed
        }));
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              available_contexts: contexts,
              total_contexts: contexts.length
            }, null, 2)
          }],
          isError: false
        };
      }
      
      if (!context_id) {
        return {
          content: [{
            type: 'text',
            text: 'Error: context_id is required when not listing contexts'
          }],
          isError: true
        };
      }
      
      const contextData = AI_CONTEXT_STORAGE.get(context_id);
      if (!contextData) {
        return {
          content: [{
            type: 'text',
            text: `Context not found: ${context_id}`
          }],
          isError: true
        };
      }
      
      // Update last accessed time
      contextData.last_accessed = new Date().toISOString();
      AI_CONTEXT_STORAGE.set(context_id, contextData);
      
      // Get current status of workflows in the context
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const currentStatus = await Promise.allSettled(
        contextData.workflow_ids.map(async (id: string) => {
          try {
            const workflow = await apiClient.getWorkflow(id);
            return {
              id,
              name: workflow.name,
              active: workflow.active,
              last_updated: workflow.updatedAt
            };
          } catch (error) {
            return {
              id,
              status: 'not_found',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            context_restored: {
              context_id,
              created_at: contextData.created_at,
              notes: contextData.notes,
              session_data: contextData.session_data,
              tags: contextData.tags,
              last_accessed: contextData.last_accessed
            },
            workflows: {
              saved_summaries: contextData.workflow_summaries,
              current_status: currentStatus.map(result => 
                result.status === 'fulfilled' ? result.value : result.reason
              )
            }
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error restoring workflow context: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Bookmark Workflows Handler
 * Mark frequently accessed workflows for quick reference
 */
export class BookmarkWorkflowsHandler {
  async execute(args: { 
    action: 'add' | 'remove' | 'list'; 
    workflow_ids?: string[]; 
    include_details?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { action, workflow_ids = [], include_details = false } = args;
      
      if (action === 'add') {
        workflow_ids.forEach(id => BOOKMARKED_WORKFLOWS.add(id));
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: 'Workflows bookmarked successfully',
              added: workflow_ids,
              total_bookmarks: BOOKMARKED_WORKFLOWS.size
            }, null, 2)
          }],
          isError: false
        };
      }
      
      if (action === 'remove') {
        workflow_ids.forEach(id => BOOKMARKED_WORKFLOWS.delete(id));
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: 'Workflows removed from bookmarks',
              removed: workflow_ids,
              total_bookmarks: BOOKMARKED_WORKFLOWS.size
            }, null, 2)
          }],
          isError: false
        };
      }
      
      if (action === 'list') {
        const bookmarkedIds = Array.from(BOOKMARKED_WORKFLOWS);
        
        if (!include_details) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                bookmarked_workflows: bookmarkedIds,
                total_bookmarks: bookmarkedIds.length
              }, null, 2)
            }],
            isError: false
          };
        }
        
        // Get detailed info about bookmarked workflows
        const envConfig = getEnvConfig();
        const apiClient = new EnhancedN8nApiClient(envConfig);
        
        const bookmarkDetails = await Promise.allSettled(
          bookmarkedIds.map(async (id) => {
            try {
              const workflow = await apiClient.getWorkflow(id);
              return {
                id,
                name: workflow.name,
                active: workflow.active,
                node_count: workflow.nodes?.length || 0,
                updated: workflow.updatedAt
              };
            } catch (error) {
              return {
                id,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          })
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              bookmarked_workflows: bookmarkDetails.map(result => 
                result.status === 'fulfilled' ? result.value : result.reason
              ),
              total_bookmarks: bookmarkedIds.length
            }, null, 2)
          }],
          isError: false
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: 'Error: Invalid action. Use "add", "remove", or "list"'
        }],
        isError: true
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error managing bookmarks: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Workflow Relationships Handler
 * Understand how workflows relate to each other
 */
export class GetWorkflowRelationshipsHandler {
  async execute(args: { 
    workflow_id?: string; 
    analyze_all?: boolean; 
    relationship_types?: string[];
  }): Promise<ToolCallResult> {
    try {
      const { workflow_id, analyze_all = false, relationship_types = ['webhook', 'shared_nodes', 'similar_names'] } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      if (workflow_id && !analyze_all) {
        // Analyze relationships for a specific workflow
        const targetWorkflow = await apiClient.getWorkflow(workflow_id);
        const allWorkflows = await apiClient.getWorkflows();
        
        const relationships = this.analyzeWorkflowRelationships(
          targetWorkflow, 
          allWorkflows.filter((w: any) => w.id !== workflow_id),
          relationship_types
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              target_workflow: {
                id: targetWorkflow.id,
                name: targetWorkflow.name
              },
              relationships
            }, null, 2)
          }],
          isError: false
        };
      }
      
      if (analyze_all) {
        // Analyze relationships across all workflows
        const allWorkflows = await apiClient.getWorkflows();
        const relationshipMap = this.analyzeAllWorkflowRelationships(allWorkflows, relationship_types);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              total_workflows: allWorkflows.length,
              relationship_summary: relationshipMap,
              analysis_types: relationship_types
            }, null, 2)
          }],
          isError: false
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: 'Error: Either workflow_id or analyze_all must be specified'
        }],
        isError: true
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error analyzing workflow relationships: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private analyzeWorkflowRelationships(targetWorkflow: any, otherWorkflows: any[], relationshipTypes: string[]): any[] {
    const relationships: any[] = [];
    
    otherWorkflows.forEach(workflow => {
      const relationshipData: any = {
        workflow_id: workflow.id,
        workflow_name: workflow.name,
        relationship_types: []
      };
      
      // Check for webhook relationships
      if (relationshipTypes.includes('webhook')) {
        const hasWebhookCall = this.checkWebhookRelationship(targetWorkflow, workflow);
        if (hasWebhookCall) {
          relationshipData.relationship_types.push('webhook_call');
        }
      }
      
      // Check for shared node types
      if (relationshipTypes.includes('shared_nodes')) {
        const sharedNodes = this.findSharedNodeTypes(targetWorkflow, workflow);
        if (sharedNodes.length > 0) {
          relationshipData.relationship_types.push('shared_node_types');
          relationshipData.shared_nodes = sharedNodes;
        }
      }
      
      // Check for similar naming patterns
      if (relationshipTypes.includes('similar_names')) {
        const nameSimilarity = this.calculateNameSimilarity(targetWorkflow.name, workflow.name);
        if (nameSimilarity > 0.5) {
          relationshipData.relationship_types.push('similar_naming');
          relationshipData.name_similarity = nameSimilarity;
        }
      }
      
      if (relationshipData.relationship_types.length > 0) {
        relationships.push(relationshipData);
      }
    });
    
    return relationships;
  }
  
  private analyzeAllWorkflowRelationships(workflows: any[], relationshipTypes: string[]): any {
    const summary = {
      total_workflows: workflows.length,
      workflows_with_webhooks: 0,
      common_node_types: {} as Record<string, number>,
      naming_patterns: {} as Record<string, number>
    };
    
    workflows.forEach(workflow => {
      // Count workflows with webhooks
      if (workflow.nodes?.some((node: any) => 
        node.type?.includes('webhook') || node.type?.includes('httpRequest')
      )) {
        summary.workflows_with_webhooks++;
      }
      
      // Count node types
      workflow.nodes?.forEach((node: any) => {
        const nodeType = node.type || 'unknown';
        summary.common_node_types[nodeType] = (summary.common_node_types[nodeType] || 0) + 1;
      });
      
      // Analyze naming patterns
      const nameWords = workflow.name?.toLowerCase().split(/[\s-_]+/) || [];
      nameWords.forEach((word: string) => {
        if (word.length > 2) {
          summary.naming_patterns[word] = (summary.naming_patterns[word] || 0) + 1;
        }
      });
    });
    
    return summary;
  }
  
  private checkWebhookRelationship(workflow1: any, workflow2: any): boolean {
    // Simplified check - in real implementation, would analyze webhook URLs and HTTP requests
    const workflow1HasWebhook = workflow1.nodes?.some((node: any) => node.type?.includes('webhook'));
    const workflow2HasHttpRequest = workflow2.nodes?.some((node: any) => node.type?.includes('httpRequest'));
    return workflow1HasWebhook && workflow2HasHttpRequest;
  }
  
  private findSharedNodeTypes(workflow1: any, workflow2: any): string[] {
    const types1 = new Set(workflow1.nodes?.map((node: any) => node.type as string) || []);
    const types2 = new Set(workflow2.nodes?.map((node: any) => node.type as string) || []);
    return Array.from(types1).filter((type: unknown) => types2.has(type as string)) as string[];
  }
  
  private calculateNameSimilarity(name1: string, name2: string): number {
    // Simple similarity calculation
    const words1 = name1.toLowerCase().split(/[\s-_]+/);
    const words2 = name2.toLowerCase().split(/[\s-_]+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }
}

// Tool definitions
export function getSaveWorkflowContextToolDefinition(): ToolDefinition {
  return {
    name: 'save_workflow_context',
    description: 'Save AI session context about current workflows for later restoration',
    inputSchema: {
      type: 'object',
      properties: {
        context_id: {
          type: 'string',
          description: 'Unique identifier for this context session'
        },
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of workflow IDs to save in context'
        },
        notes: {
          type: 'string',
          description: 'Optional notes about what you were working on'
        },
        session_data: {
          type: 'object',
          description: 'Additional session data to save'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to categorize this context'
        }
      },
      required: ['context_id', 'workflow_ids']
    }
  };
}

export function getRestoreWorkflowContextToolDefinition(): ToolDefinition {
  return {
    name: 'restore_workflow_context',
    description: 'Restore previous working context to continue tasks where you left off',
    inputSchema: {
      type: 'object',
      properties: {
        context_id: {
          type: 'string',
          description: 'ID of the context to restore'
        },
        list_contexts: {
          type: 'boolean',
          description: 'List all available contexts instead of restoring a specific one',
          default: false
        }
      },
      required: []
    }
  };
}

export function getBookmarkWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'bookmark_workflows',
    description: 'Mark frequently accessed workflows for quick reference',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'remove', 'list'],
          description: 'Action to perform with bookmarks'
        },
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Workflow IDs to bookmark or remove (required for add/remove)'
        },
        include_details: {
          type: 'boolean',
          description: 'Include detailed workflow information when listing',
          default: false
        }
      },
      required: ['action']
    }
  };
}

export function getGetWorkflowRelationshipsToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_relationships',
    description: 'Understand how workflows relate to each other (webhooks, shared components, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'Specific workflow to analyze relationships for'
        },
        analyze_all: {
          type: 'boolean',
          description: 'Analyze relationships across all workflows',
          default: false
        },
        relationship_types: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['webhook', 'shared_nodes', 'similar_names']
          },
          description: 'Types of relationships to analyze',
          default: ['webhook', 'shared_nodes', 'similar_names']
        }
      },
      required: []
    }
  };
}