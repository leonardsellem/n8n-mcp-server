/**
 * Integration Marketplace Tools Module
 * 
 * This module provides MCP tools for integration marketplace functionality.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { 
  BrowseIntegrationsHandler, 
  getBrowseIntegrationsToolDefinition 
} from './browse-integrations.js';
import { 
  InstallIntegrationHandler, 
  getInstallIntegrationToolDefinition 
} from './install-integration.js';
import { 
  TestIntegrationConnectivityHandler, 
  getTestIntegrationConnectivityToolDefinition 
} from './test-integration-connectivity.js';
import { 
  ManageApiKeysHandler, 
  getManageApiKeysToolDefinition 
} from './manage-api-keys.js';

// Export handlers
export {
  BrowseIntegrationsHandler,
  InstallIntegrationHandler,
  TestIntegrationConnectivityHandler,
  ManageApiKeysHandler,
};

/**
 * Set up integration marketplace tools
 *
 * @returns Array of integration tool definitions
 */
export async function setupIntegrationTools(): Promise<ToolDefinition[]> {
  return [
    getBrowseIntegrationsToolDefinition(),
    getInstallIntegrationToolDefinition(),
    getTestIntegrationConnectivityToolDefinition(),
    getManageApiKeysToolDefinition(),
  ];
}