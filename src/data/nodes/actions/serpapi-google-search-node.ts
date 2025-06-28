/**
 * SerpApi (Google Search) Node
 * 
 * A tool that uses SerpApi to perform a Google Search and get structured results (bypassing normal Google restrictions). The agent can retrieve search snippets, answer boxes, etc., from Google via this API. Useful for live web queries to feed into the reasoning chain.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const serpapigooglesearchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.serpapi-google-search',
  displayName: 'SerpApi (Google Search)',
  description: 'A tool that uses SerpApi to perform a Google Search and get structured results (bypassing normal Google restrictions). The agent can retrieve search snippets, answer boxes, etc., from Google via this API. Useful for live web queries to feed into the reasoning chain.',
  category: 'Productivity',
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
      description: 'Processed data from SerpApi (Google Search)'
    }
  ],

  credentials: [
    {
      name: 'serpapi-google-searchApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SerpApi (Google Search)'
  },

  aliases: ['serpapi', 'google', 'search'],
  
  examples: [
        {
      name: 'Retrieve Item',
      description: 'Retrieve an item from SerpApi (Google Search)',
      workflow: {
        nodes: [
          {
            name: 'SerpApi (Google Search)',
            type: 'n8n-nodes-base.serpapi-google-search',
            parameters: {
              operation: 'retrieve',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default serpapigooglesearchNode;