/**
 * Base Scraper Class
 * 
 * Abstract base class providing common scraping functionality,
 * error handling, retry logic, and rate limiting.
 */

import { 
  ScraperConfig, 
  ScrapingProgress, 
  ScrapingError, 
  ValidationResult 
} from './interfaces.js';
import { DEFAULT_SCRAPER_CONFIG, ERROR_CONFIG } from './config.js';

/**
 * Abstract base scraper with common functionality
 */
export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected progress: ScrapingProgress;
  protected errors: ScrapingError[] = [];
  protected startTime: Date;
  
  constructor(config?: Partial<ScraperConfig>) {
    this.config = { ...DEFAULT_SCRAPER_CONFIG, ...config };
    this.progress = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      startTime: new Date(),
      lastUpdate: new Date()
    };
    this.startTime = new Date();
  }

  /**
   * Abstract method that concrete scrapers must implement
   */
  abstract scrape(): Promise<any>;

  /**
   * Make a rate-limited HTTP request with retry logic
   */
  protected async makeRequest(url: string, retryCount = 0): Promise<string> {
    try {
      // Apply rate limiting
      await this.applyRateLimit();
      
      // Log the request
      this.log(`Requesting: ${url} (attempt ${retryCount + 1})`);
      
      const response = await fetch(url, {
        headers: this.config.headers,
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty response received');
      }

      this.log(`Successfully fetched ${url} (${content.length} chars)`);
      return content;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if we should retry
      if (retryCount < this.config.retries && this.shouldRetry(error)) {
        const delay = this.calculateRetryDelay(retryCount);
        this.log(`Request failed, retrying in ${delay}ms: ${errorMessage}`);
        
        await this.delay(delay);
        return this.makeRequest(url, retryCount + 1);
      }

      // Log the error and throw
      const scrapingError: ScrapingError = {
        url,
        nodeName: this.extractNodeNameFromUrl(url),
        error: errorMessage,
        timestamp: new Date(),
        retryCount
      };
      
      this.errors.push(scrapingError);
      this.progress.errors.push(scrapingError);
      this.progress.failed++;
      
      throw new Error(`Failed to fetch ${url} after ${retryCount + 1} attempts: ${errorMessage}`);
    }
  }

  /**
   * Apply rate limiting between requests
   */
  protected async applyRateLimit(): Promise<void> {
    await this.delay(this.config.rateLimit);
  }

  /**
   * Determine if an error should trigger a retry
   */
  protected shouldRetry(error: any): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Retry on network errors
    if (errorMessage.includes('ECONNRESET') || 
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('timeout')) {
      return true;
    }

    // Retry on server errors (5xx)
    if (errorMessage.includes('HTTP 5')) {
      return true;
    }

    // Retry on rate limiting (429)
    if (errorMessage.includes('HTTP 429')) {
      return true;
    }

    // Don't retry on client errors (4xx except 429)
    if (errorMessage.includes('HTTP 4')) {
      return false;
    }

    // Retry on other errors
    return true;
  }

  /**
   * Calculate exponential backoff delay
   */
  protected calculateRetryDelay(retryCount: number): number {
    const baseDelay = ERROR_CONFIG.retryDelayMs;
    const exponentialDelay = baseDelay * Math.pow(ERROR_CONFIG.exponentialBackoffBase, retryCount);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
  }

  /**
   * Simple delay utility
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract node name from URL for error reporting
   */
  protected extractNodeNameFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2] || 'unknown';
  }

  /**
   * Update progress tracking
   */
  protected updateProgress(completed?: number, total?: number): void {
    if (completed !== undefined) {
      this.progress.completed = completed;
    }
    if (total !== undefined) {
      this.progress.total = total;
    }
    this.progress.lastUpdate = new Date();
  }

  /**
   * Log message with timestamp
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.constructor.name}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Get current progress information
   */
  public getProgress(): ScrapingProgress {
    return { ...this.progress };
  }

  /**
   * Get accumulated errors
   */
  public getErrors(): ScrapingError[] {
    return [...this.errors];
  }

  /**
   * Get scraping statistics
   */
  public getStats() {
    const now = new Date();
    const duration = now.getTime() - this.startTime.getTime();
    
    return {
      duration,
      totalRequests: this.progress.completed + this.progress.failed,
      successRate: this.progress.completed / (this.progress.completed + this.progress.failed) || 0,
      errorRate: this.progress.failed / (this.progress.completed + this.progress.failed) || 0,
      averageTimePerRequest: duration / (this.progress.completed + this.progress.failed) || 0,
      errors: this.errors.length
    };
  }

  /**
   * Parse HTML content using basic string manipulation
   * (lightweight alternative to full DOM parsing)
   */
  protected parseHtml(html: string, selector: string): string[] {
    // Simple regex-based HTML parsing for basic selectors
    const results: string[] = [];
    
    try {
      // Handle basic tag selectors
      if (selector.match(/^[a-zA-Z]+$/)) {
        const tagRegex = new RegExp(`<${selector}[^>]*>(.*?)<\/${selector}>`, 'gis');
        const matches = html.match(tagRegex);
        if (matches) {
          matches.forEach(match => {
            const content = match.replace(/<[^>]*>/g, '').trim();
            if (content) results.push(content);
          });
        }
      }
      
      // Handle class selectors
      else if (selector.startsWith('.')) {
        const className = selector.substring(1);
        const classRegex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>(.*?)<\/`, 'gis');
        const matches = html.match(classRegex);
        if (matches) {
          matches.forEach(match => {
            const content = match.replace(/<[^>]*>/g, '').trim();
            if (content) results.push(content);
          });
        }
      }
      
      // Handle ID selectors
      else if (selector.startsWith('#')) {
        const id = selector.substring(1);
        const idRegex = new RegExp(`id="${id}"[^>]*>(.*?)<\/`, 'gis');
        const matches = html.match(idRegex);
        if (matches) {
          matches.forEach(match => {
            const content = match.replace(/<[^>]*>/g, '').trim();
            if (content) results.push(content);
          });
        }
      }
      
    } catch (error) {
      this.log(`Error parsing HTML with selector ${selector}: ${error}`, 'warn');
    }
    
    return results;
  }

  /**
   * Extract text content from HTML
   */
  protected extractTextContent(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
      .replace(/<style[^>]*>.*?<\/style>/gis, '')   // Remove styles
      .replace(/<[^>]*>/g, ' ')                     // Remove HTML tags
      .replace(/\s+/g, ' ')                         // Normalize whitespace
      .trim();
  }

  /**
   * Validate scraped data quality
   */
  protected validateData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check for required fields
    if (!data.name) {
      errors.push('Missing node name');
      score -= 20;
    }

    if (!data.displayName) {
      errors.push('Missing display name');
      score -= 15;
    }

    if (!data.description || data.description.length < 20) {
      errors.push('Missing or insufficient description');
      score -= 15;
    }

    if (!data.category) {
      errors.push('Missing category');
      score -= 10;
    }

    // Check data quality
    if (data.description && data.description.length < 50) {
      warnings.push('Short description');
      score -= 5;
    }

    if (!data.properties || data.properties.length === 0) {
      warnings.push('No properties defined');
      score -= 10;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Override in subclasses if needed
    this.log('Scraper cleanup completed');
  }
}