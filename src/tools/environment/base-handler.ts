/**
 * Base Environment Tool Handler
 *
 * This module provides a base handler for environment-related tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { EnvConfig } from '../../config/environment.js';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  name: string;
  url: string;
  apiKey: string;
  type: 'development' | 'staging' | 'production';
  description?: string;
}

/**
 * Base class for environment tool handlers
 */
export abstract class BaseEnvironmentToolHandler {
  protected environments: Map<string, EnvironmentConfig>;
  
  constructor() {
    this.environments = new Map();
    this.loadEnvironments();
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
        
      return this.formatError(`Error executing environment tool: ${errorMessage}`);
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
   * Get API client for environment
   */
  protected getApiClientForEnvironment(environmentName: string): EnhancedN8nApiClient {
    const env = this.environments.get(environmentName);
    if (!env) {
      throw new Error(`Environment "${environmentName}" not found`);
    }

    const config: EnvConfig = {
      n8nApiUrl: env.url,
      n8nApiKey: env.apiKey,
      debug: false
    };

    return new EnhancedN8nApiClient(config);
  }

  /**
   * Load environments from configuration
   */
  private loadEnvironments(): void {
    // In a real implementation, this would load from a configuration file or environment variables
    // For now, we'll set up some default environments
    
    const defaultEnvironments: EnvironmentConfig[] = [
      {
        name: 'development',
        url: process.env.N8N_DEV_API_URL || 'http://localhost:5678/api/v1',
        apiKey: process.env.N8N_DEV_API_KEY || '',
        type: 'development',
        description: 'Development environment for testing'
      },
      {
        name: 'staging',
        url: process.env.N8N_STAGING_API_URL || 'https://staging-n8n.example.com/api/v1',
        apiKey: process.env.N8N_STAGING_API_KEY || '',
        type: 'staging',
        description: 'Staging environment for pre-production testing'
      },
      {
        name: 'production',
        url: process.env.N8N_PROD_API_URL || 'https://n8n.example.com/api/v1',
        apiKey: process.env.N8N_PROD_API_KEY || '',
        type: 'production',
        description: 'Production environment'
      }
    ];

    defaultEnvironments.forEach(env => {
      if (env.apiKey) { // Only add environments with API keys
        this.environments.set(env.name, env);
      }
    });
  }

  /**
   * Get all configured environments
   */
  protected getAllEnvironments(): EnvironmentConfig[] {
    return Array.from(this.environments.values());
  }

  /**
   * Get environment by name
   */
  protected getEnvironment(name: string): EnvironmentConfig | undefined {
    return this.environments.get(name);
  }

  /**
   * Test connectivity to an environment
   */
  protected async testEnvironmentConnection(environmentName: string): Promise<boolean> {
    try {
      const apiClient = this.getApiClientForEnvironment(environmentName);
      await apiClient.checkConnectivity();
      return true;
    } catch (error) {
      return false;
    }
  }
}