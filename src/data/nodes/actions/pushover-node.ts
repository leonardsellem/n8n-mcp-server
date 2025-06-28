import { NodeTypeInfo } from '../../node-types.js';

export const pushoverNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pushover',
  displayName: 'Pushover',
  description: 'Use the Pushover node to automate work in Pushover, and integrate Pushover with other applications. n8n supports sending push notifications with Pushover.',
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
        { name: 'Message', value: 'message', description: 'Work with message operations' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'push',
      description: 'The operation to perform',
      options: [
        { name: 'Push', value: 'push', description: 'Send a push notification' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: true,
      default: '',
      description: 'Your message content (required)'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Your message title, otherwise your app name is used'
    },
    {
      name: 'user',
      displayName: 'User Key',
      type: 'string',
      required: true,
      default: '',
      description: 'The user/group key (not e-mail address) of your user (or you)'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: '0',
      description: 'Message priority',
      options: [
        { name: 'Lowest Priority', value: '-2', description: 'No notification/alert' },
        { name: 'Low Priority', value: '-1', description: 'Quiet notification' },
        { name: 'Normal Priority', value: '0', description: 'Normal notification' },
        { name: 'High Priority', value: '1', description: 'High-priority notification' },
        { name: 'Emergency Priority', value: '2', description: 'Emergency priority (requires retry and expire)' }
      ]
    },
    {
      name: 'sound',
      displayName: 'Sound',
      type: 'options',
      required: false,
      default: '',
      description: 'The name of the sound to play',
      options: [
        { name: 'Default', value: '', description: 'Use user default sound' },
        { name: 'Pushover', value: 'pushover', description: 'Pushover (default)' },
        { name: 'Bike', value: 'bike', description: 'Bike' },
        { name: 'Bugle', value: 'bugle', description: 'Bugle' },
        { name: 'Cash Register', value: 'cashregister', description: 'Cash Register' },
        { name: 'Classical', value: 'classical', description: 'Classical' },
        { name: 'Cosmic', value: 'cosmic', description: 'Cosmic' },
        { name: 'Falling', value: 'falling', description: 'Falling' },
        { name: 'Gamelan', value: 'gamelan', description: 'Gamelan' },
        { name: 'Incoming', value: 'incoming', description: 'Incoming' },
        { name: 'Intermission', value: 'intermission', description: 'Intermission' },
        { name: 'Magic', value: 'magic', description: 'Magic' },
        { name: 'Mechanical', value: 'mechanical', description: 'Mechanical' },
        { name: 'Piano Bar', value: 'pianobar', description: 'Piano Bar' },
        { name: 'Siren', value: 'siren', description: 'Siren' },
        { name: 'Space Alarm', value: 'spacealarm', description: 'Space Alarm' },
        { name: 'Tug Boat', value: 'tugboat', description: 'Tug Boat' },
        { name: 'Alien Alarm (long)', value: 'alien', description: 'Alien Alarm (long)' },
        { name: 'Climb (long)', value: 'climb', description: 'Climb (long)' },
        { name: 'Persistent (long)', value: 'persistent', description: 'Persistent (long)' },
        { name: 'Pushover Echo (long)', value: 'echo', description: 'Pushover Echo (long)' },
        { name: 'Up Down (long)', value: 'updown', description: 'Up Down (long)' },
        { name: 'Vibrate Only', value: 'vibrate', description: 'Vibrate Only' },
        { name: 'None (silent)', value: 'none', description: 'None (silent)' }
      ]
    },
    {
      name: 'device',
      displayName: 'Device',
      type: 'string',
      required: false,
      default: '',
      description: 'Your user device name to send the message directly to that device, rather than all of the user devices (multiple devices may be separated by a comma)'
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: false,
      default: '',
      description: 'A supplementary URL to show with your message'
    },
    {
      name: 'urlTitle',
      displayName: 'URL Title',
      type: 'string',
      required: false,
      default: '',
      description: 'A title for your supplementary URL, otherwise just the URL is shown'
    },
    {
      name: 'timestamp',
      displayName: 'Timestamp',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'A Unix timestamp of your message date and time to display to the user, rather than the time your message is received by our API'
    },
    {
      name: 'retry',
      displayName: 'Retry',
      type: 'number',
      required: false,
      default: 60,
      description: 'How often (in seconds) the Pushover servers will send the same notification to the user (required for emergency priority)'
    },
    {
      name: 'expire',
      displayName: 'Expire',
      type: 'number',
      required: false,
      default: 3600,
      description: 'How many seconds your notification will continue to be retried for (required for emergency priority)'
    },
    {
      name: 'callback',
      displayName: 'Callback URL',
      type: 'string',
      required: false,
      default: '',
      description: 'A publicly-accessible URL that our servers will send a request to when the user has acknowledged your notification (for emergency priority)'
    },
    {
      name: 'html',
      displayName: 'HTML',
      type: 'boolean',
      required: false,
      default: false,
      description: 'To enable HTML formatting'
    },
    {
      name: 'monospace',
      displayName: 'Monospace',
      type: 'boolean',
      required: false,
      default: false,
      description: 'To enable monospace formatting'
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
      description: 'The processed Pushover data'
    }
  ],
  credentials: ['pushoverApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Simple Message',
      description: 'Send a basic push notification',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: 'Hello from n8n!',
              title: 'n8n Notification',
              user: 'YOUR_USER_KEY'
            }
          }
        ]
      }
    },
    {
      name: 'High Priority Alert',
      description: 'Send a high-priority notification with custom sound',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: 'This is an important alert!',
              title: 'High Priority Alert',
              user: 'YOUR_USER_KEY',
              priority: '1',
              sound: 'siren'
            }
          }
        ]
      }
    },
    {
      name: 'Emergency Notification',
      description: 'Send an emergency notification that requires acknowledgment',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: 'CRITICAL: System failure detected!',
              title: 'Emergency Alert',
              user: 'YOUR_USER_KEY',
              priority: '2',
              retry: 60,
              expire: 3600,
              sound: 'spacealarm'
            }
          }
        ]
      }
    },
    {
      name: 'Message with URL',
      description: 'Send a notification with a supplementary URL',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: 'Check out this workflow automation platform!',
              title: 'Interesting Link',
              user: 'YOUR_USER_KEY',
              url: 'https://n8n.io',
              urlTitle: 'Visit n8n'
            }
          }
        ]
      }
    },
    {
      name: 'Device Specific Message',
      description: 'Send a notification to specific devices only',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: 'This message goes to specific devices only',
              title: 'Device Specific',
              user: 'YOUR_USER_KEY',
              device: 'iphone,android'
            }
          }
        ]
      }
    },
    {
      name: 'HTML Formatted Message',
      description: 'Send a notification with HTML formatting',
      workflow: {
        nodes: [
          {
            name: 'Pushover',
            type: 'n8n-nodes-base.pushover',
            parameters: {
              resource: 'message',
              operation: 'push',
              message: '<b>Bold text</b> and <i>italic text</i> with <u>underline</u>',
              title: 'HTML Message',
              user: 'YOUR_USER_KEY',
              html: true
            }
          }
        ]
      }
    }
  ]
};

// Export the node
export const pushoverNodes: NodeTypeInfo[] = [pushoverNode];

// Export individual actions for the Pushover node
export const pushoverActions = [
  'send_push_notification'
];

// Priority levels supported
export const pushoverPriorityLevels = [
  '-2', // Lowest
  '-1', // Low
  '0',  // Normal
  '1',  // High
  '2'   // Emergency
];

// Sounds supported
export const pushoverSounds = [
  'pushover', 'bike', 'bugle', 'cashregister', 'classical', 'cosmic',
  'falling', 'gamelan', 'incoming', 'intermission', 'magic', 'mechanical',
  'pianobar', 'siren', 'spacealarm', 'tugboat', 'alien', 'climb',
  'persistent', 'echo', 'updown', 'vibrate', 'none'
];

// Export for easier access
export default pushoverNode;