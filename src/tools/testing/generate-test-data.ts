/**
 * Generate Test Data Tool
 * 
 * This tool creates realistic test data based on workflow node requirements.
 */

import { BaseTestingToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the generate_test_data tool
 */
export class GenerateTestDataHandler extends BaseTestingToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow ID and generation options
   * @returns Generated test data
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        workflowId, 
        nodeType, 
        dataSchema, 
        itemCount, 
        dataVariety, 
        includeEdgeCases,
        customTemplates 
      } = args;
      
      // Either workflowId or nodeType is required
      if (!workflowId && !nodeType) {
        throw new N8nApiError('Either workflowId or nodeType must be provided');
      }

      let workflow: any = null;
      if (workflowId) {
        workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
        }
      }

      // Generate test data
      const testData = this.generateComprehensiveTestData({
        workflow,
        nodeType,
        dataSchema,
        itemCount: itemCount || 5,
        dataVariety: dataVariety || 'standard',
        includeEdgeCases: includeEdgeCases || false,
        customTemplates: customTemplates || {}
      });

      return this.formatSuccess(
        testData,
        workflow 
          ? `Test data generated for workflow: ${workflow.name}`
          : `Test data generated for node type: ${nodeType}`
      );
    }, args);
  }

  /**
   * Generate comprehensive test data
   */
  private generateComprehensiveTestData(options: any): any {
    const {
      workflow,
      nodeType,
      dataSchema,
      itemCount,
      dataVariety,
      includeEdgeCases,
      customTemplates
    } = options;

    const testData: Record<string, any> = {
      metadata: {
        generatedAt: new Date().toISOString(),
        itemCount,
        dataVariety,
        includeEdgeCases,
        source: workflow ? `workflow-${workflow.id}` : `node-${nodeType}`
      },
      datasets: {} as Record<string, any>
    };

    if (workflow) {
      // Generate data for workflow
      testData.datasets = this.generateWorkflowTestData(
        workflow, 
        itemCount, 
        dataVariety, 
        includeEdgeCases,
        customTemplates
      );
    } else if (nodeType) {
      // Generate data for specific node type
      testData.datasets.nodeSpecific = this.generateNodeSpecificTestData(
        nodeType,
        dataSchema,
        itemCount,
        dataVariety,
        includeEdgeCases,
        customTemplates
      );
    }

    // Add edge cases if requested
    if (includeEdgeCases) {
      testData.edgeCases = this.generateEdgeCaseData(workflow, nodeType);
    }

    // Add common test scenarios
    testData.commonScenarios = this.generateCommonScenarios();

    return testData;
  }

  /**
   * Generate test data for entire workflow
   */
  private generateWorkflowTestData(
    workflow: any,
    itemCount: number,
    variety: string,
    includeEdgeCases: boolean,
    customTemplates: any
  ): Record<string, any> {
    const datasets: Record<string, any> = {};

    if (!workflow.nodes) return datasets;

    // Generate data for trigger nodes
    const triggerNodes = workflow.nodes.filter((node: any) => 
      node.type.includes('trigger') || node.type.includes('webhook')
    );

    for (const trigger of triggerNodes) {
      datasets[`trigger_${trigger.name}`] = this.generateTriggerData(
        trigger,
        itemCount,
        variety,
        customTemplates[trigger.name]
      );
    }

    // Generate data for specific node types
    const nodeTypeGroups = this.groupNodesByType(workflow.nodes);
    
    for (const [type, nodes] of Object.entries(nodeTypeGroups)) {
      const typeArray = nodes as any[];
      datasets[`${this.sanitizeNodeType(type)}_data`] = this.generateNodeTypeData(
        type,
        typeArray,
        itemCount,
        variety,
        customTemplates
      );
    }

    // Generate workflow-specific scenarios
    datasets.workflowScenarios = this.generateWorkflowScenarios(
      workflow,
      itemCount,
      variety
    );

    return datasets;
  }

  /**
   * Generate trigger-specific data
   */
  private generateTriggerData(
    trigger: any,
    itemCount: number,
    variety: string,
    customTemplate?: any
  ): any[] {
    const data = [];

    for (let i = 0; i < itemCount; i++) {
      let item: any = {};

      if (customTemplate) {
        item = this.applyCustomTemplate(customTemplate, i);
      } else {
        switch (trigger.type) {
          case 'n8n-nodes-base.webhook':
            item = this.generateWebhookData(variety, i);
            break;
          case 'n8n-nodes-base.cron':
            item = this.generateCronData(variety, i);
            break;
          case 'n8n-nodes-base.httpRequest':
            item = this.generateHttpTriggerData(variety, i);
            break;
          default:
            item = this.generateGenericTriggerData(variety, i);
        }
      }

      data.push(item);
    }

    return data;
  }

  /**
   * Generate webhook data
   */
  private generateWebhookData(variety: string, index: number): any {
    const baseData = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'TestAgent/1.0',
        'x-request-id': `req-${Date.now()}-${index}`
      },
      query: {},
      body: {}
    };

    switch (variety) {
      case 'minimal':
        baseData.body = { message: `Test message ${index + 1}` };
        break;
      case 'standard':
        baseData.body = {
          id: index + 1,
          title: `Test Item ${index + 1}`,
          description: `This is test item number ${index + 1}`,
          timestamp: new Date().toISOString(),
          status: ['active', 'pending', 'completed'][index % 3],
          metadata: {
            source: 'test-generator',
            version: '1.0'
          }
        };
        break;
      case 'comprehensive':
        baseData.body = {
          id: index + 1,
          user: {
            id: `user-${index + 1}`,
            name: `Test User ${index + 1}`,
            email: `testuser${index + 1}@example.com`,
            preferences: {
              language: ['en', 'es', 'fr'][index % 3],
              timezone: 'UTC'
            }
          },
          data: {
            items: this.generateRandomItems(3 + index % 5),
            totals: {
              count: 3 + index % 5,
              value: (index + 1) * 100
            }
          },
          context: {
            sessionId: `session-${Date.now()}-${index}`,
            requestSource: 'api',
            environment: 'test'
          }
        };
        break;
    }

    return baseData;
  }

  /**
   * Generate cron trigger data
   */
  private generateCronData(variety: string, index: number): any {
    return {
      executionTime: new Date().toISOString(),
      cronExpression: '0 0 * * *',
      executionCount: index + 1,
      data: this.generateTimeBasedData(variety, index)
    };
  }

  /**
   * Generate HTTP trigger data
   */
  private generateHttpTriggerData(variety: string, index: number): any {
    return {
      url: `https://api.example.com/endpoint/${index + 1}`,
      method: 'GET',
      headers: {
        'authorization': 'Bearer test-token',
        'accept': 'application/json'
      },
      response: {
        statusCode: 200,
        body: this.generateApiResponseData(variety, index)
      }
    };
  }

  /**
   * Generate generic trigger data
   */
  private generateGenericTriggerData(variety: string, index: number): any {
    return {
      triggerId: `trigger-${index + 1}`,
      timestamp: new Date().toISOString(),
      data: this.generateSampleDataForNode('generic', { variety, index })
    };
  }

  /**
   * Generate node type specific data
   */
  private generateNodeSpecificTestData(
    nodeType: string,
    dataSchema: any,
    itemCount: number,
    variety: string,
    includeEdgeCases: boolean,
    customTemplates: any
  ): any[] {
    const data = [];

    for (let i = 0; i < itemCount; i++) {
      let item: any = {};

      if (dataSchema) {
        item = this.generateFromSchema(dataSchema, i);
      } else if (customTemplates.default) {
        item = this.applyCustomTemplate(customTemplates.default, i);
      } else {
        item = this.generateSampleDataForNode(nodeType, { variety, index: i });
      }

      data.push(item);
    }

    return data;
  }

  /**
   * Generate data from schema
   */
  private generateFromSchema(schema: any, index: number): any {
    const data: Record<string, any> = {};

    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        const property = prop as any;
        data[key] = this.generateValueFromSchemaProperty(property, index);
      }
    }

    return data;
  }

  /**
   * Generate value from schema property
   */
  private generateValueFromSchemaProperty(property: any, index: number): any {
    switch (property.type) {
      case 'string':
        return property.enum 
          ? property.enum[index % property.enum.length]
          : `${property.example || 'test-string'}-${index + 1}`;
      case 'number':
      case 'integer':
        return (property.minimum || 0) + (index + 1);
      case 'boolean':
        return index % 2 === 0;
      case 'array':
        return this.generateArrayFromSchema(property.items, index);
      case 'object':
        return this.generateFromSchema(property, index);
      default:
        return `value-${index + 1}`;
    }
  }

  /**
   * Generate array from schema
   */
  private generateArrayFromSchema(itemSchema: any, index: number): any[] {
    const length = 2 + (index % 3);
    const array = [];

    for (let i = 0; i < length; i++) {
      array.push(this.generateValueFromSchemaProperty(itemSchema, i));
    }

    return array;
  }

  /**
   * Apply custom template
   */
  private applyCustomTemplate(template: any, index: number): any {
    let result = JSON.parse(JSON.stringify(template));
    
    // Replace placeholders
    const replacements = {
      '{{index}}': index + 1,
      '{{timestamp}}': new Date().toISOString(),
      '{{uuid}}': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      '{{random}}': Math.floor(Math.random() * 1000)
    };

    result = this.replacePlaceholders(result, replacements);
    return result;
  }

  /**
   * Replace placeholders in template
   */
  private replacePlaceholders(obj: any, replacements: Record<string, any>): any {
    if (typeof obj === 'string') {
      let result = obj;
      for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      }
      return result;
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.replacePlaceholders(item, replacements));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replacePlaceholders(value, replacements);
      }
      return result;
    }
    return obj;
  }

  /**
   * Group nodes by type
   */
  private groupNodesByType(nodes: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    for (const node of nodes) {
      const type = node.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(node);
    }

    return groups;
  }

  /**
   * Sanitize node type for use as key
   */
  private sanitizeNodeType(nodeType: string): string {
    return nodeType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  /**
   * Generate node type data
   */
  private generateNodeTypeData(
    type: string,
    nodes: any[],
    itemCount: number,
    variety: string,
    customTemplates: any
  ): any[] {
    const data = [];

    for (let i = 0; i < itemCount; i++) {
      const templateKey = `${this.sanitizeNodeType(type)}_${i}`;
      
      if (customTemplates[templateKey]) {
        data.push(this.applyCustomTemplate(customTemplates[templateKey], i));
      } else {
        data.push(this.generateSampleDataForNode(type, { variety, index: i, nodes }));
      }
    }

    return data;
  }

  /**
   * Generate workflow scenarios
   */
  private generateWorkflowScenarios(
    workflow: any,
    itemCount: number,
    variety: string
  ): any[] {
    const scenarios = [];

    // Success scenario
    scenarios.push({
      name: 'Success Path',
      description: 'Normal execution with valid data',
      data: this.generateSuccessScenarioData(workflow, variety)
    });

    // Error scenarios
    scenarios.push({
      name: 'Validation Error',
      description: 'Invalid data that should trigger validation errors',
      data: this.generateErrorScenarioData(workflow, 'validation')
    });

    scenarios.push({
      name: 'Network Error',
      description: 'Simulated network connectivity issues',
      data: this.generateErrorScenarioData(workflow, 'network')
    });

    // Edge case scenarios
    scenarios.push({
      name: 'Empty Data',
      description: 'Execution with empty or minimal data',
      data: {}
    });

    scenarios.push({
      name: 'Large Dataset',
      description: 'Execution with large amount of data',
      data: this.generateLargeDataset(100)
    });

    return scenarios;
  }

  /**
   * Generate success scenario data
   */
  private generateSuccessScenarioData(workflow: any, variety: string): any {
    return {
      user: {
        id: 'success-user-001',
        name: 'Success Test User',
        email: 'success@example.com'
      },
      items: this.generateRandomItems(5),
      metadata: {
        scenario: 'success',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate error scenario data
   */
  private generateErrorScenarioData(workflow: any, errorType: string): any {
    switch (errorType) {
      case 'validation':
        return {
          user: {
            id: '', // Invalid empty ID
            name: null, // Invalid null name
            email: 'invalid-email' // Invalid email format
          },
          items: 'not-an-array' // Should be array
        };
      case 'network':
        return {
          simulateNetworkError: true,
          timeout: 1, // Very short timeout
          retries: 0
        };
      default:
        return { error: 'Unknown error type' };
    }
  }

  /**
   * Generate large dataset
   */
  private generateLargeDataset(size: number): any {
    return {
      largeArray: Array.from({ length: size }, (_, i) => ({
        id: i + 1,
        data: `Large item ${i + 1}`,
        timestamp: new Date().toISOString()
      }))
    };
  }

  /**
   * Generate edge case data
   */
  private generateEdgeCaseData(workflow: any, nodeType?: string): any[] {
    const edgeCases = [];

    // Null and undefined values
    edgeCases.push({
      name: 'Null Values',
      data: { value: null, nested: { field: null } }
    });

    // Empty structures
    edgeCases.push({
      name: 'Empty Structures',
      data: { array: [], object: {}, string: '' }
    });

    // Special characters
    edgeCases.push({
      name: 'Special Characters',
      data: {
        unicode: '🚀 Test with émojis and spëcial chars',
        quotes: 'Text with "quotes" and \'apostrophes\'',
        html: '<script>alert("test")</script>',
        sql: "'; DROP TABLE users; --"
      }
    });

    // Large values
    edgeCases.push({
      name: 'Large Values',
      data: {
        longString: 'A'.repeat(10000),
        largeNumber: Number.MAX_SAFE_INTEGER,
        deepNesting: this.generateDeeplyNestedObject(20)
      }
    });

    // Date edge cases
    edgeCases.push({
      name: 'Date Edge Cases',
      data: {
        epoch: new Date(0).toISOString(),
        futureDate: new Date('2099-12-31').toISOString(),
        invalidDate: 'not-a-date',
        timezone: new Date().toISOString()
      }
    });

    return edgeCases;
  }

  /**
   * Generate deeply nested object
   */
  private generateDeeplyNestedObject(depth: number): any {
    if (depth === 0) {
      return 'deep value';
    }
    return { level: depth, nested: this.generateDeeplyNestedObject(depth - 1) };
  }

  /**
   * Generate common test scenarios
   */
  private generateCommonScenarios(): any[] {
    return [
      {
        name: 'Authentication',
        description: 'Test data for authentication scenarios',
        data: {
          validCredentials: { username: 'testuser', password: 'password123' },
          invalidCredentials: { username: 'invalid', password: 'wrong' },
          expiredToken: 'expired.jwt.token',
          validToken: 'valid.jwt.token'
        }
      },
      {
        name: 'Pagination',
        description: 'Test data for paginated requests',
        data: {
          firstPage: { page: 1, limit: 10 },
          middlePage: { page: 5, limit: 10 },
          lastPage: { page: 100, limit: 10 },
          invalidPagination: { page: -1, limit: 0 }
        }
      },
      {
        name: 'File Processing',
        description: 'Test data for file operations',
        data: {
          textFile: { name: 'test.txt', content: 'Sample text content', size: 1024 },
          imageFile: { name: 'test.jpg', content: 'binary-data', size: 2048 },
          largeFile: { name: 'large.pdf', content: 'large-binary-data', size: 1048576 }
        }
      }
    ];
  }

  /**
   * Generate random items
   */
  private generateRandomItems(count: number): any[] {
    const items = [];
    const categories = ['electronics', 'books', 'clothing', 'food', 'tools'];
    
    for (let i = 0; i < count; i++) {
      items.push({
        id: `item-${i + 1}`,
        name: `Test Item ${i + 1}`,
        category: categories[i % categories.length],
        price: (i + 1) * 10 + Math.random() * 50,
        inStock: i % 3 !== 0,
        created: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
      });
    }

    return items;
  }

  /**
   * Generate time-based data
   */
  private generateTimeBasedData(variety: string, index: number): any {
    const baseTime = new Date();
    
    return {
      currentTime: baseTime.toISOString(),
      timeZone: 'UTC',
      dayOfWeek: baseTime.getDay(),
      hourOfDay: baseTime.getHours(),
      isWeekend: baseTime.getDay() === 0 || baseTime.getDay() === 6,
      scheduledFor: new Date(baseTime.getTime() + (index + 1) * 3600000).toISOString()
    };
  }

  /**
   * Generate API response data
   */
  private generateApiResponseData(variety: string, index: number): any {
    switch (variety) {
      case 'minimal':
        return { id: index + 1, status: 'ok' };
      case 'standard':
        return {
          id: index + 1,
          status: 'success',
          data: { message: `Response ${index + 1}` },
          timestamp: new Date().toISOString()
        };
      case 'comprehensive':
        return {
          id: index + 1,
          status: 'success',
          data: {
            records: this.generateRandomItems(3),
            pagination: { page: 1, total: 100, hasMore: true }
          },
          meta: {
            requestId: `req-${Date.now()}-${index}`,
            processingTime: Math.random() * 1000,
            version: 'v1.0'
          }
        };
      default:
        return { data: `Response ${index + 1}` };
    }
  }
}

/**
 * Get tool definition for the generate_test_data tool
 * 
 * @returns Tool definition
 */
export function getGenerateTestDataToolDefinition(): ToolDefinition {
  return {
    name: 'generate_test_data',
    description: 'Create realistic test data based on workflow node requirements',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to generate test data for',
        },
        nodeType: {
          type: 'string',
          description: 'Specific node type to generate test data for (alternative to workflowId)',
        },
        dataSchema: {
          type: 'object',
          description: 'JSON schema to follow for data generation',
        },
        itemCount: {
          type: 'number',
          description: 'Number of test data items to generate',
          default: 5,
        },
        dataVariety: {
          type: 'string',
          description: 'Variety level of generated data',
          enum: ['minimal', 'standard', 'comprehensive'],
          default: 'standard',
        },
        includeEdgeCases: {
          type: 'boolean',
          description: 'Include edge case scenarios in generated data',
          default: false,
        },
        customTemplates: {
          type: 'object',
          description: 'Custom data templates for specific nodes or scenarios',
        },
      },
      // Note: Either workflowId OR nodeType must be provided
      required: [],
    },
  };
}