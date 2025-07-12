import { existsSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export interface ServerConfig {
  // Database configuration
  database: {
    paths: string[];
    selectedPath?: string;
  };
  
  // Server configuration
  server: {
    name: string;
    version: string;
    mode: 'stdio' | 'http';
    port: number;
  };
  
  // Authentication
  auth: {
    token?: string;
    required: boolean;
  };
  
  // n8n API configuration
  n8n: {
    apiUrl?: string;
    apiKey?: string;
    configured: boolean;
  };
  
  // Feature flags
  features: {
    browserTools: boolean;
    visualVerification: boolean;
    managementTools: boolean;
    templates: boolean;
  };
  
  // Caching
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  
  // Logging
  logging: {
    level: string;
    debug: boolean;
  };
  
  // Performance
  performance: {
    maxToolsPerRequest: number;
    queryTimeout: number;
    connectionPoolSize: number;
  };
}

export class ConfigService {
  private static instance: ConfigService;
  private config: ServerConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfiguration(): ServerConfig {
    const config: ServerConfig = {
      database: {
        paths: [
          path.join(process.cwd(), 'data', 'nodes.db'),
          path.join(__dirname, '../../data', 'nodes.db'),
          './data/nodes.db'
        ]
      },
      server: {
        name: process.env.MCP_SERVER_NAME || 'n8n-documentation-mcp',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
        mode: (process.env.MCP_MODE as 'stdio' | 'http') || 'stdio',
        port: parseInt(process.env.PORT || '3000', 10)
      },
      auth: {
        token: process.env.AUTH_TOKEN,
        required: process.env.MCP_MODE === 'http'
      },
      n8n: {
        apiUrl: process.env.N8N_API_URL,
        apiKey: process.env.N8N_API_KEY,
        configured: !!(process.env.N8N_API_URL && process.env.N8N_API_KEY)
      },
      features: {
        browserTools: process.env.ENABLE_BROWSER_TOOLS !== 'false',
        visualVerification: process.env.ENABLE_VISUAL_VERIFICATION !== 'false',
        managementTools: !!(process.env.N8N_API_URL && process.env.N8N_API_KEY),
        templates: process.env.ENABLE_TEMPLATES !== 'false'
      },
      cache: {
        enabled: process.env.ENABLE_CACHE !== 'false',
        ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes
        maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10)
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        debug: process.env.DEBUG_MCP === 'true'
      },
      performance: {
        maxToolsPerRequest: parseInt(process.env.MAX_TOOLS_PER_REQUEST || '10', 10),
        queryTimeout: parseInt(process.env.QUERY_TIMEOUT || '30000', 10),
        connectionPoolSize: parseInt(process.env.CONNECTION_POOL_SIZE || '5', 10)
      }
    };

    // Find available database path
    config.database.selectedPath = this.findDatabasePath(config.database.paths);
    
    return config;
  }

  private findDatabasePath(paths: string[]): string | undefined {
    for (const dbPath of paths) {
      if (existsSync(dbPath)) {
        return dbPath;
      }
    }
    return undefined;
  }

  public getConfig(): ServerConfig {
    return { ...this.config };
  }

  public getDatabasePath(): string {
    if (!this.config.database.selectedPath) {
      throw new Error(
        `Database not found in any of the expected locations: ${this.config.database.paths.join(', ')}. ` +
        'Please run npm run rebuild first.'
      );
    }
    return this.config.database.selectedPath;
  }

  public isN8nConfigured(): boolean {
    return this.config.n8n.configured;
  }

  public getN8nConfig(): { apiUrl: string; apiKey: string } {
    if (!this.config.n8n.configured) {
      throw new Error('n8n API is not configured. Please set N8N_API_URL and N8N_API_KEY environment variables.');
    }
    return {
      apiUrl: this.config.n8n.apiUrl!,
      apiKey: this.config.n8n.apiKey!
    };
  }

  public isFeatureEnabled(feature: keyof ServerConfig['features']): boolean {
    return this.config.features[feature];
  }

  public getAuthToken(): string | undefined {
    return this.config.auth.token;
  }

  public isAuthRequired(): boolean {
    return this.config.auth.required;
  }

  public getServerMode(): 'stdio' | 'http' {
    return this.config.server.mode;
  }

  public getServerPort(): number {
    return this.config.server.port;
  }

  public getCacheConfig(): ServerConfig['cache'] {
    return { ...this.config.cache };
  }

  public getPerformanceConfig(): ServerConfig['performance'] {
    return { ...this.config.performance };
  }

  public validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate database
    if (!this.config.database.selectedPath) {
      errors.push('Database file not found');
    }

    // Validate n8n configuration if management tools are enabled
    if (this.config.features.managementTools && !this.config.n8n.configured) {
      errors.push('n8n API configuration required for management tools');
    }

    // Validate auth configuration in HTTP mode
    if (this.config.server.mode === 'http' && !this.config.auth.token) {
      errors.push('AUTH_TOKEN required for HTTP mode');
    }

    // Validate port
    if (this.config.server.port < 1 || this.config.server.port > 65535) {
      errors.push('Invalid port number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public logConfiguration(): void {
    const { apiKey, ...safeN8nConfig } = this.config.n8n;
    const { token, ...safeAuthConfig } = this.config.auth;
    
    logger.info('Server configuration loaded:', {
      database: {
        path: this.config.database.selectedPath,
        available: !!this.config.database.selectedPath
      },
      server: this.config.server,
      auth: {
        ...safeAuthConfig,
        tokenConfigured: !!token
      },
      n8n: {
        ...safeN8nConfig,
        apiKeyConfigured: !!apiKey
      },
      features: this.config.features,
      cache: this.config.cache,
      performance: this.config.performance
    });
  }
}