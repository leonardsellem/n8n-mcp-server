import { logger } from './logger.js';

/**
 * ConsoleManager - Handles console output wrapping for MCP operations
 * Prevents MCP protocol interference with stdout/stderr
 */
export class ConsoleManager {
  private originalConsole: {
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
    info: typeof console.info;
    debug: typeof console.debug;
  };

  constructor() {
    // Store original console methods
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    };
  }

  /**
   * Temporarily redirect console output to logger during MCP operations
   */
  private redirectConsole(): void {
    console.log = (...args: any[]) => logger.info('Console.log:', args.join(' '));
    console.error = (...args: any[]) => logger.error('Console.error:', args.join(' '));
    console.warn = (...args: any[]) => logger.warn('Console.warn:', args.join(' '));
    console.info = (...args: any[]) => logger.info('Console.info:', args.join(' '));
    console.debug = (...args: any[]) => logger.debug('Console.debug:', args.join(' '));
  }

  /**
   * Restore original console methods
   */
  private restoreConsole(): void {
    console.log = this.originalConsole.log;
    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
    console.info = this.originalConsole.info;
    console.debug = this.originalConsole.debug;
  }

  /**
   * Wrap an operation to prevent console interference with MCP protocol
   */
  async wrapOperation<T>(operation: () => Promise<T>): Promise<T> {
    // For HTTP transport, we don't need to redirect console
    // This is mainly for stdio transport where console interferes with MCP protocol
    try {
      return await operation();
    } catch (error) {
      logger.error('Console-wrapped operation failed:', error);
      throw error;
    }
  }

  /**
   * Safely log a message without interfering with MCP protocol
   */
  safelog(message: string, ...args: any[]): void {
    logger.info(message, ...args);
  }

  /**
   * Safely log an error without interfering with MCP protocol  
   */
  safeError(message: string, error?: any): void {
    logger.error(message, error);
  }
}
