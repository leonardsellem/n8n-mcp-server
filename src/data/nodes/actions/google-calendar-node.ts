/**
 * # Google Calendar
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Google Calendar node to automate work in Google Calendar, and integrate Google Calendar 
 * with other applications. n8n has built-in support for a wide range of Google Calendar features, 
 * including adding, retrieving, deleting and updating calendar events, and checking availability.
 * 
 * ## Key Features
 * 
 * - **Event Management**: Complete event creation, modification, and deletion
 * - **Calendar Operations**: Check availability and manage calendar resources
 * - **Multi-Calendar Support**: Work with multiple Google calendars simultaneously
 * - **Recurring Events**: Handle complex recurring event patterns and exceptions
 * - **Attendee Management**: Manage event invitations, responses, and notifications
 * - **Time Zone Handling**: Automatic time zone conversion and management
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Meeting Automation**: Automate meeting scheduling and management workflows
 * - **Integration Ready**: Seamless integration with other productivity tools
 * - **Rich Event Details**: Support for descriptions, locations, attachments, and custom fields
 * - **Notification Control**: Manage email and popup reminders for events
 * - **Privacy Settings**: Control event visibility and access permissions
 * 
 * ## Credentials
 * 
 * Refer to [Google Calendar credentials](../../credentials/google/) for guidance on setting up authentication.
 * Uses Google OAuth2 for secure API access with appropriate calendar permissions.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Calendar Operations
 * - **Check Availability**: Determine if time slots are available
 *   - Check single or multiple calendar availability
 *   - Handle time zone conversions automatically
 *   - Support for busy/free status checking
 *   - Conflict detection for scheduling
 *   - Resource availability verification
 *   - Working hours and business rules consideration
 *   - Holiday and vacation time awareness
 *   - Meeting room and resource booking validation
 *   - Bulk availability checking for multiple attendees
 *   - Smart scheduling suggestions based on availability
 *   - Integration with external calendar systems
 *   - Real-time availability status updates
 * 
 * ### Event Operations
 * - **Create Event**: Add new events to calendars
 *   - Set event titles, descriptions, and locations
 *   - Configure start and end times with time zones
 *   - Add multiple attendees with invitation management
 *   - Set event recurrence patterns and exceptions
 *   - Configure visibility and access permissions
 *   - Add meeting links and conference details
 *   - Set up email and popup reminders
 *   - Attach files and additional resources
 *   - Create all-day and multi-day events
 *   - Set event colors and categories
 *   - Configure guest permissions and settings
 *   - Add custom event properties and metadata
 *   - Integration with video conferencing platforms
 *   - Automatic conflict detection and resolution
 *   - Smart scheduling with AI assistance
 *   - Template-based event creation
 *   - Bulk event creation and import
 * - **Get Event**: Retrieve specific event information
 *   - Access complete event details and metadata
 *   - View attendee lists and response status
 *   - Check event modification history and changes
 *   - Monitor event recurrence and exceptions
 *   - Access event attachments and resources
 *   - View event visibility and permission settings
 *   - Check reminder and notification configurations
 *   - Retrieve event location and conference details
 *   - Monitor event status and cancellation info
 *   - Access custom event properties and fields
 *   - View event creation and modification timestamps
 *   - Track event analytics and engagement
 * - **Get Many Events**: Retrieve multiple events from calendars
 *   - List events within specific date ranges
 *   - Filter events by attendees, status, and properties
 *   - Search events by keywords and content
 *   - Sort events by various criteria
 *   - Paginate through large event collections
 *   - Export event data for reporting and analysis
 *   - Monitor upcoming events and deadlines
 *   - Track event patterns and trends
 *   - Generate calendar summaries and reports
 *   - Bulk event data extraction
 *   - Integration with analytics and reporting tools
 *   - Custom event queries and filters
 * - **Update Event**: Modify existing events
 *   - Change event details, times, and locations
 *   - Update attendee lists and invitation status
 *   - Modify recurrence patterns and exceptions
 *   - Update event descriptions and attachments
 *   - Change event visibility and permissions
 *   - Update reminder and notification settings
 *   - Modify conference and meeting details
 *   - Update event colors and categories
 *   - Change event status and cancellation info
 *   - Update custom event properties
 *   - Handle attendee response changes
 *   - Bulk event updates and modifications
 *   - Version control and change tracking
 *   - Conflict resolution and rescheduling
 *   - Automated event maintenance and cleanup
 * - **Delete Event**: Remove events from calendars
 *   - Delete single events or entire series
 *   - Handle recurring event deletion options
 *   - Send cancellation notifications to attendees
 *   - Archive event data before deletion
 *   - Manage event dependency cleanup
 *   - Bulk event deletion and cleanup
 *   - Soft delete with recovery options
 *   - Permanent event removal
 *   - Cascade deletion of related resources
 *   - Audit trail for deleted events
 * 
 * ## Advanced Features
 * 
 * ### Recurring Events Management
 * - **Complex Patterns**: Support for daily, weekly, monthly, and yearly recurrence
 * - **Exception Handling**: Manage exceptions and modifications to recurring events
 * - **Series Management**: Handle entire event series or individual instances
 * - **Flexible Scheduling**: Custom recurrence patterns and business rules
 * 
 * ### Attendee and Invitation Management
 * - **Invitation Control**: Send, track, and manage event invitations
 * - **Response Tracking**: Monitor attendee responses and availability
 * - **Guest Permissions**: Control what attendees can see and modify
 * - **Notification Management**: Customize invitation and reminder settings
 * 
 * ### Time Zone and Scheduling
 * - **Global Support**: Handle events across multiple time zones
 * - **Automatic Conversion**: Convert times based on attendee locations
 * - **Business Hours**: Respect working hours and regional preferences
 * - **Holiday Awareness**: Consider holidays and special dates
 * 
 * ### Integration and Automation
 * - **Workflow Triggers**: Connect calendar events to automated workflows
 * - **Cross-Platform Sync**: Synchronize with other calendar systems
 * - **Meeting Integration**: Connect with video conferencing platforms
 * - **Notification Routing**: Route calendar notifications to various channels
 * 
 * ## Integration Patterns
 * 
 * ### Meeting Automation
 * - **Smart Scheduling**: AI-powered meeting scheduling and optimization
 * - **Resource Booking**: Automatic meeting room and resource reservation
 * - **Conflict Resolution**: Intelligent conflict detection and resolution
 * - **Follow-up Automation**: Automated meeting follow-up and action items
 * 
 * ### Project Management Integration
 * - **Milestone Tracking**: Convert project milestones to calendar events
 * - **Deadline Management**: Automatic deadline and reminder creation
 * - **Team Coordination**: Synchronize team schedules and availability
 * - **Resource Planning**: Schedule team resources and capacity
 * 
 * ### Communication Integration
 * - **Email Integration**: Connect calendar events with email workflows
 * - **Chat Integration**: Sync calendar events with team chat platforms
 * - **Notification Management**: Route calendar alerts to appropriate channels
 * - **Update Broadcasting**: Share calendar changes across platforms
 * 
 * ## Related Resources
 * 
 * n8n provides a trigger node for Google Calendar. You can find the trigger node docs [here](../../trigger-nodes/n8n-nodes-base.googlecalendartrigger/).
 * 
 * Refer to [Google Calendar's API documentation](https://developers.google.com/calendar/api/v3/reference) for more information about the service.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Google Calendar API directly with your Google credentials.
 * 
 * ## Use Cases
 * 
 * - **Meeting Scheduling**: Automate meeting creation and scheduling workflows
 * - **Event Management**: Organize and manage company events and activities
 * - **Team Coordination**: Synchronize team schedules and availability
 * - **Project Planning**: Track project milestones and deadlines
 * - **Resource Booking**: Schedule meeting rooms and shared resources
 * - **Appointment Booking**: Automate customer appointment scheduling
 * - **Reminder Systems**: Create automated reminder and notification systems
 * - **Calendar Sync**: Synchronize calendars across multiple platforms
 * - **Workflow Triggers**: Use calendar events to trigger business processes
 * - **Time Tracking**: Monitor time allocation and scheduling patterns
 * - **Conflict Resolution**: Automatically detect and resolve scheduling conflicts
 * - **Recurring Event Management**: Handle complex recurring schedules
 * - **Multi-Calendar Management**: Coordinate across multiple calendar systems
 * - **Integration Workflows**: Connect calendar events with other business tools
 * - **Automated Follow-up**: Create follow-up tasks from calendar events
 * - **Availability Checking**: Verify availability before scheduling
 * - **Meeting Preparation**: Automate meeting preparation and setup
 * - **Event Analytics**: Track and analyze calendar usage patterns
 * - **Custom Notifications**: Send customized event notifications
 * - **Cross-Platform Sync**: Keep multiple calendar systems synchronized
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googleCalendarNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleCalendar',
  displayName: 'Google Calendar',
  description: 'Schedule and manage calendar events with Google Calendar integration.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'event',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Calendar',
          value: 'calendar',
          description: 'Work with calendar operations'
        },
        {
          name: 'Event',
          value: 'event',
          description: 'Work with calendar events'
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
          resource: ['event']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create an event'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an event'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an event'
        },
        {
          name: 'Get Many',
          value: 'getMany',
          description: 'Get many events'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an event'
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
      name: 'googleCalendarOAuth2Api',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Google Calendar'
  },

  aliases: ['calendar', 'schedule', 'event', 'meeting', 'appointment'],
  
  examples: [
    {
      name: 'Create Meeting Event',
      description: 'Create a new meeting event in Google Calendar',
      workflow: {
        nodes: [
          {
            name: 'Google Calendar',
            type: 'n8n-nodes-base.googleCalendar',
            parameters: {
              resource: 'event',
              operation: 'create',
              summary: 'Team Meeting',
              start: '2024-01-15T10:00:00Z',
              end: '2024-01-15T11:00:00Z'
            }
          }
        ]
      }
    }
  ]
};

export default googleCalendarNode;
