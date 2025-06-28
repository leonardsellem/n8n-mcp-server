/**
 * Microsoft Entra ID Node
 * 
 * Works with Microsoft Entra ID (Azure Active Directory). You can provision new users, read user profiles, update user attributes, and assign roles or group membership. Essential for automating IT user management in Azure/Office 365 environments.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftentraidNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-entra-id',
  displayName: 'Microsoft Entra ID',
  description: 'Works with Microsoft Entra ID (Azure Active Directory). You can provision new users, read user profiles, update user attributes, and assign roles or group membership. Essential for automating IT user management in Azure/Office 365 environments.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create User',
      description: 'The operation to perform',
      options: [
        { name: 'Create User', value: 'Create User' },
        { name: 'Get User', value: 'Get User' },
        { name: 'Update User', value: 'Update User' },
        { name: 'Assign Role', value: 'Assign Role' }
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
      description: 'Processed data from Microsoft Entra ID'
    }
  ],

  credentials: [
    {
      name: 'microsoft-entra-idApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft Entra ID'
  },

  aliases: ['microsoft', 'entra'],
  
  examples: [
        {
      name: 'Create User Item',
      description: 'Create User an item from Microsoft Entra ID',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Entra ID',
            type: 'n8n-nodes-base.microsoft-entra-id',
            parameters: {
              operation: 'Create User',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftentraidNode;