import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const airtableNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.airtable',
  displayName: 'Airtable',
  description: 'Use the Airtable node to automate work in Airtable, and integrate Airtable with other applications. n8n has built-in support for a wide range of Airtable features, including creating, reading, listing, updating and deleting tables.',
  category: 'Productivity',
  subcategory: 'Database',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'append',
      description: 'The operation to perform',
      options: [
        { name: 'Append', value: 'append', description: 'Append the data to a table' },
        { name: 'Delete', value: 'delete', description: 'Delete data from a table' },
        { name: 'List', value: 'list', description: 'List data from a table' },
        { name: 'Read', value: 'read', description: 'Read data from a table' },
        { name: 'Update', value: 'update', description: 'Update data in a table' }
      ]
    },
    {
      name: 'base',
      displayName: 'Base',
      type: 'string',
      required: true,
      default: '',
      description: 'The base ID or URL of the Airtable base to operate on'
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'string',
      required: true,
      default: '',
      description: 'The table name or ID within the Airtable base'
    },
    {
      name: 'recordId',
      displayName: 'Record ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the record to operate on (for Read, Update, Delete operations)'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing the field values to set'
    },
    {
      name: 'fieldsToRetrieve',
      displayName: 'Fields to Retrieve',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to include in the output'
    },
    {
      name: 'filterByFormula',
      displayName: 'Filter By Formula',
      type: 'string',
      required: false,
      default: '',
      description: 'Airtable formula to filter records (e.g., {Status}="In Progress")'
    },
    {
      name: 'maxRecords',
      displayName: 'Max Records',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of records to return'
    },
    {
      name: 'sort',
      displayName: 'Sort',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of sort objects to order the results'
    },
    {
      name: 'view',
      displayName: 'View',
      type: 'string',
      required: false,
      default: '',
      description: 'The name or ID of a table view to use'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'string',
      required: false,
      default: '',
      description: 'Offset for pagination (returned from previous request)'
    },
    {
      name: 'typecast',
      displayName: 'Typecast',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to allow automatic data conversion for field types'
    },
    {
      name: 'returnFieldsByFieldId',
      displayName: 'Return Fields By Field ID',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return field keys as field IDs instead of field names'
    },
    {
      name: 'cellFormat',
      displayName: 'Cell Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'The format to return cell values in',
      options: [
        { name: 'JSON', value: 'json', description: 'Return cell values as JSON' },
        { name: 'String', value: 'string', description: 'Return cell values as strings' }
      ]
    },
    {
      name: 'timeZone',
      displayName: 'Time Zone',
      type: 'string',
      required: false,
      default: '',
      description: 'Time zone to use for date/time fields (e.g., "America/New_York")'
    },
    {
      name: 'userLocale',
      displayName: 'User Locale',
      type: 'string',
      required: false,
      default: '',
      description: 'Locale to use for number and date formatting (e.g., "en-US")'
    },
    {
      name: 'bulkSize',
      displayName: 'Bulk Size',
      type: 'number',
      required: false,
      default: 10,
      description: 'Number of records to process in each batch (max 10)'
    },
    {
      name: 'ignoreFields',
      displayName: 'Ignore Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to ignore when updating records'
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
      description: 'The processed Airtable data'
    }
  ],
  credentials: ['airtableTokenApi', 'airtableOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Append Record to Table',
      description: 'Add a new record to an Airtable table',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'append',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              fields: '{"Name": "New Task", "Status": "Not Started", "Priority": "Medium"}'
            }
          }
        ]
      }
    },
    {
      name: 'List Records from Table',
      description: 'Get all records from an Airtable table',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'list',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              maxRecords: 50
            }
          }
        ]
      }
    },
    {
      name: 'Read Specific Record',
      description: 'Get a specific record by ID',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'read',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              recordId: '{{$json["recordId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Update Record',
      description: 'Update an existing record in Airtable',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'update',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              recordId: '{{$json["recordId"]}}',
              fields: '{"Status": "In Progress"}'
            }
          }
        ]
      }
    },
    {
      name: 'Filter Records with Formula',
      description: 'List records filtered by a formula',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'list',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              filterByFormula: '{Status}="In Progress"',
              maxRecords: 25
            }
          }
        ]
      }
    },
    {
      name: 'Delete Record',
      description: 'Delete a record from Airtable',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'delete',
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              recordId: '{{$json["recordId"]}}'
            }
          }
        ]
      }
    }
  ]
};

export const airtableTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.airtableTrigger',
  displayName: 'Airtable Trigger',
  description: 'Triggers the workflow when specified events occur in Airtable, such as when records are added or updated in tables.',
  category: 'Productivity',
  subcategory: 'Database',
  properties: [
    {
      name: 'base',
      displayName: 'Base',
      type: 'string',
      required: true,
      default: '',
      description: 'The base ID or URL of the Airtable base to monitor'
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'string',
      required: true,
      default: '',
      description: 'The table name or ID within the Airtable base to monitor'
    },
    {
      name: 'triggerField',
      displayName: 'Trigger Field',
      type: 'string',
      required: true,
      default: '',
      description: 'A created or last modified field in your table to determine updates'
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
      name: 'downloadAttachments',
      displayName: 'Download Attachments',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to download attachments from the table'
    },
    {
      name: 'downloadFields',
      displayName: 'Download Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of attachment fields to download'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to include in the output'
    },
    {
      name: 'formula',
      displayName: 'Formula',
      type: 'string',
      required: false,
      default: '',
      description: 'Airtable formula to further filter the results'
    },
    {
      name: 'viewId',
      displayName: 'View ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The name or ID of a table view to use'
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
      description: 'Triggers when Airtable events occur'
    }
  ],
  credentials: ['airtableTokenApi', 'airtableOAuth2Api'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor New Records',
      description: 'Trigger workflow when new records are added to a table',
      workflow: {
        nodes: [
          {
            name: 'Airtable Trigger',
            type: 'n8n-nodes-base.airtableTrigger',
            parameters: {
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              triggerField: 'Created',
              pollTimes: { mode: 'everyMinute' }
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Record Updates',
      description: 'Trigger when records are modified in a table',
      workflow: {
        nodes: [
          {
            name: 'Airtable Trigger',
            type: 'n8n-nodes-base.airtableTrigger',
            parameters: {
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              triggerField: 'Last Modified',
              pollTimes: { mode: 'everyHour' },
              downloadAttachments: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific View',
      description: 'Trigger only for records visible in a specific view',
      workflow: {
        nodes: [
          {
            name: 'Airtable Trigger',
            type: 'n8n-nodes-base.airtableTrigger',
            parameters: {
              base: '{{$json["baseId"]}}',
              table: 'Tasks',
              triggerField: 'Last Modified',
              viewId: 'Active Tasks',
              pollTimes: { mode: 'everyMinute' }
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const airtableNodes: NodeTypeInfo[] = [airtableNode, airtableTriggerNode];

// Export individual actions for the regular Airtable node
export const airtableActions = [
  'append_record',
  'delete_record',
  'list_records',
  'read_record',
  'update_record'
];

// Export trigger events
export const airtableTriggers = [
  'new_airtable_event'
];