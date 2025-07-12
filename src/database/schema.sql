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
  -- GitHub tracking fields
  github_path TEXT,
  github_sha TEXT,
  github_last_modified DATETIME,
  source_type TEXT DEFAULT 'package' CHECK(source_type IN ('package', 'github')),
  source_content TEXT, -- Raw TypeScript source code from GitHub
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Minimal indexes for performance
CREATE INDEX IF NOT EXISTS idx_package ON nodes(package_name);
CREATE INDEX IF NOT EXISTS idx_ai_tool ON nodes(is_ai_tool);
CREATE INDEX IF NOT EXISTS idx_category ON nodes(category);
CREATE INDEX IF NOT EXISTS idx_github_sha ON nodes(github_sha);
CREATE INDEX IF NOT EXISTS idx_source_type ON nodes(source_type);
CREATE INDEX IF NOT EXISTS idx_github_modified ON nodes(github_last_modified);

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

-- GitHub sync metadata table
CREATE TABLE IF NOT EXISTS github_sync_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repository TEXT NOT NULL DEFAULT 'n8n-io/n8n',
  branch TEXT NOT NULL DEFAULT 'master',
  last_sync_commit TEXT,
  last_sync_timestamp DATETIME,
  nodes_synced INTEGER DEFAULT 0,
  credentials_synced INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'idle' CHECK(sync_status IN ('idle', 'running', 'error')),
  sync_error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search for templates
CREATE VIRTUAL TABLE IF NOT EXISTS templates_fts USING fts5(
  name, description, content=templates
);

-- Browser credentials table for persistent login storage
CREATE TABLE IF NOT EXISTS browser_credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_name TEXT NOT NULL,
  site_url TEXT NOT NULL,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  additional_fields TEXT, -- JSON for 2FA, security questions, etc.
  login_selectors TEXT, -- JSON for username/password field selectors
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used DATETIME,
  is_active INTEGER DEFAULT 1,
  notes TEXT
);

-- Browser sessions table for managing active sessions
CREATE TABLE IF NOT EXISTS browser_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  site_name TEXT NOT NULL,
  cookies TEXT, -- JSON serialized cookies
  local_storage TEXT, -- JSON serialized localStorage
  session_storage TEXT, -- JSON serialized sessionStorage
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  is_active INTEGER DEFAULT 1
);

-- Browser automation logs for debugging
CREATE TABLE IF NOT EXISTS browser_automation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  action TEXT NOT NULL,
  target_url TEXT,
  success INTEGER DEFAULT 1,
  error_message TEXT,
  screenshot_path TEXT,
  execution_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for browser tables
CREATE INDEX IF NOT EXISTS idx_credentials_site ON browser_credentials(site_name);
CREATE INDEX IF NOT EXISTS idx_credentials_url ON browser_credentials(site_url);
CREATE INDEX IF NOT EXISTS idx_credentials_active ON browser_credentials(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_site ON browser_sessions(site_name);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON browser_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON browser_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_session ON browser_automation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON browser_automation_logs(action);
