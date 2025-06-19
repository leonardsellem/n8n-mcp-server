import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const plivoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.plivo',
  displayName: 'Plivo',
  description: 'Use the Plivo node to automate work in Plivo, and integrate Plivo with other applications. n8n has built-in support for a wide range of Plivo features, including making calls, and sending SMS/MMS.',
  category: 'Communication',
  subcategory: 'Voice & SMS',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'sms',
      description: 'The resource to operate on',
      options: [
        { name: 'Call', value: 'call', description: 'Make voice calls' },
        { name: 'MMS', value: 'mms', description: 'Send MMS messages (US/Canada only)' },
        { name: 'SMS', value: 'sms', description: 'Send SMS messages' }
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
        { name: 'Make Call', value: 'makeCall', description: 'Make a voice call' },
        { name: 'Send MMS', value: 'sendMms', description: 'Send an MMS message (US/Canada only)' },
        { name: 'Send SMS', value: 'sendSms', description: 'Send an SMS message' }
      ]
    },
    {
      name: 'from',
      displayName: 'From',
      type: 'string',
      required: true,
      default: '',
      description: 'The phone number to make the call/send SMS from (must be a Plivo phone number)'
    },
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      required: true,
      default: '',
      description: 'The phone number to call or send message to'
    },
    {
      name: 'text',
      displayName: 'Message Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text message to send (for SMS/MMS)'
    },
    {
      name: 'answerUrl',
      displayName: 'Answer URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to fetch XML instructions when the call is answered'
    },
    {
      name: 'hangupUrl',
      displayName: 'Hangup URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to be notified when the call ends'
    },
    {
      name: 'fallbackUrl',
      displayName: 'Fallback URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to fallback to if answer URL is not reachable'
    },
    {
      name: 'callerId',
      displayName: 'Caller ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Caller ID to be used for the call'
    },
    {
      name: 'callerName',
      displayName: 'Caller Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Caller name to be used for the call'
    },
    {
      name: 'timeLimit',
      displayName: 'Time Limit',
      type: 'number',
      required: false,
      default: 14400,
      description: 'Maximum call duration in seconds (default: 14400, max: 28800)'
    },
    {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 120,
      description: 'Time to wait for call to be answered in seconds'
    },
    {
      name: 'url',
      displayName: 'Media URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of media file for MMS (image, video, audio)'
    },
    {
      name: 'type',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'sms',
      description: 'Type of message to send',
      options: [
        { name: 'SMS', value: 'sms', description: 'Send as SMS' },
        { name: 'MMS', value: 'mms', description: 'Send as MMS' }
      ]
    },
    {
      name: 'method',
      displayName: 'HTTP Method',
      type: 'options',
      required: false,
      default: 'POST',
      description: 'HTTP method for webhook calls',
      options: [
        { name: 'GET', value: 'GET', description: 'GET method' },
        { name: 'POST', value: 'POST', description: 'POST method' }
      ]
    },
    {
      name: 'log',
      displayName: 'Log',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to log the call or message'
    },
    {
      name: 'powerpackUuid',
      displayName: 'Powerpack UUID',
      type: 'string',
      required: false,
      default: '',
      description: 'UUID of the Powerpack to be used for sending SMS/MMS'
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
      description: 'The result of the Plivo operation'
    }
  ],
  credentials: ['plivoApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send SMS',
      description: 'Send a simple SMS message using Plivo',
      workflow: {
        nodes: [
          {
            name: 'Plivo',
            type: 'n8n-nodes-base.plivo',
            parameters: {
              resource: 'sms',
              operation: 'sendSms',
              from: '+1234567890',
              to: '+0987654321',
              text: 'Hello from n8n via Plivo! 📱'
            }
          }
        ]
      }
    },
    {
      name: 'Send MMS',
      description: 'Send an MMS message with media attachment',
      workflow: {
        nodes: [
          {
            name: 'Plivo',
            type: 'n8n-nodes-base.plivo',
            parameters: {
              resource: 'mms',
              operation: 'sendMms',
              from: '+1234567890',
              to: '+0987654321',
              text: 'Check out this image!',
              url: 'https://example.com/image.jpg',
              type: 'mms'
            }
          }
        ]
      }
    },
    {
      name: 'Make Voice Call',
      description: 'Make a voice call using Plivo',
      workflow: {
        nodes: [
          {
            name: 'Plivo',
            type: 'n8n-nodes-base.plivo',
            parameters: {
              resource: 'call',
              operation: 'makeCall',
              from: '+1234567890',
              to: '+0987654321',
              answerUrl: 'https://example.com/answer.xml',
              hangupUrl: 'https://example.com/hangup.xml',
              timeLimit: 3600,
              timeout: 30
            }
          }
        ]
      }
    }
  ]
};

// Export actions for the Plivo node
export const plivoActions = [
  'make_call',
  'send_sms', 
  'send_mms'
];

// Export resources
export const plivoResources = [
  'call',
  'sms',
  'mms'
];