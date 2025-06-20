import { NodeTypeInfo } from '../node-types.js';

export const scheduleTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.scheduleTrigger',
  displayName: 'Schedule Trigger',
  description: 'Triggers the workflow at specific times or intervals. Essential for automation scheduling, recurring tasks, and time-based workflows.',
  category: 'Core',
  subcategory: 'Trigger',
  properties: [
    {
      name: 'rule',
      displayName: 'Rule',
      type: 'options',
      required: true,
      default: 'interval',
      description: 'When to trigger the workflow',
      options: [
        { name: 'Interval', value: 'interval', description: 'Run at regular intervals' },
        { name: 'Cron Expression', value: 'cron', description: 'Use cron expression for complex scheduling' },
        { name: 'Specific Date and Time', value: 'datetime', description: 'Run at specific date and time' }
      ]
    },
    {
      name: 'interval',
      displayName: 'Interval',
      type: 'number',
      required: false,
      default: 1,
      description: 'The interval between executions'
    },
    {
      name: 'unit',
      displayName: 'Unit',
      type: 'options',
      required: false,
      default: 'hours',
      description: 'The time unit for the interval',
      options: [
        { name: 'Seconds', value: 'seconds', description: 'Run every X seconds' },
        { name: 'Minutes', value: 'minutes', description: 'Run every X minutes' },
        { name: 'Hours', value: 'hours', description: 'Run every X hours' },
        { name: 'Days', value: 'days', description: 'Run every X days' },
        { name: 'Weeks', value: 'weeks', description: 'Run every X weeks' },
        { name: 'Months', value: 'months', description: 'Run every X months' }
      ]
    },
    {
      name: 'cronExpression',
      displayName: 'Cron Expression',
      type: 'string',
      required: false,
      default: '0 0 * * *',
      description: 'Cron expression defining when to trigger (minute hour day month weekday)'
    },
    {
      name: 'timezone',
      displayName: 'Timezone',
      type: 'string',
      required: false,
      default: 'UTC',
      description: 'Timezone for the schedule (e.g., "America/New_York", "Europe/London")'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Date when the schedule should start (ISO 8601 format)'
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Date when the schedule should end (ISO 8601 format)'
    },
    {
      name: 'triggerAtSecond',
      displayName: 'Trigger at Second',
      type: 'number',
      required: false,
      default: 0,
      description: 'Second of the minute to trigger at (0-59)'
    },
    {
      name: 'runOnce',
      displayName: 'Run Once',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to run only once at the specified time'
    },
    {
      name: 'dateTime',
      displayName: 'Date and Time',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific date and time to trigger (ISO 8601 format)'
    },
    {
      name: 'weekdays',
      displayName: 'Weekdays',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Days of the week to trigger on',
      options: [
        { name: 'Monday', value: '1', description: 'Monday' },
        { name: 'Tuesday', value: '2', description: 'Tuesday' },
        { name: 'Wednesday', value: '3', description: 'Wednesday' },
        { name: 'Thursday', value: '4', description: 'Thursday' },
        { name: 'Friday', value: '5', description: 'Friday' },
        { name: 'Saturday', value: '6', description: 'Saturday' },
        { name: 'Sunday', value: '0', description: 'Sunday' }
      ]
    },
    {
      name: 'monthDays',
      displayName: 'Days of Month',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated days of the month to trigger on (1-31)'
    },
    {
      name: 'hours',
      displayName: 'Hours',
      type: 'string',
      required: false,
      default: '0',
      description: 'Comma-separated hours to trigger on (0-23)'
    },
    {
      name: 'minutes',
      displayName: 'Minutes',
      type: 'string',
      required: false,
      default: '0',
      description: 'Comma-separated minutes to trigger on (0-59)'
    },
    {
      name: 'triggerCount',
      displayName: 'Maximum Triggers',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of times to trigger (0 = unlimited)'
    },
    {
      name: 'skipIfWorkflowRunning',
      displayName: 'Skip if Already Running',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Skip trigger if workflow is already running'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers at scheduled times'
    }
  ],
  triggerNode: true,
  polling: false,
  webhookSupport: false,
  examples: [
    {
      name: 'Every Hour',
      description: 'Trigger workflow every hour',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'interval',
              interval: 1,
              unit: 'hours',
              timezone: 'UTC'
            }
          }
        ]
      }
    },
    {
      name: 'Daily at 9 AM',
      description: 'Trigger workflow every day at 9:00 AM',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 9 * * *',
              timezone: 'America/New_York'
            }
          }
        ]
      }
    },
    {
      name: 'Weekdays Only',
      description: 'Trigger workflow at 8 AM on weekdays only',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 8 * * 1-5',
              timezone: 'UTC'
            }
          }
        ]
      }
    },
    {
      name: 'Monthly Report',
      description: 'Trigger on the 1st of every month at midnight',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 0 1 * *',
              timezone: 'UTC'
            }
          }
        ]
      }
    },
    {
      name: 'Every 30 Minutes',
      description: 'Trigger workflow every 30 minutes during business hours',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '*/30 9-17 * * 1-5',
              timezone: 'America/New_York'
            }
          }
        ]
      }
    },
    {
      name: 'Quarterly Review',
      description: 'Trigger on specific dates for quarterly reviews',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 9 1 1,4,7,10 *',
              timezone: 'UTC'
            }
          }
        ]
      }
    },
    {
      name: 'One-time Event',
      description: 'Trigger workflow once at a specific date and time',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'datetime',
              dateTime: '2024-07-15T14:30:00Z',
              runOnce: true,
              timezone: 'UTC'
            }
          }
        ]
      }
    },
    {
      name: 'Weekend Batch Job',
      description: 'Run heavy processing tasks on weekends',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 2 * * 0,6',
              timezone: 'UTC',
              skipIfWorkflowRunning: true
            }
          }
        ]
      }
    },
    {
      name: 'Backup Schedule',
      description: 'Daily backups at 2 AM with limited runs',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              rule: 'cron',
              cronExpression: '0 2 * * *',
              timezone: 'UTC',
              triggerCount: 30,
              skipIfWorkflowRunning: true
            }
          }
        ]
      }
    }
  ]
};

