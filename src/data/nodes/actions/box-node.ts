/**
 * # Box
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: File Storage & Cloud Services
 * 
 * ## Description
 * 
 * Use the Box node to automate work in Box, and integrate Box with other applications. n8n has built-in 
 * support for a wide range of Box features, including creating, copying, deleting, searching, uploading, 
 * and downloading files and folders. Box is a cloud content management and file sharing service for 
 * businesses, providing secure file storage, collaboration tools, and enterprise-grade security features.
 * 
 * ## Key Features
 * 
 * - **File Management**: Complete file lifecycle management with upload, download, copy, and delete operations
 * - **Folder Operations**: Create, manage, and organize folder structures with hierarchical access control
 * - **Search Functionality**: Advanced search capabilities across files and folders with metadata filtering
 * - **Sharing & Collaboration**: Secure file and folder sharing with customizable permissions and access levels
 * - **Version Control**: Track and manage file versions with rollback capabilities and change history
 * - **Metadata Management**: Rich metadata support for content classification and organization
 * - **Enterprise Security**: SOC 2, HIPAA, and FedRAMP compliance with advanced encryption and access controls
 * - **API Integration**: Full REST API access for custom workflows and enterprise integrations
 * - **Real-time Sync**: Automatic synchronization across devices and platforms
 * - **Content Preview**: In-browser preview for 120+ file types without downloading
 * - **Workflow Automation**: Built-in workflow tools for approval processes and content lifecycle management
 * - **Analytics & Reporting**: Detailed usage analytics and compliance reporting capabilities
 * 
 * ## Credentials
 * 
 * Refer to [Box credentials](../../credentials/box/) for guidance on setting up authentication.
 * Supports OAuth 2.0 authentication with enterprise-grade security features.
 * 
 * ## Operations
 * 
 * ### File Operations
 * - **Copy a File**: Create copies of files with optional rename and location change
 * - **Delete a File**: Permanently remove files or move to trash with recovery options
 * - **Download a File**: Retrieve file content with support for large files and streaming
 * - **Get a File**: Retrieve file metadata including permissions, versions, and collaboration info
 * - **Search Files**: Advanced search with filters for file type, date, size, and custom metadata
 * - **Share a File**: Create secure sharing links with expiration dates and access controls
 * - **Upload a File**: Upload new files with conflict resolution and automatic versioning
 * 
 * ### Folder Operations
 * - **Create a Folder**: Create new folders with custom metadata and permission inheritance
 * - **Get a Folder**: Retrieve folder information including contents and collaboration details
 * - **Delete a Folder**: Remove folders and all contents with optional recursive deletion
 * - **Search Files**: Search within specific folders with advanced filtering options
 * - **Share a Folder**: Enable folder sharing with granular permission controls
 * - **Update Folder**: Modify folder properties including name, description, and metadata
 * 
 * ## Common Integration Patterns
 * 
 * ### Document Management and Workflow Automation
 * - Contract lifecycle management with automated routing and approval workflows
 * - Legal document processing with version control and audit trail maintenance
 * - HR document management with employee onboarding and policy distribution
 * - Financial document processing with automated backup and compliance archiving
 * - Project documentation with collaborative editing and milestone tracking
 * - Quality assurance documentation with controlled access and change management
 * - Research data management with secure sharing and collaboration features
 * - Regulatory compliance documentation with automated retention and disposal
 * - Training material distribution with access tracking and completion monitoring
 * - Policy management with automated updates and acknowledgment tracking
 * 
 * ### Content Collaboration and Distribution
 * - Marketing asset management with brand guidelines and usage tracking
 * - Creative project collaboration with version control and feedback collection
 * - Sales enablement with automated content distribution and usage analytics
 * - Client portal management with secure document sharing and access controls
 * - Vendor management with contract storage and automated renewal notifications
 * - Product documentation with multilingual support and localization workflows
 * - Training content delivery with progress tracking and certification management
 * - Customer support documentation with searchable knowledge base integration
 * - Press kit distribution with embargo controls and download tracking
 * - Event management with document sharing and real-time collaboration
 * 
 * ### Business Process Integration
 * - ERP system integration with automated document sync and data validation
 * - CRM integration with client document management and relationship tracking
 * - Project management integration with milestone documentation and deliverable tracking
 * - Accounting system integration with invoice processing and financial document management
 * - Workflow automation with approval routing and notification systems
 * - Backup and disaster recovery with automated sync and redundancy management
 * - Data migration projects with content transformation and quality assurance
 * - Compliance monitoring with automated policy enforcement and audit trails
 * - Change management with documentation versioning and rollback capabilities
 * - Integration testing with test data management and result documentation
 * 
 * ### Enterprise Security and Compliance
 * - Data loss prevention with automated content scanning and policy enforcement
 * - Access control management with role-based permissions and regular audits
 * - Compliance reporting with automated documentation and audit trail generation
 * - Information governance with retention policies and automated disposal
 * - Security incident response with forensic data collection and preservation
 * - Privacy management with data classification and access tracking
 * - Regulatory compliance with automated monitoring and reporting capabilities
 * - Risk management with document control and change approval workflows
 * - Business continuity with disaster recovery and data redundancy planning
 * - Vendor risk assessment with document verification and compliance tracking
 * 
 * ## Example Use Cases
 * 
 * ### Automated Document Processing Pipeline
 * ```typescript
 * // Upload new contract for processing
 * const uploadedFile = await box.uploadFile({
 *   fileName: 'contract-2024-001.pdf',
 *   fileContent: contractBuffer,
 *   parentFolderId: 'contracts-pending-review',
 *   conflictResolution: 'autorename'
 * });
 * 
 * // Create folder structure for contract lifecycle
 * const contractFolder = await box.createFolder({
 *   name: `Contract-${uploadedFile.id}-${new Date().getFullYear()}`,
 *   parentId: 'contracts-active',
 *   description: 'Contract lifecycle management folder',
 *   metadata: {
 *     contractType: 'service-agreement',
 *     department: 'legal',
 *     priority: 'high',
 *     reviewDeadline: '2024-01-15'
 *   }
 * });
 * 
 * // Copy contract to appropriate workflow folder
 * const workingCopy = await box.copyFile({
 *   fileId: uploadedFile.id,
 *   parentId: contractFolder.id,
 *   name: 'contract-working-copy.pdf'
 * });
 * 
 * // Share with legal team for review
 * const shareLink = await box.shareFile({
 *   fileId: workingCopy.id,
 *   access: 'collaborators',
 *   permissions: {
 *     canDownload: true,
 *     canPreview: true,
 *     canEdit: false
 *   },
 *   expiresAt: '2024-02-01T00:00:00Z',
 *   password: 'secure-review-2024'
 * });
 * 
 * // Search for similar contracts for reference
 * const similarContracts = await box.searchFiles({
 *   query: 'service agreement template',
 *   fileExtensions: ['pdf', 'docx'],
 *   ancestorFolderIds: ['legal-templates'],
 *   createdAtRange: {
 *     from: '2023-01-01T00:00:00Z',
 *     to: '2024-01-01T00:00:00Z'
 *   },
 *   limit: 10
 * });
 * ```
 * 
 * ### Content Distribution and Marketing Asset Management
 * ```typescript
 * // Create campaign folder structure
 * const campaignFolder = await box.createFolder({
 *   name: 'Q1-2024-Product-Launch',
 *   parentId: 'marketing-campaigns',
 *   description: 'Complete asset library for Q1 product launch campaign',
 *   metadata: {
 *     campaign: 'product-launch-q1',
 *     brand: 'primary',
 *     status: 'active',
 *     launchDate: '2024-03-01'
 *   }
 * });
 * 
 * // Upload marketing assets with organized structure
 * const assetStructure = [
 *   { folder: 'images/product-shots', files: productImages },
 *   { folder: 'videos/promotional', files: promotionalVideos },
 *   { folder: 'documents/press-releases', files: pressReleases },
 *   { folder: 'templates/social-media', files: socialTemplates }
 * ];
 * 
 * for (const category of assetStructure) {
 *   // Create category subfolder
 *   const categoryFolder = await box.createFolder({
 *     name: category.folder.split('/').pop(),
 *     parentId: campaignFolder.id
 *   });
 * 
 *   // Upload files to category
 *   for (const file of category.files) {
 *     await box.uploadFile({
 *       fileName: file.name,
 *       fileContent: file.buffer,
 *       parentFolderId: categoryFolder.id,
 *       metadata: {
 *         assetType: category.folder.split('/')[0],
 *         approved: true,
 *         brandCompliant: true,
 *         lastReviewed: new Date().toISOString()
 *       }
 *     });
 *   }
 * }
 * 
 * // Share with regional marketing teams
 * const teamShares = await Promise.all([
 *   box.shareFolder({
 *     folderId: campaignFolder.id,
 *     access: 'company',
 *     permissions: {
 *       canDownload: true,
 *       canUpload: false,
 *       canInvite: false
 *     },
 *     allowedEmailDomains: ['company.com']
 *   })
 * ]);
 * 
 * // Search for brand-compliant assets
 * const brandAssets = await box.searchFiles({
 *   query: 'brand compliant approved',
 *   ancestorFolderIds: [campaignFolder.id],
 *   metadata: {
 *     brandCompliant: true,
 *     approved: true
 *   },
 *   fileExtensions: ['jpg', 'png', 'svg', 'pdf'],
 *   sort: 'modified_at',
 *   direction: 'DESC'
 * });
 * ```
 * 
 * ### Automated Backup and Compliance Management
 * ```typescript
 * // Search for files requiring compliance review
 * const complianceReview = await box.searchFiles({
 *   query: 'compliance review due',
 *   metadata: {
 *     reviewRequired: true,
 *     complianceStatus: 'pending'
 *   },
 *   modifiedAtRange: {
 *     from: '2024-01-01T00:00:00Z',
 *     to: new Date().toISOString()
 *   },
 *   limit: 100
 * });
 * 
 * // Process each file for compliance
 * for (const file of complianceReview.entries) {
 *   // Get detailed file information
 *   const fileDetails = await box.getFile({
 *     fileId: file.id,
 *     fields: ['name', 'description', 'metadata', 'created_at', 'modified_at', 'shared_link']
 *   });
 * 
 *   // Create backup copy in compliance archive
 *   const backupCopy = await box.copyFile({
 *     fileId: file.id,
 *     parentId: 'compliance-archive-2024',
 *     name: `${file.name}-backup-${new Date().toISOString().split('T')[0]}`
 *   });
 * 
 *   // Update metadata for compliance tracking
 *   await box.updateFile({
 *     fileId: file.id,
 *     metadata: {
 *       complianceStatus: 'reviewed',
 *       reviewDate: new Date().toISOString(),
 *       backupLocation: backupCopy.id,
 *       retentionDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 7 years
 *       complianceOfficer: 'compliance@company.com'
 *     }
 *   });
 * }
 * 
 * // Generate compliance report
 * const complianceReport = await box.searchFiles({
 *   query: 'compliance reviewed',
 *   metadata: {
 *     complianceStatus: 'reviewed'
 *   },
 *   createdAtRange: {
 *     from: '2024-01-01T00:00:00Z',
 *     to: new Date().toISOString()
 *   },
 *   fields: ['name', 'metadata.reviewDate', 'metadata.retentionDate', 'metadata.complianceOfficer'],
 *   limit: 1000
 * });
 * 
 * // Create and upload compliance summary
 * const summaryContent = generateComplianceReport(complianceReport);
 * await box.uploadFile({
 *   fileName: `compliance-summary-${new Date().toISOString().split('T')[0]}.pdf`,
 *   fileContent: summaryContent,
 *   parentFolderId: 'compliance-reports',
 *   metadata: {
 *     reportType: 'compliance-summary',
 *     generatedDate: new Date().toISOString(),
 *     filesReviewed: complianceReport.total_count,
 *     reportPeriod: '2024-Q1'
 *   }
 * });
 * ```
 * 
 * ### Client Portal and Secure Document Sharing
 * ```typescript
 * // Create client-specific folder structure
 * const clientFolder = await box.createFolder({
 *   name: `Client-${clientName}-${new Date().getFullYear()}`,
 *   parentId: 'client-portals',
 *   description: `Secure document portal for ${clientName}`,
 *   metadata: {
 *     clientId: clientId,
 *     industry: clientIndustry,
 *     accessLevel: 'confidential',
 *     createdDate: new Date().toISOString()
 *   }
 * });
 * 
 * // Create organized subfolders
 * const subfolders = ['contracts', 'deliverables', 'communications', 'invoices'];
 * const folderMap = {};
 * 
 * for (const subfolder of subfolders) {
 *   folderMap[subfolder] = await box.createFolder({
 *     name: subfolder.charAt(0).toUpperCase() + subfolder.slice(1),
 *     parentId: clientFolder.id,
 *     metadata: {
 *       category: subfolder,
 *       clientAccess: true
 *     }
 *   });
 * }
 * 
 * // Upload client documents with appropriate permissions
 * const clientDocuments = [
 *   { file: contractFile, folder: 'contracts', permissions: 'view-only' },
 *   { file: deliverableFile, folder: 'deliverables', permissions: 'download' },
 *   { file: invoiceFile, folder: 'invoices', permissions: 'view-only' }
 * ];
 * 
 * for (const doc of clientDocuments) {
 *   const uploadedFile = await box.uploadFile({
 *     fileName: doc.file.name,
 *     fileContent: doc.file.buffer,
 *     parentFolderId: folderMap[doc.folder].id,
 *     metadata: {
 *       clientVisible: true,
 *       accessLevel: doc.permissions,
 *       uploadDate: new Date().toISOString()
 *     }
 *   });
 * 
 *   // Create secure sharing link for client access
 *   if (doc.permissions === 'download') {
 *     await box.shareFile({
 *       fileId: uploadedFile.id,
 *       access: 'open',
 *       permissions: {
 *         canDownload: true,
 *         canPreview: true
 *       },
 *       expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
 *     });
 *   }
 * }
 * 
 * // Share main folder with client team
 * const clientAccess = await box.shareFolder({
 *   folderId: clientFolder.id,
 *   access: 'collaborators',
 *   permissions: {
 *     canDownload: true,
 *     canPreview: true,
 *     canUpload: false,
 *     canInvite: false
 *   },
 *   allowedEmailDomains: [clientEmailDomain],
 *   expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Create a New Folder in Box**: Basic folder creation and organization
 * - **Automated Video Translation & Distribution**: Multi-platform content distribution
 * - **Receive Updates for Events in Box**: Real-time notification and webhook integration
 * - **Document Approval Workflow**: Automated routing and approval processes
 * - **Client Document Portal**: Secure client access and collaboration
 * - **Marketing Asset Distribution**: Brand-compliant content management
 * - **Compliance Documentation System**: Automated compliance and audit trails
 * - **Project File Management**: Collaborative project documentation
 * - **Contract Lifecycle Management**: End-to-end contract processing
 * - **Training Content Delivery**: Learning management and progress tracking
 * 
 * ## Best Practices
 * 
 * ### File Organization and Management
 * - Implement consistent folder naming conventions with date and project identifiers
 * - Use metadata extensively for content classification and automated workflow triggers
 * - Establish clear folder hierarchies that reflect business processes and access needs
 * - Implement automated file lifecycle management with archival and deletion policies
 * - Use descriptive file names that include version numbers and creation dates
 * - Create template folder structures for recurring projects and processes
 * - Establish file naming standards that support search and discovery
 * - Implement regular cleanup processes to maintain organization and performance
 * - Use tags and metadata to create virtual organization systems beyond folder structures
 * - Establish clear ownership and responsibility for different content areas
 * 
 * ### Security and Access Control
 * - Implement principle of least privilege with granular permission settings
 * - Use time-limited sharing links with expiration dates for temporary access
 * - Regularly audit and review access permissions for compliance requirements
 * - Implement strong password policies for shared links and collaboration
 * - Use watermarking and download restrictions for sensitive content
 * - Enable two-factor authentication for all user accounts
 * - Monitor and log all access and sharing activities for security audits
 * - Implement data loss prevention policies with automated content scanning
 * - Use encryption for all data in transit and at rest
 * - Establish incident response procedures for security breaches
 * 
 * ### Performance and Scalability
 * - Optimize file sizes and formats for faster upload and download speeds
 * - Use batch operations for bulk file management to improve efficiency
 * - Implement caching strategies for frequently accessed content
 * - Monitor storage usage and implement archival policies for large files
 * - Use preview capabilities to reduce unnecessary downloads
 * - Implement retry logic and error handling for reliable file operations
 * - Optimize API calls with proper pagination and filtering
 * - Use asynchronous operations for large file transfers
 * - Monitor and optimize bandwidth usage for remote teams
 * - Implement load balancing for high-volume file operations
 * 
 * ### Integration and Automation
 * - Use webhooks for real-time event notifications and automated workflows
 * - Implement error handling and rollback procedures for failed operations
 * - Create automated backup and disaster recovery processes
 * - Use metadata and tags to trigger automated business processes
 * - Implement version control workflows with approval and rollback capabilities
 * - Create automated compliance and audit trail documentation
 * - Use API rate limiting to prevent service disruption
 * - Implement monitoring and alerting for system health and performance
 * - Create automated testing procedures for integration reliability
 * - Establish service level agreements and performance benchmarks
 */

