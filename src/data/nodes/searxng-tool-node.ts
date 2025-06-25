/**
 * SearXNG Tool Node
 * 
 * A search tool that queries SearXNG (an open-source metasearch engine) for web results. The agent can use this to fetch live information from the web through SearXNG results. The output might be search result snippets that the agent can then read or follow up on.
 */

import { NodeTypeInfo } from '../node-types.js';

export const searxngtoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.searxng-tool',
  displayName: 'SearXNG Tool',
  description: 'A search tool that queries SearXNG (an open-source metasearch engine) for web results. The agent can use this to fetch live information from the web through SearXNG results. The output might be search result snippets that the agent can then read or follow up on.',
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
      description: 'Processed data from SearXNG Tool'
    }
  ],

  credentials: [
    {
      name: 'searxng-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SearXNG Tool'
  },

  aliases: ['searxng', 'tool'],
  
  examples: [
        {
      name: 'Use Item',
      description: 'Use an item from SearXNG Tool',
      workflow: {
        nodes: [
          {
            name: 'SearXNG Tool',
            type: 'n8n-nodes-base.searxng-tool',
            parameters: {
              operation: 'use',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default searxngtoolNode;