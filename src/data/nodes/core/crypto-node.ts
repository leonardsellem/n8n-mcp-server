/**
 * # Crypto
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Utilities
 * 
 * ## Description
 * 
 * Perform cryptographic operations including hashing, encryption, decryption, and digital signatures.
 * This node provides essential security functions for data protection, authentication, and integrity
 * verification in workflows.
 * 
 * ## Key Features
 * 
 * - **Hashing Functions**: MD5, SHA-1, SHA-256, SHA-512, and other hash algorithms
 * - **Encryption/Decryption**: AES, DES, RSA, and other encryption methods
 * - **Digital Signatures**: Create and verify digital signatures
 * - **Key Generation**: Generate cryptographic keys and key pairs
 * - **HMAC Operations**: Hash-based message authentication codes
 * - **Base64 Encoding**: Encode and decode Base64 data
 * - **Random Generation**: Generate secure random numbers and strings
 * - **Certificate Operations**: Handle X.509 certificates
 * - **Password Hashing**: Secure password hashing with bcrypt, scrypt
 * - **JWT Operations**: Create and verify JSON Web Tokens
 * - **UUID Generation**: Generate unique identifiers
 * - **Checksum Validation**: Verify data integrity with checksums
 * 
 * ## Supported Operations
 * 
 * ### Hashing Operations
 * - **MD5**: Legacy hash function (not recommended for security)
 * - **SHA-1**: Secure Hash Algorithm 1 (deprecated for security)
 * - **SHA-256**: Secure Hash Algorithm 256-bit (recommended)
 * - **SHA-512**: Secure Hash Algorithm 512-bit (high security)
 * - **BLAKE2**: Modern cryptographic hash function
 * - **CRC32**: Cyclic redundancy check for data integrity
 * 
 * ### Encryption Algorithms
 * - **AES**: Advanced Encryption Standard (128, 192, 256-bit)
 * - **DES/3DES**: Data Encryption Standard (legacy)
 * - **RSA**: Public-key cryptography for secure communication
 * - **Blowfish**: Symmetric-key block cipher
 * - **ChaCha20**: Modern stream cipher
 * 
 * ### Encoding Operations
 * - **Base64**: Binary-to-text encoding scheme
 * - **Base32**: Base32 encoding for human-readable strings
 * - **Hex**: Hexadecimal encoding for binary data
 * - **URL Encoding**: Percent-encoding for URLs
 * 
 * ## Use Cases
 * 
 * - **Data Security**: Encrypt sensitive data before storage or transmission
 * - **Password Management**: Hash passwords securely for user authentication
 * - **API Security**: Generate and verify API keys and tokens
 * - **Data Integrity**: Verify data hasn't been tampered with using checksums
 * - **Digital Signatures**: Authenticate documents and messages
 * - **Session Management**: Create secure session tokens
 * - **File Verification**: Check file integrity with hash comparisons
 * - **Compliance**: Meet security requirements for data protection
 * - **Key Management**: Generate and manage cryptographic keys
 * - **Certificate Handling**: Process SSL/TLS certificates
 * - **Random Data**: Generate secure random data for cryptographic purposes
 * - **Legacy System Integration**: Handle various encoding formats
 */

import { NodeTypeInfo } from '../../node-types.js';

