import { NodeTypeInfo } from '../node-types.js';

export const facebookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.facebook',
  displayName: 'Facebook',
  description: 'Use the Facebook node to automate work in Facebook, and integrate Facebook with other applications. n8n supports posting, managing pages, analyzing insights, and working with Facebook Graph API.',
  category: 'Communication',
  subcategory: 'Social Media',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'post',
      description: 'The resource to operate on',
      options: [
        { name: 'Post', value: 'post', description: 'Work with Facebook posts' },
        { name: 'Page', value: 'page', description: 'Manage Facebook pages' },
        { name: 'Event', value: 'event', description: 'Handle Facebook events' },
        { name: 'Photo', value: 'photo', description: 'Upload and manage photos' },
        { name: 'Video', value: 'video', description: 'Upload and manage videos' },
        { name: 'Comment', value: 'comment', description: 'Manage comments' },
        { name: 'Message', value: 'message', description: 'Send messages via Messenger' },
        { name: 'Insights', value: 'insights', description: 'Get page and post insights' },
        { name: 'Lead', value: 'lead', description: 'Manage leads from forms' },
        { name: 'Ad', value: 'ad', description: 'Work with Facebook Ads' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Post operations
        { name: 'Create Post', value: 'create', description: 'Create a new post' },
        { name: 'Update Post', value: 'update', description: 'Update an existing post' },
        { name: 'Delete Post', value: 'delete', description: 'Delete a post' },
        { name: 'Get Post', value: 'get', description: 'Get post information' },
        { name: 'Get Many Posts', value: 'getAll', description: 'Get multiple posts' },
        // Page operations
        { name: 'Get Page Info', value: 'getPageInfo', description: 'Get page information' },
        { name: 'Get Page Posts', value: 'getPagePosts', description: 'Get posts from page' },
        { name: 'Get Page Followers', value: 'getPageFollowers', description: 'Get page followers' },
        // Event operations
        { name: 'Create Event', value: 'createEvent', description: 'Create a Facebook event' },
        { name: 'Update Event', value: 'updateEvent', description: 'Update event details' },
        { name: 'Get Event', value: 'getEvent', description: 'Get event information' },
        { name: 'Get Event Attendees', value: 'getEventAttendees', description: 'Get event attendees' },
        // Media operations
        { name: 'Upload Photo', value: 'uploadPhoto', description: 'Upload a photo' },
        { name: 'Upload Video', value: 'uploadVideo', description: 'Upload a video' },
        { name: 'Get Photo', value: 'getPhoto', description: 'Get photo information' },
        { name: 'Get Video', value: 'getVideo', description: 'Get video information' },
        // Comment operations
        { name: 'Get Comments', value: 'getComments', description: 'Get post comments' },
        { name: 'Create Comment', value: 'createComment', description: 'Add a comment' },
        { name: 'Delete Comment', value: 'deleteComment', description: 'Delete a comment' },
        // Message operations
        { name: 'Send Message', value: 'sendMessage', description: 'Send a message via Messenger' },
        { name: 'Get Messages', value: 'getMessages', description: 'Get conversation messages' },
        // Insights operations
        { name: 'Get Page Insights', value: 'getPageInsights', description: 'Get page insights data' },
        { name: 'Get Post Insights', value: 'getPostInsights', description: 'Get post insights data' },
        { name: 'Get Video Insights', value: 'getVideoInsights', description: 'Get video insights data' },
        // Lead operations
        { name: 'Get Leads', value: 'getLeads', description: 'Get leads from forms' },
        { name: 'Get Lead Info', value: 'getLeadInfo', description: 'Get specific lead information' }
      ]
    },
    {
      name: 'pageId',
      displayName: 'Page ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the Facebook page'
    },
    {
      name: 'postId',
      displayName: 'Post ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the post'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The text content of the post or message'
    },
    {
      name: 'link',
      displayName: 'Link',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to include in the post'
    },
    {
      name: 'imageUrl',
      displayName: 'Image URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the image to post'
    },
    {
      name: 'videoUrl',
      displayName: 'Video URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the video to post'
    },
    {
      name: 'scheduled',
      displayName: 'Scheduled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to schedule the post for later'
    },
    {
      name: 'scheduledTime',
      displayName: 'Scheduled Time',
      type: 'string',
      required: false,
      default: '',
      description: 'When to publish the post (Unix timestamp)'
    },
    {
      name: 'published',
      displayName: 'Published',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to publish the post immediately'
    },
    {
      name: 'targeting',
      displayName: 'Targeting',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object for post targeting options'
    },
    {
      name: 'eventName',
      displayName: 'Event Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the event'
    },
    {
      name: 'eventDescription',
      displayName: 'Event Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description of the event'
    },
    {
      name: 'startTime',
      displayName: 'Start Time',
      type: 'string',
      required: false,
      default: '',
      description: 'Event start time (ISO 8601 format)'
    },
    {
      name: 'endTime',
      displayName: 'End Time',
      type: 'string',
      required: false,
      default: '',
      description: 'Event end time (ISO 8601 format)'
    },
    {
      name: 'location',
      displayName: 'Location',
      type: 'string',
      required: false,
      default: '',
      description: 'Event location'
    },
    {
      name: 'commentText',
      displayName: 'Comment Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text of the comment'
    },
    {
      name: 'recipientId',
      displayName: 'Recipient ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the message recipient'
    },
    {
      name: 'metric',
      displayName: 'Metric',
      type: 'options',
      required: false,
      default: 'page_impressions',
      description: 'The metric to retrieve for insights',
      options: [
        { name: 'Page Impressions', value: 'page_impressions', description: 'Total page impressions' },
        { name: 'Page Reach', value: 'page_reach', description: 'Total page reach' },
        { name: 'Page Fans', value: 'page_fans', description: 'Total page fans' },
        { name: 'Page Engagement', value: 'page_engagement', description: 'Page engagement' },
        { name: 'Post Impressions', value: 'post_impressions', description: 'Post impressions' },
        { name: 'Post Reach', value: 'post_reach', description: 'Post reach' },
        { name: 'Post Engagement', value: 'post_engagement', description: 'Post engagement' },
        { name: 'Video Views', value: 'video_views', description: 'Video view count' }
      ]
    },
    {
      name: 'period',
      displayName: 'Period',
      type: 'options',
      required: false,
      default: 'day',
      description: 'Time period for insights data',
      options: [
        { name: 'Day', value: 'day', description: 'Daily data' },
        { name: 'Week', value: 'week', description: 'Weekly data' },
        { name: 'Days 28', value: 'days_28', description: '28-day data' },
        { name: 'Month', value: 'month', description: 'Monthly data' },
        { name: 'Lifetime', value: 'lifetime', description: 'Lifetime data' }
      ]
    },
    {
      name: 'since',
      displayName: 'Since Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Start date for insights (YYYY-MM-DD)'
    },
    {
      name: 'until',
      displayName: 'Until Date',
      type: 'string',
      required: false,
      default: '',
      description: 'End date for insights (YYYY-MM-DD)'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 25,
      description: 'Maximum number of results to return'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The Facebook API response data'
    }
  ],
  credentials: ['facebookGraphApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Post',
      description: 'Create a simple text post on Facebook page',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'post',
              operation: 'create',
              pageId: '123456789',
              message: 'Hello from n8n automation! 🚀 #automation #facebook',
              published: true
            }
          }
        ]
      }
    },
    {
      name: 'Post with Image',
      description: 'Create a post with an image attachment',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'post',
              operation: 'create',
              pageId: '123456789',
              message: 'Check out our latest product! 📸',
              imageUrl: 'https://example.com/image.jpg',
              published: true
            }
          }
        ]
      }
    },
    {
      name: 'Schedule Post',
      description: 'Schedule a post for later publication',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'post',
              operation: 'create',
              pageId: '123456789',
              message: 'Good morning! Starting the week strong 💪',
              scheduled: true,
              scheduledTime: '1672531200',
              published: false
            }
          }
        ]
      }
    },
    {
      name: 'Get Page Insights',
      description: 'Get page performance insights',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'insights',
              operation: 'getPageInsights',
              pageId: '123456789',
              metric: 'page_impressions',
              period: 'week',
              since: '2024-01-01',
              until: '2024-01-31'
            }
          }
        ]
      }
    },
    {
      name: 'Create Event',
      description: 'Create a Facebook event',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'event',
              operation: 'createEvent',
              pageId: '123456789',
              eventName: 'Product Launch Webinar',
              eventDescription: 'Join us for an exclusive look at our new product features!',
              startTime: '2024-07-15T10:00:00-07:00',
              endTime: '2024-07-15T11:00:00-07:00',
              location: 'Online Webinar'
            }
          }
        ]
      }
    },
    {
      name: 'Get Post Comments',
      description: 'Retrieve comments from a specific post',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'comment',
              operation: 'getComments',
              postId: '123456789_987654321',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Send Messenger Message',
      description: 'Send a message via Facebook Messenger',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'message',
              operation: 'sendMessage',
              recipientId: '123456789',
              message: 'Thank you for your inquiry! We\'ll get back to you soon.'
            }
          }
        ]
      }
    },
    {
      name: 'Upload Video',
      description: 'Upload a video to Facebook page',
      workflow: {
        nodes: [
          {
            name: 'Facebook',
            type: 'n8n-nodes-base.facebook',
            parameters: {
              resource: 'video',
              operation: 'uploadVideo',
              pageId: '123456789',
              videoUrl: 'https://example.com/video.mp4',
              message: 'Watch our latest tutorial video! 🎥 #tutorial #howto'
            }
          }
        ]
      }
    }
  ]
};

// Export Facebook post targeting options
export const facebookTargeting = {
  geoLocations: ['countries', 'regions', 'cities'],
  demographics: ['age_min', 'age_max', 'genders'],
  interests: ['interests', 'behaviors', 'connections'],
  locales: ['locales']
};

// Export Facebook insights metrics
export const facebookMetrics = [
  'page_impressions',
  'page_reach',
  'page_fans',
  'page_engagement',
  'post_impressions',
  'post_reach',
  'post_engagement',
  'video_views',
  'page_views_total',
  'page_actions',
  'page_posts_impressions'
];

// Export common Facebook operations
export const facebookOperations = [
  'create_post',
  'get_page_insights',
  'upload_photo',
  'create_event',
  'send_message',
  'get_comments',
  'schedule_post',
  'get_leads'
];