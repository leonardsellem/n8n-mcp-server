/**
 * Tool Discovery & Organization Module
 * 
 * These tools help AI models understand and navigate the available tools
 * by providing categorized organization and recommendations.
 */

import { ToolDefinition, ToolCallResult } from '../../../types/index.js';
import { getEnvConfig } from '../../../config/environment.js';
import { EnhancedN8nApiClient } from '../../../api/enhanced-client.js';

// Tool categories for organization
const TOOL_CATEGORIES = {
  'workflow-management': {
    name: 'Workflow Management',
    description: 'Create, read, update, delete, and manage workflow lifecycle',
    tools: [
      'list_workflows', 'get_workflow', 'create_workflow', 'update_workflow', 
      'delete_workflow', 'activate_workflow', 'deactivate_workflow'
    ]
  },
  'execution-control': {
    name: 'Execution Control',
    description: 'Monitor and control workflow executions',
    tools: [
      'list_executions', 'get_execution', 'delete_execution', 'run_webhook'
    ]
  },
  'workflow-enhancement': {
    name: 'Workflow Enhancement',
    description: 'Smart workflow creation and optimization tools',
    tools: [
      'create_smart_workflow', 'add_node_to_workflow', 'optimize_workflow', 
      'clone_workflow'
    ]
  },
  'node-discovery': {
    name: 'Node Discovery',
    description: 'Find and understand available nodes and their capabilities',
    tools: [
      'discover_nodes', 'get_node_info', 'suggest_nodes', 'validate_node'
    ]
  },
  'credentials-management': {
    name: 'Credentials Management',
    description: 'Manage authentication and API credentials',
    tools: [
      'list_credentials', 'get_credential', 'create_credential', 
      'update_credential', 'delete_credential', 'test_credential'
    ]
  },
  'organization': {
    name: 'Organization',
    description: 'Organize workflows with folders and tags',
    tools: [
      'create_folder', 'list_folders', 'move_workflow_to_folder', 
      'get_folder_contents', 'delete_folder', 'rename_folder'
    ]
  },
  'bulk-operations': {
    name: 'Bulk Operations',
    description: 'Perform operations on multiple workflows efficiently',
    tools: [
      'bulk_workflow_operations', 'advanced_workflow_search', 'workflow_analytics'
    ]
  },
  'ai-friendly': {
    name: 'AI-Friendly Tools',
    description: 'Tools optimized for AI model usage with reduced cognitive load',
    tools: [
      'list_tool_categories', 'get_tool_recommendations', 'search_tools',
      'get_workflow_summary', 'batch_workflow_status', 'get_workflow_essence'
    ]
  }
};

const TOOL_RELATIONSHIPS = {
  'workflow-creation': {
    primary: 'create_workflow',
    supporting: ['discover_nodes', 'get_node_info', 'validate_node'],
    next_steps: ['activate_workflow', 'test_workflow_with_sample_data']
  },
  'workflow-debugging': {
    primary: 'get_execution',
    supporting: ['list_executions', 'get_workflow'],
    next_steps: ['update_workflow', 'optimize_workflow']
  },
  'workflow-optimization': {
    primary: 'optimize_workflow',
    supporting: ['get_workflow_performance_metrics', 'suggest_node_alternatives'],
    next_steps: ['test_workflow_with_sample_data', 'update_workflow']
  }
};

/**
 * List Tool Categories Handler
 */
