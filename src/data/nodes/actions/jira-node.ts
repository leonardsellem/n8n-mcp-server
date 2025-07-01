/**
 * # Jira Software
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Project Management & Productivity
 * 
 * ## Description
 * 
 * Use the Jira Software node to automate work in Jira, and integrate Jira with other applications. 
 * n8n has built-in support for a wide range of Jira features, including creating, updating, deleting, 
 * and getting issues, attachments, comments, and users.
 * 
 * ## Key Features
 * 
 * - **Issue Management**: Complete issue lifecycle management and tracking
 * - **Project Organization**: Multi-project support with advanced filtering
 * - **Attachment Handling**: File upload, download, and management for issues
 * - **Comment System**: Comprehensive commenting and collaboration features
 * - **User Management**: User creation, retrieval, and management capabilities
 * - **JQL Support**: Advanced querying with Jira Query Language
 * - **Transition Management**: Issue status and workflow transition handling
 * - **Email Notifications**: Automated email notification system
 * - **Custom Fields**: Support for custom field types and configurations
 * - **Workflow Integration**: Integration with Jira workflows and business rules
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Bulk Operations**: Efficient processing of multiple issues and operations
 * 
 * ## Credentials
 * 
 * Refer to [Jira credentials](../../credentials/jira/) for guidance on setting up authentication.
 * Supports both cloud and server instances with various authentication methods.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Issue Operations
 * - **Create Issue**: Create new issues in projects
 *   - Set issue type, priority, and severity levels
 *   - Assign to users and teams
 *   - Set due dates and time tracking
 *   - Configure custom fields and labels
 *   - Link to other issues and dependencies
 *   - Add initial descriptions and acceptance criteria
 * - **Get Issue**: Retrieve specific issue details
 *   - Access complete issue information and metadata
 *   - View issue history and change logs
 *   - Check current status and workflow position
 *   - Review attached files and linked issues
 *   - Access custom field values and configurations
 * - **Get All Issues**: Search and list multiple issues
 *   - Advanced search with JQL (Jira Query Language)
 *   - Filter by projects, assignees, and status
 *   - Sort by priority, creation date, or custom fields
 *   - Pagination for large result sets
 *   - Export issue lists and reports
 * - **Update Issue**: Modify existing issues
 *   - Change issue details and descriptions
 *   - Update assignees and priority levels
 *   - Modify due dates and time estimates
 *   - Update custom field values
 *   - Add or remove labels and components
 * - **Delete Issue**: Remove issues permanently
 *   - Clean up obsolete or duplicate issues
 *   - Handle issue dependencies and links
 *   - Manage bulk deletion operations
 * - **Get Issue Changelog**: Track issue history
 *   - View complete change history
 *   - Monitor field modifications over time
 *   - Track user actions and timestamps
 *   - Analyze issue evolution patterns
 * - **Create Email Notification**: Send issue notifications
 *   - Generate automated email alerts
 *   - Notify stakeholders of issue changes
 *   - Queue email notifications for batch sending
 *   - Customize notification content and recipients
 * - **Get Transitions**: Manage issue workflow
 *   - Retrieve available workflow transitions
 *   - Check transition permissions and conditions
 *   - Identify next possible issue states
 *   - Automate workflow progression
 * 
 * ### Issue Attachment Operations
 * - **Add Attachment**: Upload files to issues
 *   - Attach documents, images, and media files
 *   - Support for multiple file formats and sizes
 *   - Organize attachments with descriptions
 *   - Version control for updated attachments
 * - **Get Attachment**: Retrieve specific attachment details
 *   - Access attachment metadata and properties
 *   - Download attachment content and files
 *   - Check attachment permissions and access rights
 * - **Get All Attachments**: List issue attachments
 *   - View all attachments for an issue
 *   - Filter attachments by type or date
 *   - Export attachment lists and information
 * - **Remove Attachment**: Delete attachment files
 *   - Clean up obsolete or incorrect attachments
 *   - Manage attachment storage and organization
 *   - Handle bulk attachment removal
 * 
 * ### Issue Comment Operations
 * - **Add Comment**: Create new issue comments
 *   - Add detailed comments and notes
 *   - Mention users and teams in comments
 *   - Format comments with rich text and markup
 *   - Set comment visibility and restrictions
 * - **Get Comment**: Retrieve specific comment details
 *   - Access comment content and metadata
 *   - View comment author and timestamp information
 *   - Check comment visibility and permissions
 * - **Get All Comments**: List issue comments
 *   - View complete comment history
 *   - Filter comments by author or date
 *   - Export comment threads and discussions
 * - **Update Comment**: Modify existing comments
 *   - Edit comment content and formatting
 *   - Update comment visibility settings
 *   - Add or modify user mentions
 * - **Remove Comment**: Delete comments
 *   - Clean up obsolete or inappropriate comments
 *   - Manage comment moderation and cleanup
 * 
 * ### User Operations
 * - **Create User**: Add new users to Jira
 *   - Set user profiles and contact information
 *   - Configure user permissions and groups
 *   - Assign default projects and roles
 * - **Retrieve User**: Get user account details
 *   - Access user profile information
 *   - View user permissions and group memberships
 *   - Check user activity and login status
 * - **Delete User**: Remove user accounts
 *   - Deactivate or permanently delete users
 *   - Handle user data and issue reassignment
 *   - Manage user cleanup and offboarding
 * 
 * ## Advanced Query Features
 * 
 * ### Jira Query Language (JQL)
 * JQL is a powerful query language for searching and filtering issues:
 * 
 * #### Basic JQL Examples
 * - **Project Filter**: `project = "PROJECT_KEY"`
 * - **Assignee Filter**: `assignee = currentUser()`
 * - **Status Filter**: `status = "In Progress"`
 * - **Priority Filter**: `priority = High`
 * - **Date Ranges**: `created >= -7d`
 * - **Text Search**: `summary ~ "bug"`
 * 
 * #### Advanced JQL Features
 * - **Multiple Conditions**: `project = "KEY" AND status = "Open"`
 * - **OR Logic**: `priority = High OR priority = Critical`
 * - **Negation**: `assignee != currentUser()`
 * - **Functions**: `duedate < now()`
 * - **Ordering**: `ORDER BY priority DESC, created ASC`
 * 
 * ### Custom Field Support
 * - **Field Types**: Support for all Jira custom field types
 * - **Field Querying**: Query and filter by custom field values
 * - **Field Updates**: Modify custom field values in bulk
 * - **Field Validation**: Ensure custom field data integrity
 * 
 * ## Workflow Integration
 * 
 * ### Status Transitions
 * - **Workflow States**: Navigate through issue workflow states
 * - **Transition Conditions**: Check and validate transition requirements
 * - **Automated Transitions**: Trigger automatic status changes
 * - **Bulk Transitions**: Apply transitions to multiple issues
 * 
 * ### Business Rules
 * - **Validation Rules**: Enforce business rules and constraints
 * - **Required Fields**: Ensure required information is provided
 * - **Field Dependencies**: Handle interdependent field relationships
 * - **Approval Workflows**: Implement approval and review processes
 * 
 * ## Project Management Features
 * 
 * ### Issue Types and Hierarchies
 * - **Epic Management**: Handle epics and story hierarchies
 * - **Issue Linking**: Create relationships between issues
 * - **Subtask Management**: Organize work with subtasks
 * - **Component Tracking**: Manage project components and modules
 * 
 * ### Time Tracking and Reporting
 * - **Time Logging**: Track time spent on issues
 * - **Estimation**: Manage story points and time estimates
 * - **Progress Tracking**: Monitor issue completion and velocity
 * - **Reporting Data**: Generate data for project reports
 * 
 * ### Agile and Scrum Integration
 * - **Sprint Management**: Support for sprint planning and execution
 * - **Backlog Organization**: Manage product and sprint backlogs
 * - **Velocity Tracking**: Monitor team performance metrics
 * - **Release Planning**: Coordinate release cycles and versions
 * 
 * ## Related Resources
 * 
 * Refer to the [official JQL documentation](https://www.atlassian.com/software/jira/guides/expand-jira/jql) 
 * about Jira Query Language (JQL) to learn more about advanced querying.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Jira REST API directly with your Jira credentials.
 * 
 * ## Use Cases
 * 
 * - **Bug Tracking**: Automate bug report creation and management
 * - **Feature Development**: Coordinate feature requests and development
 * - **Sprint Planning**: Automate sprint setup and issue assignment
 * - **Release Management**: Coordinate release planning and deployment
 * - **Customer Support**: Convert support tickets to development issues
 * - **Quality Assurance**: Manage testing workflows and defect tracking
 * - **Project Reporting**: Generate automated project status reports
 * - **Team Coordination**: Facilitate team communication and updates
 * - **Requirement Management**: Track and manage project requirements
 * - **Risk Management**: Monitor and track project risks and issues
 * - **Change Management**: Handle change requests and approvals
 * - **Incident Management**: Coordinate incident response and resolution
 * - **Documentation Tracking**: Manage documentation tasks and updates
 * - **Compliance Monitoring**: Track compliance-related issues and tasks
 * - **Resource Planning**: Coordinate resource allocation and scheduling
 * - **Performance Monitoring**: Track team and project performance metrics
 * - **Integration Testing**: Manage integration and testing workflows
 * - **Deployment Coordination**: Automate deployment processes and tracking
 * - **Feedback Collection**: Gather and process user feedback and requests
 * - **Maintenance Planning**: Schedule and track maintenance activities
 * - **Security Tracking**: Monitor security-related issues and vulnerabilities
 * - **Training Coordination**: Manage training programs and skill development
 * - **Vendor Management**: Track vendor-related issues and deliverables
 * - **Budget Tracking**: Monitor project budgets and resource costs
 * - **Client Communication**: Coordinate client updates and deliverables
 * - **Escalation Management**: Handle issue escalation and priority management
 * - **Knowledge Base**: Build and maintain project knowledge repositories
 * - **Audit Preparation**: Prepare and track audit-related activities
 * - **Process Improvement**: Identify and track process improvement initiatives
 * - **Cross-team Collaboration**: Facilitate collaboration across multiple teams
 */

