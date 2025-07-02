import { INodeExecutionData, IDataObject } from 'n8n-workflow';

export class N8NMCPBridge {
  /**
   * Convert n8n workflow data to MCP tool arguments
   */
  static n8nToMCPToolArgs(data: IDataObject): any {
    // Handle different data formats from n8n
    if (data.json) {
      return data.json;
    }
    
    // Remove n8n-specific metadata
    const { pairedItem, ...cleanData } = data;
    return cleanData;
  }

  /**
   * Convert MCP tool response to n8n execution data
   */
  static mcpToN8NExecutionData(mcpResponse: any, itemIndex: number = 0): INodeExecutionData {
    // Handle MCP content array format
    if (mcpResponse.content && Array.isArray(mcpResponse.content)) {
      const textContent = mcpResponse.content
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.text)
        .join('\n');
      
      try {
        // Try to parse as JSON if possible
        const parsed = JSON.parse(textContent);
        return {
          json: parsed,
          pairedItem: itemIndex,
        };
      } catch {
        // Return as text if not JSON
        return {
          json: { result: textContent },
          pairedItem: itemIndex,
        };
      }
    }

    // Handle direct object response
    return {
      json: mcpResponse,
      pairedItem: itemIndex,
    };
  }

  /**
   * Convert n8n workflow definition to MCP-compatible format
   */
  static n8nWorkflowToMCP(workflow: any): any {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || '',
      nodes: workflow.nodes?.map((node: any) => ({
        id: node.id,
        type: node.type,
        name: node.name,
        parameters: node.parameters,
        position: node.position,
      })),
      connections: workflow.connections,
      settings: workflow.settings,
      metadata: {
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        active: workflow.active,
      },
    };
  }

  /**
   * Convert MCP workflow format to n8n-compatible format
   */
  static mcpToN8NWorkflow(mcpWorkflow: any): any {
    return {
      name: mcpWorkflow.name,
      nodes: mcpWorkflow.nodes || [],
      connections: mcpWorkflow.connections || {},
      settings: mcpWorkflow.settings || {
        executionOrder: 'v1',
      },
      staticData: null,
      pinData: {},
    };
  }

  /**
   * Convert n8n execution data to MCP resource format
   */
  static n8nExecutionToMCPResource(execution: any): any {
    return {
      uri: `execution://${execution.id}`,
      name: `Execution ${execution.id}`,
      description: `Workflow: ${execution.workflowData?.name || 'Unknown'}`,
      mimeType: 'application/json',
      data: {
        id: execution.id,
        workflowId: execution.workflowId,
        status: execution.finished ? 'completed' : execution.stoppedAt ? 'stopped' : 'running',
        mode: execution.mode,
        startedAt: execution.startedAt,
        stoppedAt: execution.stoppedAt,
        error: execution.data?.resultData?.error,
        executionData: execution.data,
      },
    };
  }

  /**
   * Convert MCP prompt arguments to n8n-compatible format
   */
  static mcpPromptArgsToN8N(promptArgs: any): IDataObject {
    return {
      prompt: promptArgs.name || '',
      arguments: promptArgs.arguments || {},
      messages: promptArgs.messages || [],
    };
  }

  /**
   * Validate and sanitize data before conversion
   */
  static sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return {};
    }

    if (typeof data !== 'object') {
      return { value: data };
    }

    // Remove circular references
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(data, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }));
  }

  /**
   * Extract error information for both n8n and MCP formats
   */
  static formatError(error: any): any {
    return {
      message: error.message || 'Unknown error',
      type: error.name || 'Error',
      stack: error.stack,
      details: {
        code: error.code,
        statusCode: error.statusCode,
        data: error.data,
      },
    };
  }
}