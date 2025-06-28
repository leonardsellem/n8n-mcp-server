import { NodeTypeInfo } from '../../node-types.js';

export const boxNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.box',
  displayName: 'Box',
  description: 'Use the Box node to automate work in Box, and integrate Box with other applications. n8n has built-in support for a wide range of Box features, including creating, copying, deleting, searching, uploading, and downloading files and folders.',
  category: 'File Management',
  subcategory: 'Cloud Storage',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'file',
      description: 'The resource to operate on',
      options: [
        { name: 'File', value: 'file', description: 'Work with files in Box' },
        { name: 'Folder', value: 'folder', description: 'Manage folders in Box' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'upload',
      description: 'The operation to perform',
      options: [
        // File operations
        { name: 'Copy', value: 'copy', description: 'Copy a file' },
        { name: 'Delete', value: 'delete', description: 'Delete a file' },
        { name: 'Download', value: 'download', description: 'Download a file' },
        { name: 'Get', value: 'get', description: 'Get a file' },
        { name: 'Search', value: 'search', description: 'Search files' },
        { name: 'Share', value: 'share', description: 'Share a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file' },
        // Folder operations
        { name: 'Create', value: 'create', description: 'Create a folder' },
        { name: 'Delete', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Get', value: 'getFolder', description: 'Get a folder' },
        { name: 'Search', value: 'searchFolder', description: 'Search files in folder' },
        { name: 'Share', value: 'shareFolder', description: 'Share a folder' },
        { name: 'Update', value: 'update', description: 'Update folder' }
      ]
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file in Box'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder in Box'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the file'
    },
    {
      name: 'folderName',
      displayName: 'Folder Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the folder'
    },
    {
      name: 'parentId',
      displayName: 'Parent ID',
      type: 'string',
      required: false,
      default: '0',
      description: 'The ID of the parent folder (0 for root folder)'
    },
    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'The content of the file to upload'
    },
    {
      name: 'binaryData',
      displayName: 'Binary Data',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the input data is binary'
    },
    {
      name: 'query',
      displayName: 'Query',
      type: 'string',
      required: false,
      default: '',
      description: 'The search query'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
    },
    {
      name: 'shareAccess',
      displayName: 'Share Access',
      type: 'options',
      required: false,
      default: 'open',
      description: 'The level of access for shared link',
      options: [
        { name: 'Open', value: 'open', description: 'Anyone with the link can access' },
        { name: 'Company', value: 'company', description: 'Only people in your company can access' },
        { name: 'Collaborators', value: 'collaborators', description: 'Only collaborators can access' }
      ]
    },
    {
      name: 'canDownload',
      displayName: 'Can Download',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the shared link allows downloading'
    },
    {
      name: 'canPreview',
      displayName: 'Can Preview',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the shared link allows previewing'
    },
    {
      name: 'password',
      displayName: 'Password',
      type: 'string',
      required: false,
      default: '',
      description: 'Password for the shared link'
    },
    {
      name: 'expiresAt',
      displayName: 'Expires At',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'When the shared link expires'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to return'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the folder'
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
      description: 'The processed Box data'
    }
  ],
  credentials: ['boxOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to Box',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'upload',
              fileName: 'example.txt',
              fileContent: 'Hello from n8n workflow!',
              parentId: '0'
            }
          }
        ]
      }
    },
    {
      name: 'Download File',
      description: 'Download a file from Box',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'download',
              fileId: '123456789'
            }
          }
        ]
      }
    },
    {
      name: 'Create Folder',
      description: 'Create a new folder in Box',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'folder',
              operation: 'create',
              folderName: 'New Project',
              parentId: '0'
            }
          }
        ]
      }
    },
    {
      name: 'Search Files',
      description: 'Search for files in Box',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'search',
              query: 'report.pdf',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Share File',
      description: 'Create a shared link for a file',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'share',
              fileId: '123456789',
              shareAccess: 'open',
              canDownload: true,
              canPreview: true
            }
          }
        ]
      }
    },
    {
      name: 'Get File Info',
      description: 'Get information about a file',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'get',
              fileId: '123456789',
              fields: 'name,size,modified_at,created_at'
            }
          }
        ]
      }
    },
    {
      name: 'Copy File',
      description: 'Copy a file to another folder',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'file',
              operation: 'copy',
              fileId: '123456789',
              parentId: '987654321',
              fileName: 'copied_file.txt'
            }
          }
        ]
      }
    },
    {
      name: 'Update Folder',
      description: 'Update folder properties',
      workflow: {
        nodes: [
          {
            name: 'Box',
            type: 'n8n-nodes-base.box',
            parameters: {
              resource: 'folder',
              operation: 'update',
              folderId: '123456789',
              folderName: 'Updated Project Name',
              description: 'Updated project description'
            }
          }
        ]
      }
    }
  ]
};

