
export class MCPConnectionPool {
  private static pools = new Map();
  private static maxConnections = 10;
  
  static getConnection(poolName: string) {
    if (!this.pools.has(poolName)) {
      this.pools.set(poolName, {
        active: 0,
        waiting: []
      });
    }
    
    const pool = this.pools.get(poolName);
    if (pool.active < this.maxConnections) {
      pool.active++;
      return Promise.resolve(`connection_${Date.now()}`);
    }
    
    return new Promise(resolve => {
      pool.waiting.push(resolve);
    });
  }
  
  static releaseConnection(poolName: string, _connectionId: string) {
    const pool = this.pools.get(poolName);
    if (pool) {
      pool.active--;
      if (pool.waiting.length > 0) {
        const next = pool.waiting.shift();
        pool.active++;
        next(`connection_${Date.now()}`);
      }
    }
  }
}
