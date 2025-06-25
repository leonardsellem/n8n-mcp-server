/**
 * Google Books Node
 * 
 * Uses the Google Books API to search for books by keywords, and retrieve detailed information about a specific book (by volume ID). Useful for applications involving books, such as fetching metadata, authors, or cover images from Google’s book database.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlebooksNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-books',
  displayName: 'Google Books',
  description: 'Uses the Google Books API to search for books by keywords, and retrieve detailed information about a specific book (by volume ID). Useful for applications involving books, such as fetching metadata, authors, or cover images from Google’s book database.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Books',
      description: 'The operation to perform',
      options: [
        { name: 'Search Books', value: 'Search Books' },
        { name: 'Get Book Info', value: 'Get Book Info' }
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
      description: 'Processed data from Google Books'
    }
  ],

  credentials: [
    {
      name: 'google-booksApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Books'
  },

  aliases: ['google', 'books'],
  
  examples: [
        {
      name: 'Search Books Item',
      description: 'Search Books an item from Google Books',
      workflow: {
        nodes: [
          {
            name: 'Google Books',
            type: 'n8n-nodes-base.google-books',
            parameters: {
              operation: 'Search Books',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlebooksNode;