import { NodeTypeInfo } from '../node-types.js';

export const microsoftExcelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftExcel',
  displayName: 'Microsoft Excel 365',
  description: 'Use the Microsoft Excel node to automate work in Microsoft Excel, and integrate Microsoft Excel with other applications. Supports adding and retrieving lists of table data, workbooks, and worksheets.',
  category: 'Productivity',
  subcategory: 'Documents',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'table',
      description: 'The resource to operate on',
      options: [
        { name: 'Table', value: 'table', description: 'Work with Excel tables' },
        { name: 'Workbook', value: 'workbook', description: 'Manage Excel workbooks' },
        { name: 'Worksheet', value: 'worksheet', description: 'Handle Excel worksheets' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'addRow',
      description: 'The operation to perform',
      options: [
        { name: 'Add Row', value: 'addRow', description: 'Add rows to the end of the table' },
        { name: 'Get Columns', value: 'getColumns', description: 'Retrieve a list of table columns' },
        { name: 'Get Rows', value: 'getRows', description: 'Retrieve a list of table rows' },
        { name: 'Lookup', value: 'lookup', description: 'Look for a specific column value and return the matching row' },
        { name: 'Add Worksheet', value: 'addWorksheet', description: 'Add a new worksheet to the workbook' },
        { name: 'Get All Workbooks', value: 'getAll', description: 'Get data of all workbooks' },
        { name: 'Get All Worksheets', value: 'getAllWorksheets', description: 'Get all worksheets' },
        { name: 'Get Worksheet Content', value: 'getContent', description: 'Get worksheet content' }
      ]
    },
    {
      name: 'workbookId',
      displayName: 'Workbook ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the workbook to operate on'
    },
    {
      name: 'worksheetId',
      displayName: 'Worksheet ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the worksheet to operate on'
    },
    {
      name: 'tableId',
      displayName: 'Table ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the table to operate on'
    },
    {
      name: 'worksheetName',
      displayName: 'Worksheet Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the new worksheet to create'
    },
    {
      name: 'columnName',
      displayName: 'Column Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the column to lookup in'
    },
    {
      name: 'lookupValue',
      displayName: 'Lookup Value',
      type: 'string',
      required: false,
      default: '',
      description: 'Value to search for in the specified column'
    },
    {
      name: 'range',
      displayName: 'Range',
      type: 'string',
      required: false,
      default: '',
      description: 'The range of cells to get content from (e.g., A1:C10)'
    },
    {
      name: 'rawData',
      displayName: 'RAW Data',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return raw data instead of parsed data'
    },
    {
      name: 'dataStartRow',
      displayName: 'Data Start Row',
      type: 'number',
      required: false,
      default: 2,
      description: 'Row number where the data starts (1-based indexing)'
    },
    {
      name: 'keyRow',
      displayName: 'Key Row',
      type: 'number',
      required: false,
      default: 1,
      description: 'Row number that contains the keys/headers (1-based indexing)'
    },
    {
      name: 'columns',
      displayName: 'Columns',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'The columns to add data to'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for the operation'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The processed Microsoft Excel data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Add Row to Table',
      description: 'Add a new row to an Excel table',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'table',
              operation: 'addRow',
              workbookId: 'workbook123',
              worksheetId: 'worksheet456',
              tableId: 'table789',
              columns: {
                values: [
                  { column: 'Name', value: 'John Doe' },
                  { column: 'Email', value: 'john@example.com' },
                  { column: 'Department', value: 'Sales' }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Get Table Rows',
      description: 'Retrieve all rows from an Excel table',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'table',
              operation: 'getRows',
              workbookId: 'workbook123',
              worksheetId: 'worksheet456',
              tableId: 'table789'
            }
          }
        ]
      }
    },
    {
      name: 'Lookup Table Row',
      description: 'Find a specific row in a table by column value',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'table',
              operation: 'lookup',
              workbookId: 'workbook123',
              worksheetId: 'worksheet456',
              tableId: 'table789',
              columnName: 'Email',
              lookupValue: 'john@example.com'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Workbooks',
      description: 'Retrieve information about all Excel workbooks',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'workbook',
              operation: 'getAll'
            }
          }
        ]
      }
    },
    {
      name: 'Add New Worksheet',
      description: 'Add a new worksheet to an existing workbook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'workbook',
              operation: 'addWorksheet',
              workbookId: 'workbook123',
              worksheetName: 'Q4 Sales Data'
            }
          }
        ]
      }
    },
    {
      name: 'Get Worksheet Content',
      description: 'Get content from a specific range in a worksheet',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'worksheet',
              operation: 'getContent',
              workbookId: 'workbook123',
              worksheetId: 'worksheet456',
              range: 'A1:E10'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other node files
export const microsoftExcelNodes: NodeTypeInfo[] = [microsoftExcelNode];

// Export individual actions for the Microsoft Excel node
export const microsoftExcelActions = [
  'add_table_row',
  'get_table_columns',
  'get_table_rows', 
  'lookup_table_row',
  'add_worksheet',
  'get_all_workbooks',
  'get_all_worksheets',
  'get_worksheet_content'
];

// No trigger node for Microsoft Excel based on documentation
export const microsoftExcelTriggers: string[] = [];