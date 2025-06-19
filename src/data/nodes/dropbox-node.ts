import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const dropboxNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.dropbox',
  displayName: 'Dropbox',
  description: 'Use the Dropbox node to automate work in Dropbox, and integrate Dropbox with other applications. n8n has built-in support for a wide range of Dropbox features, including creating, downloading, moving, and copying files and folders.',
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
        { name: 'File', value: 'file', description: 'Work with files in Dropbox' },
        { name: 'Folder', value: 'folder', description: 'Manage folders in Dropbox' },
        { name: 'Search', value: 'search', description: 'Search Dropbox content' }
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
        { name: 'Move', value: 'move', description: 'Move a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file' },
        // Folder operations
        { name: 'Create Folder', value: 'createFolder', description: 'Create a folder' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Copy Folder', value: 'copyFolder', description: 'Copy a folder' },
        { name: 'Move Folder', value: 'moveFolder', description: 'Move a folder' },
        { name: 'List', value: 'list', description: 'Return the files and folders in a given folder' },
        // Search operations
        { name: 'Query', value: 'query', description: 'Search for files and folders' }
      ]
    },
    {
      name: 'path',
      displayName: 'Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The path to the file or folder in Dropbox'
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
      name: 'sourcePath',
      displayName: 'Source Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The source path for copy/move operations'
    },
    {
      name: 'destinationPath',
      displayName: 'Destination Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The destination path for copy/move operations'
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
      description: 'The path to the folder'
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
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: false,
      default: 'add',
      description: 'What to do if a file already exists',
      options: [
        { name: 'Add', value: 'add', description: 'Automatically rename the file if it already exists' },
        { name: 'Overwrite', value: 'overwrite', description: 'Overwrite the existing file' },
        { name: 'Update', value: 'update', description: 'Update the existing file if it has changed' }
      ]
    },
    {
      name: 'autorename',
      displayName: 'Auto Rename',
      type: 'boolean',
      required: false,
      default: false,
      description: 'If there\'s a conflict, automatically rename the file'
    },
    {
      name: 'mute',
      displayName: 'Mute',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Normally, users are made aware of any file modifications in their Dropbox'
    },
    {
      name: 'strict_conflict',
      displayName: 'Strict Conflict',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Be more strict about how each WriteMode detects conflict'
    },
    {
      name: 'includeDeleted',
      displayName: 'Include Deleted',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include deleted files and folders in search results'
    },
    {
      name: 'includeHasExplicitSharedMembers',
      displayName: 'Include Has Explicit Shared Members',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include files and folders that have explicit shared members'
    },
    {
      name: 'includeNonDownloadableFiles',
      displayName: 'Include Non-downloadable Files',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Include files that cannot be downloaded'
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
      description: 'The processed Dropbox data'
    }
  ],
  credentials: ['dropboxApi', 'dropboxOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to Dropbox',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'file',
              operation: 'upload',
              path: '/Documents/example.txt',
              fileContent: 'Hello from n8n workflow!'
            }
          }
        ]
      }
    },
    {
      name: 'Download File',
      description: 'Download a file from Dropbox',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'file',
              operation: 'download',
              path: '/Documents/example.txt'
            }
          }
        ]
      }
    },
    {
      name: 'Create Folder',
      description: 'Create a new folder in Dropbox',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'folder',
              operation: 'createFolder',
              folderPath: '/Projects/New Project'
            }
          }
        ]
      }
    },
    {
      name: 'List Folder Contents',
      description: 'List files and folders in a directory',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'folder',
              operation: 'list',
              folderPath: '/Documents',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Search Files',
      description: 'Search for files and folders in Dropbox',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'search',
              operation: 'query',
              query: 'report.pdf',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Move File',
      description: 'Move a file to a different location',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'file',
              operation: 'move',
              sourcePath: '/Documents/old_report.pdf',
              destinationPath: '/Archive/old_report.pdf'
            }
          }
        ]
      }
    },
    {
      name: 'Copy Folder',
      description: 'Copy a folder to a new location',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'folder',
              operation: 'copyFolder',
              sourcePath: '/Projects/Template',
              destinationPath: '/Projects/New Client Project'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const dropboxNodes: NodeTypeInfo[] = [dropboxNode];

// Export individual actions for the Dropbox node
export const dropboxActions = [
  // File actions
  'copy_file',
  'delete_file',
  'download_file',
  'move_file',
  'upload_file',
  // Folder actions
  'create_folder',
  'delete_folder',
  'copy_folder',
  'move_folder',
  'list_folder_contents',
  // Search actions
  'search_query'
];

// Export file operations
export const dropboxFileOperations = [
  'copy',
  'delete',
  'download',
  'move',
  'upload'
];

// Export folder operations
export const dropboxFolderOperations = [
  'createFolder',
  'deleteFolder',
  'copyFolder',
  'moveFolder',
  'list'
];

// Export search operations
export const dropboxSearchOperations = [
  'query'
];