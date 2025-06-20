import { NodeTypeInfo } from '../node-types.js';

export const asanaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.asana',
  displayName: 'Asana',
  description: 'Use the Asana node to automate work in Asana, and integrate Asana with other applications. n8n has built-in support for a wide range of Asana features, including creating, updating, deleting, and getting users, tasks, projects, and subtasks.',
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
        { name: 'Project', value: 'project', description: 'Work with Asana projects' },
        { name: 'Subtask', value: 'subtask', description: 'Work with subtasks' },
        { name: 'Task', value: 'task', description: 'Work with Asana tasks' },
        { name: 'Task Comment', value: 'taskComment', description: 'Manage task comments' },
        { name: 'Task Tag', value: 'taskTag', description: 'Manage task tags' },
        { name: 'Task Project', value: 'taskProject', description: 'Manage task-project relationships' },
        { name: 'User', value: 'user', description: 'Work with Asana users' }
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
        // Project operations
        { name: 'Create', value: 'create', description: 'Create a new project' },
        { name: 'Delete', value: 'delete', description: 'Delete a project' },
        { name: 'Get', value: 'get', description: 'Get a project' },
        { name: 'Get All', value: 'getAll', description: 'Get all projects' },
        { name: 'Update', value: 'update', description: 'Update a project' },
        // Subtask operations
        { name: 'Create', value: 'create', description: 'Create a subtask' },
        { name: 'Get All', value: 'getAll', description: 'Get all subtasks' },
        // Task operations
        { name: 'Create', value: 'create', description: 'Create a task' },
        { name: 'Delete', value: 'delete', description: 'Delete a task' },
        { name: 'Get', value: 'get', description: 'Get a task' },
        { name: 'Get All', value: 'getAll', description: 'Get all tasks' },
        { name: 'Move', value: 'move', description: 'Move a task' },
        { name: 'Search', value: 'search', description: 'Search for tasks' },
        { name: 'Update', value: 'update', description: 'Update a task' },
        // Task Comment operations
        { name: 'Add', value: 'add', description: 'Add a comment to a task' },
        { name: 'Remove', value: 'remove', description: 'Remove a comment from a task' },
        // Task Tag operations
        { name: 'Add', value: 'add', description: 'Add a tag to a task' },
        { name: 'Remove', value: 'remove', description: 'Remove a tag from a task' },
        // Task Project operations
        { name: 'Add', value: 'add', description: 'Add a task to a project' },
        { name: 'Remove', value: 'remove', description: 'Remove a task from a project' },
        // User operations
        { name: 'Get', value: 'get', description: 'Get a user' },
        { name: 'Get All', value: 'getAll', description: 'Get all users' }
      ]
    },
    {
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the project to operate on'
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
      name: 'subtaskId',
      displayName: 'Subtask ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the subtask to operate on'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'commentId',
      displayName: 'Comment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the comment to operate on'
    },
    {
      name: 'tagId',
      displayName: 'Tag ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the tag to operate on'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the resource (project, task, etc.)'
    },
    {
      name: 'notes',
      displayName: 'Notes',
      type: 'string',
      required: false,
      default: '',
      description: 'Notes or description for the resource'
    },
    {
      name: 'completed',
      displayName: 'Completed',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the task is completed'
    },
    {
      name: 'assignee',
      displayName: 'Assignee',
      type: 'string',
      required: false,
      default: '',
      description: 'The user ID to assign the task to'
    },
    {
      name: 'followers',
      displayName: 'Followers',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of user IDs to follow the task'
    },
    {
      name: 'parent',
      displayName: 'Parent Task',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the parent task for subtasks'
    },
    {
      name: 'workspace',
      displayName: 'Workspace',
      type: 'string',
      required: false,
      default: '',
      description: 'The workspace ID'
    },
    {
      name: 'team',
      displayName: 'Team',
      type: 'string',
      required: false,
      default: '',
      description: 'The team ID'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'The due date for the task'
    },
    {
      name: 'dueTime',
      displayName: 'Due Time',
      type: 'string',
      required: false,
      default: '',
      description: 'The due time for the task'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'The start date for the task'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: '',
      description: 'The priority level of the task',
      options: [
        { name: 'Low', value: 'low' },
        { name: 'Normal', value: 'normal' },
        { name: 'High', value: 'high' },
        { name: 'Urgent', value: 'urgent' }
      ]
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of tag IDs'
    },
    {
      name: 'projects',
      displayName: 'Projects',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of project IDs'
    },
    {
      name: 'text',
      displayName: 'Comment Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text content for comments'
    },
    {
      name: 'color',
      displayName: 'Color',
      type: 'options',
      required: false,
      default: '',
      description: 'Color for projects or tags',
      options: [
        { name: 'Dark Pink', value: 'dark-pink' },
        { name: 'Dark Green', value: 'dark-green' },
        { name: 'Dark Blue', value: 'dark-blue' },
        { name: 'Dark Red', value: 'dark-red' },
        { name: 'Dark Teal', value: 'dark-teal' },
        { name: 'Dark Brown', value: 'dark-brown' },
        { name: 'Dark Orange', value: 'dark-orange' },
        { name: 'Dark Warm Gray', value: 'dark-warm-gray' },
        { name: 'Light Pink', value: 'light-pink' },
        { name: 'Light Green', value: 'light-green' },
        { name: 'Light Blue', value: 'light-blue' },
        { name: 'Light Red', value: 'light-red' },
        { name: 'Light Teal', value: 'light-teal' },
        { name: 'Light Brown', value: 'light-brown' },
        { name: 'Light Orange', value: 'light-orange' },
        { name: 'Light Warm Gray', value: 'light-warm-gray' }
      ]
    },
    {
      name: 'public',
      displayName: 'Public',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the project is public'
    },
    {
      name: 'archived',
      displayName: 'Archived',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the project is archived'
    },
    {
      name: 'owner',
      displayName: 'Owner',
      type: 'string',
      required: false,
      default: '',
      description: 'The owner user ID for the project'
    },
    {
      name: 'currentStatus',
      displayName: 'Current Status',
      type: 'string',
      required: false,
      default: '',
      description: 'Current status update for the project'
    },
    {
      name: 'htmlNotes',
      displayName: 'HTML Notes',
      type: 'string',
      required: false,
      default: '',
      description: 'HTML formatted notes'
    },
    {
      name: 'liked',
      displayName: 'Liked',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the task is liked'
    },
    {
      name: 'numLikes',
      displayName: 'Number of Likes',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of likes on the task'
    },
    {
      name: 'searchQuery',
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
      description: 'Search query for finding tasks'
    },
    {
      name: 'sortBy',
      displayName: 'Sort By',
      type: 'options',
      required: false,
      default: 'created_at',
      description: 'Field to sort results by',
      options: [
        { name: 'Created At', value: 'created_at' },
        { name: 'Modified At', value: 'modified_at' },
        { name: 'Completed At', value: 'completed_at' },
        { name: 'Due Date', value: 'due_date' },
        { name: 'Likes', value: 'likes' }
      ]
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
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
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
      description: 'The processed Asana data'
    }
  ],
  credentials: ['asanaApi', 'asanaOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Task',
      description: 'Create a new task in Asana',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'task',
              operation: 'create',
              name: 'New Task',
              notes: 'Task description here',
              assignee: 'user-id',
              projects: 'project-id'
            }
          }
        ]
      }
    },
    {
      name: 'Update Task',
      description: 'Update an existing Asana task',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'task',
              operation: 'update',
              taskId: '{{$json["gid"]}}',
              name: 'Updated Task Name',
              completed: true,
              notes: 'Updated description'
            }
          }
        ]
      }
    },
    {
      name: 'Create Project',
      description: 'Create a new project in Asana',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'project',
              operation: 'create',
              name: 'New Project',
              notes: 'Project description',
              team: 'team-id',
              public: false
            }
          }
        ]
      }
    },
    {
      name: 'Search Tasks',
      description: 'Search for tasks in Asana',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'task',
              operation: 'search',
              searchQuery: 'urgent',
              workspace: 'workspace-id',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Add Comment to Task',
      description: 'Add a comment to an existing task',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'taskComment',
              operation: 'add',
              taskId: '{{$json["gid"]}}',
              text: 'This is a comment on the task'
            }
          }
        ]
      }
    },
    {
      name: 'Create Subtask',
      description: 'Create a subtask under an existing task',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'subtask',
              operation: 'create',
              parent: '{{$json["gid"]}}',
              name: 'Subtask name',
              notes: 'Subtask description'
            }
          }
        ]
      }
    }
  ]
};

