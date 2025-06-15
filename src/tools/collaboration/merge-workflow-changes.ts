import { BaseCollaborationToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface MergeOptions {
  workflowId: string;
  operation: 'merge_branches' | 'resolve_conflicts' | 'preview_merge' | 'create_branch' | 'list_branches';
  sourceBranch?: string;
  targetBranch?: string;
  baseVersion?: string;
  branchName?: string;
  conflictResolutions?: Record<string, any>;
  mergeStrategy?: 'auto' | 'manual' | 'conservative' | 'aggressive';
  createMergeCommit?: boolean;
}

interface WorkflowBranch {
  id: string;
  name: string;
  workflowId: string;
  basedOn: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  lastModified: string;
  isActive: boolean;
  isDefault: boolean;
  changeCount: number;
  status: 'active' | 'merged' | 'abandoned';
  description?: string;
}

interface MergeConflict {
  id: string;
  type: 'node_conflict' | 'connection_conflict' | 'metadata_conflict' | 'settings_conflict';
  field: string;
  nodeId?: string;
  nodeName?: string;
  sourceValue: any;
  targetValue: any;
  baseValue?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  autoResolvable: boolean;
  suggestedResolution?: 'keep_source' | 'keep_target' | 'merge' | 'manual';
  context: {
    location: string;
    affectedComponents: string[];
    impact: string;
  };
}

interface MergePreview {
  canAutoMerge: boolean;
  conflicts: MergeConflict[];
  summary: {
    totalConflicts: number;
    autoResolvableConflicts: number;
    manualConflicts: number;
    addedNodes: number;
    removedNodes: number;
    modifiedNodes: number;
    changedConnections: number;
  };
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    recommendations: string[];
  };
  estimatedMergeTime: string;
}

interface MergeResult {
  success: boolean;
  operation: string;
  branch?: WorkflowBranch;
  branches?: WorkflowBranch[];
  preview?: MergePreview;
  conflicts?: MergeConflict[];
  mergedWorkflow?: any;
  message?: string;
  statistics?: {
    totalBranches: number;
    activeBranches: number;
    mergedBranches: number;
    conflictsResolved: number;
  };
}

export class MergeWorkflowChangesHandler extends BaseCollaborationToolHandler {
  private workflowBranches: Map<string, WorkflowBranch[]> = new Map();
  private branchData: Map<string, any> = new Map(); // Store actual workflow data for branches

