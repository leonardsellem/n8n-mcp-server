import crypto from 'crypto';
import { createDatabaseAdapter, type DatabaseAdapter } from '../database/database-adapter';
import { logger } from '../utils/logger';
import path from 'path';

export interface BrowserCredential {
  id?: number;
  siteName: string;
  siteUrl: string;
  username: string;
  password: string;
  additionalFields?: Record<string, any>;
  loginSelectors?: {
    username?: string;
    password?: string;
    submit?: string;
    [key: string]: string | undefined;
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastUsed?: string;
  isActive?: boolean;
}

export interface BrowserSession {
  id?: number;
  sessionId: string;
  siteName: string;
  cookies: any[];
  localStorage: Record<string, any>;
  sessionStorage: Record<string, any>;
  createdAt?: string;
  lastAccessed?: string;
  expiresAt?: string;
  isActive?: boolean;
}

export interface BrowserAutomationLog {
  id?: number;
  sessionId?: string;
  action: string;
  targetUrl?: string;
  success: boolean;
  errorMessage?: string;
  screenshotPath?: string;
  executionTimeMs?: number;
  createdAt?: string;
}

export class CredentialService {
  private static readonly ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || 'n8n-mcp-default-key-change-me-in-production';
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_LENGTH = 32;
  private static readonly AUTH_TAG_LENGTH = 16;
  
  private static dbInstance: DatabaseAdapter | null = null;

  /**
   * Get or create database instance
   */
  private static async getDb(): Promise<DatabaseAdapter> {
    if (!this.dbInstance) {
      const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'nodes.db');
      this.dbInstance = await createDatabaseAdapter(dbPath);
    }
    return this.dbInstance;
  }

  /**
   * Generate a cryptographically secure key from password and salt
   */
  private static deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  private static encrypt(text: string): string {
    try {
      const salt = crypto.randomBytes(this.SALT_LENGTH);
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const key = this.deriveKey(this.ENCRYPTION_KEY, salt);
      
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine salt + iv + authTag + encrypted data
      const combined = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
      ]);
      
