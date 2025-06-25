import { NodeTypeInfo } from '../node-types.js';

export const nextcloudNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.nextcloud',
  displayName: 'Nextcloud',
  description: 'Use the Nextcloud node to automate work in Nextcloud, and integrate Nextcloud with other applications. n8n has built-in support for a wide range of Nextcloud features, including creating, updating, deleting, and getting files, and folders as well as retrieving, and inviting users.',
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
        { name: 'File', value: 'file', description: 'Work with Nextcloud files' },
        { name: 'Folder', value: 'folder', description: 'Manage Nextcloud folders' },
        { name: 'User', value: 'user', description: 'Manage Nextcloud users' }
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
        { name: 'Share', value: 'share', description: 'Share a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file' },
        // Folder operations
        { name: 'Copy Folder', value: 'copyFolder', description: 'Copy a folder' },
        { name: 'Create Folder', value: 'createFolder', description: 'Create a folder' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'List', value: 'list', description: 'Return the contents of a given folder' },
        { name: 'Move Folder', value: 'moveFolder', description: 'Move a folder' },
        { name: 'Share Folder', value: 'shareFolder', description: 'Share a folder' },
        // User operations
        { name: 'Invite User', value: 'invite', description: 'Invite a user to a Nextcloud organization' },
        { name: 'Delete User', value: 'deleteUser', description: 'Delete a user' },
        { name: 'Get User', value: 'getUser', description: 'Retrieve information about a single user' },
        { name: 'Get Users', value: 'getUsers', description: 'Retrieve a list of users' },
        { name: 'Update User', value: 'updateUser', description: 'Edit attributes related to a user' }
      ]
    },
    {
      name: 'path',
      displayName: 'Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The path to the file or folder in Nextcloud'
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
      name: 'shareType',
      displayName: 'Share Type',
      type: 'options',
      required: false,
      default: 'user',
      description: 'The type of share to create',
      options: [
        { name: 'User', value: 'user', description: 'Share with a specific user' },
        { name: 'Group', value: 'group', description: 'Share with a group' },
        { name: 'Public Link', value: 'public', description: 'Create a public share link' },
        { name: 'Email', value: 'email', description: 'Share via email' }
      ]
    },
    {
      name: 'shareWith',
      displayName: 'Share With',
      type: 'string',
      required: false,
      default: '',
      description: 'Username, group name, or email to share with'
    },
    {
      name: 'permissions',
      displayName: 'Permissions',
      type: 'multiOptions',
      required: false,
      default: ['read'],
      description: 'Permissions to grant for the share',
      options: [
        { name: 'Read', value: 'read', description: 'Read permission' },
        { name: 'Update', value: 'update', description: 'Update permission' },
        { name: 'Create', value: 'create', description: 'Create permission' },
        { name: 'Delete', value: 'delete', description: 'Delete permission' },
        { name: 'Share', value: 'share', description: 'Share permission' }
      ]
    },
    {
      name: 'password',
      displayName: 'Password',
      type: 'string',
      required: false,
      default: '',
      description: 'Password for protected shares'
    },
    {
      name: 'expireDate',
      displayName: 'Expire Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Expiration date for the share'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address for user operations'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Display name for the user'
    },
    {
      name: 'groups',
      displayName: 'Groups',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of groups for the user'
    },
    {
      name: 'quota',
      displayName: 'Quota',
      type: 'string',
      required: false,
      default: '',
      description: 'Storage quota for the user (e.g., "1GB", "500MB")'
    },
    {
      name: 'language',
      displayName: 'Language',
      type: 'string',
      required: false,
      default: '',
      description: 'Language setting for the user'
    },
    {
      name: 'overwrite',
      displayName: 'Overwrite',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to overwrite existing files'
    },
    {
      name: 'createParentFolders',
      displayName: 'Create Parent Folders',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Create parent folders if they don\'t exist'
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
      description: 'The processed Nextcloud data'
    }
  ],
  credentials: ['nextcloudApi', 'nextcloudOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to Nextcloud',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
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
      description: 'Download a file from Nextcloud',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
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
      description: 'Create a new folder in Nextcloud',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
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
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
            parameters: {
              resource: 'folder',
              operation: 'list',
              folderPath: '/Documents'
            }
          }
        ]
      }
    },
    {
      name: 'Share File',
      description: 'Share a file with another user',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
            parameters: {
              resource: 'file',
              operation: 'share',
              path: '/Documents/report.pdf',
              shareType: 'user',
              shareWith: 'colleague@example.com',
              permissions: ['read', 'update']
            }
          }
        ]
      }
    },
    {
      name: 'Create Public Share Link',
      description: 'Create a public share link for a file',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
            parameters: {
              resource: 'file',
              operation: 'share',
              path: '/Documents/presentation.pdf',
              shareType: 'public',
              password: 'securepass123',
              expireDate: '2024-12-31T23:59:59.000Z'
            }
          }
        ]
      }
    },
    {
      name: 'Invite User',
      description: 'Invite a new user to Nextcloud',
      workflow: {
        nodes: [
          {
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
            parameters: {
              resource: 'user',
              operation: 'invite',
              userId: 'newuser',
              email: 'newuser@example.com',
              displayName: 'New User',
              groups: 'users,editors',
              quota: '1GB'
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
            name: 'Nextcloud',
            type: 'n8n-nodes-base.nextcloud',
            parameters: {
              resource: 'file',
              operation: 'move',
              sourcePath: '/Documents/old_report.pdf',
              destinationPath: '/Archive/old_report.pdf'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const nextcloudNodes: NodeTypeInfo[] = [nextcloudNode];

// Export individual actions for the Nextcloud node
export const nextcloudActions = [
  // File actions
  'copy_file',
  'delete_file',
  'download_file',
  'move_file',
  'share_file',
  'upload_file',
  // Folder actions
  'copy_folder',
  'create_folder',
  'delete_folder',
  'list_folder_contents',
  'move_folder',
  'share_folder',
  // User actions
  'invite_user',
  'delete_user',
  'get_user',
  'get_users',
  'update_user'
];

// Export file operations
export const nextcloudFileOperations = [
  'copy',
  'delete',
  'download',
  'move',
  'share',
  'upload'
];

// Export folder operations
export const nextcloudFolderOperations = [
  'copyFolder',
  'createFolder',
  'deleteFolder',
  'list',
  'moveFolder',
  'shareFolder'
];

// Export user operations
export const nextcloudUserOperations = [
  'invite',
  'deleteUser',
  'getUser',
  'getUsers',
  'updateUser'
];