/**
 * Microsoft SharePoint Node
 * 
 * Works with SharePoint Online lists and libraries. You can retrieve list items, get details of a specific item, create or update an item in a SharePoint list, and delete items. Enables integration of SharePoint data (e.g. intranet lists) with other systems.
 */

import { NodeTypeInfo } from '../node-types.js';

export const microsoftsharepointNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-sharepoint',
  displayName: 'Microsoft SharePoint',
  description: 'Works with SharePoint Online lists and libraries. You can retrieve list items, get details of a specific item, create or update an item in a SharePoint list, and delete items. Enables integration of SharePoint data (e.g. intranet lists) with other systems.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Items',
      description: 'The operation to perform',
      options: [
        { name: 'List Items', value: 'List Items' },
        { name: 'Get Item', value: 'Get Item' },
        { name: 'Create/Update Item', value: 'Create/Update Item' },
        { name: 'Delete Item', value: 'Delete Item' }
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
      description: 'Processed data from Microsoft SharePoint'
    }
  ],

  credentials: [
    {
      name: 'microsoft-sharepointApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft SharePoint'
  },

  aliases: ['microsoft', 'sharepoint'],
  
  examples: [
        {
      name: 'List Items Item',
      description: 'List Items an item from Microsoft SharePoint',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoft-sharepoint',
            parameters: {
              operation: 'List Items',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftsharepointNode;