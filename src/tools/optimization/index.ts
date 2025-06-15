/**
 * Workflow Optimization Tools Module
 * 
 * This module provides MCP tools for workflow optimization and performance improvement.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { 
  OptimizeWorkflowPerformanceHandler, 
  getOptimizeWorkflowPerformanceToolDefinition 
} from './optimize-workflow-performance.js';
import { 
  SuggestNodeAlternativesHandler, 
  getSuggestNodeAlternativesToolDefinition 
} from './suggest-node-alternatives.js';
import { 
  ConsolidateWorkflowsHandler, 
  getConsolidateWorkflowsToolDefinition 
} from './consolidate-workflows.js';
import { 
  IdentifyUnusedWorkflowsHandler, 
  getIdentifyUnusedWorkflowsToolDefinition 
} from './identify-unused-workflows.js';

// Export handlers
export {
  OptimizeWorkflowPerformanceHandler,
  SuggestNodeAlternativesHandler,
  ConsolidateWorkflowsHandler,
  IdentifyUnusedWorkflowsHandler,
};

/**
 * Set up workflow optimization tools
 *
 * @returns Array of optimization tool definitions
 */
export async function setupOptimizationTools(): Promise<ToolDefinition[]> {
  return [
    getOptimizeWorkflowPerformanceToolDefinition(),
    getSuggestNodeAlternativesToolDefinition(),
    getConsolidateWorkflowsToolDefinition(),
    getIdentifyUnusedWorkflowsToolDefinition(),
  ];
}