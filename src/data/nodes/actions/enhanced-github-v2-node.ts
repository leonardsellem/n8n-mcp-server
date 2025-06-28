import { NodeTypeInfo } from '../../node-types.js';

/**
 * Enhanced GitHub Node v2 - AI-Optimized Version
 * 
 * Improvements over original:
 * - Standardized resource locator patterns
 * - Clearer operation descriptions for AI agents
 * - Comprehensive error handling guidance
 * - Real-world workflow examples
 */
export const githubNodeEnhancedV2: NodeTypeInfo = {
  name: 'n8n-nodes-base.github',
  displayName: 'GitHub',
  description: 'Manage repositories, issues, pull requests, and workflows on GitHub. Automate code review processes, issue tracking, release management, and team collaboration.',
  category: 'Development',
  subcategory: 'Version Control',
  
  credentials: [
    {
      name: 'githubApi',
      required: true,
      types: ['personalAccessToken'],
      description: 'GitHub Personal Access Token with repository permissions',
      documentationUrl: 'https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token',
      displayOptions: {
        show: {
          authentication: ['accessToken']
        }
      }
    },
    {
      name: 'githubOAuth2Api',
      required: true,
      types: ['oauth2'],
      description: 'OAuth2 application for user-authorized actions',
      documentationUrl: 'https://docs.github.com/en/developers/apps/building-oauth-apps',
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    }
  ],

  properties: [
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'accessToken',
      description: 'Authentication method. Personal Access Token for automation, OAuth2 for user-specific actions.',
      options: [
        {
          name: 'Personal Access Token',
          value: 'accessToken',
          description: 'Use personal access token for automated operations'
        },
        {
          name: 'OAuth2',
          value: 'oAuth2',
          description: 'Use OAuth2 for user-authorized actions'
        }
      ]
    },
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'issue',
      description: 'GitHub resource type to work with. Issues for bug tracking, Repositories for code management.',
      options: [
        { 
          name: 'Issue', 
          value: 'issue', 
          description: 'Bug reports, feature requests, and task tracking' 
        },
        { 
          name: 'Pull Request', 
          value: 'pullRequest', 
          description: 'Code review, merging, and collaboration on changes' 
        },
        { 
          name: 'Repository', 
          value: 'repository', 
          description: 'Repository information, creation, and management' 
        },
        { 
          name: 'Release', 
          value: 'release', 
          description: 'Version releases, tags, and distribution packages' 
        },
        { 
          name: 'File', 
          value: 'file', 
          description: 'Repository files and content management' 
        },
        { 
          name: 'Workflow Run', 
          value: 'workflowRun', 
          description: 'GitHub Actions workflow execution and monitoring' 
        }
      ]
    },

    // STANDARDIZED REPOSITORY SELECTOR
    {
      name: 'repository',
      displayName: 'Repository',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'list', value: '' },
      description: 'Target repository. Select from list, enter URL, or provide repository ID.',
      displayOptions: {
        show: {
          resource: ['issue', 'pullRequest', 'release', 'file', 'workflowRun']
        }
      },
      modes: [
        {
          displayName: 'From List',
          name: 'list',
          type: 'list',
          placeholder: 'Select a repository',
          typeOptions: {
            searchListMethod: 'getRepositories',
            searchable: true
          }
        },
        {
          displayName: 'By URL',
          name: 'url',
          type: 'string',
          placeholder: 'https://github.com/owner/repository',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: '^https://github\\.com/[\\w.-]+/[\\w.-]+/?$',
                errorMessage: 'Please enter a valid GitHub repository URL'
              }
            }
          ]
        },
        {
          displayName: 'By Owner/Name',
          name: 'ownerRepo',
          type: 'string',
          placeholder: 'owner/repository-name',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: '^[\\w.-]+/[\\w.-]+$',
                errorMessage: 'Format: owner/repository-name'
              }
            }
          ]
        }
      ]
    },

    // ISSUE OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Issue operations. Create for new issues, Get for retrieving details, List for bulk operations.',
      displayOptions: {
        show: {
          resource: ['issue']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new issue with title, description, and labels',
          action: 'Create an issue'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Retrieve detailed information about a specific issue',
          action: 'Get an issue'
        },
        {
          name: 'List',
          value: 'getAll',
          description: 'Get multiple issues with filtering and pagination',
          action: 'List issues'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Modify existing issue properties (title, state, labels)',
          action: 'Update an issue'
        },
        {
          name: 'Add Comment',
          value: 'createComment',
          description: 'Add a comment to an existing issue',
          action: 'Comment on issue'
        },
        {
          name: 'Close',
          value: 'close',
          description: 'Close an open issue',
          action: 'Close an issue'
        }
      ]
    },

    // PULL REQUEST OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Pull request operations. Create for new PRs, Merge for completing reviews.',
      displayOptions: {
        show: {
          resource: ['pullRequest']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new pull request from branch to branch',
          action: 'Create a pull request'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get details about a specific pull request',
          action: 'Get a pull request'
        },
        {
          name: 'List',
          value: 'getAll',
          description: 'List pull requests with state and base branch filters',
          action: 'List pull requests'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update pull request title, description, or state',
          action: 'Update a pull request'
        },
        {
          name: 'Merge',
          value: 'merge',
          description: 'Merge an approved pull request',
          action: 'Merge a pull request'
        },
        {
          name: 'Request Review',
          value: 'requestReview',
          description: 'Request review from team members',
          action: 'Request PR review'
        }
      ]
    },

    // COMMON FIELDS
    {
      name: 'issueNumber',
      displayName: 'Issue Number',
      type: 'number',
      required: true,
      default: 1,
      placeholder: '123',
      description: 'Issue number (found in issue URL or listing)',
      displayOptions: {
        show: {
          resource: ['issue'],
          operation: ['get', 'update', 'createComment', 'close']
        }
      }
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: true,
      default: '',
      placeholder: 'Brief, descriptive title',
      description: 'Clear, concise title that summarizes the issue or request',
      displayOptions: {
        show: {
          resource: ['issue', 'pullRequest'],
          operation: ['create', 'update']
        }
      }
    },
    {
      name: 'body',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Detailed description with context, steps, and requirements. Supports markdown formatting.',
      typeOptions: {
        rows: 6
      },
      displayOptions: {
        show: {
          resource: ['issue', 'pullRequest'],
          operation: ['create', 'update']
        }
      }
    },
    {
      name: 'comment',
      displayName: 'Comment',
      type: 'string',
      required: true,
      default: '',
      description: 'Comment text to add to the issue. Supports markdown and @mentions.',
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: {
          resource: ['issue'],
          operation: ['createComment']
        }
      }
    },

    // PULL REQUEST SPECIFIC FIELDS
    {
      name: 'head',
      displayName: 'Head Branch',
      type: 'string',
      required: true,
      default: '',
      placeholder: 'feature/new-feature',
      description: 'Source branch containing the changes to merge',
      displayOptions: {
        show: {
          resource: ['pullRequest'],
          operation: ['create']
        }
      }
    },
    {
      name: 'base',
      displayName: 'Base Branch',
      type: 'string',
      required: true,
      default: 'main',
      placeholder: 'main',
      description: 'Target branch to merge changes into (usually main or develop)',
      displayOptions: {
        show: {
          resource: ['pullRequest'],
          operation: ['create']
        }
      }
    },

    // ADVANCED OPTIONS
    {
      name: 'additionalFields',
      displayName: 'Additional Fields',
      type: 'collection',
      required: false,
      default: {},
      placeholder: 'Add Field',
      description: 'Optional settings for enhanced functionality',
      displayOptions: {
        show: {
          resource: ['issue', 'pullRequest'],
          operation: ['create', 'update']
        }
      },
      options: [
        {
      name: 'labels',
      displayName: 'Labels',
      type: 'multiOptions',
      required: false,
      default: [],
          description: 'Categorize with labels (bug, enhancement, documentation, etc.)',
          typeOptions: {
            loadOptionsMethod: 'getLabels',
            loadOptionsDependsOn: ['repository']
    }
        },
        {
      name: 'assignees',
      displayName: 'Assignees',
      type: 'multiOptions',
      required: false,
      default: [],
          description: 'Team members responsible for this issue/PR',
          typeOptions: {
            loadOptionsMethod: 'getAssignees',
            loadOptionsDependsOn: ['repository']
    }
        },
        {
      name: 'milestone',
      displayName: 'Milestone',
      type: 'options',
      required: false,
      default: '',
          description: 'Project milestone or version this belongs to',
          typeOptions: {
            loadOptionsMethod: 'getMilestones',
            loadOptionsDependsOn: ['repository']
    }
        },
        {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'medium',
          description: 'Issue priority level for team triage',
          options: [
            { name: 'Low', value: 'low'
    },
            { name: 'Medium', value: 'medium' },
            { name: 'High', value: 'high' },
            { name: 'Critical', value: 'critical' }
          ]
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'GitHub API response with resource data and metadata'
    }
  ],

  regularNode: true,
  version: [1, 2, 3],
  defaults: {
    name: 'GitHub',
    color: '#24292e'
  },
  aliases: ['github', 'git', 'issue', 'pr', 'repository', 'version-control'],
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

  // COMPREHENSIVE WORKFLOW EXAMPLES
  examples: [
    {
      name: 'Create Bug Report',
      description: 'Create a properly formatted bug report issue',
      complexity: 'beginner',
      category: 'issue-tracking',
      useCase: 'Automated bug reporting from monitoring systems or user feedback',
      workflow: {
        nodes: [
          {
            name: 'Create Bug Issue',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'issue',
              operation: 'create',
              repository: {
                mode: 'ownerRepo',
                value: 'myorg/myproject'
              },
              title: 'Bug: Login fails with 500 error',
              body: '## Bug Description\n\nUsers cannot log in due to server error.\n\n## Steps to Reproduce\n1. Navigate to login page\n2. Enter valid credentials\n3. Click login button\n\n## Expected Behavior\nSuccessful login and redirect to dashboard\n\n## Actual Behavior\n500 Internal Server Error\n\n## Environment\n- Browser: Chrome 120.0\n- OS: Windows 11\n- Time: {{$now}}',
              additionalFields: {
                labels: ['bug', 'priority-high'],
                assignees: ['backend-team-lead'],
                priority: 'high'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Automated PR Creation',
      description: 'Create pull request from feature branch with proper formatting',
      complexity: 'intermediate',
      category: 'code-review',
      useCase: 'Automated PR creation after successful feature development or hotfixes',
      workflow: {
        nodes: [
          {
            name: 'Create Feature PR',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'pullRequest',
              operation: 'create',
              repository: {
                mode: 'url',
                value: 'https://github.com/myorg/myproject'
              },
              title: 'Feature: Add user profile settings',
              body: '## Changes\n\n- Added user profile settings page\n- Implemented avatar upload functionality\n- Added email notification preferences\n\n## Testing\n\n- [x] Unit tests passing\n- [x] Integration tests passing\n- [x] Manual testing completed\n\n## Screenshots\n\n![Profile Settings](url-to-screenshot)\n\n## Related Issues\n\nCloses #123\nReferences #456',
              head: 'feature/user-profile-settings',
              base: 'develop',
              additionalFields: {
                labels: ['feature', 'frontend'],
                assignees: ['code-reviewer'],
                milestone: 'v2.1.0'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Issue Status Monitoring',
      description: 'Monitor and respond to issue updates automatically',
      complexity: 'advanced',
      category: 'automation',
      useCase: 'Automated issue triage, status updates, and team notifications',
      workflow: {
        nodes: [
          {
            name: 'Get High Priority Issues',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'issue',
              operation: 'getAll',
              repository: {
                mode: 'list',
                value: 'repo-id-123'
              },
              filters: {
                state: 'open',
                labels: 'priority-high,bug',
                sort: 'created',
                direction: 'desc'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Release Management',
      description: 'Automated release creation with changelog generation',
      complexity: 'advanced',
      category: 'release-management',
      useCase: 'Automated release publishing with proper versioning and documentation',
      workflow: {
        nodes: [
          {
            name: 'Create Release',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'release',
              operation: 'create',
              repository: {
                mode: 'ownerRepo',
                value: 'myorg/myproject'
              },
              tag_name: 'v{{$json["version"]}}',
              name: 'Release v{{$json["version"]}}',
              body: '## What\'s New\n\n{{$json["changelog"]}}\n\n## Installation\n\n```bash\nnpm install myproject@{{$json["version"]}}\n```',
              draft: false,
              prerelease: false
            }
          }
        ]
      }
    }
  ],

  // AI METADATA
  aiMetadata: {
    aiOptimized: true,
    rateLimits: {
      requests: 5000,
      window: 'hour',
      unit: 'requests per hour (varies by endpoint)'
    },
    commonPatterns: [
      'issue-tracking',
      'code-review-automation',
      'release-management',
      'repository-monitoring',
      'team-collaboration',
      'ci-cd-integration'
    ],
    integrationComplexity: 'medium',
    prerequisites: [
      'GitHub repository access',
      'Personal access token with appropriate scopes',
      'Repository permissions for target operations',
      'Understanding of Git workflow (branches, PRs, releases)'
    ],
    errorHandling: {
      retryableErrors: ['rate_limited', 'server_error', 'timeout'],
      nonRetryableErrors: ['invalid_credentials', 'not_found', 'forbidden', 'validation_failed'],
      documentation: 'https://docs.github.com/en/rest/overview/resources-in-the-rest-api#client-errors'
    }
  },

  usageNotes: 'For AI agents: Repository can be specified as owner/repo, full URL, or selected from list. Issue/PR numbers are required for specific operations and can be found in URLs or API responses. Always include meaningful titles and descriptions for better project management.',

  integrationGuide: 'Workflow patterns: 1) Create issues from monitoring alerts, 2) Auto-create PRs from feature branches, 3) Update issue status based on deployment success, 4) Generate releases from successful CI/CD runs. Use webhooks for real-time GitHub → n8n integration.'
};

export default githubNodeEnhancedV2;