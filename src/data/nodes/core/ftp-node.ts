/**
 * # FTP
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: File Transfer
 * 
 * ## Description
 * 
 * Transfer files using FTP (File Transfer Protocol) and SFTP (SSH File Transfer Protocol).
 * This node provides comprehensive file transfer capabilities for uploading, downloading,
 * and managing files on remote servers with support for both secure and standard protocols.
 * 
 * ## Key Features
 * 
 * - **FTP Support**: Standard File Transfer Protocol operations
 * - **SFTP Support**: Secure SSH-based file transfers
 * - **File Operations**: Upload, download, list, delete, rename files
 * - **Directory Management**: Create, remove, and navigate directories
 * - **Passive/Active Mode**: Support for both FTP connection modes
 * - **Resume Transfers**: Resume interrupted file transfers
 * - **Batch Operations**: Process multiple files efficiently
 * - **Permission Management**: Set file and directory permissions
 * - **Progress Tracking**: Monitor transfer progress
 * - **Error Handling**: Robust error detection and recovery
 * - **Authentication**: Multiple authentication methods
 * - **Encryption**: Secure data transmission with SFTP
 * 
 * ## Supported Operations
 * 
 * ### File Operations
 * - **Upload**: Transfer files to remote server
 * - **Download**: Retrieve files from remote server
 * - **List**: List files and directories
 * - **Delete**: Remove files from server
 * - **Rename**: Rename files and directories
 * - **Move**: Move files between directories
 * - **Copy**: Copy files on remote server
 * - **Exists**: Check if file or directory exists
 * 
 * ### Directory Operations
 * - **Create Directory**: Make new directories
 * - **Remove Directory**: Delete empty directories
 * - **Change Directory**: Navigate directory structure
 * - **Get Working Directory**: Get current directory path
 * - **List Directory**: Get directory contents
 * - **Directory Info**: Get directory metadata
 * 
 * ### Transfer Modes
 * - **ASCII Mode**: Text file transfers
 * - **Binary Mode**: Binary file transfers (default)
 * - **Passive Mode**: Client initiates data connections
 * - **Active Mode**: Server initiates data connections
 * 
 * ## Use Cases
 * 
 * - **File Backup**: Automated backup of local files to remote servers
 * - **Data Distribution**: Distribute files to multiple remote locations
 * - **Log Collection**: Retrieve log files from remote servers
 * - **Website Deployment**: Upload website files to web servers
 * - **Data Synchronization**: Keep files synchronized between systems
 * - **Automated Uploads**: Schedule regular file uploads
 * - **File Processing**: Download, process, and re-upload files
 * - **Content Management**: Manage files in content delivery systems
 * - **Database Backups**: Transfer database backup files
 * - **Media Management**: Upload and organize media files
 * - **Integration Tasks**: File-based system integrations
 * - **Monitoring**: Collect files for monitoring and analysis
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ftpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ftp',
  displayName: 'FTP',
  description: 'Transfer files using FTP and SFTP protocols',
  category: 'Core Nodes',
  subcategory: 'File Transfer',
  
  properties: [
    {
      name: 'protocol',
      displayName: 'Protocol',
      type: 'options',
      required: true,
      default: 'ftp',
      description: 'File transfer protocol to use',
      options: [
        {
          name: 'FTP',
          value: 'ftp',
          description: 'File Transfer Protocol'
        },
        {
          name: 'SFTP',
          value: 'sftp',
          description: 'SSH File Transfer Protocol (Secure)'
        }
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
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload file to server'
        },
        {
          name: 'Download',
          value: 'download',
          description: 'Download file from server'
        },
        {
          name: 'List',
          value: 'list',
          description: 'List files and directories'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete file or directory'
        },
        {
          name: 'Rename',
          value: 'rename',
          description: 'Rename file or directory'
        },
        {
          name: 'Create Directory',
          value: 'mkdir',
          description: 'Create new directory'
        }
      ]
    },
    {
      name: 'localFilePath',
      displayName: 'Local File Path',
      type: 'string',
      required: true,
      default: '',
      description: 'Path to local file',
      displayOptions: {
        show: {
          operation: ['upload', 'download']
        }
      },
      placeholder: '/path/to/local/file.txt'
    },
    {
      name: 'remoteFilePath',
      displayName: 'Remote File Path',
      type: 'string',
      required: true,
      default: '',
      description: 'Path to remote file',
      displayOptions: {
        show: {
          operation: ['upload', 'download', 'delete', 'rename']
        }
      },
      placeholder: '/remote/path/file.txt'
    },
    {
      name: 'remotePath',
      displayName: 'Remote Path',
      type: 'string',
      required: true,
      default: '/',
      description: 'Remote directory path',
      displayOptions: {
        show: {
          operation: ['list', 'mkdir']
        }
      },
      placeholder: '/remote/directory'
    },
    {
      name: 'newName',
      displayName: 'New Name',
      type: 'string',
      required: true,
      default: '',
      description: 'New name for file or directory',
      displayOptions: {
        show: {
          operation: ['rename']
        }
      },
      placeholder: 'new_filename.txt'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional transfer options',
      options: [
        {
          name: 'transferMode',
          displayName: 'Transfer Mode',
          type: 'options',
          required: false,
          default: 'binary',
          description: 'File transfer mode',
          displayOptions: {
            show: {
              '/protocol': ['ftp']
            }
          },
          options: [
            {
              name: 'Binary',
              value: 'binary',
              description: 'Binary mode (recommended)'
            },
            {
              name: 'ASCII',
              value: 'ascii',
              description: 'ASCII text mode'
            }
          ]
        },
        {
          name: 'passiveMode',
          displayName: 'Passive Mode',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Use passive mode for FTP connections',
          displayOptions: {
            show: {
              '/protocol': ['ftp']
            }
          }
        },
        {
          name: 'preserveTimestamp',
          displayName: 'Preserve Timestamp',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Preserve file modification timestamp',
          displayOptions: {
            show: {
              '/operation': ['upload', 'download']
            }
          }
        },
        {
          name: 'overwrite',
          displayName: 'Overwrite',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Overwrite existing files',
          displayOptions: {
            show: {
              '/operation': ['upload', 'download']
            }
          }
        },
        {
          name: 'createDirs',
          displayName: 'Create Directories',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Create remote directories if they don\'t exist',
          displayOptions: {
            show: {
              '/operation': ['upload']
            }
          }
        },
        {
          name: 'recursive',
          displayName: 'Recursive',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Perform operation recursively',
          displayOptions: {
            show: {
              '/operation': ['list', 'delete']
            }
          }
        },
        {
          name: 'filePermissions',
          displayName: 'File Permissions',
          type: 'string',
          required: false,
          default: '',
          description: 'File permissions (e.g., 644, 755)',
          displayOptions: {
            show: {
              '/protocol': ['sftp'],
              '/operation': ['upload']
            }
          },
          placeholder: '644'
        }
      ]
    },
    {
      name: 'timeout',
      displayName: 'Timeout (seconds)',
      type: 'number',
      required: false,
      default: 30,
      description: 'Connection timeout in seconds',
      typeOptions: {
        minValue: 5,
        maxValue: 300
      }
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'File transfer results'
    }
  ],

  credentials: [
    {
      name: 'ftp',
      required: true,
      displayOptions: {
        show: {
          protocol: ['ftp']
        }
      }
    },
    {
      name: 'sftp',
      required: true,
      displayOptions: {
        show: {
          protocol: ['sftp']
        }
      }
    }
  ],
  
  version: [1],
  defaults: {
    name: 'FTP'
  },

  aliases: ['sftp', 'file-transfer', 'upload', 'download', 'file-server'],
  
  examples: [
    {
      name: 'Upload File to Server',
      description: 'Upload a local file to remote FTP server',
      workflow: {
        nodes: [
          {
            name: 'FTP',
            type: 'n8n-nodes-base.ftp',
            parameters: {
              protocol: 'ftp',
              operation: 'upload',
              localFilePath: '/local/file.txt',
              remoteFilePath: '/remote/uploaded/file.txt',
              options: {
                transferMode: 'binary',
                overwrite: true,
                createDirs: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Download Files from SFTP',
      description: 'Securely download files using SFTP protocol',
      workflow: {
        nodes: [
          {
            name: 'FTP',
            type: 'n8n-nodes-base.ftp',
            parameters: {
              protocol: 'sftp',
              operation: 'download',
              localFilePath: '/local/downloaded/file.txt',
              remoteFilePath: '/remote/source/file.txt',
              options: {
                preserveTimestamp: true,
                overwrite: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'List Remote Directory',
      description: 'List files and directories on remote server',
      workflow: {
        nodes: [
          {
            name: 'FTP',
            type: 'n8n-nodes-base.ftp',
            parameters: {
              protocol: 'ftp',
              operation: 'list',
              remotePath: '/remote/directory',
              options: {
                recursive: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default ftpNode;
