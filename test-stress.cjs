#!/usr/bin/env node

/**
 * Stress test script for n8n MCP server
 * Tests various scenarios that might trigger the "Could not find workflow" error
 */

const { spawn } = require('child_process');
const path = require('path');

// Test scenarios
const testScenarios = [
  {
    name: "Basic workflow operations",
    tests: [
      { tool: "list_workflows", args: {} },
      { tool: "get_workflow", args: { workflowId: "bCAZULNUODuDO3E9" } },
      { tool: "create_smart_workflow", args: { name: "Test Workflow 1", description: "Simple test", useTemplate: true } }
    ]
  },
  {
    name: "Error conditions",
    tests: [
      { tool: "get_workflow", args: { workflowId: "invalid-id" }, expectError: true },
      { tool: "update_workflow", args: { workflowId: "invalid-id", name: "Test" }, expectError: true },
      { tool: "delete_workflow", args: { workflowId: "invalid-id" }, expectError: true }
    ]
  },
  {
    name: "Node discovery operations",
    tests: [
      { tool: "discover_nodes", args: { search: "webhook" } },
      { tool: "get_node_info", args: { nodeType: "n8n-nodes-base.webhook" } },
      { tool: "suggest_nodes", args: { description: "send email" } }
    ]
  },
  {
    name: "Validation operations",
    tests: [
      { tool: "validate_workflow", args: { workflow: { name: "Test", nodes: [], connections: {} } } },
      { tool: "validate_node", args: { nodeType: "n8n-nodes-base.webhook", parameters: {} } }
    ]
  },
  {
    name: "Execution operations",
    tests: [
      { tool: "list_executions", args: {} },
      { tool: "get_execution", args: { executionId: "invalid-id" }, expectError: true }
    ]
  }
];

async function runTest(tool, args, expectError = false) {
  return new Promise((resolve) => {
    const testProcess = spawn('node', [
      '-e', 
      `
      const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
      const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
      
      async function test() {
        const transport = new StdioClientTransport({
          command: 'node',
          args: ['build/index.js']
        });
        
        const client = new Client({
          name: "test-client",
          version: "1.0.0"
        }, {
          capabilities: {}
        });
        
        try {
          await client.connect(transport);
          const result = await client.request({
            method: "tools/call",
            params: {
              name: "${tool}",
              arguments: ${JSON.stringify(args)}
            }
          });
          console.log(JSON.stringify({ success: true, result: result.content }));
        } catch (error) {
          console.log(JSON.stringify({ 
            success: false, 
            error: error.message,
            code: error.code,
            expectError: ${expectError}
          }));
        } finally {
          await client.close();
        }
      }
      
      test().catch(console.error);
      `
    ], {
      cwd: path.join(__dirname),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    testProcess.on('close', (code) => {
      try {
        const result = JSON.parse(output.trim());
        resolve({
          tool,
          args,
          expectError,
          ...result,
          stderr: errorOutput
        });
      } catch (e) {
        resolve({
          tool,
          args,
          expectError,
          success: false,
          error: `Parse error: ${e.message}`,
          stdout: output,
          stderr: errorOutput
        });
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      testProcess.kill();
      resolve({
        tool,
        args,
        expectError,
        success: false,
        error: 'Timeout',
        timeout: true
      });
    }, 30000);
  });
}

async function runStressTest() {
  console.log('🧪 Starting n8n MCP Server Stress Test');
  console.log('=====================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const scenario of testScenarios) {
    console.log(`📋 Testing: ${scenario.name}`);
    console.log('-'.repeat(50));

    for (const test of scenario.tests) {
      totalTests++;
      console.log(`  🔄 ${test.tool}(${JSON.stringify(test.args).substring(0, 50)}...)`);
      
      const result = await runTest(test.tool, test.args, test.expectError);
      
      if (result.timeout) {
        console.log(`    ⏰ TIMEOUT`);
        failedTests++;
      } else if (result.expectError && !result.success) {
        console.log(`    ✅ EXPECTED ERROR: ${result.error}`);
        passedTests++;
      } else if (!result.expectError && result.success) {
        console.log(`    ✅ SUCCESS`);
        passedTests++;
      } else {
        console.log(`    ❌ FAILED: ${result.error}`);
        if (result.stderr) {
          console.log(`    📝 STDERR: ${result.stderr.substring(0, 200)}...`);
        }
        failedTests++;
      }
    }
    console.log('');
  }

  console.log('📊 Test Results');
  console.log('================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! The MCP server appears to be working correctly.');
    console.log('The "Could not find workflow" error might be:');
    console.log('  - A UI-specific issue in the n8n web interface');
    console.log('  - A timing issue during specific operations');
    console.log('  - Related to specific workflow states or conditions');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above for details.');
  }
}

runStressTest().catch(console.error);
