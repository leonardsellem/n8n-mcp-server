import express from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface SecureGitHubWebhookConfig {
  port: number;
  path: string;
  secret: string;
  enabled: boolean;
  allowedEvents: string[];
  security: {
    maxPayloadSize: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    allowedIPs: string[];
    requireHttps: boolean;
    enableDetailedLogging: boolean;
  };
}

export interface WebhookEvent {
  id: string;
  type: string;
  action: string;
  repository: string;
  commits?: any[];
  files?: WebhookFile[];
  timestamp: Date;
  sourceIP: string;
  deliveryId: string;
  verified: boolean;
}

export interface WebhookFile {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  path: string;
  isNodeFile: boolean;
  size?: number;
}

export interface SecurityEvent {
  timestamp: Date;
  type: 'signature_failure' | 'rate_limit_exceeded' | 'ip_blocked' | 'payload_too_large' | 'invalid_event';
  sourceIP: string;
  details: any;
}

/**
 * Secure GitHub Webhook Service with Enhanced Protection
 * 
 * This service provides comprehensive security for GitHub webhooks:
 * - Rate limiting per IP and globally
 * - IP allowlist for GitHub webhook sources
 * - Payload size limits and validation
 * - Enhanced signature verification
 * - Security event monitoring and alerting
 * - Request sanitization and validation
 * - Comprehensive audit logging
 */
export class SecureGitHubWebhookService extends EventEmitter {
  private app: express.Application;
  private server: any;
  private config: SecureGitHubWebhookConfig;
  private isRunning = false;
  private receivedWebhooks: WebhookEvent[] = [];
  private securityEvents: SecurityEvent[] = [];
  private blockedIPs = new Set<string>();
  private lastProcessedDelivery = new Set<string>();

  // GitHub's webhook IP ranges (as of 2024)
  private static readonly GITHUB_WEBHOOK_IPS = [
    '192.30.252.0/22',
    '185.199.108.0/22',
    '140.82.112.0/20',
    '143.55.64.0/20',
    '2a0a:a440::/29',
    '2606:50c0::/32'
  ];

  constructor(config: SecureGitHubWebhookConfig) {
    super();
    
    this.config = {
      port: 3001,
      path: '/webhook',
      allowedEvents: ['push'],
      security: {
        maxPayloadSize: 1024 * 1024, // 1MB
        rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
        rateLimitMaxRequests: 100,
        allowedIPs: SecureGitHubWebhookService.GITHUB_WEBHOOK_IPS,
        requireHttps: false, // Set to true in production
        enableDetailedLogging: true
      },
      ...config
    };
    
    this.app = express();
    this.setupSecureMiddleware();
    this.setupRoutes();
    
    // Clean up old data periodically
    setInterval(() => this.cleanupOldData(), 60 * 60 * 1000); // Every hour
  }

  /**
   * Setup comprehensive security middleware
   */
  private setupSecureMiddleware(): void {
    // Basic security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          styleSrc: ["'unsafe-inline'"],
          scriptSrc: ["'none'"]
        }
      },
      hsts: this.config.security.requireHttps ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false
    }));

    // Request size limiting
    this.app.use(express.json({ 
      limit: this.config.security.maxPayloadSize,
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      }
    }));

    // Global rate limiting
    const globalRateLimit = rateLimit({
      windowMs: this.config.security.rateLimitWindowMs,
      max: this.config.security.rateLimitMaxRequests,
      message: { error: 'Too many requests' },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        this.logSecurityEvent('rate_limit_exceeded', req.ip, {
          path: req.path,
          userAgent: req.get('User-Agent')
        });
        res.status(429).json({ error: 'Rate limit exceeded' });
      }
    });

    this.app.use(globalRateLimit);

    // Webhook-specific rate limiting (more restrictive)
    const webhookRateLimit = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 20, // Maximum 20 webhooks per 5 minutes per IP
      message: { error: 'Webhook rate limit exceeded' },
      skip: (req) => !req.path.startsWith(this.config.path)
    });

    this.app.use(this.config.path, webhookRateLimit);

    // IP allowlist middleware for webhooks
    this.app.use(this.config.path, (req, res, next) => {
      if (!this.isIPAllowed(req.ip)) {
        this.logSecurityEvent('ip_blocked', req.ip, {
          userAgent: req.get('User-Agent'),
          path: req.path
        });
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    });

    // Request logging middleware
    if (this.config.security.enableDetailedLogging) {
      this.app.use((req, res, next) => {
        logger.debug('[Secure Webhook] Request received', {
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          contentLength: req.get('Content-Length')
        });
        next();
      });
    }

    // Raw body parser for signature verification
    this.app.use(this.config.path, express.raw({ 
      type: 'application/json',
      limit: this.config.security.maxPayloadSize
    }));
  }

  /**
   * Setup secure webhook routes
   */
  private setupRoutes(): void {
    // Main webhook endpoint with comprehensive security
    this.app.post(this.config.path, async (req, res) => {
      const startTime = Date.now();
      let deliveryId = 'unknown';
      
      try {
        deliveryId = req.headers['x-github-delivery'] as string || 'unknown';
        
        // Check for duplicate delivery
        if (this.lastProcessedDelivery.has(deliveryId)) {
          logger.warn('[Secure Webhook] Duplicate delivery ignored', { deliveryId });
          return res.status(200).json({ message: 'Duplicate delivery ignored' });
        }
        
        await this.handleSecureWebhook(req, res);
        
        // Track successful delivery
        this.lastProcessedDelivery.add(deliveryId);
        this.cleanupDeliveryTracking();
        
      } catch (error) {
        const processingTime = Date.now() - startTime;
        this.logSecurityEvent('webhook_processing_error', req.ip, {
          deliveryId,
          error: error instanceof Error ? error.message : 'Unknown error',
          processingTime
        });
        
        logger.error('[Secure Webhook] Error processing webhook', {
          deliveryId,
          error,
          processingTime
        });
        
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Health check endpoint (no auth required)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'secure-github-webhook',
        enabled: this.config.enabled,
        listening: this.isRunning,
        security: {
          rateLimitEnabled: true,
          ipAllowlistEnabled: this.config.security.allowedIPs.length > 0,
          httpsRequired: this.config.security.requireHttps
        },
        stats: {
          webhooksReceived: this.receivedWebhooks.length,
          securityEvents: this.securityEvents.length,
          blockedIPs: this.blockedIPs.size
        }
      });
    });

    // Admin status endpoint (requires authentication in production)
    this.app.get('/admin/status', (req, res) => {
      // TODO: Add authentication middleware for production
      res.json({
        config: {
          port: this.config.port,
          path: this.config.path,
          enabled: this.config.enabled,
          allowedEvents: this.config.allowedEvents,
          security: {
            ...this.config.security,
            // Don't expose sensitive config
            allowedIPs: this.config.security.allowedIPs.length
          }
        },
        runtime: {
          isRunning: this.isRunning,
          uptime: this.server ? process.uptime() : 0
        },
        recentWebhooks: this.getRecentWebhooks(5),
        recentSecurityEvents: this.getRecentSecurityEvents(10),
        blockedIPs: Array.from(this.blockedIPs)
      });
    });

    // Security events endpoint
    this.app.get('/admin/security-events', (req, res) => {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      res.json({
        events: this.securityEvents.slice(-limit),
        total: this.securityEvents.length
      });
    });
  }

  /**
   * Handle webhook with comprehensive security validation
   */
  private async handleSecureWebhook(req: express.Request, res: express.Response): Promise<void> {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;
    const delivery = req.headers['x-github-delivery'] as string;
    const contentType = req.headers['content-type'] as string;
    
    // Basic header validation
    if (!signature || !event || !delivery) {
      this.logSecurityEvent('invalid_headers', req.ip, {
        hasSignature: !!signature,
        hasEvent: !!event,
        hasDelivery: !!delivery
      });
      return res.status(400).json({ error: 'Missing required headers' });
    }

    // Content type validation
    if (contentType !== 'application/json') {
      this.logSecurityEvent('invalid_content_type', req.ip, { contentType });
      return res.status(400).json({ error: 'Invalid content type' });
    }

    logger.info(`[Secure Webhook] Processing ${event} event`, { 
      delivery, 
      ip: req.ip,
      size: req.body.length 
    });

    // Verify webhook signature with timing-safe comparison
    if (!this.verifySignatureSecurely(req.body, signature)) {
      this.logSecurityEvent('signature_failure', req.ip, {
        event,
        delivery,
        signatureProvided: !!signature
      });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check if event type is allowed
    if (!this.config.allowedEvents.includes(event)) {
      logger.debug(`[Secure Webhook] Ignored event type: ${event}`, { delivery });
      return res.status(200).json({ message: 'Event type not monitored' });
    }

    try {
      // Parse and validate payload
      const payload = JSON.parse(req.body.toString());
      
      if (!this.validatePayloadStructure(payload, event)) {
        this.logSecurityEvent('invalid_payload', req.ip, { event, delivery });
        return res.status(400).json({ error: 'Invalid payload structure' });
      }

      // Process webhook
      const webhookEvent = await this.processSecureWebhookPayload(event, payload, req.ip, delivery);
      
      if (webhookEvent) {
        // Store webhook with size limit
        this.storeWebhookEvent(webhookEvent);
        
        // Emit event for downstream processing
        this.emit('webhook', webhookEvent);
        
        logger.info(`[Secure Webhook] Successfully processed ${event} event`, {
          delivery,
          repository: webhookEvent.repository,
          nodeFiles: webhookEvent.files?.filter(f => f.isNodeFile).length || 0,
          verified: webhookEvent.verified
        });
      }
      
      res.status(200).json({ 
        message: 'Webhook processed successfully',
        delivery: delivery.substring(0, 8) // Only return partial ID for security
      });

    } catch (error) {
      this.logSecurityEvent('payload_processing_error', req.ip, {
        event,
        delivery,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Verify webhook signature with enhanced security
   */
  private verifySignatureSecurely(payload: Buffer, signature: string): boolean {
    if (!signature || !this.config.secret) {
      return false;
    }

    try {
      // Validate signature format
      if (!signature.startsWith('sha256=')) {
        return false;
      }

      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', this.config.secret)
        .update(payload)
        .digest('hex');

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      logger.error('[Secure Webhook] Signature verification error', error);
      return false;
    }
  }

  /**
   * Validate payload structure for security
   */
  private validatePayloadStructure(payload: any, eventType: string): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    // Basic required fields for all events
    if (!payload.repository || !payload.repository.full_name) {
      return false;
    }

    // Event-specific validation
    switch (eventType) {
      case 'push':
        return Array.isArray(payload.commits) && 
               typeof payload.ref === 'string';
      case 'pull_request':
        return payload.pull_request && 
               typeof payload.action === 'string';
      default:
        return true; // Basic validation passed
    }
  }

  /**
   * Process webhook payload with security validation
   */
  private async processSecureWebhookPayload(
    event: string, 
    payload: any, 
    sourceIP: string, 
    deliveryId: string
  ): Promise<WebhookEvent | null> {
    
    const webhookEvent: WebhookEvent = {
      id: this.generateSecureEventId(),
      type: event,
      action: payload.action || 'unknown',
      repository: payload.repository?.full_name || 'unknown',
      timestamp: new Date(),
      sourceIP: this.anonymizeIP(sourceIP),
      deliveryId: deliveryId.substring(0, 8), // Partial ID for security
      verified: true
    };

    switch (event) {
      case 'push':
        webhookEvent.commits = this.sanitizeCommits(payload.commits || []);
        webhookEvent.files = await this.extractAndValidateFiles(payload);
        break;
        
      case 'pull_request':
        if (payload.action === 'opened' || payload.action === 'synchronize') {
          // For pull requests, we'd need to make additional API calls
          // For security, we'll just log the event for now
          logger.info('[Secure Webhook] Pull request event received', {
            number: payload.number,
            action: payload.action
          });
        }
        break;
        
      default:
        logger.debug(`[Secure Webhook] Unhandled event type: ${event}`);
        return null;
    }

    // Only process if there are actual node file changes
    if (webhookEvent.files) {
      const nodeFiles = webhookEvent.files.filter(f => f.isNodeFile);
      if (nodeFiles.length === 0) {
        logger.debug(`[Secure Webhook] No n8n node files in ${event} event`);
        return null;
      }
    }

    return webhookEvent;
  }

  /**
   * Extract and validate files from webhook payload
   */
  private async extractAndValidateFiles(payload: any): Promise<WebhookFile[]> {
    const files: WebhookFile[] = [];
    const maxFiles = 100; // Limit number of files processed
    
    for (const commit of (payload.commits || []).slice(0, 10)) { // Max 10 commits
      ['added', 'modified', 'removed'].forEach(status => {
        const commitFiles = commit[status] || [];
        for (const file of commitFiles.slice(0, maxFiles - files.length)) {
          if (files.length >= maxFiles) break;
          
          files.push({
            filename: this.sanitizeFilename(this.extractFilename(file)),
            status: status as 'added' | 'modified' | 'removed',
            path: this.sanitizePath(file),
            isNodeFile: this.isNodeFile(file),
            size: this.estimateFileSize(file)
          });
        }
      });
      
      if (files.length >= maxFiles) break;
    }
    
    return files;
  }

  /**
   * Sanitize commit data for security
   */
  private sanitizeCommits(commits: any[]): any[] {
    return commits.slice(0, 20).map(commit => ({ // Max 20 commits
      id: commit.id?.substring(0, 8), // Partial commit ID
      message: this.sanitizeString(commit.message?.substring(0, 200)), // Max 200 chars
      author: {
        name: this.sanitizeString(commit.author?.name?.substring(0, 50)),
        email: commit.author?.email ? '[redacted]' : undefined // Hide emails
      },
      timestamp: commit.timestamp
    }));
  }

  /**
   * Check if IP is allowed based on allowlist
   */
  private isIPAllowed(ip: string): boolean {
    // If no allowlist is configured, allow all IPs
    if (this.config.security.allowedIPs.length === 0) {
      return true;
    }

    // Check if IP is in blocked list
    if (this.blockedIPs.has(ip)) {
      return false;
    }

    // For GitHub webhooks, check against GitHub's IP ranges
    // This is a simplified check - in production, use a proper CIDR library
    const allowedRanges = this.config.security.allowedIPs;
    
    // Simple IPv4 range check (for production, use 'ipaddr.js' or similar)
    for (const range of allowedRanges) {
      if (range.includes('/')) {
        // CIDR notation - simplified check
        const [network, prefix] = range.split('/');
        if (ip.startsWith(network.split('.').slice(0, 2).join('.'))) {
          return true;
        }
      } else if (ip === range) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if file is an n8n node file with security validation
   */
  private isNodeFile(filePath: string): boolean {
    if (!filePath || typeof filePath !== 'string') {
      return false;
    }

    const sanitizedPath = this.sanitizePath(filePath);
    return sanitizedPath.includes('/nodes/') && 
           (sanitizedPath.endsWith('.node.ts') || 
            sanitizedPath.endsWith('.node.js') || 
            sanitizedPath.endsWith('.credentials.ts'));
  }

  /**
   * Sanitize file paths to prevent directory traversal
   */
  private sanitizePath(filePath: string): string {
    if (!filePath) return '';
    
    return filePath
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/\/+/g, '/') // Normalize multiple slashes
      .substring(0, 500); // Limit path length
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    if (!filename) return '';
    
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow safe characters
      .substring(0, 100); // Limit filename length
  }

  /**
   * Sanitize string content
   */
  private sanitizeString(str: string): string {
    if (!str) return '';
    
    return str
      .replace(/[<>]/g, '') // Remove potential HTML
      .trim()
      .substring(0, 500); // Limit string length
  }

  /**
   * Extract filename from path
   */
  private extractFilename(filePath: string): string {
    return filePath?.split('/')?.pop() || filePath || '';
  }

  /**
   * Estimate file size (placeholder - would need actual implementation)
   */
  private estimateFileSize(filePath: string): number {
    // In a real implementation, this would get actual file size
    return filePath?.length * 100 || 0; // Rough estimate
  }

  /**
   * Anonymize IP address for privacy
   */
  private anonymizeIP(ip: string): string {
    if (!ip) return 'unknown';
    
    // For IPv4, mask the last octet
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
      }
    }
    
    // For IPv6 or other formats, mask the end
    return ip.substring(0, ip.length / 2) + 'xxx';
  }

  /**
   * Generate secure event ID
   */
  private generateSecureEventId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Log security events with proper sanitization
   */
  private logSecurityEvent(type: string, sourceIP: string, details: any): void {
    const event: SecurityEvent = {
      timestamp: new Date(),
      type: type as SecurityEvent['type'],
      sourceIP: this.anonymizeIP(sourceIP),
      details: this.sanitizeEventDetails(details)
    };
    
    this.securityEvents.push(event);
    
    // Keep only recent events to prevent memory leaks
    if (this.securityEvents.length > 10000) {
      this.securityEvents = this.securityEvents.slice(-5000);
    }
    
    logger.warn(`[Secure Webhook] Security Event: ${type}`, {
      sourceIP: event.sourceIP,
      details: event.details
    });

    // Block IP after multiple violations
    if (['signature_failure', 'invalid_payload'].includes(type)) {
      const recentViolations = this.securityEvents
        .filter(e => e.sourceIP === event.sourceIP && Date.now() - e.timestamp.getTime() < 60000)
        .length;
      
      if (recentViolations >= 5) {
        this.blockedIPs.add(sourceIP);
        logger.error(`[Secure Webhook] IP blocked due to multiple violations: ${event.sourceIP}`);
      }
    }
  }

  /**
   * Sanitize event details to prevent information leakage
   */
  private sanitizeEventDetails(details: any): any {
    if (!details || typeof details !== 'object') {
      return details;
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      } else {
        sanitized[key] = '[object]'; // Don't expose complex objects
      }
    }
    
    return sanitized;
  }

  /**
   * Store webhook event with size management
   */
  private storeWebhookEvent(event: WebhookEvent): void {
    this.receivedWebhooks.push(event);
    
    // Keep only recent webhooks to prevent memory leaks
    if (this.receivedWebhooks.length > 1000) {
      this.receivedWebhooks = this.receivedWebhooks.slice(-500);
    }
  }

  /**
   * Clean up old data to prevent memory leaks
   */
  private cleanupOldData(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Clean up old security events
    this.securityEvents = this.securityEvents.filter(
      event => event.timestamp.getTime() > oneHourAgo
    );
    
    // Clean up old webhooks
    this.receivedWebhooks = this.receivedWebhooks.filter(
      webhook => webhook.timestamp.getTime() > oneHourAgo
    );
    
    // Clean up blocked IPs (unblock after 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    // Note: This is simplified - in production, you'd want more sophisticated IP management
  }

  /**
   * Clean up delivery tracking to prevent memory leaks
   */
  private cleanupDeliveryTracking(): void {
    if (this.lastProcessedDelivery.size > 10000) {
      // Keep only the most recent 5000 delivery IDs
      const deliveries = Array.from(this.lastProcessedDelivery);
      this.lastProcessedDelivery.clear();
      deliveries.slice(-5000).forEach(id => this.lastProcessedDelivery.add(id));
    }
  }

  /**
   * Start the secure webhook server
   */
  async start(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('[Secure Webhook] Service disabled by configuration');
      return;
    }

    if (this.isRunning) {
      logger.warn('[Secure Webhook] Service already running');
      return;
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, () => {
        this.isRunning = true;
        logger.info(`[Secure Webhook] Service started securely on port ${this.config.port}`, {
          path: this.config.path,
          allowedEvents: this.config.allowedEvents,
          rateLimitEnabled: true,
          ipAllowlistEnabled: this.config.security.allowedIPs.length > 0
        });
        resolve();
      });

      this.server.on('error', (error: Error) => {
        logger.error('[Secure Webhook] Server error', error);
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
        logger.info('[Secure Webhook] Service stopped');
        resolve();
      });
    });
  }

  /**
   * Get recent webhook events
   */
  getRecentWebhooks(limit = 10): WebhookEvent[] {
    return this.receivedWebhooks.slice(-limit);
  }

  /**
   * Get recent security events
   */
  getRecentSecurityEvents(limit = 10): SecurityEvent[] {
    return this.securityEvents.slice(-limit);
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): any {
    const recentEvents = this.securityEvents.filter(
      e => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      enabled: this.config.enabled,
      isRunning: this.isRunning,
      port: this.config.port,
      totalWebhooks: this.receivedWebhooks.length,
      totalSecurityEvents: this.securityEvents.length,
      recentSecurityEvents: recentEvents.length,
      blockedIPs: this.blockedIPs.size,
      allowedEvents: this.config.allowedEvents,
      security: {
        rateLimitEnabled: true,
        ipAllowlistEnabled: this.config.security.allowedIPs.length > 0,
        httpsRequired: this.config.security.requireHttps,
        maxPayloadSize: this.config.security.maxPayloadSize
      }
    };
  }

  /**
   * Manually block an IP address
   */
  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip);
    this.logSecurityEvent('manual_ip_block', ip, { reason });
    logger.warn(`[Secure Webhook] Manually blocked IP: ${this.anonymizeIP(ip)} (${reason})`);
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ip: string): boolean {
    const wasBlocked = this.blockedIPs.delete(ip);
    if (wasBlocked) {
      logger.info(`[Secure Webhook] Unblocked IP: ${this.anonymizeIP(ip)}`);
    }
    return wasBlocked;
  }

  /**
   * Clear all security events (for maintenance)
   */
  clearSecurityEvents(): void {
    this.securityEvents = [];
    logger.info('[Secure Webhook] Security events cleared');
  }
}