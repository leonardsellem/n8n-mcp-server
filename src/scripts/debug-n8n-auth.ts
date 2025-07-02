#!/usr/bin/env node

import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

async function debugN8nAuth() {
  const apiUrl = process.env.N8N_API_URL || 'https://n8n.energyhouse.com.pl';
  const apiKey = process.env.N8N_API_KEY || 'n8n_api_f94c0b3fb3bf1a3a690f37bb0c5c0de43c7b690c0a33c88b6baaa37ae896dc96';
  
  console.log('Testing n8n API Authentication...');
  console.log('API URL:', apiUrl);
  console.log('API Key:', apiKey.substring(0, 20) + '...');
  
  // Test 1: Direct health check
  console.log('\n=== Test 1: Direct Health Check (no auth) ===');
  try {
    const healthResponse = await axios.get(`${apiUrl}/api/v1/health`);
    console.log('Health Response:', healthResponse.data);
  } catch (error: any) {
    console.log('Health Check Error:', error.response?.status, error.response?.data || error.message);
  }
  
  // Test 2: Workflows with API key
  console.log('\n=== Test 2: List Workflows (with auth) ===');
  try {
    const workflowsResponse = await axios.get(`${apiUrl}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      params: { limit: 1 }
    });
    console.log('Workflows Response:', workflowsResponse.data);
  } catch (error: any) {
    console.log('Workflows Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.headers) {
      console.log('Response Headers:', error.response.headers);
    }
  }
  
  // Test 3: Try different auth header formats
  console.log('\n=== Test 3: Alternative Auth Headers ===');
  
  // Try Bearer token
  try {
    const bearerResponse = await axios.get(`${apiUrl}/api/v1/workflows`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: { limit: 1 }
    });
    console.log('Bearer Auth Success:', bearerResponse.data);
  } catch (error: any) {
    console.log('Bearer Auth Error:', error.response?.status);
  }
  
  // Try lowercase header
  try {
    const lowercaseResponse = await axios.get(`${apiUrl}/api/v1/workflows`, {
      headers: {
        'x-n8n-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      params: { limit: 1 }
    });
    console.log('Lowercase Header Success:', lowercaseResponse.data);
  } catch (error: any) {
    console.log('Lowercase Header Error:', error.response?.status);
  }
  
  // Test 4: Check API endpoint structure
  console.log('\n=== Test 4: API Endpoint Structure ===');
  const endpoints = [
    '/api/v1/workflows',
    '/workflows',
    '/api/workflows',
    '/api/v1/workflow'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: {
          'X-N8N-API-KEY': apiKey,
        },
        params: { limit: 1 },
        timeout: 5000
      });
      console.log(`✅ ${endpoint} - Success`);
    } catch (error: any) {
      console.log(`❌ ${endpoint} - ${error.response?.status || 'Failed'}`);
    }
  }
}

debugN8nAuth().catch(console.error);