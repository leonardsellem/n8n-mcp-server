/**
 * RSS Read Node
 * 
 * Reads an RSS (or Atom) feed URL and outputs the items from the feed (usually blog posts or articles). This allows workflows to pull in latest entries from any RSS feed as structured data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const rssreadNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rss-read',
  displayName: 'RSS Read',
  description: 'Reads an RSS (or Atom) feed URL and outputs the items from the feed (usually blog posts or articles). This allows workflows to pull in latest entries from any RSS feed as structured data.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from RSS Read'
    }
  ],

  credentials: [
    {
      name: 'rss-readApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'RSS Read'
  },

  aliases: ['rss', 'read'],
  
  examples: [
        {
      name: 'Fetch Feed Item',
      description: 'Fetch Feed an item from RSS Read',
      workflow: {
        nodes: [
          {
            name: 'RSS Read',
            type: 'n8n-nodes-base.rss-read',
            parameters: {
              operation: 'Fetch Feed',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default rssreadNode;