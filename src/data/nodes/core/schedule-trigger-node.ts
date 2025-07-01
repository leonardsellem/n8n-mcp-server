/**
 * # Schedule Trigger
 * 
 * **Status**: Active
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * Use the Schedule Trigger node to run workflows at fixed intervals and times. 
 * This works in a similar way to the Cron software utility in Unix-like systems.
 * 
 * ## Important Requirements
 * 
 * - Workflow must be activated: Save and activate the workflow for the schedule to work
 * - Timezone consideration: Uses workflow timezone or instance timezone (default: America/New_York)
 * 
 * ## Key Features
 * 
 * - Multiple intervals: Seconds, minutes, hours, days, weeks, months
 * - Cron expressions: Full cron support for complex schedules
 * - Multiple rules: Add multiple trigger rules per node
 * - Timezone aware: Respects workflow and instance timezone settings
 * - Precision timing: Down to second-level precision
 * - Variable support: Variables can be used in cron expressions
 * 
 * ## Use Cases
 * 
 * - Automated report generation
 * - Data synchronization tasks
 * - Regular health checks and monitoring
 * - Backup and maintenance routines
 * - Periodic data processing
 * - Regular notifications and reminders
 * - System cleanup tasks
 * - API data fetching at intervals
 * - Log rotation and archiving
 * - Scheduled integrations
 */

import { NodeTypeInfo } from '../../node-types.js';