export const cryptoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.crypto',
  displayName: 'Crypto',
  description: 'Perform cryptographic operations including hashing, encryption, and encoding',
  category: 'Core Nodes',
  subcategory: 'Utilities',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'hash',
      description: 'The cryptographic operation to perform',
      options: [
        {
          name: 'Hash',
          value: 'hash',
          description: 'Generate cryptographic hash of input data'
        },
        {
          name: 'Encrypt',
          value: 'encrypt',
          description: 'Encrypt data using specified algorithm'
        },
        {
          name: 'Decrypt',
          value: 'decrypt',
          description: 'Decrypt data using specified algorithm'
        },
        {
          name: 'Sign',
          value: 'sign',
          description: 'Create digital signature'
        },
        {
          name: 'Verify',
          value: 'verify',
          description: 'Verify digital signature'
        },
        {
          name: 'Encode',
          value: 'encode',
          description: 'Encode data (Base64, Hex, etc.)'
        },
        {
          name: 'Decode',
          value: 'decode',
          description: 'Decode data (Base64, Hex, etc.)'
        },
        {
          name: 'Generate',
          value: 'generate',
          description: 'Generate random data, keys, or tokens'
        }
      ]
    },
    {
      name: 'hashAlgorithm',
      displayName: 'Hash Algorithm',
      type: 'options',
      required: true,
      default: 'sha256',
      description: 'Hash algorithm to use',
      displayOptions: {
        show: {
          operation: ['hash']
        }
      },
      options: [
        {
          name: 'MD5',
          value: 'md5',
          description: 'MD5 hash (not recommended for security)'
        },
        {
          name: 'SHA-1',
          value: 'sha1',
          description: 'SHA-1 hash (deprecated for security)'
        },
        {
          name: 'SHA-256',
          value: 'sha256',
          description: 'SHA-256 hash (recommended)'
        },
        {
          name: 'SHA-512',
          value: 'sha512',
          description: 'SHA-512 hash (high security)'
        },
        {
          name: 'BLAKE2b',
          value: 'blake2b',
          description: 'BLAKE2b hash (modern, fast)'
        }
      ]
    },
    {
      name: 'encryptionAlgorithm',
      displayName: 'Encryption Algorithm',
      type: 'options',
      required: true,
      default: 'aes-256-cbc',
      description: 'Encryption algorithm to use',
      displayOptions: {
        show: {
          operation: ['encrypt', 'decrypt']
        }
      },
      options: [
        {
          name: 'AES-256-CBC',
          value: 'aes-256-cbc',
          description: 'AES 256-bit in CBC mode'
        },
        {
          name: 'AES-256-GCM',
          value: 'aes-256-gcm',
          description: 'AES 256-bit in GCM mode (authenticated)'
        },
        {
          name: 'AES-128-CBC',
          value: 'aes-128-cbc',
          description: 'AES 128-bit in CBC mode'
        },
        {
          name: 'ChaCha20',
          value: 'chacha20',
          description: 'ChaCha20 stream cipher'
        }
      ]
    },
    {
      name: 'encodingType',
      displayName: 'Encoding Type',
      type: 'options',
      required: true,
      default: 'base64',
      description: 'Encoding type to use',
      displayOptions: {
        show: {
          operation: ['encode', 'decode']
        }
      },
      options: [
        {
          name: 'Base64',
          value: 'base64',
          description: 'Base64 encoding'
        },
        {
          name: 'Base32',
          value: 'base32',
          description: 'Base32 encoding'
        },
        {
          name: 'Hex',
          value: 'hex',
          description: 'Hexadecimal encoding'
        },
        {
          name: 'URL',
          value: 'url',
          description: 'URL percent encoding'
        }
      ]
    },
    {
      name: 'dataInput',
      displayName: 'Data Input',
      type: 'string',
      required: true,
      default: '',
      description: 'Data to process',
      displayOptions: {
        show: {
          operation: ['hash', 'encrypt', 'decrypt', 'encode', 'decode', 'sign']
        }
      },
      placeholder: 'Enter data to process'
    },
    {
      name: 'key',
      displayName: 'Key',
      type: 'string',
      required: false,
      default: '',
      description: 'Encryption/decryption key',
      displayOptions: {
        show: {
          operation: ['encrypt', 'decrypt', 'sign', 'verify']
        }
      },
      placeholder: 'Enter encryption key'
    },
    {
      name: 'generateOptions',
      displayName: 'Generate Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Options for data generation',
      displayOptions: {
        show: {
          operation: ['generate']
        }
      },
      options: [
        {
          name: 'type',
          displayName: 'Generation Type',
          type: 'options',
          required: true,
          default: 'random',
          description: 'Type of data to generate',
          options: [
            {
              name: 'Random String',
              value: 'random',
              description: 'Generate random string'
            },
            {
              name: 'UUID v4',
              value: 'uuid',
              description: 'Generate UUID version 4'
            },
            {
              name: 'JWT Token',
              value: 'jwt',
              description: 'Generate JSON Web Token'
            },
            {
              name: 'API Key',
              value: 'apikey',
              description: 'Generate API key'
            }
          ]
        },
        {
          name: 'length',
          displayName: 'Length',
          type: 'number',
          required: false,
          default: 32,
          description: 'Length of generated data',
          typeOptions: {
            minValue: 1,
            maxValue: 1024
          },
          displayOptions: {
            show: {
              type: ['random', 'apikey']
            }
          }
        },
        {
          name: 'charset',
          displayName: 'Character Set',
          type: 'options',
          required: false,
          default: 'alphanumeric',
          description: 'Character set for random generation',
          displayOptions: {
            show: {
              type: ['random', 'apikey']
            }
          },
          options: [
            {
              name: 'Alphanumeric',
              value: 'alphanumeric',
              description: 'Letters and numbers'
            },
            {
              name: 'Alphabetic',
              value: 'alphabetic',
              description: 'Letters only'
            },
            {
              name: 'Numeric',
              value: 'numeric',
              description: 'Numbers only'
            },
            {
              name: 'Hex',
              value: 'hex',
              description: 'Hexadecimal characters'
            }
          ]
        }
      ]
    },
    {
      name: 'outputFormat',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'hex',
      description: 'Format for output data',
      options: [
        {
          name: 'Hex',
          value: 'hex',
          description: 'Hexadecimal format'
        },
        {
          name: 'Base64',
          value: 'base64',
          description: 'Base64 format'
        },
        {
          name: 'Binary',
          value: 'binary',
          description: 'Binary format'
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
      displayName: 'Output',
      description: 'Processed cryptographic data'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'Crypto'
  },

  aliases: ['hash', 'encrypt', 'decrypt', 'encode', 'security', 'crypto'],
  
  examples: [
    {
      name: 'Generate SHA-256 Hash',
      description: 'Create SHA-256 hash of input data for integrity verification',
      workflow: {
        nodes: [
          {
            name: 'Crypto',
            type: 'n8n-nodes-base.crypto',
            parameters: {
              operation: 'hash',
              hashAlgorithm: 'sha256',
              dataInput: '{{$json.data}}',
              outputFormat: 'hex'
            }
          }
        ]
      }
    },
    {
      name: 'Encrypt Sensitive Data',
      description: 'Encrypt sensitive data using AES-256 encryption',
      workflow: {
        nodes: [
          {
            name: 'Crypto',
            type: 'n8n-nodes-base.crypto',
            parameters: {
              operation: 'encrypt',
              encryptionAlgorithm: 'aes-256-cbc',
              dataInput: '{{$json.sensitiveData}}',
              key: '{{$vars.encryptionKey}}',
              outputFormat: 'base64'
            }
          }
        ]
      }
    },
    {
      name: 'Generate API Key',
      description: 'Generate secure random API key for authentication',
      workflow: {
        nodes: [
          {
            name: 'Crypto',
            type: 'n8n-nodes-base.crypto',
            parameters: {
              operation: 'generate',
              generateOptions: {
                type: 'apikey',
                length: 64,
                charset: 'alphanumeric'
              }
            }
          }
        ]
      }
    }
  ]
};

export default cryptoNode;
