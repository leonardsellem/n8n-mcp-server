/**
 * Workflow Diff Types
 * Defines the structure for partial workflow updates using diff operations
 */

import { WorkflowNode, WorkflowConnection } from './n8n-api';

// Base operation interface
export interface DiffOperation {
  type: string;
  description?: string; // Optional description for clarity
}

// Node Operations
export interface AddNodeOperation extends DiffOperation {
  type: 'addNode';
  node: Partial<WorkflowNode> & {
    name: string; // Name is required
    type: string; // Type is required
    position: [number, number]; // Position is required
  };
}

export interface RemoveNodeOperation extends DiffOperation {
  type: 'removeNode';
  nodeId?: string; // Can use either ID or name
  nodeName?: string;
}

export interface UpdateNodeOperation extends DiffOperation {
  type: 'updateNode';
  nodeId?: string; // Can use either ID or name
  nodeName?: string;
  changes: {
    [path: string]: any; // Dot notation paths like 'parameters.url'
  };
}

export interface MoveNodeOperation extends DiffOperation {
  type: 'moveNode';
  nodeId?: string;
  nodeName?: string;
  position: [number, number];
}

export interface EnableNodeOperation extends DiffOperation {
  type: 'enableNode';
  nodeId?: string;
  nodeName?: string;
}

export interface DisableNodeOperation extends DiffOperation {
  type: 'disableNode';
  nodeId?: string;
  nodeName?: string;
}

// Connection Operations
export interface AddConnectionOperation extends DiffOperation {
  type: 'addConnection';
  source: string; // Node name or ID
  target: string; // Node name or ID
  sourceOutput?: string; // Default: 'main'
  targetInput?: string; // Default: 'main'
  sourceIndex?: number; // Default: 0
  targetIndex?: number; // Default: 0
}

export interface RemoveConnectionOperation extends DiffOperation {
  type: 'removeConnection';
  source: string; // Node name or ID
  target: string; // Node name or ID
  sourceOutput?: string; // Default: 'main'
  targetInput?: string; // Default: 'main'
}

export interface UpdateConnectionOperation extends DiffOperation {
  type: 'updateConnection';
  source: string;
  target: string;
  changes: {
    sourceOutput?: string;
    targetInput?: string;
    sourceIndex?: number;
    targetIndex?: number;
  };
}

// Workflow Metadata Operations
export interface UpdateSettingsOperation extends DiffOperation {
  type: 'updateSettings';
  settings: {
    [key: string]: any;
  };
}

export interface UpdateNameOperation extends DiffOperation {
  type: 'updateName';
  name: string;
}

export interface AddTagOperation extends DiffOperation {
  type: 'addTag';
  tag: string;
}

export interface RemoveTagOperation extends DiffOperation {
  type: 'removeTag';
  tag: string;
}

// Union type for all operations
export type WorkflowDiffOperation =
  | AddNodeOperation
  | RemoveNodeOperation
  | UpdateNodeOperation
  | MoveNodeOperation
  | EnableNodeOperation
  | DisableNodeOperation
  | AddConnectionOperation
  | RemoveConnectionOperation
  | UpdateConnectionOperation
  | UpdateSettingsOperation
  | UpdateNameOperation
  | AddTagOperation
  | RemoveTagOperation;

// Main diff request structure
export interface WorkflowDiffRequest {
  id: string; // Workflow ID
  operations: WorkflowDiffOperation[];
  validateOnly?: boolean; // If true, only validate without applying
}

// Response types
export interface WorkflowDiffValidationError {
  operation: number; // Index of the operation that failed
  message: string;
  details?: any;
}

export interface WorkflowDiffResult {
  success: boolean;
  workflow?: any; // Updated workflow if successful
  errors?: WorkflowDiffValidationError[];
  operationsApplied?: number;
  message?: string;
}

// Helper type for node reference (supports both ID and name)
export interface NodeReference {
  id?: string;
  name?: string;
}

// Utility functions type guards
export function isNodeOperation(op: WorkflowDiffOperation): op is 
  AddNodeOperation | RemoveNodeOperation | UpdateNodeOperation | 
  MoveNodeOperation | EnableNodeOperation | DisableNodeOperation {
  return ['addNode', 'removeNode', 'updateNode', 'moveNode', 'enableNode', 'disableNode'].includes(op.type);
}

export function isConnectionOperation(op: WorkflowDiffOperation): op is 
  AddConnectionOperation | RemoveConnectionOperation | UpdateConnectionOperation {
  return ['addConnection', 'removeConnection', 'updateConnection'].includes(op.type);
}

export function isMetadataOperation(op: WorkflowDiffOperation): op is 
  UpdateSettingsOperation | UpdateNameOperation | AddTagOperation | RemoveTagOperation {
  return ['updateSettings', 'updateName', 'addTag', 'removeTag'].includes(op.type);
}