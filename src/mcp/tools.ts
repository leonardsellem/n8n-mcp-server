import { ToolDefinition } from '../types';

/**
 * n8n Documentation MCP Tools - FINAL OPTIMIZED VERSION
 * 
 * Incorporates all lessons learned from real workflow building.
 * Designed to help AI agents avoid common pitfalls and build workflows efficiently.
 */
export const n8nDocumentationToolsFinal: ToolDefinition[] = [
  {
    name: 'get_workflow_guide',
    description: `Get workflow building guidance for specific scenarios. Returns patterns and configurations.`,
    inputSchema: {
      type: 'object',
      properties: {
        scenario: {
          type: 'string',
          enum: ['webhook_to_api', 'ai_agent_tools', 'data_processing', 'notification_system', 'database_operations', 'file_handling'],
          description: 'Specific workflow scenario. Returns exact node configurations and connection patterns.',
        },
      },
    },
  },
  {
    name: 'get_node_info',
    description: `Get node configuration data. Default: essential properties only. Format: "nodes-base.slack".`,
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'Full node type. Examples: "nodes-base.slack", "nodes-base.httpRequest", "nodes-langchain.openAi". Use exact values from list_nodes.',
        },
        detail: {
          type: 'string',
          enum: ['essentials', 'complete', 'ai_tool'],
          description: 'essentials=required+common properties (fast). complete=full schema (slow). ai_tool=AI connection guidance.',
          default: 'essentials'
        }
      },
      required: ['nodeType'],
    },
  },
  {
    name: 'find_nodes',
    description: `Find n8n nodes by search term or category. Returns nodeType, name, description.`,
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term. Examples: "slack", "email", "http". Searches names and descriptions.',
        },
        category: {
          type: 'string',
          enum: ['trigger', 'transform', 'output', 'input', 'AI', 'ai_tools'],
          description: 'Node category. trigger=workflow starters, AI=LangChain nodes, ai_tools=optimized for AI agents.',
        },
        limit: {
          type: 'number',
          description: 'Results limit. Default 50.',
          default: 50,
        },
      },
    },
  },
  {
    name: 'get_database_statistics',
    description: `Get n8n ecosystem stats and server metrics. Returns node counts and performance data.`,
    inputSchema: {
      type: 'object',
      properties: {
        includePerformance: {
          type: 'boolean',
          description: 'Include cache hit rates and response time metrics. Default true.',
          default: true
        }
      },
    },
  },
  {
    name: 'get_node_config',
    description: `Get node configuration help: pre-configured settings, property search, or dependencies.`,
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'Full node type. Required for property search and dependencies.',
        },
        mode: {
          type: 'string',
          enum: ['task', 'search_properties', 'dependencies', 'list_tasks'],
          description: 'task=get pre-configured settings, search_properties=find specific properties, dependencies=analyze property relationships, list_tasks=see available tasks.',
          default: 'task'
        },
        task: {
          type: 'string',
          description: 'Task name for mode=task. Examples: post_json_request, receive_webhook, send_slack_message.',
        },
        query: {
          type: 'string',
          description: 'Property search term for mode=search_properties. Examples: "auth", "header", "body".',
        },
        config: {
          type: 'object',
          description: 'Current configuration for mode=dependencies. Analyzes visibility impact.',
        }
      },
    },
  },
  {
    name: 'validate_node',
    description: `Validate node configuration. Returns errors, warnings, and fix suggestions.`,
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'Node type to validate. Example: "nodes-base.slack".',
        },
        config: {
          type: 'object',
          description: 'Node configuration to validate.',
        },
        mode: {
          type: 'string',
          enum: ['minimal', 'full'],
          description: 'minimal=required fields only (fast), full=complete validation (thorough).',
          default: 'full'
        },
      },
      required: ['nodeType', 'config'],
    },
  },
  {
    name: 'find_templates',
    description: `Search workflow templates from n8n.io. Modes: nodes (by node type), keywords (text search), task (curated), all (browse).`,
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['nodes', 'keywords', 'task', 'all'],
          description: 'Search mode. Default "keywords" for general search.',
          default: 'keywords'
        },
        nodeTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of node types to search for (mode: "nodes" only). Use full names like "n8n-nodes-base.httpRequest".',
        },
        query: {
          type: 'string',
          description: 'Search query for template names/descriptions (mode: "keywords" only). Examples: "chatbot", "automation", "social media".'
        },
        task: {
          type: 'string',
          enum: ['ai_automation', 'data_sync', 'webhook_processing', 'email_automation', 'slack_integration', 'data_transformation', 'file_processing', 'scheduling', 'api_integration', 'database_operations'],
          description: 'Task category (mode: "task" only). Predefined categories for common automation tasks.'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of templates to return. Default 20.',
          default: 20
        }
      },
      required: []
    }
  },
  {
    name: 'get_template',
    description: `Get workflow template JSON by ID. Returns complete workflow definition for import.`,
    inputSchema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'number',
          description: 'The template ID to retrieve',
        },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'validate_workflow',
    description: `Validate n8n workflows. Modes: full, structure, connections, expressions, nodes, remote. Returns errors and suggestions.`,
    inputSchema: {
      type: 'object',
      properties: {
        workflow: {
          type: 'object',
          description: 'The complete workflow JSON to validate. Must include nodes array and connections object. Not needed for remote mode.',
        },
        workflowId: {
          type: 'string',
          description: 'Workflow ID to validate from n8n instance (only for remote mode). Requires N8N_API_URL and N8N_API_KEY.',
        },
        mode: {
          type: 'string',
          enum: ['full', 'structure', 'connections', 'expressions', 'nodes', 'remote'],
          description: 'Validation mode. Default "full" validates everything. Other modes focus on specific areas.',
          default: 'full',
        },
        options: {
          type: 'object',
          properties: {
            validateNodes: {
              type: 'boolean',
              description: 'Validate individual node configurations. Default true for full mode.',
              default: true,
            },
            validateConnections: {
              type: 'boolean',
              description: 'Validate node connections and flow. Default true for full mode.',
              default: true,
            },
            validateExpressions: {
              type: 'boolean',
              description: 'Validate n8n expressions syntax and references. Default true for full mode.',
              default: true,
            },
            profile: {
              type: 'string',
              enum: ['minimal', 'runtime', 'ai-friendly', 'strict'],
              description: 'Validation profile for node validation. Default "runtime".',
              default: 'runtime',
            },
          },
          description: 'Optional validation settings. Mode automatically sets appropriate defaults.',
        },
      },
      required: [],
    },
  },
];

