/**
 * # AWS Lambda
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Cloud Services
 * 
 * ## Description
 * 
 * Use the AWS Lambda node to automate work in AWS Lambda, and integrate AWS Lambda with other applications. 
 * n8n has built-in support for a wide range of AWS Lambda features, including invoking functions.
 * 
 * ## Key Features
 * 
 * - **Serverless Function Execution**: Execute AWS Lambda functions directly from workflows
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Flexible Invocation**: Support for synchronous and asynchronous function calls
 * - **JSON Payload Support**: Send complex data structures to Lambda functions
 * - **Error Handling**: Built-in error handling for Lambda execution failures
 * - **Response Processing**: Automatic processing of Lambda function responses
 * - **Cross-Region Support**: Execute functions across different AWS regions
 * - **IAM Integration**: Secure access through AWS IAM roles and policies
 * - **Logging Integration**: Integration with AWS CloudWatch for monitoring
 * - **Version Management**: Support for Lambda function versions and aliases
 * - **Environment Variables**: Pass environment-specific configurations
 * - **Timeout Configuration**: Configurable timeout settings for function execution
 * 
 * ## Credentials
 * 
 * Refer to [AWS Lambda credentials](../../credentials/aws/) for guidance on setting up authentication.
 * Uses AWS IAM for secure access to Lambda functions with appropriate permissions.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Invoke Function
 * - **Function Execution**: Execute Lambda functions with custom payloads
 *   - Support for synchronous (RequestResponse) invocation
 *   - Support for asynchronous (Event) invocation
 *   - Support for DryRun mode for testing and validation
 *   - Function name or ARN specification
 *   - JSON payload construction and validation
 *   - Response parsing and error handling
 *   - Timeout and retry configuration
 *   - Version and alias support
 *   - Cross-region execution capabilities
 *   - Integration with AWS CloudWatch for logging
 *   - Performance monitoring and metrics
 *   - Cost optimization through efficient execution
 * 
 * ## Advanced Features
 * 
 * ### Function Management
 * - **Version Control**: Execute specific versions of Lambda functions
 * - **Alias Support**: Use aliases for stage-based function execution
 * - **Cross-Region**: Execute functions across different AWS regions
 * - **Concurrent Execution**: Handle concurrent Lambda invocations
 * 
 * ### Data Processing
 * - **Payload Transformation**: Transform data before sending to Lambda
 * - **Response Processing**: Process Lambda responses for downstream nodes
 * - **Error Handling**: Comprehensive error handling and retry logic
 * - **Logging Integration**: Integration with AWS CloudWatch logs
 * 
 * ### Integration Patterns
 * - **Event-Driven Architecture**: Trigger Lambda functions based on events
 * - **Microservices Integration**: Connect Lambda functions with other services
 * - **Data Processing Pipelines**: Use Lambda for data transformation tasks
 * - **API Integration**: Execute Lambda functions as part of API workflows
 * 
 * ### Security and Compliance
 * - **IAM Integration**: Secure access through AWS Identity and Access Management
 * - **VPC Configuration**: Execute functions within Virtual Private Clouds
 * - **Encryption**: Support for data encryption in transit and at rest
 * - **Audit Trails**: Complete audit logging through AWS CloudTrail
 * 
 * ## Integration Patterns
 * 
 * ### Serverless Computing
 * - **Function as a Service**: Leverage serverless computing capabilities
 * - **Auto-scaling**: Automatic scaling based on demand
 * - **Cost Optimization**: Pay-per-execution pricing model
 * - **High Availability**: Built-in redundancy and failover
 * 
 * ### Data Processing
 * - **ETL Operations**: Extract, transform, and load data using Lambda
 * - **Real-time Processing**: Process data streams in real-time
 * - **Batch Processing**: Handle batch processing tasks efficiently
 * - **Data Validation**: Validate and cleanse data using custom functions
 * 
 * ### API and Webhook Integration
 * - **API Gateway Integration**: Connect with AWS API Gateway
 * - **Webhook Processing**: Process webhook payloads using Lambda
 * - **Custom Business Logic**: Implement complex business rules
 * - **Third-party Integration**: Connect with external services and APIs
 * 
 * ### Machine Learning and AI
 * - **ML Model Inference**: Execute ML models using Lambda functions
 * - **Data Preprocessing**: Prepare data for ML pipelines
 * - **AI Service Integration**: Connect with AWS AI/ML services
 * - **Custom AI Logic**: Implement custom AI algorithms
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the AWS Lambda API directly with your AWS credentials.
 * 
 * ## Use Cases
 * 
 * - **Serverless Microservices**: Build and deploy serverless microservices architecture
 * - **Data Processing**: Process and transform data using serverless functions
 * - **API Backend**: Create scalable API backends using Lambda functions
 * - **Event Processing**: Handle and process various types of events
 * - **Integration Logic**: Implement complex integration logic between systems
 * - **Business Rules Engine**: Execute business rules and validation logic
 * - **Image/Video Processing**: Process media files using Lambda functions
 * - **IoT Data Processing**: Handle IoT device data and events
 * - **Scheduled Tasks**: Execute scheduled operations using Lambda
 * - **Custom Algorithms**: Implement and execute custom algorithms
 * - **Machine Learning**: Deploy and execute ML models
 * - **Data Validation**: Validate and cleanse incoming data
 * - **Notification Processing**: Process and send notifications
 * - **File Processing**: Process uploaded files and documents
 * - **Database Operations**: Perform complex database operations
 * - **Third-party Integration**: Integrate with external services and APIs
 * - **Monitoring and Alerting**: Implement custom monitoring solutions
 * - **Security Processing**: Process security-related events and alerts
 * - **Content Management**: Manage and process content dynamically
 * - **Workflow Orchestration**: Orchestrate complex business workflows
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awsLambdaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.awsLambda',
  displayName: 'AWS Lambda',
  description: 'Invoke AWS Lambda functions with custom payloads and process responses.',
  category: 'Action Nodes',
  subcategory: 'Cloud Services',
  
  properties: [
    {
      name: 'functionName',
      displayName: 'Function Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the Lambda function to invoke (or ARN)'
    },
    {
      name: 'invocationType',
      displayName: 'Invocation Type',
      type: 'options',
      required: true,
      default: 'RequestResponse',
      description: 'Type of invocation',
      options: [
        {
          name: 'RequestResponse (Synchronous)',
          value: 'RequestResponse',
          description: 'Invoke synchronously and wait for response'
        },
        {
          name: 'Event (Asynchronous)',
          value: 'Event',
          description: 'Invoke asynchronously without waiting for response'
        },
        {
          name: 'DryRun',
          value: 'DryRun',
          description: 'Validate parameters without executing function'
        }
      ]
    },
    {
      name: 'payload',
      displayName: 'Payload',
      type: 'string',
      required: false,
      default: '{}',
      description: 'JSON payload to send to the Lambda function'
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
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'aws',
      required: true
    }
  ],

  version: [1],
  defaults: {
    name: 'AWS Lambda'
  },

  aliases: ['aws', 'lambda', 'serverless', 'function'],
  
  examples: [
    {
      name: 'Invoke Lambda Function',
      description: 'Execute an AWS Lambda function with custom payload',
      workflow: {
        nodes: [
          {
            name: 'AWS Lambda',
            type: 'n8n-nodes-base.awsLambda',
            parameters: {
              functionName: 'my-function',
              invocationType: 'RequestResponse',
              payload: '{"key": "value"}'
            }
          }
        ]
      }
    }
  ]
};

export default awsLambdaNode;
