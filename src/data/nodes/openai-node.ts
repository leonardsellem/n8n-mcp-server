import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const openaiNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.openai',
  displayName: 'OpenAI',
  description: 'Use the OpenAI node to automate work in OpenAI and integrate OpenAI with other applications. n8n has built-in support for a wide range of OpenAI features, including creating images and assistants, as well as chatting with models.',
  category: 'AI',
  subcategory: 'Language Models',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'text',
      description: 'The resource to operate on',
      options: [
        { name: 'Assistant', value: 'assistant', description: 'Work with OpenAI assistants' },
        { name: 'Text', value: 'text', description: 'Generate and process text using OpenAI models' },
        { name: 'Image', value: 'image', description: 'Generate and analyze images' },
        { name: 'Audio', value: 'audio', description: 'Generate and process audio content' },
        { name: 'File', value: 'file', description: 'Manage files in OpenAI' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The operation to perform',
      options: [
        // Assistant operations
        { name: 'Create an Assistant', value: 'createAssistant', description: 'Create a new OpenAI assistant' },
        { name: 'Delete an Assistant', value: 'deleteAssistant', description: 'Delete an existing assistant' },
        { name: 'List Assistants', value: 'listAssistants', description: 'Get a list of all assistants' },
        { name: 'Message an Assistant', value: 'messageAssistant', description: 'Send a message to an assistant' },
        { name: 'Update an Assistant', value: 'updateAssistant', description: 'Update an existing assistant' },
        // Text operations
        { name: 'Message a Model', value: 'message', description: 'Send a message to an OpenAI model' },
        { name: 'Classify Text for Violations', value: 'classifyText', description: 'Check text for policy violations' },
        // Image operations
        { name: 'Analyze Image', value: 'analyzeImage', description: 'Analyze an image using OpenAI vision models' },
        { name: 'Generate an Image', value: 'generateImage', description: 'Generate an image using DALL-E' },
        // Audio operations
        { name: 'Generate Audio', value: 'generateAudio', description: 'Generate audio using text-to-speech' },
        { name: 'Transcribe a Recording', value: 'transcribe', description: 'Transcribe audio to text' },
        { name: 'Translate a Recording', value: 'translate', description: 'Translate audio to English text' },
        // File operations
        { name: 'Delete a File', value: 'deleteFile', description: 'Delete a file from OpenAI' },
        { name: 'List Files', value: 'listFiles', description: 'List all files in OpenAI' },
        { name: 'Upload a File', value: 'uploadFile', description: 'Upload a file to OpenAI' }
      ]
    },
    {
      name: 'model',
      displayName: 'Model',
      type: 'string',
      required: false,
      default: 'gpt-4',
      description: 'The OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo, dall-e-3)'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message or prompt to send to the model'
    },
    {
      name: 'assistantId',
      displayName: 'Assistant ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the assistant to operate on'
    },
    {
      name: 'assistantName',
      displayName: 'Assistant Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the assistant'
    },
    {
      name: 'assistantDescription',
      displayName: 'Assistant Description',
      type: 'string',
      required: false,
      default: '',
      description: 'The description of the assistant'
    },
    {
      name: 'instructions',
      displayName: 'Instructions',
      type: 'string',
      required: false,
      default: '',
      description: 'Instructions for the assistant behavior'
    },
    {
      name: 'imagePrompt',
      displayName: 'Image Prompt',
      type: 'string',
      required: false,
      default: '',
      description: 'Text description of the image to generate'
    },
    {
      name: 'imageUrl',
      displayName: 'Image URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the image to analyze'
    },
    {
      name: 'imageSize',
      displayName: 'Image Size',
      type: 'options',
      required: false,
      default: '1024x1024',
      description: 'Size of the generated image',
      options: [
        { name: '256x256', value: '256x256', description: 'Small square image' },
        { name: '512x512', value: '512x512', description: 'Medium square image' },
        { name: '1024x1024', value: '1024x1024', description: 'Large square image' },
        { name: '1024x1792', value: '1024x1792', description: 'Portrait image' },
        { name: '1792x1024', value: '1792x1024', description: 'Landscape image' }
      ]
    },
    {
      name: 'imageQuality',
      displayName: 'Image Quality',
      type: 'options',
      required: false,
      default: 'standard',
      description: 'Quality of the generated image',
      options: [
        { name: 'Standard', value: 'standard', description: 'Standard quality' },
        { name: 'HD', value: 'hd', description: 'High definition quality' }
      ]
    },
    {
      name: 'imageStyle',
      displayName: 'Image Style',
      type: 'options',
      required: false,
      default: 'vivid',
      description: 'Style of the generated image',
      options: [
        { name: 'Vivid', value: 'vivid', description: 'Hyper-real and dramatic images' },
        { name: 'Natural', value: 'natural', description: 'More natural, less hyper-real looking images' }
      ]
    },
    {
      name: 'audioText',
      displayName: 'Text to Speech',
      type: 'string',
      required: false,
      default: '',
      description: 'Text to convert to speech'
    },
    {
      name: 'voice',
      displayName: 'Voice',
      type: 'options',
      required: false,
      default: 'alloy',
      description: 'Voice to use for text-to-speech',
      options: [
        { name: 'Alloy', value: 'alloy', description: 'Neutral voice' },
        { name: 'Echo', value: 'echo', description: 'Male voice' },
        { name: 'Fable', value: 'fable', description: 'British accent' },
        { name: 'Onyx', value: 'onyx', description: 'Deep voice' },
        { name: 'Nova', value: 'nova', description: 'Female voice' },
        { name: 'Shimmer', value: 'shimmer', description: 'Soft female voice' }
      ]
    },
    {
      name: 'audioFormat',
      displayName: 'Audio Format',
      type: 'options',
      required: false,
      default: 'mp3',
      description: 'Output format for generated audio',
      options: [
        { name: 'MP3', value: 'mp3', description: 'MP3 audio format' },
        { name: 'Opus', value: 'opus', description: 'Opus audio format' },
        { name: 'AAC', value: 'aac', description: 'AAC audio format' },
        { name: 'FLAC', value: 'flac', description: 'FLAC audio format' }
      ]
    },
    {
      name: 'audioSpeed',
      displayName: 'Audio Speed',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Speed of the generated audio (0.25 to 4.0)'
    },
    {
      name: 'audioFile',
      displayName: 'Audio File',
      type: 'string',
      required: false,
      default: '',
      description: 'Path or URL to the audio file to process'
    },
    {
      name: 'audioLanguage',
      displayName: 'Audio Language',
      type: 'string',
      required: false,
      default: '',
      description: 'Language of the audio for transcription (ISO-639-1 format)'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file to upload or operate on'
    },
    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the file to upload'
    },
    {
      name: 'filePurpose',
      displayName: 'File Purpose',
      type: 'options',
      required: false,
      default: 'assistants',
      description: 'Purpose of the uploaded file',
      options: [
        { name: 'Assistants', value: 'assistants', description: 'File for use with assistants' },
        { name: 'Fine-tune', value: 'fine-tune', description: 'File for fine-tuning models' },
        { name: 'Batch', value: 'batch', description: 'File for batch processing' }
      ]
    },
    {
      name: 'maxTokens',
      displayName: 'Maximum Tokens',
      type: 'number',
      required: false,
      default: 1000,
      description: 'Maximum number of tokens to generate'
    },
    {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      required: false,
      default: 0.7,
      description: 'Controls randomness in responses (0.0 to 2.0)'
    },
    {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Controls diversity via nucleus sampling (0.0 to 1.0)'
    },
    {
      name: 'frequencyPenalty',
      displayName: 'Frequency Penalty',
      type: 'number',
      required: false,
      default: 0.0,
      description: 'Penalty for repeating tokens (-2.0 to 2.0)'
    },
    {
      name: 'presencePenalty',
      displayName: 'Presence Penalty',
      type: 'number',
      required: false,
      default: 0.0,
      description: 'Penalty for using tokens that appeared before (-2.0 to 2.0)'
    },
    {
      name: 'systemMessage',
      displayName: 'System Message',
      type: 'string',
      required: false,
      default: '',
      description: 'System message to set the behavior of the assistant'
    },
    {
      name: 'tools',
      displayName: 'Tools',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of tools the assistant can use'
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
      description: 'The response from OpenAI'
    }
  ],
  credentials: ['openAiApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Generate Text with GPT',
      description: 'Send a message to a GPT model and get a response',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'text',
              operation: 'message',
              model: 'gpt-4',
              message: 'Explain quantum computing in simple terms',
              maxTokens: 500,
              temperature: 0.7
            }
          }
        ]
      }
    },
    {
      name: 'Create Assistant',
      description: 'Create a new OpenAI assistant with specific instructions',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'assistant',
              operation: 'createAssistant',
              assistantName: 'Code Helper',
              assistantDescription: 'An assistant that helps with programming questions',
              instructions: 'You are a helpful programming assistant. Provide clear, concise code examples and explanations.',
              model: 'gpt-4'
            }
          }
        ]
      }
    },
    {
      name: 'Generate Image with DALL-E',
      description: 'Generate an image using DALL-E based on a text prompt',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'image',
              operation: 'generateImage',
              model: 'dall-e-3',
              imagePrompt: 'A futuristic city with flying cars and neon lights',
              imageSize: '1024x1024',
              imageQuality: 'hd',
              imageStyle: 'vivid'
            }
          }
        ]
      }
    },
    {
      name: 'Text to Speech',
      description: 'Convert text to speech using OpenAI TTS',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'audio',
              operation: 'generateAudio',
              model: 'tts-1',
              audioText: 'Hello, this is a test of OpenAI text-to-speech',
              voice: 'alloy',
              audioFormat: 'mp3',
              audioSpeed: 1.0
            }
          }
        ]
      }
    },
    {
      name: 'Transcribe Audio',
      description: 'Transcribe audio file to text using Whisper',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'audio',
              operation: 'transcribe',
              model: 'whisper-1',
              audioFile: '/path/to/audio.mp3',
              audioLanguage: 'en'
            }
          }
        ]
      }
    },
    {
      name: 'Message Assistant',
      description: 'Send a message to an existing assistant',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'assistant',
              operation: 'messageAssistant',
              assistantId: 'asst_abc123',
              message: 'Can you help me debug this Python code?'
            }
          }
        ]
      }
    },
    {
      name: 'Analyze Image',
      description: 'Analyze an image using OpenAI vision capabilities',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'image',
              operation: 'analyzeImage',
              model: 'gpt-4-vision-preview',
              imageUrl: 'https://example.com/image.jpg',
              message: 'What do you see in this image?'
            }
          }
        ]
      }
    },
    {
      name: 'Upload File',
      description: 'Upload a file to OpenAI for use with assistants',
      workflow: {
        nodes: [
          {
            name: 'OpenAI',
            type: 'n8n-nodes-langchain.openai',
            parameters: {
              resource: 'file',
              operation: 'uploadFile',
              fileName: 'document.pdf',
              fileContent: '{{$json["fileData"]}}',
              filePurpose: 'assistants'
            }
          }
        ]
      }
    }
  ]
};

