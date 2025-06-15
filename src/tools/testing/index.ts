/**
 * Testing Tools Module
 * 
 * This module provides MCP tools for testing and validating n8n workflows.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { 
  TestWorkflowWithSampleDataHandler, 
  getTestWorkflowWithSampleDataToolDefinition 
} from './test-workflow-with-sample-data.js';
import { 
  ValidateWorkflowPerformanceHandler, 
  getValidateWorkflowPerformanceToolDefinition 
} from './validate-workflow-performance.js';
import { 
  SimulateWorkflowExecutionHandler, 
  getSimulateWorkflowExecutionToolDefinition 
} from './simulate-workflow-execution.js';
import { 
  GenerateTestDataHandler, 
  getGenerateTestDataToolDefinition 
} from './generate-test-data.js';

// Export handlers
export {
  TestWorkflowWithSampleDataHandler,
  ValidateWorkflowPerformanceHandler,
  SimulateWorkflowExecutionHandler,
  GenerateTestDataHandler,
};

/**
 * Set up workflow testing tools
 *
 * @returns Array of testing tool definitions
 */
export async function setupTestingTools(): Promise<ToolDefinition[]> {
  return [
    getTestWorkflowWithSampleDataToolDefinition(),
    getValidateWorkflowPerformanceToolDefinition(),
    getSimulateWorkflowExecutionToolDefinition(),
    getGenerateTestDataToolDefinition(),
  ];
}