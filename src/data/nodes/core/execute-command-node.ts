/**
 * # Execute Command
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: System
 * 
 * ## Description
 * 
 * Execute shell commands and system operations directly from within workflows.
 * This node provides powerful system integration capabilities, allowing automation
 * of command-line tools, scripts, and system administration tasks.
 * 
 * ## Key Features
 * 
 * - **Shell Command Execution**: Run any shell command or script
 * - **Multiple Shell Support**: Bash, PowerShell, CMD, Zsh, Fish
 * - **Environment Variables**: Set and access environment variables
 * - **Working Directory**: Specify execution directory
 * - **Input/Output Handling**: Capture stdout, stderr, and exit codes
 * - **Timeout Management**: Set execution timeouts to prevent hanging
 * - **Async Execution**: Support for long-running processes
 * - **Parameter Injection**: Safely inject workflow data into commands
 * - **Error Handling**: Comprehensive error capture and reporting
 * - **File Operations**: Execute file system operations
 * - **Script Execution**: Run custom scripts in various languages
 * - **System Integration**: Interface with system APIs and tools
 * 
 * ## Supported Operations
 * 
 * ### Command Types
 * - **System Commands**: ls, dir, ps, top, netstat, etc.
 * - **File Operations**: cp, mv, rm, mkdir, chmod, etc.
 * - **Network Tools**: curl, wget, ping, nslookup, etc.
 * - **Text Processing**: grep, sed, awk, sort, uniq, etc.
 * - **Archive Operations**: tar, zip, unzip, gzip, etc.
 * - **Database Commands**: mysql, psql, mongo, etc.
 * - **Version Control**: git, svn, etc.
 * - **Package Management**: npm, pip, apt, yum, etc.
 * 
 * ### Shell Environments
 * - **Bash**: Default Unix/Linux shell
 * - **Zsh**: Extended Unix shell with advanced features
 * - **Fish**: User-friendly interactive shell
 * - **PowerShell**: Windows PowerShell and PowerShell Core
 * - **CMD**: Windows Command Prompt
 * - **Custom**: User-defined shell or interpreter
 * 
 * ## Use Cases
 * 
 * - **System Administration**: Automate server maintenance tasks
 * - **File Management**: Organize, backup, and process files
 * - **Data Processing**: Run custom data processing scripts
 * - **Deployment Operations**: Execute deployment and build scripts
 * - **Monitoring**: Run system monitoring and health checks
 * - **Integration**: Connect with command-line tools and APIs
 * - **Backup Operations**: Automate backup and restore procedures
 * - **Log Processing**: Parse and analyze log files
 * - **Network Operations**: Perform network diagnostics and operations
 * - **Development Workflows**: Run tests, builds, and deployments
 * - **Database Operations**: Execute database maintenance scripts
 * - **Security Scanning**: Run security tools and vulnerability scans
 */

import { NodeTypeInfo } from '../../node-types.js';

export const executeCommandNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.executeCommand',
  displayName: 'Execute Command',
  description: 'Execute shell commands and system operations',
  category: 'Core Nodes',
  subcategory: 'System',
  
  properties: [
    {
      name: 'command',
      displayName: 'Command',
      type: 'string',
      required: true,
      default: '',
      description: 'The command to execute',
      placeholder: 'ls -la',
    },
    {
      name: 'shell',
      displayName: 'Shell',
      type: 'options',
      required: false,
      default: 'bash',
      description: 'Shell to use for command execution',
      options: [
        {
          name: 'Bash',
          value: 'bash',
          description: 'Bash shell (default Unix/Linux)'
        },
        {
          name: 'Zsh',
          value: 'zsh',
          description: 'Z shell with extended features'
        },
        {
          name: 'Fish',
          value: 'fish',
          description: 'Friendly interactive shell'
        },
        {
          name: 'PowerShell',
          value: 'powershell',
          description: 'Windows PowerShell'
        },
        {
          name: 'CMD',
          value: 'cmd',
          description: 'Windows Command Prompt'
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Custom shell or interpreter'
        }
      ]
    },
    {
      name: 'customShell',
      displayName: 'Custom Shell Path',
      type: 'string',
      required: false,
      default: '',
      description: 'Path to custom shell or interpreter',
      displayOptions: {
        show: {
          shell: ['custom']
        }
      },
      placeholder: '/usr/bin/python3'
    },
    {
      name: 'workingDirectory',
      displayName: 'Working Directory',
      type: 'string',
      required: false,
      default: '',
      description: 'Directory to execute command in',
      placeholder: '/home/user/project'
    },
    {
      name: 'environmentVariables',
      displayName: 'Environment Variables',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Environment variables to set',
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Variable',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              required: true,
              default: '',
              description: 'Environment variable name',
              placeholder: 'PATH'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: true,
              default: '',
              description: 'Environment variable value',
              placeholder: '/usr/local/bin'
            }
          ]
        }
      ]
    },
    {
      name: 'timeout',
      displayName: 'Timeout (seconds)',
      type: 'number',
      required: false,
      default: 60,
      description: 'Maximum execution time in seconds',
      typeOptions: {
        minValue: 1,
        maxValue: 3600
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional execution options',
      options: [
        {
          name: 'continueOnFail',
          displayName: 'Continue on Fail',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Continue workflow even if command fails'
        },
        {
          name: 'returnStderr',
          displayName: 'Return stderr',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Include stderr in output'
        },
        {
          name: 'returnExitCode',
          displayName: 'Return Exit Code',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Include exit code in output'
        },
        {
          name: 'killSignal',
          displayName: 'Kill Signal',
          type: 'options',
          required: false,
          default: 'SIGTERM',
          description: 'Signal to use when killing process',
          options: [
            {
              name: 'SIGTERM',
              value: 'SIGTERM',
              description: 'Terminate gracefully'
            },
            {
              name: 'SIGKILL',
              value: 'SIGKILL',
              description: 'Force kill immediately'
            },
            {
              name: 'SIGINT',
              value: 'SIGINT',
              description: 'Interrupt (Ctrl+C)'
            }
          ]
        },
        {
          name: 'encoding',
          displayName: 'Output Encoding',
          type: 'options',
          required: false,
          default: 'utf8',
          description: 'Character encoding for output',
          options: [
            {
              name: 'UTF-8',
              value: 'utf8',
              description: 'UTF-8 encoding'
            },
            {
              name: 'ASCII',
              value: 'ascii',
              description: 'ASCII encoding'
            },
            {
              name: 'Base64',
              value: 'base64',
              description: 'Base64 encoding'
            },
            {
              name: 'Binary',
              value: 'binary',
              description: 'Binary data'
            }
          ]
        }
      ]
    },
    {
      name: 'arguments',
      displayName: 'Arguments',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Command line arguments',
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Argument',
          values: [
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: true,
              default: '',
              description: 'Command argument',
              placeholder: '--verbose'
            }
          ]
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
      description: 'Command execution results'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'Execute Command'
  },

  aliases: ['command', 'shell', 'exec', 'execute', 'system', 'bash', 'terminal'],
  
  examples: [
    {
      name: 'List Directory Contents',
      description: 'List files and directories in current location',
      workflow: {
        nodes: [
          {
            name: 'Execute Command',
            type: 'n8n-nodes-base.executeCommand',
            parameters: {
              command: 'ls -la',
              shell: 'bash',
              timeout: 30,
              options: {
                returnStderr: true,
                returnExitCode: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Git Status Check',
      description: 'Check git repository status',
      workflow: {
        nodes: [
          {
            name: 'Execute Command',
            type: 'n8n-nodes-base.executeCommand',
            parameters: {
              command: 'git status --porcelain',
              shell: 'bash',
              workingDirectory: '/path/to/repo',
              timeout: 60
            }
          }
        ]
      }
    },
    {
      name: 'System Health Check',
      description: 'Check system disk usage and memory',
      workflow: {
        nodes: [
          {
            name: 'Execute Command',
            type: 'n8n-nodes-base.executeCommand',
            parameters: {
              command: 'df -h && free -m',
              shell: 'bash',
              timeout: 30,
              options: {
                continueOnFail: false,
                returnStderr: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default executeCommandNode;