export const asanaTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.asanaTrigger',
  displayName: 'Asana Trigger',
  description: 'Asana is a web and mobile application designed to help teams organize, track, and manage their work.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'task',
      description: 'The resource to monitor for changes',
      options: [
        { name: 'Task', value: 'task', description: 'Monitor task events' },
        { name: 'Project', value: 'project', description: 'Monitor project events' },
        { name: 'Story', value: 'story', description: 'Monitor story events' }
      ]
    },
    {
      name: 'webhook_events',
      displayName: 'Webhook Events',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'The events to listen for',
      options: [
        { name: 'Added', value: 'added' },
        { name: 'Changed', value: 'changed' },
        { name: 'Deleted', value: 'deleted' },
        { name: 'Removed', value: 'removed' },
        { name: 'Undeleted', value: 'undeleted' }
      ]
    },
    {
      name: 'workspace',
      displayName: 'Workspace',
      type: 'string',
      required: false,
      default: '',
      description: 'The workspace to monitor'
    },
    {
      name: 'project',
      displayName: 'Project',
      type: 'string',
      required: false,
      default: '',
      description: 'The project to monitor'
    },
    {
      name: 'task',
      displayName: 'Task',
      type: 'string',
      required: false,
      default: '',
      description: 'The task to monitor'
    },
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with additional filters'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Asana events occur'
    }
  ],
  credentials: ['asanaApi', 'asanaOAuth2Api'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Task Changes',
      description: 'Trigger workflow when tasks are modified in a project',
      workflow: {
        nodes: [
          {
            name: 'Asana Trigger',
            type: 'n8n-nodes-base.asanaTrigger',
            parameters: {
              resource: 'task',
              webhook_events: ['changed', 'added'],
              project: 'your-project-id'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Project Updates',
      description: 'Trigger when project details are updated',
      workflow: {
        nodes: [
          {
            name: 'Asana Trigger',
            type: 'n8n-nodes-base.asanaTrigger',
            parameters: {
              resource: 'project',
              webhook_events: ['changed'],
              workspace: 'your-workspace-id'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Task Completion',
      description: 'Trigger when tasks are marked as completed',
      workflow: {
        nodes: [
          {
            name: 'Asana Trigger',
            type: 'n8n-nodes-base.asanaTrigger',
            parameters: {
              resource: 'task',
              webhook_events: ['changed'],
              project: 'your-project-id',
              filters: '{"completed": true}'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const asanaNodes: NodeTypeInfo[] = [asanaNode, asanaTriggerNode];

// Export individual actions for the regular Asana node
export const asanaActions = [
  // Project actions
  'create_project',
  'delete_project',
  'get_project',
  'get_all_projects',
  'update_project',
  // Subtask actions
  'create_subtask',
  'get_all_subtasks',
  // Task actions
  'create_task',
  'delete_task',
  'get_task',
  'get_all_tasks',
  'move_task',
  'search_tasks',
  'update_task',
  // Task Comment actions
  'add_task_comment',
  'remove_task_comment',
  // Task Tag actions
  'add_task_tag',
  'remove_task_tag',
  // Task Project actions
  'add_task_to_project',
  'remove_task_from_project',
  // User actions
  'get_user',
  'get_all_users'
];

// Export trigger events
export const asanaTriggers = [
  'task_added',
  'task_changed',
  'task_deleted',
  'task_removed',
  'task_undeleted',
  'project_added',
  'project_changed',
  'project_deleted',
  'project_removed',
  'project_undeleted',
  'story_added',
  'story_changed',
  'story_deleted',
  'story_removed',
  'story_undeleted'
];