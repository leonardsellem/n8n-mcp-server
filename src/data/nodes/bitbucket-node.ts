import { NodeTypeInfo } from '../node-types.js';

export const bitbucketNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bitbucket',
  displayName: 'Bitbucket',
  description: 'Use the Bitbucket node to automate work in Bitbucket, and integrate Bitbucket with other applications. n8n has built-in support for a wide range of Bitbucket features, including creating, updating, deleting, and editing files, repositories, issues, and pull requests.',
  category: 'Development',
  subcategory: 'Version Control',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'repository',
      description: 'The resource to operate on',
      options: [
        { name: 'File', value: 'file', description: 'Work with repository files' },
        { name: 'Issue', value: 'issue', description: 'Manage Bitbucket issues' },
        { name: 'Pull Request', value: 'pullRequest', description: 'Manage pull requests' },
        { name: 'Repository', value: 'repository', description: 'Work with repositories' },
        { name: 'User', value: 'user', description: 'Work with Bitbucket users' },
        { name: 'Webhook', value: 'webhook', description: 'Manage repository webhooks' }
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
        { name: 'Get All', value: 'getAll', description: 'Get all issues' },
        { name: 'Update', value: 'update', description: 'Update an issue' },
        // Pull Request operations
        { name: 'Create Comment', value: 'createComment', description: 'Create a comment on a pull request' },
        { name: 'Decline', value: 'decline', description: 'Decline a pull request' },
        { name: 'Get All', value: 'getAll', description: 'Get all pull requests' },
        { name: 'Merge', value: 'merge', description: 'Merge a pull request' },
        { name: 'Update', value: 'update', description: 'Update a pull request' },
        // Repository operations
        { name: 'Get Issues', value: 'getIssues', description: 'Get issues from a repository' },
        { name: 'Get Pull Requests', value: 'getPullRequests', description: 'Get pull requests from a repository' },
        { name: 'List', value: 'list', description: 'List repositories' },
        // User operations
        { name: 'Get Repositories', value: 'getRepositories', description: 'Get repositories of a user' },
        // Webhook operations
        { name: 'Create', value: 'create', description: 'Create a webhook' },
        { name: 'Delete', value: 'delete', description: 'Delete a webhook' },
        { name: 'Get All', value: 'getAll', description: 'Get all webhooks' }
      ]
    },
    {
      name: 'workspace',
      displayName: 'Workspace',
      type: 'string',
      required: false,
      default: '',
      description: 'The workspace name (username or team name)'
    },
    {
      name: 'repositorySlug',
      displayName: 'Repository Slug',
      type: 'string',
      required: false,
      default: '',
      description: 'The repository slug (name)'
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
      name: 'issueId',
      displayName: 'Issue ID',
      type: 'number',
      required: false,
      default: 1,
      description: 'Issue ID to operate on'
    },
    {
      name: 'pullRequestId',
      displayName: 'Pull Request ID',
      type: 'number',
      required: false,
      default: 1,
      description: 'Pull Request ID to operate on'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for issues, pull requests, or other resources'
    },
    {
      name: 'content',
      displayName: 'Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content for issues, comments, or pull requests'
    },
    {
      name: 'state',
      displayName: 'State',
      type: 'options',
      required: false,
      default: 'OPEN',
      description: 'State filter for issues or pull requests',
      options: [
        { name: 'Open', value: 'OPEN', description: 'Open items' },
        { name: 'Resolved', value: 'RESOLVED', description: 'Resolved items' },
        { name: 'Closed', value: 'CLOSED', description: 'Closed items' },
        { name: 'New', value: 'NEW', description: 'New items' },
        { name: 'On Hold', value: 'ON_HOLD', description: 'Items on hold' },
        { name: 'Invalid', value: 'INVALID', description: 'Invalid items' },
        { name: 'Duplicate', value: 'DUPLICATE', description: 'Duplicate items' },
        { name: 'Wontfix', value: 'WONTFIX', description: 'Items that won\'t be fixed' }
      ]
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'major',
      description: 'Priority for issues',
      options: [
        { name: 'Trivial', value: 'trivial', description: 'Trivial priority' },
        { name: 'Minor', value: 'minor', description: 'Minor priority' },
        { name: 'Major', value: 'major', description: 'Major priority' },
        { name: 'Critical', value: 'critical', description: 'Critical priority' },
        { name: 'Blocker', value: 'blocker', description: 'Blocker priority' }
      ]
    },
    {
      name: 'kind',
      displayName: 'Kind',
      type: 'options',
      required: false,
      default: 'bug',
      description: 'Kind of issue',
      options: [
        { name: 'Bug', value: 'bug', description: 'Bug report' },
        { name: 'Enhancement', value: 'enhancement', description: 'Enhancement request' },
        { name: 'Proposal', value: 'proposal', description: 'Proposal' },
        { name: 'Task', value: 'task', description: 'Task' }
      ]
    },
    {
      name: 'assignee',
      displayName: 'Assignee',
      type: 'string',
      required: false,
      default: '',
      description: 'Username of the assignee'
    },
    {
      name: 'responsible',
      displayName: 'Responsible',
      type: 'string',
      required: false,
      default: '',
      description: 'Username of the responsible person'
    },
    {
      name: 'component',
      displayName: 'Component',
      type: 'string',
      required: false,
      default: '',
      description: 'Component name for the issue'
    },
    {
      name: 'milestone',
      displayName: 'Milestone',
      type: 'string',
      required: false,
      default: '',
      description: 'Milestone name'
    },
    {
      name: 'version',
      displayName: 'Version',
      type: 'string',
      required: false,
      default: '',
      description: 'Version name'
    },
    {
      name: 'sourceBranch',
      displayName: 'Source Branch',
      type: 'string',
      required: false,
      default: '',
      description: 'Source branch for pull requests'
    },
    {
      name: 'destinationBranch',
      displayName: 'Destination Branch',
      type: 'string',
      required: false,
      default: 'main',
      description: 'Destination branch for pull requests'
    },
    {
      name: 'closeSourceBranch',
      displayName: 'Close Source Branch',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to close the source branch after merge'
    },
    {
      name: 'reviewers',
      displayName: 'Reviewers',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of reviewer usernames'
    },
    {
      name: 'webhookUrl',
      displayName: 'Webhook URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL for webhook notifications'
    },
    {
      name: 'webhookEvents',
      displayName: 'Webhook Events',
      type: 'multiOptions',
      required: false,
      default: ['repo:push'],
      description: 'Events to trigger webhook',
      options: [
        { name: 'Repository Push', value: 'repo:push', description: 'Triggered when commits are pushed' },
        { name: 'Repository Fork', value: 'repo:fork', description: 'Triggered when repository is forked' },
        { name: 'Repository Updated', value: 'repo:updated', description: 'Triggered when repository is updated' },
        { name: 'Issue Created', value: 'issue:created', description: 'Triggered when issue is created' },
        { name: 'Issue Updated', value: 'issue:updated', description: 'Triggered when issue is updated' },
        { name: 'Issue Comment Created', value: 'issue:comment_created', description: 'Triggered when issue comment is created' },
        { name: 'Pull Request Created', value: 'pullrequest:created', description: 'Triggered when pull request is created' },
        { name: 'Pull Request Updated', value: 'pullrequest:updated', description: 'Triggered when pull request is updated' },
        { name: 'Pull Request Approved', value: 'pullrequest:approved', description: 'Triggered when pull request is approved' },
        { name: 'Pull Request Merged', value: 'pullrequest:fulfilled', description: 'Triggered when pull request is merged' },
        { name: 'Pull Request Declined', value: 'pullrequest:rejected', description: 'Triggered when pull request is declined' }
      ]
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 30,
      description: 'Maximum number of results to return'
    },
    {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
      description: 'Page number for pagination'
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
      description: 'The processed Bitbucket data'
    }
  ],
  credentials: ['bitbucketApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create File',
      description: 'Create a new file in a Bitbucket repository',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket',
            type: 'n8n-nodes-base.bitbucket',
            parameters: {
              resource: 'file',
              operation: 'create',
              workspace: 'myworkspace',
              repositorySlug: 'myrepo',
              filePath: 'README.md',
              fileContent: '# My Project\n\nThis is a test file created with n8n.',
              commitMessage: 'Add README.md via n8n',
              branch: 'main'
            }
          }
        ]
      }
    },
    {
      name: 'Create Issue',
      description: 'Create a new issue in a Bitbucket repository',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket',
            type: 'n8n-nodes-base.bitbucket',
            parameters: {
              resource: 'issue',
              operation: 'create',
              workspace: 'myworkspace',
              repositorySlug: 'myrepo',
              title: 'Bug Report',
              content: 'Found a bug in the application...',
              kind: 'bug',
              priority: 'major'
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
            name: 'Bitbucket',
            type: 'n8n-nodes-base.bitbucket',
            parameters: {
              resource: 'repository',
              operation: 'getIssues',
              workspace: 'myworkspace',
              repositorySlug: 'myrepo',
              state: 'OPEN',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Create Pull Request',
      description: 'Create a new pull request in a Bitbucket repository',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket',
            type: 'n8n-nodes-base.bitbucket',
            parameters: {
              resource: 'pullRequest',
              operation: 'create',
              workspace: 'myworkspace',
              repositorySlug: 'myrepo',
              title: 'Feature: Add new functionality',
              content: 'This pull request adds new functionality to the application',
              sourceBranch: 'feature/new-functionality',
              destinationBranch: 'main',
              closeSourceBranch: true
            }
          }
        ]
      }
    },
    {
      name: 'Create Webhook',
      description: 'Create a webhook for repository events',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket',
            type: 'n8n-nodes-base.bitbucket',
            parameters: {
              resource: 'webhook',
              operation: 'create',
              workspace: 'myworkspace',
              repositorySlug: 'myrepo',
              webhookUrl: 'https://my-webhook-endpoint.com/bitbucket',
              webhookEvents: ['repo:push', 'pullrequest:created', 'issue:created']
            }
          }
        ]
      }
    }
  ]
};

