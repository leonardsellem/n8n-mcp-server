#!/usr/bin/env node
/**
 * n8n MCP Server - Main Entry Point
 * 
 * This file serves as the entry point for the n8n MCP Server,
 * which allows AI assistants to interact with n8n workflows through the MCP protocol.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadEnvironmentVariables } from './config/environment.js';
import { configureServer } from './config/server.js';
import { performanceMonitor } from './monitoring/performance-monitor.js';

// Load environment variables
loadEnvironmentVariables();

/**
 * Main function to start the n8n MCP Server
 */
async function main() {
  try {
    console.error('Starting n8n MCP Server...');
    
    // Initialize performance monitoring
    const startupTimer = performanceMonitor.createTimer('server-startup');

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

    // Mark startup as complete
    startupTimer();
    performanceMonitor.markStartupComplete();

    console.error('n8n MCP Server running on stdio');
    console.error('[DEBUG] Main function try block finished.');
    
    // Log initial performance report
    setTimeout(() => {
      console.error(performanceMonitor.getFormattedReport());
    }, 2000);
  } catch (error) {
    console.error('[DEBUG] Main function catch block entered.');
    console.error('Failed to start n8n MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('[DEBUG] Main function .catch() handler reached.');
  console.error('Unhandled error in main:', error);
  process.exit(1); // Ensure process exits on unhandled main promise rejection
});
