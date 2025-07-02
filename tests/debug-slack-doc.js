#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const tempDir = path.join(process.cwd(), 'temp', 'n8n-docs');

console.log('🔍 Debugging Slack documentation search...\n');

// Search for all Slack related files
console.log('All Slack-related markdown files:');
try {
  const allSlackFiles = execSync(
    `find ${tempDir}/docs/integrations/builtin -name "*slack*.md" -type f`,
    { encoding: 'utf-8' }
  ).trim().split('\n');
  
  allSlackFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
} catch (error) {
  console.log('  No files found');
}

console.log('\n📄 Checking file paths:');
const possiblePaths = [
  'docs/integrations/builtin/app-nodes/n8n-nodes-base.Slack.md',
  'docs/integrations/builtin/app-nodes/n8n-nodes-base.slack.md',
  'docs/integrations/builtin/core-nodes/n8n-nodes-base.Slack.md',
  'docs/integrations/builtin/core-nodes/n8n-nodes-base.slack.md',
  'docs/integrations/builtin/trigger-nodes/n8n-nodes-base.Slack.md',
  'docs/integrations/builtin/trigger-nodes/n8n-nodes-base.slack.md',
  'docs/integrations/builtin/credentials/slack.md',
];

const fs = require('fs');
possiblePaths.forEach(p => {
  const fullPath = path.join(tempDir, p);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? '✓' : '✗'} ${p}`);
  
  if (exists) {
    // Read first few lines
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n').slice(0, 10);
    const title = lines.find(l => l.includes('title:'));
    if (title) {
      console.log(`    Title: ${title.trim()}`);
    }
  }
});