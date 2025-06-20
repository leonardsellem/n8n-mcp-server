import { NodeTypeInfo } from '../node-types.js';

export const jiraNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jira',
  displayName: 'Jira Software',
  description: 'Use the Jira Software node to automate work in Jira, and integrate Jira with other applications. n8n has built-in support for a wide range of Jira features, including creating, updating, deleting, and getting issues, and users.',
  category: 'Development',
  subcategory: 'Issue Tracking',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'issue',
      description: 'The resource to operate on',
      options: [
        { name: 'Issue', value: 'issue', description: 'Work with Jira issues' },
        { name: 'Issue Attachment', value: 'issueAttachment', description: 'Manage issue attachments' },
        { name: 'Issue Comment', value: 'issueComment', description: 'Handle issue comments' },
        { name: 'User', value: 'user', description: 'Manage users' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Issue operations
        { name: 'Get Issue Changelog', value: 'changelog', description: 'Get issue changelog' },
        { name: 'Create', value: 'create', description: 'Create a new issue' },
        { name: 'Delete', value: 'delete', description: 'Delete an issue' },
        { name: 'Get', value: 'get', description: 'Get an issue' },
        { name: 'Get All', value: 'getAll', description: 'Get all issues' },
        { name: 'Create Email Notification', value: 'notify', description: 'Create an email notification for an issue and add it to the mail queue' },
        { name: 'Get Transitions', value: 'transitions', description: 'Return either all transitions or a transition that can be performed by the user on an issue, based on the issue\'s status' },
        { name: 'Update', value: 'update', description: 'Update an issue' },
        // Issue Attachment operations
        { name: 'Add Attachment', value: 'addAttachment', description: 'Add attachment to issue' },
        { name: 'Get Attachment', value: 'getAttachment', description: 'Get an attachment' },
        { name: 'Get All Attachments', value: 'getAllAttachments', description: 'Get all attachments' },
        { name: 'Remove Attachment', value: 'removeAttachment', description: 'Remove an attachment' },
        // Issue Comment operations
        { name: 'Add Comment', value: 'addComment', description: 'Add comment to issue' },
        { name: 'Get Comment', value: 'getComment', description: 'Get a comment' },
        { name: 'Get All Comments', value: 'getAllComments', description: 'Get all comments' },
        { name: 'Remove Comment', value: 'removeComment', description: 'Remove a comment' },
        { name: 'Update Comment', value: 'updateComment', description: 'Update a comment' },
        // User operations
        { name: 'Create User', value: 'createUser', description: 'Create a new user' },
        { name: 'Delete User', value: 'deleteUser', description: 'Delete a user' },
        { name: 'Get User', value: 'getUser', description: 'Retrieve a user' }
      ]
    },
    {
      name: 'issueKey',
      displayName: 'Issue Key',
      type: 'string',
      required: false,
      default: '',
      description: 'The key of the issue (e.g., PROJ-123)'
    },
    {
      name: 'issueId',
      displayName: 'Issue ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the issue'
    },
    {
      name: 'project',
      displayName: 'Project',
      type: 'string',
      required: false,
      default: '',
      description: 'The project key or ID'
    },
    {
      name: 'issueType',
      displayName: 'Issue Type',
      type: 'string',
      required: false,
      default: '',
      description: 'The type of issue (e.g., Bug, Task, Story)'
    },
    {
      name: 'summary',
      displayName: 'Summary',
      type: 'string',
      required: false,
      default: '',
      description: 'The summary (title) of the issue'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'The description of the issue'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: '',
      description: 'The priority of the issue',
      options: [
        { name: 'Highest', value: 'Highest', description: 'Highest priority' },
        { name: 'High', value: 'High', description: 'High priority' },
        { name: 'Medium', value: 'Medium', description: 'Medium priority' },
        { name: 'Low', value: 'Low', description: 'Low priority' },
        { name: 'Lowest', value: 'Lowest', description: 'Lowest priority' }
      ]
    },
    {
      name: 'assignee',
      displayName: 'Assignee',
      type: 'string',
      required: false,
      default: '',
      description: 'The user to assign the issue to'
    },
    {
      name: 'reporter',
      displayName: 'Reporter',
      type: 'string',
      required: false,
      default: '',
      description: 'The user who reported the issue'
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
      name: 'components',
      displayName: 'Components',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of components'
    },
    {
      name: 'fixVersions',
      displayName: 'Fix Versions',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fix versions'
    },
    {
      name: 'affectsVersions',
      displayName: 'Affects Versions',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of affects versions'
    },
    {
      name: 'jql',
      displayName: 'JQL',
      type: 'string',
      required: false,
      default: '',
      description: 'Jira Query Language (JQL) query to filter issues'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to return'
    },
    {
      name: 'expand',
      displayName: 'Expand',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to expand'
    },
    {
      name: 'comment',
      displayName: 'Comment',
      type: 'string',
      required: false,
      default: '',
      description: 'The comment text'
    },
    {
      name: 'commentId',
      displayName: 'Comment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the comment'
    },
    {
      name: 'attachmentId',
      displayName: 'Attachment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the attachment'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the file to attach'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user'
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'The username'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address of the user'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The display name of the user'
    },
    {
      name: 'returnAll',
      displayName: 'Return All',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return all results or limit them'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'maxResults',
      displayName: 'Max Results',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return per page'
    },
    {
      name: 'startAt',
      displayName: 'Start At',
      type: 'number',
      required: false,
      default: 0,
      description: 'The index of the first result to return'
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
      description: 'The processed Jira data'
    }
  ],
  credentials: ['jiraApi', 'jiraCloudApi', 'jiraServerApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Issue',
      description: 'Create a new issue in Jira',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issue',
              operation: 'create',
              project: 'PROJ',
              issueType: 'Task',
              summary: 'New task from n8n workflow',
              description: 'This is a task created automatically by n8n',
              priority: 'Medium'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Issues',
      description: 'Get all issues from a specific project',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issue',
              operation: 'getAll',
              jql: 'project=PROJ',
              returnAll: true
            }
          }
        ]
      }
    },
    {
      name: 'Update Issue',
      description: 'Update an existing issue',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issue',
              operation: 'update',
              issueKey: 'PROJ-123',
              summary: 'Updated issue summary',
              description: 'Updated description',
              assignee: 'john.doe@example.com'
            }
          }
        ]
      }
    },
    {
      name: 'Add Comment',
      description: 'Add a comment to an issue',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issueComment',
              operation: 'addComment',
              issueKey: 'PROJ-123',
              comment: 'This is a comment added by n8n workflow'
            }
          }
        ]
      }
    },
    {
      name: 'Add Attachment',
      description: 'Add an attachment to an issue',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issueAttachment',
              operation: 'addAttachment',
              issueKey: 'PROJ-123',
              fileName: 'report.pdf'
            }
          }
        ]
      }
    }
  ]
};

