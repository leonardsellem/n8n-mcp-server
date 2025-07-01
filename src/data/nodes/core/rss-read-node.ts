/**
 * # RSS Read
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Fetching
 * 
 * ## Description
 * 
 * Use the RSS Read node to read data from RSS feeds published on the internet.
 * 
 * ## Node Parameters
 * 
 * ### URL
 * Enter the URL for the RSS publication you want to read.
 * 
 * ## Node Options
 * 
 * ### Ignore SSL Issues
 * Choose whether n8n should ignore SSL/TLS verification.
 * - **On**: Ignores SSL issues (useful for feeds with self-signed certificates).
 * - **Off**: Enforces SSL verification (default).
 * 
 * ## Key Features
 * 
 * - **RSS Feed Parsing**: Automatically parses RSS and Atom feeds
 * - **Content Extraction**: Extracts titles, links, descriptions, and other metadata
 * - **Easy Configuration**: Simple URL-based setup
 * - **SSL Control**: Option to bypass SSL verification for development or private feeds
 * 
 * ## Use Cases
 * 
 * - **Content Aggregation**: Collect articles and posts from various news sources and blogs
 * - **Social Media Automation**: Automatically share new blog posts to social media channels
 * - **Data Enrichment**: Enrich other data with information from relevant RSS feeds
 * - **Website Monitoring**: Monitor websites for new content updates
 * - **Content Curation**: Curate content for newsletters or websites
 */

import { NodeTypeInfo } from '../../node-types.js';

export const rssReadNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rssRead',
  displayName: 'RSS Read',
  description: 'Read data from RSS feeds',
  category: 'Core Nodes',
  subcategory: 'Data Fetching',
  
  properties: [
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: true,
      default: '',
      description: 'The URL of the RSS feed to read',
      placeholder: 'https://n8n.io/blog/rss/'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for reading the RSS feed',
      options: [
        {
          name: 'ignoreSslIssues',
          displayName: 'Ignore SSL Issues',
          type: 'boolean',
          default: false,
          description: 'Whether to ignore SSL/TLS verification issues'
        }
      ]
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
      displayName: 'Feed Items',
      description: 'The items from the RSS feed'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'RSS Read'
  },

  aliases: ['rss', 'feed', 'atom'],
  
  examples: [
    {
      name: 'Read n8n Blog Feed',
      description: 'Fetch the latest articles from the n8n blog RSS feed',
      workflow: {
        nodes: [
          {
            name: 'Read n8n Blog',
            type: 'n8n-nodes-base.rssRead',
            parameters: {
              url: 'https://n8n.io/blog/rss/'
            }
          }
        ]
      }
    },
    {
      name: 'Read Multiple Feeds',
      description: 'Read items from multiple RSS feeds in a single workflow',
      workflow: {
        nodes: [
          {
            name: 'Feed URLs',
            type: 'n8n-nodes-base.code',
            parameters: {
              code: 'return [{ json: { url: "https://n8n.io/blog/rss/" } }, { json: { url: "https://dev.to/feed/n8n" } }];'
            }
          },
          {
            name: 'Loop Over Feeds',
            type: 'n8n-nodes-base.loopOverItems',
            parameters: {
              batchSize: 1
            }
          },
          {
            name: 'Read RSS Feed',
            type: 'n8n-nodes-base.rssRead',
            parameters: {
              url: '{{ $json.url }}'
            }
          }
        ]
      }
    }
  ]
};

export default rssReadNode;
