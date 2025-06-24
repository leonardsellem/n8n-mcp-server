/**
 * AWS Elastic Load Balancing Node
 * 
 * Manages AWS Elastic Load Balancers (ELB/ALB/NLB). Allows registering or deregistering targets (instances/IPs) with a load balancer’s target group, and checking target health status. Helps automate load balancer configuration tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awselasticloadbalancingNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-elastic-load-balancing',
  displayName: 'AWS Elastic Load Balancing',
  description: 'Manages AWS Elastic Load Balancers (ELB/ALB/NLB). Allows registering or deregistering targets (instances/IPs) with a load balancer’s target group, and checking target health status. Helps automate load balancer configuration tasks.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Register Target',
      description: 'The operation to perform',
      options: [
        { name: 'Register Target', value: 'Register Target' },
        { name: 'Deregister Target', value: 'Deregister Target' },
        { name: 'Get Target Health', value: 'Get Target Health' }
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
      description: 'Processed data from AWS Elastic Load Balancing'
    }
  ],

  credentials: [
    {
      name: 'aws-elastic-load-balancingApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Elastic Load Balancing'
  },

  aliases: ['aws', 'elastic', 'load', 'balancing'],
  
  examples: [
        {
      name: 'Register Target Item',
      description: 'Register Target an item from AWS Elastic Load Balancing',
      workflow: {
        nodes: [
          {
            name: 'AWS Elastic Load Balancing',
            type: 'n8n-nodes-base.aws-elastic-load-balancing',
            parameters: {
              operation: 'Register Target',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awselasticloadbalancingNode;