/**
 * # Zendesk
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Customer Service & Support
 * 
 * ## Description
 * 
 * Use the Zendesk node to automate work in Zendesk and integrate Zendesk with other applications. 
 * n8n has built-in support for a wide range of Zendesk features, including creating and deleting 
 * tickets, users, and organizations. This node can also be used as an AI tool to enhance agent capabilities.
 * 
 * ## Key Features
 * 
 * - **Ticket Management**: Full CRUD operations for support tickets
 * - **User Management**: Comprehensive user account administration
 * - **Organization Management**: Enterprise account and organization handling
 * - **Ticket Field Management**: Custom field configuration and retrieval
 * - **AI Tool Integration**: Enhanced AI agent capabilities for automation
 * - **Search and Filter**: Advanced search across tickets and users
 * - **Bulk Operations**: Process multiple tickets and users efficiently
 * - **Data Synchronization**: Sync with external systems and databases
 * - **Workflow Automation**: Automate repetitive support processes
 * - **Integration Hub**: Connect with CRM, communication, and productivity tools
 * - **Analytics and Reporting**: Extract data for business intelligence
 * - **SIEM Integration**: Security incident and event management workflows
 * - **Multi-Channel Support**: Handle tickets from various communication channels
 * - **SLA Management**: Automate service level agreement tracking
 * - **Escalation Workflows**: Automated ticket routing and escalation
 * 
 * ## Credentials
 * 
 * Refer to [Zendesk credentials](../../credentials/zendesk/) for guidance on setting up authentication.
 * Supports API token authentication and OAuth for secure access.
 * 
 * ## Operations
 * 
 * ### Ticket Operations
 * 
 * #### Create Ticket
 * - **Ticket Creation**: Create new support tickets with full metadata
 *   - Customer inquiries and support requests
 *   - Bug reports and technical issues
 *   - Feature requests and enhancements
 *   - Service requests and account changes
 *   - Incident reports and security issues
 *   - Billing and payment inquiries
 *   - Product feedback and suggestions
 *   - Training and documentation requests
 *   - Integration and API support
 *   - Compliance and legal inquiries
 *   - Emergency support tickets
 *   - Follow-up and callback requests
 * 
 * #### Update Ticket
 * - **Ticket Modification**: Update existing ticket information and status
 *   - Status changes and resolution updates
 *   - Priority adjustments and escalations
 *   - Assignment changes and reassignments
 *   - Tag additions and categorization
 *   - Custom field updates and metadata
 *   - Comment additions and internal notes
 *   - Attachment management and file updates
 *   - Due date adjustments and scheduling
 *   - Customer notification preferences
 *   - SLA modifications and extensions
 *   - Merge and split operations
 *   - Collaboration and team updates
 * 
 * #### Get Ticket
 * - **Individual Ticket Retrieval**: Fetch detailed ticket information
 *   - Ticket status and progress tracking
 *   - Complete conversation history
 *   - Attachment and file management
 *   - Custom field data extraction
 *   - Timeline and activity logging
 *   - Agent assignment and ownership
 *   - Customer satisfaction scores
 *   - SLA compliance monitoring
 *   - Related ticket connections
 *   - Escalation history and notes
 *   - Integration data and references
 *   - Performance metrics and analytics
 * 
 * #### Get All Tickets
 * - **Bulk Ticket Retrieval**: Fetch multiple tickets with filtering
 *   - Open ticket monitoring and dashboards
 *   - Overdue ticket identification and alerts
 *   - Agent workload distribution and balancing
 *   - Department and team reporting
 *   - Customer account ticket history
 *   - Priority and escalation queues
 *   - SLA compliance reporting and tracking
 *   - Performance analytics and KPIs
 *   - Trend analysis and forecasting
 *   - Quality assurance and auditing
 *   - Customer satisfaction reporting
 *   - Resource planning and allocation
 * 
 * #### Delete Ticket
 * - **Ticket Removal**: Remove tickets from the system
 *   - Spam and duplicate ticket cleanup
 *   - Test ticket removal and housekeeping
 *   - Data privacy compliance and GDPR
 *   - System maintenance and optimization
 *   - Archive management and storage
 *   - Quality control and content moderation
 *   - Security compliance and data protection
 *   - Performance optimization and efficiency
 *   - Workflow cleanup and maintenance
 *   - Database optimization and management
 *   - Audit trail management and compliance
 *   - System migration and data transfer
 * 
 * #### Recover Suspended Ticket
 * - **Ticket Recovery**: Restore suspended or held tickets
 *   - Spam filter false positive recovery
 *   - Accidental suspension reversals
 *   - System error corrections and fixes
 *   - Workflow automation error handling
 *   - Quality assurance corrections
 *   - Policy exception handling
 *   - Emergency ticket restoration
 *   - Data integrity maintenance
 *   - System reliability improvements
 *   - Customer service recovery
 *   - Business continuity operations
 *   - Compliance requirement handling
 * 
 * ### Ticket Field Operations
 * 
 * #### Get Ticket Field
 * - **Field Information**: Retrieve specific ticket field configuration
 *   - Custom field validation and rules
 *   - Form builder configuration and setup
 *   - Data structure documentation
 *   - Integration mapping and synchronization
 *   - Workflow automation field logic
 *   - Reporting and analytics field usage
 *   - User interface customization
 *   - Business rule configuration
 *   - Data quality and validation
 *   - System integration requirements
 *   - Migration and upgrade planning
 *   - Compliance and audit requirements
 * 
 * #### Get All Ticket Fields
 * - **Complete Field Schema**: Retrieve all system and custom fields
 *   - Form generation and dynamic interfaces
 *   - Data migration and transformation
 *   - Integration schema mapping
 *   - Reporting template generation
 *   - API documentation and development
 *   - Workflow automation configuration
 *   - Custom application development
 *   - Data validation and quality control
 *   - Business intelligence and analytics
 *   - System audit and compliance
 *   - Performance optimization and tuning
 *   - User training and documentation
 * 
 * ### User Operations
 * 
 * #### Create User
 * - **User Account Creation**: Create new user accounts with profiles
 *   - Customer onboarding and registration
 *   - Employee account provisioning
 *   - Partner and vendor access setup
 *   - Support agent user creation
 *   - Admin and manager account setup
 *   - Integration user accounts
 *   - Service account provisioning
 *   - Bulk user import and migration
 *   - Self-service registration workflows
 *   - Identity management integration
 *   - Role-based access control setup
 *   - Compliance and audit user tracking
 * 
 * #### Update User
 * - **User Profile Management**: Modify user information and settings
 *   - Profile updates and maintenance
 *   - Role and permission changes
 *   - Organization assignments and transfers
 *   - Contact information updates
 *   - Preference and setting modifications
 *   - Security and access control updates
 *   - Tag and metadata management
 *   - Custom field data updates
 *   - Integration data synchronization
 *   - Compliance and audit trail updates
 *   - Performance tracking and metrics
 *   - User lifecycle management
 * 
 * #### Get User / Get All Users
 * - **User Information Retrieval**: Fetch user profiles and data
 *   - Customer profile management and CRM sync
 *   - Agent performance tracking and analytics
 *   - Organization membership and hierarchy
 *   - Access control and security auditing
 *   - User activity monitoring and reporting
 *   - Integration data synchronization
 *   - Compliance and regulatory reporting
 *   - Directory services and identity management
 *   - Business intelligence and analytics
 *   - Resource planning and allocation
 *   - Training and certification tracking
 *   - Customer satisfaction and feedback
 * 
 * #### Search Users
 * - **Advanced User Search**: Find users with complex criteria
 *   - Customer lookup and identification
 *   - Duplicate user detection and cleanup
 *   - Targeted communication and campaigns
 *   - Access control and security reviews
 *   - Data quality and validation
 *   - Integration and synchronization
 *   - Compliance and audit requirements
 *   - Business intelligence and reporting
 *   - User experience optimization
 *   - System performance and efficiency
 *   - Migration and data transfer
 *   - Quality assurance and testing
 * 
 * #### Delete User
 * - **User Account Removal**: Remove user accounts from system
 *   - Account deactivation and offboarding
 *   - Data privacy compliance and GDPR
 *   - Security breach response and cleanup
 *   - System maintenance and optimization
 *   - Duplicate account cleanup and management
 *   - Compliance and regulatory requirements
 *   - Data retention and archival policies
 *   - Migration and system consolidation
 *   - Quality control and validation
 *   - Performance optimization and efficiency
 *   - Audit trail and compliance tracking
 *   - Business continuity and disaster recovery
 * 
 * #### Get User's Organizations
 * - **Organization Membership**: Retrieve user's organization associations
 *   - Multi-organization access management
 *   - Hierarchical support structure navigation
 *   - Cross-organization collaboration and sharing
 *   - Billing and subscription management
 *   - Resource allocation and planning
 *   - Compliance and governance oversight
 *   - Performance tracking and analytics
 *   - Integration and data synchronization
 *   - Business intelligence and reporting
 *   - User experience optimization
 *   - Security and access control
 *   - Workflow automation and routing
 * 
 * #### Get User Related Data
 * - **Comprehensive User Context**: Retrieve user's complete activity data
 *   - Customer interaction history and timeline
 *   - Support ticket patterns and trends
 *   - Performance metrics and KPIs
 *   - Satisfaction scores and feedback
 *   - Engagement and activity tracking
 *   - Business relationship management
 *   - Personalization and customization
 *   - Risk assessment and monitoring
 *   - Compliance and audit requirements
 *   - Integration and data enrichment
 *   - Predictive analytics and forecasting
 *   - Customer lifetime value analysis
 * 
 * ### Organization Operations
 * 
 * #### Create Organization
 * - **Organization Setup**: Create new organizational entities
 *   - Enterprise customer onboarding
 *   - Partner and vendor organization setup
 *   - Department and division creation
 *   - Subsidiary and branch office setup
 *   - Project and team organization
 *   - Compliance and regulatory entities
 *   - Integration and system organization
 *   - Multi-tenant configuration
 *   - Hierarchical structure creation
 *   - Business unit establishment
 *   - Geographic location organization
 *   - Service line organization
 * 
 * #### Update Organization
 * - **Organization Management**: Modify organization information
 *   - Contact information updates
 *   - Hierarchical structure changes
 *   - Settings and preference modifications
 *   - Custom field data updates
 *   - Tag and metadata management
 *   - Integration data synchronization
 *   - Compliance and audit updates
 *   - Performance tracking configuration
 *   - Access control and security settings
 *   - Billing and subscription management
 *   - Resource allocation adjustments
 *   - Quality assurance and validation
 * 
 * #### Get Organization / Get All Organizations
 * - **Organization Information**: Retrieve organizational data
 *   - Customer account management and CRM sync
 *   - Enterprise relationship mapping
 *   - Hierarchical reporting and analytics
 *   - Resource planning and allocation
 *   - Compliance and governance oversight
 *   - Performance tracking and KPIs
 *   - Integration and data synchronization
 *   - Business intelligence and reporting
 *   - Customer success and satisfaction
 *   - Risk assessment and monitoring
 *   - Strategic planning and forecasting
 *   - Market analysis and segmentation
 * 
 * #### Count Organizations
 * - **Organization Metrics**: Get organizational statistics
 *   - Business growth tracking and analysis
 *   - Market penetration and expansion
 *   - Resource planning and capacity management
 *   - Performance benchmarking and comparison
 *   - Compliance and regulatory reporting
 *   - Financial planning and budgeting
 *   - Strategic planning and decision making
 *   - Risk assessment and management
 *   - Quality assurance and validation
 *   - Business intelligence and analytics
 *   - Customer segmentation and analysis
 *   - Competitive analysis and positioning
 * 
 * #### Delete Organization
 * - **Organization Removal**: Remove organizational entities
 *   - Account closure and deactivation
 *   - Data privacy compliance and GDPR
 *   - System consolidation and migration
 *   - Compliance and regulatory requirements
 *   - Business restructuring and reorganization
 *   - Performance optimization and efficiency
 *   - Quality control and validation
 *   - Audit trail and compliance tracking
 *   - Risk management and mitigation
 *   - Cost optimization and reduction
 *   - Strategic realignment and focus
 *   - Business continuity and disaster recovery
 * 
 * #### Get Organization Related Data
 * - **Comprehensive Organization Context**: Retrieve complete organizational data
 *   - Customer relationship management and CRM
 *   - Enterprise performance analytics
 *   - Resource utilization and optimization
 *   - Customer satisfaction and success metrics
 *   - Compliance and governance reporting
 *   - Risk assessment and monitoring
 *   - Strategic planning and forecasting
 *   - Business intelligence and insights
 *   - Market analysis and positioning
 *   - Competitive advantage and differentiation
 *   - Customer lifetime value analysis
 *   - Growth opportunity identification
 * 
 * ## Use Cases
 * 
 * - **Customer Support Automation**: Automated ticket routing and response
 * - **Help Desk Management**: Centralized IT support and service desk
 * - **Customer Success Operations**: Proactive customer engagement and retention
 * - **Sales Support**: Pre-sales and post-sales customer assistance
 * - **Technical Support**: Product and service technical assistance
 * - **Internal IT Support**: Employee technology support and service
 * - **Compliance Management**: Regulatory and policy compliance tracking
 * - **Security Incident Response**: Security event management and resolution
 * - **Quality Assurance**: Customer service quality monitoring and improvement
 * - **Business Process Automation**: Workflow automation and optimization
 * - **Customer Experience Management**: End-to-end customer journey optimization
 * - **Knowledge Management**: Information sharing and self-service support
 * - **Analytics and Reporting**: Performance metrics and business intelligence
 * - **Integration and Synchronization**: Multi-system data consistency
 * - **Escalation Management**: Automated issue escalation and resolution
 * 
 * ## Integration Patterns
 * 
 * ### CRM Integration
 * - **Customer Data Sync**: Bidirectional customer information synchronization
 * - **Sales Support**: Convert support interactions to sales opportunities
 * - **Customer Journey**: Track complete customer lifecycle and touchpoints
 * - **Account Management**: Unified customer account and relationship management
 * 
 * ### Communication Integration
 * - **Multi-Channel Support**: Email, chat, phone, and social media integration
 * - **Team Collaboration**: Slack, Microsoft Teams, and communication platforms
 * - **Notification Systems**: Real-time alerts and status updates
 * - **Customer Communication**: Automated responses and status notifications
 * 
 * ### Business Intelligence Integration
 * - **Analytics Platforms**: Data warehouse and business intelligence tools
 * - **Reporting Systems**: Automated report generation and distribution
 * - **Performance Dashboards**: Real-time metrics and KPI visualization
 * - **Predictive Analytics**: Forecasting and trend analysis
 * 
 * ### Security and Compliance Integration
 * - **SIEM Platforms**: Security incident and event management
 * - **Audit Systems**: Compliance tracking and regulatory reporting
 * - **Identity Management**: User authentication and authorization
 * - **Data Protection**: Privacy compliance and data security
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance agent capabilities:
 * - **Intelligent Ticket Routing**: AI-powered ticket categorization and assignment
 * - **Automated Response Generation**: AI-generated responses and suggestions
 * - **Sentiment Analysis**: Customer emotion and satisfaction detection
 * - **Predictive Support**: Proactive issue identification and resolution
 * - **Knowledge Base Integration**: AI-powered knowledge retrieval and suggestions
 * - **Language Translation**: Multi-language customer support automation
 * - **Performance Optimization**: AI-driven process improvement recommendations
 */

