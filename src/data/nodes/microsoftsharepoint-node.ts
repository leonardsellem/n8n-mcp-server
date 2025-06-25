import { NodeTypeInfo } from '../node-types.js';

export const microsoftSharePointNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftSharePoint',
  displayName: 'Microsoft SharePoint',
  description: 'Use the Microsoft SharePoint node to automate work in Microsoft SharePoint and integrate Microsoft SharePoint with other applications. Supports downloading, uploading, and updating files, managing items in a list, and getting lists and list items.',
  category: 'Productivity',
  subcategory: 'File Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'file',
      description: 'The resource to operate on',
      options: [
        { name: 'File', value: 'file', description: 'Work with SharePoint files' },
        { name: 'Item', value: 'item', description: 'Work with SharePoint list items' },
        { name: 'List', value: 'list', description: 'Work with SharePoint lists' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'download',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Create or Update', value: 'upsert', description: 'Create a new item or update existing one' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Download', value: 'download', description: 'Download a file' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple items' },
        { name: 'Update', value: 'update', description: 'Update an item' },
        { name: 'Upload', value: 'upload', description: 'Upload a file' }
      ]
    },
    {
      name: 'siteId',
      displayName: 'Site ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the SharePoint site to work with'
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the SharePoint list to work with'
    },
    {
      name: 'itemId',
      displayName: 'Item ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the list item to work with'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file to work with'
    },
    {
      name: 'filePath',
      displayName: 'File Path',
      type: 'string',
      required: false,
      default: '',
      description: 'Path to the file in SharePoint (e.g., /Shared Documents/folder/file.pdf)'
    },
    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the file to upload (for text files) or binary data'
    },
    {
      name: 'binaryPropertyName',
      displayName: 'Binary Property',
      type: 'string',
      required: false,
      default: 'data',
      description: 'Name of the binary property that contains the file data'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title of the list item'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of fields to set for the list item (e.g., {"Title": "My Item", "Description": "Item description"})'
    },
    {
      name: 'listName',
      displayName: 'List Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the SharePoint list'
    },
    {
      name: 'listDescription',
      displayName: 'List Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description of the SharePoint list'
    },
    {
      name: 'listTemplate',
      displayName: 'List Template',
      type: 'options',
      required: false,
      default: 'genericList',
      description: 'Template type for the list',
      options: [
        { name: 'Generic List', value: 'genericList', description: 'Generic custom list' },
        { name: 'Document Library', value: 'documentLibrary', description: 'Document library' },
        { name: 'Calendar', value: 'events', description: 'Calendar/Events list' },
        { name: 'Tasks', value: 'tasks', description: 'Tasks list' },
        { name: 'Contacts', value: 'contacts', description: 'Contacts list' },
        { name: 'Links', value: 'links', description: 'Links list' }
      ]
    },
    {
      name: 'overwriteExisting',
      displayName: 'Overwrite Existing',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to overwrite an existing file'
    },
    {
      name: 'returnAll',
      displayName: 'Return All',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return all results or limit them'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'string',
      required: false,
      default: '',
      description: 'OData filter query to apply to the results'
    },
    {
      name: 'select',
      displayName: 'Select Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to select'
    },
    {
      name: 'expand',
      displayName: 'Expand Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to expand'
    },
    {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'string',
      required: false,
      default: '',
      description: 'Field to order results by'
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
      description: 'The processed Microsoft SharePoint data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Download File',
      description: 'Download a file from SharePoint document library',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'file',
              operation: 'download',
              siteId: 'your-site-id',
              filePath: '/Shared Documents/important-document.pdf'
            }
          }
        ]
      }
    },
    {
      name: 'Upload File',
      description: 'Upload a file to SharePoint document library',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'file',
              operation: 'upload',
              siteId: 'your-site-id',
              filePath: '/Shared Documents/new-document.txt',
              fileContent: 'This is the content of the new document.',
              overwriteExisting: false
            }
          }
        ]
      }
    },
    {
      name: 'Create List Item',
      description: 'Create a new item in a SharePoint list',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'item',
              operation: 'create',
              siteId: 'your-site-id',
              listId: 'your-list-id',
              title: 'New Task Item',
              fields: '{"Description": "This is a new task created via n8n", "Priority": "High"}'
            }
          }
        ]
      }
    },
    {
      name: 'Get List Items',
      description: 'Retrieve multiple items from a SharePoint list with filtering',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'item',
              operation: 'getAll',
              siteId: 'your-site-id',
              listId: 'your-list-id',
              returnAll: false,
              limit: 25,
              filters: "Status eq 'Active'",
              select: 'Title,Description,Created,Modified',
              orderBy: 'Created desc'
            }
          }
        ]
      }
    },
    {
      name: 'Update List Item',
      description: 'Update an existing item in a SharePoint list',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'item',
              operation: 'update',
              siteId: 'your-site-id',
              listId: 'your-list-id',
              itemId: '123',
              title: 'Updated Task Item',
              fields: '{"Status": "Completed", "CompletedDate": "2024-01-15T10:00:00Z"}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Lists',
      description: 'Retrieve all lists from a SharePoint site',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'list',
              operation: 'getAll',
              siteId: 'your-site-id',
              returnAll: true,
              select: 'Title,Description,ItemCount,Created'
            }
          }
        ]
      }
    },
    {
      name: 'Upsert List Item',
      description: 'Create or update a list item based on unique identifier',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SharePoint',
            type: 'n8n-nodes-base.microsoftSharePoint',
            parameters: {
              resource: 'item',
              operation: 'upsert',
              siteId: 'your-site-id',
              listId: 'your-list-id',
              title: 'Project Status Update',
              fields: '{"ProjectId": "PROJ-2024-001", "Status": "In Progress", "LastUpdated": "2024-01-15T15:30:00Z"}'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Microsoft SharePoint node
export const microsoftSharePointActions = [
  'download_file',
  'update_file',
  'upload_file',
  'create_item',
  'create_or_update_item',
  'delete_item',
  'get_item',
  'get_many_items',
  'update_item',
  'get_list',
  'get_many_lists'
];

// Export as default for easier importing
export default microsoftSharePointNode;