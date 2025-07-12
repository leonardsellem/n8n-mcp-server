import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import { CredentialService, BrowserCredential, BrowserSession, BrowserAutomationLog } from './credential-service';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export interface BrowserAction {
  action: string;
  params: Record<string, any>;
}

export interface BrowserActionResult {
  success: boolean;
  result?: any;
  error?: string;
  screenshot?: string;
  logs?: string[];
}

export interface BrowserSessionInfo {
  sessionId: string;
  siteName?: string;
  url?: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export class BrowserService {
  private static instance: BrowserService;
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();
  private pages: Map<string, Page> = new Map();
  private screenshots: Map<string, string> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): BrowserService {
    if (!BrowserService.instance) {
      BrowserService.instance = new BrowserService();
    }
    return BrowserService.instance;
  }

  /**
   * Initialize Playwright browser
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      logger.info('Initializing Playwright browser...');
      
      this.browser = await chromium.launch({
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
        ],
      });

      this.isInitialized = true;
      logger.info('Playwright browser initialized successfully');
      
      // Set up cleanup on process exit
      process.on('exit', () => this.cleanup());
      process.on('SIGINT', () => this.cleanup());
      process.on('SIGTERM', () => this.cleanup());
      
    } catch (error) {
      logger.error('Failed to initialize Playwright browser:', error);
      throw error;
    }
  }

  /**
   * Create a new browser session
   */
  public async createSession(siteName?: string): Promise<string> {
    await this.initialize();
    
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const sessionId = uuidv4();
    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    
    // Set up page event listeners
    page.on('console', (msg) => {
      logger.debug(`[${sessionId}] Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', (err) => {
      logger.error(`[${sessionId}] Page error:`, err);
    });

    this.contexts.set(sessionId, context);
    this.pages.set(sessionId, page);

    // Log session creation
    await CredentialService.logBrowserAction({
      sessionId,
      action: 'create_session',
      success: true,
      executionTimeMs: 0
    });

    logger.info(`Created browser session: ${sessionId}`);
    return sessionId;
  }

  /**
   * Execute a browser action
   */
  public async executeAction(sessionId: string, action: BrowserAction): Promise<BrowserActionResult> {
    const startTime = Date.now();
    
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      let result: any;
      
      switch (action.action) {
        case 'goto':
          await page.goto(action.params.url);
          result = { 
            title: await page.title(), 
            url: page.url() 
          };
          break;

        case 'click':
          await page.click(action.params.selector);
          result = { success: true };
          break;

        case 'type':
          await page.type(action.params.selector, action.params.text);
          result = { success: true };
          break;

        case 'fill':
          await page.fill(action.params.selector, action.params.value);
          result = { success: true };
          break;

        case 'select':
          await page.selectOption(action.params.selector, action.params.value);
          result = { success: true };
          break;

        case 'wait':
          if (action.params.selector) {
            await page.waitForSelector(action.params.selector, { timeout: action.params.timeout || 30000 });
          } else if (action.params.timeout) {
            await page.waitForTimeout(action.params.timeout);
          }
          result = { success: true };
          break;

        case 'screenshot':
          const screenshotPath = await this.takeScreenshot(sessionId);
          result = { screenshot: screenshotPath };
          break;

        case 'evaluate':
          result = await page.evaluate(action.params.script);
          break;

        case 'getAttribute':
          result = await page.getAttribute(action.params.selector, action.params.attribute);
          break;

        case 'getText':
          result = await page.textContent(action.params.selector);
          break;

        case 'getTitle':
          result = await page.title();
          break;

        case 'getUrl':
          result = page.url();
          break;

        case 'goBack':
          await page.goBack();
          result = { url: page.url() };
          break;

        case 'goForward':
          await page.goForward();
          result = { url: page.url() };
          break;

        case 'reload':
          await page.reload();
          result = { url: page.url() };
          break;

        case 'hover':
          await page.hover(action.params.selector);
          result = { success: true };
          break;

        case 'dragAndDrop':
          await page.dragAndDrop(action.params.source, action.params.target);
          result = { success: true };
          break;

        case 'uploadFile':
          await page.setInputFiles(action.params.selector, action.params.files);
          result = { success: true };
          break;

        case 'getCookies':
          result = await page.context().cookies();
          break;

        case 'setCookie':
          await page.context().addCookies([action.params.cookie]);
          result = { success: true };
          break;

        case 'login':
          result = await this.performLogin(sessionId, action.params as { siteName: string, url?: string });
          break;

        case 'saveSession':
          result = await this.saveSession(sessionId, action.params.siteName);
          break;

        case 'restoreSession':
          result = await this.restoreSession(sessionId, action.params.siteName);
          break;

        default:
          throw new Error(`Unknown action: ${action.action}`);
      }

      const executionTime = Date.now() - startTime;
      
      // Log successful action
      await CredentialService.logBrowserAction({
        sessionId,
        action: action.action,
        targetUrl: page.url(),
        success: true,
        executionTimeMs: executionTime
      });

      return {
        success: true,
        result,
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || 'Unknown error';
      
      // Log failed action
      await CredentialService.logBrowserAction({
        sessionId,
        action: action.action,
        success: false,
        errorMessage,
        executionTimeMs: executionTime
      });

      return {
        success: false,
        error: errorMessage,
        screenshot: await this.takeScreenshot(sessionId)
      };
    }
  }

  /**
   * Perform automated login using stored credentials
   */
  private async performLogin(sessionId: string, params: { siteName: string, url?: string }): Promise<any> {
    const page = this.pages.get(sessionId);
    if (!page) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const credentials = await CredentialService.getCredentials(params.siteName);
    if (!credentials) {
      throw new Error(`No credentials found for ${params.siteName}`);
    }

    // Navigate to login page if URL provided
    if (params.url) {
      await page.goto(params.url);
    }

    // Use custom selectors if provided, otherwise use common selectors
    const selectors = credentials.loginSelectors || {};
    const usernameSelector = selectors.username || 'input[type="email"], input[type="text"], input[name="username"], input[name="email"]';
    const passwordSelector = selectors.password || 'input[type="password"], input[name="password"]';
    const submitSelector = selectors.submit || 'button[type="submit"], input[type="submit"], button:contains("Login"), button:contains("Sign In")';

    try {
      // Fill username
      await page.waitForSelector(usernameSelector, { timeout: 10000 });
      await page.fill(usernameSelector, credentials.username);

      // Fill password
      await page.waitForSelector(passwordSelector, { timeout: 5000 });
      await page.fill(passwordSelector, credentials.password);

      // Click submit
      await page.click(submitSelector);

      // Wait for navigation or success indicator
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      // Mark credentials as used
      await CredentialService.markCredentialsUsed(params.siteName);

      return {
        success: true,
        url: page.url(),
        title: await page.title()
      };

    } catch (error: any) {
      throw new Error(`Login failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Save current session state
   */
  private async saveSession(sessionId: string, siteName: string): Promise<any> {
    const context = this.contexts.get(sessionId);
    if (!context) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const cookies = await context.cookies();
    const page = this.pages.get(sessionId);
    
    // Get localStorage and sessionStorage
    const localStorage = page ? await page.evaluate(() => JSON.stringify(window.localStorage)) : '{}';
    const sessionStorage = page ? await page.evaluate(() => JSON.stringify(window.sessionStorage)) : '{}';

    const sessionData: BrowserSession = {
      sessionId,
      siteName,
      cookies,
      localStorage: JSON.parse(localStorage),
      sessionStorage: JSON.parse(sessionStorage)
    };

    await CredentialService.saveSession(sessionData);

    return { success: true, sessionId };
  }

  /**
   * Restore session state
   */
  private async restoreSession(sessionId: string, siteName: string): Promise<any> {
    const context = this.contexts.get(sessionId);
    const page = this.pages.get(sessionId);
    
    if (!context || !page) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const sessionData = await CredentialService.restoreSession(sessionId);
    if (!sessionData) {
      throw new Error(`No saved session found for ${siteName}`);
    }

    // Restore cookies
    await context.addCookies(sessionData.cookies);

    // Restore localStorage and sessionStorage
    await page.evaluate((data) => {
      Object.entries(data.localStorage).forEach(([key, value]) => {
        window.localStorage.setItem(key, value);
      });
      Object.entries(data.sessionStorage).forEach(([key, value]) => {
        window.sessionStorage.setItem(key, value);
      });
    }, sessionData);

    return { success: true, restored: true };
  }

  /**
   * Take a screenshot
   */
  public async takeScreenshot(sessionId: string): Promise<string> {
    const page = this.pages.get(sessionId);
    if (!page) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const filename = `${sessionId}-${Date.now()}.png`;
    const filepath = path.join(screenshotDir, filename);

    await page.screenshot({
      path: filepath,
      fullPage: true
    });

    this.screenshots.set(sessionId, filepath);
    return filepath;
  }

  /**
   * Get active sessions
   */
  public getActiveSessions(): BrowserSessionInfo[] {
    return Array.from(this.contexts.entries()).map(([sessionId, context]) => ({
      sessionId,
      siteName: undefined, // We'd need to track this separately
      url: undefined, // We'd need to get this from the page
      isActive: true,
      createdAt: new Date(), // We'd need to track this
      lastActivity: new Date()
    }));
  }

  /**
   * Close a specific session
   */
  public async closeSession(sessionId: string): Promise<void> {
    const context = this.contexts.get(sessionId);
    if (context) {
      await context.close();
      this.contexts.delete(sessionId);
    }

    this.pages.delete(sessionId);
    this.screenshots.delete(sessionId);

    // Log session closure
    await CredentialService.logBrowserAction({
      sessionId,
      action: 'close_session',
      success: true
    });

    logger.info(`Closed browser session: ${sessionId}`);
  }

  /**
   * Close all sessions and cleanup
   */
  public async cleanup(): Promise<void> {
    logger.info('Cleaning up browser sessions...');
    
    // Close all contexts
    for (const [sessionId, context] of this.contexts) {
      try {
        await context.close();
        logger.info(`Closed session: ${sessionId}`);
      } catch (error) {
        logger.error(`Failed to close session ${sessionId}:`, error);
      }
    }

    // Close browser
    if (this.browser) {
      try {
        await this.browser.close();
        logger.info('Browser closed');
      } catch (error) {
        logger.error('Failed to close browser:', error);
      }
    }

    // Clear maps
    this.contexts.clear();
    this.pages.clear();
    this.screenshots.clear();
    
    this.isInitialized = false;
    this.initPromise = null;
    this.browser = null;
  }

  /**
   * Get browser logs for debugging
   */
  public async getBrowserLogs(sessionId?: string): Promise<BrowserAutomationLog[]> {
    return await CredentialService.getBrowserLogs(sessionId);
  }

  /**
   * Store credentials for a site
   */
  public async storeCredentials(credentials: BrowserCredential): Promise<void> {
    return await CredentialService.storeCredentials(credentials);
  }

  /**
   * List stored credentials
   */
  public async listCredentials(): Promise<Omit<BrowserCredential, 'password'>[]> {
    return await CredentialService.listCredentials();
  }
}

// Export singleton instance
export const browserService = BrowserService.getInstance();
