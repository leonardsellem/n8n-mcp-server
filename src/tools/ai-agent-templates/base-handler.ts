/**
 * Base AI Agent Templates Tool Handler
 *
 * This module provides a base handler for AI agent template tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Interface for AI agent workflow template
 */
export interface AIAgentTemplate {
  id: string;
  name: string;
  category: string;
  complexity: string;
  description: string;
  use_cases: string[];
  execution_mode: string[];
  ai_optimization_level: string;
  workflow_definition: any;
  metadata: {
    estimated_execution_time: number;
    resource_requirements: string;
    error_handling_level: string;
    retry_capability: boolean;
    timeout_handling: boolean;
    monitoring_included: boolean;
    documentation_url?: string;
    example_inputs: any[];
    expected_outputs: any[];
  };
  tags: string[];
  created_date: string;
  last_updated: string;
}

/**
 * Interface for AI optimization settings
 */
export interface AIOptimizationSettings {
  timeout_handling: boolean;
  retry_logic: boolean;
  error_recovery: boolean;
  data_validation: boolean;
  logging_level: string;
  performance_monitoring: boolean;
}

/**
 * Interface for execution settings
 */
export interface ExecutionSettings {
  max_execution_time: number;
  retry_attempts: number;
  retry_delay: number;
  concurrent_executions: number;
  queue_priority: string;
}

/**
 * Base class for AI agent template tool handlers
 */
