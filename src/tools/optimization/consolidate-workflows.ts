/**
 * Consolidate Workflows Tool
 * 
 * Tool for merging similar workflows to reduce duplication.
 */

import { OptimizationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface ConsolidateWorkflowsArgs {
  analysisMode?: 'similarity' | 'functionality' | 'resources' | 'all';
  similarityThreshold?: number;
  mergeStrategy?: 'automatic' | 'guided' | 'manual';
  preserveOriginals?: boolean;
  dryRun?: boolean;
  includeInactive?: boolean;
}

interface WorkflowSimilarity {
  workflow1: {
    id: string;
    name: string;
    nodeCount: number;
    lastModified: string;
  };
  workflow2: {
    id: string;
    name: string;
    nodeCount: number;
    lastModified: string;
  };
  similarityScore: number;
  similarityFactors: {
    nodeTypes: number;
    structure: number;
    functionality: number;
    triggers: number;
    credentials: number;
  };
  commonElements: {
    nodeTypes: string[];
    credentials: string[];
    patterns: string[];
  };
  differences: {
    uniqueNodes: string[];
    configurationDifferences: string[];
    triggerDifferences: string[];
  };
  consolidationRecommendation: {
    feasible: boolean;
    strategy: 'merge' | 'parametrize' | 'template' | 'keep_separate';
    effort: 'low' | 'medium' | 'high';
    estimatedBenefits: string[];
    potentialRisks: string[];
  };
}

interface ConsolidationPlan {
  targetWorkflow: {
    id: string;
    name: string;
    description: string;
  };
  sourceWorkflows: Array<{
    id: string;
    name: string;
    retireAfterMerge: boolean;
  }>;
  consolidationStrategy: string;
  mergeSteps: string[];
  parameterization: Array<{
    parameter: string;
    type: string;
    defaultValue: any;
    description: string;
  }>;
  testing: {
    testCases: string[];
    validationSteps: string[];
  };
  rollbackPlan: string[];
  estimatedEffort: string;
  estimatedSavings: {
    maintenanceReduction: string;
    resourceSavings: string;
    complexityReduction: string;
  };
}

interface ConsolidationResult {
  totalWorkflows: number;
  analyzedPairs: number;
  similarityMatches: WorkflowSimilarity[];
  consolidationOpportunities: ConsolidationPlan[];
  summary: {
    potentialConsolidations: number;
    estimatedMaintenanceReduction: string;
    estimatedResourceSavings: string;
    recommendedActions: string[];
  };
  executedConsolidations?: Array<{
    planId: string;
    success: boolean;
    newWorkflowId?: string;
    retiredWorkflows: string[];
    errors?: string[];
  }>;
}

export class ConsolidateWorkflowsHandler extends OptimizationBaseHandler {
  async execute(args: ConsolidateWorkflowsArgs): Promise<ToolCallResult> {
    try {
      const {
        analysisMode = 'all',
        similarityThreshold = 0.7,
        mergeStrategy = 'guided',
        preserveOriginals = true,
        dryRun = true,
        includeInactive = false
      } = args;

      // Get all workflows for analysis
      const workflows = await this.getAllWorkflows(includeInactive);
      
      if (workflows.length < 2) {
        return this.formatOptimizationResponse(
          { message: 'Need at least 2 workflows for consolidation analysis' },
          'Insufficient workflows for consolidation analysis'
        );
      }

      // Analyze workflow similarities
      const similarities = await this.analyzeWorkflowSimilarities(
        workflows,
        analysisMode,
        similarityThreshold
      );

      // Generate consolidation plans
      const consolidationPlans = await this.generateConsolidationPlans(
        similarities,
        mergeStrategy
      );

      let executedConsolidations: any[] = [];

      // Execute consolidations if not in dry run mode
      if (!dryRun && consolidationPlans.length > 0) {
        executedConsolidations = await this.executeConsolidations(
          consolidationPlans,
          mergeStrategy,
          preserveOriginals
        );
      }

      const result: ConsolidationResult = {
        totalWorkflows: workflows.length,
        analyzedPairs: this.calculatePairCombinations(workflows.length),
        similarityMatches: similarities,
        consolidationOpportunities: consolidationPlans,
        summary: this.generateConsolidationSummary(similarities, consolidationPlans),
        executedConsolidations: executedConsolidations.length > 0 ? executedConsolidations : undefined
      };

      return this.formatOptimizationResponse(
        result,
        `Found ${consolidationPlans.length} consolidation opportunities from ${workflows.length} workflows`
      );

    } catch (error) {
      return this.handleOptimizationError(error, 'consolidate workflows');
    }
  }

  private async getAllWorkflows(includeInactive: boolean): Promise<any[]> {
    // Mock workflow data
    const allWorkflows = [
      {
        id: 'wf1',
        name: 'User Registration Email',
        active: true,
        nodes: [
          { type: 'n8n-nodes-base.webhook', name: 'Webhook' },
          { type: 'n8n-nodes-base.set', name: 'Format Data' },
          { type: 'n8n-nodes-base.emailSend', name: 'Send Welcome Email' }
        ],
        lastModified: '2024-01-15T10:00:00Z',
        triggers: ['webhook'],
        credentials: ['smtp']
      },
      {
        id: 'wf2',
        name: 'Password Reset Email',
        active: true,
        nodes: [
          { type: 'n8n-nodes-base.webhook', name: 'Webhook' },
          { type: 'n8n-nodes-base.set', name: 'Prepare Email Data' },
          { type: 'n8n-nodes-base.emailSend', name: 'Send Reset Email' }
        ],
        lastModified: '2024-01-14T14:30:00Z',
        triggers: ['webhook'],
        credentials: ['smtp']
      },
      {
        id: 'wf3',
        name: 'Order Confirmation Email',
        active: true,
        nodes: [
          { type: 'n8n-nodes-base.webhook', name: 'Order Webhook' },
          { type: 'n8n-nodes-base.function', name: 'Calculate Totals' },
          { type: 'n8n-nodes-base.set', name: 'Format Order Data' },
          { type: 'n8n-nodes-base.emailSend', name: 'Send Confirmation' }
        ],
        lastModified: '2024-01-12T09:15:00Z',
        triggers: ['webhook'],
        credentials: ['smtp']
      },
      {
        id: 'wf4',
        name: 'Daily Report Generation',
        active: false,
        nodes: [
          { type: 'n8n-nodes-base.cron', name: 'Daily Trigger' },
          { type: 'n8n-nodes-base.httpRequest', name: 'Fetch Data' },
          { type: 'n8n-nodes-base.spreadsheetFile', name: 'Generate Report' }
        ],
        lastModified: '2024-01-10T16:45:00Z',
        triggers: ['cron'],
        credentials: ['http']
      }
    ];

    return includeInactive ? allWorkflows : allWorkflows.filter(wf => wf.active);
  }

  private async analyzeWorkflowSimilarities(
    workflows: any[],
    analysisMode: string,
    threshold: number
  ): Promise<WorkflowSimilarity[]> {

    const similarities: WorkflowSimilarity[] = [];

    // Compare each pair of workflows
    for (let i = 0; i < workflows.length; i++) {
      for (let j = i + 1; j < workflows.length; j++) {
        const similarity = await this.calculateWorkflowSimilarity(
          workflows[i],
          workflows[j],
          analysisMode
        );

        if (similarity.similarityScore >= threshold) {
          similarities.push(similarity);
        }
      }
    }

    // Sort by similarity score (highest first)
    return similarities.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  private async calculateWorkflowSimilarity(
    workflow1: any,
    workflow2: any,
    analysisMode: string
  ): Promise<WorkflowSimilarity> {

    // Calculate different similarity factors
    const nodeTypeSimilarity = this.calculateNodeTypeSimilarity(workflow1, workflow2);
    const structureSimilarity = this.calculateStructureSimilarity(workflow1, workflow2);
    const functionalitySimilarity = this.calculateFunctionalitySimilarity(workflow1, workflow2);
    const triggerSimilarity = this.calculateTriggerSimilarity(workflow1, workflow2);
    const credentialSimilarity = this.calculateCredentialSimilarity(workflow1, workflow2);

    // Weight the factors based on analysis mode
    let overallSimilarity = 0;
    switch (analysisMode) {
      case 'similarity':
        overallSimilarity = (nodeTypeSimilarity + structureSimilarity) / 2;
        break;
      case 'functionality':
        overallSimilarity = (functionalitySimilarity + triggerSimilarity) / 2;
        break;
      case 'resources':
        overallSimilarity = credentialSimilarity;
        break;
      case 'all':
      default:
        overallSimilarity = (
          nodeTypeSimilarity * 0.3 +
          structureSimilarity * 0.2 +
          functionalitySimilarity * 0.3 +
          triggerSimilarity * 0.1 +
          credentialSimilarity * 0.1
        );
    }

    const commonElements = this.findCommonElements(workflow1, workflow2);
    const differences = this.findDifferences(workflow1, workflow2);
    const recommendation = this.generateConsolidationRecommendation(
      workflow1,
      workflow2,
      overallSimilarity,
      commonElements,
      differences
    );

    return {
      workflow1: {
        id: workflow1.id,
        name: workflow1.name,
        nodeCount: workflow1.nodes.length,
        lastModified: workflow1.lastModified
      },
      workflow2: {
        id: workflow2.id,
        name: workflow2.name,
        nodeCount: workflow2.nodes.length,
        lastModified: workflow2.lastModified
      },
      similarityScore: overallSimilarity,
      similarityFactors: {
        nodeTypes: nodeTypeSimilarity,
        structure: structureSimilarity,
        functionality: functionalitySimilarity,
        triggers: triggerSimilarity,
        credentials: credentialSimilarity
      },
      commonElements,
      differences,
      consolidationRecommendation: recommendation
    };
  }

  private calculateNodeTypeSimilarity(workflow1: any, workflow2: any): number {
    const types1 = new Set(workflow1.nodes.map((n: any) => n.type));
    const types2 = new Set(workflow2.nodes.map((n: any) => n.type));
    
    const intersection = new Set([...types1].filter(x => types2.has(x)));
    const union = new Set([...types1, ...types2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private calculateStructureSimilarity(workflow1: any, workflow2: any): number {
    // Simplified structural similarity based on node count and patterns
    const countDiff = Math.abs(workflow1.nodes.length - workflow2.nodes.length);
    const maxCount = Math.max(workflow1.nodes.length, workflow2.nodes.length);
    
    return maxCount > 0 ? 1 - (countDiff / maxCount) : 1;
  }

  private calculateFunctionalitySimilarity(workflow1: any, workflow2: any): number {
    // Analyze functionality based on node types and patterns
    const func1 = this.extractFunctionalitySignature(workflow1);
    const func2 = this.extractFunctionalitySignature(workflow2);
    
    return this.compareSignatures(func1, func2);
  }

  private calculateTriggerSimilarity(workflow1: any, workflow2: any): number {
    const triggers1 = new Set(workflow1.triggers || []);
    const triggers2 = new Set(workflow2.triggers || []);
    
    const intersection = new Set([...triggers1].filter(x => triggers2.has(x)));
    const union = new Set([...triggers1, ...triggers2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private calculateCredentialSimilarity(workflow1: any, workflow2: any): number {
    const creds1 = new Set(workflow1.credentials || []);
    const creds2 = new Set(workflow2.credentials || []);
    
    const intersection = new Set([...creds1].filter(x => creds2.has(x)));
    const union = new Set([...creds1, ...creds2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private extractFunctionalitySignature(workflow: any): string[] {
    // Extract key functionality indicators
    const signature: string[] = [];
    
    for (const node of workflow.nodes) {
      if (node.type.includes('email')) signature.push('email');
      if (node.type.includes('http')) signature.push('http');
      if (node.type.includes('webhook')) signature.push('webhook');
      if (node.type.includes('database')) signature.push('database');
      if (node.type.includes('file')) signature.push('file');
    }
    
    return [...new Set(signature)]; // Remove duplicates
  }

  private compareSignatures(sig1: string[], sig2: string[]): number {
    const set1 = new Set(sig1);
    const set2 = new Set(sig2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private findCommonElements(workflow1: any, workflow2: any) {
    const nodeTypes1: string[] = workflow1.nodes.map((n: any) => n.type);
    const nodeTypes2: string[] = workflow2.nodes.map((n: any) => n.type);
    
    return {
      nodeTypes: [...new Set(nodeTypes1.filter((type: string) => nodeTypes2.includes(type)))] as string[],
      credentials: (workflow1.credentials || []).filter((cred: string) =>
        (workflow2.credentials || []).includes(cred)
      ),
      patterns: this.identifyCommonPatterns(workflow1, workflow2)
    };
  }

  private findDifferences(workflow1: any, workflow2: any) {
    const nodeTypes1 = workflow1.nodes.map((n: any) => n.type);
    const nodeTypes2 = workflow2.nodes.map((n: any) => n.type);
    
    return {
      uniqueNodes: [
        ...nodeTypes1.filter((type: string) => !nodeTypes2.includes(type)),
        ...nodeTypes2.filter((type: string) => !nodeTypes1.includes(type))
      ],
      configurationDifferences: ['Different parameter configurations'],
      triggerDifferences: this.findTriggerDifferences(workflow1, workflow2)
    };
  }

  private identifyCommonPatterns(workflow1: any, workflow2: any): string[] {
    const patterns: string[] = [];
    
    // Check for common patterns
    const hasWebhookTrigger = (wf: any) => wf.nodes.some((n: any) => n.type.includes('webhook'));
    const hasEmailSend = (wf: any) => wf.nodes.some((n: any) => n.type.includes('email'));
    const hasDataTransform = (wf: any) => wf.nodes.some((n: any) => n.type.includes('set') || n.type.includes('function'));
    
    if (hasWebhookTrigger(workflow1) && hasWebhookTrigger(workflow2)) {
      patterns.push('webhook-triggered');
    }
    
    if (hasEmailSend(workflow1) && hasEmailSend(workflow2)) {
      patterns.push('email-sending');
    }
    
    if (hasDataTransform(workflow1) && hasDataTransform(workflow2)) {
      patterns.push('data-transformation');
    }
    
    return patterns;
  }

  private findTriggerDifferences(workflow1: any, workflow2: any): string[] {
    const triggers1 = workflow1.triggers || [];
    const triggers2 = workflow2.triggers || [];
    
    const differences: string[] = [];
    
    triggers1.forEach((trigger: string) => {
      if (!triggers2.includes(trigger)) {
        differences.push(`${workflow1.name} uses ${trigger} trigger`);
      }
    });
    
    triggers2.forEach((trigger: string) => {
      if (!triggers1.includes(trigger)) {
        differences.push(`${workflow2.name} uses ${trigger} trigger`);
      }
    });
    
    return differences;
  }

  private generateConsolidationRecommendation(
    workflow1: any,
    workflow2: any,
    similarity: number,
    commonElements: any,
    differences: any
  ) {
    let strategy: 'merge' | 'parametrize' | 'template' | 'keep_separate' = 'keep_separate';
    let effort: 'low' | 'medium' | 'high' = 'high';
    let feasible = false;
    
    if (similarity >= 0.8) {
      strategy = 'merge';
      effort = 'low';
      feasible = true;
    } else if (similarity >= 0.6 && commonElements.patterns.length > 0) {
      strategy = 'parametrize';
      effort = 'medium';
      feasible = true;
    } else if (commonElements.patterns.length > 1) {
      strategy = 'template';
      effort = 'medium';
      feasible = true;
    }
    
    const estimatedBenefits = [];
    const potentialRisks = [];
    
    if (feasible) {
      estimatedBenefits.push('Reduced maintenance overhead');
      estimatedBenefits.push('Improved consistency');
      if (strategy === 'merge') {
        estimatedBenefits.push('Simplified workflow management');
      }
      
      potentialRisks.push('Risk of breaking existing integrations');
      if (strategy === 'merge') {
        potentialRisks.push('Increased complexity in single workflow');
      }
    }
    
    return {
      feasible,
      strategy,
      effort,
      estimatedBenefits,
      potentialRisks
    };
  }

  private async generateConsolidationPlans(
    similarities: WorkflowSimilarity[],
    mergeStrategy: string
  ): Promise<ConsolidationPlan[]> {
    
    const plans: ConsolidationPlan[] = [];
    
    for (const similarity of similarities) {
      if (!similarity.consolidationRecommendation.feasible) continue;
      
      const plan = await this.createConsolidationPlan(similarity, mergeStrategy);
      plans.push(plan);
    }
    
    return plans;
  }

  private async createConsolidationPlan(
    similarity: WorkflowSimilarity,
    mergeStrategy: string
  ): Promise<ConsolidationPlan> {
    
    const { workflow1, workflow2, consolidationRecommendation } = similarity;
    
    // Choose the more recently modified workflow as the target
    const targetWorkflow = new Date(workflow1.lastModified) > new Date(workflow2.lastModified) 
      ? workflow1 
      : workflow2;
    const sourceWorkflow = targetWorkflow === workflow1 ? workflow2 : workflow1;
    
    return {
      targetWorkflow: {
        id: targetWorkflow.id,
        name: `Consolidated ${targetWorkflow.name}`,
        description: `Merged functionality from ${workflow1.name} and ${workflow2.name}`
      },
      sourceWorkflows: [{
        id: sourceWorkflow.id,
        name: sourceWorkflow.name,
        retireAfterMerge: mergeStrategy === 'automatic'
      }],
      consolidationStrategy: consolidationRecommendation.strategy,
      mergeSteps: this.generateMergeSteps(consolidationRecommendation.strategy),
      parameterization: this.generateParameterization(similarity),
      testing: {
        testCases: [
          `Test ${workflow1.name} functionality`,
          `Test ${workflow2.name} functionality`,
          'Test edge cases and error handling'
        ],
        validationSteps: [
          'Validate all triggers work correctly',
          'Verify credential access',
          'Test parameter variations'
        ]
      },
      rollbackPlan: [
        'Keep original workflows as backup',
        'Monitor consolidated workflow performance',
        'Restore originals if issues detected'
      ],
      estimatedEffort: consolidationRecommendation.effort === 'low' ? '2-4 hours' : 
                      consolidationRecommendation.effort === 'medium' ? '1-2 days' : '3-5 days',
      estimatedSavings: {
        maintenanceReduction: '40-60%',
        resourceSavings: '30-50%',
        complexityReduction: '25-40%'
      }
    };
  }

  private generateMergeSteps(strategy: string): string[] {
    const baseSteps = [
      'Create new consolidated workflow',
      'Copy common nodes and connections',
      'Merge unique functionality'
    ];
    
    switch (strategy) {
      case 'merge':
        return [
          ...baseSteps,
          'Combine node configurations',
          'Test merged functionality'
        ];
      case 'parametrize':
        return [
          ...baseSteps,
          'Add parameter nodes for variations',
          'Configure conditional logic',
          'Test parameter combinations'
        ];
      case 'template':
        return [
          'Create workflow template',
          'Extract common patterns',
          'Define template parameters',
          'Generate instance workflows'
        ];
      default:
        return baseSteps;
    }
  }

  private generateParameterization(similarity: WorkflowSimilarity): any[] {
    const params = [];
    
    // Add common parameterization based on differences
    if (similarity.differences.configurationDifferences.length > 0) {
      params.push({
        parameter: 'operation_type',
        type: 'string',
        defaultValue: 'default',
        description: 'Type of operation to perform'
      });
    }
    
    if (similarity.differences.triggerDifferences.length > 0) {
      params.push({
        parameter: 'trigger_config',
        type: 'object',
        defaultValue: {},
        description: 'Trigger configuration parameters'
      });
    }
    
    return params;
  }

  private async executeConsolidations(
    plans: ConsolidationPlan[],
    mergeStrategy: string,
    preserveOriginals: boolean
  ): Promise<any[]> {
    
    const results = [];
    
    for (const plan of plans) {
      try {
        // Simulate consolidation execution
        const newWorkflowId = `consolidated_${Date.now()}`;
        
        // In a real implementation, this would:
        // 1. Create the new consolidated workflow
        // 2. Test the functionality
        // 3. Optionally retire original workflows
        
        const result = {
          planId: plan.targetWorkflow.id,
          success: true,
          newWorkflowId,
          retiredWorkflows: preserveOriginals ? [] : plan.sourceWorkflows.map(sw => sw.id)
        };
        
        results.push(result);
        
      } catch (error) {
        results.push({
          planId: plan.targetWorkflow.id,
          success: false,
          retiredWorkflows: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        });
      }
    }
    
    return results;
  }

  private calculatePairCombinations(n: number): number {
    return n > 1 ? (n * (n - 1)) / 2 : 0;
  }

  private generateConsolidationSummary(
    similarities: WorkflowSimilarity[],
    plans: ConsolidationPlan[]
  ) {
    const potentialConsolidations = plans.length;
    const highSimilarityMatches = similarities.filter(s => s.similarityScore >= 0.8).length;
    
    const recommendedActions = [];
    if (potentialConsolidations > 0) {
      recommendedActions.push(`Execute ${potentialConsolidations} consolidation plans`);
    }
    if (highSimilarityMatches > potentialConsolidations) {
      recommendedActions.push('Review additional high-similarity workflows');
    }
    
    return {
      potentialConsolidations,
      estimatedMaintenanceReduction: potentialConsolidations > 0 ? '40-60%' : '0%',
      estimatedResourceSavings: potentialConsolidations > 0 ? '30-50%' : '0%',
      recommendedActions
    };
  }
}

export function getConsolidateWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'consolidate_workflows',
    description: 'Merge similar workflows to reduce duplication and improve maintainability',
    inputSchema: {
      type: 'object',
      properties: {
        analysisMode: {
          type: 'string',
          enum: ['similarity', 'functionality', 'resources', 'all'],
          description: 'Focus area for similarity analysis (default: all)',
          default: 'all'
        },
        similarityThreshold: {
          type: 'number',
          description: 'Minimum similarity score for consolidation consideration (0.0-1.0)',
          default: 0.7
        },
        mergeStrategy: {
          type: 'string',
          enum: ['automatic', 'guided', 'manual'],
          description: 'Approach for executing consolidations (default: guided)',
          default: 'guided'
        },
        preserveOriginals: {
          type: 'boolean',
          description: 'Keep original workflows as backup after consolidation',
          default: true
        },
        dryRun: {
          type: 'boolean',
          description: 'Only analyze and plan without executing consolidations',
          default: true
        },
        includeInactive: {
          type: 'boolean',
          description: 'Include inactive workflows in analysis',
          default: false
        }
      },
      required: []
    }
  };
}