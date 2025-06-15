/**
 * Test script for the repair_workflow_triggers tool
 * 
 * This script tests the new repair tool to ensure it can fix workflows
 * with triggerCount: 0 issues.
 */

const { spawn } = require('child_process');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  serverPath: path.join(__dirname, 'build', 'index.js'),
  timeout: 30000, // 30 seconds
  testWorkflowId: null // Will be set during test
};

/**
 * Send MCP request to the server
 */
function sendMCPRequest(server, request) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, TEST_CONFIG.timeout);

    const handleResponse = (data) => {
      try {
        const lines = data.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
          const response = JSON.parse(line);
          if (response.id === request.id) {
            clearTimeout(timeout);
            server.stdout.off('data', handleResponse);
            resolve(response);
            return;
          }
        }
      } catch (error) {
        // Continue listening for more data
      }
    };

    server.stdout.on('data', handleResponse);
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

/**
 * Test the repair_workflow_triggers tool
 */
async function testRepairTool() {
  console.log('🔧 Testing repair_workflow_triggers tool...\n');

  // Start the MCP server
  const server = spawn('node', [TEST_CONFIG.serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'test' }
  });

  let testsPassed = 0;
  let totalTests = 0;

  try {
    // Initialize the server
    console.log('📡 Initializing MCP server...');
    const initResponse = await sendMCPRequest(server, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    });

    if (initResponse.error) {
      throw new Error(`Initialization failed: ${initResponse.error.message}`);
    }
    console.log('✅ Server initialized successfully\n');

    // Test 1: List available tools to verify repair tool is registered
    totalTests++;
    console.log('🔍 Test 1: Checking if repair_workflow_triggers tool is available...');
    const toolsResponse = await sendMCPRequest(server, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    });

    if (toolsResponse.error) {
      console.log('❌ Failed to list tools:', toolsResponse.error.message);
    } else {
      const repairTool = toolsResponse.result.tools.find(tool => tool.name === 'repair_workflow_triggers');
      if (repairTool) {
        console.log('✅ repair_workflow_triggers tool found in tool list');
        console.log(`   Description: ${repairTool.description}`);
        testsPassed++;
      } else {
        console.log('❌ repair_workflow_triggers tool not found in tool list');
        console.log('Available tools:', toolsResponse.result.tools.map(t => t.name).join(', '));
      }
    }

    // Test 2: List workflows to find one to test with
    totalTests++;
    console.log('\n🔍 Test 2: Finding a workflow to test repair on...');
    const workflowsResponse = await sendMCPRequest(server, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'list_workflows',
        arguments: { active: false }
      }
    });

    if (workflowsResponse.error) {
      console.log('❌ Failed to list workflows:', workflowsResponse.error.message);
    } else if (workflowsResponse.result.content && workflowsResponse.result.content[0]) {
      const workflows = JSON.parse(workflowsResponse.result.content[0].text);
      if (workflows.length > 0) {
        TEST_CONFIG.testWorkflowId = workflows[0].id;
        console.log(`✅ Found workflow to test: ${workflows[0].name} (ID: ${TEST_CONFIG.testWorkflowId})`);
        testsPassed++;
      } else {
        console.log('⚠️  No workflows found to test with');
      }
    }

    // Test 3: Test repair tool with dry run
    if (TEST_CONFIG.testWorkflowId) {
      totalTests++;
      console.log('\n🔍 Test 3: Testing repair tool with dry run...');
      const repairResponse = await sendMCPRequest(server, {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'repair_workflow_triggers',
          arguments: {
            workflowId: TEST_CONFIG.testWorkflowId,
            dryRun: true
          }
        }
      });

      if (repairResponse.error) {
        console.log('❌ Repair tool failed:', repairResponse.error.message);
      } else {
        console.log('✅ Repair tool executed successfully (dry run)');
        if (repairResponse.result.content && repairResponse.result.content[0]) {
          const result = JSON.parse(repairResponse.result.content[0].text);
          console.log(`   Analysis: ${JSON.stringify(result, null, 2)}`);
        }
        testsPassed++;
      }
    }

    // Test 4: Test repair tool error handling with invalid workflow ID
    totalTests++;
    console.log('\n🔍 Test 4: Testing error handling with invalid workflow ID...');
    const errorResponse = await sendMCPRequest(server, {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'repair_workflow_triggers',
        arguments: {
          workflowId: 'invalid-workflow-id',
          dryRun: true
        }
      }
    });

    if (errorResponse.error || (errorResponse.result.isError)) {
      console.log('✅ Error handling works correctly for invalid workflow ID');
      testsPassed++;
    } else {
      console.log('❌ Expected error for invalid workflow ID, but got success');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    // Clean up
    server.kill();
  }

  // Results
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed! The repair tool is working correctly.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
    return false;
  }
}

/**
 * Main test execution
 */
async function main() {
  console.log('🚀 Starting repair_workflow_triggers tool test\n');
  
  try {
    const success = await testRepairTool();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = { testRepairTool };
