import { logger } from './logger';
import { EventEmitter } from 'events';

export interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
  heapUsedPercent: number;
  lastGC?: Date;
}

export interface MemoryThresholds {
  warning: number;    // Percentage of heap usage that triggers warning
  critical: number;   // Percentage that triggers aggressive cleanup
  maximum: number;    // Absolute maximum before forcing exit
}

export interface MemoryManagerConfig {
  enabled: boolean;
  monitoringIntervalMs: number;
  thresholds: MemoryThresholds;
  enableGCLogging: boolean;
  maxCacheSize: number;
  autoCleanup: boolean;
}

/**
 * Memory Manager with Proactive Monitoring and Cleanup
 * 
 * Provides comprehensive memory management:
 * - Real-time memory monitoring
 * - Automatic garbage collection triggering
 * - Cache size management
 * - Memory leak detection
 * - Resource cleanup coordination
 * - Emergency shutdown procedures
 */
export class MemoryManager extends EventEmitter {
  private config: MemoryManagerConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastMemoryStats: MemoryStats | null = null;
  private memoryHistory: MemoryStats[] = [];
  private cleanupHandlers: Array<() => Promise<void>> = [];
  private isCleaningUp = false;
  private emergencyShutdownTriggered = false;

  constructor(config: Partial<MemoryManagerConfig> = {}) {
    super();
    
    this.config = {
      enabled: true,
      monitoringIntervalMs: 30000, // 30 seconds
      thresholds: {
        warning: 70,   // 70% heap usage
        critical: 85,  // 85% heap usage
        maximum: 95    // 95% heap usage
      },
      enableGCLogging: false,
      maxCacheSize: 256 * 1024 * 1024, // 256MB
      autoCleanup: true,
      ...config
    };

    if (this.config.enabled) {
      this.startMonitoring();
      this.setupGCLogging();
    }
  }

  /**
   * Start memory monitoring
   */
  startMonitoring(): void {
    if (this.monitoringInterval) {
      return;
    }

    logger.info('[Memory Manager] Starting memory monitoring', {
      interval: this.config.monitoringIntervalMs,
      thresholds: this.config.thresholds
    });

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, this.config.monitoringIntervalMs);

