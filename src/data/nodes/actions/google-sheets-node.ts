import { NodeTypeInfo } from '../../node-types.js';

export const googleSheetsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleSheets',
  displayName: 'Google Sheets',
  description: 'Use the Google Sheets node to automate work in Google Sheets, and integrate Google Sheets with other applications. n8n has built-in support for a wide range of Google Sheets features, including creating, updating, deleting, appending, removing and getting documents.',
  category: 'Productivity',
  subcategory: 'Spreadsheet',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'sheet',
      description: 'The resource to operate on',
      options: [
        { name: 'Document', value: 'document', description: 'Operations on the entire spreadsheet document' },
        { name: 'Sheet Within Document', value: 'sheet', description: 'Operations on individual sheets within a document' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'appendRow',
      description: 'The operation to perform',
      options: [
        { name: 'Append Row', value: 'appendRow', description: 'Create a new row in a sheet' },
        { name: 'Append or Update Row', value: 'appendOrUpdate', description: 'Append a new row, or update the current one if it already exists' },
        { name: 'Clear', value: 'clear', description: 'Clear all data from a sheet' },
        { name: 'Create', value: 'create', description: 'Create a new sheet or spreadsheet' },
        { name: 'Delete', value: 'delete', description: 'Delete a sheet or spreadsheet' },
        { name: 'Delete Rows or Columns', value: 'deleteRowsColumns', description: 'Delete columns and rows from a sheet' },
        { name: 'Get Row(s)', value: 'getRows', description: 'Read all rows in a sheet' },
        { name: 'Update Row', value: 'updateRow', description: 'Update a row in a sheet' }
      ]
    },
    {
      name: 'documentId',
      displayName: 'Document ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Google Sheets document'
    },
    {
      name: 'sheetName',
      displayName: 'Sheet Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the sheet within the document'
    },
    {
      name: 'range',
      displayName: 'Range',
      type: 'string',
      required: false,
      default: '',
      description: 'The range of cells to operate on (e.g., A1:D10)'
    },
    {
      name: 'values',
      displayName: 'Values',
      type: 'string',
      required: false,
      default: '',
      description: 'The values to insert/update as JSON array'
    },
    {
      name: 'valueInputOption',
      displayName: 'Value Input Option',
      type: 'options',
      required: false,
      default: 'USER_ENTERED',
      description: 'How the input data should be interpreted',
      options: [
        { name: 'User Entered', value: 'USER_ENTERED', description: 'Values are parsed as if typed by a user' },
        { name: 'Raw', value: 'RAW', description: 'Values are not parsed and stored as-is' }
      ]
    },
    {
      name: 'valueRenderOption',
      displayName: 'Value Render Option',
      type: 'options',
      required: false,
      default: 'FORMATTED_VALUE',
      description: 'How values should be represented in the output',
      options: [
        { name: 'Formatted Value', value: 'FORMATTED_VALUE', description: 'Values are formatted in the reply according to the cell\'s formatting' },
        { name: 'Unformatted Value', value: 'UNFORMATTED_VALUE', description: 'Values are unformatted' },
        { name: 'Formula', value: 'FORMULA', description: 'Values are not calculated, formulas are returned' }
      ]
    },
    {
      name: 'dateTimeRenderOption',
      displayName: 'Date Time Render Option',
      type: 'options',
      required: false,
      default: 'SERIAL_NUMBER',
      description: 'How dates, times, and durations should be represented in the output',
      options: [
        { name: 'Serial Number', value: 'SERIAL_NUMBER', description: 'Dates are returned as serial numbers' },
        { name: 'Formatted String', value: 'FORMATTED_STRING', description: 'Dates are returned as formatted strings' }
      ]
    },
    {
      name: 'headerRow',
      displayName: 'Header Row',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the first row contains headers'
    },
    {
      name: 'keyRowIndex',
      displayName: 'Key Row Index',
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of the row to use as key for lookup operations'
    },
    {
      name: 'dataLocationOnSheet',
      displayName: 'Data Location on Sheet',
      type: 'options',
      required: false,
      default: 'detectAutomatically',
      description: 'Where the data is located on the sheet',
      options: [
        { name: 'Detect Automatically', value: 'detectAutomatically', description: 'Automatically detect the data range' },
        { name: 'Header Row Index', value: 'headerRowIndex', description: 'Specify the header row index' }
      ]
    },
    {
      name: 'headerRowIndex',
      displayName: 'Header Row Index',
      type: 'number',
      required: false,
      default: 1,
      description: 'Index of the header row (1-based)'
    },
    {
      name: 'firstDataRowIndex',
      displayName: 'First Data Row Index',
      type: 'number',
      required: false,
      default: 2,
      description: 'Index of the first data row (1-based)'
    },
    {
      name: 'usePathForAll',
      displayName: 'Use Path for All',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to use the path for all operations'
    },
    {
      name: 'keepOnlySet',
      displayName: 'Keep Only Set',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to keep only the fields that are set'
    },
    {
      name: 'locationDefine',
      displayName: 'Location Define',
      type: 'options',
      required: false,
      default: 'headerRowIndex',
      description: 'How to define the data location',
      options: [
        { name: 'Header Row Index', value: 'headerRowIndex', description: 'Use header row index' },
        { name: 'Range', value: 'range', description: 'Use specific range' }
      ]
    },
    {
      name: 'insertDataOption',
      displayName: 'Insert Data Option',
      type: 'options',
      required: false,
      default: 'INSERT_ROWS',
      description: 'How the input data should be inserted',
      options: [
        { name: 'Insert Rows', value: 'INSERT_ROWS', description: 'Insert new rows for the data' },
        { name: 'Overwrite', value: 'OVERWRITE', description: 'Overwrite existing data' }
      ]
    },
    {
      name: 'dimension',
      displayName: 'Dimension',
      type: 'options',
      required: false,
      default: 'ROWS',
      description: 'The major dimension of the delete operation',
      options: [
        { name: 'Rows', value: 'ROWS', description: 'Delete rows' },
        { name: 'Columns', value: 'COLUMNS', description: 'Delete columns' }
      ]
    },
    {
      name: 'startIndex',
      displayName: 'Start Index',
      type: 'number',
      required: false,
      default: 0,
      description: 'The start index (0-based) for delete operations'
    },
    {
      name: 'endIndex',
      displayName: 'End Index',
      type: 'number',
      required: false,
      default: 1,
      description: 'The end index (0-based) for delete operations'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the spreadsheet or sheet'
    },
    {
      name: 'locale',
      displayName: 'Locale',
      type: 'string',
      required: false,
      default: '',
      description: 'The locale of the spreadsheet (e.g., en_US)'
    },
    {
      name: 'autoRecalc',
      displayName: 'Auto Recalc',
      type: 'options',
      required: false,
      default: 'ON_CHANGE',
      description: 'The recalculation settings for the spreadsheet',
      options: [
        { name: 'On Change', value: 'ON_CHANGE', description: 'Recalculate when values change' },
        { name: 'On Demand', value: 'ON_DEMAND', description: 'Recalculate only when requested' }
      ]
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
      description: 'The processed Google Sheets data'
    }
  ],
  credentials: ['googleSheetsOAuth2Api', 'googleApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Append Row to Sheet',
      description: 'Add a new row to a Google Sheets document',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'sheet',
              operation: 'appendRow',
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              values: '[["John Doe", "john@example.com", "Manager"]]'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Rows from Sheet',
      description: 'Retrieve all rows from a Google Sheets document',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'sheet',
              operation: 'getRows',
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              headerRow: true
            }
          }
        ]
      }
    },
    {
      name: 'Update Row in Sheet',
      description: 'Update a specific row in a Google Sheets document',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'sheet',
              operation: 'updateRow',
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              keyRowIndex: 0,
              values: '{"Name": "Jane Doe", "Status": "Active"}'
            }
          }
        ]
      }
    },
    {
      name: 'Create New Spreadsheet',
      description: 'Create a new Google Sheets document',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'document',
              operation: 'create',
              title: 'My New Spreadsheet',
              locale: 'en_US'
            }
          }
        ]
      }
    },
    {
      name: 'Clear Sheet Data',
      description: 'Clear all data from a specific sheet',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'sheet',
              operation: 'clear',
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1'
            }
          }
        ]
      }
    },
    {
      name: 'Append or Update Row',
      description: 'Append a new row or update existing if it matches',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets',
            type: 'n8n-nodes-base.googleSheets',
            parameters: {
              resource: 'sheet',
              operation: 'appendOrUpdate',
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              values: '{"Email": "john@example.com", "Status": "Updated"}',
              keyRowIndex: 1
            }
          }
        ]
      }
    }
  ]
};

