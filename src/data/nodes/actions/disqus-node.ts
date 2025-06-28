/**
 * Disqus Node
 * 
 * Integrates with Disqus (comment platform). You can retrieve discussion threads, list comments/posts on a thread, and add a new comment. Useful for monitoring or participating in website comment sections via workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const disqusNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.disqus',
  displayName: 'Disqus',
  description: 'Integrates with Disqus (comment platform). You can retrieve discussion threads, list comments/posts on a thread, and add a new comment. Useful for monitoring or participating in website comment sections via workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Threads',
      description: 'The operation to perform',
      options: [
        { name: 'List Threads', value: 'List Threads' },
        { name: 'List Posts', value: 'List Posts' },
        { name: 'Create Post', value: 'Create Post' }
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
      description: 'Processed data from Disqus'
    }
  ],

  credentials: [
    {
      name: 'disqusApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Disqus'
  },

  aliases: ['disqus'],
  
  examples: [
        {
      name: 'List Threads Item',
      description: 'List Threads an item from Disqus',
      workflow: {
        nodes: [
          {
            name: 'Disqus',
            type: 'n8n-nodes-base.disqus',
            parameters: {
              operation: 'List Threads',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default disqusNode;