import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * Unified database interface that abstracts better-sqlite3 and sql.js
 */
export interface DatabaseAdapter {
  prepare(sql: string): PreparedStatement;
  exec(sql: string): void;
  close(): void;
  pragma(key: string, value?: any): any;
  readonly inTransaction: boolean;
  transaction<T>(fn: () => T): T;
}

export interface PreparedStatement {
  run(...params: any[]): RunResult;
  get(...params: any[]): any;
  all(...params: any[]): any[];
  iterate(...params: any[]): IterableIterator<any>;
  pluck(toggle?: boolean): this;
  expand(toggle?: boolean): this;
  raw(toggle?: boolean): this;
  columns(): ColumnDefinition[];
  bind(...params: any[]): this;
}

export interface RunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface ColumnDefinition {
  name: string;
  column: string | null;
  table: string | null;
  database: string | null;
  type: string | null;
}

/**
 * Factory function to create a database adapter
 * Uses sql.js for universal compatibility (pure JavaScript, no native dependencies)
 */
export async function createDatabaseAdapter(dbPath: string): Promise<DatabaseAdapter> {
  // Log Node.js version information
  // Only log in non-stdio mode
  if (process.env.MCP_MODE !== 'stdio') {
    logger.info(`Node.js version: ${process.version}`);
  }
  // Only log in non-stdio mode
  if (process.env.MCP_MODE !== 'stdio') {
    logger.info(`Platform: ${process.platform} ${process.arch}`);
  }
  
  // Use sql.js for universal compatibility
  try {
    const adapter = await createSQLJSAdapter(dbPath);
    if (process.env.MCP_MODE !== 'stdio') {
      logger.info('Successfully initialized sql.js adapter (pure JavaScript, no native dependencies)');
    }
    return adapter;
  } catch (sqlJsError) {
    if (process.env.MCP_MODE !== 'stdio') {
      logger.error('Failed to initialize sql.js adapter', sqlJsError);
    }
    throw new Error('Failed to initialize database adapter');
  }
}


/**
 * Create sql.js adapter with persistence
 */
async function createSQLJSAdapter(dbPath: string): Promise<DatabaseAdapter> {
  const initSqlJs = require('sql.js');
  
  // Initialize sql.js
  const SQL = await initSqlJs({
    // This will look for the wasm file in node_modules
    locateFile: (file: string) => {
      if (file.endsWith('.wasm')) {
        return path.join(__dirname, '../../node_modules/sql.js/dist/', file);
      }
      return file;
    }
  });
  
  // Try to load existing database
  let db: any;
  try {
    const data = await fs.readFile(dbPath);
    db = new SQL.Database(new Uint8Array(data));
    logger.info(`Loaded existing database from ${dbPath}`);
  } catch (error) {
    // Create new database if file doesn't exist
    db = new SQL.Database();
    logger.info(`Created new database at ${dbPath}`);
  }
  
  return new SQLJSAdapter(db, dbPath);
}


/**
 * Adapter for sql.js with persistence
 */
class SQLJSAdapter implements DatabaseAdapter {
  private saveTimer: NodeJS.Timeout | null = null;
  
  constructor(private db: any, private dbPath: string) {
    // Set up auto-save on changes
    this.scheduleSave();
  }
  
  prepare(sql: string): PreparedStatement {
    const stmt = this.db.prepare(sql);
    this.scheduleSave();
    return new SQLJSStatement(stmt, () => this.scheduleSave());
  }
  
  exec(sql: string): void {
    this.db.exec(sql);
    this.scheduleSave();
  }
  
  close(): void {
    this.saveToFile();
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    this.db.close();
  }
  
  pragma(key: string, value?: any): any {
    // sql.js doesn't support pragma in the same way
    // We'll handle specific pragmas as needed
    if (key === 'journal_mode' && value === 'WAL') {
      // WAL mode not supported in sql.js, ignore
      return 'memory';
    }
    return null;
  }
  
  get inTransaction(): boolean {
    // sql.js doesn't expose transaction state
    return false;
  }
  
  transaction<T>(fn: () => T): T {
    // Simple transaction implementation for sql.js
    try {
      this.exec('BEGIN');
      const result = fn();
      this.exec('COMMIT');
      return result;
    } catch (error) {
      this.exec('ROLLBACK');
      throw error;
    }
  }
  
  private scheduleSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    
    // Save after 100ms of inactivity
    this.saveTimer = setTimeout(() => {
      this.saveToFile();
    }, 100);
  }
  
  private saveToFile(): void {
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fsSync.writeFileSync(this.dbPath, buffer);
      logger.debug(`Database saved to ${this.dbPath}`);
    } catch (error) {
      logger.error('Failed to save database', error);
    }
  }
}


/**
 * Statement wrapper for sql.js
 */
class SQLJSStatement implements PreparedStatement {
  private boundParams: any = null;
  
  constructor(private stmt: any, private onModify: () => void) {}
  
  run(...params: any[]): RunResult {
    if (params.length > 0) {
      this.bindParams(params);
      this.stmt.bind(this.boundParams);
    }
    
    this.stmt.run();
    this.onModify();
    
    // sql.js doesn't provide changes/lastInsertRowid easily
    return {
      changes: 0,
      lastInsertRowid: 0
    };
  }
  
  get(...params: any[]): any {
    if (params.length > 0) {
      this.bindParams(params);
    }
    
    this.stmt.bind(this.boundParams);
    
    if (this.stmt.step()) {
      const result = this.stmt.getAsObject();
      this.stmt.reset();
      return result;
    }
    
    this.stmt.reset();
    return undefined;
  }
  
  all(...params: any[]): any[] {
    if (params.length > 0) {
      this.bindParams(params);
    }
    
    this.stmt.bind(this.boundParams);
    
    const results: any[] = [];
    while (this.stmt.step()) {
      results.push(this.stmt.getAsObject());
    }
    
    this.stmt.reset();
    return results;
  }
  
  iterate(...params: any[]): IterableIterator<any> {
    // sql.js doesn't support generators well, return array iterator
    return this.all(...params)[Symbol.iterator]();
  }
  
  pluck(toggle?: boolean): this {
    // Not directly supported in sql.js
    return this;
  }
  
  expand(toggle?: boolean): this {
    // Not directly supported in sql.js
    return this;
  }
  
  raw(toggle?: boolean): this {
    // Not directly supported in sql.js
    return this;
  }
  
  columns(): ColumnDefinition[] {
    // sql.js has different column info
    return [];
  }
  
  bind(...params: any[]): this {
    this.bindParams(params);
    return this;
  }
  
  private bindParams(params: any[]): void {
    if (params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])) {
      // Named parameters passed as object
      this.boundParams = params[0];
    } else {
      // Positional parameters - sql.js uses array for positional
      this.boundParams = params;
    }
  }
}