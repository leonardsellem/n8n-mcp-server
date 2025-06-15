import { BaseCollaborationToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface TrackChangesOptions {
  workflowId: string;
  operation: 'get_version_history' | 'compare_versions' | 'create_snapshot' | 'restore_version' | 'track_changes';
  fromVersion?: string;
  toVersion?: string;
  snapshotName?: string;
  includeDetails?: boolean;
  limit?: number;
}

interface WorkflowVersion {
  id: string;
  workflowId: string;
  versionNumber: number;
  name: string;
  description?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  size: number;
  changeType: 'major' | 'minor' | 'patch' | 'snapshot';
  tags: string[];
  isActive: boolean;
  metadata: {
    totalNodes: number;
    totalConnections: number;
    executionCount: number;
    lastExecution?: string;
  };
  changes?: {
    summary: string;
    addedNodes: number;
    removedNodes: number;
    modifiedNodes: number;
    changedConnections: number;
  };
}

interface VersionComparison {
  fromVersion: WorkflowVersion;
  toVersion: WorkflowVersion;
  diff: {
    metadata: {
      timestamp: string;
      changeType: 'major' | 'minor' | 'patch';
      changeSize: 'small' | 'medium' | 'large';
    };
    changes: {
      name: any;
      active: any;
      tags: any;
      nodes: any;
      connections: any;
      settings: any;
    };
    summary: {
      hasChanges: boolean;
      changeCount: number;
      addedNodes: number;
      removedNodes: number;
      modifiedNodes: number;
      changedConnections: number;
    };
  };
  insights: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impactAssessment: string;
    recommendations: string[];
    breakingChanges: string[];
  };
}

interface TrackingResult {
  success: boolean;
  operation: string;
  versions?: WorkflowVersion[];
  version?: WorkflowVersion;
  comparison?: VersionComparison;
  message?: string;
  statistics?: {
    totalVersions: number;
    activeBranches: number;
    totalChanges: number;
    averageChangeSize: number;
    lastChange: string;
  };
}

