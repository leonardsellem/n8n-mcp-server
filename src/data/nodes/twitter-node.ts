import { NodeTypeInfo } from '../node-types.js';

export const twitterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twitter',
  displayName: 'Twitter',
  description: 'Use the Twitter node to automate work in Twitter, and integrate Twitter with other applications. n8n supports posting tweets, searching, managing followers, and accessing Twitter API v2 features.',
  category: 'Communication',
  subcategory: 'Social Media',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'tweet',
      description: 'The resource to operate on',
      options: [
        { name: 'Tweet', value: 'tweet', description: 'Work with tweets' },
        { name: 'User', value: 'user', description: 'Manage users and profiles' },
        { name: 'Direct Message', value: 'directMessage', description: 'Handle direct messages' },
        { name: 'List', value: 'list', description: 'Manage Twitter lists' },
        { name: 'Search', value: 'search', description: 'Search tweets and users' },
        { name: 'Space', value: 'space', description: 'Work with Twitter Spaces' },
        { name: 'Media', value: 'media', description: 'Upload and manage media' }
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
        // Tweet operations
        { name: 'Create Tweet', value: 'create', description: 'Post a new tweet' },
        { name: 'Delete Tweet', value: 'delete', description: 'Delete a tweet' },
        { name: 'Get Tweet', value: 'get', description: 'Get a specific tweet' },
        { name: 'Like Tweet', value: 'like', description: 'Like a tweet' },
        { name: 'Unlike Tweet', value: 'unlike', description: 'Remove like from a tweet' },
        { name: 'Retweet', value: 'retweet', description: 'Retweet a tweet' },
        { name: 'Unretweet', value: 'unretweet', description: 'Remove retweet' },
        { name: 'Reply to Tweet', value: 'reply', description: 'Reply to a tweet' },
        { name: 'Quote Tweet', value: 'quote', description: 'Quote tweet with comment' },
        // User operations
        { name: 'Follow User', value: 'follow', description: 'Follow a user' },
        { name: 'Unfollow User', value: 'unfollow', description: 'Unfollow a user' },
        { name: 'Get User', value: 'getUser', description: 'Get user information' },
        { name: 'Get Followers', value: 'getFollowers', description: 'Get user followers' },
        { name: 'Get Following', value: 'getFollowing', description: 'Get users being followed' },
        { name: 'Block User', value: 'block', description: 'Block a user' },
        { name: 'Unblock User', value: 'unblock', description: 'Unblock a user' },
        { name: 'Mute User', value: 'mute', description: 'Mute a user' },
        { name: 'Unmute User', value: 'unmute', description: 'Unmute a user' },
        // Search operations
        { name: 'Search Tweets', value: 'searchTweets', description: 'Search for tweets' },
        { name: 'Search Users', value: 'searchUsers', description: 'Search for users' },
        // Direct Message operations
        { name: 'Send Direct Message', value: 'sendDM', description: 'Send a direct message' },
        { name: 'Get Direct Messages', value: 'getDMs', description: 'Get direct messages' },
        // List operations
        { name: 'Create List', value: 'createList', description: 'Create a new list' },
        { name: 'Delete List', value: 'deleteList', description: 'Delete a list' },
        { name: 'Add to List', value: 'addToList', description: 'Add user to list' },
        { name: 'Remove from List', value: 'removeFromList', description: 'Remove user from list' },
        { name: 'Get List Members', value: 'getListMembers', description: 'Get list members' },
        { name: 'Get List Tweets', value: 'getListTweets', description: 'Get tweets from list' },
        // Media operations
        { name: 'Upload Media', value: 'uploadMedia', description: 'Upload media (image/video)' }
      ]
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text content of the tweet or message'
    },
    {
      name: 'tweetId',
      displayName: 'Tweet ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the tweet to operate on'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'The username (without @) of the user'
    },
    {
      name: 'searchQuery',
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
      description: 'Search query using Twitter search syntax'
    },
    {
      name: 'mediaIds',
      displayName: 'Media IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of media IDs to attach'
    },
    {
      name: 'replyToTweetId',
      displayName: 'Reply to Tweet ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the tweet to reply to'
    },
    {
      name: 'quoteTweetId',
      displayName: 'Quote Tweet ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the tweet to quote'
    },
    {
      name: 'includeRetweets',
      displayName: 'Include Retweets',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include retweets in results'
    },
    {
      name: 'includeReplies',
      displayName: 'Include Replies',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include replies in results'
    },
    {
      name: 'maxResults',
      displayName: 'Max Results',
      type: 'number',
      required: false,
      default: 10,
      description: 'Maximum number of results to return (1-100)'
    },
    {
      name: 'resultType',
      displayName: 'Result Type',
      type: 'options',
      required: false,
      default: 'recent',
      description: 'Type of search results to return',
      options: [
        { name: 'Recent', value: 'recent', description: 'Most recent tweets' },
        { name: 'Popular', value: 'popular', description: 'Most popular tweets' },
        { name: 'Mixed', value: 'mixed', description: 'Mix of popular and recent' }
      ]
    },
    {
      name: 'lang',
      displayName: 'Language',
      type: 'string',
      required: false,
      default: '',
      description: 'Language code to filter results (e.g., "en", "es", "fr")'
    },
    {
      name: 'listName',
      displayName: 'List Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the list'
    },
    {
      name: 'listDescription',
      displayName: 'List Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description of the list'
    },
    {
      name: 'listPrivate',
      displayName: 'Private List',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the list should be private'
    },
    {
      name: 'pollDuration',
      displayName: 'Poll Duration',
      type: 'number',
      required: false,
      default: 1440,
      description: 'Poll duration in minutes (up to 10080 for 7 days)'
    },
    {
      name: 'pollOptions',
      displayName: 'Poll Options',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated poll options (2-4 options)'
    },
    {
      name: 'geotagged',
      displayName: 'Geotagged',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Only return geotagged tweets'
    },
    {
      name: 'verified',
      displayName: 'Verified Only',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Only return tweets from verified accounts'
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
      description: 'The Twitter API response data'
    }
  ],
  credentials: ['twitterOAuth2Api', 'twitterApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Post Simple Tweet',
      description: 'Post a basic tweet to your timeline',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'tweet',
              operation: 'create',
              text: 'Hello from n8n! 🚀 #automation #n8n'
            }
          }
        ]
      }
    },
    {
      name: 'Search Recent Tweets',
      description: 'Search for recent tweets about a specific topic',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'search',
              operation: 'searchTweets',
              searchQuery: '#n8n OR #automation -is:retweet',
              maxResults: 20,
              resultType: 'recent',
              lang: 'en'
            }
          }
        ]
      }
    },
    {
      name: 'Reply to Tweet',
      description: 'Reply to a specific tweet',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'tweet',
              operation: 'reply',
              text: 'Thanks for sharing! This is very helpful. 👍',
              replyToTweetId: '1234567890123456789'
            }
          }
        ]
      }
    },
    {
      name: 'Post Tweet with Media',
      description: 'Post a tweet with an attached image',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'tweet',
              operation: 'create',
              text: 'Check out this awesome automation! 🤖',
              mediaIds: '1234567890123456789'
            }
          }
        ]
      }
    },
    {
      name: 'Get User Followers',
      description: 'Get the followers of a specific user',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'user',
              operation: 'getFollowers',
              username: 'n8nio',
              maxResults: 50
            }
          }
        ]
      }
    },
    {
      name: 'Create Twitter Poll',
      description: 'Post a tweet with a poll',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'tweet',
              operation: 'create',
              text: 'What\'s your favorite automation tool? 🤔',
              pollOptions: 'n8n,Zapier,Make,Power Automate',
              pollDuration: 1440
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Brand Mentions',
      description: 'Search for mentions of your brand or product',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'search',
              operation: 'searchTweets',
              searchQuery: '(@yourbrand OR "your product name") -from:yourbrand',
              maxResults: 50,
              resultType: 'recent'
            }
          }
        ]
      }
    },
    {
      name: 'Create and Manage List',
      description: 'Create a Twitter list and add users to it',
      workflow: {
        nodes: [
          {
            name: 'Twitter',
            type: 'n8n-nodes-base.twitter',
            parameters: {
              resource: 'list',
              operation: 'createList',
              listName: 'Automation Experts',
              listDescription: 'People who share great automation content',
              listPrivate: false
            }
          }
        ]
      }
    }
  ]
};

