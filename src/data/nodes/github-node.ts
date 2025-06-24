/**
 * GitHub Node
 * 
 * Connects to GitHub’s API. Common uses: create a new issue in a repository, list issues (possibly with filters), get repository details, or create a new release. Enables devops workflows such as automating issue tracking or release management on GitHub.
 */

import { NodeTypeInfo } from '../node-types.js';

export const githubNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.github',
  displayName: 'GitHub',
  description: 'Connects to GitHub’s API. Common uses: create a new issue in a repository, list issues (possibly with filters), get repository details, or create a new release. Enables devops workflows such as automating issue tracking or release management on GitHub.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Issue',
      description: 'The operation to perform',
      options: [
        { name: 'Create Issue', value: 'Create Issue' },
        { name: 'List Issues', value: 'List Issues' },
        { name: 'Get Repository', value: 'Get Repository' },
        { name: 'Create Release', value: 'Create Release' }
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
      description: 'Processed data from GitHub'
    }
  ],

  credentials: [
    {
      name: 'githubApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'GitHub'
  },

  aliases: ['github'],
  
  examples: [
        {
      name: 'Create Issue Item',
      description: 'Create Issue an item from GitHub',
      workflow: {
        nodes: [
          {
            name: 'GitHub',
            type: 'n8n-nodes-base.github',
            parameters: {
              operation: 'Create Issue',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default githubNode;