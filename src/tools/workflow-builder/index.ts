/**
 * Workflow Builder Tools
 * Tools for building and constructing workflows programmatically
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Import workflow JSON helper
import './workflow-json-helper.js';

/**
 * Setup function for workflow builder tools
 * Currently exports the workflow JSON helper functionality
 */
export function setupWorkflowBuilderTools(): Tool[] {
  return [
    // Workflow builder tools would be defined here
    // Currently just a placeholder as the actual tools are in workflow-json-helper.ts
  ];
}

// Export for compatibility
export default setupWorkflowBuilderTools;
