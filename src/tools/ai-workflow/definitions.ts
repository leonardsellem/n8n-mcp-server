/**
 * AI Workflow Tool Definitions - Phase 2 Universal AI Agent Workflow Tools
 * 
 * This module provides comprehensive MCP tool definitions for all AI workflow
 * capabilities, with detailed parameter descriptions and validation rules that
 * work universally with any AI agent platform.
 */

import { ToolDefinition } from '../../types/index.js';

/**
 * Universal Workflow Creator Tool Definition
 */
export function getCreateWorkflowFromDescriptionToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow_from_description',
    description: 'Create intelligent workflows from natural language descriptions using AI-powered analysis and Phase 1 Enhanced Discovery. Works universally with any AI agent and supports any workflow complexity.',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Natural language description of what the workflow should do. Examples: "Send email when webhook received", "Process CSV data and store in database", "Monitor API and notify on changes"'
        },
        complexity: {
          type: 'string',
          enum: ['auto', 'simple', 'medium', 'complex'],
          description: 'Workflow complexity level. "auto" analyzes description to determine optimal complexity.',
          default: 'auto'
        },
        preferred_integrations: {
          type: 'array',
          items: { type: 'string' },
          description: 'Preferred integrations to include (e.g., ["slack", "google", "salesforce"]). Optional.',
          default: []
        },
        trigger_type: {
          type: 'string',
          enum: ['auto', 'webhook', 'schedule', 'email', 'manual', 'file'],
          description: 'Preferred trigger type. "auto" selects best trigger based on description.',
          default: 'auto'
        },
        output_format: {
          type: 'string',
          enum: ['json', 'xml', 'csv', 'text', 'email', 'notification'],
          description: 'Expected output format for the workflow results.',
          default: 'json'
        },
        name: {
          type: 'string',
          description: 'Optional custom name for the workflow. If not provided, generates intelligent name from description.'
        },
        optimize_for_universal_use: {
          type: 'boolean',
          description: 'Apply universal optimizations for maximum compatibility across AI agent platforms.',
          default: true
        }
      },
      required: ['description']
    }
  };
}

/**
 * Universal Auto Node Connector Tool Definition
 */
export function getAutoConnectWorkflowNodesToolDefinition(): ToolDefinition {
  return {
    name: 'auto_connect_workflow_nodes',
    description: 'Intelligently connect workflow nodes using multiple strategies with universal compatibility analysis. Supports sequential, parallel, conditional, and AI-powered connection strategies.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to analyze and connect nodes for'
        },
        nodes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional array of specific node names to connect. If not provided, analyzes all nodes in workflow.',
          default: []
        },
        strategy: {
          type: 'string',
          enum: ['sequential', 'parallel', 'conditional', 'intelligent', 'auto'],
          description: 'Connection strategy: "sequential" chains nodes linearly, "parallel" fans out from trigger, "conditional" adds branching logic, "intelligent" uses AI analysis, "auto" selects best strategy.',
          default: 'intelligent'
        },
        data_mapping: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source_field: { type: 'string', description: 'Source data field name' },
              target_field: { type: 'string', description: 'Target parameter name' },
              transformation: { type: 'string', description: 'Data transformation expression' },
              validation: { type: 'string', description: 'Validation rules' },
              default_value: { description: 'Default value if source is missing' }
            },
            required: ['source_field', 'target_field']
          },
          description: 'Custom data mapping configurations between nodes',
          default: []
        },
        error_handling: {
          type: 'boolean',
          description: 'Add universal error handling, retry logic, and fallback paths.',
          default: true
        },
        auto_apply: {
          type: 'boolean',
          description: 'Automatically apply suggested connections to the workflow.',
          default: false
        }
      },
      required: ['workflow_id']
    }
  };
}

/**
 * Universal Parameter Mapper Tool Definition
 */
export function getMapNodeParametersToolDefinition(): ToolDefinition {
  return {
    name: 'map_node_parameters',
    description: 'Intelligently map parameters between workflow nodes with universal compatibility patterns, data transformations, and AI-powered optimization suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        source_node: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Node name' },
            type: { type: 'string', description: 'Node type (e.g., n8n-nodes-base.webhook)' },
            parameters: { type: 'object', description: 'Current node parameters' }
          },
          required: ['name', 'type'],
          description: 'Source node information for parameter mapping'
        },
        target_node: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Node name' },
            type: { type: 'string', description: 'Node type (e.g., n8n-nodes-base.httpRequest)' },
            parameters: { type: 'object', description: 'Current node parameters' }
          },
          required: ['name', 'type'],
          description: 'Target node information for parameter mapping'
        },
        existing_mappings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source_parameter: { type: 'string' },
              target_parameter: { type: 'string' },
              transformation: { type: 'string' },
              confidence: { type: 'number' }
            }
          },
          description: 'Existing parameter mappings to preserve and enhance',
          default: []
        },
        options: {
          type: 'object',
          properties: {
            include_transformations: {
              type: 'boolean',
              description: 'Include data transformation suggestions',
              default: true
            },
            optimize_for_performance: {
              type: 'boolean',
              description: 'Optimize mappings for execution performance',
              default: true
            },
            universal_compatibility: {
              type: 'boolean',
              description: 'Ensure compatibility across all AI agent platforms',
              default: true
            }
          },
          description: 'Mapping configuration options',
          default: {}
        }
      },
      required: ['source_node', 'target_node']
    }
  };
}

