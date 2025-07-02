#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { NodeDocumentationService } from '../services/node-documentation-service';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

/**
 * Rebuild the enhanced documentation database
 */
async function rebuildDocumentationDatabase() {
  console.log('🔄 Starting enhanced documentation database rebuild...\n');
  
  const startTime = Date.now();
  const service = new NodeDocumentationService();
  
  try {
    // Run the rebuild
    const results = await service.rebuildDatabase();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n✅ Enhanced documentation database rebuild completed!\n');
    console.log('📊 Results:');
    console.log(`   Total nodes found: ${results.total}`);
    console.log(`   Successfully processed: ${results.successful}`);
    console.log(`   Failed: ${results.failed}`);
    console.log(`   Duration: ${duration}s`);
    
    if (results.errors.length > 0) {
      console.log(`\n⚠️  First ${Math.min(5, results.errors.length)} errors:`);
      results.errors.slice(0, 5).forEach(err => {
        console.log(`   - ${err}`);
      });
      
      if (results.errors.length > 5) {
        console.log(`   ... and ${results.errors.length - 5} more errors`);
      }
    }
    
    // Get and display statistics
    const stats = await service.getStatistics();
    console.log('\n📈 Database Statistics:');
    console.log(`   Total nodes: ${stats.totalNodes}`);
    console.log(`   Nodes with documentation: ${stats.nodesWithDocs}`);
    console.log(`   Nodes with examples: ${stats.nodesWithExamples}`);
    console.log(`   Nodes with credentials: ${stats.nodesWithCredentials}`);
    console.log(`   Trigger nodes: ${stats.triggerNodes}`);
    console.log(`   Webhook nodes: ${stats.webhookNodes}`);
    
    console.log('\n📦 Package distribution:');
    stats.packageDistribution.slice(0, 10).forEach((pkg: any) => {
      console.log(`   ${pkg.package}: ${pkg.count} nodes`);
    });
    
    // Close database connection
    await service.close();
    
    console.log('\n✨ Enhanced documentation database is ready!');
    console.log('💡 The database now includes:');
    console.log('   - Complete node source code');
    console.log('   - Enhanced documentation with operations and API methods');
    console.log('   - Code examples and templates');
    console.log('   - Related resources and required scopes');
    
  } catch (error) {
    console.error('\n❌ Documentation database rebuild failed:', error);
    service.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  rebuildDocumentationDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { rebuildDocumentationDatabase };