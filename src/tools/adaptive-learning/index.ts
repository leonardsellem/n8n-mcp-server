/**
 * Adaptive Learning Tools
 * 
 * Tools for tracking AI usage patterns and providing personalized recommendations
 * to improve AI agent workflow interactions over time.
 */

export { LearnFromUsageHandler } from './learn-from-usage.js';
export { GetPersonalizedSuggestionsHandler } from './get-personalized-suggestions.js';
export { OptimizeForAiPatternsHandler } from './optimize-for-ai-patterns.js';

import { ToolDefinition } from '../../types/index.js';

/**
 * Set up adaptive learning tools
 * @returns Array of tool definitions
 */
export async function setupAdaptiveLearningTools(): Promise<ToolDefinition[]> {
  return [
    {
      name: 'learn_from_usage',
      description: 'Track AI usage patterns and workflow interaction history to improve future recommendations. Records tool usage frequency, workflow creation patterns, and success/failure rates.',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            description: 'The action performed (tool_used, workflow_created, workflow_executed, etc.)',
            enum: ['tool_used', 'workflow_created', 'workflow_executed', 'workflow_failed', 'workflow_optimized']
          },
          tool_name: {
            type: 'string',
            description: 'Name of the tool used (if action is tool_used)'
          },
          workflow_id: {
            type: 'string',
            description: 'ID of the workflow involved (if applicable)'
          },
          context: {
            type: 'object',
            description: 'Additional context about the action (execution time, success rate, user feedback, etc.)',
            properties: {
              execution_time: { type: 'number' },
              success: { type: 'boolean' },
              node_count: { type: 'number' },
              complexity_score: { type: 'number' },
              user_feedback: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } }
            }
          },
          metadata: {
            type: 'object',
            description: 'Additional metadata for learning (timestamps, session info, etc.)'
          }
        },
        required: ['action']
      }
    },
    {
      name: 'get_personalized_suggestions',
      description: 'Get AI-specific recommendations based on past usage patterns and preferences. Provides tailored tool suggestions, workflow optimization hints, and best practices.',
      inputSchema: {
        type: 'object',
        properties: {
          context: {
            type: 'string',
            description: 'Context for suggestions (workflow_creation, tool_selection, optimization, troubleshooting)',
            enum: ['workflow_creation', 'tool_selection', 'optimization', 'troubleshooting', 'general']
          },
          current_workflow_id: {
            type: 'string',
            description: 'ID of current workflow being worked on (for context-aware suggestions)'
          },
          user_goals: {
            type: 'array',
            items: { type: 'string' },
            description: 'Current goals or objectives (automation, integration, data_processing, etc.)'
          },
          complexity_preference: {
            type: 'string',
            description: 'Preferred complexity level for suggestions',
            enum: ['simple', 'intermediate', 'advanced', 'adaptive']
          },
          limit: {
            type: 'number',
            description: 'Maximum number of suggestions to return',
            default: 5
          }
        },
        required: ['context']
      }
    },
    {
      name: 'optimize_for_ai_patterns',
      description: 'Adjust tool responses and data formats based on observed AI behavior patterns. Optimizes output format, response structure, and information density for better AI comprehension.',
      inputSchema: {
        type: 'object',
        properties: {
          optimization_type: {
            type: 'string',
            description: 'Type of optimization to apply',
            enum: ['response_format', 'data_structure', 'information_density', 'context_awareness', 'error_handling']
          },
          tool_name: {
            type: 'string',
            description: 'Specific tool to optimize (leave empty for global optimization)'
          },
          ai_model_info: {
            type: 'object',
            description: 'Information about the AI model for optimization',
            properties: {
              model_type: { type: 'string' },
              context_window: { type: 'number' },
              preferred_format: { type: 'string' },
              capabilities: { type: 'array', items: { type: 'string' } }
            }
          },
          learning_preferences: {
            type: 'object',
            description: 'AI learning preferences discovered from usage patterns',
            properties: {
              prefers_structured_data: { type: 'boolean' },
              prefers_detailed_explanations: { type: 'boolean' },
              prefers_step_by_step: { type: 'boolean' },
              optimal_response_length: { type: 'string' }
            }
          }
        },
        required: ['optimization_type']
      }
    }
  ];
}