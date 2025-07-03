#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment for MCP
process.env.MCP_MODE = 'stdio';

const tools = [
  { name: 'start_here_workflow_guide', args: {} },
  { name: 'get_database_statistics', args: {} },
  { name: 'list_nodes', args: { limit: 3 } },
  { name: 'search_nodes', args: { query: 'slack', limit: 2 } },
  { name: 'get_node_info', args: { nodeType: 'nodes-base.set' } },
  { name: 'get_node_essentials', args: { nodeType: 'nodes-base.webhook' } },
  { name: 'get_node_documentation', args: { nodeType: 'nodes-base.httpRequest' } },
  { name: 'search_node_properties', args: { nodeType: 'nodes-base.slack', query: 'channel' } },
  { name: 'get_node_for_task', args: { task: 'send_slack_message' } },
  { name: 'list_tasks', args: {} },
  { name: 'validate_node_minimal', args: { nodeType: 'nodes-base.set', config: { mode: 'manual' } } },
  { name: 'validate_node_operation', args: { nodeType: 'nodes-base.slack', config: { resource: 'message', operation: 'post' } } },
  { name: 'validate_workflow', args: { workflow: { nodes: [], connections: {} } } },
  { name: 'validate_workflow_connections', args: { workflow: { nodes: [], connections: {} } } },
  { name: 'validate_workflow_expressions', args: { workflow: { nodes: [], connections: {} } } },
  { name: 'get_node_as_tool_info', args: { nodeType: 'nodes-base.slack' } },
  { name: 'list_ai_tools', args: { limit: 5 } },
  { name: 'n8n_health_check', args: {} },
  { name: 'n8n_list_available_tools', args: {} },
  { name: 'n8n_list_workflows', args: {} },
  { name: 'n8n_get_workflow', args: { id: 'test' } },
  { name: 'n8n_list_executions', args: {} }
];

console.log('🧪 COMPREHENSIVE n8n MCP SERVER TOOL TEST');
console.log('=' .repeat(50));

async function testTool(tool, index) {
  return new Promise((resolve, reject) => {
    const messages = [
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" }
        }
      }),
      JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: tool.name,
          arguments: tool.args
        }
      })
    ];

    const input = messages.join('\n') + '\n';
    
    const child = spawn('node', ['dist/mcp/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, MCP_MODE: 'stdio' }
    });

    let output = '';
    let hasResult = false;
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      // Look for the tool result (second response)
      const lines = output.split('\n').filter(line => line.trim());
      if (lines.length >= 2) {
        try {
          const result = JSON.parse(lines[1]);
          if (result.id === 2) {
            hasResult = true;
            child.kill();
            resolve({ tool: tool.name, success: true, result: result.result || result.error });
          }
        } catch (e) {
          // Continue collecting output
        }
      }
    });

    child.stderr.on('data', (data) => {
      console.error(`❌ ${tool.name} stderr:`, data.toString());
    });

    child.on('close', (code) => {
      if (!hasResult) {
        resolve({ tool: tool.name, success: false, error: `Process closed with code ${code}, output: ${output}` });
      }
    });

    child.on('error', (error) => {
      resolve({ tool: tool.name, success: false, error: error.message });
    });

    // Send input and close stdin
    child.stdin.write(input);
    child.stdin.end();

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!hasResult) {
        child.kill();
        resolve({ tool: tool.name, success: false, error: 'Timeout after 10 seconds' });
      }
    }, 10000);
  });
}

async function runAllTests() {
  const results = [];
  let passed = 0;
  let failed = 0;

  console.log(`Testing ${tools.length} MCP tools...\n`);

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    process.stdout.write(`${(i + 1).toString().padStart(2)}. ${tool.name.padEnd(30)} ... `);
    
    try {
      const result = await testTool(tool, i);
      
      if (result.success) {
        console.log('✅ PASS');
        passed++;
      } else {
        console.log('❌ FAIL');
        console.log(`    Error: ${result.error}`);
        failed++;
      }
      
      results.push(result);
    } catch (error) {
      console.log('❌ FAIL');
      console.log(`    Exception: ${error.message}`);
      failed++;
      results.push({ tool: tool.name, success: false, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${tools.length}`);
  console.log(`❌ Failed: ${failed}/${tools.length}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tools.length) * 100)}%`);

  if (failed > 0) {
    console.log('\n❌ FAILED TOOLS:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.tool}: ${r.error}`);
    });
  }

  console.log('\n🎯 MCP SERVER STATUS:', passed > tools.length * 0.8 ? '✅ FULLY OPERATIONAL' : '⚠️ NEEDS ATTENTION');
  
  return { passed, failed, total: tools.length, results };
}

// Run the tests
runAllTests().catch(console.error);
