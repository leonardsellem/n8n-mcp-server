
export class MCPPerformanceMonitor {
  private static metrics = new Map();
  
  static startTiming(operation: string) {
    this.metrics.set(operation, performance.now());
  }
  
  static endTiming(operation: string) {
    const start = this.metrics.get(operation);
    if (start) {
      const duration = performance.now() - start;
      console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);
      return duration;
    }
  }
  
  static logNodeUsage(nodeName: string, success: boolean) {
    const key = `node_${nodeName}`;
    const current = this.metrics.get(key) || { success: 0, failure: 0 };
    current[success ? 'success' : 'failure']++;
    this.metrics.set(key, current);
  }
}