#!/usr/bin/env node

async function runTest() {
    console.error('Starting minimal test...');

    try {
        // Test basic imports first
        console.error('Testing basic imports...');
        
        // Test MCP SDK import
        console.error('Importing MCP SDK...');
        const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
        console.error('MCP SDK imported successfully');
        
        // Test our environment config
        console.error('Testing environment config...');
        const { loadEnvironmentVariables } = await import('./build/config/environment.js');
        loadEnvironmentVariables();
        console.error('Environment loaded successfully');
        
        console.error('All imports successful - the issue is likely in server configuration');
        
    } catch (error) {
        console.error('Error in minimal test:', error);
        process.exit(1);
    }
}

runTest();
