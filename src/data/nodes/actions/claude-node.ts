import { NodeTypeInfo } from '../../node-types.js';

export const claudeNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.claude',
  displayName: 'Claude (Anthropic)',
  description: 'Use Claude AI models from Anthropic for advanced language understanding, reasoning, and content generation. Supports Claude 3 Opus, Sonnet, and Haiku models.',
  category: 'AI',
  subcategory: 'Language Models',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Message', value: 'message', description: 'Send messages to Claude models' },
        { name: 'Image Analysis', value: 'imageAnalysis', description: 'Analyze images using Claude Vision' },
        { name: 'Document Analysis', value: 'documentAnalysis', description: 'Analyze documents and extract information' },
        { name: 'Code Generation', value: 'codeGeneration', description: 'Generate and review code' },
        { name: 'Content Creation', value: 'contentCreation', description: 'Create various types of content' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'sendMessage',
      description: 'The operation to perform',
      options: [
        // Message operations
        { name: 'Send Message', value: 'sendMessage', description: 'Send a message to Claude' },
        { name: 'Chat Completion', value: 'chatCompletion', description: 'Complete a conversation' },
        { name: 'Text Summarization', value: 'summarize', description: 'Summarize long text' },
        { name: 'Text Analysis', value: 'analyzeText', description: 'Analyze text content' },
        { name: 'Question Answering', value: 'answerQuestion', description: 'Answer questions based on context' },
        // Image operations
        { name: 'Describe Image', value: 'describeImage', description: 'Describe image contents' },
        { name: 'Extract Text from Image', value: 'extractTextFromImage', description: 'OCR text extraction' },
        { name: 'Analyze Chart/Graph', value: 'analyzeChart', description: 'Analyze charts and graphs' },
        // Document operations
        { name: 'Extract Information', value: 'extractInfo', description: 'Extract structured information' },
        { name: 'Classify Document', value: 'classifyDocument', description: 'Classify document type' },
        { name: 'Generate Summary', value: 'generateSummary', description: 'Create document summary' },
        // Code operations
        { name: 'Generate Code', value: 'generateCode', description: 'Generate code from requirements' },
        { name: 'Review Code', value: 'reviewCode', description: 'Review code for issues' },
        { name: 'Explain Code', value: 'explainCode', description: 'Explain how code works' },
        { name: 'Debug Code', value: 'debugCode', description: 'Help debug code issues' },
        // Content operations
        { name: 'Write Article', value: 'writeArticle', description: 'Write articles or blog posts' },
        { name: 'Create Marketing Copy', value: 'createMarketingCopy', description: 'Generate marketing content' },
        { name: 'Translate Text', value: 'translateText', description: 'Translate between languages' },
        { name: 'Rewrite Content', value: 'rewriteContent', description: 'Rewrite existing content' }
      ]
    },
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'claude-3-sonnet-20240229',
      description: 'The Claude model to use',
      options: [
        { name: 'Claude 3 Opus', value: 'claude-3-opus-20240229', description: 'Most capable model for complex tasks' },
        { name: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229', description: 'Balanced performance and speed' },
        { name: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307', description: 'Fastest model for simple tasks' },
        { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022', description: 'Latest improved Sonnet model' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message or prompt to send to Claude'
    },
    {
      name: 'systemMessage',
      displayName: 'System Message',
      type: 'string',
      required: false,
      default: '',
      description: 'System message to set Claude\'s behavior and context'
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
      name: 'imageData',
      displayName: 'Image Data',
      type: 'string',
      required: false,
      default: '',
      description: 'Base64 encoded image data'
    },
    {
      name: 'documentText',
      displayName: 'Document Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text content of the document to analyze'
    },
    {
      name: 'codeLanguage',
      displayName: 'Programming Language',
      type: 'options',
      required: false,
      default: 'javascript',
      description: 'Programming language for code operations',
      options: [
        { name: 'JavaScript', value: 'javascript', description: 'JavaScript/TypeScript' },
        { name: 'Python', value: 'python', description: 'Python' },
        { name: 'Java', value: 'java', description: 'Java' },
        { name: 'C++', value: 'cpp', description: 'C++' },
        { name: 'C#', value: 'csharp', description: 'C#' },
        { name: 'Go', value: 'go', description: 'Go' },
        { name: 'Rust', value: 'rust', description: 'Rust' },
        { name: 'PHP', value: 'php', description: 'PHP' },
        { name: 'Ruby', value: 'ruby', description: 'Ruby' },
        { name: 'Swift', value: 'swift', description: 'Swift' },
        { name: 'Kotlin', value: 'kotlin', description: 'Kotlin' },
        { name: 'SQL', value: 'sql', description: 'SQL' },
        { name: 'HTML/CSS', value: 'html', description: 'HTML/CSS' }
      ]
    },
    {
      name: 'targetLanguage',
      displayName: 'Target Language',
      type: 'string',
      required: false,
      default: '',
      description: 'Target language for translation (e.g., "Spanish", "French", "German")'
    },
    {
      name: 'contentType',
      displayName: 'Content Type',
      type: 'options',
      required: false,
      default: 'article',
      description: 'Type of content to create',
      options: [
        { name: 'Article', value: 'article', description: 'Blog post or article' },
        { name: 'Marketing Copy', value: 'marketing', description: 'Marketing or advertising copy' },
        { name: 'Email', value: 'email', description: 'Email content' },
        { name: 'Social Media Post', value: 'social', description: 'Social media content' },
        { name: 'Product Description', value: 'product', description: 'Product descriptions' },
        { name: 'Technical Documentation', value: 'technical', description: 'Technical documentation' },
        { name: 'Press Release', value: 'press', description: 'Press release' },
        { name: 'Creative Writing', value: 'creative', description: 'Creative or narrative writing' }
      ]
    },
    {
      name: 'tone',
      displayName: 'Tone',
      type: 'options',
      required: false,
      default: 'professional',
      description: 'Tone of voice for content generation',
      options: [
        { name: 'Professional', value: 'professional', description: 'Professional and formal' },
        { name: 'Casual', value: 'casual', description: 'Casual and friendly' },
        { name: 'Enthusiastic', value: 'enthusiastic', description: 'Energetic and excited' },
        { name: 'Authoritative', value: 'authoritative', description: 'Expert and confident' },
        { name: 'Conversational', value: 'conversational', description: 'Natural conversation' },
        { name: 'Humorous', value: 'humorous', description: 'Light and funny' },
        { name: 'Empathetic', value: 'empathetic', description: 'Understanding and caring' },
        { name: 'Technical', value: 'technical', description: 'Technical and precise' }
      ]
    },
    {
      name: 'maxTokens',
      displayName: 'Max Tokens',
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
      description: 'Controls randomness (0.0 = deterministic, 1.0 = creative)'
    },
    {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 0.9,
      description: 'Controls diversity via nucleus sampling'
    },
    {
      name: 'topK',
      displayName: 'Top K',
      type: 'number',
      required: false,
      default: 0,
      description: 'Limits vocabulary to top K tokens (0 = disabled)'
    },
    {
      name: 'stopSequences',
      displayName: 'Stop Sequences',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated stop sequences'
    },
    {
      name: 'extractionSchema',
      displayName: 'Extraction Schema',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON schema for structured information extraction'
    },
    {
      name: 'context',
      displayName: 'Context',
      type: 'string',
      required: false,
      default: '',
      description: 'Additional context for the operation'
    },
    {
      name: 'wordLimit',
      displayName: 'Word Limit',
      type: 'number',
      required: false,
      default: 0,
      description: 'Maximum number of words in the response (0 = no limit)'
    },
    {
      name: 'includeReasoning',
      displayName: 'Include Reasoning',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include reasoning in the response'
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
      description: 'The response from Claude'
    }
  ],
  credentials: ['anthropicApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Text Analysis',
      description: 'Analyze sentiment and key themes in text',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'message',
              operation: 'analyzeText',
              model: 'claude-3-sonnet-20240229',
              message: 'Please analyze the sentiment and extract key themes from this customer feedback: "I love the new features but the app is sometimes slow."',
              systemMessage: 'You are a customer feedback analyst. Provide structured analysis with sentiment scores and actionable insights.',
              maxTokens: 500
            }
          }
        ]
      }
    },
    {
      name: 'Code Review',
      description: 'Review code for best practices and potential issues',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'codeGeneration',
              operation: 'reviewCode',
              model: 'claude-3-opus-20240229',
              codeLanguage: 'javascript',
              message: 'function processData(data) {\n  for (var i = 0; i < data.length; i++) {\n    console.log(data[i]);\n  }\n}',
              systemMessage: 'Review this code for best practices, performance, and security issues. Provide specific suggestions for improvement.'
            }
          }
        ]
      }
    },
    {
      name: 'Image Description',
      description: 'Generate detailed descriptions of images',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'imageAnalysis',
              operation: 'describeImage',
              model: 'claude-3-sonnet-20240229',
              imageUrl: 'https://example.com/chart.png',
              message: 'Please describe this image in detail, focusing on any data or trends shown.',
              systemMessage: 'You are an expert data analyst. Provide detailed, accurate descriptions of visual content.'
            }
          }
        ]
      }
    },
    {
      name: 'Content Creation',
      description: 'Create marketing copy with specific tone',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'contentCreation',
              operation: 'createMarketingCopy',
              model: 'claude-3-sonnet-20240229',
              message: 'Create compelling marketing copy for a new productivity app that helps teams collaborate better.',
              contentType: 'marketing',
              tone: 'enthusiastic',
              wordLimit: 150,
              systemMessage: 'You are a skilled copywriter who creates engaging, conversion-focused marketing content.'
            }
          }
        ]
      }
    },
    {
      name: 'Document Summarization',
      description: 'Summarize long documents with key points',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'documentAnalysis',
              operation: 'generateSummary',
              model: 'claude-3-sonnet-20240229',
              documentText: '{{$json["documentContent"]}}',
              message: 'Please provide a comprehensive summary of this document, highlighting the main points and conclusions.',
              wordLimit: 300,
              systemMessage: 'You are an expert document analyst. Create clear, concise summaries that capture essential information.'
            }
          }
        ]
      }
    },
    {
      name: 'Structured Data Extraction',
      description: 'Extract structured information from unstructured text',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'documentAnalysis',
              operation: 'extractInfo',
              model: 'claude-3-opus-20240229',
              message: 'Extract the contact information, company details, and key requirements from this business email.',
              extractionSchema: '{"contact": {"name": "", "email": "", "phone": ""}, "company": {"name": "", "industry": ""}, "requirements": []}',
              systemMessage: 'Extract information in the exact JSON format provided. Be accurate and complete.'
            }
          }
        ]
      }
    },
    {
      name: 'Translation',
      description: 'Translate text while preserving context and tone',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'contentCreation',
              operation: 'translateText',
              model: 'claude-3-sonnet-20240229',
              message: 'Welcome to our innovative platform that transforms how teams collaborate and achieve their goals.',
              targetLanguage: 'Spanish',
              tone: 'professional',
              systemMessage: 'You are an expert translator. Maintain the original meaning, tone, and cultural context while translating accurately.'
            }
          }
        ]
      }
    },
    {
      name: 'Code Generation',
      description: 'Generate code from natural language requirements',
      workflow: {
        nodes: [
          {
            name: 'Claude',
            type: 'n8n-nodes-langchain.claude',
            parameters: {
              resource: 'codeGeneration',
              operation: 'generateCode',
              model: 'claude-3-opus-20240229',
              codeLanguage: 'python',
              message: 'Create a function that reads a CSV file, filters rows where the "status" column equals "active", and returns the count of remaining rows.',
              systemMessage: 'You are an expert programmer. Write clean, efficient, well-commented code that follows best practices.',
              includeReasoning: true
            }
          }
        ]
      }
    }
  ]
};

