import { HybridNodeLoader, HybridLoaderConfig } from '../loaders/hybrid-node-loader';
import { HotReloadRepository } from '../database/hot-reload-repository';
import { GitHubWebhookService, GitHubWebhookConfig } from './github-webhook-service';
import { cacheManager } from '../utils/enhanced-cache-manager';
import { NodeParser } from '../parsers/node-parser';
import { DocsMapper } from '../mappers/docs-mapper';
import { createDatabaseAdapter } from '../database/database-adapter';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';
import cron from 'node-cron';

export interface AutoUpdateConfig {
  enabled: boolean;
  github: {
    token: string;
    repository: string;
    cachePath: string;
    syncInterval: string;
  };
  webhook: GitHubWebhookConfig;
  fallbackToLocal: boolean;
  prioritizeGitHub: boolean;
  autoRebuildInterval: string;
  maxConcurrentUpdates: number;
}

export interface UpdateEvent {
  type: 'sync_started' | 'sync_completed' | 'sync_failed' | 'webhook_received' | 'rebuild_started' | 'rebuild_completed';
  timestamp: Date;
  details: any;
  duration?: number;
}

export interface UpdateStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  lastSync: Date | null;
  totalWebhooks: number;
  lastWebhook: Date | null;
  lastRebuild: Date | null;
  nodesUpdated: number;
  cacheHitRate: number;
}

/**
 * Auto-Update Service - Complete GitHub Integration
 * 
 * This service orchestrates the entire auto-update process:
 * - Real-time GitHub webhook handling
 * - Periodic GitHub synchronization
 * - Hot database reloading
 * - Automatic cache invalidation
 * - Comprehensive monitoring and statistics
 * - Fallback to local NPM packages
 */
export class AutoUpdateService extends EventEmitter {
  private config: AutoUpdateConfig;
  private hybridLoader: HybridNodeLoader;
  private hotReloadRepository: HotReloadRepository;
  private webhookService: GitHubWebhookService;
  private nodeParser: NodeParser;
  private docsMapper: DocsMapper;
  
  private cronJobs: Map<string, any> = new Map();
  private updateQueue: any[] = [];
  private isProcessingUpdate = false;
  private stats: UpdateStats;
  private eventHistory: UpdateEvent[] = [];

  constructor(config: AutoUpdateConfig) {
    super();
    
    this.config = {
      enabled: true,
      fallbackToLocal: true,
      prioritizeGitHub: true,
      autoRebuildInterval: '0 2 * * *', // Daily at 2 AM
      maxConcurrentUpdates: 3,
      ...config
    };

    this.nodeParser = new NodeParser();
    this.docsMapper = new DocsMapper();
    
    this.stats = {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      lastSync: null,
      totalWebhooks: 0,
      lastWebhook: null,
      lastRebuild: null,
      nodesUpdated: 0,
      cacheHitRate: 0
    };
  }

