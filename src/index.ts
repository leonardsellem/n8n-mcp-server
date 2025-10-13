#!/usr/bin/env node
/**
 * n8n MCP Server - Main Entry Point
 * 
 * This file serves as the entry point for the n8n MCP Server,
 * which allows AI assistants to interact with n8n workflows through the MCP protocol.
 * 
 * Supports two transport modes:
 * - Stdio mode (default): For Claude Desktop and local MCP clients
 * - HTTP mode: For remote access and API integration
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { randomUUID } from 'crypto';
import { loadEnvironmentVariables } from './config/environment.js';
import { configureServer } from './config/server.js';

// Load environment variables
loadEnvironmentVariables();

/**
 * Main function to start the n8n MCP Server
 */
async function main() {
  try {
    // Check if HTTP mode is enabled
    const useHttp = process.env.MCP_TRANSPORT === 'http';
    const httpPort = parseInt(process.env.MCP_HTTP_PORT || '3000', 10);
    const httpHost = process.env.MCP_HTTP_HOST || 'localhost';

    if (useHttp) {
      // HTTP Mode - Use Streamable HTTP Transport
      console.error(`Starting n8n MCP Server in HTTP mode on ${httpHost}:${httpPort}`);
      
      const app = express();
      app.use(express.json());
      
      // Store active transports by session ID
      const transports = new Map<string, StreamableHTTPServerTransport>();

      // Health check endpoint
      app.get('/health', (req, res) => {
        res.json({ status: 'ok', transport: 'streamable-http', server: 'n8n-mcp-server' });
      });

      // MCP endpoint - POST for JSON-RPC requests
      app.post('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        
        try {
          let transport: StreamableHTTPServerTransport;

          // Check if we have an existing session
          if (sessionId && transports.has(sessionId)) {
            transport = transports.get(sessionId)!;
          } else {
            // Create new transport for new session
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              onsessioninitialized: async (newSessionId: string) => {
                transports.set(newSessionId, transport);
                console.error(`New MCP session initialized: ${newSessionId}`);
              },
              onsessionclosed: async (closedSessionId: string) => {
                transports.delete(closedSessionId);
                console.error(`MCP session closed: ${closedSessionId}`);
              }
            });

            // Create server for this transport
            const server = await configureServer();
            server.onerror = (error: unknown) => console.error('[MCP Error]', error);
            await server.connect(transport);
          }

          // Handle the request
          await transport.handleRequest(req, res, req.body);
        } catch (error) {
          console.error(`Error handling MCP request: ${error}`);
          if (!res.headersSent) {
            res.status(500).json({
              jsonrpc: '2.0',
              error: {
                code: -32603,
                message: 'Internal server error',
              },
              id: null,
            });
          }
        }
      });

      // GET endpoint for SSE streams
      app.get('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        
        if (!sessionId || !transports.has(sessionId)) {
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Invalid or missing session ID',
            },
            id: null,
          });
          return;
        }

        try {
          const transport = transports.get(sessionId)!;
          await transport.handleRequest(req, res);
        } catch (error) {
          console.error(`Error handling SSE stream: ${error}`);
          if (!res.headersSent) {
            res.status(500).json({
              jsonrpc: '2.0',
              error: {
                code: -32603,
                message: 'Failed to establish SSE stream',
              },
              id: null,
            });
          }
        }
      });

      // Start HTTP server
      app.listen(httpPort, httpHost, () => {
        console.log(`\n✓ n8n MCP Server (HTTP Mode) is running`);
        console.log(`  Endpoint: http://${httpHost}:${httpPort}/mcp`);
        console.log(`  Health: http://${httpHost}:${httpPort}/health`);
        console.log(`  Transport: Streamable HTTP\n`);
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        console.log('\nShutting down server...');
        for (const [sessionId, transport] of transports.entries()) {
          await transport.close();
        }
        process.exit(0);
      });

    } else {
      // Stdio Mode (Default) - Use Stdio Transport
      console.error('Starting n8n MCP Server in Stdio mode');

      // Create and configure the MCP server
      const server = await configureServer();

      // Set up error handling
      server.onerror = (error: unknown) => console.error('[MCP Error]', error);

      // Set up clean shutdown
      process.on('SIGINT', async () => {
        console.error('Shutting down n8n MCP Server...');
        await server.close();
        process.exit(0);
      });

      // Connect to the server transport (stdio)
      const transport = new StdioServerTransport();
      await server.connect(transport);

      console.error('n8n MCP Server running on stdio');
    }
  } catch (error) {
    console.error('Failed to start n8n MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(console.error);
