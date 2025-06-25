import { NodeTypeInfo } from '../node-types.js';

export const whatsappNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.whatsapp',
  displayName: 'WhatsApp Business Cloud',
  description: 'Use the WhatsApp Business Cloud node to automate work in WhatsApp Business, and integrate WhatsApp Business with other applications. n8n has built-in support for a wide range of WhatsApp Business features, including sending messages, and uploading, downloading, and deleting media.',
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
        { name: 'Message', value: 'message', description: 'Work with message operations' },
        { name: 'Media', value: 'media', description: 'Work with media operations' }
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
        { name: 'Send', value: 'send', description: 'Send a message' },
        { name: 'Send and Wait for Response', value: 'sendAndWait', description: 'Send a message and wait for a response' },
        { name: 'Send Template', value: 'sendTemplate', description: 'Send a template message' },
        { name: 'Upload Media', value: 'upload', description: 'Upload media file' },
        { name: 'Download Media', value: 'download', description: 'Download media file' },
        { name: 'Delete Media', value: 'delete', description: 'Delete media file' }
      ]
    },
    {
      name: 'phoneNumberId',
      displayName: 'Phone Number ID',
      type: 'string',
      required: true,
      default: '',
      description: 'WhatsApp Business phone number ID'
    },
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      required: false,
      default: '',
      description: 'WhatsApp ID or phone number for the person you want to send a message to'
    },
    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'The type of message to send',
      options: [
        { name: 'Text', value: 'text', description: 'Send a text message' },
        { name: 'Template', value: 'template', description: 'Send a template message' },
        { name: 'Image', value: 'image', description: 'Send an image' },
        { name: 'Audio', value: 'audio', description: 'Send an audio file' },
        { name: 'Video', value: 'video', description: 'Send a video' },
        { name: 'Document', value: 'document', description: 'Send a document' },
        { name: 'Location', value: 'location', description: 'Send a location' },
        { name: 'Contacts', value: 'contacts', description: 'Send contact information' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message to send'
    },
    {
      name: 'templateName',
      displayName: 'Template Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the WhatsApp template to use'
    },
    {
      name: 'templateLanguage',
      displayName: 'Template Language',
      type: 'string',
      required: false,
      default: 'en_US',
      description: 'Language code for the template'
    },
    {
      name: 'responseType',
      displayName: 'Response Type',
      type: 'options',
      required: false,
      default: 'approval',
      description: 'Type of response to wait for',
      options: [
        { name: 'Approval', value: 'approval', description: 'Wait for approval/disapproval' },
        { name: 'Free Text', value: 'freeText', description: 'Wait for free text response' },
        { name: 'Custom Form', value: 'customForm', description: 'Wait for custom form response' }
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
      description: 'Maximum time to wait for response (in seconds)'
    },
    {
      name: 'appendAttribution',
      displayName: 'Append n8n Attribution',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to mention that the message was sent automatically with n8n'
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
      default: 'Disapprove',
      description: 'Text for the disapproval button'
    },
    {
      name: 'formTitle',
      displayName: 'Form Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for the response form'
    },
    {
      name: 'formDescription',
      displayName: 'Form Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the response form'
    },
    {
      name: 'mediaId',
      displayName: 'Media ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the media file'
    },
    {
      name: 'mediaUrl',
      displayName: 'Media URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the media file'
    },
    {
      name: 'caption',
      displayName: 'Caption',
      type: 'string',
      required: false,
      default: '',
      description: 'Caption for media messages'
    },
    {
      name: 'filename',
      displayName: 'Filename',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file for document messages'
    },
    {
      name: 'latitude',
      displayName: 'Latitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Latitude for location messages'
    },
    {
      name: 'longitude',
      displayName: 'Longitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Longitude for location messages'
    },
    {
      name: 'locationName',
      displayName: 'Location Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the location'
    },
    {
      name: 'locationAddress',
      displayName: 'Location Address',
      type: 'string',
      required: false,
      default: '',
      description: 'Address of the location'
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
      description: 'The processed WhatsApp data'
    }
  ],
  credentials: ['whatsappApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Text Message',
      description: 'Send a simple text message via WhatsApp',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'send',
              phoneNumberId: '1234567890',
              to: '+1234567890',
              messageType: 'text',
              message: 'Hello from n8n! 📱'
            }
          }
        ]
      }
    },
    {
      name: 'Send Template Message',
      description: 'Send a WhatsApp template message',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'sendTemplate',
              phoneNumberId: '1234567890',
              to: '+1234567890',
              templateName: 'hello_world',
              templateLanguage: 'en_US'
            }
          }
        ]
      }
    },
    {
      name: 'Send and Wait for Approval',
      description: 'Send a message and wait for user approval',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'sendAndWait',
              phoneNumberId: '1234567890',
              to: '+1234567890',
              message: 'Please approve this action',
              responseType: 'approval',
              limitWaitTime: true,
              waitTimeLimit: 1800
            }
          }
        ]
      }
    },
    {
      name: 'Upload Media',
      description: 'Upload a media file to WhatsApp',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'media',
              operation: 'upload',
              mediaUrl: 'https://example.com/image.jpg',
              filename: 'image.jpg'
            }
          }
        ]
      }
    }
  ]
};

