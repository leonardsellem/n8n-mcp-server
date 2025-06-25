/**
 * Enhanced Configuration Manager
 * Provides advanced configuration management for n8n MCP Server
 */

import { z } from 'zod';
import { EnvConfig } from './environment.js';

// Configuration schemas
const SecurityConfigSchema = z.object({
  enableRateLimit: z.boolean().default(true),
  maxRequestsPerMinute: z.number().default(60),
  enableInputValidation: z.boolean().default(true),
  allowedOrigins: z.array(z.string()).default(['*'])
});

const PerformanceConfigSchema = z.object({
  cacheEnabled: z.boolean().default(true),
  cacheTtl: z.number().default(300),
  requestTimeout: z.number().default(30000),
  maxConcurrentRequests: z.number().default(10)
});

const IntegrationConfigSchema = z.object({
  retryAttempts: z.number().default(3),
  retryDelay: z.number().default(1000),
  enableMetrics: z.boolean().default(true)
});

type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
type PerformanceConfig = z.infer<typeof PerformanceConfigSchema>;
type IntegrationConfig = z.infer<typeof IntegrationConfigSchema>;

export interface EnhancedConfig {
  security: SecurityConfig;
  performance: PerformanceConfig;
  integration: IntegrationConfig;
  environment: EnvConfig;
}

export class EnhancedConfigurationManager {
  private config: EnhancedConfig;

  constructor() {
    this.config = this.initializeConfig();
  }

  private initializeConfig(): EnhancedConfig {
    return {
      security: SecurityConfigSchema.parse({}),
      performance: PerformanceConfigSchema.parse({}),
      integration: IntegrationConfigSchema.parse({}),
      environment: {
        n8nApiUrl: process.env.N8N_API_URL || 'http://localhost:5678',
        n8nApiKey: process.env.N8N_API_KEY || '',
        debug: process.env.DEBUG === 'true'
      }
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): EnhancedConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<EnhancedConfig>): void {
    this.config = {
      ...this.config,
      ...updates
    };
  }

  /**
   * Validate configuration
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate environment
    if (!this.config.environment.n8nApiUrl) {
      errors.push('N8N_API_URL is required');
    }

    if (!this.config.environment.n8nApiKey) {
      errors.push('N8N_API_KEY is required');
    }

    // Validate security settings
    if (this.config.security.maxRequestsPerMinute <= 0) {
      errors.push('maxRequestsPerMinute must be positive');
    }

    // Validate performance settings
    if (this.config.performance.requestTimeout <= 0) {
      errors.push('requestTimeout must be positive');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get security configuration
   */
  getSecurityConfig(): SecurityConfig {
    return { ...this.config.security };
  }

  /**
   * Get performance configuration
   */
  getPerformanceConfig(): PerformanceConfig {
    return { ...this.config.performance };
  }

  /**
   * Get integration configuration
   */
  getIntegrationConfig(): IntegrationConfig {
    return { ...this.config.integration };
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugMode(): boolean {
    return this.config.environment.debug;
  }

  /**
   * Log configuration status
   */
  logConfigStatus(): void {
    const validation = this.validateConfiguration();
    
    if (validation.valid) {
      console.log('Configuration is valid');
    } else {
      console.error('Configuration errors:', validation.errors);
    }

    if (this.isDebugMode()) {
      console.log('Current configuration:', this.config);
    }
  }
}

export const enhancedConfig = new EnhancedConfigurationManager();
export default enhancedConfig;
