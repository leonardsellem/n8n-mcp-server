/**
 * Base Execution Tool Handler
 * 
 * This module provides a base handler for execution-related tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base class for execution tool handlers
 */
export abstract class BaseExecutionToolHandler {
  protected apiService = createApiService(getEnvConfig());
  
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
    // Return structured data directly without string formatting to ensure valid JSON
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
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
   * Convert execution ID to numeric format
   *
   * @param id Execution ID as string or number
   * @returns Numeric execution ID
   * @throws Error if ID format is invalid
   */
  protected convertToNumericId(id: string | number): number {
    // If already a number, return it
    if (typeof id === 'number') {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(`Invalid execution ID: ${id}. Must be a positive integer.`);
      }
      return id;
    }
    
    // If string, try to convert
    if (typeof id === 'string') {
      // Handle empty or whitespace-only strings
      const trimmedId = id.trim();
      if (!trimmedId) {
        throw new Error('Execution ID cannot be empty.');
      }
      
      // Try to parse as integer
      const numericId = parseInt(trimmedId, 10);
      
      // Check if parsing was successful and the entire string was numeric
      if (isNaN(numericId) || numericId.toString() !== trimmedId) {
        // Try to extract numeric parts from mixed string IDs
        const extractedNumber = trimmedId.match(/^\d+/);
        if (extractedNumber) {
          const extractedId = parseInt(extractedNumber[0], 10);
          if (extractedId > 0) {
            return extractedId;
          }
        }
        throw new Error(`Invalid execution ID format: "${id}". Expected a numeric ID or string containing numbers.`);
      }
      
      if (numericId <= 0) {
        throw new Error(`Invalid execution ID: ${numericId}. Must be a positive integer.`);
      }
      
      return numericId;
    }
    
    throw new Error(`Invalid execution ID type: ${typeof id}. Expected string or number.`);
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
