/**
 * # Monday.com
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the monday.com node to automate work in monday.com and integrate monday.com with other applications. 
 * n8n has built-in support for a wide range of monday.com features, including creating new boards, 
 * and adding, deleting, and getting items on boards. Monday.com is a comprehensive Work Operating System 
 * that combines project management, team collaboration, and workflow automation in a visual and 
 * intuitive platform.
 * 
 * ## Key Features
 * 
 * - **Board Management**: Visual project boards with customizable workflows
 * - **Column System**: Flexible column types for different data and tracking needs
 * - **Group Organization**: Logical grouping of items within boards
 * - **Item Tracking**: Comprehensive item management with rich data support
 * - **Automation Engine**: Workflow automation and trigger-based actions
 * - **Integration Hub**: Connect with hundreds of third-party applications
 * - **Timeline View**: Gantt-style project timeline and dependency tracking
 * - **Dashboard Analytics**: Visual reporting and business intelligence
 * - **Team Collaboration**: Real-time collaboration and communication tools
 * - **Template Library**: Pre-built templates for various use cases
 * - **Mobile Apps**: Full-featured mobile applications for remote work
 * - **Custom Workflows**: Tailored processes for different business needs
 * - **Resource Management**: Team capacity and workload tracking
 * - **Goal Tracking**: OKR-style objective and key result management
 * - **Time Tracking**: Built-in time logging and productivity measurement
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Version Requirements
 * 
 * **Minimum Required Version**: n8n 1.22.6 or above
 * 
 * ## Credentials
 * 
 * Refer to [monday.com credentials](../../credentials/mondaycom/) for guidance on setting up authentication.
 * Supports API token authentication for secure access to monday.com workspaces.
 * 
 * ## Operations
 * 
 * ### Board Operations
 * - **Archive Board**: Archive a board to remove from active workspace
 * - **Create Board**: Create new project boards with custom templates
 * - **Get Board**: Retrieve specific board information and metadata
 * - **Get All Boards**: List all boards accessible to the authenticated user
 * 
 * ### Board Column Operations
 * - **Create Column**: Add new columns with specific data types to boards
 * - **Get All Columns**: Retrieve all columns for a specific board
 * 
 * ### Board Group Operations
 * - **Create Group**: Create logical groupings within boards for organization
 * - **Delete Group**: Remove groups and optionally handle contained items
 * - **Get Groups**: List all groups within a specific board
 * 
 * ### Board Item Operations
 * - **Add Update**: Add comments and updates to items for collaboration
 * - **Change Column Value**: Update single column values for specific items
 * - **Change Multiple Column Values**: Bulk update multiple columns simultaneously
 * - **Create Item**: Add new items to board groups with initial data
 * - **Delete Item**: Remove items from boards with confirmation
 * - **Get Item**: Retrieve specific item details and column values
 * - **Get All Items**: List all items within boards or groups
 * - **Get Items by Column Value**: Query items based on column criteria
 * - **Move Item to Group**: Reorganize items between groups
 * 
 * ## Common Integration Patterns
 * 
 * ### Project Management Automation
 * - Automated board creation from project templates and requirements
 * - Task synchronization with external project management tools
 * - Timeline tracking and milestone automation across projects
 * - Resource allocation and team capacity management
 * - Cross-board dependency tracking and critical path analysis
 * - Quality gate progression and approval workflow automation
 * - Risk management and issue escalation procedures
 * - Performance tracking and productivity measurement
 * - Strategic goal alignment and OKR cascade management
 * - Integration with development tools and CI/CD pipelines
 * - Customer feedback integration and product roadmap updates
 * - Compliance tracking and audit trail maintenance
 * 
 * ### Team Collaboration Enhancement
 * - Real-time communication and notification automation
 * - Document sharing and knowledge base integration
 * - Meeting coordination and agenda management workflows
 * - Decision tracking and action item follow-up automation
 * - Training and onboarding workflow management
 * - Performance review and feedback collection systems
 * - Team building and culture development tracking
 * - Remote work coordination and productivity monitoring
 * - Skills assessment and development planning automation
 * - Cross-functional collaboration and handoff procedures
 * - Customer support and service delivery coordination
 * - Strategic planning and goal alignment tracking
 * 
 * ### Business Process Integration
 * - Customer relationship management and sales pipeline integration
 * - Financial planning and budget tracking automation
 * - Marketing campaign management and ROI measurement
 * - Product development and release management workflows
 * - Quality assurance and compliance monitoring systems
 * - Risk management and mitigation planning automation
 * - Strategic planning and business intelligence integration
 * - Vendor management and procurement workflow automation
 * - Human resources and talent management integration
 * - Customer success and retention tracking systems
 * - Business continuity and disaster recovery planning
 * - Competitive analysis and market intelligence integration
 * 
 * ## Example Use Cases
 * 
 * ### Software Development Team
 * ```typescript
 * // Automated sprint planning with GitHub integration
 * const sprintBoard = await monday.createBoard({
 *   name: 'Q4 Sprint Planning',
 *   template: 'software-development',
 *   groups: ['backlog', 'in-progress', 'testing', 'done']
 * });
 * 
 * // Sync GitHub issues as Monday items
 * await monday.createItemsFromGitHub({
 *   boardId: sprintBoard.id,
 *   repository: 'company/product',
 *   labels: ['bug', 'feature', 'enhancement']
 * });
 * ```
 * 
 * ### Marketing Campaign Management
 * ```typescript
 * // Campaign tracking board with deliverables
 * const campaignBoard = await monday.createCampaignBoard({
 *   name: 'Q2 Product Launch Campaign',
 *   deliverables: ['content', 'design', 'advertising', 'pr'],
 *   timeline: campaignSchedule,
 *   stakeholders: marketingTeam
 * });
 * 
 * // Automated progress tracking and reporting
 * await monday.setupCampaignTracking({
 *   boardId: campaignBoard.id,
 *   metrics: ['reach', 'engagement', 'conversions'],
 *   reportingFrequency: 'weekly'
 * });
 * ```
 * 
 * ### Customer Success Operations
 * ```typescript
 * // Customer onboarding workflow
 * const onboardingBoard = await monday.createOnboardingWorkflow({
 *   customerId: newCustomer.id,
 *   plan: customerPlan,
 *   milestones: onboardingMilestones,
 *   timeline: onboardingSchedule
 * });
 * 
 * // Health score tracking and renewal preparation
 * await monday.trackCustomerHealth({
 *   boardId: customerBoard.id,
 *   metrics: ['usage', 'support-tickets', 'satisfaction'],
 *   renewalDate: customer.renewalDate
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Create ticket on specific customer messages in Telegram**: Automated support ticket creation
 * - **Microsoft Outlook AI Email Assistant**: Contact support integration with Monday and Airtable
 * - **Retrieve Monday.com row and all data**: Comprehensive data retrieval in single operation
 * - **Basic Project Setup**: Simple project creation workflow for new initiatives
 * - **CRM Integration**: Customer relationship management with sales pipeline tracking
 * - **Content Calendar**: Editorial calendar and content production workflows
 * - **Event Planning**: Comprehensive event management and execution tracking
 * - **HR Onboarding**: Employee onboarding and training workflow management
 * - **Product Launch**: Go-to-market strategy and execution coordination
 * - **Quality Assurance**: Testing procedures and bug tracking workflows
 * - **Strategic Planning**: OKR management and quarterly planning systems
 * - **Vendor Management**: Supplier relationship and procurement tracking
 * 
 * ## Best Practices
 * 
 * ### Board Organization
 * - Use consistent naming conventions across all boards and items
 * - Implement standardized column types for similar data categories
 * - Create template boards for recurring project types and workflows
 * - Use groups effectively to organize items by status, priority, or category
 * - Implement color coding and labels for quick visual identification
 * - Set up automation rules for routine task management and updates
 * - Configure notifications for critical project updates and milestones
 * - Establish clear ownership and permission policies for board access
 * - Create dashboard views for different stakeholder reporting needs
 * - Implement regular cleanup and archival procedures for completed projects
 * - Use custom fields for standardized data capture and reporting
 * - Set up integration rules for seamless third-party tool connectivity
 * 
 * ### Integration Strategy
 * - Connect development tools for seamless workflow automation and tracking
 * - Integrate communication platforms for enhanced team collaboration
 * - Link customer systems for comprehensive project context and history
 * - Connect financial tools for budget tracking and cost management
 * - Integrate analytics tools for performance measurement and optimization
 * - Link calendar systems for timeline coordination and scheduling
 * - Connect document management for centralized knowledge and asset access
 * - Integrate reporting tools for stakeholder communication and updates
 * - Link quality assurance tools for testing and validation workflows
 * - Connect security tools for compliance and risk management
 * - Integrate training platforms for skill development and certification tracking
 * - Link business intelligence tools for strategic decision support and insights
 */

export const mondayNode = {
  displayName: 'Monday.com',
  name: 'mondaycom',
  group: ['transform'],
  version: 1,
  icon: 'file:mondaycom.svg',
  description: 'Comprehensive Work Operating System with visual project management, team collaboration, and workflow automation',
  defaults: {
    name: 'Monday.com',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'mondayComApi',
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
          name: 'Board',
          value: 'board',
          description: 'Visual project boards with customizable workflows',
        },
        {
          name: 'Board Column',
          value: 'boardColumn',
          description: 'Flexible column types for different data tracking',
        },
        {
          name: 'Board Group',
          value: 'boardGroup',
          description: 'Logical grouping of items within boards',
        },
        {
          name: 'Board Item',
          value: 'boardItem',
          description: 'Individual work items with comprehensive tracking',
        },
      ],
      default: 'boardItem',
    },
  ],
};