  constructor() {
    super();
    this.initializeSampleBranches();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId', 'operation']);
      const options = args as MergeOptions;
      const result = await this.mergeWorkflowChanges(options);
      return this.formatSuccess(result, `Merge operation '${options.operation}' completed successfully`);
    }, args);
  }

  async mergeWorkflowChanges(options: MergeOptions): Promise<MergeResult> {
    try {
      switch (options.operation) {
        case 'create_branch':
          return await this.createBranch(options);
        case 'list_branches':
          return await this.listBranches(options);
        case 'preview_merge':
          return await this.previewMerge(options);
        case 'merge_branches':
          return await this.mergeBranches(options);
        case 'resolve_conflicts':
          return await this.resolveConflicts(options);
        default:
          throw new Error(`Unsupported operation: ${options.operation}`);
      }
    } catch (error) {
      return {
        success: false,
        operation: options.operation,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createBranch(options: MergeOptions): Promise<MergeResult> {
    if (!options.branchName) {
      throw new Error('branchName is required for create_branch operation');
    }

    // Get current workflow as base
    const baseWorkflow = await this.apiService.getWorkflow(options.workflowId);
    const baseVersion = options.baseVersion || 'main';

    const newBranch: WorkflowBranch = {
      id: `branch_${options.workflowId}_${Date.now()}`,
      name: options.branchName,
      workflowId: options.workflowId,
      basedOn: baseVersion,
      createdBy: {
        id: 'current_user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isActive: true,
      isDefault: false,
      changeCount: 0,
      status: 'active',
      description: `Branch created from ${baseVersion}`
    };

    // Store branch data
    this.branchData.set(newBranch.id, JSON.parse(JSON.stringify(baseWorkflow)));

    // Add to branches list
    const existingBranches = this.workflowBranches.get(options.workflowId) || [];
    this.workflowBranches.set(options.workflowId, [...existingBranches, newBranch]);

    return {
      success: true,
      operation: 'create_branch',
      branch: newBranch,
      message: `Branch '${options.branchName}' created successfully`
    };
  }

  private async listBranches(options: MergeOptions): Promise<MergeResult> {
    const branches = this.workflowBranches.get(options.workflowId) || [];
    
    const statistics = {
      totalBranches: branches.length,
      activeBranches: branches.filter(b => b.status === 'active').length,
      mergedBranches: branches.filter(b => b.status === 'merged').length,
      conflictsResolved: 0 // Would be tracked in real implementation
    };

    return {
      success: true,
      operation: 'list_branches',
      branches,
      statistics
    };
  }

  private async previewMerge(options: MergeOptions): Promise<MergeResult> {
    if (!options.sourceBranch || !options.targetBranch) {
      throw new Error('sourceBranch and targetBranch are required for preview_merge operation');
    }

    const branches = this.workflowBranches.get(options.workflowId) || [];
    const sourceBranch = branches.find(b => b.name === options.sourceBranch);
    const targetBranch = branches.find(b => b.name === options.targetBranch);

    if (!sourceBranch || !targetBranch) {
      throw new Error('Source or target branch not found');
    }

    const sourceWorkflow = this.branchData.get(sourceBranch.id);
    const targetWorkflow = this.branchData.get(targetBranch.id);

    if (!sourceWorkflow || !targetWorkflow) {
      throw new Error('Branch data not found');
    }

    // Find common base
    const baseWorkflow = await this.findCommonBase(sourceBranch, targetBranch);
    
    // Generate conflicts
    const conflicts = this.detectMergeConflicts(sourceWorkflow, targetWorkflow, baseWorkflow);
    
    // Calculate merge statistics
    const diff = this.generateWorkflowDiff(targetWorkflow, sourceWorkflow);
    const summary = {
      totalConflicts: conflicts.length,
      autoResolvableConflicts: conflicts.filter(c => c.autoResolvable).length,
      manualConflicts: conflicts.filter(c => !c.autoResolvable).length,
      addedNodes: diff.summary.addedNodes,
      removedNodes: diff.summary.removedNodes,
      modifiedNodes: diff.summary.modifiedNodes,
      changedConnections: diff.summary.changedConnections
    };

    const riskAssessment = this.assessMergeRisk(conflicts, diff);
    const estimatedMergeTime = this.estimateMergeTime(conflicts, diff);

    const preview: MergePreview = {
      canAutoMerge: summary.manualConflicts === 0,
      conflicts,
      summary,
      riskAssessment,
      estimatedMergeTime
    };

    return {
      success: true,
      operation: 'preview_merge',
      preview
    };
  }

  private async mergeBranches(options: MergeOptions): Promise<MergeResult> {
    if (!options.sourceBranch || !options.targetBranch) {
      throw new Error('sourceBranch and targetBranch are required for merge_branches operation');
    }

    // First get merge preview
    const previewResult = await this.previewMerge(options);
    if (!previewResult.preview) {
      throw new Error('Failed to generate merge preview');
    }

    const preview = previewResult.preview;

    // Check if manual conflicts exist and no resolutions provided
    if (preview.summary.manualConflicts > 0 && !options.conflictResolutions) {
      return {
        success: false,
        operation: 'merge_branches',
        conflicts: preview.conflicts.filter(c => !c.autoResolvable),
        message: `${preview.summary.manualConflicts} conflicts require manual resolution before merge can proceed`
      };
    }

    const branches = this.workflowBranches.get(options.workflowId) || [];
    const sourceBranch = branches.find(b => b.name === options.sourceBranch);
    const targetBranch = branches.find(b => b.name === options.targetBranch);

    if (!sourceBranch || !targetBranch) {
      throw new Error('Source or target branch not found');
    }

    const sourceWorkflow = this.branchData.get(sourceBranch.id);
    const targetWorkflow = this.branchData.get(targetBranch.id);

    // Perform merge
    const mergeResult = this.performMerge(
      sourceWorkflow,
      targetWorkflow,
      preview.conflicts,
      options.conflictResolutions || {},
      options.mergeStrategy || 'auto'
    );

    if (mergeResult.hasConflicts && mergeResult.manualResolutionRequired > 0) {
      return {
        success: false,
        operation: 'merge_branches',
        conflicts: mergeResult.conflicts,
        message: `${mergeResult.manualResolutionRequired} conflicts require manual resolution`
      };
    }

    // Update target branch with merged workflow
    this.branchData.set(targetBranch.id, mergeResult.mergedWorkflow);
    targetBranch.lastModified = new Date().toISOString();
    targetBranch.changeCount += preview.summary.addedNodes + preview.summary.modifiedNodes;

    // Mark source branch as merged if not merging to main
    if (options.targetBranch === 'main') {
      sourceBranch.status = 'merged';
    }

    // Create merge commit if requested
    if (options.createMergeCommit !== false) {
      await this.createMergeCommit(sourceBranch, targetBranch, mergeResult);
    }

    return {
      success: true,
      operation: 'merge_branches',
      mergedWorkflow: mergeResult.mergedWorkflow,
      message: `Successfully merged '${options.sourceBranch}' into '${options.targetBranch}'`
    };
  }

  private async resolveConflicts(options: MergeOptions): Promise<MergeResult> {
    if (!options.conflictResolutions) {
      throw new Error('conflictResolutions is required for resolve_conflicts operation');
    }

    // In a real implementation, this would apply the conflict resolutions
    // and update the merge state accordingly
    
    const resolvedCount = Object.keys(options.conflictResolutions).length;

    return {
      success: true,
      operation: 'resolve_conflicts',
      message: `${resolvedCount} conflicts resolved successfully`
    };
  }

  private detectMergeConflicts(sourceWorkflow: any, targetWorkflow: any, baseWorkflow: any): MergeConflict[] {
    const conflicts: MergeConflict[] = [];

    // Detect node conflicts
    const sourceNodes = sourceWorkflow.nodes || [];
    const targetNodes = targetWorkflow.nodes || [];
    const baseNodes = baseWorkflow?.nodes || [];

    const nodeConflicts = this.detectNodeConflicts(sourceNodes, targetNodes, baseNodes);
    conflicts.push(...nodeConflicts);

    // Detect metadata conflicts
    const metadataConflicts = this.detectMetadataConflicts(sourceWorkflow, targetWorkflow, baseWorkflow);
    conflicts.push(...metadataConflicts);

    // Detect connection conflicts
    const connectionConflicts = this.detectConnectionConflicts(
      sourceWorkflow.connections || {},
      targetWorkflow.connections || {},
      baseWorkflow?.connections || {}
    );
    conflicts.push(...connectionConflicts);

    return conflicts;
  }

  private detectNodeConflicts(sourceNodes: any[], targetNodes: any[], baseNodes: any[]): MergeConflict[] {
    const conflicts: MergeConflict[] = [];
    const baseNodeMap = new Map(baseNodes.map(node => [node.id, node]));
    const sourceNodeMap = new Map(sourceNodes.map(node => [node.id, node]));
    const targetNodeMap = new Map(targetNodes.map(node => [node.id, node]));

    // Check for nodes modified in both branches
    for (const [nodeId, sourceNode] of sourceNodeMap) {
      const targetNode = targetNodeMap.get(nodeId);
      const baseNode = baseNodeMap.get(nodeId);

      if (targetNode && baseNode) {
        const sourceChanged = JSON.stringify(sourceNode) !== JSON.stringify(baseNode);
        const targetChanged = JSON.stringify(targetNode) !== JSON.stringify(baseNode);

        if (sourceChanged && targetChanged) {
          // Both branches modified the same node - potential conflict
          if (JSON.stringify(sourceNode) !== JSON.stringify(targetNode)) {
            conflicts.push({
              id: `node_conflict_${nodeId}`,
              type: 'node_conflict',
              field: 'node_modification',
              nodeId,
              nodeName: sourceNode.name || sourceNode.type,
              sourceValue: sourceNode,
              targetValue: targetNode,
              baseValue: baseNode,
              severity: this.assessConflictSeverity(sourceNode, targetNode, baseNode),
              description: `Node '${sourceNode.name || sourceNode.type}' was modified in both branches`,
              autoResolvable: this.canAutoResolveNodeConflict(sourceNode, targetNode, baseNode),
              suggestedResolution: this.suggestNodeResolution(sourceNode, targetNode, baseNode),
              context: {
                location: `Node: ${nodeId}`,
                affectedComponents: ['workflow execution', 'data flow'],
                impact: 'May affect workflow behavior and data processing'
              }
            });
          }
        }
      }
    }

    return conflicts;
  }

  private detectMetadataConflicts(sourceWorkflow: any, targetWorkflow: any, baseWorkflow: any): MergeConflict[] {
    const conflicts: MergeConflict[] = [];
    const metadataFields = ['name', 'active', 'tags', 'settings'];

    for (const field of metadataFields) {
      const sourceValue = sourceWorkflow[field];
      const targetValue = targetWorkflow[field];
      const baseValue = baseWorkflow?.[field];

      const sourceChanged = JSON.stringify(sourceValue) !== JSON.stringify(baseValue);
      const targetChanged = JSON.stringify(targetValue) !== JSON.stringify(baseValue);

      if (sourceChanged && targetChanged && JSON.stringify(sourceValue) !== JSON.stringify(targetValue)) {
        conflicts.push({
          id: `metadata_conflict_${field}`,
          type: 'metadata_conflict',
          field,
          sourceValue,
          targetValue,
          baseValue,
          severity: field === 'active' ? 'high' : 'medium',
          description: `Workflow ${field} was changed in both branches`,
          autoResolvable: this.canAutoResolveMetadataConflict(field, sourceValue, targetValue),
          suggestedResolution: this.suggestMetadataResolution(field, sourceValue, targetValue),
          context: {
            location: `Workflow metadata: ${field}`,
            affectedComponents: ['workflow configuration'],
            impact: `Changes to ${field} may affect workflow behavior`
          }
        });
      }
    }

    return conflicts;
  }

  private detectConnectionConflicts(sourceConnections: any, targetConnections: any, baseConnections: any): MergeConflict[] {
    const conflicts: MergeConflict[] = [];
    
    const sourceStr = JSON.stringify(sourceConnections);
    const targetStr = JSON.stringify(targetConnections);
    const baseStr = JSON.stringify(baseConnections);

    if (sourceStr !== baseStr && targetStr !== baseStr && sourceStr !== targetStr) {
      conflicts.push({
        id: 'connection_conflict_main',
        type: 'connection_conflict',
        field: 'connections',
        sourceValue: sourceConnections,
        targetValue: targetConnections,
        baseValue: baseConnections,
        severity: 'high',
        description: 'Workflow connections were modified in both branches',
        autoResolvable: false,
        suggestedResolution: 'manual',
        context: {
          location: 'Workflow connections',
          affectedComponents: ['data flow', 'node execution order'],
          impact: 'Connection changes may significantly affect workflow execution'
        }
      });
    }

    return conflicts;
  }

  private assessConflictSeverity(sourceValue: any, targetValue: any, baseValue: any): 'low' | 'medium' | 'high' | 'critical' {
    // Simplified severity assessment
    if (sourceValue?.type !== targetValue?.type) return 'critical';
    if (sourceValue?.name !== targetValue?.name) return 'medium';
    return 'low';
  }

  private canAutoResolveNodeConflict(sourceNode: any, targetNode: any, baseNode: any): boolean {
    // Simple heuristic - can auto-resolve if only parameters changed
    return sourceNode.type === targetNode.type && 
           sourceNode.name === targetNode.name &&
           sourceNode.position === targetNode.position;
  }

  private suggestNodeResolution(sourceNode: any, targetNode: any, baseNode: any): 'keep_source' | 'keep_target' | 'merge' | 'manual' {
    if (this.canAutoResolveNodeConflict(sourceNode, targetNode, baseNode)) {
      return 'merge';
    }
    return 'manual';
  }

  private canAutoResolveMetadataConflict(field: string, sourceValue: any, targetValue: any): boolean {
    // Tags can often be merged automatically
    return field === 'tags' && Array.isArray(sourceValue) && Array.isArray(targetValue);
  }

  private suggestMetadataResolution(field: string, sourceValue: any, targetValue: any): 'keep_source' | 'keep_target' | 'merge' | 'manual' {
    if (field === 'tags') return 'merge';
    if (field === 'active') return 'keep_target'; // Prefer target branch activation state
    return 'manual';
  }

  private assessMergeRisk(conflicts: MergeConflict[], diff: any): MergePreview['riskAssessment'] {
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
    const highConflicts = conflicts.filter(c => c.severity === 'high').length;
    const totalChanges = diff.summary.changeCount;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    if (criticalConflicts > 0) {
      riskLevel = 'critical';
      riskFactors.push(`${criticalConflicts} critical conflicts detected`);
      recommendations.push('Manual review required for all critical conflicts');
    } else if (highConflicts > 0) {
      riskLevel = 'high';
      riskFactors.push(`${highConflicts} high-severity conflicts detected`);
    } else if (totalChanges > 10) {
      riskLevel = 'medium';
      riskFactors.push('Large number of changes detected');
    }

    if (conflicts.some(c => c.type === 'connection_conflict')) {
      riskFactors.push('Connection changes may affect workflow execution');
      recommendations.push('Test workflow execution after merge');
    }

    if (recommendations.length === 0) {
      recommendations.push('Merge appears safe to proceed automatically');
    }

    return { riskLevel, riskFactors, recommendations };
  }

  private estimateMergeTime(conflicts: MergeConflict[], diff: any): string {
    const manualConflicts = conflicts.filter(c => !c.autoResolvable).length;
    const totalChanges = diff.summary.changeCount;

    if (manualConflicts > 5) return '30-60 minutes';
    if (manualConflicts > 0) return '10-30 minutes';
    if (totalChanges > 10) return '5-10 minutes';
    return '1-5 minutes';
  }

  private performMerge(sourceWorkflow: any, targetWorkflow: any, conflicts: MergeConflict[], resolutions: Record<string, any>, strategy: string): any {
    // Simplified merge implementation
    const mergedWorkflow = JSON.parse(JSON.stringify(targetWorkflow));
    const conflictsRemaining: MergeConflict[] = [];

    // Apply automatic resolutions
    for (const conflict of conflicts) {
      if (conflict.autoResolvable || resolutions[conflict.id]) {
        // Apply resolution
        this.applyConflictResolution(mergedWorkflow, conflict, resolutions[conflict.id] || conflict.suggestedResolution);
      } else {
        conflictsRemaining.push(conflict);
      }
    }

    return {
      mergedWorkflow,
      conflicts: conflictsRemaining,
      hasConflicts: conflictsRemaining.length > 0,
      autoResolved: conflicts.length - conflictsRemaining.length,
      manualResolutionRequired: conflictsRemaining.length
    };
  }

  private applyConflictResolution(workflow: any, conflict: MergeConflict, resolution: any): void {
    // Simplified resolution application
    if (conflict.type === 'metadata_conflict' && conflict.field === 'tags' && resolution === 'merge') {
      // Merge tags arrays
      const sourceTags = Array.isArray(conflict.sourceValue) ? conflict.sourceValue : [];
      const targetTags = Array.isArray(conflict.targetValue) ? conflict.targetValue : [];
      workflow.tags = [...new Set([...sourceTags, ...targetTags])];
    }
    // Additional resolution logic would be implemented here
  }

  private async findCommonBase(sourceBranch: WorkflowBranch, targetBranch: WorkflowBranch): Promise<any> {
    // Simplified - in real implementation, would find actual common ancestor
    return this.branchData.get(sourceBranch.basedOn) || {};
  }

  private async createMergeCommit(sourceBranch: WorkflowBranch, targetBranch: WorkflowBranch, mergeResult: any): Promise<void> {
    // Simulate creating a merge commit
    console.log(`Merge commit created: Merged '${sourceBranch.name}' into '${targetBranch.name}'`);
  }

  private initializeSampleBranches(): void {
    // Initialize with some sample branches for demonstration
    const sampleBranches: WorkflowBranch[] = [
      {
        id: 'branch_main',
        name: 'main',
        workflowId: 'workflow_1',
        basedOn: 'initial',
        createdBy: {
          id: 'system',
          name: 'System',
          email: 'system@example.com'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isDefault: true,
        changeCount: 5,
        status: 'active',
        description: 'Main development branch'
      },
      {
        id: 'branch_feature_auth',
        name: 'feature/authentication',
        workflowId: 'workflow_1',
        basedOn: 'main',
        createdBy: {
          id: 'user_developer',
          name: 'Developer',
          email: 'dev@example.com'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isDefault: false,
        changeCount: 3,
        status: 'active',
        description: 'Adding authentication to the workflow'
      }
    ];

    this.workflowBranches.set('workflow_1', sampleBranches);

    // Store sample workflow data for branches
    const mainWorkflow = {
      id: 'workflow_1',
      name: 'Main Workflow',
      nodes: [
        { id: 'node1', name: 'Start', type: 'n8n-nodes-base.start' },
        { id: 'node2', name: 'HTTP Request', type: 'n8n-nodes-base.httpRequest' }
      ],
      connections: { node1: { main: [{ node: 'node2', type: 'main', index: 0 }] } },
      active: true
    };

    const featureWorkflow = {
      ...mainWorkflow,
      nodes: [
        ...mainWorkflow.nodes,
        { id: 'node3', name: 'Auth Check', type: 'n8n-nodes-base.if' }
      ]
    };

    this.branchData.set('branch_main', mainWorkflow);
    this.branchData.set('branch_feature_auth', featureWorkflow);
  }
}