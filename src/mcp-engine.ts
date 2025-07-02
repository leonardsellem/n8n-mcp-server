/**
 * N8N MCP Engine - Clean interface for service integration
 * 
 * This class provides a simple API for integrating the n8n-MCP server
 * into larger services. The wrapping service handles authentication,
 * multi-tenancy, rate limiting, etc.
 */
import { Request, Response } from 'express';
import { SingleSessionHTTPServer } from './http-server-single-session';
import { logger } from './utils/logger';

export interface EngineHealth {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  sessionActive: boolean;
  memoryUsage: {
    used: number;
    total: number;
    unit: string;
  };
  version: string;
}

export interface EngineOptions {
  sessionTimeout?: number;
  logLevel?: string;
}

export class N8NMCPEngine {
  private server: SingleSessionHTTPServer;
  private startTime: Date;
  
  constructor(options: EngineOptions = {}) {
    this.server = new SingleSessionHTTPServer();
    this.startTime = new Date();
    
    if (options.logLevel) {
      process.env.LOG_LEVEL = options.logLevel;
    }
  }
  
  /**
   * Process a single MCP request
   * The wrapping service handles authentication, multi-tenancy, etc.
   * 
   * @example
   * // In your service
   * const engine = new N8NMCPEngine();
   * 
   * app.post('/api/users/:userId/mcp', authenticate, async (req, res) => {
   *   // Your service handles auth, rate limiting, user context
   *   await engine.processRequest(req, res);
   * });
   */
  async processRequest(req: Request, res: Response): Promise<void> {
    try {
      await this.server.handleRequest(req, res);
    } catch (error) {
      logger.error('Engine processRequest error:', error);
      throw error;
    }
  }
  
  /**
   * Health check for service monitoring
   * 
   * @example
   * app.get('/health', async (req, res) => {
   *   const health = await engine.healthCheck();
   *   res.status(health.status === 'healthy' ? 200 : 503).json(health);
   * });
   */
  async healthCheck(): Promise<EngineHealth> {
    try {
      const sessionInfo = this.server.getSessionInfo();
      const memoryUsage = process.memoryUsage();
      
      return {
        status: 'healthy',
        uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
        sessionActive: sessionInfo.active,
        memoryUsage: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        version: '2.3.2'
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        uptime: 0,
        sessionActive: false,
        memoryUsage: { used: 0, total: 0, unit: 'MB' },
        version: '2.3.2'
      };
    }
  }
  
  /**
   * Get current session information
   * Useful for monitoring and debugging
   */
  getSessionInfo(): { active: boolean; sessionId?: string; age?: number } {
    return this.server.getSessionInfo();
  }
  
  /**
   * Graceful shutdown for service lifecycle
   * 
   * @example
   * process.on('SIGTERM', async () => {
   *   await engine.shutdown();
   *   process.exit(0);
   * });
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down N8N MCP Engine...');
    await this.server.shutdown();
  }
  
  /**
   * Start the engine (if using standalone mode)
   * For embedded use, this is not necessary
   */
  async start(): Promise<void> {
    await this.server.start();
  }
}

/**
 * Example usage in a multi-tenant service:
 * 
 * ```typescript
 * import { N8NMCPEngine } from 'n8n-mcp/engine';
 * import express from 'express';
 * 
 * const app = express();
 * const engine = new N8NMCPEngine();
 * 
 * // Middleware for authentication
 * const authenticate = (req, res, next) => {
 *   // Your auth logic
 *   req.userId = 'user123';
 *   next();
 * };
 * 
 * // MCP endpoint with multi-tenant support
 * app.post('/api/mcp/:userId', authenticate, async (req, res) => {
 *   // Log usage for billing
 *   await logUsage(req.userId, 'mcp-request');
 *   
 *   // Rate limiting
 *   if (await isRateLimited(req.userId)) {
 *     return res.status(429).json({ error: 'Rate limited' });
 *   }
 *   
 *   // Process request
 *   await engine.processRequest(req, res);
 * });
 * 
 * // Health endpoint
 * app.get('/health', async (req, res) => {
 *   const health = await engine.healthCheck();
 *   res.json(health);
 * });
 * ```
 */
export default N8NMCPEngine;