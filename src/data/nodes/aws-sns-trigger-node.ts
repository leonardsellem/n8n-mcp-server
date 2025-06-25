/**
 * AWS SNS Trigger Node - Trigger
 * 
 * Triggers the workflow when an AWS SNS topic receives a new message:contentReference[oaicite:54]{index=54}. n8n subscribes to the SNS topic via HTTP(S) subscription, and when SNS publishes a notification, it hits this trigger. Allows integration with AWS event-driven setups (for example, invoke a workflow on an SNS alarm or IoT message).
 */

import { NodeTypeInfo } from '../node-types.js';

export const awssnstriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-sns-trigger',
  displayName: 'AWS SNS Trigger',
  description: 'Triggers the workflow when an AWS SNS topic receives a new message:contentReference[oaicite:54]{index=54}. n8n subscribes to the SNS topic via HTTP(S) subscription, and when SNS publishes a notification, it hits this trigger. Allows integration with AWS event-driven setups (for example, invoke a workflow on an SNS alarm or IoT message).',
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
      name: 'aws-sns-triggerApi',
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
    name: 'AWS SNS Trigger'
  },

  aliases: ['aws', 'sns', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in AWS SNS Trigger',
      workflow: {
        nodes: [
          {
            name: 'AWS SNS Trigger Trigger',
            type: 'n8n-nodes-base.aws-sns-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default awssnstriggerNode;