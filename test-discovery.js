#!/usr/bin/env node

import { EnhancedNodeDiscovery } from './src/discovery/enhanced-discovery.js';

console.log('🧪 Testing Enhanced Node Discovery...');

try {
  const stats = EnhancedNodeDiscovery.getNodeStatistics();
  console.log(`✅ Total Nodes: ${stats.totalNodes}`);
  console.log(`✅ Categories: ${stats.categories}`);
  console.log(`✅ Trigger Nodes: ${stats.triggerNodes}`);
  console.log(`✅ Regular Nodes: ${stats.regularNodes}`);
  
  if (stats.totalNodes >= 500) {
    console.log('🎉 Discovery fixed - All nodes available!');
  } else {
    console.log('⚠️  Still missing nodes - check imports');
  }
} catch (error) {
  console.error('❌ Discovery test failed:', error.message);
}