export const scheduletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.scheduleTrigger',
  displayName: 'Schedule Trigger',
  description: 'Triggers workflows at fixed intervals and times using cron-like scheduling. Supports seconds to monthly intervals.',
  category: 'Core Nodes',
  subcategory: 'Triggers',
  
  properties: [
    {
      name: 'triggerRules',
      displayName: 'Trigger Rules',
      type: 'fixedCollection',
      required: true,
      default: {},
      description: 'Rules that determine when the trigger should run',
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'interval',
          displayName: 'Interval',
          values: [
            {
              name: 'triggerInterval',
              displayName: 'Trigger Interval',
              type: 'options',
              default: 'minutes',
              description: 'Time interval unit for scheduling',
              options: [
                { name: 'Seconds', value: 'seconds' },
                { name: 'Minutes', value: 'minutes' },
                { name: 'Hours', value: 'hours' },
                { name: 'Days', value: 'days' },
                { name: 'Weeks', value: 'weeks' },
                { name: 'Months', value: 'months' },
                { name: 'Custom (Cron)', value: 'custom' }
              ]
            },
            // Seconds interval parameters
            {
              name: 'secondsInterval',
              displayName: 'Seconds Between Triggers',
              type: 'number',
              default: 30,
              description: 'Number of seconds between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['seconds']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            // Minutes interval parameters
            {
              name: 'minutesInterval',
              displayName: 'Minutes Between Triggers',
              type: 'number',
              default: 5,
              description: 'Number of minutes between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['minutes']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            // Hours interval parameters
            {
              name: 'hoursInterval',
              displayName: 'Hours Between Triggers',
              type: 'number',
              default: 1,
              description: 'Number of hours between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['hours']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            {
              name: 'triggerAtMinute',
              displayName: 'Trigger at Minute',
              type: 'number',
              default: 0,
              description: 'Minute past the hour to trigger the node when it runs (0-59)',
              displayOptions: {
                show: {
                  triggerInterval: ['hours']
                }
              },
              typeOptions: {
                minValue: 0,
                maxValue: 59
              }
            },
            // Days interval parameters
            {
              name: 'daysInterval',
              displayName: 'Days Between Triggers',
              type: 'number',
              default: 1,
              description: 'Number of days between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['days']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            {
              name: 'triggerAtHour',
              displayName: 'Trigger at Hour',
              type: 'options',
              default: 9,
              description: 'Hour of the day to trigger the node',
              displayOptions: {
                show: {
                  triggerInterval: ['days', 'weeks', 'months']
                }
              },
              options: [
                { name: '12am', value: 0 }, { name: '1am', value: 1 }, { name: '2am', value: 2 },
                { name: '3am', value: 3 }, { name: '4am', value: 4 }, { name: '5am', value: 5 },
                { name: '6am', value: 6 }, { name: '7am', value: 7 }, { name: '8am', value: 8 },
                { name: '9am', value: 9 }, { name: '10am', value: 10 }, { name: '11am', value: 11 },
                { name: '12pm', value: 12 }, { name: '1pm', value: 13 }, { name: '2pm', value: 14 },
                { name: '3pm', value: 15 }, { name: '4pm', value: 16 }, { name: '5pm', value: 17 },
                { name: '6pm', value: 18 }, { name: '7pm', value: 19 }, { name: '8pm', value: 20 },
                { name: '9pm', value: 21 }, { name: '10pm', value: 22 }, { name: '11pm', value: 23 }
              ]
            },
            {
              name: 'triggerAtMinuteDay',
              displayName: 'Trigger at Minute',
              type: 'number',
              default: 0,
              description: 'Minute past the hour to trigger the node when it runs (0-59)',
              displayOptions: {
                show: {
                  triggerInterval: ['days', 'weeks', 'months']
                }
              },
              typeOptions: {
                minValue: 0,
                maxValue: 59
              }
            },
            // Weeks interval parameters
            {
              name: 'weeksInterval',
              displayName: 'Weeks Between Triggers',
              type: 'number',
              default: 1,
              description: 'Number of weeks between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['weeks']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            {
              name: 'triggerOnWeekdays',
              displayName: 'Trigger on Weekdays',
              type: 'multiOptions',
              default: ['monday'],
              description: 'Days of the week to trigger the node',
              displayOptions: {
                show: {
                  triggerInterval: ['weeks']
                }
              },
              options: [
                { name: 'Monday', value: 'monday' },
                { name: 'Tuesday', value: 'tuesday' },
                { name: 'Wednesday', value: 'wednesday' },
                { name: 'Thursday', value: 'thursday' },
                { name: 'Friday', value: 'friday' },
                { name: 'Saturday', value: 'saturday' },
                { name: 'Sunday', value: 'sunday' }
              ]
            },
            // Months interval parameters
            {
              name: 'monthsInterval',
              displayName: 'Months Between Triggers',
              type: 'number',
              default: 1,
              description: 'Number of months between each workflow trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['months']
                }
              },
              typeOptions: {
                minValue: 1
              }
            },
            {
              name: 'triggerAtDayOfMonth',
              displayName: 'Trigger at Day of Month',
              type: 'number',
              default: 1,
              description: 'Day of the month to trigger at (1-31). If a month doesnt have this day, the node wont trigger',
              displayOptions: {
                show: {
                  triggerInterval: ['months']
                }
              },
              typeOptions: {
                minValue: 1,
                maxValue: 31
              }
            },
            // Custom cron parameters
            {
              name: 'cronExpression',
              displayName: 'Expression',
              type: 'string',
              default: '0 */6 * * *',
              description: 'Custom cron expression to set the schedule',
              displayOptions: {
                show: {
                  triggerInterval: ['custom']
                }
              },
              placeholder: '0 */6 * * *'
            }
          ]
        }
      ]
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Schedule',
      description: 'Triggered according to the configured schedule'
    }
  ],

  credentials: [],

  triggerNode: true,
  
  version: [1, 2],
  defaults: {
    name: 'Schedule Trigger'
  },

  aliases: ['cron', 'timer', 'interval', 'schedule'],
  
  examples: [
    {
      name: 'Every 5 Minutes',
      description: 'Trigger workflow every 5 minutes',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              triggerRules: {
                interval: [
                  {
                    triggerInterval: 'minutes',
                    minutesInterval: 5
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Custom Cron Expression',
      description: 'Weekdays at 9 AM using cron',
      workflow: {
        nodes: [
          {
            name: 'Schedule Trigger',
            type: 'n8n-nodes-base.scheduleTrigger',
            parameters: {
              triggerRules: {
                interval: [
                  {
                    triggerInterval: 'custom',
                    cronExpression: '0 9 * * 1-5'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
};

export default scheduletriggerNode;
