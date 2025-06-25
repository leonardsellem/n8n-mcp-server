/**
 * Audit Logger for Security and Compliance
 * 
 * Comprehensive logging of all operations for security monitoring,
 * compliance requirements, and forensic analysis.
 */

import winston from 'winston';
import { promises as fs } from 'fs';
import path from 'path';

export interface AuditEvent {
  timestamp: string;
  eventType: string;
  operation: string;
  userId?: string;
  sessionId?: string;
  clientId?: string;
  resource?: string;
  resourceId?: string;
  action: string;
  result: 'success' | 'failure' | 'warning';
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  errorMessage?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditSearchCriteria {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  operation?: string;
  userId?: string;
  result?: 'success' | 'failure' | 'warning';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  limit?: number;
  offset?: number;
}

/**
 * Audit logger with structured logging and search capabilities
 */
export class AuditLogger {
  private logger: winston.Logger;
  private auditEvents: AuditEvent[] = [];
  private maxEvents = 10000; // Keep last 10K events in memory
  
  constructor(options: {
    logLevel?: string;
    logDirectory?: string;
    enableConsole?: boolean;
    enableFile?: boolean;
    maxFileSize?: string;
    maxFiles?: number;
  } = {}) {
    const {
      logLevel = 'info',
      logDirectory = './logs',
      enableConsole = true,
      enableFile = true,
      maxFileSize = '10m',
      maxFiles = 5
    } = options;

    // Create log directory if it doesn't exist
    this.ensureLogDirectory(logDirectory);

    // Configure transports
    const transports: winston.transport[] = [];

    if (enableConsole) {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
        )
      }));
    }

    if (enableFile) {
      // General application logs
      transports.push(new winston.transports.File({
        filename: path.join(logDirectory, 'application.log'),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: this.parseSize(maxFileSize),
        maxFiles
      }));

      // Audit-specific logs
      transports.push(new winston.transports.File({
        filename: path.join(logDirectory, 'audit.log'),
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: this.parseSize(maxFileSize),
        maxFiles
      }));

      // Error logs
      transports.push(new winston.transports.File({
        filename: path.join(logDirectory, 'error.log'),
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: this.parseSize(maxFileSize),
        maxFiles
      }));
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports
    });
  }

  /**
   * Log an audit event
   */
  logEvent(event: Omit<AuditEvent, 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    // Add to in-memory collection
    this.auditEvents.push(auditEvent);
    
    // Maintain max events limit
    if (this.auditEvents.length > this.maxEvents) {
      this.auditEvents = this.auditEvents.slice(-this.maxEvents);
    }

    // Log with appropriate level based on result and risk
    const logLevel = this.determineLogLevel(auditEvent);
    this.logger.log(logLevel, 'Audit Event', auditEvent);
  }

  /**
   * Log tool execution
   */
  logToolExecution(details: {
    toolName: string;
    userId?: string;
    sessionId?: string;
    args?: any;
    result: 'success' | 'failure';
    duration: number;
    errorMessage?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    this.logEvent({
      eventType: 'tool_execution',
      operation: details.toolName,
      userId: details.userId,
      sessionId: details.sessionId,
      action: 'execute',
      result: details.result,
      details: {
        args: this.sanitizeLogData(details.args),
        duration: details.duration
      },
      duration: details.duration,
      errorMessage: details.errorMessage,
      riskLevel: details.riskLevel || 'low'
    });
  }

  /**
   * Log API access
   */
  logApiAccess(details: {
    endpoint: string;
    method: string;
    userId?: string;
    sessionId?: string;
    statusCode: number;
    duration: number;
    ipAddress?: string;
    userAgent?: string;
  }): void {
    const result = details.statusCode >= 400 ? 'failure' : 'success';
    const riskLevel = details.statusCode >= 500 ? 'high' : 
                     details.statusCode >= 400 ? 'medium' : 'low';

    this.logEvent({
      eventType: 'api_access',
      operation: `${details.method} ${details.endpoint}`,
      userId: details.userId,
      sessionId: details.sessionId,
      action: details.method.toLowerCase(),
      result,
      details: {
        statusCode: details.statusCode,
        endpoint: details.endpoint
      },
      duration: details.duration,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      riskLevel
    });
  }

  /**
   * Log authentication events
   */
  logAuthentication(details: {
    userId?: string;
    sessionId?: string;
    result: 'success' | 'failure';
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): void {
    this.logEvent({
      eventType: 'authentication',
      operation: 'authenticate',
      userId: details.userId,
      sessionId: details.sessionId,
      action: 'login',
      result: details.result,
      details: {
        reason: details.reason
      },
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      riskLevel: details.result === 'failure' ? 'high' : 'low'
    });
  }

  /**
   * Log security events
   */
  logSecurityEvent(details: {
    eventType: string;
    description: string;
    userId?: string;
    sessionId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details?: any;
    ipAddress?: string;
  }): void {
    this.logEvent({
      eventType: 'security',
      operation: details.eventType,
      userId: details.userId,
      sessionId: details.sessionId,
      action: 'security_alert',
      result: 'warning',
      details: {
        description: details.description,
        ...details.details
      },
      ipAddress: details.ipAddress,
      riskLevel: details.severity
    });
  }

  /**
   * Log data access events
   */
  logDataAccess(details: {
    resource: string;
    resourceId?: string;
    action: 'read' | 'write' | 'delete' | 'update';
    userId?: string;
    sessionId?: string;
    result: 'success' | 'failure';
    details?: any;
  }): void {
    const riskLevel = details.action === 'delete' ? 'high' :
                     details.action === 'write' || details.action === 'update' ? 'medium' : 'low';

    this.logEvent({
      eventType: 'data_access',
      operation: details.resource,
      userId: details.userId,
      sessionId: details.sessionId,
      resource: details.resource,
      resourceId: details.resourceId,
      action: details.action,
      result: details.result,
      details: this.sanitizeLogData(details.details),
      riskLevel
    });
  }

  /**
   * Search audit events
   */
  searchEvents(criteria: AuditSearchCriteria): AuditEvent[] {
    let filteredEvents = [...this.auditEvents];

    if (criteria.startDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.timestamp) >= criteria.startDate!
      );
    }

    if (criteria.endDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.timestamp) <= criteria.endDate!
      );
    }

    if (criteria.eventType) {
      filteredEvents = filteredEvents.filter(
        event => event.eventType === criteria.eventType
      );
    }

    if (criteria.operation) {
      filteredEvents = filteredEvents.filter(
        event => event.operation.includes(criteria.operation!)
      );
    }

    if (criteria.userId) {
      filteredEvents = filteredEvents.filter(
        event => event.userId === criteria.userId
      );
    }

    if (criteria.result) {
      filteredEvents = filteredEvents.filter(
        event => event.result === criteria.result
      );
    }

    if (criteria.riskLevel) {
      filteredEvents = filteredEvents.filter(
        event => event.riskLevel === criteria.riskLevel
      );
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination
    const offset = criteria.offset || 0;
    const limit = criteria.limit || 100;
    
    return filteredEvents.slice(offset, offset + limit);
  }

  /**
   * Get audit statistics
   */
  getStatistics(timeRange?: { start: Date; end: Date }): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByResult: Record<string, number>;
    eventsByRiskLevel: Record<string, number>;
    recentErrors: AuditEvent[];
    topOperations: Array<{ operation: string; count: number }>;
  } {
    let events = this.auditEvents;
    
    if (timeRange) {
      events = events.filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime >= timeRange.start && eventTime <= timeRange.end;
      });
    }

    const eventsByType: Record<string, number> = {};
    const eventsByResult: Record<string, number> = {};
    const eventsByRiskLevel: Record<string, number> = {};
    const operationCounts: Record<string, number> = {};

    for (const event of events) {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      eventsByResult[event.result] = (eventsByResult[event.result] || 0) + 1;
      eventsByRiskLevel[event.riskLevel] = (eventsByRiskLevel[event.riskLevel] || 0) + 1;
      operationCounts[event.operation] = (operationCounts[event.operation] || 0) + 1;
    }

    const topOperations = Object.entries(operationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([operation, count]) => ({ operation, count }));

    const recentErrors = events
      .filter(event => event.result === 'failure')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalEvents: events.length,
      eventsByType,
      eventsByResult,
      eventsByRiskLevel,
      recentErrors,
      topOperations
    };
  }

  /**
   * Export audit events to JSON
   */
  async exportEvents(
    criteria: AuditSearchCriteria,
    outputPath: string
  ): Promise<void> {
    const events = this.searchEvents(criteria);
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      criteria,
      eventCount: events.length,
      events
    };

    await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2), 'utf8');
  }

  /**
   * Clear old audit events
   */
  clearOldEvents(olderThan: Date): number {
    const originalLength = this.auditEvents.length;
    this.auditEvents = this.auditEvents.filter(
      event => new Date(event.timestamp) > olderThan
    );
    return originalLength - this.auditEvents.length;
  }

  /**
   * Determine log level based on event details
   */
  private determineLogLevel(event: AuditEvent): string {
    if (event.result === 'failure' || event.riskLevel === 'critical') {
      return 'error';
    }
    if (event.riskLevel === 'high') {
      return 'warn';
    }
    return 'info';
  }

  /**
   * Sanitize sensitive data from logs
   */
  private sanitizeLogData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      'password', 'apiKey', 'token', 'secret', 'credential',
      'authorization', 'auth', 'key', 'private'
    ];

    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowercaseKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowercaseKey.includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitize(value);
        }
      }
      return sanitized;
    };

    return sanitize(data);
  }

  /**
   * Parse file size string to bytes
   */
  private parseSize(size: string): number {
    const units: Record<string, number> = {
      'b': 1,
      'k': 1024,
      'm': 1024 * 1024,
      'g': 1024 * 1024 * 1024
    };

    const match = size.toLowerCase().match(/^(\d+)([kmg]?)$/);
    if (!match) return 10 * 1024 * 1024; // Default 10MB

    const [, num, unit] = match;
    return parseInt(num) * (units[unit] || 1);
  }

  /**
   * Ensure log directory exists
   */
  private async ensureLogDirectory(logDirectory: string): Promise<void> {
    try {
      await fs.access(logDirectory);
    } catch {
      await fs.mkdir(logDirectory, { recursive: true });
    }
  }
}

