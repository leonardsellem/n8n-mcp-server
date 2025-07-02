import { logger } from './logger';

export class MCPError extends Error {
  public code: string;
  public statusCode?: number;
  public data?: any;

  constructor(message: string, code: string, statusCode?: number, data?: any) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class N8NConnectionError extends MCPError {
  constructor(message: string, data?: any) {
    super(message, 'N8N_CONNECTION_ERROR', 503, data);
    this.name = 'N8NConnectionError';
  }
}

export class AuthenticationError extends MCPError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends MCPError {
  constructor(message: string, data?: any) {
    super(message, 'VALIDATION_ERROR', 400, data);
    this.name = 'ValidationError';
  }
}

export class ToolNotFoundError extends MCPError {
  constructor(toolName: string) {
    super(`Tool '${toolName}' not found`, 'TOOL_NOT_FOUND', 404);
    this.name = 'ToolNotFoundError';
  }
}

export class ResourceNotFoundError extends MCPError {
  constructor(resourceUri: string) {
    super(`Resource '${resourceUri}' not found`, 'RESOURCE_NOT_FOUND', 404);
    this.name = 'ResourceNotFoundError';
  }
}

export function handleError(error: any): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (error.response) {
    // HTTP error from n8n API
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    if (status === 401) {
      return new AuthenticationError(message);
    } else if (status === 404) {
      return new MCPError(message, 'NOT_FOUND', 404);
    } else if (status >= 500) {
      return new N8NConnectionError(message);
    }
    
    return new MCPError(message, 'API_ERROR', status);
  }

  if (error.code === 'ECONNREFUSED') {
    return new N8NConnectionError('Cannot connect to n8n API');
  }

  // Generic error
  return new MCPError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  );
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.error(`Error in ${context}:`, error);
    throw handleError(error);
  }
}