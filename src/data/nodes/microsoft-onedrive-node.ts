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
        { name: 'Search', value: 'search', description: 'Search for files' },
        { name: 'Share', value: 'share', description: 'Share a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file up to 4MB in size' },
        // Folder operations
        { name: 'Create Folder', value: 'createFolder', description: 'Create a folder' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Get Children', value: 'getChildren', description: 'Get items inside a folder' },
        { name: 'Rename Folder', value: 'renameFolder', description: 'Rename a folder' },
        { name: 'Search Folder', value: 'searchFolder', description: 'Search for folders' },
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
      name: 'newName',
      displayName: 'New Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The new name for the file or folder'
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
      name: 'shareType',
      displayName: 'Share Type',
      type: 'options',
      required: false,
      default: 'view',
      description: 'The type of sharing permission',
      options: [
        { name: 'View', value: 'view', description: 'View-only access' },
        { name: 'Edit', value: 'edit', description: 'Edit access' }
      ]
    },
    {
      name: 'shareScope',
      displayName: 'Share Scope',
      type: 'options',
      required: false,
      default: 'anonymous',
      description: 'The scope of the sharing link',
      options: [
        { name: 'Anonymous', value: 'anonymous', description: 'Anyone with the link can access' },
        { name: 'Organization', value: 'organization', description: 'Only people in your organization can access' }
      ]
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
      name: 'conflictBehavior',
      displayName: 'Conflict Behavior',
      type: 'options',
      required: false,
      default: 'rename',
      description: 'What to do if a file already exists',
      options: [
        { name: 'Rename', value: 'rename', description: 'Automatically rename the file if it already exists' },
        { name: 'Replace', value: 'replace', description: 'Replace the existing file' },
        { name: 'Fail', value: 'fail', description: 'Fail if the file already exists' }
      ]
    },
    {
      name: 'recursive',
      displayName: 'Recursive',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include items from subfolders in the results'
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
      description: 'The processed OneDrive data'
    }
  ],
  credentials: ['microsoftOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to OneDrive',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'upload',
              fileName: 'example.txt',
              filePath: '/Documents/example.txt',
              fileContent: 'Hello from n8n workflow!'
            }
          }
        ]
      }
    },
    {
      name: 'Download File',
      description: 'Download a file from OneDrive',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'download',
              filePath: '/Documents/example.txt'
            }
          }
        ]
      }
    },
    {
      name: 'Create Folder',
      description: 'Create a new folder in OneDrive',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'folder',
              operation: 'createFolder',
              folderName: 'New Project',
              parentFolderId: 'root'
            }
          }
        ]
      }
    },
    {
      name: 'Get Folder Contents',
      description: 'Get items inside a folder',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'folder',
              operation: 'getChildren',
              folderPath: '/Documents',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Search Files',
      description: 'Search for files in OneDrive',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
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
      name: 'Share File',
      description: 'Share a file with view permissions',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'share',
              filePath: '/Documents/report.pdf',
              shareType: 'view',
              shareScope: 'anonymous'
            }
          }
        ]
      }
    },
    {
      name: 'Rename File',
      description: 'Rename a file in OneDrive',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'rename',
              filePath: '/Documents/old_name.txt',
              newName: 'new_name.txt'
            }
          }
        ]
      }
    },
    {
      name: 'Copy File',
      description: 'Copy a file to a different location',
      workflow: {
        nodes: [
          {
            name: 'OneDrive',
            type: 'n8n-nodes-base.microsoftOneDrive',
            parameters: {
              resource: 'file',
              operation: 'copy',
              filePath: '/Documents/report.pdf',
              parentFolderId: 'folder-id-destination'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const microsoftOneDriveNodes: NodeTypeInfo[] = [microsoftOneDriveNode];

// Export individual actions for the Microsoft OneDrive node
export const microsoftOneDriveActions = [
  // File actions
  'copy_file',
  'delete_file',
  'download_file',
  'get_file',
  'rename_file',
  'search_file',
  'share_file',
  'upload_file',
  // Folder actions
  'create_folder',
  'delete_folder',
  'get_folder_children',
  'rename_folder',
  'search_folder',
  'share_folder'
];

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
  'createFolder',
  'deleteFolder',
  'getChildren',
  'renameFolder',
  'searchFolder',
  'shareFolder'
];