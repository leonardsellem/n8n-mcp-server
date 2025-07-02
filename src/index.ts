#!/usr/bin/env node
/**
 * n8n MCP Server - Simplified Production Entry Point
 * 
 * This is the main entry point for the simplified n8n MCP Server.
 * It uses a streamlined architecture focused on reliability and performance.
 */

import { N8NDocumentationMCPServer } from './mcp/server.js';
import { logger } from './utils/logger.js';

/**
 * Main function to start the n8n MCP Server
 */
async function main() {
  try {
    logger.info('Starting n8n MCP Server (Simplified Production Version)...');
    
    const server = new N8NDocumentationMCPServer();
    await server.run();
    
  } catch (error) {
    logger.error('Failed to start n8n MCP Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  logger.error('Unhandled error in main:', error);
  process.exit(1);
});
