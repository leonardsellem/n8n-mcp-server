import express from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface GitHubWebhookConfig {
  port: number;
  path: string;
  secret: string;
  enabled: boolean;
  allowedEvents: string[];
}

export interface WebhookEvent {
  type: string;
  action: string;
  repository: string;
  commits?: any[];
  files?: WebhookFile[];
  timestamp: Date;
  rawPayload: any;
}

export interface WebhookFile {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  path: string;
  isNodeFile: boolean;
}

/**
 * GitHub Webhook Service for Real-Time Updates
 * 
 * This service provides:
 * - Real-time GitHub webhook handling
 * - Automatic node change detection from commits
 * - Secure webhook signature verification
 * - Event-driven architecture for downstream systems
 * - File change filtering for n8n node files
 */
export class GitHubWebhookService extends EventEmitter {
  private app: express.Application;
  private server: any;
  private config: GitHubWebhookConfig;
  private isRunning = false;
  private receivedWebhooks: WebhookEvent[] = [];

  constructor(config: GitHubWebhookConfig) {
    super();
    
    this.config = {
      port: 3001,
      path: '/webhook',
      allowedEvents: ['push', 'pull_request'],
      ...config
    };
    
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Raw body parser for signature verification
    this.app.use(this.config.path, express.raw({ type: 'application/json' }));
    
    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      next();
    });
  }

  /**
   * Setup webhook routes
   */
  private setupRoutes(): void {
    // Main webhook endpoint
    this.app.post(this.config.path, async (req, res) => {
      try {
        await this.handleWebhook(req, res);
      } catch (error) {
        logger.error('[GitHub Webhook] Error handling webhook', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'github-webhook',
        enabled: this.config.enabled,
        listening: this.isRunning,
        webhooksReceived: this.receivedWebhooks.length
      });
    });

    // Status endpoint with recent webhooks
    this.app.get('/status', (req, res) => {
      res.json({
        config: {
          port: this.config.port,
          path: this.config.path,
          enabled: this.config.enabled,
          allowedEvents: this.config.allowedEvents
        },
        runtime: {
          isRunning: this.isRunning,
          uptime: this.server ? process.uptime() : 0
        },
        recentWebhooks: this.receivedWebhooks.slice(-10).map(wh => ({
          type: wh.type,
          action: wh.action,
          repository: wh.repository,
          fileCount: wh.files?.length || 0,
          nodeFiles: wh.files?.filter(f => f.isNodeFile).length || 0,
          timestamp: wh.timestamp
        }))
      });
    });
  }

  /**
   * Handle incoming webhook
   */
  private async handleWebhook(req: express.Request, res: express.Response): Promise<void> {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;
    const delivery = req.headers['x-github-delivery'] as string;
    
    logger.info(`[GitHub Webhook] Received ${event} event`, { delivery });

    // Verify signature
    if (!this.verifySignature(req.body, signature)) {
      logger.warn('[GitHub Webhook] Invalid signature', { delivery, event });
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    // Check if event is allowed
    if (!this.config.allowedEvents.includes(event)) {
      logger.debug(`[GitHub Webhook] Ignored event type: ${event}`, { delivery });
      res.status(200).json({ message: 'Event ignored' });
      return;
    }

    try {
      const payload = JSON.parse(req.body.toString());
      const webhookEvent = await this.processWebhookPayload(event, payload);
      
      if (webhookEvent) {
        // Store webhook for history
        this.receivedWebhooks.push(webhookEvent);
        this.trimWebhookHistory();
        
        // Emit event for downstream processing
        this.emit('webhook', webhookEvent);
        
        logger.info(`[GitHub Webhook] Processed ${event} event`, {
          delivery,
          repository: webhookEvent.repository,
          nodeFiles: webhookEvent.files?.filter(f => f.isNodeFile).length || 0
        });
      }
      
      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      logger.error('[GitHub Webhook] Error processing webhook payload', error);
      res.status(400).json({ error: 'Invalid payload' });
    }
  }

  /**
   * Process webhook payload and extract relevant information
   */
  private async processWebhookPayload(event: string, payload: any): Promise<WebhookEvent | null> {
    const webhookEvent: WebhookEvent = {
      type: event,
      action: payload.action || 'unknown',
      repository: payload.repository?.full_name || 'unknown',
      timestamp: new Date(),
      rawPayload: payload
    };

    switch (event) {
      case 'push':
        webhookEvent.commits = payload.commits || [];
        webhookEvent.files = await this.extractFilesFromPush(payload);
        break;
        
      case 'pull_request':
        if (payload.action === 'opened' || payload.action === 'synchronize') {
          webhookEvent.files = await this.extractFilesFromPullRequest(payload);
        }
        break;
        
      default:
        logger.debug(`[GitHub Webhook] Unhandled event type: ${event}`);
        return null;
    }

    // Filter for n8n node files only
    if (webhookEvent.files) {
      const nodeFiles = webhookEvent.files.filter(f => f.isNodeFile);
      if (nodeFiles.length === 0) {
        logger.debug(`[GitHub Webhook] No n8n node files in ${event} event`);
        return null;
      }
    }

    return webhookEvent;
  }

  /**
   * Extract files from push event
   */
  private async extractFilesFromPush(payload: any): Promise<WebhookFile[]> {
    const files: WebhookFile[] = [];
    
    for (const commit of payload.commits || []) {
      // Added files
      for (const file of commit.added || []) {
        files.push({
          filename: this.extractFilename(file),
          status: 'added',
          path: file,
          isNodeFile: this.isNodeFile(file)
        });
      }
      
      // Modified files
      for (const file of commit.modified || []) {
        files.push({
          filename: this.extractFilename(file),
          status: 'modified',
          path: file,
          isNodeFile: this.isNodeFile(file)
        });
      }
      
      // Removed files
      for (const file of commit.removed || []) {
        files.push({
          filename: this.extractFilename(file),
          status: 'removed',
          path: file,
          isNodeFile: this.isNodeFile(file)
        });
      }
    }
    
    // Remove duplicates
    const uniqueFiles = new Map<string, WebhookFile>();
    for (const file of files) {
      uniqueFiles.set(file.path, file);
    }
    
    return Array.from(uniqueFiles.values());
  }

  /**
   * Extract files from pull request event
   */
  private async extractFilesFromPullRequest(payload: any): Promise<WebhookFile[]> {
    // For pull requests, we'd need to make an API call to get the files
    // For now, we'll return empty array and log the event
    logger.info(`[GitHub Webhook] Pull request ${payload.action}`, {
      number: payload.number,
      title: payload.pull_request?.title
    });
    
    return [];
  }

  /**
   * Check if a file is an n8n node file
   */
  private isNodeFile(filePath: string): boolean {
    return filePath.includes('/nodes/') && 
           (filePath.endsWith('.node.ts') || 
            filePath.endsWith('.node.js') || 
            filePath.endsWith('.credentials.ts'));
  }

  /**
   * Extract filename from file path
   */
  private extractFilename(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }

  /**
   * Verify GitHub webhook signature
   */
  private verifySignature(payload: Buffer, signature: string): boolean {
    if (!signature || !this.config.secret) {
      return false;
    }

    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', this.config.secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Start the webhook server
   */
  async start(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('[GitHub Webhook] Service disabled by configuration');
      return;
    }

    if (this.isRunning) {
      logger.warn('[GitHub Webhook] Service already running');
      return;
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, () => {
        this.isRunning = true;
        logger.info(`[GitHub Webhook] Service started on port ${this.config.port}`, {
          path: this.config.path,
          allowedEvents: this.config.allowedEvents
        });
        resolve();
      });

      this.server.on('error', (error: Error) => {
        logger.error('[GitHub Webhook] Server error', error);
        reject(error);
      });
    });
  }

  /**
   * Stop the webhook server
   */
  async stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      return;
    }

    return new Promise((resolve) => {
      this.server.close(() => {
        this.isRunning = false;
        logger.info('[GitHub Webhook] Service stopped');
        resolve();
      });
    });
  }

  /**
   * Get webhook statistics
   */
  getWebhookStats(): any {
    const recentWebhooks = this.receivedWebhooks.slice(-100);
    const nodeFileChanges = recentWebhooks.reduce((count, wh) => 
      count + (wh.files?.filter(f => f.isNodeFile).length || 0), 0
    );

    return {
      enabled: this.config.enabled,
      isRunning: this.isRunning,
      port: this.config.port,
      totalWebhooks: this.receivedWebhooks.length,
      recentWebhooks: recentWebhooks.length,
      nodeFileChanges,
      allowedEvents: this.config.allowedEvents,
      lastWebhook: this.receivedWebhooks.length > 0 
        ? this.receivedWebhooks[this.receivedWebhooks.length - 1].timestamp 
        : null
    };
  }

  /**
   * Get recent webhook events
   */
  getRecentWebhooks(limit = 10): WebhookEvent[] {
    return this.receivedWebhooks.slice(-limit);
  }

  /**
   * Trim webhook history to prevent memory leaks
   */
  private trimWebhookHistory(): void {
    if (this.receivedWebhooks.length > 1000) {
      this.receivedWebhooks = this.receivedWebhooks.slice(-500);
    }
  }

  /**
   * Test webhook connectivity
   */
  async testWebhook(): Promise<boolean> {
    if (!this.isRunning) {
      return false;
    }

    try {
      const response = await fetch(`http://localhost:${this.config.port}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}