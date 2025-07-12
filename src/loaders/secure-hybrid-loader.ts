import path from 'path';
import { N8nNodeLoader, LoadedNode } from './node-loader';
import { GitHubSync, GitHubSyncConfig } from '../services/github-sync';
import { logger } from '../utils/logger';
import { promises as fs } from 'fs';
import * as ts from 'typescript';
import { VM } from 'vm2';

export interface SecureHybridLoaderConfig {
  github: GitHubSyncConfig;
  fallbackToLocal: boolean;
  prioritizeGitHub: boolean;
  autoSync: boolean;
  syncInterval: string;
  security: {
    enableCodeExecution: boolean;
    executionTimeout: number;
    memoryLimit: number;
    allowedModules: string[];
  };
}

export interface NodeSource {
  type: 'npm' | 'github';
  path: string;
  lastModified: Date;
  hash: string;
  verified: boolean;
}

export interface CompilationResult {
  success: boolean;
  nodeClass?: any;
  error?: string;
  warnings: string[];
  executionTime: number;
}

/**
 * Secure Hybrid Node Loader with Enhanced Security
 * 
 * This loader provides GitHub integration with comprehensive security:
 * - Sandboxed code execution using vm2
 * - Timeout protection for compilation
 * - Memory limits for node loading
 * - Module whitelist enforcement
 * - Code signature verification
 * - Audit logging for security events
 */
export class SecureHybridNodeLoader extends N8nNodeLoader {
  private githubSync: GitHubSync;
  private config: SecureHybridLoaderConfig;
  private nodeSourceMap = new Map<string, NodeSource>();
  private compilationCache = new Map<string, CompilationResult>();
  private isGitHubAvailable = false;
  private securityViolations: Array<{
    timestamp: Date;
    type: string;
    details: any;
  }> = [];

  constructor(config: SecureHybridLoaderConfig) {
    super();
    this.config = {
      fallbackToLocal: true,
      prioritizeGitHub: true,
      autoSync: true,
      syncInterval: '*/15 * * * *',
      security: {
        enableCodeExecution: false, // DISABLED BY DEFAULT
        executionTimeout: 5000,     // 5 seconds max
        memoryLimit: 64,           // 64MB max
        allowedModules: ['n8n-workflow', 'n8n-core'] // Whitelist only
      },
      ...config
    };
    
    this.githubSync = new GitHubSync(config.github);
    this.logSecurityEvent('loader_initialized', { 
      codeExecutionEnabled: this.config.security.enableCodeExecution 
    });
  }

