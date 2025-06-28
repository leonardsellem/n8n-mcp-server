/**
 * OpenAI Node - AI Processing and Generation
 * 
 * Comprehensive OpenAI integration for text generation, image creation,
 * embeddings, and advanced AI processing for automation workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const openAINode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openAi',
  displayName: 'OpenAI',
  description: 'Advanced OpenAI integration for text generation, image creation, embeddings, and AI processing with GPT-4, DALL-E, and Whisper capabilities',
  category: 'AI & Productivity',
  subcategory: 'AI Processing',
  
  properties: [
    // Authentication
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'apiKey',
      options: [
        { name: 'API Key', value: 'apiKey' },
        { name: 'OpenAI OAuth', value: 'oAuth2' }
      ],
      description: 'Authentication method for OpenAI API'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'text',
      options: [
        { name: 'Text', value: 'text' },
        { name: 'Image', value: 'image' },
        { name: 'Audio', value: 'audio' },
        { name: 'Embedding', value: 'embedding' },
        { name: 'Fine-tuning', value: 'fineTuning' },
        { name: 'Assistant', value: 'assistant' },
        { name: 'Moderation', value: 'moderation' },
        { name: 'Vision', value: 'vision' }
      ],
      description: 'Choose the OpenAI resource to work with'
    },

    // Text operations
    {
      name: 'textOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'generate',
      displayOptions: {
        show: { resource: ['text'] }
      },
      options: [
        { name: 'Generate', value: 'generate' },
        { name: 'Complete', value: 'complete' },
        { name: 'Chat', value: 'chat' },
        { name: 'Edit', value: 'edit' },
        { name: 'Summarize', value: 'summarize' },
        { name: 'Translate', value: 'translate' },
        { name: 'Analyze Sentiment', value: 'analyzeSentiment' },
        { name: 'Extract Keywords', value: 'extractKeywords' },
        { name: 'Classify', value: 'classify' }
      ],
      description: 'Select the text operation to perform'
    },

    // Image operations
    {
      name: 'imageOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'generate',
      displayOptions: {
        show: { resource: ['image'] }
      },
      options: [
        { name: 'Generate', value: 'generate' },
        { name: 'Edit', value: 'edit' },
        { name: 'Create Variation', value: 'variation' },
        { name: 'Analyze', value: 'analyze' }
      ],
      description: 'Select the image operation to perform'
    },

    // Audio operations
    {
      name: 'audioOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'transcribe',
      displayOptions: {
        show: { resource: ['audio'] }
      },
      options: [
        { name: 'Transcribe', value: 'transcribe' },
        { name: 'Translate', value: 'translate' },
        { name: 'Generate Speech', value: 'generateSpeech' }
      ],
      description: 'Select the audio operation to perform'
    },

    // Vision operations
    {
      name: 'visionOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'analyze',
      displayOptions: {
        show: { resource: ['vision'] }
      },
      options: [
        { name: 'Analyze Image', value: 'analyze' },
        { name: 'Read Text', value: 'readText' },
        { name: 'Describe Scene', value: 'describeScene' },
        { name: 'Extract Data', value: 'extractData' }
      ],
      description: 'Select the vision operation to perform'
    },

    // Model selection
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'gpt-4',
      displayOptions: {
        show: { resource: ['text', 'assistant'] }
      },
      options: [
        { name: 'GPT-4', value: 'gpt-4' },
        { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { name: 'GPT-4o', value: 'gpt-4o' },
        { name: 'GPT-4o Mini', value: 'gpt-4o-mini' }
      ],
      description: 'Select the language model to use'
    },

    {
      name: 'imageModel',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'dall-e-3',
      displayOptions: {
        show: { resource: ['image'] }
      },
      options: [
        { name: 'DALL-E 3', value: 'dall-e-3' },
        { name: 'DALL-E 2', value: 'dall-e-2' }
      ],
      description: 'Select the image model to use'
    },

    {
      name: 'audioModel',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'whisper-1',
      displayOptions: {
        show: { resource: ['audio'] }
      },
      options: [
        { name: 'Whisper-1', value: 'whisper-1' },
        { name: 'TTS-1', value: 'tts-1' },
        { name: 'TTS-1-HD', value: 'tts-1-hd' }
      ],
      description: 'Select the audio model to use'
    },

    // Text input
    {
      name: 'prompt',
      displayName: 'Prompt',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: { 
          resource: ['text', 'image'],
          operation: ['generate', 'complete', 'chat', 'edit', 'summarize', 'translate', 'analyzeSentiment', 'extractKeywords', 'classify']
        }
      },
      description: 'The prompt or text to process'
    },

    // System message for chat
    {
      name: 'systemMessage',
      displayName: 'System Message',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 2
      },
      displayOptions: {
        show: { 
          resource: ['text'],
          textOperation: ['chat', 'generate']
        }
      },
      description: 'System message to set the AI behavior and context'
    },

    // Context for AI processing
    {
      name: 'context',
      displayName: 'Context',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 3
      },
      displayOptions: {
        show: { 
          resource: ['text'],
          textOperation: ['summarize', 'analyzeSentiment', 'extractKeywords', 'classify']
        }
      },
      description: 'Additional context for the AI processing'
    },

    // Image generation settings
    {
      name: 'imagePrompt',
      displayName: 'Image Description',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 3
      },
      displayOptions: {
        show: { 
          resource: ['image'],
          imageOperation: ['generate', 'edit', 'variation']
        }
      },
      description: 'Detailed description of the image to generate'
    },

    {
      name: 'imageSize',
      displayName: 'Image Size',
      type: 'options',
      required: false,
      default: '1024x1024',
      displayOptions: {
        show: { 
          resource: ['image'],
          imageOperation: ['generate']
        }
      },
      options: [
        { name: '256x256', value: '256x256' },
        { name: '512x512', value: '512x512' },
        { name: '1024x1024', value: '1024x1024' },
        { name: '1792x1024', value: '1792x1024' },
        { name: '1024x1792', value: '1024x1792' }
      ],
      description: 'Size of the generated image'
    },

    {
      name: 'imageQuality',
      displayName: 'Image Quality',
      type: 'options',
      required: false,
      default: 'standard',
      displayOptions: {
        show: { 
          resource: ['image'],
          imageOperation: ['generate']
        }
      },
      options: [
        { name: 'Standard', value: 'standard' },
        { name: 'HD', value: 'hd' }
      ],
      description: 'Quality of the generated image'
    },

    {
      name: 'imageStyle',
      displayName: 'Image Style',
      type: 'options',
      required: false,
      default: 'vivid',
      displayOptions: {
        show: { 
          resource: ['image'],
          imageOperation: ['generate']
        }
      },
      options: [
        { name: 'Vivid', value: 'vivid' },
        { name: 'Natural', value: 'natural' }
      ],
      description: 'Style of the generated image'
    },

    // Audio input
    {
      name: 'audioFile',
      displayName: 'Audio File',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['audio'],
          audioOperation: ['transcribe', 'translate']
        }
      },
      description: 'Path to the audio file or audio data'
    },

    {
      name: 'audioLanguage',
      displayName: 'Language',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['audio'],
          audioOperation: ['transcribe']
        }
      },
      description: 'Language of the audio (optional, auto-detected if not specified)'
    },

    // Speech generation
    {
      name: 'speechText',
      displayName: 'Text to Speech',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 3
      },
      displayOptions: {
        show: { 
          resource: ['audio'],
          audioOperation: ['generateSpeech']
        }
      },
      description: 'Text to convert to speech'
    },

    {
      name: 'voice',
      displayName: 'Voice',
      type: 'options',
      required: false,
      default: 'alloy',
      displayOptions: {
        show: { 
          resource: ['audio'],
          audioOperation: ['generateSpeech']
        }
      },
      options: [
        { name: 'Alloy', value: 'alloy' },
        { name: 'Echo', value: 'echo' },
        { name: 'Fable', value: 'fable' },
        { name: 'Onyx', value: 'onyx' },
        { name: 'Nova', value: 'nova' },
        { name: 'Shimmer', value: 'shimmer' }
      ],
      description: 'Voice to use for speech generation'
    },

    // Vision input
    {
      name: 'imageUrl',
      displayName: 'Image URL',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['vision'],
          visionOperation: ['analyze', 'readText', 'describeScene', 'extractData']
        }
      },
      description: 'URL of the image to analyze'
    },

    {
      name: 'visionPrompt',
      displayName: 'Analysis Prompt',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 2
      },
      displayOptions: {
        show: { 
          resource: ['vision']
        }
      },
      description: 'Specific instructions for image analysis'
    },

    // AI Processing Parameters
    {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      required: false,
      default: 0.7,
      typeOptions: {
        minValue: 0,
        maxValue: 2,
        numberPrecision: 1
      },
      displayOptions: {
        show: { 
          resource: ['text', 'assistant']
        }
      },
      description: 'Controls randomness (0 = deterministic, 2 = very random)'
    },

    {
      name: 'maxTokens',
      displayName: 'Max Tokens',
      type: 'number',
      required: false,
      default: 1000,
      displayOptions: {
        show: { 
          resource: ['text', 'assistant']
        }
      },
      description: 'Maximum number of tokens to generate'
    },

    {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 1,
      typeOptions: {
        minValue: 0,
        maxValue: 1,
        numberPrecision: 2
      },
      displayOptions: {
        show: { 
          resource: ['text', 'assistant']
        }
      },
      description: 'Nucleus sampling parameter'
    },

    // Outlook/Teams Integration Features
    {
      name: 'outlookIntegration',
      displayName: 'Outlook Integration',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure AI processing for Outlook email management',
      options: [
        {
          name: 'enableEmailSummary',
          displayName: 'Enable Email Summary',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically summarize long emails'
        },
        {
          name: 'enableSmartReply',
          displayName: 'Enable Smart Reply',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate intelligent email replies'
        },
        {
          name: 'enableSentimentAnalysis',
          displayName: 'Enable Sentiment Analysis',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Analyze email sentiment'
        },
        {
          name: 'enablePriorityDetection',
          displayName: 'Enable Priority Detection',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Detect urgent emails'
        },
        {
          name: 'enableCategorization',
          displayName: 'Enable Auto Categorization',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically categorize emails'
        }
      ]
    },

    {
      name: 'teamsIntegration',
      displayName: 'Teams Integration',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure AI processing for Teams collaboration',
      options: [
        {
          name: 'enableMeetingSummary',
          displayName: 'Enable Meeting Summary',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Summarize meeting transcripts'
        },
        {
          name: 'enableActionItems',
          displayName: 'Enable Action Item Detection',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Extract action items from conversations'
        },
        {
          name: 'enableChatModeration',
          displayName: 'Enable Chat Moderation',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Moderate inappropriate content'
        },
        {
          name: 'enableAutoTranslation',
          displayName: 'Enable Auto Translation',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Translate messages between languages'
        }
      ]
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      options: [
        {
          name: 'stream',
          displayName: 'Stream Response',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Stream the response as it\'s generated'
        },
        {
          name: 'user',
          displayName: 'User ID',
          type: 'string',
          required: false,
          description: 'User identifier for tracking'
        },
        {
          name: 'responseFormat',
          displayName: 'Response Format',
          type: 'options',
          required: false,
          default: 'text',
          options: [
            { name: 'Text', value: 'text' },
            { name: 'JSON', value: 'json' },
            { name: 'Markdown', value: 'markdown' }
          ],
          description: 'Format of the AI response'
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
      description: 'OpenAI API response with AI-generated content'
    }
  ],

  credentials: [
    {
      name: 'openAiApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['apiKey']
        }
      }
    },
    {
      name: 'openAiOAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'OpenAI'
  },

  aliases: ['ai', 'gpt', 'dalle', 'whisper', 'artificial intelligence', 'machine learning'],
  
  examples: [
    {
      name: 'AI Email Assistant',
      description: 'Generate intelligent email responses using AI',
      workflow: {
        nodes: [
          {
            name: 'AI Email Response',
            type: 'n8n-nodes-base.openAi',
            parameters: {
              resource: 'text',
              textOperation: 'generate',
              model: 'gpt-4',
              systemMessage: 'You are a professional email assistant. Generate polite, helpful, and contextually appropriate email responses.',
              prompt: 'Generate a professional response to this email: "Hi, I need help with setting up my new email account. Can you provide step-by-step instructions?"',
              temperature: 0.7,
              maxTokens: 500,
              outlookIntegration: {
                enableSmartReply: true,
                enableSentimentAnalysis: true,
                enablePriorityDetection: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Teams Meeting Summary',
      description: 'Summarize Teams meeting transcripts with action items',
      workflow: {
        nodes: [
          {
            name: 'Meeting Summary AI',
            type: 'n8n-nodes-base.openAi',
            parameters: {
              resource: 'text',
              textOperation: 'summarize',
              model: 'gpt-4',
              prompt: 'Summarize this meeting transcript and extract action items: [Meeting transcript content here]',
              temperature: 0.3,
              maxTokens: 800,
              teamsIntegration: {
                enableMeetingSummary: true,
                enableActionItems: true
              },
              options: {
                responseFormat: 'markdown'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Image Analysis for Reports',
      description: 'Analyze images and extract data for reports',
      workflow: {
        nodes: [
          {
            name: 'Image Analysis',
            type: 'n8n-nodes-base.openAi',
            parameters: {
              resource: 'vision',
              visionOperation: 'extractData',
              imageUrl: 'https://example.com/chart.png',
              visionPrompt: 'Extract all numerical data from this chart and format it as a table'
            }
          }
        ]
      }
    },
    {
      name: 'Voice Message Processing',
      description: 'Convert voice messages to text and analyze sentiment',
      workflow: {
        nodes: [
          {
            name: 'Voice to Text',
            type: 'n8n-nodes-base.openAi',
            parameters: {
              resource: 'audio',
              audioOperation: 'transcribe',
              audioModel: 'whisper-1',
              audioFile: '/path/to/voice-message.mp3',
              audioLanguage: 'en'
            }
          }
        ]
      }
    }
  ]
};

export default openAINode;