// Global audit logger instance
let globalAuditLogger: AuditLogger | null = null;

/**
 * Get or create global audit logger
 */
export function getAuditLogger(options?: any): AuditLogger {
  if (!globalAuditLogger) {
    globalAuditLogger = new AuditLogger(options);
  }
  return globalAuditLogger;
}

/**
 * Audit logging decorator for tool handlers
 */
export function withAuditLogging(
  eventType: string,
  operation: string,
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const auditLogger = getAuditLogger();
      const startTime = Date.now();
      
      const context = args[0] || {};
      const sessionId = context.sessionId || context.clientId || 'unknown';

      try {
        const result = await method.apply(this, args);
        
        auditLogger.logEvent({
          eventType,
          operation,
          sessionId,
          action: propertyName,
          result: 'success',
          duration: Date.now() - startTime,
          details: {
            args: auditLogger['sanitizeLogData'](args[0])
          },
          riskLevel
        });

        return result;
      } catch (error) {
        auditLogger.logEvent({
          eventType,
          operation,
          sessionId,
          action: propertyName,
          result: 'failure',
          duration: Date.now() - startTime,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          details: {
            args: auditLogger['sanitizeLogData'](args[0])
          },
          riskLevel: 'high'
        });

        throw error;
      }
    };

    return descriptor;
  };
}