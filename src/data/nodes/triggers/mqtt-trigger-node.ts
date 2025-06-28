/**
 * MQTT Trigger Node - Trigger
 * 
 * Fires whenever a new MQTT message arrives on a subscribed topic:contentReference[oaicite:71]{index=71}. By connecting to an MQTT broker and subscribing to topics, this trigger feeds messages into workflows in real time. It’s ideal for IoT scenarios—e.g., sensor updates come in via MQTT and you process or store them immediately.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mqtttriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mqtt-trigger',
  displayName: 'MQTT Trigger',
  description: 'Fires whenever a new MQTT message arrives on a subscribed topic:contentReference[oaicite:71]{index=71}. By connecting to an MQTT broker and subscribing to topics, this trigger feeds messages into workflows in real time. It’s ideal for IoT scenarios—e.g., sensor updates come in via MQTT and you process or store them immediately.',
  category: 'Core',
  subcategory: 'Trigger',
  
  properties: [
        {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }
  ],

  inputs: [
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when events occur'
    }
  ],

  credentials: [
    {
      name: 'mqtt-triggerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  version: [1],
  defaults: {
    name: 'MQTT Trigger'
  },

  aliases: ['mqtt', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in MQTT Trigger',
      workflow: {
        nodes: [
          {
            name: 'MQTT Trigger Trigger',
            type: 'n8n-nodes-base.mqtt-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mqtttriggerNode;