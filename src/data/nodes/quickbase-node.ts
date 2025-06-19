import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const quickbaseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.quickbase',
  displayName: 'Quick Base',
  description: 'Use the Quick Base node to automate work in Quick Base, and integrate Quick Base with other applications. n8n has built-in support for a wide range of Quick Base features, including creating, updating, deleting, and getting records, as well as getting fields, and downloading files.',
  category: 'Productivity',
  subcategory: 'Database',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'record',
      description: 'The resource to operate on',
      options: [
        { name: 'Field', value: 'field', description: 'Work with Quick Base fields' },
        { name: 'File', value: 'file', description: 'Handle file operations' },
        { name: 'Record', value: 'record', description: 'Manage Quick Base records' },
        { name: 'Report', value: 'report', description: 'Work with Quick Base reports' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Field operations
        { name: 'Get All Fields', value: 'getAllFields', description: 'Get all fields from a table' },
        // File operations
        { name: 'Delete', value: 'delete', description: 'Delete a file' },
        { name: 'Download', value: 'download', description: 'Download a file' },
        // Record operations
        { name: 'Create', value: 'create', description: 'Create a record' },
        { name: 'Delete', value: 'delete', description: 'Delete a record' },
        { name: 'Get All', value: 'getAll', description: 'Get all records' },
        { name: 'Update', value: 'update', description: 'Update a record' },
        { name: 'Upsert', value: 'upsert', description: 'Upsert a record' },
        // Report operations
        { name: 'Get', value: 'get', description: 'Get a report' },
        { name: 'Run', value: 'run', description: 'Run a report' }
      ]
    },
    {
      name: 'tableId',
      displayName: 'Table ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Quick Base table to operate on'
    },
    {
      name: 'recordId',
      displayName: 'Record ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the record to operate on (for Update, Delete operations)'
    },
    {
      name: 'reportId',
      displayName: 'Report ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the report to get or run'
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file to operate on'
    },
    {
      name: 'fieldId',
      displayName: 'Field ID',
      type: 'number',
      required: false,
      default: 0,
      description: 'The ID of the field (for file operations)'
    },
    {
      name: 'versionNumber',
      displayName: 'Version Number',
      type: 'number',
      required: false,
      default: 0,
      description: 'The version number of the file'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing the field values to set (e.g., {"3": {"value": "John"}, "4": {"value": "Doe"}})'
    },
    {
      name: 'fieldsToSelect',
      displayName: 'Fields to Select',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of field IDs to include in the output'
    },
    {
      name: 'where',
      displayName: 'Where Clause',
      type: 'string',
      required: false,
      default: '',
      description: 'Quick Base query formula to filter records (e.g., "{6.EX.\'John\'}")'
    },
    {
      name: 'sortBy',
      displayName: 'Sort By',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of sort objects (e.g., [{"fieldId": 3, "order": "ASC"}])'
    },
    {
      name: 'groupBy',
      displayName: 'Group By',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of group by objects (e.g., [{"fieldId": 3, "grouping": "equal-values"}])'
    },
    {
      name: 'skip',
      displayName: 'Skip',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of records to skip for pagination'
    },
    {
      name: 'top',
      displayName: 'Top',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of records to return'
    },
    {
      name: 'mergeFieldId',
      displayName: 'Merge Field ID',
      type: 'number',
      required: false,
      default: 0,
      description: 'Field ID to use for merging in upsert operations'
    },
    {
      name: 'updateKey',
      displayName: 'Update Key',
      type: 'string',
      required: false,
      default: '',
      description: 'The key field to use for finding records to update'
    },
    {
      name: 'fieldsToReturn',
      displayName: 'Fields to Return',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of field IDs to return in the response'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'string',
      required: false,
      default: '',
      description: 'Additional options as JSON object'
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
      description: 'The processed Quick Base data'
    }
  ],
  credentials: ['quickbaseApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Record',
      description: 'Create a new record in a Quick Base table',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'create',
              tableId: 'bck7gp3q2',
              fields: '{"3": {"value": "John"}, "4": {"value": "Doe"}, "5": {"value": "john.doe@example.com"}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Records',
      description: 'Retrieve all records from a Quick Base table',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'getAll',
              tableId: 'bck7gp3q2',
              fieldsToSelect: '3,4,5',
              top: 100
            }
          }
        ]
      }
    },
    {
      name: 'Update Record',
      description: 'Update an existing record in Quick Base',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'update',
              tableId: 'bck7gp3q2',
              recordId: '6',
              fields: '{"4": {"value": "Smith"}, "5": {"value": "john.smith@example.com"}}'
            }
          }
        ]
      }
    },
    {
      name: 'Query Records with Filter',
      description: 'Get records that match specific criteria',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'getAll',
              tableId: 'bck7gp3q2',
              where: '{5.CT.\'@example.com\'}',
              fieldsToSelect: '3,4,5',
              sortBy: '[{"fieldId": 3, "order": "ASC"}]'
            }
          }
        ]
      }
    },
    {
      name: 'Upsert Record',
      description: 'Create or update a record based on a merge field',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'upsert',
              tableId: 'bck7gp3q2',
              mergeFieldId: 5,
              fields: '{"3": {"value": "Jane"}, "4": {"value": "Doe"}, "5": {"value": "jane.doe@example.com"}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Fields',
      description: 'Retrieve information about all fields in a table',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'field',
              operation: 'getAllFields',
              tableId: 'bck7gp3q2'
            }
          }
        ]
      }
    },
    {
      name: 'Run Report',
      description: 'Execute a Quick Base report and get results',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'report',
              operation: 'run',
              tableId: 'bck7gp3q2',
              reportId: '1',
              top: 50
            }
          }
        ]
      }
    },
    {
      name: 'Download File',
      description: 'Download a file from a Quick Base record',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'file',
              operation: 'download',
              tableId: 'bck7gp3q2',
              recordId: '6',
              fieldId: 7,
              versionNumber: 0
            }
          }
        ]
      }
    },
    {
      name: 'Delete Record',
      description: 'Delete a record from Quick Base',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quickbase',
            parameters: {
              resource: 'record',
              operation: 'delete',
              tableId: 'bck7gp3q2',
              recordId: '6'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Quick Base node
export const quickbaseActions = [
  // Field actions
  'get_all_fields',
  // File actions
  'delete_file',
  'download_file',
  // Record actions
  'create_record',
  'delete_record',
  'get_all_records',
  'update_record',
  'upsert_record',
  // Report actions
  'get_report',
  'run_report'
];

// Note: Quick Base does not have a trigger node based on browser verification
// export const quickbaseTriggers = [];