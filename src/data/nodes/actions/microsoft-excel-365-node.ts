/**
 * Microsoft Excel 365 Node
 * 
 * Integrates with Excel workbooks stored in OneDrive or SharePoint (Office 365). You can read data from an Excel worksheet, append new rows, edit existing rows, or delete rows. This allows treating an Excel file as part of your workflow’s data source or output.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftexcel365Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-excel-365',
  displayName: 'Microsoft Excel 365',
  description: 'Integrates with Excel workbooks stored in OneDrive or SharePoint (Office 365). You can read data from an Excel worksheet, append new rows, edit existing rows, or delete rows. This allows treating an Excel file as part of your workflow’s data source or output.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Read Worksheet',
      description: 'The operation to perform',
      options: [
        { name: 'Read Worksheet', value: 'Read Worksheet' },
        { name: 'Add Row', value: 'Add Row' },
        { name: 'Update Row', value: 'Update Row' },
        { name: 'Delete Row', value: 'Delete Row' }
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
      description: 'Processed data from Microsoft Excel 365'
    }
  ],

  credentials: [
    {
      name: 'microsoft-excel-365Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft Excel 365'
  },

  aliases: ['microsoft', 'excel', '365'],
  
  examples: [
        {
      name: 'Read Worksheet Item',
      description: 'Read Worksheet an item from Microsoft Excel 365',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel 365',
            type: 'n8n-nodes-base.microsoft-excel-365',
            parameters: {
              operation: 'Read Worksheet',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftexcel365Node;