#!/usr/bin/env node

import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createWorkflow() {
  try {
    // Read the workflow JSON
    const workflowData = JSON.parse(fs.readFileSync('ai-outlook-workflow.json', 'utf8'));
    
    console.log('Creating AI Outlook Email Assistant workflow...');
    console.log('Workflow details:');
    console.log('- Name:', workflowData.name);
    console.log('- Nodes:', workflowData.nodes.length);
    console.log('- Connections:', Object.keys(workflowData.connections).length);
    
    // Prepare workflow data for n8n API
    const workflowSettings = {
      saveExecutionProgress: true,
      saveManualExecutions: true,
      saveDataErrorExecution: "all",
      saveDataSuccessExecution: "all",
      executionTimeout: 7200,
      timezone: "UTC"
    };
    
    // Remove problematic errorWorkflow setting if it exists
    if (workflowData.settings && workflowData.settings.errorWorkflow && typeof workflowData.settings.errorWorkflow === 'object') {
      delete workflowData.settings.errorWorkflow;
    }
    
    const n8nWorkflowData = {
      name: workflowData.name,
      nodes: workflowData.nodes,
      connections: workflowData.connections,
      settings: workflowData.settings ? { ...workflowSettings, ...workflowData.settings } : workflowSettings,
      staticData: workflowData.staticData || {}
    };
    
    // Create workflow via n8n API
    const response = await axios.post(process.env.N8N_API_URL + '/workflows', n8nWorkflowData, {
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': process.env.N8N_API_KEY
      }
    });
    
    console.log('✅ Workflow created successfully!');
    console.log('Workflow ID:', response.data.id);
    console.log('Workflow Name:', response.data.name);
    console.log('Active:', response.data.active);
    
    // If there are tags, try to add them
    if (workflowData.tags && workflowData.tags.length > 0) {
      console.log('Adding tags to workflow...');
      try {
        // Note: Tag creation might require additional API calls in n8n
        console.log('Tags to add:', workflowData.tags.map(tag => tag.name));
      } catch (tagError) {
        console.warn('Could not add tags:', tagError.message);
      }
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Failed to create workflow:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the workflow creation
createWorkflow()
  .then((workflow) => {
    console.log('\n🎉 AI Outlook Email Assistant workflow is ready!');
    console.log('You can now configure the credentials and activate the workflow.');
    console.log('\nRequired credentials to configure:');
    console.log('1. Outlook IMAP credentials');
    console.log('2. OpenAI API credentials');
    console.log('3. PostgreSQL database credentials');
    console.log('4. Microsoft Teams OAuth2 credentials');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Workflow creation failed');
    process.exit(1);
  });