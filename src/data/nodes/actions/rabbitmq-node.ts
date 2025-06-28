import { NodeTypeInfo } from '../../node-types.js';

export const rabbitmqNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rabbitmq',
  displayName: 'RabbitMQ',
  description: 'Use the RabbitMQ node to automate work in RabbitMQ, and integrate RabbitMQ with other applications. n8n has built-in support for a wide range of RabbitMQ features, including accepting, and forwarding messages.',
  category: 'Communication',
  subcategory: 'Message Queues',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'sendMessage',
      description: 'The operation to perform',
      options: [
        { name: 'Send a Message to RabbitMQ', value: 'sendMessage', description: 'Send a message to a RabbitMQ queue or exchange' },
        { name: 'Delete From Queue', value: 'deleteFromQueue', description: 'Delete messages from a RabbitMQ queue' }
      ]
    },
    {
      name: 'queue',
      displayName: 'Queue',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the queue to operate on'
    },
    {
      name: 'exchange',
      displayName: 'Exchange',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the exchange to publish to (optional for direct queue publishing)'
    },
    {
      name: 'routingKey',
      displayName: 'Routing Key',
      type: 'string',
      required: false,
      default: '',
      description: 'Routing key for message routing'
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
      name: 'sendInputData',
      displayName: 'Send Input Data',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to send the node input data as the message content'
    },
    {
      name: 'messageFormat',
      displayName: 'Message Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'Format of the message to send',
      options: [
        { name: 'JSON', value: 'json', description: 'Send as JSON string' },
        { name: 'String', value: 'string', description: 'Send as plain string' },
        { name: 'Buffer', value: 'buffer', description: 'Send as binary buffer' }
      ]
    },
    {
      name: 'persistent',
      displayName: 'Persistent',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the message should survive broker restarts'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'number',
      required: false,
      default: 0,
      description: 'Message priority (0-255)'
    },
    {
      name: 'expiration',
      displayName: 'Expiration (ms)',
      type: 'number',
      required: false,
      default: 0,
      description: 'Message expiration time in milliseconds (0 = no expiration)'
    },
    {
      name: 'headers',
      displayName: 'Headers',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object of message headers'
    },
    {
      name: 'exchangeType',
      displayName: 'Exchange Type',
      type: 'options',
      required: false,
      default: 'direct',
      description: 'Type of exchange for message routing',
      options: [
        { name: 'Direct', value: 'direct', description: 'Route messages with exact routing key match' },
        { name: 'Topic', value: 'topic', description: 'Route messages based on wildcard pattern matching' },
        { name: 'Fanout', value: 'fanout', description: 'Route messages to all bound queues' },
        { name: 'Headers', value: 'headers', description: 'Route messages based on header attributes' }
      ]
    },
    {
      name: 'durable',
      displayName: 'Durable Queue',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the queue should survive broker restarts'
    },
    {
      name: 'autoDelete',
      displayName: 'Auto Delete',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the queue should be deleted when no longer in use'
    },
    {
      name: 'exclusive',
      displayName: 'Exclusive',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the queue should be exclusive to the connection'
    },
    {
      name: 'acknowledgements',
      displayName: 'Acknowledgements',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to use message acknowledgements'
    },
    {
      name: 'maxMessages',
      displayName: 'Max Messages',
      type: 'number',
      required: false,
      default: 1,
      description: 'Maximum number of messages to delete from queue (for delete operation)'
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
      description: 'Returns information about the RabbitMQ operation'
    }
  ],
  credentials: ['rabbitmq'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Simple Message',
      description: 'Send a simple message to a RabbitMQ queue',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ',
            type: 'n8n-nodes-base.rabbitmq',
            parameters: {
              operation: 'sendMessage',
              queue: 'task_queue',
              message: '{"task": "process_data", "id": 12345}',
              persistent: true,
              messageFormat: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Send to Exchange',
      description: 'Send a message to a RabbitMQ exchange with routing key',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ',
            type: 'n8n-nodes-base.rabbitmq',
            parameters: {
              operation: 'sendMessage',
              exchange: 'notifications',
              routingKey: 'email.urgent',
              message: '{"to": "user@example.com", "subject": "Alert", "body": "System alert message"}',
              exchangeType: 'topic',
              persistent: true,
              priority: 5
            }
          }
        ]
      }
    },
    {
      name: 'Send Input Data',
      description: 'Send workflow input data to RabbitMQ queue',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ',
            type: 'n8n-nodes-base.rabbitmq',
            parameters: {
              operation: 'sendMessage',
              queue: 'user_events',
              sendInputData: true,
              routingKey: '{{$json["eventType"]}}',
              persistent: true,
              headers: '{"source": "n8n", "timestamp": "{{$now}}"}'
            }
          }
        ]
      }
    },
    {
      name: 'Fanout Broadcasting',
      description: 'Broadcast message to all queues bound to fanout exchange',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ',
            type: 'n8n-nodes-base.rabbitmq',
            parameters: {
              operation: 'sendMessage',
              exchange: 'broadcast',
              exchangeType: 'fanout',
              message: '{"announcement": "System maintenance scheduled", "time": "2024-01-01T02:00:00Z"}',
              persistent: true
            }
          }
        ]
      }
    },
    {
      name: 'Delete Messages',
      description: 'Delete messages from a RabbitMQ queue',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ',
            type: 'n8n-nodes-base.rabbitmq',
            parameters: {
              operation: 'deleteFromQueue',
              queue: 'cleanup_queue',
              maxMessages: 10,
              acknowledgements: true
            }
          }
        ]
      }
    }
  ]
};

