import { NodeTypeInfo } from '../node-types.js';

export const telegramNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.telegram',
  displayName: 'Telegram',
  description: 'Use the Telegram node to automate work in Telegram, and integrate Telegram with other applications. n8n has built-in support for a wide range of Telegram features, including getting files as well as deleting and editing messages.',
  category: 'Communication',
  subcategory: 'Messaging',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Chat', value: 'chat', description: 'Work with chat operations' },
        { name: 'Callback', value: 'callback', description: 'Handle callback queries' },
        { name: 'File', value: 'file', description: 'Get files from Telegram' },
        { name: 'Message', value: 'message', description: 'Handle messages and media' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',  
      type: 'options',
      required: true,
      default: 'sendMessage',
      description: 'The operation to perform',
      options: [
        { name: 'Get Chat', value: 'get', description: 'Get up-to-date information about a chat' },
        { name: 'Get Administrators', value: 'getAdministrators', description: 'Get a list of all administrators in a chat' },
        { name: 'Get Member', value: 'getMember', description: 'Get the details of a chat member' },
        { name: 'Leave Chat', value: 'leave', description: 'Leave a chat' },
        { name: 'Set Description', value: 'setDescription', description: 'Set description of a chat' },
        { name: 'Set Title', value: 'setTitle', description: 'Set title of a chat' },
        { name: 'Answer Query', value: 'answerQuery', description: 'Send answers to callback queries from inline keyboards' },
        { name: 'Answer Inline Query', value: 'answerInlineQuery', description: 'Send answers to callback queries from inline queries' },
        { name: 'Get File', value: 'getFile', description: 'Get file from Telegram' },
        { name: 'Delete Chat Message', value: 'deleteMessage', description: 'Delete a chat message' },
        { name: 'Edit Message Text', value: 'editMessageText', description: 'Edit the text of an existing message' },
        { name: 'Pin Chat Message', value: 'pinMessage', description: 'Pin a chat message' },
        { name: 'Send Animation', value: 'sendAnimation', description: 'Send animation (GIF or H.264/MPEG-4 AVC video without sound)' },
        { name: 'Send Audio', value: 'sendAudio', description: 'Send audio file to display in music player' },
        { name: 'Send Chat Action', value: 'sendChatAction', description: 'Tell user that something is happening on bot side' },
        { name: 'Send Document', value: 'sendDocument', description: 'Send document to the chat' },
        { name: 'Send Location', value: 'sendLocation', description: 'Send a geolocation to the chat' },
        { name: 'Send Media Group', value: 'sendMediaGroup', description: 'Send a group of photos and/or videos' },
        { name: 'Send Message', value: 'sendMessage', description: 'Send message to the chat' },
        { name: 'Send Photo', value: 'sendPhoto', description: 'Send photo to the chat' },
        { name: 'Send Sticker', value: 'sendSticker', description: 'Send sticker (.WEBP, .TGS, or .WEBM)' },
        { name: 'Send Video', value: 'sendVideo', description: 'Send video to the chat' },
        { name: 'Unpin Chat Message', value: 'unpinMessage', description: 'Unpin a chat message' }
      ]
    },
    {
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Unique identifier for the target chat or username of the target channel'
    },
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Identifier of the message to edit/delete/pin'
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text of the message to be sent'
    },
    {
      name: 'parseMode',
      displayName: 'Parse Mode',
      type: 'options',
      required: false,
      default: 'None',
      description: 'Mode for parsing entities in the message text',
      options: [
        { name: 'None', value: 'None', description: 'No parsing' },
        { name: 'Markdown', value: 'Markdown', description: 'Parse as Markdown' },
        { name: 'HTML', value: 'HTML', description: 'Parse as HTML' }
      ]
    },
    {
      name: 'replyToMessageId',
      displayName: 'Reply to Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'If the message is a reply, ID of the original message'
    },
    {
      name: 'disableWebPagePreview',
      displayName: 'Disable Web Page Preview',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disable link previews for links in this message'
    },
    {
      name: 'disableNotification',
      displayName: 'Disable Notification',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Send the message silently'
    },
    {
      name: 'binaryData',
      displayName: 'Binary Data',
      type: 'boolean',
      required: false,
      default: false,
      description: 'If binary data should be used'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file'
    },
    {
      name: 'caption',
      displayName: 'Caption',
      type: 'string',
      required: false,
      default: '',
      description: 'Caption for the media, 0-1024 characters after entities parsing'
    },
    {
      name: 'latitude',
      displayName: 'Latitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Latitude of the location'
    },
    {
      name: 'longitude',
      displayName: 'Longitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Longitude of the location'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for various operations'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description text'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Unique identifier of the target user'
    },
    {
      name: 'callbackQueryId',
      displayName: 'Callback Query ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Unique identifier for the query to be answered'
    },
    {
      name: 'inlineQueryId',
      displayName: 'Inline Query ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Unique identifier for the answered query'
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
      description: 'The processed Telegram data'
    }
  ],
  credentials: ['telegramApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Message',
      description: 'Send a simple text message to a Telegram chat',
      workflow: {
        nodes: [
          {
            name: 'Telegram',
            type: 'n8n-nodes-base.telegram',
            parameters: {
              resource: 'message',
              operation: 'sendMessage',
              chatId: '@mychannel',
              text: 'Hello from n8n! 🤖'
            }
          }
        ]
      }
    },
    {
      name: 'Send Photo',
      description: 'Send a photo with caption to Telegram',
      workflow: {
        nodes: [
          {
            name: 'Telegram',
            type: 'n8n-nodes-base.telegram',
            parameters: {
              resource: 'message',
              operation: 'sendPhoto',
              chatId: '@mychannel',
              binaryData: true,
              caption: 'Check out this image!'
            }
          }
        ]
      }
    },
    {
      name: 'Get Chat Info',
      description: 'Get information about a specific chat',
      workflow: {
        nodes: [
          {
            name: 'Telegram',
            type: 'n8n-nodes-base.telegram',
            parameters: {
              resource: 'chat',
              operation: 'get',
              chatId: '@mychannel'
            }
          }
        ]
      }
    }
  ]
};

