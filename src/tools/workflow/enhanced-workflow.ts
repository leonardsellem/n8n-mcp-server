/**
 * Enhanced Workflow Tools
 * 
 * Advanced workflow management tools that provide intelligent
 * node creation, connection, and validation support.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { nodeDiscovery } from '../../helpers/node-discovery.js';
import { getEnvConfig } from '../../config/environment.js';
import {
  analyzeDescription,
  generateWorkflowFromAnalysis,
  DescriptionAnalysis,
  GeneratedWorkflow
} from '../ai-generation/generate-workflow.js';

/**
 * Handler for creating workflows with intelligent assistance
 */
export class CreateSmartWorkflowHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { name, description, nodes, useTemplate = false } = args;

      if (!name) {
        throw new Error('Missing required parameter: name');
      }

      let workflowData: any = {
        name,
        nodes: [],
        connections: {},
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600,
          timezone: "UTC"
        }
      };

      // If description provided but no nodes, generate using AI or skeleton
      if (description && (!nodes || nodes.length === 0) && useTemplate) {
        try {
          // First attempt: AI-powered generation
          console.error('[CreateSmartWorkflow] Attempting AI-powered generation from description');
          const analysis = await analyzeDescription(description);
          console.error('[CreateSmartWorkflow] Analysis result:', {
            triggers: analysis.triggers,
            actions: analysis.actions,
            complexity: analysis.complexity
          });
          
          const aiWorkflow = generateWorkflowFromAnalysis(analysis, name);
          
          // Only use AI result if it generated meaningful nodes (more than just a trigger)
          if (aiWorkflow.nodes.length > 1) {
            console.error(`[CreateSmartWorkflow] AI generation successful: ${aiWorkflow.nodes.length} nodes created`);
            workflowData.nodes = aiWorkflow.nodes;
            workflowData.connections = aiWorkflow.connections;
          } else {
            throw new Error('AI generation resulted in insufficient nodes');
          }
        } catch (aiError) {
          // Fallback: Enhanced skeleton generation
          console.error('[CreateSmartWorkflow] AI generation failed, falling back to enhanced skeleton:', aiError);
          const skeleton = nodeDiscovery.generateWorkflowSkeleton(description);
          if (!skeleton.error && skeleton.nodes.length > 0) {
            console.error(`[CreateSmartWorkflow] Enhanced skeleton generation successful: ${skeleton.nodes.length} nodes created`);
            workflowData.nodes = skeleton.nodes;
            workflowData.connections = skeleton.connections;
          } else {
            console.error('[CreateSmartWorkflow] Both AI and skeleton generation failed, creating minimal workflow');
            // Final fallback: Create minimal workflow with manual trigger and function node
            workflowData.nodes = [
              {
                name: 'Manual Trigger',
                type: 'n8n-nodes-base.manualTrigger',
                position: [250, 300],
                parameters: {}
              },
              {
                name: 'Process Data',
                type: 'n8n-nodes-base.function',
                position: [450, 300],
                parameters: {
                  functionCode: `// Auto-generated from description: ${description}\nreturn [{ processed: true, description: "${description}" }];`
                }
              }
            ];
            workflowData.connections = {
              'Manual Trigger': {
                main: [[{
                  node: 'Process Data',
                  type: 'main',
                  index: 0
                }]]
              }
            };
          }
        }
      } else if (nodes && nodes.length > 0) {
        // Validate and process provided nodes
        const processedNodes = [];
        const connections: any = {};

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];

          // Validate node type exists
          const nodeTypeInfo = nodeDiscovery.getNodeType(node.type);
          if (!nodeTypeInfo) {
            throw new Error(`Unknown node type: ${node.type}`);
          }

          // Validate node parameters
          const validation = nodeDiscovery.validateNode(node.type, node.parameters || {});
          if (!validation.valid) {
            throw new Error(`Node ${node.name} validation failed: ${validation.errors.join(', ')}`);
          }

          // Process the node
          const processedNode = {
            name: node.name,
            type: node.type,
            position: node.position || [250 + (i * 200), 300],
            parameters: node.parameters || {},
            ...node
          };

          processedNodes.push(processedNode);

          // Auto-create connections if not specified
          if (i > 0 && !node.skipAutoConnect) {
            const previousNode = processedNodes[i - 1];
            const previousNodeType = await nodeDiscovery.getNodeType(previousNode.type);
            const currentNodeType = await nodeDiscovery.getNodeType(processedNode.type);

            // Check if connection is valid
            if (previousNodeType && currentNodeType && 
                previousNodeType.outputs && previousNodeType.outputs.length > 0 && 
                currentNodeType.inputs && currentNodeType.inputs.length > 0 &&
                !currentNodeType.triggerNode) {
              
              if (!connections[previousNode.name]) {
                connections[previousNode.name] = { main: [[]] };
              }
              connections[previousNode.name].main[0].push({
                node: processedNode.name,
                type: 'main',
                index: 0
              });
            }
          }
        }

        workflowData.nodes = processedNodes;
        
        // Merge with provided connections if any
        if (args.connections) {
          Object.assign(connections, args.connections);
        }
        workflowData.connections = connections;
      }

      // Validate the complete workflow
      const workflowValidation = nodeDiscovery.validateWorkflow(workflowData);
      if (!workflowValidation.valid) {
        const response = {
          created: false,
          validation: workflowValidation,
          suggestedFixes: this.generateFixSuggestions(workflowValidation)
        };
        
        return this.formatSuccess(
          response,
          `Workflow validation failed. ${workflowValidation.errors.length} errors found.`
        );
      }

      // Create the workflow
      const workflow = await this.apiService.createWorkflow(workflowData);

      const response = {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflowData.nodes.length,
        connectionCount: Object.keys(workflowData.connections).length,
        validation: workflowValidation,
        created: true
      };

      return this.formatSuccess(
        response,
        `Smart workflow "${workflow.name}" created successfully with ${workflowData.nodes.length} nodes`
      );
    }, args);
  }

  private generateFixSuggestions(validation: any): string[] {
    const suggestions: string[] = [];

    if (validation.missingConnections.length > 0) {
      suggestions.push(`Connect the following nodes: ${validation.missingConnections.join(', ')}`);
    }

    if (validation.unreachableNodes.length > 0) {
      suggestions.push(`Make these nodes reachable: ${validation.unreachableNodes.join(', ')}`);
    }

    if (validation.errors.some((err: string) => err.includes('trigger'))) {
      suggestions.push('Add a trigger node like Webhook, Cron, or Manual Trigger to start the workflow');
    }

    return suggestions;
  }
}

