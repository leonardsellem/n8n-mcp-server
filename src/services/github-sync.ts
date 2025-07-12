// src/services/github-sync.ts

// Dynamic import for ESM compatibility
let Octokit: any;
import { promises as fs } from 'fs';
import path from 'path';
import cron from 'node-cron';
import { logger } from '../utils/logger';

/**
 * GitHub Synchronization Configuration
 */
export interface GitHubSyncConfig {
  token: string;
  repository?: string;
  paths?: string[];
  localCachePath: string;
  syncInterval?: string; // cron expression
  enabled?: boolean;
}

/**
 * Synchronization Result
 */
export interface SyncResult {
  updated: number;
  added: number;
  removed: number;
  errors: string[];
  lastCommit: string;
  syncTime: Date;
  duration: number;
}

/**
 * File Information
 */
interface FileInfo {
  name: string;
  path: string;
  sha: string;
  type: 'node' | 'credential';
}

/**
 * GitHub Synchronization Manager
 * 
 * This class handles the automatic synchronization of n8n node definitions
 * from the official GitHub repository. It's designed to keep your MCP server
 * aware of the latest node types, preventing AI from creating workflows
 * with outdated or deprecated nodes.
 */
export class GitHubSync {
  private octokit: any;
  private config: GitHubSyncConfig;
  private localCachePath: string;
  private syncState: {
    lastCommit: string | null;
    lastSyncTime: Date | null;
    fileHashes: Map<string, string>;
  };
  private cronJob: any = null;
  private isRunning = false;
  private initialized = false;

  constructor(config: GitHubSyncConfig) {
    this.config = {
      ...config,
      repository: config.repository || 'n8n-io/n8n',
      paths: config.paths || [
        'packages/nodes-base/nodes',
        'packages/nodes-base/credentials'
      ],
      syncInterval: config.syncInterval || '0 */6 * * *', // Every 6 hours
      enabled: config.enabled !== false
    };
    
    // Will be initialized in initialize() method
    this.localCachePath = config.localCachePath;
    this.syncState = {
      lastCommit: null,
      lastSyncTime: null,
      fileHashes: new Map()
    };
  }

  /**
   * Initialize the synchronization system
   * Sets up cache directories and loads previous sync state
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialize Octokit with dynamic import for ESM compatibility
      if (!Octokit) {
        const octokitModule = await import('@octokit/rest');
        Octokit = octokitModule.Octokit;
      }
      this.octokit = new Octokit({ auth: this.config.token });
      
      // Create cache directory structure
      await fs.mkdir(this.localCachePath, { recursive: true });
      await fs.mkdir(path.join(this.localCachePath, 'nodes'), { recursive: true });
      await fs.mkdir(path.join(this.localCachePath, 'credentials'), { recursive: true });
      
      // Load previous sync state if it exists
      await this.loadSyncState();
      
      // Start scheduled sync if enabled
      if (this.config.enabled && this.config.syncInterval) {
        this.startScheduledSync();
      }
      
      this.initialized = true;
      logger.info('[GitHub Sync] Initialized successfully', {
        cachePath: this.localCachePath,
        lastSync: this.syncState.lastSyncTime,
        enabled: this.config.enabled
      });
      
    } catch (error) {
      logger.error('[GitHub Sync] Initialization failed', error);
      throw new Error(`Failed to initialize GitHub sync: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Start scheduled synchronization
   */
  private startScheduledSync(): void {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    this.cronJob = cron.schedule(this.config.syncInterval!, async () => {
      try {
        logger.info('[GitHub Sync] Starting scheduled sync');
        await this.syncNodes();
      } catch (error) {
        logger.error('[GitHub Sync] Scheduled sync failed', error);
      }
    });

    this.cronJob.start();
    logger.info(`[GitHub Sync] Scheduled sync started: ${this.config.syncInterval}`);
  }

