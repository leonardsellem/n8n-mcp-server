import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const linearNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.linear',
  displayName: 'Linear',
  description: 'Use the Linear node to automate work in Linear, and integrate Linear with other applications. n8n has built-in support for a wide range of Linear features, including creating, updating, deleting, and getting issues.',
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
        { name: 'Issue', value: 'issue', description: 'Work with Linear issues' }
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
        { name: 'Create', value: 'create', description: 'Create a new issue' },
        { name: 'Delete', value: 'delete', description: 'Delete an issue' },
        { name: 'Get', value: 'get', description: 'Get an issue' },
        { name: 'Get All', value: 'getAll', description: 'Get all issues' },
        { name: 'Update', value: 'update', description: 'Update an issue' }
      ]
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
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the issue'
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
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team to assign the issue to'
    },
    {
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to assign the issue to'
    },
    {
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the project to assign the issue to'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: '',
      description: 'The priority of the issue',
      options: [
        { name: 'No Priority', value: '0', description: 'No priority set' },
        { name: 'Urgent', value: '1', description: 'Urgent priority' },
        { name: 'High', value: '2', description: 'High priority' },
        { name: 'Medium', value: '3', description: 'Medium priority' },
        { name: 'Low', value: '4', description: 'Low priority' }
      ]
    },
    {
      name: 'stateId',
      displayName: 'State ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the workflow state'
    },
    {
      name: 'labelIds',
      displayName: 'Label IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of label IDs'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'The due date for the issue'
    },
    {
      name: 'estimate',
      displayName: 'Estimate',
      type: 'number',
      required: false,
      default: 0,
      description: 'The estimate for the issue (story points)'
    },
    {
      name: 'cycleId',
      displayName: 'Cycle ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the cycle to assign the issue to'
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
      name: 'filters',
      displayName: 'Filters',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of filters to apply when getting issues'
    },
    {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'options',
      required: false,
      default: 'createdAt',
      description: 'How to order the results',
      options: [
        { name: 'Created At', value: 'createdAt', description: 'Order by creation date' },
        { name: 'Updated At', value: 'updatedAt', description: 'Order by last update date' },
        { name: 'Priority', value: 'priority', description: 'Order by priority' },
        { name: 'Title', value: 'title', description: 'Order by title' }
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
      description: 'The processed Linear data'
    }
  ],
  credentials: ['linearApi', 'linearOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Issue',
      description: 'Create a new issue in Linear',
      workflow: {
        nodes: [
          {
            name: 'Linear',
            type: 'n8n-nodes-base.linear',
            parameters: {
              resource: 'issue',
              operation: 'create',
              title: 'New bug report from n8n workflow',
              description: 'This is an issue created automatically by n8n',
              teamId: 'team_123',
              priority: '2'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Issues',
      description: 'Get all issues from Linear',
      workflow: {
        nodes: [
          {
            name: 'Linear',
            type: 'n8n-nodes-base.linear',
            parameters: {
              resource: 'issue',
              operation: 'getAll',
              returnAll: true,
              orderBy: 'createdAt'
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
            name: 'Linear',
            type: 'n8n-nodes-base.linear',
            parameters: {
              resource: 'issue',
              operation: 'update',
              issueId: 'issue_123',
              title: 'Updated issue title',
              description: 'Updated description',
              priority: '1'
            }
          }
        ]
      }
    },
    {
      name: 'Get Issue',
      description: 'Get a specific issue by ID',
      workflow: {
        nodes: [
          {
            name: 'Linear',
            type: 'n8n-nodes-base.linear',
            parameters: {
              resource: 'issue',
              operation: 'get',
              issueId: 'issue_123'
            }
          }
        ]
      }
    },
    {
      name: 'Delete Issue',
      description: 'Delete an issue from Linear',
      workflow: {
        nodes: [
          {
            name: 'Linear',
            type: 'n8n-nodes-base.linear',
            parameters: {
              resource: 'issue',
              operation: 'delete',
              issueId: 'issue_123'
            }
          }
        ]
      }
    }
  ]
};

export const linearTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.linearTrigger',
  displayName: 'Linear Trigger',
  description: 'Use the Linear Trigger node to respond to events in Linear and integrate Linear with other applications. The trigger activates when Linear issues, comments, cycles, projects, and other resources are created, updated, or deleted.',
  category: 'Development',
  subcategory: 'Issue Tracking',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['issue'],
      description: 'The events to trigger on',
      options: [
        { name: 'Comment Reaction', value: 'commentReaction', description: 'Trigger when a comment reaction is added or removed' },
        { name: 'Cycle', value: 'cycle', description: 'Trigger when a cycle is created, updated, or deleted' },
        { name: 'Issue', value: 'issue', description: 'Trigger when an issue is created, updated, or deleted' },
        { name: 'Issue Comment', value: 'issueComment', description: 'Trigger when an issue comment is added, updated, or deleted' },
        { name: 'Issue Label', value: 'issueLabel', description: 'Trigger when an issue label is added or removed' },
        { name: 'Project', value: 'project', description: 'Trigger when a project is created, updated, or deleted' }
      ]
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by team ID. Leave empty to monitor all teams'
    },
    {
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by project ID. Leave empty to monitor all projects'
    },
    {
      name: 'labelIds',
      displayName: 'Label IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of label IDs to monitor. Leave empty to monitor all labels'
    },
    {
      name: 'stateIds',
      displayName: 'State IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of state IDs to monitor. Leave empty to monitor all states'
    },
    {
      name: 'priority',
      displayName: 'Priority Filter',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Filter by priority levels',
      options: [
        { name: 'No Priority', value: '0', description: 'No priority set' },
        { name: 'Urgent', value: '1', description: 'Urgent priority' },
        { name: 'High', value: '2', description: 'High priority' },
        { name: 'Medium', value: '3', description: 'Medium priority' },
        { name: 'Low', value: '4', description: 'Low priority' }
      ]
    },
    {
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by assignee ID. Leave empty to monitor all assignees'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Linear events occur'
    }
  ],
  credentials: ['linearApi', 'linearOAuth2Api'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Issue Creation',
      description: 'Trigger workflow when new issues are created',
      workflow: {
        nodes: [
          {
            name: 'Linear Trigger',
            type: 'n8n-nodes-base.linearTrigger',
            parameters: {
              events: ['issue'],
              teamId: 'team_123'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Issue Comments',
      description: 'Trigger when comments are added to issues',
      workflow: {
        nodes: [
          {
            name: 'Linear Trigger',
            type: 'n8n-nodes-base.linearTrigger',
            parameters: {
              events: ['issueComment'],
              projectId: 'project_456'
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
            name: 'Linear Trigger',
            type: 'n8n-nodes-base.linearTrigger',
            parameters: {
              events: ['issue'],
              priority: ['1', '2']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Project Changes',
      description: 'Trigger when projects are updated',
      workflow: {
        nodes: [
          {
            name: 'Linear Trigger',
            type: 'n8n-nodes-base.linearTrigger',
            parameters: {
              events: ['project'],
              teamId: 'team_123'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Cycles',
      description: 'Trigger when cycles are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Linear Trigger',
            type: 'n8n-nodes-base.linearTrigger',
            parameters: {
              events: ['cycle'],
              teamId: 'team_123'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const linearNodes: NodeTypeInfo[] = [linearNode, linearTriggerNode];

// Export individual actions for the regular Linear node
export const linearActions = [
  'create_issue',
  'delete_issue',
  'get_issue',
  'get_all_issues',
  'update_issue'
];

// Export trigger events
export const linearTriggers = [
  'comment_reaction',
  'cycle',
  'issue',
  'issue_comment',
  'issue_label',
  'project'
];