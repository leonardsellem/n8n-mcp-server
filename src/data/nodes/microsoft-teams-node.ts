import { NodeTypeInfo } from '../node-types.js';

export const microsoftTeamsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftTeams',
  displayName: 'Microsoft Teams',
  description: 'Use the Microsoft Teams node to automate work in Microsoft Teams, and integrate Microsoft Teams with other applications. Supports creating and managing channels, messages, and tasks.',
  category: 'Communication',
  subcategory: 'Team Chat',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'channel',
      description: 'The resource to operate on',
      options: [
        { name: 'Channel', value: 'channel', description: 'Work with Teams channels' },
        { name: 'Channel Message', value: 'channelMessage', description: 'Handle messages in channels' },
        { name: 'Chat Message', value: 'chatMessage', description: 'Handle private chat messages' },
        { name: 'Task', value: 'task', description: 'Manage tasks in Teams' }
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
        { name: 'Get Many', value: 'getAll', description: 'Get multiple items' },
        { name: 'Update', value: 'update', description: 'Update an item' },
        { name: 'Send and Wait for Response', value: 'sendAndWait', description: 'Send message and wait for response' }
      ]
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team to work with'
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the channel to work with'
    },
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the message to work with'
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
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the chat to work with'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Display name for the channel or task'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the channel or task'
    },
    {
      name: 'channelType',
      displayName: 'Channel Type',
      type: 'options',
      required: false,
      default: 'standard',
      description: 'Type of channel to create',
      options: [
        { name: 'Standard', value: 'standard', description: 'Standard channel' },
        { name: 'Private', value: 'private', description: 'Private channel' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message content to send'
    },
    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'Type of message to send',
      options: [
        { name: 'Text', value: 'text', description: 'Plain text message' },
        { name: 'HTML', value: 'html', description: 'HTML formatted message' }
      ]
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject of the message'
    },
    {
      name: 'importance',
      displayName: 'Importance',
      type: 'options',
      required: false,
      default: 'normal',
      description: 'Importance level of the message',
      options: [
        { name: 'Low', value: 'low', description: 'Low importance' },
        { name: 'Normal', value: 'normal', description: 'Normal importance' },
        { name: 'High', value: 'high', description: 'High importance' }
      ]
    },
    {
      name: 'responseType',
      displayName: 'Response Type',
      type: 'options',
      required: false,
      default: 'approval',
      description: 'Type of response to wait for',
      options: [
        { name: 'Approval', value: 'approval', description: 'Approval/disapproval buttons' },
        { name: 'Free Text', value: 'freeText', description: 'Free text response form' },
        { name: 'Custom Form', value: 'customForm', description: 'Custom form with multiple fields' }
      ]
    },
    {
      name: 'limitWaitTime',
      displayName: 'Limit Wait Time',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to limit the wait time for responses'
    },
    {
      name: 'waitTimeLimit',
      displayName: 'Wait Time Limit',
      type: 'number',
      required: false,
      default: 3600,
      description: 'Maximum time to wait for response in seconds'
    },
    {
      name: 'approvalButtonText',
      displayName: 'Approval Button Text',
      type: 'string',
      required: false,
      default: 'Approve',
      description: 'Text for the approval button'
    },
    {
      name: 'disapprovalButtonText',
      displayName: 'Disapproval Button Text',
      type: 'string',
      required: false,
      default: 'Reject',
      description: 'Text for the disapproval button'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for the task'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Due date for the task'
    },
    {
      name: 'assignedTo',
      displayName: 'Assigned To',
      type: 'string',
      required: false,
      default: '',
      description: 'User ID to assign the task to'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'medium',
      description: 'Priority level of the task',
      options: [
        { name: 'Low', value: 'low', description: 'Low priority' },
        { name: 'Medium', value: 'medium', description: 'Medium priority' },
        { name: 'High', value: 'high', description: 'High priority' },
        { name: 'Urgent', value: 'urgent', description: 'Urgent priority' }
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
        { name: 'Waiting', value: 'waiting', description: 'Task waiting' },
        { name: 'Deferred', value: 'deferred', description: 'Task deferred' }
      ]
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
      description: 'The processed Microsoft Teams data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Channel',
      description: 'Create a new channel in Microsoft Teams',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'channel',
              operation: 'create',
              teamId: '19:team_id_here@thread.skype',
              displayName: 'New Project Channel',
              description: 'Channel for discussing the new project',
              channelType: 'standard'
            }
          }
        ]
      }
    },
    {
      name: 'Send Channel Message',
      description: 'Send a message to a Teams channel',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'channelMessage',
              operation: 'create',
              teamId: '19:team_id_here@thread.skype',
              channelId: '19:channel_id_here@thread.skype',
              message: 'Hello team! This is an automated message from n8n.',
              messageType: 'text'
            }
          }
        ]
      }
    },
    {
      name: 'Send Chat Message',
      description: 'Send a private chat message',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'chatMessage',
              operation: 'create',
              chatId: '19:chat_id_here@thread.v2',
              message: 'Hi! This is a private message from n8n workflow.',
              messageType: 'text'
            }
          }
        ]
      }
    },
    {
      name: 'Create Task',
      description: 'Create a new task in Microsoft Teams',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'task',
              operation: 'create',
              title: 'Review Project Documentation',
              description: 'Please review the project documentation and provide feedback',
              dueDate: '2024-01-15T10:00:00Z',
              priority: 'high',
              status: 'notStarted'
            }
          }
        ]
      }
    },
    {
      name: 'Send and Wait for Approval',
      description: 'Send a message and wait for approval response',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'chatMessage',
              operation: 'sendAndWait',
              chatId: '19:chat_id_here@thread.v2',
              message: 'Please approve the budget request for Q1 2024.',
              responseType: 'approval',
              approvalButtonText: 'Approve Budget',
              disapprovalButtonText: 'Reject Budget',
              limitWaitTime: true,
              waitTimeLimit: 7200
            }
          }
        ]
      }
    }
  ]
};

