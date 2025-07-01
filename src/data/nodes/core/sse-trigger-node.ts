/**
 * # SSE Trigger
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates 
 * from a server using HTTP connection. The SSE Trigger node is used to receive server-sent events.
 * 
 * ## Key Features
 * 
 * - **Real-time Events**: Receive server-sent events as they occur
 * - **Persistent Connection**: Maintains long-lived HTTP connection to event source
 * - **Automatic Reconnection**: Handles connection drops and reconnects automatically
 * - **Event Streaming**: Process continuous streams of real-time data
 * - **Low Latency**: Near real-time event processing with minimal delay
 * - **HTTP-based**: Uses standard HTTP protocol for maximum compatibility
 * - **Custom Headers**: Support for authentication and custom headers
 * - **Reconnection Control**: Configurable reconnection intervals and limits
 * 
 * ## Node Parameters
 * 
 * ### URL (Required)
 * Enter the URL from which to receive the server-sent events (SSE). The node will establish a persistent 
 * connection to this endpoint and trigger the workflow whenever new events are received.
 * 
 * ### Options
 * - **Headers**: HTTP headers for authentication or custom configuration
 * - **Reconnect Interval**: Time to wait before reconnecting after connection loss
 * - **Max Reconnect Attempts**: Maximum number of reconnection attempts
 * 
 * ## Technical Details
 * 
 * - Uses `text/event-stream` MIME type for event data
 * - Maintains persistent HTTP connection for real-time updates  
 * - Automatically handles connection interruptions and reconnection
 * - Processes events in the order they are received
 * - Supports standard SSE event format with data, event, and id fields
 * 
 * ## Use Cases
 * 
 * - Real-time notifications and alerts from APIs
 * - Live data feeds (stock prices, sports scores, news updates)
 * - Chat applications and messaging systems
 * - IoT sensor data streaming and monitoring
 * - System monitoring and log streaming
 * - Live dashboard updates and metrics
 * - Social media feed updates and interactions
 * - Real-time collaboration tools and updates
 * - Financial market data streaming
 * - Live event tracking and analytics
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sseTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sseTrigger',
  displayName: 'SSE Trigger',
  description: 'Receive server-sent events from a specified URL. Triggers workflow execution when new events are received.',
  category: 'Core Nodes',
  subcategory: 'Triggers',
  
  properties: [
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: true,
      default: '',
      description: 'The URL from which to receive server-sent events',
      placeholder: 'https://api.example.com/events'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional SSE connection options',
      options: [
        {
          name: 'headers',
          displayName: 'Headers',
          type: 'fixedCollection',
          default: {},
          description: 'HTTP headers to send with the request',
          typeOptions: {
            multipleValues: true
          },
          options: [
            {
              name: 'parameter',
              displayName: 'Parameter',
              values: [
                {
                  name: 'name',
                  displayName: 'Name',
                  type: 'string',
                  default: '',
                  description: 'Header name'
                },
                {
                  name: 'value',
                  displayName: 'Value',
                  type: 'string',
                  default: '',
                  description: 'Header value'
                }
              ]
            }
          ]
        },
        {
          name: 'reconnectInterval',
          displayName: 'Reconnect Interval (ms)',
          type: 'number',
          default: 3000,
          description: 'Time to wait before reconnecting after connection loss'
        },
        {
          name: 'maxReconnectAttempts',
          displayName: 'Max Reconnect Attempts',
          type: 'number',
          default: 10,
          description: 'Maximum number of reconnection attempts (0 = unlimited)'
        }
      ]
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Event',
      description: 'Triggered when a server-sent event is received'
    }
  ],

  credentials: [],

  triggerNode: true,
  
  version: [1],
  defaults: {
    name: 'SSE Trigger'
  },

  aliases: ['sse', 'server-sent events', 'event stream'],
  
  examples: [
    {
      name: 'Basic SSE Connection',
      description: 'Connect to an SSE endpoint and trigger on events',
      workflow: {
        nodes: [
          {
            name: 'SSE Trigger',
            type: 'n8n-nodes-base.sseTrigger',
            parameters: {
              url: 'https://api.example.com/events'
            }
          }
        ]
      }
    },
    {
      name: 'SSE with Authentication',
      description: 'Connect to authenticated SSE endpoint',
      workflow: {
        nodes: [
          {
            name: 'SSE Trigger',
            type: 'n8n-nodes-base.sseTrigger',
            parameters: {
              url: 'https://api.example.com/events',
              options: {
                headers: {
                  parameter: [
                    {
                      name: 'Authorization',
                      value: 'Bearer your-token-here'
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    },
    {
      name: 'SSE with Custom Reconnection',
      description: 'Configure custom reconnection behavior',
      workflow: {
        nodes: [
          {
            name: 'SSE Trigger',
            type: 'n8n-nodes-base.sseTrigger',
            parameters: {
              url: 'https://api.example.com/events',
              options: {
                reconnectInterval: 5000,
                maxReconnectAttempts: 5
              }
            }
          }
        ]
      }
    }
  ]
};

export default sseTriggerNode;
