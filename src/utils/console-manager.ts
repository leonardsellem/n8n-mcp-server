/**
 * Console Manager for MCP HTTP Server
 * 
 * Prevents console output from interfering with StreamableHTTPServerTransport
 * by silencing console methods during MCP request handling.
 */
export class ConsoleManager {
  private originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    trace: console.trace
  };
  
  private isSilenced = false;
  
  /**
   * Silence all console output
   */
  public silence(): void {
    if (this.isSilenced || process.env.MCP_MODE !== 'http') {
      return;
    }
    
    this.isSilenced = true;
    process.env.MCP_REQUEST_ACTIVE = 'true';
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
  }
  
  /**
   * Restore original console methods
   */
  public restore(): void {
    if (!this.isSilenced) {
      return;
    }
    
    this.isSilenced = false;
    process.env.MCP_REQUEST_ACTIVE = 'false';
    console.log = this.originalConsole.log;
    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
    console.info = this.originalConsole.info;
    console.debug = this.originalConsole.debug;
    console.trace = this.originalConsole.trace;
  }
  
  /**
   * Wrap an operation with console silencing
   * Automatically restores console on completion or error
   */
  public async wrapOperation<T>(operation: () => T | Promise<T>): Promise<T> {
    this.silence();
    try {
      const result = operation();
      if (result instanceof Promise) {
        return await result.finally(() => this.restore());
      }
      this.restore();
      return result;
    } catch (error) {
      this.restore();
      throw error;
    }
  }
  
  /**
   * Check if console is currently silenced
   */
  public get isActive(): boolean {
    return this.isSilenced;
  }
}

// Export singleton instance for easy use
export const consoleManager = new ConsoleManager();