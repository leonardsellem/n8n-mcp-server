#!/usr/bin/env node
/**
 * Fixed HTTP server for n8n-MCP that properly handles StreamableHTTPServerTransport initialization
 * This implementation ensures the transport is properly initialized before handling requests
 */
import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { n8nDocumentationToolsFinal } from './mcp/tools';
import { n8nManagementTools } from './mcp/tools-n8n-manager';
import { N8NDocumentationMCPServer } from './mcp/server';
import { logger } from './utils/logger';
import { PROJECT_VERSION } from './utils/version';
import { isN8nApiConfigured } from './config/n8n-api';
import dotenv from 'dotenv';

dotenv.config();

let expressServer: any;

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = ['AUTH_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Generate AUTH_TOKEN with: openssl rand -base64 32');
    process.exit(1);
  }
  
  if (process.env.AUTH_TOKEN && process.env.AUTH_TOKEN.length < 32) {
    logger.warn('AUTH_TOKEN should be at least 32 characters for security');
    console.warn('WARNING: AUTH_TOKEN should be at least 32 characters for security');
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
  logger.info('Shutting down HTTP server...');
  console.log('Shutting down HTTP server...');
  
  if (expressServer) {
    expressServer.close(() => {
      logger.info('HTTP server closed');
      console.log('HTTP server closed');
      process.exit(0);
    });
    
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

export async function startFixedHTTPServer() {
  validateEnvironment();
  
  const app = express();
  
  // CRITICAL: Don't use any body parser - StreamableHTTPServerTransport needs raw stream
  
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
  
  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      contentLength: req.get('content-length')
    });
    next();
  });
  
  // Create a single persistent MCP server instance
  const mcpServer = new N8NDocumentationMCPServer();
  logger.info('Created persistent MCP server instance');

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      mode: 'http-fixed',
      version: PROJECT_VERSION,
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      timestamp: new Date().toISOString()
    });
  });

  // Version endpoint
  app.get('/version', (req, res) => {
    res.json({ 
      version: PROJECT_VERSION,
      buildTime: new Date().toISOString(),
      tools: n8nDocumentationToolsFinal.map(t => t.name),
      commit: process.env.GIT_COMMIT || 'unknown'
    });
  });

  // Test tools endpoint
  app.get('/test-tools', async (req, res) => {
    try {
      const result = await mcpServer.executeTool('get_node_essentials', { nodeType: 'nodes-base.httpRequest' });
      res.json({ status: 'ok', hasData: !!result, toolCount: n8nDocumentationToolsFinal.length });
    } catch (error) {
      res.json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  // Main MCP endpoint - handle each request with custom transport handling
  app.post('/mcp', async (req: express.Request, res: express.Response): Promise<void> => {
    const startTime = Date.now();
    
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
    
    try {
      // Instead of using StreamableHTTPServerTransport, we'll handle the request directly
      // This avoids the initialization issues with the transport
      
      // Collect the raw body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const jsonRpcRequest = JSON.parse(body);
          logger.debug('Received JSON-RPC request:', { method: jsonRpcRequest.method });
          
          // Handle the request based on method
          let response;
          
          switch (jsonRpcRequest.method) {
            case 'initialize':
              response = {
                jsonrpc: '2.0',
                result: {
                  protocolVersion: '2024-11-05',
                  capabilities: {
                    tools: {},
                    resources: {}
                  },
                  serverInfo: {
                    name: 'n8n-documentation-mcp',
                    version: PROJECT_VERSION
                  }
                },
                id: jsonRpcRequest.id
              };
              break;
              
            case 'tools/list':
              // Use the proper tool list that includes management tools when configured
              const tools = [...n8nDocumentationToolsFinal];
              
              // Add management tools if n8n API is configured
              if (isN8nApiConfigured()) {
                tools.push(...n8nManagementTools);
              }
              
              response = {
                jsonrpc: '2.0',
                result: {
                  tools
                },
                id: jsonRpcRequest.id
              };
              break;
              
            case 'tools/call':
              // Delegate to the MCP server
              const toolName = jsonRpcRequest.params?.name;
              const toolArgs = jsonRpcRequest.params?.arguments || {};
              
              try {
                const result = await mcpServer.executeTool(toolName, toolArgs);
                response = {
                  jsonrpc: '2.0',
                  result: {
                    content: [
                      {
                        type: 'text',
                        text: JSON.stringify(result, null, 2)
                      }
                    ]
                  },
                  id: jsonRpcRequest.id
                };
              } catch (error) {
                response = {
                  jsonrpc: '2.0',
                  error: {
                    code: -32603,
                    message: `Error executing tool ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`
                  },
                  id: jsonRpcRequest.id
                };
              }
              break;
              
            default:
              response = {
                jsonrpc: '2.0',
                error: {
                  code: -32601,
                  message: `Method not found: ${jsonRpcRequest.method}`
                },
                id: jsonRpcRequest.id
              };
          }
          
          // Send response
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
          
          const duration = Date.now() - startTime;
          logger.info('MCP request completed', { 
            duration,
            method: jsonRpcRequest.method 
          });
        } catch (error) {
          logger.error('Error processing request:', error);
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32700,
              message: 'Parse error',
              data: error instanceof Error ? error.message : 'Unknown error'
            },
            id: null
          });
        }
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
  
  expressServer = app.listen(port, host, () => {
    logger.info(`n8n MCP Fixed HTTP Server started`, { port, host });
    console.log(`n8n MCP Fixed HTTP Server running on ${host}:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    console.log('\nPress Ctrl+C to stop the server');
  });
  
  // Handle errors
  expressServer.on('error', (error: any) => {
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
  
  // Graceful shutdown handlers
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
}

// Make executeTool public on the server
declare module './mcp/server' {
  interface N8NDocumentationMCPServer {
    executeTool(name: string, args: any): Promise<any>;
  }
}

// Start if called directly
if (require.main === module) {
  startFixedHTTPServer().catch(error => {
    logger.error('Failed to start Fixed HTTP server:', error);
    console.error('Failed to start Fixed HTTP server:', error);
    process.exit(1);
  });
}