import { NodeTypeInfo } from '../../node-types.js';

// This is how the GitHub node is ACTUALLY structured in n8n
export const githubNodeComplete: NodeTypeInfo = {
  name: 'n8n-nodes-base.github',
  displayName: 'GitHub',
  description: 'Consume GitHub API',
  category: 'Development',
  subcategory: 'Version Control',
  
  // Real n8n node properties following exact structure
  properties: [
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'accessToken',
      description: 'Authentication method',
      options: [
        {
          name: 'Access Token',
          value: 'accessToken',
          description: 'Use a personal access token'
        },
        {
          name: 'OAuth2',
          value: 'oAuth2',
          description: 'Use OAuth2 authentication'
        }
      ]
    },
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'issue',
      description: 'The resource to operate on',
      options: [
        {
          name: 'File',
          value: 'file',
          description: 'Work with repository files'
        },
        {
          name: 'Issue',
          value: 'issue', 
          description: 'Manage GitHub issues'
        },
        {
          name: 'Organization',
          value: 'organization',
          description: 'Work with GitHub organizations'
        },
        {
          name: 'Pull Request',
          value: 'pullRequest',
          description: 'Manage pull requests'
        },
        {
          name: 'Release',
          value: 'release',
          description: 'Manage repository releases'
        },
        {
          name: 'Repository',
          value: 'repository',
          description: 'Work with repositories'
        },
        {
          name: 'Review',
          value: 'review',
          description: 'Manage pull request reviews'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Work with GitHub users'
        },
        {
          name: 'Workflow',
          value: 'workflow',
          description: 'Manage GitHub Actions workflows'
        }
      ]
    },
    
    // FILE OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['file']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new file',
          action: 'Create a file'
        },
        {
          name: 'Delete',
          value: 'delete', 
          description: 'Delete a file',
          action: 'Delete a file'
        },
        {
          name: 'Edit',
          value: 'edit',
          description: 'Edit an existing file',
          action: 'Edit a file'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a file',
          action: 'Get a file'
        },
        {
          name: 'List',
          value: 'list',
          description: 'List files in a directory',
          action: 'List files'
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
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['issue']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create an issue',
          action: 'Create an issue'
        },
        {
          name: 'Create Comment',
          value: 'createComment',
          description: 'Create a comment on an issue',
          action: 'Create comment on issue'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an issue',
          action: 'Delete an issue'
        },
        {
          name: 'Edit',
          value: 'edit',
          description: 'Edit an issue',
          action: 'Edit an issue'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an issue',
          action: 'Get an issue'
        },
        {
          name: 'Lock',
          value: 'lock',
          description: 'Lock an issue',
          action: 'Lock an issue'
        }
      ]
    },

    // REPOSITORY LOCATOR - This is how n8n actually handles repository selection
    {
      name: 'repository',
      displayName: 'Repository',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'list', value: '' },
      description: 'The repository to work with',
      displayOptions: {
        show: {
          resource: ['file', 'issue', 'pullRequest', 'release']
        }
      },
      modes: [
        {
          displayName: 'Repository',
          name: 'list',
          type: 'list',
          placeholder: 'Select a Repository...',
          typeOptions: {
            searchListMethod: 'getRepositories',
            searchable: true
          }
        },
        {
          displayName: 'By URL',
          name: 'url', 
          type: 'string',
          placeholder: 'https://github.com/owner/repository-name',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: 'https://github.com/[\\w.-]+/[\\w.-]+',
                errorMessage: 'Not a valid GitHub Repository URL'
              }
            }
          ]
        },
        {
          displayName: 'ID',
          name: 'id',
          type: 'string',
          placeholder: '123456',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: '[0-9]+',
                errorMessage: 'Not a valid Repository ID'
              }
            }
          ]
        }
      ]
    },

    // ISSUE SPECIFIC FIELDS
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: true,
      default: '',
      description: 'The title of the issue',
      displayOptions: {
        show: {
          resource: ['issue'],
          operation: ['create', 'edit']
        }
      }
    },

    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'The contents of the issue',
      typeOptions: {
        rows: 5
      },
      displayOptions: {
        show: {
          resource: ['issue'], 
          operation: ['create', 'edit']
        }
      }
    },

    {
      name: 'issueNumber',
      displayName: 'Issue Number',
      type: 'number',
      required: true,
      default: 1,
      description: 'Issue number',
      displayOptions: {
        show: {
          resource: ['issue'],
          operation: ['get', 'edit', 'delete', 'lock', 'createComment']
        }
      }
    },

    // ADDITIONAL FIELDS COLLECTION
    {
      name: 'additionalFields',
      displayName: 'Additional Fields',
      type: 'collection',
      required: false,
      placeholder: 'Add Field',
      default: {},
      description: 'Additional fields for the issue',
      displayOptions: {
        show: {
          resource: ['issue'],
          operation: ['create', 'edit']
        }
      },
      options: [
        {
      name: 'assignees',
      displayName: 'Assignees',
      type: 'multiOptions',
      required: false,
      default: [],
          description: 'Users to assign the issue to',
          typeOptions: {
            loadOptionsMethod: 'getAssignees',
            loadOptionsDependsOn: ['repository']
    }
        },
        {
      name: 'labels',
      displayName: 'Labels',
      type: 'multiOptions',
      required: false,
      default: [],
          description: 'Labels to apply to the issue',
          typeOptions: {
            loadOptionsMethod: 'getLabels',
            loadOptionsDependsOn: ['repository']
    }
        },
        {
      name: 'milestone',
      displayName: 'Milestone',
      type: 'options',
      required: false,
      default: '',
          description: 'Milestone to associate with the issue',
          typeOptions: {
            loadOptionsMethod: 'getMilestones',
            loadOptionsDependsOn: ['repository']
    }
        }
      ]
    },

    // FILE SPECIFIC FIELDS
    {
      name: 'filePath',
      displayName: 'File Path',
      type: 'string',
      required: true,
      default: '',
      description: 'Path to the file',
      placeholder: 'path/to/file.txt',
      displayOptions: {
        show: {
          resource: ['file']
        }
      }
    },

    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the file',
      typeOptions: {
        rows: 10
      },
      displayOptions: {
        show: {
          resource: ['file'],
          operation: ['create', 'edit']
        }
      }
    },

    {
      name: 'commitMessage',
      displayName: 'Commit Message',
      type: 'string',
      required: true,
      default: '',
      description: 'Commit message',
      displayOptions: {
        show: {
          resource: ['file'],
          operation: ['create', 'edit', 'delete']
        }
      }
    },

    // WORKFLOW OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation', 
      type: 'options',
      required: true,
      default: 'list',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['workflow']
        }
      },
      options: [
        {
          name: 'Disable',
          value: 'disable',
          description: 'Disable a workflow',
          action: 'Disable a workflow'
        },
        {
          name: 'Dispatch',
          value: 'dispatch',
          description: 'Dispatch a workflow event',
          action: 'Dispatch a workflow'
        },
        {
          name: 'Enable',
          value: 'enable',
          description: 'Enable a workflow',
          action: 'Enable a workflow'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a workflow',
          action: 'Get a workflow'
        },
        {
          name: 'List',
          value: 'list',
          description: 'List workflows',
          action: 'List workflows'
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
      description: 'Returns the GitHub API response'
    }
  ],

  credentials: [
    {
      name: 'githubApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['accessToken']
        }
      }
    },
    {
      name: 'githubOAuth2Api', 
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    }
  ],

  regularNode: true,
  codeable: false,

  // Dynamic subtitle that shows current operation
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

  // Node version support
  version: [1, 1.1, 1.2],

  // Default node name
  defaults: {
    name: 'GitHub'
  },

  // Search aliases for better discoverability
  aliases: ['Git', 'Repository', 'Version Control', 'Code', 'Issues', 'Pull Requests'],

  // Detailed examples showing real usage patterns
  examples: [
    {
      name: 'Create Issue',
      description: 'Create a new issue in a GitHub repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'issue',
              operation: 'create',
              repository: {
                mode: 'url',
                value: 'https://github.com/owner/repo'
              },
              title: 'Bug report from automation',
              body: 'This issue was created automatically by n8n workflow',
              additionalFields: {
                labels: ['bug', 'automation'],
                assignees: ['username']
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create File',
      description: 'Create a new file in repository',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'file',
              operation: 'create',
              repository: {
                mode: 'list',
                value: '123456'
              },
              filePath: 'automation/report.md',
              fileContent: '# Automated Report\n\nGenerated on {{$now}}',
              commitMessage: 'Add automated report'
            }
          }
        ]
      }
    },
    {
      name: 'Dispatch Workflow',
      description: 'Trigger a GitHub Actions workflow',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              authentication: 'accessToken',
              resource: 'workflow',
              operation: 'dispatch',
              repository: {
                mode: 'url', 
                value: 'https://github.com/owner/repo'
              },
              workflowId: 'deploy.yml',
              ref: 'main',
              inputs: {
                environment: 'production',
                version: 'v1.2.3'
              }
            }
          }
        ]
      }
    }
  ]
};

