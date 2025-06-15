/**
 * Node Discovery Tools
 *
 * Tools for discovering and understanding n8n node types,
 * helping AI agents build better workflows.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { nodeDiscovery } from '../../helpers/node-discovery.js';

/**
 * Handler for discovering node types
 */
export class DiscoverNodesHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { category, search, limit = 50 } = args; // Increased default limit for massive registry

      // Get fresh node types from API - this will include the massive registry
      let nodeTypes = await nodeDiscovery.getAllNodeTypes();
      
      console.error(`[DiscoverNodesHandler] Starting with ${nodeTypes.length} total node types`);

      // Filter by category if specified
      if (category) {
        nodeTypes = nodeDiscovery.getNodeTypesByCategory(category);
        console.error(`[DiscoverNodesHandler] After category '${category}' filter: ${nodeTypes.length} nodes`);
      }

      // Search if query provided
      if (search) {
        nodeTypes = nodeDiscovery.searchNodeTypes(search);
        console.error(`[DiscoverNodesHandler] After search '${search}' filter: ${nodeTypes.length} nodes`);
      }

      // Limit results
      const limitedResults = nodeTypes.slice(0, limit);
      console.error(`[DiscoverNodesHandler] Returning ${limitedResults.length} of ${nodeTypes.length} nodes (limit: ${limit})`);

      const response = {
        nodes: limitedResults.map(node => ({
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          subcategory: node.subcategory,
          triggerNode: node.triggerNode,
          regularNode: node.regularNode,
          webhookSupport: node.webhookSupport,
          codeable: node.codeable,
          credentials: node.credentials,
          inputCount: node.inputs.length,
          outputCount: node.outputs.length
        })),
        totalFound: nodeTypes.length,
        categories: nodeDiscovery.getCategories()
      };

      return this.formatSuccess(
        response,
        `Found ${limitedResults.length} node types`
      );
    }, args);
  }
}

/**
 * Handler for getting detailed node information
 */
export class GetNodeInfoHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { nodeType } = args;

      if (!nodeType) {
        throw new Error('Missing required parameter: nodeType');
      }

      const nodeInfo = nodeDiscovery.getNodeType(nodeType);
      if (!nodeInfo) {
        throw new Error(`Node type not found: ${nodeType}`);
      }

      return this.formatSuccess(
        nodeInfo,
        `Retrieved information for node type: ${nodeInfo.displayName}`
      );
    }, args);
  }
}

/**
 * Handler for suggesting nodes based on use case
 */
export class SuggestNodesHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { description, maxSuggestions = 5 } = args;

      if (!description) {
        throw new Error('Missing required parameter: description');
      }

      const suggestions = nodeDiscovery.suggestNodesForUseCase(description);
      const limitedSuggestions = suggestions.slice(0, maxSuggestions);

      const response = {
        suggestions: limitedSuggestions.map(node => ({
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          relevantProperties: node.properties.slice(0, 3).map(prop => ({
            name: prop.name,
            displayName: prop.displayName,
            type: prop.type,
            required: prop.required,
            description: prop.description
          }))
        })),
        useCase: description
      };

      return this.formatSuccess(
        response,
        `Found ${limitedSuggestions.length} node suggestions for: ${description}`
      );
    }, args);
  }
}

/**
 * Handler for validating node configuration
 */
export class ValidateNodeHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { nodeType, parameters = {} } = args;

      if (!nodeType) {
        throw new Error('Missing required parameter: nodeType');
      }

      const validation = nodeDiscovery.validateNode(nodeType, parameters);

      const response = {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        suggestions: validation.suggestions,
        nodeType,
        parameters
      };

      return this.formatSuccess(
        response,
        validation.valid 
          ? `Node configuration is valid`
          : `Node configuration has ${validation.errors.length} errors`
      );
    }, args);
  }
}

/**
 * Handler for generating workflow skeleton
 */
export class GenerateWorkflowSkeletonHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { description } = args;

      if (!description) {
        throw new Error('Missing required parameter: description');
      }

      const skeleton = nodeDiscovery.generateWorkflowSkeleton(description);

      if (skeleton.error) {
        throw new Error(skeleton.error);
      }

      return this.formatSuccess(
        skeleton,
        `Generated workflow skeleton for: ${description}`
      );
    }, args);
  }
}

/**
 * Handler for validating workflow structure
 */
export class ValidateWorkflowHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflow } = args;

      if (!workflow) {
        throw new Error('Missing required parameter: workflow');
      }

      const validation = nodeDiscovery.validateWorkflow(workflow);

      const response = {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        suggestions: validation.suggestions,
        missingConnections: validation.missingConnections,
        unreachableNodes: validation.unreachableNodes,
        summary: {
          nodeCount: workflow.nodes?.length || 0,
          connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0,
          triggerNodes: workflow.nodes?.filter((node: any) => {
            const nodeType = nodeDiscovery.getNodeType(node.type);
            return nodeType?.triggerNode;
          }).length || 0
        }
      };

      return this.formatSuccess(
        response,
        validation.valid 
          ? `Workflow structure is valid`
          : `Workflow has ${validation.errors.length} errors and ${validation.warnings.length} warnings`
      );
    }, args);
  }
}

// Tool definitions
export function getDiscoverNodesToolDefinition(): ToolDefinition {
  return {
    name: 'discover_nodes',
    description: 'Discover available n8n node types by category or search query',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by node category (e.g., "Trigger Nodes", "Regular Nodes")'
        },
        search: {
          type: 'string',
          description: 'Search query to find nodes by name or description'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 50)',
          default: 50
        }
      },
      required: []
    }
  };
}

export function getGetNodeInfoToolDefinition(): ToolDefinition {
  return {
    name: 'get_node_info',
    description: 'Get detailed information about a specific node type including properties and examples',
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'The node type to get information for (e.g., "n8n-nodes-base.httpRequest")'
        }
      },
      required: ['nodeType']
    }
  };
}

export function getSuggestNodesToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_nodes',
    description: 'Get node suggestions based on a use case description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of what you want to accomplish (e.g., "send HTTP request", "process webhook")'
        },
        maxSuggestions: {
          type: 'number',
          description: 'Maximum number of suggestions to return (default: 5)',
          default: 5
        }
      },
      required: ['description']
    }
  };
}

export function getValidateNodeToolDefinition(): ToolDefinition {
  return {
    name: 'validate_node',
    description: 'Validate a node configuration against its expected parameters',
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'The node type to validate'
        },
        parameters: {
          type: 'object',
          description: 'The node parameters to validate'
        }
      },
      required: ['nodeType']
    }
  };
}

export function getGenerateWorkflowSkeletonToolDefinition(): ToolDefinition {
  return {
    name: 'generate_workflow_skeleton',
    description: 'Generate a basic workflow structure based on a use case description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of the workflow functionality you want to create'
        }
      },
      required: ['description']
    }
  };
}

export function getValidateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'validate_workflow',
    description: 'Validate a complete workflow structure for errors and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        workflow: {
          type: 'object',
          description: 'The complete workflow object with nodes and connections'
        }
      },
      required: ['workflow']
    }
  };
}
