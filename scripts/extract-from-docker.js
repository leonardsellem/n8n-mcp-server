#!/usr/bin/env node
const dotenv = require('dotenv');
const { NodeDocumentationService } = require('../dist/services/node-documentation-service');
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');
const { logger } = require('../dist/utils/logger');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();

async function extractNodesFromDocker() {
  logger.info('🐳 Starting Docker-based node extraction...');
  
  // Add Docker volume paths to environment for NodeSourceExtractor
  const dockerVolumePaths = [
    process.env.N8N_MODULES_PATH || '/n8n-modules',
    process.env.N8N_CUSTOM_PATH || '/n8n-custom',
  ];
  
  logger.info(`Docker volume paths: ${dockerVolumePaths.join(', ')}`);
  
  // Check if volumes are mounted
  for (const volumePath of dockerVolumePaths) {
    try {
      await fs.access(volumePath);
      logger.info(`✅ Volume mounted: ${volumePath}`);
      
      // List what's in the volume
      const entries = await fs.readdir(volumePath);
      logger.info(`Contents of ${volumePath}: ${entries.slice(0, 10).join(', ')}${entries.length > 10 ? '...' : ''}`);
    } catch (error) {
      logger.warn(`❌ Volume not accessible: ${volumePath}`);
    }
  }
  
  // Initialize services
  const docService = new NodeDocumentationService();
  const extractor = new NodeSourceExtractor();
  
  // Extend the extractor's search paths with Docker volumes
  extractor.n8nBasePaths.unshift(...dockerVolumePaths);
  
  // Clear existing nodes to ensure we only have latest versions
  logger.info('🧹 Clearing existing nodes...');
  const db = docService.db;
  db.prepare('DELETE FROM nodes').run();
  
  logger.info('🔍 Searching for n8n nodes in Docker volumes...');
  
  // Known n8n packages to extract
  const n8nPackages = [
    'n8n-nodes-base',
    '@n8n/n8n-nodes-langchain',
    'n8n-nodes-extras',
  ];
  
  let totalExtracted = 0;
  let ifNodeVersion = null;
  
  for (const packageName of n8nPackages) {
    logger.info(`\n📦 Processing package: ${packageName}`);
    
    try {
      // Find package in Docker volumes
      let packagePath = null;
      
      for (const volumePath of dockerVolumePaths) {
        const possiblePaths = [
          path.join(volumePath, packageName),
          path.join(volumePath, '.pnpm', `${packageName}@*`, 'node_modules', packageName),
        ];
        
        for (const testPath of possiblePaths) {
          try {
            // Use glob pattern to find pnpm packages
            if (testPath.includes('*')) {
              const baseDir = path.dirname(testPath.split('*')[0]);
              const entries = await fs.readdir(baseDir);
              
              for (const entry of entries) {
                if (entry.includes(packageName.replace('/', '+'))) {
                  const fullPath = path.join(baseDir, entry, 'node_modules', packageName);
                  try {
                    await fs.access(fullPath);
                    packagePath = fullPath;
                    break;
                  } catch {}
                }
              }
            } else {
              await fs.access(testPath);
              packagePath = testPath;
              break;
            }
          } catch {}
        }
        
        if (packagePath) break;
      }
      
      if (!packagePath) {
        logger.warn(`Package ${packageName} not found in Docker volumes`);
        continue;
      }
      
      logger.info(`Found package at: ${packagePath}`);
      
      // Check package version
      try {
        const packageJsonPath = path.join(packagePath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        logger.info(`Package version: ${packageJson.version}`);
      } catch {}
      
      // Find nodes directory
      const nodesPath = path.join(packagePath, 'dist', 'nodes');
      
      try {
        await fs.access(nodesPath);
        logger.info(`Scanning nodes directory: ${nodesPath}`);
        
        // Extract all nodes from this package
        const nodeEntries = await scanForNodes(nodesPath);
        logger.info(`Found ${nodeEntries.length} nodes in ${packageName}`);
        
        for (const nodeEntry of nodeEntries) {
          try {
            const nodeName = nodeEntry.name.replace('.node.js', '');
            const nodeType = `${packageName}.${nodeName}`;
            
            logger.info(`Extracting: ${nodeType}`);
            
            // Extract source info
            const sourceInfo = await extractor.extractNodeSource(nodeType);
            
            // Check if this is the If node
            if (nodeName === 'If') {
              // Look for version in the source code
              const versionMatch = sourceInfo.sourceCode.match(/version:\s*(\d+)/);
              if (versionMatch) {
                ifNodeVersion = versionMatch[1];
                logger.info(`📍 Found If node version: ${ifNodeVersion}`);
              }
            }
            
            // Store in database
            await docService.storeNode({
              nodeType: nodeType,
              name: nodeName,
              displayName: nodeName,
              description: `${nodeName} node from ${packageName}`,
              sourceCode: sourceInfo.sourceCode,
              credentialCode: sourceInfo.credentialCode,
              packageName: packageName,
              version: ifNodeVersion || '1',
              hasCredentials: !!sourceInfo.credentialCode,
              isTrigger: sourceInfo.sourceCode.includes('trigger: true') || nodeName.toLowerCase().includes('trigger'),
              isWebhook: sourceInfo.sourceCode.includes('webhook: true') || nodeName.toLowerCase().includes('webhook'),
            });
            
            totalExtracted++;
          } catch (error) {
            logger.error(`Failed to extract ${nodeEntry.name}: ${error}`);
          }
        }
      } catch (error) {
        logger.error(`Failed to scan nodes directory: ${error}`);
      }
    } catch (error) {
      logger.error(`Failed to process package ${packageName}: ${error}`);
    }
  }
  
  logger.info(`\n✅ Extraction complete!`);
  logger.info(`📊 Total nodes extracted: ${totalExtracted}`);
  
  if (ifNodeVersion) {
    logger.info(`📍 If node version: ${ifNodeVersion}`);
    if (ifNodeVersion === '2' || ifNodeVersion === '2.2') {
      logger.info('✅ Successfully extracted latest If node (v2+)!');
    } else {
      logger.warn(`⚠️ If node version is ${ifNodeVersion}, expected v2 or higher`);
    }
  }
  
  // Close database
  docService.close();
}

async function scanForNodes(dirPath) {
  const nodes = [];
  
  async function scan(currentPath) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isFile() && entry.name.endsWith('.node.js')) {
          nodes.push({ name: entry.name, path: fullPath });
        } else if (entry.isDirectory() && entry.name !== 'node_modules') {
          await scan(fullPath);
        }
      }
    } catch (error) {
      logger.debug(`Failed to scan directory ${currentPath}: ${error}`);
    }
  }
  
  await scan(dirPath);
  return nodes;
}

// Run extraction
extractNodesFromDocker().catch(error => {
  logger.error('Extraction failed:', error);
  process.exit(1);
});