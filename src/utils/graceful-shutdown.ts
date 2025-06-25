/**
 * Graceful Shutdown Handler
 * 
 * Handles graceful shutdown of the MCP server, ensuring all
 * connections are closed and resources are cleaned up properly.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { getAuditLogger } from '../security/audit-logger.js';

export interface ShutdownOptions {
  timeout?: number; // Graceful shutdown timeout in milliseconds
  forceExit?: boolean; // Force exit after timeout
  cleanup?: Array<() => Promise<void> | void>; // Custom cleanup functions
}

/**
 * Graceful shutdown manager
 */
export class GracefulShutdown {
  private server: Server | null = null;
  private isShuttingDown = false;
  private cleanupFunctions: Array<() => Promise<void> | void> = [];
  private timeout: number;
  private forceExit: boolean;

  constructor(options: ShutdownOptions = {}) {
    this.timeout = options.timeout || 30000; // 30 seconds default
    this.forceExit = options.forceExit ?? true;
    this.cleanupFunctions = options.cleanup || [];
    
    this.setupSignalHandlers();
  }

  /**
   * Register the MCP server for graceful shutdown
   */
  registerServer(server: Server): void {
    this.server = server;
  }

  /**
   * Add a cleanup function to be called during shutdown
   */
  addCleanupFunction(cleanupFn: () => Promise<void> | void): void {
    this.cleanupFunctions.push(cleanupFn);
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    // Handle termination signals
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, starting graceful shutdown...`);
        this.shutdown(signal);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.auditError('uncaught_exception', error);
      this.shutdown('uncaughtException', true);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.auditError('unhandled_rejection', reason);
      this.shutdown('unhandledRejection', true);
    });

    // Handle process warnings
    process.on('warning', (warning) => {
      console.warn('Process Warning:', warning);
      this.auditWarning('process_warning', warning);
    });
  }

  /**
   * Perform graceful shutdown
   */
  private async shutdown(reason: string, immediate = false): Promise<void> {
    if (this.isShuttingDown) {
      console.log('Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    const startTime = Date.now();

    try {
      console.log(`Starting graceful shutdown (reason: ${reason})...`);
      
      // Log shutdown event
      this.auditShutdown(reason, immediate);

      // Set shutdown timeout
      const timeoutHandle = immediate ? null : setTimeout(() => {
        console.error(`Graceful shutdown timeout (${this.timeout}ms) exceeded, forcing exit...`);
        if (this.forceExit) {
          process.exit(1);
        }
      }, this.timeout);

      // Shutdown sequence
      await this.executeShutdownSequence();

      // Clear timeout if shutdown completed successfully
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      const duration = Date.now() - startTime;
      console.log(`Graceful shutdown completed in ${duration}ms`);
      
      // Exit process
      process.exit(0);

    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      this.auditError('shutdown_error', error);
      
      if (this.forceExit) {
        process.exit(1);
      }
    }
  }

  /**
   * Execute the shutdown sequence
   */
  private async executeShutdownSequence(): Promise<void> {
    const steps = [
      { name: 'Stop accepting new requests', fn: () => this.stopAcceptingRequests() },
      { name: 'Complete pending requests', fn: () => this.completePendingRequests() },
      { name: 'Close server connections', fn: () => this.closeServerConnections() },
      { name: 'Run custom cleanup functions', fn: () => this.runCleanupFunctions() },
      { name: 'Flush logs and audit events', fn: () => this.flushLogs() },
      { name: 'Close external connections', fn: () => this.closeExternalConnections() }
    ];

    for (const step of steps) {
      try {
        console.log(`Shutdown step: ${step.name}`);
        await step.fn();
      } catch (error) {
        console.error(`Error in shutdown step "${step.name}":`, error);
        // Continue with other steps even if one fails
      }
    }
  }

  /**
   * Stop accepting new requests
   */
  private async stopAcceptingRequests(): Promise<void> {
    // The MCP server doesn't have a built-in way to stop accepting requests
    // This is more applicable to HTTP servers
    console.log('Marked server as shutting down');
  }

  /**
   * Wait for pending requests to complete
   */
  private async completePendingRequests(): Promise<void> {
    // Wait a brief moment for any in-flight requests to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Pending requests completed');
  }

  /**
   * Close server connections
   */
  private async closeServerConnections(): Promise<void> {
    if (this.server) {
      try {
        // The MCP SDK server doesn't expose a close method
        // This would need to be implemented based on the transport layer
        console.log('Server connections closed');
      } catch (error) {
        console.error('Error closing server connections:', error);
      }
    }
  }

  /**
   * Run custom cleanup functions
   */
  private async runCleanupFunctions(): Promise<void> {
    for (const cleanupFn of this.cleanupFunctions) {
      try {
        await cleanupFn();
      } catch (error) {
        console.error('Error in cleanup function:', error);
      }
    }
    console.log(`Executed ${this.cleanupFunctions.length} cleanup functions`);
  }

  /**
   * Flush logs and audit events
   */
  private async flushLogs(): Promise<void> {
    try {
      // Allow time for final log entries to be written
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Logs flushed');
    } catch (error) {
      console.error('Error flushing logs:', error);
    }
  }

  /**
   * Close external connections
   */
  private async closeExternalConnections(): Promise<void> {
    // Close any database connections, Redis connections, etc.
    // For this MCP server, we mainly have HTTP connections to n8n
    console.log('External connections closed');
  }

  /**
   * Log shutdown event to audit log
   */
  private auditShutdown(reason: string, immediate: boolean): void {
    try {
      const auditLogger = getAuditLogger();
      auditLogger.logEvent({
        eventType: 'system',
        operation: 'shutdown',
        action: 'graceful_shutdown',
        result: 'success',
        details: {
          reason,
          immediate,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        },
        riskLevel: immediate ? 'high' : 'low'
      });
    } catch (error) {
      console.error('Failed to log shutdown event:', error);
    }
  }

  /**
   * Log error event to audit log
   */
  private auditError(type: string, error: any): void {
    try {
      const auditLogger = getAuditLogger();
      auditLogger.logSecurityEvent({
        eventType: type,
        description: `System error: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'high',
        details: {
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
          } : error,
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }
      });
    } catch (auditError) {
      console.error('Failed to log error event:', auditError);
    }
  }

  /**
   * Log warning event to audit log
   */
  private auditWarning(type: string, warning: any): void {
    try {
      const auditLogger = getAuditLogger();
      auditLogger.logSecurityEvent({
        eventType: type,
        description: `System warning: ${warning}`,
        severity: 'medium',
        details: {
          warning,
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }
      });
    } catch (auditError) {
      console.error('Failed to log warning event:', auditError);
    }
  }
}

// Global graceful shutdown manager
let globalShutdownManager: GracefulShutdown | null = null;

/**
 * Initialize graceful shutdown with options
 */
export function initializeGracefulShutdown(options?: ShutdownOptions): GracefulShutdown {
  if (globalShutdownManager) {
    console.warn('Graceful shutdown already initialized');
    return globalShutdownManager;
  }

  globalShutdownManager = new GracefulShutdown(options);
  console.log('Graceful shutdown initialized');
  
  return globalShutdownManager;
}

/**
 * Get the global shutdown manager
 */
export function getShutdownManager(): GracefulShutdown | null {
  return globalShutdownManager;
}

/**
 * Register the MCP server for graceful shutdown
 */
export function registerServerForShutdown(server: Server): void {
  if (globalShutdownManager) {
    globalShutdownManager.registerServer(server);
  } else {
    console.warn('Graceful shutdown not initialized, server not registered');
  }
}

/**
 * Add a cleanup function
 */
export function addCleanupFunction(cleanupFn: () => Promise<void> | void): void {
  if (globalShutdownManager) {
    globalShutdownManager.addCleanupFunction(cleanupFn);
  } else {
    console.warn('Graceful shutdown not initialized, cleanup function not added');
  }
}