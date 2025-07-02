/**
 * Workflow Diff Engine
 * Applies diff operations to n8n workflows
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  WorkflowDiffOperation,
  WorkflowDiffRequest,
  WorkflowDiffResult,
  WorkflowDiffValidationError,
  isNodeOperation,
  isConnectionOperation,
  isMetadataOperation,
  AddNodeOperation,
  RemoveNodeOperation,
  UpdateNodeOperation,
  MoveNodeOperation,
  EnableNodeOperation,
  DisableNodeOperation,
  AddConnectionOperation,
  RemoveConnectionOperation,
  UpdateConnectionOperation,
  UpdateSettingsOperation,
  UpdateNameOperation,
  AddTagOperation,
  RemoveTagOperation
} from '../types/workflow-diff';
import { Workflow, WorkflowNode, WorkflowConnection } from '../types/n8n-api';
import { Logger } from '../utils/logger';
import { validateWorkflowNode, validateWorkflowConnections } from './n8n-validation';

const logger = new Logger({ prefix: '[WorkflowDiffEngine]' });

export class WorkflowDiffEngine {
  /**
   * Apply diff operations to a workflow
   */
  async applyDiff(
    workflow: Workflow, 
    request: WorkflowDiffRequest
  ): Promise<WorkflowDiffResult> {
    try {
      // Limit operations to keep complexity manageable
      if (request.operations.length > 5) {
        return {
          success: false,
          errors: [{
            operation: -1,
            message: 'Too many operations. Maximum 5 operations allowed per request to ensure transactional integrity.'
          }]
        };
      }

      // Clone workflow to avoid modifying original
      const workflowCopy = JSON.parse(JSON.stringify(workflow));
      
      // Group operations by type for two-pass processing
      const nodeOperationTypes = ['addNode', 'removeNode', 'updateNode', 'moveNode', 'enableNode', 'disableNode'];
      const nodeOperations: Array<{ operation: WorkflowDiffOperation; index: number }> = [];
      const otherOperations: Array<{ operation: WorkflowDiffOperation; index: number }> = [];
      
      request.operations.forEach((operation, index) => {
        if (nodeOperationTypes.includes(operation.type)) {
          nodeOperations.push({ operation, index });
        } else {
          otherOperations.push({ operation, index });
        }
      });

      // Pass 1: Validate and apply node operations first
      for (const { operation, index } of nodeOperations) {
        const error = this.validateOperation(workflowCopy, operation);
        if (error) {
          return {
            success: false,
            errors: [{
              operation: index,
              message: error,
              details: operation
            }]
          };
        }
        
        // Always apply to working copy for proper validation of subsequent operations
        try {
          this.applyOperation(workflowCopy, operation);
        } catch (error) {
          return {
            success: false,
            errors: [{
              operation: index,
              message: `Failed to apply operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
              details: operation
            }]
          };
        }
      }

      // Pass 2: Validate and apply other operations (connections, metadata)
      for (const { operation, index } of otherOperations) {
        const error = this.validateOperation(workflowCopy, operation);
        if (error) {
          return {
            success: false,
            errors: [{
              operation: index,
              message: error,
              details: operation
            }]
          };
        }
        
        // Always apply to working copy for proper validation of subsequent operations
        try {
          this.applyOperation(workflowCopy, operation);
        } catch (error) {
          return {
            success: false,
            errors: [{
              operation: index,
              message: `Failed to apply operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
              details: operation
            }]
          };
        }
      }

      // If validateOnly flag is set, return success without applying
      if (request.validateOnly) {
        return {
          success: true,
          message: 'Validation successful. Operations are valid but not applied.'
        };
      }

      const operationsApplied = request.operations.length;
      return {
        success: true,
        workflow: workflowCopy,
        operationsApplied,
        message: `Successfully applied ${operationsApplied} operations (${nodeOperations.length} node ops, ${otherOperations.length} other ops)`
      };
    } catch (error) {
      logger.error('Failed to apply diff', error);
      return {
        success: false,
        errors: [{
          operation: -1,
          message: `Diff engine error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }


  /**
   * Validate a single operation
   */
  private validateOperation(workflow: Workflow, operation: WorkflowDiffOperation): string | null {
    switch (operation.type) {
      case 'addNode':
        return this.validateAddNode(workflow, operation);
      case 'removeNode':
        return this.validateRemoveNode(workflow, operation);
      case 'updateNode':
        return this.validateUpdateNode(workflow, operation);
      case 'moveNode':
        return this.validateMoveNode(workflow, operation);
      case 'enableNode':
      case 'disableNode':
        return this.validateToggleNode(workflow, operation);
      case 'addConnection':
        return this.validateAddConnection(workflow, operation);
      case 'removeConnection':
        return this.validateRemoveConnection(workflow, operation);
      case 'updateConnection':
        return this.validateUpdateConnection(workflow, operation);
      case 'updateSettings':
      case 'updateName':
      case 'addTag':
      case 'removeTag':
        return null; // These are always valid
      default:
        return `Unknown operation type: ${(operation as any).type}`;
    }
  }

  /**
   * Apply a single operation to the workflow
   */
  private applyOperation(workflow: Workflow, operation: WorkflowDiffOperation): void {
    switch (operation.type) {
      case 'addNode':
        this.applyAddNode(workflow, operation);
        break;
      case 'removeNode':
        this.applyRemoveNode(workflow, operation);
        break;
      case 'updateNode':
        this.applyUpdateNode(workflow, operation);
        break;
      case 'moveNode':
        this.applyMoveNode(workflow, operation);
        break;
      case 'enableNode':
        this.applyEnableNode(workflow, operation);
        break;
      case 'disableNode':
        this.applyDisableNode(workflow, operation);
        break;
      case 'addConnection':
        this.applyAddConnection(workflow, operation);
        break;
      case 'removeConnection':
        this.applyRemoveConnection(workflow, operation);
        break;
      case 'updateConnection':
        this.applyUpdateConnection(workflow, operation);
        break;
      case 'updateSettings':
        this.applyUpdateSettings(workflow, operation);
        break;
      case 'updateName':
        this.applyUpdateName(workflow, operation);
        break;
      case 'addTag':
        this.applyAddTag(workflow, operation);
        break;
      case 'removeTag':
        this.applyRemoveTag(workflow, operation);
        break;
    }
  }

  // Node operation validators
  private validateAddNode(workflow: Workflow, operation: AddNodeOperation): string | null {
    const { node } = operation;
    
    // Check if node with same name already exists
    if (workflow.nodes.some(n => n.name === node.name)) {
      return `Node with name "${node.name}" already exists`;
    }
    
    // Validate node type format
    if (!node.type.includes('.')) {
      return `Invalid node type "${node.type}". Must include package prefix (e.g., "n8n-nodes-base.webhook")`;
    }
    
    if (node.type.startsWith('nodes-base.')) {
      return `Invalid node type "${node.type}". Use "n8n-nodes-base.${node.type.substring(11)}" instead`;
    }
    
    return null;
  }

  private validateRemoveNode(workflow: Workflow, operation: RemoveNodeOperation): string | null {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) {
      return `Node not found: ${operation.nodeId || operation.nodeName}`;
    }
    
    // Check if node has connections that would be broken
    const hasConnections = Object.values(workflow.connections).some(conn => {
      return Object.values(conn).some(outputs => 
        outputs.some(connections => 
          connections.some(c => c.node === node.name)
        )
      );
    });
    
    if (hasConnections || workflow.connections[node.name]) {
      // This is a warning, not an error - connections will be cleaned up
      logger.warn(`Removing node "${node.name}" will break existing connections`);
    }
    
    return null;
  }

  private validateUpdateNode(workflow: Workflow, operation: UpdateNodeOperation): string | null {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) {
      return `Node not found: ${operation.nodeId || operation.nodeName}`;
    }
    return null;
  }

  private validateMoveNode(workflow: Workflow, operation: MoveNodeOperation): string | null {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) {
      return `Node not found: ${operation.nodeId || operation.nodeName}`;
    }
    return null;
  }

  private validateToggleNode(workflow: Workflow, operation: EnableNodeOperation | DisableNodeOperation): string | null {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) {
      return `Node not found: ${operation.nodeId || operation.nodeName}`;
    }
    return null;
  }

  // Connection operation validators
  private validateAddConnection(workflow: Workflow, operation: AddConnectionOperation): string | null {
    const sourceNode = this.findNode(workflow, operation.source, operation.source);
    const targetNode = this.findNode(workflow, operation.target, operation.target);
    
    if (!sourceNode) {
      return `Source node not found: ${operation.source}`;
    }
    if (!targetNode) {
      return `Target node not found: ${operation.target}`;
    }
    
    // Check if connection already exists
    const sourceOutput = operation.sourceOutput || 'main';
    const existing = workflow.connections[sourceNode.name]?.[sourceOutput];
    if (existing) {
      const hasConnection = existing.some(connections =>
        connections.some(c => c.node === targetNode.name)
      );
      if (hasConnection) {
        return `Connection already exists from "${sourceNode.name}" to "${targetNode.name}"`;
      }
    }
    
    return null;
  }

  private validateRemoveConnection(workflow: Workflow, operation: RemoveConnectionOperation): string | null {
    const sourceNode = this.findNode(workflow, operation.source, operation.source);
    const targetNode = this.findNode(workflow, operation.target, operation.target);
    
    if (!sourceNode) {
      return `Source node not found: ${operation.source}`;
    }
    if (!targetNode) {
      return `Target node not found: ${operation.target}`;
    }
    
    const sourceOutput = operation.sourceOutput || 'main';
    const connections = workflow.connections[sourceNode.name]?.[sourceOutput];
    if (!connections) {
      return `No connections found from "${sourceNode.name}"`;
    }
    
    const hasConnection = connections.some(conns =>
      conns.some(c => c.node === targetNode.name)
    );
    
    if (!hasConnection) {
      return `No connection exists from "${sourceNode.name}" to "${targetNode.name}"`;
    }
    
    return null;
  }

  private validateUpdateConnection(workflow: Workflow, operation: UpdateConnectionOperation): string | null {
    const sourceNode = this.findNode(workflow, operation.source, operation.source);
    const targetNode = this.findNode(workflow, operation.target, operation.target);
    
    if (!sourceNode) {
      return `Source node not found: ${operation.source}`;
    }
    if (!targetNode) {
      return `Target node not found: ${operation.target}`;
    }
    
    // Check if connection exists to update
    const existingConnections = workflow.connections[sourceNode.name];
    if (!existingConnections) {
      return `No connections found from "${sourceNode.name}"`;
    }
    
    // Check if any connection to target exists
    let hasConnection = false;
    Object.values(existingConnections).forEach(outputs => {
      outputs.forEach(connections => {
        if (connections.some(c => c.node === targetNode.name)) {
          hasConnection = true;
        }
      });
    });
    
    if (!hasConnection) {
      return `No connection exists from "${sourceNode.name}" to "${targetNode.name}"`;
    }
    
    return null;
  }

  // Node operation appliers
  private applyAddNode(workflow: Workflow, operation: AddNodeOperation): void {
    const newNode: WorkflowNode = {
      id: operation.node.id || uuidv4(),
      name: operation.node.name,
      type: operation.node.type,
      typeVersion: operation.node.typeVersion || 1,
      position: operation.node.position,
      parameters: operation.node.parameters || {},
      credentials: operation.node.credentials,
      disabled: operation.node.disabled,
      notes: operation.node.notes,
      notesInFlow: operation.node.notesInFlow,
      continueOnFail: operation.node.continueOnFail,
      retryOnFail: operation.node.retryOnFail,
      maxTries: operation.node.maxTries,
      waitBetweenTries: operation.node.waitBetweenTries,
      alwaysOutputData: operation.node.alwaysOutputData,
      executeOnce: operation.node.executeOnce
    };
    
    workflow.nodes.push(newNode);
  }

  private applyRemoveNode(workflow: Workflow, operation: RemoveNodeOperation): void {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) return;
    
    // Remove node from array
    const index = workflow.nodes.findIndex(n => n.id === node.id);
    if (index !== -1) {
      workflow.nodes.splice(index, 1);
    }
    
    // Remove all connections from this node
    delete workflow.connections[node.name];
    
    // Remove all connections to this node
    Object.keys(workflow.connections).forEach(sourceName => {
      const sourceConnections = workflow.connections[sourceName];
      Object.keys(sourceConnections).forEach(outputName => {
        sourceConnections[outputName] = sourceConnections[outputName].map(connections =>
          connections.filter(conn => conn.node !== node.name)
        ).filter(connections => connections.length > 0);
        
        // Clean up empty arrays
        if (sourceConnections[outputName].length === 0) {
          delete sourceConnections[outputName];
        }
      });
      
      // Clean up empty connection objects
      if (Object.keys(sourceConnections).length === 0) {
        delete workflow.connections[sourceName];
      }
    });
  }

  private applyUpdateNode(workflow: Workflow, operation: UpdateNodeOperation): void {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) return;
    
    // Apply changes using dot notation
    Object.entries(operation.changes).forEach(([path, value]) => {
      this.setNestedProperty(node, path, value);
    });
  }

  private applyMoveNode(workflow: Workflow, operation: MoveNodeOperation): void {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) return;
    
    node.position = operation.position;
  }

  private applyEnableNode(workflow: Workflow, operation: EnableNodeOperation): void {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) return;
    
    node.disabled = false;
  }

  private applyDisableNode(workflow: Workflow, operation: DisableNodeOperation): void {
    const node = this.findNode(workflow, operation.nodeId, operation.nodeName);
    if (!node) return;
    
    node.disabled = true;
  }

  // Connection operation appliers
  private applyAddConnection(workflow: Workflow, operation: AddConnectionOperation): void {
    const sourceNode = this.findNode(workflow, operation.source, operation.source);
    const targetNode = this.findNode(workflow, operation.target, operation.target);
    if (!sourceNode || !targetNode) return;
    
    const sourceOutput = operation.sourceOutput || 'main';
    const targetInput = operation.targetInput || 'main';
    const sourceIndex = operation.sourceIndex || 0;
    const targetIndex = operation.targetIndex || 0;
    
    // Initialize connections structure if needed
    if (!workflow.connections[sourceNode.name]) {
      workflow.connections[sourceNode.name] = {};
    }
    if (!workflow.connections[sourceNode.name][sourceOutput]) {
      workflow.connections[sourceNode.name][sourceOutput] = [];
    }
    
    // Ensure we have array at the source index
    while (workflow.connections[sourceNode.name][sourceOutput].length <= sourceIndex) {
      workflow.connections[sourceNode.name][sourceOutput].push([]);
    }
    
    // Add connection
    workflow.connections[sourceNode.name][sourceOutput][sourceIndex].push({
      node: targetNode.name,
      type: targetInput,
      index: targetIndex
    });
  }

  private applyRemoveConnection(workflow: Workflow, operation: RemoveConnectionOperation): void {
    const sourceNode = this.findNode(workflow, operation.source, operation.source);
    const targetNode = this.findNode(workflow, operation.target, operation.target);
    if (!sourceNode || !targetNode) return;
    
    const sourceOutput = operation.sourceOutput || 'main';
    const connections = workflow.connections[sourceNode.name]?.[sourceOutput];
    if (!connections) return;
    
    // Remove connection from all indices
    workflow.connections[sourceNode.name][sourceOutput] = connections.map(conns =>
      conns.filter(conn => conn.node !== targetNode.name)
    );
    
    // Clean up empty arrays
    workflow.connections[sourceNode.name][sourceOutput] = 
      workflow.connections[sourceNode.name][sourceOutput].filter(conns => conns.length > 0);
    
    if (workflow.connections[sourceNode.name][sourceOutput].length === 0) {
      delete workflow.connections[sourceNode.name][sourceOutput];
    }
    
    if (Object.keys(workflow.connections[sourceNode.name]).length === 0) {
      delete workflow.connections[sourceNode.name];
    }
  }

  private applyUpdateConnection(workflow: Workflow, operation: UpdateConnectionOperation): void {
    // For now, implement as remove + add
    this.applyRemoveConnection(workflow, {
      type: 'removeConnection',
      source: operation.source,
      target: operation.target,
      sourceOutput: operation.changes.sourceOutput,
      targetInput: operation.changes.targetInput
    });
    
    this.applyAddConnection(workflow, {
      type: 'addConnection',
      source: operation.source,
      target: operation.target,
      sourceOutput: operation.changes.sourceOutput,
      targetInput: operation.changes.targetInput,
      sourceIndex: operation.changes.sourceIndex,
      targetIndex: operation.changes.targetIndex
    });
  }

  // Metadata operation appliers
  private applyUpdateSettings(workflow: Workflow, operation: UpdateSettingsOperation): void {
    if (!workflow.settings) {
      workflow.settings = {};
    }
    Object.assign(workflow.settings, operation.settings);
  }

  private applyUpdateName(workflow: Workflow, operation: UpdateNameOperation): void {
    workflow.name = operation.name;
  }

  private applyAddTag(workflow: Workflow, operation: AddTagOperation): void {
    if (!workflow.tags) {
      workflow.tags = [];
    }
    if (!workflow.tags.includes(operation.tag)) {
      workflow.tags.push(operation.tag);
    }
  }

  private applyRemoveTag(workflow: Workflow, operation: RemoveTagOperation): void {
    if (!workflow.tags) return;
    
    const index = workflow.tags.indexOf(operation.tag);
    if (index !== -1) {
      workflow.tags.splice(index, 1);
    }
  }

  // Helper methods
  private findNode(workflow: Workflow, nodeId?: string, nodeName?: string): WorkflowNode | null {
    if (nodeId) {
      const nodeById = workflow.nodes.find(n => n.id === nodeId);
      if (nodeById) return nodeById;
    }
    
    if (nodeName) {
      const nodeByName = workflow.nodes.find(n => n.name === nodeName);
      if (nodeByName) return nodeByName;
    }
    
    // If nodeId is provided but not found, try treating it as a name
    if (nodeId && !nodeName) {
      const nodeByName = workflow.nodes.find(n => n.name === nodeId);
      if (nodeByName) return nodeByName;
    }
    
    return null;
  }

  private setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}