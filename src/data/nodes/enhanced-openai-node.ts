import { NodeTypeInfo } from '../node-types.js';

/**
 * Enhanced OpenAI Node - AI-Optimized Version
 * 
 * This version includes:
 * - Comprehensive AI model operations
 * - Standardized resource/operation patterns
 * - Clear parameter guidance for AI agents
 * - Advanced features like function calling and streaming
 */
export const openaiNodeEnhanced: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.openai',
  displayName: 'OpenAI',
  description: 'Generate text, images, audio, and embeddings using OpenAI models. Supports GPT-4, GPT-3.5, DALL-E, Whisper, and text embeddings for comprehensive AI workflow automation.',
  category: 'AI',
  subcategory: 'Language Models',
  
  credentials: [
    {
      name: 'openAiApi',
      required: true,
      types: ['apiKey'],
      description: 'OpenAI API key for model access',
      documentationUrl: 'https://platform.openai.com/api-keys'
    }
  ],

  properties: [
    {
      name: 'resource',
      displayName: 'Resource Type',
      type: 'options',
      required: true,
      default: 'text',
      description: 'Type of AI operation to perform. Text for chat/completion, Image for DALL-E, Audio for Whisper/TTS.',
      options: [
        { 
          name: 'Text Generation', 
          value: 'text', 
          description: 'Chat completions, text generation, and function calling with GPT models' 
        },
        { 
          name: 'Image Generation', 
          value: 'image', 
          description: 'Generate, edit, or analyze images using DALL-E and GPT-4 Vision' 
        },
        { 
          name: 'Audio Processing', 
          value: 'audio', 
          description: 'Speech-to-text, text-to-speech, and audio transcription' 
        },
        { 
          name: 'Embeddings', 
          value: 'embeddings', 
          description: 'Generate vector embeddings for semantic search and similarity' 
        },
        { 
          name: 'Files', 
          value: 'file', 
          description: 'Upload and manage files for assistants and fine-tuning' 
        },
        { 
          name: 'Assistants', 
          value: 'assistant', 
          description: 'Create and interact with AI assistants with custom instructions' 
        }
      ]
    },

    // TEXT OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'chat',
      description: 'Text generation operations. Chat for conversations, Complete for single prompts.',
      displayOptions: {
        show: {
          resource: ['text']
        }
      },
      options: [
        {
          name: 'Chat Completion',
          value: 'chat',
          description: 'Multi-turn conversations with system prompts and message history',
          action: 'Generate chat completion'
        },
        {
          name: 'Text Completion',
          value: 'complete',
          description: 'Single prompt completion (legacy models)',
          action: 'Generate text completion'
        },
        {
          name: 'Function Calling',
          value: 'function',
          description: 'Structured output using function/tool definitions',
          action: 'Call functions with AI'
        }
      ]
    },

    // IMAGE OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'generate',
      description: 'Image operations. Generate for DALL-E creation, Analyze for vision understanding.',
      displayOptions: {
        show: {
          resource: ['image']
        }
      },
      options: [
        {
          name: 'Generate Image',
          value: 'generate',
          description: 'Create new images from text prompts using DALL-E',
          action: 'Generate image'
        },
        {
          name: 'Edit Image',
          value: 'edit',
          description: 'Modify existing images with text instructions',
          action: 'Edit image'
        },
        {
          name: 'Create Variation',
          value: 'variation',
          description: 'Generate variations of an existing image',
          action: 'Create image variation'
        },
        {
          name: 'Analyze Image',
          value: 'analyze',
          description: 'Understand and describe image content using GPT-4 Vision',
          action: 'Analyze image'
        }
      ]
    },

    // AUDIO OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'transcribe',
      description: 'Audio processing operations. Transcribe for speech-to-text, Generate for text-to-speech.',
      displayOptions: {
        show: {
          resource: ['audio']
        }
      },
      options: [
        {
          name: 'Transcribe Audio',
          value: 'transcribe',
          description: 'Convert speech to text using Whisper',
          action: 'Transcribe audio'
        },
        {
          name: 'Translate Audio',
          value: 'translate',
          description: 'Translate audio to English text using Whisper',
          action: 'Translate audio'
        },
        {
          name: 'Generate Speech',
          value: 'speak',
          description: 'Convert text to speech using TTS models',
          action: 'Generate speech'
        }
      ]
    },

    // MODEL SELECTION
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'gpt-4o',
      description: 'AI model to use. GPT-4o for best quality, GPT-3.5-turbo for speed/cost balance.',
      displayOptions: {
        show: {
          resource: ['text'],
          operation: ['chat', 'complete', 'function']
        }
      },
      options: [
        {
          name: 'GPT-4o (Recommended)',
          value: 'gpt-4o',
          description: 'Latest multimodal model with best performance and reasoning'
        },
        {
          name: 'GPT-4o Mini',
          value: 'gpt-4o-mini',
          description: 'Smaller, faster version of GPT-4o with good performance'
        },
        {
          name: 'GPT-4 Turbo',
          value: 'gpt-4-turbo',
          description: 'Previous generation GPT-4 with 128k context window'
        },
        {
          name: 'GPT-3.5 Turbo',
          value: 'gpt-3.5-turbo',
          description: 'Fast and cost-effective for simpler tasks'
        }
      ]
    },

    // CHAT MESSAGES
    {
      name: 'messages',
      displayName: 'Messages',
      type: 'fixedCollection',
      required: true,
      default: { values: [] },
      description: 'Conversation messages. Include system prompt and user messages for best results.',
      typeOptions: {
        multipleValues: true
      },
      displayOptions: {
        show: {
          resource: ['text'],
          operation: ['chat']
        }
      },
      options: [
        {
          name: 'values',
          displayName: 'Message',
          value: 'values',
          values: [
            {
              name: 'role',
              displayName: 'Role',
              type: 'options',
              required: true,
              default: 'user',
              description: 'Message sender role',
              options: [
                {
                  name: 'System',
                  value: 'system',
                  description: 'Instructions for AI behavior and context'
                },
                {
                  name: 'User',
                  value: 'user',
                  description: 'User input or questions'
                },
                {
                  name: 'Assistant',
                  value: 'assistant',
                  description: 'AI responses (for conversation history)'
                }
              ]
            },
            {
              name: 'content',
              displayName: 'Content',
              type: 'string',
              required: true,
              default: '',
              description: 'Message text content',
              typeOptions: {
                rows: 3
              }
            }
          ]
        }
      ]
    },

    // SIMPLE PROMPT FOR SINGLE COMPLETIONS
    {
      name: 'prompt',
      displayName: 'Prompt',
      type: 'string',
      required: true,
      default: '',
      description: 'Text prompt for the AI model. Be specific and clear for best results.',
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: {
          resource: ['text'],
          operation: ['complete']
        }
      }
    },

    // IMAGE GENERATION PROMPT
    {
      name: 'imagePrompt',
      displayName: 'Image Description',
      type: 'string',
      required: true,
      default: '',
      description: 'Detailed description of the image to generate. Include style, colors, composition details.',
      typeOptions: {
        rows: 3
      },
      displayOptions: {
        show: {
          resource: ['image'],
          operation: ['generate', 'edit']
        }
      }
    },

    // ADVANCED PARAMETERS
    {
      name: 'options',
      displayName: 'Advanced Options',
      type: 'collection',
      required: false,
      default: {},
      placeholder: 'Add Option',
      description: 'Fine-tune model behavior and output format.',
      displayOptions: {
        show: {
          resource: ['text']
        }
      },
      options: [
        {
          name: 'temperature',
          displayName: 'Temperature',
          type: 'number',
          default: 0.7,
          description: 'Creativity level (0.0 = deterministic, 1.0 = very creative)',
          typeOptions: {
            minValue: 0,
            maxValue: 2
          }
        },
        {
          name: 'max_tokens',
          displayName: 'Max Tokens',
          type: 'number',
          default: 1000,
          description: 'Maximum tokens in response (affects cost and response length)',
          typeOptions: {
            minValue: 1,
            maxValue: 4096
          }
        },
        {
          name: 'top_p',
          displayName: 'Top P',
          type: 'number',
          default: 1,
          description: 'Nucleus sampling parameter (alternative to temperature)',
          typeOptions: {
            minValue: 0,
            maxValue: 1
          }
        },
        {
          name: 'frequency_penalty',
          displayName: 'Frequency Penalty',
          type: 'number',
          default: 0,
          description: 'Reduce repetition (0.0 to 2.0)',
          typeOptions: {
            minValue: -2,
            maxValue: 2
          }
        },
        {
          name: 'presence_penalty',
          displayName: 'Presence Penalty',
          type: 'number',
          default: 0,
          description: 'Encourage new topics (0.0 to 2.0)',
          typeOptions: {
            minValue: -2,
            maxValue: 2
          }
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
      displayName: 'Output',
      description: 'AI model response with generated content and metadata'
    }
  ],

  regularNode: true,
  version: [1, 2],
  defaults: {
    name: 'OpenAI',
    color: '#10A37F'
  },
  aliases: ['openai', 'gpt', 'ai', 'chatgpt', 'dalle', 'whisper'],
  subtitle: '={{$parameter["model"] || $parameter["resource"]}}',

  // COMPREHENSIVE EXAMPLES
  examples: [
    {
      name: 'Simple Text Generation',
      description: 'Generate text response to a single prompt',
      complexity: 'beginner',
      category: 'text-generation',
      useCase: 'Content creation, question answering, text processing',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Text',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'text',
              operation: 'chat',
              model: 'gpt-4o-mini',
              messages: {
                values: [
                  {
                    role: 'system',
                    content: 'You are a helpful assistant that provides clear, concise answers.'
                  },
                  {
                    role: 'user',
                    content: 'Explain quantum computing in simple terms.'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Structured Data Extraction',
      description: 'Extract structured information from text using function calling',
      complexity: 'advanced',
      category: 'data-extraction',
      useCase: 'Parse emails, forms, documents into structured data',
      workflow: {
        nodes: [
          {
            name: 'Extract Contact Info',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'text',
              operation: 'function',
              model: 'gpt-4o',
              messages: {
                values: [
                  {
                    role: 'system',
                    content: 'Extract contact information from the provided text.'
                  },
                  {
                    role: 'user',
                    content: 'John Doe, Senior Developer at TechCorp, john.doe@techcorp.com, +1-555-0123'
                  }
                ]
              },
              functions: [
                {
                  name: 'extract_contact',
                  description: 'Extract contact information',
                  parameters: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      title: { type: 'string' },
                      company: { type: 'string' },
                      email: { type: 'string' },
                      phone: { type: 'string' }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: 'Generate Marketing Images',
      description: 'Create product marketing images with DALL-E',
      complexity: 'intermediate',
      category: 'image-generation',
      useCase: 'Marketing materials, social media content, product visualization',
      workflow: {
        nodes: [
          {
            name: 'DALL-E Image',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'image',
              operation: 'generate',
              imagePrompt: 'A modern smartphone floating above a clean white surface, surrounded by soft blue light rays, professional product photography style, high resolution, minimalist background',
              options: {
                size: '1024x1024',
                quality: 'hd',
                style: 'vivid'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Transcribe Meeting Audio',
      description: 'Convert audio recordings to text transcripts',
      complexity: 'beginner',
      category: 'audio-processing',
      useCase: 'Meeting notes, podcast transcription, voice message processing',
      workflow: {
        nodes: [
          {
            name: 'Audio Transcription',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'audio',
              operation: 'transcribe',
              audioFile: '{{$binary.audio}}',
              options: {
                language: 'en',
                temperature: 0,
                response_format: 'verbose_json'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Customer Support Chatbot',
      description: 'Multi-turn conversation with context and memory',
      complexity: 'advanced',
      category: 'conversational-ai',
      useCase: 'Customer support, FAQ automation, interactive assistants',
      workflow: {
        nodes: [
          {
            name: 'Support Chatbot',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'text',
              operation: 'chat',
              model: 'gpt-4o',
              messages: {
                values: [
                  {
                    role: 'system',
                    content: 'You are a helpful customer support agent for an e-commerce platform. Be friendly, professional, and try to solve problems efficiently. If you cannot help, offer to escalate to a human agent.'
                  },
                  {
                    role: 'user',
                    content: '{{$json["customer_message"]}}'
                  }
                ]
              },
              options: {
                temperature: 0.3,
                max_tokens: 500,
                frequency_penalty: 0.2
              }
            }
          }
        ]
      }
    },
    {
      name: 'Generate Text Embeddings',
      description: 'Create vector embeddings for semantic search',
      complexity: 'intermediate',
      category: 'embeddings',
      useCase: 'Document search, recommendation systems, similarity matching',
      workflow: {
        nodes: [
          {
            name: 'Text Embeddings',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'embeddings',
              operation: 'create',
              model: 'text-embedding-3-small',
              input: '{{$json["document_text"]}}',
              options: {
                dimensions: 512
              }
            }
          }
        ]
      }
    }
  ],

  // AI METADATA
  aiMetadata: {
    aiOptimized: true,
    rateLimits: {
      requests: 3500,
      window: 'minute',
      unit: 'requests per minute (varies by model and tier)'
    },
    commonPatterns: [
      'text-generation',
      'content-creation',
      'data-extraction',
      'conversational-ai',
      'image-generation',
      'audio-processing',
      'semantic-search'
    ],
    integrationComplexity: 'medium',
    prerequisites: [
      'OpenAI API key with sufficient credits',
      'Appropriate model access permissions',
      'Understanding of token limits and costs'
    ],
    errorHandling: {
      retryableErrors: ['rate_limit_exceeded', 'server_error', 'timeout'],
      nonRetryableErrors: ['invalid_api_key', 'insufficient_quota', 'content_filter', 'invalid_request'],
      documentation: 'https://platform.openai.com/docs/guides/error-codes'
    }
  },

  usageNotes: 'For AI agents: Always include clear system prompts for consistent behavior. Monitor token usage to control costs. Use temperature 0-0.3 for deterministic outputs, 0.7-1.0 for creative content. Function calling requires GPT-4 or GPT-3.5-turbo models.',

  integrationGuide: 'Best practices: 1) Start with system message for context, 2) Use specific prompts for better results, 3) Implement token counting for cost control, 4) Handle rate limits with exponential backoff, 5) Consider streaming for long responses.'
};

export default openaiNodeEnhanced;