import { NodeTypeInfo } from '../../node-types.js';

export const jiraNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jira',
  displayName: 'Jira Software',
  description: 'Comprehensive project management and issue tracking with advanced workflow automation.',
  category: 'Action Nodes',
  subcategory: 'Project Management & Productivity',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'issue',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Issue',
          value: 'issue',
          description: 'Work with Jira issues'
        },
        {
          name: 'Issue Attachment',
          value: 'issueAttachment',
          description: 'Work with issue attachments'
        },
        {
          name: 'Issue Comment',
          value: 'issueComment',
          description: 'Work with issue comments'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Work with Jira users'
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
          resource: ['issue']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new issue'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an issue'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an issue'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all issues'
        },
        {
          name: 'Get Changelog',
          value: 'changelog',
          description: 'Get issue changelog'
        },
        {
          name: 'Get Transitions',
          value: 'transitions',
          description: 'Get issue transitions'
        },
        {
          name: 'Notify',
          value: 'notify',
          description: 'Create email notification for issue'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an issue'
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
      name: 'jiraApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Jira Software'
  },

  aliases: ['jira', 'atlassian', 'issue', 'project', 'bug', 'ticket'],
  
  examples: [
    {
      name: 'Create Issue',
      description: 'Create a new issue in Jira project',
      workflow: {
        nodes: [
          {
            name: 'Jira Software',
            type: 'n8n-nodes-base.jira',
            parameters: {
              resource: 'issue',
              operation: 'create',
              project: 'PROJECT_KEY',
              issueType: 'Bug',
              summary: 'Issue created via n8n',
              description: 'This issue was automatically created by n8n workflow.'
            }
          }
        ]
      }
    }
  ]
};

export default jiraNode;
