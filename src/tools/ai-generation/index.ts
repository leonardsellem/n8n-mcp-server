/**
 * AI-Powered Workflow Generation Tools Module
 * 
 * This module provides MCP tools for AI-powered workflow creation and optimization.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { getGenerateWorkflowFromDescriptionToolDefinition, GenerateWorkflowFromDescriptionHandler } from './generate-workflow.js';
import { getSuggestWorkflowImprovementsToolDefinition, SuggestWorkflowImprovementsHandler } from './suggest-improvements.js';
import { getAutoConnectNodesToolDefinition, AutoConnectNodesHandler } from './auto-connect-nodes.js';
import { getExplainWorkflowToolDefinition, ExplainWorkflowHandler } from './explain-workflow.js';

// Export handlers
export {
  GenerateWorkflowFromDescriptionHandler,
  SuggestWorkflowImprovementsHandler,
  AutoConnectNodesHandler,
  ExplainWorkflowHandler,
};

/**
 * Set up AI-powered workflow generation tools
 *
 * @returns Array of AI generation tool definitions
 */
export async function setupAIGenerationTools(): Promise<ToolDefinition[]> {
  return [
    getGenerateWorkflowFromDescriptionToolDefinition(),
    getSuggestWorkflowImprovementsToolDefinition(),
    getAutoConnectNodesToolDefinition(),
    getExplainWorkflowToolDefinition(),
  ];
}