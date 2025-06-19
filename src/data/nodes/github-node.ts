import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const githubNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.github',
  displayName: 'GitHub',
  description: 'Use the GitHub node to automate work in GitHub, and integrate GitHub with other applications. n8n has built-in support for a wide range of GitHub features, including creating, updating, deleting, and editing files, repositories, issues, releases, and users.',
  category: 'Development',
  subcategory: 'Version Control',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'file',
      description: 'The resource to operate on',
      options: [
        { name: 'File', value: 'file', description: 'Work with repository files' },
        { name: 'Issue', value: 'issue', description: 'Manage GitHub issues' },
        { name: 'Organization', value: 'organization', description: 'Work with GitHub organizations' },
        { name: 'Release', value: 'release', description: 'Manage repository releases' },
        { name: 'Repository', value: 'repository', description: 'Work with repositories' },
        { name: 'Review', value: 'review', description: 'Manage pull request reviews' },
        { name: 'User', value: 'user', description: 'Work with GitHub users' },
        { name: 'Workflow', value: 'workflow', description: 'Manage GitHub Actions workflows' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        // File operations
        { name: 'Create', value: 'create', description: 'Create a new file' },
        { name: 'Delete', value: 'delete', description: 'Delete a file' },
        { name: 'Edit', value: 'edit', description: 'Edit an existing file' },
        { name: 'Get', value: 'get', description: 'Get a file' },
        { name: 'List', value: 'list', description: 'List files in a directory' },
        // Issue operations
        { name: 'Create Comment', value: 'createComment', description: 'Create a comment on an issue' },
        { name: 'Lock', value: 'lock', description: 'Lock an issue' },
        // Organization operations
        { name: 'Get Repositories', value: 'getRepositories', description: 'Get repositories from an organization' },
        // Release operations
        { name: 'Get Many', value: 'getAll', description: 'Get multiple releases' },
        { name: 'Update', value: 'update', description: 'Update a release' },
        // Repository operations
        { name: 'Get Issues', value: 'getIssues', description: 'Get issues from a repository' },
        { name: 'Get License', value: 'getLicense', description: 'Get repository license' },
        { name: 'Get Profile', value: 'getProfile', description: 'Get repository profile' },
        { name: 'Get Pull Requests', value: 'getPullRequests', description: 'Get pull requests from a repository' },
        { name: 'List Popular Paths', value: 'listPopularPaths', description: 'List popular repository paths' },
        { name: 'List Referrers', value: 'listReferrers', description: 'List repository referrers' },
        // Review operations
        // User operations
        { name: 'Invite', value: 'invite', description: 'Invite a user to a repository' },
        // Workflow operations
        { name: 'Disable', value: 'disable', description: 'Disable a workflow' },
        { name: 'Dispatch', value: 'dispatch', description: 'Dispatch a workflow event' },
        { name: 'Enable', value: 'enable', description: 'Enable a workflow' },
        { name: 'Get Usage', value: 'getUsage', description: 'Get workflow usage statistics' }
      ]
    },
    {
      name: 'owner',
      displayName: 'Repository Owner',
      type: 'string',
      required: false,
      default: '',
      description: 'Owner of the repository (username or organization name)'
    },
    {
      name: 'repository',
      displayName: 'Repository Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the repository'
    },
    {
      name: 'filePath',
      displayName: 'File Path',
      type: 'string',
      required: false,
      default: '',
      description: 'Path to the file in the repository'
    },
    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the file'
    },
    {
      name: 'commitMessage',
      displayName: 'Commit Message',
      type: 'string',
      required: false,
      default: '',
      description: 'Commit message for file operations'
    },
    {
      name: 'branch',
      displayName: 'Branch',
      type: 'string',
      required: false,
      default: 'main',
      description: 'Branch to work with'
    },
    {
      name: 'issueNumber',
      displayName: 'Issue Number',
      type: 'number',
      required: false,
      default: 1,
      description: 'Issue number to operate on'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for issues, releases, or other resources'
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'Body content for issues, comments, or releases'
    },
    {
      name: 'state',
      displayName: 'State',
      type: 'options',
      required: false,
      default: 'open',
      description: 'State filter for issues or pull requests',
      options: [
        { name: 'Open', value: 'open', description: 'Open items' },
        { name: 'Closed', value: 'closed', description: 'Closed items' },
        { name: 'All', value: 'all', description: 'All items' }
      ]
    },
    {
      name: 'labels',
      displayName: 'Labels',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of labels'
    },
    {
      name: 'assignees',
      displayName: 'Assignees',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of assignees'
    },
    {
      name: 'milestone',
      displayName: 'Milestone',
      type: 'string',
      required: false,
      default: '',
      description: 'Milestone number or title'
    },
    {
      name: 'releaseId',
      displayName: 'Release ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the release to operate on'
    },
    {
      name: 'tagName',
      displayName: 'Tag Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Tag name for releases'
    },
    {
      name: 'draft',
      displayName: 'Draft',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the release is a draft'
    },
    {
      name: 'prerelease',
      displayName: 'Prerelease',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the release is a prerelease'
    },
    {
      name: 'workflowId',
      displayName: 'Workflow ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID or filename of the workflow'
    },
    {
      name: 'ref',
      displayName: 'Reference',
      type: 'string',
      required: false,
      default: '',
      description: 'Git reference (branch or tag) for workflow dispatch'
    },
    {
      name: 'inputs',
      displayName: 'Inputs',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object of inputs for workflow dispatch'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 30,
      description: 'Maximum number of results to return'
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
      description: 'The processed GitHub data'
    }
  ],
  credentials: ['githubApi', 'githubOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create File',
      description: 'Create a new file in a GitHub repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'file',
              operation: 'create',
              owner: 'myusername',
              repository: 'myrepo',
              filePath: 'README.md',
              fileContent: '# My Project\n\nThis is a test file created with n8n.',
              commitMessage: 'Add README.md via n8n'
            }
          }
        ]
      }
    },
    {
      name: 'Create Issue',
      description: 'Create a new issue in a GitHub repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'issue',
              operation: 'create',
              owner: 'myusername',
              repository: 'myrepo',
              title: 'Bug Report',
              body: 'Found a bug in the application...',
              labels: 'bug,high-priority'
            }
          }
        ]
      }
    },
    {
      name: 'Get Repository Issues',
      description: 'Get all open issues from a repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'repository',
              operation: 'getIssues',
              owner: 'myusername',
              repository: 'myrepo',
              state: 'open',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Create Release',
      description: 'Create a new release for a repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'release',
              operation: 'create',
              owner: 'myusername',
              repository: 'myrepo',
              tagName: 'v1.0.0',
              title: 'Version 1.0.0',
              body: 'First stable release of the project',
              draft: false,
              prerelease: false
            }
          }
        ]
      }
    },
    {
      name: 'Trigger Workflow',
      description: 'Dispatch a GitHub Actions workflow',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'workflow',
              operation: 'dispatch',
              owner: 'myusername',
              repository: 'myrepo',
              workflowId: 'deploy.yml',
              ref: 'main',
              inputs: '{"environment": "production"}'
            }
          }
        ]
      }
    }
  ]
};

