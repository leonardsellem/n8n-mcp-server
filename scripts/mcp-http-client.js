#!/usr/bin/env node

/**
 * Minimal MCP HTTP Client for Node.js v16 compatibility
 * This bypasses mcp-remote and its TransformStream dependency
 */

const http = require('http');
const https = require('https');
const readline = require('readline');

// Get configuration from command line arguments
const url = process.argv[2];
const authToken = process.env.MCP_AUTH_TOKEN;

if (!url) {
  console.error('Usage: node mcp-http-client.js <server-url>');
  process.exit(1);
}

if (!authToken) {
  console.error('Error: MCP_AUTH_TOKEN environment variable is required');
  process.exit(1);
}

// Parse URL
const parsedUrl = new URL(url);
const isHttps = parsedUrl.protocol === 'https:';
const httpModule = isHttps ? https : http;

// Create readline interface for stdio
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Buffer for incomplete JSON messages
let buffer = '';

// Function to send JSON-RPC request
function sendRequest(request) {
  const requestBody = JSON.stringify(request);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (isHttps ? 443 : 80),
    path: parsedUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = httpModule.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        // Ensure the response has the correct structure
        if (response.jsonrpc && (response.result !== undefined || response.error !== undefined)) {
          console.log(JSON.stringify(response));
        } else {
          // Wrap non-JSON-RPC responses
          console.log(JSON.stringify({
            jsonrpc: '2.0',
            id: request.id || null,
            error: {
              code: -32603,
              message: 'Internal error',
              data: response
            }
          }));
        }
      } catch (err) {
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id: request.id || null,
          error: {
            code: -32700,
            message: 'Parse error',
            data: err.message
          }
        }));
      }
    });
  });

  req.on('error', (err) => {
    console.log(JSON.stringify({
      jsonrpc: '2.0',
      id: request.id || null,
      error: {
        code: -32000,
        message: 'Transport error',
        data: err.message
      }
    }));
  });

  req.write(requestBody);
  req.end();
}

// Process incoming JSON-RPC messages from stdin
rl.on('line', (line) => {
  // Try to parse each line as a complete JSON-RPC message
  try {
    const request = JSON.parse(line);
    
    // Forward the request to the HTTP server
    sendRequest(request);
  } catch (err) {
    // Log parse errors to stdout in JSON-RPC format
    console.log(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error',
        data: err.message
      }
    }));
  }
});

// Handle process termination
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});