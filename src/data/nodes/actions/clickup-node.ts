import { NodeTypeInfo } from '../../node-types.js';

export const clickupNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clickup',
  displayName: 'ClickUp',
  description: 'Use the ClickUp node to automate work in ClickUp, and integrate ClickUp with other applications. n8n supports creating tasks, updating projects, managing time tracking, and working with teams.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'task',
      description: 'The resource to operate on',
      options: [
        { name: 'Task', value: 'task', description: 'Work with tasks' },
        { name: 'List', value: 'list', description: 'Manage lists' },
        { name: 'Folder', value: 'folder', description: 'Work with folders' },
        { name: 'Space', value: 'space', description: 'Manage spaces' },
        { name: 'Team', value: 'team', description: 'Work with teams' },
        { name: 'User', value: 'user', description: 'Manage users' },
        { name: 'Comment', value: 'comment', description: 'Handle comments' },
        { name: 'Time Tracking', value: 'timeTracking', description: 'Track time entries' },
        { name: 'Goal', value: 'goal', description: 'Manage goals' },
        { name: 'Checklist', value: 'checklist', description: 'Work with checklists' },
        { name: 'Custom Field', value: 'customField', description: 'Manage custom fields' }
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
        // Task operations
        { name: 'Create Task', value: 'create', description: 'Create a new task' },
        { name: 'Update Task', value: 'update', description: 'Update an existing task' },
        { name: 'Delete Task', value: 'delete', description: 'Delete a task' },
        { name: 'Get Task', value: 'get', description: 'Get task information' },
        { name: 'Get Many Tasks', value: 'getAll', description: 'Get multiple tasks' },
        { name: 'Add Task Dependency', value: 'addDependency', description: 'Add dependency to task' },
        { name: 'Remove Task Dependency', value: 'removeDependency', description: 'Remove dependency from task' },
        { name: 'Set Task Status', value: 'setStatus', description: 'Change task status' },
        { name: 'Add Task Assignee', value: 'addAssignee', description: 'Assign user to task' },
        { name: 'Remove Task Assignee', value: 'removeAssignee', description: 'Unassign user from task' },
        // List operations
        { name: 'Create List', value: 'createList', description: 'Create a new list' },
        { name: 'Update List', value: 'updateList', description: 'Update list information' },
        { name: 'Delete List', value: 'deleteList', description: 'Delete a list' },
        { name: 'Get List', value: 'getList', description: 'Get list information' },
        { name: 'Get Many Lists', value: 'getAllLists', description: 'Get multiple lists' },
        // Folder operations
        { name: 'Create Folder', value: 'createFolder', description: 'Create a new folder' },
        { name: 'Update Folder', value: 'updateFolder', description: 'Update folder information' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Get Folder', value: 'getFolder', description: 'Get folder information' },
        { name: 'Get Many Folders', value: 'getAllFolders', description: 'Get multiple folders' },
        // Space operations
        { name: 'Create Space', value: 'createSpace', description: 'Create a new space' },
        { name: 'Update Space', value: 'updateSpace', description: 'Update space information' },
        { name: 'Delete Space', value: 'deleteSpace', description: 'Delete a space' },
        { name: 'Get Space', value: 'getSpace', description: 'Get space information' },
        { name: 'Get Many Spaces', value: 'getAllSpaces', description: 'Get multiple spaces' },
        // Comment operations
        { name: 'Create Comment', value: 'createComment', description: 'Create a comment' },
        { name: 'Update Comment', value: 'updateComment', description: 'Update a comment' },
        { name: 'Delete Comment', value: 'deleteComment', description: 'Delete a comment' },
        { name: 'Get Comments', value: 'getComments', description: 'Get task comments' },
        // Time Tracking operations
        { name: 'Start Time Entry', value: 'startTime', description: 'Start time tracking' },
        { name: 'Stop Time Entry', value: 'stopTime', description: 'Stop time tracking' },
        { name: 'Create Time Entry', value: 'createTimeEntry', description: 'Create a time entry' },
        { name: 'Delete Time Entry', value: 'deleteTimeEntry', description: 'Delete a time entry' },
        { name: 'Get Time Entries', value: 'getTimeEntries', description: 'Get time tracking entries' },
        // Goal operations
        { name: 'Create Goal', value: 'createGoal', description: 'Create a new goal' },
        { name: 'Update Goal', value: 'updateGoal', description: 'Update goal information' },
        { name: 'Delete Goal', value: 'deleteGoal', description: 'Delete a goal' },
        { name: 'Get Goal', value: 'getGoal', description: 'Get goal information' },
        { name: 'Get Many Goals', value: 'getAllGoals', description: 'Get multiple goals' }
      ]
    },
    {
      name: 'taskId',
      displayName: 'Task ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the task to operate on'
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the list'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder'
    },
    {
      name: 'spaceId',
      displayName: 'Space ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the space'
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the task, list, folder, or space'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'The description text'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'string',
      required: false,
      default: '',
      description: 'The status of the task'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: '3',
      description: 'Task priority level',
      options: [
        { name: 'Urgent', value: '1', description: 'Highest priority' },
        { name: 'High', value: '2', description: 'High priority' },
        { name: 'Normal', value: '3', description: 'Normal priority' },
        { name: 'Low', value: '4', description: 'Low priority' }
      ]
    },
    {
      name: 'assignees',
      displayName: 'Assignees',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of user IDs to assign'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Due date in ISO 8601 format or timestamp'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Start date in ISO 8601 format or timestamp'
    },
    {
      name: 'timeEstimate',
      displayName: 'Time Estimate',
      type: 'number',
      required: false,
      default: 0,
      description: 'Time estimate in milliseconds'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of tags'
    },
    {
      name: 'parentTaskId',
      displayName: 'Parent Task ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the parent task (for subtasks)'
    },
    {
      name: 'customFields',
      displayName: 'Custom Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object of custom field values'
    },
    {
      name: 'archived',
      displayName: 'Archived',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the item is archived'
    },
    {
      name: 'includeSubtasks',
      displayName: 'Include Subtasks',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include subtasks in results'
    },
    {
      name: 'includeClosed',
      displayName: 'Include Closed',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include closed tasks'
    },
    {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'options',
      required: false,
      default: 'created',
      description: 'How to order the results',
      options: [
        { name: 'Created', value: 'created', description: 'Order by creation date' },
        { name: 'Updated', value: 'updated', description: 'Order by last update' },
        { name: 'Due Date', value: 'due_date', description: 'Order by due date' },
        { name: 'Priority', value: 'priority', description: 'Order by priority' }
      ]
    },
    {
      name: 'reverse',
      displayName: 'Reverse Order',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to reverse the order'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
    },
    {
      name: 'commentText',
      displayName: 'Comment Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text of the comment'
    },
    {
      name: 'timeDescription',
      displayName: 'Time Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the time entry'
    },
    {
      name: 'timeAmount',
      displayName: 'Time Amount',
      type: 'number',
      required: false,
      default: 0,
      description: 'Time amount in milliseconds'
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
      description: 'The ClickUp API response data'
    }
  ],
  credentials: ['clickUpApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Task',
      description: 'Create a new task in ClickUp',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'task',
              operation: 'create',
              listId: '123456789',
              name: 'Review quarterly report',
              description: 'Please review the Q4 financial report and provide feedback',
              priority: '2',
              assignees: '123,456',
              dueDate: '2024-07-01T09:00:00Z',
              tags: 'quarterly,finance,review'
            }
          }
        ]
      }
    },
    {
      name: 'Get Team Tasks',
      description: 'Get all tasks assigned to team members',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'task',
              operation: 'getAll',
              teamId: '123456',
              includeClosed: false,
              includeSubtasks: true,
              orderBy: 'due_date',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Update Task Status',
      description: 'Update the status of a specific task',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'task',
              operation: 'setStatus',
              taskId: '987654321',
              status: 'in progress'
            }
          }
        ]
      }
    },
    {
      name: 'Create Project List',
      description: 'Create a new list for a project',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'list',
              operation: 'createList',
              folderId: '123456789',
              name: 'Website Redesign',
              description: 'Tasks related to the company website redesign project'
            }
          }
        ]
      }
    },
    {
      name: 'Track Time on Task',
      description: 'Create a time entry for work done on a task',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'timeTracking',
              operation: 'createTimeEntry',
              taskId: '987654321',
              timeDescription: 'Worked on frontend development',
              timeAmount: '7200000'
            }
          }
        ]
      }
    },
    {
      name: 'Add Comment to Task',
      description: 'Add a comment with updates to a task',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'comment',
              operation: 'createComment',
              taskId: '987654321',
              commentText: 'Just completed the initial mockups. Ready for review!'
            }
          }
        ]
      }
    },
    {
      name: 'Create Goal with Targets',
      description: 'Create a new goal with specific targets',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'goal',
              operation: 'createGoal',
              teamId: '123456',
              name: 'Q2 Sales Target',
              description: 'Achieve $500K in sales for Q2 2024',
              dueDate: '2024-06-30T23:59:59Z'
            }
          }
        ]
      }
    },
    {
      name: 'Bulk Task Assignment',
      description: 'Get tasks and assign them to team members based on workload',
      workflow: {
        nodes: [
          {
            name: 'ClickUp',
            type: 'n8n-nodes-base.clickup',
            parameters: {
              resource: 'task',
              operation: 'getAll',
              listId: '123456789',
              status: 'to do',
              limit: 20
            }
          }
        ]
      }
    }
  ]
};

