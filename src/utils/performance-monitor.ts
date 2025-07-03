export class MCPPerformanceMonitor {
  private static metrics = new Map();
  private static timings = new Map<string, number>();
  
  static startTiming(operation: string) {
    this.timings.set(operation, Date.now());
  }
  
  static endTiming(operation: string): number {
    if (this.timings.has(operation)) {
      const duration = Date.now() - this.timings.get(operation)!;
      this.timings.delete(operation);
      return duration;
    }
    return 0;
  }
  
  static logNodeUsage(nodeName: string, success: boolean) {
    const key = `node_${nodeName}`;
    const current = this.metrics.get(key) || { success: 0, failure: 0 };
    current[success ? 'success' : 'failure']++;
    this.metrics.set(key, current);
  }
  
  static getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  static clearMetrics() {
    this.metrics.clear();
    this.timings.clear();
  }
}