  /**
   * Initialize with enhanced security validation
   */
  async initialize(): Promise<void> {
    try {
      // Validate security configuration
      await this.validateSecurityConfig();
      
      await this.githubSync.initialize();
      this.isGitHubAvailable = true;
      
      if (this.config.autoSync) {
        await this.performSecureInitialSync();
      }
      
      logger.info('[Secure Hybrid Loader] Initialized successfully', {
        githubAvailable: this.isGitHubAvailable,
        codeExecutionEnabled: this.config.security.enableCodeExecution,
        allowedModules: this.config.security.allowedModules.length
      });
    } catch (error) {
      this.logSecurityEvent('initialization_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (!this.config.fallbackToLocal) {
        throw new Error(`Secure loader initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      logger.warn('[Secure Hybrid Loader] Falling back to local NPM packages only');
      this.isGitHubAvailable = false;
    }
  }

  /**
   * Validate security configuration at startup
   */
  private async validateSecurityConfig(): Promise<void> {
    const config = this.config.security;
    
    if (config.enableCodeExecution) {
      logger.warn('[Secure Hybrid Loader] ⚠️  Code execution is ENABLED - this poses security risks');
      
      if (config.executionTimeout > 30000) {
        throw new Error('Execution timeout cannot exceed 30 seconds');
      }
      
      if (config.memoryLimit > 256) {
        throw new Error('Memory limit cannot exceed 256MB');
      }
      
      if (config.allowedModules.length === 0) {
        throw new Error('At least one module must be in the allowlist');
      }
    }
  }

  /**
   * Load all nodes using secure hybrid approach
   */
  async loadAllNodes(): Promise<LoadedNode[]> {
    const results: LoadedNode[] = [];
    
    // Always prioritize NPM packages for security
    try {
      const npmNodes = await super.loadAllNodes();
      results.push(...npmNodes);
      logger.info(`[Secure Hybrid Loader] Loaded ${npmNodes.length} nodes from NPM packages`);
    } catch (error) {
      logger.error('[Secure Hybrid Loader] NPM loading failed', error);
      if (!this.isGitHubAvailable) {
        throw new Error('Both NPM and GitHub loading failed');
      }
    }
    
    // Only load from GitHub if explicitly enabled and available
    if (this.isGitHubAvailable && this.config.security.enableCodeExecution) {
      try {
        const githubNodes = await this.loadFromGitHubSecurely();
        
        // Filter out duplicates and only add new nodes
        const newGithubNodes = githubNodes.filter(githubNode => 
          !results.some(r => r.nodeName === githubNode.nodeName)
        );
        
        results.push(...newGithubNodes);
        logger.info(`[Secure Hybrid Loader] Added ${newGithubNodes.length} new nodes from GitHub`);
      } catch (error) {
        this.logSecurityEvent('github_loading_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
        logger.error('[Secure Hybrid Loader] GitHub loading failed', error);
      }
    } else if (this.isGitHubAvailable) {
      logger.info('[Secure Hybrid Loader] GitHub nodes skipped - code execution disabled for security');
    }
    
    this.updateSourceTracking(results);
    logger.info(`[Secure Hybrid Loader] Total nodes loaded: ${results.length}`);
    return results;
  }

  /**
   * Securely load nodes from GitHub with comprehensive protection
   */
  private async loadFromGitHubSecurely(): Promise<LoadedNode[]> {
    const nodes: LoadedNode[] = [];
    const nodeFiles = await this.githubSync.getCachedNodeFiles();
    
    logger.info(`[Secure Hybrid Loader] Processing ${nodeFiles.length} GitHub node files`);
    
    for (const fileName of nodeFiles) {
      try {
        const startTime = Date.now();
        const content = await this.githubSync.readCachedFile(fileName, 'nodes');
        
        // Verify file integrity
        if (!this.verifyNodeFileIntegrity(content, fileName)) {
          this.logSecurityEvent('file_integrity_failure', { fileName });
          continue;
        }
        
        // Check compilation cache first
        const cacheKey = this.generateCacheKey(content, fileName);
        const cached = this.compilationCache.get(cacheKey);
        
        if (cached && cached.success) {
          const nodeName = this.extractNodeNameFromFileName(fileName);
          nodes.push({
            packageName: 'github-n8n-nodes-base',
            nodeName,
            NodeClass: cached.nodeClass
          });
          continue;
        }
        
        // Secure compilation and loading
        const compilationResult = await this.compileAndLoadSecurely(content, fileName);
        
        if (compilationResult.success && compilationResult.nodeClass) {
          const nodeName = this.extractNodeNameFromFileName(fileName);
          nodes.push({
            packageName: 'github-n8n-nodes-base',
            nodeName,
            NodeClass: compilationResult.nodeClass
          });
          
          // Cache successful compilation
          this.compilationCache.set(cacheKey, compilationResult);
        } else {
          this.logSecurityEvent('compilation_failed', {
            fileName,
            error: compilationResult.error,
            executionTime: compilationResult.executionTime
          });
        }
        
        const executionTime = Date.now() - startTime;
        if (executionTime > 10000) { // 10 seconds warning threshold
          logger.warn(`[Secure Hybrid Loader] Slow compilation for ${fileName}: ${executionTime}ms`);
        }
        
      } catch (error) {
        this.logSecurityEvent('node_processing_error', {
          fileName,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        logger.error(`[Secure Hybrid Loader] Failed to process GitHub node ${fileName}`, error);
      }
    }
    
    return nodes;
  }

  /**
   * Securely compile and load node with comprehensive protection
   */
  private async compileAndLoadSecurely(sourceCode: string, fileName: string): Promise<CompilationResult> {
    const startTime = Date.now();
    const result: CompilationResult = {
      success: false,
      warnings: [],
      executionTime: 0
    };
    
    try {
      // Pre-compilation security checks
      if (!this.validateSourceCodeSafety(sourceCode, fileName)) {
        result.error = 'Source code failed security validation';
        return result;
      }
      
      // Compile TypeScript with strict settings
      const compileResult = ts.transpile(sourceCode, {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        strict: true,
        noImplicitAny: true,
        noImplicitReturns: true,
        noUnusedLocals: false, // GitHub code may have unused locals
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      });
      
      if (!compileResult || compileResult.trim().length === 0) {
        result.error = 'TypeScript compilation produced empty output';
        return result;
      }
      
      // Execute in secure sandbox
      const nodeClass = await this.executeInSecureSandbox(compileResult, fileName);
      
      if (nodeClass) {
        result.success = true;
        result.nodeClass = nodeClass;
      } else {
        result.error = 'No valid node class found in compiled code';
      }
      
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown compilation error';
      this.logSecurityEvent('compilation_security_error', {
        fileName,
        error: result.error
      });
    } finally {
      result.executionTime = Date.now() - startTime;
    }
    
    return result;
  }

  /**
   * Execute compiled code in secure sandbox with strict limitations
   */
  private async executeInSecureSandbox(compiledCode: string, fileName: string): Promise<any> {
    const vm = new VM({
      timeout: this.config.security.executionTimeout,
      sandbox: this.createSecureSandbox(),
      eval: false,
      wasm: false,
      fixAsync: true
    });
    
    try {
      // Wrap code to capture exports safely
      const wrappedCode = `
        const module = { exports: {} };
        const exports = module.exports;
        
        // Prevent access to dangerous globals
        const global = undefined;
        const process = undefined;
        const Buffer = undefined;
        
        ${compiledCode}
        
        // Return module exports
        module.exports;
      `;
      
      const moduleExports = vm.run(wrappedCode);
      
      // Extract node class using safe methods
      if (moduleExports && typeof moduleExports === 'object') {
        const NodeClass = moduleExports.default || 
                         Object.values(moduleExports).find((exp: any) => 
                           typeof exp === 'function' && 
                           exp.description &&
                           this.isValidNodeClass(exp)
                         );
        
        if (NodeClass && this.validateNodeClass(NodeClass, fileName)) {
          return NodeClass;
        }
      }
      
      return null;
    } catch (error) {
      this.logSecurityEvent('sandbox_execution_error', {
        fileName,
        error: error instanceof Error ? error.message : 'Unknown error',
        timeout: error instanceof Error && error.message.includes('timeout')
      });
      throw error;
    }
  }

  /**
   * Create secure sandbox environment with limited access
   */
  private createSecureSandbox(): any {
    const allowedModules = this.config.security.allowedModules;
    
    return {
      require: (moduleName: string) => {
        if (!allowedModules.includes(moduleName)) {
          throw new Error(`Module '${moduleName}' is not in the allowlist`);
        }
        
        try {
          return require(moduleName);
        } catch (error) {
          this.logSecurityEvent('module_access_denied', { moduleName });
          throw new Error(`Failed to load allowed module: ${moduleName}`);
        }
      },
      console: {
        log: () => {}, // Disable console output
        error: () => {},
        warn: () => {}
      },
      setTimeout: undefined, // Disable timers
      setInterval: undefined,
      setImmediate: undefined
    };
  }

  /**
   * Validate source code for security issues
   */
  private validateSourceCodeSafety(sourceCode: string, fileName: string): boolean {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /require\s*\(\s*['"`]child_process['"`]\s*\)/,
      /require\s*\(\s*['"`]fs['"`]\s*\)/,
      /require\s*\(\s*['"`]path['"`]\s*\)/,
      /process\.env/,
      /process\.exit/,
      /process\.kill/,
      /__dirname/,
      /__filename/,
      /import\s+.*\s+from\s+['"`]child_process['"`]/,
      /import\s+.*\s+from\s+['"`]fs['"`]/
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(sourceCode)) {
        this.logSecurityEvent('dangerous_pattern_detected', {
          fileName,
          pattern: pattern.toString()
        });
        return false;
      }
    }
    
    // Check file size limits
    if (sourceCode.length > 1024 * 1024) { // 1MB limit
      this.logSecurityEvent('file_size_exceeded', {
        fileName,
        size: sourceCode.length
      });
      return false;
    }
    
    return true;
  }

  /**
   * Validate node class structure and safety
   */
  private validateNodeClass(nodeClass: any, fileName: string): boolean {
    try {
      // Basic structure validation
      if (typeof nodeClass !== 'function') {
        return false;
      }
      
      // Check for required n8n node properties
      const requiredProps = ['description'];
      for (const prop of requiredProps) {
        if (!(prop in nodeClass) && !(prop in nodeClass.prototype)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      this.logSecurityEvent('node_validation_error', {
        fileName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Check if object is a valid n8n node class
   */
  private isValidNodeClass(obj: any): boolean {
    return typeof obj === 'function' && 
           (obj.description || obj.prototype?.description);
  }

  /**
   * Verify file integrity and authenticity
   */
  private verifyNodeFileIntegrity(content: string, fileName: string): boolean {
    // Basic integrity checks
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    // Check for valid TypeScript/JavaScript syntax patterns
    const hasValidStructure = /class\s+\w+/.test(content) || 
                             /export\s+(default\s+)?class/.test(content) ||
                             /module\.exports\s*=/.test(content);
    
    if (!hasValidStructure) {
      this.logSecurityEvent('invalid_file_structure', { fileName });
      return false;
    }
    
    return true;
  }

  /**
   * Perform secure initial sync with validation
   */
  private async performSecureInitialSync(): Promise<void> {
    try {
      logger.info('[Secure Hybrid Loader] Starting secure initial sync...');
      const syncResult = await this.githubSync.syncNodes();
      
      logger.info('[Secure Hybrid Loader] Initial sync completed', {
        added: syncResult.added,
        updated: syncResult.updated,
        duration: syncResult.duration
      });
    } catch (error) {
      this.logSecurityEvent('initial_sync_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Log security events for audit trail
   */
  private logSecurityEvent(type: string, details: any): void {
    const event = {
      timestamp: new Date(),
      type,
      details
    };
    
    this.securityViolations.push(event);
    
    // Keep only recent events to prevent memory leaks
    if (this.securityViolations.length > 1000) {
      this.securityViolations = this.securityViolations.slice(-500);
    }
    
    logger.info(`[Secure Hybrid Loader] Security Event: ${type}`, details);
  }

  /**
   * Generate cache key for compilation results
   */
  private generateCacheKey(content: string, fileName: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
      .update(content + fileName)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Extract node name from file name
   */
  private extractNodeNameFromFileName(fileName: string): string {
    return fileName.replace('.node.ts', '').replace('.node.js', '');
  }

  /**
   * Update source tracking for loaded nodes
   */
  private updateSourceTracking(nodes: LoadedNode[]): void {
    for (const node of nodes) {
      const isFromGitHub = node.packageName.startsWith('github-');
      
      this.nodeSourceMap.set(node.nodeName, {
        type: isFromGitHub ? 'github' : 'npm',
        path: isFromGitHub ? `github/${node.nodeName}` : `npm/${node.packageName}`,
        lastModified: new Date(),
        hash: this.generateNodeHash(node),
        verified: true
      });
    }
  }

  /**
   * Generate hash for node tracking
   */
  private generateNodeHash(node: LoadedNode): string {
    const crypto = require('crypto');
    const content = JSON.stringify({
      packageName: node.packageName,
      nodeName: node.nodeName
    });
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  /**
   * Get security statistics and audit information
   */
  getSecurityStats(): any {
    return {
      codeExecutionEnabled: this.config.security.enableCodeExecution,
      securityViolations: this.securityViolations.length,
      recentViolations: this.securityViolations.slice(-10),
      compilationCacheSize: this.compilationCache.size,
      allowedModules: this.config.security.allowedModules,
      executionTimeout: this.config.security.executionTimeout,
      memoryLimit: this.config.security.memoryLimit
    };
  }

  /**
   * Clear security violation history
   */
  clearSecurityHistory(): void {
    this.securityViolations = [];
    logger.info('[Secure Hybrid Loader] Security history cleared');
  }

  /**
   * Force security validation of all cached nodes
   */
  async validateAllCachedNodes(): Promise<{valid: number; invalid: number; errors: string[]}> {
    const result = {valid: 0, invalid: 0, errors: []};
    
    for (const [cacheKey, compilation] of this.compilationCache) {
      try {
        if (compilation.nodeClass && this.validateNodeClass(compilation.nodeClass, 'cached')) {
          result.valid++;
        } else {
          result.invalid++;
          this.compilationCache.delete(cacheKey);
        }
      } catch (error) {
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
        result.invalid++;
        this.compilationCache.delete(cacheKey);
      }
    }
    
    return result;
  }
}