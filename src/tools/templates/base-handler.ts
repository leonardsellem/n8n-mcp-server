/**
 * Base Template Tool Handler
 *
 * This module provides a base handler for browsing n8n.io templates and creating workflows from them.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Template interface for built-in templates
 */
export interface StoredTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required?: boolean;
    defaultValue?: string;
  }>;
  workflow: {
    name: string;
    nodes: any[];
    connections: any;
    settings?: any;
    staticData?: any;
  };
}

/**
 * Base class for template tool handlers
 */
export abstract class BaseTemplateToolHandler {
  protected apiService: EnhancedN8nApiClient;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
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
        
      return this.formatError(`Error executing template tool: ${errorMessage}`);
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
   * Get built-in workflow templates
   */
  protected getBuiltInTemplates(): StoredTemplate[] {
    return [
      {
        id: 'webhook-email-notification',
        name: 'Webhook to Email Notification',
        description: 'Receive webhook data and send email notifications',
        category: 'communication',
        tags: ['webhook', 'email', 'notification'],
        version: '1.0.0',
        author: 'n8n Team',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        parameters: [
          { name: 'emailRecipient', type: 'string', description: 'Email recipient address' },
          { name: 'emailSubject', type: 'string', description: 'Email subject line' }
        ],
        workflow: {
          name: 'Webhook to Email',
          nodes: [
            {
              id: 'webhook',
              type: 'n8n-nodes-base.webhook',
              name: 'Webhook',
              parameters: {
                path: 'webhook-data',
                httpMethod: 'POST'
              },
              position: [240, 300]
            },
            {
              id: 'email',
              type: 'n8n-nodes-base.emailSend',
              name: 'Send Email',
              parameters: {
                subject: '{{emailSubject}}',
                text: '={{ JSON.stringify($json, null, 2) }}',
                toEmail: '{{emailRecipient}}'
              },
              position: [460, 300]
            }
          ],
          connections: {
            'Webhook': {
              main: [
                [
                  {
                    node: 'Send Email',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        }
      },
      {
        id: 'data-sync-api',
        name: 'Data Sync Between APIs',
        description: 'Synchronize data between two API endpoints',
        category: 'integration',
        tags: ['api', 'sync', 'data'],
        version: '1.0.0',
        author: 'n8n Team',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        parameters: [
          { name: 'sourceApiUrl', type: 'string', description: 'Source API endpoint URL' },
          { name: 'targetApiUrl', type: 'string', description: 'Target API endpoint URL' },
          { name: 'syncInterval', type: 'number', description: 'Sync interval in minutes' }
        ],
        workflow: {
          name: 'Data Sync',
          nodes: [
            {
              id: 'schedule',
              type: 'n8n-nodes-base.scheduleTrigger',
              name: 'Schedule Trigger',
              parameters: {
                rule: {
                  interval: [
                    {
                      field: 'minutes',
                      minutesInterval: '{{syncInterval}}'
                    }
                  ]
                }
              },
              position: [240, 300]
            },
            {
              id: 'httpRequest1',
              type: 'n8n-nodes-base.httpRequest',
              name: 'Get Source Data',
              parameters: {
                url: '{{sourceApiUrl}}',
                method: 'GET'
              },
              position: [460, 300]
            },
            {
              id: 'httpRequest2',
              type: 'n8n-nodes-base.httpRequest',
              name: 'Send to Target',
              parameters: {
                url: '{{targetApiUrl}}',
                method: 'POST',
                body: {
                  mode: 'json',
                  json: '={{ $json }}'
                }
              },
              position: [680, 300]
            }
          ],
          connections: {
            'Schedule Trigger': {
              main: [
                [
                  {
                    node: 'Get Source Data',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            },
            'Get Source Data': {
              main: [
                [
                  {
                    node: 'Send to Target',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        }
      },
      {
        id: 'file-processor',
        name: 'File Processing Pipeline',
        description: 'Process uploaded files with validation and transformation',
        category: 'data-processing',
        tags: ['files', 'processing', 'validation'],
        version: '1.0.0',
        author: 'n8n Team',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        parameters: [
          { name: 'inputFolder', type: 'string', description: 'Input folder path' },
          { name: 'outputFolder', type: 'string', description: 'Output folder path' },
          { name: 'allowedFileTypes', type: 'array', description: 'Allowed file extensions' }
        ],
        workflow: {
          name: 'File Processor',
          nodes: [
            {
              id: 'watchFolder',
              type: 'n8n-nodes-base.localFileTrigger',
              name: 'Watch Folder',
              parameters: {
                path: '/input',
                triggerOn: 'fileAdded'
              },
              position: [240, 300]
            },
            {
              id: 'validate',
              type: 'n8n-nodes-base.function',
              name: 'Validate File',
              parameters: {
                functionCode: `
                  const allowedTypes = ['.pdf', '.txt', '.csv'];
                  const filePath = $input.first().json.path;
                  const fileExtension = path.extname(filePath);
                  
                  if (!allowedTypes.includes(fileExtension)) {
                    throw new Error('File type not allowed');
                  }
                  
                  return $input.all();
                `
              },
              position: [460, 300]
            },
            {
              id: 'process',
              type: 'n8n-nodes-base.function',
              name: 'Process File',
              parameters: {
                functionCode: `
                  // File processing logic here
                  return $input.all();
                `
              },
              position: [680, 300]
            }
          ],
          connections: {
            'Watch Folder': {
              main: [
                [
                  {
                    node: 'Validate File',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            },
            'Validate File': {
              main: [
                [
                  {
                    node: 'Process File',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        }
      }
    ];
  }
}