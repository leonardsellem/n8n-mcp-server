import { NodeTypeInfo } from '../../node-types.js';

export const microsoftToDoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftToDo',
  displayName: 'Microsoft To Do',
  description: 'Use the Microsoft To Do node to automate work in Microsoft To Do, and integrate Microsoft To Do with other applications. Supports creating, updating, deleting, and getting linked resources, lists, and tasks.',
  category: 'Productivity',
  subcategory: 'Task Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'task',
      description: 'The resource to operate on',
      options: [
        { name: 'Task', value: 'task', description: 'Work with tasks in To Do lists' },
        { name: 'Task List', value: 'list', description: 'Manage To Do lists' },
        { name: 'Linked Resource', value: 'linkedResource', description: 'Handle linked resources for tasks' }
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
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get All', value: 'getAll', description: 'Get multiple items' },
        { name: 'Update', value: 'update', description: 'Update an item' }
      ]
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the task list to work with'
    },
    {
      name: 'taskId',
      displayName: 'Task ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the task to work with'
    },
    {
      name: 'linkedResourceId',
      displayName: 'Linked Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the linked resource to work with'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title of the task or list'
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'Body content of the task'
    },
    {
      name: 'bodyType',
      displayName: 'Body Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'Type of body content',
      options: [
        { name: 'Text', value: 'text', description: 'Plain text content' },
        { name: 'HTML', value: 'html', description: 'HTML formatted content' }
      ]
    },
    {
      name: 'importance',
      displayName: 'Importance',
      type: 'options',
      required: false,
      default: 'normal',
      description: 'Importance level of the task',
      options: [
        { name: 'Low', value: 'low', description: 'Low importance' },
        { name: 'Normal', value: 'normal', description: 'Normal importance' },
        { name: 'High', value: 'high', description: 'High importance' }
      ]
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'notStarted',
      description: 'Status of the task',
      options: [
        { name: 'Not Started', value: 'notStarted', description: 'Task not started' },
        { name: 'In Progress', value: 'inProgress', description: 'Task in progress' },
        { name: 'Completed', value: 'completed', description: 'Task completed' },
        { name: 'Waiting on Others', value: 'waitingOnOthers', description: 'Waiting on others' },
        { name: 'Deferred', value: 'deferred', description: 'Task deferred' }
      ]
    },
    {
      name: 'dueDateTime',
      displayName: 'Due Date Time',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Due date and time for the task'
    },
    {
      name: 'reminderDateTime',
      displayName: 'Reminder Date Time',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Reminder date and time for the task'
    },
    {
      name: 'startDateTime',
      displayName: 'Start Date Time',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Start date and time for the task'
    },
    {
      name: 'completedDateTime',
      displayName: 'Completed Date Time',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Completion date and time for the task'
    },
    {
      name: 'categories',
      displayName: 'Categories',
      type: 'string',
      required: false,
      default: '',
      description: 'Categories for the task (comma-separated)'
    },
    {
      name: 'isReminderOn',
      displayName: 'Reminder Enabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether reminder is enabled for the task'
    },
    {
      name: 'recurrence',
      displayName: 'Recurrence',
      type: 'string',
      required: false,
      default: '',
      description: 'Recurrence pattern for the task (JSON format)'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Display name for the list'
    },
    {
      name: 'isOwner',
      displayName: 'Is Owner',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the current user is the owner of the list'
    },
    {
      name: 'isShared',
      displayName: 'Is Shared',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the list is shared with other users'
    },
    {
      name: 'wellknownListName',
      displayName: 'Well-known List Name',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Well-known list name for default lists',
      options: [
        { name: 'None', value: 'none', description: 'Not a well-known list' },
        { name: 'Default Tasks', value: 'defaultTasks', description: 'Default tasks list' },
        { name: 'Flagged Emails', value: 'flaggedEmails', description: 'Flagged emails list' }
      ]
    },
    {
      name: 'webUrl',
      displayName: 'Web URL',
      type: 'string',
      required: false,
      default: '',
      description: 'Web URL for the linked resource'
    },
    {
      name: 'applicationName',
      displayName: 'Application Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Application name for the linked resource'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Display name for the linked resource'
    },
    {
      name: 'externalId',
      displayName: 'External ID',
      type: 'string',
      required: false,
      default: '',
      description: 'External ID for the linked resource'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
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
      description: 'The processed Microsoft To Do data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Task',
      description: 'Create a new task in Microsoft To Do',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'task',
              operation: 'create',
              listId: 'list_id_here',
              title: 'Complete project proposal',
              body: 'Prepare the project proposal for Q1 2024 initiatives',
              bodyType: 'text',
              importance: 'high',
              dueDateTime: '2024-01-15T10:00:00Z',
              isReminderOn: true,
              reminderDateTime: '2024-01-14T09:00:00Z'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Tasks',
      description: 'Get all tasks from a specific To Do list',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'task',
              operation: 'getAll',
              listId: 'list_id_here',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Update Task Status',
      description: 'Update the status of an existing task',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'task',
              operation: 'update',
              listId: 'list_id_here',
              taskId: 'task_id_here',
              status: 'completed',
              completedDateTime: '2024-01-10T14:30:00Z'
            }
          }
        ]
      }
    },
    {
      name: 'Create Task List',
      description: 'Create a new task list in Microsoft To Do',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'list',
              operation: 'create',
              displayName: 'Project Tasks',
              isShared: false
            }
          }
        ]
      }
    },
    {
      name: 'Get All Lists',
      description: 'Get all task lists from Microsoft To Do',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'list',
              operation: 'getAll',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Add Linked Resource',
      description: 'Add a linked resource to a task',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoftToDo',
            parameters: {
              resource: 'linkedResource',
              operation: 'create',
              listId: 'list_id_here',
              taskId: 'task_id_here',
              webUrl: 'https://example.com/document',
              applicationName: 'SharePoint',
              displayName: 'Project Documentation',
              externalId: 'doc_12345'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Microsoft To Do node
export const microsoftToDoActions = [
  'create_task',
  'delete_task',
  'get_task',
  'get_all_tasks',
  'update_task',
  'create_list',
  'delete_list',
  'get_list',
  'get_all_lists',
  'update_list',
  'create_linked_resource',
  'delete_linked_resource',
  'get_linked_resource',
  'get_all_linked_resources',
  'update_linked_resource'
];

// Export the node as default for easier importing
export default microsoftToDoNode;