import {
  MCPError,
  N8NConnectionError,
  AuthenticationError,
  ValidationError,
  ToolNotFoundError,
  ResourceNotFoundError,
  handleError,
  withErrorHandling,
} from '../src/utils/error-handler';
import { logger } from '../src/utils/logger';

// Mock the logger
jest.mock('../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Error Classes', () => {
  describe('MCPError', () => {
    it('should create error with all properties', () => {
      const error = new MCPError('Test error', 'TEST_CODE', 400, { field: 'value' });
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual({ field: 'value' });
      expect(error.name).toBe('MCPError');
    });
  });

  describe('N8NConnectionError', () => {
    it('should create connection error with correct code', () => {
      const error = new N8NConnectionError('Connection failed');
      
      expect(error.message).toBe('Connection failed');
      expect(error.code).toBe('N8N_CONNECTION_ERROR');
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe('N8NConnectionError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create auth error with default message', () => {
      const error = new AuthenticationError();
      
      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBe('AUTH_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should accept custom message', () => {
      const error = new AuthenticationError('Invalid token');
      expect(error.message).toBe('Invalid token');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual({ field: 'email' });
    });
  });

  describe('ToolNotFoundError', () => {
    it('should create tool not found error', () => {
      const error = new ToolNotFoundError('myTool');
      
      expect(error.message).toBe("Tool 'myTool' not found");
      expect(error.code).toBe('TOOL_NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('ResourceNotFoundError', () => {
    it('should create resource not found error', () => {
      const error = new ResourceNotFoundError('workflow://123');
      
      expect(error.message).toBe("Resource 'workflow://123' not found");
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
  });
});

describe('handleError', () => {
  it('should return MCPError instances as-is', () => {
    const mcpError = new ValidationError('Test');
    const result = handleError(mcpError);
    
    expect(result).toBe(mcpError);
  });

  it('should handle HTTP 401 errors', () => {
    const httpError = {
      response: { status: 401, data: { message: 'Unauthorized' } },
    };
    
    const result = handleError(httpError);
    
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result.message).toBe('Unauthorized');
  });

  it('should handle HTTP 404 errors', () => {
    const httpError = {
      response: { status: 404, data: { message: 'Not found' } },
    };
    
    const result = handleError(httpError);
    
    expect(result.code).toBe('NOT_FOUND');
    expect(result.statusCode).toBe(404);
  });

  it('should handle HTTP 5xx errors', () => {
    const httpError = {
      response: { status: 503, data: { message: 'Service unavailable' } },
    };
    
    const result = handleError(httpError);
    
    expect(result).toBeInstanceOf(N8NConnectionError);
  });

  it('should handle connection refused errors', () => {
    const connError = { code: 'ECONNREFUSED' };
    
    const result = handleError(connError);
    
    expect(result).toBeInstanceOf(N8NConnectionError);
    expect(result.message).toBe('Cannot connect to n8n API');
  });

  it('should handle generic errors', () => {
    const error = new Error('Something went wrong');
    
    const result = handleError(error);
    
    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.statusCode).toBe(500);
  });

  it('should handle errors without message', () => {
    const error = {};
    
    const result = handleError(error);
    
    expect(result.message).toBe('An unexpected error occurred');
  });
});

describe('withErrorHandling', () => {
  it('should execute operation successfully', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    
    const result = await withErrorHandling(operation, 'test operation');
    
    expect(result).toBe('success');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle and log errors', async () => {
    const error = new Error('Operation failed');
    const operation = jest.fn().mockRejectedValue(error);
    
    await expect(withErrorHandling(operation, 'test operation')).rejects.toThrow();
    
    expect(logger.error).toHaveBeenCalledWith('Error in test operation:', error);
  });

  it('should transform errors using handleError', async () => {
    const error = { code: 'ECONNREFUSED' };
    const operation = jest.fn().mockRejectedValue(error);
    
    try {
      await withErrorHandling(operation, 'test operation');
    } catch (err) {
      expect(err).toBeInstanceOf(N8NConnectionError);
    }
  });
});