/**
 * # Asana
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Asana node to automate work in Asana, and integrate Asana with other applications. 
 * n8n has built-in support for a wide range of Asana features, including creating, updating, 
 * deleting, and getting users, tasks, projects, and subtasks.
 * 
 * ## Key Features
 * 
 * - **Complete Project Management**: Full project lifecycle management and organization
 * - **Task Automation**: Create, update, and manage tasks with detailed workflow control
 * - **Subtask Organization**: Break down complex tasks into manageable subtasks
 * - **Team Collaboration**: Manage users, assignments, and team coordination
 * - **Comment System**: Add and manage task comments for team communication
 * - **Tag Management**: Organize tasks with customizable tags and categories
 * - **Project Integration**: Move tasks between projects and manage project relationships
 * - **Search Capabilities**: Advanced task search and filtering functionality
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Cross-platform Sync**: Seamless integration with other productivity tools
 * - **Real-time Updates**: Keep teams synchronized with real-time task updates
 * - **Custom Fields**: Support for custom task fields and metadata
 * 
 * ## Credentials
 * 
 * Refer to [Asana credentials](../../credentials/asana/) for guidance on setting up authentication.
 * Uses Asana Personal Access Token or OAuth2 for secure API access.
 * 
 * ## API Version Notice
 * 
 * **Important**: Due to changes in Asana's API, upgrade to n8n 1.22.2 or above for full functionality.
 * Some operations stopped working on January 17th, 2023 in older versions.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Project Operations
 * - **Create Project**: Create new projects in Asana
 *   - Set project name, description, and objectives
 *   - Configure project privacy settings (public/private)
 *   - Assign project owners and team members
 *   - Set project color and custom fields
 *   - Configure project templates and layouts
 *   - Set project due dates and milestones
 * - **Get Project**: Retrieve specific project information
 *   - Access complete project details and metadata
 *   - View project team members and roles
 *   - Check project progress and status
 *   - Monitor project timeline and milestones
 *   - Access project custom fields and data
 * - **Get All Projects**: List multiple projects
 *   - View all accessible projects in workspace
 *   - Filter projects by team, status, or owner
 *   - Search projects by name or description
 *   - Export project lists and summaries
 *   - Monitor project portfolio overview
 * - **Update Project**: Modify existing projects
 *   - Change project names, descriptions, and settings
 *   - Update project team assignments and roles
 *   - Modify project status and progress tracking
 *   - Update project custom fields and metadata
 *   - Configure project workflows and templates
 * - **Delete Project**: Remove projects permanently
 *   - Archive or permanently delete projects
 *   - Handle project task migration and cleanup
 *   - Notify team members of project changes
 *   - Manage project data backup and recovery
 * 
 * ### Task Operations
 * - **Create Task**: Create new tasks in projects
 *   - Set task names, descriptions, and details
 *   - Assign tasks to team members
 *   - Set due dates, start dates, and time estimates
 *   - Configure task priority levels and dependencies
 *   - Add task attachments and external links
 *   - Set task custom fields and metadata
 * - **Get Task**: Retrieve specific task information
 *   - Access complete task details and history
 *   - View task assignments and progress
 *   - Check task dependencies and relationships
 *   - Monitor task time tracking and estimates
 *   - Access task comments and activity feed
 * - **Get All Tasks**: List and filter tasks
 *   - View tasks by project, assignee, or status
 *   - Filter tasks by due date, priority, or completion
 *   - Search tasks by name, description, or content
 *   - Export task lists and reports
 *   - Monitor team workload and capacity
 * - **Update Task**: Modify existing tasks
 *   - Change task details, descriptions, and assignments
 *   - Update task status, priority, and due dates
 *   - Modify task dependencies and relationships
 *   - Update task custom fields and metadata
 *   - Change task project assignments
 * - **Delete Task**: Remove tasks permanently
 *   - Archive or permanently delete tasks
 *   - Handle task dependency cleanup
 *   - Notify assignees and followers of changes
 *   - Manage task data and attachment cleanup
 * - **Move Task**: Transfer tasks between projects
 *   - Move tasks to different projects or sections
 *   - Maintain task history and relationships
 *   - Update task context and assignments
 *   - Handle project-specific custom fields
 * - **Search Tasks**: Advanced task search functionality
 *   - Search across multiple projects and workspaces
 *   - Filter by various task attributes and metadata
 *   - Use advanced search queries and criteria
 *   - Export search results and reports
 * 
 * ### Subtask Operations
 * - **Create Subtask**: Create subtasks for existing tasks
 *   - Break down complex tasks into manageable parts
 *   - Set subtask details, assignments, and due dates
 *   - Configure subtask dependencies and relationships
 *   - Inherit parent task context and settings
 * - **Get All Subtasks**: List subtasks for a parent task
 *   - View all subtasks within a specific task
 *   - Monitor subtask progress and completion
 *   - Track subtask assignments and due dates
 *   - Export subtask lists and reports
 * 
 * ### Task Comment Operations
 * - **Add Comment**: Add comments to tasks
 *   - Provide task updates and communication
 *   - Mention team members in comments
 *   - Add rich text formatting and attachments
 *   - Create threaded discussions
 * - **Remove Comment**: Delete comments from tasks
 *   - Remove outdated or incorrect comments
 *   - Clean up task communication history
 *   - Manage comment permissions and access
 * 
 * ### Task Tag Operations
 * - **Add Tag**: Add tags to tasks for organization
 *   - Categorize tasks with custom tags
 *   - Create tag hierarchies and relationships
 *   - Use tags for filtering and reporting
 *   - Implement tag-based workflow automation
 * - **Remove Tag**: Remove tags from tasks
 *   - Clean up task organization
 *   - Update task categorization
 *   - Maintain tag consistency across projects
 * 
 * ### Task Project Operations
 * - **Add Task to Project**: Assign tasks to projects
 *   - Move tasks between projects
 *   - Multi-home tasks across projects
 *   - Maintain task context and relationships
 *   - Update project-specific custom fields
 * - **Remove Task from Project**: Remove tasks from projects
 *   - Clean up project task assignments
 *   - Handle task dependencies and relationships
 *   - Maintain task history and data
 * 
 * ### User Operations
 * - **Get User**: Retrieve specific user information
 *   - Access user profile and contact details
 *   - View user workspace and team memberships
 *   - Check user permissions and roles
 *   - Monitor user activity and availability
 * - **Get All Users**: List users in workspace
 *   - View all accessible users and team members
 *   - Filter users by team, role, or status
 *   - Export user lists and contact information
 *   - Monitor team capacity and availability
 * 
 * ## Advanced Features
 * 
 * ### Project Management
 * - **Portfolio Management**: Organize projects into portfolios
 * - **Timeline View**: Visualize project timelines and dependencies
 * - **Progress Tracking**: Monitor project and task completion rates
 * - **Resource Planning**: Manage team workload and capacity
 * 
 * ### Team Collaboration
 * - **Team Communication**: Facilitate team discussions and updates
 * - **Assignment Management**: Distribute work across team members
 * - **Permission Control**: Manage access and editing permissions
 * - **Activity Feeds**: Track project and task activity
 * 
 * ### Workflow Automation
 * - **Rule-based Automation**: Create custom workflow rules
 * - **Template Systems**: Use project and task templates
 * - **Integration Workflows**: Connect with external tools
 * - **Notification Systems**: Automate alerts and updates
 * 
 * ## Integration Patterns
 * 
 * ### Task Synchronization
 * - **Cross-platform Sync**: Sync tasks between different tools
 * - **Data Migration**: Import/export task data
 * - **Real-time Updates**: Keep task status synchronized
 * - **Conflict Resolution**: Handle sync conflicts and duplicates
 * 
 * ### Project Reporting
 * - **Progress Reports**: Generate project status reports
 * - **Team Performance**: Track team productivity metrics
 * - **Time Tracking**: Monitor time spent on tasks and projects
 * - **Custom Dashboards**: Create personalized project views
 * 
 * ### Customer Service Integration
 * - **Ticket Creation**: Convert customer requests to tasks
 * - **Status Updates**: Provide customer status notifications
 * - **Escalation Workflows**: Handle priority customer issues
 * - **Service Level Monitoring**: Track response and resolution times
 * 
 * ## Related Resources
 * 
 * Refer to [Asana's API documentation](https://developers.asana.com/docs) for more information about the service.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Asana API directly with your Asana credentials.
 * 
 * ## Use Cases
 * 
 * - **Project Automation**: Automate project creation and management
 * - **Task Assignment**: Distribute tasks based on workload or skills
 * - **Progress Tracking**: Monitor project and task completion
 * - **Team Coordination**: Facilitate team communication and collaboration
 * - **Client Updates**: Provide automated client project updates
 * - **Resource Management**: Track and manage team capacity
 * - **Quality Assurance**: Implement QA workflows and reviews
 * - **Customer Support**: Convert support tickets to actionable tasks
 * - **Product Development**: Manage feature requests and development cycles
 * - **Marketing Campaigns**: Coordinate marketing project execution
 * - **Event Planning**: Organize and track event planning tasks
 * - **Content Creation**: Manage content creation workflows
 * - **Sales Operations**: Track sales activities and follow-ups
 * - **HR Processes**: Manage onboarding and HR task workflows
 * - **Compliance Tracking**: Monitor regulatory and compliance tasks
 * - **Vendor Management**: Coordinate vendor projects and deliverables
 * - **Training Programs**: Organize training schedules and materials
 * - **Budget Tracking**: Monitor project budgets and expenses
 * - **Risk Management**: Track and mitigate project risks
 * - **Change Management**: Implement change control processes
 */

