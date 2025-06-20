/**
 * AI Workflow Tools Index - Phase 2 Universal AI Agent Workflow Tools
 * 
 * This module exports all AI-powered workflow creation capabilities that
 * work universally with any AI agent and any workflow description, leveraging
 * the Phase 1 Enhanced Discovery system for optimal node selection.
 */

import { ToolDefinition } from '../../types/index.js';

// Import handlers
import { UniversalWorkflowCreator } from './create-intelligent.js';
import { UniversalAutoConnector } from './auto-connect.js';
import { universalParameterMapper } from '../../intelligence/parameter-mapper.js';

// Import tool definitions
import {
  getCreateWorkflowFromDescriptionToolDefinition,
  getAutoConnectWorkflowNodesToolDefinition,
  getMapNodeParametersToolDefinition,
  getAnalyzeWorkflowIntentToolDefinition,
  getOptimizeWorkflowUniversallyToolDefinition,
  getSmartWorkflowBuilderToolDefinition,
  getCheckWorkflowCompatibilityToolDefinition,
  coreAIWorkflowToolDefinitions
} from './definitions.js';

// Export handlers for use by other modules
export {
  UniversalWorkflowCreator,
  UniversalAutoConnector,
  universalParameterMapper
};

// Export tool definitions
export {
  getCreateWorkflowFromDescriptionToolDefinition,
  getAutoConnectWorkflowNodesToolDefinition,
  getMapNodeParametersToolDefinition
};

// Handler instances
const universalWorkflowCreator = new UniversalWorkflowCreator();
const universalAutoConnector = new UniversalAutoConnector();

/**
 * Parameter mapper handler for MCP tool integration
 */
class ParameterMapperHandler {
  async execute(args: Record<string, any>) {
    try {
      const { source_node, target_node, existing_mappings = [], options = {} } = args;
      
      if (!source_node || !target_node) {
        throw new Error('Both source_node and target_node are required');
      }
      
      const result = await universalParameterMapper.mapParameters(
        source_node,
        target_node,
        existing_mappings,
        options
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Parameter mapping failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
}

const parameterMapperHandler = new ParameterMapperHandler();

/**
 * Intent analysis handler
 */
class IntentAnalysisHandler {
  async execute(args: Record<string, any>) {
    try {
      const { description, include_suggestions = true, include_alternatives = false } = args;
      
      if (!description) {
        throw new Error('Description is required for intent analysis');
      }
      
      // Use the protected method from UniversalWorkflowCreator
      const intent = await universalWorkflowCreator['analyzeWorkflowIntent'](description);
      
      let result: any = {
        intent_analysis: intent,
        confidence: intent.confidence,
        detected_triggers: intent.triggers,
        detected_actions: intent.actions,
        detected_integrations: intent.integrations,
        complexity_assessment: intent.complexity,
        workflow_patterns: intent.workflow_patterns
      };
      
      if (include_suggestions) {
        result.node_suggestions = intent.suggested_nodes.slice(0, 10);
        result.integration_recommendations = intent.integrations.map(integration => ({
          name: integration,
          compatibility: 'high',
          setup_complexity: 'medium'
        }));
      }
      
      if (include_alternatives) {
        result.alternative_approaches = [
          {
            approach: 'simplified',
            description: 'Reduced complexity version of the workflow',
            benefits: ['Easier to maintain', 'Lower failure rate', 'Faster execution']
          },
          {
            approach: 'enhanced',
            description: 'Extended version with additional features',
            benefits: ['More comprehensive', 'Better error handling', 'Additional integrations']
          }
        ];
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Intent analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
}

const intentAnalysisHandler = new IntentAnalysisHandler();

/**
 * Universal workflow optimization handler
 */
class UniversalOptimizationHandler {
  async execute(args: Record<string, any>) {
    try {
      const { 
        workflow_id, 
        optimization_targets = ['performance', 'reliability', 'compatibility'],
        apply_optimizations = false,
        include_alternatives = true 
      } = args;
      
      if (!workflow_id) {
        throw new Error('Workflow ID is required for optimization');
      }
      
      // Get workflow using the base handler's API service
      const workflow = await universalWorkflowCreator['apiService'].getWorkflow(workflow_id);
      if (!workflow) {
        throw new Error(`Workflow with ID "${workflow_id}" not found`);
      }
      
      // Apply universal optimizations
      const optimization = await universalWorkflowCreator['optimizeForUniversalUse'](workflow);
      
      const result = {
        workflow_id,
        optimization_analysis: optimization,
        applied: apply_optimizations,
        targets_addressed: optimization_targets,
        performance_improvements: optimization.performance_improvements.length,
        reliability_enhancements: optimization.reliability_enhancements.length,
        cost_optimizations: optimization.cost_optimizations.length,
        recommended_alternatives: optimization.recommended_alternatives.length,
        summary: {
          total_optimizations: optimization.performance_improvements.length + 
                             optimization.reliability_enhancements.length + 
                             optimization.cost_optimizations.length,
          estimated_performance_gain: optimization.performance_improvements.reduce(
            (sum, imp) => sum + imp.estimated_gain, 0
          ),
          estimated_reliability_improvement: optimization.reliability_enhancements.reduce(
            (sum, enh) => sum + enh.risk_reduction, 0
          )
        }
      };
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Workflow optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
}

const universalOptimizationHandler = new UniversalOptimizationHandler();

/**
 * Setup AI workflow tools for MCP server registration
 */
export async function setupAIWorkflowTools(): Promise<ToolDefinition[]> {
  console.error('[setupAIWorkflowTools] Setting up Phase 2 Universal AI Agent Workflow Tools');
  
  const tools: ToolDefinition[] = [
    // Core AI workflow tools
    getCreateWorkflowFromDescriptionToolDefinition(),
    getAutoConnectWorkflowNodesToolDefinition(),
    getMapNodeParametersToolDefinition(),
    
    // Utility AI workflow tools
    getAnalyzeWorkflowIntentToolDefinition(),
    getOptimizeWorkflowUniversallyToolDefinition()
  ];
  
  console.error(`[setupAIWorkflowTools] Registered ${tools.length} AI workflow tools with Phase 1 Enhanced Discovery integration`);
  
  return tools;
}

/**
 * Get core AI workflow tools only (for minimal deployments)
 */
export async function setupCoreAIWorkflowTools(): Promise<ToolDefinition[]> {
  console.error('[setupCoreAIWorkflowTools] Setting up core AI workflow tools');
  
  return [
    getCreateWorkflowFromDescriptionToolDefinition(),
    getAutoConnectWorkflowNodesToolDefinition(),
    getMapNodeParametersToolDefinition()
  ];
}

/**
 * Get AI workflow tool handlers (for MCP server registration)
 */
export function getAIWorkflowHandlers() {
  return {
    'create_workflow_from_description': universalWorkflowCreator,
    'auto_connect_workflow_nodes': universalAutoConnector,
    'map_node_parameters': parameterMapperHandler,
    'analyze_workflow_intent': intentAnalysisHandler,
    'optimize_workflow_universally': universalOptimizationHandler
  };
}

/**
 * Export utility functions for direct use
 */
export { analyzeWorkflowIntent, discoverMatchingNodes, generateWorkflowStructure, optimizeForUniversalUse } from './create-intelligent.js';