export const bitbucketTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bitbucketTrigger',
  displayName: 'Bitbucket Trigger',
  description: 'Triggers the workflow when Bitbucket events occur, such as push, pull request, issues, and more. Supports webhooks for real-time event handling. Bitbucket is a web-based version control repository hosting service owned by Atlassian.',
  category: 'Development',
  subcategory: 'Version Control',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['repo:push'],
      description: 'The Bitbucket events to trigger on',
      options: [
        { name: 'Repository Push', value: 'repo:push', description: 'Triggered when commits are pushed to a repository' },
        { name: 'Repository Fork', value: 'repo:fork', description: 'Triggered when a repository is forked' },
        { name: 'Repository Updated', value: 'repo:updated', description: 'Triggered when repository settings are updated' },
        { name: 'Repository Transfer', value: 'repo:transfer', description: 'Triggered when repository ownership is transferred' },
        { name: 'Issue Created', value: 'issue:created', description: 'Triggered when an issue is created' },
        { name: 'Issue Updated', value: 'issue:updated', description: 'Triggered when an issue is updated' },
        { name: 'Issue Comment Created', value: 'issue:comment_created', description: 'Triggered when a comment is added to an issue' },
        { name: 'Pull Request Created', value: 'pullrequest:created', description: 'Triggered when a pull request is created' },
        { name: 'Pull Request Updated', value: 'pullrequest:updated', description: 'Triggered when a pull request is updated' },
        { name: 'Pull Request Approved', value: 'pullrequest:approved', description: 'Triggered when a pull request is approved' },
        { name: 'Pull Request Merged', value: 'pullrequest:fulfilled', description: 'Triggered when a pull request is merged' },
        { name: 'Pull Request Declined', value: 'pullrequest:rejected', description: 'Triggered when a pull request is declined' },
        { name: 'Pull Request Comment Created', value: 'pullrequest:comment_created', description: 'Triggered when a comment is added to a pull request' },
        { name: 'Pull Request Comment Updated', value: 'pullrequest:comment_updated', description: 'Triggered when a pull request comment is updated' },
        { name: 'Pull Request Comment Deleted', value: 'pullrequest:comment_deleted', description: 'Triggered when a pull request comment is deleted' }
      ]
    },
    {
      name: 'workspace',
      displayName: 'Workspace',
      type: 'string',
      required: true,
      default: '',
      description: 'The workspace name (username or team name) to monitor'
    },
    {
      name: 'repositorySlug',
      displayName: 'Repository Slug',
      type: 'string',
      required: true,
      default: '',
      description: 'The repository slug (name) to monitor'
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
      description: 'Triggers when Bitbucket events occur'
    }
  ],
  credentials: ['bitbucketApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Push Events',
      description: 'Trigger workflow when code is pushed to a Bitbucket repository',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket Trigger',
            type: 'n8n-nodes-base.bitbucketTrigger',
            parameters: {
              events: ['repo:push'],
              workspace: 'myworkspace',
              repositorySlug: 'myrepo'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Pull Requests',
      description: 'Trigger when pull requests are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket Trigger',
            type: 'n8n-nodes-base.bitbucketTrigger',
            parameters: {
              events: ['pullrequest:created', 'pullrequest:updated'],
              workspace: 'myworkspace',
              repositorySlug: 'myrepo'
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
            name: 'Bitbucket Trigger',
            type: 'n8n-nodes-base.bitbucketTrigger',
            parameters: {
              events: ['issue:created', 'issue:updated', 'issue:comment_created'],
              workspace: 'myworkspace',
              repositorySlug: 'myrepo'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Pull Request Reviews',
      description: 'Trigger when pull requests are reviewed or approved',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket Trigger',
            type: 'n8n-nodes-base.bitbucketTrigger',
            parameters: {
              events: ['pullrequest:approved', 'pullrequest:fulfilled', 'pullrequest:rejected'],
              workspace: 'myworkspace',
              repositorySlug: 'myrepo'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const bitbucketNodes: NodeTypeInfo[] = [bitbucketNode, bitbucketTriggerNode];

// Export individual actions for the regular Bitbucket node
export const bitbucketActions = [
  // File actions
  'create_file',
  'delete_file',
  'edit_file',
  'get_file',
  'list_files',
  // Issue actions
  'create_issue',
  'create_issue_comment',
  'get_issue',
  'get_all_issues',
  'update_issue',
  // Pull Request actions
  'create_pull_request',
  'create_pull_request_comment',
  'decline_pull_request',
  'get_pull_request',
  'get_all_pull_requests',
  'merge_pull_request',
  'update_pull_request',
  // Repository actions
  'get_repository',
  'get_repository_issues',
  'get_repository_pull_requests',
  'list_repositories',
  // User actions
  'get_user_repositories',
  // Webhook actions
  'create_webhook',
  'delete_webhook',
  'get_all_webhooks'
];

// Export trigger events
export const bitbucketTriggers = [
  'repository_push',
  'repository_fork',
  'repository_updated',
  'repository_transfer',
  'issue_created',
  'issue_updated',
  'issue_comment_created',
  'pull_request_created',
  'pull_request_updated',
  'pull_request_approved',
  'pull_request_merged',
  'pull_request_declined',
  'pull_request_comment_created',
  'pull_request_comment_updated',
  'pull_request_comment_deleted'
];