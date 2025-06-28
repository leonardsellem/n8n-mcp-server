/**
 * X (Formerly Twitter) Node
 * 
 * Connects to Twitter’s API (now X). You can post a new tweet, retrieve details of a tweet, search recent tweets by keyword or hashtag, and send direct messages to users. Enables social media automation like auto-tweeting content, mining tweets for analysis, or responding to mentions via n8n.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const xformerlytwitterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.x-formerly-twitter',
  displayName: 'X (Formerly Twitter)',
  description: 'Connects to Twitter’s API (now X). You can post a new tweet, retrieve details of a tweet, search recent tweets by keyword or hashtag, and send direct messages to users. Enables social media automation like auto-tweeting content, mining tweets for analysis, or responding to mentions via n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Post Tweet',
      description: 'The operation to perform',
      options: [
        { name: 'Post Tweet', value: 'Post Tweet' },
        { name: 'Get Tweet', value: 'Get Tweet' },
        { name: 'Search Tweets', value: 'Search Tweets' },
        { name: 'Send DM', value: 'Send DM' }
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
      description: 'Processed data from X (Formerly Twitter)'
    }
  ],

  credentials: [
    {
      name: 'x-formerly-twitterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'X (Formerly Twitter)'
  },

  aliases: ['formerly', 'twitter'],
  
  examples: [
        {
      name: 'Post Tweet Item',
      description: 'Post Tweet an item from X (Formerly Twitter)',
      workflow: {
        nodes: [
          {
            name: 'X (Formerly Twitter)',
            type: 'n8n-nodes-base.x-formerly-twitter',
            parameters: {
              operation: 'Post Tweet',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default xformerlytwitterNode;