export const rabbitmqTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rabbitmqtrigger',
  displayName: 'RabbitMQ Trigger',
  description: 'RabbitMQ is an open-source message broker that accepts and forwards messages. This trigger listens for messages on specified RabbitMQ queues and exchanges.',
  category: 'Communication',
  subcategory: 'Message Queues',
  properties: [
    {
      name: 'queue',
      displayName: 'Queue',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the queue to listen to for messages'
    },
    {
      name: 'exchange',
      displayName: 'Exchange',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the exchange to bind to (optional for direct queue consumption)'
    },
    {
      name: 'routingKey',
      displayName: 'Routing Key',
      type: 'string',
      required: false,
      default: '',
      description: 'Routing key pattern for message filtering (supports wildcards * and #)'
    },
    {
      name: 'exchangeType',
      displayName: 'Exchange Type',
      type: 'options',
      required: false,
      default: 'direct',
      description: 'Type of exchange for message routing',
      options: [
        { name: 'Direct', value: 'direct', description: 'Route messages with exact routing key match' },
        { name: 'Topic', value: 'topic', description: 'Route messages based on wildcard pattern matching' },
        { name: 'Fanout', value: 'fanout', description: 'Route messages to all bound queues' },
        { name: 'Headers', value: 'headers', description: 'Route messages based on header attributes' }
      ]
    },
    {
      name: 'durable',
      displayName: 'Durable Queue',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the queue should survive broker restarts'
    },
    {
      name: 'autoDelete',
      displayName: 'Auto Delete',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the queue should be deleted when no longer in use'
    },
    {
      name: 'exclusive',
      displayName: 'Exclusive',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the queue should be exclusive to the connection'
    },
    {
      name: 'acknowledgements',
      displayName: 'Acknowledgements',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to acknowledge received messages'
    },
    {
      name: 'prefetch',
      displayName: 'Prefetch Count',
      type: 'number',
      required: false,
      default: 1,
      description: 'Number of unacknowledged messages that can be processed simultaneously'
    },
    {
      name: 'outputFormat',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'How to format the received message data',
      options: [
        { name: 'JSON', value: 'json', description: 'Parse message as JSON if possible' },
        { name: 'String', value: 'string', description: 'Return message as string' },
        { name: 'Buffer', value: 'buffer', description: 'Return raw message buffer' }
      ]
    },
    {
      name: 'includeHeaders',
      displayName: 'Include Headers',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include message headers in the output'
    },
    {
      name: 'includeProperties',
      displayName: 'Include Properties',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include message properties in the output'
    },
    {
      name: 'includeExchangeRoutingKey',
      displayName: 'Include Exchange & Routing Key',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include exchange and routing key information in the output'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when messages are received from RabbitMQ queues'
    }
  ],
  credentials: ['rabbitmq'],
  triggerNode: true,
  polling: false,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor Task Queue',
      description: 'Trigger workflow when new tasks are added to a processing queue',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ Trigger',
            type: 'n8n-nodes-base.rabbitmqtrigger',
            parameters: {
              queue: 'task_queue',
              durable: true,
              acknowledgements: true,
              prefetch: 1,
              outputFormat: 'json',
              includeHeaders: true,
              includeProperties: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Exchange with Routing',
      description: 'Listen for messages on exchange with specific routing pattern',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ Trigger',
            type: 'n8n-nodes-base.rabbitmqtrigger',
            parameters: {
              queue: 'notification_queue',
              exchange: 'notifications',
              routingKey: 'email.*',
              exchangeType: 'topic',
              durable: true,
              acknowledgements: true,
              outputFormat: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'High Throughput Processing',
      description: 'Process multiple messages simultaneously with higher prefetch',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ Trigger',
            type: 'n8n-nodes-base.rabbitmqtrigger',
            parameters: {
              queue: 'batch_processing',
              durable: true,
              acknowledgements: true,
              prefetch: 10,
              outputFormat: 'json',
              includeHeaders: false,
              includeProperties: false
            }
          }
        ]
      }
    },
    {
      name: 'Fanout Consumer',
      description: 'Consume messages from a fanout exchange',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ Trigger',
            type: 'n8n-nodes-base.rabbitmqtrigger',
            parameters: {
              queue: '',
              exchange: 'broadcast',
              exchangeType: 'fanout',
              autoDelete: true,
              exclusive: true,
              acknowledgements: true,
              outputFormat: 'json'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const rabbitmqNodes: NodeTypeInfo[] = [rabbitmqNode, rabbitmqTriggerNode];

// Export individual actions for the regular RabbitMQ node
export const rabbitmqActions = [
  'send_message',
  'delete_from_queue',
  'publish_to_exchange',
  'queue_management',
  'message_routing'
];

// Export trigger events
export const rabbitmqTriggers = [
  'message_received',
  'queue_consumption',
  'exchange_binding',
  'routing_key_match'
];

// Export RabbitMQ-specific utilities
export const rabbitmqUtils = {
  exchangeTypes: ['direct', 'topic', 'fanout', 'headers'],
  messageFormats: ['json', 'string', 'buffer'],
  defaultPorts: {
    amqp: 5672,
    amqps: 5671,
    management: 15672,
    managementTLS: 15671
  },
  wildcards: {
    topic: {
      singleWord: '*',
      multipleWords: '#'
    }
  },
  acknowledgmentModes: ['auto', 'manual'],
  deliveryModes: {
    nonPersistent: 1,
    persistent: 2
  }
};