/**
 * # Dropbox
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Cloud Storage & File Management
 * 
 * ## Description
 * 
 * Use the Dropbox node to automate work in Dropbox, and integrate Dropbox with other applications. 
 * n8n has built-in support for a wide range of Dropbox features, including creating, downloading, 
 * moving, and copying files and folders, as well as search functionality.
 * 
 * ## Key Features
 * 
 * - **File Management**: Complete file operations including upload, download, copy, move, and delete
 * - **Folder Management**: Create, organize, and manage folder structures
 * - **Search Capabilities**: Query and find files and folders across your Dropbox
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Batch Operations**: Handle multiple files and folders efficiently
 * - **Integration Ready**: Seamless integration with other workflow nodes
 * - **Secure Access**: OAuth-based authentication for secure API access
 * - **Metadata Access**: Retrieve detailed file and folder information
 * - **Version Control**: Work with file versions and revision history
 * - **Share Management**: Handle sharing and permissions for files and folders
 * - **Automatic Sync**: Keep files synchronized across platforms
 * - **Backup Automation**: Create automated backup workflows
 * 
 * ## Credentials
 * 
 * Refer to [Dropbox credentials](../../credentials/dropbox/) for guidance on setting up authentication.
 * Uses Dropbox OAuth2 for secure API access with appropriate file permissions.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### File Operations
 * - **Copy File**: Duplicate files within Dropbox
 * - **Delete File**: Remove files from Dropbox
 * - **Download File**: Retrieve files from Dropbox
 * - **Move File**: Relocate files within Dropbox
 * - **Upload File**: Add files to Dropbox
 * 
 * ### Folder Operations
 * - **Copy Folder**: Duplicate entire folder structures
 * - **Create Folder**: Establish new folder structures
 * - **Delete Folder**: Remove folder structures
 * - **List Folder Contents**: Retrieve folder information
 * - **Move Folder**: Relocate folder structures
 * 
 * ### Search Operations
 * - **Query**: Search for files and folders
 * 
 * ## Advanced Features
 * 
 * ### File Management and Organization
 * - **Automated Organization**: Smart file sorting and categorization
 * - **Backup Workflows**: Automated backup and sync operations
 * - **Version Control**: File version management and history tracking
 * - **Duplicate Detection**: Identify and manage duplicate files
 * 
 * ### Integration and Automation
 * - **Workflow Integration**: Connect with other n8n nodes seamlessly
 * - **Batch Processing**: Handle multiple files and operations efficiently
 * - **Event-Driven Automation**: Trigger workflows based on file changes
 * - **Custom Processing**: Integrate with file processing and transformation
 * 
 * ### Security and Compliance
 * - **Secure Access**: OAuth-based authentication and authorization
 * - **Audit Trails**: Track file operations and changes
 * - **Permission Management**: Handle file and folder permissions
 * - **Data Governance**: Implement data retention and compliance policies
 * 
 * ### Performance and Scalability
 * - **Large File Handling**: Efficient processing of large files
 * - **Batch Operations**: Optimize performance with bulk operations
 * - **Streaming Support**: Stream large files for memory efficiency
 * - **Resume Capability**: Resume interrupted transfers
 * 
 * ## Integration Patterns
 * 
 * ### Backup and Sync Workflows
 * - **Automated Backups**: Schedule regular backup operations
 * - **Cross-Platform Sync**: Synchronize files across multiple platforms
 * - **Incremental Backups**: Efficient backup of changed files only
 * - **Archive Management**: Automated archiving and retention policies
 * 
 * ### Content Management
 * - **Document Workflows**: Automate document processing and routing
 * - **Media Management**: Organize and process media files
 * - **Report Distribution**: Automated report generation and distribution
 * - **File Processing**: Transform and process files automatically
 * 
 * ### Collaboration and Sharing
 * - **Team Workspaces**: Manage shared team folders and permissions
 * - **Project Management**: Organize project files and deliverables
 * - **Client Portals**: Automated client file sharing and updates
 * - **Approval Workflows**: Route files through approval processes
 * 
 * ### Data Integration
 * - **ETL Workflows**: Extract, transform, and load data files
 * - **API Integration**: Connect Dropbox with external systems
 * - **Database Sync**: Synchronize files with database records
 * - **Analytics Pipeline**: Feed files into analytics and reporting systems
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Dropbox API directly with your Dropbox credentials.
 * 
 * ## Use Cases
 * 
 * - **File Backup**: Automated backup of important files and documents
 * - **Content Distribution**: Distribute files and updates to multiple locations
 * - **Document Processing**: Process and transform documents automatically
 * - **Media Management**: Organize and manage media files and assets
 * - **Report Automation**: Generate and distribute reports automatically
 * - **Archive Management**: Implement automated archiving and retention
 * - **Team Collaboration**: Manage shared workspaces and team files
 * - **Client Portals**: Provide secure file sharing for clients
 * - **Data Integration**: Integrate file-based data with other systems
 * - **Workflow Automation**: Trigger workflows based on file operations
 * - **Storage Optimization**: Manage storage usage and optimization
 * - **Compliance Monitoring**: Monitor and audit file operations
 * - **Version Control**: Track and manage file versions and changes
 * - **Sync Workflows**: Keep files synchronized across platforms
 * - **Project Management**: Organize project files and deliverables
 * - **Content Migration**: Migrate content between storage systems
 * - **Automated Processing**: Process files through automated pipelines
 * - **File Distribution**: Distribute files to multiple destinations
 * - **Data Collection**: Collect and aggregate files from various sources
 * - **File Transformation**: Transform file formats and content automatically
 */

import { NodeTypeInfo } from '../../node-types.js';

export const dropboxNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.dropbox',
  displayName: 'Dropbox',
  description: 'Manage files and folders in Dropbox with comprehensive file operations.',
  category: 'Action Nodes',
  subcategory: 'Cloud Storage & File Management',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'file',
      description: 'Resource to operate on',
      options: [
        {
          name: 'File',
          value: 'file',
          description: 'Work with files'
        },
        {
          name: 'Folder',
          value: 'folder',
          description: 'Work with folders'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search for files and folders'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'upload',
      description: 'Operation to perform',
      displayOptions: {
        show: {
          resource: ['file']
        }
      },
      options: [
        {
          name: 'Copy',
          value: 'copy',
          description: 'Copy a file'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a file'
        },
        {
          name: 'Download',
          value: 'download',
          description: 'Download a file'
        },
        {
          name: 'Move',
          value: 'move',
          description: 'Move a file'
        },
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload a file'
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
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'dropboxOAuth2Api',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Dropbox'
  },

  aliases: ['cloud storage', 'file management', 'file sync', 'backup'],
  
  examples: [
    {
      name: 'Upload File to Dropbox',
      description: 'Upload a file to Dropbox cloud storage',
      workflow: {
        nodes: [
          {
            name: 'Dropbox',
            type: 'n8n-nodes-base.dropbox',
            parameters: {
              resource: 'file',
              operation: 'upload',
              path: '/documents/report.pdf'
            }
          }
        ]
      }
    }
  ]
};

export default dropboxNode;
