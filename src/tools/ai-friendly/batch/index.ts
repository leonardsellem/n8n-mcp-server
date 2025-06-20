/**
 * Batch & Efficiency Operations Module
 * 
 * These tools provide efficient batch operations that reduce the number
 * of API calls and improve performance for AI models working with multiple workflows.
 */

import { ToolDefinition, ToolCallResult } from '../../../types/index.js';
import { getEnvConfig } from '../../../config/environment.js';
import { EnhancedN8nApiClient } from '../../../api/enhanced-client.js';

/**
 * Batch Workflow Status Handler
 * Check status of multiple workflows in one call
 */
export class BatchWorkflowStatusHandler {
  async execute(args: { 
    workflow_ids?: string[]; 
    active_only?: boolean; 
    include_execution_count?: boolean;
    max_workflows?: number;
  }): Promise<ToolCallResult> {
    try {
      const { workflow_ids, active_only = false, include_execution_count = false, max_workflows = 100 } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      let workflows;
      if (workflow_ids && workflow_ids.length > 0) {
        // Get specific workflows in batch
        const workflowPromises = workflow_ids.slice(0, max_workflows).map(async (id) => {
          try {
            const workflow = await apiClient.getWorkflow(id);
            return { success: true, data: workflow };
          } catch (error) {
            return { 
              success: false, 
              id, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            };
          }
        });
        
        const results = await Promise.all(workflowPromises);
        workflows = results
          .filter(result => result.success)
          .map(result => result.data);
        
        const errors = results
          .filter(result => !result.success)
          .map(result => ({ id: result.id, error: result.error }));
        
        if (errors.length > 0) {
          console.error('Some workflows could not be retrieved:', errors);
        }
      } else {
        // Get all workflows
        workflows = await apiClient.getWorkflows();
        workflows = workflows.slice(0, max_workflows);
      }
      
      // Apply active filter
      if (active_only) {
        workflows = workflows.filter((w: any) => w.active);
      }
      
      // Create status summary
      const statusData = await Promise.all(
        workflows.map(async (workflow: any) => {
          const status: any = {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            node_count: workflow.nodes?.length || 0,
            updated: workflow.updatedAt,
            has_trigger: workflow.nodes?.some((node: any) => 
              node.type?.includes('trigger') || node.type?.includes('webhook')
            ) || false
          };
          
          if (include_execution_count) {
            try {
              const executions = await apiClient.getExecutions({ workflowId: workflow.id, limit: 1 });
              status.has_executions = executions.length > 0;
              if (executions.length > 0) {
                status.last_execution = executions[0].startedAt;
              }
            } catch (error) {
              status.execution_check_failed = true;
            }
          }
          
          return status;
        })
      );
      
      const summary = {
        total_checked: statusData.length,
        active_workflows: statusData.filter(w => w.active).length,
        inactive_workflows: statusData.filter(w => !w.active).length,
        workflows_with_triggers: statusData.filter(w => w.has_trigger).length,
        avg_node_count: statusData.length > 0 
          ? (statusData.reduce((sum, w) => sum + w.node_count, 0) / statusData.length).toFixed(1)
          : 0
      };
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            workflows: statusData,
            summary,
            filters_applied: { active_only, include_execution_count }
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error in batch workflow status check: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Batch Workflow Metadata Handler
 * Get metadata for multiple workflows efficiently
 */
export class BatchWorkflowMetadataHandler {
  async execute(args: { 
    workflow_ids?: string[]; 
    metadata_fields?: string[];
    include_tags?: boolean;
    include_folder?: boolean;
    max_workflows?: number;
  }): Promise<ToolCallResult> {
    try {
      const { 
        workflow_ids, 
        metadata_fields = ['id', 'name', 'active', 'updated', 'node_count'],
        include_tags = false,
        include_folder = false,
        max_workflows = 100
      } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      let workflows;
      if (workflow_ids && workflow_ids.length > 0) {
        // Get specific workflows
        const workflowPromises = workflow_ids.slice(0, max_workflows).map(async (id) => {
          try {
            const workflow = await apiClient.getWorkflow(id);
            return workflow;
          } catch (error) {
            return null;
          }
        });
        
        const results = await Promise.all(workflowPromises);
        workflows = results.filter(w => w !== null);
      } else {
        workflows = await apiClient.getWorkflows();
        workflows = workflows.slice(0, max_workflows);
      }
      
      // Extract requested metadata
      const metadata = workflows.map((workflow: any) => {
        const meta: any = {};
        
        // Add requested fields
        metadata_fields.forEach(field => {
          switch (field) {
            case 'id':
              meta.id = workflow.id;
              break;
            case 'name':
              meta.name = workflow.name;
              break;
            case 'active':
              meta.active = workflow.active;
              break;
            case 'updated':
              meta.updated = workflow.updatedAt;
              break;
            case 'created':
              meta.created = workflow.createdAt;
              break;
            case 'node_count':
              meta.node_count = workflow.nodes?.length || 0;
              break;
            case 'connections_count':
              meta.connections_count = Object.keys(workflow.connections || {}).length;
              break;
            case 'trigger_count':
              meta.trigger_count = workflow.nodes?.filter((node: any) => 
                node.type?.includes('trigger') || node.type?.includes('webhook')
              ).length || 0;
              break;
          }
        });
        
        // Add optional fields
        if (include_tags && workflow.tags) {
          meta.tags = workflow.tags;
        }
        
        if (include_folder && workflow.folder) {
          meta.folder = workflow.folder.name;
        }
        
        return meta;
      });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            metadata,
            summary: {
              total_workflows: metadata.length,
              fields_included: metadata_fields,
              optional_fields: {
                tags_included: include_tags,
                folder_included: include_folder
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
          text: `Error getting batch workflow metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Quick Workflow Validation Handler
 * Fast validation without detailed analysis
 */
export class QuickWorkflowValidationHandler {
  async execute(args: { 
    workflow_ids: string[]; 
    validation_checks?: string[];
    stop_on_first_error?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { 
        workflow_ids, 
        validation_checks = ['basic_structure', 'node_connections', 'required_credentials'],
        stop_on_first_error = false
      } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const validationResults = [];
      
      for (const workflowId of workflow_ids) {
        try {
          const workflow = await apiClient.getWorkflow(workflowId);
          const validation = this.performQuickValidation(workflow, validation_checks);
          validationResults.push({
            workflow_id: workflowId,
            workflow_name: workflow.name,
            valid: validation.valid,
            issues: validation.issues,
            warnings: validation.warnings
          });
          
          if (stop_on_first_error && !validation.valid) {
            break;
          }
        } catch (error) {
          const errorResult = {
            workflow_id: workflowId,
            workflow_name: 'Unknown',
            valid: false,
            issues: [error instanceof Error ? error.message : 'Unknown error'],
            warnings: []
          };
          validationResults.push(errorResult);
          
          if (stop_on_first_error) {
            break;
          }
        }
      }
      
      const summary = {
        total_validated: validationResults.length,
        valid_workflows: validationResults.filter(r => r.valid).length,
        invalid_workflows: validationResults.filter(r => !r.valid).length,
        workflows_with_warnings: validationResults.filter(r => r.warnings && r.warnings.length > 0).length,
        validation_checks: validation_checks
      };
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            validation_results: validationResults,
            summary
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error in quick workflow validation: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private performQuickValidation(workflow: any, checks: string[]): { valid: boolean; issues: string[]; warnings: string[] } {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    checks.forEach(check => {
      switch (check) {
        case 'basic_structure':
          if (!workflow.nodes || workflow.nodes.length === 0) {
            issues.push('Workflow has no nodes');
          }
          if (!workflow.name || workflow.name.trim().length === 0) {
            issues.push('Workflow has no name');
          }
          break;
          
        case 'node_connections':
          const hasConnections = workflow.connections && Object.keys(workflow.connections).length > 0;
          if (workflow.nodes?.length > 1 && !hasConnections) {
            warnings.push('Multiple nodes but no connections defined');
          }
          break;
          
        case 'required_credentials':
          const credentialNodes = workflow.nodes?.filter((node: any) => 
            node.type?.includes('http') || 
            node.type?.includes('email') || 
            node.type?.includes('database')
          ) || [];
          
          credentialNodes.forEach((node: any) => {
            if (!node.credentials || Object.keys(node.credentials).length === 0) {
              warnings.push(`Node ${node.name} may require credentials`);
            }
          });
          break;
          
        case 'trigger_nodes':
          const hasTrigger = workflow.nodes?.some((node: any) => 
            node.type?.includes('trigger') || node.type?.includes('webhook')
          );
          if (!hasTrigger && workflow.active) {
            warnings.push('Active workflow without trigger nodes');
          }
          break;
      }
    });
    
    return {
      valid: issues.length === 0,
      issues,
      warnings
    };
  }
}

/**
 * Get Workflow Dependencies Handler
 * Clear dependency mapping for planning
 */
export class GetWorkflowDependenciesHandler {
  async execute(args: { 
    workflow_ids?: string[]; 
    dependency_types?: string[];
    include_external?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { 
        workflow_ids, 
        dependency_types = ['credentials', 'webhooks', 'external_apis'],
        include_external = false
      } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      let workflows;
      if (workflow_ids && workflow_ids.length > 0) {
        const workflowPromises = workflow_ids.map(async (id) => {
          try {
            return await apiClient.getWorkflow(id);
          } catch (error) {
            return null;
          }
        });
        workflows = (await Promise.all(workflowPromises)).filter(w => w !== null);
      } else {
        workflows = await apiClient.getWorkflows();
      }
      
      const dependencyMap = workflows.map((workflow: any) => {
        const dependencies: any = {
          workflow_id: workflow.id,
          workflow_name: workflow.name,
          dependencies: {}
        };
        
        dependency_types.forEach(depType => {
          switch (depType) {
            case 'credentials':
              dependencies.dependencies.credentials = this.extractCredentialDependencies(workflow);
              break;
            case 'webhooks':
              dependencies.dependencies.webhooks = this.extractWebhookDependencies(workflow);
              break;
            case 'external_apis':
              dependencies.dependencies.external_apis = this.extractExternalApiDependencies(workflow);
              break;
            case 'internal_calls':
              dependencies.dependencies.internal_calls = this.extractInternalCallDependencies(workflow);
              break;
          }
        });
        
        return dependencies;
      });
      
      // Create dependency summary
      const summary = this.createDependencySummary(dependencyMap, dependency_types);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            dependency_map: dependencyMap,
            summary,
            dependency_types_analyzed: dependency_types
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting workflow dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private extractCredentialDependencies(workflow: any): any[] {
    const credentialDeps: any[] = [];
    
    workflow.nodes?.forEach((node: any) => {
      if (node.credentials) {
        Object.entries(node.credentials).forEach(([credType, credInfo]: [string, any]) => {
          credentialDeps.push({
            node_name: node.name,
            credential_type: credType,
            credential_id: credInfo.id
          });
        });
      }
    });
    
    return credentialDeps;
  }
  
  private extractWebhookDependencies(workflow: any): any[] {
    const webhookDeps: any[] = [];
    
    workflow.nodes?.forEach((node: any) => {
      if (node.type?.includes('webhook')) {
        webhookDeps.push({
          node_name: node.name,
          webhook_type: node.type,
          webhook_path: node.parameters?.path || 'default'
        });
      }
    });
    
    return webhookDeps;
  }
  
  private extractExternalApiDependencies(workflow: any): any[] {
    const apiDeps: any[] = [];
    
    workflow.nodes?.forEach((node: any) => {
      if (node.type?.includes('httpRequest')) {
        const url = node.parameters?.url || '';
        if (url) {
          try {
            const domain = new URL(url).hostname;
            apiDeps.push({
              node_name: node.name,
              api_domain: domain,
              method: node.parameters?.method || 'GET'
            });
          } catch (error) {
            apiDeps.push({
              node_name: node.name,
              api_url: url,
              method: node.parameters?.method || 'GET',
              url_parse_error: true
            });
          }
        }
      }
    });
    
    return apiDeps;
  }
  
  private extractInternalCallDependencies(workflow: any): any[] {
    // This would analyze internal n8n workflow calls
    // For now, return empty array as this requires more complex analysis
    return [];
  }
  
  private createDependencySummary(dependencyMap: any[], dependencyTypes: string[]): any {
    const summary: any = {
      total_workflows: dependencyMap.length,
      workflows_with_dependencies: 0,
      dependency_counts: {}
    };
    
    dependencyTypes.forEach(depType => {
      summary.dependency_counts[depType] = 0;
    });
    
    dependencyMap.forEach(workflow => {
      let hasDependencies = false;
      
      dependencyTypes.forEach(depType => {
        const deps = workflow.dependencies[depType] || [];
        if (deps.length > 0) {
          hasDependencies = true;
          summary.dependency_counts[depType] += deps.length;
        }
      });
      
      if (hasDependencies) {
        summary.workflows_with_dependencies++;
      }
    });
    
    return summary;
  }
}

// Tool definitions
export function getBatchWorkflowStatusToolDefinition(): ToolDefinition {
  return {
    name: 'batch_workflow_status',
    description: 'Check status of multiple workflows in one efficient call',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific workflow IDs to check (optional, checks all if not provided)'
        },
        active_only: {
          type: 'boolean',
          description: 'Only return active workflows',
          default: false
        },
        include_execution_count: {
          type: 'boolean',
          description: 'Include execution statistics for each workflow',
          default: false
        },
        max_workflows: {
          type: 'number',
          description: 'Maximum number of workflows to process',
          default: 100
        }
      },
      required: []
    }
  };
}

export function getBatchWorkflowMetadataToolDefinition(): ToolDefinition {
  return {
    name: 'batch_workflow_metadata',
    description: 'Get metadata for multiple workflows efficiently with customizable fields',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific workflow IDs (optional, gets all if not provided)'
        },
        metadata_fields: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['id', 'name', 'active', 'updated', 'created', 'node_count', 'connections_count', 'trigger_count']
          },
          description: 'Specific metadata fields to include',
          default: ['id', 'name', 'active', 'updated', 'node_count']
        },
        include_tags: {
          type: 'boolean',
          description: 'Include workflow tags',
          default: false
        },
        include_folder: {
          type: 'boolean',
          description: 'Include folder information',
          default: false
        },
        max_workflows: {
          type: 'number',
          description: 'Maximum number of workflows to process',
          default: 100
        }
      },
      required: []
    }
  };
}

export function getQuickWorkflowValidationToolDefinition(): ToolDefinition {
  return {
    name: 'quick_workflow_validation',
    description: 'Fast validation without detailed analysis for multiple workflows',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Workflow IDs to validate'
        },
        validation_checks: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['basic_structure', 'node_connections', 'required_credentials', 'trigger_nodes']
          },
          description: 'Types of validation checks to perform',
          default: ['basic_structure', 'node_connections', 'required_credentials']
        },
        stop_on_first_error: {
          type: 'boolean',
          description: 'Stop validation on first error found',
          default: false
        }
      },
      required: ['workflow_ids']
    }
  };
}

export function getGetWorkflowDependenciesToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_dependencies',
    description: 'Clear dependency mapping for planning and understanding workflow requirements',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific workflow IDs to analyze (optional, analyzes all if not provided)'
        },
        dependency_types: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['credentials', 'webhooks', 'external_apis', 'internal_calls']
          },
          description: 'Types of dependencies to analyze',
          default: ['credentials', 'webhooks', 'external_apis']
        },
        include_external: {
          type: 'boolean',
          description: 'Include external service dependencies',
          default: false
        }
      },
      required: []
    }
  };
}