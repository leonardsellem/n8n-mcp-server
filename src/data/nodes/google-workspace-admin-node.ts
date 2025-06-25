/**
 * Google Workspace Admin Node
 * 
 * Integrates with Google Workspace Admin SDK. Allows managing users in a Google Workspace domain: listing users, creating new user accounts, updating user info, or suspending users. Useful for IT automation in a Google Workspace environment (like user provisioning or deprovisioning).
 */

import { NodeTypeInfo } from '../node-types.js';

export const googleworkspaceadminNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-workspace-admin',
  displayName: 'Google Workspace Admin',
  description: 'Integrates with Google Workspace Admin SDK. Allows managing users in a Google Workspace domain: listing users, creating new user accounts, updating user info, or suspending users. Useful for IT automation in a Google Workspace environment (like user provisioning or deprovisioning).',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Users',
      description: 'The operation to perform',
      options: [
        { name: 'List Users', value: 'List Users' },
        { name: 'Create User', value: 'Create User' },
        { name: 'Update User', value: 'Update User' },
        { name: 'Suspend User', value: 'Suspend User' }
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
      description: 'Processed data from Google Workspace Admin'
    }
  ],

  credentials: [
    {
      name: 'google-workspace-adminApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Workspace Admin'
  },

  aliases: ['google', 'workspace', 'admin'],
  
  examples: [
        {
      name: 'List Users Item',
      description: 'List Users an item from Google Workspace Admin',
      workflow: {
        nodes: [
          {
            name: 'Google Workspace Admin',
            type: 'n8n-nodes-base.google-workspace-admin',
            parameters: {
              operation: 'List Users',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googleworkspaceadminNode;