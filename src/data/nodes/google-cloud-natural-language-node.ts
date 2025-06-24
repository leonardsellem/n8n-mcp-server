/**
 * Google Cloud Natural Language Node
 * 
 * Uses Google Cloud Natural Language API. You can analyze text sentiment (positive/negative tone), extract entities (proper nouns, etc.), and classify content into categories. Useful for NLP tasks like sentiment analysis or content tagging using Google’s models.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlecloudnaturallanguageNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-cloud-natural-language',
  displayName: 'Google Cloud Natural Language',
  description: 'Uses Google Cloud Natural Language API. You can analyze text sentiment (positive/negative tone), extract entities (proper nouns, etc.), and classify content into categories. Useful for NLP tasks like sentiment analysis or content tagging using Google’s models.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Analyze Sentiment',
      description: 'The operation to perform',
      options: [
        { name: 'Analyze Sentiment', value: 'Analyze Sentiment' },
        { name: 'Analyze Entities', value: 'Analyze Entities' },
        { name: 'Classify Text', value: 'Classify Text' }
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
      description: 'Processed data from Google Cloud Natural Language'
    }
  ],

  credentials: [
    {
      name: 'google-cloud-natural-languageApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Cloud Natural Language'
  },

  aliases: ['google', 'cloud', 'natural', 'language'],
  
  examples: [
        {
      name: 'Analyze Sentiment Item',
      description: 'Analyze Sentiment an item from Google Cloud Natural Language',
      workflow: {
        nodes: [
          {
            name: 'Google Cloud Natural Language',
            type: 'n8n-nodes-base.google-cloud-natural-language',
            parameters: {
              operation: 'Analyze Sentiment',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlecloudnaturallanguageNode;