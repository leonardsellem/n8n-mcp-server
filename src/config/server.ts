/**
 * Server Configuration
 * 
 * This module configures the MCP server with tools and resources
 * for n8n workflow management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { getEnvConfig } from './environment.js';
import { setupWorkflowTools } from '../tools/workflow/index.js';
import { setupExecutionTools } from '../tools/execution/index.js';
import { setupResourceHandlers } from '../resources/index.js';
import { createApiService } from '../api/n8n-client.js';

// Import types
import { ToolCallResult } from '../types/index.js';

/**
 * Configure and return an MCP server instance with all tools and resources
 * 
 * @returns Configured MCP server instance
 */
export async function configureServer(): Promise<Server> {
  // Get validated environment configuration
  const envConfig = getEnvConfig();
  
  // Create n8n API service
  const apiService = createApiService(envConfig);
  
  // Verify n8n API connectivity
  try {
    console.error('Verifying n8n API connectivity...');
    await apiService.checkConnectivity();
    console.error(`Successfully connected to n8n API at ${envConfig.n8nApiUrl}`);
  } catch (error) {
    console.error('ERROR: Failed to connect to n8n API:', error instanceof Error ? error.message : error);
    throw error;
  }

  // Create server instance
  const server = new Server(
    {
      name: 'n8n-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Set up all request handlers
  setupToolListRequestHandler(server);
  setupToolCallRequestHandler(server);
  setupResourceHandlers(server, envConfig);

  return server;
}

/**
 * Set up the tool list request handler for the server
 * 
 * @param server MCP server instance
 */
function setupToolListRequestHandler(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Combine tools from workflow and execution modules
    const workflowTools = await setupWorkflowTools();
    const executionTools = await setupExecutionTools();

    return {
      tools: [...workflowTools, ...executionTools],
    };
  });
}

/**
 * Set up the tool call request handler for the server
 * 
 * @param server MCP server instance
 */
function setupToolCallRequestHandler(server: Server): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};

    let result: ToolCallResult;

    try {
      // Handle "prompts/list" as a special case, returning an empty success response
      // This is to address client calls for a method not central to n8n-mcp-server's direct n8n integration.
      if (toolName === 'prompts/list') {
        return {
          content: [{ type: 'text', text: 'Prompts list acknowledged.' }], // Or an empty array: content: []
          isError: false,
        };
      }

      // Import handlers
      const {
        ListWorkflowsHandler,
        GetWorkflowHandler,
        CreateWorkflowHandler,
        UpdateWorkflowHandler,
        DeleteWorkflowHandler,
        ActivateWorkflowHandler,
        DeactivateWorkflowHandler,
        // New enhanced handlers
        SearchWorkflowsHandler,
        CloneWorkflowHandler,
        HealthCheckHandler
      } = await import('../tools/workflow/index.js');

      const {
        ListExecutionsHandler,
        GetExecutionHandler,
        DeleteExecutionHandler,
        RunWebhookHandler,
        // New enhanced handlers
        ExecuteWorkflowHandler,
        GetExecutionDetailsHandler
      } = await import('../tools/execution/index.js');

      // Route the tool call to the appropriate handler
      if (toolName === 'list_workflows') {
        const handler = new ListWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_workflow') {
        const handler = new GetWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow') {
        const handler = new CreateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'update_workflow') {
        const handler = new UpdateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_workflow') {
        const handler = new DeleteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'activate_workflow') {
        const handler = new ActivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'deactivate_workflow') {
        const handler = new DeactivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'search_workflows') {
        const handler = new SearchWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'clone_workflow') {
        const handler = new CloneWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'health_check') {
        const handler = new HealthCheckHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_executions') {
        const handler = new ListExecutionsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_execution') {
        const handler = new GetExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_execution') {
        const handler = new DeleteExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'run_webhook') {
        const handler = new RunWebhookHandler();
        result = await handler.execute(args);
      } else if (toolName === 'execute_workflow') {
        const handler = new ExecuteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_execution_details') {
        const handler = new GetExecutionDetailsHandler();
        result = await handler.execute(args);
      } else {
        throw new Error(`Unknown tool: ${toolName}. Available tools: list_workflows, get_workflow, create_workflow, update_workflow, delete_workflow, activate_workflow, deactivate_workflow, search_workflows, clone_workflow, health_check, list_executions, get_execution, delete_execution, run_webhook, execute_workflow, get_execution_details`);
      }

      // Converting to MCP SDK expected format
      return {
        content: result.content,
        isError: result.isError,
      };
    } catch (error) {
      console.error(`Error handling tool call to ${toolName}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });
}
