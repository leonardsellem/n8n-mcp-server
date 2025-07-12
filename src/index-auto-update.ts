#!/usr/bin/env node
/**
 * n8n MCP Server with Auto-Update Capabilities
 * 
 * This entry point starts the n8n MCP server with complete GitHub integration:
 * - Real-time GitHub synchronization
 * - Automatic cache invalidation
 * - Hot database reloading
 * - GitHub webhook integration
 * - Enhanced monitoring and statistics
 */

import { createAutoUpdateMCPServer } from './mcp/server-auto-update';
import { logger } from './utils/logger';
import { existsSync } from 'fs';

async function main() {
  try {
    // Check if database exists
    if (!existsSync('./data/nodes.db')) {
      logger.error('[Auto Update] Database not found. Please run "npm run rebuild" first.');
      process.exit(1);
    }

    // Validate environment variables
    const requiredEnvVars = ['GITHUB_TOKEN'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.warn(`[Auto Update] Missing environment variables: ${missingVars.join(', ')}`);
      logger.warn('[Auto Update] Auto-update features will be disabled');
    }

    // Log configuration
    logger.info('[Auto Update] Starting n8n MCP server with auto-update capabilities', {
      nodeVersion: process.version,
      githubToken: !!process.env.GITHUB_TOKEN,
      githubRepo: process.env.GITHUB_REPOSITORY || 'n8n-io/n8n',
      webhookSecret: !!process.env.GITHUB_WEBHOOK_SECRET,
      webhookPort: process.env.GITHUB_WEBHOOK_PORT || '3001',
      syncInterval: process.env.GITHUB_SYNC_INTERVAL || '*/15 * * * *',
      rebuildInterval: process.env.AUTO_REBUILD_INTERVAL || '0 2 * * *'
    });

    // Create and start the server
    const server = createAutoUpdateMCPServer();
    await server.start();

    // Handle process signals for graceful shutdown
    const handleShutdown = async (signal: string) => {
      logger.info(`[Auto Update] Received ${signal}, shutting down gracefully...`);
      try {
        await server.stop();
        process.exit(0);
      } catch (error) {
        logger.error('[Auto Update] Error during shutdown', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('[Auto Update] Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('[Auto Update] Unhandled rejection', { reason, promise });
      process.exit(1);
    });

  } catch (error) {
    logger.error('[Auto Update] Failed to start server', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}