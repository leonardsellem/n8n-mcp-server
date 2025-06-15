/**
 * Base Adaptive Learning Tool Handler
 *
 * This module provides a base handler for adaptive learning tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for usage analytics data
 */
export interface UsageAnalytics {
  timestamp: string;
  action: string;
  tool_name?: string;
  workflow_id?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Interface for AI patterns data
 */
export interface AIPatterns {
  frequently_used_tools: string[];
  preferred_workflow_types: string[];
  success_patterns: Record<string, any>;
  optimization_preferences: Record<string, any>;
  error_patterns: Record<string, any>;
  last_updated: string;
}

/**
 * Base class for adaptive learning tool handlers
 */
export abstract class BaseAdaptiveLearningHandler {
  protected apiService: EnhancedN8nApiClient;
  private analyticsFile: string;
  private patternsFile: string;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'adaptive-learning');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.analyticsFile = path.join(dataDir, 'usage-analytics.json');
    this.patternsFile = path.join(dataDir, 'ai-patterns.json');
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Load usage analytics from storage
   */
  protected loadUsageAnalytics(): UsageAnalytics[] {
    try {
      if (fs.existsSync(this.analyticsFile)) {
        const data = fs.readFileSync(this.analyticsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading usage analytics:', error);
    }
    return [];
  }
  
  /**
   * Save usage analytics to storage
   */
  protected saveUsageAnalytics(analytics: UsageAnalytics[]): void {
    try {
      fs.writeFileSync(this.analyticsFile, JSON.stringify(analytics, null, 2));
    } catch (error) {
      console.error('Error saving usage analytics:', error);
    }
  }
  
  /**
   * Load AI patterns from storage
   */
  protected loadAIPatterns(): AIPatterns {
    try {
      if (fs.existsSync(this.patternsFile)) {
        const data = fs.readFileSync(this.patternsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading AI patterns:', error);
    }
    
    // Return default patterns
    return {
      frequently_used_tools: [],
      preferred_workflow_types: [],
      success_patterns: {},
      optimization_preferences: {},
      error_patterns: {},
      last_updated: new Date().toISOString()
    };
  }
  
  /**
   * Save AI patterns to storage
   */
  protected saveAIPatterns(patterns: AIPatterns): void {
    try {
      patterns.last_updated = new Date().toISOString();
      fs.writeFileSync(this.patternsFile, JSON.stringify(patterns, null, 2));
    } catch (error) {
      console.error('Error saving AI patterns:', error);
    }
  }
  
  /**
   * Add usage record
   */
  protected addUsageRecord(record: UsageAnalytics): void {
    const analytics = this.loadUsageAnalytics();
    analytics.push({
      ...record,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 records to prevent unlimited growth
    if (analytics.length > 1000) {
      analytics.splice(0, analytics.length - 1000);
    }
    
    this.saveUsageAnalytics(analytics);
  }
  
  /**
   * Analyze usage patterns and update AI patterns
   */
  protected updateAIPatterns(): void {
    const analytics = this.loadUsageAnalytics();
    const patterns = this.loadAIPatterns();
    
    // Analyze tool usage frequency
    const toolUsage: Record<string, number> = {};
    analytics.forEach(record => {
      if (record.tool_name) {
        toolUsage[record.tool_name] = (toolUsage[record.tool_name] || 0) + 1;
      }
    });
    
    // Update frequently used tools
    patterns.frequently_used_tools = Object.entries(toolUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tool]) => tool);
    
    // Analyze success patterns
    const successfulActions = analytics.filter(record => 
      record.context?.success === true
    );
    
    if (successfulActions.length > 0) {
      patterns.success_patterns = {
        average_execution_time: successfulActions.reduce((sum, record) => 
          sum + (record.context?.execution_time || 0), 0) / successfulActions.length,
        common_tags: this.getMostCommonTags(successfulActions),
        preferred_complexity: this.getPreferredComplexity(successfulActions)
      };
    }
    
    this.saveAIPatterns(patterns);
  }
  
  /**
   * Get most common tags from successful actions
   */
  private getMostCommonTags(actions: UsageAnalytics[]): string[] {
    const tagCounts: Record<string, number> = {};
    
    actions.forEach(action => {
      if (action.context?.tags) {
        action.context.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  }
  
  /**
   * Get preferred complexity from successful actions
   */
  private getPreferredComplexity(actions: UsageAnalytics[]): string {
    const complexityScores = actions
      .map(action => action.context?.complexity_score)
      .filter(score => typeof score === 'number');
    
    if (complexityScores.length === 0) return 'intermediate';
    
    const average = complexityScores.reduce((sum, score) => sum + score, 0) / complexityScores.length;
    
    if (average < 3) return 'simple';
    if (average < 7) return 'intermediate';
    return 'advanced';
  }
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    const formattedData = typeof data === 'object' 
      ? JSON.stringify(data, null, 2)
      : String(data);
      
    return {
      content: [
        {
          type: 'text',
          text: message ? `${message}\n\n${formattedData}` : formattedData,
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing adaptive learning tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   *
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }
}