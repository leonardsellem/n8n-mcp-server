/**
 * AI-Native n8n Tools
 * 
 * These tools are specifically designed for AI agents to use n8n
 * as if it were a native capability, with natural language interfaces
 * and intelligent automation.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import NaturalLanguageWorkflowBuilder, { NLWorkflowRequest, WorkflowBlueprint } from '../ai-workflow/natural-language-builder.js';
import SmartRecommendationEngine, { RecommendationRequest, RecommendationResult } from '../ai-workflow/smart-recommendations.js';
import WorkflowTemplateEngine, { WorkflowTemplate } from '../ai-workflow/workflow-templates.js';
import IntelligentWorkflowMonitor, { PerformanceMetrics, OptimizationSuggestion } from '../ai-workflow/intelligent-monitoring.js';

// Initialize AI workflow engines
const nlBuilder = new NaturalLanguageWorkflowBuilder();
const recommendationEngine = new SmartRecommendationEngine();
const templateEngine = new WorkflowTemplateEngine();
const intelligentMonitor = new IntelligentWorkflowMonitor();

/**
 * Natural Language Workflow Builder Tool
 */
export const buildWorkflowFromDescription: Tool = {
  name: 'build_workflow_from_description',
  description: 'Convert natural language description into a complete n8n workflow with nodes, connections, and parameters',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: 'Natural language description of the workflow (e.g., "Send a Slack message when a GitHub issue is created")'
      },
      context: {
        type: 'object',
        properties: {
          preferredNodes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Preferred node types to use if available'
          },
          constraints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Any constraints or requirements'
          },
          environment: {
            type: 'string',
            enum: ['development', 'production'],
            description: 'Target environment'
          }
        }
      }
    },
    required: ['description']
  }
};

/**
 * Smart Node Recommendation Tool
 */
export const getSmartRecommendations: Tool = {
  name: 'get_smart_recommendations',
  description: 'Get intelligent node recommendations based on workflow context, intent, and best practices',
  inputSchema: {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          existingNodes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Node types already in the workflow'
          },
          intent: {
            type: 'string',
            description: 'What you want to accomplish'
          },
          dataTypes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Types of data being processed'
          },
          constraints: {
            type: 'object',
            properties: {
              complexity: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                description: 'Preferred complexity level'
              },
              performance: {
                type: 'string',
                enum: ['speed', 'reliability', 'cost'],
                description: 'Priority optimization target'
              },
              environment: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
                description: 'Target environment'
              }
            }
          }
        },
        required: ['intent']
      },
      query: {
        type: 'string',
        description: 'Additional natural language query for specific recommendations'
      }
    },
    required: ['context']
  }
};

/**
 * Workflow Templates Tool
 */
export const getWorkflowTemplates: Tool = {
  name: 'get_workflow_templates',
  description: 'Get pre-built workflow templates for common automation patterns that can be customized',
  inputSchema: {
    type: 'object',
    properties: {
      filter: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Template category (e.g., "Communication", "Data Processing", "AI & Content")'
          },
          complexity: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
            description: 'Complexity level'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags to filter by (e.g., "notification", "api", "ai")'
          }
        }
      },
      searchDescription: {
        type: 'string',
        description: 'Natural language description to find matching templates'
      }
    }
  }
};

/**
 * Generate Workflow from Template Tool
 */
export const generateWorkflowFromTemplate: Tool = {
  name: 'generate_workflow_from_template',
  description: 'Generate a complete workflow from a template with customized slot values and parameters',
  inputSchema: {
    type: 'object',
    properties: {
      templateId: {
        type: 'string',
        description: 'ID of the template to use'
      },
      slotValues: {
        type: 'object',
        description: 'Node types to use for each template slot (e.g., {"trigger": "n8n-nodes-base.scheduleTrigger"})',
        additionalProperties: { type: 'string' }
      },
      parameters: {
        type: 'object',
        description: 'Custom parameters for each slot',
        additionalProperties: {
          type: 'object',
          additionalProperties: true
        }
      }
    },
    required: ['templateId', 'slotValues']
  }
};

/**
 * Intelligent Monitoring Tool
 */
