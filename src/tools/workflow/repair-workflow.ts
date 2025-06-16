/**
 * Comprehensive Workflow Repair Tool
 *
 * This tool fixes structural issues in n8n workflows that cause UI parsing failures.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseWorkflowToolHandler } from './base-handler.js';
import { generateId } from '../ai-generation/generate-workflow.js';

/**
 * Workflow repair result
 */
export interface WorkflowRepairResult {
  success: boolean;
  originalWorkflow: any;
  repairedWorkflow: any;
  issuesFound: string[];
  issuesFixed: string[];
  validationErrors: string[];
}

/**
 * Handler for repairing broken workflows
 */
export class RepairWorkflowHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId']);
      
      const { workflowId, autoFix = true, preserveComplexity = true } = args;

      try {
        // Get the original workflow
        const originalWorkflow = await this.apiService.getWorkflow(workflowId);
        
        if (!originalWorkflow) {
          throw new Error(`Workflow with ID ${workflowId} not found`);
        }

        // Analyze and repair the workflow
        const repairResult = this.repairWorkflow(originalWorkflow, { autoFix, preserveComplexity });
        
        if (autoFix && repairResult.issuesFixed.length > 0) {
          // Update the workflow with fixes - only send allowed fields
          const workflowUpdateData = {
            name: repairResult.repairedWorkflow.name,
            nodes: repairResult.repairedWorkflow.nodes,
            connections: repairResult.repairedWorkflow.connections,
            settings: repairResult.repairedWorkflow.settings,
            staticData: repairResult.repairedWorkflow.staticData,
            pinData: repairResult.repairedWorkflow.pinData || {},
            meta: repairResult.repairedWorkflow.meta || {}
          };
          
          const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, workflowUpdateData);
          repairResult.repairedWorkflow = updatedWorkflow;
        }

        return this.formatSuccess(repairResult, `Workflow repair completed. Fixed ${repairResult.issuesFixed.length} issues.`);
      } catch (error) {
        throw new Error(`Failed to repair workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Repair workflow structure and fix common issues
   */
  private repairWorkflow(workflow: any, options: { autoFix: boolean; preserveComplexity: boolean }): WorkflowRepairResult {
    const issuesFound: string[] = [];
    const issuesFixed: string[] = [];
    const validationErrors: string[] = [];
    
    // Create a deep copy for repair
    const repairedWorkflow = JSON.parse(JSON.stringify(workflow));
    
    // Fix 1: Ensure all nodes have proper IDs
    this.fixNodeIds(repairedWorkflow, issuesFound, issuesFixed);
    
    // Fix 2: Fix missing required parameters
    this.fixNodeParameters(repairedWorkflow, issuesFound, issuesFixed);
    
    // Fix 3: Fix connection structure
    this.fixConnections(repairedWorkflow, issuesFound, issuesFixed);
    
    // Fix 4: Fix node positioning for complex workflows
    if (options.preserveComplexity) {
      this.fixNodePositioning(repairedWorkflow, issuesFound, issuesFixed);
    }
    
    // Fix 5: Validate and fix node types
    this.fixNodeTypes(repairedWorkflow, issuesFound, issuesFixed);
    
    // Fix 6: Ensure proper workflow settings
    this.fixWorkflowSettings(repairedWorkflow, issuesFound, issuesFixed);
    
    // Final validation
    this.validateWorkflow(repairedWorkflow, validationErrors);

    return {
      success: issuesFixed.length > 0 || validationErrors.length === 0,
      originalWorkflow: workflow,
      repairedWorkflow,
      issuesFound,
      issuesFixed,
      validationErrors
    };
  }

  /**
   * Fix node IDs to use proper format
   */
  private fixNodeIds(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      issuesFound.push('Missing or invalid nodes array');
      workflow.nodes = [];
      issuesFixed.push('Created empty nodes array');
      return;
    }

    const nodeIdMap = new Map<string, string>();

    workflow.nodes.forEach((node: any, index: number) => {
      const oldId = node.id;
      
      // Check if ID is missing or improperly formatted
      if (!node.id || typeof node.id !== 'string' || node.id.length < 8) {
        issuesFound.push(`Node ${node.name || index} has invalid ID: ${node.id}`);
        
        // Generate new proper ID
        const newId = generateId();
        nodeIdMap.set(oldId, newId);
        node.id = newId;
        
        issuesFixed.push(`Fixed node ID for ${node.name || index}: ${oldId} -> ${newId}`);
      }
    });

    // Update connections to use new IDs
    if (nodeIdMap.size > 0 && workflow.connections) {
      this.updateConnectionIds(workflow.connections, nodeIdMap, issuesFixed);
    }
  }

  /**
   * Fix missing required node parameters
   */
  private fixNodeParameters(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    workflow.nodes.forEach((node: any) => {
      if (!node.parameters) {
        node.parameters = {};
        issuesFixed.push(`Added missing parameters object for node ${node.name}`);
      }

      // Fix Set node parameters
      if (node.type === 'n8n-nodes-base.set') {
        if (!node.parameters.options) {
          issuesFound.push(`Set node ${node.name} missing required options parameter`);
          node.parameters.options = {
            keepOnlySet: false,
            dotNotation: false
          };
          issuesFixed.push(`Added missing options to Set node ${node.name}`);
        }
      }

      // Fix Switch node parameters
      if (node.type === 'n8n-nodes-base.switch') {
        if (!node.parameters.fallbackOutput && node.parameters.fallbackOutput !== 0) {
          issuesFound.push(`Switch node ${node.name} missing required fallbackOutput parameter`);
          node.parameters.fallbackOutput = 0;
          issuesFixed.push(`Added missing fallbackOutput to Switch node ${node.name}`);
        }
      }

      // Fix HTTP Request node parameters
      if (node.type === 'n8n-nodes-base.httpRequest') {
        if (!node.parameters.options) {
          node.parameters.options = {};
          issuesFixed.push(`Added missing options to HTTP Request node ${node.name}`);
        }
        
        // Fix body structure
        if (node.parameters.body && typeof node.parameters.body === 'object') {
          if (node.parameters.body.mode === 'json' && node.parameters.body.json) {
            // Convert old body structure to new format
            node.parameters.sendBody = true;
            node.parameters.bodyContentType = 'json';
            node.parameters.jsonBody = node.parameters.body.json;
            delete node.parameters.body;
            issuesFixed.push(`Fixed HTTP Request body structure for node ${node.name}`);
          }
        }
      }

      // Fix Email Send node type
      if (node.type === 'n8n-nodes-base.emailSend') {
        issuesFound.push(`Node ${node.name} uses deprecated emailSend type`);
        node.type = 'n8n-nodes-base.send-email';
        issuesFixed.push(`Updated node type for ${node.name} to send-email`);
      }
    });
  }

  /**
   * Fix connection structure to use proper node IDs
   */
  private fixConnections(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    if (!workflow.connections) {
      workflow.connections = {};
      issuesFixed.push('Created missing connections object');
      return;
    }

    const nodeMap = new Map<string, string>();
    workflow.nodes.forEach((node: any) => {
      nodeMap.set(node.name, node.id);
    });

    const newConnections: any = {};

    Object.keys(workflow.connections).forEach(sourceKey => {
      const sourceNodeId = nodeMap.get(sourceKey) || sourceKey;
      
      if (!workflow.connections[sourceKey].main) {
        issuesFound.push(`Connection from ${sourceKey} missing main array`);
        return;
      }

      newConnections[sourceNodeId] = { main: [] };

      workflow.connections[sourceKey].main.forEach((outputConnections: any[], outputIndex: number) => {
        if (!Array.isArray(outputConnections)) {
          issuesFound.push(`Invalid connection array for ${sourceKey} output ${outputIndex}`);
          newConnections[sourceNodeId].main[outputIndex] = [];
          return;
        }

        newConnections[sourceNodeId].main[outputIndex] = outputConnections.map((conn: any) => {
          const targetNodeId = nodeMap.get(conn.node) || conn.node;
          
          if (conn.node !== targetNodeId) {
            issuesFixed.push(`Fixed connection reference: ${conn.node} -> ${targetNodeId}`);
          }

          return {
            node: targetNodeId,
            type: conn.type || 'main',
            index: conn.index || 0
          };
        });
      });
    });

    workflow.connections = newConnections;
  }

  /**
   * Fix node positioning for complex workflows
   */
  private fixNodePositioning(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    const nodesPerRow = 5;
    const nodeWidth = 300;
    const nodeHeight = 200;
    const startX = 240;
    const startY = 300;

    workflow.nodes.forEach((node: any, index: number) => {
      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        issuesFound.push(`Node ${node.name} has invalid position`);
        
        // Calculate grid position
        const row = Math.floor(index / nodesPerRow);
        const col = index % nodesPerRow;
        
        node.position = [
          startX + (col * nodeWidth),
          startY + (row * nodeHeight)
        ];
        
        issuesFixed.push(`Fixed position for node ${node.name}`);
      } else {
        // Check for overlapping positions
        const [x, y] = node.position;
        if (x > 2000 || y > 2000) {
          issuesFound.push(`Node ${node.name} position out of bounds`);
          
          const row = Math.floor(index / nodesPerRow);
          const col = index % nodesPerRow;
          
          node.position = [
            startX + (col * nodeWidth),
            startY + (row * nodeHeight)
          ];
          
          issuesFixed.push(`Repositioned node ${node.name} within bounds`);
        }
      }
    });
  }

  /**
   * Fix and validate node types
   */
  private fixNodeTypes(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    const validNodeTypes = [
      'n8n-nodes-base.webhook',
      'n8n-nodes-base.manualTrigger',
      'n8n-nodes-base.scheduleTrigger',
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.function',
      'n8n-nodes-base.set',
      'n8n-nodes-base.switch',
      'n8n-nodes-base.send-email',
      'n8n-nodes-base.slack',
      'n8n-nodes-base.postgres',
      'n8n-nodes-base.mysql',
      'n8n-nodes-base.mongodb'
    ];

    workflow.nodes.forEach((node: any) => {
      if (!node.type) {
        issuesFound.push(`Node ${node.name} missing type`);
        node.type = 'n8n-nodes-base.function';
        issuesFixed.push(`Set default type for node ${node.name}`);
      }

      // Check for deprecated types
      const typeMapping: Record<string, string> = {
        'n8n-nodes-base.emailSend': 'n8n-nodes-base.send-email'
      };

      if (typeMapping[node.type]) {
        issuesFound.push(`Node ${node.name} uses deprecated type ${node.type}`);
        node.type = typeMapping[node.type];
        issuesFixed.push(`Updated node type for ${node.name}`);
      }
    });
  }

  /**
   * Fix workflow settings
   */
  private fixWorkflowSettings(workflow: any, issuesFound: string[], issuesFixed: string[]): void {
    if (!workflow.settings) {
      workflow.settings = {};
      issuesFixed.push('Added missing settings object');
    }

    const defaultSettings = {
      saveExecutionProgress: true,
      saveManualExecutions: true,
      saveDataErrorExecution: "all",
      saveDataSuccessExecution: "all",
      executionTimeout: 3600,
      timezone: "UTC"
    };

    Object.keys(defaultSettings).forEach(key => {
      if (workflow.settings[key] === undefined) {
        workflow.settings[key] = defaultSettings[key as keyof typeof defaultSettings];
        issuesFixed.push(`Added missing setting: ${key}`);
      }
    });

    if (!workflow.staticData) {
      workflow.staticData = {};
      issuesFixed.push('Added missing staticData object');
    }
  }

  /**
   * Update connection IDs based on node ID mapping
   */
  private updateConnectionIds(connections: any, nodeIdMap: Map<string, string>, issuesFixed: string[]): void {
    Object.keys(connections).forEach(sourceKey => {
      const newSourceId = nodeIdMap.get(sourceKey);
      if (newSourceId && newSourceId !== sourceKey) {
        connections[newSourceId] = connections[sourceKey];
        delete connections[sourceKey];
        issuesFixed.push(`Updated connection source ID: ${sourceKey} -> ${newSourceId}`);
      }
    });
  }

  /**
   * Validate the repaired workflow
   */
  private validateWorkflow(workflow: any, validationErrors: string[]): void {
    // Check required fields
    if (!workflow.name) {
      validationErrors.push('Workflow missing name');
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      validationErrors.push('Workflow missing nodes array');
    }

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      validationErrors.push('Workflow missing connections object');
    }

    // Validate nodes
    workflow.nodes?.forEach((node: any, index: number) => {
      if (!node.id) {
        validationErrors.push(`Node ${index} missing ID`);
      }
      if (!node.type) {
        validationErrors.push(`Node ${index} missing type`);
      }
      if (!node.name) {
        validationErrors.push(`Node ${index} missing name`);
      }
      if (!node.position || !Array.isArray(node.position)) {
        validationErrors.push(`Node ${index} missing valid position`);
      }
    });

    // Validate connections reference existing nodes
    const nodeIds = new Set(workflow.nodes?.map((n: any) => n.id) || []);
    Object.keys(workflow.connections || {}).forEach(sourceId => {
      if (!nodeIds.has(sourceId)) {
        validationErrors.push(`Connection references non-existent source node: ${sourceId}`);
      }

      const connections = workflow.connections[sourceId];
      if (connections.main) {
        connections.main.forEach((outputConnections: any[], outputIndex: number) => {
          outputConnections?.forEach((conn: any, connIndex: number) => {
            if (!nodeIds.has(conn.node)) {
              validationErrors.push(`Connection ${sourceId}[${outputIndex}][${connIndex}] references non-existent target node: ${conn.node}`);
            }
          });
        });
      }
    });
  }
}

/**
 * Get the tool definition for repairing workflows
 */
export function getRepairWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'repair_workflow',
    description: 'Repair structural issues in n8n workflows that cause UI parsing failures. Fixes missing parameters, invalid connections, positioning issues, and other common problems.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to repair'
        },
        autoFix: {
          type: 'boolean',
          description: 'Automatically apply fixes to the workflow',
          default: true
        }
      },
      required: ['workflowId']
    }
  };
}
