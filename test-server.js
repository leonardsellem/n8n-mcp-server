#!/usr/bin/env node

// Load environment variables from .env file
import { config } from 'dotenv';
config();

async function testServerConfig() {
    console.error('Testing server configuration...');

    try {
        // Test basic server creation
        console.error('Importing MCP Server...');
        const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');
        console.error('MCP Server imported successfully');

        // Test environment config
        console.error('Testing environment config...');
        const { getEnvConfig } = await import('./build/config/environment.js');
        const envConfig = getEnvConfig();
        console.error('Environment config loaded successfully');

        // Test basic workflow tools import
        console.error('Testing workflow tools import...');
        const { setupWorkflowTools } = await import('./build/tools/workflow/index.js');
        console.error('Workflow tools imported successfully');

        // Try to get workflow tools
        console.error('Getting workflow tools...');
        const workflowTools = await setupWorkflowTools();
        console.error(`Successfully loaded ${workflowTools.length} workflow tools`);

        console.error('Basic server configuration test passed!');
        
    } catch (error) {
        console.error('Error in server configuration test:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

testServerConfig();
