/**
 * Monitoring Tools Module
 * 
 * This module provides MCP tools for monitoring and analyzing n8n workflows.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { 
  MonitorWorkflowHealthHandler, 
  getMonitorWorkflowHealthToolDefinition 
} from './monitor-workflow-health.js';
import { 
  GetWorkflowPerformanceMetricsHandler, 
  getGetWorkflowPerformanceMetricsToolDefinition 
} from './get-workflow-performance-metrics.js';
import { 
  AlertOnWorkflowFailuresHandler, 
  getAlertOnWorkflowFailuresToolDefinition 
} from './alert-on-workflow-failures.js';
import { 
  GenerateWorkflowReportsHandler, 
  getGenerateWorkflowReportsToolDefinition 
} from './generate-workflow-reports.js';

// Export handlers
export {
  MonitorWorkflowHealthHandler,
  GetWorkflowPerformanceMetricsHandler,
  AlertOnWorkflowFailuresHandler,
  GenerateWorkflowReportsHandler,
};

/**
 * Set up workflow monitoring tools
 *
 * @returns Array of monitoring tool definitions
 */
export async function setupMonitoringTools(): Promise<ToolDefinition[]> {
  return [
    getMonitorWorkflowHealthToolDefinition(),
    getGetWorkflowPerformanceMetricsToolDefinition(),
    getAlertOnWorkflowFailuresToolDefinition(),
    getGenerateWorkflowReportsToolDefinition(),
  ];
}