export const intervalTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.intervalTrigger',
  displayName: 'Interval Trigger',
  description: 'Simple trigger that runs at regular intervals. Alternative to Schedule Trigger for basic recurring workflows.',
  category: 'Core',
  subcategory: 'Trigger',
  properties: [
    {
      name: 'interval',
      displayName: 'Interval',
      type: 'number',
      required: true,
      default: 60,
      description: 'Interval in seconds between executions'
    },
    {
      name: 'triggerTimes',
      displayName: 'Number of Triggers',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of times to trigger (0 = unlimited)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers at regular intervals'
    }
  ],
  triggerNode: true,
  polling: false,
  examples: [
    {
      name: 'Every 5 Minutes',
      description: 'Simple trigger every 5 minutes',
      workflow: {
        nodes: [
          {
            name: 'Interval Trigger',
            type: 'n8n-nodes-base.intervalTrigger',
            parameters: {
              interval: 300
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const scheduleNodes: NodeTypeInfo[] = [scheduleTriggerNode, intervalTriggerNode];

// Export common cron expressions
export const commonCronExpressions = {
  everyMinute: '* * * * *',
  everyHour: '0 * * * *',
  everyDay: '0 0 * * *',
  everyWeek: '0 0 * * 0',
  everyMonth: '0 0 1 * *',
  everyYear: '0 0 1 1 *',
  weekdaysAt9AM: '0 9 * * 1-5',
  weekendsAt10AM: '0 10 * * 0,6',
  firstOfMonth: '0 0 1 * *',
  lastOfMonth: '0 0 28-31 * *',
  every15Minutes: '*/15 * * * *',
  every30Minutes: '*/30 * * * *',
  businessHours: '0 9-17 * * 1-5',
  midnightDaily: '0 0 * * *',
  noonDaily: '0 12 * * *'
};

// Export timezone examples
export const commonTimezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland'
];

// Export schedule patterns
export const schedulePatterns = [
  'minutely',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'weekdays',
  'weekends',
  'business_hours',
  'off_hours',
  'quarterly',
  'custom_cron'
];