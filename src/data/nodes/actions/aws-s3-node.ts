/**
 * # AWS S3 (Simple Storage Service)
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Cloud Services
 * 
 * ## Description
 * 
 * Use the AWS S3 node to automate work in AWS S3, and integrate AWS S3 with other applications. n8n has built-in 
 * support for a wide range of AWS S3 features, including creating and deleting buckets, copying and downloading files, 
 * as well as getting folders.
 * 
 * ## Key Features
 * 
 * - **Scalable Cloud Storage**: Virtually unlimited storage capacity with 99.999999999% durability
 * - **Bucket Management**: Complete lifecycle management for S3 buckets
 * - **File Operations**: Upload, download, copy, move, and delete files with metadata
 * - **Folder Management**: Organize files with hierarchical folder structures
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Security Features**: IAM integration, encryption, and access control
 * - **Performance Optimization**: Multi-part uploads, parallel processing, and caching
 * - **Versioning Support**: File versioning and lifecycle management
 * - **Event Notifications**: S3 event triggers for automated workflows
 * - **Cost Optimization**: Storage class management and intelligent tiering
 * - **Global Distribution**: Multi-region replication and CDN integration
 * - **Compliance**: HIPAA, GDPR, and enterprise compliance features
 * - **Integration Ecosystem**: Seamless integration with other AWS services
 * 
 * ## Credentials
 * 
 * Refer to [AWS credentials](../../credentials/aws/) for guidance on setting up authentication.
 * Supports IAM roles, access keys, and temporary credentials for secure access.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Bucket Operations
 * 
 * #### Create Bucket
 * - **Bucket Creation**: Create new S3 buckets with custom configurations
 *   - Region-specific bucket creation
 *   - Bucket naming validation and uniqueness checks
 *   - Default encryption configuration
 *   - Versioning and lifecycle policy setup
 *   - Access control and permissions configuration
 *   - Cost optimization and storage class settings
 *   - Compliance and regulatory requirements
 *   - Multi-region replication setup
 *   - Event notification configuration
 *   - Performance optimization settings
 *   - Monitoring and logging integration
 *   - Backup and disaster recovery planning
 * 
 * #### Delete Bucket
 * - **Bucket Removal**: Safely delete S3 buckets and contents
 *   - Pre-deletion validation and safety checks
 *   - Force delete with content removal
 *   - Backup verification before deletion
 *   - Access permission validation
 *   - Cost impact analysis and reporting
 *   - Compliance and audit trail maintenance
 *   - Error handling and recovery options
 *   - Batch deletion for multiple buckets
 *   - Dependency checking for linked resources
 *   - Notification and alerting on deletion
 *   - Recovery options for accidental deletions
 *   - Performance optimization for large deletions
 * 
 * #### Get All Buckets
 * - **Bucket Listing**: Retrieve list of all accessible S3 buckets
 *   - Account-wide bucket enumeration
 *   - Region-specific filtering and grouping
 *   - Bucket metadata and properties retrieval
 *   - Permission and access level analysis
 *   - Cost and usage statistics
 *   - Performance metrics and monitoring
 *   - Compliance status and security analysis
 *   - Lifecycle policy and versioning status
 *   - Replication and backup configuration
 *   - Event notification and trigger status
 *   - Integration with other AWS services
 *   - Custom sorting and filtering options
 * 
 * #### Search Within Bucket
 * - **Content Discovery**: Search and filter objects within buckets
 *   - Advanced pattern matching and filtering
 *   - Metadata-based search capabilities
 *   - Date range and size-based filtering
 *   - Tag-based organization and discovery
 *   - Performance-optimized search algorithms
 *   - Large dataset handling and pagination
 *   - Custom search criteria and operators
 *   - Real-time index updates and caching
 *   - Integration with Amazon Elasticsearch
 *   - Machine learning-powered content analysis
 *   - Compliance and security filtering
 *   - Cost-optimized search strategies
 * 
 * ### File Operations
 * 
 * #### Upload File
 * - **File Upload**: Upload files to S3 with advanced features
 *   - Multi-part upload for large files
 *   - Resume and retry capabilities
 *   - Compression and optimization
 *   - Metadata and tag assignment
 *   - Storage class optimization
 *   - Encryption and security features
 *   - Progress tracking and monitoring
 *   - Batch upload for multiple files
 *   - Error handling and validation
 *   - Performance optimization and parallelization
 *   - Cost monitoring and optimization
 *   - Integration with CDN and caching
 * 
 * #### Download File
 * - **File Retrieval**: Download files from S3 with optimization
 *   - Streaming downloads for large files
 *   - Resume and retry capabilities
 *   - Range-based partial downloads
 *   - Compression and decompression
 *   - Integrity verification and validation
 *   - Performance optimization and caching
 *   - Batch download operations
 *   - Error handling and recovery
 *   - Access control and security validation
 *   - Cost optimization strategies
 *   - Integration with processing pipelines
 *   - Monitoring and progress tracking
 * 
 * #### Copy File
 * - **File Duplication**: Copy files within and between buckets
 *   - Cross-region copying and replication
 *   - Metadata preservation and modification
 *   - Storage class conversion during copy
 *   - Encryption and security handling
 *   - Performance optimization for large files
 *   - Batch copy operations
 *   - Error handling and validation
 *   - Cost optimization strategies
 *   - Compliance and audit trail maintenance
 *   - Integration with lifecycle policies
 *   - Monitoring and progress tracking
 *   - Version control and conflict resolution
 * 
 * #### Delete File
 * - **File Removal**: Delete files from S3 with safety features
 *   - Soft delete and versioning support
 *   - Batch deletion for multiple files
 *   - Safety checks and validation
 *   - Backup verification before deletion
 *   - Cost impact analysis
 *   - Compliance and audit requirements
 *   - Error handling and recovery
 *   - Performance optimization for large deletions
 *   - Integration with lifecycle policies
 *   - Monitoring and alerting
 *   - Recovery options for accidental deletions
 *   - Access control validation
 * 
 * #### Get All Files
 * - **File Listing**: Retrieve comprehensive file listings
 *   - Hierarchical folder structure navigation
 *   - Metadata and properties retrieval
 *   - Filtering and sorting capabilities
 *   - Pagination for large datasets
 *   - Performance optimization
 *   - Cost-efficient listing strategies
 *   - Real-time updates and synchronization
 *   - Integration with search and indexing
 *   - Custom attributes and tagging
 *   - Security and access control validation
 *   - Monitoring and analytics integration
 *   - Export and reporting capabilities
 * 
 * ### Folder Operations
 * 
 * #### Create Folder
 * - **Folder Organization**: Create logical folder structures
 *   - Hierarchical organization and nesting
 *   - Naming validation and conventions
 *   - Metadata and tagging assignment
 *   - Permission and access control setup
 *   - Integration with lifecycle policies
 *   - Performance optimization
 *   - Batch folder creation
 *   - Error handling and validation
 *   - Compliance and security requirements
 *   - Monitoring and audit capabilities
 *   - Integration with automation workflows
 *   - Cost optimization strategies
 * 
 * #### Delete Folder
 * - **Folder Removal**: Delete folders and their contents
 *   - Recursive deletion with safety checks
 *   - Content validation before deletion
 *   - Backup and recovery options
 *   - Performance optimization for large folders
 *   - Error handling and rollback capabilities
 *   - Compliance and audit trail maintenance
 *   - Cost impact analysis
 *   - Integration with lifecycle policies
 *   - Monitoring and alerting
 *   - Access control validation
 *   - Batch processing capabilities
 *   - Recovery mechanisms for accidental deletions
 * 
 * #### Get All Folders
 * - **Folder Discovery**: List and analyze folder structures
 *   - Hierarchical structure visualization
 *   - Metadata and properties analysis
 *   - Size and usage statistics
 *   - Performance metrics and optimization
 *   - Security and access analysis
 *   - Cost breakdown and optimization
 *   - Integration with monitoring tools
 *   - Custom filtering and sorting
 *   - Export and reporting capabilities
 *   - Real-time synchronization
 *   - Compliance and audit reporting
 *   - Automation and workflow integration
 * 
 * ## Advanced Features
 * 
 * ### Storage Management
 * - **Intelligent Tiering**: Automatic cost optimization based on access patterns
 * - **Lifecycle Policies**: Automated transitions between storage classes
 * - **Versioning**: Maintain multiple versions of objects with rollback capabilities
 * - **Cross-Region Replication**: Automatic replication for disaster recovery
 * 
 * ### Security and Compliance
 * - **Encryption**: Server-side and client-side encryption options
 * - **Access Control**: Fine-grained IAM policies and bucket policies
 * - **Audit Logging**: Complete audit trails with AWS CloudTrail integration
 * - **Compliance**: HIPAA, GDPR, SOC, and other regulatory compliance
 * 
 * ### Performance Optimization
 * - **Transfer Acceleration**: Global edge locations for faster uploads
 * - **Multi-part Uploads**: Parallel uploads for large files
 * - **Request Optimization**: Intelligent request routing and caching
 * - **Bandwidth Management**: Throttling and QoS controls
 * 
 * ### Integration Ecosystem
 * - **AWS Services**: Native integration with Lambda, CloudFront, RDS, and more
 * - **Third-party Tools**: Support for popular backup, monitoring, and analytics tools
 * - **APIs and SDKs**: Comprehensive programmatic access
 * - **Event Notifications**: Trigger workflows on object changes
 * 
 * ## Integration Patterns
 * 
 * ### Data Pipeline
 * - **ETL Operations**: Extract, transform, and load data workflows
 * - **Data Lakes**: Central repository for structured and unstructured data
 * - **Analytics Processing**: Integration with analytics and machine learning services
 * - **Real-time Streaming**: Process data as it arrives in S3
 * 
 * ### Backup and Archival
 * - **Automated Backups**: Scheduled backup workflows
 * - **Long-term Archival**: Cost-effective storage for compliance and retention
 * - **Disaster Recovery**: Multi-region backup and recovery strategies
 * - **Point-in-time Recovery**: Version-based recovery capabilities
 * 
 * ### Content Distribution
 * - **CDN Integration**: Global content delivery with CloudFront
 * - **Media Storage**: Video, audio, and image asset management
 * - **Static Website Hosting**: Host static websites directly from S3
 * - **API Asset Storage**: Store and serve API assets and downloads
 * 
 * ### Application Integration
 * - **File Processing**: Automated file processing workflows
 * - **User-generated Content**: Handle uploads and user files
 * - **Document Management**: Enterprise document storage and retrieval
 * - **Configuration Management**: Store application configurations and settings
 * 
 * ## Use Cases
 * 
 * - **Data Backup and Recovery**: Automated backup solutions with multiple recovery points
 * - **Data Archiving**: Long-term storage for compliance and regulatory requirements
 * - **Content Distribution**: Global content delivery for websites and applications
 * - **Data Analytics**: Storage layer for big data analytics and machine learning
 * - **Website Hosting**: Static website hosting with global distribution
 * - **Mobile Applications**: Backend storage for mobile app assets and user data
 * - **IoT Data Storage**: Scalable storage for IoT device data and telemetry
 * - **Media and Entertainment**: Storage for video, audio, and digital assets
 * - **Enterprise File Sharing**: Secure file sharing and collaboration platform
 * - **Software Distribution**: Host software downloads and updates
 * - **Log Management**: Centralized log storage and analysis
 * - **Machine Learning**: Training data storage and model artifacts
 * - **Scientific Computing**: Research data storage and collaboration
 * - **Financial Services**: Secure document storage and transaction records
 * - **Healthcare**: Medical imaging and patient record storage
 * - **E-commerce**: Product catalogs, images, and customer data
 * - **Education**: Course materials, videos, and student submissions
 * - **Government**: Public data repositories and citizen services
 * - **Gaming**: Game assets, player data, and leaderboards
 * - **Real Estate**: Property images, documents, and virtual tours
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awsS3Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.awsS3',
  displayName: 'AWS S3',
  description: 'Interact with AWS S3 for scalable cloud storage, file management, and data operations.',
  category: 'Action Nodes',
  subcategory: 'Cloud Services',
  
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
          name: 'Bucket',
          value: 'bucket',
          description: 'Operations on S3 buckets'
        },
        {
          name: 'File',
          value: 'file',
          description: 'Operations on S3 files/objects'
        },
        {
          name: 'Folder',
          value: 'folder',
          description: 'Operations on S3 folders'
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
          resource: ['bucket']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a bucket'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a bucket'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all buckets'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search within a bucket'
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
          name: 'Get All',
          value: 'getAll',
          description: 'Get all files'
        },
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload a file'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Operation to perform',
      displayOptions: {
        show: {
          resource: ['folder']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a folder'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a folder'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all folders'
        }
      ]
    },
    {
      name: 'bucketName',
      displayName: 'Bucket Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the S3 bucket'
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
      name: 'aws',
      required: true
    }
  ],

  version: [1, 2, 3],
  defaults: {
    name: 'AWS S3'
  },

  aliases: ['s3', 'amazon s3', 'cloud storage', 'file storage'],
  
  examples: [
    {
      name: 'Upload File to S3',
      description: 'Upload a file to an S3 bucket',
      workflow: {
        nodes: [
          {
            name: 'AWS S3',
            type: 'n8n-nodes-base.awsS3',
            parameters: {
              resource: 'file',
              operation: 'upload',
              bucketName: 'my-bucket',
              fileName: 'document.pdf'
            }
          }
        ]
      }
    },
    {
      name: 'Download File from S3',
      description: 'Download a file from an S3 bucket',
      workflow: {
        nodes: [
          {
            name: 'AWS S3',
            type: 'n8n-nodes-base.awsS3',
            parameters: {
              resource: 'file',
              operation: 'download',
              bucketName: 'my-bucket',
              fileName: 'document.pdf'
            }
          }
        ]
      }
    },
    {
      name: 'List All Files',
      description: 'Get all files in an S3 bucket',
      workflow: {
        nodes: [
          {
            name: 'AWS S3',
            type: 'n8n-nodes-base.awsS3',
            parameters: {
              resource: 'file',
              operation: 'getAll',
              bucketName: 'my-bucket'
            }
          }
        ]
      }
    }
  ]
};

export default awsS3Node;
