/**
 * Deploy Workflow to Environment Tool
 *
 * This module provides functionality to deploy workflows across environments.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseEnvironmentToolHandler } from './base-handler.js';

/**
 * Handler for deploying workflows to environments
 */
export class DeployWorkflowToEnvironmentHandler extends BaseEnvironmentToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId', 'sourceEnvironment', 'targetEnvironment']);
      
      const { workflowId, sourceEnvironment, targetEnvironment, overwrite = false } = args;

      try {
        // Get source and target API clients
        const sourceClient = this.getApiClientForEnvironment(sourceEnvironment);
        const targetClient = this.getApiClientForEnvironment(targetEnvironment);

        // Get workflow from source environment
        const sourceWorkflow = await sourceClient.getWorkflow(workflowId);
        if (!sourceWorkflow) {
          throw new Error(`Workflow with ID "${workflowId}" not found in ${sourceEnvironment} environment`);
        }

        // Check if workflow exists in target environment
        let targetWorkflowExists = false;
        let existingWorkflow = null;
        
        try {
          const targetWorkflows = await targetClient.getWorkflows({ search: sourceWorkflow.name });
          existingWorkflow = targetWorkflows.find((w: any) => w.name === sourceWorkflow.name);
          targetWorkflowExists = !!existingWorkflow;
        } catch (error) {
          // Workflow doesn't exist, which is fine
        }

        if (targetWorkflowExists && !overwrite) {
          throw new Error(`Workflow "${sourceWorkflow.name}" already exists in ${targetEnvironment}. Use overwrite=true to replace it.`);
        }

        // Prepare workflow for deployment
        const deploymentWorkflow = this.prepareWorkflowForDeployment(sourceWorkflow, targetEnvironment);

        let deployedWorkflow;
        if (targetWorkflowExists && overwrite && existingWorkflow) {
          // Update existing workflow
          deployedWorkflow = await targetClient.updateWorkflow(existingWorkflow.id, deploymentWorkflow);
        } else {
          // Create new workflow
          deployedWorkflow = await targetClient.createWorkflow(deploymentWorkflow);
        }

        const result = {
          success: true,
          sourceWorkflow: {
            id: sourceWorkflow.id,
            name: sourceWorkflow.name,
            environment: sourceEnvironment
          },
          deployedWorkflow: {
            id: deployedWorkflow.id,
            name: deployedWorkflow.name,
            environment: targetEnvironment
          },
          action: targetWorkflowExists ? 'updated' : 'created',
          deploymentSummary: this.generateDeploymentSummary(sourceWorkflow, deployedWorkflow)
        };

        return this.formatSuccess(result, `Successfully deployed workflow "${sourceWorkflow.name}" from ${sourceEnvironment} to ${targetEnvironment}`);
      } catch (error) {
        throw new Error(`Failed to deploy workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Prepare workflow for deployment to another environment
   */
  private prepareWorkflowForDeployment(workflow: any, targetEnvironment: string): any {
    const deploymentWorkflow = JSON.parse(JSON.stringify(workflow));

    // Remove environment-specific fields
    delete deploymentWorkflow.id;
    delete deploymentWorkflow.createdAt;
    delete deploymentWorkflow.updatedAt;
    delete deploymentWorkflow.active; // Will be activated separately if needed

    // Update environment-specific configurations
    deploymentWorkflow.nodes = deploymentWorkflow.nodes.map((node: any) => {
      const updatedNode = { ...node };

      // Update webhook URLs for different environments
      if (node.type === 'n8n-nodes-base.webhook' && node.parameters?.path) {
        updatedNode.parameters = {
          ...node.parameters,
          path: this.updateWebhookPath(node.parameters.path, targetEnvironment)
        };
      }

      // Update API endpoints for different environments
      if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters?.url) {
        updatedNode.parameters = {
          ...node.parameters,
          url: this.updateApiEndpoint(node.parameters.url, targetEnvironment)
        };
      }

      return updatedNode;
    });

    // Add deployment metadata
    deploymentWorkflow.tags = [
      ...(deploymentWorkflow.tags || []),
      `deployed-to-${targetEnvironment}`,
      `deployed-at-${new Date().toISOString()}`
    ];

    return deploymentWorkflow;
  }

  /**
   * Update webhook path for target environment
   */
  private updateWebhookPath(originalPath: string, targetEnvironment: string): string {
    // Add environment prefix to webhook paths
    if (targetEnvironment !== 'production') {
      return `${targetEnvironment}-${originalPath}`;
    }
    return originalPath;
  }

  /**
   * Update API endpoint for target environment
   */
  private updateApiEndpoint(originalUrl: string, targetEnvironment: string): string {
    // Replace environment-specific domains
    const environmentMappings: Record<string, Record<string, string>> = {
      development: {
        'api.example.com': 'dev-api.example.com',
        'staging-api.example.com': 'dev-api.example.com'
      },
      staging: {
        'api.example.com': 'staging-api.example.com',
        'dev-api.example.com': 'staging-api.example.com'
      },
      production: {
        'dev-api.example.com': 'api.example.com',
        'staging-api.example.com': 'api.example.com'
      }
    };

    let updatedUrl = originalUrl;
    const mappings = environmentMappings[targetEnvironment];
    
    if (mappings) {
      Object.entries(mappings).forEach(([from, to]) => {
        updatedUrl = updatedUrl.replace(from, to);
      });
    }

    return updatedUrl;
  }

  /**
   * Generate deployment summary
   */
  private generateDeploymentSummary(sourceWorkflow: any, deployedWorkflow: any): any {
    return {
      nodesCount: sourceWorkflow.nodes?.length || 0,
      connectionsCount: Object.keys(sourceWorkflow.connections || {}).length,
      hasWebhooks: sourceWorkflow.nodes?.some((n: any) => n.type.includes('webhook')) || false,
      hasScheduleTriggers: sourceWorkflow.nodes?.some((n: any) => n.type.includes('scheduleTrigger')) || false,
      requiresCredentials: sourceWorkflow.nodes?.some((n: any) => n.credentials && Object.keys(n.credentials).length > 0) || false
    };
  }
}

/**
 * Get the tool definition for deploying workflows to environments
 */
export function getDeployWorkflowToEnvironmentToolDefinition(): ToolDefinition {
  return {
    name: 'deploy_workflow_to_environment',
    description: 'Deploy workflows across environments (dev/staging/prod) with environment-specific configurations',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to deploy'
        },
        sourceEnvironment: {
          type: 'string',
          description: 'Source environment name (e.g., "development", "staging")'
        },
        targetEnvironment: {
          type: 'string',
          description: 'Target environment name (e.g., "staging", "production")'
        },
        overwrite: {
          type: 'boolean',
          description: 'Whether to overwrite existing workflow in target environment',
          default: false
        }
      },
      required: ['workflowId', 'sourceEnvironment', 'targetEnvironment']
    }
  };
}