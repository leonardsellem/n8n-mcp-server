/**
 * Integration Marketplace Base Handler
 *
 * Base class for all integration marketplace tool handlers.
 */

import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { ToolCallResult } from '../../types/index.js';
import { getEnvConfig } from '../../config/environment.js';

export abstract class IntegrationBaseHandler extends BaseWorkflowToolHandler {
  protected client: EnhancedN8nApiClient;

  constructor() {
    super();
    const config = getEnvConfig();
    this.client = new EnhancedN8nApiClient(config);
  }

  /**
   * Validate integration parameters
   */
  protected validateIntegrationParams(params: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }

  /**
   * Handle integration API errors
   */
  protected handleIntegrationError(error: any, operation: string): ToolCallResult {
    console.error(`Integration ${operation} error:`, error);
    return {
      content: [{
        type: 'text',
        text: `Integration ${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    };
  }

  /**
   * Format integration response
   */
  protected formatIntegrationResponse(data: any, message: string): ToolCallResult {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString()
        }, null, 2)
      }],
      isError: false
    };
  }
}