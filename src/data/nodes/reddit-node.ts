/**
 * Reddit Node
 * 
 * Works with Reddit’s API. Allows pulling posts from a subreddit (hot/new/top), creating a new post in a subreddit, retrieving comments on a post, and sending a private message to a user. Great for social media monitoring or posting automation on Reddit.
 */

import { NodeTypeInfo } from '../node-types.js';

export const redditNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.reddit',
  displayName: 'Reddit',
  description: 'Works with Reddit’s API. Allows pulling posts from a subreddit (hot/new/top), creating a new post in a subreddit, retrieving comments on a post, and sending a private message to a user. Great for social media monitoring or posting automation on Reddit.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Posts',
      description: 'The operation to perform',
      options: [
        { name: 'List Posts', value: 'List Posts' },
        { name: 'Create Post', value: 'Create Post' },
        { name: 'List Comments', value: 'List Comments' },
        { name: 'Send Message', value: 'Send Message' }
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
      description: 'Processed data from Reddit'
    }
  ],

  credentials: [
    {
      name: 'redditApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Reddit'
  },

  aliases: ['reddit'],
  
  examples: [
        {
      name: 'List Posts Item',
      description: 'List Posts an item from Reddit',
      workflow: {
        nodes: [
          {
            name: 'Reddit',
            type: 'n8n-nodes-base.reddit',
            parameters: {
              operation: 'List Posts',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default redditNode;