export const microsoftTeamsTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftTeamsTrigger',
  displayName: 'Microsoft Teams Trigger',
  description: 'Triggers the workflow when events occur in Microsoft Teams. Supports channel messages, chat messages, new channels, and team member changes.',
  category: 'Communication',
  subcategory: 'Team Chat',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'newChannelMessage',
      description: 'The event to trigger on',
      options: [
        { name: 'New Channel', value: 'newChannel', description: 'Trigger when a new channel is created' },
        { name: 'New Channel Message', value: 'newChannelMessage', description: 'Trigger when a new message is posted to a channel' },
        { name: 'New Chat', value: 'newChat', description: 'Trigger when a new chat is started' },
        { name: 'New Chat Message', value: 'newChatMessage', description: 'Trigger when a new message is posted to a chat' },
        { name: 'New Team Member', value: 'newTeamMember', description: 'Trigger when a new member joins a team' }
      ]
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team to monitor (leave empty to monitor all teams)'
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the channel to monitor (leave empty to monitor all channels)'
    },
    {
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the chat to monitor (leave empty to monitor all chats)'
    },
    {
      name: 'includeSystemMessages',
      displayName: 'Include System Messages',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to trigger on system messages (member added, left, etc.)'
    },
    {
      name: 'messageFilter',
      displayName: 'Message Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter messages by content (only trigger if message contains this text)'
    },
    {
      name: 'authorFilter',
      displayName: 'Author Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter messages by author (only trigger on messages from specific user)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Microsoft Teams events occur'
    }
  ],
  credentials: ['microsoftOAuth2'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Channel Messages',
      description: 'Trigger workflow when new messages are posted to any channel',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams Trigger',
            type: 'n8n-nodes-base.microsoftTeamsTrigger',
            parameters: {
              event: 'newChannelMessage',
              includeSystemMessages: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific Channel',
      description: 'Trigger workflow when new messages are posted to a specific channel',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams Trigger',
            type: 'n8n-nodes-base.microsoftTeamsTrigger',
            parameters: {
              event: 'newChannelMessage',
              teamId: '19:team_id_here@thread.skype',
              channelId: '19:channel_id_here@thread.skype',
              includeSystemMessages: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor New Team Members',
      description: 'Trigger workflow when new members join a team',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams Trigger',
            type: 'n8n-nodes-base.microsoftTeamsTrigger',
            parameters: {
              event: 'newTeamMember',
              teamId: '19:team_id_here@thread.skype'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Chat Messages with Filter',
      description: 'Trigger workflow when chat messages contain specific keywords',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams Trigger',
            type: 'n8n-nodes-base.microsoftTeamsTrigger',
            parameters: {
              event: 'newChatMessage',
              messageFilter: 'urgent',
              includeSystemMessages: false
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const microsoftTeamsNodes: NodeTypeInfo[] = [microsoftTeamsNode, microsoftTeamsTriggerNode];

// Export individual actions for the regular Microsoft Teams node
export const microsoftTeamsActions = [
  'create_channel',
  'delete_channel',
  'get_channel',
  'get_many_channels',
  'update_channel',
  'create_channel_message',
  'get_many_channel_messages',
  'create_chat_message',
  'get_chat_message',
  'get_many_chat_messages',
  'send_and_wait_for_response',
  'create_task',
  'delete_task',
  'get_task',
  'get_many_tasks',
  'update_task'
];

// Export trigger events
export const microsoftTeamsTriggers = [
  'new_channel',
  'new_channel_message',
  'new_chat',
  'new_chat_message',
  'new_team_member'
];