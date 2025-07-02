-- Ultra-simple schema for MVP
CREATE TABLE IF NOT EXISTS nodes (
  node_type TEXT PRIMARY KEY,
  package_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  development_style TEXT CHECK(development_style IN ('declarative', 'programmatic')),
  is_ai_tool INTEGER DEFAULT 0,
  is_trigger INTEGER DEFAULT 0,
  is_webhook INTEGER DEFAULT 0,
  is_versioned INTEGER DEFAULT 0,
  version TEXT,
  documentation TEXT,
  properties_schema TEXT,
  operations TEXT,
  credentials_required TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Minimal indexes for performance
CREATE INDEX IF NOT EXISTS idx_package ON nodes(package_name);
CREATE INDEX IF NOT EXISTS idx_ai_tool ON nodes(is_ai_tool);
CREATE INDEX IF NOT EXISTS idx_category ON nodes(category);

-- Templates table for n8n workflow templates
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY,
  workflow_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  author_name TEXT,
  author_username TEXT,
  author_verified INTEGER DEFAULT 0,
  nodes_used TEXT, -- JSON array of node types
  workflow_json TEXT NOT NULL, -- Complete workflow JSON
  categories TEXT, -- JSON array of categories
  views INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME,
  url TEXT,
  scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_template_nodes ON templates(nodes_used);
CREATE INDEX IF NOT EXISTS idx_template_updated ON templates(updated_at);
CREATE INDEX IF NOT EXISTS idx_template_name ON templates(name);

-- Full-text search for templates
CREATE VIRTUAL TABLE IF NOT EXISTS templates_fts USING fts5(
  name, description, content=templates
);