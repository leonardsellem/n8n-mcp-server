import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const npmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.npm',
  displayName: 'NPM',
  description: 'Use the npm node to automate work in npm, and integrate npm with other applications. n8n has built-in support for a wide range of npm features, including getting package metadata, searching for packages, and managing distribution tags.',
  category: 'Development',
  subcategory: 'Package Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'package',
      description: 'The resource to operate on',
      options: [
        { name: 'Package', value: 'package', description: 'Work with npm packages' },
        { name: 'Distribution Tag', value: 'distributionTag', description: 'Manage distribution tags' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'getMetadata',
      description: 'The operation to perform',
      options: [
        // Package operations
        { name: 'Get Package Metadata', value: 'getMetadata', description: 'Get metadata for a package' },
        { name: 'Get Package Versions', value: 'getVersions', description: 'Get all versions of a package' },
        { name: 'Search for Packages', value: 'search', description: 'Search for packages in the npm registry' },
        // Distribution Tag operations
        { name: 'Get All Tags', value: 'getAllTags', description: 'Get all distribution tags for a package' },
        { name: 'Update a Tag', value: 'updateTag', description: 'Update a distribution tag' }
      ]
    },
    {
      name: 'packageName',
      displayName: 'Package Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the npm package'
    },
    {
      name: 'searchText',
      displayName: 'Search Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text to search for in package names and descriptions'
    },
    {
      name: 'version',
      displayName: 'Version',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific version of the package'
    },
    {
      name: 'tagName',
      displayName: 'Tag Name',
      type: 'string',
      required: false,
      default: 'latest',
      description: 'The distribution tag name'
    },
    {
      name: 'tagVersion',
      displayName: 'Tag Version',
      type: 'string',
      required: false,
      default: '',
      description: 'The version to assign to the tag'
    },
    {
      name: 'registry',
      displayName: 'Registry URL',
      type: 'string',
      required: false,
      default: 'https://registry.npmjs.org',
      description: 'The npm registry URL to use'
    },
    {
      name: 'searchSize',
      displayName: 'Search Results Size',
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of search results to return'
    },
    {
      name: 'searchFrom',
      displayName: 'Search From',
      type: 'number',
      required: false,
      default: 0,
      description: 'Offset for search results pagination'
    },
    {
      name: 'quality',
      displayName: 'Quality Weight',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Weight for package quality in search results'
    },
    {
      name: 'popularity',
      displayName: 'Popularity Weight',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Weight for package popularity in search results'
    },
    {
      name: 'maintenance',
      displayName: 'Maintenance Weight',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Weight for package maintenance in search results'
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
      description: 'The processed NPM data'
    }
  ],
  credentials: ['npmApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Package Metadata',
      description: 'Get detailed metadata for an npm package',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'package',
              operation: 'getMetadata',
              packageName: 'express'
            }
          }
        ]
      }
    },
    {
      name: 'Get Package Versions',
      description: 'Get all available versions of a package',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'package',
              operation: 'getVersions',
              packageName: 'lodash'
            }
          }
        ]
      }
    },
    {
      name: 'Search Packages',
      description: 'Search for packages in the npm registry',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'package',
              operation: 'search',
              searchText: 'express middleware',
              searchSize: 10,
              quality: 1.0,
              popularity: 1.0,
              maintenance: 1.0
            }
          }
        ]
      }
    },
    {
      name: 'Get Distribution Tags',
      description: 'Get all distribution tags for a package',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'distributionTag',
              operation: 'getAllTags',
              packageName: 'react'
            }
          }
        ]
      }
    },
    {
      name: 'Update Distribution Tag',
      description: 'Update a distribution tag to point to a specific version',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'distributionTag',
              operation: 'updateTag',
              packageName: 'my-package',
              tagName: 'beta',
              tagVersion: '2.0.0-beta.1'
            }
          }
        ]
      }
    },
    {
      name: 'Search Popular Packages',
      description: 'Search for packages with emphasis on popularity',
      workflow: {
        nodes: [
          {
            name: 'NPM',
            type: 'n8n-nodes-base.npm',
            parameters: {
              resource: 'package',
              operation: 'search',
              searchText: 'testing framework',
              searchSize: 5,
              quality: 0.5,
              popularity: 2.0,
              maintenance: 1.0
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the NPM node
export const npmActions = [
  // Package actions
  'get_package_metadata',
  'get_package_versions',
  'search_packages',
  // Distribution Tag actions
  'get_all_distribution_tags',
  'update_distribution_tag'
];