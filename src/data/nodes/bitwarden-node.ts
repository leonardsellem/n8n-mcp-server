/**
 * Bitwarden Node
 * 
 * Connects to Bitwarden (password manager). Allows retrieving a specific vault item (such as a login or secure note) by name or ID, or listing items in the vault. Useful for pulling credentials or secure data from Bitwarden for use in workflows (requires appropriate Bitwarden API setup).
 */

import { NodeTypeInfo } from '../node-types.js';

export const bitwardenNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bitwarden',
  displayName: 'Bitwarden',
  description: 'Connects to Bitwarden (password manager). Allows retrieving a specific vault item (such as a login or secure note) by name or ID, or listing items in the vault. Useful for pulling credentials or secure data from Bitwarden for use in workflows (requires appropriate Bitwarden API setup).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Vault Item',
      description: 'The operation to perform',
      options: [
        { name: 'Get Vault Item', value: 'Get Vault Item' },
        { name: 'List Vault Items', value: 'List Vault Items' }
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
      description: 'Processed data from Bitwarden'
    }
  ],

  credentials: [
    {
      name: 'bitwardenApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Bitwarden'
  },

  aliases: ['bitwarden'],
  
  examples: [
        {
      name: 'Get Vault Item Item',
      description: 'Get Vault Item an item from Bitwarden',
      workflow: {
        nodes: [
          {
            name: 'Bitwarden',
            type: 'n8n-nodes-base.bitwarden',
            parameters: {
              operation: 'Get Vault Item',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default bitwardenNode;