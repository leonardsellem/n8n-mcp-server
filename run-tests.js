/**
 * Test Runner Script
 * 
 * This script provides a more reliable way to run Jest tests with proper
 * ESM support and error handling.
 */

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set NODE_OPTIONS to ensure proper ESM support
process.env.NODE_OPTIONS = '--experimental-vm-modules';

console.log('🧪 Running tests for n8n MCP Server...');

// Get command line arguments to pass to Jest
const args = process.argv.slice(2);
const jestArgs = ['--config', './jest.config.cjs', ...args];

// Use npx to run Jest which handles cross-platform execution better
const command = `npx jest ${jestArgs.join(' ')}`;

// Execute Jest
const jestProcess = exec(command, {
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'test' }
});

jestProcess.stdout.pipe(process.stdout);
jestProcess.stderr.pipe(process.stderr);

// Handle process events
jestProcess.on('error', (error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});

jestProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Test process exited with code ${code}`);
    process.exit(code);
  }
  console.log('✅ Tests completed successfully');
});
