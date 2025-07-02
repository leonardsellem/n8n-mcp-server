declare module 'sql.js' {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    export(): Uint8Array;
    close(): void;
  }

  interface Statement {
    bind(params?: any): void;
    step(): boolean;
    get(): any[];
    getAsObject(): any;
    run(): void;
    reset(): void;
  }

  interface SQLJSStatic {
    Database: new (data?: Uint8Array) => Database;
  }

  interface InitSqlJs {
    (config?: { locateFile?: (file: string) => string }): Promise<SQLJSStatic>;
  }

  const initSqlJs: InitSqlJs;
  export default initSqlJs;
}
