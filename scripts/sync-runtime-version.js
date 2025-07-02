#!/usr/bin/env node

/**
 * Sync version from package.json to package.runtime.json
 * This ensures both files always have the same version
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageRuntimePath = path.join(__dirname, '..', 'package.runtime.json');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;
  
  // Read package.runtime.json
  const packageRuntime = JSON.parse(fs.readFileSync(packageRuntimePath, 'utf-8'));
  
  // Update version if different
  if (packageRuntime.version !== version) {
    packageRuntime.version = version;
    
    // Write back with proper formatting
    fs.writeFileSync(
      packageRuntimePath, 
      JSON.stringify(packageRuntime, null, 2) + '\n',
      'utf-8'
    );
    
    console.log(`✅ Updated package.runtime.json version to ${version}`);
  } else {
    console.log(`✓ package.runtime.json already at version ${version}`);
  }
} catch (error) {
  console.error('❌ Error syncing version:', error.message);
  process.exit(1);
}