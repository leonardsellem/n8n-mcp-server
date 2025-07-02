/**
 * Simple logger utility for the MCP server
 * Respects stdio mode for quiet operation
 */

export interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

class SimpleLogger implements Logger {
  private shouldLog(): boolean {
    // Only log in non-stdio mode to avoid interfering with MCP communication
    return process.env.MCP_MODE !== 'stdio';
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    if (data) {
      console.debug(`[DEBUG] ${message}`, data);
    } else {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    if (data) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    if (data) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }

  error(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    if (data) {
      console.error(`[ERROR] ${message}`, data);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
}

export const logger = new SimpleLogger();
