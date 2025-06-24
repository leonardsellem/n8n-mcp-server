/**
 * GitHub Document Loader Node
 * 
 * A tool to load documents directly from a GitHub repository (possibly via the GitHub API). Given a repo (and optionally path), it can fetch content (like Markdown files, code, etc.) to feed into an AI workflow. Useful for enabling an AI to read project documentation or code from GitHub.
 */

import { NodeTypeInfo } from '../node-types.js';

export const githubdocumentloaderNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.github-document-loader',
  displayName: 'GitHub Document Loader',
  description: 'A tool to load documents directly from a GitHub repository (possibly via the GitHub API). Given a repo (and optionally path), it can fetch content (like Markdown files, code, etc.) to feed into an AI workflow. Useful for enabling an AI to read project documentation or code from GitHub.',
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
      description: 'Processed data from GitHub Document Loader'
    }
  ],

  credentials: [
    {
      name: 'github-document-loaderApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'GitHub Document Loader'
  },

  aliases: ['github', 'document', 'loader'],
  
  examples: [
        {
      name: 'Fetch Item',
      description: 'Fetch an item from GitHub Document Loader',
      workflow: {
        nodes: [
          {
            name: 'GitHub Document Loader',
            type: 'n8n-nodes-base.github-document-loader',
            parameters: {
              operation: 'fetch',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default githubdocumentloaderNode;