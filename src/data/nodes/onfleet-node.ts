import { NodeTypeInfo } from '../node-types.js';

export const onfleetNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.onfleet',
  displayName: 'Onfleet',
  description: 'Use the Onfleet node to automate work in Onfleet, and integrate Onfleet with other applications. n8n has built-in support for a wide range of Onfleet features, including creating and deleting tasks in Onfleet as well as retrieving organizations\' details.',
  category: 'Operations',
  subcategory: 'Logistics & Delivery',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'task',
      description: 'The resource to operate on',
      options: [
        { name: 'Admin', value: 'admin', description: 'Work with Onfleet admins' },
        { name: 'Container', value: 'container', description: 'Manage task containers' },
        { name: 'Destination', value: 'destination', description: 'Work with destinations' },
        { name: 'Hub', value: 'hub', description: 'Manage Onfleet hubs' },
        { name: 'Organization', value: 'organization', description: 'Work with organization details' },
        { name: 'Recipient', value: 'recipient', description: 'Manage recipients' },
        { name: 'Task', value: 'task', description: 'Handle Onfleet tasks' },
        { name: 'Team', value: 'team', description: 'Manage teams' },
        { name: 'Worker', value: 'worker', description: 'Work with workers' }
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
        // Admin operations
        { name: 'Create', value: 'create', description: 'Create a new Onfleet admin' },
        { name: 'Delete', value: 'delete', description: 'Delete an Onfleet admin' },
        { name: 'Get All', value: 'getAll', description: 'Get all Onfleet admins' },
        { name: 'Update', value: 'update', description: 'Update an Onfleet admin' },
        // Container operations
        { name: 'Add Task', value: 'addTask', description: 'Add task at index (or append)' },
        { name: 'Get', value: 'get', description: 'Get container information' },
        { name: 'Replace Tasks', value: 'replaceTasks', description: 'Fully replace a container\'s tasks' },
        // Destination operations
        { name: 'Get Destination', value: 'getDestination', description: 'Get a specific destination' },
        // Hub operations
        { name: 'Create Hub', value: 'createHub', description: 'Create a new Onfleet hub' },
        { name: 'Get All Hubs', value: 'getAllHubs', description: 'Get all Onfleet hubs' },
        { name: 'Update Hub', value: 'updateHub', description: 'Update an Onfleet hub' },
        // Organization operations
        { name: 'Get Organization', value: 'getOrganization', description: 'Retrieve your own organization\'s details' },
        { name: 'Get Connected Organization', value: 'getConnectedOrganization', description: 'Retrieve the details of an organization with which you are connected' },
        // Recipient operations
        { name: 'Create Recipient', value: 'createRecipient', description: 'Create a new Onfleet recipient' },
        { name: 'Get Recipient', value: 'getRecipient', description: 'Get a specific Onfleet recipient' },
        { name: 'Update Recipient', value: 'updateRecipient', description: 'Update an Onfleet recipient' },
        // Task operations
        { name: 'Clone', value: 'clone', description: 'Clone an Onfleet task' },
        { name: 'Force Complete', value: 'forceComplete', description: 'Force-complete a started Onfleet task' },
        { name: 'Get All Tasks', value: 'getAllTasks', description: 'Get all Onfleet tasks' },
        { name: 'Get Task', value: 'getTask', description: 'Get a specific Onfleet task' },
        // Team operations
        { name: 'Auto Dispatch', value: 'autoDispatch', description: 'Automatically dispatch tasks assigned to a team to on-duty drivers' },
        { name: 'Create Team', value: 'createTeam', description: 'Create a new Onfleet team' },
        { name: 'Delete Team', value: 'deleteTeam', description: 'Delete an Onfleet team' },
        { name: 'Get Team', value: 'getTeam', description: 'Get a specific Onfleet team' },
        { name: 'Get All Teams', value: 'getAllTeams', description: 'Get all Onfleet teams' },
        { name: 'Get Estimated Times', value: 'getEstimatedTimes', description: 'Get estimated times for upcoming tasks for a team, returns a selected driver' },
        { name: 'Update Team', value: 'updateTeam', description: 'Update an Onfleet team' },
        // Worker operations
        { name: 'Create Worker', value: 'createWorker', description: 'Create a new Onfleet worker' },
        { name: 'Delete Worker', value: 'deleteWorker', description: 'Delete an Onfleet worker' },
        { name: 'Get Worker', value: 'getWorker', description: 'Get a specific Onfleet worker' },
        { name: 'Get All Workers', value: 'getAllWorkers', description: 'Get all Onfleet workers' },
        { name: 'Get Worker Schedule', value: 'getWorkerSchedule', description: 'Get a specific Onfleet worker schedule' },
        { name: 'Update Worker', value: 'updateWorker', description: 'Update an Onfleet worker' }
      ]
    },
    {
      name: 'adminId',
      displayName: 'Admin ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the admin to operate on'
    },
    {
      name: 'workerId',
      displayName: 'Worker ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the worker to operate on'
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
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team to operate on'
    },
    {
      name: 'hubId',
      displayName: 'Hub ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the hub to operate on'
    },
    {
      name: 'recipientId',
      displayName: 'Recipient ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the recipient to operate on'
    },
    {
      name: 'destinationId',
      displayName: 'Destination ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the destination to operate on'
    },
    {
      name: 'containerId',
      displayName: 'Container ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the container to operate on'
    },
    {
      name: 'organizationId',
      displayName: 'Organization ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the organization to operate on'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name for workers, teams, hubs, or recipients'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address for admins, workers, or recipients'
    },
    {
      name: 'phone',
      displayName: 'Phone',
      type: 'string',
      required: false,
      default: '',
      description: 'Phone number for workers or recipients'
    },
    {
      name: 'address',
      displayName: 'Address',
      type: 'string',
      required: false,
      default: '',
      description: 'Address for destinations, hubs, or tasks'
    },
    {
      name: 'location',
      displayName: 'Location',
      type: 'string',
      required: false,
      default: '',
      description: 'GPS coordinates in format "latitude,longitude"'
    },
    {
      name: 'notes',
      displayName: 'Notes',
      type: 'string',
      required: false,
      default: '',
      description: 'Notes or comments for tasks, recipients, or destinations'
    },
    {
      name: 'metadata',
      displayName: 'Metadata',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with custom metadata'
    },
    {
      name: 'vehicle',
      displayName: 'Vehicle',
      type: 'options',
      required: false,
      default: 'CAR',
      description: 'Vehicle type for workers',
      options: [
        { name: 'Car', value: 'CAR' },
        { name: 'Motorcycle', value: 'MOTORCYCLE' },
        { name: 'Bicycle', value: 'BICYCLE' },
        { name: 'Truck', value: 'TRUCK' }
      ]
    },
    {
      name: 'capacity',
      displayName: 'Capacity',
      type: 'number',
      required: false,
      default: 1,
      description: 'Worker capacity or team capacity'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'NORMAL',
      description: 'Task priority level',
      options: [
        { name: 'Low', value: 'LOW' },
        { name: 'Normal', value: 'NORMAL' },
        { name: 'High', value: 'HIGH' },
        { name: 'Urgent', value: 'URGENT' }
      ]
    },
    {
      name: 'completeAfter',
      displayName: 'Complete After',
      type: 'string',
      required: false,
      default: '',
      description: 'Earliest completion time (Unix timestamp in milliseconds)'
    },
    {
      name: 'completeBefore',
      displayName: 'Complete Before',
      type: 'string',
      required: false,
      default: '',
      description: 'Latest completion time (Unix timestamp in milliseconds)'
    },
    {
      name: 'autoAssign',
      displayName: 'Auto Assign',
      type: 'options',
      required: false,
      default: 'distance',
      description: 'Auto-assignment mode for tasks',
      options: [
        { name: 'Distance', value: 'distance' },
        { name: 'Time', value: 'time' },
        { name: 'None', value: 'none' }
      ]
    },
    {
      name: 'serviceTime',
      displayName: 'Service Time',
      type: 'number',
      required: false,
      default: 5,
      description: 'Expected service time in minutes'
    },
    {
      name: 'pickupTask',
      displayName: 'Pickup Task',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether this is a pickup task'
    },
    {
      name: 'dependencies',
      displayName: 'Dependencies',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of task IDs that must be completed first'
    },
    {
      name: 'quantity',
      displayName: 'Quantity',
      type: 'number',
      required: false,
      default: 1,
      description: 'Quantity for task items'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 64,
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
      description: 'The processed Onfleet data'
    }
  ],
  credentials: ['onfleetApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Task',
      description: 'Create a new delivery task in Onfleet',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'task',
              operation: 'create',
              address: '123 Main St, New York, NY 10001',
              notes: 'Please ring doorbell',
              priority: 'NORMAL',
              serviceTime: 5,
              autoAssign: 'distance'
            }
          }
        ]
      }
    },
    {
      name: 'Create Worker',
      description: 'Create a new worker in Onfleet',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'worker',
              operation: 'createWorker',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+1234567890',
              vehicle: 'CAR',
              capacity: 15
            }
          }
        ]
      }
    },
    {
      name: 'Get All Tasks',
      description: 'Retrieve all tasks from Onfleet',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'task',
              operation: 'getAllTasks',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Create Team',
      description: 'Create a new team in Onfleet',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'team',
              operation: 'createTeam',
              name: 'Delivery Team A',
              hubId: 'hub123456'
            }
          }
        ]
      }
    },
    {
      name: 'Update Worker',
      description: 'Update an existing worker',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'worker',
              operation: 'updateWorker',
              workerId: 'worker123456',
              name: 'John Smith',
              capacity: 20
            }
          }
        ]
      }
    },
    {
      name: 'Create Recipient',
      description: 'Create a new recipient',
      workflow: {
        nodes: [
          {
            name: 'Onfleet',
            type: 'n8n-nodes-base.onfleet',
            parameters: {
              resource: 'recipient',
              operation: 'createRecipient',
              name: 'Jane Customer',
              phone: '+1234567890',
              email: 'jane@example.com',
              notes: 'Preferred delivery time: afternoon'
            }
          }
        ]
      }
    }
  ]
};

