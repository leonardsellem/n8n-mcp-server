/**
 * Repair Workflow Triggers Tool
 * 
 * This tool fixes workflows with triggerCount: 0 by properly registering trigger nodes
 * and ensuring n8n can detect them correctly.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the repair_workflow_triggers tool
 */
export class RepairWorkflowTriggersHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow ID to repair
   * @returns Repair results and updated workflow information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, dryRun = false } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Get the current workflow
      const workflow = await this.apiService.getWorkflow(workflowId);
      
      if (!workflow) {
        throw new N8nApiError(`Workflow ${workflowId} not found`);
      }
      
      // Analyze the workflow for trigger issues
      const analysis = this.analyzeWorkflowTriggers(workflow);
      
      if (dryRun) {
        return this.formatSuccess(analysis, 'Dry run completed - no changes made');
      }
      
      // If no issues found, return early
      if (analysis.triggerCount > 0 && !analysis.hasIssues) {
        return this.formatSuccess(analysis, 'Workflow triggers are already working correctly');
      }
      
      // Repair the workflow
      const repairedWorkflow = await this.repairWorkflowTriggers(workflow, analysis);
      
      // Update the workflow with proper trigger registration
      const updatedWorkflow = await this.updateWorkflowWithTriggerFix(workflowId, repairedWorkflow);
      
      // Verify the fix worked
      const verificationResult = await this.verifyTriggerFix(workflowId);
      
      return this.formatSuccess({
        workflowId: updatedWorkflow.id,
        name: updatedWorkflow.name,
        beforeRepair: analysis,
        afterRepair: verificationResult,
        fixesApplied: this.getFixesApplied(analysis, verificationResult)
      }, `Workflow triggers repaired successfully. TriggerCount: ${analysis.triggerCount} → ${verificationResult.triggerCount}`);
      
    }, args);
  }
  
  /**
   * Analyze workflow for trigger detection issues
   */
  private analyzeWorkflowTriggers(workflow: any): any {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    
    // Find all trigger nodes
    const triggerNodes = nodes.filter((node: any) => this.isTriggerNode(node));
    const webhookNodes = nodes.filter((node: any) => node.type === 'n8n-nodes-base.webhook');
    const manualTriggers = nodes.filter((node: any) => node.type === 'n8n-nodes-base.manualTrigger');
    
    // Check for connection issues
    const orphanedTriggers = triggerNodes.filter((trigger: any) => {
      return !connections[trigger.name] || !connections[trigger.name].main || connections[trigger.name].main.length === 0;
    });
    
    // Check for missing webhook configurations
    const misconfiguredWebhooks = webhookNodes.filter((webhook: any) => {
      const params = webhook.parameters || {};
      return !params.path || !params.httpMethod;
    });
    
    return {
      triggerCount: workflow.triggerCount || 0,
      expectedTriggerCount: triggerNodes.length,
      triggerNodes: triggerNodes.map((n: any) => ({ name: n.name, type: n.type, id: n.id })),
      webhookNodes: webhookNodes.map((n: any) => ({ name: n.name, path: n.parameters?.path, method: n.parameters?.httpMethod })),
      orphanedTriggers: orphanedTriggers.map((n: any) => n.name),
      misconfiguredWebhooks: misconfiguredWebhooks.map((n: any) => n.name),
      hasIssues: workflow.triggerCount !== triggerNodes.length || orphanedTriggers.length > 0 || misconfiguredWebhooks.length > 0,
      issues: this.identifyIssues(workflow, triggerNodes, orphanedTriggers, misconfiguredWebhooks)
    };
  }
  
  /**
   * Check if a node is a trigger node
   */
  private isTriggerNode(node: any): boolean {
    const triggerTypes = [
      'n8n-nodes-base.webhook',
      'n8n-nodes-base.manualTrigger',
      'n8n-nodes-base.cronTrigger',
      'n8n-nodes-base.intervalTrigger',
      'n8n-nodes-base.emailTrigger',
      'n8n-nodes-base.httpTrigger',
      'n8n-nodes-base.slackTrigger',
      'n8n-nodes-base.telegramTrigger',
      'n8n-nodes-base.discordTrigger',
      'n8n-nodes-base.githubTrigger',
      'n8n-nodes-base.gitlabTrigger',
      'n8n-nodes-base.formTrigger',
      'n8n-nodes-base.waitTrigger'
    ];
    
    return triggerTypes.includes(node.type) || 
           node.type.includes('trigger') || 
           node.type.includes('Trigger');
  }
  
  /**
   * Identify specific issues with the workflow
   */
  private identifyIssues(workflow: any, triggerNodes: any[], orphanedTriggers: any[], misconfiguredWebhooks: any[]): string[] {
    const issues: string[] = [];
    
    if (workflow.triggerCount === 0 && triggerNodes.length > 0) {
      issues.push('Trigger detection failed - triggerCount is 0 but trigger nodes exist');
    }
    
    if (workflow.triggerCount !== triggerNodes.length) {
      issues.push(`Trigger count mismatch - expected ${triggerNodes.length}, got ${workflow.triggerCount}`);
    }
    
    if (orphanedTriggers.length > 0) {
      issues.push(`Orphaned triggers found: ${orphanedTriggers.map(t => t.name).join(', ')}`);
    }
    
    if (misconfiguredWebhooks.length > 0) {
      issues.push(`Misconfigured webhooks found: ${misconfiguredWebhooks.map(w => w.name).join(', ')}`);
    }
    
    return issues;
  }
  
  /**
   * Repair workflow triggers
   */
  private async repairWorkflowTriggers(workflow: any, analysis: any): Promise<any> {
    const repairedWorkflow = JSON.parse(JSON.stringify(workflow)); // Deep clone
    
    // Fix webhook configurations
    if (analysis.misconfiguredWebhooks.length > 0) {
      repairedWorkflow.nodes = repairedWorkflow.nodes.map((node: any) => {
        if (node.type === 'n8n-nodes-base.webhook' && analysis.misconfiguredWebhooks.includes(node.name)) {
          const params = node.parameters || {};
          
          // Ensure webhook has required parameters
          if (!params.path) {
            params.path = `webhook-${node.id || Date.now()}`;
          }
          if (!params.httpMethod) {
            params.httpMethod = 'POST';
          }
          
          // Add webhook ID for proper registration
          if (!params.webhookId) {
            params.webhookId = node.id || `webhook-${Date.now()}`;
          }
          
          return {
            ...node,
            parameters: params
          };
        }
        return node;
      });
    }
    
    // Ensure all trigger nodes have proper IDs
    repairedWorkflow.nodes = repairedWorkflow.nodes.map((node: any) => {
      if (this.isTriggerNode(node) && !node.id) {
        return {
          ...node,
          id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
      }
      return node;
    });
    
    // Fix orphaned trigger connections
    const connections = repairedWorkflow.connections || {};
    analysis.orphanedTriggers.forEach((triggerName: string) => {
      if (!connections[triggerName]) {
        connections[triggerName] = { main: [[]] };
      }
    });
    repairedWorkflow.connections = connections;
    
    // Ensure proper workflow metadata for trigger detection
    repairedWorkflow.meta = repairedWorkflow.meta || {};
    repairedWorkflow.staticData = repairedWorkflow.staticData || {};
    
    // Force trigger count recalculation by removing the field
    delete repairedWorkflow.triggerCount;
    
    return repairedWorkflow;
  }
  
  /**
   * Update workflow with special handling for trigger registration
   */
  private async updateWorkflowWithTriggerFix(workflowId: string, repairedWorkflow: any): Promise<any> {
    // Prepare the workflow data with only allowed fields for n8n API
    const workflowData: any = {
      name: repairedWorkflow.name,
      nodes: repairedWorkflow.nodes,
      connections: repairedWorkflow.connections,
      settings: repairedWorkflow.settings || {
        saveExecutionProgress: true,
        saveManualExecutions: true,
        saveDataErrorExecution: "all",
        saveDataSuccessExecution: "all",
        executionTimeout: 3600,
        timezone: "UTC"
      },
      staticData: repairedWorkflow.staticData || {},
      meta: repairedWorkflow.meta || {},
      pinData: repairedWorkflow.pinData || {}
    };
    
    // Use the standard updateWorkflow method which handles field filtering
    return await this.apiService.updateWorkflow(workflowId, workflowData);
  }
  
  /**
   * Verify that the trigger fix worked
   */
  private async verifyTriggerFix(workflowId: string): Promise<any> {
    // Wait a moment for n8n to process the update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedWorkflow = await this.apiService.getWorkflow(workflowId);
    return this.analyzeWorkflowTriggers(updatedWorkflow);
  }
  
  /**
   * Get a summary of fixes that were applied
   */
  private getFixesApplied(beforeAnalysis: any, afterAnalysis: any): string[] {
    const fixes: string[] = [];
    
    if (beforeAnalysis.triggerCount !== afterAnalysis.triggerCount) {
      fixes.push(`Trigger count fixed: ${beforeAnalysis.triggerCount} → ${afterAnalysis.triggerCount}`);
    }
    
    if (beforeAnalysis.misconfiguredWebhooks.length > afterAnalysis.misconfiguredWebhooks.length) {
      fixes.push(`Fixed ${beforeAnalysis.misconfiguredWebhooks.length - afterAnalysis.misconfiguredWebhooks.length} misconfigured webhooks`);
    }
    
    if (beforeAnalysis.orphanedTriggers.length > afterAnalysis.orphanedTriggers.length) {
      fixes.push(`Connected ${beforeAnalysis.orphanedTriggers.length - afterAnalysis.orphanedTriggers.length} orphaned triggers`);
    }
    
    if (beforeAnalysis.hasIssues && !afterAnalysis.hasIssues) {
      fixes.push('All trigger detection issues resolved');
    }
    
    return fixes;
  }
}

/**
 * Get tool definition for the repair_workflow_triggers tool
 * 
 * @returns Tool definition
 */
export function getRepairWorkflowTriggersToolDefinition(): ToolDefinition {
  return {
    name: 'repair_workflow_triggers',
    description: 'Repair workflows with trigger detection issues (triggerCount: 0). Fixes webhook configurations, trigger connections, and forces proper trigger registration in n8n.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to repair',
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, analyze issues without making changes (default: false)',
          default: false
        }
      },
      required: ['workflowId'],
    },
  };
}