export const monitorWorkflowIntelligently: Tool = {
  name: 'monitor_workflow_intelligently',
  description: 'Monitor workflow execution with AI-powered analysis, alerts, and recommendations',
  inputSchema: {
    type: 'object',
    properties: {
      executionId: {
        type: 'string',
        description: 'ID of the workflow execution to monitor'
      },
      enableAutoRecovery: {
        type: 'boolean',
        description: 'Whether to attempt automatic recovery for recoverable errors',
        default: false
      }
    },
    required: ['executionId']
  }
};

/**
 * Performance Analytics Tool
 */
export const analyzeWorkflowPerformance: Tool = {
  name: 'analyze_workflow_performance',
  description: 'Generate comprehensive performance metrics and optimization suggestions for a workflow',
  inputSchema: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to analyze'
      },
      includeOptimizations: {
        type: 'boolean',
        description: 'Whether to include optimization suggestions',
        default: true
      }
    },
    required: ['workflowId']
  }
};

/**
 * Auto-Recovery Tool
 */
export const attemptWorkflowRecovery: Tool = {
  name: 'attempt_workflow_recovery',
  description: 'Automatically attempt to recover from workflow execution failures using intelligent strategies',
  inputSchema: {
    type: 'object',
    properties: {
      executionId: {
        type: 'string',
        description: 'ID of the failed execution to recover'
      },
      recoveryStrategy: {
        type: 'string',
        enum: ['auto', 'retry', 'skip', 'fallback'],
        description: 'Preferred recovery strategy',
        default: 'auto'
      }
    },
    required: ['executionId']
  }
};

/**
 * Workflow Optimization Tool
 */
export const optimizeWorkflow: Tool = {
  name: 'optimize_workflow',
  description: 'Get specific optimization recommendations to improve workflow performance, reliability, and cost-effectiveness',
  inputSchema: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to optimize'
      },
      optimizationGoals: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['performance', 'reliability', 'cost', 'security']
        },
        description: 'Primary optimization goals'
      },
      currentIssues: {
        type: 'array',
        items: { type: 'string' },
        description: 'Known issues or pain points with the current workflow'
      }
    },
    required: ['workflowId']
  }
};

/**
 * Tool handler implementations
 */