export const telegramTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.telegramTrigger',
  displayName: 'Telegram Trigger',
  description: 'Triggers the workflow when events occur in Telegram. Supports various event types including messages, callback queries, chat member updates, and more.',
  category: 'Communication',
  subcategory: 'Messaging',
  properties: [
    {
      name: 'updates',
      displayName: 'Updates',
      type: 'multiOptions',
      required: true,
      default: ['*'],
      description: 'The update types to listen for',
      options: [
        { name: 'All Updates', value: '*', description: 'All updates except Chat Member, Message Reaction, and Message Reaction Count' },
        { name: 'Business Connection', value: 'business_connection', description: 'Bot connected/disconnected from business account' },
        { name: 'Business Message', value: 'business_message', description: 'New message from connected business account' },
        { name: 'Callback Query', value: 'callback_query', description: 'New incoming callback query' },
        { name: 'Channel Post', value: 'channel_post', description: 'New incoming channel post' },
        { name: 'Chat Boost', value: 'chat_boost', description: 'Chat boost added or changed' },
        { name: 'Chat Join Request', value: 'chat_join_request', description: 'Request to join chat sent' },
        { name: 'Chat Member', value: 'chat_member', description: 'Chat member status updated' },
        { name: 'Chosen Inline Result', value: 'chosen_inline_result', description: 'Result of inline query chosen by user' },
        { name: 'Deleted Business Messages', value: 'deleted_business_messages', description: 'Messages deleted from business account' },
        { name: 'Edited Business Message', value: 'edited_business_message', description: 'Message from business account edited' },
        { name: 'Edited Channel Post', value: 'edited_channel_post', description: 'Channel post edited' },
        { name: 'Edited Message', value: 'edited_message', description: 'Message edited' },
        { name: 'Inline Query', value: 'inline_query', description: 'New incoming inline query' },
        { name: 'Message', value: 'message', description: 'New incoming message' },
        { name: 'Message Reaction', value: 'message_reaction', description: 'Reaction to message changed' },
        { name: 'Message Reaction Count', value: 'message_reaction_count', description: 'Anonymous reactions to message changed' },
        { name: 'My Chat Member', value: 'my_chat_member', description: 'Bot chat member status updated' },
        { name: 'Poll', value: 'poll', description: 'New poll state' },
        { name: 'Poll Answer', value: 'poll_answer', description: 'User changed answer in non-anonymous poll' },
        { name: 'Pre-Checkout Query', value: 'pre_checkout_query', description: 'New incoming pre-checkout query' },
        { name: 'Purchased Paid Media', value: 'purchased_paid_media', description: 'User purchased paid media' },
        { name: 'Removed Chat Boost', value: 'removed_chat_boost', description: 'Boost removed from chat' },
        { name: 'Shipping Query', value: 'shipping_query', description: 'New incoming shipping query' }
      ]
    },
    {
      name: 'downloadAttachments',
      displayName: 'Download Images/Files',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to download attached images or files to include in the output data'
    },
    {
      name: 'imageSize',
      displayName: 'Image Size',
      type: 'options',
      required: false,
      default: 'large',
      description: 'Size of image to download when Download Images/Files is enabled',
      options: [
        { name: 'Small', value: 'small', description: 'Download small image size' },
        { name: 'Medium', value: 'medium', description: 'Download medium image size' },
        { name: 'Large', value: 'large', description: 'Download large image size' }
      ]
    },
    {
      name: 'chatId',
      displayName: 'Restrict to Chat IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Only trigger for events with these chat IDs (comma-separated)'
    },
    {
      name: 'userId',
      displayName: 'Restrict to User IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Only trigger for events with these user IDs (comma-separated)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when specified Telegram events occur'
    }
  ],
  credentials: ['telegramApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor All Messages',
      description: 'Trigger workflow when any message is received',
      workflow: {
        nodes: [
          {
            name: 'Telegram Trigger',
            type: 'n8n-nodes-base.telegramTrigger',
            parameters: {
              updates: ['message'],
              downloadAttachments: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific Chat',
      description: 'Trigger only for messages in a specific chat',
      workflow: {
        nodes: [
          {
            name: 'Telegram Trigger',
            type: 'n8n-nodes-base.telegramTrigger',
            parameters: {
              updates: ['message'],
              chatId: '-1001234567890',
              downloadAttachments: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Callback Queries',
      description: 'Trigger when users interact with inline keyboards',
      workflow: {
        nodes: [
          {
            name: 'Telegram Trigger',
            type: 'n8n-nodes-base.telegramTrigger',
            parameters: {
              updates: ['callback_query'],
              downloadAttachments: false
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const telegramNodes: NodeTypeInfo[] = [telegramNode, telegramTriggerNode];

// Export individual actions for the regular Telegram node
export const telegramActions = [
  'get_chat',
  'get_administrators',
  'get_member',
  'leave_chat',
  'set_description',
  'set_title',
  'answer_callback_query',
  'answer_inline_query',
  'get_file',
  'delete_message',
  'edit_message_text',
  'pin_message',
  'send_animation',
  'send_audio',
  'send_chat_action',
  'send_document',
  'send_location',
  'send_media_group',
  'send_message',
  'send_photo',
  'send_sticker',
  'send_video',
  'unpin_message'
];

// Export trigger events
export const telegramTriggers = [
  'business_connection',
  'business_message',
  'callback_query',
  'channel_post',
  'chat_boost',
  'chat_join_request',
  'chat_member',
  'chosen_inline_result',
  'deleted_business_messages',
  'edited_business_message',
  'edited_channel_post',
  'edited_message',
  'inline_query',
  'message',
  'message_reaction',
  'message_reaction_count',
  'my_chat_member',
  'poll',
  'poll_answer',
  'pre_checkout_query',
  'purchased_paid_media',
  'removed_chat_boost',
  'shipping_query'
];