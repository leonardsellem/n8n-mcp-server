/**
 * Google Docs Node
 * 
 * Works with Google Docs. Allows creating a new Google Doc (optionally from a template), retrieving the content or metadata of a Doc, and updating the content (for example, replacing placeholders with dynamic data). Useful for generating reports or documents via workflow.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googledocsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-docs',
  displayName: 'Google Docs',
  description: 'Works with Google Docs. Allows creating a new Google Doc (optionally from a template), retrieving the content or metadata of a Doc, and updating the content (for example, replacing placeholders with dynamic data). Useful for generating reports or documents via workflow.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Document',
      description: 'The operation to perform',
      options: [
        { name: 'Create Document', value: 'Create Document' },
        { name: 'Get Document', value: 'Get Document' },
        { name: 'Update Document', value: 'Update Document' }
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
      description: 'Processed data from Google Docs'
    }
  ],

  credentials: [
    {
      name: 'google-docsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Docs'
  },

  aliases: ['google', 'docs'],
  
  examples: [
        {
      name: 'Create Document Item',
      description: 'Create Document an item from Google Docs',
      workflow: {
        nodes: [
          {
            name: 'Google Docs',
            type: 'n8n-nodes-base.google-docs',
            parameters: {
              operation: 'Create Document',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googledocsNode;