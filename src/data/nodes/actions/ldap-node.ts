/**
 * LDAP Node
 * 
 * Interacts with an LDAP directory server. It can search for entries, add new entries, update existing ones, or delete entries in an LDAP directory (requires LDAP connection credentials).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ldapNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ldap',
  displayName: 'LDAP',
  description: 'Interacts with an LDAP directory server. It can search for entries, add new entries, update existing ones, or delete entries in an LDAP directory (requires LDAP connection credentials).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search',
      description: 'The operation to perform',
      options: [
        { name: 'Search', value: 'Search' },
        { name: 'Add', value: 'Add' },
        { name: 'Update', value: 'Update' },
        { name: 'Delete', value: 'Delete' }
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
      description: 'Processed data from LDAP'
    }
  ],

  credentials: [
    {
      name: 'ldapApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'LDAP'
  },

  aliases: ['ldap'],
  
  examples: [
        {
      name: 'Search Item',
      description: 'Search an item from LDAP',
      workflow: {
        nodes: [
          {
            name: 'LDAP',
            type: 'n8n-nodes-base.ldap',
            parameters: {
              operation: 'Search',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default ldapNode;