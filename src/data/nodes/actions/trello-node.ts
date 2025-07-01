/**
 * # Trello
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Trello node to automate work in Trello, and integrate Trello with other applications. 
 * n8n has built-in support for a wide range of Trello features, including creating and updating 
 * cards, managing boards and lists, and handling team member collaboration.
 * 
 * ## Key Features
 * 
 * - **Kanban Board Management**: Complete board creation, organization, and administration
 * - **Card Automation**: Create, update, and manage cards with rich metadata and attachments
 * - **List Organization**: Manage board lists with archive/unarchive functionality
 * - **Team Collaboration**: Add, invite, and manage board members with role-based access
 * - **Checklist Management**: Create and manage detailed task checklists within cards
 * - **Label System**: Organize cards with color-coded labels and categories
 * - **Comment System**: Add and manage card comments for team communication
 * - **Attachment Handling**: Upload, manage, and organize card attachments
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Cross-platform Sync**: Seamless integration with calendars and other productivity tools
 * - **Visual Workflow**: Leverage Trello's visual Kanban methodology
 * - **Real-time Updates**: Keep teams synchronized with real-time board updates
 * 
 * ## Credentials
 * 
 * Refer to [Trello credentials](../../credentials/trello/) for guidance on setting up authentication.
 * Uses Trello API Key and Token for secure API access.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Board Operations
 * - **Create Board**: Create new Trello boards
 *   - Set board name, description, and visibility settings
 *   - Configure board background colors and themes
 *   - Set board permissions and team access levels
 *   - Create board from templates and presets
 *   - Configure board-wide settings and preferences
 *   - Set board due dates and project timelines
 * - **Get Board**: Retrieve specific board information
 *   - Access complete board details and metadata
 *   - View board members, lists, and card counts
 *   - Check board activity and recent changes
 *   - Monitor board permissions and settings
 *   - Access board custom fields and power-ups
 * - **Update Board**: Modify existing boards
 *   - Change board names, descriptions, and visibility
 *   - Update board backgrounds and visual themes
 *   - Modify board permissions and member access
 *   - Configure board automation and power-ups
 *   - Update board organization and team settings
 * - **Delete Board**: Remove boards permanently
 *   - Archive or permanently delete boards
 *   - Handle board data backup and migration
 *   - Notify team members of board changes
 *   - Manage board closure and cleanup processes
 * 
 * ### Board Member Operations
 * - **Add Member**: Add existing users to boards
 *   - Add team members by username or email
 *   - Set member roles and permission levels
 *   - Configure member notification preferences
 *   - Assign member-specific board access rights
 *   - Track member addition history and changes
 * - **Get All Members**: List all board members
 *   - View complete board member roster
 *   - Check member roles and permission levels
 *   - Monitor member activity and contributions
 *   - Export member lists and contact information
 *   - Track member engagement and participation
 * - **Invite Member**: Send board invitations
 *   - Invite new users via email addresses
 *   - Set invitation messages and context
 *   - Configure invited member permissions
 *   - Track invitation status and responses
 *   - Manage invitation expiration and follow-up
 * - **Remove Member**: Remove members from boards
 *   - Remove inactive or departing team members
 *   - Handle member role transitions and handoffs
 *   - Maintain board security and access control
 *   - Archive member contributions and history
 * 
 * ### List Operations
 * - **Create List**: Create new lists on boards
 *   - Add lists for different workflow stages
 *   - Set list names and position ordering
 *   - Configure list automation and rules
 *   - Create list templates and standards
 *   - Set list-specific permissions and access
 * - **Get List**: Retrieve specific list information
 *   - Access complete list details and metadata
 *   - View list cards and card counts
 *   - Check list position and ordering
 *   - Monitor list activity and changes
 *   - Access list automation settings
 * - **Get All Lists**: List all lists on a board
 *   - View complete board list structure
 *   - Check list ordering and organization
 *   - Monitor list creation and modification history
 *   - Export list structures and configurations
 *   - Track list usage and card distribution
 * - **Get Cards in List**: Retrieve all cards within a list
 *   - View all cards in specific workflow stages
 *   - Check card details and metadata
 *   - Monitor card progression through lists
 *   - Export card data for reporting and analysis
 *   - Track list throughput and velocity
 * - **Update List**: Modify existing lists
 *   - Change list names and descriptions
 *   - Reorder lists within boards
 *   - Update list automation and rules
 *   - Modify list permissions and access
 *   - Configure list templates and standards
 * - **Archive/Unarchive List**: Manage list visibility
 *   - Archive completed or inactive lists
 *   - Restore archived lists when needed
 *   - Maintain clean board organization
 *   - Preserve list history and data
 * 
 * ### Card Operations
 * - **Create Card**: Create new cards in lists
 *   - Set card names, descriptions, and details
 *   - Add card due dates and time estimates
 *   - Assign cards to team members
 *   - Set card priority levels and labels
 *   - Add card attachments and links
 *   - Configure card custom fields and metadata
 * - **Get Card**: Retrieve specific card information
 *   - Access complete card details and history
 *   - View card assignments and member activity
 *   - Check card due dates and time tracking
 *   - Monitor card comments and discussions
 *   - Access card attachments and checklists
 * - **Update Card**: Modify existing cards
 *   - Change card details, descriptions, and assignments
 *   - Update card due dates and priority levels
 *   - Move cards between lists and boards
 *   - Modify card labels and categories
 *   - Update card custom fields and metadata
 * - **Delete Card**: Remove cards permanently
 *   - Archive or permanently delete cards
 *   - Handle card dependency cleanup
 *   - Notify assignees and followers of changes
 *   - Manage card data and attachment cleanup
 * 
 * ### Card Comment Operations
 * - **Create Comment**: Add comments to cards
 *   - Provide card updates and communication
 *   - Mention team members in comments
 *   - Add rich text formatting and links
 *   - Create discussion threads on cards
 *   - Track comment history and activity
 * - **Update Comment**: Modify existing comments
 *   - Edit comment content and formatting
 *   - Update comment mentions and references
 *   - Correct comment information and details
 *   - Maintain comment accuracy and relevance
 * - **Delete Comment**: Remove comments from cards
 *   - Remove outdated or incorrect comments
 *   - Clean up card communication history
 *   - Manage comment permissions and access
 *   - Maintain professional card discussions
 * 
 * ### Checklist Operations
 * - **Create Checklist**: Create new checklists on cards
 *   - Add task breakdowns within cards
 *   - Set checklist names and descriptions
 *   - Create checklist templates and standards
 *   - Configure checklist automation and rules
 *   - Set checklist-specific permissions
 * - **Get Checklist**: Retrieve specific checklist information
 *   - Access complete checklist details and items
 *   - View checklist completion status and progress
 *   - Check checklist item assignments and due dates
 *   - Monitor checklist activity and updates
 *   - Track checklist usage and effectiveness
 * - **Get All Checklists**: List all checklists for a card
 *   - View complete card checklist structure
 *   - Check overall card completion progress
 *   - Monitor checklist organization and priorities
 *   - Export checklist data for reporting
 *   - Track card task complexity and scope
 * - **Get Specific Checklist**: Retrieve particular checklist on card
 *   - Access targeted checklist information
 *   - View specific checklist completion status
 *   - Check individual checklist item details
 *   - Monitor specific checklist progress
 * - **Get Completed Items**: View completed checklist items
 *   - Track completed tasks and milestones
 *   - Monitor team productivity and progress
 *   - Generate completion reports and analytics
 *   - Celebrate team achievements and milestones
 * - **Create Checklist Item**: Add items to checklists
 *   - Break down tasks into manageable steps
 *   - Set item names, descriptions, and details
 *   - Assign checklist items to team members
 *   - Set item due dates and priorities
 *   - Configure item dependencies and relationships
 * - **Update Checklist Item**: Modify checklist items
 *   - Change item descriptions and assignments
 *   - Update item completion status and progress
 *   - Modify item due dates and priorities
 *   - Update item dependencies and relationships
 * - **Delete Checklist**: Remove entire checklists
 *   - Remove completed or unnecessary checklists
 *   - Clean up card organization and structure
 *   - Archive checklist data and history
 * - **Delete Checklist Item**: Remove individual items
 *   - Remove completed or outdated items
 *   - Maintain checklist relevance and accuracy
 *   - Update task breakdowns and scope
 * 
 * ### Label Operations
 * - **Create Label**: Create new labels for organization
 *   - Add color-coded labels for categorization
 *   - Set label names and descriptions
 *   - Create label hierarchies and systems
 *   - Configure label automation and rules
 *   - Set board-wide label standards
 * - **Get Label**: Retrieve specific label information
 *   - Access label details and usage statistics
 *   - View label assignments and card counts
 *   - Check label color and naming conventions
 *   - Monitor label effectiveness and usage
 * - **Get All Labels**: List all labels for a board
 *   - View complete board label system
 *   - Check label organization and categories
 *   - Monitor label usage and distribution
 *   - Export label systems for standardization
 *   - Track label effectiveness and adoption
 * - **Update Label**: Modify existing labels
 *   - Change label names, colors, and descriptions
 *   - Update label categories and hierarchies
 *   - Modify label automation and rules
 *   - Standardize label systems across boards
 * - **Delete Label**: Remove labels permanently
 *   - Remove unused or outdated labels
 *   - Clean up label systems and categories
 *   - Archive label history and usage data
 * - **Add Label to Card**: Apply labels to cards
 *   - Categorize cards with appropriate labels
 *   - Implement card organization systems
 *   - Enable label-based filtering and sorting
 *   - Track card categorization and themes
 * - **Remove Label from Card**: Remove labels from cards
 *   - Update card categorization and organization
 *   - Maintain label accuracy and relevance
 *   - Clean up card label assignments
 * 
 * ### Attachment Operations
 * - **Create Attachment**: Add attachments to cards
 *   - Upload files, documents, and images
 *   - Add links and external resources
 *   - Set attachment names and descriptions
 *   - Configure attachment permissions and access
 *   - Track attachment upload and modification history
 * - **Get Attachment**: Retrieve specific attachment information
 *   - Access attachment details and metadata
 *   - View attachment file sizes and formats
 *   - Check attachment permissions and access
 *   - Monitor attachment usage and downloads
 * - **Get All Attachments**: List all attachments for a card
 *   - View complete card attachment inventory
 *   - Check attachment organization and categories
 *   - Monitor attachment storage and usage
 *   - Export attachment lists and metadata
 *   - Track card resource requirements
 * - **Delete Attachment**: Remove attachments from cards
 *   - Remove outdated or unnecessary attachments
 *   - Clean up card storage and organization
 *   - Manage attachment permissions and access
 *   - Archive attachment history and data
 * 
 * ## Advanced Features
 * 
 * ### Visual Workflow Management
 * - **Kanban Methodology**: Leverage visual workflow management
 * - **Board Templates**: Use pre-configured board setups
 * - **Drag-and-Drop**: Support visual card movement and organization
 * - **Progress Tracking**: Monitor workflow progress and bottlenecks
 * 
 * ### Team Collaboration
 * - **Member Management**: Comprehensive team member administration
 * - **Permission Control**: Granular access and editing permissions
 * - **Notification System**: Automated team alerts and updates
 * - **Activity Feeds**: Track board and card activity
 * 
 * ### Project Organization
 * - **Multi-Board Projects**: Organize complex projects across boards
 * - **Label Systems**: Implement consistent categorization
 * - **Due Date Management**: Track project timelines and deadlines
 * - **Checklist Workflows**: Break down complex tasks
 * 
 * ## Integration Patterns
 * 
 * ### Calendar Integration
 * - **Due Date Sync**: Synchronize card due dates with calendars
 * - **Meeting Planning**: Convert calendar events to cards
 * - **Deadline Tracking**: Monitor project milestones and deadlines
 * - **Schedule Management**: Coordinate team schedules and availability
 * 
 * ### Task Automation
 * - **Card Creation**: Automate card creation from external triggers
 * - **Status Updates**: Auto-update card status based on activity
 * - **Assignment Rules**: Automatically assign cards based on criteria
 * - **Progress Tracking**: Monitor and report project progress
 * 
 * ### Communication Integration
 * - **Email Integration**: Convert emails to cards and comments
 * - **Chat Integration**: Connect with Slack, Teams, and other platforms
 * - **Notification Management**: Coordinate alerts across platforms
 * - **Update Broadcasting**: Share progress updates automatically
 * 
 * ## Related Resources
 * 
 * Refer to [Trello's API documentation](https://developer.atlassian.com/cloud/trello/rest/) for more information about the service.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Trello API directly with your Trello credentials.
 * 
 * ## Use Cases
 * 
 * - **Project Management**: Organize and track project progress visually
 * - **Team Coordination**: Facilitate team collaboration and communication
 * - **Task Assignment**: Distribute and manage team workloads
 * - **Workflow Automation**: Automate repetitive project management tasks
 * - **Progress Tracking**: Monitor project milestones and deadlines
 * - **Resource Management**: Organize project resources and documentation
 * - **Client Projects**: Manage client work and deliverables
 * - **Product Development**: Track feature development and releases
 * - **Marketing Campaigns**: Organize marketing activities and content
 * - **Event Planning**: Coordinate event logistics and timelines
 * - **Content Creation**: Manage editorial calendars and content workflows
 * - **Sales Pipeline**: Track leads and sales activities
 * - **HR Processes**: Manage hiring, onboarding, and HR workflows
 * - **Quality Assurance**: Organize testing and QA processes
 * - **Customer Support**: Track support tickets and resolution
 * - **Vendor Management**: Coordinate vendor relationships and deliverables
 * - **Training Programs**: Organize training materials and schedules
 * - **Compliance Tracking**: Monitor regulatory and compliance requirements
 * - **Budget Management**: Track project budgets and expenses
 * - **Risk Management**: Identify and mitigate project risks
 */

