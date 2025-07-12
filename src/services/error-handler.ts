import { logger } from '../utils/logger';

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorDetails {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  context?: Record<string, any>;
  stack?: string;
  timestamp: string;
  suggestion?: string;
  recoverable: boolean;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code?: string;
  public readonly context?: Record<string, any>;
  public readonly suggestion?: string;
  public readonly recoverable: boolean;
  public readonly timestamp: string;

  constructor(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    options: {
      code?: string;
      context?: Record<string, any>;
      suggestion?: string;
      recoverable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.code = options.code;
    this.context = options.context;
    this.suggestion = options.suggestion;
    this.recoverable = options.recoverable ?? true;
    this.timestamp = new Date().toISOString();

    if (options.cause) {
      this.cause = options.cause;
      this.stack = options.cause.stack;
    }
  }

  toJSON(): ErrorDetails {
    return {
      type: this.type,
      severity: this.severity,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
      timestamp: this.timestamp,
      suggestion: this.suggestion,
      recoverable: this.recoverable
    };
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCounts: Map<ErrorType, number> = new Map();
  private recentErrors: ErrorDetails[] = [];
  private maxRecentErrors: number = 100;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handle(error: Error | AppError, context?: Record<string, any>): ErrorDetails {
    const errorDetails = this.createErrorDetails(error, context);
    
    // Track error counts
    this.errorCounts.set(errorDetails.type, (this.errorCounts.get(errorDetails.type) || 0) + 1);
    
    // Store recent errors
    this.recentErrors.push(errorDetails);
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors.shift();
    }
    
    // Log the error
    this.logError(errorDetails);
    
    return errorDetails;
  }

  public createValidationError(
    message: string,
    field?: string,
    value?: any,
    suggestion?: string
  ): AppError {
    return new AppError(
      ErrorType.VALIDATION_ERROR,
      message,
      ErrorSeverity.LOW,
      {
        code: 'VALIDATION_FAILED',
        context: { field, value },
        suggestion: suggestion || 'Please check your input and try again',
        recoverable: true
      }
    );
  }

  public createDatabaseError(
    message: string,
    operation?: string,
    query?: string
  ): AppError {
    return new AppError(
      ErrorType.DATABASE_ERROR,
      message,
      ErrorSeverity.HIGH,
      {
        code: 'DATABASE_OPERATION_FAILED',
        context: { operation, query },
        suggestion: 'Please check database connection and try again',
        recoverable: true
      }
    );
  }

  public createNotFoundError(
    resource: string,
    identifier?: string
  ): AppError {
    return new AppError(
      ErrorType.NOT_FOUND_ERROR,
      `${resource} not found${identifier ? `: ${identifier}` : ''}`,
      ErrorSeverity.LOW,
      {
        code: 'RESOURCE_NOT_FOUND',
        context: { resource, identifier },
        suggestion: 'Please verify the resource identifier and try again',
        recoverable: true
      }
    );
  }

  public createConfigurationError(
    message: string,
    configKey?: string,
    expectedValue?: string
  ): AppError {
    return new AppError(
      ErrorType.CONFIGURATION_ERROR,
      message,
      ErrorSeverity.HIGH,
      {
        code: 'CONFIGURATION_INVALID',
        context: { configKey, expectedValue },
        suggestion: 'Please check your configuration and environment variables',
        recoverable: false
      }
    );
  }

  public createNetworkError(
    message: string,
    url?: string,
    statusCode?: number
  ): AppError {
    return new AppError(
      ErrorType.NETWORK_ERROR,
      message,
      ErrorSeverity.MEDIUM,
      {
        code: 'NETWORK_REQUEST_FAILED',
        context: { url, statusCode },
        suggestion: 'Please check network connectivity and try again',
        recoverable: true
      }
    );
  }

  public createAuthenticationError(
    message: string,
    method?: string
  ): AppError {
    return new AppError(
      ErrorType.AUTHENTICATION_ERROR,
      message,
      ErrorSeverity.HIGH,
      {
        code: 'AUTHENTICATION_FAILED',
        context: { method },
        suggestion: 'Please check your credentials and try again',
        recoverable: true
      }
    );
  }

  public createTimeoutError(
    message: string,
    operation?: string,
    timeout?: number
  ): AppError {
    return new AppError(
      ErrorType.TIMEOUT_ERROR,
      message,
      ErrorSeverity.MEDIUM,
      {
        code: 'OPERATION_TIMEOUT',
        context: { operation, timeout },
        suggestion: 'Please try again or increase timeout limit',
        recoverable: true
      }
    );
  }

  public createInternalError(
    message: string,
    component?: string,
    originalError?: Error
  ): AppError {
    return new AppError(
      ErrorType.INTERNAL_ERROR,
      message,
      ErrorSeverity.CRITICAL,
      {
        code: 'INTERNAL_SERVER_ERROR',
        context: { component },
        suggestion: 'Please contact support if this error persists',
        recoverable: false,
        cause: originalError
      }
    );
  }

  public wrapError(error: Error, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Try to classify the error based on its message/type
    const message = error.message.toLowerCase();
    let errorType = ErrorType.INTERNAL_ERROR;
    let severity = ErrorSeverity.MEDIUM;

    if (message.includes('database') || message.includes('sqlite')) {
      errorType = ErrorType.DATABASE_ERROR;
      severity = ErrorSeverity.HIGH;
    } else if (message.includes('network') || message.includes('fetch')) {
      errorType = ErrorType.NETWORK_ERROR;
    } else if (message.includes('timeout')) {
      errorType = ErrorType.TIMEOUT_ERROR;
    } else if (message.includes('not found')) {
      errorType = ErrorType.NOT_FOUND_ERROR;
      severity = ErrorSeverity.LOW;
    } else if (message.includes('validation') || message.includes('invalid')) {
      errorType = ErrorType.VALIDATION_ERROR;
      severity = ErrorSeverity.LOW;
    }

    return new AppError(
      errorType,
      error.message,
      severity,
      {
        context,
        cause: error,
        recoverable: severity !== ErrorSeverity.CRITICAL
      }
    );
  }

  public getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: ErrorDetails[];
  } {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    
    const errorsByType = Object.fromEntries(this.errorCounts.entries()) as Record<ErrorType, number>;
    
    const errorsBySeverity = this.recentErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    return {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      recentErrors: this.recentErrors.slice(-10) // Last 10 errors
    };
  }

  public clearStats(): void {
    this.errorCounts.clear();
    this.recentErrors = [];
  }

  private createErrorDetails(error: Error | AppError, context?: Record<string, any>): ErrorDetails {
    if (error instanceof AppError) {
      return {
        ...error.toJSON(),
        context: { ...error.context, ...context }
      };
    }

    // Handle regular errors
    return {
      type: ErrorType.INTERNAL_ERROR,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      context,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      recoverable: true
    };
  }

  private logError(errorDetails: ErrorDetails): void {
    const logLevel = this.getLogLevel(errorDetails.severity);
    
    const logData = {
      type: errorDetails.type,
      severity: errorDetails.severity,
      message: errorDetails.message,
      code: errorDetails.code,
      context: errorDetails.context,
      recoverable: errorDetails.recoverable,
      suggestion: errorDetails.suggestion
    };

    switch (logLevel) {
      case 'error':
        logger.error(logData);
        break;
      case 'warn':
        logger.warn(logData);
        break;
      case 'info':
        logger.info(logData);
        break;
      default:
        logger.debug(logData);
    }
  }

  private getLogLevel(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'error';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'debug';
    }
  }
}