export const githubTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.githubTrigger',
  displayName: 'GitHub Trigger',
  description: 'Triggers the workflow when GitHub events occur, such as push, pull request, issues, and more. Supports webhooks for real-time event handling.',
  category: 'Development',
  subcategory: 'Version Control',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['push'],
      description: 'The GitHub events to trigger on',
      options: [
        { name: 'Branch or Tag Created', value: 'create', description: 'Triggered when a branch or tag is created' },
        { name: 'Branch or Tag Deleted', value: 'delete', description: 'Triggered when a branch or tag is deleted' },
        { name: 'Issue Opened/Edited/Closed', value: 'issues', description: 'Triggered when an issue is opened, edited, or closed' },
        { name: 'Issue Comment', value: 'issue_comment', description: 'Triggered when an issue comment is created, edited, or deleted' },
        { name: 'Pull Request', value: 'pull_request', description: 'Triggered when a pull request is opened, closed, or synchronized' },
        { name: 'Pull Request Review', value: 'pull_request_review', description: 'Triggered when a pull request review is submitted' },
        { name: 'Push', value: 'push', description: 'Triggered when commits are pushed to a repository' },
        { name: 'Release', value: 'release', description: 'Triggered when a release is published' },
        { name: 'Star', value: 'star', description: 'Triggered when a repository is starred or unstarred' },
        { name: 'Watch', value: 'watch', description: 'Triggered when a user starts watching a repository' }
      ]
    },
    {
      name: 'owner',
      displayName: 'Repository Owner',
      type: 'string',
      required: true,
      default: '',
      description: 'Owner of the repository (username or organization name)'
    },
    {
      name: 'repository',
      displayName: 'Repository Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the repository to monitor'
    },
    {
      name: 'contentType',
      displayName: 'Content Type',
      type: 'options',
      required: false,
      default: 'json',
      description: 'Content type of the webhook payload',
      options: [
        { name: 'JSON', value: 'json', description: 'application/json' },
        { name: 'Form', value: 'form', description: 'application/x-www-form-urlencoded' }
      ]
    },
    {
      name: 'secret',
      displayName: 'Secret',
      type: 'string',
      required: false,
      default: '',
      description: 'Secret token to validate webhook payloads'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when GitHub events occur'
    }
  ],
  credentials: ['githubApi', 'githubOAuth2Api'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Push Events',
      description: 'Trigger workflow when code is pushed to a repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub Trigger',
            type: 'n8n-nodes-base.githubTrigger',
            parameters: {
              events: ['push'],
              owner: 'myusername',
              repository: 'myrepo',
              contentType: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Pull Requests',
      description: 'Trigger when pull requests are opened or updated',
      workflow: {
        nodes: [
          {
            name: 'GitHub Trigger',
            type: 'n8n-nodes-base.githubTrigger',
            parameters: {
              events: ['pull_request'],
              owner: 'myusername',
              repository: 'myrepo',
              contentType: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Issues',
      description: 'Trigger when issues are created or updated',
      workflow: {
        nodes: [
          {
            name: 'GitHub Trigger',
            type: 'n8n-nodes-base.githubTrigger',
            parameters: {
              events: ['issues', 'issue_comment'],
              owner: 'myusername',
              repository: 'myrepo',
              contentType: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Releases',
      description: 'Trigger when new releases are published',
      workflow: {
        nodes: [
          {
            name: 'GitHub Trigger',
            type: 'n8n-nodes-base.githubTrigger',
            parameters: {
              events: ['release'],
              owner: 'myusername',
              repository: 'myrepo',
              contentType: 'json'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const githubNodes: NodeTypeInfo[] = [githubNode, githubTriggerNode];

// Export individual actions for the regular GitHub node
export const githubActions = [
  // File actions
  'create_file',
  'delete_file',
  'edit_file',
  'get_file',
  'list_files',
  // Issue actions
  'create_issue',
  'create_issue_comment',
  'edit_issue',
  'get_issue',
  'lock_issue',
  'get_many_issues',
  // Organization actions
  'get_organization_repositories',
  // Release actions
  'create_release',
  'delete_release',
  'get_release',
  'get_many_releases',
  'update_release',
  // Repository actions
  'get_repository',
  'get_repository_issues',
  'get_repository_license',
  'get_repository_profile',
  'get_repository_pull_requests',
  'list_repository_popular_paths',
  'list_repository_referrers',
  // Review actions
  'create_review',
  'get_review',
  'get_many_reviews',
  'update_review',
  // User actions
  'get_user_repositories',
  'invite_user',
  // Workflow actions
  'disable_workflow',
  'dispatch_workflow',
  'enable_workflow',
  'get_workflow',
  'get_workflow_usage',
  'list_workflows'
];

// Export trigger events
export const githubTriggers = [
  'branch_or_tag_created',
  'branch_or_tag_deleted',
  'issue_opened_edited_closed',
  'issue_comment',
  'pull_request',
  'pull_request_review',
  'push',
  'release',
  'star',
  'watch'
];