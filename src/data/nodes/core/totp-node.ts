/**
 * # TOTP
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Security
 * 
 * ## Description
 * 
 * The TOTP node provides a way to generate a TOTP (time-based one-time password). 
 * TOTP is commonly used for two-factor authentication and security purposes.
 * 
 * ## Key Features
 * 
 * - **Time-based Codes**: Generates codes that change over time based on current timestamp
 * - **Multiple Algorithms**: Support for SHA1, SHA256, and SHA512 HMAC algorithms
 * - **Configurable Length**: Choose 6, 8, or other digit lengths for generated codes
 * - **Custom Periods**: Set how long each code is valid (15-300 seconds)
 * - **Standards Compliant**: Follows RFC 6238 TOTP standard for compatibility
 * - **AI Tool Compatible**: Can be used with AI agents for automated workflows
 * - **Secure Credentials**: Uses n8n credential system for secure secret storage
 * - **High Precision**: Generates accurate codes synchronized with time
 * 
 * ## Node Parameters
 * 
 * ### Credential to Connect With
 * Select or create a TOTP credential for the node to use. This contains the secret key 
 * needed to generate the time-based one-time passwords.
 * 
 * ### Operation
 * - **Generate Secret**: Generate a TOTP code using the configured secret (only operation currently supported)
 * 
 * ## Node Options
 * 
 * ### Algorithm
 * Select the HMAC hashing algorithm to use:
 * - **SHA1** (default): Most commonly supported algorithm, widely compatible
 * - **SHA256**: More secure alternative with better cryptographic strength
 * - **SHA512**: Highest security option with maximum hash strength
 * 
 * ### Digits
 * Enter the number of digits in the generated code. Default is `6` digits.
 * Common values are 6 or 8 digits depending on security requirements.
 * 
 * ### Period
 * Enter how many seconds the TOTP is valid for. Default is `30` seconds.
 * This determines how often the code changes and affects synchronization.
 * 
 * ## AI Tool Usage
 * 
 * This node can be used as an AI tool to enhance AI agent capabilities. When used with AI:
 * - Many parameters can be set automatically
 * - AI can direct information flow for authentication workflows
 * - Enables AI agents to handle multi-factor authentication
 * 
 * ## Use Cases
 * 
 * - Two-factor authentication workflows and login automation
 * - Automated login processes requiring TOTP verification
 * - Security verification in automated systems and CI/CD
 * - Integration with MFA-protected APIs and services
 * - Backup authentication for critical operations
 * - Time-sensitive security tokens for temporary access
 * - Automated testing of TOTP-protected applications
 * - Security auditing and compliance workflows
 * 
 * ## Security Considerations
 * 
 * - Store TOTP secrets securely using n8n credentials system
 * - Use appropriate algorithm strength for your security requirements
 * - Consider shorter periods for higher security needs
 * - Never log or expose TOTP codes in workflow data or outputs
 * - Ensure proper time synchronization for accurate code generation
 * - Regularly rotate TOTP secrets as part of security best practices
 */

import { NodeTypeInfo } from '../../node-types.js';

export const totpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.totp',
  displayName: 'TOTP',
  description: 'Generate time-based one-time passwords (TOTP) for two-factor authentication and security workflows.',
  category: 'Core Nodes',
  subcategory: 'Security',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'generate',
      description: 'The operation to perform',
      options: [
        { name: 'Generate Secret', value: 'generate' }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional TOTP generation options',
      options: [
        {
          name: 'algorithm',
          displayName: 'Algorithm',
          type: 'options',
          default: 'SHA1',
          description: 'HMAC hashing algorithm to use',
          options: [
            { name: 'SHA1', value: 'SHA1' },
            { name: 'SHA256', value: 'SHA256' },
            { name: 'SHA512', value: 'SHA512' }
          ]
        },
        {
          name: 'digits',
          displayName: 'Digits',
          type: 'number',
          default: 6,
          description: 'Number of digits in the generated code',
          typeOptions: {
            minValue: 6,
            maxValue: 8
          }
        },
        {
          name: 'period',
          displayName: 'Period (seconds)',
          type: 'number',
          default: 30,
          description: 'How many seconds the TOTP is valid for',
          typeOptions: {
            minValue: 15,
            maxValue: 300
          }
        }
      ]
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
      displayName: 'TOTP Code',
      description: 'Generated TOTP code and metadata'
    }
  ],

  credentials: [
    {
      name: 'totp',
      required: true
    }
  ],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'TOTP'
  },

  aliases: ['2fa', 'two-factor', 'otp', 'authenticator'],
  
  examples: [
    {
      name: 'Generate TOTP Code',
      description: 'Generate a standard 6-digit TOTP code',
      workflow: {
        nodes: [
          {
            name: 'TOTP',
            type: 'n8n-nodes-base.totp',
            parameters: {
              operation: 'generate'
            }
          }
        ]
      }
    },
    {
      name: 'Custom TOTP Configuration',
      description: 'Generate TOTP with custom settings',
      workflow: {
        nodes: [
          {
            name: 'TOTP',
            type: 'n8n-nodes-base.totp',
            parameters: {
              operation: 'generate',
              options: {
                algorithm: 'SHA256',
                digits: 8,
                period: 60
              }
            }
          }
        ]
      }
    },
    {
      name: 'High Security TOTP',
      description: 'Generate TOTP with maximum security settings',
      workflow: {
        nodes: [
          {
            name: 'TOTP',
            type: 'n8n-nodes-base.totp',
            parameters: {
              operation: 'generate',
              options: {
                algorithm: 'SHA512',
                digits: 8,
                period: 15
              }
            }
          }
        ]
      }
    }
  ]
};

export default totpNode;
