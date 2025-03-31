/**
 * Base Execution Tool Handler
 * 
 * This module provides a base handler for execution-related tools.
 */

import { ToolCallResult, BaseToolHandler } from '../../types/index.js'; // Already has .js
import { N8nApiError } from '../../errors/index.js'; // Already has .js
import { N8nApiService } from '../../api/n8n-client.js'; // Already has .js

/**
 * Base class for execution tool handlers
 */
export abstract class BaseExecutionToolHandler implements BaseToolHandler { // Implement BaseToolHandler
  protected apiService: N8nApiService; // Declare apiService property

  /**
   * Constructor to inject the API service
   * @param apiService Instance of N8nApiService
   */
  constructor(apiService: N8nApiService) {
    this.apiService = apiService;
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    const formattedData = typeof data === 'object' 
      ? JSON.stringify(data, null, 2)
      : String(data);
      
    return {
      content: [
        {
          type: 'text',
          text: message ? `${message}\n\n${formattedData}` : formattedData,
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing execution tool: ${errorMessage}`);
    }
  }
}