export const boxNode = {
  displayName: 'Box',
  name: 'box',
  group: ['input'],
  version: 1,
  icon: 'file:box.svg',
  description: 'Access Box cloud storage for file and folder management operations',
  defaults: {
    name: 'Box',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'boxOAuth2Api',
      required: true,
    },
  ],
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'File',
          value: 'file',
          description: 'File operations',
        },
        {
          name: 'Folder',
          value: 'folder',
          description: 'Folder operations',
        },
      ],
      default: 'file',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['file'],
        },
      },
      options: [
        {
          name: 'Copy',
          value: 'copy',
          description: 'Copy a file',
          action: 'Copy a file',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a file',
          action: 'Delete a file',
        },
        {
          name: 'Download',
          value: 'download',
          description: 'Download a file',
          action: 'Download a file',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a file',
          action: 'Get a file',
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search files',
          action: 'Search files',
        },
        {
          name: 'Share',
          value: 'share',
          description: 'Share a file',
          action: 'Share a file',
        },
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload a file',
          action: 'Upload a file',
        },
      ],
      default: 'upload',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['folder'],
        },
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a folder',
          action: 'Create a folder',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a folder',
          action: 'Delete a folder',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a folder',
          action: 'Get a folder',
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search files',
          action: 'Search files in folder',
        },
        {
          name: 'Share',
          value: 'share',
          description: 'Share a folder',
          action: 'Share a folder',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update folder',
          action: 'Update folder',
        },
      ],
      default: 'create',
    },
  ],
};
