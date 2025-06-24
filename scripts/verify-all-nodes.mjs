#!/usr/bin/env node
/**
 * Comprehensive Node Verification Script
 * 
 * This script systematically verifies all 532+ nodes for:
 * - TypeScript compliance
 * - Required property completeness
 * - n8n convention adherence
 * - Real-world usability
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const nodesDir = path.join(projectRoot, 'src', 'data', 'nodes');

// Validation results storage
const validationResults = {
  totalNodes: 0,
  validNodes: 0,
  invalidNodes: 0,
  errors: [],
  warnings: [],
  fixes: []
};

// Required properties for a valid node
const requiredNodeProperties = [
  'name',
  'displayName', 
  'description',
  'category',
  'properties',
  'inputs',
  'outputs',
  'version',
  'defaults'
];

// Valid n8n categories
const validCategories = [
  'Core', 'AI', 'Communication', 'Database', 'Cloud', 'Analytics',
  'E-commerce', 'Productivity', 'Development', 'Marketing', 'Finance',
  'Customer Support', 'Project Management', 'Social Media', 'Utility',
  'Security', 'Monitoring', 'Integration', 'File Management', 'Automation'
];

// Valid node name patterns
const validNodeNamePattern = /^n8n-nodes-base\.[a-zA-Z0-9-]+$/;

/**
 * Read and parse a node file
 */
async function readNodeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the export statement to get node definition
    const exportMatch = content.match(/export const \w+ = ({[\s\S]*?});/);
    if (!exportMatch) {
      return { error: 'No valid export found' };
    }
    
    // Basic syntax validation
    if (!content.includes('NodeTypeInfo')) {
      return { error: 'Missing NodeTypeInfo import' };
    }
    
    return { content, exportStatement: exportMatch[1] };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Validate node structure
 */