import { NodeTypeInfo } from '../../node-types.js';

export const asanaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.asana',
  displayName: 'Asana',
  description: 'Comprehensive project management and team collaboration with advanced task automation.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'task',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Project',
          value: 'project',
          description: 'Work with Asana projects'
        },
        {
          name: 'Task',
          value: 'task',
          description: 'Work with Asana tasks'
        },
        {
          name: 'Subtask',
          value: 'subtask',
          description: 'Work with task subtasks'
        },
        {
          name: 'Task Comment',
          value: 'taskComment',
          description: 'Work with task comments'
        },
        {
          name: 'Task Tag',
          value: 'taskTag',
          description: 'Work with task tags'
        },
        {
          name: 'Task Project',
          value: 'taskProject',
          description: 'Work with task-project relationships'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Work with Asana users'
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
          resource: ['task']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a task'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a task'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a task'
        },
        {
          name: 'Get Many',
          value: 'getMany',
          description: 'Get many tasks'
        },
        {
          name: 'Move',
          value: 'move',
          description: 'Move a task'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search for tasks'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a task'
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
      name: 'asanaOAuth2Api',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Asana'
  },

  aliases: ['asana', 'project', 'task', 'management', 'collaboration'],
  
  examples: [
    {
      name: 'Create Project Task',
      description: 'Create a new task in an Asana project',
      workflow: {
        nodes: [
          {
            name: 'Asana',
            type: 'n8n-nodes-base.asana',
            parameters: {
              resource: 'task',
              operation: 'create',
              name: 'New automated task',
              projectId: 'PROJECT_ID',
              assignee: 'USER_ID'
            }
          }
        ]
      }
    }
  ]
};

export default asanaNode;
