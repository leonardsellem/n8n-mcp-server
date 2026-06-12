/**
 * Run Execution via Webhook Tool Handler
 * 
 * This module provides a tool for running n8n workflows via webhooks.
 */

import axios from 'axios';
import { z } from 'zod';
import { ToolCallResult } from '../../types/index.js';
import { BaseExecutionToolHandler } from './base-handler.js';
import { N8nApiError } from '../../errors/index.js';
import { getEnvConfig } from '../../config/environment.js';
import { URL } from 'url';

/**
 * Webhook execution input schema
 */
const runWebhookSchema = z.object({
  workflowName: z.string().describe('Name of the workflow to execute (e.g., "hello-world")'),
  data: z.record(z.any()).optional().describe('Input data to pass to the webhook'),
  headers: z.record(z.string()).optional().describe('Additional headers to send with the request')
});

/**
 * Handler for the run_webhook tool
 */
export class RunWebhookHandler extends BaseExecutionToolHandler {
  /**
   * Tool definition for execution via webhook
   */
  public static readonly inputSchema = runWebhookSchema;

  /**
   * Extract N8N base URL from N8N API URL by removing /api/v1
   * @returns N8N base URL
   */
  private getN8nBaseUrl(): string {
    const config = getEnvConfig();
    const apiUrl = new URL(config.n8nApiUrl);
    
    // Remove /api/v1 if it exists in the path
    let path = apiUrl.pathname;
    if (path.endsWith('/api/v1') || path.endsWith('/api/v1/')) {
      path = path.replace(/\/api\/v1\/?$/, '');
    }
    
    // Create a new URL with the base path
    apiUrl.pathname = path;
    return apiUrl.toString();
  }

  /**
   * Validate and execute webhook call
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      // Parse and validate arguments
      const params = runWebhookSchema.parse(args);
      
      // Get environment config for auth credentials
      const config = getEnvConfig();

      try {
        // Get the webhook URL with the proper prefix
        const baseUrl = this.getN8nBaseUrl();
        const webhookPath = `webhook/${params.workflowName}`;
        const webhookUrl = new URL(webhookPath, baseUrl).toString();

        // Prepare request config – basic auth is optional
        const requestConfig: any = {
          headers: {
            'Content-Type': 'application/json',
            ...(params.headers || {})
          },
          validateStatus: () => true,
        };
        if (config.n8nWebhookUsername && config.n8nWebhookPassword) {
          requestConfig.auth = {
            username: config.n8nWebhookUsername,
            password: config.n8nWebhookPassword,
          };
        }

        // Make the request to the webhook
        const response = await axios.post(
          webhookUrl,
          params.data || {},
          requestConfig
        );

        // Return the webhook response
        return this.formatSuccess({
          status: response.status,
          statusText: response.statusText,
          data: response.data
        }, 'Webhook executed successfully');
      } catch (error) {
        // Handle error from the webhook request
        if (axios.isAxiosError(error)) {
          let errorMessage = `Webhook execution failed: ${error.message}`;
          
          if (error.response) {
            errorMessage = `Webhook execution failed with status ${error.response.status}: ${error.response.statusText}`;
            if (error.response.data) {
              return this.formatError(new N8nApiError(
                `${errorMessage}\n\n${JSON.stringify(error.response.data, null, 2)}`,
                error.response.status
              ));
            }
          }
          
          return this.formatError(new N8nApiError(errorMessage, error.response?.status || 500));
        }
        
        throw error; // Re-throw non-axios errors for the handler to catch
      }
    }, args);
  }
}

/**
 * Get the tool definition for run_webhook
 * 
 * @returns Tool definition object
 */
export function getRunWebhookToolDefinition() {
  return {
    name: 'run_webhook',
    description: 'Execute a workflow via webhook with optional input data',
    inputSchema: {
      type: 'object',
      properties: {
        workflowName: {
          type: 'string',
          description: 'Name of the workflow to execute (e.g., "hello-world")'
        },
        data: {
          type: 'object',
          description: 'Input data to pass to the webhook'
        },
        headers: {
          type: 'object',
          description: 'Additional headers to send with the request'
        }
      },
      required: ['workflowName']
    }
  };
}