/**
 * Handler for adding nodes to existing workflows with smart connections
 */
export class AddNodeToWorkflowHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, node, connectTo, position } = args;

      if (!workflowId || !node) {
        throw new Error('Missing required parameters: workflowId and node');
      }

      // Get existing workflow
      const workflow = await this.apiService.getWorkflow(workflowId);

      // Validate the new node
      const nodeValidation = nodeDiscovery.validateNode(node.type, node.parameters || {});
      if (!nodeValidation.valid) {
        throw new Error(`Node validation failed: ${nodeValidation.errors.join(', ')}`);
      }

      // Add the new node
      const newNode = {
        name: node.name,
        type: node.type,
        position: position || [250 + (workflow.nodes.length * 200), 300],
        parameters: node.parameters || {}
      };

      workflow.nodes.push(newNode);

      // Handle connections
      if (connectTo) {
        if (!workflow.connections[connectTo]) {
          workflow.connections[connectTo] = { main: [[]] };
        }
        workflow.connections[connectTo].main[0].push({
          node: newNode.name,
          type: 'main',
          index: 0
        });
      }

      // Validate the updated workflow
      const validation = nodeDiscovery.validateWorkflow(workflow);

      // Update the workflow - prepare clean data
      const cleanWorkflowData = {
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
        staticData: workflow.staticData || {},
        active: workflow.active
      };

      const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, cleanWorkflowData);

      const response = {
        updated: true,
        nodeAdded: newNode.name,
        nodeCount: workflow.nodes.length,
        validation,
        connectionMade: !!connectTo
      };

      return this.formatSuccess(
        response,
        `Added node "${newNode.name}" to workflow`
      );
    }, args);
  }
}