    // Initial check
    this.checkMemoryUsage();
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('[Memory Manager] Memory monitoring stopped');
    }
  }

  /**
   * Check current memory usage and take action if needed
   */
  private checkMemoryUsage(): void {
    const stats = this.getMemoryStats();
    this.lastMemoryStats = stats;
    
    // Store in history (keep last 100 entries)
    this.memoryHistory.push(stats);
    if (this.memoryHistory.length > 100) {
      this.memoryHistory.shift();
    }

    // Emit memory stats event
    this.emit('memory_stats', stats);

    // Check thresholds and take action
    if (stats.heapUsedPercent >= this.config.thresholds.maximum) {
      this.handleCriticalMemoryUsage(stats);
    } else if (stats.heapUsedPercent >= this.config.thresholds.critical) {
      this.handleHighMemoryUsage(stats);
    } else if (stats.heapUsedPercent >= this.config.thresholds.warning) {
      this.handleWarningMemoryUsage(stats);
    }

    // Log periodic stats (every 5 minutes)
    if (this.memoryHistory.length % 10 === 0) {
      logger.info('[Memory Manager] Memory usage report', {
        current: stats,
        trend: this.calculateMemoryTrend()
      });
    }
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): MemoryStats {
    const memUsage = process.memoryUsage();
    
    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      arrayBuffers: memUsage.arrayBuffers || 0,
      heapUsedPercent: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      lastGC: this.getLastGCTime()
    };
  }

  /**
   * Handle warning level memory usage (70%)
   */
  private handleWarningMemoryUsage(stats: MemoryStats): void {
    logger.warn('[Memory Manager] Warning: High memory usage detected', {
      heapUsedPercent: stats.heapUsedPercent.toFixed(2),
      heapUsedMB: Math.round(stats.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(stats.heapTotal / 1024 / 1024)
    });

    this.emit('memory_warning', stats);

    if (this.config.autoCleanup) {
      // Gentle cleanup - clear expired cache entries only
      this.performGentleCleanup();
    }
  }

  /**
   * Handle high level memory usage (85%)
   */
  private handleHighMemoryUsage(stats: MemoryStats): void {
    logger.error('[Memory Manager] Critical: Very high memory usage detected', {
      heapUsedPercent: stats.heapUsedPercent.toFixed(2),
      heapUsedMB: Math.round(stats.heapUsed / 1024 / 1024),
      trend: this.calculateMemoryTrend()
    });

    this.emit('memory_critical', stats);

    if (this.config.autoCleanup && !this.isCleaningUp) {
      // Aggressive cleanup
      this.performAggressiveCleanup();
    }
  }

  /**
   * Handle maximum level memory usage (95%) - emergency procedures
   */
  private handleCriticalMemoryUsage(stats: MemoryStats): void {
    if (this.emergencyShutdownTriggered) {
      return;
    }

    this.emergencyShutdownTriggered = true;

    logger.error('[Memory Manager] EMERGENCY: Maximum memory threshold exceeded', {
      heapUsedPercent: stats.heapUsedPercent.toFixed(2),
      heapUsedMB: Math.round(stats.heapUsed / 1024 / 1024),
      action: 'emergency_shutdown'
    });

    this.emit('memory_emergency', stats);

    // Perform emergency cleanup and shutdown
    this.performEmergencyShutdown();
  }

  /**
   * Perform gentle cleanup - clear expired items only
   */
  private async performGentleCleanup(): Promise<void> {
    try {
      logger.info('[Memory Manager] Performing gentle cleanup...');
      
      // Emit cleanup event for other services to respond
      this.emit('cleanup_request', { level: 'gentle' });
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        logger.debug('[Memory Manager] Forced garbage collection');
      }
      
    } catch (error) {
      logger.error('[Memory Manager] Gentle cleanup failed', error);
    }
  }

  /**
   * Perform aggressive cleanup - clear caches and free resources
   */
  private async performAggressiveCleanup(): Promise<void> {
    if (this.isCleaningUp) {
      return;
    }

    this.isCleaningUp = true;

    try {
      logger.warn('[Memory Manager] Performing aggressive cleanup...');
      
      // Emit aggressive cleanup event
      this.emit('cleanup_request', { level: 'aggressive' });
      
      // Execute registered cleanup handlers
      await this.executeCleanupHandlers();
      
      // Force multiple garbage collections
      if (global.gc) {
        for (let i = 0; i < 3; i++) {
          global.gc();
          await this.delay(100);
        }
        logger.info('[Memory Manager] Forced multiple garbage collections');
      }
      
      // Check if cleanup was effective
      const newStats = this.getMemoryStats();
      const improvement = this.lastMemoryStats!.heapUsedPercent - newStats.heapUsedPercent;
      
      logger.info('[Memory Manager] Aggressive cleanup completed', {
        memoryFreedPercent: improvement.toFixed(2),
        newHeapUsedPercent: newStats.heapUsedPercent.toFixed(2)
      });
      
    } catch (error) {
      logger.error('[Memory Manager] Aggressive cleanup failed', error);
    } finally {
      this.isCleaningUp = false;
    }
  }

  /**
   * Perform emergency shutdown procedures
   */
  private async performEmergencyShutdown(): Promise<void> {
    try {
      logger.error('[Memory Manager] Initiating emergency shutdown due to memory exhaustion');
      
      // Emit emergency event
      this.emit('emergency_shutdown', this.lastMemoryStats);
      
      // Execute all cleanup handlers immediately
      await Promise.race([
        this.executeCleanupHandlers(),
        this.delay(5000) // 5 second timeout
      ]);
      
      // Final garbage collection attempt
      if (global.gc) {
        global.gc();
      }
      
      logger.error('[Memory Manager] Emergency shutdown complete - process will exit');
      
      // Force exit after brief delay
      setTimeout(() => {
        process.exit(1);
      }, 1000);
      
    } catch (error) {
      logger.error('[Memory Manager] Emergency shutdown failed', error);
      process.exit(1);
    }
  }

  /**
   * Execute all registered cleanup handlers
   */
  private async executeCleanupHandlers(): Promise<void> {
    const promises = this.cleanupHandlers.map(async (handler, index) => {
      try {
        await Promise.race([
          handler(),
          this.delay(5000) // 5 second timeout per handler
        ]);
      } catch (error) {
        logger.error(`[Memory Manager] Cleanup handler ${index} failed`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Register a cleanup handler
   */
  onCleanup(handler: () => Promise<void>): void {
    this.cleanupHandlers.push(handler);
  }

  /**
   * Calculate memory usage trend
   */
  private calculateMemoryTrend(): string {
    if (this.memoryHistory.length < 2) {
      return 'unknown';
    }

    const recent = this.memoryHistory.slice(-5);
    const older = this.memoryHistory.slice(-10, -5);
    
    if (recent.length === 0 || older.length === 0) {
      return 'unknown';
    }

    const recentAvg = recent.reduce((sum, stat) => sum + stat.heapUsedPercent, 0) / recent.length;
    const olderAvg = older.reduce((sum, stat) => sum + stat.heapUsedPercent, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 5) return 'increasing';
    if (diff < -5) return 'decreasing';
    return 'stable';
  }

  /**
   * Setup garbage collection logging
   */
  private setupGCLogging(): void {
    if (!this.config.enableGCLogging) {
      return;
    }

    // This requires --expose-gc flag
    if (global.gc) {
      const originalGC = global.gc;
      global.gc = () => {
        const before = process.memoryUsage();
        const start = Date.now();
        
        originalGC();
        
        const after = process.memoryUsage();
        const duration = Date.now() - start;
        
        logger.debug('[Memory Manager] Garbage collection completed', {
          duration,
          heapFreed: before.heapUsed - after.heapUsed,
          heapBefore: before.heapUsed,
          heapAfter: after.heapUsed
        });
      };
    }
  }

  /**
   * Get last garbage collection time (if available)
   */
  private getLastGCTime(): Date | undefined {
    // This would require GC performance monitoring
    // For now, return undefined
    return undefined;
  }

  /**
   * Force garbage collection
   */
  forceGarbageCollection(): boolean {
    if (global.gc) {
      const before = this.getMemoryStats();
      global.gc();
      const after = this.getMemoryStats();
      
      logger.info('[Memory Manager] Manual garbage collection', {
        heapFreed: before.heapUsed - after.heapUsed,
        heapUsedBefore: before.heapUsedPercent.toFixed(2),
        heapUsedAfter: after.heapUsedPercent.toFixed(2)
      });
      
      return true;
    }
    
    logger.warn('[Memory Manager] Garbage collection not available (use --expose-gc)');
    return false;
  }

  /**
   * Get memory usage history
   */
  getMemoryHistory(): MemoryStats[] {
    return [...this.memoryHistory];
  }

  /**
   * Get memory statistics summary
   */
  getMemorySummary(): any {
    if (!this.lastMemoryStats) {
      return null;
    }

    return {
      current: this.lastMemoryStats,
      trend: this.calculateMemoryTrend(),
      thresholds: this.config.thresholds,
      isMonitoring: !!this.monitoringInterval,
      cleanupHandlers: this.cleanupHandlers.length,
      emergencyTriggered: this.emergencyShutdownTriggered,
      history: {
        points: this.memoryHistory.length,
        maxHeapUsed: Math.max(...this.memoryHistory.map(s => s.heapUsedPercent)),
        avgHeapUsed: this.memoryHistory.reduce((sum, s) => sum + s.heapUsedPercent, 0) / this.memoryHistory.length
      }
    };
  }

  /**
   * Update memory thresholds
   */
  updateThresholds(thresholds: Partial<MemoryThresholds>): void {
    this.config.thresholds = { ...this.config.thresholds, ...thresholds };
    logger.info('[Memory Manager] Updated memory thresholds', this.config.thresholds);
  }

  /**
   * Check if memory usage is healthy
   */
  isMemoryHealthy(): boolean {
    if (!this.lastMemoryStats) {
      return true; // No data yet, assume healthy
    }
    
    return this.lastMemoryStats.heapUsedPercent < this.config.thresholds.warning;
  }

  /**
   * Estimate cache size impact
   */
  estimateCacheImpact(cacheSize: number): {
    currentImpact: number;
    recommendedMaxSize: number;
    exceedsRecommended: boolean;
  } {
    const stats = this.lastMemoryStats || this.getMemoryStats();
    const currentImpact = (cacheSize / stats.heapTotal) * 100;
    const availableHeap = stats.heapTotal * (this.config.thresholds.warning / 100) - stats.heapUsed;
    const recommendedMaxSize = Math.max(0, availableHeap * 0.5); // Use 50% of available heap
    
    return {
      currentImpact,
      recommendedMaxSize,
      exceedsRecommended: cacheSize > recommendedMaxSize
    };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup and stop monitoring
   */
  destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
    this.cleanupHandlers = [];
    logger.info('[Memory Manager] Destroyed');
  }
}

/**
 * Global memory manager instance
 */
export const memoryManager = new MemoryManager();

/**
 * Helper function to format bytes
 */
export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}