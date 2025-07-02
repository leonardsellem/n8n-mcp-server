#!/usr/bin/env node
/**
 * Single-Session HTTP server for n8n-MCP
 * Implements Hybrid Single-Session Architecture for protocol compliance
 * while maintaining simplicity for single-player use case
 */
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { N8NDocumentationMCPServer } from './mcp/server';
import { ConsoleManager } from './utils/console-manager';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

interface Session {
  server: N8NDocumentationMCPServer;
  transport: StreamableHTTPServerTransport;
  lastAccess: Date;
  sessionId: string;
}

export class SingleSessionHTTPServer {
  private session: Session | null = null;
  private consoleManager = new ConsoleManager();
  private expressServer: any;
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes
  
  constructor() {
    // Validate environment on construction
    this.validateEnvironment();
  }
  
  /**
   * Validate required environment variables
   */
  private validateEnvironment(): void {
    const required = ['AUTH_TOKEN'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      const message = `Missing required environment variables: ${missing.join(', ')}`;
      logger.error(message);
      throw new Error(message);
    }
    
    if (process.env.AUTH_TOKEN && process.env.AUTH_TOKEN.length < 32) {
      logger.warn('AUTH_TOKEN should be at least 32 characters for security');
    }
  }
  
  /**
   * Handle incoming MCP request
   */
  async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now();
    
    // Wrap all operations to prevent console interference
    return this.consoleManager.wrapOperation(async () => {
      try {
        // Ensure we have a valid session
        if (!this.session || this.isExpired()) {
          await this.resetSession();
        }
        
        // Update last access time
        this.session!.lastAccess = new Date();
        
        // Handle request with existing transport
        logger.debug('Calling transport.handleRequest...');
        await this.session!.transport.handleRequest(req, res);
        logger.debug('transport.handleRequest completed');
        
        // Log request duration
        const duration = Date.now() - startTime;
        logger.info('MCP request completed', { 
          duration,
          sessionId: this.session!.sessionId
        });
        
      } catch (error) {
        logger.error('MCP request error:', error);
        
        if (!res.headersSent) {
          res.status(500).json({ 
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
              data: process.env.NODE_ENV === 'development' 
                ? (error as Error).message 
                : undefined
            },
            id: null
          });
        }
      }
    });
  }
  
  /**
   * Reset the session - clean up old and create new
   */
  private async resetSession(): Promise<void> {
    // Clean up old session if exists
    if (this.session) {
      try {
        logger.info('Closing previous session', { sessionId: this.session.sessionId });
        await this.session.transport.close();
        // Note: Don't close the server as it handles its own lifecycle
      } catch (error) {
        logger.warn('Error closing previous session:', error);
      }
    }
    
    try {
      // Create new session
      logger.info('Creating new N8NDocumentationMCPServer...');
      const server = new N8NDocumentationMCPServer();
      
      logger.info('Creating StreamableHTTPServerTransport...');
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => 'single-session', // Always same ID for single-session
      });
      
      logger.info('Connecting server to transport...');
      await server.connect(transport);
      
      this.session = {
        server,
        transport,
        lastAccess: new Date(),
        sessionId: 'single-session'
      };
      
      logger.info('Created new single session successfully', { sessionId: this.session.sessionId });
    } catch (error) {
      logger.error('Failed to create session:', error);
      throw error;
    }
  }
  
  /**
   * Check if current session is expired
   */
  private isExpired(): boolean {
    if (!this.session) return true;
    return Date.now() - this.session.lastAccess.getTime() > this.sessionTimeout;
  }
  
  /**
   * Start the HTTP server
   */
  async start(): Promise<void> {
    const app = express();
    
    // DON'T use any body parser globally - StreamableHTTPServerTransport needs raw stream
    // Only use JSON parser for specific endpoints that need it
    
    // Security headers
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      next();
    });
    
    // CORS configuration
    app.use((req, res, next) => {
      const allowedOrigin = process.env.CORS_ORIGIN || '*';
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
      res.setHeader('Access-Control-Max-Age', '86400');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
      }
      next();
    });
    
    // Request logging middleware
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        contentLength: req.get('content-length')
      });
      next();
    });
    
    // Health check endpoint (no body parsing needed for GET)
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        mode: 'single-session',
        version: '2.3.2',
        uptime: Math.floor(process.uptime()),
        sessionActive: !!this.session,
        sessionAge: this.session 
          ? Math.floor((Date.now() - this.session.lastAccess.getTime()) / 1000)
          : null,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        timestamp: new Date().toISOString()
      });
    });
    
    // Main MCP endpoint with authentication
    app.post('/mcp', async (req: express.Request, res: express.Response): Promise<void> => {
      // Simple auth check
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;
      
      if (token !== process.env.AUTH_TOKEN) {
        logger.warn('Authentication failed', { 
          ip: req.ip,
          userAgent: req.get('user-agent')
        });
        res.status(401).json({ 
          jsonrpc: '2.0',
          error: {
            code: -32001,
            message: 'Unauthorized'
          },
          id: null
        });
        return;
      }
      
      // Handle request with single session
      await this.handleRequest(req, res);
    });
    
    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ 
        error: 'Not found',
        message: `Cannot ${req.method} ${req.path}`
      });
    });
    
    // Error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Express error handler:', err);
      
      if (!res.headersSent) {
        res.status(500).json({ 
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
            data: process.env.NODE_ENV === 'development' ? err.message : undefined
          },
          id: null
        });
      }
    });
    
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    this.expressServer = app.listen(port, host, () => {
      logger.info(`n8n MCP Single-Session HTTP Server started`, { port, host });
      console.log(`n8n MCP Single-Session HTTP Server running on ${host}:${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`MCP endpoint: http://localhost:${port}/mcp`);
      console.log('\nPress Ctrl+C to stop the server');
    });
    
    // Handle server errors
    this.expressServer.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`);
        console.error(`ERROR: Port ${port} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  }
  
  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down Single-Session HTTP server...');
    
    // Clean up session
    if (this.session) {
      try {
        await this.session.transport.close();
        logger.info('Session closed');
      } catch (error) {
        logger.warn('Error closing session:', error);
      }
      this.session = null;
    }
    
    // Close Express server
    if (this.expressServer) {
      await new Promise<void>((resolve) => {
        this.expressServer.close(() => {
          logger.info('HTTP server closed');
          resolve();
        });
      });
    }
  }
  
  /**
   * Get current session info (for testing/debugging)
   */
  getSessionInfo(): { active: boolean; sessionId?: string; age?: number } {
    if (!this.session) {
      return { active: false };
    }
    
    return {
      active: true,
      sessionId: this.session.sessionId,
      age: Date.now() - this.session.lastAccess.getTime()
    };
  }
}

// Start if called directly
if (require.main === module) {
  const server = new SingleSessionHTTPServer();
  
  // Graceful shutdown handlers
  const shutdown = async () => {
    await server.shutdown();
    process.exit(0);
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    console.error('Uncaught exception:', error);
    shutdown();
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection:', reason);
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown();
  });
  
  // Start server
  server.start().catch(error => {
    logger.error('Failed to start Single-Session HTTP server:', error);
    console.error('Failed to start Single-Session HTTP server:', error);
    process.exit(1);
  });
}