/**
 * Handler for optimizing workflow connections
 */
export class OptimizeWorkflowHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, autoFix = false } = args;

      if (!workflowId) {
        throw new Error('Missing required parameter: workflowId');
      }

      // Get the workflow
      const workflow = await this.apiService.getWorkflow(workflowId);

      // Validate current state
      const validation = nodeDiscovery.validateWorkflow(workflow);

      const optimizations: {
        applied: string[];
        suggestions: string[];
        warnings: string[];
        errors: string[];
      } = {
        applied: [],
        suggestions: [],
        warnings: validation.warnings,
        errors: validation.errors
      };

      if (autoFix) {
        // Fix missing connections for sequential nodes
        let fixed = false;
        for (let i = 0; i < workflow.nodes.length - 1; i++) {
          const currentNode = workflow.nodes[i];
          const nextNode = workflow.nodes[i + 1];
          
          const currentNodeType = await nodeDiscovery.getNodeType(currentNode.type);
          const nextNodeType = await nodeDiscovery.getNodeType(nextNode.type);

          // Check if they should be connected but aren't
          if (currentNodeType && nextNodeType && 
              currentNodeType.outputs && currentNodeType.outputs.length > 0 && 
              nextNodeType.inputs && nextNodeType.inputs.length > 0 &&
              !nextNodeType.triggerNode) {
            
            // Check if connection exists
            const hasConnection = workflow.connections[currentNode.name]?.main?.[0]?.some(
              (conn: any) => conn.node === nextNode.name
            );

            if (!hasConnection) {
              if (!workflow.connections[currentNode.name]) {
                workflow.connections[currentNode.name] = { main: [[]] };
              }
              workflow.connections[currentNode.name].main[0].push({
                node: nextNode.name,
                type: 'main',
                index: 0
              });
              optimizations.applied.push(`Connected ${currentNode.name} to ${nextNode.name}`);
              fixed = true;
            }
          }
        }

        if (fixed) {
          // Update the workflow - prepare clean data
          const cleanWorkflowData = {
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            settings: workflow.settings,
            staticData: workflow.staticData || {},
            active: workflow.active
          };
          await this.apiService.updateWorkflow(workflowId, cleanWorkflowData);
        }
      }

      // Generate suggestions for remaining issues
      if (validation.unreachableNodes.length > 0) {
        optimizations.suggestions.push(
          `Consider connecting these unreachable nodes: ${validation.unreachableNodes.join(', ')}`
        );
      }

      if (validation.errors.length > 0) {
        optimizations.suggestions.push(...validation.errors);
      }

      return this.formatSuccess(
        optimizations,
        autoFix 
          ? `Applied ${optimizations.applied.length} optimizations`
          : `Found ${optimizations.suggestions.length} optimization opportunities`
      );
    }, args);
  }
}

/**
 * Handler for duplicating workflows with modifications
 */
