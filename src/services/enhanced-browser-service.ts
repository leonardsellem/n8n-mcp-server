import { chromium, Browser, BrowserContext, Page, Locator } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import { CredentialService, BrowserCredential, BrowserSession, BrowserAutomationLog } from './credential-service';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export interface SmartSelector {
  primary: string;
  fallbacks: string[];
  description: string;
}

export interface ElementDetectionOptions {
  timeout?: number;
  retries?: number;
  waitForStable?: boolean;
  requireVisible?: boolean;
}

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
  selectorUsed?: string;
  retryCount?: number;
}

export class EnhancedBrowserService {
  private static instance: EnhancedBrowserService;
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();
  private pages: Map<string, Page> = new Map();
  private screenshots: Map<string, string> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Smart selectors for common UI patterns
  private static SMART_SELECTORS = {
    // n8n specific selectors
    addNodeButton: {
      primary: '[data-test-id="canvas-add-button"]',
      fallbacks: [
        '.fa-plus',
        'button:has(.fa-plus)',
        '[title*="Add"]',
        'button:has-text("Add")',
        '.add-button',
        '[data-test-id*="add"]'
      ],
      description: 'Add node button in n8n canvas'
    },
    nodeItem: {
      primary: '[data-test-id="node-creator-node-item"]',
      fallbacks: [
        '.node-item',
        '.node-creator-item',
        '[data-node-type]',
        '.node-option',
        'div:has-text("HTTP Request")',
        'div[role="option"]'
      ],
      description: 'Individual node in node selector'
    },
    signInButton: {
      primary: 'button[type="submit"]',
      fallbacks: [
        'button:has-text("Sign in")',
        'button:has-text("Login")',
        'button:has-text("Submit")',
        '.el-button--primary',
        '[data-test-id*="submit"]',
        'input[type="submit"]'
      ],
      description: 'Sign in/login button'
    },
    workflowItem: {
      primary: '[data-test-id="workflow-card"]',
      fallbacks: [
        '.workflow-card',
        '.workflow-item',
        'a[href*="/workflow/"]',
        '[data-workflow-id]',
        '.card:has(h3)'
      ],
      description: 'Workflow item in workflow list'
    },
    // Generic UI patterns
    usernameField: {
      primary: 'input[type="email"]',
      fallbacks: [
        'input[name="email"]',
        'input[name="username"]',
        'input[type="text"]:first-of-type',
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]'
      ],
      description: 'Username/email input field'
    },
    passwordField: {
      primary: 'input[type="password"]',
      fallbacks: [
        'input[name="password"]',
        'input[placeholder*="password" i]'
      ],
      description: 'Password input field'
    }
  };

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): EnhancedBrowserService {
    if (!EnhancedBrowserService.instance) {
      EnhancedBrowserService.instance = new EnhancedBrowserService();
    }
    return EnhancedBrowserService.instance;
  }

  /**
   * Initialize Playwright browser with enhanced configuration
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
      logger.info('Initializing Enhanced Playwright browser...');
      
      this.browser = await chromium.launch({
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-blink-features=AutomationControlled',
        ],
      });

      this.isInitialized = true;
      logger.info('Enhanced Playwright browser initialized successfully');
      
      // Set up cleanup on process exit
      process.on('exit', () => this.cleanup());
      process.on('SIGINT', () => this.cleanup());
      process.on('SIGTERM', () => this.cleanup());
      
    } catch (error) {
      logger.error('Failed to initialize Enhanced Playwright browser:', error);
      throw error;
    }
  }

  /**
   * Smart element detection that tries multiple selector strategies
   */
  private async findElement(page: Page, selector: string | SmartSelector, options: ElementDetectionOptions = {}): Promise<{
    locator: Locator;
    selectorUsed: string;
    retryCount: number;
  }> {
    const {
      timeout = 30000,
      retries = 3,
      waitForStable = true,
      requireVisible = true
    } = options;

    let selectors: string[];
    let description: string;

    if (typeof selector === 'string') {
      selectors = [selector];
      description = `selector: ${selector}`;
    } else {
      selectors = [selector.primary, ...selector.fallbacks];
      description = selector.description;
    }

    let lastError: Error | null = null;
    let retryCount = 0;

    for (let attempt = 0; attempt <= retries; attempt++) {
      for (const selectorStr of selectors) {
        try {
          logger.debug(`Trying selector: ${selectorStr} (attempt ${attempt + 1})`);
          
          const locator = page.locator(selectorStr);
          
          // Wait for element to exist
          await locator.first().waitFor({ 
            state: 'attached', 
            timeout: timeout / selectors.length 
          });

          // Wait for element to be visible if required
          if (requireVisible) {
            await locator.first().waitFor({ 
              state: 'visible', 
              timeout: 5000 
            });
          }

          // Wait for element to be stable if required (using a short delay instead)
          if (waitForStable) {
            await page.waitForTimeout(100);
          }

          logger.info(`Successfully found element using selector: ${selectorStr}`);
          return {
            locator,
            selectorUsed: selectorStr,
            retryCount: attempt
          };

        } catch (error: any) {
          lastError = error;
          logger.debug(`Selector ${selectorStr} failed: ${error.message}`);
          continue;
        }
      }

      retryCount = attempt;
      
      // Wait before retry
      if (attempt < retries) {
        const waitTime = Math.min(1000 * (attempt + 1), 5000);
        logger.debug(`Waiting ${waitTime}ms before retry...`);
        await page.waitForTimeout(waitTime);
      }
    }

    throw new Error(`Failed to find element after ${retries + 1} attempts. ${description}. Last error: ${lastError?.message}`);
  }

  /**
   * Smart click that handles multiple selector strategies and retries
   */
  public async smartClick(sessionId: string, selector: string | SmartSelector, options: ElementDetectionOptions = {}): Promise<BrowserActionResult> {
    const startTime = Date.now();
    
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const { locator, selectorUsed, retryCount } = await this.findElement(page, selector, options);
      
      // Ensure element is clickable
      await locator.first().click({ timeout: 10000 });

      const executionTime = Date.now() - startTime;
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'smart_click',
        targetUrl: page.url(),
        success: true,
        executionTimeMs: executionTime
      });

      return {
        success: true,
        result: { success: true },
        selectorUsed,
        retryCount,
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || 'Unknown error';
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'smart_click',
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
   * Smart fill that handles multiple input strategies
   */
  public async smartFill(sessionId: string, selector: string | SmartSelector, text: string, options: ElementDetectionOptions = {}): Promise<BrowserActionResult> {
    const startTime = Date.now();
    
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const { locator, selectorUsed, retryCount } = await this.findElement(page, selector, options);
      
      // Clear and fill the input
      await locator.first().clear();
      await locator.first().fill(text);

      const executionTime = Date.now() - startTime;
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'smart_fill',
        targetUrl: page.url(),
        success: true,
        executionTimeMs: executionTime
      });

      return {
        success: true,
        result: { success: true },
        selectorUsed,
        retryCount,
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || 'Unknown error';
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'smart_fill',
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
   * Enhanced login with smart element detection
   */
  public async enhancedLogin(sessionId: string, siteName: string, url?: string): Promise<BrowserActionResult> {
    const startTime = Date.now();
    
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const credentials = await CredentialService.getCredentials(siteName);
      if (!credentials) {
        throw new Error(`No credentials found for ${siteName}`);
      }

      // Navigate to login page if URL provided
      if (url) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
      }

      // Smart fill username
      const usernameResult = await this.smartFill(
        sessionId, 
        EnhancedBrowserService.SMART_SELECTORS.usernameField, 
        credentials.username,
        { timeout: 15000 }
      );

      if (!usernameResult.success) {
        throw new Error(`Failed to fill username: ${usernameResult.error}`);
      }

      // Smart fill password
      const passwordResult = await this.smartFill(
        sessionId, 
        EnhancedBrowserService.SMART_SELECTORS.passwordField, 
        credentials.password,
        { timeout: 10000 }
      );

      if (!passwordResult.success) {
        throw new Error(`Failed to fill password: ${passwordResult.error}`);
      }

      // Smart click sign in button
      const signInResult = await this.smartClick(
        sessionId, 
        EnhancedBrowserService.SMART_SELECTORS.signInButton,
        { timeout: 10000 }
      );

      if (!signInResult.success) {
        throw new Error(`Failed to click sign in: ${signInResult.error}`);
      }

      // Wait for navigation
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      // Mark credentials as used
      await CredentialService.markCredentialsUsed(siteName);

      const executionTime = Date.now() - startTime;
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'enhanced_login',
        targetUrl: page.url(),
        success: true,
        executionTimeMs: executionTime
      });

      return {
        success: true,
        result: {
          success: true,
          url: page.url(),
          title: await page.title()
        },
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || 'Unknown error';
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'enhanced_login',
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
    
    // Set up page event listeners for better debugging
    page.on('console', (msg) => {
      logger.debug(`[${sessionId}] Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', (err) => {
      logger.error(`[${sessionId}] Page error:`, err);
    });

    page.on('requestfailed', (request) => {
      logger.warn(`[${sessionId}] Request failed: ${request.url()}`);
    });

    this.contexts.set(sessionId, context);
    this.pages.set(sessionId, page);

    await CredentialService.logBrowserAction({
      sessionId,
      action: 'create_session',
      success: true,
      executionTimeMs: 0
    });

    logger.info(`Created enhanced browser session: ${sessionId}`);
    return sessionId;
  }

  /**
   * Navigate with enhanced error handling
   */
  public async navigate(sessionId: string, url: string): Promise<BrowserActionResult> {
    const startTime = Date.now();
    
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      const executionTime = Date.now() - startTime;
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'navigate',
        targetUrl: url,
        success: true,
        executionTimeMs: executionTime
      });

      return {
        success: true,
        result: {
          title: await page.title(),
          url: page.url()
        },
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || 'Unknown error';
      
      await CredentialService.logBrowserAction({
        sessionId,
        action: 'navigate',
        targetUrl: url,
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
   * Get page information
   */
  public async getPageInfo(sessionId: string): Promise<BrowserActionResult> {
    try {
      const page = this.pages.get(sessionId);
      if (!page) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const result = {
        title: await page.title(),
        url: page.url(),
        loaded: true
      };

      return {
        success: true,
        result,
        screenshot: await this.takeScreenshot(sessionId)
      };

    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }

  /**
   * Take a screenshot with enhanced path handling
   */
  public async takeScreenshot(sessionId: string): Promise<string> {
    try {
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
        fullPage: true,
        type: 'png'
      });

      this.screenshots.set(sessionId, filepath);
      return filepath;

    } catch (error: any) {
      logger.error(`Failed to take screenshot for session ${sessionId}:`, error);
      return '';
    }
  }

  /**
   * Close a session
   */
  public async closeSession(sessionId: string): Promise<void> {
    const context = this.contexts.get(sessionId);
    if (context) {
      await context.close();
      this.contexts.delete(sessionId);
    }

    this.pages.delete(sessionId);
    this.screenshots.delete(sessionId);

    await CredentialService.logBrowserAction({
      sessionId,
      action: 'close_session',
      success: true
    });

    logger.info(`Closed enhanced browser session: ${sessionId}`);
  }

  /**
   * Get smart selectors for common elements
   */
  public static getSmartSelector(name: string): SmartSelector | undefined {
    return EnhancedBrowserService.SMART_SELECTORS[name as keyof typeof EnhancedBrowserService.SMART_SELECTORS];
  }

  /**
   * Cleanup all resources
   */
  public async cleanup(): Promise<void> {
    logger.info('Cleaning up enhanced browser sessions...');
    
    for (const [sessionId, context] of this.contexts) {
      try {
        await context.close();
        logger.info(`Closed session: ${sessionId}`);
      } catch (error) {
        logger.error(`Failed to close session ${sessionId}:`, error);
      }
    }

    if (this.browser) {
      try {
        await this.browser.close();
        logger.info('Enhanced browser closed');
      } catch (error) {
        logger.error('Failed to close enhanced browser:', error);
      }
    }

    this.contexts.clear();
    this.pages.clear();
    this.screenshots.clear();
    
    this.isInitialized = false;
    this.initPromise = null;
    this.browser = null;
  }

  /**
   * Store credentials
   */
  public async storeCredentials(credentials: BrowserCredential): Promise<void> {
    return await CredentialService.storeCredentials(credentials);
  }

  /**
   * List credentials
   */
  public async listCredentials(): Promise<Omit<BrowserCredential, 'password'>[]> {
    return await CredentialService.listCredentials();
  }

  /**
   * Get browser logs
   */
  public async getBrowserLogs(sessionId?: string): Promise<BrowserAutomationLog[]> {
    return await CredentialService.getBrowserLogs(sessionId);
  }
}

// Export singleton instance
export const enhancedBrowserService = EnhancedBrowserService.getInstance();
