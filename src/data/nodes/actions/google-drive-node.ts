/**
 * # Google Drive
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Cloud Storage & File Management
 * 
 * ## Description
 * 
 * Use the Google Drive node to automate work in Google Drive, and integrate Google Drive with other applications. 
 * n8n has built-in support for a wide range of Google Drive features, including creating, updating, listing, 
 * deleting, and getting drives, files, and folders.
 * 
 * ## Key Features
 * 
 * - **Comprehensive File Management**: Copy, create, delete, download, move, share, update, and upload files
 * - **Advanced Folder Operations**: Create, delete, and share folders with permission management
 * - **Powerful Search Capabilities**: Search files and folders with advanced criteria and filters
 * - **Shared Drive Support**: Create, delete, get, list, and update shared drives for team collaboration
 * - **Content Creation**: Create files from text content directly within workflows
 * - **Permission Management**: Fine-grained sharing controls and access permissions
 * - **Metadata Handling**: Access and modify file metadata, properties, and attributes
 * - **Batch Processing**: Handle multiple files and folders efficiently
 * - **OAuth2 Integration**: Secure authentication with Google accounts
 * - **Version Control**: Support for multiple API versions and backward compatibility
 * - **Real-time Sync**: Integration with Google Drive's real-time collaboration features
 * 
 * ## Credentials
 * 
 * Refer to [Google Drive credentials](../../credentials/google/) for guidance on setting up authentication.
 * Uses Google OAuth2 for secure access to your Google Drive.
 * 
 * ## Operations by Resource
 * 
 * ### File Operations
 * - **Copy**: Copy a file to another location
 * - **Create from Text**: Create a new file from text content
 * - **Delete**: Delete a file permanently
 * - **Download**: Download a file from Google Drive
 * - **Move**: Move a file to a different location
 * - **Share**: Share a file with users or make it public
 * - **Update**: Update an existing file's content or metadata
 * - **Upload**: Upload a new file to Google Drive
 * 
 * ### File/Folder Operations
 * - **Search**: Search for files and folders using various criteria
 * 
 * ### Folder Operations
 * - **Create**: Create a new folder
 * - **Delete**: Delete a folder and its contents
 * - **Share**: Share a folder with users and set permissions
 * 
 * ### Shared Drive Operations
 * - **Create**: Create a new shared drive for team collaboration
 * - **Delete**: Delete a shared drive
 * - **Get**: Get details of a specific shared drive
 * - **Get Many**: Get a list of shared drives
 * - **Update**: Update shared drive settings and metadata
 * 
 * ## Common Issues & Solutions
 * 
 * For common questions or issues and suggested solutions, refer to the Common issues documentation.
 * Common challenges include permissions, quota limits, and file format considerations.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Google Drive API directly with your Google credentials.
 * 
 * ## Use Cases
 * 
 * - **Document Automation & Backup**: Automated document processing, backup workflows, and version control
 * - **Content Management Systems**: File organization, content publishing, and document workflows
 * - **Data Analysis & Reporting**: Report generation, data export, and automated analytics storage
 * - **Collaborative Workflows**: Team document sharing, review processes, and approval workflows
 * - **Business Process Automation**: Invoice processing, contract management, and document routing
 * - **Educational Platforms**: Assignment collection, grade distribution, and course material management
 * - **Media & Asset Management**: Image processing, video storage, and digital asset organization
 * - **Integration Hub**: Connect Google Drive with CRM, ERP, and other business systems
 * - **Compliance & Archival**: Legal document storage, compliance reporting, and data retention
 * - **Development & DevOps**: Code backup, deployment artifacts, and documentation management
 * - **E-commerce Operations**: Product catalogs, order documentation, and customer file management
 * - **Research & Data Collection**: Survey responses, research data, and scientific collaboration
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googleDriveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleDrive',
  displayName: 'Google Drive',
  description: 'Upload, download, and manage files on Google Drive cloud storage.',
  category: 'Action Nodes',
  subcategory: 'Cloud Storage & File Management',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'upload',
      description: 'Operation to perform on Google Drive',
      options: [
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload a file to Google Drive'
        },
        {
          name: 'Download',
          value: 'download',
          description: 'Download a file from Google Drive'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a file from Google Drive'
        },
        {
          name: 'List',
          value: 'list',
          description: 'List files in Google Drive'
        },
        {
          name: 'Share',
          value: 'share',
          description: 'Share a file or folder'
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
      name: 'googleDriveOAuth2Api',
      required: true
    }
  ],

  version: [1, 2, 3],
  defaults: {
    name: 'Google Drive'
  },

  aliases: ['drive', 'cloud', 'storage'],
  
  examples: [
    {
      name: 'Upload File',
      description: 'Upload a file to Google Drive',
      workflow: {
        nodes: [
          {
            name: 'Google Drive',
            type: 'n8n-nodes-base.googleDrive',
            parameters: {
              operation: 'upload',
              fileName: 'document.pdf',
              fileContent: 'base64FileData'
            }
          }
        ]
      }
    }
  ]
};

export default googleDriveNode;