export const claudeChatModelNode: NodeTypeInfo = {
  name: 'n8n-nodes-langchain.lmChatClaude',
  displayName: 'Claude Chat Model',
  description: 'Use Claude AI models from Anthropic with LangChain agents and chains for advanced conversational AI workflows.',
  category: 'AI',
  subcategory: 'Language Models',
  properties: [
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'claude-3-sonnet-20240229',
      description: 'The Claude model to use',
      options: [
        { name: 'Claude 3 Opus', value: 'claude-3-opus-20240229', description: 'Most capable model' },
        { name: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229', description: 'Balanced performance' },
        { name: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307', description: 'Fastest model' },
        { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022', description: 'Latest model' }
      ]
    },
    {
      name: 'maxTokens',
      displayName: 'Max Tokens',
      type: 'number',
      required: false,
      default: 1000,
      description: 'Maximum tokens to generate'
    },
    {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      required: false,
      default: 0.7,
      description: 'Controls randomness (0.0-1.0)'
    },
    {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 0.9,
      description: 'Nucleus sampling parameter'
    },
    {
      name: 'topK',
      displayName: 'Top K',
      type: 'number',
      required: false,
      default: 0,
      description: 'Top-k sampling parameter'
    },
    {
      name: 'stopSequences',
      displayName: 'Stop Sequences',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated stop sequences'
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
      description: 'Claude Chat Model for AI agents'
    }
  ],
  credentials: ['anthropicApi'],
  regularNode: true,
  examples: [
    {
      name: 'Basic Claude Chat Model',
      description: 'Set up Claude for use with AI agents',
      workflow: {
        nodes: [
          {
            name: 'Claude Chat Model',
            type: 'n8n-nodes-langchain.lmChatClaude',
            parameters: {
              model: 'claude-3-sonnet-20240229',
              temperature: 0.7,
              maxTokens: 1000
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const claudeNodes: NodeTypeInfo[] = [claudeNode, claudeChatModelNode];

// Export Claude model capabilities
export const claudeCapabilities = {
  'claude-3-opus-20240229': {
    contextWindow: 200000,
    strengths: ['Complex reasoning', 'Analysis', 'Creative writing', 'Code generation'],
    bestFor: 'Advanced tasks requiring deep understanding'
  },
  'claude-3-sonnet-20240229': {
    contextWindow: 200000,
    strengths: ['Balanced performance', 'Speed', 'General tasks', 'Cost-effective'],
    bestFor: 'Most general-purpose applications'
  },
  'claude-3-haiku-20240307': {
    contextWindow: 200000,
    strengths: ['Speed', 'Efficiency', 'Simple tasks', 'Low cost'],
    bestFor: 'High-volume, straightforward tasks'
  },
  'claude-3-5-sonnet-20241022': {
    contextWindow: 200000,
    strengths: ['Latest features', 'Improved accuracy', 'Better reasoning'],
    bestFor: 'Modern applications requiring latest capabilities'
  }
};

// Export common Claude use cases
export const claudeUseCases = [
  'content_analysis',
  'code_review',
  'document_summarization',
  'creative_writing',
  'data_extraction',
  'translation',
  'customer_support',
  'research_assistance',
  'technical_documentation',
  'image_analysis'
];