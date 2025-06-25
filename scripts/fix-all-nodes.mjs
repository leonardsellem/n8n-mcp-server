#!/usr/bin/env node
/**
 * Comprehensive Node Auto-Fix Script
 * 
 * This script automatically fixes common issues across all 532+ nodes:
 * - Missing required properties in NodeProperty definitions
 * - TypeScript compilation errors
 * - Placeholder descriptions
 * - Invalid node name patterns
 * - Missing utility functions in Function nodes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const nodesDir = path.join(projectRoot, 'src', 'data', 'nodes');

// Fix statistics
const fixStats = {
  totalFiles: 0,
  filesProcessed: 0,
  filesFixed: 0,
  fixesApplied: 0,
  errors: []
};

// Common issues and their fixes
const commonFixes = {
  missingDescriptions: 0,
  missingRequired: 0,
  invalidNodeNames: 0,
  placeholderText: 0,
  utilityFunctions: 0,
  typeScriptErrors: 0
};

/**
 * Utility Functions Template for Function Nodes
 */
const utilityFunctionsTemplate = `
// Utility functions for n8n Function nodes
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return fallback;
  }
}

function formatDateSafe(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date === 'string') return new Date(date).toISOString();
    if (date instanceof Date) return date.toISOString();
    return new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

function extractEmailDomain(email) {
  if (!isValidEmail(email)) return '';
  return email.split('@')[1];
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"&]/g, (match) => {
    const escapes = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return escapes[match];
  });
}

function calculateProcessingTime(startTime, endTime) {
  try {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    return Math.max(0, end - start);
  } catch (error) {
    return 0;
  }
}
`;

/**
 * Fix missing required properties in node property definitions
 */
