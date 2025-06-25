/**
 * Test script for comprehensive node parameter validation
 */

import { ValidateNodeHandler } from './build/tools/discovery/node-discovery.js';

async function testValidation() {
  console.log('🧪 Testing Comprehensive Node Parameter Validation System\n');

  const handler = new ValidateNodeHandler();

  // Test cases with different node types and parameters
  const testCases = [
    {
      name: 'Valid HTTP Request Node',
      nodeType: 'n8n-nodes-base.httpRequest',
      parameters: {
        url: 'https://api.example.com/data',
        method: 'GET'
      }
    },
    {
      name: 'Invalid HTTP Request Node (bad URL)',
      nodeType: 'n8n-nodes-base.httpRequest',
      parameters: {
        url: 'not-a-valid-url',
        method: 'GET'
      }
    },
    {
      name: 'Valid Webhook Node',
      nodeType: 'n8n-nodes-base.webhook',
      parameters: {
        path: 'webhook-endpoint',
        httpMethod: 'POST'
      }
    },
    {
      name: 'Invalid Webhook Node (bad method)',
      nodeType: 'n8n-nodes-base.webhook',
      parameters: {
        path: 'webhook endpoint with spaces',
        httpMethod: 'INVALID_METHOD'
      }
    },
    {
      name: 'Valid Function Node',
      nodeType: 'n8n-nodes-base.function',
      parameters: {
        functionCode: 'return [{ processed: true, timestamp: new Date().toISOString() }];'
      }
    },
    {
      name: 'Invalid Function Node (syntax error)',
      nodeType: 'n8n-nodes-base.function',
      parameters: {
        functionCode: 'return [{ invalid syntax here'
      }
    },
    {
      name: 'Unknown Node Type',
      nodeType: 'n8n-nodes-base.unknownNode',
      parameters: {
        someParam: 'value'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Node Type: ${testCase.nodeType}`);
    console.log(`   Parameters:`, JSON.stringify(testCase.parameters, null, 2));

    try {
      const result = await handler.execute({
        nodeType: testCase.nodeType,
        parameters: testCase.parameters,
        includeOptimizationAnalysis: true
      });

      if (result.isError) {
        console.log(`   ❌ Error: ${JSON.stringify(result.content, null, 2)}`);
      } else {
        const data = result.content[0]?.text ? JSON.parse(result.content[0].text) : result.content;
        
        // Extract comprehensive validation results
        const comprehensive = data.comprehensive || {};
        const basic = data.basic || {};
        const enhanced = data.enhanced || {};
        
        console.log(`   ✅ Validation Results:`);
        console.log(`      Comprehensive: ${comprehensive.valid ? '✅ Valid' : '❌ Invalid'} (Score: ${comprehensive.score}/100)`);
        console.log(`      Basic: ${basic.valid ? '✅ Valid' : '❌ Invalid'}`);
        console.log(`      Enhanced: ${enhanced ? (enhanced.valid ? '✅ Valid' : '❌ Invalid') + ` (Score: ${enhanced.score}/100)` : '⚪ N/A'}`);
        
        if (comprehensive.errors && comprehensive.errors.length > 0) {
          console.log(`      🚨 Errors (${comprehensive.errors.length}):`);
          comprehensive.errors.forEach(error => {
            console.log(`         • ${error.parameter}: ${error.message}`);
            if (error.suggestion) {
              console.log(`           💡 ${error.suggestion}`);
            }
          });
        }
        
        if (comprehensive.warnings && comprehensive.warnings.length > 0) {
          console.log(`      ⚠️  Warnings (${comprehensive.warnings.length}):`);
          comprehensive.warnings.forEach(warning => {
            console.log(`         • ${warning.parameter}: ${warning.message}`);
            if (warning.recommendation) {
              console.log(`           💡 ${warning.recommendation}`);
            }
          });
        }
        
        if (comprehensive.suggestions && comprehensive.suggestions.length > 0) {
          console.log(`      💡 Suggestions (${comprehensive.suggestions.length}):`);
          comprehensive.suggestions.slice(0, 3).forEach(suggestion => {
            console.log(`         • ${suggestion}`);
          });
        }
      }
    } catch (error) {
      console.log(`   ❌ Test Error: ${error.message}`);
    }
  }

  console.log(`\n🎉 Comprehensive Node Parameter Validation testing completed!`);
}

// Run the test
testValidation().catch(console.error);