export const whatsappTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.whatsappTrigger',
  displayName: 'WhatsApp Trigger',
  description: 'Triggers the workflow when events occur in WhatsApp. Supports various event types including messages, account updates, and business capability changes.',
  category: 'Communication',
  subcategory: 'Messaging',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['messages'],
      description: 'The event types to listen for',
      options: [
        { name: 'Account Review Update', value: 'account_review_update', description: 'Account review status changes' },
        { name: 'Account Update', value: 'account_update', description: 'Account information updates' },
        { name: 'Business Capability Update', value: 'business_capability_update', description: 'Business capability changes' },
        { name: 'Message Template Quality Update', value: 'message_template_quality_update', description: 'Template quality score changes' },
        { name: 'Message Template Status Update', value: 'message_template_status_update', description: 'Template status changes' },
        { name: 'Messages', value: 'messages', description: 'New incoming messages' },
        { name: 'Phone Number Name Update', value: 'phone_number_name_update', description: 'Phone number display name changes' },
        { name: 'Phone Number Quality Update', value: 'phone_number_quality_update', description: 'Phone number quality score changes' },
        { name: 'Security', value: 'security', description: 'Security-related events' },
        { name: 'Template Category Update', value: 'template_category_update', description: 'Template category changes' }
      ]
    },
    {
      name: 'phoneNumberId',
      displayName: 'Phone Number ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by specific phone number ID'
    },
    {
      name: 'businessAccountId',
      displayName: 'Business Account ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by specific business account ID'
    },
    {
      name: 'includeMetadata',
      displayName: 'Include Metadata',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include additional metadata in webhook payloads'
    },
    {
      name: 'verifyToken',
      displayName: 'Verify Token',
      type: 'string',
      required: false,
      default: '',
      description: 'Token used to verify webhook endpoints'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when specified WhatsApp events occur'
    }
  ],
  credentials: ['whatsappOAuth2Api'],
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
            name: 'WhatsApp Trigger',
            type: 'n8n-nodes-base.whatsappTrigger',
            parameters: {
              events: ['messages'],
              includeMetadata: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Account Updates',
      description: 'Trigger on account-related changes',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Trigger',
            type: 'n8n-nodes-base.whatsappTrigger',
            parameters: {
              events: ['account_update', 'account_review_update'],
              businessAccountId: '123456789',
              includeMetadata: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Template Changes',
      description: 'Trigger when message templates are updated',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Trigger',
            type: 'n8n-nodes-base.whatsappTrigger',
            parameters: {
              events: ['message_template_status_update', 'message_template_quality_update'],
              includeMetadata: true
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const whatsappNodes: NodeTypeInfo[] = [whatsappNode, whatsappTriggerNode];

// Export individual actions for the regular WhatsApp node
export const whatsappActions = [
  'send_message',
  'send_and_wait',
  'send_template',
  'upload_media',
  'download_media',
  'delete_media'
];

// Export trigger events
export const whatsappTriggers = [
  'account_review_update',
  'account_update', 
  'business_capability_update',
  'message_template_quality_update',
  'message_template_status_update',
  'messages',
  'phone_number_name_update',
  'phone_number_quality_update',
  'security',
  'template_category_update'
];