import { NodeTypeInfo } from '../node-types.js';

export const gitlabNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gitlab',
  displayName: 'GitLab',
  description: 'Use the GitLab node to automate work in GitLab, and integrate GitLab with other applications. n8n has built-in support for a wide range of GitLab features, including creating, updating, deleting, and editing issues, repositories, releases and users.',
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
        { name: 'Issue', value: 'issue', description: 'Manage GitLab issues' },
        { name: 'Release', value: 'release', description: 'Manage repository releases' },
        { name: 'Repository', value: 'repository', description: 'Work with repositories' },
        { name: 'User', value: 'user', description: 'Work with GitLab users' }
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
        // Release operations
        { name: 'Get All', value: 'getAll', description: 'Get all releases' },
        { name: 'Update', value: 'update', description: 'Update a release' },
        // Repository operations
        { name: 'Get Issues', value: 'getIssues', description: 'Get issues from a repository' },
        // User operations
        { name: 'Get Repositories', value: 'getRepositories', description: 'Get repositories of a user' }
      ]
    },
    {
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID or URL-encoded path of the project'
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
      name: 'issueIid',
      displayName: 'Issue IID',
      type: 'number',
      required: false,
      default: 1,
      description: 'Internal ID of the issue in the project'
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
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description content for issues, comments, or releases'
    },
    {
      name: 'state',
      displayName: 'State',
      type: 'options',
      required: false,
      default: 'opened',
      description: 'State filter for issues',
      options: [
        { name: 'Opened', value: 'opened', description: 'Open issues' },
        { name: 'Closed', value: 'closed', description: 'Closed issues' },
        { name: 'All', value: 'all', description: 'All issues' }
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
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'number',
      required: false,
      default: 0,
      description: 'ID of the user to assign the issue to'
    },
    {
      name: 'milestoneId',
      displayName: 'Milestone ID',
      type: 'number',
      required: false,
      default: 0,
      description: 'ID of the milestone to assign the issue to'
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
      name: 'ref',
      displayName: 'Reference',
      type: 'string',
      required: false,
      default: '',
      description: 'Git reference (branch or tag) for the release'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID or username of the user'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 20,
      description: 'Maximum number of results to return'
    },
    {
      name: 'sort',
      displayName: 'Sort',
      type: 'options',
      required: false,
      default: 'created_at',
      description: 'Sort order for results',
      options: [
        { name: 'Created At', value: 'created_at', description: 'Sort by creation date' },
        { name: 'Updated At', value: 'updated_at', description: 'Sort by update date' },
        { name: 'Title', value: 'title', description: 'Sort by title' }
      ]
    },
    {
      name: 'order',
      displayName: 'Order',
      type: 'options',
      required: false,
      default: 'desc',
      description: 'Sort direction',
      options: [
        { name: 'Ascending', value: 'asc', description: 'Ascending order' },
        { name: 'Descending', value: 'desc', description: 'Descending order' }
      ]
    },
    {
      name: 'encoding',
      displayName: 'Encoding',
      type: 'options',
      required: false,
      default: 'text',
      description: 'File content encoding',
      options: [
        { name: 'Text', value: 'text', description: 'Plain text encoding' },
        { name: 'Base64', value: 'base64', description: 'Base64 encoding' }
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
      description: 'The processed GitLab data'
    }
  ],
  credentials: ['gitlabApi', 'gitlabOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create File',
      description: 'Create a new file in a GitLab repository',
      workflow: {
        nodes: [
          {
            name: 'GitLab',
            type: 'n8n-nodes-base.gitlab',
            parameters: {
              resource: 'file',
              operation: 'create',
              projectId: 'myproject',
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
      description: 'Create a new issue in a GitLab project',
      workflow: {
        nodes: [
          {
            name: 'GitLab',
            type: 'n8n-nodes-base.gitlab',
            parameters: {
              resource: 'issue',
              operation: 'create',
              projectId: 'myproject',
              title: 'Bug Report',
              description: 'Found a bug in the application...',
              labels: 'bug,high-priority'
            }
          }
        ]
      }
    },
    {
      name: 'Get Project Issues',
      description: 'Get all open issues from a GitLab project',
      workflow: {
        nodes: [
          {
            name: 'GitLab',
            type: 'n8n-nodes-base.gitlab',
            parameters: {
              resource: 'repository',
              operation: 'getIssues',
              projectId: 'myproject',
              state: 'opened',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Create Release',
      description: 'Create a new release for a GitLab project',
      workflow: {
        nodes: [
          {
            name: 'GitLab',
            type: 'n8n-nodes-base.gitlab',
            parameters: {
              resource: 'release',
              operation: 'create',
              projectId: 'myproject',
              tagName: 'v1.0.0',
              title: 'Version 1.0.0',
              description: 'First stable release of the project',
              ref: 'main'
            }
          }
        ]
      }
    },
    {
      name: 'Edit File',
      description: 'Edit an existing file in a GitLab repository',
      workflow: {
        nodes: [
          {
            name: 'GitLab',
            type: 'n8n-nodes-base.gitlab',
            parameters: {
              resource: 'file',
              operation: 'edit',
              projectId: 'myproject',
              filePath: 'package.json',
              fileContent: '{\n  "name": "my-updated-project",\n  "version": "1.0.1"\n}',
              commitMessage: 'Update package.json version',
              branch: 'main'
            }
          }
        ]
      }
    }
  ]
};

export const gitlabTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gitlabTrigger',
  displayName: 'GitLab Trigger',
  description: 'GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking, and continuous integration/continuous installation pipeline features.',
  category: 'Development',
  subcategory: 'Version Control',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['push'],
      description: 'The GitLab events to trigger on',
      options: [
        { name: 'Issues Events', value: 'issues', description: 'Triggered when an issue is created, updated, or closed' },
        { name: 'Job Events', value: 'job', description: 'Triggered when a job starts, succeeds, or fails' },
        { name: 'Merge Request Events', value: 'merge_requests', description: 'Triggered when a merge request is created, updated, or merged' },
        { name: 'Note Events', value: 'note', description: 'Triggered when a comment is made on commits, merge requests, issues, or code snippets' },
        { name: 'Pipeline Events', value: 'pipeline', description: 'Triggered when a pipeline status changes' },
        { name: 'Push Events', value: 'push', description: 'Triggered when commits are pushed to a repository' },
        { name: 'Release Events', value: 'releases', description: 'Triggered when a release is created' },
        { name: 'Tag Push Events', value: 'tag_push', description: 'Triggered when tags are pushed to a repository' },
        { name: 'Wiki Page Events', value: 'wiki_page', description: 'Triggered when a wiki page is created or updated' }
      ]
    },
    {
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID or URL-encoded path of the project to monitor'
    },
    {
      name: 'secret',
      displayName: 'Secret Token',
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
      description: 'Triggers when GitLab events occur'
    }
  ],
  credentials: ['gitlabApi', 'gitlabOAuth2Api'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Push Events',
      description: 'Trigger workflow when code is pushed to a GitLab repository',
      workflow: {
        nodes: [
          {
            name: 'GitLab Trigger',
            type: 'n8n-nodes-base.gitlabTrigger',
            parameters: {
              events: ['push'],
              projectId: 'myproject'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Merge Requests',
      description: 'Trigger when merge requests are created or updated',
      workflow: {
        nodes: [
          {
            name: 'GitLab Trigger',
            type: 'n8n-nodes-base.gitlabTrigger',
            parameters: {
              events: ['merge_requests'],
              projectId: 'myproject'
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
            name: 'GitLab Trigger',
            type: 'n8n-nodes-base.gitlabTrigger',
            parameters: {
              events: ['issues'],
              projectId: 'myproject'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Pipeline Events',
      description: 'Trigger when CI/CD pipeline status changes',
      workflow: {
        nodes: [
          {
            name: 'GitLab Trigger',
            type: 'n8n-nodes-base.gitlabTrigger',
            parameters: {
              events: ['pipeline'],
              projectId: 'myproject'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const gitlabNodes: NodeTypeInfo[] = [gitlabNode, gitlabTriggerNode];

// Export individual actions for the regular GitLab node
export const gitlabActions = [
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
  // Release actions
  'create_release',
  'delete_release',
  'get_release',
  'get_all_releases',
  'update_release',
  // Repository actions
  'get_repository',
  'get_repository_issues',
  // User actions
  'get_user_repositories'
];

// Export trigger events
export const gitlabTriggers = [
  'issues_events',
  'job_events',
  'merge_request_events',
  'note_events',
  'pipeline_events',
  'push_events',
  'release_events',
  'tag_push_events',
  'wiki_page_events'
];