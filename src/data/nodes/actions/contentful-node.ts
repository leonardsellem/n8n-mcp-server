/**
 * Contentful Node
 * 
 * Integrates with Contentful (headless CMS). Supports retrieving content entries, creating new entries, updating entries, and publishing them (making content live). Allows automation of content management tasks in Contentful via workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const contentfulNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.contentful',
  displayName: 'Contentful',
  description: 'Integrates with Contentful (headless CMS). Supports retrieving content entries, creating new entries, updating entries, and publishing them (making content live). Allows automation of content management tasks in Contentful via workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Entry',
      description: 'The operation to perform',
      options: [
        { name: 'Get Entry', value: 'Get Entry' },
        { name: 'Create Entry', value: 'Create Entry' },
        { name: 'Update Entry', value: 'Update Entry' },
        { name: 'Publish Entry', value: 'Publish Entry' }
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
      description: 'Processed data from Contentful'
    }
  ],

  credentials: [
    {
      name: 'contentfulApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Contentful'
  },

  aliases: ['contentful'],
  
  examples: [
        {
      name: 'Get Entry Item',
      description: 'Get Entry an item from Contentful',
      workflow: {
        nodes: [
          {
            name: 'Contentful',
            type: 'n8n-nodes-base.contentful',
            parameters: {
              operation: 'Get Entry',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default contentfulNode;