export class CloneWorkflowHandler extends BaseWorkflowToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, newName, modifications = [] } = args;

      if (!workflowId) {
        throw new Error('Missing required parameter: workflowId');
      }

      // Use the enhanced API method if available, otherwise fallback
      let clonedWorkflow;
      try {
        clonedWorkflow = await this.apiService.duplicateWorkflow(workflowId, newName);
      } catch (error) {
        // Fallback: manually clone
        const originalWorkflow = await this.apiService.getWorkflow(workflowId);
        const workflowData = {
          name: newName || `Copy of ${originalWorkflow.name}`,
          nodes: originalWorkflow.nodes,
          connections: originalWorkflow.connections,
          settings: originalWorkflow.settings,
          staticData: originalWorkflow.staticData || {},
          active: false
        };

        clonedWorkflow = await this.apiService.createWorkflow(workflowData);
      }

      // Apply modifications if provided
      if (modifications.length > 0) {
        const workflow = await this.apiService.getWorkflow(clonedWorkflow.id);
        
        for (const mod of modifications) {
          switch (mod.type) {
            case 'updateNodeParameter':
              const node = workflow.nodes.find((n: any) => n.name === mod.nodeName);
              if (node) {
                node.parameters[mod.parameter] = mod.value;
              }
              break;
            
            case 'renameNode':
              const targetNode = workflow.nodes.find((n: any) => n.name === mod.oldName);
              if (targetNode) {
                targetNode.name = mod.newName;
                // Update connections that reference this node
                for (const [fromNode, conns] of Object.entries(workflow.connections)) {
                  for (const connList of (conns as any).main || []) {
                    for (const conn of connList) {
                      if (conn.node === mod.oldName) {
                        conn.node = mod.newName;
                      }
                    }
                  }
                }
                // Update connection key if this node has outgoing connections
                if (workflow.connections[mod.oldName]) {
                  workflow.connections[mod.newName] = workflow.connections[mod.oldName];
                  delete workflow.connections[mod.oldName];
                }
              }
              break;
          }
        }

        // Prepare clean data for update
        const cleanWorkflowData = {
          name: workflow.name,
          nodes: workflow.nodes,
          connections: workflow.connections,
          settings: workflow.settings,
          staticData: workflow.staticData || {},
          active: workflow.active
        };
        await this.apiService.updateWorkflow(clonedWorkflow.id, cleanWorkflowData);
      }

      const response = {
        id: clonedWorkflow.id,
        name: clonedWorkflow.name,
        originalId: workflowId,
        modificationsApplied: modifications.length
      };

      return this.formatSuccess(
        response,
        `Cloned workflow as "${clonedWorkflow.name}"`
      );
    }, args);
  }
}

// Tool definitions
export function getCreateSmartWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'create_smart_workflow',
    description: 'Create a workflow with intelligent node validation and auto-connection. Supports AI-powered workflow generation from natural language descriptions when useTemplate=true.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the workflow'
        },
        description: {
          type: 'string',
          description: 'Description of what the workflow should do (used for template generation)'
        },
        nodes: {
          type: 'array',
          description: 'Array of nodes to add to the workflow',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              parameters: { type: 'object' },
              position: { type: 'array', items: { type: 'number' } },
              skipAutoConnect: { type: 'boolean' }
            },
            required: ['name', 'type']
          }
        },
        connections: {
          type: 'object',
          description: 'Manual connection definitions (overrides auto-connections)'
        },
        useTemplate: {
          type: 'boolean',
          description: 'Enable AI-powered workflow generation from description. Uses advanced analysis to detect triggers and actions, with fallback to enhanced skeleton generation.',
          default: false
        }
      },
      required: ['name']
    }
  };
}

export function getAddNodeToWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'add_node_to_workflow',
    description: 'Add a new node to an existing workflow with smart connection',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to modify'
        },
        node: {
          type: 'object',
          description: 'Node configuration to add',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            parameters: { type: 'object' }
          },
          required: ['name', 'type']
        },
        connectTo: {
          type: 'string',
          description: 'Name of existing node to connect the new node to'
        },
        position: {
          type: 'array',
          description: 'Position [x, y] for the new node',
          items: { type: 'number' }
        }
      },
      required: ['workflowId', 'node']
    }
  };
}

export function getOptimizeWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'optimize_workflow',
    description: 'Analyze and optionally fix workflow structure and connections',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to optimize'
        },
        autoFix: {
          type: 'boolean',
          description: 'Automatically apply safe optimizations',
          default: false
        }
      },
      required: ['workflowId']
    }
  };
}

export function getCloneWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'clone_workflow',
    description: 'Clone a workflow with optional modifications',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to clone'
        },
        newName: {
          type: 'string',
          description: 'Name for the cloned workflow'
        },
        modifications: {
          type: 'array',
          description: 'Modifications to apply to the cloned workflow',
          items: {
            type: 'object',
            properties: {
              type: { 
                type: 'string',
                enum: ['updateNodeParameter', 'renameNode']
              },
              nodeName: { type: 'string' },
              parameter: { type: 'string' },
              value: {},
              oldName: { type: 'string' },
              newName: { type: 'string' }
            }
          }
        }
      },
      required: ['workflowId']
    }
  };
}
