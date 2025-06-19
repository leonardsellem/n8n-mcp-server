import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const matrixNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.matrix',
  displayName: 'Matrix',
  description: 'Use the Matrix node to automate work in Matrix, and integrate Matrix with other applications. Supports sending media and messages to rooms, managing rooms and members, and retrieving account information.',
  category: 'Communication',
  subcategory: 'Chat',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Account', value: 'account', description: 'Get current user account information' },
        { name: 'Event', value: 'event', description: 'Get single event by ID' },
        { name: 'Media', value: 'media', description: 'Send media to a chat room' },
        { name: 'Message', value: 'message', description: 'Send and retrieve messages from rooms' },
        { name: 'Room', value: 'room', description: 'Manage chat rooms' },
        { name: 'Room Member', value: 'roomMember', description: 'Manage room members' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      options: [
        { name: 'Get Account Info', value: 'getAccountInfo', description: 'Get current user account information' },
        { name: 'Get Event', value: 'getEvent', description: 'Get single event by ID' },
        { name: 'Send Media', value: 'sendMedia', description: 'Send media to a chat room' },
        { name: 'Send Message', value: 'send', description: 'Send a message to a room' },
        { name: 'Get Messages', value: 'getMessages', description: 'Get all messages from a room' },
        { name: 'Create Room', value: 'create', description: 'Create a new chat room with defined settings' },
        { name: 'Invite User', value: 'invite', description: 'Invite a user to a room' },
        { name: 'Join Room', value: 'join', description: 'Join a new room' },
        { name: 'Kick User', value: 'kick', description: 'Kick a user from a room' },
        { name: 'Leave Room', value: 'leave', description: 'Leave a room' },
        { name: 'Get Members', value: 'getMembers', description: 'Get all room members' }
      ]
    },
    {
      name: 'roomId',
      displayName: 'Room ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the room to operate on'
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
      default: 'm.text',
      description: 'The type of message to send',
      options: [
        { name: 'Text', value: 'm.text', description: 'Plain text message' },
        { name: 'HTML', value: 'm.html', description: 'HTML formatted message' },
        { name: 'Notice', value: 'm.notice', description: 'Notice message' },
        { name: 'Emote', value: 'm.emote', description: 'Emote message' }
      ]
    },
    {
      name: 'eventId',
      displayName: 'Event ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the event to retrieve'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to invite or kick'
    },
    {
      name: 'roomAlias',
      displayName: 'Room Alias',
      type: 'string',
      required: false,
      default: '',
      description: 'The alias of the room to join'
    },
    {
      name: 'roomName',
      displayName: 'Room Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the room to create'
    },
    {
      name: 'roomTopic',
      displayName: 'Room Topic',
      type: 'string',
      required: false,
      default: '',
      description: 'The topic of the room to create'
    },
    {
      name: 'roomPreset',
      displayName: 'Room Preset',
      type: 'options',
      required: false,
      default: 'private_chat',
      description: 'The preset to use when creating the room',
      options: [
        { name: 'Private Chat', value: 'private_chat', description: 'Private chat room' },
        { name: 'Public Chat', value: 'public_chat', description: 'Public chat room' },
        { name: 'Trusted Private Chat', value: 'trusted_private_chat', description: 'Trusted private chat room' }
      ]
    },
    {
      name: 'roomVisibility',
      displayName: 'Room Visibility',
      type: 'options',
      required: false,
      default: 'private',
      description: 'The visibility of the room',
      options: [
        { name: 'Private', value: 'private', description: 'Room is private' },
        { name: 'Public', value: 'public', description: 'Room is public' }
      ]
    },
    {
      name: 'enableEncryption',
      displayName: 'Enable Encryption',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to enable end-to-end encryption for the room'
    },
    {
      name: 'mediaUrl',
      displayName: 'Media URL',
      type: 'string',
      required: false,
      default: '',
      description: 'The URL of the media to send'
    },
    {
      name: 'mediaType',
      displayName: 'Media Type',
      type: 'options',
      required: false,
      default: 'm.image',
      description: 'The type of media to send',
      options: [
        { name: 'Image', value: 'm.image', description: 'Image file' },
        { name: 'Video', value: 'm.video', description: 'Video file' },
        { name: 'Audio', value: 'm.audio', description: 'Audio file' },
        { name: 'File', value: 'm.file', description: 'Generic file' }
      ]
    },
    {
      name: 'mediaFilename',
      displayName: 'Media Filename',
      type: 'string',
      required: false,
      default: '',
      description: 'The filename of the media'
    },
    {
      name: 'reason',
      displayName: 'Reason',
      type: 'string',
      required: false,
      default: '',
      description: 'The reason for kicking a user'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 10,
      description: 'The maximum number of messages to retrieve'
    },
    {
      name: 'from',
      displayName: 'From Token',
      type: 'string',
      required: false,
      default: '',
      description: 'The token to start returning results from'
    },
    {
      name: 'to',
      displayName: 'To Token',
      type: 'string',
      required: false,
      default: '',
      description: 'The token to stop returning results at'
    },
    {
      name: 'direction',
      displayName: 'Direction',
      type: 'options',
      required: false,
      default: 'b',
      description: 'The direction to return events from',
      options: [
        { name: 'Backwards', value: 'b', description: 'Return events backwards in time' },
        { name: 'Forwards', value: 'f', description: 'Return events forwards in time' }
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
      description: 'The processed Matrix response data'
    }
  ],
  credentials: ['matrix'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Text Message',
      description: 'Send a simple text message to a Matrix room',
      workflow: {
        nodes: [
          {
            name: 'Matrix',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'message',
              operation: 'send',
              roomId: '!roomid:matrix.org',
              message: 'Hello from n8n!',
              messageType: 'm.text'
            }
          }
        ]
      }
    },
    {
      name: 'Create Room and Send Message',
      description: 'Create a new Matrix room and send a welcome message',
      workflow: {
        nodes: [
          {
            name: 'Create Room',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'room',
              operation: 'create',
              roomName: 'n8n Automation Room',
              roomTopic: 'Automated messages from n8n workflows',
              roomPreset: 'private_chat',
              roomVisibility: 'private',
              enableEncryption: true
            }
          },
          {
            name: 'Send Welcome Message',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'message',
              operation: 'send',
              roomId: '{{ $json.room_id }}',
              message: 'Welcome to the n8n automation room! 🎉',
              messageType: 'm.text'
            }
          }
        ]
      }
    },
    {
      name: 'Send Media File',
      description: 'Send an image file to a Matrix room',
      workflow: {
        nodes: [
          {
            name: 'Matrix',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'media',
              operation: 'sendMedia',
              roomId: '!roomid:matrix.org',
              mediaUrl: 'https://example.com/image.png',
              mediaType: 'm.image',
              mediaFilename: 'automation-chart.png'
            }
          }
        ]
      }
    },
    {
      name: 'Get Room Messages',
      description: 'Retrieve recent messages from a Matrix room',
      workflow: {
        nodes: [
          {
            name: 'Matrix',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'message',
              operation: 'getMessages',
              roomId: '!roomid:matrix.org',
              limit: 20,
              direction: 'b'
            }
          }
        ]
      }
    },
    {
      name: 'Invite User to Room',
      description: 'Invite a user to join a Matrix room',
      workflow: {
        nodes: [
          {
            name: 'Matrix',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'room',
              operation: 'invite',
              roomId: '!roomid:matrix.org',
              userId: '@user:matrix.org'
            }
          }
        ]
      }
    },
    {
      name: 'Get Account Information',
      description: 'Retrieve current user account information',
      workflow: {
        nodes: [
          {
            name: 'Matrix',
            type: 'n8n-nodes-base.matrix',
            parameters: {
              resource: 'account',
              operation: 'getAccountInfo'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const matrixNodes: NodeTypeInfo[] = [matrixNode];

// Export individual actions for the Matrix node
export const matrixActions = [
  'get_account_info',
  'get_event',
  'send_media',
  'send_message',
  'get_messages',
  'create_room',
  'invite_user',
  'join_room',
  'kick_user',
  'leave_room',
  'get_room_members'
];

// No trigger node exists for Matrix (based on 404 response)
export const matrixTriggers: string[] = [];