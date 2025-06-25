import { NodeTypeInfo } from '../node-types.js';

export const peekalinkNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.peekalink',
  displayName: 'Peekalink',
  description: 'Use the Peekalink node to automate work in Peekalink, and integrate Peekalink with other applications. n8n supports checking, and reviewing links with Peekalink.',
  category: 'Productivity',
  subcategory: 'Content & Files',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'getPreview',
      description: 'The operation to perform',
      options: [
        { name: 'Check Availability', value: 'checkAvailability', description: 'Check whether preview for a given link is available' },
        { name: 'Get Preview', value: 'getPreview', description: 'Return the preview for a link' }
      ]
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: true,
      default: '',
      description: 'The URL to process'
    },
    {
      name: 'includeMetadata',
      displayName: 'Include Metadata',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include additional metadata in the response'
    },
    {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 30,
      description: 'Request timeout in seconds'
    },
    {
      name: 'userAgent',
      displayName: 'User Agent',
      type: 'string',
      required: false,
      default: '',
      description: 'Custom user agent string to use for the request'
    },
    {
      name: 'followRedirects',
      displayName: 'Follow Redirects',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to follow HTTP redirects'
    },
    {
      name: 'format',
      displayName: 'Response Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'The format of the response data',
      options: [
        { name: 'JSON', value: 'json', description: 'Return data as JSON object' },
        { name: 'Simplified', value: 'simplified', description: 'Return simplified preview data' }
      ]
    },
    {
      name: 'enableImages',
      displayName: 'Enable Images',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to extract and include image previews'
    },
    {
      name: 'enableVideos',
      displayName: 'Enable Videos',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to extract and include video previews'
    },
    {
      name: 'maxContentLength',
      displayName: 'Max Content Length',
      type: 'number',
      required: false,
      default: 1000,
      description: 'Maximum length of content to extract'
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
      description: 'The processed Peekalink data'
    }
  ],
  credentials: ['peekalink'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Link Preview',
      description: 'Get a preview of a webpage using Peekalink',
      workflow: {
        nodes: [
          {
            name: 'Peekalink',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'getPreview',
              url: 'https://example.com',
              includeMetadata: true,
              format: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Check Link Availability',
      description: 'Check if a link preview is available before processing',
      workflow: {
        nodes: [
          {
            name: 'Peekalink',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'checkAvailability',
              url: '{{$json["url"]}}',
              timeout: 10
            }
          }
        ]
      }
    },
    {
      name: 'Bulk Link Processing',
      description: 'Process multiple URLs and get their previews',
      workflow: {
        nodes: [
          {
            name: 'Peekalink',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'getPreview',
              url: '{{$json["link"]}}',
              includeMetadata: true,
              format: 'simplified',
              enableImages: true,
              enableVideos: false,
              maxContentLength: 500
            }
          }
        ]
      }
    },
    {
      name: 'Social Media Link Preview',
      description: 'Get rich previews for social media sharing',
      workflow: {
        nodes: [
          {
            name: 'Peekalink',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'getPreview',
              url: '{{$json["socialUrl"]}}',
              includeMetadata: true,
              format: 'json',
              followRedirects: true,
              enableImages: true,
              enableVideos: true,
              maxContentLength: 300
            }
          }
        ]
      }
    },
    {
      name: 'Link Validation Workflow',
      description: 'Validate and preview links in a two-step process',
      workflow: {
        nodes: [
          {
            name: 'Check Availability',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'checkAvailability',
              url: '{{$json["urlToCheck"]}}',
              timeout: 15
            }
          },
          {
            name: 'Get Preview',
            type: 'n8n-nodes-base.peekalink',
            parameters: {
              operation: 'getPreview',
              url: '{{$json["urlToCheck"]}}',
              includeMetadata: true,
              format: 'json'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Peekalink node
export const peekalinkActions = [
  'check_availability',
  'get_preview'
];

// Export metadata for easier reference
export const peekalinkMetadata = {
  apiDocumentation: 'https://docs.peekalink.io/',
  officialWebsite: 'https://www.peekalink.io/',
  integrationTemplates: 'https://n8n.io/integrations/peekalink/',
  authenticationMethod: 'API Key',
  category: 'Content Processing',
  supportedOperations: [
    'Check link preview availability',
    'Get link preview data'
  ]
};