export const aiNativeHandlers = {
  build_workflow_from_description: async (args: any) => {
    const request: NLWorkflowRequest = {
      description: args.description,
      context: args.context
    };
    
    const blueprint = await nlBuilder.buildWorkflow(request);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            workflow: blueprint,
            summary: `Generated workflow "${blueprint.name}" with ${blueprint.nodes.length} nodes`,
            confidence: blueprint.confidence_score,
            complexity: blueprint.estimated_complexity,
            suggestions: blueprint.suggestions
          }, null, 2)
        }
      ]
    };
  },

  get_smart_recommendations: async (args: any) => {
    const request: RecommendationRequest = {
      context: args.context,
      query: args.query
    };
    
    const recommendations = await recommendationEngine.getRecommendations(request);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            primary_recommendations: recommendations.primary.map(r => ({
              node: r.node.displayName,
              type: r.node.name,
              confidence: r.confidence,
              reasoning: r.reasoning,
              complexity: r.estimatedComplexity,
              suggested_parameters: r.suggestedParameters
            })),
            alternatives: recommendations.alternatives.map(r => ({
              node: r.node.displayName,
              type: r.node.name,
              confidence: r.confidence
            })),
            workflow_suggestions: recommendations.workflowSuggestions,
            best_practices: recommendations.bestPractices
          }, null, 2)
        }
      ]
    };
  },

  get_workflow_templates: async (args: any) => {
    let templates: WorkflowTemplate[];
    
    if (args.searchDescription) {
      templates = templateEngine.recommendTemplates(args.searchDescription);
    } else {
      templates = templateEngine.getTemplates(args.filter);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            templates: templates.map(t => ({
              id: t.id,
              name: t.name,
              description: t.description,
              category: t.category,
              complexity: t.complexity,
              useCase: t.useCase,
              estimatedSetupTime: t.metadata.estimatedSetupTime,
              tags: t.metadata.tags,
              slots: t.slots.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                type: s.type,
                required: s.required,
                defaultNode: s.defaultNode,
                options: s.options.map(o => ({
                  nodeType: o.nodeType,
                  displayName: o.displayName,
                  suitability: o.suitability
                }))
              }))
            }))
          }, null, 2)
        }
      ]
    };
  },

  generate_workflow_from_template: async (args: any) => {
    const workflow = templateEngine.generateWorkflow(
      args.templateId,
      args.slotValues,
      args.parameters
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            workflow,
            summary: `Generated workflow "${workflow.name}" from template ${args.templateId}`,
            nodeCount: workflow.nodes.length,
            ready_for_import: true
          }, null, 2)
        }
      ]
    };
  },

  monitor_workflow_intelligently: async (args: any) => {
    const monitoring = await intelligentMonitor.monitorExecution(args.executionId);
    
    let recoveryResult = null;
    if (args.enableAutoRecovery && monitoring.execution.status === 'error') {
      recoveryResult = await intelligentMonitor.attemptAutoRecovery(args.executionId);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            execution: {
              id: monitoring.execution.id,
              status: monitoring.execution.status,
              duration: monitoring.execution.duration,
              startedAt: monitoring.execution.startedAt,
              finishedAt: monitoring.execution.finishedAt
            },
            alerts: monitoring.alerts,
            recommendations: monitoring.recommendations,
            auto_recovery: recoveryResult || undefined
          }, null, 2)
        }
      ]
    };
  },

  analyze_workflow_performance: async (args: any) => {
    const metrics = await intelligentMonitor.generatePerformanceMetrics(args.workflowId);
    let optimizations: OptimizationSuggestion[] = [];
    
    if (args.includeOptimizations !== false) {
      optimizations = await intelligentMonitor.generateOptimizationSuggestions(args.workflowId);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            performance_metrics: {
              execution_count: metrics.executionCount,
              success_rate: `${metrics.successRate.toFixed(1)}%`,
              average_duration: `${Math.round(metrics.averageDuration / 1000)}s`,
              error_rate: `${metrics.errorRate.toFixed(1)}%`,
              common_errors: metrics.commonErrors,
              slowest_nodes: metrics.slowestNodes,
              resource_usage: metrics.resourceUsage
            },
            optimizations: optimizations.map(opt => ({
              category: opt.category,
              priority: opt.priority,
              title: opt.title,
              description: opt.description,
              impact: opt.impact,
              implementation: opt.implementation,
              estimated_benefit: opt.estimatedBenefit
            }))
          }, null, 2)
        }
      ]
    };
  },

  attempt_workflow_recovery: async (args: any) => {
    const recovery = await intelligentMonitor.attemptAutoRecovery(args.executionId);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            recovery_attempted: recovery.attempted,
            recovery_successful: recovery.success,
            new_execution_id: recovery.newExecutionId,
            actions_taken: recovery.actions.map(a => ({
              type: a.type,
              description: a.description,
              success_rate: a.successRate,
              impact: a.estimatedImpact
            }))
          }, null, 2)
        }
      ]
    };
  },

  optimize_workflow: async (args: any) => {
    const optimizations = await intelligentMonitor.generateOptimizationSuggestions(args.workflowId);
    
    // Filter by goals if specified
    let filteredOptimizations = optimizations;
    if (args.optimizationGoals && args.optimizationGoals.length > 0) {
      filteredOptimizations = optimizations.filter(opt => 
        args.optimizationGoals.includes(opt.category)
      );
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            optimization_recommendations: filteredOptimizations.map(opt => ({
              category: opt.category,
              priority: opt.priority,
              title: opt.title,
              description: opt.description,
              impact: opt.impact,
              implementation_steps: opt.implementation.split(', '),
              estimated_benefit: opt.estimatedBenefit
            })),
            summary: `Found ${filteredOptimizations.length} optimization opportunities`,
            priority_actions: filteredOptimizations.filter(opt => opt.priority === 'high').length
          }, null, 2)
        }
      ]
    };
  }
};

// Export all tools and handlers
export const AI_NATIVE_TOOLS = [
  buildWorkflowFromDescription,
  getSmartRecommendations,
  getWorkflowTemplates,
  generateWorkflowFromTemplate,
  monitorWorkflowIntelligently,
  analyzeWorkflowPerformance,
  attemptWorkflowRecovery,
  optimizeWorkflow
];

export default {
  tools: AI_NATIVE_TOOLS,
  handlers: aiNativeHandlers
};