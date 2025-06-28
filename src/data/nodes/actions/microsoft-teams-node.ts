/**
 * Microsoft Teams Node - Comprehensive Teams Integration
 * 
 * Advanced Microsoft Teams integration for messaging, meetings, channels,
 * and team management with AI-powered automation capabilities.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftTeamsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftTeams',
  displayName: 'Microsoft Teams',
  description: 'Comprehensive Microsoft Teams integration for messaging, meetings, channels, and team collaboration with AI-powered automation',
  category: 'AI & Productivity',
  subcategory: 'Team Communication',
  
  properties: [
    // Authentication
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'oAuth2',
      options: [
        { name: 'OAuth2', value: 'oAuth2' },
        { name: 'Microsoft Graph API', value: 'microsoftGraphApi' }
      ],
      description: 'Authentication method for Microsoft Teams'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      options: [
        { name: 'Message', value: 'message' },
        { name: 'Channel', value: 'channel' },
        { name: 'Team', value: 'team' },
        { name: 'Meeting', value: 'meeting' },
        { name: 'Tab', value: 'tab' },
        { name: 'Member', value: 'member' },
        { name: 'Chat', value: 'chat' },
        { name: 'File', value: 'file' },
        { name: 'App', value: 'app' },
        { name: 'Bot', value: 'bot' }
      ],
      description: 'Choose the Teams resource to work with'
    },

    // Message operations
    {
      name: 'messageOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      displayOptions: {
        show: { resource: ['message'] }
      },
      options: [
        { name: 'Send', value: 'send' },
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Reply', value: 'reply' },
        { name: 'React', value: 'react' },
        { name: 'Pin', value: 'pin' },
        { name: 'Unpin', value: 'unpin' }
      ],
      description: 'Select the operation to perform on messages'
    },

    // Channel operations
    {
      name: 'channelOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['channel'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Add Member', value: 'addMember' },
        { name: 'Remove Member', value: 'removeMember' },
        { name: 'Archive', value: 'archive' },
        { name: 'Unarchive', value: 'unarchive' }
      ],
      description: 'Select the operation to perform on channels'
    },

    // Team operations
    {
      name: 'teamOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['team'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Clone', value: 'clone' },
        { name: 'Archive', value: 'archive' },
        { name: 'Unarchive', value: 'unarchive' }
      ],
      description: 'Select the operation to perform on teams'
    },

    // Meeting operations
    {
      name: 'meetingOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      displayOptions: {
        show: { resource: ['meeting'] }
      },
      options: [
        { name: 'Create', value: 'create' },
        { name: 'Get', value: 'get' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Join', value: 'join' },
        { name: 'End', value: 'end' },
        { name: 'Get Recording', value: 'getRecording' },
        { name: 'Get Transcript', value: 'getTranscript' }
      ],
      description: 'Select the operation to perform on meetings'
    },

    // Chat operations
    {
      name: 'chatOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      displayOptions: {
        show: { resource: ['chat'] }
      },
      options: [
        { name: 'Send Message', value: 'send' },
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Add Member', value: 'addMember' },
        { name: 'Remove Member', value: 'removeMember' }
      ],
      description: 'Select the operation to perform on chats'
    },

    // Team/Channel/Chat IDs
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['team', 'channel', 'message'],
          operation: ['get', 'update', 'delete', 'send', 'getAll']
        }
      },
      description: 'The Microsoft Teams team ID'
    },

    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['channel', 'message'],
          operation: ['get', 'update', 'delete', 'send', 'getAll']
        }
      },
      description: 'The channel ID'
    },

    {
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['chat'],
          chatOperation: ['get', 'send', 'addMember', 'removeMember']
        }
      },
      description: 'The chat ID'
    },

    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['get', 'update', 'delete', 'reply', 'react', 'pin', 'unpin']
        }
      },
      description: 'The message ID'
    },

    // Message content
    {
      name: 'messageContent',
      displayName: 'Message Content',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: { 
          resource: ['message', 'chat'],
          operation: ['send', 'reply', 'update']
        }
      },
      description: 'The message content to send'
    },

    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'text',
      displayOptions: {
        show: { 
          resource: ['message', 'chat'],
          operation: ['send', 'reply']
        }
      },
      options: [
        { name: 'Text', value: 'text' },
        { name: 'HTML', value: 'html' },
        { name: 'Adaptive Card', value: 'adaptiveCard' }
      ],
      description: 'Type of message content'
    },

    // Adaptive Card content
    {
      name: 'adaptiveCardContent',
      displayName: 'Adaptive Card JSON',
      type: 'json',
      required: true,
      displayOptions: {
        show: { 
          messageType: ['adaptiveCard']
        }
      },
      description: 'Adaptive Card JSON payload'
    },

    // Mentions and formatting
    {
      name: 'mentions',
      displayName: 'Mentions',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['message', 'chat'],
          operation: ['send', 'reply']
        }
      },
      description: 'Mention users or channels in the message',
      options: [
        {
          name: 'mention',
          displayName: 'Mention',
          values: [
            {
              name: 'type',
              displayName: 'Type',
              type: 'options',
              required: true,
              options: [
                { name: 'User', value: 'user' },
                { name: 'Channel', value: 'channel' },
                { name: 'Team', value: 'team' }
              ],
              description: 'Type of mention'
            },
            {
              name: 'id',
              displayName: 'ID',
              type: 'string',
              required: true,
              description: 'User, channel, or team ID to mention'
            },
            {
              name: 'displayName',
              displayName: 'Display Name',
              type: 'string',
              required: false,
              description: 'Display name for the mention'
            }
          ]
        }
      ]
    },

    // Meeting details
    {
      name: 'meetingSubject',
      displayName: 'Meeting Subject',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['meeting'],
          meetingOperation: ['create', 'update']
        }
      },
      description: 'Meeting subject/title'
    },

    {
      name: 'meetingStartTime',
      displayName: 'Start Time',
      type: 'dateTime',
      required: true,
      displayOptions: {
        show: { 
          resource: ['meeting'],
          meetingOperation: ['create', 'update']
        }
      },
      description: 'Meeting start date and time'
    },

    {
      name: 'meetingEndTime',
      displayName: 'End Time',
      type: 'dateTime',
      required: true,
      displayOptions: {
        show: { 
          resource: ['meeting'],
          meetingOperation: ['create', 'update']
        }
      },
      description: 'Meeting end date and time'
    },

    {
      name: 'meetingAttendees',
      displayName: 'Attendees',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['meeting'],
          meetingOperation: ['create', 'update']
        }
      },
      description: 'Attendee email addresses (comma-separated)'
    },

    {
      name: 'meetingDescription',
      displayName: 'Description',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 3
      },
      displayOptions: {
        show: { 
          resource: ['meeting'],
          meetingOperation: ['create', 'update']
        }
      },
      description: 'Meeting description'
    },

    // Team creation fields
    {
      name: 'teamName',
      displayName: 'Team Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['team'],
          teamOperation: ['create', 'update']
        }
      },
      description: 'Name of the team'
    },

    {
      name: 'teamDescription',
      displayName: 'Team Description',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['team'],
          teamOperation: ['create', 'update']
        }
      },
      description: 'Description of the team'
    },

    {
      name: 'teamVisibility',
      displayName: 'Team Visibility',
      type: 'options',
      required: false,
      default: 'private',
      displayOptions: {
        show: { 
          resource: ['team'],
          teamOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Private', value: 'private' },
        { name: 'Public', value: 'public' }
      ],
      description: 'Team visibility setting'
    },

    // Channel creation fields
    {
      name: 'channelName',
      displayName: 'Channel Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['channel'],
          channelOperation: ['create', 'update']
        }
      },
      description: 'Name of the channel'
    },

    {
      name: 'channelDescription',
      displayName: 'Channel Description',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['channel'],
          channelOperation: ['create', 'update']
        }
      },
      description: 'Description of the channel'
    },

    {
      name: 'channelType',
      displayName: 'Channel Type',
      type: 'options',
      required: false,
      default: 'standard',
      displayOptions: {
        show: { 
          resource: ['channel'],
          channelOperation: ['create']
        }
      },
      options: [
        { name: 'Standard', value: 'standard' },
        { name: 'Private', value: 'private' }
      ],
      description: 'Type of channel to create'
    },

    // AI-Enhanced Features for Teams
    {
      name: 'aiFeatures',
      displayName: 'AI Features',
      type: 'collection',
      required: false,
      default: {},
      description: 'Enable AI-powered features for Teams operations',
      options: [
        {
          name: 'enableSentimentAnalysis',
          displayName: 'Enable Sentiment Analysis',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Analyze message sentiment'
        },
        {
          name: 'enableAutoModeration',
          displayName: 'Enable Auto Moderation',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically moderate inappropriate content'
        },
        {
          name: 'enableSmartSummary',
          displayName: 'Enable Smart Summary',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate AI summaries of conversations'
        },
        {
          name: 'enableAutoTranslation',
          displayName: 'Enable Auto Translation',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically translate messages'
        },
        {
          name: 'enableMeetingInsights',
          displayName: 'Enable Meeting Insights',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate AI insights from meetings'
        },
        {
          name: 'enableActionItemDetection',
          displayName: 'Enable Action Item Detection',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically detect action items from conversations'
        }
      ]
    },

    // Bot integration settings
    {
      name: 'botSettings',
      displayName: 'Bot Settings',
      type: 'collection',
      required: false,
      default: {},
      displayOptions: {
        show: { 
          resource: ['bot']
        }
      },
      description: 'Configure bot behavior and responses',
      options: [
        {
          name: 'botName',
          displayName: 'Bot Name',
          type: 'string',
          required: false,
          description: 'Display name for the bot'
        },
        {
          name: 'autoReply',
          displayName: 'Enable Auto Reply',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Enable automatic replies to messages'
        },
        {
          name: 'replyTemplate',
          displayName: 'Reply Template',
          type: 'string',
          required: false,
          typeOptions: {
            rows: 3
          },
          description: 'Template for automatic replies'
        },
        {
          name: 'keywords',
          displayName: 'Trigger Keywords',
          type: 'string',
          required: false,
          description: 'Keywords that trigger bot responses (comma-separated)'
        }
      ]
    },

    // Filters and options
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'collection',
      required: false,
      default: {},
      description: 'Filter options for retrieving data',
      options: [
        {
          name: 'dateRange',
          displayName: 'Date Range (Days)',
          type: 'number',
          required: false,
          description: 'Number of days to look back'
        },
        {
          name: 'messageType',
          displayName: 'Message Type Filter',
          type: 'options',
          required: false,
          options: [
            { name: 'All', value: 'all' },
            { name: 'Text Only', value: 'text' },
            { name: 'Files Only', value: 'files' },
            { name: 'Images Only', value: 'images' }
          ],
          default: 'all',
          description: 'Filter messages by type'
        },
        {
          name: 'fromUser',
          displayName: 'From User',
          type: 'string',
          required: false,
          description: 'Filter messages from specific user'
        }
      ]
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      options: [
        {
          name: 'limit',
          displayName: 'Limit',
          type: 'number',
          required: false,
          default: 50,
          description: 'Maximum number of results'
        },
        {
          name: 'returnAll',
          displayName: 'Return All',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Return all results (ignores limit)'
        },
        {
          name: 'includeDeleted',
          displayName: 'Include Deleted',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Include deleted messages/items'
        }
      ]
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
      displayName: 'Output',
      description: 'Microsoft Teams API response data'
    }
  ],

  credentials: [
    {
      name: 'microsoftTeamsOAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    },
    {
      name: 'microsoftGraphApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['microsoftGraphApi']
        }
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Microsoft Teams'
  },

  aliases: ['teams', 'microsoft', 'collaboration', 'chat', 'meetings'],
  
  examples: [
    {
      name: 'Send AI-Enhanced Message',
      description: 'Send a message to a Teams channel with AI features enabled',
      workflow: {
        nodes: [
          {
            name: 'Send Teams Message',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'message',
              messageOperation: 'send',
              teamId: 'team-id-here',
              channelId: 'channel-id-here',
              messageContent: 'This is an AI-enhanced message with sentiment analysis!',
              messageType: 'html',
              aiFeatures: {
                enableSentimentAnalysis: true,
                enableAutoModeration: true,
                enableActionItemDetection: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create Teams Meeting with AI Insights',
      description: 'Create a Teams meeting with AI-powered insights enabled',
      workflow: {
        nodes: [
          {
            name: 'Create AI Meeting',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'meeting',
              meetingOperation: 'create',
              meetingSubject: 'AI Strategy Review',
              meetingStartTime: '2024-02-15T14:00:00',
              meetingEndTime: '2024-02-15T15:00:00',
              meetingAttendees: 'team@company.com,manager@company.com',
              meetingDescription: 'Weekly review of AI implementation progress',
              aiFeatures: {
                enableMeetingInsights: true,
                enableActionItemDetection: true,
                enableSmartSummary: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Channel with AI Moderation',
      description: 'Monitor a Teams channel for messages with AI moderation',
      workflow: {
        nodes: [
          {
            name: 'Get Channel Messages',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'message',
              messageOperation: 'getAll',
              teamId: 'team-id-here',
              channelId: 'channel-id-here',
              filters: {
                dateRange: 1
              },
              aiFeatures: {
                enableSentimentAnalysis: true,
                enableAutoModeration: true,
                enableSmartSummary: true
              },
              options: {
                limit: 100
              }
            }
          }
        ]
      }
    },
    {
      name: 'Send Adaptive Card with Mentions',
      description: 'Send an interactive Adaptive Card with user mentions',
      workflow: {
        nodes: [
          {
            name: 'Send Adaptive Card',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'message',
              messageOperation: 'send',
              teamId: 'team-id-here',
              channelId: 'channel-id-here',
              messageType: 'adaptiveCard',
              adaptiveCardContent: {
                type: 'AdaptiveCard',
                version: '1.3',
                body: [
                  {
                    type: 'TextBlock',
                    text: 'AI Outlook Manager Update',
                    size: 'Medium',
                    weight: 'Bolder'
                  },
                  {
                    type: 'TextBlock',
                    text: 'Your email processing is complete!'
                  }
                ],
                actions: [
                  {
                    type: 'Action.OpenUrl',
                    title: 'View Details',
                    url: 'https://outlook.office.com'
                  }
                ]
              },
              mentions: {
                mention: [
                  {
                    type: 'user',
                    id: 'user-id-here',
                    displayName: 'Manager'
                  }
                ]
              }
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
  description: 'Triggers workflows when events occur in Microsoft Teams, such as new messages, meetings, or channel activities',
  category: 'AI & Productivity',
  subcategory: 'Team Communication',
  
  properties: [
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'oAuth2',
      options: [
        { name: 'OAuth2', value: 'oAuth2' },
        { name: 'Microsoft Graph API', value: 'microsoftGraphApi' }
      ],
      description: 'Authentication method for Microsoft Teams'
    },
    {
      name: 'triggerEvent',
      displayName: 'Trigger Event',
      type: 'options',
      required: true,
      default: 'message.created',
      description: 'The Teams event to monitor',
      options: [
        { name: 'Message Created', value: 'message.created' },
        { name: 'Message Updated', value: 'message.updated' },
        { name: 'Message Deleted', value: 'message.deleted' },
        { name: 'Channel Created', value: 'channel.created' },
        { name: 'Channel Updated', value: 'channel.updated' },
        { name: 'Channel Deleted', value: 'channel.deleted' },
        { name: 'Team Created', value: 'team.created' },
        { name: 'Team Updated', value: 'team.updated' },
        { name: 'Meeting Started', value: 'meeting.started' },
        { name: 'Meeting Ended', value: 'meeting.ended' },
        { name: 'Member Added', value: 'member.added' },
        { name: 'Member Removed', value: 'member.removed' },
        { name: 'File Uploaded', value: 'file.uploaded' },
        { name: 'Mention Received', value: 'mention.received' }
      ]
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      description: 'Specific team ID to monitor (leave empty for all teams)'
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      description: 'Specific channel ID to monitor (leave empty for all channels)'
    },
    {
      name: 'aiProcessing',
      displayName: 'AI Processing',
      type: 'collection',
      required: false,
      default: {},
      description: 'Enable AI processing of triggered events',
      options: [
        {
          name: 'enableSentimentAnalysis',
          displayName: 'Analyze Sentiment',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Analyze sentiment of messages'
        },
        {
          name: 'enableAutoResponse',
          displayName: 'Enable Auto Response',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate automatic responses'
        },
        {
          name: 'enableActionDetection',
          displayName: 'Detect Action Items',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Detect action items in messages'
        }
      ]
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

  credentials: [
    {
      name: 'microsoftTeamsOAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    },
    {
      name: 'microsoftGraphApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['microsoftGraphApi']
        }
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  examples: [
    {
      name: 'Monitor AI Assistant Mentions',
      description: 'Trigger when the AI assistant is mentioned in Teams',
      workflow: {
        nodes: [
          {
            name: 'Teams Mention Trigger',
            type: 'n8n-nodes-base.microsoftTeamsTrigger',
            parameters: {
              triggerEvent: 'mention.received',
              aiProcessing: {
                enableSentimentAnalysis: true,
                enableAutoResponse: true,
                enableActionDetection: true
              }
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes
export const microsoftTeamsNodes: NodeTypeInfo[] = [microsoftTeamsNode, microsoftTeamsTriggerNode];

export default microsoftTeamsNode;