export const openaiChatModelNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.lmChatOpenAi',
  displayName: 'OpenAI Chat Model',
  description: 'Use the OpenAI Chat Model node to use OpenAI\'s chat models with conversational agents.',
  category: 'AI',
  subcategory: 'Language Models',
  properties: [
    {
      name: 'model',
      displayName: 'Model',
      type: 'string',
      required: true,
      default: 'gpt-4',
      description: 'The OpenAI model to use for chat completion'
    },
    {
      name: 'baseUrl',
      displayName: 'Base URL',
      type: 'string',
      required: false,
      default: '',
      description: 'Override the default URL for the API'
    },
    {
      name: 'maxTokens',
      displayName: 'Maximum Number of Tokens',
      type: 'number',
      required: false,
      default: 1000,
      description: 'Maximum number of tokens used for completion'
    },
    {
      name: 'temperature',
      displayName: 'Sampling Temperature',
      type: 'number',
      required: false,
      default: 0.7,
      description: 'Controls randomness in the sampling process'
    },
    {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 1.0,
      description: 'Probability the completion should use'
    },
    {
      name: 'frequencyPenalty',
      displayName: 'Frequency Penalty',
      type: 'number',
      required: false,
      default: 0.0,
      description: 'Controls chances of the model repeating itself'
    },
    {
      name: 'presencePenalty',
      displayName: 'Presence Penalty',
      type: 'number',
      required: false,
      default: 0.0,
      description: 'Controls chances of the model talking about new topics'
    },
    {
      name: 'responseFormat',
      displayName: 'Response Format',
      type: 'options',
      required: false,
      default: 'text',
      description: 'Format of the response',
      options: [
        { name: 'Text', value: 'text', description: 'Plain text response' },
        { name: 'JSON', value: 'json', description: 'JSON formatted response' }
      ]
    },
    {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 30000,
      description: 'Maximum request time in milliseconds'
    },
    {
      name: 'maxRetries',
      displayName: 'Max Retries',
      type: 'number',
      required: false,
      default: 2,
      description: 'Maximum number of times to retry a request'
    }
  ],
  inputs: [
    {
      type: 'ai_languageModel',
      displayName: 'Language Model',
      required: true
    }
  ],
  outputs: [
    {
      type: 'ai_languageModel',
      displayName: 'Language Model',
      description: 'OpenAI Chat Model for use with AI agents'
    }
  ],
  credentials: ['openAiApi'],
  regularNode: true,
  examples: [
    {
      name: 'Basic Chat Model Setup',
      description: 'Set up OpenAI chat model for use with AI agents',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Chat Model',
            type: 'n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4',
              temperature: 0.7,
              maxTokens: 1000
            }
          }
        ]
      }
    }
  ]
};

