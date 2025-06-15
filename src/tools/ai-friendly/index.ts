/**
 * AI-Friendly Tools Module
 * 
 * This module provides tools designed specifically to help AI models
 * use the n8n MCP server more effectively without cognitive overload.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool discovery & organization tools
import {
  getListToolCategoriesToolDefinition,
  getGetToolRecommendationsToolDefinition,
  getSearchToolsToolDefinition,
  getGetToolUsageExamplesToolDefinition,
  getExplainToolRelationshipsToolDefinition,
  ListToolCategoriesHandler,
  GetToolRecommendationsHandler,
  SearchToolsHandler,
  GetToolUsageExamplesHandler,
  ExplainToolRelationshipsHandler,
} from './discovery/index.js';

// Import lightweight data access tools
import {
  getGetWorkflowSummaryToolDefinition,
  getGetLightweightWorkflowListToolDefinition,
  getGetWorkflowQuickStatsToolDefinition,
  getCheckWorkflowStatusToolDefinition,
  getGetEssentialNodeInfoToolDefinition,
  GetWorkflowSummaryHandler,
  GetLightweightWorkflowListHandler,
  GetWorkflowQuickStatsHandler,
  CheckWorkflowStatusHandler,
  GetEssentialNodeInfoHandler,
} from './lightweight/index.js';

// Import AI context management tools
import {
  getSaveWorkflowContextToolDefinition,
  getRestoreWorkflowContextToolDefinition,
  getBookmarkWorkflowsToolDefinition,
  getGetWorkflowRelationshipsToolDefinition,
  SaveWorkflowContextHandler,
  RestoreWorkflowContextHandler,
  BookmarkWorkflowsHandler,
  GetWorkflowRelationshipsHandler,
} from './context/index.js';

// Import batch & efficiency operations tools
import {
  getBatchWorkflowStatusToolDefinition,
  getBatchWorkflowMetadataToolDefinition,
  getQuickWorkflowValidationToolDefinition,
  getGetWorkflowDependenciesToolDefinition,
  BatchWorkflowStatusHandler,
  BatchWorkflowMetadataHandler,
  QuickWorkflowValidationHandler,
  GetWorkflowDependenciesHandler,
} from './batch/index.js';

// Import AI-friendly output format tools
import {
  getGetStructuredWorkflowDataToolDefinition,
  getExportWorkflowSchemaToolDefinition,
  getSimplifyWorkflowOutputToolDefinition,
  getGetWorkflowEssenceToolDefinition,
  GetStructuredWorkflowDataHandler,
  ExportWorkflowSchemaHandler,
  SimplifyWorkflowOutputHandler,
  GetWorkflowEssenceHandler,
} from './output/index.js';

// Export all handlers
export {
  // Tool Discovery & Organization
  ListToolCategoriesHandler,
  GetToolRecommendationsHandler,
  SearchToolsHandler,
  GetToolUsageExamplesHandler,
  ExplainToolRelationshipsHandler,
  
  // Lightweight Data Access
  GetWorkflowSummaryHandler,
  GetLightweightWorkflowListHandler,
  GetWorkflowQuickStatsHandler,
  CheckWorkflowStatusHandler,
  GetEssentialNodeInfoHandler,
  
  // AI Context Management
  SaveWorkflowContextHandler,
  RestoreWorkflowContextHandler,
  BookmarkWorkflowsHandler,
  GetWorkflowRelationshipsHandler,
  
  // Batch & Efficiency Operations
  BatchWorkflowStatusHandler,
  BatchWorkflowMetadataHandler,
  QuickWorkflowValidationHandler,
  GetWorkflowDependenciesHandler,
  
  // AI-Friendly Output Formats
  GetStructuredWorkflowDataHandler,
  ExportWorkflowSchemaHandler,
  SimplifyWorkflowOutputHandler,
  GetWorkflowEssenceHandler,
};

/**
 * Set up AI-friendly efficiency tools
 *
 * @returns Array of AI-friendly tool definitions
 */
export async function setupAIFriendlyTools(): Promise<ToolDefinition[]> {
  return [
    // Tool Discovery & Organization (5 tools)
    getListToolCategoriesToolDefinition(),
    getGetToolRecommendationsToolDefinition(),
    getSearchToolsToolDefinition(),
    getGetToolUsageExamplesToolDefinition(),
    getExplainToolRelationshipsToolDefinition(),
    
    // Lightweight Data Access (5 tools)
    getGetWorkflowSummaryToolDefinition(),
    getGetLightweightWorkflowListToolDefinition(),
    getGetWorkflowQuickStatsToolDefinition(),
    getCheckWorkflowStatusToolDefinition(),
    getGetEssentialNodeInfoToolDefinition(),
    
    // AI Context Management (4 tools)
    getSaveWorkflowContextToolDefinition(),
    getRestoreWorkflowContextToolDefinition(),
    getBookmarkWorkflowsToolDefinition(),
    getGetWorkflowRelationshipsToolDefinition(),
    
    // Batch & Efficiency Operations (4 tools)
    getBatchWorkflowStatusToolDefinition(),
    getBatchWorkflowMetadataToolDefinition(),
    getQuickWorkflowValidationToolDefinition(),
    getGetWorkflowDependenciesToolDefinition(),
    
    // AI-Friendly Output Formats (4 tools)
    getGetStructuredWorkflowDataToolDefinition(),
    getExportWorkflowSchemaToolDefinition(),
    getSimplifyWorkflowOutputToolDefinition(),
    getGetWorkflowEssenceToolDefinition(),
  ];
}