  /**
   * Initialize the auto-update service
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('[Auto Update] Service disabled by configuration');
      return;
    }

    try {
      logger.info('[Auto Update] Initializing auto-update service...');

      // Initialize database
      const db = await createDatabaseAdapter('./data/nodes.db');
      this.hotReloadRepository = new HotReloadRepository(db);

      // Initialize hybrid loader
      const hybridConfig: HybridLoaderConfig = {
        github: {
          token: this.config.github.token,
          localCachePath: this.config.github.cachePath,
          enabled: true
        },
        fallbackToLocal: this.config.fallbackToLocal,
        prioritizeGitHub: this.config.prioritizeGitHub,
        autoSync: true,
        syncInterval: this.config.github.syncInterval
      };

      this.hybridLoader = new HybridNodeLoader(hybridConfig);
      await this.hybridLoader.initialize();

      // Initialize webhook service
      this.webhookService = new GitHubWebhookService(this.config.webhook);
      await this.webhookService.start();

      // Setup event handlers
      this.setupEventHandlers();

      // Setup scheduled tasks
      this.setupScheduledTasks();

      // Perform initial sync
      await this.performInitialSync();

      logger.info('[Auto Update] Service initialized successfully');
      this.emitEvent('sync_started', { type: 'initialization' });

    } catch (error) {
      logger.error('[Auto Update] Initialization failed', error);
      throw new Error(`Auto-update service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Setup event handlers for integration
   */
  private setupEventHandlers(): void {
    // GitHub webhook events
    this.webhookService.on('webhook', async (webhookEvent) => {
      this.stats.totalWebhooks++;
      this.stats.lastWebhook = new Date();
      
      logger.info('[Auto Update] GitHub webhook received', {
        type: webhookEvent.type,
        repository: webhookEvent.repository,
        nodeFiles: webhookEvent.files?.filter(f => f.isNodeFile).length || 0
      });

      this.emitEvent('webhook_received', webhookEvent);

      // Queue update if node files were changed
      if (webhookEvent.files?.some(f => f.isNodeFile)) {
        await this.queueUpdate({
          type: 'webhook_triggered',
          source: 'github',
          files: webhookEvent.files.filter(f => f.isNodeFile),
          priority: 'high'
        });
      }
    });

    // Node change events from hot reload repository
    this.hotReloadRepository.onNodeChange((event) => {
      logger.debug('[Auto Update] Node change detected', event);
      this.stats.nodesUpdated++;
    });

    // Cache manager events
    cacheManager.on('invalidated', (event) => {
      logger.debug('[Auto Update] Cache invalidated', event);
    });
  }

  /**
   * Setup scheduled tasks
   */
  private setupScheduledTasks(): void {
    // Periodic GitHub sync
    if (this.config.github.syncInterval) {
      const syncJob = cron.schedule(this.config.github.syncInterval, async () => {
        await this.performScheduledSync();
      });
      this.cronJobs.set('github_sync', syncJob);
      syncJob.start();
      logger.info(`[Auto Update] Scheduled GitHub sync: ${this.config.github.syncInterval}`);
    }

    // Periodic database rebuild
    if (this.config.autoRebuildInterval) {
      const rebuildJob = cron.schedule(this.config.autoRebuildInterval, async () => {
        await this.performScheduledRebuild();
      });
      this.cronJobs.set('auto_rebuild', rebuildJob);
      rebuildJob.start();
      logger.info(`[Auto Update] Scheduled database rebuild: ${this.config.autoRebuildInterval}`);
    }

    // Statistics update
    const statsJob = cron.schedule('*/5 * * * *', () => {
      this.updateStatistics();
    });
    this.cronJobs.set('stats_update', statsJob);
    statsJob.start();
  }