export abstract class BaseAIAgentTemplateHandler {
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
   * Get all available AI agent templates
   */
  protected getAIAgentTemplates(): AIAgentTemplate[] {
    return [
      // Data Processing Templates
      {
        id: 'data_etl_pipeline',
        name: 'AI Data ETL Pipeline',
        category: 'data_processing',
        complexity: 'intermediate',
        description: 'Extract, transform, and load data with AI-optimized error handling and validation',
        use_cases: ['Data migration', 'API data synchronization', 'Data cleaning automation'],
        execution_mode: ['triggered', 'scheduled'],
        ai_optimization_level: 'enhanced',
        workflow_definition: this.createDataETLWorkflow(),
        metadata: {
          estimated_execution_time: 120,
          resource_requirements: 'medium',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ source: 'api', format: 'json', batch_size: 100 }],
          expected_outputs: [{ status: 'success', processed_count: 100, errors: [] }]
        },
        tags: ['data', 'etl', 'automation', 'ai-optimized'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      {
        id: 'csv_processor',
        name: 'CSV Data Processor',
        category: 'data_processing',
        complexity: 'simple',
        description: 'Process CSV files with validation, transformation, and error reporting',
        use_cases: ['File imports', 'Data validation', 'Batch processing'],
        execution_mode: ['manual', 'triggered'],
        ai_optimization_level: 'basic',
        workflow_definition: this.createCSVProcessorWorkflow(),
        metadata: {
          estimated_execution_time: 60,
          resource_requirements: 'low',
          error_handling_level: 'standard',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: false,
          example_inputs: [{ file_path: '/data/input.csv', delimiter: ',' }],
          expected_outputs: [{ processed_rows: 1000, validation_errors: 2 }]
        },
        tags: ['csv', 'file-processing', 'validation'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // API Integration Templates
      {
        id: 'api_orchestrator',
        name: 'Multi-API Orchestrator',
        category: 'api_integration',
        complexity: 'advanced',
        description: 'Orchestrate multiple API calls with dependency management and error recovery',
        use_cases: ['Service integration', 'Data aggregation', 'Workflow automation'],
        execution_mode: ['webhook', 'triggered', 'scheduled'],
        ai_optimization_level: 'advanced',
        workflow_definition: this.createAPIOrchestrationWorkflow(),
        metadata: {
          estimated_execution_time: 180,
          resource_requirements: 'medium',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ apis: ['service1', 'service2'], parameters: {} }],
          expected_outputs: [{ results: {}, execution_time: 45, success_rate: 100 }]
        },
        tags: ['api', 'orchestration', 'integration', 'ai-optimized'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      {
        id: 'rest_api_client',
        name: 'REST API Client Template',
        category: 'api_integration',
        complexity: 'simple',
        description: 'Generic REST API client with authentication and response handling',
        use_cases: ['API testing', 'Data retrieval', 'Service communication'],
        execution_mode: ['manual', 'webhook', 'triggered'],
        ai_optimization_level: 'basic',
        workflow_definition: this.createRESTClientWorkflow(),
        metadata: {
          estimated_execution_time: 30,
          resource_requirements: 'low',
          error_handling_level: 'standard',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: false,
          example_inputs: [{ url: 'https://api.example.com', method: 'GET' }],
          expected_outputs: [{ status: 200, data: {}, headers: {} }]
        },
        tags: ['rest', 'api', 'client', 'http'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // File Operations Templates
      {
        id: 'file_monitor',
        name: 'File System Monitor',
        category: 'file_operations',
        complexity: 'intermediate',
        description: 'Monitor file system changes and trigger automated processing',
        use_cases: ['File processing automation', 'Document management', 'Data ingestion'],
        execution_mode: ['triggered', 'scheduled'],
        ai_optimization_level: 'enhanced',
        workflow_definition: this.createFileMonitorWorkflow(),
        metadata: {
          estimated_execution_time: 90,
          resource_requirements: 'low',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ watch_path: '/data/incoming', file_pattern: '*.json' }],
          expected_outputs: [{ files_processed: 5, status: 'success' }]
        },
        tags: ['file', 'monitor', 'automation', 'trigger'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      {
        id: 'batch_file_processor',
        name: 'Batch File Processor',
        category: 'file_operations',
        complexity: 'intermediate',
        description: 'Process multiple files in batches with parallel execution and error handling',
        use_cases: ['Bulk file processing', 'Image processing', 'Document conversion'],
        execution_mode: ['manual', 'scheduled', 'triggered'],
        ai_optimization_level: 'enhanced',
        workflow_definition: this.createBatchFileProcessorWorkflow(),
        metadata: {
          estimated_execution_time: 240,
          resource_requirements: 'high',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ input_directory: '/data/batch', batch_size: 10 }],
          expected_outputs: [{ processed_files: 100, errors: 2, duration: 180 }]
        },
        tags: ['batch', 'file-processing', 'parallel', 'bulk'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // Notification Systems Templates
      {
        id: 'smart_notification_hub',
        name: 'Smart Notification Hub',
        category: 'notification_systems',
        complexity: 'advanced',
        description: 'Intelligent notification system with routing, filtering, and escalation',
        use_cases: ['Alert management', 'Status notifications', 'Error reporting'],
        execution_mode: ['webhook', 'triggered'],
        ai_optimization_level: 'advanced',
        workflow_definition: this.createNotificationHubWorkflow(),
        metadata: {
          estimated_execution_time: 45,
          resource_requirements: 'medium',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ message: 'Alert', priority: 'high', channels: ['email', 'slack'] }],
          expected_outputs: [{ sent: true, channels_used: 2, delivery_time: 3 }]
        },
        tags: ['notifications', 'alerts', 'routing', 'smart'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      {
        id: 'email_notification_system',
        name: 'Email Notification System',
        category: 'notification_systems',
        complexity: 'simple',
        description: 'Simple email notification system with template support',
        use_cases: ['Status updates', 'Report delivery', 'Alert notifications'],
        execution_mode: ['triggered', 'webhook'],
        ai_optimization_level: 'basic',
        workflow_definition: this.createEmailNotificationWorkflow(),
        metadata: {
          estimated_execution_time: 20,
          resource_requirements: 'low',
          error_handling_level: 'standard',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: false,
          example_inputs: [{ to: 'user@example.com', subject: 'Alert', body: 'Message' }],
          expected_outputs: [{ sent: true, message_id: 'msg123' }]
        },
        tags: ['email', 'notifications', 'simple', 'alerts'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // Monitoring Automation Templates
      {
        id: 'system_health_monitor',
        name: 'System Health Monitor',
        category: 'monitoring_automation',
        complexity: 'advanced',
        description: 'Comprehensive system monitoring with automated response capabilities',
        use_cases: ['Infrastructure monitoring', 'Performance tracking', 'Automated remediation'],
        execution_mode: ['scheduled', 'triggered'],
        ai_optimization_level: 'advanced',
        workflow_definition: this.createSystemMonitorWorkflow(),
        metadata: {
          estimated_execution_time: 300,
          resource_requirements: 'medium',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ endpoints: ['api1', 'api2'], metrics: ['cpu', 'memory'] }],
          expected_outputs: [{ status: 'healthy', alerts: 0, response_time: 50 }]
        },
        tags: ['monitoring', 'health', 'automation', 'system'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      {
        id: 'performance_tracker',
        name: 'Performance Metrics Tracker',
        category: 'monitoring_automation',
        complexity: 'intermediate',
        description: 'Track and analyze performance metrics with automated reporting',
        use_cases: ['Performance monitoring', 'Metrics collection', 'Trend analysis'],
        execution_mode: ['scheduled', 'triggered'],
        ai_optimization_level: 'enhanced',
        workflow_definition: this.createPerformanceTrackerWorkflow(),
        metadata: {
          estimated_execution_time: 120,
          resource_requirements: 'medium',
          error_handling_level: 'standard',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ metrics: ['response_time', 'throughput'], interval: 300 }],
          expected_outputs: [{ metrics_collected: 10, trends: 'improving' }]
        },
        tags: ['performance', 'metrics', 'tracking', 'analysis'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // Webhook Handlers Templates
      {
        id: 'smart_webhook_handler',
        name: 'Smart Webhook Handler',
        category: 'webhook_handlers',
        complexity: 'advanced',
        description: 'Intelligent webhook processing with routing, validation, and response management',
        use_cases: ['Event processing', 'Integration endpoints', 'Real-time data handling'],
        execution_mode: ['webhook'],
        ai_optimization_level: 'advanced',
        workflow_definition: this.createSmartWebhookWorkflow(),
        metadata: {
          estimated_execution_time: 60,
          resource_requirements: 'medium',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ event_type: 'user.created', payload: {} }],
          expected_outputs: [{ processed: true, actions_taken: 3, response_code: 200 }]
        },
        tags: ['webhook', 'smart', 'routing', 'validation'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      },
      
      // Scheduled Tasks Templates
      {
        id: 'maintenance_scheduler',
        name: 'Automated Maintenance Scheduler',
        category: 'scheduled_tasks',
        complexity: 'intermediate',
        description: 'Automated maintenance tasks with scheduling and dependency management',
        use_cases: ['System maintenance', 'Cleanup tasks', 'Regular operations'],
        execution_mode: ['scheduled'],
        ai_optimization_level: 'enhanced',
        workflow_definition: this.createMaintenanceSchedulerWorkflow(),
        metadata: {
          estimated_execution_time: 600,
          resource_requirements: 'high',
          error_handling_level: 'comprehensive',
          retry_capability: true,
          timeout_handling: true,
          monitoring_included: true,
          example_inputs: [{ tasks: ['cleanup', 'backup'], schedule: 'daily' }],
          expected_outputs: [{ completed_tasks: 2, status: 'success', next_run: '2024-01-01T00:00:00Z' }]
        },
        tags: ['maintenance', 'scheduler', 'automation', 'tasks'],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }
    ];
  }
  
  /**
   * Filter templates based on criteria
   */
  protected filterTemplates(
    templates: AIAgentTemplate[],
    category?: string,
    complexity?: string,
    execution_mode?: string,
    ai_optimization_level?: string
  ): AIAgentTemplate[] {
    return templates.filter(template => {
      if (category && category !== 'all' && template.category !== category) return false;
      if (complexity && complexity !== 'all' && template.complexity !== complexity) return false;
      if (execution_mode && execution_mode !== 'all' && !template.execution_mode.includes(execution_mode)) return false;
      if (ai_optimization_level && ai_optimization_level !== 'all' && template.ai_optimization_level !== ai_optimization_level) return false;
      return true;
    });
  }
  
  /**
   * Create workflow definition helper methods
   */
  protected createDataETLWorkflow(): any {
    return {
      nodes: [
        {
          id: 'trigger',
          type: 'Manual Trigger',
          position: [100, 100],
          parameters: {}
        },
        {
          id: 'extract',
          type: 'HTTP Request',
          position: [300, 100],
          parameters: {
            method: 'GET',
            timeout: 30000,
            retryOnHttpError: true,
            maxRetries: 3
          }
        },
        {
          id: 'validate',
          type: 'Function',
          position: [500, 100],
          parameters: {
            functionCode: `
              // AI-optimized data validation
              const errors = [];
              if (!items[0].json.data) errors.push('Missing data field');
              if (errors.length > 0) throw new Error(errors.join(', '));
              return items;
            `
          }
        },
        {
          id: 'transform',
          type: 'Set',
          position: [700, 100],
          parameters: {
            values: {
              'processed_at': '={{ new Date().toISOString() }}',
              'status': 'processed'
            }
          }
        },
        {
          id: 'load',
          type: 'HTTP Request',
          position: [900, 100],
          parameters: {
            method: 'POST',
            timeout: 60000,
            retryOnHttpError: true
          }
        },
        {
          id: 'error_handler',
          type: 'Set',
          position: [500, 300],
          parameters: {
            values: {
              'error': '={{ $json.error.message }}',
              'timestamp': '={{ new Date().toISOString() }}'
            }
          }
        }
      ],
      connections: {
        'trigger': { main: [['extract']] },
        'extract': { main: [['validate']] },
        'validate': { main: [['transform']], error: [['error_handler']] },
        'transform': { main: [['load']] },
        'load': { error: [['error_handler']] }
      }
    };
  }
  
  protected createCSVProcessorWorkflow(): any {
    return {
      nodes: [
        {
          id: 'trigger',
          type: 'Manual Trigger',
          position: [100, 100]
        },
        {
          id: 'read_csv',
          type: 'Read Binary File',
          position: [300, 100]
        },
        {
          id: 'parse_csv',
          type: 'Function',
          position: [500, 100],
          parameters: {
            functionCode: `
              // Parse CSV with validation
              const csv = require('csv-parser');
              const results = [];
              // Implementation would parse CSV and validate data
              return [{ json: { processed_rows: results.length } }];
            `
          }
        }
      ],
      connections: {
        'trigger': { main: [['read_csv']] },
        'read_csv': { main: [['parse_csv']] }
      }
    };
  }
  
  protected createAPIOrchestrationWorkflow(): any {
    return {
      nodes: [
        {
          id: 'webhook',
          type: 'Webhook',
          position: [100, 100],
          parameters: {
            httpMethod: 'POST',
            responseMode: 'responseNode'
          }
        },
        {
          id: 'route_request',
          type: 'Switch',
          position: [300, 100],
          parameters: {
            rules: {
              mode: 'expression',
              rules: [
                { output: 0, expression: '$json.service === "api1"' },
                { output: 1, expression: '$json.service === "api2"' }
              ]
            }
          }
        },
        {
          id: 'api1_call',
          type: 'HTTP Request',
          position: [500, 50],
          parameters: {
            timeout: 30000,
            retryOnHttpError: true
          }
        },
        {
          id: 'api2_call',
          type: 'HTTP Request',
          position: [500, 150],
          parameters: {
            timeout: 30000,
            retryOnHttpError: true
          }
        },
        {
          id: 'aggregate_results',
          type: 'Merge',
          position: [700, 100]
        },
        {
          id: 'respond',
          type: 'Respond to Webhook',
          position: [900, 100]
        }
      ],
      connections: {
        'webhook': { main: [['route_request']] },
        'route_request': { 
          main: [
            ['api1_call'],
            ['api2_call']
          ] 
        },
        'api1_call': { main: [['aggregate_results']] },
        'api2_call': { main: [['aggregate_results']] },
        'aggregate_results': { main: [['respond']] }
      }
    };
  }
  
  // Additional workflow creation methods would be implemented for each template
  protected createRESTClientWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createFileMonitorWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createBatchFileProcessorWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createNotificationHubWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createEmailNotificationWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createSystemMonitorWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createPerformanceTrackerWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createSmartWebhookWorkflow(): any { return { nodes: [], connections: {} }; }
  protected createMaintenanceSchedulerWorkflow(): any { return { nodes: [], connections: {} }; }
  
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
        
      return this.formatError(`Error executing AI agent template tool: ${errorMessage}`);
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
}