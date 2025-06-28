/**
 * Information Extractor Node
 * 
 * An LLM chain configured to extract structured information from text. Provide it with content and it will output specific fields or data points. Useful for parsing unstructured text (like an email or article) to pull out entities or answers to predefined questions.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const informationextractorNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.information-extractor',
  displayName: 'Information Extractor',
  description: 'An LLM chain configured to extract structured information from text. Provide it with content and it will output specific fields or data points. Useful for parsing unstructured text (like an email or article) to pull out entities or answers to predefined questions.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Information Extractor'
    }
  ],

  credentials: [
    {
      name: 'information-extractorApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Information Extractor'
  },

  aliases: ['information', 'extractor'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Information Extractor',
      workflow: {
        nodes: [
          {
            name: 'Information Extractor',
            type: 'n8n-nodes-base.information-extractor',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default informationextractorNode;