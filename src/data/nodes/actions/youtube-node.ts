import { NodeTypeInfo } from '../../node-types.js';

export const youtubeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.youtube',
  displayName: 'YouTube',
  description: 'Use the YouTube node to automate work in YouTube, and integrate YouTube with other applications. n8n supports uploading videos, managing playlists, getting analytics, and working with YouTube Data API v3.',
  category: 'Communication',
  subcategory: 'Social Media',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'video',
      description: 'The resource to operate on',
      options: [
        { name: 'Video', value: 'video', description: 'Work with videos' },
        { name: 'Channel', value: 'channel', description: 'Manage channels' },
        { name: 'Playlist', value: 'playlist', description: 'Work with playlists' },
        { name: 'Search', value: 'search', description: 'Search YouTube content' },
        { name: 'Comment', value: 'comment', description: 'Manage comments' },
        { name: 'Subscription', value: 'subscription', description: 'Handle subscriptions' },
        { name: 'Analytics', value: 'analytics', description: 'Get YouTube Analytics data' },
        { name: 'Live Stream', value: 'liveStream', description: 'Manage live streams' },
        { name: 'Community Post', value: 'communityPost', description: 'Work with community posts' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        // Video operations
        { name: 'Upload Video', value: 'upload', description: 'Upload a video to YouTube' },
        { name: 'Update Video', value: 'update', description: 'Update video metadata' },
        { name: 'Delete Video', value: 'delete', description: 'Delete a video' },
        { name: 'Get Video', value: 'get', description: 'Get video information' },
        { name: 'Get Many Videos', value: 'getAll', description: 'Get multiple videos' },
        { name: 'Rate Video', value: 'rate', description: 'Like or dislike a video' },
        { name: 'Get Video Statistics', value: 'getStats', description: 'Get video statistics' },
        // Channel operations
        { name: 'Get Channel', value: 'getChannel', description: 'Get channel information' },
        { name: 'Get Channel Videos', value: 'getChannelVideos', description: 'Get videos from a channel' },
        { name: 'Get Channel Playlists', value: 'getChannelPlaylists', description: 'Get playlists from a channel' },
        { name: 'Subscribe to Channel', value: 'subscribe', description: 'Subscribe to a channel' },
        { name: 'Unsubscribe from Channel', value: 'unsubscribe', description: 'Unsubscribe from a channel' },
        // Playlist operations
        { name: 'Create Playlist', value: 'createPlaylist', description: 'Create a new playlist' },
        { name: 'Update Playlist', value: 'updatePlaylist', description: 'Update playlist information' },
        { name: 'Delete Playlist', value: 'deletePlaylist', description: 'Delete a playlist' },
        { name: 'Get Playlist', value: 'getPlaylist', description: 'Get playlist information' },
        { name: 'Add to Playlist', value: 'addToPlaylist', description: 'Add video to playlist' },
        { name: 'Remove from Playlist', value: 'removeFromPlaylist', description: 'Remove video from playlist' },
        { name: 'Get Playlist Items', value: 'getPlaylistItems', description: 'Get videos in a playlist' },
        // Search operations
        { name: 'Search Videos', value: 'searchVideos', description: 'Search for videos' },
        { name: 'Search Channels', value: 'searchChannels', description: 'Search for channels' },
        { name: 'Search Playlists', value: 'searchPlaylists', description: 'Search for playlists' },
        // Comment operations
        { name: 'Get Comments', value: 'getComments', description: 'Get video comments' },
        { name: 'Add Comment', value: 'addComment', description: 'Add a comment to video' },
        { name: 'Reply to Comment', value: 'replyComment', description: 'Reply to a comment' },
        { name: 'Delete Comment', value: 'deleteComment', description: 'Delete a comment' },
        // Analytics operations
        { name: 'Get Analytics Report', value: 'getAnalytics', description: 'Get YouTube Analytics data' },
        // Live Stream operations
        { name: 'Create Live Stream', value: 'createLiveStream', description: 'Create a live stream' },
        { name: 'Start Live Stream', value: 'startLiveStream', description: 'Start a live stream' },
        { name: 'Stop Live Stream', value: 'stopLiveStream', description: 'Stop a live stream' }
      ]
    },
    {
      name: 'videoId',
      displayName: 'Video ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the video to operate on'
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the channel to operate on'
    },
    {
      name: 'playlistId',
      displayName: 'Playlist ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the playlist to operate on'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the video, playlist, or other resource'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'The description text'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of tags'
    },
    {
      name: 'categoryId',
      displayName: 'Category ID',
      type: 'string',
      required: false,
      default: '22',
      description: 'YouTube category ID (22 = People & Blogs)'
    },
    {
      name: 'privacy',
      displayName: 'Privacy Status',
      type: 'options',
      required: false,
      default: 'private',
      description: 'Privacy status of the video',
      options: [
        { name: 'Private', value: 'private', description: 'Only you can see the video' },
        { name: 'Public', value: 'public', description: 'Anyone can see the video' },
        { name: 'Unlisted', value: 'unlisted', description: 'Only people with the link can see' },
        { name: 'Scheduled', value: 'scheduled', description: 'Video will be published at a specific time' }
      ]
    },
    {
      name: 'publishAt',
      displayName: 'Publish At',
      type: 'string',
      required: false,
      default: '',
      description: 'Scheduled publish time (ISO 8601 format)'
    },
    {
      name: 'thumbnailUrl',
      displayName: 'Thumbnail URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the custom thumbnail image'
    },
    {
      name: 'videoFile',
      displayName: 'Video File',
      type: 'string',
      required: false,
      default: '',
      description: 'Path to the video file to upload'
    },
    {
      name: 'searchQuery',
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
      description: 'Search query terms'
    },
    {
      name: 'maxResults',
      displayName: 'Max Results',
      type: 'number',
      required: false,
      default: 25,
      description: 'Maximum number of results to return (1-50)'
    },
    {
      name: 'order',
      displayName: 'Order',
      type: 'options',
      required: false,
      default: 'relevance',
      description: 'How to order search results',
      options: [
        { name: 'Relevance', value: 'relevance', description: 'Most relevant results first' },
        { name: 'Date', value: 'date', description: 'Most recent results first' },
        { name: 'Rating', value: 'rating', description: 'Highest rated results first' },
        { name: 'View Count', value: 'viewCount', description: 'Most viewed results first' },
        { name: 'Title', value: 'title', description: 'Alphabetical by title' }
      ]
    },
    {
      name: 'publishedAfter',
      displayName: 'Published After',
      type: 'string',
      required: false,
      default: '',
      description: 'Only return results published after this date (ISO 8601)'
    },
    {
      name: 'publishedBefore',
      displayName: 'Published Before',
      type: 'string',
      required: false,
      default: '',
      description: 'Only return results published before this date (ISO 8601)'
    },
    {
      name: 'regionCode',
      displayName: 'Region Code',
      type: 'string',
      required: false,
      default: '',
      description: 'ISO 3166-1 alpha-2 country code (e.g., "US", "GB")'
    },
    {
      name: 'language',
      displayName: 'Language',
      type: 'string',
      required: false,
      default: '',
      description: 'ISO 639-1 language code (e.g., "en", "es")'
    },
    {
      name: 'commentText',
      displayName: 'Comment Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text of the comment'
    },
    {
      name: 'parentCommentId',
      displayName: 'Parent Comment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the comment to reply to'
    },
    {
      name: 'rating',
      displayName: 'Rating',
      type: 'options',
      required: false,
      default: 'like',
      description: 'Rating to give to the video',
      options: [
        { name: 'Like', value: 'like', description: 'Like the video' },
        { name: 'Dislike', value: 'dislike', description: 'Dislike the video' },
        { name: 'None', value: 'none', description: 'Remove rating' }
      ]
    },
    {
      name: 'dimensions',
      displayName: 'Dimensions',
      type: 'options',
      required: false,
      default: 'video',
      description: 'Dimensions for analytics report',
      options: [
        { name: 'Video', value: 'video', description: 'Group by video' },
        { name: 'Channel', value: 'channel', description: 'Group by channel' },
        { name: 'Country', value: 'country', description: 'Group by country' },
        { name: 'Device Type', value: 'deviceType', description: 'Group by device type' }
      ]
    },
    {
      name: 'metrics',
      displayName: 'Metrics',
      type: 'string',
      required: false,
      default: 'views,estimatedMinutesWatched,averageViewDuration',
      description: 'Comma-separated list of metrics to retrieve'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Start date for analytics (YYYY-MM-DD)'
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      type: 'string',
      required: false,
      default: '',
      description: 'End date for analytics (YYYY-MM-DD)'
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
      description: 'The YouTube API response data'
    }
  ],
  credentials: ['youTubeOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Upload Video',
      description: 'Upload a video to YouTube with metadata',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'video',
              operation: 'upload',
              title: 'My Awesome Video',
              description: 'This is a video uploaded via n8n automation!',
              tags: 'automation,n8n,youtube,tutorial',
              privacy: 'public',
              categoryId: '22',
              videoFile: '/path/to/video.mp4'
            }
          }
        ]
      }
    },
    {
      name: 'Search Popular Videos',
      description: 'Search for popular videos on a specific topic',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'search',
              operation: 'searchVideos',
              searchQuery: 'automation tutorial',
              maxResults: 10,
              order: 'viewCount',
              publishedAfter: '2024-01-01T00:00:00Z'
            }
          }
        ]
      }
    },
    {
      name: 'Create Playlist',
      description: 'Create a new YouTube playlist',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'playlist',
              operation: 'createPlaylist',
              title: 'Automation Tutorials',
              description: 'A collection of the best automation tutorials',
              privacy: 'public'
            }
          }
        ]
      }
    },
    {
      name: 'Get Channel Analytics',
      description: 'Get analytics data for your YouTube channel',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'analytics',
              operation: 'getAnalytics',
              dimensions: 'video',
              metrics: 'views,estimatedMinutesWatched,likes,comments',
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Video Comments',
      description: 'Get comments from a specific video',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'comment',
              operation: 'getComments',
              videoId: 'dQw4w9WgXcQ',
              maxResults: 50,
              order: 'time'
            }
          }
        ]
      }
    },
    {
      name: 'Add Video to Playlist',
      description: 'Add a video to an existing playlist',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'playlist',
              operation: 'addToPlaylist',
              playlistId: 'PLxxxxxxxxxxxxxxxxxxxxxx',
              videoId: 'dQw4w9WgXcQ'
            }
          }
        ]
      }
    },
    {
      name: 'Get Channel Videos',
      description: 'Get all videos from a specific channel',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'channel',
              operation: 'getChannelVideos',
              channelId: 'UCxxxxxxxxxxxxxxxxxxxxxx',
              maxResults: 50,
              order: 'date'
            }
          }
        ]
      }
    },
    {
      name: 'Scheduled Video Upload',
      description: 'Upload a video and schedule it for later publication',
      workflow: {
        nodes: [
          {
            name: 'YouTube',
            type: 'n8n-nodes-base.youtube',
            parameters: {
              resource: 'video',
              operation: 'upload',
              title: 'Weekly Update - Episode 15',
              description: 'This week we discuss the latest features...',
              tags: 'weekly,update,news',
              privacy: 'scheduled',
              publishAt: '2024-06-20T09:00:00Z',
              categoryId: '22',
              videoFile: '/path/to/weekly-update.mp4'
            }
          }
        ]
      }
    }
  ]
};

export const youtubeTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.youtubeTrigger',
  displayName: 'YouTube Trigger',
  description: 'Triggers the workflow when specific YouTube events occur, such as new videos, comments, or subscription changes.',
  category: 'Communication',
  subcategory: 'Social Media',
  properties: [
    {
      name: 'triggerType',
      displayName: 'Trigger Type',
      type: 'options',
      required: true,
      default: 'newVideo',
      description: 'Type of YouTube event to trigger on',
      options: [
        { name: 'New Video', value: 'newVideo', description: 'When a channel uploads a new video' },
        { name: 'New Comment', value: 'newComment', description: 'When a new comment is posted' },
        { name: 'New Subscriber', value: 'newSubscriber', description: 'When someone subscribes to a channel' },
        { name: 'Video Milestone', value: 'videoMilestone', description: 'When a video reaches view/like milestones' },
        { name: 'Live Stream Start', value: 'liveStreamStart', description: 'When a live stream starts' }
      ]
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      default: '',
      description: 'YouTube channel ID to monitor'
    },
    {
      name: 'videoId',
      displayName: 'Video ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific video ID to monitor for comments'
    },
    {
      name: 'pollInterval',
      displayName: 'Poll Interval',
      type: 'number',
      required: false,
      default: 300,
      description: 'How often to check for new events (in seconds)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when YouTube events occur'
    }
  ],
  credentials: ['youTubeOAuth2Api'],
  triggerNode: true,
  polling: true,
  examples: [
    {
      name: 'New Video Alert',
      description: 'Trigger when a specific channel uploads a new video',
      workflow: {
        nodes: [
          {
            name: 'YouTube Trigger',
            type: 'n8n-nodes-base.youtubeTrigger',
            parameters: {
              triggerType: 'newVideo',
              channelId: 'UCxxxxxxxxxxxxxxxxxxxxxx',
              pollInterval: 300
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const youtubeNodes: NodeTypeInfo[] = [youtubeNode, youtubeTriggerNode];

// Export YouTube video categories
export const youtubeCategories = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology'
};

// Export common YouTube operations
export const youtubeOperations = [
  'upload_video',
  'search_videos',
  'get_channel_info',
  'create_playlist',
  'add_to_playlist',
  'get_comments',
  'get_analytics',
  'subscribe_channel',
  'rate_video'
];