export class ListToolCategoriesHandler {
  async execute(args: any): Promise<ToolCallResult> {
    try {
      const categories = Object.entries(TOOL_CATEGORIES).map(([key, category]) => ({
        id: key,
        name: category.name,
        description: category.description,
        tool_count: category.tools.length,
        tools: category.tools
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            categories,
            total_categories: categories.length,
            total_tools: categories.reduce((sum, cat) => sum + cat.tool_count, 0)
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error listing tool categories: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Tool Recommendations Handler
 */
export class GetToolRecommendationsHandler {
  async execute(args: { context?: string; current_workflow?: string; task_type?: string }): Promise<ToolCallResult> {
    try {
      const { context, current_workflow, task_type } = args;
      
      let recommendations: any[] = [];
      
      // Context-aware recommendations
      if (task_type === 'create') {
        recommendations = [
          { tool: 'create_smart_workflow', reason: 'Best for creating new workflows with AI assistance' },
          { tool: 'discover_nodes', reason: 'Find appropriate nodes for your workflow' },
          { tool: 'generate_workflow_skeleton', reason: 'Get a basic structure to start with' }
        ];
      } else if (task_type === 'debug') {
        recommendations = [
          { tool: 'get_execution', reason: 'Examine failed executions for debugging' },
          { tool: 'list_executions', reason: 'See recent execution history' },
          { tool: 'get_workflow_performance_metrics', reason: 'Identify performance issues' }
        ];
      } else if (task_type === 'optimize') {
        recommendations = [
          { tool: 'optimize_workflow', reason: 'Automated workflow optimization' },
          { tool: 'suggest_node_alternatives', reason: 'Find more efficient node alternatives' },
          { tool: 'validate_workflow_performance', reason: 'Test performance improvements' }
        ];
      } else {
        // General recommendations based on context
        recommendations = [
          { tool: 'get_workflow_summary', reason: 'Quick overview of workflow status' },
          { tool: 'list_tool_categories', reason: 'Explore available tool categories' },
          { tool: 'get_lightweight_workflow_list', reason: 'Browse workflows efficiently' }
        ];
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            recommendations,
            context: context || 'general',
            task_type: task_type || 'unknown'
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting tool recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Search Tools Handler
 */
export class SearchToolsHandler {
  async execute(args: { query: string; category?: string }): Promise<ToolCallResult> {
    try {
      const { query, category } = args;
      const searchQuery = query.toLowerCase();
      
      let toolsToSearch = Object.values(TOOL_CATEGORIES).flatMap(cat => 
        cat.tools.map(tool => ({ tool, category: cat.name }))
      );
      
      // Filter by category if specified
      if (category) {
        const categoryData = TOOL_CATEGORIES[category as keyof typeof TOOL_CATEGORIES];
        if (categoryData) {
          toolsToSearch = categoryData.tools.map(tool => ({ tool, category: categoryData.name }));
        }
      }
      
      // Search by tool name or description
      const matches = toolsToSearch.filter(({ tool }) => 
        tool.includes(searchQuery) || 
        tool.replace(/_/g, ' ').includes(searchQuery)
      );
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query,
            matches: matches.slice(0, 10), // Limit to top 10 matches
            total_matches: matches.length
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error searching tools: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Get Tool Usage Examples Handler
 */
export class GetToolUsageExamplesHandler {
  async execute(args: { tool_name: string }): Promise<ToolCallResult> {
    try {
      const { tool_name } = args;
      
      const examples: Record<string, any> = {
        'create_workflow': {
          basic: {
            name: 'Simple HTTP Workflow',
            nodes: [
              { name: 'Webhook', type: 'n8n-nodes-base.webhook' },
              { name: 'HTTP Request', type: 'n8n-nodes-base.httpRequest' }
            ]
          },
          advanced: {
            name: 'Data Processing Pipeline',
            description: 'Process webhook data and store in database',
            useTemplate: true
          }
        },
        'get_workflow': {
          basic: { workflowId: 'workflow-id-123' },
          with_details: { workflowId: 'workflow-id-123', include_executions: true }
        },
        'batch_workflow_status': {
          basic: { workflow_ids: ['id1', 'id2', 'id3'] },
          with_filter: { active_only: true, limit: 50 }
        }
      };
      
      const toolExamples = examples[tool_name];
      if (!toolExamples) {
        return {
          content: [{
            type: 'text',
            text: `No examples available for tool: ${tool_name}`
          }],
          isError: false
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            tool: tool_name,
            examples: toolExamples
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting tool examples: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

/**
 * Explain Tool Relationships Handler
 */
export class ExplainToolRelationshipsHandler {
  async execute(args: { workflow_type?: string; starting_tool?: string }): Promise<ToolCallResult> {
    try {
      const { workflow_type, starting_tool } = args;
      
      let relevantRelationships = TOOL_RELATIONSHIPS;
      
      if (workflow_type) {
        const filtered = Object.entries(TOOL_RELATIONSHIPS)
          .filter(([key]) => key.includes(workflow_type))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as typeof TOOL_RELATIONSHIPS);
        relevantRelationships = Object.keys(filtered).length > 0 ? filtered : TOOL_RELATIONSHIPS;
      }
      
      const relationships = Object.entries(relevantRelationships).map(([scenario, tools]) => ({
        scenario,
        primary_tool: tools.primary,
        supporting_tools: tools.supporting,
        typical_next_steps: tools.next_steps
      }));
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            relationships,
            workflow_type: workflow_type || 'all',
            starting_tool
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error explaining tool relationships: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

// Tool definitions
export function getListToolCategoriesToolDefinition(): ToolDefinition {
  return {
    name: 'list_tool_categories',
    description: 'Get organized categories of available tools to help understand capabilities and reduce cognitive load',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  };
}

export function getGetToolRecommendationsToolDefinition(): ToolDefinition {
  return {
    name: 'get_tool_recommendations',
    description: 'Get context-aware tool suggestions based on current workflow or task type',
    inputSchema: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          description: 'Current context or what you are trying to accomplish'
        },
        current_workflow: {
          type: 'string',
          description: 'ID of workflow currently being worked on'
        },
        task_type: {
          type: 'string',
          enum: ['create', 'debug', 'optimize', 'analyze'],
          description: 'Type of task being performed'
        }
      },
      required: []
    }
  };
}

export function getSearchToolsToolDefinition(): ToolDefinition {
  return {
    name: 'search_tools',
    description: 'Find tools by description, use case, or keywords',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for finding relevant tools'
        },
        category: {
          type: 'string',
          description: 'Optional category to limit search scope'
        }
      },
      required: ['query']
    }
  };
}

export function getGetToolUsageExamplesToolDefinition(): ToolDefinition {
  return {
    name: 'get_tool_usage_examples',
    description: 'Get practical examples of how to use specific tools effectively',
    inputSchema: {
      type: 'object',
      properties: {
        tool_name: {
          type: 'string',
          description: 'Name of the tool to get examples for'
        }
      },
      required: ['tool_name']
    }
  };
}

export function getExplainToolRelationshipsToolDefinition(): ToolDefinition {
  return {
    name: 'explain_tool_relationships',
    description: 'Understand how tools work together in common workflows and scenarios',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_type: {
          type: 'string',
          description: 'Type of workflow scenario (e.g., creation, debugging, optimization)'
        },
        starting_tool: {
          type: 'string',
          description: 'Tool you are starting with to understand what comes next'
        }
      },
      required: []
    }
  };
}