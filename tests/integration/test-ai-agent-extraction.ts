import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import * as path from 'path';

/**
 * Integration test for AI Agent node extraction
 * This simulates an MCP client requesting the AI Agent code from n8n
 */
async function testAIAgentExtraction() {
  console.log('=== AI Agent Node Extraction Test ===\n');
  
  // Create MCP client
  const client = new Client(
    {
      name: 'test-mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    console.log('1. Starting MCP server...');
    const serverPath = path.join(__dirname, '../../dist/index.js');
    const transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
      env: {
        ...process.env,
        N8N_API_URL: process.env.N8N_API_URL || 'http://localhost:5678',
        N8N_API_KEY: process.env.N8N_API_KEY || 'test-key',
        LOG_LEVEL: 'debug',
      },
    });

    await client.connect(transport);
    console.log('✓ Connected to MCP server\n');

    // Test 1: List available tools
    console.log('2. Listing available tools...');
    const toolsResponse = await client.request(
      { method: 'tools/list' },
      {}
    );
    console.log(`✓ Found ${toolsResponse.tools.length} tools`);
    
    const hasNodeSourceTool = toolsResponse.tools.some(
      (tool: any) => tool.name === 'get_node_source_code'
    );
    console.log(`✓ Node source extraction tool available: ${hasNodeSourceTool}\n`);

    // Test 2: List available nodes
    console.log('3. Listing available nodes...');
    const listNodesResponse = await client.request(
      {
        method: 'tools/call',
        params: {
          name: 'list_available_nodes',
          arguments: {
            search: 'agent',
          },
        },
      },
      {}
    );
    console.log(`✓ Found nodes matching 'agent':`);
    const content = JSON.parse(listNodesResponse.content[0].text);
    content.nodes.forEach((node: any) => {
      console.log(`  - ${node.displayName}: ${node.description}`);
    });
    console.log();

    // Test 3: Extract AI Agent node source code
    console.log('4. Extracting AI Agent node source code...');
    const aiAgentResponse = await client.request(
      {
        method: 'tools/call',
        params: {
          name: 'get_node_source_code',
          arguments: {
            nodeType: '@n8n/n8n-nodes-langchain.Agent',
            includeCredentials: true,
          },
        },
      },
      {}
    );

    const result = JSON.parse(aiAgentResponse.content[0].text);
    console.log('✓ Successfully extracted AI Agent node:');
    console.log(`  - Node Type: ${result.nodeType}`);
    console.log(`  - Location: ${result.location}`);
    console.log(`  - Source Code Length: ${result.sourceCode.length} characters`);
    console.log(`  - Has Credential Code: ${!!result.credentialCode}`);
    
    if (result.packageInfo) {
      console.log(`  - Package: ${result.packageInfo.name} v${result.packageInfo.version}`);
    }

    // Show a snippet of the code
    console.log('\n5. Source Code Preview:');
    console.log('```javascript');
    console.log(result.sourceCode.substring(0, 500) + '...');
    console.log('```\n');

    // Test 4: Use resource endpoint
    console.log('6. Testing resource endpoint...');
    const resourceResponse = await client.request(
      {
        method: 'resources/read',
        params: {
          uri: 'nodes://source/@n8n/n8n-nodes-langchain.Agent',
        },
      },
      {}
    );
    console.log('✓ Successfully read node source via resource endpoint\n');

    console.log('=== Test Completed Successfully ===');
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    await client.close();
    process.exit(1);
  }
}

// Run the test
testAIAgentExtraction().catch(console.error);