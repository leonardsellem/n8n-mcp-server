import { DatabaseAdapter, PreparedStatement, RunResult, ColumnDefinition } from './database-adapter';
import { PerformanceMonitor } from '../services/performance-monitor';
import { logger } from '../utils/logger';

/**
 * Enhanced database adapter with performance monitoring and optimizations
 */
export class OptimizedDatabaseAdapter implements DatabaseAdapter {
  private adapter: DatabaseAdapter;
  private performanceMonitor: PerformanceMonitor;
  private preparedStatements: Map<string, PreparedStatement> = new Map();
  private queryCount: number = 0;
  private slowQueryThreshold: number = 100; // 100ms

  constructor(adapter: DatabaseAdapter) {
    this.adapter = adapter;
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.setupOptimizations();
  }

  private setupOptimizations(): void {
    // Set SQLite performance optimizations
    try {
      this.adapter.pragma('journal_mode', 'WAL');
      this.adapter.pragma('synchronous', 'NORMAL');
      this.adapter.pragma('cache_size', 10000);
      this.adapter.pragma('temp_store', 'memory');
      this.adapter.pragma('mmap_size', 268435456); // 256MB
      
      logger.debug('Database performance optimizations applied');
    } catch (error) {
      logger.warn('Failed to apply some database optimizations:', error);
    }
  }

  prepare(sql: string): PreparedStatement {
    // Check if we already have this prepared statement cached
    const cached = this.preparedStatements.get(sql);
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    const stmt = this.adapter.prepare(sql);
    const duration = Date.now() - startTime;

    // Wrap the prepared statement with performance monitoring
    const wrappedStmt = new OptimizedPreparedStatement(stmt, this.performanceMonitor, sql);
    
    // Cache the prepared statement
    this.preparedStatements.set(sql, wrappedStmt);
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > this.slowQueryThreshold) {
      logger.warn(`Slow query preparation: ${sql} took ${duration}ms`);
    }
    
    return wrappedStmt;
  }

  exec(sql: string): void {
    const startTime = Date.now();
    this.adapter.exec(sql);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    this.queryCount++;
    
    if (duration > this.slowQueryThreshold) {
      logger.warn(`Slow exec query: ${sql} took ${duration}ms`);
    }
  }

  close(): void {
    this.preparedStatements.clear();
    this.adapter.close();
  }

  pragma(key: string, value?: any): any {
    return this.adapter.pragma(key, value);
  }

  get inTransaction(): boolean {
    return this.adapter.inTransaction;
  }

  transaction<T>(fn: () => T): T {
    const startTime = Date.now();
    const result = this.adapter.transaction(fn);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > this.slowQueryThreshold) {
      logger.warn(`Slow transaction took ${duration}ms`);
    }
    
    return result;
  }

  getQueryCount(): number {
    return this.queryCount;
  }

  clearPreparedStatements(): void {
    this.preparedStatements.clear();
  }
}

/**
 * Optimized prepared statement with performance monitoring
 */
class OptimizedPreparedStatement implements PreparedStatement {
  constructor(
    private stmt: PreparedStatement,
    private performanceMonitor: PerformanceMonitor,
    private sql: string
  ) {}

  run(...params: any[]): RunResult {
    const startTime = Date.now();
    const result = this.stmt.run(...params);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > 100) {
      logger.warn(`Slow run query: ${this.sql} took ${duration}ms`);
    }
    
    return result;
  }

  get(...params: any[]): any {
    const startTime = Date.now();
    const result = this.stmt.get(...params);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > 100) {
      logger.warn(`Slow get query: ${this.sql} took ${duration}ms`);
    }
    
    return result;
  }

  all(...params: any[]): any[] {
    const startTime = Date.now();
    const result = this.stmt.all(...params);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > 100) {
      logger.warn(`Slow all query: ${this.sql} took ${duration}ms`);
    }
    
    return result;
  }

  iterate(...params: any[]): IterableIterator<any> {
    const startTime = Date.now();
    const result = this.stmt.iterate(...params);
    const duration = Date.now() - startTime;
    
    this.performanceMonitor.recordDatabaseQuery(duration);
    
    if (duration > 100) {
      logger.warn(`Slow iterate query: ${this.sql} took ${duration}ms`);
    }
    
    return result;
  }

  pluck(toggle?: boolean): this {
    this.stmt.pluck(toggle);
    return this;
  }

  expand(toggle?: boolean): this {
    this.stmt.expand(toggle);
    return this;
  }

  raw(toggle?: boolean): this {
    this.stmt.raw(toggle);
    return this;
  }

  columns(): ColumnDefinition[] {
    return this.stmt.columns();
  }

  bind(...params: any[]): this {
    this.stmt.bind(...params);
    return this;
  }
}

/**
 * Connection pool for database adapters
 */
export class DatabaseConnectionPool {
  private pool: OptimizedDatabaseAdapter[] = [];
  private available: OptimizedDatabaseAdapter[] = [];
  private inUse: Set<OptimizedDatabaseAdapter> = new Set();
  private maxSize: number;
  private createConnection: () => Promise<DatabaseAdapter>;

  constructor(
    createConnection: () => Promise<DatabaseAdapter>,
    maxSize: number = 5
  ) {
    this.createConnection = createConnection;
    this.maxSize = maxSize;
  }

  async getConnection(): Promise<OptimizedDatabaseAdapter> {
    // Try to get an available connection
    if (this.available.length > 0) {
      const connection = this.available.pop()!;
      this.inUse.add(connection);
      return connection;
    }

    // Create a new connection if we haven't reached the max size
    if (this.pool.length < this.maxSize) {
      const adapter = await this.createConnection();
      const optimizedAdapter = new OptimizedDatabaseAdapter(adapter);
      this.pool.push(optimizedAdapter);
      this.inUse.add(optimizedAdapter);
      return optimizedAdapter;
    }

    // Wait for a connection to become available
    return new Promise((resolve) => {
      const checkForAvailable = () => {
        if (this.available.length > 0) {
          const connection = this.available.pop()!;
          this.inUse.add(connection);
          resolve(connection);
        } else {
          setTimeout(checkForAvailable, 10);
        }
      };
      checkForAvailable();
    });
  }

  releaseConnection(connection: OptimizedDatabaseAdapter): void {
    if (this.inUse.has(connection)) {
      this.inUse.delete(connection);
      this.available.push(connection);
    }
  }

  async executeWithConnection<T>(
    fn: (connection: OptimizedDatabaseAdapter) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection();
    try {
      return await fn(connection);
    } finally {
      this.releaseConnection(connection);
    }
  }

  closeAll(): void {
    for (const connection of this.pool) {
      connection.close();
    }
    this.pool = [];
    this.available = [];
    this.inUse.clear();
  }

  getStats(): {
    totalConnections: number;
    availableConnections: number;
    inUseConnections: number;
  } {
    return {
      totalConnections: this.pool.length,
      availableConnections: this.available.length,
      inUseConnections: this.inUse.size
    };
  }
}