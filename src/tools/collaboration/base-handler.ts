/**
 * Base Collaboration Tool Handler
 *
 * This module provides a base handler for workflow collaboration tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base class for workflow collaboration tool handlers
 */
export abstract class BaseCollaborationToolHandler {
  protected apiService: EnhancedN8nApiClient;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing collaboration tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   *
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Generate workflow change diff
   * 
   * @param originalWorkflow Original workflow object
   * @param modifiedWorkflow Modified workflow object
   * @returns Detailed diff object
   */
  protected generateWorkflowDiff(originalWorkflow: any, modifiedWorkflow: any): any {
    const diff = {
      metadata: {
        timestamp: new Date().toISOString(),
        originalVersion: originalWorkflow.versionId || 'unknown',
        modifiedVersion: modifiedWorkflow.versionId || 'unknown'
      },
      changes: {
        name: this.compareValues(originalWorkflow.name, modifiedWorkflow.name),
        active: this.compareValues(originalWorkflow.active, modifiedWorkflow.active),
        tags: this.compareArrays(originalWorkflow.tags || [], modifiedWorkflow.tags || []),
        nodes: this.compareNodes(originalWorkflow.nodes || [], modifiedWorkflow.nodes || []),
        connections: this.compareConnections(originalWorkflow.connections || {}, modifiedWorkflow.connections || {}),
        settings: this.compareValues(originalWorkflow.settings, modifiedWorkflow.settings)
      },
      summary: {
        hasChanges: false,
        changeCount: 0,
        addedNodes: 0,
        removedNodes: 0,
        modifiedNodes: 0,
        changedConnections: 0
      }
    };

    // Calculate summary
    const changes = diff.changes;
    let changeCount = 0;

    if (changes.name.changed) changeCount++;
    if (changes.active.changed) changeCount++;
    if (changes.tags.changed) changeCount++;
    if (changes.nodes.changed) {
      changeCount++;
      diff.summary.addedNodes = changes.nodes.added.length;
      diff.summary.removedNodes = changes.nodes.removed.length;
      diff.summary.modifiedNodes = changes.nodes.modified.length;
    }
    if (changes.connections.changed) {
      changeCount++;
      diff.summary.changedConnections = changes.connections.differences.length;
    }
    if (changes.settings.changed) changeCount++;

    diff.summary.hasChanges = changeCount > 0;
    diff.summary.changeCount = changeCount;

    return diff;
  }

  /**
   * Compare two values for changes
   */
  private compareValues(oldValue: any, newValue: any): any {
    const changed = JSON.stringify(oldValue) !== JSON.stringify(newValue);
    return {
      changed,
      oldValue,
      newValue,
      type: changed ? (oldValue === undefined ? 'added' : newValue === undefined ? 'removed' : 'modified') : 'unchanged'
    };
  }

  /**
   * Compare two arrays for changes
   */
  private compareArrays(oldArray: any[], newArray: any[]): any {
    const added = newArray.filter(item => !oldArray.includes(item));
    const removed = oldArray.filter(item => !newArray.includes(item));
    const changed = added.length > 0 || removed.length > 0;

    return {
      changed,
      added,
      removed,
      oldValue: oldArray,
      newValue: newArray
    };
  }

  /**
   * Compare workflow nodes for changes
   */
  private compareNodes(oldNodes: any[], newNodes: any[]): any {
    const oldNodeMap = new Map(oldNodes.map(node => [node.id, node]));
    const newNodeMap = new Map(newNodes.map(node => [node.id, node]));

    const added = newNodes.filter(node => !oldNodeMap.has(node.id));
    const removed = oldNodes.filter(node => !newNodeMap.has(node.id));
    const modified: any[] = [];

    // Check for modified nodes
    for (const [nodeId, newNode] of newNodeMap) {
      const oldNode = oldNodeMap.get(nodeId);
      if (oldNode && JSON.stringify(oldNode) !== JSON.stringify(newNode)) {
        modified.push({
          id: nodeId,
          name: newNode.name,
          changes: this.compareNodeProperties(oldNode, newNode)
        });
      }
    }

    const changed = added.length > 0 || removed.length > 0 || modified.length > 0;

    return {
      changed,
      added: added.map(node => ({ id: node.id, name: node.name, type: node.type })),
      removed: removed.map(node => ({ id: node.id, name: node.name, type: node.type })),
      modified
    };
  }

  /**
   * Compare node properties for changes
   */
  private compareNodeProperties(oldNode: any, newNode: any): any {
    const changes: any = {};

    const properties = ['name', 'type', 'position', 'parameters', 'credentials'];
    for (const prop of properties) {
      const comparison = this.compareValues(oldNode[prop], newNode[prop]);
      if (comparison.changed) {
        changes[prop] = comparison;
      }
    }

    return changes;
  }

  /**
   * Compare workflow connections for changes
   */
  private compareConnections(oldConnections: any, newConnections: any): any {
    const oldStr = JSON.stringify(oldConnections);
    const newStr = JSON.stringify(newConnections);
    const changed = oldStr !== newStr;

    const differences: string[] = [];
    if (changed) {
      // Simple diff - in a real implementation, this would be more sophisticated
      differences.push('Connection structure modified');
    }

    return {
      changed,
      differences,
      oldValue: oldConnections,
      newValue: newConnections
    };
  }