/**
 * Workflow Intent Analysis Tool Definition (Utility)
 */
export function getAnalyzeWorkflowIntentToolDefinition(): ToolDefinition {
  return {
    name: 'analyze_workflow_intent',
    description: 'Analyze natural language workflow descriptions to extract triggers, actions, integrations, and complexity using AI-powered intent recognition.',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Natural language description of the workflow to analyze'
        },
        include_suggestions: {
          type: 'boolean',
          description: 'Include node and integration suggestions based on analysis',
          default: true
        },
        include_alternatives: {
          type: 'boolean',
          description: 'Include alternative workflow approaches and patterns',
          default: false
        }
      },
      required: ['description']
    }
  };
}

/**
 * Universal Workflow Optimization Tool Definition
 */
export function getOptimizeWorkflowUniversallyToolDefinition(): ToolDefinition {
  return {
    name: 'optimize_workflow_universally',
    description: 'Apply universal optimizations to workflows for maximum performance, reliability, and compatibility across all AI agent platforms.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to optimize'
        },
        optimization_targets: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['performance', 'reliability', 'cost', 'compatibility', 'maintainability']
          },
          description: 'Specific optimization targets to focus on',
          default: ['performance', 'reliability', 'compatibility']
        },
        apply_optimizations: {
          type: 'boolean',
          description: 'Automatically apply recommended optimizations',
          default: false
        },
        include_alternatives: {
          type: 'boolean',
          description: 'Include alternative node suggestions for better performance',
          default: true
        }
      },
      required: ['workflow_id']
    }
  };
}

/**
 * Smart Workflow Builder Tool Definition
 */
export function getSmartWorkflowBuilderToolDefinition(): ToolDefinition {
  return {
    name: 'smart_workflow_builder',
    description: 'Build complete workflows step-by-step with AI guidance, node suggestions, and real-time validation. Perfect for complex workflows requiring detailed customization.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_goal: {
          type: 'object',
          properties: {
            objective: { type: 'string', description: 'Main workflow objective' },
            input_data: { type: 'object', description: 'Expected input data structure' },
            output_requirements: { type: 'object', description: 'Required output format and content' },
            constraints: {
              type: 'array',
              items: { type: 'string' },
              description: 'Workflow constraints and limitations'
            },
            performance_requirements: {
              type: 'object',
              properties: {
                max_execution_time: { type: 'string' },
                max_memory_usage: { type: 'string' },
                reliability_target: { type: 'number' }
              }
            }
          },
          required: ['objective'],
          description: 'Detailed workflow goal specification'
        },
        build_mode: {
          type: 'string',
          enum: ['guided', 'automated', 'hybrid'],
          description: 'Building mode: "guided" provides step-by-step assistance, "automated" builds complete workflow, "hybrid" combines both approaches',
          default: 'hybrid'
        },
        include_testing: {
          type: 'boolean',
          description: 'Include test data generation and validation steps',
          default: true
        },
        deployment_target: {
          type: 'string',
          enum: ['development', 'staging', 'production'],
          description: 'Target deployment environment for optimization',
          default: 'development'
        }
      },
      required: ['workflow_goal']
    }
  };
}

/**
 * Workflow Compatibility Checker Tool Definition
 */
export function getCheckWorkflowCompatibilityToolDefinition(): ToolDefinition {
  return {
    name: 'check_workflow_compatibility',
    description: 'Check workflow compatibility across different AI agent platforms, n8n versions, and integration requirements with detailed recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to check compatibility for'
        },
        target_platforms: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['claude', 'gpt4', 'gemini', 'llama', 'custom_ai']
          },
          description: 'AI agent platforms to check compatibility with',
          default: ['claude', 'gpt4', 'gemini']
        },
        n8n_version: {
          type: 'string',
          description: 'Target n8n version for compatibility check (e.g., "1.0.0")',
          default: 'latest'
        },
        include_migration_guide: {
          type: 'boolean',
          description: 'Include migration guidance for incompatible elements',
          default: true
        },
        check_integrations: {
          type: 'boolean',
          description: 'Verify external integration compatibility and requirements',
          default: true
        }
      },
      required: ['workflow_id']
    }
  };
}

/**
 * All AI Workflow Tool Definitions
 */
export const allAIWorkflowToolDefinitions = [
  getCreateWorkflowFromDescriptionToolDefinition(),
  getAutoConnectWorkflowNodesToolDefinition(),
  getMapNodeParametersToolDefinition(),
  getAnalyzeWorkflowIntentToolDefinition(),
  getOptimizeWorkflowUniversallyToolDefinition(),
  getSmartWorkflowBuilderToolDefinition(),
  getCheckWorkflowCompatibilityToolDefinition()
];

/**
 * Core AI Workflow Tools (subset for essential functionality)
 */
export const coreAIWorkflowToolDefinitions = [
  getCreateWorkflowFromDescriptionToolDefinition(),
  getAutoConnectWorkflowNodesToolDefinition(),
  getMapNodeParametersToolDefinition()
];