export const openaiEmbeddingsNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.embeddingsOpenAi',
  displayName: 'Embeddings OpenAI',
  description: 'Use the Embeddings OpenAI node to generate embeddings for a given text.',
  category: 'AI',
  subcategory: 'Embeddings',
  properties: [
    {
      name: 'model',
      displayName: 'Model',
      type: 'string',
      required: false,
      default: 'text-embedding-ada-002',
      description: 'The OpenAI model to use for generating embeddings'
    },
    {
      name: 'baseUrl',
      displayName: 'Base URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to send the request to'
    },
    {
      name: 'batchSize',
      displayName: 'Batch Size',
      type: 'number',
      required: false,
      default: 512,
      description: 'Maximum number of documents to send in each request'
    },
    {
      name: 'stripNewLines',
      displayName: 'Strip New Lines',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Remove new line characters from input text'
    },
    {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 30,
      description: 'Maximum amount of time a request can take in seconds'
    }
  ],
  inputs: [
    {
      type: 'ai_embedding',
      displayName: 'Embedding',
      required: true
    }
  ],
  outputs: [
    {
      type: 'ai_embedding',
      displayName: 'Embedding',
      description: 'OpenAI embeddings for text processing'
    }
  ],
  credentials: ['openAiApi'],
  regularNode: true,
  examples: [
    {
      name: 'Basic Embeddings Setup',
      description: 'Set up OpenAI embeddings for text processing',
      workflow: {
        nodes: [
          {
            name: 'Embeddings OpenAI',
            type: 'n8n-nodes-langchain.embeddingsOpenAi',
            parameters: {
              model: 'text-embedding-ada-002',
              batchSize: 512,
              stripNewLines: true
            }
          }
        ]
      }
    }
  ]
};

// Export all nodes as an array for easier importing
export const openaiNodes: NodeTypeInfo[] = [openaiNode, openaiChatModelNode, openaiEmbeddingsNode];

// Export individual actions for the main OpenAI node
export const openaiActions = [
  // Assistant actions
  'create_assistant',
  'delete_assistant',
  'list_assistants',
  'message_assistant',
  'update_assistant',
  // Text actions
  'message_model',
  'classify_text',
  // Image actions
  'analyze_image',
  'generate_image',
  // Audio actions
  'generate_audio',
  'transcribe_audio',
  'translate_audio',
  // File actions
  'delete_file',
  'list_files',
  'upload_file'
];

// Export model types
export const openaiModels = [
  'gpt-4',
  'gpt-4-turbo-preview',
  'gpt-4-vision-preview',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'dall-e-2',
  'dall-e-3',
  'whisper-1',
  'tts-1',
  'tts-1-hd',
  'text-embedding-ada-002',
  'text-embedding-3-small',
  'text-embedding-3-large'
];