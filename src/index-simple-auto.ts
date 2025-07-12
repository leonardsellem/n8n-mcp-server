#!/usr/bin/env node
/**
 * Simple Auto-Updating n8n MCP Server for AI Agents
 * 
 * Just works, every time:
 * - Auto-updates from GitHub every 15 minutes
 * - Always falls back to local nodes if GitHub fails
 * - Never breaks - AI agents always get working nodes
 * - Zero configuration complexity
 * - One-shot reliability guaranteed
 */

import { createSimpleAutoMCPServer } from './mcp/simple-auto-server';
import { logger } from './utils/logger';
import { existsSync } from 'fs';

async function main() {
  try {
    // Check if database exists
    if (!existsSync('./data/nodes.db')) {
      logger.error('[Simple Auto] Database not found. Please run "npm run rebuild" first.');
      process.exit(1);
    }

    // Log simple configuration
    const hasGitHubToken = !!process.env.GITHUB_TOKEN;
    const updateInterval = process.env.UPDATE_INTERVAL_MINUTES || '15';
    
    logger.info('[Simple Auto] Starting simple auto-updating n8n MCP server', {
      autoUpdate: hasGitHubToken ? 'enabled' : 'disabled (no GITHUB_TOKEN)',
      updateInterval: hasGitHubToken ? `${updateInterval} minutes` : 'N/A',
      nodeVersion: process.version
    });

    if (!hasGitHubToken) {
      logger.warn('[Simple Auto] No GITHUB_TOKEN provided - running in local-only mode');
      logger.warn('[Simple Auto] Set GITHUB_TOKEN environment variable to enable auto-updates');
    }

    // Create and start the server
    const server = createSimpleAutoMCPServer();
    await server.start();

    // Handle process signals for graceful shutdown
    const handleShutdown = async (signal: string) => {
      logger.info(`[Simple Auto] Received ${signal}, shutting down gracefully...`);
      try {
        await server.stop();
        process.exit(0);
      } catch (error) {
        logger.error('[Simple Auto] Error during shutdown', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('[Simple Auto] Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('[Simple Auto] Unhandled rejection', { reason, promise });
      process.exit(1);
    });

  } catch (error) {
    logger.error('[Simple Auto] Failed to start server', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}