  /**
   * Merge workflow changes with conflict resolution
   * 
   * @param baseWorkflow Base workflow
   * @param sourceChanges Source workflow changes
   * @param targetChanges Target workflow changes
   * @returns Merged workflow with conflicts highlighted
   */
  protected mergeWorkflowChanges(baseWorkflow: any, sourceChanges: any, targetChanges: any): any {
    const mergedWorkflow = JSON.parse(JSON.stringify(baseWorkflow));
    const conflicts: any[] = [];

    // Merge metadata changes
    if (sourceChanges.name && targetChanges.name && sourceChanges.name !== targetChanges.name) {
      conflicts.push({
        type: 'name_conflict',
        field: 'name',
        sourceValue: sourceChanges.name,
        targetValue: targetChanges.name,
        resolution: 'manual_required'
      });
    } else if (sourceChanges.name) {
      mergedWorkflow.name = sourceChanges.name;
    } else if (targetChanges.name) {
      mergedWorkflow.name = targetChanges.name;
    }

    // Merge node changes
    const mergedNodes = this.mergeNodes(
      baseWorkflow.nodes || [],
      sourceChanges.nodes || {},
      targetChanges.nodes || {},
      conflicts
    );
    mergedWorkflow.nodes = mergedNodes;

    // Merge connection changes
    const mergedConnections = this.mergeConnections(
      baseWorkflow.connections || {},
      sourceChanges.connections || {},
      targetChanges.connections || {},
      conflicts
    );
    mergedWorkflow.connections = mergedConnections;

    return {
      mergedWorkflow,
      conflicts,
      hasConflicts: conflicts.length > 0,
      autoResolved: conflicts.filter(c => c.resolution !== 'manual_required').length,
      manualResolutionRequired: conflicts.filter(c => c.resolution === 'manual_required').length
    };
  }

  /**
   * Merge node changes with conflict detection
   */
  private mergeNodes(baseNodes: any[], sourceChanges: any, targetChanges: any, conflicts: any[]): any[] {
    const nodeMap = new Map(baseNodes.map(node => [node.id, { ...node }]));

    // Apply source changes
    if (sourceChanges.added) {
      sourceChanges.added.forEach((node: any) => nodeMap.set(node.id, node));
    }
    if (sourceChanges.removed) {
      sourceChanges.removed.forEach((node: any) => nodeMap.delete(node.id));
    }
    if (sourceChanges.modified) {
      sourceChanges.modified.forEach((change: any) => {
        const existingNode = nodeMap.get(change.id);
        if (existingNode) {
          Object.assign(existingNode, change.newProperties);
        }
      });
    }

    // Apply target changes and detect conflicts
    if (targetChanges.added) {
      targetChanges.added.forEach((node: any) => {
        if (nodeMap.has(node.id)) {
          conflicts.push({
            type: 'node_add_conflict',
            field: 'nodes',
            nodeId: node.id,
            message: 'Node added in both branches',
            resolution: 'keep_source'
          });
        } else {
          nodeMap.set(node.id, node);
        }
      });
    }

    if (targetChanges.removed) {
      targetChanges.removed.forEach((node: any) => {
        if (!nodeMap.has(node.id)) {
          conflicts.push({
            type: 'node_remove_conflict',
            field: 'nodes',
            nodeId: node.id,
            message: 'Node removed in both branches',
            resolution: 'already_resolved'
          });
        } else {
          nodeMap.delete(node.id);
        }
      });
    }

    if (targetChanges.modified) {
      targetChanges.modified.forEach((change: any) => {
        const existingNode = nodeMap.get(change.id);
        if (existingNode) {
          // Check for conflicting modifications
          const hasConflict = Object.keys(change.newProperties).some(key => 
            existingNode[key] !== undefined && 
            JSON.stringify(existingNode[key]) !== JSON.stringify(change.newProperties[key])
          );

          if (hasConflict) {
            conflicts.push({
              type: 'node_modify_conflict',
              field: 'nodes',
              nodeId: change.id,
              sourceProperties: existingNode,
              targetProperties: change.newProperties,
              resolution: 'manual_required'
            });
          } else {
            Object.assign(existingNode, change.newProperties);
          }
        }
      });
    }

    return Array.from(nodeMap.values());
  }

  /**
   * Merge connection changes with conflict detection
   */
  private mergeConnections(baseConnections: any, sourceChanges: any, targetChanges: any, conflicts: any[]): any {
    const merged = JSON.parse(JSON.stringify(baseConnections));

    // Simple merge strategy - in a real implementation, this would be more sophisticated
    if (JSON.stringify(sourceChanges) !== JSON.stringify(targetChanges)) {
      conflicts.push({
        type: 'connection_conflict',
        field: 'connections',
        message: 'Connection changes conflict between branches',
        resolution: 'manual_required'
      });
    }

    return merged;
  }

  /**
   * Generate user permission summary
   * 
   * @param userId User ID to check permissions for
   * @param workflowId Workflow ID to check permissions on
   * @returns Permission summary
   */
  protected generatePermissionSummary(userId: string, workflowId: string): any {
    // Simulate permission checking - in real implementation, this would query actual permissions
    const permissions = {
      view: true,
      edit: Math.random() > 0.3,
      execute: Math.random() > 0.4,
      share: Math.random() > 0.6,
      delete: Math.random() > 0.8,
      admin: Math.random() > 0.9
    };

    return {
      userId,
      workflowId,
      permissions,
      role: this.determineUserRole(permissions),
      lastAccess: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessCount: Math.floor(Math.random() * 100)
    };
  }

  /**
   * Determine user role based on permissions
   */
  private determineUserRole(permissions: any): string {
    if (permissions.admin) return 'admin';
    if (permissions.delete) return 'owner';
    if (permissions.edit) return 'editor';
    if (permissions.execute) return 'executor';
    if (permissions.view) return 'viewer';
    return 'none';
  }
}