  /**
   * Perform initial sync
   */
  private async performInitialSync(): Promise<void> {
    try {
      logger.info('[Auto Update] Starting initial sync...');
      const startTime = Date.now();

      const hasUpdates = await this.hybridLoader.checkForUpdates();
      if (hasUpdates) {
        await this.performDatabaseUpdate();
      }

      const duration = Date.now() - startTime;
      this.stats.lastSync = new Date();
      this.stats.successfulSyncs++;

      this.emitEvent('sync_completed', { 
        type: 'initial', 
        hasUpdates,
        duration 
      });

      logger.info(`[Auto Update] Initial sync completed in ${duration}ms`);
    } catch (error) {
      this.stats.failedSyncs++;
      logger.error('[Auto Update] Initial sync failed', error);
      this.emitEvent('sync_failed', { type: 'initial', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  /**
   * Perform scheduled GitHub sync
   */
  private async performScheduledSync(): Promise<void> {
    if (this.isProcessingUpdate) {
      logger.debug('[Auto Update] Skipping scheduled sync - update in progress');
      return;
    }

    try {
      logger.info('[Auto Update] Starting scheduled GitHub sync...');
      const startTime = Date.now();

      this.stats.totalSyncs++;
      const hasUpdates = await this.hybridLoader.checkForUpdates();
      
      if (hasUpdates) {
        await this.performDatabaseUpdate();
      }

      const duration = Date.now() - startTime;
      this.stats.lastSync = new Date();
      this.stats.successfulSyncs++;

      this.emitEvent('sync_completed', { 
        type: 'scheduled', 
        hasUpdates,
        duration 
      });

      logger.info(`[Auto Update] Scheduled sync completed in ${duration}ms`, { hasUpdates });
    } catch (error) {
      this.stats.failedSyncs++;
      logger.error('[Auto Update] Scheduled sync failed', error);
      this.emitEvent('sync_failed', { type: 'scheduled', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  /**
   * Perform scheduled database rebuild
   */
  private async performScheduledRebuild(): Promise<void> {
    try {
      logger.info('[Auto Update] Starting scheduled database rebuild...');
      const startTime = Date.now();
      
      this.emitEvent('rebuild_started', { type: 'scheduled' });
      
      // Force sync from GitHub first
      await this.hybridLoader.forceSyncFromGitHub();
      
      // Rebuild database with new nodes
      await this.performDatabaseRebuild();
      
      const duration = Date.now() - startTime;
      this.stats.lastRebuild = new Date();
      
      this.emitEvent('rebuild_completed', { 
        type: 'scheduled',
        duration 
      });

      logger.info(`[Auto Update] Scheduled rebuild completed in ${duration}ms`);
    } catch (error) {
      logger.error('[Auto Update] Scheduled rebuild failed', error);
    }
  }

  /**
   * Queue an update for processing
   */
  private async queueUpdate(updateRequest: any): Promise<void> {
    this.updateQueue.push({
      ...updateRequest,
      timestamp: new Date(),
      id: this.generateUpdateId()
    });

    logger.debug(`[Auto Update] Update queued: ${updateRequest.type}`, {
      queueLength: this.updateQueue.length
    });

    // Process queue if not already processing
    if (!this.isProcessingUpdate) {
      await this.processUpdateQueue();
    }
  }

  /**
   * Process the update queue
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.isProcessingUpdate || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessingUpdate = true;

    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift();
        if (update) {
          await this.processUpdate(update);
        }
      }
    } finally {
      this.isProcessingUpdate = false;
    }
  }

  /**
   * Process a single update
   */
  private async processUpdate(update: any): Promise<void> {
    try {
      logger.info(`[Auto Update] Processing update: ${update.type}`, { id: update.id });

      switch (update.type) {
        case 'webhook_triggered':
          await this.handleWebhookUpdate(update);
          break;
        case 'manual_sync':
          await this.handleManualSync(update);
          break;
        default:
          logger.warn(`[Auto Update] Unknown update type: ${update.type}`);
      }
    } catch (error) {
      logger.error(`[Auto Update] Failed to process update ${update.id}`, error);
    }
  }

  /**
   * Handle webhook-triggered update
   */
  private async handleWebhookUpdate(update: any): Promise<void> {
    // Force sync from GitHub to get latest changes
    await this.hybridLoader.checkForUpdates();
    
    // Update database with new/changed nodes
    await this.performDatabaseUpdate();
  }

  /**
   * Handle manual sync request
   */
  private async handleManualSync(update: any): Promise<void> {
    await this.hybridLoader.forceSyncFromGitHub();
    await this.performDatabaseUpdate();
  }

  /**
   * Perform database update with new nodes
   */
  private async performDatabaseUpdate(): Promise<void> {
    try {
      // Load all nodes (will include updated ones from GitHub)
      const nodes = await this.hybridLoader.loadAllNodes();
      
      // Parse and save updated nodes
      const parsedNodes = [];
      for (const { packageName, nodeName, NodeClass } of nodes) {
        try {
          const parsed = this.nodeParser.parse(NodeClass, packageName);
          
          // Get documentation
          const docs = await this.docsMapper.fetchDocumentation(parsed.nodeType);
          parsed.documentation = docs || undefined;
          
          parsedNodes.push(parsed);
        } catch (error) {
          logger.error(`[Auto Update] Failed to parse node ${nodeName}`, error);
        }
      }
      
      // Batch update the database
      await this.hotReloadRepository.batchUpdateFromGitHub(parsedNodes);
      
      logger.info(`[Auto Update] Database updated with ${parsedNodes.length} nodes`);
    } catch (error) {
      logger.error('[Auto Update] Database update failed', error);
      throw error;
    }
  }

  /**
   * Perform complete database rebuild
   */
  private async performDatabaseRebuild(): Promise<void> {
    // This would be similar to the original rebuild script
    // but using the hybrid loader and hot reload repository
    const nodes = await this.hybridLoader.loadAllNodes();
    const parsedNodes = [];
    
    for (const { packageName, nodeName, NodeClass } of nodes) {
      try {
        const parsed = this.nodeParser.parse(NodeClass, packageName);
        const docs = await this.docsMapper.fetchDocumentation(parsed.nodeType);
        parsed.documentation = docs || undefined;
        parsedNodes.push(parsed);
      } catch (error) {
        logger.error(`[Auto Update] Failed to parse node ${nodeName} during rebuild`, error);
      }
    }
    
    // Clear database and rebuild
    await this.hotReloadRepository.flushPendingOperations();
    // Clear existing data would go here
    await this.hotReloadRepository.batchUpdateFromGitHub(parsedNodes);
  }

  /**
   * Update statistics
   */
  private updateStatistics(): void {
    const cacheStats = cacheManager.getCacheStatistics();
    const totalHits = Array.from(cacheStats.values()).reduce((sum, stat) => sum + stat.totalHits, 0);
    const totalRequests = Array.from(cacheStats.values()).reduce((sum, stat) => sum + stat.totalHits + stat.totalMisses, 0);
    
    this.stats.cacheHitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
  }

  /**
   * Force manual sync
   */
  async forceManuqlSync(): Promise<void> {
    await this.queueUpdate({
      type: 'manual_sync',
      source: 'manual',
      priority: 'high'
    });
  }

  /**
   * Get service statistics
   */
  getStats(): UpdateStats {
    return { ...this.stats };
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      enabled: this.config.enabled,
      isProcessingUpdate: this.isProcessingUpdate,
      queueLength: this.updateQueue.length,
      stats: this.getStats(),
      cronJobs: Array.from(this.cronJobs.keys()),
      webhookStats: this.webhookService.getWebhookStats(),
      cacheStats: cacheManager.getCacheHealthReport(),
      hotReloadStats: this.hotReloadRepository.getHotReloadStats()
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 20): UpdateEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Stop the auto-update service
   */
  async stop(): Promise<void> {
    logger.info('[Auto Update] Stopping service...');
    
    // Stop cron jobs
    for (const [name, job] of this.cronJobs) {
      job.stop();
      logger.debug(`[Auto Update] Stopped cron job: ${name}`);
    }
    this.cronJobs.clear();
    
    // Stop webhook service
    await this.webhookService.stop();
    
    // Stop GitHub sync
    this.hybridLoader.stopGitHubSync();
    
    // Flush pending operations
    await this.hotReloadRepository.flushPendingOperations();
    
    logger.info('[Auto Update] Service stopped');
  }

  /**
   * Generate unique update ID
   */
  private generateUpdateId(): string {
    return `upd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Emit and store event
   */
  private emitEvent(type: UpdateEvent['type'], details: any): void {
    const event: UpdateEvent = {
      type,
      timestamp: new Date(),
      details
    };
    
    this.eventHistory.push(event);
    
    // Keep only recent events
    if (this.eventHistory.length > 200) {
      this.eventHistory = this.eventHistory.slice(-100);
    }
    
    this.emit(type, event);
  }
}

// Export singleton instance factory
export function createAutoUpdateService(config: AutoUpdateConfig): AutoUpdateService {
  return new AutoUpdateService(config);
}