import { N8NMCPBridge } from '../src/utils/bridge';

describe('N8NMCPBridge', () => {
  describe('n8nToMCPToolArgs', () => {
    it('should extract json from n8n data object', () => {
      const n8nData = { json: { foo: 'bar' } };
      const result = N8NMCPBridge.n8nToMCPToolArgs(n8nData);
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should remove n8n metadata', () => {
      const n8nData = { foo: 'bar', pairedItem: 0 };
      const result = N8NMCPBridge.n8nToMCPToolArgs(n8nData);
      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('mcpToN8NExecutionData', () => {
    it('should convert MCP content array to n8n format', () => {
      const mcpResponse = {
        content: [{ type: 'text', text: '{"result": "success"}' }],
      };
      const result = N8NMCPBridge.mcpToN8NExecutionData(mcpResponse, 1);
      expect(result).toEqual({
        json: { result: 'success' },
        pairedItem: 1,
      });
    });

    it('should handle non-JSON text content', () => {
      const mcpResponse = {
        content: [{ type: 'text', text: 'plain text response' }],
      };
      const result = N8NMCPBridge.mcpToN8NExecutionData(mcpResponse);
      expect(result).toEqual({
        json: { result: 'plain text response' },
        pairedItem: 0,
      });
    });

    it('should handle direct object response', () => {
      const mcpResponse = { foo: 'bar' };
      const result = N8NMCPBridge.mcpToN8NExecutionData(mcpResponse);
      expect(result).toEqual({
        json: { foo: 'bar' },
        pairedItem: 0,
      });
    });
  });

  describe('n8nWorkflowToMCP', () => {
    it('should convert n8n workflow to MCP format', () => {
      const n8nWorkflow = {
        id: '123',
        name: 'Test Workflow',
        nodes: [
          {
            id: 'node1',
            type: 'n8n-nodes-base.start',
            name: 'Start',
            parameters: {},
            position: [100, 100],
          },
        ],
        connections: {},
        settings: { executionOrder: 'v1' },
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      const result = N8NMCPBridge.n8nWorkflowToMCP(n8nWorkflow);
      
      expect(result).toEqual({
        id: '123',
        name: 'Test Workflow',
        description: '',
        nodes: [
          {
            id: 'node1',
            type: 'n8n-nodes-base.start',
            name: 'Start',
            parameters: {},
            position: [100, 100],
          },
        ],
        connections: {},
        settings: { executionOrder: 'v1' },
        metadata: {
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          active: true,
        },
      });
    });
  });

  describe('mcpToN8NWorkflow', () => {
    it('should convert MCP workflow to n8n format', () => {
      const mcpWorkflow = {
        name: 'Test Workflow',
        nodes: [{ id: 'node1', type: 'n8n-nodes-base.start' }],
        connections: { node1: { main: [[]] } },
      };

      const result = N8NMCPBridge.mcpToN8NWorkflow(mcpWorkflow);
      
      expect(result).toEqual({
        name: 'Test Workflow',
        nodes: [{ id: 'node1', type: 'n8n-nodes-base.start' }],
        connections: { node1: { main: [[]] } },
        settings: { executionOrder: 'v1' },
        staticData: null,
        pinData: {},
      });
    });
  });

  describe('sanitizeData', () => {
    it('should handle null and undefined', () => {
      expect(N8NMCPBridge.sanitizeData(null)).toEqual({});
      expect(N8NMCPBridge.sanitizeData(undefined)).toEqual({});
    });

    it('should wrap non-objects', () => {
      expect(N8NMCPBridge.sanitizeData('string')).toEqual({ value: 'string' });
      expect(N8NMCPBridge.sanitizeData(123)).toEqual({ value: 123 });
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.circular = obj;
      
      const result = N8NMCPBridge.sanitizeData(obj);
      expect(result).toEqual({ a: 1, circular: '[Circular]' });
    });
  });

  describe('formatError', () => {
    it('should format standard errors', () => {
      const error = new Error('Test error');
      error.stack = 'stack trace';
      
      const result = N8NMCPBridge.formatError(error);
      
      expect(result).toEqual({
        message: 'Test error',
        type: 'Error',
        stack: 'stack trace',
        details: {
          code: undefined,
          statusCode: undefined,
          data: undefined,
        },
      });
    });

    it('should include additional error properties', () => {
      const error: any = new Error('API error');
      error.code = 'ERR_API';
      error.statusCode = 404;
      error.data = { field: 'value' };
      
      const result = N8NMCPBridge.formatError(error);
      
      expect(result.details).toEqual({
        code: 'ERR_API',
        statusCode: 404,
        data: { field: 'value' },
      });
    });
  });
});