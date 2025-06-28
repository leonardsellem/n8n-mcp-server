/**
 * Help Scout Node
 * 
 * Works with Help Scout (customer support platform). You can start a new conversation (ticket), retrieve conversation details, add an internal note to a conversation, and list mailboxes. Useful for customer support automation, e.g., creating tickets from form submissions.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const helpscoutNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.help-scout',
  displayName: 'Help Scout',
  description: 'Works with Help Scout (customer support platform). You can start a new conversation (ticket), retrieve conversation details, add an internal note to a conversation, and list mailboxes. Useful for customer support automation, e.g., creating tickets from form submissions.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Conversation',
      description: 'The operation to perform',
      options: [
        { name: 'Create Conversation', value: 'Create Conversation' },
        { name: 'Get Conversation', value: 'Get Conversation' },
        { name: 'Add Note', value: 'Add Note' },
        { name: 'List Mailboxes', value: 'List Mailboxes' }
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
      description: 'Processed data from Help Scout'
    }
  ],

  credentials: [
    {
      name: 'help-scoutApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Help Scout'
  },

  aliases: ['help', 'scout'],
  
  examples: [
        {
      name: 'Create Conversation Item',
      description: 'Create Conversation an item from Help Scout',
      workflow: {
        nodes: [
          {
            name: 'Help Scout',
            type: 'n8n-nodes-base.help-scout',
            parameters: {
              operation: 'Create Conversation',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default helpscoutNode;