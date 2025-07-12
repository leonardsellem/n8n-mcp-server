import request from 'supertest';
import crypto from 'crypto';
import { SecureGitHubWebhookService, SecureGitHubWebhookConfig } from '../../services/secure-github-webhook-service';

describe('SecureGitHubWebhookService', () => {
  let service: SecureGitHubWebhookService;
  let config: SecureGitHubWebhookConfig;
  const testSecret = 'test-webhook-secret';

  beforeEach(() => {
    config = {
      port: 3001,
      path: '/webhook',
      secret: testSecret,
      enabled: true,
      allowedEvents: ['push'],
      security: {
        maxPayloadSize: 1024 * 1024, // 1MB
        rateLimitWindowMs: 15 * 60 * 1000,
        rateLimitMaxRequests: 100,
        allowedIPs: [], // Empty for testing
        requireHttps: false,
        enableDetailedLogging: false
      }
    };

    service = new SecureGitHubWebhookService(config);
  });

  afterEach(async () => {
    await service.stop();
  });

  describe('Security Middleware', () => {
    it('should apply security headers', async () => {
      await service.start();
      
      const response = await request(service['app'])
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should enforce payload size limits', async () => {
      await service.start();
      
      const largePayload = 'x'.repeat(config.security.maxPayloadSize + 1);
      
      await request(service['app'])
        .post('/webhook')
        .send(largePayload)
        .expect(413); // Payload too large
    });

    it('should rate limit requests', async () => {
      // Set very low rate limit for testing
      service['config'].security.rateLimitMaxRequests = 2;
      service['config'].security.rateLimitWindowMs = 1000;
      
      await service.start();
      
      // First two requests should succeed (health check doesn't count)
      await request(service['app']).post('/webhook').expect(400); // Missing headers
      await request(service['app']).post('/webhook').expect(400); // Missing headers
      
      // Third request should be rate limited
      await request(service['app'])
        .post('/webhook')
        .expect(429);
    });
  });

  describe('Webhook Signature Verification', () => {
    it('should accept valid GitHub webhook signatures', async () => {
      await service.start();
      
      const payload = JSON.stringify({ repository: { full_name: 'test/repo' }, commits: [] });
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payload)
        .digest('hex');

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payload)
        .expect(200);
    });

    it('should reject invalid signatures', async () => {
      await service.start();
      
      const payload = JSON.stringify({ repository: { full_name: 'test/repo' } });
      const invalidSignature = 'sha256=invalid-signature';

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', invalidSignature)
        .set('content-type', 'application/json')
        .send(payload)
        .expect(401);
    });

    it('should reject requests without signatures', async () => {
      await service.start();
      
      const payload = JSON.stringify({ repository: { full_name: 'test/repo' } });

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('content-type', 'application/json')
        .send(payload)
        .expect(400); // Missing signature header
    });

    it('should use timing-safe comparison for signatures', async () => {
      await service.start();
      
      const payload = JSON.stringify({ repository: { full_name: 'test/repo' } });
      
      // Test with slightly different signature lengths
      const shortSig = 'sha256=short';
      const longSig = 'sha256=' + 'a'.repeat(64);

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-1')
        .set('x-hub-signature-256', shortSig)
        .set('content-type', 'application/json')
        .send(payload)
        .expect(401);

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-2')
        .set('x-hub-signature-256', longSig)
        .set('content-type', 'application/json')
        .send(payload)
        .expect(401);
    });
  });

  describe('Payload Validation', () => {
    async function sendValidWebhook(payload: any) {
      const payloadStr = JSON.stringify(payload);
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payloadStr)
        .digest('hex');

      return request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payloadStr);
    }

    it('should validate payload structure', async () => {
      await service.start();
      
      // Valid payload
      const validPayload = {
        repository: { full_name: 'test/repo' },
        commits: [],
        ref: 'refs/heads/main'
      };
      
      await sendValidWebhook(validPayload).expect(200);
      
      // Invalid payload - missing repository
      const invalidPayload = {
        commits: [],
        ref: 'refs/heads/main'
      };
      
      await sendValidWebhook(invalidPayload).expect(400);
    });

    it('should sanitize file paths in commits', async () => {
      await service.start();
      
      const payload = {
        repository: { full_name: 'test/repo' },
        ref: 'refs/heads/main',
        commits: [{
          id: 'abc123',
          message: 'Test commit',
          added: ['../../../etc/passwd', 'nodes/TestNode.node.ts'],
          modified: ['normal/file.js'],
          removed: []
        }]
      };
      
      let capturedEvent: any = null;
      service.on('webhook', (event) => {
        capturedEvent = event;
      });
      
      await sendValidWebhook(payload).expect(200);
      
      // Check that dangerous paths are sanitized
      expect(capturedEvent.files).toBeDefined();
      const sanitizedPaths = capturedEvent.files.map((f: any) => f.path);
      expect(sanitizedPaths).not.toContain('../../../etc/passwd');
    });

    it('should limit number of processed files and commits', async () => {
      await service.start();
      
      // Create payload with many commits and files
      const manyCommits = Array.from({ length: 50 }, (_, i) => ({
        id: `commit${i}`,
        message: `Commit ${i}`,
        added: Array.from({ length: 20 }, (_, j) => `file${i}_${j}.ts`),
        modified: [],
        removed: []
      }));
      
      const payload = {
        repository: { full_name: 'test/repo' },
        ref: 'refs/heads/main',
        commits: manyCommits
      };
      
      let capturedEvent: any = null;
      service.on('webhook', (event) => {
        capturedEvent = event;
      });
      
      await sendValidWebhook(payload).expect(200);
      
      // Should limit processing to prevent DoS
      expect(capturedEvent.commits.length).toBeLessThanOrEqual(20);
      expect(capturedEvent.files.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Event Processing', () => {
    it('should process push events with node files', async () => {
      await service.start();
      
      const payload = {
        repository: { full_name: 'n8n-io/n8n' },
        ref: 'refs/heads/main',
        commits: [{
          id: 'abc123',
          message: 'Add new node',
          added: ['packages/nodes-base/nodes/NewNode/NewNode.node.ts'],
          modified: [],
          removed: []
        }]
      };
      
      let webhookReceived = false;
      service.on('webhook', (event) => {
        webhookReceived = true;
        expect(event.type).toBe('push');
        expect(event.repository).toBe('n8n-io/n8n');
        expect(event.files).toBeDefined();
        expect(event.files.some((f: any) => f.isNodeFile)).toBe(true);
      });
      
      await sendValidWebhook(payload).expect(200);
      expect(webhookReceived).toBe(true);
    });

    it('should ignore events without node files', async () => {
      await service.start();
      
      const payload = {
        repository: { full_name: 'n8n-io/n8n' },
        ref: 'refs/heads/main',
        commits: [{
          id: 'abc123',
          message: 'Update README',
          added: ['README.md'],
          modified: ['docs/guide.md'],
          removed: []
        }]
      };
      
      let webhookReceived = false;
      service.on('webhook', () => {
        webhookReceived = true;
      });
      
      await sendValidWebhook(payload).expect(200);
      expect(webhookReceived).toBe(false); // Should not emit event for non-node files
    });

    it('should ignore non-allowed event types', async () => {
      await service.start();
      
      const payload = {
        repository: { full_name: 'test/repo' },
        action: 'opened',
        pull_request: { number: 1 }
      };
      
      const payloadStr = JSON.stringify(payload);
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payloadStr)
        .digest('hex');

      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'issues') // Not in allowedEvents
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payloadStr)
        .expect(200);
    });

    async function sendValidWebhook(payload: any) {
      const payloadStr = JSON.stringify(payload);
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payloadStr)
        .digest('hex');

      return request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payloadStr);
    }
  });

  describe('Security Event Logging', () => {
    it('should log security violations', async () => {
      await service.start();
      
      // Trigger signature failure
      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', 'sha256=invalid')
        .set('content-type', 'application/json')
        .send('{}')
        .expect(401);

      const stats = service.getSecurityStats();
      expect(stats.totalSecurityEvents).toBeGreaterThan(0);
      
      const recentEvents = service.getRecentSecurityEvents(10);
      expect(recentEvents.some(e => e.type === 'signature_failure')).toBe(true);
    });

    it('should block IPs after multiple violations', async () => {
      await service.start();
      
      // Send multiple invalid requests to trigger IP blocking
      for (let i = 0; i < 6; i++) {
        await request(service['app'])
          .post('/webhook')
          .set('x-github-event', 'push')
          .set('x-github-delivery', `test-delivery-${i}`)
          .set('x-hub-signature-256', 'sha256=invalid')
          .set('content-type', 'application/json')
          .send('{}')
          .expect(401);
      }

      const stats = service.getSecurityStats();
      expect(stats.blockedIPs).toBeGreaterThan(0);
    });

    it('should provide detailed security statistics', async () => {
      await service.start();
      
      const stats = service.getSecurityStats();
      
      expect(stats).toHaveProperty('enabled');
      expect(stats).toHaveProperty('isRunning');
      expect(stats).toHaveProperty('security');
      expect(stats.security).toHaveProperty('rateLimitEnabled');
      expect(stats.security).toHaveProperty('maxPayloadSize');
    });
  });

  describe('IP Allowlist', () => {
    it('should allow requests from allowlisted IPs', async () => {
      // Configure with IP allowlist
      const allowlistConfig = {
        ...config,
        security: {
          ...config.security,
          allowedIPs: ['127.0.0.1', '::1']
        }
      };
      
      const allowlistService = new SecureGitHubWebhookService(allowlistConfig);
      await allowlistService.start();
      
      try {
        await request(allowlistService['app'])
          .get('/health')
          .expect(200);
      } finally {
        await allowlistService.stop();
      }
    });

    it('should block requests from non-allowlisted IPs', async () => {
      // Configure with restrictive IP allowlist
      const restrictiveConfig = {
        ...config,
        security: {
          ...config.security,
          allowedIPs: ['192.168.1.1'] // Different from test IP
        }
      };
      
      const restrictiveService = new SecureGitHubWebhookService(restrictiveConfig);
      await restrictiveService.start();
      
      try {
        await request(restrictiveService['app'])
          .post('/webhook')
          .expect(403); // Access denied
      } finally {
        await restrictiveService.stop();
      }
    });
  });

  describe('Administrative Endpoints', () => {
    it('should provide health check endpoint', async () => {
      await service.start();
      
      const response = await request(service['app'])
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'secure-github-webhook');
      expect(response.body).toHaveProperty('security');
    });

    it('should provide admin status endpoint', async () => {
      await service.start();
      
      const response = await request(service['app'])
        .get('/admin/status')
        .expect(200);

      expect(response.body).toHaveProperty('config');
      expect(response.body).toHaveProperty('runtime');
      expect(response.body.config).not.toHaveProperty('secret'); // Should not expose secret
    });

    it('should provide security events endpoint', async () => {
      await service.start();
      
      const response = await request(service['app'])
        .get('/admin/security-events')
        .expect(200);

      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.events)).toBe(true);
    });
  });

  describe('Data Sanitization', () => {
    it('should anonymize IP addresses in logs', async () => {
      await service.start();
      
      // Trigger a security event
      await request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', 'sha256=invalid')
        .send('{}')
        .expect(401);

      const events = service.getRecentSecurityEvents(1);
      expect(events[0].sourceIP).toMatch(/\.xxx$/); // Should be anonymized
    });

    it('should redact sensitive information from webhook data', async () => {
      await service.start();
      
      const payload = {
        repository: { full_name: 'test/repo' },
        ref: 'refs/heads/main',
        commits: [{
          id: 'abc123',
          message: 'Commit message',
          author: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          added: ['file.ts']
        }]
      };
      
      let capturedEvent: any = null;
      service.on('webhook', (event) => {
        capturedEvent = event;
      });
      
      await sendValidWebhook(payload).expect(200);
      
      // Email should be redacted
      expect(capturedEvent.commits[0].author.email).toBe('[redacted]');
      // Delivery ID should be partial
      expect(capturedEvent.deliveryId.length).toBeLessThan(20);
    });

    async function sendValidWebhook(payload: any) {
      const payloadStr = JSON.stringify(payload);
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payloadStr)
        .digest('hex');

      return request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', 'test-delivery-id')
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payloadStr);
    }
  });

  describe('Memory Management', () => {
    it('should limit stored webhook history', async () => {
      await service.start();
      
      // Send many webhooks
      for (let i = 0; i < 1200; i++) {
        const payload = {
          repository: { full_name: 'test/repo' },
          ref: 'refs/heads/main',
          commits: [{
            id: `commit${i}`,
            added: ['test.ts']
          }]
        };
        
        await sendValidWebhook(payload);
      }
      
      const recentWebhooks = service.getRecentWebhooks(2000);
      expect(recentWebhooks.length).toBeLessThanOrEqual(1000); // Should be limited
    });

    it('should clean up old data periodically', async () => {
      await service.start();
      
      // Manually trigger cleanup (access private method for testing)
      (service as any).cleanupOldData();
      
      // Verify cleanup doesn't crash
      const stats = service.getSecurityStats();
      expect(stats).toBeDefined();
    });

    async function sendValidWebhook(payload: any) {
      const payloadStr = JSON.stringify(payload);
      const signature = 'sha256=' + crypto
        .createHmac('sha256', testSecret)
        .update(payloadStr)
        .digest('hex');

      return request(service['app'])
        .post('/webhook')
        .set('x-github-event', 'push')
        .set('x-github-delivery', `test-delivery-${Date.now()}-${Math.random()}`)
        .set('x-hub-signature-256', signature)
        .set('content-type', 'application/json')
        .send(payloadStr);
    }
  });
});