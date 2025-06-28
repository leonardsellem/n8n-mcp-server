/**
 * AWS SNS Node
 * 
 * Publishes messages to an AWS SNS topic. You can send a notification message (text or JSON) to a specified SNS topic, which can then broadcast to subscribers (SMS, email, or other AWS services).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awssnsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-sns',
  displayName: 'AWS SNS',
  description: 'Publishes messages to an AWS SNS topic. You can send a notification message (text or JSON) to a specified SNS topic, which can then broadcast to subscribers (SMS, email, or other AWS services).',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from AWS SNS'
    }
  ],

  credentials: [
    {
      name: 'aws-snsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS SNS'
  },

  aliases: ['aws', 'sns'],
  
  examples: [
        {
      name: 'Publish Message Item',
      description: 'Publish Message an item from AWS SNS',
      workflow: {
        nodes: [
          {
            name: 'AWS SNS',
            type: 'n8n-nodes-base.aws-sns',
            parameters: {
              operation: 'Publish Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awssnsNode;