export const googleSheetsTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleSheetsTrigger',
  displayName: 'Google Sheets Trigger',
  description: 'Triggers the workflow when specified events occur in Google Sheets, such as when rows are added or updated in sheets.',
  category: 'Productivity',
  subcategory: 'Spreadsheet',
  properties: [
    {
      name: 'documentId',
      displayName: 'Document ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Google Sheets document to monitor'
    },
    {
      name: 'sheetName',
      displayName: 'Sheet Name',
      type: 'string',
      required: true,
      default: '',
      description: 'The name of the sheet within the document to monitor'
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'rowAdded',
      description: 'The event that should trigger the workflow',
      options: [
        { name: 'Row Added', value: 'rowAdded', description: 'Trigger when a new row is added' },
        { name: 'Row Updated', value: 'rowUpdated', description: 'Trigger when a row is updated' },
        { name: 'Row Added or Updated', value: 'rowAddedOrUpdated', description: 'Trigger when a row is added or updated' }
      ]
    },
    {
      name: 'headerRow',
      displayName: 'Header Row',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the first row contains headers'
    },
    {
      name: 'headerRowIndex',
      displayName: 'Header Row Index',
      type: 'number',
      required: false,
      default: 1,
      description: 'Index of the header row (1-based)'
    },
    {
      name: 'firstDataRowIndex',
      displayName: 'First Data Row Index',
      type: 'number',
      required: false,
      default: 2,
      description: 'Index of the first data row (1-based)'
    },
    {
      name: 'triggerOn',
      displayName: 'Trigger On',
      type: 'options',
      required: false,
      default: 'anyChange',
      description: 'What changes should trigger the workflow',
      options: [
        { name: 'Any Change', value: 'anyChange', description: 'Trigger on any change' },
        { name: 'Specific Column', value: 'specificColumn', description: 'Trigger only when specific column changes' }
      ]
    },
    {
      name: 'watchColumn',
      displayName: 'Watch Column',
      type: 'string',
      required: false,
      default: '',
      description: 'The column to watch for changes (when triggerOn is specificColumn)'
    },
    {
      name: 'pollTimes',
      displayName: 'Poll Times',
      type: 'fixedCollection',
      required: true,
      default: { mode: 'everyMinute' },
      description: 'How often to check for changes'
    },
    {
      name: 'valueRenderOption',
      displayName: 'Value Render Option',
      type: 'options',
      required: false,
      default: 'FORMATTED_VALUE',
      description: 'How values should be represented in the output',
      options: [
        { name: 'Formatted Value', value: 'FORMATTED_VALUE', description: 'Values are formatted in the reply according to the cell\'s formatting' },
        { name: 'Unformatted Value', value: 'UNFORMATTED_VALUE', description: 'Values are unformatted' },
        { name: 'Formula', value: 'FORMULA', description: 'Values are not calculated, formulas are returned' }
      ]
    },
    {
      name: 'dateTimeRenderOption',
      displayName: 'Date Time Render Option',
      type: 'options',
      required: false,
      default: 'SERIAL_NUMBER',
      description: 'How dates, times, and durations should be represented in the output',
      options: [
        { name: 'Serial Number', value: 'SERIAL_NUMBER', description: 'Dates are returned as serial numbers' },
        { name: 'Formatted String', value: 'FORMATTED_STRING', description: 'Dates are returned as formatted strings' }
      ]
    },
    {
      name: 'additionalFields',
      displayName: 'Additional Fields',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional configuration options'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Google Sheets events occur'
    }
  ],
  credentials: ['googleSheetsOAuth2Api', 'googleApi'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor New Rows',
      description: 'Trigger workflow when new rows are added to a sheet',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets Trigger',
            type: 'n8n-nodes-base.googleSheetsTrigger',
            parameters: {
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              event: 'rowAdded',
              headerRow: true,
              pollTimes: { mode: 'everyMinute' }
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Row Updates',
      description: 'Trigger when rows are updated in a specific sheet',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets Trigger',
            type: 'n8n-nodes-base.googleSheetsTrigger',
            parameters: {
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              event: 'rowUpdated',
              headerRow: true,
              pollTimes: { mode: 'everyHour' }
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific Column Changes',
      description: 'Trigger only when a specific column is changed',
      workflow: {
        nodes: [
          {
            name: 'Google Sheets Trigger',
            type: 'n8n-nodes-base.googleSheetsTrigger',
            parameters: {
              documentId: '{{$json["documentId"]}}',
              sheetName: 'Sheet1',
              event: 'rowAddedOrUpdated',
              triggerOn: 'specificColumn',
              watchColumn: 'Status',
              pollTimes: { mode: 'everyMinute' }
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const googleSheetsNodes: NodeTypeInfo[] = [googleSheetsNode, googleSheetsTriggerNode];

// Export individual actions for the regular Google Sheets node
export const googleSheetsActions = [
  'append_row',
  'append_or_update_row',
  'clear_sheet',
  'create_document',
  'create_sheet',
  'delete_document',
  'delete_sheet',
  'delete_rows_columns',
  'get_rows',
  'update_row'
];

// Export trigger events
export const googleSheetsTriggers = [
  'row_added',
  'row_updated',
  'row_added_or_updated'
];