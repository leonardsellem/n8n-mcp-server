#!/usr/bin/env node

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'nodes.db');
const schemaPath = join(process.cwd(), 'src', 'database', 'schema.sql');

console.log('🔧 Initializing database...');

try {
  const db = new Database(dbPath);
  const schema = readFileSync(schemaPath, 'utf8');
  
  console.log('📄 Executing schema...');
  db.exec(schema);
  
  console.log('✅ Database initialized successfully!');
  console.log('📍 Database location:', dbPath);
  
  // Check if browser tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'browser_%'").all();
  console.log('🗂️ Browser tables:', tables.map(t => t.name).join(', '));
  
  db.close();
  
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}