/**
 * QUICK REFERENCE for AI Agents:
 * 
 * 1. RECOMMENDED WORKFLOW:
 *    - Start: search_nodes → get_node_essentials → get_node_for_task → validate_node_operation
 *    - Discovery: list_nodes({category:"trigger"}) for browsing categories
 *    - Quick Config: get_node_essentials("nodes-base.httpRequest") - only essential properties
 *    - Full Details: get_node_info only when essentials aren't enough
 *    - Validation: Use validate_node_operation for complex nodes (Slack, Google Sheets, etc.)
 * 
 * 2. COMMON NODE TYPES:
 *    Triggers: webhook, schedule, emailReadImap, slackTrigger
 *    Core: httpRequest, code, set, if, merge, splitInBatches
 *    Integrations: slack, gmail, googleSheets, postgres, mongodb
 *    AI: agent, openAi, chainLlm, documentLoader
 * 
 * 3. SEARCH TIPS:
 *    - search_nodes returns ANY word match (OR logic)
 *    - Single words more precise, multiple words broader
 *    - If no results: use list_nodes with category filter
 * 
 * 4. TEMPLATE SEARCHING:
 *    - search_templates("slack") searches template names/descriptions, NOT node types!
 *    - To find templates using Slack node: list_node_templates(["n8n-nodes-base.slack"])
 *    - For task-based templates: get_templates_for_task("slack_integration")
 *    - 399 templates available from the last year
 * 
 * 5. KNOWN ISSUES:
 *    - Some nodes have duplicate properties with different conditions
 *    - Package names: use 'n8n-nodes-base' not '@n8n/n8n-nodes-base'
 *    - Check showWhen/hideWhen to identify the right property variant
 * 
 * 6. PERFORMANCE:
 *    - get_node_essentials: Fast (<5KB)
 *    - get_node_info: Slow (100KB+) - use sparingly
 *    - search_nodes/list_nodes: Fast, cached
 */