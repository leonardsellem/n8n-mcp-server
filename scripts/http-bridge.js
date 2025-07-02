#!/usr/bin/env node

/**
 * HTTP-to-stdio bridge for n8n-MCP
 * Connects to n8n-MCP HTTP server and bridges stdio communication
 */

const http = require('http');
const readline = require('readline');

const MCP_URL = process.env.MCP_URL || 'http://localhost:3000/mcp';
const AUTH_TOKEN = process.env.AUTH_TOKEN || process.argv[2];

if (!AUTH_TOKEN) {
  console.error('Error: AUTH_TOKEN environment variable or first argument required');
  process.exit(1);
}

// Parse URL
const url = new URL(MCP_URL);

// Create readline interface for stdio
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Buffer for incomplete JSON messages
let buffer = '';

// Handle incoming stdio messages
rl.on('line', async (line) => {
  try {
    const message = JSON.parse(line);
    
    // Forward to HTTP server
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Accept': 'application/json, text/event-stream'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          // Try to parse as JSON
          const response = JSON.parse(responseData);
          console.log(JSON.stringify(response));
        } catch (e) {
          // Handle SSE format
          const lines = responseData.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                console.log(JSON.stringify(data));
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      });
    });

    req.on('error', (error) => {
      console.error(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: `HTTP request failed: ${error.message}`
        },
        id: message.id || null
      }));
    });

    req.write(JSON.stringify(message));
    req.end();
  } catch (error) {
    // Not valid JSON, ignore
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});