function fixMissingProperties(content) {
  let fixed = content;
  let fixesApplied = 0;
  
  // Fix properties without description
  const propertyRegex = /{\s*name:\s*['"`]([^'"`]+)['"`],\s*displayName:\s*['"`]([^'"`]+)['"`],\s*type:\s*['"`]([^'"`]+)['"`],\s*required:\s*(true|false),\s*default:\s*([^,}]+)(?:\s*,\s*description:\s*['"`]([^'"`]*)['"`])?\s*}/g;
  
  fixed = fixed.replace(propertyRegex, (match, name, displayName, type, required, defaultValue, description) => {
    if (!description || description.trim() === '') {
      // Generate a reasonable description based on the property name
      const generatedDescription = generatePropertyDescription(name, displayName, type);
      commonFixes.missingDescriptions++;
      fixesApplied++;
      return `{
      name: '${name}',
      displayName: '${displayName}',
      type: '${type}',
      required: ${required},
      default: ${defaultValue},
      description: '${generatedDescription}'
    }`;
    }
    return match;
  });
  
  // Fix options arrays without descriptions
  const optionRegex = /{\s*name:\s*['"`]([^'"`]+)['"`],\s*value:\s*['"`]([^'"`]+)['"`](?:\s*,\s*description:\s*['"`]([^'"`]*)['"`])?\s*}/g;
  
  fixed = fixed.replace(optionRegex, (match, name, value, description) => {
    if (!description || description.trim() === '') {
      const generatedDescription = generateOptionDescription(name, value);
      fixesApplied++;
      return `{ name: '${name}', value: '${value}', description: '${generatedDescription}' }`;
    }
    return match;
  });
  
  return { content: fixed, fixesApplied };
}

/**
 * Generate appropriate description for property
 */
function generatePropertyDescription(name, displayName, type) {
  const nameDescriptions = {
    'operation': 'The operation to perform',
    'resource': 'The resource to operate on',
    'url': 'The URL to connect to',
    'method': 'The HTTP method to use',
    'email': 'Email address',
    'password': 'Password for authentication',
    'token': 'Authentication token',
    'apiKey': 'API key for authentication',
    'limit': 'Maximum number of items to return',
    'query': 'Search query or filter',
    'message': 'Message content',
    'subject': 'Subject line',
    'body': 'Message body content',
    'name': 'Name or identifier',
    'id': 'Unique identifier',
    'data': 'Data to process',
    'options': 'Additional configuration options'
  };
  
  // Check for exact matches
  if (nameDescriptions[name]) {
    return nameDescriptions[name];
  }
  
  // Generate based on type
  switch (type) {
    case 'string':
      return `Enter the ${displayName.toLowerCase()}`;
    case 'number':
      return `Numeric value for ${displayName.toLowerCase()}`;
    case 'boolean':
      return `Enable or disable ${displayName.toLowerCase()}`;
    case 'options':
      return `Select an option for ${displayName.toLowerCase()}`;
    case 'collection':
      return `Configuration settings for ${displayName.toLowerCase()}`;
    default:
      return `Configure ${displayName.toLowerCase()} settings`;
  }
}

/**
 * Generate appropriate description for option
 */
function generateOptionDescription(name, value) {
  return `${name} operation`;
}

/**
 * Fix placeholder descriptions
 */
function fixPlaceholderDescriptions(content) {
  let fixed = content;
  let fixesApplied = 0;
  
  // Replace common placeholder patterns
  const placeholders = [
    { pattern: /description: ['"`]TODO[^'"`]*['"`]/g, replacement: (match, nodeName) => {
      commonFixes.placeholderText++;
      fixesApplied++;
      return `description: 'Integrate with ${nodeName} for workflow automation'`;
    }},
    { pattern: /description: ['"`]placeholder[^'"`]*['"`]/gi, replacement: () => {
      commonFixes.placeholderText++;
      fixesApplied++;
      return `description: 'Configure this integration for your workflow'`;
    }},
    { pattern: /description: ['"`]Description[^'"`]*['"`]/g, replacement: () => {
      commonFixes.placeholderText++;
      fixesApplied++;
      return `description: 'Configuration option for the integration'`;
    }}
  ];
  
  placeholders.forEach(({ pattern, replacement }) => {
    fixed = fixed.replace(pattern, replacement);
  });
  
  return { content: fixed, fixesApplied };
}

/**
 * Fix invalid node names
 */
function fixNodeNames(content, fileName) {
  let fixed = content;
  let fixesApplied = 0;
  
  // Extract expected node name from filename
  const expectedNodeName = fileName.replace('-node.ts', '').replace('-trigger-node.ts', '');
  const validNodeName = `n8n-nodes-base.${expectedNodeName.replace(/-/g, '')}`;
  
  // Fix incorrect node name patterns
  const namePattern = /name:\s*['"`]([^'"`]+)['"`]/;
  const match = content.match(namePattern);
  
  if (match) {
    const currentName = match[1];
    if (!currentName.startsWith('n8n-nodes-base.')) {
      fixed = fixed.replace(namePattern, `name: '${validNodeName}'`);
      commonFixes.invalidNodeNames++;
      fixesApplied++;
    }
  }
  
  return { content: fixed, fixesApplied };
}

/**
 * Add utility functions to Function node types
 */
function addUtilityFunctions(content, fileName) {
  let fixed = content;
  let fixesApplied = 0;
  
  // Check if this is a function node and if it has default code without utilities
  if (fileName.includes('function') || fileName.includes('code')) {
    if (content.includes('return $input.all()') && !content.includes('generateId')) {
      // Replace basic function code with enhanced version
      const enhancedCode = `'${utilityFunctionsTemplate.trim()}\\n\\n// Your function code here:\\nconst items = $input.all();\\nreturn items;'`;
      
      fixed = fixed.replace(
        /default:\s*['"`]return \$input\.all\(\);?['"`]/g,
        `default: ${enhancedCode}`
      );
      
      commonFixes.utilityFunctions++;
      fixesApplied++;
    }
  }
  
  return { content: fixed, fixesApplied };
}

/**
 * Fix common TypeScript issues
 */
function fixTypeScriptIssues(content) {
  let fixed = content;
  let fixesApplied = 0;
  
  // Fix missing required field
  const propertyWithoutRequired = /{\s*name:\s*['"`]([^'"`]+)['"`],\s*displayName:\s*['"`]([^'"`]+)['"`],\s*type:\s*['"`]([^'"`]+)['"`],\s*(?!required:)([^}]*)\s*}/g;
  
  fixed = fixed.replace(propertyWithoutRequired, (match, name, displayName, type, rest) => {
    if (!rest.includes('required:')) {
      commonFixes.missingRequired++;
      fixesApplied++;
      return `{
      name: '${name}',
      displayName: '${displayName}',
      type: '${type}',
      required: false,
      ${rest.trim()}
    }`;
    }
    return match;
  });
  
  // Fix invalid typeOptions
  fixed = fixed.replace(/typeOptions:\s*{\s*editor:\s*['"`][^'"`]*['"`]\s*,?\s*}/g, (match) => {
    commonFixes.typeScriptErrors++;
    fixesApplied++;
    return 'typeOptions: {}';
  });
  
  return { content: fixed, fixesApplied };
}

/**
 * Process a single node file
 */
async function processNodeFile(fileName) {
  const filePath = path.join(nodesDir, fileName);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let totalFixes = 0;
    let modified = false;
    
    // Apply all fixes
    const fixes = [
      fixMissingProperties,
      fixPlaceholderDescriptions,
      (content) => fixNodeNames(content, fileName),
      (content) => addUtilityFunctions(content, fileName),
      fixTypeScriptIssues
    ];
    
    for (const fixFunction of fixes) {
      const result = fixFunction(content);
      content = result.content;
      totalFixes += result.fixesApplied;
      if (result.fixesApplied > 0) {
        modified = true;
      }
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixStats.filesFixed++;
    }
    
    fixStats.fixesApplied += totalFixes;
    return { success: true, fixes: totalFixes };
    
  } catch (error) {
    fixStats.errors.push({
      file: fileName,
      error: error.message
    });
    return { success: false, error: error.message };
  }
}

/**
 * Main fix function
 */
async function fixAllNodes() {
  console.log('🔧 Starting comprehensive node auto-fix...\n');
  
  // Get all node files
  const nodeFiles = fs.readdirSync(nodesDir)
    .filter(file => file.endsWith('.ts'))
    .sort();
  
  fixStats.totalFiles = nodeFiles.length;
  console.log(`Found ${nodeFiles.length} node files to process\n`);
  
  // Process each file
  for (let i = 0; i < nodeFiles.length; i++) {
    const fileName = nodeFiles[i];
    const progress = `[${i + 1}/${nodeFiles.length}]`;
    
    process.stdout.write(`${progress} Processing ${fileName}... `);
    
    const result = await processNodeFile(fileName);
    fixStats.filesProcessed++;
    
    if (result.success) {
      if (result.fixes > 0) {
        console.log(`✅ Fixed ${result.fixes} issue(s)`);
      } else {
        console.log(`✅ No issues found`);
      }
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
  }
  
  // Generate summary report
  generateFixSummaryReport();
}

/**
 * Generate fix summary report
 */
function generateFixSummaryReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🔧 COMPREHENSIVE NODE AUTO-FIX REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n📊 PROCESSING SUMMARY:`);
  console.log(`  Total Files: ${fixStats.totalFiles}`);
  console.log(`  Files Processed: ${fixStats.filesProcessed}`);
  console.log(`  Files Fixed: ${fixStats.filesFixed} (${(fixStats.filesFixed/fixStats.totalFiles*100).toFixed(1)}%)`);
  console.log(`  Total Fixes Applied: ${fixStats.fixesApplied}`);
  console.log(`  Errors Encountered: ${fixStats.errors.length}`);
  
  console.log(`\n🔨 FIXES BY TYPE:`);
  console.log(`  Missing Descriptions: ${commonFixes.missingDescriptions}`);
  console.log(`  Missing Required Properties: ${commonFixes.missingRequired}`);
  console.log(`  Invalid Node Names: ${commonFixes.invalidNodeNames}`);
  console.log(`  Placeholder Text: ${commonFixes.placeholderText}`);
  console.log(`  Utility Functions Added: ${commonFixes.utilityFunctions}`);
  console.log(`  TypeScript Errors: ${commonFixes.typeScriptErrors}`);
  
  if (fixStats.errors.length > 0) {
    console.log(`\n❌ ERRORS ENCOUNTERED:`);
    fixStats.errors.slice(0, 10).forEach(error => {
      console.log(`  ${error.file}: ${error.error}`);
    });
    if (fixStats.errors.length > 10) {
      console.log(`  ... and ${fixStats.errors.length - 10} more`);
    }
  }
  
  console.log(`\n🎯 NEXT STEPS:`);
  console.log(`  1. Run 'npm run build' to verify TypeScript compilation`);
  console.log(`  2. Test node registry building with all fixed nodes`);
  console.log(`  3. Validate workflow generation with updated nodes`);
  console.log(`  4. Run comprehensive tests to ensure functionality`);
  
  // Save detailed report
  const reportPath = path.join(projectRoot, 'node-fix-report.json');
  const detailedReport = {
    summary: fixStats,
    fixesByType: commonFixes,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  console.log('\n' + '='.repeat(80));
}

// Run the auto-fix
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAllNodes().catch(console.error);
}