export const twitterTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twitterTrigger',
  displayName: 'Twitter Trigger',
  description: 'Triggers the workflow when specific Twitter events occur, such as new tweets, mentions, or followers.',
  category: 'Communication',
  subcategory: 'Social Media',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'userTweet',
      description: 'The Twitter event to trigger on',
      options: [
        { name: 'New Tweet from User', value: 'userTweet', description: 'When a specific user posts a new tweet' },
        { name: 'Mention', value: 'mention', description: 'When your account is mentioned' },
        { name: 'New Follower', value: 'newFollower', description: 'When someone follows your account' },
        { name: 'Direct Message', value: 'directMessage', description: 'When you receive a direct message' },
        { name: 'Keyword Search', value: 'keywordSearch', description: 'When tweets matching keywords are posted' },
        { name: 'Hashtag', value: 'hashtag', description: 'When tweets with specific hashtags are posted' },
        { name: 'Tweet Liked', value: 'tweetLiked', description: 'When your tweets are liked' },
        { name: 'Tweet Retweeted', value: 'tweetRetweeted', description: 'When your tweets are retweeted' }
      ]
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'Username to monitor (without @)'
    },
    {
      name: 'searchTerms',
      displayName: 'Search Terms',
      type: 'string',
      required: false,
      default: '',
      description: 'Keywords or hashtags to monitor (comma-separated)'
    },
    {
      name: 'includeReplies',
      displayName: 'Include Replies',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include replies in the trigger'
    },
    {
      name: 'includeRetweets',
      displayName: 'Include Retweets',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include retweets in the trigger'
    },
    {
      name: 'lang',
      displayName: 'Language',
      type: 'string',
      required: false,
      default: '',
      description: 'Language code to filter tweets (e.g., "en", "es")'
    },
    {
      name: 'pollInterval',
      displayName: 'Poll Interval',
      type: 'number',
      required: false,
      default: 60,
      description: 'How often to check for new tweets (in seconds)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Twitter events occur'
    }
  ],
  credentials: ['twitterOAuth2Api', 'twitterApi'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor User Tweets',
      description: 'Trigger when a specific user posts new tweets',
      workflow: {
        nodes: [
          {
            name: 'Twitter Trigger',
            type: 'n8n-nodes-base.twitterTrigger',
            parameters: {
              event: 'userTweet',
              username: 'elonmusk',
              includeReplies: false,
              includeRetweets: false
            }
          }
        ]
      }
    },
    {
      name: 'Brand Mention Alert',
      description: 'Trigger when your brand is mentioned',
      workflow: {
        nodes: [
          {
            name: 'Twitter Trigger',
            type: 'n8n-nodes-base.twitterTrigger',
            parameters: {
              event: 'keywordSearch',
              searchTerms: '@yourbrand, "your company name"',
              lang: 'en'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const twitterNodes: NodeTypeInfo[] = [twitterNode, twitterTriggerNode];

// Export common Twitter operations
export const twitterOperations = [
  'create_tweet',
  'delete_tweet',
  'like_tweet',
  'retweet',
  'reply_tweet',
  'search_tweets',
  'follow_user',
  'get_followers',
  'send_dm',
  'upload_media',
  'create_list'
];

// Export Twitter API v2 features
export const twitterV2Features = [
  'conversation_id',
  'referenced_tweets',
  'public_metrics',
  'organic_metrics',
  'promoted_metrics',
  'context_annotations',
  'entities',
  'geo_data',
  'poll_data',
  'media_attachments'
];