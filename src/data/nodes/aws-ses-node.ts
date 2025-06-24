/**
 * AWS SES Node
 * 
 * Uses Amazon SES (Simple Email Service) to send emails. You provide the email parameters (to, subject, body, etc.), and SES will send the email. Useful for sending transactional emails via AWS within a workflow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awssesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-ses',
  displayName: 'AWS SES',
  description: 'Uses Amazon SES (Simple Email Service) to send emails. You provide the email parameters (to, subject, body, etc.), and SES will send the email. Useful for sending transactional emails via AWS within a workflow.',
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
      description: 'Processed data from AWS SES'
    }
  ],

  credentials: [
    {
      name: 'aws-sesApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS SES'
  },

  aliases: ['aws', 'ses'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from AWS SES',
      workflow: {
        nodes: [
          {
            name: 'AWS SES',
            type: 'n8n-nodes-base.aws-ses',
            parameters: {
              operation: 'Send Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awssesNode;