  /**
   * Stop scheduled synchronization
   */
  stopScheduledSync(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      logger.info('[GitHub Sync] Scheduled sync stopped');
    }
  }

  /**
   * Perform synchronization with GitHub repository
   * 
   * @param force - Force full sync even if no new commits
   * @returns Sync result with statistics
   */
  async syncNodes(force = false): Promise<SyncResult> {
    if (this.isRunning) {
      logger.warn('[GitHub Sync] Sync already in progress, skipping');
      throw new Error('Sync already in progress');
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    const result: SyncResult = {
      updated: 0,
      added: 0,
      removed: 0,
      errors: [],
      lastCommit: '',
      syncTime: new Date(),
      duration: 0
    };

    logger.info(`[GitHub Sync] Starting sync (force: ${force})`);

    try {
      // Get latest commit information
      const latestCommit = await this.getLatestCommit();
      result.lastCommit = latestCommit.sha;

      // Check if sync is needed
      if (!force && this.syncState.lastCommit === latestCommit.sha) {
        logger.info('[GitHub Sync] Already up to date');
        result.duration = Date.now() - startTime;
        return result;
      }

      // Get all node and credential files from repository
      const files = await this.getRepositoryFiles();
      logger.info(`[GitHub Sync] Found ${files.length} files to process`);

      // Process all files
      for (const file of files) {
        try {
          await this.processFile(file, result);
        } catch (error) {
          logger.error(`[GitHub Sync] Error processing ${file.name}`, error);
          result.errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Clean up removed files
      await this.cleanupRemovedFiles(files, result);

      // Update sync state
      this.syncState.lastCommit = latestCommit.sha;
      this.syncState.lastSyncTime = new Date();
      await this.saveSyncState();

      result.duration = Date.now() - startTime;

      logger.info(`[GitHub Sync] Sync completed in ${result.duration}ms`, {
        added: result.added,
        updated: result.updated,
        removed: result.removed,
        errors: result.errors.length
      });

      return result;

    } catch (error) {
      logger.error('[GitHub Sync] Sync failed', error);
      throw new Error(`GitHub synchronization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get the latest commit from the repository
   */
  private async getLatestCommit(): Promise<any> {
    try {
      const [owner, repo] = this.config.repository!.split('/');
      
      const { data: commits } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        path: 'packages/nodes-base',
        per_page: 1
      });

      if (commits.length === 0) {
        throw new Error('No commits found');
      }

      return commits[0];
    } catch (error) {
      throw new Error(`Failed to get latest commit from GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all node and credential files from the repository
   */
  private async getRepositoryFiles(): Promise<FileInfo[]> {
    const [owner, repo] = this.config.repository!.split('/');
    const files: FileInfo[] = [];

    for (const searchPath of this.config.paths!) {
      try {
        const pathFiles = await this.getFilesFromPath(owner, repo, searchPath);
        files.push(...pathFiles);
      } catch (error) {
        logger.error(`[GitHub Sync] Error reading path ${searchPath}`, error);
      }
    }

    return files;
  }

  /**
   * Recursively get files from a repository path
   */
  private async getFilesFromPath(owner: string, repo: string, searchPath: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    try {
      const { data: contents } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: searchPath
      });

      if (!Array.isArray(contents)) {
        // Single file
        if (this.isRelevantFile(contents.name)) {
          files.push(this.createFileInfo(contents));
        }
        return files;
      }

      // Directory - process all items
      for (const item of contents) {
        if (item.type === 'file' && this.isRelevantFile(item.name)) {
          files.push(this.createFileInfo(item));
        } else if (item.type === 'dir') {
          // Recursively process subdirectories
          const subFiles = await this.getFilesFromPath(owner, repo, item.path);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      logger.error(`[GitHub Sync] Error processing path ${searchPath}`, error);
    }

    return files;
  }

  /**
   * Check if a file is relevant for our sync
   */
  private isRelevantFile(fileName: string): boolean {
    return fileName.endsWith('.node.ts') || 
           fileName.endsWith('.node.json') || 
           fileName.endsWith('.credentials.ts');
  }

  /**
   * Create FileInfo object from GitHub API response
   */
  private createFileInfo(item: any): FileInfo {
    const type = item.name.endsWith('.credentials.ts') ? 'credential' : 'node';
    return {
      name: item.name,
      path: item.path,
      sha: item.sha,
      type
    };
  }

  /**
   * Process a single file - download and save if needed
   */
  private async processFile(file: FileInfo, result: SyncResult): Promise<void> {
    const localPath = path.join(this.localCachePath, file.type === 'credential' ? 'credentials' : 'nodes', file.name);
    
    // Check if file exists and has same content
    const existingHash = this.syncState.fileHashes.get(file.path);
    if (existingHash === file.sha && await this.fileExists(localPath)) {
      // File unchanged, skip
      return;
    }

    // Download file content
    const [owner, repo] = this.config.repository!.split('/');
    const { data: fileData } = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path: file.path
    });

    if ('content' in fileData && fileData.content) {
      // Decode base64 content
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      
      // Save to local cache
      await fs.writeFile(localPath, content, 'utf-8');
      
      // Update hash tracking
      const isNew = !this.syncState.fileHashes.has(file.path);
      this.syncState.fileHashes.set(file.path, file.sha);
      
      if (isNew) {
        result.added++;
        logger.info(`[GitHub Sync] Added: ${file.name}`);
      } else {
        result.updated++;
        logger.info(`[GitHub Sync] Updated: ${file.name}`);
      }
    }
  }

  /**
   * Clean up files that were removed from the repository
   */
  private async cleanupRemovedFiles(currentFiles: FileInfo[], result: SyncResult): Promise<void> {
    // Get all current file paths from repository
    const currentPaths = new Set(currentFiles.map(f => f.path));

    // Check tracked files for removals
    const removedPaths: string[] = [];
    for (const [trackedPath] of this.syncState.fileHashes) {
      if (!currentPaths.has(trackedPath)) {
        removedPaths.push(trackedPath);
      }
    }

    // Remove files and update tracking
    for (const removedPath of removedPaths) {
      const fileName = path.basename(removedPath);
      const type = removedPath.includes('/credentials/') ? 'credentials' : 'nodes';
      const localPath = path.join(this.localCachePath, type, fileName);
      
      try {
        await fs.unlink(localPath);
        this.syncState.fileHashes.delete(removedPath);
        result.removed++;
        logger.info(`[GitHub Sync] Removed: ${fileName}`);
      } catch (error) {
        logger.error(`[GitHub Sync] Error removing ${fileName}`, error);
      }
    }
  }

  /**
   * Load sync state from disk
   */
  private async loadSyncState(): Promise<void> {
    const statePath = path.join(this.localCachePath, 'sync-state.json');
    
    try {
      const stateContent = await fs.readFile(statePath, 'utf-8');
      const savedState = JSON.parse(stateContent);
      
      this.syncState.lastCommit = savedState.lastCommit;
      this.syncState.lastSyncTime = savedState.lastSyncTime ? new Date(savedState.lastSyncTime) : null;
      this.syncState.fileHashes = new Map(savedState.fileHashes || []);
      
      logger.info('[GitHub Sync] Loaded sync state from disk');
    } catch (error) {
      // State file doesn't exist yet, that's ok for first run
      logger.info('[GitHub Sync] No previous sync state found, starting fresh');
    }
  }

  /**
   * Save sync state to disk
   */
  private async saveSyncState(): Promise<void> {
    const statePath = path.join(this.localCachePath, 'sync-state.json');
    
    try {
      const stateToSave = {
        lastCommit: this.syncState.lastCommit,
        lastSyncTime: this.syncState.lastSyncTime,
        fileHashes: Array.from(this.syncState.fileHashes.entries())
      };
      
      await fs.writeFile(statePath, JSON.stringify(stateToSave, null, 2), 'utf-8');
      logger.info('[GitHub Sync] Saved sync state to disk');
    } catch (error) {
      logger.error('[GitHub Sync] Failed to save sync state', error);
    }
  }

  /**
   * Check if a file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get list of cached node files
   */
  async getCachedNodeFiles(): Promise<string[]> {
    try {
      const nodesDir = path.join(this.localCachePath, 'nodes');
      const files = await fs.readdir(nodesDir);
      return files.filter(f => f.endsWith('.node.ts') || f.endsWith('.node.json'));
    } catch (error) {
      logger.error('[GitHub Sync] Error reading cached node files', error);
      return [];
    }
  }

  /**
   * Get list of cached credential files
   */
  async getCachedCredentialFiles(): Promise<string[]> {
    try {
      const credentialsDir = path.join(this.localCachePath, 'credentials');
      const files = await fs.readdir(credentialsDir);
      return files.filter(f => f.endsWith('.credentials.ts'));
    } catch (error) {
      logger.error('[GitHub Sync] Error reading cached credential files', error);
      return [];
    }
  }

  /**
   * Read a cached file's content
   */
  async readCachedFile(fileName: string, type: 'nodes' | 'credentials' = 'nodes'): Promise<string> {
    const filePath = path.join(this.localCachePath, type, fileName);
    
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read cached file: ${fileName} (${error instanceof Error ? error.message : 'Unknown error'})`);
    }
  }

  /**
   * Get sync statistics
   */
  getSyncStats(): {
    lastCommit: string | null;
    lastSyncTime: Date | null;
    totalFiles: number;
    nodeFiles: number;
    credentialFiles: number;
  } {
    const nodeFiles = Array.from(this.syncState.fileHashes.keys())
      .filter(path => path.includes('/nodes/')).length;
    const credentialFiles = Array.from(this.syncState.fileHashes.keys())
      .filter(path => path.includes('/credentials/')).length;

    return {
      lastCommit: this.syncState.lastCommit,
      lastSyncTime: this.syncState.lastSyncTime,
      totalFiles: this.syncState.fileHashes.size,
      nodeFiles,
      credentialFiles
    };
  }

  /**
   * Force refresh a specific file from GitHub
   */
  async refreshFile(filePath: string): Promise<void> {
    const [owner, repo] = this.config.repository!.split('/');
    
    try {
      const { data: fileData } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath
      });

      if ('content' in fileData && fileData.content) {
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const fileName = path.basename(filePath);
        const type = filePath.includes('/credentials/') ? 'credentials' : 'nodes';
        const localPath = path.join(this.localCachePath, type, fileName);
        
        await fs.writeFile(localPath, content, 'utf-8');
        this.syncState.fileHashes.set(filePath, fileData.sha);
        
        logger.info(`[GitHub Sync] Refreshed file: ${fileName}`);
      }
    } catch (error) {
      throw new Error(`Failed to refresh file: ${filePath} (${error instanceof Error ? error.message : 'Unknown error'})`);
    }
  }
}
