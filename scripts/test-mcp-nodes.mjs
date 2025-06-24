#!/usr/bin/env node

import { spawn } from 'child_process';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🧪 Starting comprehensive MCP node testing...\n');

// Get all node files
const nodeFiles = readdirSync('src/data/nodes')
  .filter(f => f.endsWith('.ts'))
  .sort();

console.log(`Found ${nodeFiles.length} nodes to test`);

let testResults = {
  passed: [],
  failed: [],
  warnings: [],
  total: nodeFiles.length,
  startTime: new Date().toISOString()
};

// Function to test a single node
async function testNode(nodeFile, index) {
  const nodeName = nodeFile.replace('.ts', '');
  console.log(`\n[${index + 1}/${nodeFiles.length}] Testing ${nodeName}...`);
  
  try {
    // Read node file
    const nodeContent = readFileSync(`src/data/nodes/${nodeFile}`, 'utf8');
    
    // Basic structure tests
    const tests = {
      hasExport: nodeContent.includes('export'),
      hasNodeTypeInfo: nodeContent.includes('NodeTypeInfo'),
      hasName: nodeContent.includes('name:'),
      hasDisplayName: nodeContent.includes('displayName:'),
      hasDescription: nodeContent.includes('description:'),
      hasCategory: nodeContent.includes('category:'),
      hasProperties: nodeContent.includes('properties:'),
      hasInputs: nodeContent.includes('inputs:'),
      hasOutputs: nodeContent.includes('outputs:'),
      hasVersion: nodeContent.includes('version:'),
      hasDefaults: nodeContent.includes('defaults:'),
      validJSON: true // We'll check this
    };
    
    // Check for common issues
    const issues = [];
    
    if (nodeContent.includes('undefined')) {
      issues.push('Contains undefined values');
    }
    
    if (nodeContent.includes('null,')) {
      issues.push('Contains null values in arrays');
    }
    
    if (nodeContent.match(/,\s*}/)) {
      issues.push('Has trailing commas before closing braces');
    }
    
    if (!nodeContent.includes('examples:')) {
      issues.push('Missing examples');
    }
    
    // Check TypeScript syntax
    const hasTypeErrors = nodeContent.includes('// @ts-ignore') || 
                         nodeContent.includes('any') ||
                         nodeContent.match(/:\s*any\s*[,;}]/);
    
    if (hasTypeErrors) {
      issues.push('Has TypeScript type issues');
    }
    
    // Test MCP compatibility
    const mcpCompatible = {
      hasToolDescription: nodeContent.includes('description:'),
      hasProperStructure: tests.hasName && tests.hasDisplayName && tests.hasProperties,
      hasExamples: nodeContent.includes('examples:'),
      isWellFormed: issues.length === 0
    };
    
    const allTestsPassed = Object.values(tests).every(Boolean) && 
                          Object.values(mcpCompatible).every(Boolean);
    
    if (allTestsPassed && issues.length === 0) {
      testResults.passed.push({
        name: nodeName,
        file: nodeFile,
        tests,
        mcpCompatible,
        issues: []
      });
      console.log(`  ✅ ${nodeName} - PASSED`);
    } else if (issues.length > 0 && issues.length <= 2) {
      testResults.warnings.push({
        name: nodeName,
        file: nodeFile,
        tests,
        mcpCompatible,
        issues
      });
      console.log(`  ⚠️  ${nodeName} - WARNING (${issues.length} issues)`);
      issues.forEach(issue => console.log(`    - ${issue}`));
    } else {
      testResults.failed.push({
        name: nodeName,
        file: nodeFile,
        tests,
        mcpCompatible,
        issues
      });
      console.log(`  ❌ ${nodeName} - FAILED (${issues.length} issues)`);
      issues.forEach(issue => console.log(`    - ${issue}`));
    }
    
  } catch (error) {
    testResults.failed.push({
      name: nodeName,
      file: nodeFile,
      error: error.message
    });
    console.log(`  ❌ ${nodeName} - ERROR: ${error.message}`);
  }
}

// Test nodes in batches for better performance
async function testNodesBatch(startIndex, batchSize = 50) {
  const batch = nodeFiles.slice(startIndex, startIndex + batchSize);
  const promises = batch.map((file, i) => testNode(file, startIndex + i));
  await Promise.all(promises);
}

// Run tests
async function runAllTests() {
  console.log('\n🚀 Starting batch testing...');
  
  for (let i = 0; i < nodeFiles.length; i += 50) {
    console.log(`\n📦 Processing batch ${Math.floor(i/50) + 1}/${Math.ceil(nodeFiles.length/50)}...`);
    await testNodesBatch(i, 50);
  }
  
  // Generate test report
  testResults.endTime = new Date().toISOString();
  testResults.duration = new Date(testResults.endTime) - new Date(testResults.startTime);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 MCP NODE TESTING RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Nodes:    ${testResults.total}`);
  console.log(`✅ Passed:      ${testResults.passed.length} (${(testResults.passed.length/testResults.total*100).toFixed(1)}%)`);
  console.log(`⚠️  Warnings:   ${testResults.warnings.length} (${(testResults.warnings.length/testResults.total*100).toFixed(1)}%)`);
  console.log(`❌ Failed:      ${testResults.failed.length} (${(testResults.failed.length/testResults.total*100).toFixed(1)}%)`);
  console.log(`⏱️  Duration:    ${Math.round(testResults.duration/1000)}s`);
  
  // Save detailed results
  writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n📄 Detailed results saved to test-results.json');
  
  // If there are failures or warnings, create fix recommendations
  if (testResults.failed.length > 0 || testResults.warnings.length > 0) {
    await generateFixRecommendations();
  }
  
  console.log('\n🎯 MCP testing completed!');
}

async function generateFixRecommendations() {
  const recommendations = {
    failed: testResults.failed.map(node => ({
      file: node.file,
      issues: node.issues || [node.error],
      fixes: generateFixesForNode(node)
    })),
    warnings: testResults.warnings.map(node => ({
      file: node.file,
      issues: node.issues,
      fixes: generateFixesForNode(node)
    }))
  };
  
  writeFileSync('fix-recommendations.json', JSON.stringify(recommendations, null, 2));
  console.log('🔧 Fix recommendations saved to fix-recommendations.json');
}

function generateFixesForNode(node) {
  const fixes = [];
  
  if (node.issues) {
    node.issues.forEach(issue => {
      switch (issue) {
        case 'Contains undefined values':
          fixes.push('Replace undefined with appropriate default values');
          break;
        case 'Contains null values in arrays':
          fixes.push('Remove null entries from arrays');
          break;
        case 'Has trailing commas before closing braces':
          fixes.push('Remove trailing commas');
          break;
        case 'Missing examples':
          fixes.push('Add practical usage examples');
          break;
        case 'Has TypeScript type issues':
          fixes.push('Fix type annotations and remove any types');
          break;
        default:
          fixes.push(`Address: ${issue}`);
      }
    });
  }
  
  return fixes;
}

// Start testing
runAllTests().catch(console.error);