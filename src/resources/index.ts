/**
 * Resources Module
 * 
 * This module provides MCP resource handlers for n8n workflows and executions.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { EnvConfig } from '../config/environment.js'; // Re-add EnvConfig import
import { createN8nApiClient, N8nApiClient } from '../api/n8n-client.js'; // Use correct factory import
import { McpError, ErrorCode } from '../errors/index.js';

// Import static resource handlers
import { 
  getWorkflowsResource,
  getWorkflowsResourceMetadata,
  getWorkflowsResourceUri,
} from './static/workflows.js';
import {
  getExecutionStatsResource,
  getExecutionStatsResourceMetadata,
  getExecutionStatsResourceUri,
} from './static/execution-stats.js';

// Import dynamic resource handlers
import {
  getWorkflowResource,
  getWorkflowResourceTemplateMetadata,
  getWorkflowResourceTemplateUri,
  extractWorkflowIdFromUri,
} from './dynamic/workflow.js';
import {
  getExecutionResource,
  getExecutionResourceTemplateMetadata,
  getExecutionResourceTemplateUri,
  extractExecutionIdFromUri,
} from './dynamic/execution.js';

/**
 * Set up resource handlers for the MCP server
 * 
 * @param server MCP server instance
 * @param envConfig Environment configuration
 */
// Revert function signature to accept EnvConfig
export function setupResourceHandlers(server: Server, envConfig: EnvConfig): void { 
  // Set up static resources
  setupStaticResources(server, envConfig); // Pass envConfig

  // Set up dynamic resources
  setupDynamicResources(server, envConfig); // Pass envConfig
}

/**
 * Set up static resource handlers
 * 
 * @param server MCP server instance
 * @param envConfig Environment configuration
 */
// Revert function signature to accept EnvConfig
function setupStaticResources(server: Server, envConfig: EnvConfig): void { 
  // Create apiClient internally for now
  const apiClient = createN8nApiClient(envConfig); // Use correct factory function
  
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    // Return all available static resources
    return {
      resources: [
        getWorkflowsResourceMetadata(),
        getExecutionStatsResourceMetadata(),
      ],
    };
  });
}

/**
 * Set up dynamic resource handlers
 * 
 * @param server MCP server instance
 * @param envConfig Environment configuration
 */
// Revert function signature to accept EnvConfig
function setupDynamicResources(server: Server, envConfig: EnvConfig): void { 
  // Create apiClient internally for now
  const apiClient = createN8nApiClient(envConfig); // Use correct factory function
  
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    // Return all available dynamic resource templates
    return {
      resourceTemplates: [
        getWorkflowResourceTemplateMetadata(),
        getExecutionResourceTemplateMetadata(),
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    console.log(`Resource requested: ${uri}`);
    
    try {
      // Handle static resources
      if (uri === getWorkflowsResourceUri()) {
        const content = await getWorkflowsResource(apiClient); // Use apiClient instance
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      }
      
      if (uri === getExecutionStatsResourceUri()) {
        const content = await getExecutionStatsResource(apiClient); // Use apiClient instance
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      }
      
      // Handle dynamic resources
      const workflowId = extractWorkflowIdFromUri(uri);
      if (workflowId) {
        const content = await getWorkflowResource(apiClient, workflowId); // Use apiClient instance
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      }
      
      const executionId = extractExecutionIdFromUri(uri);
      if (executionId) {
        const content = await getExecutionResource(apiClient, executionId); // Use apiClient instance
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      }
      
      // If we get here, the URI isn't recognized
      throw new McpError(
        ErrorCode.NotFoundError,
        `Resource not found: ${uri}`
      );
    } catch (error) {
      console.error(`Error retrieving resource (${uri}):`, error);
      
      // Pass through McpErrors
      if (error instanceof McpError) {
        throw error;
      }
      
      // Convert other errors to McpError
      throw new McpError(
        ErrorCode.InternalError,
        `Error retrieving resource: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });
}
