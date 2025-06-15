/**
 * AI Agent Workflow Templates
 * 
 * Tools for providing pre-built workflows specifically designed for common AI agent tasks
 * and creating workflows optimized for AI agent execution.
 */

export { GetAiAgentTemplatesHandler } from './get-ai-agent-templates.js';
export { CreateAiOptimizedWorkflowHandler } from './create-ai-optimized-workflow.js';

import { ToolDefinition } from '../../types/index.js';

/**
 * Set up AI agent workflow template tools
 * @returns Array of tool definitions
 */
export async function setupAiAgentTemplateTools(): Promise<ToolDefinition[]> {
  return [
    {
      name: 'get_ai_agent_templates',
      description: 'Get pre-built workflow templates specifically designed for common AI agent tasks such as data processing, API calls, file operations, and automated workflows. Templates include proper error handling, timeouts, and optimized data flow.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Category of AI agent templates to retrieve',
            enum: [
              'data_processing',
              'api_integration', 
              'file_operations',
              'notification_systems',
              'monitoring_automation',
              'content_generation',
              'decision_workflows',
              'batch_processing',
              'webhook_handlers',
              'scheduled_tasks',
              'all'
            ]
          },
          complexity: {
            type: 'string',
            description: 'Complexity level of templates',
            enum: ['simple', 'intermediate', 'advanced', 'all'],
            default: 'all'
          },
          execution_mode: {
            type: 'string',
            description: 'Execution mode compatibility',
            enum: ['manual', 'triggered', 'scheduled', 'webhook', 'all'],
            default: 'all'
          },
          include_metadata: {
            type: 'boolean',
            description: 'Include detailed metadata about each template',
            default: true
          },
          ai_optimization_level: {
            type: 'string',
            description: 'Level of AI-specific optimizations in templates',
            enum: ['basic', 'enhanced', 'advanced', 'all'],
            default: 'all'
          }
        },
        required: []
      }
    },
    {
      name: 'create_ai_optimized_workflow',
      description: 'Create workflows specifically optimized for AI agent execution with built-in error handling, timeout management, retry logic, and optimized data flow. Designed for automated execution without human intervention.',
      inputSchema: {
        type: 'object',
        properties: {
          workflow_type: {
            type: 'string',
            description: 'Type of AI-optimized workflow to create',
            enum: [
              'data_pipeline',
              'api_orchestration',
              'file_processor',
              'notification_hub',
              'monitoring_system',
              'content_workflow',
              'decision_engine',
              'batch_processor',
              'webhook_responder',
              'scheduled_automation'
            ]
          },
          name: {
            type: 'string',
            description: 'Name for the new workflow'
          },
          description: {
            type: 'string',
            description: 'Description of the workflow purpose and functionality'
          },
          input_schema: {
            type: 'object',
            description: 'Expected input data schema for the workflow',
            properties: {
              required_fields: { type: 'array', items: { type: 'string' } },
              optional_fields: { type: 'array', items: { type: 'string' } },
              data_types: { type: 'object' },
              validation_rules: { type: 'object' }
            }
          },
          output_requirements: {
            type: 'object',
            description: 'Required output format and structure',
            properties: {
              format: { type: 'string', enum: ['json', 'xml', 'csv', 'plain_text'] },
              structure: { type: 'object' },
              success_indicators: { type: 'array', items: { type: 'string' } },
              error_handling: { type: 'object' }
            }
          },
          ai_optimizations: {
            type: 'object',
            description: 'AI-specific optimization settings',
            properties: {
              timeout_handling: { type: 'boolean', default: true },
              retry_logic: { type: 'boolean', default: true },
              error_recovery: { type: 'boolean', default: true },
              data_validation: { type: 'boolean', default: true },
              logging_level: { type: 'string', enum: ['minimal', 'standard', 'verbose'], default: 'standard' },
              performance_monitoring: { type: 'boolean', default: true }
            }
          },
          execution_settings: {
            type: 'object',
            description: 'Execution configuration for AI agents',
            properties: {
              max_execution_time: { type: 'number', default: 300 },
              retry_attempts: { type: 'number', default: 3 },
              retry_delay: { type: 'number', default: 5 },
              concurrent_executions: { type: 'number', default: 1 },
              queue_priority: { type: 'string', enum: ['low', 'normal', 'high'], default: 'normal' }
            }
          },
          integration_points: {
            type: 'array',
            description: 'External systems or APIs the workflow should integrate with',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                endpoint: { type: 'string' },
                authentication: { type: 'object' },
                timeout: { type: 'number' }
              }
            }
          }
        },
        required: ['workflow_type', 'name']
      }
    }
  ];
}