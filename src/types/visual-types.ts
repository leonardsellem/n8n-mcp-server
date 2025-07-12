// src/types/visual-types.ts

export interface VisualVerificationResult {
  screenshot: Buffer;
  issues: VisualIssue[];
  nodePositions: NodePosition[];
  connectionPaths: ConnectionPath[];
  overallHealth: 'healthy' | 'warning' | 'error';
  base64Image: string;
}

export interface VisualIssue {
  type: 'overlap' | 'error' | 'outdated' | 'disconnected' | 'crossing';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedNodes: string[];
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface NodePosition {
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hasError: boolean;
  isOutdated: boolean;
  isDisabled: boolean;
}

export interface ConnectionPath {
  from: string;
  to: string;
  fromOutput: number;
  toInput: number;
  path: Array<{ x: number; y: number }>;
  crosses: boolean;
}

export interface WorkflowData {
  nodes: any[];
  connections: any;
  [key: string]: any;
}

/**
 * Custom error class for MCP operations
 */
export class MCPError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.details = details;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MCPError);
    }
  }

  /**
   * Convert to MCP protocol error format
   */
  toMCPFormat(): any {
    return {
      error: {
        code: this.code,
        message: this.message,
        data: this.details
      }
    };
  }

  /**
   * Create from generic error
   */
  static fromError(error: any, code = 'UNKNOWN_ERROR'): MCPError {
    if (error instanceof MCPError) {
      return error;
    }
    
    return new MCPError(
      error.message || 'An unknown error occurred',
      code,
      {
        originalError: error.name,
        stack: error.stack
      }
    );
  }
}