// Box Trigger Node
export const boxTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.boxTrigger',
  displayName: 'Box Trigger',
  description: 'Starts the workflow when Box events occur',
  category: 'Trigger',
  subcategory: 'Cloud Storage',
  properties: [
    {
      name: 'targetType',
      displayName: 'Target Type',
      type: 'options',
      required: true,
      default: 'file',
      description: 'The type of target to monitor',
      options: [
        { name: 'File', value: 'file', description: 'Monitor file events' },
        { name: 'Folder', value: 'folder', description: 'Monitor folder events' }
      ]
    },
    {
      name: 'targetId',
      displayName: 'Target ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the file or folder to monitor. For folders, copy the ID from the URL after /folder/'
    },
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['ITEM_CREATE'],
      description: 'The events to trigger on',
      options: [
        { name: 'Item Create', value: 'ITEM_CREATE', description: 'Triggered when an item is created' },
        { name: 'Item Upload', value: 'ITEM_UPLOAD', description: 'Triggered when an item is uploaded' },
        { name: 'Item Update', value: 'ITEM_UPDATE', description: 'Triggered when an item is updated' },
        { name: 'Item Download', value: 'ITEM_DOWNLOAD', description: 'Triggered when an item is downloaded' },
        { name: 'Item Preview', value: 'ITEM_PREVIEW', description: 'Triggered when an item is previewed' },
        { name: 'Item Move', value: 'ITEM_MOVE', description: 'Triggered when an item is moved' },
        { name: 'Item Copy', value: 'ITEM_COPY', description: 'Triggered when an item is copied' },
        { name: 'Item Trash', value: 'ITEM_TRASH', description: 'Triggered when an item is trashed' },
        { name: 'Item Undelete From Trash', value: 'ITEM_UNDELETE_FROM_TRASH', description: 'Triggered when an item is restored from trash' },
        { name: 'Item Delete', value: 'ITEM_DELETE', description: 'Triggered when an item is permanently deleted' },
        { name: 'Item Share', value: 'ITEM_SHARE', description: 'Triggered when an item is shared' },
        { name: 'Item Rename', value: 'ITEM_RENAME', description: 'Triggered when an item is renamed' },
        { name: 'Item Collaborate', value: 'ITEM_COLLABORATE', description: 'Triggered when collaboration is added to an item' }
      ]
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The Box event data'
    }
  ],
  credentials: ['boxOAuth2Api'],
  triggerNode: true,
  codeable: false,
  examples: [
    {
      name: 'Monitor Folder for New Files',
      description: 'Trigger when new files are created in a Box folder',
      workflow: {
        nodes: [
          {
            name: 'Box Trigger',
            type: 'n8n-nodes-base.boxTrigger',
            parameters: {
              targetType: 'folder',
              targetId: '123456789',
              events: ['ITEM_CREATE', 'ITEM_UPLOAD']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor File Changes',
      description: 'Trigger when a specific file is updated',
      workflow: {
        nodes: [
          {
            name: 'Box Trigger',
            type: 'n8n-nodes-base.boxTrigger',
            parameters: {
              targetType: 'file',
              targetId: '987654321',
              events: ['ITEM_UPDATE', 'ITEM_RENAME']
            }
          }
        ]
      }
    }
  ]
};

// Export the nodes as an array for easier importing
export const boxNodes: NodeTypeInfo[] = [boxNode, boxTriggerNode];

// Export individual actions for the Box node
export const boxActions = [
  // File actions
  'copy_file',
  'delete_file',
  'download_file',
  'get_file',
  'search_files',
  'share_file',
  'upload_file',
  // Folder actions
  'create_folder',
  'delete_folder',
  'get_folder',
  'search_folder',
  'share_folder',
  'update_folder'
];

// Export file operations
export const boxFileOperations = [
  'copy',
  'delete',
  'download',
  'get',
  'search',
  'share',
  'upload'
];

// Export folder operations
export const boxFolderOperations = [
  'create',
  'deleteFolder',
  'getFolder',
  'searchFolder',
  'shareFolder',
  'update'
];

// Export trigger events
export const boxTriggerEvents = [
  'ITEM_CREATE',
  'ITEM_UPLOAD',
  'ITEM_UPDATE',
  'ITEM_DOWNLOAD',
  'ITEM_PREVIEW',
  'ITEM_MOVE',
  'ITEM_COPY',
  'ITEM_TRASH',
  'ITEM_UNDELETE_FROM_TRASH',
  'ITEM_DELETE',
  'ITEM_SHARE',
  'ITEM_RENAME',
  'ITEM_COLLABORATE'
];