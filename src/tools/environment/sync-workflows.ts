/**
 * Sync Workflows Tool
 *
 * This module provides functionality to synchronize workflows between environments.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseEnvironmentToolHandler } from './base-handler.js';

/**
 * Handler for syncing workflows between environments
 */
export class SyncWorkflowsHandler extends BaseEnvironmentToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['sourceEnvironment', 'targetEnvironment']);
      
      const { 
        sourceEnvironment, 
        targetEnvironment, 
        syncDirection = 'source-to-target',
        includeInactive = false,
        dryRun = false 
      } = args;

      try {
        // Get API clients for both environments
        const sourceClient = this.getApiClientForEnvironment(sourceEnvironment);
        const targetClient = this.getApiClientForEnvironment(targetEnvironment);

        let syncResult;
        switch (syncDirection) {
          case 'source-to-target':
            syncResult = await this.syncSourceToTarget(sourceClient, targetClient, sourceEnvironment, targetEnvironment, includeInactive, dryRun);
            break;
          case 'target-to-source':
            syncResult = await this.syncSourceToTarget(targetClient, sourceClient, targetEnvironment, sourceEnvironment, includeInactive, dryRun);
            break;
          case 'bidirectional':
            syncResult = await this.syncBidirectional(sourceClient, targetClient, sourceEnvironment, targetEnvironment, includeInactive, dryRun);
            break;
          default:
            throw new Error(`Unknown sync direction: ${syncDirection}`);
        }

        const result = {
          sourceEnvironment,
          targetEnvironment,
          syncDirection,
          dryRun,
          ...syncResult
        };

        const message = dryRun 
          ? `Sync simulation completed between ${sourceEnvironment} and ${targetEnvironment}`
          : `Successfully synchronized workflows between ${sourceEnvironment} and ${targetEnvironment}`;

        return this.formatSuccess(result, message);
      } catch (error) {
        throw new Error(`Failed to sync workflows: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Sync workflows from source to target
   */
  private async syncSourceToTarget(
    sourceClient: any, 
    targetClient: any, 
    sourceEnv: string, 
    targetEnv: string, 
    includeInactive: boolean, 
    dryRun: boolean
  ): Promise<any> {
    // Get workflows from both environments
    const [sourceWorkflows, targetWorkflows] = await Promise.all([
      sourceClient.getWorkflows(),
      targetClient.getWorkflows()
    ]);

    // Filter out inactive workflows if not included
    const filteredSourceWorkflows = includeInactive 
      ? sourceWorkflows 
      : sourceWorkflows.filter((w: any) => w.active);

    // Create maps for easy lookup
    const targetWorkflowMap = new Map(targetWorkflows.map((w: any) => [w.name, w]));

    const operations = {
      create: [] as any[],
      update: [] as any[],
      skip: [] as any[]
    };

    // Analyze what needs to be synced
    for (const sourceWorkflow of filteredSourceWorkflows) {
      const targetWorkflow = targetWorkflowMap.get(sourceWorkflow.name) as any;
      
      if (!targetWorkflow) {
        // Workflow doesn't exist in target - needs to be created
        operations.create.push({
          name: sourceWorkflow.name,
          id: sourceWorkflow.id,
          reason: 'Not found in target environment'
        });
      } else {
        // Workflow exists - check if it needs updating
        const needsUpdate = this.workflowNeedsUpdate(sourceWorkflow, targetWorkflow);
        if (needsUpdate) {
          operations.update.push({
            name: sourceWorkflow.name,
            sourceId: sourceWorkflow.id,
            targetId: targetWorkflow.id,
            reason: needsUpdate.reason,
            changes: needsUpdate.changes
          });
        } else {
          operations.skip.push({
            name: sourceWorkflow.name,
            reason: 'Already up to date'
          });
        }
      }
    }

    let syncResults = {
      created: [] as any[],
      updated: [] as any[],
      errors: [] as any[]
    };

    if (!dryRun) {
      // Execute create operations
      for (const createOp of operations.create) {
        try {
          const sourceWorkflow = sourceWorkflows.find((w: any) => w.name === createOp.name);
          const preparedWorkflow = this.prepareWorkflowForSync(sourceWorkflow, targetEnv);
          const createdWorkflow = await targetClient.createWorkflow(preparedWorkflow);
          
          syncResults.created.push({
            name: createOp.name,
            id: createdWorkflow.id,
            success: true
          });
        } catch (error) {
          syncResults.errors.push({
            operation: 'create',
            workflow: createOp.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Execute update operations
      for (const updateOp of operations.update) {
        try {
          const sourceWorkflow = sourceWorkflows.find((w: any) => w.name === updateOp.name);
          const preparedWorkflow = this.prepareWorkflowForSync(sourceWorkflow, targetEnv);
          const updatedWorkflow = await targetClient.updateWorkflow(updateOp.targetId, preparedWorkflow);
          
          syncResults.updated.push({
            name: updateOp.name,
            id: updatedWorkflow.id,
            changes: updateOp.changes,
            success: true
          });
        } catch (error) {
          syncResults.errors.push({
            operation: 'update',
            workflow: updateOp.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    return {
      plannedOperations: operations,
      executedOperations: syncResults,
      summary: {
        toCreate: operations.create.length,
        toUpdate: operations.update.length,
        toSkip: operations.skip.length,
        created: syncResults.created.length,
        updated: syncResults.updated.length,
        errors: syncResults.errors.length
      }
    };
  }

  /**
   * Sync workflows bidirectionally
   */
  private async syncBidirectional(
    client1: any, 
    client2: any, 
    env1: string, 
    env2: string, 
    includeInactive: boolean, 
    dryRun: boolean
  ): Promise<any> {
    const sync1to2 = await this.syncSourceToTarget(client1, client2, env1, env2, includeInactive, dryRun);
    const sync2to1 = await this.syncSourceToTarget(client2, client1, env2, env1, includeInactive, dryRun);

    return {
      [`${env1}_to_${env2}`]: sync1to2,
      [`${env2}_to_${env1}`]: sync2to1,
      summary: {
        totalOperations: sync1to2.summary.toCreate + sync1to2.summary.toUpdate + sync2to1.summary.toCreate + sync2to1.summary.toUpdate,
        totalErrors: sync1to2.summary.errors + sync2to1.summary.errors
      }
    };
  }

  /**
   * Check if workflow needs updating
   */
  private workflowNeedsUpdate(sourceWorkflow: any, targetWorkflow: any): any {
    const changes = [];

    // Check if active status differs
    if (sourceWorkflow.active !== targetWorkflow.active) {
      changes.push('active_status');
    }

    // Check if node count differs
    const sourceNodeCount = sourceWorkflow.nodes?.length || 0;
    const targetNodeCount = targetWorkflow.nodes?.length || 0;
    if (sourceNodeCount !== targetNodeCount) {
      changes.push('node_count');
    }

    // Check if settings differ
    if (JSON.stringify(sourceWorkflow.settings) !== JSON.stringify(targetWorkflow.settings)) {
      changes.push('settings');
    }

    // Check last updated time
    const sourceUpdated = new Date(sourceWorkflow.updatedAt || sourceWorkflow.createdAt);
    const targetUpdated = new Date(targetWorkflow.updatedAt || targetWorkflow.createdAt);
    
    if (sourceUpdated > targetUpdated) {
      changes.push('timestamp');
    }

    if (changes.length > 0) {
      return {
        reason: `Differences found: ${changes.join(', ')}`,
        changes
      };
    }

    return null;
  }

  /**
   * Prepare workflow for sync
   */
  private prepareWorkflowForSync(workflow: any, targetEnvironment: string): any {
    const syncedWorkflow = JSON.parse(JSON.stringify(workflow));

    // Remove environment-specific fields
    delete syncedWorkflow.id;
    delete syncedWorkflow.createdAt;
    delete syncedWorkflow.updatedAt;

    // Add sync metadata
    syncedWorkflow.tags = [
      ...(syncedWorkflow.tags || []),
      `synced-to-${targetEnvironment}`,
      `synced-at-${new Date().toISOString()}`
    ];

    return syncedWorkflow;
  }
}

/**
 * Get the tool definition for syncing workflows
 */
export function getSyncWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'sync_workflows',
    description: 'Synchronize workflows between environments with conflict resolution and bidirectional sync options',
    inputSchema: {
      type: 'object',
      properties: {
        sourceEnvironment: {
          type: 'string',
          description: 'Source environment name'
        },
        targetEnvironment: {
          type: 'string',
          description: 'Target environment name'
        },
        syncDirection: {
          type: 'string',
          enum: ['source-to-target', 'target-to-source', 'bidirectional'],
          description: 'Direction of synchronization',
          default: 'source-to-target'
        },
        includeInactive: {
          type: 'boolean',
          description: 'Whether to include inactive workflows in sync',
          default: false
        },
        dryRun: {
          type: 'boolean',
          description: 'Perform a dry run to see what would be synced without making changes',
          default: false
        }
      },
      required: ['sourceEnvironment', 'targetEnvironment']
    }
  };
}