
export class MCPErrorHandler {
  static handle(error: Error, context: string) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    };
    
    console.error('🚨 MCP Error:', errorInfo);
    
    // Log to file if available
    if (typeof require !== 'undefined') {
      try {
        const fs = require('fs');
        fs.appendFileSync('logs/errors.log', JSON.stringify(errorInfo) + '\n');
      } catch {}
    }
    
    return errorInfo;
  }
  
  static isRetryable(error: Error): boolean {
    return error.message.includes('timeout') || 
           error.message.includes('network') ||
           error.message.includes('ECONNRESET');
  }
}