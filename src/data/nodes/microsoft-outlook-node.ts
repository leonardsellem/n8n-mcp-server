/**
 * Microsoft Outlook Node
 * 
 * Integrates with Microsoft Outlook (Office 365 Mail). Allows sending emails through an Outlook account, listing emails (from inbox or folders), and moving or organizing emails (to folders). Useful for enterprise email automation in an Office 365 environment.
 */

import { NodeTypeInfo } from '../node-types.js';

export const microsoftoutlookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-outlook',
  displayName: 'Microsoft Outlook',
  description: 'Integrates with Microsoft Outlook (Office 365 Mail). Allows sending emails through an Outlook account, listing emails (from inbox or folders), and moving or organizing emails (to folders). Useful for enterprise email automation in an Office 365 environment.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Email',
      description: 'The operation to perform',
      options: [
        { name: 'Send Email', value: 'Send Email' },
        { name: 'List Emails', value: 'List Emails' },
        { name: 'Move Email', value: 'Move Email' }
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
      description: 'Processed data from Microsoft Outlook'
    }
  ],

  credentials: [
    {
      name: 'microsoft-outlookApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft Outlook'
  },

  aliases: ['microsoft', 'outlook'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from Microsoft Outlook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoft-outlook',
            parameters: {
              operation: 'Send Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftoutlookNode;