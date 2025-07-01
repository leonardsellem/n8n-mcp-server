/**
 * # SSH
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Network
 * 
 * ## Description
 * 
 * The SSH node is useful for executing commands using the Secure Shell Protocol.
 * 
 * ## Operations
 * 
 * ### Execute Command
 * Execute a command on a remote server via SSH.
 * 
 * ### Download File
 * Download a file from a remote server via SSH/SFTP.
 * 
 * ### Upload File
 * Upload a file to a remote server via SSH/SFTP.
 * 
 * **Note**: To attach a file for upload, you will need to use an extra node such as the 
 * Read/Write Files from Disk node or the HTTP Request node to pass the file as a data property.
 * 
 * ## Key Features
 * 
 * - **Remote command execution**: Execute shell commands on remote servers
 * - **File transfer**: Upload and download files via SFTP
 * - **Secure authentication**: Use SSH credentials for secure connections
 * - **Working directory control**: Specify execution directory for commands
 * - **Binary data handling**: Support for file uploads and downloads
 * - **Custom file naming**: Override default file names during transfer
 * 
 * ## Use Cases
 * 
 * - Remote server administration and monitoring
 * - Automated deployment scripts
 * - File backup and synchronization
 * - Server health checks and maintenance
 * - Log file collection and analysis
 * - Database backups and transfers
 * 
 * ## Credentials
 * 
 * You can find authentication information for this node in the SSH credentials documentation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sshNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ssh',
  displayName: 'SSH',
  description: 'Execute commands and transfer files using the Secure Shell Protocol',
  category: 'Core Nodes',
  subcategory: 'Network',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'executeCommand',
      description: 'The operation to perform',
      options: [
        {
          name: 'Execute Command',
          value: 'executeCommand',
          description: 'Execute a command on the remote server'
        },
        {
          name: 'Download File',
          value: 'downloadFile',
          description: 'Download a file from the remote server'
        },
        {
          name: 'Upload File',
          value: 'uploadFile',
          description: 'Upload a file to the remote server'
        }
      ]
    },
    {
      name: 'command',
      displayName: 'Command',
      type: 'string',
      required: true,
      default: '',
      description: 'The command to execute on the remote device',
      placeholder: 'ls -la',
      displayOptions: {
        show: {
          operation: ['executeCommand']
        }
      }
    },
    {
      name: 'workingDirectory',
      displayName: 'Working Directory',
      type: 'string',
      required: false,
      default: '',
      description: 'The directory where the command should be executed',
      placeholder: '/home/user',
      displayOptions: {
        show: {
          operation: ['executeCommand']
        }
      }
    },
    {
      name: 'path',
      displayName: 'Path',
      type: 'string',
      required: true,
      default: '',
      description: 'The path for the file you want to download (must include the file name)',
      placeholder: '/path/to/file.txt',
      displayOptions: {
        show: {
          operation: ['downloadFile']
        }
      }
    },
    {
      name: 'dataPropertyName',
      displayName: 'File Property',
      type: 'string',
      required: true,
      default: 'data',
      description: 'Name of the object property that holds the binary data you want to download',
      displayOptions: {
        show: {
          operation: ['downloadFile']
        }
      }
    },
    {
      name: 'inputDataFieldName',
      displayName: 'Input Binary Field',
      type: 'string',
      required: true,
      default: 'data',
      description: 'Name of the input binary field that contains the file you want to upload',
      displayOptions: {
        show: {
          operation: ['uploadFile']
        }
      }
    },
    {
      name: 'path',
      displayName: 'Target Directory',
      type: 'string',
      required: true,
      default: '',
      description: 'The directory to upload the file to',
      placeholder: '/path/to/directory/',
      displayOptions: {
        show: {
          operation: ['uploadFile']
        }
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      options: [
        {
          name: 'fileName',
          displayName: 'File Name',
          type: 'string',
          default: '',
          description: 'Override the default file name',
          displayOptions: {
            show: {
              '/operation': ['downloadFile', 'uploadFile']
            }
          }
        }
      ]
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
      description: 'Command output or file transfer result'
    }
  ],

  credentials: [
    {
      name: 'sshPassword',
      required: true,
      displayOptions: {
        show: {
          authentication: ['password']
        }
      }
    },
    {
      name: 'sshPrivateKey',
      required: true,
      displayOptions: {
        show: {
          authentication: ['privateKey']
        }
      }
    }
  ],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'SSH'
  },

  aliases: ['ssh', 'secure shell', 'remote'],
  
  examples: [
    {
      name: 'Execute Remote Command',
      description: 'Execute a command on a remote server',
      workflow: {
        nodes: [
          {
            name: 'SSH',
            type: 'n8n-nodes-base.ssh',
            parameters: {
              operation: 'executeCommand',
              command: 'ls -la /var/log',
              workingDirectory: '/home/user'
            }
          }
        ]
      }
    },
    {
      name: 'Download Log File',
      description: 'Download a log file from remote server',
      workflow: {
        nodes: [
          {
            name: 'SSH',
            type: 'n8n-nodes-base.ssh',
            parameters: {
              operation: 'downloadFile',
              path: '/var/log/application.log',
              dataPropertyName: 'data'
            }
          }
        ]
      }
    },
    {
      name: 'Upload Configuration File',
      description: 'Upload a configuration file to remote server',
      workflow: {
        nodes: [
          {
            name: 'SSH',
            type: 'n8n-nodes-base.ssh',
            parameters: {
              operation: 'uploadFile',
              inputDataFieldName: 'data',
              path: '/etc/config/',
              options: {
                fileName: 'app.conf'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Server Health Check',
      description: 'Check server disk usage and memory',
      workflow: {
        nodes: [
          {
            name: 'SSH',
            type: 'n8n-nodes-base.ssh',
            parameters: {
              operation: 'executeCommand',
              command: 'df -h && free -m'
            }
          }
        ]
      }
    }
  ]
};

export default sshNode;