export const jiraTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jiraTrigger',
  displayName: 'Jira Trigger',
  description: 'Use the Jira Trigger node to respond to events in Jira and integrate Jira with other applications. The trigger activates when Jira issues are created, updated, or deleted.',
  category: 'Development',
  subcategory: 'Issue Tracking',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['issue_created'],
      description: 'The events to trigger on',
      options: [
        { name: 'Issue Created', value: 'issue_created', description: 'Trigger when a new issue is created' },
        { name: 'Issue Updated', value: 'issue_updated', description: 'Trigger when an issue is updated' },
        { name: 'Issue Deleted', value: 'issue_deleted', description: 'Trigger when an issue is deleted' },
        { name: 'Issue Comment Added', value: 'issue_comment_created', description: 'Trigger when a comment is added to an issue' },
        { name: 'Issue Comment Updated', value: 'issue_comment_updated', description: 'Trigger when a comment is updated' },
        { name: 'Issue Comment Deleted', value: 'issue_comment_deleted', description: 'Trigger when a comment is deleted' }
      ]
    },
    {
      name: 'projectKey',
      displayName: 'Project Key',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by project key. Leave empty to monitor all projects'
    },
    {
      name: 'issueTypes',
      displayName: 'Issue Types',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of issue types to monitor. Leave empty to monitor all types'
    },
    {
      name: 'jqlFilter',
      displayName: 'JQL Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'JQL query to filter which issues should trigger the webhook'
    },
    {
      name: 'includeFields',
      displayName: 'Include Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to include in the webhook payload'
    },
    {
      name: 'excludeFields',
      displayName: 'Exclude Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to exclude from the webhook payload'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Jira events occur'
    }
  ],
  credentials: ['jiraApi', 'jiraCloudApi', 'jiraServerApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Issue Creation',
      description: 'Trigger workflow when new issues are created in a specific project',
      workflow: {
        nodes: [
          {
            name: 'Jira Trigger',
            type: 'n8n-nodes-base.jiraTrigger',
            parameters: {
              events: ['issue_created'],
              projectKey: 'PROJ',
              issueTypes: 'Bug,Task,Story'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Issue Updates',
      description: 'Trigger when issues are updated in any project',
      workflow: {
        nodes: [
          {
            name: 'Jira Trigger',
            type: 'n8n-nodes-base.jiraTrigger',
            parameters: {
              events: ['issue_updated'],
              includeFields: 'summary,status,assignee,priority'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor High Priority Issues',
      description: 'Trigger when high priority issues are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Jira Trigger',
            type: 'n8n-nodes-base.jiraTrigger',
            parameters: {
              events: ['issue_created', 'issue_updated'],
              jqlFilter: 'priority = High OR priority = Highest'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Comments',
      description: 'Trigger when comments are added to issues',
      workflow: {
        nodes: [
          {
            name: 'Jira Trigger',
            type: 'n8n-nodes-base.jiraTrigger',
            parameters: {
              events: ['issue_comment_created'],
              projectKey: 'SUPPORT'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const jiraNodes: NodeTypeInfo[] = [jiraNode, jiraTriggerNode];

// Export individual actions for the regular Jira node
export const jiraActions = [
  // Issue actions
  'get_issue_changelog',
  'create_issue',
  'delete_issue',
  'get_issue',
  'get_all_issues',
  'create_issue_email_notification',
  'get_issue_transitions',
  'update_issue',
  // Issue Attachment actions
  'add_issue_attachment',
  'get_issue_attachment',
  'get_all_issue_attachments',
  'remove_issue_attachment',
  // Issue Comment actions
  'add_issue_comment',
  'get_issue_comment',
  'get_all_issue_comments',
  'remove_issue_comment',
  'update_issue_comment',
  // User actions
  'create_user',
  'delete_user',
  'get_user'
];

// Export trigger events
export const jiraTriggers = [
  'issue_created',
  'issue_updated',
  'issue_deleted',
  'issue_comment_created',
  'issue_comment_updated',
  'issue_comment_deleted'
];