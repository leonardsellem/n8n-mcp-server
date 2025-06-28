/**
 * AWS Lambda Node
 * 
 * Invokes an AWS Lambda function. You specify the function name (or ARN) and payload, and this node will execute that Lambda and return its response. Useful for triggering serverless functions as part of a workflow.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awslambdaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-lambda',
  displayName: 'AWS Lambda',
  description: 'Invokes an AWS Lambda function. You specify the function name (or ARN) and payload, and this node will execute that Lambda and return its response. Useful for triggering serverless functions as part of a workflow.',
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
      description: 'Processed data from AWS Lambda'
    }
  ],

  credentials: [
    {
      name: 'aws-lambdaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Lambda'
  },

  aliases: ['aws', 'lambda'],
  
  examples: [
        {
      name: 'Invoke Function Item',
      description: 'Invoke Function an item from AWS Lambda',
      workflow: {
        nodes: [
          {
            name: 'AWS Lambda',
            type: 'n8n-nodes-base.aws-lambda',
            parameters: {
              operation: 'Invoke Function',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awslambdaNode;