// Companion codex metadata (would be in .node.json file)
export const githubNodeCodex = {
  node: 'n8n-nodes-base.github',
  nodeVersion: '1.2',
  codexVersion: '1.0',
  categories: ['Development'],
  resources: {
    primaryDocumentation: [
      {
        url: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.github/'
      }
    ],
    generic: [
      {
        label: "GitHub's API documentation",
        icon: '🌐',
        url: 'https://docs.github.com/en/rest'
      }
    ]
  },
  alias: ['Git', 'Repository', 'Version Control', 'Code', 'Issues', 'Pull Requests'],
  subcategories: {
    Development: ['Version Control']
  }
};

// Load options methods that would be implemented in the actual node
export const githubLoadOptions = {
  async getRepositories() {
    // Implementation would fetch user's repositories from GitHub API
    return [
      { name: 'my-repo', value: '123456' },
      { name: 'another-repo', value: '789012' }
    ];
  },
  
  async getAssignees() {
    // Implementation would fetch repository collaborators
    return [
      { name: 'john-doe', value: 'john-doe' },
      { name: 'jane-smith', value: 'jane-smith' }
    ];
  },
  
  async getLabels() {
    // Implementation would fetch repository labels
    return [
      { name: 'bug', value: 'bug' },
      { name: 'enhancement', value: 'enhancement' },
      { name: 'documentation', value: 'documentation' }
    ];
  },
  
  async getMilestones() {
    // Implementation would fetch repository milestones
    return [
      { name: 'v1.0.0', value: '1' },
      { name: 'v2.0.0', value: '2' }
    ];
  }
};

export default githubNodeComplete;