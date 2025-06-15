/**
 * Documentation & Knowledge Management Tools Module
 * 
 * This module provides MCP tools for workflow documentation and knowledge management.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { 
  GenerateWorkflowDocumentationHandler, 
  getGenerateWorkflowDocumentationToolDefinition 
} from './generate-workflow-documentation.js';
import { 
  CreateWorkflowDiagramHandler, 
  getCreateWorkflowDiagramToolDefinition 
} from './create-workflow-diagram.js';
import { 
  ExportWorkflowKnowledgeBaseHandler, 
  getExportWorkflowKnowledgeBaseToolDefinition 
} from './export-workflow-knowledge-base.js';
import { 
  WorkflowBestPracticesHandler, 
  getWorkflowBestPracticesToolDefinition 
} from './workflow-best-practices.js';

// Export handlers
export {
  GenerateWorkflowDocumentationHandler,
  CreateWorkflowDiagramHandler,
  ExportWorkflowKnowledgeBaseHandler,
  WorkflowBestPracticesHandler,
};

/**
 * Set up documentation and knowledge management tools
 *
 * @returns Array of documentation tool definitions
 */
export async function setupDocumentationTools(): Promise<ToolDefinition[]> {
  return [
    getGenerateWorkflowDocumentationToolDefinition(),
    getCreateWorkflowDiagramToolDefinition(),
    getExportWorkflowKnowledgeBaseToolDefinition(),
    getWorkflowBestPracticesToolDefinition(),
  ];
}