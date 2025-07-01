/**
 * # Microsoft Teams
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Email & Communication
 * 
 * ## Description
 * 
 * Use the Microsoft Teams node to automate work in Microsoft Teams, and integrate Microsoft Teams 
 * with other applications. n8n has built-in support for a wide range of Microsoft Teams features, 
 * including creating and deleting channels, messages, and tasks.
 * 
 * ## Key Features
 * 
 * - **Channel Management**: Complete channel lifecycle management and organization
 * - **Message Automation**: Send and manage messages in channels and chats
 * - **Task Integration**: Create and manage tasks within Teams
 * - **Interactive Workflows**: Send messages and wait for user responses
 * - **Approval Systems**: Built-in approval and disapproval workflow mechanisms
 * - **Custom Forms**: Interactive form creation for data collection
 * - **Real-time Collaboration**: Seamless integration with Microsoft 365 ecosystem
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Enterprise Security**: Support for enterprise-grade security and compliance
 * - **Multi-team Support**: Work across multiple teams and organizations
 * - **Rich Formatting**: Support for rich text, attachments, and media content
 * - **Notification Management**: Advanced notification and mention capabilities
 * 
 * ## Credentials
 * 
 * Refer to [Microsoft credentials](../../credentials/microsoft/) for guidance on setting up authentication.
 * Uses Microsoft OAuth2 for secure access to Teams and Microsoft 365 services.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Channel Operations
 * - **Create Channel**: Create new channels in Teams
 *   - Set channel name, description, and type
 *   - Configure channel privacy settings (public/private)
 *   - Assign channel owners and members
 *   - Set channel policies and moderation settings
 *   - Configure channel tabs and applications
 * - **Get Channel**: Retrieve specific channel information
 *   - Access channel properties and metadata
 *   - View channel membership and permissions
 *   - Check channel settings and configurations
 *   - Monitor channel activity and statistics
 * - **Get Many Channels**: List multiple channels
 *   - View all accessible channels in a team
 *   - Filter channels by type, privacy, or activity
 *   - Search channels by name or description
 *   - Export channel lists and information
 * - **Update Channel**: Modify existing channels
 *   - Change channel names and descriptions
 *   - Update channel settings and permissions
 *   - Modify member access and roles
 *   - Configure channel applications and tabs
 * - **Delete Channel**: Remove channels permanently
 *   - Archive or permanently delete channels
 *   - Handle channel content and member notifications
 *   - Manage channel cleanup and organization
 * 
 * ### Channel Message Operations
 * - **Create Message**: Send messages to channels
 *   - Post messages with rich formatting and content
 *   - Add attachments, images, and media files
 *   - Mention users and teams in messages
 *   - Set message importance and priority
 *   - Schedule message delivery
 * - **Get Many Messages**: Retrieve channel message history
 *   - Access complete message history for channels
 *   - Filter messages by date, author, or content
 *   - Search messages with keywords and criteria
 *   - Export message threads and conversations
 * 
 * ### Chat Message Operations
 * - **Create Message**: Send direct or group chat messages
 *   - Send messages to individual users or groups
 *   - Support for rich text formatting and attachments
 *   - Add emoji reactions and interactive elements
 *   - Create threaded conversations
 * - **Get Message**: Retrieve specific chat messages
 *   - Access individual message details and metadata
 *   - View message reactions and responses
 *   - Check message delivery and read status
 * - **Get Many Messages**: List chat message history
 *   - Access complete chat conversation history
 *   - Filter messages by participants or timeframe
 *   - Search chat content and attachments
 * - **Send and Wait for Response**: Advanced workflow feature
 *   - Send messages and pause workflow execution
 *   - Wait for user responses and approvals
 *   - Support for interactive forms and data collection
 *   - Configurable timeout and response handling
 * 
 * ### Task Operations
 * - **Create Task**: Create new tasks in Teams
 *   - Set task titles, descriptions, and details
 *   - Assign tasks to team members
 *   - Set due dates and priority levels
 *   - Configure task categories and labels
 *   - Add task attachments and references
 * - **Get Task**: Retrieve specific task details
 *   - Access complete task information and status
 *   - View task assignments and progress
 *   - Check task history and updates
 * - **Get Many Tasks**: List and search tasks
 *   - View all accessible tasks in a team
 *   - Filter tasks by assignee, status, or due date
 *   - Search tasks by title, description, or category
 *   - Export task lists and reports
 * - **Update Task**: Modify existing tasks
 *   - Change task details and descriptions
 *   - Update task assignments and ownership
 *   - Modify due dates and priority levels
 *   - Update task status and completion
 * - **Delete Task**: Remove tasks permanently
 *   - Archive or permanently delete tasks
 *   - Handle task dependencies and references
 *   - Notify task participants of changes
 * 
 * ## Advanced Workflow Features
 * 
 * ### Send and Wait for Response
 * This powerful feature allows workflows to pause execution and wait for user responses:
 * 
 * #### Response Types
 * - **Approval**: Simple approve/disapprove buttons with customizable labels
 * - **Free Text**: Text input form for collecting user responses
 * - **Custom Form**: Advanced form builder with multiple field types
 * 
 * #### Configuration Options
 * - **Limit Wait Time**: Set timeout intervals or specific deadlines
 * - **n8n Attribution**: Control visibility of n8n branding in messages
 * - **Custom Styling**: Customize form appearance and button labels
 * - **Response Handling**: Configure actions based on user responses
 * 
 * ### Approval Workflows
 * - **Button Customization**: Custom approve/disapprove button labels
 * - **Single or Dual Actions**: Choose approval-only or approve/disapprove options
 * - **Response Tracking**: Monitor approval status and user responses
 * - **Escalation Handling**: Configure timeout actions and escalation paths
 * 
 * ### Form Integration
 * - **Dynamic Forms**: Build custom forms with various field types
 * - **Field Validation**: Implement input validation and requirements
 * - **Response Processing**: Handle form submissions in workflow logic
 * - **Multi-step Forms**: Create complex multi-page form experiences
 * 
 * ## Enterprise Integration
 * 
 * ### Microsoft 365 Ecosystem
 * - **Outlook Integration**: Connect with Outlook for email and calendar sync
 * - **SharePoint Sync**: Integrate with SharePoint document libraries
 * - **Power Platform**: Connect with Power BI and Power Automate
 * - **Azure Services**: Leverage Azure cloud services and storage
 * 
 * ### Security and Compliance
 * - **Enterprise Security**: Support for enterprise security policies
 * - **Data Loss Prevention**: Integration with DLP policies
 * - **Compliance Features**: Support for regulatory compliance requirements
 * - **Audit Logging**: Comprehensive audit trails and logging
 * 
 * ## Team Collaboration Features
 * 
 * ### Channel Organization
 * - **Channel Types**: Support for standard, private, and shared channels
 * - **Channel Templates**: Use predefined channel structures
 * - **Channel Policies**: Implement governance and moderation policies
 * - **Cross-team Channels**: Enable collaboration across organizations
 * 
 * ### Message Management
 * - **Rich Content**: Support for rich text, images, and multimedia
 * - **Message Threading**: Organize conversations with reply threads
 * - **Reactions and Mentions**: Interactive engagement features
 * - **Message Pinning**: Highlight important messages and announcements
 * 
 * ### Task Coordination
 * - **Task Assignment**: Distribute work across team members
 * - **Progress Tracking**: Monitor task completion and deadlines
 * - **Task Dependencies**: Manage task relationships and workflows
 * - **Team Workloads**: Balance workload distribution
 * 
 * ## Integration Patterns
 * 
 * ### Notification Systems
 * - **Alert Automation**: Send automated alerts and notifications
 * - **Status Updates**: Provide real-time status information
 * - **Escalation Workflows**: Handle escalation and priority notifications
 * - **Custom Alerts**: Create personalized notification systems
 * 
 * ### Data Collection
 * - **Survey Distribution**: Distribute surveys and feedback forms
 * - **Information Gathering**: Collect data through interactive forms
 * - **Response Aggregation**: Compile and analyze user responses
 * - **Reporting Integration**: Connect responses to reporting systems
 * 
 * ### Process Automation
 * - **Workflow Triggers**: Trigger workflows from Teams interactions
 * - **Approval Processes**: Implement multi-stage approval workflows
 * - **Task Automation**: Automate task creation and management
 * - **Integration Workflows**: Connect Teams with external systems
 * 
 * ## Related Resources
 * 
 * Refer to [Microsoft Teams' API documentation](https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0) 
 * for more information about the service.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Microsoft Graph API directly with your Microsoft credentials.
 * 
 * ## Use Cases
 * 
 * - **Team Notifications**: Automate team alerts and announcements
 * - **Project Updates**: Send automated project status updates
 * - **Approval Workflows**: Implement approval processes with interactive messages
 * - **Task Management**: Automate task creation and assignment
 * - **Meeting Coordination**: Coordinate meetings and schedule updates
 * - **Incident Response**: Automate incident notification and response
 * - **Customer Support**: Handle support ticket notifications
 * - **Survey Distribution**: Distribute surveys and collect feedback
 * - **Status Monitoring**: Monitor system status and alerts
 * - **Team Onboarding**: Automate new team member onboarding
 * - **Performance Reviews**: Coordinate performance review processes
 * - **Change Management**: Handle change notifications and approvals
 * - **Compliance Reporting**: Automate compliance reporting and alerts
 * - **Training Coordination**: Manage training schedules and materials
 * - **Event Planning**: Coordinate events and meeting schedules
 * - **Feedback Collection**: Gather team feedback and suggestions
 * - **Resource Management**: Manage resource requests and allocations
 * - **Knowledge Sharing**: Distribute knowledge and documentation
 * - **Quality Assurance**: Coordinate QA processes and reviews
 * - **Security Alerts**: Handle security notifications and responses
 * - **Budget Tracking**: Monitor budget updates and approvals
 * - **Vendor Communication**: Coordinate vendor interactions
 * - **Client Updates**: Provide automated client status updates
 * - **Emergency Notifications**: Handle emergency communication
 * - **Process Improvement**: Coordinate improvement initiatives
 * - **Cross-functional Collaboration**: Enable team collaboration
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftTeamsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftTeams',
  displayName: 'Microsoft Teams',
  description: 'Comprehensive team collaboration and communication with advanced workflow features.',
  category: 'Action Nodes',
  subcategory: 'Email & Communication',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'chatMessage',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Channel',
          value: 'channel',
          description: 'Work with Teams channels'
        },
        {
          name: 'Channel Message',
          value: 'channelMessage',
          description: 'Work with channel messages'
        },
        {
          name: 'Chat Message',
          value: 'chatMessage',
          description: 'Work with chat messages'
        },
        {
          name: 'Task',
          value: 'task',
          description: 'Work with Teams tasks'
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
          resource: ['chatMessage']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a chat message'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a chat message'
        },
        {
          name: 'Get Many',
          value: 'getMany',
          description: 'Get many chat messages'
        },
        {
          name: 'Send and Wait for Response',
          value: 'sendAndWait',
          description: 'Send message and wait for response'
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
      name: 'microsoftTeamsOAuth2Api',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Microsoft Teams'
  },

  aliases: ['teams', 'microsoft', 'chat', 'collaboration', 'communication'],
  
  examples: [
    {
      name: 'Send Team Notification',
      description: 'Send an automated notification to a Teams channel',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams',
            type: 'n8n-nodes-base.microsoftTeams',
            parameters: {
              resource: 'channelMessage',
              operation: 'create',
              channelId: 'CHANNEL_ID',
              message: 'Automated notification from n8n workflow'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftTeamsNode;
