/**
 * Workflow Template Tools Module
 *
 * This module provides MCP tools for browsing n8n.io templates and creating workflows from them.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { getListWorkflowTemplatesToolDefinition, ListWorkflowTemplatesHandler } from './list-templates.js';
import { getCreateWorkflowFromTemplateToolDefinition, CreateWorkflowFromTemplateHandler } from './create-from-template.js';
import { getCustomizeTemplateToolDefinition, CustomizeTemplateHandler } from './customize-template.js';

// Export handlers
export {
  ListWorkflowTemplatesHandler,
  CreateWorkflowFromTemplateHandler,
  CustomizeTemplateHandler,
};

/**
 * Set up workflow template tools
 *
 * @returns Array of template tool definitions
 */
export async function setupTemplateTools(): Promise<ToolDefinition[]> {
  return [
    getListWorkflowTemplatesToolDefinition(),
    getCreateWorkflowFromTemplateToolDefinition(),
    getCustomizeTemplateToolDefinition(),
  ];
}