function validateNodeStructure(nodeContent, fileName) {
  const issues = [];
  const warnings = [];
  
  // Check required properties
  for (const prop of requiredNodeProperties) {
    if (!nodeContent.includes(`${prop}:`)) {
      issues.push(`Missing required property: ${prop}`);
    }
  }
  
  // Validate name pattern
  const nameMatch = nodeContent.match(/name:\s*['"`]([^'"`]+)['"`]/);
  if (nameMatch) {
    const nodeName = nameMatch[1];
    if (!validNodeNamePattern.test(nodeName)) {
      issues.push(`Invalid node name pattern: ${nodeName}`);
    }
  } else {
    issues.push('No node name found');
  }
  
  // Check for description
  const descMatch = nodeContent.match(/description:\s*['"`]([^'"`]+)['"`]/);
  if (descMatch) {
    const description = descMatch[1];
    if (description.length < 10) {
      warnings.push('Description too short (should be more descriptive)');
    }
    if (description.includes('TODO') || description.includes('placeholder')) {
      issues.push('Description contains placeholder text');
    }
  }
  
  // Check for category
  const categoryMatch = nodeContent.match(/category:\s*['"`]([^'"`]+)['"`]/);
  if (categoryMatch) {
    const category = categoryMatch[1];
    if (!validCategories.includes(category)) {
      warnings.push(`Unusual category: ${category} (should be one of: ${validCategories.join(', ')})`);
    }
  }
  
  // Check for properties array
  if (!nodeContent.includes('properties: [')) {
    issues.push('Missing properties array');
  }
  
  // Check for inputs/outputs
  if (!nodeContent.includes('inputs: [')) {
    issues.push('Missing inputs definition');
  }
  if (!nodeContent.includes('outputs: [')) {
    issues.push('Missing outputs definition');
  }
  
  // Check for examples
  if (!nodeContent.includes('examples: [')) {
    warnings.push('No examples provided (recommended for better usability)');
  }
  
  // Check for TypeScript issues
  if (nodeContent.includes('required: true') && nodeContent.includes('required: false')) {
    // Good - has both required and optional properties
  } else if (!nodeContent.includes('required:')) {
    warnings.push('No required property indicators found');
  }
  
  return { issues, warnings };
}

/**
 * Validate TypeScript compilation for a single node
 */
function validateTypeScriptCompilation(filePath) {
  try {
    // Try to compile the individual file
    const relativePath = path.relative(projectRoot, filePath);
    execSync(`npx tsc --noEmit ${relativePath}`, { 
      cwd: projectRoot, 
      stdio: 'pipe' 
    });
    return { compiles: true };
  } catch (error) {
    return { 
      compiles: false, 
      error: error.stderr ? error.stderr.toString() : error.message 
    };
  }
}

/**
 * Generate a fix suggestion for common issues
 */
function generateFixSuggestion(issues, fileName) {
  const fixes = [];
  
  for (const issue of issues) {
    if (issue.includes('Missing required property: description')) {
      fixes.push('Add description property with comprehensive node description');
    }
    if (issue.includes('Missing required property: required')) {
      fixes.push('Add required: true/false to all properties');
    }
    if (issue.includes('Description contains placeholder')) {
      fixes.push('Replace placeholder description with real functionality description');
    }
    if (issue.includes('Missing properties array')) {
      fixes.push('Add properties array with node configuration options');
    }
    if (issue.includes('Invalid node name pattern')) {
      fixes.push('Fix node name to follow n8n-nodes-base.{name} pattern');
    }
  }
  
  return fixes;
}

/**
 * Main verification function
 */
async function verifyAllNodes() {
  console.log('🔍 Starting comprehensive node verification...\n');
  console.log(`📁 Scanning directory: ${nodesDir}\n`);
  
  // Check if nodes directory exists
  if (!fs.existsSync(nodesDir)) {
    console.error(`❌ Nodes directory not found: ${nodesDir}`);
    return;
  }
  
  // Get all node files
  const nodeFiles = fs.readdirSync(nodesDir)
    .filter(file => file.endsWith('.ts'))
    .sort();
  
  validationResults.totalNodes = nodeFiles.length;
  console.log(`Found ${nodeFiles.length} node files to verify\n`);
  
  // Process each node file
  for (let i = 0; i < nodeFiles.length; i++) {
    const fileName = nodeFiles[i];
    const filePath = path.join(nodesDir, fileName);
    const progress = `[${i + 1}/${nodeFiles.length}]`;
    
    console.log(`${progress} Verifying ${fileName}...`);
    
    // Read node file
    const fileResult = await readNodeFile(filePath);
    if (fileResult.error) {
      validationResults.invalidNodes++;
      validationResults.errors.push({
        file: fileName,
        type: 'File Read Error',
        message: fileResult.error
      });
      console.log(`  ❌ File read error: ${fileResult.error}`);
      continue;
    }
    
    // Validate structure
    const structureResult = validateNodeStructure(fileResult.content, fileName);
    
    // Validate TypeScript compilation
    const tsResult = validateTypeScriptCompilation(filePath);
    
    // Collect results
    const allIssues = [...structureResult.issues];
    const allWarnings = [...structureResult.warnings];
    
    if (!tsResult.compiles) {
      allIssues.push(`TypeScript compilation error: ${tsResult.error}`);
    }
    
    if (allIssues.length === 0) {
      validationResults.validNodes++;
      console.log(`  ✅ Valid`);
      if (allWarnings.length > 0) {
        console.log(`  ⚠️  ${allWarnings.length} warning(s)`);
        validationResults.warnings.push({
          file: fileName,
          warnings: allWarnings
        });
      }
    } else {
      validationResults.invalidNodes++;
      console.log(`  ❌ ${allIssues.length} issue(s) found`);
      
      validationResults.errors.push({
        file: fileName,
        issues: allIssues,
        warnings: allWarnings
      });
      
      // Generate fix suggestions
      const fixes = generateFixSuggestion(allIssues, fileName);
      if (fixes.length > 0) {
        validationResults.fixes.push({
          file: fileName,
          fixes: fixes
        });
      }
    }
  }
  
  // Generate summary report
  generateSummaryReport();
}

/**
 * Generate comprehensive summary report
 */
function generateSummaryReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE NODE VERIFICATION REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n📈 SUMMARY STATISTICS:`);
  console.log(`  Total Nodes Scanned: ${validationResults.totalNodes}`);
  console.log(`  ✅ Valid Nodes: ${validationResults.validNodes} (${(validationResults.validNodes/validationResults.totalNodes*100).toFixed(1)}%)`);
  console.log(`  ❌ Invalid Nodes: ${validationResults.invalidNodes} (${(validationResults.invalidNodes/validationResults.totalNodes*100).toFixed(1)}%)`);
  console.log(`  ⚠️  Nodes with Warnings: ${validationResults.warnings.length}`);
  
  // Most common issues
  const issueTypes = {};
  validationResults.errors.forEach(error => {
    error.issues?.forEach(issue => {
      const type = issue.split(':')[0];
      issueTypes[type] = (issueTypes[type] || 0) + 1;
    });
  });
  
  console.log(`\n🔍 MOST COMMON ISSUES:`);
  Object.entries(issueTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count} nodes`);
    });
  
  // Critical issues requiring immediate attention
  const criticalIssues = validationResults.errors.filter(error => 
    error.issues?.some(issue => 
      issue.includes('TypeScript compilation error') ||
      issue.includes('Missing required property') ||
      issue.includes('No valid export found')
    )
  );
  
  console.log(`\n🚨 CRITICAL ISSUES (${criticalIssues.length} nodes):`);
  criticalIssues.slice(0, 10).forEach(error => {
    console.log(`  ${error.file}: ${error.issues?.[0] || 'Unknown error'}`);
  });
  
  if (criticalIssues.length > 10) {
    console.log(`  ... and ${criticalIssues.length - 10} more`);
  }
  
  // Save detailed report to file
  const reportPath = path.join(projectRoot, 'node-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(validationResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Next steps recommendation
  console.log(`\n🎯 RECOMMENDED NEXT STEPS:`);
  if (validationResults.invalidNodes > 0) {
    console.log(`  1. Run the auto-fix script to resolve common issues`);
    console.log(`  2. Manually review nodes with TypeScript compilation errors`);
    console.log(`  3. Update placeholder descriptions with real functionality`);
    console.log(`  4. Add missing required properties to invalid nodes`);
    console.log(`  5. Re-run verification after fixes`);
  } else {
    console.log(`  🎉 All nodes are valid! Ready for production registry build.`);
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run the verification
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAllNodes().catch(console.error);
}