export const onfleetTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.onfleettrigger',
  displayName: 'Onfleet Trigger',
  description: 'Use the Onfleet Trigger node to respond to events in Onfleet and integrate Onfleet with other applications. Onfleet is a logistics platform offering a last-mile delivery solution.',
  category: 'Operations',
  subcategory: 'Logistics & Delivery',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['taskCreated'],
      description: 'The Onfleet events to trigger on',
      options: [
        { name: 'SMS Recipient Opt Out', value: 'smsRecipientOptOut', description: 'Triggered when a recipient opts out of SMS notifications' },
        { name: 'SMS Recipient Response Missed', value: 'smsRecipientResponseMissed', description: 'Triggered when an SMS recipient response is missed' },
        { name: 'Task Arrival', value: 'taskArrival', description: 'Triggered when a worker arrives at a task location' },
        { name: 'Task Assigned', value: 'taskAssigned', description: 'Triggered when a task is assigned to a worker' },
        { name: 'Task Cloned', value: 'taskCloned', description: 'Triggered when a task is cloned' },
        { name: 'Task Completed', value: 'taskCompleted', description: 'Triggered when a task is completed' },
        { name: 'Task Created', value: 'taskCreated', description: 'Triggered when a new task is created' },
        { name: 'Task Delayed', value: 'taskDelayed', description: 'Triggered when a task is delayed' },
        { name: 'Task ETA', value: 'taskEta', description: 'Triggered when task ETA is updated' },
        { name: 'Task Failed', value: 'taskFailed', description: 'Triggered when a task fails' },
        { name: 'Task Started', value: 'taskStarted', description: 'Triggered when a task is started' },
        { name: 'Task Unassigned', value: 'taskUnassigned', description: 'Triggered when a task is unassigned from a worker' },
        { name: 'Task Updated', value: 'taskUpdated', description: 'Triggered when a task is updated' },
        { name: 'Worker Created', value: 'workerCreated', description: 'Triggered when a new worker is created' },
        { name: 'Worker Deleted', value: 'workerDeleted', description: 'Triggered when a worker is deleted' },
        { name: 'Worker Duty', value: 'workerDuty', description: 'Triggered when a worker duty status changes' }
      ]
    },
    {
      name: 'webhookId',
      displayName: 'Webhook ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The webhook ID (automatically managed)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Onfleet events occur'
    }
  ],
  credentials: ['onfleetApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Task Creation',
      description: 'Trigger workflow when new tasks are created',
      workflow: {
        nodes: [
          {
            name: 'Onfleet Trigger',
            type: 'n8n-nodes-base.onfleettrigger',
            parameters: {
              events: ['taskCreated']
            }
          }
        ]
      }
    },
    {
      name: 'Track Task Completion',
      description: 'Trigger when tasks are completed',
      workflow: {
        nodes: [
          {
            name: 'Onfleet Trigger',
            type: 'n8n-nodes-base.onfleettrigger',
            parameters: {
              events: ['taskCompleted']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Worker Status',
      description: 'Trigger when worker duty status changes',
      workflow: {
        nodes: [
          {
            name: 'Onfleet Trigger',
            type: 'n8n-nodes-base.onfleettrigger',
            parameters: {
              events: ['workerDuty', 'workerCreated']
            }
          }
        ]
      }
    },
    {
      name: 'Track Task Updates',
      description: 'Trigger on task lifecycle events',
      workflow: {
        nodes: [
          {
            name: 'Onfleet Trigger',
            type: 'n8n-nodes-base.onfleettrigger',
            parameters: {
              events: ['taskAssigned', 'taskStarted', 'taskCompleted', 'taskFailed']
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const onfleetNodes: NodeTypeInfo[] = [onfleetNode, onfleetTriggerNode];

// Export individual actions for the regular Onfleet node
export const onfleetActions = [
  // Admin actions
  'create_admin',
  'delete_admin',
  'get_all_admins',
  'update_admin',
  // Container actions
  'add_task_to_container',
  'get_container',
  'replace_container_tasks',
  // Destination actions
  'create_destination',
  'get_destination',
  // Hub actions
  'create_hub',
  'get_all_hubs',
  'update_hub',
  // Organization actions
  'get_organization',
  'get_connected_organization',
  // Recipient actions
  'create_recipient',
  'get_recipient',
  'update_recipient',
  // Task actions
  'create_task',
  'clone_task',
  'force_complete_task',
  'delete_task',
  'get_all_tasks',
  'get_task',
  'update_task',
  // Team actions
  'auto_dispatch_team',
  'create_team',
  'delete_team',
  'get_team',
  'get_all_teams',
  'get_team_estimated_times',
  'update_team',
  // Worker actions
  'create_worker',
  'delete_worker',
  'get_worker',
  'get_all_workers',
  'get_worker_schedule',
  'update_worker'
];

// Export trigger events
export const onfleetTriggers = [
  'sms_recipient_opt_out',
  'sms_recipient_response_missed',
  'task_arrival',
  'task_assigned',
  'task_cloned',
  'task_completed',
  'task_created',
  'task_delayed',
  'task_eta',
  'task_failed',
  'task_started',
  'task_unassigned',
  'task_updated',
  'worker_created',
  'worker_deleted',
  'worker_duty'
];