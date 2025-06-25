/**
 * AWS Certificate Manager Node
 * 
 * Manages AWS Certificate Manager (ACM) resources. You can request new SSL certificates, retrieve details of a certificate, or list certificates in your AWS account. Facilitates automation of certificate provisioning.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awscertificatemanagerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-certificate-manager',
  displayName: 'AWS Certificate Manager',
  description: 'Manages AWS Certificate Manager (ACM) resources. You can request new SSL certificates, retrieve details of a certificate, or list certificates in your AWS account. Facilitates automation of certificate provisioning.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Request Certificate',
      description: 'The operation to perform',
      options: [
        { name: 'Request Certificate', value: 'Request Certificate' },
        { name: 'Get Certificate', value: 'Get Certificate' },
        { name: 'List Certificates', value: 'List Certificates' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
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
      displayName: 'Output',
      description: 'Processed data from AWS Certificate Manager'
    }
  ],

  credentials: [
    {
      name: 'aws-certificate-managerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Certificate Manager'
  },

  aliases: ['aws', 'certificate', 'manager'],
  
  examples: [
        {
      name: 'Request Certificate Item',
      description: 'Request Certificate an item from AWS Certificate Manager',
      workflow: {
        nodes: [
          {
            name: 'AWS Certificate Manager',
            type: 'n8n-nodes-base.aws-certificate-manager',
            parameters: {
              operation: 'Request Certificate',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awscertificatemanagerNode;