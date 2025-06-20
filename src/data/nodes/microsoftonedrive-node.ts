import { NodeTypeInfo } from '../node-types.js';

export const microsoftOneDriveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftOneDrive',
  displayName: 'Microsoft OneDrive',
  description: 'Use the Microsoft OneDrive node to automate work in Microsoft OneDrive, and integrate Microsoft OneDrive with other applications. n8n has built-in support for a wide range of Microsoft OneDrive features, including creating, updating, deleting, and getting files, and folders.',
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
        { name: 'File', value: 'file', description: 'Work with files in OneDrive' },
        { name: 'Folder', value: 'folder', description: 'Manage folders in OneDrive' }
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
        { name: 'Rename', value: 'rename', description: 'Rename a file' },
        { name: 'Search', value: 'search', description: 'Search a file' },
        { name: 'Share', value: 'share', description: 'Share a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file up to 4MB in size' },
        // Folder operations
        { name: 'Create', value: 'create', description: 'Create a folder' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Get Children', value: 'getChildren', description: 'Get items inside a folder' },
        { name: 'Rename Folder', value: 'renameFolder', description: 'Rename a folder' },
        { name: 'Search Folder', value: 'searchFolder', description: 'Search a folder' },
        { name: 'Share Folder', value: 'shareFolder', description: 'Share a folder' }
      ]
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file in OneDrive'
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
      name: 'filePath',
      displayName: 'File Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The path to the file in OneDrive'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder in OneDrive'
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
      name: 'folderPath',
      displayName: 'Folder Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The path to the folder in OneDrive'
    },
    {
      name: 'parentFolderId',
      displayName: 'Parent Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the parent folder'
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
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
      description: 'The search query for finding files or folders'
    },
    {
      name: 'newName',
      displayName: 'New Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The new name for rename operations'
    },
    {
      name: 'shareType',
      displayName: 'Share Type',
      type: 'options',
      required: false,
      default: 'view',
      description: 'The type of sharing permission',
      options: [
        { name: 'View', value: 'view', description: 'View only access' },
        { name: 'Edit', value: 'edit', description: 'Edit access' }
      ]
    },
    {
      name: 'shareScope',
      displayName: 'Share Scope',
      type: 'options',
      required: false,
      default: 'anonymous',
      description: 'Who can access the shared item',
      options: [
        { name: 'Anonymous', value: 'anonymous', description: 'Anyone with the link' },
        { name: 'Organization', value: 'organization', description: 'People in organization' },
        { name: 'Users', value: 'users', description: 'Specific users' }
      ]
    },
    {
      name: 'recipients',
      displayName: 'Recipients',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of recipients (comma-separated)'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional message to include with the share'
    },
    {
      name: 'conflictBehavior',
      displayName: 'Conflict Behavior',
      type: 'options',
      required: false,
      default: 'replace',
      description: 'What to do if a file with the same name already exists',
      options: [
        { name: 'Replace', value: 'replace', description: 'Replace the existing file' },
        { name: 'Rename', value: 'rename', description: 'Automatically rename the file' },
        { name: 'Fail', value: 'fail', description: 'Fail if file exists' }
      ]
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
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
      description: 'The processed Microsoft OneDrive data'
    }
  ],
  credentials: ['microsoftOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File to OneDrive',
      description: 'Upload a file to Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'upload',
              fileName: 'document.txt',
              filePath: '/Documents/document.txt',
              fileContent: 'Hello from n8n workflow!'
            }
          }
        ]
      }
    },
    {
      name: 'Download File from OneDrive',
      description: 'Download a file from Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'download',
              fileId: 'file-id-here'
            }
          }
        ]
      }
    },
    {
      name: 'Create Folder in OneDrive',
      description: 'Create a new folder in Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'folder',
              operation: 'create',
              folderName: 'New Project Folder',
              parentFolderId: 'parent-folder-id'
            }
          }
        ]
      }
    },
    {
      name: 'List Folder Contents',
      description: 'Get items inside a OneDrive folder',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'folder',
              operation: 'getChildren',
              folderId: 'folder-id-here',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Search Files in OneDrive',
      description: 'Search for files in Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
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
      name: 'Share File from OneDrive',
      description: 'Share a file from Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'share',
              fileId: 'file-id-here',
              shareType: 'view',
              shareScope: 'anonymous'
            }
          }
        ]
      }
    },
    {
      name: 'Copy File in OneDrive',
      description: 'Copy a file within Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'copy',
              fileId: 'source-file-id',
              parentFolderId: 'destination-folder-id',
              fileName: 'copied-file.txt'
            }
          }
        ]
      }
    },
    {
      name: 'Rename Folder in OneDrive',
      description: 'Rename a folder in Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'folder',
              operation: 'renameFolder',
              folderId: 'folder-id-here',
              newName: 'Renamed Project Folder'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const microsoftOneDriveNodes: NodeTypeInfo[] = [microsoftOneDriveNode];

// Export file operations
export const microsoftOneDriveFileOperations = [
  'copy',
  'delete',
  'download',
  'get',
  'rename',
  'search',
  'share',
  'upload'
];

// Export folder operations
export const microsoftOneDriveFolderOperations = [
  'create',
  'deleteFolder',
  'getChildren',
  'renameFolder',
  'searchFolder',
  'shareFolder'
];

// Export all operations
export const microsoftOneDriveOperations = [
  ...microsoftOneDriveFileOperations,
  ...microsoftOneDriveFolderOperations
];

// Export share types
export const microsoftOneDriveShareTypes = [
  'view',
  'edit'
];

// Export share scopes
export const microsoftOneDriveShareScopes = [
  'anonymous',
  'organization',
  'users'
];

// Export conflict behaviors
export const microsoftOneDriveConflictBehaviors = [
  'replace',
  'rename',
  'fail'
];

// Export API endpoints
export const microsoftOneDriveEndpoints = {
  graphApi: 'https://graph.microsoft.com/v1.0',
  files: '/me/drive/items',
  root: '/me/drive/root',
  children: '/children',
  copy: '/copy',
  search: '/search',
  permissions: '/permissions'
};

// Export supported file size limit
export const microsoftOneDriveFileSizeLimit = 4 * 1024 * 1024; // 4MB