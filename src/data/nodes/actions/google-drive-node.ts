import { NodeTypeInfo } from '../../node-types.js';

export const googleDriveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googledrive',
  displayName: 'Google Drive',
  description: 'Use the Google Drive node to automate work in Google Drive, and integrate Google Drive with other applications. n8n has built-in support for a wide range of Google Drive features, including creating, updating, listing, deleting, and getting drives, files, and folders.',
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
        { name: 'File', value: 'file', description: 'Work with files in Google Drive' },
        { name: 'File/Folder', value: 'fileFolder', description: 'Search files and folders' },
        { name: 'Folder', value: 'folder', description: 'Manage folders in Google Drive' },
        { name: 'Shared Drive', value: 'sharedDrive', description: 'Manage shared drives' }
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
        { name: 'Create from text', value: 'createFromText', description: 'Create a file from text' },
        { name: 'Delete', value: 'delete', description: 'Delete a file' },
        { name: 'Download', value: 'download', description: 'Download a file' },
        { name: 'Move', value: 'move', description: 'Move a file' },
        { name: 'Share', value: 'share', description: 'Share a file' },
        { name: 'Update', value: 'update', description: 'Update a file' },
        { name: 'Upload', value: 'upload', description: 'Upload a file' },
        // File/Folder operations
        { name: 'Search', value: 'search', description: 'Search files and folders' },
        // Folder operations
        { name: 'Create', value: 'create', description: 'Create a folder' },
        { name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder' },
        { name: 'Share Folder', value: 'shareFolder', description: 'Share a folder' },
        // Shared Drive operations
        { name: 'Create Drive', value: 'createDrive', description: 'Create a shared drive' },
        { name: 'Delete Drive', value: 'deleteDrive', description: 'Delete a shared drive' },
        { name: 'Get Drive', value: 'getDrive', description: 'Get a shared drive' },
        { name: 'Get Many Drives', value: 'getManyDrives', description: 'Get many shared drives' },
        { name: 'Update Drive', value: 'updateDrive', description: 'Update a shared drive' }
      ]
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file'
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
      description: 'The content of the file'
    },
    {
      name: 'mimeType',
      displayName: 'MIME Type',
      type: 'string',
      required: false,
      default: '',
      description: 'The MIME type of the file'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder'
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
      name: 'parentFolderId',
      displayName: 'Parent Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the parent folder'
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
      name: 'driveId',
      displayName: 'Drive ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the shared drive'
    },
    {
      name: 'driveName',
      displayName: 'Drive Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the shared drive'
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
      name: 'useDomainAdminAccess',
      displayName: 'Use Domain Admin Access',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Issue the request as a domain administrator'
    },
    {
      name: 'includeItemsFromAllDrives',
      displayName: 'Include Items From All Drives',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether both My Drive and shared drive items should be included in results'
    },
    {
      name: 'supportsAllDrives',
      displayName: 'Supports All Drives',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the requesting application supports both My Drives and shared drives'
    },
    {
      name: 'corpora',
      displayName: 'Corpora',
      type: 'options',
      required: false,
      default: 'user',
      description: 'The source of files to list',
      options: [
        { name: 'User', value: 'user', description: 'Files owned by the user and shared with the user' },
        { name: 'Drive', value: 'drive', description: 'Files contained in a single shared drive' },
        { name: 'Domain', value: 'domain', description: 'Files shared to the user\'s domain' },
        { name: 'All Drives', value: 'allDrives', description: 'Files in My Drive and shared drives' }
      ]
    },
    {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'string',
      required: false,
      default: '',
      description: 'A comma-separated list of sort keys'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'The paths of the fields you want included in the response'
    },
    {
      name: 'sendNotificationEmail',
      displayName: 'Send Notification Email',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to send a notification email when sharing to users or groups'
    },
    {
      name: 'role',
      displayName: 'Role',
      type: 'options',
      required: false,
      default: 'reader',
      description: 'The role granted by this permission',
      options: [
        { name: 'Owner', value: 'owner', description: 'Full ownership of the file' },
        { name: 'Organizer', value: 'organizer', description: 'Can organize files (shared drives only)' },
        { name: 'File Organizer', value: 'fileOrganizer', description: 'Can organize files and folders (shared drives only)' },
        { name: 'Writer', value: 'writer', description: 'Can read and write' },
        { name: 'Commenter', value: 'commenter', description: 'Can read and comment' },
        { name: 'Reader', value: 'reader', description: 'Can only read' }
      ]
    },
    {
      name: 'type',
      displayName: 'Type',
      type: 'options',
      required: false,
      default: 'user',
      description: 'The type of the grantee',
      options: [
        { name: 'User', value: 'user', description: 'A user account' },
        { name: 'Group', value: 'group', description: 'A Google group' },
        { name: 'Domain', value: 'domain', description: 'A domain' },
        { name: 'Anyone', value: 'anyone', description: 'Anyone on the internet' }
      ]
    },
    {
      name: 'emailAddress',
      displayName: 'Email Address',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address of the user or group to whom this permission refers'
    },
    {
      name: 'domain',
      displayName: 'Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'The domain to whom this permission refers'
    },
    {
      name: 'transferOwnership',
      displayName: 'Transfer Ownership',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to transfer ownership to the specified user and downgrade the current user to a writer'
    },
    {
      name: 'useContentAsIndexableText',
      displayName: 'Use Content As Indexable Text',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to use the uploaded content as indexable text'
    },
    {
      name: 'keepRevisionForever',
      displayName: 'Keep Revision Forever',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to set the \'keepForever\' field in the new head revision'
    },
    {
      name: 'ocrLanguage',
      displayName: 'OCR Language',
      type: 'string',
      required: false,
      default: '',
      description: 'A language hint for OCR processing during image import (ISO 639-1 code)'
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
      description: 'The processed Google Drive data'
    }
  ],
  credentials: ['googleDriveOAuth2Api', 'googleDriveServiceAccount'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'file',
              operation: 'upload',
              fileName: 'example.txt',
              fileContent: 'Hello from n8n workflow!',
              parentFolderId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
            }
          }
        ]
      }
    },
    {
      name: 'Download File',
      description: 'Download a file from Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'file',
              operation: 'download',
              fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
            }
          }
        ]
      }
    },
    {
      name: 'Create Folder',
      description: 'Create a new folder in Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'folder',
              operation: 'create',
              folderName: 'New Project Folder',
              parentFolderId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
            }
          }
        ]
      }
    },
    {
      name: 'Search Files',
      description: 'Search for files and folders in Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'fileFolder',
              operation: 'search',
              query: 'name contains "report"',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Share File',
      description: 'Share a file with a user',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'file',
              operation: 'share',
              fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
              type: 'user',
              role: 'reader',
              emailAddress: 'user@example.com',
              sendNotificationEmail: true
            }
          }
        ]
      }
    },
    {
      name: 'Create from Text',
      description: 'Create a Google Docs file from text content',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'file',
              operation: 'createFromText',
              fileName: 'Meeting Notes',
              fileContent: 'Meeting notes from today...',
              mimeType: 'application/vnd.google-apps.document',
              parentFolderId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
            }
          }
        ]
      }
    },
    {
      name: 'Copy File',
      description: 'Copy a file to another location',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'file',
              operation: 'copy',
              fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
              fileName: 'Copy of Important Document',
              parentFolderId: '1234567890abcdef'
            }
          }
        ]
      }
    },
    {
      name: 'Create Shared Drive',
      description: 'Create a new shared drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googledrive',
            parameters: {
              resource: 'sharedDrive',
              operation: 'createDrive',
              driveName: 'Project Team Drive'
            }
          }
        ]
      }
    }
  ]
};

// Google Drive Trigger Node
export const googleDriveTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googledrivetrigger',
  displayName: 'Google Drive Trigger',
  description: 'Triggers the workflow when Google Drive files or folders are created, updated, or deleted.',
  category: 'File Management',
  subcategory: 'Cloud Storage',
  properties: [
    {
      name: 'triggerOn',
      displayName: 'Trigger On',
      type: 'options',
      required: true,
      default: 'fileCreated',
      description: 'When to trigger the workflow',
      options: [
        { name: 'File Created', value: 'fileCreated', description: 'When a file is created' },
        { name: 'File Updated', value: 'fileUpdated', description: 'When a file is updated' },
        { name: 'Folder Created', value: 'folderCreated', description: 'When a folder is created' },
        { name: 'Folder Updated', value: 'folderUpdated', description: 'When a folder is updated' }
      ]
    },
    {
      name: 'watchFolder',
      displayName: 'Watch Folder',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder to watch. If not specified, watches the entire drive'
    },
    {
      name: 'driveId',
      displayName: 'Drive ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the shared drive to watch'
    },
    {
      name: 'pollTimes',
      displayName: 'Poll Times',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Time intervals to poll for changes'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The triggered Google Drive data'
    }
  ],
  credentials: ['googleDriveOAuth2Api', 'googleDriveServiceAccount'],
  triggerNode: true,
  codeable: false,
  examples: [
    {
      name: 'Watch for New Files',
      description: 'Trigger when new files are created in Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive Trigger',
            type: 'n8n-nodes-base.googledrivetrigger',
            parameters: {
              triggerOn: 'fileCreated'
            }
          }
        ]
      }
    },
    {
      name: 'Watch Specific Folder',
      description: 'Trigger when files are updated in a specific folder',
      workflow: {
        nodes: [
          {
            name: 'Google Drive Trigger',
            type: 'n8n-nodes-base.googledrivetrigger',
            parameters: {
              triggerOn: 'fileUpdated',
              watchFolder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
            }
          }
        ]
      }
    }
  ]
};

// Export the nodes as an array for easier importing
export const googleDriveNodes: NodeTypeInfo[] = [googleDriveNode, googleDriveTriggerNode];

// Export individual actions for the Google Drive node
export const googleDriveActions = [
  // File actions
  'copy_file',
  'create_from_text',
  'delete_file',
  'download_file',
  'move_file',
  'share_file',
  'update_file',
  'upload_file',
  // File/Folder actions
  'search_files_folders',
  // Folder actions
  'create_folder',
  'delete_folder',
  'share_folder',
  // Shared Drive actions
  'create_shared_drive',
  'delete_shared_drive',
  'get_shared_drive',
  'get_many_shared_drives',
  'update_shared_drive'
];

// Export file operations
export const googleDriveFileOperations = [
  'copy',
  'createFromText',
  'delete',
  'download',
  'move',
  'share',
  'update',
  'upload'
];

// Export folder operations
export const googleDriveFolderOperations = [
  'create',
  'deleteFolder',
  'shareFolder'
];

// Export shared drive operations
export const googleDriveSharedDriveOperations = [
  'createDrive',
  'deleteDrive',
  'getDrive',
  'getManyDrives',
  'updateDrive'
];

// Export file/folder operations
export const googleDriveFileFolderOperations = [
  'search'
];

// Export trigger operations
export const googleDriveTriggerOperations = [
  'fileCreated',
  'fileUpdated',
  'folderCreated',
  'folderUpdated'
];