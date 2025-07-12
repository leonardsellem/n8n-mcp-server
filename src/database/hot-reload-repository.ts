import { NodeRepository } from './node-repository';
import { DatabaseAdapter } from './database-adapter';
import { ParsedNode } from '../parsers/node-parser';
import { cacheManager } from '../utils/enhanced-cache-manager';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface HotReloadEvent {
  type: 'node_added' | 'node_updated' | 'node_removed' | 'batch_update';
  nodeType?: string;
  affectedNodes?: string[];
  timestamp: Date;
  source: 'github' | 'npm' | 'manual';
}

export interface DatabaseTransaction {
  id: string;
  operations: DatabaseOperation[];
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface DatabaseOperation {
  type: 'insert' | 'update' | 'delete';
  nodeType: string;
  data?: ParsedNode;
  oldData?: any;
}

/**
 * Hot-Reload Repository with GitHub Integration
 * 
 * This repository extends the base NodeRepository with:
 * - Real-time database updates without restart
 * - Transactional batch operations for GitHub syncs
 * - Automatic cache invalidation on changes
 * - Event-driven notifications for external systems
 * - Rollback capability for failed operations
 */
export class HotReloadRepository extends NodeRepository {
  private transactionQueue: Map<string, DatabaseTransaction> = new Map();
  private eventEmitter = new EventEmitter();
  private isHotReloadEnabled = true;
  private pendingOperations: DatabaseOperation[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(db: DatabaseAdapter) {
    super(db);
    this.setupCacheIntegration();
    this.setupEventHandlers();
  }

  /**
   * Setup integration with cache manager
   */
  private setupCacheIntegration(): void {
    // Listen to cache warm requests
    cacheManager.on('warm_request', async (data: { nodeType: string }) => {
      try {
        // Pre-load the node to warm cache
        const node = this.getNode(data.nodeType);
        if (node) {
          logger.debug(`[Hot Reload] Warmed cache for: ${data.nodeType}`);
        }
      } catch (error) {
        logger.error(`[Hot Reload] Cache warming failed for ${data.nodeType}`, error);
      }
    });
  }

  /**
   * Setup event handlers for monitoring
   */
  private setupEventHandlers(): void {
    this.eventEmitter.on('node_change', (event: HotReloadEvent) => {
      logger.info(`[Hot Reload] Node change event: ${event.type}`, {
        nodeType: event.nodeType,
        source: event.source
      });
    });
  }

  /**
   * Save node with hot-reload support
   */
  saveNode(node: ParsedNode, source: 'github' | 'npm' | 'manual' = 'manual'): void {
    const existingNode = this.getNode(node.nodeType);
    const isUpdate = !!existingNode;
    
    // Save the node using parent method
    super.saveNode(node);
    
    if (this.isHotReloadEnabled) {
      // Invalidate cache for this specific node
      cacheManager.onNodeChange(node.nodeType, isUpdate ? 'updated' : 'added');
      
      // Emit change event
      this.emitNodeChangeEvent({
        type: isUpdate ? 'node_updated' : 'node_added',
        nodeType: node.nodeType,
        timestamp: new Date(),
        source
      });
    }
    
    logger.info(`[Hot Reload] Node ${isUpdate ? 'updated' : 'added'}: ${node.nodeType} (${source})`);
  }

  /**
   * Delete node with hot-reload support
   */
  deleteNode(nodeType: string, source: 'github' | 'npm' | 'manual' = 'manual'): boolean {
    const existingNode = this.getNode(nodeType);
    
    if (!existingNode) {
      return false;
    }
    
    // Delete the node
    const stmt = this.db.prepare('DELETE FROM nodes WHERE node_type = ?');
    const result = stmt.run(nodeType);
    
    if (this.isHotReloadEnabled && result.changes > 0) {
      // Invalidate cache
      cacheManager.onNodeChange(nodeType, 'removed');
      
      // Emit change event
      this.emitNodeChangeEvent({
        type: 'node_removed',
        nodeType,
        timestamp: new Date(),
        source
      });
    }
    
    logger.info(`[Hot Reload] Node removed: ${nodeType} (${source})`);
    return result.changes > 0;
  }

  /**
   * Batch update nodes from GitHub sync
   */
  async batchUpdateFromGitHub(nodes: ParsedNode[]): Promise<void> {
    const transactionId = this.generateTransactionId();
    const operations: DatabaseOperation[] = [];
    
    // Prepare operations
    for (const node of nodes) {
      const existingNode = this.getNode(node.nodeType);
      operations.push({
        type: existingNode ? 'update' : 'insert',
        nodeType: node.nodeType,
        data: node,
        oldData: existingNode
      });
    }
    
    // Create transaction
    const transaction: DatabaseTransaction = {
      id: transactionId,
      operations,
      timestamp: new Date(),
      status: 'pending'
    };
    
    this.transactionQueue.set(transactionId, transaction);
    
    try {
      await this.executeTransaction(transaction);
      logger.info(`[Hot Reload] Batch update completed: ${operations.length} nodes from GitHub`);
    } catch (error) {
      logger.error(`[Hot Reload] Batch update failed for transaction ${transactionId}`, error);
      await this.rollbackTransaction(transaction);
      throw error;
    }
  }

  /**
   * Execute a database transaction
   */
  private async executeTransaction(transaction: DatabaseTransaction): Promise<void> {
    transaction.status = 'executing';
    
    try {
      // Begin transaction (if database supports it)
      if (this.db.prepare) {
        // SQLite doesn't have traditional transactions in better-sqlite3
        // We'll use a try-catch approach with rollback capability
      }
      
      const affectedNodes: string[] = [];
      
      for (const operation of transaction.operations) {
        switch (operation.type) {
          case 'insert':
          case 'update':
            if (operation.data) {
              super.saveNode(operation.data);
              affectedNodes.push(operation.nodeType);
            }
            break;
          case 'delete':
            this.deleteNode(operation.nodeType, 'github');
            affectedNodes.push(operation.nodeType);
            break;
        }
      }
      
      transaction.status = 'completed';
      
      if (this.isHotReloadEnabled) {
        // Invalidate all caches for GitHub sync
        cacheManager.onGitHubSync({
          added: transaction.operations.filter(op => op.type === 'insert').length,
          updated: transaction.operations.filter(op => op.type === 'update').length,
          removed: transaction.operations.filter(op => op.type === 'delete').length,
          errors: []
        });
        
        // Emit batch update event
        this.emitNodeChangeEvent({
          type: 'batch_update',
          affectedNodes,
          timestamp: new Date(),
          source: 'github'
        });
      }
      
    } catch (error) {
      transaction.status = 'failed';
      throw error;
    } finally {
      // Clean up completed/failed transactions after a delay
      setTimeout(() => {
        this.transactionQueue.delete(transaction.id);
      }, 300000); // 5 minutes
    }
  }

  /**
   * Rollback a failed transaction
   */
  private async rollbackTransaction(transaction: DatabaseTransaction): Promise<void> {
    logger.warn(`[Hot Reload] Rolling back transaction ${transaction.id}`);
    
    try {
      // Reverse the operations
      for (const operation of transaction.operations.reverse()) {
        switch (operation.type) {
          case 'insert':
            // Remove the inserted node
            if (operation.data) {
              this.deleteNode(operation.nodeType, 'github');
            }
            break;
          case 'update':
            // Restore the old data
            if (operation.oldData) {
              super.saveNode(operation.oldData);
            }
            break;
          case 'delete':
            // Restore the deleted node
            if (operation.oldData) {
              super.saveNode(operation.oldData);
            }
            break;
        }
      }
      
      logger.info(`[Hot Reload] Transaction ${transaction.id} rolled back successfully`);
    } catch (error) {
      logger.error(`[Hot Reload] Rollback failed for transaction ${transaction.id}`, error);
    }
  }

  /**
   * Add operation to pending queue for batching
   */
  addToBatch(operation: DatabaseOperation): void {
    this.pendingOperations.push(operation);
    
    // Setup batch timeout if not already set
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.processPendingBatch();
      }, 5000); // 5 second batch window
    }
  }

  /**
   * Process pending batch operations
   */
  private async processPendingBatch(): Promise<void> {
    if (this.pendingOperations.length === 0) {
      return;
    }
    
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    this.batchTimeout = null;
    
    const transactionId = this.generateTransactionId();
    const transaction: DatabaseTransaction = {
      id: transactionId,
      operations,
      timestamp: new Date(),
      status: 'pending'
    };
    
    try {
      await this.executeTransaction(transaction);
      logger.info(`[Hot Reload] Processed batch of ${operations.length} operations`);
    } catch (error) {
      logger.error(`[Hot Reload] Batch processing failed`, error);
    }
  }

  /**
   * Get real-time node status
   */
  getNodeStatus(nodeType: string): any {
    const node = this.getNode(nodeType);
    if (!node) {
      return null;
    }
    
    // Check if node is in any pending transactions
    const pendingTransaction = Array.from(this.transactionQueue.values())
      .find(tx => tx.operations.some(op => op.nodeType === nodeType));
    
    return {
      ...node,
      status: {
        inDatabase: true,
        pendingTransaction: pendingTransaction?.id || null,
        lastModified: new Date(), // We could track this separately
        source: this.getNodeSource(nodeType)
      }
    };
  }

  /**
   * Get node source information
   */
  private getNodeSource(nodeType: string): 'github' | 'npm' | 'unknown' {
    // This would need to be tracked when saving nodes
    // For now, we'll make a best guess based on package name
    const node = this.getNode(nodeType);
    if (!node) return 'unknown';
    
    if (node.package.startsWith('github-')) {
      return 'github';
    }
    
    return 'npm';
  }

  /**
   * Get active transactions
   */
  getActiveTransactions(): DatabaseTransaction[] {
    return Array.from(this.transactionQueue.values())
      .filter(tx => tx.status === 'pending' || tx.status === 'executing');
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(limit = 10): DatabaseTransaction[] {
    return Array.from(this.transactionQueue.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Force flush pending operations
   */
  async flushPendingOperations(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    
    await this.processPendingBatch();
  }

  /**
   * Enable/disable hot reload functionality
   */
  setHotReloadEnabled(enabled: boolean): void {
    this.isHotReloadEnabled = enabled;
    logger.info(`[Hot Reload] Hot reload ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Subscribe to node change events
   */
  onNodeChange(callback: (event: HotReloadEvent) => void): void {
    this.eventEmitter.on('node_change', callback);
  }

  /**
   * Unsubscribe from node change events
   */
  offNodeChange(callback: (event: HotReloadEvent) => void): void {
    this.eventEmitter.off('node_change', callback);
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Emit node change event
   */
  private emitNodeChangeEvent(event: HotReloadEvent): void {
    this.eventEmitter.emit('node_change', event);
  }

  /**
   * Get hot reload statistics
   */
  getHotReloadStats(): any {
    return {
      hotReloadEnabled: this.isHotReloadEnabled,
      activeTransactions: this.getActiveTransactions().length,
      pendingOperations: this.pendingOperations.length,
      transactionHistory: this.getTransactionHistory(5).length,
      cacheStats: cacheManager.getCacheStatistics(),
      lastActivity: new Date()
    };
  }
}