import { NodeTypeInfo } from '../../node-types.js';

export const zendeskNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zendesk',
  displayName: 'Zendesk',
  description: 'Integrate with Zendesk customer service platform. Manage tickets, users, and organizations.',
  category: 'Action Nodes',
  subcategory: 'Customer Service & Support',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'ticket',
      description: 'The resource to operate on',
      options: [
        {
          name: 'Ticket',
          value: 'ticket',
          description: 'Operations on support tickets'
        },
        {
          name: 'Ticket Field',
          value: 'ticketField',
          description: 'Operations on ticket fields'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Operations on users'
        },
        {
          name: 'Organization',
          value: 'organization',
          description: 'Operations on organizations'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['ticket']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a ticket'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a ticket'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a ticket'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all tickets'
        },
        {
          name: 'Recover',
          value: 'recover',
          description: 'Recover a suspended ticket'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a ticket'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['ticketField']
        }
      },
      options: [
        {
          name: 'Get',
          value: 'get',
          description: 'Get a ticket field'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all system and custom ticket fields'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['user']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a user'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a user'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a user'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all users'
        },
        {
          name: 'Get Organizations',
          value: 'getOrganizations',
          description: "Get a user's organizations"
        },
        {
          name: 'Get Related Data',
          value: 'getRelatedData',
          description: 'Get data related to the user'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search users'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a user'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['organization']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create an organization'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an organization'
        },
        {
          name: 'Count',
          value: 'count',
          description: 'Count organizations'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an organization'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all organizations'
        },
        {
          name: 'Get Related Data',
          value: 'getRelatedData',
          description: 'Get data related to the organization'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an organization'
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
      name: 'zendeskApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Zendesk'
  },

  aliases: ['zendesk', 'customer service', 'support tickets', 'help desk', 'customer support'],
  
  examples: [
    {
      name: 'Create Support Ticket',
      description: 'Create a new support ticket with customer details',
      workflow: {
        nodes: [
          {
            name: 'Zendesk',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              resource: 'ticket',
              operation: 'create',
              subject: 'Customer Support Request',
              description: 'Customer needs help with their account',
              requesterEmail: 'customer@example.com',
              priority: 'normal',
              type: 'question'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Open Tickets',
      description: 'Retrieve all open support tickets for monitoring',
      workflow: {
        nodes: [
          {
            name: 'Zendesk',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              resource: 'ticket',
              operation: 'getAll',
              status: 'open',
              returnAll: false,
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Search Users by Email',
      description: 'Find users by email address for customer lookup',
      workflow: {
        nodes: [
          {
            name: 'Zendesk',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              resource: 'user',
              operation: 'search',
              query: 'email:customer@example.com'
            }
          }
        ]
      }
    }
  ]
};

export default zendeskNode;
