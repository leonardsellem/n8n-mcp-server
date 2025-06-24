/**
 * Base Credentials Tool Handler
 *
 * This module provides a base handler for credentials-related tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { SimpleN8nClient, n8nClient } from '../../api/simple-n8n-client.js';

/**
 * Base class for credentials tool handlers
 */
export abstract class BaseCredentialsToolHandler {
  protected apiClient: SimpleN8nClient;
  
  constructor() {
    // Use the default simple n8n client
    this.apiClient = n8nClient;
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
        
      return this.formatError(`Error executing credentials tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   * 
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }
  
  /**
   * Sanitize credential data for safe response
   * Remove sensitive information from credential objects
   * 
   * @param credential Credential object to sanitize
   * @returns Sanitized credential object
   */
  protected sanitizeCredential(credential: any): any {
    if (!credential) return credential;
    
    const { data, ...safeCredential } = credential;
    return {
      ...safeCredential,
      // Deliberately exclude 'data' field which contains sensitive information
    };
  }
  
  /**
   * Sanitize multiple credentials
   * 
   * @param credentials Array of credentials to sanitize
   * @returns Array of sanitized credentials
   */
  protected sanitizeCredentials(credentials: any[]): any[] {
    return credentials.map(cred => this.sanitizeCredential(cred));
  }
}