      return combined.toString('base64');
    } catch (error: any) {
      throw new Error(`Encryption failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Decrypt sensitive data using AES-256-GCM
   */
  private static decrypt(encryptedData: string): string {
    try {
      const combined = Buffer.from(encryptedData, 'base64');
      
      const salt = combined.subarray(0, this.SALT_LENGTH);
      const iv = combined.subarray(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
      const authTag = combined.subarray(this.SALT_LENGTH + this.IV_LENGTH, this.SALT_LENGTH + this.IV_LENGTH + this.AUTH_TAG_LENGTH);
      const encrypted = combined.subarray(this.SALT_LENGTH + this.IV_LENGTH + this.AUTH_TAG_LENGTH);
      
      const key = this.deriveKey(this.ENCRYPTION_KEY, salt);
      
      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error: any) {
      throw new Error(`Decryption failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Store login credentials securely
   */
  public static async storeCredentials(credentials: BrowserCredential): Promise<void> {
    try {
      const db = await this.getDb();
      const encryptedPassword = this.encrypt(credentials.password);
      
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO browser_credentials 
        (site_name, site_url, username, encrypted_password, additional_fields, login_selectors, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      
      stmt.run(
        credentials.siteName,
        credentials.siteUrl,
        credentials.username,
        encryptedPassword,
        JSON.stringify(credentials.additionalFields || {}),
        JSON.stringify(credentials.loginSelectors || {}),
        credentials.notes || null
      );
      
      logger.info(`Stored credentials for ${credentials.siteName}`);
    } catch (error: any) {
      logger.error('Failed to store credentials:', error);
      throw error;
    }
  }

  /**
   * Retrieve login credentials by site name
   */
  public static async getCredentials(siteName: string): Promise<BrowserCredential | null> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare('SELECT * FROM browser_credentials WHERE site_name = ? AND is_active = 1');
      const row: any = stmt.get(siteName);
      
      if (!row) {
        return null;
      }
      
      const decryptedPassword = this.decrypt(row.encrypted_password);
      
      return {
        id: row.id,
        siteName: row.site_name,
        siteUrl: row.site_url,
        username: row.username,
        password: decryptedPassword,
        additionalFields: JSON.parse(row.additional_fields || '{}'),
        loginSelectors: JSON.parse(row.login_selectors || '{}'),
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastUsed: row.last_used,
        isActive: row.is_active === 1
      };
    } catch (error: any) {
      logger.error(`Failed to retrieve credentials for ${siteName}:`, error);
      throw error;
    }
  }

  /**
   * List all saved credentials (without passwords)
   */
  public static async listCredentials(): Promise<Omit<BrowserCredential, 'password'>[]> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare(
        'SELECT id, site_name, site_url, username, notes, created_at, updated_at, last_used, is_active FROM browser_credentials WHERE is_active = 1 ORDER BY site_name'
      );
      const rows: any[] = stmt.all();
      
      return rows.map((row: any) => ({
        id: row.id,
        siteName: row.site_name,
        siteUrl: row.site_url,
        username: row.username,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastUsed: row.last_used,
        isActive: row.is_active === 1
      }));
    } catch (error: any) {
      logger.error('Failed to list credentials:', error);
      throw error;
    }
  }

  /**
   * Update existing credentials
   */
  public static async updateCredentials(siteName: string, updates: Partial<BrowserCredential>): Promise<void> {
    try {
      const db = await this.getDb();
      
      const setParts: string[] = [];
      const values: any[] = [];
      
      if (updates.username !== undefined) {
        setParts.push('username = ?');
        values.push(updates.username);
      }
      
      if (updates.password !== undefined) {
        setParts.push('encrypted_password = ?');
        values.push(this.encrypt(updates.password));
      }
      
      if (updates.siteUrl !== undefined) {
        setParts.push('site_url = ?');
        values.push(updates.siteUrl);
      }
      
      if (updates.additionalFields !== undefined) {
        setParts.push('additional_fields = ?');
        values.push(JSON.stringify(updates.additionalFields));
      }
      
      if (updates.loginSelectors !== undefined) {
        setParts.push('login_selectors = ?');
        values.push(JSON.stringify(updates.loginSelectors));
      }
      
      if (updates.notes !== undefined) {
        setParts.push('notes = ?');
        values.push(updates.notes);
      }
      
      if (setParts.length === 0) {
        throw new Error('No fields to update');
      }
      
      setParts.push('updated_at = datetime(\'now\')');
      values.push(siteName);
      
      const query = `UPDATE browser_credentials SET ${setParts.join(', ')} WHERE site_name = ? AND is_active = 1`;
      const stmt = db.prepare(query);
      stmt.run(...values);
      
      logger.info(`Updated credentials for ${siteName}`);
    } catch (error: any) {
      logger.error(`Failed to update credentials for ${siteName}:`, error);
      throw error;
    }
  }

  /**
   * Delete credentials for a site
   */
  public static async deleteCredentials(siteName: string): Promise<void> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare(
        'UPDATE browser_credentials SET is_active = 0, updated_at = datetime(\'now\') WHERE site_name = ?'
      );
      stmt.run(siteName);
      
      logger.info(`Deleted credentials for ${siteName}`);
    } catch (error: any) {
      logger.error(`Failed to delete credentials for ${siteName}:`, error);
      throw error;
    }
  }

  /**
   * Save browser session state
   */
  public static async saveSession(sessionData: BrowserSession): Promise<void> {
    try {
      const db = await this.getDb();
      
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO browser_sessions 
        (session_id, site_name, cookies, local_storage, session_storage, last_accessed, expires_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now', '+1 hour'))
      `);
      
      stmt.run(
        sessionData.sessionId,
        sessionData.siteName,
        JSON.stringify(sessionData.cookies || []),
        JSON.stringify(sessionData.localStorage || {}),
        JSON.stringify(sessionData.sessionStorage || {})
      );
      
      logger.info(`Saved session for ${sessionData.siteName}`);
    } catch (error: any) {
      logger.error('Failed to save session:', error);
      throw error;
    }
  }

  /**
   * Restore browser session state
   */
  public static async restoreSession(sessionId: string): Promise<BrowserSession | null> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare(
        'SELECT * FROM browser_sessions WHERE session_id = ? AND is_active = 1 AND expires_at > datetime(\'now\')'
      );
      const row: any = stmt.get(sessionId);
      
      if (!row) {
        return null;
      }
      
      return {
        id: row.id,
        sessionId: row.session_id,
        siteName: row.site_name,
        cookies: JSON.parse(row.cookies || '[]'),
        localStorage: JSON.parse(row.local_storage || '{}'),
        sessionStorage: JSON.parse(row.session_storage || '{}'),
        createdAt: row.created_at,
        lastAccessed: row.last_accessed,
        expiresAt: row.expires_at,
        isActive: row.is_active === 1
      };
    } catch (error: any) {
      logger.error(`Failed to restore session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Log browser automation actions
   */
  public static async logBrowserAction(logData: BrowserAutomationLog): Promise<void> {
    try {
      const db = await this.getDb();
      
      const stmt = db.prepare(`
        INSERT INTO browser_automation_logs 
        (session_id, action, target_url, success, error_message, screenshot_path, execution_time_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        logData.sessionId || null,
        logData.action,
        logData.targetUrl || null,
        logData.success ? 1 : 0,
        logData.errorMessage || null,
        logData.screenshotPath || null,
        logData.executionTimeMs || null
      );
    } catch (error: any) {
      logger.error('Failed to log browser action:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  /**
   * Get browser automation logs for debugging
   */
  public static async getBrowserLogs(sessionId?: string, limit: number = 50): Promise<BrowserAutomationLog[]> {
    try {
      const db = await this.getDb();
      
      let query = 'SELECT * FROM browser_automation_logs';
      let params: any[] = [];
      
      if (sessionId) {
        query += ' WHERE session_id = ?';
        params.push(sessionId);
      }
      
      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);
      
      const stmt = db.prepare(query);
      const rows: any[] = stmt.all(...params);
      
      return rows.map((row: any) => ({
        id: row.id,
        sessionId: row.session_id,
        action: row.action,
        targetUrl: row.target_url,
        success: row.success === 1,
        errorMessage: row.error_message,
        screenshotPath: row.screenshot_path,
        executionTimeMs: row.execution_time_ms,
        createdAt: row.created_at
      }));
    } catch (error: any) {
      logger.error('Failed to get browser logs:', error);
      throw error;
    }
  }

  /**
   * Mark credentials as used (update last_used timestamp)
   */
  public static async markCredentialsUsed(siteName: string): Promise<void> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare(
        'UPDATE browser_credentials SET last_used = datetime(\'now\') WHERE site_name = ? AND is_active = 1'
      );
      stmt.run(siteName);
    } catch (error: any) {
      logger.error(`Failed to mark credentials as used for ${siteName}:`, error);
      // Don't throw - this is just for tracking
    }
  }

  /**
   * Clean up expired sessions
   */
  public static async cleanupExpiredSessions(): Promise<void> {
    try {
      const db = await this.getDb();
      const stmt = db.prepare(
        'UPDATE browser_sessions SET is_active = 0 WHERE expires_at < datetime(\'now\')'
      );
      stmt.run();
      
      logger.info('Cleaned up expired browser sessions');
    } catch (error: any) {
      logger.error('Failed to cleanup expired sessions:', error);
    }
  }
}