import { NodeTypeInfo } from '../../node-types.js';

export const trelloNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.trello',
  displayName: 'Trello',
  description: 'Visual project management and team collaboration using Kanban methodology.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'card',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Attachment',
          value: 'attachment',
          description: 'Work with card attachments'
        },
        {
          name: 'Board',
          value: 'board',
          description: 'Work with Trello boards'
        },
        {
          name: 'Board Member',
          value: 'boardMember',
          description: 'Work with board members'
        },
        {
          name: 'Card',
          value: 'card',
          description: 'Work with Trello cards'
        },
        {
          name: 'Card Comment',
          value: 'cardComment',
          description: 'Work with card comments'
        },
        {
          name: 'Checklist',
          value: 'checklist',
          description: 'Work with card checklists'
        },
        {
          name: 'Label',
          value: 'label',
          description: 'Work with card labels'
        },
        {
          name: 'List',
          value: 'list',
          description: 'Work with board lists'
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
          resource: ['card']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a card'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a card'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a card'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a card'
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
      name: 'trelloApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Trello'
  },

  aliases: ['trello', 'kanban', 'board', 'card', 'project', 'management'],
  
  examples: [
    {
      name: 'Create Project Card',
      description: 'Create a new card in a Trello list',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'card',
              operation: 'create',
              name: 'New automated card',
              listId: 'LIST_ID',
              description: 'Card created via n8n automation'
            }
          }
        ]
      }
    }
  ]
};

export default trelloNode;
