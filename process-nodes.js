/**
 * Node Processing Script - Systematic Implementation of All 496 n8n Nodes
 * 
 * This script processes the comprehensive ChatGPT-generated node list and creates
 * properly formatted TypeScript node definitions for the MCP server.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the comprehensive node list
const nodeListPath = '/mnt/f/n8n-mcp-setup/full-list-nodes-and-integrations-with-descriptions.json';
const nodesList = JSON.parse(fs.readFileSync(nodeListPath, 'utf8'));

// Output directory for nodes
const nodesDir = './src/data/nodes/';

// Category mapping for better organization
const categoryMapping = {
  // Core nodes
  'Trigger': 'Core',
  'Action': 'Core',
  'Function': 'Core',
  
  // Service-specific mappings
  'Google': 'Productivity',
  'Microsoft': 'Productivity', 
  'AWS': 'Cloud',
  'Salesforce': 'CRM',
  'HubSpot': 'CRM',
  'Mailchimp': 'Marketing',
  'Stripe': 'Finance',
  'PayPal': 'Finance',
  'Shopify': 'E-commerce',
  'Slack': 'Communication',
  'Discord': 'Communication',
  'Trello': 'Project Management',
  'Asana': 'Project Management',
  'Notion': 'Productivity',
  'Airtable': 'Database'
};

// Helper function to determine category
function getCategory(nodeName, nodeType) {
  for (const [key, category] of Object.entries(categoryMapping)) {
    if (nodeName.includes(key)) {
      return category;
    }
  }
  return nodeType === 'Trigger' ? 'Core' : 'Utility';
}

// Helper function to generate node name
function generateNodeName(displayName) {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to generate file name
function generateFileName(displayName) {
  return generateNodeName(displayName) + '-node.ts';
}

// Helper function to extract operations
function extractOperations(operations, description) {
  if (operations && operations.length > 0) {
    return operations;
  }
  
  // Try to extract operations from description
  const operationPatterns = [
    /supports? (\w+(?:, \w+)*)/i,
    /can (\w+(?:, \w+)*)/i,
    /allows? (\w+(?:, \w+)*)/i
  ];
  
  for (const pattern of operationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1].split(',').map(op => op.trim());
    }
  }
  
  // Default operations based on type
  return ['get', 'create', 'update', 'delete'];
}

// Template for generating node TypeScript files
function generateNodeTemplate(node) {
  const nodeName = generateNodeName(node.Name);
  const category = getCategory(node.Name, node.Type);
  const operations = extractOperations(node.Operations, node.Description);
  const isTrigger = node.Type === 'Trigger';
  
  return `/**
 * ${node.Name} Node${isTrigger ? ' - Trigger' : ''}
 * 
 * ${node.Description}
 */

import { NodeTypeInfo } from '../node-types.js';

export const ${nodeName.replace(/-/g, '')}Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.${nodeName}',
  displayName: '${node.Name}',
  description: '${node.Description.replace(/'/g, "\\'")}',
  category: '${category}',
  subcategory: '${node.Type}',
  
  properties: [
    ${generateProperties(node, operations, isTrigger)}
  ],

  inputs: [${isTrigger ? '' : `
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }`}
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: '${isTrigger ? 'Triggers when events occur' : 'Processed data from ' + node.Name}'
    }
  ],

  credentials: [
    {
      name: '${nodeName}Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  ${isTrigger ? 'triggerNode: true,' : 'regularNode: true,'}
  ${isTrigger ? 'polling: true,' : ''}
  ${isTrigger ? 'webhookSupport: true,' : ''}
  
  version: [1],
  defaults: {
    name: '${node.Name}'
  },

  aliases: [${generateAliases(node.Name)}],
  
  examples: [
    ${generateExamples(node, operations)}
  ]
};

export default ${nodeName.replace(/-/g, '')}Node;`;
}

// Generate properties based on operations
function generateProperties(node, operations, isTrigger) {
  const properties = [];
  
  if (!isTrigger && operations.length > 1) {
    properties.push(`    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: '${operations[0]}',
      description: 'The operation to perform',
      options: [
        ${operations.map(op => `{ name: '${op.charAt(0).toUpperCase() + op.slice(1)}', value: '${op}' }`).join(',\n        ')}
      ]
    }`);
  }
  
  // Add resource ID for most operations
  if (!isTrigger) {
    properties.push(`    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }`);
  }
  
  // Add event type for triggers
  if (isTrigger) {
    properties.push(`    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }`);
  }
  
  return properties.join(',\n\n');
}

// Generate aliases for the node
function generateAliases(nodeName) {
  const aliases = [];
  const words = nodeName.toLowerCase().split(/[\s\-_()]/);
  
  for (const word of words) {
    if (word && word.length > 2) {
      aliases.push(`'${word}'`);
    }
  }
  
  return aliases.join(', ');
}

// Generate example workflows
function generateExamples(node, operations) {
  const examples = [];
  const nodeName = generateNodeName(node.Name);
  
  if (node.Type === 'Trigger') {
    examples.push(`    {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in ${node.Name}',
      workflow: {
        nodes: [
          {
            name: '${node.Name} Trigger',
            type: 'n8n-nodes-base.${nodeName}',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }`);
  } else {
    // Add example for first operation
    const firstOp = operations[0] || 'get';
    examples.push(`    {
      name: '${firstOp.charAt(0).toUpperCase() + firstOp.slice(1)} Item',
      description: '${firstOp.charAt(0).toUpperCase() + firstOp.slice(1)} an item from ${node.Name}',
      workflow: {
        nodes: [
          {
            name: '${node.Name}',
            type: 'n8n-nodes-base.${nodeName}',
            parameters: {
              operation: '${firstOp}'${firstOp !== 'create' && firstOp !== 'getAll' ? ',\n              resourceId: \'123456\'' : ''}
            }
          }
        ]
      }
    }`);
  }
  
  return examples.join(',\n');
}

// Check if node file already exists
function nodeExists(fileName) {
  return fs.existsSync(path.join(nodesDir, fileName));
}

// Main processing function
function processNodes() {
  console.log(`Processing ${nodesList.length} nodes...`);
  
  let created = 0;
  let skipped = 0;
  
  for (const node of nodesList) {
    const fileName = generateFileName(node.Name);
    
    if (nodeExists(fileName)) {
      console.log(`⏭️  Skipping ${node.Name} (already exists)`);
      skipped++;
      continue;
    }
    
    try {
      const nodeContent = generateNodeTemplate(node);
      fs.writeFileSync(path.join(nodesDir, fileName), nodeContent);
      console.log(`✅ Created ${fileName}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating ${fileName}:`, error.message);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${nodesList.length}`);
}

// Always run the processing
console.log('Starting node processing...');
processNodes();

export { processNodes, generateNodeTemplate };