/**
 * # ClickUp
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the ClickUp node to automate work in ClickUp and integrate ClickUp with other applications. 
 * n8n has built-in support for a wide range of ClickUp features, including creating, getting, 
 * deleting, and updating folders, checklists, tags, comments, and goals. ClickUp is a comprehensive 
 * project management platform that combines task management, time tracking, goal setting, and team 
 * collaboration in one unified workspace.
 * 
 * ## Key Features
 * 
 * - **Task Management**: Comprehensive task creation, assignment, and tracking
 * - **Project Organization**: Hierarchical structure with spaces, folders, and lists
 * - **Time Tracking**: Built-in time tracking with entries and timers
 * - **Goal Management**: OKR-style goal setting with key results tracking
 * - **Team Collaboration**: Comments, mentions, and real-time collaboration
 * - **Custom Fields**: Flexible data capture with custom field types
 * - **Checklist Management**: Detailed task breakdown with checklist items
 * - **Tag System**: Powerful categorization with space and task tags
 * - **Dependency Tracking**: Task relationships and dependency management
 * - **Workspace Hierarchy**: Multi-level organization from spaces to tasks
 * - **Integration Hub**: Connect with development, communication, and business tools
 * - **Automation Engine**: Workflow automation and trigger-based actions
 * - **Reporting & Analytics**: Project progress and team performance insights
 * - **Mobile Productivity**: Full-featured mobile apps for remote work
 * - **Template System**: Reusable project and task templates
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Credentials
 * 
 * Refer to [ClickUp credentials](../../credentials/clickup/) for guidance on setting up authentication.
 * Supports API token authentication for secure access to ClickUp workspaces.
 * 
 * ## Operations
 * 
 * ### Checklist Operations
 * - Create, update, and delete checklists for task breakdown
 * - Organize complex tasks with detailed step-by-step procedures
 * - Project milestone tracking and quality assurance workflows
 * 
 * ### Checklist Item Operations
 * - Create, update, and delete individual checklist items
 * - Detailed task breakdown with assignees and due dates
 * - Progress tracking and completion status management
 * 
 * ### Comment Operations
 * - Create, get, update, and delete comments on tasks
 * - Team collaboration and communication threads
 * - Project status updates and discussion history
 * 
 * ### Folder Operations
 * - Create, get, update, and delete folders for project organization
 * - Hierarchical project structure and team workspace management
 * - Department and client-based project segregation
 * 
 * ### Goal Operations
 * - Create, get, update, and delete organizational goals
 * - OKR methodology with strategic objective tracking
 * - Performance measurement and success criteria definition
 * 
 * ### Goal Key Result Operations
 * - Create, update, and delete measurable key results
 * - Quantitative metrics and KPI tracking setup
 * - Progress milestones and team accountability
 * 
 * ### List Operations
 * - Create, get, update, and delete task lists
 * - Sprint planning and iteration management
 * - Custom field configuration and team member access
 * 
 * ### Space Tag Operations
 * - Create, get, update, and delete workspace-wide tags
 * - Categorization system for projects and tasks
 * - Priority levels and department identification
 * 
 * ### Task Operations
 * - Create, get, update, and delete individual tasks
 * - Comprehensive work management with custom fields
 * - Team assignments and collaboration tracking
 * 
 * ### Task List Operations
 * - Add and remove tasks from lists
 * - Workflow stage progression and organization
 * - Sprint planning and backlog management
 * 
 * ### Task Tag Operations
 * - Add and remove tags from tasks
 * - Task categorization and filtering system
 * - Priority and skill requirement identification
 * 
 * ### Task Dependency Operations
 * - Create and delete task dependencies
 * - Project timeline and critical path management
 * - Resource coordination and workflow sequencing
 * 
 * ### Time Entry Operations
 * - Create, get, update, and delete time entries
 * - Start and stop active time tracking
 * - Project cost tracking and productivity measurement
 * 
 * ### Time Entry Tag Operations
 * - Add, get, and remove tags from time entries
 * - Time categorization and billing classification
 * - Project profitability and cost analysis
 * 
 * ## Common Integration Patterns
 * 
 * ### Project Management Automation
 * - Automated task creation from external triggers (emails, forms, webhooks)
 * - Project template deployment and standardization
 * - Cross-platform task synchronization and updates
 * - Team workload balancing and capacity management
 * - Timeline tracking and milestone automation
 * - Quality gate progression and approval workflows
 * - Resource allocation and skill-based assignment
 * - Performance tracking and productivity analytics
 * - Strategic goal cascading and OKR management
 * - Integration with development tools and CI/CD pipelines
 * - Customer feedback integration and product roadmap updates
 * - Compliance tracking and audit trail maintenance
 * 
 * ### Team Collaboration Enhancement
 * - Real-time communication and notification automation
 * - Document sharing and knowledge base integration
 * - Meeting coordination and agenda management
 * - Decision tracking and action item follow-up
 * - Training and onboarding workflow automation
 * - Performance review and feedback collection
 * - Team building and culture development tracking
 * - Remote work coordination and productivity monitoring
 * - Skills assessment and development planning
 * - Cross-functional collaboration and handoff automation
 * - Customer support and service delivery coordination
 * - Strategic planning and goal alignment tracking
 * 
 * ### Business Process Integration
 * - Customer relationship management and sales pipeline integration
 * - Financial planning and budget tracking automation
 * - Marketing campaign management and ROI tracking
 * - Product development and release management
 * - Quality assurance and compliance monitoring
 * - Risk management and mitigation planning
 * - Strategic planning and business intelligence integration
 * - Vendor management and procurement automation
 * - Human resources and talent management integration
 * - Customer success and retention tracking
 * - Business continuity and disaster recovery planning
 * - Competitive analysis and market intelligence integration
 * 
 * ## Example Use Cases
 * 
 * ### Software Development Team
 * ```typescript
 * // Automated sprint planning with GitHub integration
 * const sprintTasks = await clickup.createTasksFromGitHubIssues({
 *   listId: 'development-sprint',
 *   repository: 'company/product',
 *   labels: ['bug', 'feature'],
 *   assignees: developmentTeam
 * });
 * 
 * // Time tracking integration with development tools
 * await clickup.startTimeEntry({
 *   taskId: currentTask.id,
 *   description: 'Feature development',
 *   tags: ['development', 'frontend']
 * });
 * ```
 * 
 * ### Marketing Campaign Management
 * ```typescript
 * // Campaign task creation with asset management
 * const campaignTasks = await clickup.createCampaignWorkflow({
 *   folderId: 'q2-campaigns',
 *   campaign: 'product-launch',
 *   deliverables: ['content', 'design', 'advertising'],
 *   timeline: campaignSchedule
 * });
 * 
 * // Goal tracking for campaign performance
 * await clickup.createGoal({
 *   name: 'Q2 Product Launch Success',
 *   keyResults: [
 *     { metric: 'lead-generation', target: 1000 },
 *     { metric: 'conversion-rate', target: 0.15 }
 *   ]
 * });
 * ```
 * 
 * ### Customer Success Operations
 * ```typescript
 * // Automated onboarding workflow
 * const onboardingTasks = await clickup.createOnboardingChecklist({
 *   customerId: newCustomer.id,
 *   plan: customerPlan,
 *   timeline: onboardingSchedule
 * });
 * 
 * // Success metric tracking and renewal preparation
 * await clickup.trackCustomerHealth({
 *   taskId: customerTask.id,
 *   metrics: ['usage', 'support-tickets', 'satisfaction'],
 *   renewalDate: customer.renewalDate
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Zoom AI Meeting Assistant**: Creates mail summary, ClickUp tasks and follow-up calls
 * - **Basic Task Creation**: Simple task creation workflow for new projects
 * - **Notion-ClickUp Sync**: Synchronize Notion database pages as ClickUp tasks
 * - **GitHub Integration**: Automated issue tracking and development workflows
 * - **Customer Support**: Ticket management and resolution tracking
 * - **Content Marketing**: Editorial calendar and content production workflows
 * - **Sales Pipeline**: Lead qualification and opportunity management
 * - **HR Onboarding**: Employee onboarding and training tracking
 * - **Event Planning**: Comprehensive event management and execution
 * - **Product Launch**: Go-to-market strategy and execution tracking
 * - **Quality Assurance**: Testing procedures and bug tracking workflows
 * - **Strategic Planning**: OKR management and quarterly planning
 * 
 * ## Best Practices
 * 
 * ### Workspace Organization
 * - Use hierarchical structure: Space > Folder > List > Task
 * - Implement consistent naming conventions across projects
 * - Create template workflows for recurring project types
 * - Use custom fields for standardized data capture
 * - Implement tag taxonomy for consistent categorization
 * - Set up automation rules for routine task management
 * - Configure notifications for critical project updates
 * - Establish clear permission and access control policies
 * - Create dashboard views for different stakeholder needs
 * - Implement regular cleanup and archival procedures
 * - Use time tracking for project cost and profitability analysis
 * - Set up goal hierarchies for strategic alignment tracking
 * 
 * ### Integration Strategy
 * - Connect development tools for seamless workflow automation
 * - Integrate communication platforms for team collaboration
 * - Link customer systems for comprehensive project context
 * - Connect financial tools for budget and cost tracking
 * - Integrate analytics tools for performance measurement
 * - Link calendar systems for timeline and scheduling coordination
 * - Connect document management for centralized knowledge access
 * - Integrate reporting tools for stakeholder communication
 * - Link quality assurance tools for testing and validation
 * - Connect security tools for compliance and risk management
 * - Integrate training platforms for skill development tracking
 * - Link business intelligence tools for strategic decision support
 */

