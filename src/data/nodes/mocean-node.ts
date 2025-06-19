import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const moceanNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mocean',
  displayName: 'Mocean',
  description: 'Use the Mocean node to automate work in Mocean, and integrate Mocean with other applications. n8n has built-in support for a wide range of Mocean features, including sending SMS, and voice messages.',
  category: 'Communication',
  subcategory: 'SMS',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'sms',
      description: 'The resource to operate on',
      options: [
        { name: 'SMS', value: 'sms', description: 'Send SMS messages' },
        { name: 'Voice', value: 'voice', description: 'Send voice messages' }
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
        { name: 'Send SMS/Voice message', value: 'send', description: 'Send SMS or voice message' }
      ]
    },
    {
      name: 'from',
      displayName: 'From',
      type: 'string',
      required: true,
      default: '',
      description: 'The sender ID or phone number'
    },
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      required: true,
      default: '',
      description: 'The recipient phone number in international format'
    },
    {
      name: 'text',
      displayName: 'Message Text',
      type: 'string',
      required: true,
      default: '',
      description: 'The text content of the message to be sent'
    },
    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'SMS',
      description: 'The type of message to send',
      options: [
        { name: 'SMS', value: 'SMS', description: 'Send SMS message' },
        { name: 'TTS', value: 'TTS', description: 'Send Text-to-Speech voice message' }
      ]
    },
    {
      name: 'language',
      displayName: 'Language',
      type: 'options',
      required: false,
      default: 'en-US',
      description: 'Language for Text-to-Speech (TTS) messages',
      options: [
        { name: 'English (US)', value: 'en-US', description: 'English (United States)' },
        { name: 'English (UK)', value: 'en-GB', description: 'English (United Kingdom)' },
        { name: 'Spanish', value: 'es-ES', description: 'Spanish' },
        { name: 'French', value: 'fr-FR', description: 'French' },
        { name: 'German', value: 'de-DE', description: 'German' },
        { name: 'Italian', value: 'it-IT', description: 'Italian' },
        { name: 'Portuguese', value: 'pt-PT', description: 'Portuguese' },
        { name: 'Russian', value: 'ru-RU', description: 'Russian' },
        { name: 'Japanese', value: 'ja-JP', description: 'Japanese' },
        { name: 'Korean', value: 'ko-KR', description: 'Korean' },
        { name: 'Chinese (Simplified)', value: 'zh-CN', description: 'Chinese (Simplified)' },
        { name: 'Chinese (Traditional)', value: 'zh-TW', description: 'Chinese (Traditional)' }
      ]
    },
    {
      name: 'voice',
      displayName: 'Voice',
      type: 'options',
      required: false,
      default: 'female',
      description: 'Voice type for Text-to-Speech (TTS) messages',
      options: [
        { name: 'Female', value: 'female', description: 'Female voice' },
        { name: 'Male', value: 'male', description: 'Male voice' }
      ]
    },
    {
      name: 'speed',
      displayName: 'Speech Speed',
      type: 'number',
      required: false,
      default: 1,
      description: 'Speech speed for TTS messages (0.5 to 2.0)'
    },
    {
      name: 'repeat',
      displayName: 'Repeat',
      type: 'number',
      required: false,
      default: 1,
      description: 'Number of times to repeat the voice message (1-10)'
    },
    {
      name: 'dlrUrl',
      displayName: 'Delivery Receipt URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to receive delivery receipt notifications'
    },
    {
      name: 'udh',
      displayName: 'UDH',
      type: 'string',
      required: false,
      default: '',
      description: 'User Data Header for advanced SMS features'
    },
    {
      name: 'coding',
      displayName: 'Coding',
      type: 'options',
      required: false,
      default: '0',
      description: 'SMS encoding type',
      options: [
        { name: 'Auto', value: '0', description: 'Auto-detect encoding' },
        { name: 'GSM 7-bit', value: '1', description: 'GSM 7-bit encoding' },
        { name: 'Unicode', value: '2', description: 'Unicode (UCS-2) encoding' }
      ]
    },
    {
      name: 'schedule',
      displayName: 'Schedule',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Schedule message for future delivery (ISO 8601 format)'
    },
    {
      name: 'validity',
      displayName: 'Validity Period',
      type: 'number',
      required: false,
      default: 0,
      description: 'Message validity period in minutes (0 = unlimited)'
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
      description: 'The processed Mocean response data'
    }
  ],
  credentials: ['moceanApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send SMS Message',
      description: 'Send a simple SMS message',
      workflow: {
        nodes: [
          {
            name: 'Mocean',
            type: 'n8n-nodes-base.mocean',
            parameters: {
              resource: 'sms',
              operation: 'send',
              from: 'YourCompany',
              to: '+1234567890',
              text: 'Hello from n8n! This is a test SMS message.',
              messageType: 'SMS'
            }
          }
        ]
      }
    },
    {
      name: 'Send Voice Message',
      description: 'Send a Text-to-Speech voice message',
      workflow: {
        nodes: [
          {
            name: 'Mocean',
            type: 'n8n-nodes-base.mocean',
            parameters: {
              resource: 'voice',
              operation: 'send',
              from: '+1234567890',
              to: '+0987654321',
              text: 'Hello, this is an automated voice message from your system.',
              messageType: 'TTS',
              language: 'en-US',
              voice: 'female',
              speed: 1.0,
              repeat: 1
            }
          }
        ]
      }
    },
    {
      name: 'Send Scheduled SMS',
      description: 'Schedule an SMS message for future delivery',
      workflow: {
        nodes: [
          {
            name: 'Mocean',
            type: 'n8n-nodes-base.mocean',
            parameters: {
              resource: 'sms',
              operation: 'send',
              from: 'Reminder',
              to: '+1234567890',
              text: 'This is your scheduled reminder message.',
              messageType: 'SMS',
              schedule: '2024-12-31T12:00:00Z',
              dlrUrl: 'https://your-webhook-url.com/delivery-receipt'
            }
          }
        ]
      }
    },
    {
      name: 'Send Unicode SMS',
      description: 'Send SMS with Unicode characters (emoji, special chars)',
      workflow: {
        nodes: [
          {
            name: 'Mocean',
            type: 'n8n-nodes-base.mocean',
            parameters: {
              resource: 'sms',
              operation: 'send',
              from: 'UnicodeTest',
              to: '+1234567890',
              text: 'Hello! 👋 This message contains emoji and special characters: ñ, ü, 中文',
              messageType: 'SMS',
              coding: '2'
            }
          }
        ]
      }
    },
    {
      name: 'Send Multilingual Voice Message',
      description: 'Send voice message in different language',
      workflow: {
        nodes: [
          {
            name: 'Mocean',
            type: 'n8n-nodes-base.mocean',
            parameters: {
              resource: 'voice',
              operation: 'send',
              from: '+1234567890',
              to: '+0987654321',
              text: 'Hola, este es un mensaje de voz automatizado de su sistema.',
              messageType: 'TTS',
              language: 'es-ES',
              voice: 'male',
              speed: 0.9,
              repeat: 2
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const moceanNodes: NodeTypeInfo[] = [moceanNode];

// Export individual actions for the Mocean node
export const moceanActions = [
  'send_sms_message',
  'send_voice_message'
];

// No trigger node exists for Mocean (not mentioned in documentation)
export const moceanTriggers: string[] = [];