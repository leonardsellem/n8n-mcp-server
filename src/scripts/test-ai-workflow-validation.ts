#!/usr/bin/env node
/**
 * Test AI workflow validation enhancements
 */
import { createDatabaseAdapter } from '../database/database-adapter';
import { NodeRepository } from '../database/node-repository';
import { WorkflowValidator } from '../services/workflow-validator';
import { Logger } from '../utils/logger';
import { EnhancedConfigValidator } from '../services/enhanced-config-validator';

const logger = new Logger({ prefix: '[TestAIWorkflow]' });

// Test workflow with AI Agent and tools
const aiWorkflow = {
  name: 'AI Agent with Tools',
  nodes: [
    {
      id: '1',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      position: [100, 100],
      parameters: {
        path: 'ai-webhook',
        httpMethod: 'POST'
      }
    },
    {
      id: '2',
      name: 'AI Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      position: [300, 100],
      parameters: {
        text: '={{ $json.query }}',
        systemMessage: 'You are a helpful assistant with access to tools'
      }
    },
    {
      id: '3',
      name: 'Google Sheets Tool',
      type: 'n8n-nodes-base.googleSheets',
      position: [300, 250],
      parameters: {
        operation: 'append',
        sheetId: '={{ $fromAI("sheetId", "Sheet ID") }}',
        range: 'A:Z'
      }
    },
    {
      id: '4',
      name: 'Slack Tool',
      type: 'n8n-nodes-base.slack',
      position: [300, 350],
      parameters: {
        resource: 'message',
        operation: 'post',
        channel: '={{ $fromAI("channel", "Channel name") }}',
        text: '={{ $fromAI("message", "Message text") }}'
      }
    },
    {
      id: '5',
      name: 'Response',
      type: 'n8n-nodes-base.respondToWebhook',
      position: [500, 100],
      parameters: {
        responseCode: 200
      }
    }
  ],
  connections: {
    'Webhook': {
      main: [[{ node: 'AI Agent', type: 'main', index: 0 }]]
    },
    'AI Agent': {
      main: [[{ node: 'Response', type: 'main', index: 0 }]],
      ai_tool: [
        [
          { node: 'Google Sheets Tool', type: 'ai_tool', index: 0 },
          { node: 'Slack Tool', type: 'ai_tool', index: 0 }
        ]
      ]
    }
  }
};

// Test workflow without tools (should trigger warning)
const aiWorkflowNoTools = {
  name: 'AI Agent without Tools',
  nodes: [
    {
      id: '1',
      name: 'Manual',
      type: 'n8n-nodes-base.manualTrigger',
      position: [100, 100],
      parameters: {}
    },
    {
      id: '2',
      name: 'AI Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      position: [300, 100],
      parameters: {
        text: 'Hello AI'
      }
    }
  ],
  connections: {
    'Manual': {
      main: [[{ node: 'AI Agent', type: 'main', index: 0 }]]
    }
  }
};

// Test workflow with googleSheetsTool (unknown node type)
const unknownToolWorkflow = {
  name: 'Unknown Tool Test',
  nodes: [
    {
      id: '1',
      name: 'Agent',
      type: 'nodes-langchain.agent',
      position: [100, 100],
      parameters: {}
    },
    {
      id: '2',
      name: 'Sheets Tool',
      type: 'googleSheetsTool',
      position: [300, 100],
      parameters: {}
    }
  ],
  connections: {
    'Agent': {
      ai_tool: [[{ node: 'Sheets Tool', type: 'ai_tool', index: 0 }]]
    }
  }
};

async function testWorkflow(name: string, workflow: any) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log('='.repeat(50));
  
  const db = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(db);
  const validator = new WorkflowValidator(repository, EnhancedConfigValidator);
  
  try {
    const result = await validator.validateWorkflow(workflow);
    
    console.log(`\n📊 Validation Results:`);
    console.log(`Valid: ${result.valid ? '✅' : '❌'}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((err: any) => {
        if (typeof err === 'string') {
          console.log(`  - ${err}`);
        } else if (err.message) {
          const nodeInfo = err.nodeName ? ` [${err.nodeName}]` : '';
          console.log(`  - ${err.message}${nodeInfo}`);
        } else {
          console.log(`  - ${JSON.stringify(err, null, 2)}`);
        }
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach((warn: any) => {
        const msg = warn.message || warn;
        const nodeInfo = warn.nodeName ? ` [${warn.nodeName}]` : '';
        console.log(`  - ${msg}${nodeInfo}`);
      });
    }
    
    if (result.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      result.suggestions.forEach((sug: any) => console.log(`  - ${sug}`));
    }
    
    console.log('\n📈 Statistics:');
    console.log(`  - Total nodes: ${result.statistics.totalNodes}`);
    console.log(`  - Valid connections: ${result.statistics.validConnections}`);
    console.log(`  - Invalid connections: ${result.statistics.invalidConnections}`);
    console.log(`  - Expressions validated: ${result.statistics.expressionsValidated}`);
    
  } catch (error) {
    console.error('Validation error:', error);
  } finally {
    db.close();
  }
}

async function main() {
  console.log('🤖 Testing AI Workflow Validation Enhancements');
  
  // Test 1: Complete AI workflow with tools
  await testWorkflow('AI Agent with Multiple Tools', aiWorkflow);
  
  // Test 2: AI Agent without tools (should warn)
  await testWorkflow('AI Agent without Tools', aiWorkflowNoTools);
  
  // Test 3: Unknown tool type (like googleSheetsTool)
  await testWorkflow('Unknown Tool Type', unknownToolWorkflow);
  
  console.log('\n✅ All tests completed!');
}

if (require.main === module) {
  main().catch(console.error);
}