export const clickupNode = {
  displayName: 'ClickUp',
  name: 'clickup',
  group: ['transform'],
  version: 1,
  icon: 'file:clickup.svg',
  description: 'Comprehensive project management platform with task management, time tracking, goal setting, and team collaboration',
  defaults: {
    name: 'ClickUp',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'clickUpApi',
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
          name: 'Checklist',
          value: 'checklist',
          description: 'Task breakdown management with detailed procedures',
        },
        {
          name: 'Checklist Item',
          value: 'checklistItem',
          description: 'Individual checklist items with progress tracking',
        },
        {
          name: 'Comment',
          value: 'comment',
          description: 'Team communication and collaboration threads',
        },
        {
          name: 'Folder',
          value: 'folder',
          description: 'Project organization and hierarchical structure',
        },
        {
          name: 'Goal',
          value: 'goal',
          description: 'Strategic objectives with OKR methodology',
        },
        {
          name: 'Goal Key Result',
          value: 'goalKeyResult',
          description: 'Measurable key results for goal tracking',
        },
        {
          name: 'List',
          value: 'list',
          description: 'Task organization within project folders',
        },
        {
          name: 'Space Tag',
          value: 'spaceTag',
          description: 'Workspace-wide categorization system',
        },
        {
          name: 'Task',
          value: 'task',
          description: 'Individual work items with comprehensive tracking',
        },
        {
          name: 'Task Dependency',
          value: 'taskDependency',
          description: 'Task relationships and workflow sequencing',
        },
        {
          name: 'Task List',
          value: 'taskList',
          description: 'Task list organization and workflow management',
        },
        {
          name: 'Task Tag',
          value: 'taskTag',
          description: 'Task categorization and filtering system',
        },
        {
          name: 'Time Entry',
          value: 'timeEntry',
          description: 'Time tracking and productivity measurement',
        },
        {
          name: 'Time Entry Tag',
          value: 'timeEntryTag',
          description: 'Time categorization and billing classification',
        },
      ],
      default: 'task',
    },
  ],
};
