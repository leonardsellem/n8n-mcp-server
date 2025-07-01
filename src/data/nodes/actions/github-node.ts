/**
 * # GitHub
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Development & DevOps
 * 
 * ## Description
 * 
 * Use the GitHub node to automate work in GitHub, and integrate GitHub with other applications. 
 * n8n has built-in support for a wide range of GitHub features, including creating, updating, 
 * deleting, and editing files, repositories, issues, releases, and users.
 * 
 * ## Key Features
 * 
 * - **Comprehensive File Management**: Create, delete, edit, get, and list repository files
 * - **Advanced Issue Tracking**: Create issues, add comments, edit, get details, and lock issues
 * - **Organization Management**: Get repositories from organizations
 * - **Release Automation**: Create, delete, get, list, and update releases
 * - **Repository Operations**: Get repo info, issues, licenses, profiles, pull requests, analytics
 * - **Review Management**: Create, get, list, and update pull request reviews
 * - **User & Team Operations**: Get user repositories, invite users to organizations
 * - **Workflow Automation**: Disable, dispatch, enable, get, and manage GitHub Actions workflows
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Rich API Coverage**: Access to most GitHub REST API v4 endpoints
 * - **Authentication Support**: OAuth, personal access tokens, and GitHub Apps
 * - **Webhook Integration**: Handle GitHub webhook payloads and events
 * 
 * ## Credentials
 * 
 * Refer to [GitHub credentials](../../credentials/github/) for guidance on setting up authentication.
 * Supports OAuth, personal access tokens, and GitHub Apps authentication.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### File Operations
 * - **Create**: Create a new file in a repository
 * - **Delete**: Delete a file from a repository
 * - **Edit**: Edit an existing file in a repository
 * - **Get**: Get the contents of a file
 * - **List**: List files in a repository directory
 * 
 * ### Issue Operations
 * - **Create**: Create a new issue
 * - **Create Comment**: Add a comment to an issue
 * - **Edit**: Edit an existing issue
 * - **Get**: Get details of a specific issue
 * - **Lock**: Lock an issue to prevent further comments
 * 
 * ### Organization Operations
 * - **Get Repositories**: Get a list of repositories from an organization
 * 
 * ### Release Operations
 * - **Create**: Create a new release
 * - **Delete**: Delete a release
 * - **Get**: Get details of a specific release
 * - **Get Many**: Get a list of releases
 * - **Update**: Update an existing release
 * 
 * ### Repository Operations
 * - **Get**: Get repository information
 * - **Get Issues**: Get issues from a repository
 * - **Get License**: Get repository license information
 * - **Get Profile**: Get repository profile/community health metrics
 * - **Get Pull Requests**: Get pull requests from a repository
 * - **List Popular Paths**: Get popular content paths
 * - **List Referrers**: Get referrer traffic information
 * 
 * ### Review Operations
 * - **Create**: Create a pull request review
 * - **Get**: Get details of a specific review
 * - **Get Many**: Get a list of reviews for a pull request
 * - **Update**: Update an existing review
 * 
 * ### User Operations
 * - **Get Repositories**: Get repositories for a user
 * - **Invite**: Invite a user to an organization
 * 
 * ### Workflow Operations
 * - **Disable**: Disable a GitHub Actions workflow
 * - **Dispatch**: Trigger a workflow dispatch event
 * - **Enable**: Enable a GitHub Actions workflow
 * - **Get**: Get workflow details
 * - **Get Usage**: Get workflow usage statistics
 * - **List**: List all workflows in a repository
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the GitHub API directly with your GitHub credentials.
 * 
 * ## Use Cases
 * 
 * - Automated issue creation from support tickets and error monitoring
 * - Code deployment automation and CI/CD pipeline integration
 * - Pull request automation and code review workflows
 * - Release management and version control automation
 * - Repository synchronization and backup workflows
 * - Code quality automation and compliance checking
 * - Documentation updates and wiki management
 * - Team workflow automation and project management
 * - Open source community management and contribution tracking
 * - Security scanning and vulnerability management
 * - Analytics and reporting on repository activity
 * - Integration with external tools and business systems
 */

import { NodeTypeInfo } from '../../node-types.js';

export const githubNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.github',
  displayName: 'GitHub',
  description: 'Integrate with GitHub for repository management, issues, pull requests, and automation.',
  category: 'Action Nodes',
  subcategory: 'Development & DevOps',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'issue',
      description: 'GitHub resource to work with',
      options: [
        {
          name: 'Issue',
          value: 'issue'
        },
        {
          name: 'Pull Request',
          value: 'pullRequest'
        },
        {
          name: 'Repository',
          value: 'repository'
        },
        {
          name: 'File',
          value: 'file'
        },
        {
          name: 'User',
          value: 'user'
        },
        {
          name: 'Release',
          value: 'release'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Operation to perform',
      options: [
        {
          name: 'Create',
          value: 'create'
        },
        {
          name: 'Get',
          value: 'get'
        },
        {
          name: 'Update',
          value: 'update'
        },
        {
          name: 'Delete',
          value: 'delete'
        },
        {
          name: 'List',
          value: 'list'
        }
      ]
    },
    {
      name: 'owner',
      displayName: 'Repository Owner',
      type: 'string',
      required: true,
      default: '',
      description: 'Owner of the repository'
    },
    {
      name: 'repository',
      displayName: 'Repository Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the repository'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'githubApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'GitHub'
  },

  aliases: ['git', 'repository', 'code'],
  
  examples: [
    {
      name: 'Create Issue',
      description: 'Create a new GitHub issue',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              resource: 'issue',
              operation: 'create',
              owner: 'myorg',
              repository: 'myrepo',
              title: 'Bug Report',
              body: 'Found a bug in the application'
            }
          }
        ]
      }
    }
  ]
};

export default githubNode;
