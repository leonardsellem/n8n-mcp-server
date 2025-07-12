/**
 * GitHub Configuration
 * 
 * Configuration for GitHub-based node caching and monitoring
 */

export interface GitHubConfig {
  token?: string;
  repository: string;
  branch: string;
  monitoring: {
    enabled: boolean;
    checkInterval: string; // cron expression
    paths: string[];
  };
  sync: {
    enabled: boolean;
    syncInterval: string; // cron expression
    localCachePath: string;
  };
}

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  token: process.env.GITHUB_TOKEN,
  repository: 'n8n-io/n8n',
  branch: 'master',
  monitoring: {
    enabled: !!process.env.GITHUB_TOKEN,
    checkInterval: '*/15 * * * *', // Every 15 minutes
    paths: [
      'packages/nodes-base/nodes',
      'packages/nodes-base/credentials',
      'packages/@n8n/n8n-nodes-langchain/nodes',
      'packages/@n8n/n8n-nodes-langchain/credentials'
    ]
  },
  sync: {
    enabled: !!process.env.GITHUB_TOKEN,
    syncInterval: '0 */6 * * *', // Every 6 hours
    localCachePath: './cache/github'
  }
};

/**
 * Get GitHub configuration with environment overrides
 */
export function getGitHubConfig(): GitHubConfig {
  return {
    ...DEFAULT_GITHUB_CONFIG,
    token: process.env.GITHUB_TOKEN,
    repository: process.env.GITHUB_REPOSITORY || DEFAULT_GITHUB_CONFIG.repository,
    branch: process.env.GITHUB_BRANCH || DEFAULT_GITHUB_CONFIG.branch,
    monitoring: {
      ...DEFAULT_GITHUB_CONFIG.monitoring,
      enabled: process.env.GITHUB_MONITORING_ENABLED === 'true' || (!!process.env.GITHUB_TOKEN && process.env.GITHUB_MONITORING_ENABLED !== 'false'),
      checkInterval: process.env.GITHUB_CHECK_INTERVAL || DEFAULT_GITHUB_CONFIG.monitoring.checkInterval
    },
    sync: {
      ...DEFAULT_GITHUB_CONFIG.sync,
      enabled: process.env.GITHUB_SYNC_ENABLED === 'true' || (!!process.env.GITHUB_TOKEN && process.env.GITHUB_SYNC_ENABLED !== 'false'),
      syncInterval: process.env.GITHUB_SYNC_INTERVAL || DEFAULT_GITHUB_CONFIG.sync.syncInterval,
      localCachePath: process.env.GITHUB_CACHE_PATH || DEFAULT_GITHUB_CONFIG.sync.localCachePath
    }
  };
}

/**
 * Check if GitHub integration is properly configured
 */
export function isGitHubConfigured(): boolean {
  const config = getGitHubConfig();
  return !!(config.token && config.repository);
}

/**
 * Get GitHub API rate limit status
 */
export async function getGitHubRateLimit(): Promise<{
  limit: number;
  remaining: number;
  reset: Date;
  used: number;
}> {
  const config = getGitHubConfig();
  
  if (!config.token) {
    throw new Error('GitHub token not configured');
  }
  
  const { Octokit } = await import('@octokit/rest');
  const octokit = new Octokit({ auth: config.token });
  
  const { data } = await octokit.rest.rateLimit.get();
  
  return {
    limit: data.rate.limit,
    remaining: data.rate.remaining,
    reset: new Date(data.rate.reset * 1000),
    used: data.rate.used
  };
}