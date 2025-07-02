declare module 'find-config' {
  function findConfig(filename: string, options?: { cwd?: string }): string | null;
  export = findConfig;
}
