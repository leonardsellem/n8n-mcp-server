/**
 * AWS Comprehend Node
 * 
 * Calls Amazon Comprehend (NLP service). It can analyze text for sentiment, extract named entities (people, places, etc.), key phrases, or identify the dominant language. Useful for adding NLP analysis to workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awscomprehendNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-comprehend',
  displayName: 'AWS Comprehend',
  description: 'Calls Amazon Comprehend (NLP service). It can analyze text for sentiment, extract named entities (people, places, etc.), key phrases, or identify the dominant language. Useful for adding NLP analysis to workflows.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Detect Sentiment',
      description: 'The operation to perform',
      options: [
        { name: 'Detect Sentiment', value: 'Detect Sentiment' },
        { name: 'Detect Entities', value: 'Detect Entities' },
        { name: 'Detect Key Phrases', value: 'Detect Key Phrases' },
        { name: 'Detect Language', value: 'Detect Language' }
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
      description: 'Processed data from AWS Comprehend'
    }
  ],

  credentials: [
    {
      name: 'aws-comprehendApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Comprehend'
  },

  aliases: ['aws', 'comprehend'],
  
  examples: [
        {
      name: 'Detect Sentiment Item',
      description: 'Detect Sentiment an item from AWS Comprehend',
      workflow: {
        nodes: [
          {
            name: 'AWS Comprehend',
            type: 'n8n-nodes-base.aws-comprehend',
            parameters: {
              operation: 'Detect Sentiment',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awscomprehendNode;