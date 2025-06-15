/**
 * Identify Unused Workflows Tool
 * 
 * Tool for finding and cleaning up unused workflows and resources.
 */

import { OptimizationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface IdentifyUnusedArgs {
  analysisType?: 'execution' | 'dependency' | 'access' | 'comprehensive';
  inactivePeriod?: number; // days
  includeTemporary?: boolean;
  includeTest?: boolean;
  cleanupMode?: 'archive' | 'delete' | 'report_only';
  preserveCritical?: boolean;
}

interface UnusedWorkflow {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastModified: string;
  lastExecution?: string;
  lastAccessed?: string;
  createdBy: string;
  unusedReason: string[];
  dependencies: {
    incoming: string[]; // Workflows that call this one
    outgoing: string[]; // Workflows this one calls
    credentials: string[];
    subWorkflows: string[];
  };
  resourceUsage: {
    nodeCount: number;
    credentialCount: number;
    estimatedCost: string;
  };
  cleanupRecommendation: {
    action: 'archive' | 'delete' | 'keep' | 'review';
    priority: 'low' | 'medium' | 'high';
    reasoning: string;
    risks: string[];
    benefits: string[];
  };
  metadata: {
    tags: string[];
    folder?: string;
    description?: string;
    isTemplate: boolean;
    isTest: boolean;
  };
}

interface CleanupPlan {
  phase: number;
  workflows: string[];
  action: 'archive' | 'delete';
  dependencies: string[];
  estimatedSavings: {
    storage: string;
    maintenance: string;
    complexity: string;
  };
  risks: string[];
  prerequisites: string[];
}

interface UnusedAnalysisResult {
  totalWorkflows: number;
  activeWorkflows: number;
  inactiveWorkflows: number;
  unusedWorkflows: UnusedWorkflow[];
  resourceSummary: {
    totalNodes: number;
    unusedNodes: number;
    totalCredentials: number;
    unusedCredentials: string[];
    totalStorage: string;
    reclaimableStorage: string;
  };
  cleanupPlan: CleanupPlan[];
  summary: {
    totalUnused: number;
    safeToDelete: number;
    needsReview: number;
    estimatedSavings: string;
    recommendations: string[];
  };
  executedCleanup?: {
    archived: string[];
    deleted: string[];
    errors: Array<{ workflowId: string; error: string }>;
  };
}

export class IdentifyUnusedWorkflowsHandler extends OptimizationBaseHandler {
  async execute(args: IdentifyUnusedArgs): Promise<ToolCallResult> {
    try {
      const {
        analysisType = 'comprehensive',
        inactivePeriod = 30,
        includeTemporary = false,
        includeTest = false,
        cleanupMode = 'report_only',
        preserveCritical = true
      } = args;

      // Get all workflows for analysis
      const allWorkflows = await this.getAllWorkflows();
      
      // Analyze each workflow for usage patterns
      const unusedWorkflows = await this.analyzeWorkflowUsage(
        allWorkflows,
        analysisType,
        inactivePeriod,
        includeTemporary,
        includeTest,
        preserveCritical
      );

      // Generate cleanup plan
      const cleanupPlan = await this.generateCleanupPlan(unusedWorkflows);

      // Calculate resource summary
      const resourceSummary = this.calculateResourceSummary(allWorkflows, unusedWorkflows);

      let executedCleanup;
      if (cleanupMode !== 'report_only') {
        executedCleanup = await this.executeCleanup(unusedWorkflows, cleanupPlan, cleanupMode);
      }

      const result: UnusedAnalysisResult = {
        totalWorkflows: allWorkflows.length,
        activeWorkflows: allWorkflows.filter(w => w.active).length,
        inactiveWorkflows: allWorkflows.filter(w => !w.active).length,
        unusedWorkflows,
        resourceSummary,
        cleanupPlan,
        summary: this.generateAnalysisSummary(allWorkflows, unusedWorkflows, cleanupPlan),
        executedCleanup
      };

      return this.formatOptimizationResponse(
        result,
        `Identified ${unusedWorkflows.length} unused workflows from ${allWorkflows.length} total workflows`
      );

    } catch (error) {
      return this.handleOptimizationError(error, 'identify unused workflows');
    }
  }

  private async getAllWorkflows(): Promise<any[]> {
    // Mock workflow data with various states
    return [
      {
        id: 'wf1',
        name: 'Active User Registration',
        active: true,
        lastModified: '2024-01-15T10:00:00Z',
        lastExecution: '2024-01-15T14:30:00Z',
        lastAccessed: '2024-01-15T16:00:00Z',
        createdBy: 'admin',
        nodes: [
          { type: 'n8n-nodes-base.webhook' },
          { type: 'n8n-nodes-base.set' },
          { type: 'n8n-nodes-base.emailSend' }
        ],
        credentials: ['smtp'],
        tags: ['production', 'user-management'],
        folder: 'production',
        isTemplate: false,
        isTest: false
      },
      {
        id: 'wf2',
        name: 'Old Password Reset',
        active: false,
        lastModified: '2023-11-01T10:00:00Z',
        lastExecution: '2023-12-15T08:30:00Z',
        lastAccessed: '2023-12-20T09:00:00Z',
        createdBy: 'developer1',
        nodes: [
          { type: 'n8n-nodes-base.webhook' },
          { type: 'n8n-nodes-base.function' },
          { type: 'n8n-nodes-base.emailSend' }
        ],
        credentials: ['smtp', 'database'],
        tags: ['deprecated'],
        folder: 'archive',
        isTemplate: false,
        isTest: false
      },
      {
        id: 'wf3',
        name: 'Test Workflow Draft',
        active: false,
        lastModified: '2024-01-10T15:00:00Z',
        lastExecution: undefined,
        lastAccessed: '2024-01-10T15:30:00Z',
        createdBy: 'tester',
        nodes: [
          { type: 'n8n-nodes-base.start' },
          { type: 'n8n-nodes-base.set' }
        ],
        credentials: [],
        tags: ['test', 'draft'],
        folder: 'testing',
        isTemplate: false,
        isTest: true
      },
      {
        id: 'wf4',
        name: 'Legacy Report Generator',
        active: true,
        lastModified: '2023-08-15T12:00:00Z',
        lastExecution: '2023-10-01T06:00:00Z',
        lastAccessed: '2023-10-01T06:05:00Z',
        createdBy: 'admin',
        nodes: [
          { type: 'n8n-nodes-base.cron' },
          { type: 'n8n-nodes-base.httpRequest' },
          { type: 'n8n-nodes-base.spreadsheetFile' },
          { type: 'n8n-nodes-base.emailSend' }
        ],
        credentials: ['http', 'smtp'],
        tags: ['reports', 'legacy'],
        folder: 'reports',
        isTemplate: false,
        isTest: false
      },
      {
        id: 'wf5',
        name: 'Email Template',
        active: false,
        lastModified: '2024-01-01T00:00:00Z',
        lastExecution: undefined,
        lastAccessed: '2024-01-05T10:00:00Z',
        createdBy: 'admin',
        nodes: [
          { type: 'n8n-nodes-base.start' },
          { type: 'n8n-nodes-base.emailSend' }
        ],
        credentials: ['smtp'],
        tags: ['template'],
        folder: 'templates',
        isTemplate: true,
        isTest: false
      }
    ];
  }

  private async analyzeWorkflowUsage(
    workflows: any[],
    analysisType: string,
    inactivePeriod: number,
    includeTemporary: boolean,
    includeTest: boolean,
    preserveCritical: boolean
  ): Promise<UnusedWorkflow[]> {

    const unusedWorkflows: UnusedWorkflow[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivePeriod);

    for (const workflow of workflows) {
      const unusedReasons = await this.analyzeWorkflowUnusedReasons(
        workflow,
        cutoffDate,
        analysisType,
        includeTemporary,
        includeTest,
        preserveCritical
      );

      if (unusedReasons.length > 0) {
        const dependencies = await this.analyzeDependencies(workflow);
        const cleanupRecommendation = this.generateCleanupRecommendation(
          workflow,
          unusedReasons,
          dependencies,
          preserveCritical
        );

        unusedWorkflows.push({
          id: workflow.id,
          name: workflow.name,
          status: workflow.active ? 'active' : 'inactive',
          lastModified: workflow.lastModified,
          lastExecution: workflow.lastExecution,
          lastAccessed: workflow.lastAccessed,
          createdBy: workflow.createdBy,
          unusedReason: unusedReasons,
          dependencies,
          resourceUsage: {
            nodeCount: workflow.nodes.length,
            credentialCount: workflow.credentials.length,
            estimatedCost: this.estimateWorkflowCost(workflow)
          },
          cleanupRecommendation,
          metadata: {
            tags: workflow.tags || [],
            folder: workflow.folder,
            description: workflow.description,
            isTemplate: workflow.isTemplate || false,
            isTest: workflow.isTest || false
          }
        });
      }
    }

    return unusedWorkflows;
  }

  private async analyzeWorkflowUnusedReasons(
    workflow: any,
    cutoffDate: Date,
    analysisType: string,
    includeTemporary: boolean,
    includeTest: boolean,
    preserveCritical: boolean
  ): Promise<string[]> {

    const reasons: string[] = [];

    // Check if workflow is inactive
    if (!workflow.active) {
      reasons.push('Workflow is inactive');
    }

    // Check execution history
    if (analysisType === 'execution' || analysisType === 'comprehensive') {
      if (!workflow.lastExecution) {
        reasons.push('Never executed');
      } else if (new Date(workflow.lastExecution) < cutoffDate) {
        reasons.push(`No executions in the last ${Math.floor((Date.now() - cutoffDate.getTime()) / (1000 * 60 * 60 * 24))} days`);
      }
    }

    // Check access patterns
    if (analysisType === 'access' || analysisType === 'comprehensive') {
      if (!workflow.lastAccessed) {
        reasons.push('Never accessed');
      } else if (new Date(workflow.lastAccessed) < cutoffDate) {
        reasons.push('Not accessed recently');
      }
    }

    // Check for test workflows
    if (!includeTest && workflow.isTest) {
      return []; // Skip test workflows if not included
    }

    // Check for temporary workflows
    if (!includeTemporary && workflow.tags?.includes('temp')) {
      return []; // Skip temporary workflows if not included
    }

    // Check for critical workflows
    if (preserveCritical) {
      const criticalTags = ['production', 'critical', 'essential'];
      if (workflow.tags?.some((tag: string) => criticalTags.includes(tag.toLowerCase()))) {
        return []; // Never mark critical workflows as unused
      }
    }

    // Check for deprecated workflows
    if (workflow.tags?.includes('deprecated')) {
      reasons.push('Marked as deprecated');
    }

    // Check modification date
    if (new Date(workflow.lastModified) < cutoffDate) {
      reasons.push('Not modified recently');
    }

    return reasons;
  }

  private async analyzeDependencies(workflow: any): Promise<any> {
    // Mock dependency analysis
    return {
      incoming: [], // Workflows that call this one
      outgoing: [], // Workflows this one calls
      credentials: workflow.credentials || [],
      subWorkflows: []
    };
  }

  private generateCleanupRecommendation(
    workflow: any,
    unusedReasons: string[],
    dependencies: any,
    preserveCritical: boolean
  ): any {

    let action: 'archive' | 'delete' | 'keep' | 'review' = 'review';
    let priority: 'low' | 'medium' | 'high' = 'low';
    const risks: string[] = [];
    const benefits: string[] = [];

    // Determine action based on reasons and dependencies
    if (workflow.isTemplate) {
      action = 'keep';
      priority = 'low';
    } else if (dependencies.incoming.length > 0) {
      action = 'review';
      priority = 'high';
      risks.push('Other workflows depend on this one');
    } else if (unusedReasons.includes('Never executed') && !workflow.active) {
      action = 'delete';
      priority = 'medium';
      benefits.push('Free up storage space');
      benefits.push('Reduce workflow complexity');
    } else if (unusedReasons.includes('Marked as deprecated')) {
      action = 'archive';
      priority = 'medium';
      benefits.push('Clean up workflow list');
    } else if (!workflow.active) {
      action = 'archive';
      priority = 'low';
    }

    // Adjust for critical workflows
    if (preserveCritical && workflow.tags?.includes('production')) {
      action = 'keep';
      risks.push('Production workflow - preserve for safety');
    }

    let reasoning = '';
    switch (action) {
      case 'delete':
        reasoning = 'Safe to delete - no dependencies and never used';
        break;
      case 'archive':
        reasoning = 'Archive for safety - inactive but may have historical value';
        break;
      case 'keep':
        reasoning = 'Keep - still needed or critical';
        break;
      case 'review':
        reasoning = 'Requires manual review - has dependencies or unclear usage';
        break;
    }

    return {
      action,
      priority,
      reasoning,
      risks,
      benefits
    };
  }

  private estimateWorkflowCost(workflow: any): string {
    // Simple cost estimation based on complexity
    const nodeCount = workflow.nodes.length;
    const credentialCount = workflow.credentials.length;
    
    const baseCost = nodeCount * 0.5 + credentialCount * 0.2;
    
    if (baseCost < 2) return 'Low';
    if (baseCost < 5) return 'Medium';
    return 'High';
  }

  private async generateCleanupPlan(unusedWorkflows: UnusedWorkflow[]): Promise<CleanupPlan[]> {
    const plans: CleanupPlan[] = [];

    // Group workflows by recommended action and priority
    const toDelete = unusedWorkflows.filter(w => w.cleanupRecommendation.action === 'delete');
    const toArchive = unusedWorkflows.filter(w => w.cleanupRecommendation.action === 'archive');

    // Phase 1: Safe deletions (high priority, no dependencies)
    const safeDeletes = toDelete.filter(w => 
      w.cleanupRecommendation.priority === 'high' && 
      w.dependencies.incoming.length === 0
    );

    if (safeDeletes.length > 0) {
      plans.push({
        phase: 1,
        workflows: safeDeletes.map(w => w.id),
        action: 'delete',
        dependencies: [],
        estimatedSavings: {
          storage: `${safeDeletes.length * 10}MB`,
          maintenance: '15-20%',
          complexity: '10-15%'
        },
        risks: ['Minimal risk - workflows never used'],
        prerequisites: ['Backup workflows before deletion']
      });
    }

    // Phase 2: Archive inactive workflows
    if (toArchive.length > 0) {
      plans.push({
        phase: plans.length + 1,
        workflows: toArchive.map(w => w.id),
        action: 'archive',
        dependencies: plans.length > 0 ? ['Complete Phase 1'] : [],
        estimatedSavings: {
          storage: `${toArchive.length * 5}MB`,
          maintenance: '10-15%',
          complexity: '8-12%'
        },
        risks: ['Low risk - workflows can be restored'],
        prerequisites: ['Create archive folder structure']
      });
    }

    // Phase 3: Review remaining deletions
    const reviewDeletes = toDelete.filter(w => !safeDeletes.includes(w));
    if (reviewDeletes.length > 0) {
      plans.push({
        phase: plans.length + 1,
        workflows: reviewDeletes.map(w => w.id),
        action: 'delete',
        dependencies: plans.length > 0 ? [`Complete Phase ${plans.length}`] : [],
        estimatedSavings: {
          storage: `${reviewDeletes.length * 8}MB`,
          maintenance: '8-12%',
          complexity: '5-8%'
        },
        risks: ['Medium risk - requires manual review'],
        prerequisites: ['Manual review of each workflow', 'Stakeholder approval']
      });
    }

    return plans;
  }

  private calculateResourceSummary(allWorkflows: any[], unusedWorkflows: UnusedWorkflow[]) {
    const totalNodes = allWorkflows.reduce((sum, w) => sum + w.nodes.length, 0);
    const unusedNodes = unusedWorkflows.reduce((sum, w) => sum + w.resourceUsage.nodeCount, 0);
    
    const allCredentials = new Set();
    const unusedCredentials = new Set();
    
    allWorkflows.forEach(w => {
      w.credentials.forEach((cred: string) => allCredentials.add(cred));
    });
    
    unusedWorkflows.forEach(w => {
      w.dependencies.credentials.forEach(cred => unusedCredentials.add(cred));
    });

    return {
      totalNodes,
      unusedNodes,
      totalCredentials: allCredentials.size,
      unusedCredentials: Array.from(unusedCredentials) as string[],
      totalStorage: `${allWorkflows.length * 15}MB`,
      reclaimableStorage: `${unusedWorkflows.length * 10}MB`
    };
  }

  private generateAnalysisSummary(allWorkflows: any[], unusedWorkflows: UnusedWorkflow[], cleanupPlan: CleanupPlan[]) {
    const safeToDelete = unusedWorkflows.filter(w => 
      w.cleanupRecommendation.action === 'delete' && 
      w.dependencies.incoming.length === 0
    ).length;
    
    const needsReview = unusedWorkflows.filter(w => 
      w.cleanupRecommendation.action === 'review'
    ).length;

    const totalSavings = cleanupPlan.reduce((sum, plan) => {
      const storageMatch = plan.estimatedSavings.storage.match(/(\d+)/);
      return sum + (storageMatch ? parseInt(storageMatch[1]) : 0);
    }, 0);

    const recommendations = [];
    if (safeToDelete > 0) {
      recommendations.push(`Delete ${safeToDelete} unused workflows immediately`);
    }
    if (needsReview > 0) {
      recommendations.push(`Review ${needsReview} workflows requiring manual attention`);
    }
    if (cleanupPlan.length > 0) {
      recommendations.push(`Execute cleanup plan in ${cleanupPlan.length} phases`);
    }

    return {
      totalUnused: unusedWorkflows.length,
      safeToDelete,
      needsReview,
      estimatedSavings: `${totalSavings}MB storage, 15-25% maintenance reduction`,
      recommendations
    };
  }

  private async executeCleanup(
    unusedWorkflows: UnusedWorkflow[],
    cleanupPlan: CleanupPlan[],
    cleanupMode: string
  ) {
    const archived: string[] = [];
    const deleted: string[] = [];
    const errors: Array<{ workflowId: string; error: string }> = [];

    // Execute only the first phase for safety
    const firstPhase = cleanupPlan[0];
    if (!firstPhase) return { archived, deleted, errors };

    for (const workflowId of firstPhase.workflows) {
      try {
        const workflow = unusedWorkflows.find(w => w.id === workflowId);
        if (!workflow) continue;

        if (firstPhase.action === 'delete' && cleanupMode === 'delete') {
          // Simulate deletion
          console.log(`Deleting workflow ${workflowId}`);
          deleted.push(workflowId);
        } else {
          // Simulate archiving
          console.log(`Archiving workflow ${workflowId}`);
          archived.push(workflowId);
        }
      } catch (error) {
        errors.push({
          workflowId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { archived, deleted, errors };
  }
}

export function getIdentifyUnusedWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'identify_unused_workflows',
    description: 'Find and clean up unused workflows and resources to reduce complexity and maintenance overhead',
    inputSchema: {
      type: 'object',
      properties: {
        analysisType: {
          type: 'string',
          enum: ['execution', 'dependency', 'access', 'comprehensive'],
          description: 'Type of analysis to perform (default: comprehensive)',
          default: 'comprehensive'
        },
        inactivePeriod: {
          type: 'number',
          description: 'Number of days to consider workflow inactive (default: 30)',
          default: 30
        },
        includeTemporary: {
          type: 'boolean',
          description: 'Include temporary workflows in analysis',
          default: false
        },
        includeTest: {
          type: 'boolean',
          description: 'Include test workflows in analysis',
          default: false
        },
        cleanupMode: {
          type: 'string',
          enum: ['archive', 'delete', 'report_only'],
          description: 'Action to take on unused workflows (default: report_only)',
          default: 'report_only'
        },
        preserveCritical: {
          type: 'boolean',
          description: 'Preserve workflows marked as critical or production',
          default: true
        }
      },
      required: []
    }
  };
}