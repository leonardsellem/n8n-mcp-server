export const microsoftTeamsNodeData = {
  nodeType: 'n8n-nodes-base.microsoftTeams',
  displayName: 'Microsoft Teams',
  group: ['communication', 'collaboration'],
  version: 1,
  description: 'Interact with Microsoft Teams to automate channel management, messaging, and task operations',
  defaults: {
    name: 'Microsoft Teams',
    color: '#5A5AC4'
  },
  
  // Core node information
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'microsoftApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['microsoftOAuth2']
        }
      }
    }
  ],
  
  // Detailed operations and parameters
  operations: {
    channel: {
      displayName: 'Channel',
      operations: [
        {
          name: 'create',
          displayName: 'Create',
          description: 'Create a new channel in a team',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team where the channel will be created'
            },
            {
              displayName: 'Channel Name',
              name: 'displayName',
              type: 'string',
              required: true,
              description: 'The name of the channel'
            },
            {
              displayName: 'Description',
              name: 'description',
              type: 'string',
              description: 'Optional description for the channel'
            },
            {
              displayName: 'Channel Type',
              name: 'membershipType',
              type: 'options',
              options: [
                {
                  name: 'Standard',
                  value: 'standard'
                },
                {
                  name: 'Private',
                  value: 'private'
                }
              ],
              default: 'standard',
              description: 'The type of channel to create'
            }
          ]
        },
        {
          name: 'delete',
          displayName: 'Delete',
          description: 'Delete a channel from a team',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team containing the channel'
            },
            {
              displayName: 'Channel ID',
              name: 'channelId',
              type: 'string',
              required: true,
              description: 'The ID of the channel to delete'
            }
          ]
        },
        {
          name: 'get',
          displayName: 'Get',
          description: 'Get information about a specific channel',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team containing the channel'
            },
            {
              displayName: 'Channel ID',
              name: 'channelId',
              type: 'string',
              required: true,
              description: 'The ID of the channel to retrieve'
            }
          ]
        },
        {
          name: 'getMany',
          displayName: 'Get Many',
          description: 'Get multiple channels from a team',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team to get channels from'
            },
            {
              displayName: 'Limit',
              name: 'limit',
              type: 'number',
              default: 50,
              description: 'Maximum number of channels to return'
            }
          ]
        },
        {
          name: 'update',
          displayName: 'Update',
          description: 'Update a channel in a team',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team containing the channel'
            },
            {
              displayName: 'Channel ID',
              name: 'channelId',
              type: 'string',
              required: true,
              description: 'The ID of the channel to update'
            },
            {
              displayName: 'Channel Name',
              name: 'displayName',
              type: 'string',
              description: 'The new name of the channel'
            },
            {
              displayName: 'Description',
              name: 'description',
              type: 'string',
              description: 'The new description for the channel'
            }
          ]
        }
      ]
    },
    channelMessage: {
      displayName: 'Channel Message',
      operations: [
        {
          name: 'create',
          displayName: 'Create',
          description: 'Send a message to a channel',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team containing the channel'
            },
            {
              displayName: 'Channel ID',
              name: 'channelId',
              type: 'string',
              required: true,
              description: 'The ID of the channel to send message to'
            },
            {
              displayName: 'Message Type',
              name: 'messageType',
              type: 'options',
              options: [
                {
                  name: 'Text',
                  value: 'text'
                },
                {
                  name: 'HTML',
                  value: 'html'
                }
              ],
              default: 'text',
              description: 'The type of message content'
            },
            {
              displayName: 'Message',
              name: 'body',
              type: 'string',
              required: true,
              description: 'The content of the message'
            },
            {
              displayName: 'Include Link to Workflow',
              name: 'includeLink',
              type: 'boolean',
              default: false,
              description: 'Whether to include a link to the n8n workflow'
            }
          ]
        },
        {
          name: 'getMany',
          displayName: 'Get Many',
          description: 'Get messages from a channel',
          parameters: [
            {
              displayName: 'Team ID',
              name: 'teamId',
              type: 'string',
              required: true,
              description: 'The ID of the team containing the channel'
            },
            {
              displayName: 'Channel ID',
              name: 'channelId',
              type: 'string',
              required: true,
              description: 'The ID of the channel to get messages from'
            },
            {
              displayName: 'Limit',
              name: 'limit',
              type: 'number',
              default: 50,
              description: 'Maximum number of messages to return'
            }
          ]
        }
      ]
    },
    chatMessage: {
      displayName: 'Chat Message',
      operations: [
        {
          name: 'create',
          displayName: 'Create',
          description: 'Send a message to a chat',
          parameters: [
            {
              displayName: 'Chat ID',
              name: 'chatId',
              type: 'string',
              required: true,
              description: 'The ID of the chat to send message to'
            },
            {
              displayName: 'Message Type',
              name: 'messageType',
              type: 'options',
              options: [
                {
                  name: 'Text',
                  value: 'text'
                },
                {
                  name: 'HTML',
                  value: 'html'
                }
              ],
              default: 'text',
              description: 'The type of message content'
            },
            {
              displayName: 'Message',
              name: 'body',
              type: 'string',
              required: true,
              description: 'The content of the message'
            }
          ]
        },
        {
          name: 'get',
          displayName: 'Get',
          description: 'Get a specific message from a chat',
          parameters: [
            {
              displayName: 'Chat ID',
              name: 'chatId',
              type: 'string',
              required: true,
              description: 'The ID of the chat containing the message'
            },
            {
              displayName: 'Message ID',
              name: 'messageId',
              type: 'string',
              required: true,
              description: 'The ID of the message to retrieve'
            }
          ]
        },
        {
          name: 'getMany',
          displayName: 'Get Many',
          description: 'Get messages from a chat',
          parameters: [
            {
              displayName: 'Chat ID',
              name: 'chatId',
              type: 'string',
              required: true,
              description: 'The ID of the chat to get messages from'
            },
            {
              displayName: 'Limit',
              name: 'limit',
              type: 'number',
              default: 50,
              description: 'Maximum number of messages to return'
            }
          ]
        },
        {
          name: 'sendAndWaitForResponse',
          displayName: 'Send and Wait for Response',
          description: 'Send a message and pause workflow execution until a response is received',
          parameters: [
            {
              displayName: 'Chat ID',
              name: 'chatId',
              type: 'string',
              required: true,
              description: 'The ID of the chat to send message to'
            },
            {
              displayName: 'Message',
              name: 'body',
              type: 'string',
              required: true,
              description: 'The content of the message'
            },
            {
              displayName: 'Response Type',
              name: 'responseType',
              type: 'options',
              options: [
                {
                  name: 'Approval',
                  value: 'approval',
                  description: 'Users can approve or disapprove from within the message'
                },
                {
                  name: 'Free Text',
                  value: 'freeText',
                  description: 'Users can submit a response with a form'
                },
                {
                  name: 'Custom Form',
                  value: 'customForm',
                  description: 'Users can submit a response with a custom form'
                }
              ],
              required: true,
              description: 'The type of response expected'
            },
            {
              displayName: 'Limit Wait Time',
              name: 'limitWaitTime',
              type: 'boolean',
              default: false,
              description: 'Whether to automatically resume execution after a time limit'
            },
            {
              displayName: 'Wait Time',
              name: 'waitTime',
              type: 'number',
              displayOptions: {
                show: {
                  limitWaitTime: [true]
                }
              },
              default: 3600,
              description: 'Time in seconds to wait before automatically resuming'
            },
            {
              displayName: 'Append n8n Attribution',
              name: 'appendAttribution',
              type: 'boolean',
              default: true,
              description: 'Whether to mention that the message was sent automatically with n8n'
            }
          ]
        }
      ]
    },
    task: {
      displayName: 'Task',
      operations: [
        {
          name: 'create',
          displayName: 'Create',
          description: 'Create a new task',
          parameters: [
            {
              displayName: 'Task Title',
              name: 'title',
              type: 'string',
              required: true,
              description: 'The title of the task'
            },
            {
              displayName: 'Group ID',
              name: 'groupId',
              type: 'string',
              required: true,
              description: 'The ID of the group to create the task in'
            },
            {
              displayName: 'Bucket ID',
              name: 'bucketId',
              type: 'string',
              description: 'The ID of the bucket to create the task in'
            },
            {
              displayName: 'Due Date',
              name: 'dueDateTime',
              type: 'dateTime',
              description: 'The due date and time for the task'
            },
            {
              displayName: 'Assigned To',
              name: 'assignedTo',
              type: 'string',
              description: 'User ID to assign the task to'
            }
          ]
        },
        {
          name: 'delete',
          displayName: 'Delete',
          description: 'Delete a task',
          parameters: [
            {
              displayName: 'Task ID',
              name: 'taskId',
              type: 'string',
              required: true,
              description: 'The ID of the task to delete'
            }
          ]
        },
        {
          name: 'get',
          displayName: 'Get',
          description: 'Get information about a specific task',
          parameters: [
            {
              displayName: 'Task ID',
              name: 'taskId',
              type: 'string',
              required: true,
              description: 'The ID of the task to retrieve'
            }
          ]
        },
        {
          name: 'getMany',
          displayName: 'Get Many',
          description: 'Get multiple tasks',
          parameters: [
            {
              displayName: 'Group ID',
              name: 'groupId',
              type: 'string',
              required: true,
              description: 'The ID of the group to get tasks from'
            },
            {
              displayName: 'Limit',
              name: 'limit',
              type: 'number',
              default: 50,
              description: 'Maximum number of tasks to return'
            }
          ]
        },
        {
          name: 'update',
          displayName: 'Update',
          description: 'Update a task',
          parameters: [
            {
              displayName: 'Task ID',
              name: 'taskId',
              type: 'string',
              required: true,
              description: 'The ID of the task to update'
            },
            {
              displayName: 'Task Title',
              name: 'title',
              type: 'string',
              description: 'The new title of the task'
            },
            {
              displayName: 'Due Date',
              name: 'dueDateTime',
              type: 'dateTime',
              description: 'The new due date and time for the task'
            },
            {
              displayName: 'Completion Status',
              name: 'percentComplete',
              type: 'number',
              description: 'The completion percentage (0-100)'
            }
          ]
        }
      ]
    }
  },

  // Microsoft Teams Trigger information
  trigger: {
    nodeType: 'n8n-nodes-base.microsoftTeamsTrigger',
    displayName: 'Microsoft Teams Trigger',
    description: 'Respond to events in Microsoft Teams',
    events: [
      {
        name: 'New Channel',
        value: 'newChannel',
        description: 'Triggers when a new channel is created'
      },
      {
        name: 'New Channel Message',
        value: 'newChannelMessage',
        description: 'Triggers when a new message is posted to a channel'
      },
      {
        name: 'New Chat',
        value: 'newChat',
        description: 'Triggers when a new chat is created'
      },
      {
        name: 'New Chat Message',
        value: 'newChatMessage',
        description: 'Triggers when a new message is posted to a chat'
      },
      {
        name: 'New Team Member',
        value: 'newTeamMember',
        description: 'Triggers when a new member is added to a team'
      }
    ]
  },

  // Authentication and credentials
  authentication: {
    type: 'microsoftOAuth2',
    displayName: 'Microsoft OAuth2',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/microsoft/',
    properties: [
      {
        displayName: 'Grant Type',
        name: 'grantType',
        type: 'options',
        options: [
          {
            name: 'Authorization Code',
            value: 'authorizationCode'
          }
        ],
        default: 'authorizationCode'
      },
      {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        required: true
      },
      {
        displayName: 'Client Secret',
        name: 'clientSecret',
        type: 'string',
        required: true,
        typeOptions: {
          password: true
        }
      }
    ],
    scopes: [
      'https://graph.microsoft.com/Channel.ReadWrite.All',
      'https://graph.microsoft.com/ChannelMessage.Read.All',
      'https://graph.microsoft.com/ChannelMessage.Send',
      'https://graph.microsoft.com/Chat.Read',
      'https://graph.microsoft.com/Chat.ReadWrite',
      'https://graph.microsoft.com/ChatMessage.Read',
      'https://graph.microsoft.com/ChatMessage.Send',
      'https://graph.microsoft.com/Group.Read.All',
      'https://graph.microsoft.com/Tasks.ReadWrite',
      'https://graph.microsoft.com/Team.ReadBasic.All',
      'https://graph.microsoft.com/TeamMember.Read.All'
    ]
  },

  // AI capabilities
  aiTool: {
    supported: true,
    description: 'This node can be used as an AI tool with automatic parameter setting',
    parameters: [
      'teamId',
      'channelId',
      'chatId',
      'messageType',
      'body',
      'responseType'
    ]
  },

  // Usage examples and templates
  examples: [
    {
      name: 'Send Teams notification',
      description: 'Send a notification message to a Microsoft Teams channel',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'channelMessage',
              operation: 'create',
              teamId: '{{$json.teamId}}',
              channelId: '{{$json.channelId}}',
              messageType: 'text',
              body: 'Automated notification: {{$json.message}}'
            }
          }
        ]
      }
    },
    {
      name: 'Create approval workflow',
      description: 'Send a message and wait for approval before continuing workflow',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'chatMessage',
              operation: 'sendAndWaitForResponse',
              chatId: '{{$json.chatId}}',
              body: 'Please approve this request: {{$json.requestDetails}}',
              responseType: 'approval',
              limitWaitTime: true,
              waitTime: 3600
            }
          }
        ]
      }
    },
    {
      name: 'Manage team tasks',
      description: 'Create and update tasks in Microsoft Teams',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'task',
              operation: 'create',
              title: '{{$json.taskTitle}}',
              groupId: '{{$json.groupId}}',
              dueDateTime: '{{$json.dueDate}}',
              assignedTo: '{{$json.assigneeId}}'
            }
          }
        ]
      }
    }
  ],

  // Related templates and workflows
  templates: [
    {
      id: 680,
      name: 'Create, update and send a message to a channel in Microsoft Teams',
      author: 'amudhan',
      url: 'https://n8n.io/workflows/680-create-update-and-send-a-message-to-a-channel-in-microsoft-teams/'
    },
    {
      id: 2054,
      name: 'Meraki Packet Loss and Latency Alerts to Microsoft Teams',
      author: 'Gavin',
      url: 'https://n8n.io/workflows/2054-meraki-packet-loss-and-latency-alerts-to-microsoft-teams/'
    },
    {
      id: 2352,
      name: 'Create Teams Notifications for new Tickets in ConnectWise with Redis',
      author: 'Gavin',
      url: 'https://n8n.io/workflows/2352-create-teams-notifications-for-new-tickets-in-connectwise-with-redis/'
    }
  ],

  // API and technical references
  apiReference: {
    baseUrl: 'https://graph.microsoft.com/v1.0',
    documentation: 'https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview',
    endpoints: {
      channels: '/teams/{team-id}/channels',
      channelMessages: '/teams/{team-id}/channels/{channel-id}/messages',
      chats: '/chats',
      chatMessages: '/chats/{chat-id}/messages',
      tasks: '/planner/tasks'
    }
  },

  // Integration capabilities
  integrationFeatures: {
    realTimeNotifications: true,
    bulkOperations: true,
    fileAttachments: true,
    mentions: true,
    formatting: {
      text: true,
      html: true,
      markdown: false
    },
    approvalWorkflows: true,
    customForms: true,
    webhooks: true
  },

  // Error handling and common issues
  commonIssues: [
    {
      issue: 'Authentication errors',
      solution: 'Ensure proper OAuth2 setup with correct scopes and admin consent if required'
    },
    {
      issue: 'Missing permissions',
      solution: 'Verify that the application has the necessary Graph API permissions'
    },
    {
      issue: 'Rate limiting',
      solution: 'Implement retry logic and respect Microsoft Graph throttling limits'
    }
  ],

  // Performance and optimization
  performanceNotes: {
    rateLimit: '600 requests per minute per application per tenant',
    bulkLimits: {
      channelMessages: '100 messages per request',
      tasks: '20 tasks per request'
    },
    bestPractices: [
      'Use batch requests for multiple operations',
      'Implement proper error handling for rate limits',
      'Cache team and channel IDs to reduce API calls'
    ]
  }
};