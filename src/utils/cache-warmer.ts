/**
 * Cache Warming Utility
 * Pre-loads frequently used nodes to improve cold start performance
 */

import { NodeRepository } from '../database/node-repository';
import { logger } from './logger';

interface CacheWarmingStats {
  totalNodes: number;
  warmedNodes: number;
  failures: number;
  duration: number;
}

export class CacheWarmer {
  // Most commonly used n8n nodes based on community usage
  private static POPULAR_NODES = [
    // Core workflow nodes (highest priority)
    'nodes-base.httpRequest',
    'nodes-base.set',
    'nodes-base.if',
    'nodes-base.webhook',
    'nodes-base.code',
    'nodes-base.merge',
    'nodes-base.splitInBatches',
    
    // Communication & integrations
    'nodes-base.slack',
    'nodes-base.gmail',
    'nodes-base.discord',
    'nodes-base.telegram',
    'nodes-base.emailSend',
    
    // Data & databases
    'nodes-base.postgres',
    'nodes-base.mysql',
    'nodes-base.googleSheets',
    'nodes-base.airtable',
    'nodes-base.mongodb',
    
    // AI & LangChain nodes
    'nodes-langchain.openAi',
    'nodes-langchain.agent',
    'nodes-langchain.chainLlm',
    'nodes-base.openAi',
    
    // File & media
    'nodes-base.readBinaryFile',
    'nodes-base.writeBinaryFile',
    'nodes-base.csv',
    'nodes-base.html',
    
    // Automation & scheduling
    'nodes-base.schedule',
    'nodes-base.cron',
    'nodes-base.wait',
    'nodes-base.dateTime',
    
    // APIs & services
    'nodes-base.function',
    'nodes-base.awsS3',
    'nodes-base.github',
    'nodes-base.notion'
  ];

  // Common search terms to pre-cache
  private static POPULAR_SEARCHES = [
    'slack',
    'http',
    'email',
    'webhook',
    'openai',
    'ai',
    'database',
    'google',
    'schedule',
    'file'
  ];

  constructor(private repository: NodeRepository) {}

  /**
   * Warm cache with popular nodes and searches
   */
  async warmCache(): Promise<CacheWarmingStats> {
    const startTime = Date.now();
    const stats: CacheWarmingStats = {
      totalNodes: 0,
      warmedNodes: 0,
      failures: 0,
      duration: 0
    };

    logger.info('[Cache Warmer] Starting cache warming...');

    try {
      // Warm popular nodes
      await this.warmPopularNodes(stats);
      
      // Warm popular searches
      await this.warmPopularSearches(stats);
      
      stats.duration = Date.now() - startTime;
      
      logger.info('[Cache Warmer] Cache warming completed', {
        warmedNodes: stats.warmedNodes,
        failures: stats.failures,
        duration: `${stats.duration}ms`
      });

      return stats;
    } catch (error) {
      logger.error('[Cache Warmer] Cache warming failed', error);
      stats.duration = Date.now() - startTime;
      return stats;
    }
  }

  /**
   * Warm cache with popular nodes
   */
  private async warmPopularNodes(stats: CacheWarmingStats): Promise<void> {
    stats.totalNodes = CacheWarmer.POPULAR_NODES.length;
    
    const promises = CacheWarmer.POPULAR_NODES.map(async (nodeType) => {
      try {
        // Load node info (will cache automatically)
        const node = this.repository.getNodeInfo(nodeType);
        if (node) {
          stats.warmedNodes++;
          logger.debug(`[Cache Warmer] Warmed node: ${nodeType}`);
        } else {
          logger.warn(`[Cache Warmer] Node not found: ${nodeType}`);
          stats.failures++;
        }
      } catch (error) {
        logger.warn(`[Cache Warmer] Failed to warm node ${nodeType}:`, error);
        stats.failures++;
      }
    });

    await Promise.all(promises);
  }

  /**
   * Warm cache with popular searches
   */
  private async warmPopularSearches(stats: CacheWarmingStats): Promise<void> {
    const promises = CacheWarmer.POPULAR_SEARCHES.map(async (searchTerm) => {
      try {
        // Perform search (will cache automatically)
        const results = this.repository.searchNodes(searchTerm);
        logger.debug(`[Cache Warmer] Warmed search "${searchTerm}": ${results.length} results`);
      } catch (error) {
        logger.warn(`[Cache Warmer] Failed to warm search "${searchTerm}":`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Warm cache in background (non-blocking)
   */
  async warmCacheInBackground(): Promise<void> {
    // Don't await - let it run in background
    this.warmCache().catch(error => {
      logger.error('[Cache Warmer] Background cache warming failed', error);
    });
    
    logger.info('[Cache Warmer] Cache warming started in background');
  }

  /**
   * Check if popular nodes are cached
   */
  async checkCacheHealth(): Promise<{ cached: number; total: number; percentage: number }> {
    let cached = 0;
    const total = CacheWarmer.POPULAR_NODES.length;

    for (const nodeType of CacheWarmer.POPULAR_NODES) {
      try {
        const node = this.repository.getNodeInfo(nodeType);
        if (node) cached++;
      } catch (error) {
        // Node doesn't exist or cache miss
      }
    }

    return {
      cached,
      total,
      percentage: Math.round((cached / total) * 100)
    };
  }

  /**
   * Add custom nodes to warming list
   */
  static addCustomPopularNodes(nodeTypes: string[]): void {
    this.POPULAR_NODES.push(...nodeTypes);
  }

  /**
   * Get current popular nodes list
   */
  static getPopularNodes(): string[] {
    return [...this.POPULAR_NODES];
  }
}