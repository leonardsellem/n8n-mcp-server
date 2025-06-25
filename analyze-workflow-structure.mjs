#!/usr/bin/env node

import fs from 'fs';

// Read the workflow details
const workflowData = JSON.parse(fs.readFileSync('workflow_details.json', 'utf8'));

console.log('🔍 AI Outlook Email Assistant - Workflow Structure Analysis');
console.log('=' .repeat(70));

console.log('\n📊 Basic Statistics:');
console.log(`• Workflow ID: ${workflowData.id}`);
console.log(`• Name: ${workflowData.name}`);
console.log(`• Total Nodes: ${workflowData.nodes.length}`);
console.log(`• Active: ${workflowData.active ? 'Yes' : 'No'}`);
console.log(`• Created: ${workflowData.createdAt}`);
console.log(`• Updated: ${workflowData.updatedAt}`);

console.log('\n🔗 Connection Analysis:');
const connections = workflowData.connections;
const totalConnections = Object.keys(connections).length;
console.log(`• Total Source Nodes with Connections: ${totalConnections}`);

// Analyze connections
let connectionCount = 0;
const nodeConnections = {};

for (const [sourceNode, outputs] of Object.entries(connections)) {
  nodeConnections[sourceNode] = {
    outputs: [],
    totalOutputs: 0
  };
  
  if (outputs.main && outputs.main[0]) {
    outputs.main[0].forEach(connection => {
      connectionCount++;
      nodeConnections[sourceNode].outputs.push(connection.node);
      nodeConnections[sourceNode].totalOutputs++;
    });
  }
}

console.log(`• Total Individual Connections: ${connectionCount}`);

console.log('\n🌊 Workflow Flow Analysis:');
console.log('Source Node → Target Nodes');
console.log('-'.repeat(50));

for (const [sourceNode, connectionData] of Object.entries(nodeConnections)) {
  if (connectionData.outputs.length > 0) {
    console.log(`${sourceNode}:`);
    connectionData.outputs.forEach(targetNode => {
      console.log(`  → ${targetNode}`);
    });
  }
}

// Identify entry points (nodes with no incoming connections)
const allTargetNodes = new Set();
Object.values(nodeConnections).forEach(conn => {
  conn.outputs.forEach(target => allTargetNodes.add(target));
});

const allSourceNodes = new Set(Object.keys(nodeConnections));
const entryPoints = workflowData.nodes
  .map(node => node.name)
  .filter(nodeName => !allTargetNodes.has(nodeName));

console.log('\n🚀 Entry Points (Trigger Nodes):');
entryPoints.forEach(node => {
  console.log(`• ${node}`);
});

// Identify end points (nodes with no outgoing connections)
const endPoints = workflowData.nodes
  .map(node => node.name)
  .filter(nodeName => !allSourceNodes.has(nodeName));

console.log('\n🏁 End Points (Terminal Nodes):');
endPoints.forEach(node => {
  console.log(`• ${node}`);
});

// Analyze node types and their distribution
console.log('\n🏷️ Node Type Distribution:');
const nodeTypeCount = {};
workflowData.nodes.forEach(node => {
  nodeTypeCount[node.type] = (nodeTypeCount[node.type] || 0) + 1;
});

Object.entries(nodeTypeCount)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, count]) => {
    const percentage = ((count / workflowData.nodes.length) * 100).toFixed(1);
    console.log(`• ${type}: ${count} nodes (${percentage}%)`);
  });

// Check for required credentials
console.log('\n🔐 Credential Requirements:');
const requiredCredentials = new Set();

workflowData.nodes.forEach(node => {
  if (node.credentials) {
    Object.entries(node.credentials).forEach(([credType, credInfo]) => {
      requiredCredentials.add(`${credInfo.name} (${credType})`);
    });
  }
});

requiredCredentials.forEach(cred => {
  console.log(`• ${cred}`);
});

// Validate workflow structure
console.log('\n✅ Workflow Validation:');
const validations = [];

// Check if we have a trigger node
const hasTrigger = workflowData.nodes.some(node => 
  node.type.includes('trigger') || node.type.includes('emailReadImap')
);
validations.push({
  check: 'Has Trigger Node',
  status: hasTrigger,
  details: hasTrigger ? 'Email IMAP trigger configured' : 'No trigger node found'
});

// Check if we have processing nodes
const hasProcessing = workflowData.nodes.some(node => 
  node.type.includes('function') || node.type.includes('openAi')
);
validations.push({
  check: 'Has Processing Logic',
  status: hasProcessing,
  details: hasProcessing ? 'Function and AI nodes present' : 'No processing nodes found'
});

// Check if we have storage nodes
const hasStorage = workflowData.nodes.some(node => 
  node.type.includes('postgres')
);
validations.push({
  check: 'Has Data Storage',
  status: hasStorage,
  details: hasStorage ? 'PostgreSQL storage configured' : 'No storage nodes found'
});

// Check if we have notification nodes
const hasNotifications = workflowData.nodes.some(node => 
  node.type.includes('microsoftTeams')
);
validations.push({
  check: 'Has Notifications',
  status: hasNotifications,
  details: hasNotifications ? 'Microsoft Teams notifications configured' : 'No notification nodes found'
});

// Check if we have the expected 16 nodes
validations.push({
  check: 'Expected Node Count',
  status: workflowData.nodes.length === 16,
  details: `Found ${workflowData.nodes.length} nodes (expected 16)`
});

// Check if connections are properly formed
const hasProperConnections = connectionCount >= 13; // Should have at least 13 connections
validations.push({
  check: 'Adequate Connections',
  status: hasProperConnections,
  details: `Found ${connectionCount} connections (expected >= 13)`
});

validations.forEach(validation => {
  const status = validation.status ? '✅' : '❌';
  console.log(`${status} ${validation.check}: ${validation.details}`);
});

const allValid = validations.every(v => v.status);
console.log(`\n🎯 Overall Status: ${allValid ? '✅ VALID' : '❌ NEEDS ATTENTION'}`);

if (allValid) {
  console.log('\n✨ Workflow is properly structured and ready for credential configuration!');
} else {
  console.log('\n⚠️  Please review the failed validations above.');
}

console.log('\n📋 Next Steps:');
console.log('1. Configure the required credentials in n8n');
console.log('2. Set up the PostgreSQL database with required tables');
console.log('3. Test the workflow with sample data');
console.log('4. Activate the workflow for production use');