export const clickupTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clickupTrigger',
  displayName: 'ClickUp Trigger',
  description: 'Triggers the workflow when ClickUp events occur, such as task creation, updates, or status changes.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['taskCreated'],
      description: 'The ClickUp events to trigger on',
      options: [
        { name: 'Task Created', value: 'taskCreated', description: 'When a new task is created' },
        { name: 'Task Updated', value: 'taskUpdated', description: 'When a task is updated' },
        { name: 'Task Status Changed', value: 'taskStatusChanged', description: 'When a task status changes' },
        { name: 'Task Assigned', value: 'taskAssigned', description: 'When a task is assigned to someone' },
        { name: 'Task Comment Added', value: 'taskCommentAdded', description: 'When a comment is added to a task' },
        { name: 'Task Priority Changed', value: 'taskPriorityChanged', description: 'When task priority changes' },
        { name: 'Task Due Date Changed', value: 'taskDueDateChanged', description: 'When task due date changes' },
        { name: 'List Created', value: 'listCreated', description: 'When a new list is created' },
        { name: 'Folder Created', value: 'folderCreated', description: 'When a new folder is created' },
        { name: 'Goal Created', value: 'goalCreated', description: 'When a new goal is created' }
      ]
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ClickUp team ID to monitor'
    },
    {
      name: 'spaceId',
      displayName: 'Space ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific space ID to monitor (optional)'
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific list ID to monitor (optional)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when ClickUp events occur'
    }
  ],
  credentials: ['clickUpApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Task Created Alert',
      description: 'Trigger when new tasks are created in a specific list',
      workflow: {
        nodes: [
          {
            name: 'ClickUp Trigger',
            type: 'n8n-nodes-base.clickupTrigger',
            parameters: {
              events: ['taskCreated'],
              teamId: '123456',
              listId: '789012345'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const clickupNodes: NodeTypeInfo[] = [clickupNode, clickupTriggerNode];

// Export ClickUp priority levels
export const clickupPriorities = {
  '1': 'Urgent',
  '2': 'High',
  '3': 'Normal',
  '4': 'Low'
};

// Export common ClickUp operations
export const clickupOperations = [
  'create_task',
  'update_task',
  'get_tasks',
  'create_list',
  'track_time',
  'add_comment',
  'set_status',
  'assign_task',
  'create_goal',
  'get_spaces'
];