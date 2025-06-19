import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const oneSimpleApiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.oneSimpleApi',
  displayName: 'One Simple API',
  description: 'Use the One Simple API node to automate work in One Simple API, and integrate One Simple API with other applications. n8n has built-in support for a wide range of One Simple API features, including getting profiles, retrieving information, and generating utilities.',
  category: 'Utility',
  subcategory: 'Development',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'information',
      description: 'The One Simple API resource to operate on',
      options: [
        { name: 'Information', value: 'information', description: 'Access information and utility operations' },
        { name: 'Social Profile', value: 'socialProfile', description: 'Access social profile operations' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'convertCurrency',
      description: 'The operation to perform',
      options: [
        // Information operations
        { name: 'Convert Currency', value: 'convertCurrency', description: 'Convert a value between currencies' },
        { name: 'Retrieve Image Metadata', value: 'getImageMetadata', description: 'Retrieve image metadata from a URL' },
        // Social Profile operations
        { name: 'Get Social Profile', value: 'getSocialProfile', description: 'Get social profile information' },
        { name: 'Validate Profile', value: 'validateProfile', description: 'Validate social profile data' }
      ]
    },
    {
      name: 'fromCurrency',
      displayName: 'From Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'The currency to convert from (3-letter currency code)'
    },
    {
      name: 'toCurrency',
      displayName: 'To Currency',
      type: 'string',
      required: false,
      default: 'EUR',
      description: 'The currency to convert to (3-letter currency code)'
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'number',
      required: false,
      default: 1,
      description: 'The amount to convert'
    },
    {
      name: 'imageUrl',
      displayName: 'Image URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the image to retrieve metadata from'
    },
    {
      name: 'profileUrl',
      displayName: 'Profile URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the social profile to analyze'
    },
    {
      name: 'platform',
      displayName: 'Platform',
      type: 'options',
      required: false,
      default: 'twitter',
      description: 'Social media platform',
      options: [
        { name: 'Twitter', value: 'twitter', description: 'Twitter platform' },
        { name: 'LinkedIn', value: 'linkedin', description: 'LinkedIn platform' },
        { name: 'Instagram', value: 'instagram', description: 'Instagram platform' },
        { name: 'Facebook', value: 'facebook', description: 'Facebook platform' },
        { name: 'GitHub', value: 'github', description: 'GitHub platform' }
      ]
    },
    {
      name: 'includeDetails',
      displayName: 'Include Details',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Include detailed information in the response'
    },
    {
      name: 'format',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'Format of the output data',
      options: [
        { name: 'JSON', value: 'json', description: 'JSON format' },
        { name: 'XML', value: 'xml', description: 'XML format' },
        { name: 'CSV', value: 'csv', description: 'CSV format' }
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
      displayName: 'Output',
      description: 'The processed One Simple API data'
    }
  ],
  credentials: ['oneSimpleApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Convert Currency',
      description: 'Convert USD to EUR using current exchange rates',
      workflow: {
        nodes: [
          {
            name: 'One Simple API',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'information',
              operation: 'convertCurrency',
              fromCurrency: 'USD',
              toCurrency: 'EUR',
              amount: 100
            }
          }
        ]
      }
    },
    {
      name: 'Get Image Metadata',
      description: 'Retrieve metadata from an image URL',
      workflow: {
        nodes: [
          {
            name: 'One Simple API',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'information',
              operation: 'getImageMetadata',
              imageUrl: 'https://example.com/image.jpg',
              includeDetails: true
            }
          }
        ]
      }
    },
    {
      name: 'Get Social Profile Information',
      description: 'Analyze a Twitter profile and extract information',
      workflow: {
        nodes: [
          {
            name: 'One Simple API',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'socialProfile',
              operation: 'getSocialProfile',
              profileUrl: 'https://twitter.com/username',
              platform: 'twitter',
              includeDetails: true
            }
          }
        ]
      }
    },
    {
      name: 'Validate LinkedIn Profile',
      description: 'Validate and extract data from a LinkedIn profile',
      workflow: {
        nodes: [
          {
            name: 'One Simple API',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'socialProfile',
              operation: 'validateProfile',
              profileUrl: 'https://linkedin.com/in/username',
              platform: 'linkedin',
              format: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Multiple Currency Conversion',
      description: 'Convert multiple amounts between different currencies',
      workflow: {
        nodes: [
          {
            name: 'One Simple API - USD to EUR',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'information',
              operation: 'convertCurrency',
              fromCurrency: 'USD',
              toCurrency: 'EUR',
              amount: 500
            }
          },
          {
            name: 'One Simple API - EUR to GBP',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'information',
              operation: 'convertCurrency',
              fromCurrency: 'EUR',
              toCurrency: 'GBP',
              amount: '{{$json["converted_amount"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Social Media Analysis Pipeline',
      description: 'Analyze multiple social media profiles from different platforms',
      workflow: {
        nodes: [
          {
            name: 'Analyze Twitter Profile',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'socialProfile',
              operation: 'getSocialProfile',
              profileUrl: '{{$json["twitter_url"]}}',
              platform: 'twitter',
              includeDetails: true
            }
          },
          {
            name: 'Analyze GitHub Profile',
            type: 'n8n-nodes-base.oneSimpleApi',
            parameters: {
              resource: 'socialProfile',
              operation: 'getSocialProfile',
              profileUrl: '{{$json["github_url"]}}',
              platform: 'github',
              includeDetails: true
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the One Simple API node
export const oneSimpleApiActions = [
  // Information operations
  'convert_currency',
  'get_image_metadata',
  // Social Profile operations
  'get_social_profile',
  'validate_profile'
];

// Export One Simple API data categories
export const oneSimpleApiCategories = [
  'currency_conversion',
  'image_metadata',
  'social_profiles',
  'profile_validation',
  'data_utilities'
];

// Export supported platforms
export const oneSimpleApiPlatforms = [
  'twitter',
  'linkedin',
  'instagram',
  'facebook',
  'github'
];

// Export supported currencies (common ones)
export const oneSimpleApiCurrencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
  'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'ZAR', 'BRL', 'INR', 'KRW', 'RUB'
];

// Export output formats
export const oneSimpleApiFormats = [
  'json',
  'xml',
  'csv'
];