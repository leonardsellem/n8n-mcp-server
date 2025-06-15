/**
 * Execute Workflow Tool
 * 
 * This tool executes a workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the execute_workflow tool
 */
export class ExecuteWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow execution parameters
   * @returns Execution result information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, inputData, waitForCompletion = true } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Validate inputData if provided
      if (inputData && typeof inputData !== 'object') {
        throw new N8nApiError('Parameter "inputData" must be an object');
      }
      
      // Get the workflow to ensure it exists and is active
      const workflow = await this.apiService.getWorkflow(workflowId);
      
      if (!workflow.active) {
        throw new N8nApiError(`Workflow "${workflow.name}" is not active. Please activate it first.`);
      }
      
      // Execute the workflow
      const execution = await this.apiService.executeWorkflow(workflowId, inputData);
      
      let result: any = {
        executionId: execution.id,
        workflowId: workflowId,
        workflowName: workflow.name,
        status: execution.status || 'running',
        startedAt: execution.startedAt || new Date().toISOString()
      };
      
      // If waiting for completion, poll for the result
      if (waitForCompletion && execution.id) {
        try {
          // Wait a moment for execution to start
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the execution result
          const executionResult = await this.apiService.getExecution(execution.id);
          
          result = {
            ...result,
            status: executionResult.status,
            finishedAt: executionResult.finishedAt,
            executionTime: executionResult.executionTime,
            success: executionResult.status === 'success',
            data: executionResult.data,
            error: executionResult.status === 'error' ? executionResult.error : undefined
          };
        } catch (error) {
          // If we can't get the execution result, just return what we have
          result.note = 'Execution started but result could not be retrieved immediately';
        }
      }
      
      const message = waitForCompletion 
        ? `Workflow "${workflow.name}" executed ${result.success ? 'successfully' : 'with status: ' + result.status}`
        : `Workflow "${workflow.name}" execution started`;
      
      return this.formatSuccess(result, message);
    }, args);
  }
}

/**
 * Get tool definition for the execute_workflow tool
 * 
 * @returns Tool definition
 */
export function getExecuteWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'execute_workflow',
    description: 'Execute a workflow in n8n. The workflow must be active to be executed.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to execute',
        },
        inputData: {
          type: 'object',
          description: 'Optional input data to pass to the workflow (for manual trigger workflows)',
        },
        waitForCompletion: {
          type: 'boolean',
          description: 'Whether to wait for the execution to complete before returning results',
          default: true,
        },
      },
      required: ['workflowId'],
    },
  };
}
