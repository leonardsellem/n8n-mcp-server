#!/usr/bin/env node

// Load environment variables from .env file
import { config } from 'dotenv';
config();

async function testAllTools() {
    console.error('Testing all tool modules...');

    const toolModules = [
        'workflow',
        'execution', 
        'credentials',
        'folders',
        'discovery',
        'ai-generation',
        'templates',
        'testing',
        'monitoring',
        'optimization',
        'integration',
        'documentation',
        'collaboration',
        'security',
        'environment',
        'projects',
        'tags',
        'users',
        'variables',
        'source-control',
        'auditing',
        'adaptive-learning',
        'ai-agent-templates',
        'ai-friendly',
        'utility',
        'workflow-builder'
    ];

    const results = {};

    for (const module of toolModules) {
        try {
            console.error(`Testing ${module} tools...`);
            const moduleExports = await import(`./build/tools/${module}/index.js`);
            
            if (moduleExports.setupWorkflowTools) {
                const tools = await moduleExports.setupWorkflowTools();
                results[module] = { status: 'success', count: tools.length };
                console.error(`✓ ${module}: ${tools.length} tools loaded`);
            } else if (moduleExports.setupExecutionTools) {
                const tools = await moduleExports.setupExecutionTools();
                results[module] = { status: 'success', count: tools.length };
                console.error(`✓ ${module}: ${tools.length} tools loaded`);
            } else if (moduleExports.setupCredentialTools) {
                const tools = await moduleExports.setupCredentialTools();
                results[module] = { status: 'success', count: tools.length };
                console.error(`✓ ${module}: ${tools.length} tools loaded`);
            } else if (moduleExports.setupFolderTools) {
                const tools = await moduleExports.setupFolderTools();
                results[module] = { status: 'success', count: tools.length };
                console.error(`✓ ${module}: ${tools.length} tools loaded`);
            } else if (moduleExports.setupDiscoveryTools) {
                const tools = await moduleExports.setupDiscoveryTools();
                results[module] = { status: 'success', count: tools.length };
                console.error(`✓ ${module}: ${tools.length} tools loaded`);
            } else {
                // Try to find any setup function
                const setupFunctions = Object.keys(moduleExports).filter(key => key.startsWith('setup') && typeof moduleExports[key] === 'function');
                if (setupFunctions.length > 0) {
                    const tools = await moduleExports[setupFunctions[0]]();
                    results[module] = { status: 'success', count: Array.isArray(tools) ? tools.length : 1 };
                    console.error(`✓ ${module}: loaded via ${setupFunctions[0]}`);
                } else {
                    results[module] = { status: 'success', count: 'unknown' };
                    console.error(`✓ ${module}: module loaded (no setup function found)`);
                }
            }
        } catch (error) {
            results[module] = { status: 'error', error: error.message };
            console.error(`✗ ${module}: ${error.message}`);
        }
    }

    console.error('\n=== SUMMARY ===');
    for (const [module, result] of Object.entries(results)) {
        if (result.status === 'success') {
            console.error(`✓ ${module}: ${result.count} tools`);
        } else {
            console.error(`✗ ${module}: ${result.error}`);
        }
    }
}

testAllTools().catch(console.error);