export class TrackWorkflowChangesHandler extends BaseCollaborationToolHandler {
  private workflowVersions: Map<string, WorkflowVersion[]> = new Map();
  private versionCounter: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeSampleVersions();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId', 'operation']);
      const options = args as TrackChangesOptions;
      const result = await this.trackWorkflowChanges(options);
      return this.formatSuccess(result, `Change tracking operation '${options.operation}' completed successfully`);
    }, args);
  }

  async trackWorkflowChanges(options: TrackChangesOptions): Promise<TrackingResult> {
    try {
      switch (options.operation) {
        case 'get_version_history':
          return await this.getVersionHistory(options);
        case 'compare_versions':
          return await this.compareVersions(options);
        case 'create_snapshot':
          return await this.createSnapshot(options);
        case 'restore_version':
          return await this.restoreVersion(options);
        case 'track_changes':
          return await this.trackChanges(options);
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

  private async getVersionHistory(options: TrackChangesOptions): Promise<TrackingResult> {
    const versions = this.workflowVersions.get(options.workflowId) || [];
    const limit = options.limit || 50;
    
    // Sort by version number (latest first) and apply limit
    const sortedVersions = versions
      .sort((a, b) => b.versionNumber - a.versionNumber)
      .slice(0, limit);

    const statistics = {
      totalVersions: versions.length,
      activeBranches: 1, // Simplified - in real implementation could have multiple branches
      totalChanges: versions.reduce((sum, v) => sum + (v.changes?.addedNodes || 0) + (v.changes?.removedNodes || 0) + (v.changes?.modifiedNodes || 0), 0),
      averageChangeSize: this.calculateAverageChangeSize(versions),
      lastChange: versions.length > 0 ? versions[0].createdAt : 'Never'
    };

    return {
      success: true,
      operation: 'get_version_history',
      versions: sortedVersions,
      statistics
    };
  }

  private async compareVersions(options: TrackChangesOptions): Promise<TrackingResult> {
    if (!options.fromVersion || !options.toVersion) {
      throw new Error('fromVersion and toVersion are required for compare_versions operation');
    }

    const versions = this.workflowVersions.get(options.workflowId) || [];
    const fromVersion = versions.find(v => v.id === options.fromVersion);
    const toVersion = versions.find(v => v.id === options.toVersion);

    if (!fromVersion || !toVersion) {
      throw new Error('One or both versions not found');
    }

    // Get actual workflow data for comparison
    const fromWorkflow = await this.getWorkflowForVersion(fromVersion);
    const toWorkflow = await this.getWorkflowForVersion(toVersion);

    // Generate diff
    const diff = this.generateWorkflowDiff(fromWorkflow, toWorkflow);
    
    // Assess impact and risks
    const insights = this.generateVersionInsights(diff, fromVersion, toVersion);

    const comparison: VersionComparison = {
      fromVersion,
      toVersion,
      diff,
      insights
    };

    return {
      success: true,
      operation: 'compare_versions',
      comparison
    };
  }

  private async createSnapshot(options: TrackChangesOptions): Promise<TrackingResult> {
    // Get current workflow state
    const workflow = await this.apiService.getWorkflow(options.workflowId);
    
    // Create new version
    const currentVersionNumber = this.versionCounter.get(options.workflowId) || 0;
    const newVersionNumber = currentVersionNumber + 1;
    this.versionCounter.set(options.workflowId, newVersionNumber);

    const newVersion: WorkflowVersion = {
      id: `version_${options.workflowId}_${newVersionNumber}`,
      workflowId: options.workflowId,
      versionNumber: newVersionNumber,
      name: options.snapshotName || `Version ${newVersionNumber}`,
      description: `Snapshot created at ${new Date().toLocaleString()}`,
      author: {
        id: 'current_user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      size: JSON.stringify(workflow).length,
      changeType: 'snapshot',
      tags: ['manual-snapshot'],
      isActive: true,
      metadata: {
        totalNodes: workflow.nodes?.length || 0,
        totalConnections: this.countConnections(workflow.connections || {}),
        executionCount: 0
      }
    };

    // Add to version history
    const existingVersions = this.workflowVersions.get(options.workflowId) || [];
    
    // Mark previous versions as inactive
    existingVersions.forEach(v => v.isActive = false);
    
    this.workflowVersions.set(options.workflowId, [...existingVersions, newVersion]);

    return {
      success: true,
      operation: 'create_snapshot',
      version: newVersion,
      message: 'Snapshot created successfully'
    };
  }

  private async restoreVersion(options: TrackChangesOptions): Promise<TrackingResult> {
    if (!options.fromVersion) {
      throw new Error('fromVersion is required for restore_version operation');
    }

    const versions = this.workflowVersions.get(options.workflowId) || [];
    const versionToRestore = versions.find(v => v.id === options.fromVersion);

    if (!versionToRestore) {
      throw new Error(`Version ${options.fromVersion} not found`);
    }

    // In a real implementation, this would restore the workflow to the specified version
    // For now, we'll simulate the process
    
    // Create a new version that represents the restoration
    const currentVersionNumber = this.versionCounter.get(options.workflowId) || 0;
    const newVersionNumber = currentVersionNumber + 1;
    this.versionCounter.set(options.workflowId, newVersionNumber);

    const restoredVersion: WorkflowVersion = {
      ...versionToRestore,
      id: `version_${options.workflowId}_${newVersionNumber}`,
      versionNumber: newVersionNumber,
      name: `Restored from ${versionToRestore.name}`,
      description: `Restored from version ${versionToRestore.versionNumber}`,
      createdAt: new Date().toISOString(),
      changeType: 'major',
      tags: ['restoration', `from-v${versionToRestore.versionNumber}`],
      isActive: true
    };

    // Mark other versions as inactive
    versions.forEach(v => v.isActive = false);
    versions.push(restoredVersion);
    
    this.workflowVersions.set(options.workflowId, versions);

    return {
      success: true,
      operation: 'restore_version',
      version: restoredVersion,
      message: `Workflow restored to version ${versionToRestore.versionNumber}`
    };
  }

  private async trackChanges(options: TrackChangesOptions): Promise<TrackingResult> {
    // Get current workflow and compare with latest version
    const workflow = await this.apiService.getWorkflow(options.workflowId);
    const versions = this.workflowVersions.get(options.workflowId) || [];
    const latestVersion = versions.find(v => v.isActive) || versions[versions.length - 1];

    if (!latestVersion) {
      return {
        success: true,
        operation: 'track_changes',
        message: 'No previous version found. This appears to be the first version.'
      };
    }

    const previousWorkflow = await this.getWorkflowForVersion(latestVersion);
    const diff = this.generateWorkflowDiff(previousWorkflow, workflow);

    // If there are changes, create a new version
    if (diff.summary.hasChanges) {
      const currentVersionNumber = this.versionCounter.get(options.workflowId) || 0;
      const newVersionNumber = currentVersionNumber + 1;
      this.versionCounter.set(options.workflowId, newVersionNumber);

      const changeType = this.determineChangeType(diff);
      
      const newVersion: WorkflowVersion = {
        id: `version_${options.workflowId}_${newVersionNumber}`,
        workflowId: options.workflowId,
        versionNumber: newVersionNumber,
        name: `Version ${newVersionNumber}`,
        description: this.generateChangeDescription(diff),
        author: {
          id: 'current_user',
          name: 'Current User',
          email: 'user@example.com'
        },
        createdAt: new Date().toISOString(),
        size: JSON.stringify(workflow).length,
        changeType,
        tags: this.generateChangeTags(diff),
        isActive: true,
        metadata: {
          totalNodes: workflow.nodes?.length || 0,
          totalConnections: this.countConnections(workflow.connections || {}),
          executionCount: 0
        },
        changes: {
          summary: diff.summary.changeCount > 1 ? 'Multiple changes' : 'Single change',
          addedNodes: diff.summary.addedNodes,
          removedNodes: diff.summary.removedNodes,
          modifiedNodes: diff.summary.modifiedNodes,
          changedConnections: diff.summary.changedConnections
        }
      };

      // Mark previous version as inactive
      versions.forEach(v => v.isActive = false);
      versions.push(newVersion);
      this.workflowVersions.set(options.workflowId, versions);

      return {
        success: true,
        operation: 'track_changes',
        version: newVersion,
        message: `Changes detected and new version ${newVersionNumber} created`
      };
    } else {
      return {
        success: true,
        operation: 'track_changes',
        message: 'No changes detected since last version'
      };
    }
  }

  private async getWorkflowForVersion(version: WorkflowVersion): Promise<any> {
    // In a real implementation, this would retrieve the actual workflow data for the version
    // For simulation, we'll create a mock workflow based on the version metadata
    return {
      id: version.workflowId,
      name: `Workflow for ${version.name}`,
      nodes: Array(version.metadata.totalNodes).fill(null).map((_, i) => ({
        id: `node_${i}`,
        name: `Node ${i}`,
        type: 'n8n-nodes-base.httpRequest'
      })),
      connections: {},
      active: true,
      versionId: version.id
    };
  }

  private countConnections(connections: any): number {
    return Object.keys(connections).length;
  }

  private calculateAverageChangeSize(versions: WorkflowVersion[]): number {
    if (versions.length === 0) return 0;
    
    const totalChanges = versions.reduce((sum, v) => {
      const changes = v.changes;
      if (!changes) return sum;
      return sum + changes.addedNodes + changes.removedNodes + changes.modifiedNodes;
    }, 0);
    
    return Math.round(totalChanges / versions.length * 100) / 100;
  }

  private generateVersionInsights(diff: any, fromVersion: WorkflowVersion, toVersion: WorkflowVersion): VersionComparison['insights'] {
    const totalChanges = diff.summary.changeCount;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (totalChanges > 10) riskLevel = 'critical';
    else if (totalChanges > 5) riskLevel = 'high';
    else if (totalChanges > 2) riskLevel = 'medium';

    const recommendations: string[] = [];
    const breakingChanges: string[] = [];

    if (diff.summary.removedNodes > 0) {
      recommendations.push('Test thoroughly as nodes were removed');
      breakingChanges.push('Node removal may break dependent workflows');
    }

    if (diff.summary.changedConnections > 0) {
      recommendations.push('Verify all connections are working correctly');
      breakingChanges.push('Connection changes may affect data flow');
    }

    if (diff.changes.active?.changed) {
      recommendations.push('Workflow activation state changed - review impact');
    }

    const impactAssessment = `${totalChanges} changes detected. Risk level: ${riskLevel}. ${breakingChanges.length} potential breaking changes identified.`;

    return {
      riskLevel,
      impactAssessment,
      recommendations,
      breakingChanges
    };
  }

  private determineChangeType(diff: any): 'major' | 'minor' | 'patch' {
    const totalChanges = diff.summary.changeCount;
    
    if (diff.summary.removedNodes > 0 || diff.summary.changedConnections > 3) {
      return 'major';
    } else if (diff.summary.addedNodes > 0 || totalChanges > 2) {
      return 'minor';
    } else {
      return 'patch';
    }
  }

  private generateChangeDescription(diff: any): string {
    const changes: string[] = [];
    
    if (diff.summary.addedNodes > 0) {
      changes.push(`${diff.summary.addedNodes} node(s) added`);
    }
    if (diff.summary.removedNodes > 0) {
      changes.push(`${diff.summary.removedNodes} node(s) removed`);
    }
    if (diff.summary.modifiedNodes > 0) {
      changes.push(`${diff.summary.modifiedNodes} node(s) modified`);
    }
    if (diff.summary.changedConnections > 0) {
      changes.push(`${diff.summary.changedConnections} connection(s) changed`);
    }
    
    return changes.length > 0 ? changes.join(', ') : 'Minor changes';
  }

  private generateChangeTags(diff: any): string[] {
    const tags: string[] = [];
    
    if (diff.summary.addedNodes > 0) tags.push('nodes-added');
    if (diff.summary.removedNodes > 0) tags.push('nodes-removed');
    if (diff.summary.modifiedNodes > 0) tags.push('nodes-modified');
    if (diff.summary.changedConnections > 0) tags.push('connections-changed');
    if (diff.changes.active?.changed) tags.push('activation-changed');
    if (diff.changes.name?.changed) tags.push('renamed');
    
    return tags;
  }

  private initializeSampleVersions(): void {
    // Initialize with some sample versions for demonstration
    const sampleVersions: WorkflowVersion[] = [
      {
        id: 'version_workflow_1_1',
        workflowId: 'workflow_1',
        versionNumber: 1,
        name: 'Initial Version',
        description: 'First version of the workflow',
        author: {
          id: 'user_creator',
          name: 'Workflow Creator',
          email: 'creator@example.com'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        size: 2048,
        changeType: 'major',
        tags: ['initial', 'baseline'],
        isActive: false,
        metadata: {
          totalNodes: 3,
          totalConnections: 2,
          executionCount: 25
        },
        changes: {
          summary: 'Initial creation',
          addedNodes: 3,
          removedNodes: 0,
          modifiedNodes: 0,
          changedConnections: 2
        }
      },
      {
        id: 'version_workflow_1_2',
        workflowId: 'workflow_1',
        versionNumber: 2,
        name: 'Added Error Handling',
        description: 'Added error handling and retry logic',
        author: {
          id: 'user_developer',
          name: 'Developer',
          email: 'dev@example.com'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        size: 3072,
        changeType: 'minor',
        tags: ['error-handling', 'improvement'],
        isActive: true,
        metadata: {
          totalNodes: 5,
          totalConnections: 4,
          executionCount: 12
        },
        changes: {
          summary: 'Added error handling nodes',
          addedNodes: 2,
          removedNodes: 0,
          modifiedNodes: 1,
          changedConnections: 2
        }
      }
    ];

    this.workflowVersions.set('workflow_1', sampleVersions);
    this.versionCounter.set('workflow_1', 2);
  }
}