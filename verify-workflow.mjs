#!/usr/bin/env node

import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyWorkflow() {
  try {
    // Get the workflow we just created
    const response = await axios.get(process.env.N8N_API_URL + '/workflows', {
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY
      }
    });
    
    const workflows = response.data.data;
    const aiWorkflow = workflows.find(w => w.name === 'AI Outlook Email Assistant - Advanced');
    
    if (aiWorkflow) {
      console.log('✅ AI Outlook Email Assistant workflow found!');
      console.log('Workflow ID:', aiWorkflow.id);
      console.log('Name:', aiWorkflow.name);
      console.log('Active:', aiWorkflow.active);
      console.log('Created:', aiWorkflow.createdAt);
      console.log('Updated:', aiWorkflow.updatedAt);
      
      // Get detailed workflow information
      const detailResponse = await axios.get(process.env.N8N_API_URL + '/workflows/' + aiWorkflow.id, {
        headers: {
          'X-N8N-API-KEY': process.env.N8N_API_KEY
        }
      });
      
      const workflowDetails = detailResponse.data;
      console.log('\n📊 Workflow Structure:');
      console.log('- Nodes:', workflowDetails.nodes.length);
      console.log('- Connections:', Object.keys(workflowDetails.connections).length);
      
      console.log('\n🔧 Node Types:');
      const nodeTypes = workflowDetails.nodes.reduce((acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(nodeTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
      
      console.log('\n🏷️ Node Names:');
      workflowDetails.nodes.forEach(node => {
        console.log(`  - ${node.name} (${node.type})`);
      });
      
      console.log('\n⚙️ Settings:');
      console.log(`  - Execution Timeout: ${workflowDetails.settings.executionTimeout}s`);
      console.log(`  - Timezone: ${workflowDetails.settings.timezone}`);
      console.log(`  - Save Execution Progress: ${workflowDetails.settings.saveExecutionProgress}`);
      
      return aiWorkflow;
    } else {
      console.log('❌ AI Outlook Email Assistant workflow not found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Failed to verify workflow:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the verification
verifyWorkflow()
  .then((workflow) => {
    if (workflow) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Open n8n at http://localhost:5678');
      console.log('2. Navigate to the "AI Outlook Email Assistant - Advanced" workflow');
      console.log('3. Configure the required credentials:');
      console.log('   - Outlook IMAP (outlook_imap_credentials)');
      console.log('   - OpenAI API (openai_credentials)');
      console.log('   - PostgreSQL (postgres_credentials)');
      console.log('   - Microsoft Teams (teams_credentials)');
      console.log('4. Create the required PostgreSQL tables');
      console.log('5. Test the workflow with a manual execution');
      console.log('6. Activate the workflow to start processing emails');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Workflow verification failed');
    process.exit(1);
  });