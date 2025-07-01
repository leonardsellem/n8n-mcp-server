/**
 * # Google Sheets
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Google Sheets node to automate work in Google Sheets, and integrate Google Sheets with other applications. 
 * n8n has built-in support for a wide range of Google Sheets features, including creating, updating, deleting, 
 * appending, removing and getting documents.
 * 
 * ## Key Features
 * 
 * - **Comprehensive Document Management**: Create and delete entire spreadsheets
 * - **Advanced Sheet Operations**: Create, delete, clear, and manage individual sheets within documents
 * - **Flexible Row Operations**: Append new rows, update existing ones, or append/update conditionally
 * - **Bulk Data Operations**: Get multiple rows, delete rows or columns in batches
 * - **Intelligent Data Handling**: Automatic data type detection and conversion
 * - **Range Support**: Work with specific cell ranges or entire sheets
 * - **Formula Compatibility**: Preserve and work with Google Sheets formulas
 * - **Real-time Collaboration**: Seamless integration with Google Sheets' sharing and collaboration features
 * - **Authentication Integration**: Secure OAuth2 authentication with Google accounts
 * - **Error Handling**: Robust error handling for common spreadsheet operations
 * - **Version Control**: Support for multiple API versions and backward compatibility
 * 
 * ## Credentials
 * 
 * Refer to [Google Sheets credentials](../../credentials/google/) for guidance on setting up authentication.
 * Uses Google OAuth2 for secure access to your spreadsheets.
 * 
 * ## Operations by Resource
 * 
 * ### Document Operations
 * - **Create**: Create a new spreadsheet
 * - **Delete**: Delete an entire spreadsheet
 * 
 * ### Sheet Within Document Operations
 * - **Append or Update Row**: Append a new row, or update the current one if it already exists
 * - **Append Row**: Create a new row in the sheet
 * - **Clear**: Clear all data from a sheet
 * - **Create**: Create a new sheet within the document
 * - **Delete**: Delete a sheet from the document
 * - **Delete Rows or Columns**: Delete specific columns and rows from a sheet
 * - **Get Row(s)**: Read all rows in a sheet
 * - **Update Row**: Update an existing row in a sheet
 * 
 * ## Common Issues & Solutions
 * 
 * For common questions or issues and suggested solutions, refer to the Common issues documentation.
 * Common challenges include permissions, authentication, and data formatting considerations.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Google Sheets API directly with your Google credentials.
 * 
 * ## Use Cases
 * 
 * - **Data Collection & Reporting**: Automated form responses and survey data processing
 * - **Business Intelligence**: Real-time dashboards and reporting from multiple data sources
 * - **Inventory Management**: Stock tracking, order processing, and supply chain automation
 * - **Financial Tracking**: Expense reporting, budget monitoring, and financial data aggregation
 * - **Project Management**: Task tracking, milestone reporting, and team collaboration
 * - **CRM Integration**: Customer data synchronization and lead management
 * - **Marketing Analytics**: Campaign tracking, conversion analysis, and ROI reporting
 * - **HR Automation**: Employee data management, attendance tracking, and payroll processing
 * - **E-commerce Operations**: Order processing, customer analytics, and product catalog management
 * - **Educational Tools**: Student grade tracking, assignment management, and progress reporting
 * - **Content Management**: Editorial calendars, content planning, and publication tracking
 * - **Research & Analytics**: Data collection, statistical analysis, and research collaboration
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googleSheetsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleSheets',
  displayName: 'Google Sheets',
  description: 'Read, write, and manipulate data in Google Sheets spreadsheets.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'read',
      description: 'Operation to perform on Google Sheets',
      options: [
        {
          name: 'Read',
          value: 'read',
          description: 'Read data from sheet'
        },
        {
          name: 'Append',
          value: 'append',
          description: 'Append data to sheet'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update existing data'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete rows from sheet'
        }
      ]
    },
    {
      name: 'spreadsheetId',
      displayName: 'Spreadsheet ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Google Sheets spreadsheet'
    },
    {
      name: 'sheetName',
      displayName: 'Sheet Name',
      type: 'string',
      required: true,
      default: 'Sheet1',
      description: 'Name of the sheet to work with'
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
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'googleSheetsOAuth2Api',
      required: true
    }
  ],

  version: [1, 2, 3, 4],
  defaults: {
    name: 'Google Sheets'
  },

  aliases: ['sheets', 'spreadsheet', 'excel'],
  
  examples: [
    {
      name: 'Read Sheet Data',
      description: 'Read all data from a Google Sheet',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              operation: 'read',
              spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
              sheetName: 'Sheet1'
            }
          }
        ]
      }
    }
  ]
};

export default googleSheetsNode;
