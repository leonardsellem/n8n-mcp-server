/**
 * Kafka Node
 * 
 * Works with Apache Kafka (streaming platform). Allows producing (publishing) a message to a Kafka topic and consuming messages from a topic. Useful for integrating streaming data pipelines or bridging Kafka with other systems.
 */

import { NodeTypeInfo } from '../node-types.js';

export const kafkaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.kafka',
  displayName: 'Kafka',
  description: 'Works with Apache Kafka (streaming platform). Allows producing (publishing) a message to a Kafka topic and consuming messages from a topic. Useful for integrating streaming data pipelines or bridging Kafka with other systems.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Produce Message',
      description: 'The operation to perform',
      options: [
        { name: 'Produce Message', value: 'Produce Message' },
        { name: 'Consume Messages', value: 'Consume Messages' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from Kafka'
    }
  ],

  credentials: [
    {
      name: 'kafkaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Kafka'
  },

  aliases: ['kafka'],
  
  examples: [
        {
      name: 'Produce Message Item',
      description: 'Produce Message an item from Kafka',
      workflow: {
        nodes: [
          {
            name: 'Kafka',
            type: 'n8n-nodes-base.kafka',
            parameters: {
              operation: 'Produce Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default kafkaNode;