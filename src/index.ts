#!/usr/bin/env node
/**
 * n8n MCP Server - Main Entry Point
 * 
 * This file serves as the entry point for the n8n MCP Server,
 * which allows AI assistants to interact with n8n workflows through the MCP protocol.
 */

import { loadEnvironmentVariables } from './config/environment.js';
import { startServer } from './config/server.js';

// Load environment variables
loadEnvironmentVariables();

/**
 * Main function to start the n8n MCP Server
 */
async function main() {
  try {
    console.error('Starting n8n MCP Server...');
    await startServer();
  } catch (error) {
    console.error('Failed to start n8n MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
