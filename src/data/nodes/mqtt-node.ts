import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const mqttNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mqtt',
  displayName: 'MQTT',
  description: 'Use the MQTT node to automate work in MQTT, and integrate MQTT with other applications. n8n supports transporting messages with MQTT.',
  category: 'Communication',
  subcategory: 'IoT',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      options: [
        { name: 'Send', value: 'send', description: 'Send a message to an MQTT topic' }
      ]
    },
    {
      name: 'topic',
      displayName: 'Topic',
      type: 'string',
      required: true,
      default: '',
      description: 'The MQTT topic to send the message to'
    },
    {
      name: 'sendInputData',
      displayName: 'Send Input Data',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to send the node input data as part of the message'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message to send. If empty and Send Input Data is enabled, the input data will be sent'
    },
    {
      name: 'qos',
      displayName: 'QoS Level',
      type: 'options',
      required: false,
      default: 0,
      description: 'Quality of Service level for message delivery',
      options: [
        { name: '0 - At most once', value: 0, description: 'Fire and forget' },
        { name: '1 - At least once', value: 1, description: 'Acknowledged delivery' },
        { name: '2 - Exactly once', value: 2, description: 'Assured delivery' }
      ]
    },
    {
      name: 'retain',
      displayName: 'Retain',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to retain the message on the broker'
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
      description: 'Returns information about the sent message'
    }
  ],
  credentials: ['mqtt'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Simple Message',
      description: 'Send a simple text message to an MQTT topic',
      workflow: {
        nodes: [
          {
            name: 'MQTT',
            type: 'n8n-nodes-base.mqtt',
            parameters: {
              operation: 'send',
              topic: 'sensors/temperature',
              message: '{"temperature": 22.5, "humidity": 65}',
              qos: 1,
              retain: false
            }
          }
        ]
      }
    },
    {
      name: 'Send Input Data',
      description: 'Send workflow input data to MQTT topic',
      workflow: {
        nodes: [
          {
            name: 'MQTT',
            type: 'n8n-nodes-base.mqtt',
            parameters: {
              operation: 'send',
              topic: 'devices/{{$json["deviceId"]}}',
              sendInputData: true,
              qos: 1,
              retain: true
            }
          }
        ]
      }
    },
    {
      name: 'IoT Sensor Data',
      description: 'Send IoT sensor readings to different topics based on sensor type',
      workflow: {
        nodes: [
          {
            name: 'MQTT',
            type: 'n8n-nodes-base.mqtt',
            parameters: {
              operation: 'send',
              topic: 'iot/{{$json["sensorType"]}}/{{$json["location"]}}',
              sendInputData: true,
              qos: 2,
              retain: false,
              messageFormat: 'json'
            }
          }
        ]
      }
    }
  ]
};

export const mqttTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mqtttrigger',
  displayName: 'MQTT Trigger',
  description: 'MQTT is an open OASIS and ISO standard lightweight, publish-subscribe network protocol that transports messages between devices. This trigger listens for messages on specified MQTT topics.',
  category: 'Communication',
  subcategory: 'IoT',
  properties: [
    {
      name: 'topics',
      displayName: 'Topics',
      type: 'string',
      required: true,
      default: '',
      description: 'Comma-separated list of MQTT topics to subscribe to. Supports wildcards (+ for single level, # for multi-level)'
    },
    {
      name: 'qos',
      displayName: 'QoS Level',
      type: 'options',
      required: false,
      default: 0,
      description: 'Quality of Service level for message subscription',
      options: [
        { name: '0 - At most once', value: 0, description: 'Fire and forget' },
        { name: '1 - At least once', value: 1, description: 'Acknowledged delivery' },
        { name: '2 - Exactly once', value: 2, description: 'Assured delivery' }
      ]
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
      name: 'includeTopicInOutput',
      displayName: 'Include Topic in Output',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include the MQTT topic in the output data'
    },
    {
      name: 'includeTimestamp',
      displayName: 'Include Timestamp',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include a timestamp when the message was received'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when messages are received on subscribed MQTT topics'
    }
  ],
  credentials: ['mqtt'],
  triggerNode: true,
  polling: false,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor Temperature Sensors',
      description: 'Trigger workflow when temperature sensor data is received',
      workflow: {
        nodes: [
          {
            name: 'MQTT Trigger',
            type: 'n8n-nodes-base.mqtttrigger',
            parameters: {
              topics: 'sensors/temperature/+',
              qos: 1,
              outputFormat: 'json',
              includeTopicInOutput: true,
              includeTimestamp: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor All IoT Devices',
      description: 'Trigger on any message from IoT devices using multi-level wildcard',
      workflow: {
        nodes: [
          {
            name: 'MQTT Trigger',
            type: 'n8n-nodes-base.mqtttrigger',
            parameters: {
              topics: 'iot/#',
              qos: 0,
              outputFormat: 'json',
              includeTopicInOutput: true,
              includeTimestamp: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Multiple Topics',
      description: 'Monitor multiple specific topics for different sensor types',
      workflow: {
        nodes: [
          {
            name: 'MQTT Trigger',
            type: 'n8n-nodes-base.mqtttrigger',
            parameters: {
              topics: 'sensors/temperature,sensors/humidity,sensors/pressure',
              qos: 2,
              outputFormat: 'json',
              includeTopicInOutput: true,
              includeTimestamp: true
            }
          }
        ]
      }
    },
    {
      name: 'Raw Data Monitor',
      description: 'Monitor for binary data transmissions',
      workflow: {
        nodes: [
          {
            name: 'MQTT Trigger',
            type: 'n8n-nodes-base.mqtttrigger',
            parameters: {
              topics: 'binary/data/+',
              qos: 1,
              outputFormat: 'buffer',
              includeTopicInOutput: true,
              includeTimestamp: true
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const mqttNodes: NodeTypeInfo[] = [mqttNode, mqttTriggerNode];

// Export individual actions for the regular MQTT node
export const mqttActions = [
  'send_message'
];

// Export trigger events
export const mqttTriggers = [
  'message_received',
  'topic_subscription',
  'wildcard_match'
];

// Export MQTT-specific utilities
export const mqttUtils = {
  protocols: ['mqtt', 'mqtts', 'ws', 'wss'],
  qosLevels: [0, 1, 2],
  wildcards: {
    singleLevel: '+',
    multiLevel: '#'
  },
  defaultPorts: {
    mqtt: 1883,
    mqtts: 8883,
    ws: 1884,
    wss: 8884
  }
};