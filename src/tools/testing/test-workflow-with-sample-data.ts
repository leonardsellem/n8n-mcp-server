/**
 * Test Workflow with Sample Data Tool
 * 
 * This tool runs workflows with test data and returns execution results.
 */

import { BaseTestingToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the test_workflow_with_sample_data tool
 */
export class TestWorkflowWithSampleDataHandler extends BaseTestingToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow ID and test data
   * @returns Test execution results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, testData, nodeToTest, includeDetails } = args;
      
      this.validateRequiredParams(args, ['workflowId']);
      
      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
      }

      // Generate test data if not provided
      let finalTestData = testData;
      if (!finalTestData) {
        finalTestData = this.generateTestDataForWorkflow(workflow);
      }

      // Execute workflow with test data
      const execution = await this.executeWorkflowWithTestData(
        workflowId, 
        finalTestData, 
        nodeToTest
      );

      // Format results
      const results: Record<string, any> = {
        workflowId,
        workflowName: workflow.name,
        executionId: execution.id,
        status: execution.finished ? 'completed' : 'running',
        startTime: execution.startedAt,
        endTime: execution.stoppedAt,
        duration: execution.stoppedAt && execution.startedAt
          ? new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime()
          : null,
        testDataUsed: finalTestData,
        nodeResults: this.extractNodeResults(execution),
        errors: this.extractErrors(execution),
        summary: this.generateExecutionSummary(execution)
      };

      if (includeDetails) {
        results.detailedResults = execution.data || {};
      }

      return this.formatSuccess(
        results,
        `Test execution completed for workflow: ${workflow.name}`
      );
    }, args);
  }

  /**
   * Generate test data for a workflow based on its nodes
   */
  private generateTestDataForWorkflow(workflow: any): any {
    const testData: Record<string, any> = {};
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return { message: 'Default test data', timestamp: new Date().toISOString() };
    }

    // Find trigger nodes to determine appropriate test data
    const triggerNodes = workflow.nodes.filter((node: any) => 
      node.type.includes('trigger') || node.type.includes('webhook')
    );

    if (triggerNodes.length > 0) {
      const triggerNode = triggerNodes[0];
      testData.triggerData = this.generateSampleDataForNode(triggerNode.type);
    }

    // Add general test data
    testData.generalData = {
      testId: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      environment: 'test',
      userId: 'test-user',
      items: [
        { id: 1, name: 'Test Item 1', value: 100 },
        { id: 2, name: 'Test Item 2', value: 200 }
      ]
    };

    return testData;
  }

  /**
   * Execute workflow with test data
   */
  private async executeWorkflowWithTestData(
    workflowId: string, 
    testData: any, 
    nodeToTest?: string
  ): Promise<any> {
    try {
      // For testing purposes, we'll trigger the workflow manually
      const executionData = {
        workflowData: await this.apiService.getWorkflow(workflowId),
        runData: testData,
        startNodes: nodeToTest ? [nodeToTest] : undefined
      };

      // Execute the workflow
      const execution = await this.apiService.executeWorkflow(workflowId, executionData);
      
      // Wait for completion or timeout after 30 seconds
      return await this.waitForExecution(execution.id, 30000);
    } catch (error) {
      throw new N8nApiError(`Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for workflow execution to complete
   */
  private async waitForExecution(executionId: string, timeout: number): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const execution = await this.apiService.getExecution(executionId);
      
      if (execution.finished || execution.stoppedAt) {
        return execution;
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new N8nApiError(`Execution timeout after ${timeout}ms`);
  }

  /**
   * Extract node results from execution
   */
  private extractNodeResults(execution: any): any[] {
    const results: any[] = [];
    
    if (execution.data && execution.data.resultData) {
      const runData = execution.data.resultData.runData;
      
      for (const [nodeName, nodeData] of Object.entries(runData || {})) {
        results.push({
          nodeName,
          status: this.getNodeExecutionStatus(nodeData),
          output: this.getNodeOutput(nodeData),
          executionTime: this.getNodeExecutionTime(nodeData)
        });
      }
    }
    
    return results;
  }

  /**
   * Extract errors from execution
   */
  private extractErrors(execution: any): any[] {
    const errors: any[] = [];
    
    if (execution.data && execution.data.resultData) {
      const runData = execution.data.resultData.runData;
      
      for (const [nodeName, nodeData] of Object.entries(runData || {})) {
        const nodeArray = nodeData as any[];
        if (nodeArray && nodeArray[0] && nodeArray[0].error) {
          errors.push({
            nodeName,
            error: nodeArray[0].error.message || 'Unknown error',
            details: nodeArray[0].error
          });
        }
      }
    }
    
    return errors;
  }

  /**
   * Generate execution summary
   */
  private generateExecutionSummary(execution: any): any {
    const summary = {
      totalNodes: 0,
      successfulNodes: 0,
      failedNodes: 0,
      skippedNodes: 0,
      overallStatus: execution.finished ? 'success' : 'failed'
    };

    if (execution.data && execution.data.resultData) {
      const runData = execution.data.resultData.runData;
      
      for (const nodeData of Object.values(runData || {})) {
        summary.totalNodes++;
        const status = this.getNodeExecutionStatus(nodeData);
        
        if (status === 'success') summary.successfulNodes++;
        else if (status === 'error') summary.failedNodes++;
        else summary.skippedNodes++;
      }
    }

    return summary;
  }

  /**
   * Get node execution status
   */
  private getNodeExecutionStatus(nodeData: any): string {
    if (!nodeData || !Array.isArray(nodeData) || nodeData.length === 0) {
      return 'skipped';
    }
    
    const firstRun = nodeData[0];
    if (firstRun.error) return 'error';
    if (firstRun.data) return 'success';
    
    return 'unknown';
  }

  /**
   * Get node output data
   */
  private getNodeOutput(nodeData: any): any {
    if (!nodeData || !Array.isArray(nodeData) || nodeData.length === 0) {
      return null;
    }
    
    return nodeData[0].data || null;
  }

  /**
   * Get node execution time
   */
  private getNodeExecutionTime(nodeData: any): number | null {
    if (!nodeData || !Array.isArray(nodeData) || nodeData.length === 0) {
      return null;
    }
    
    const firstRun = nodeData[0];
    if (firstRun.startTime && firstRun.executionTime) {
      return firstRun.executionTime;
    }
    
    return null;
  }
}

/**
 * Get tool definition for the test_workflow_with_sample_data tool
 * 
 * @returns Tool definition
 */
export function getTestWorkflowWithSampleDataToolDefinition(): ToolDefinition {
  return {
    name: 'test_workflow_with_sample_data',
    description: 'Run workflows with test data and return execution results',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to test',
        },
        testData: {
          type: 'object',
          description: 'Test data to use for execution (auto-generated if not provided)',
        },
        nodeToTest: {
          type: 'string',
          description: 'Specific node to start testing from (optional)',
        },
        includeDetails: {
          type: 'boolean',
          description: 'Include detailed execution data in results',
          default: false,
        },
      },
      required: ['workflowId'],
    },
  };
}