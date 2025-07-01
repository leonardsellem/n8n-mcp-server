/**
 * # OpenAI
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: AI & Machine Learning
 * 
 * ## Description
 * 
 * Use the OpenAI node to automate work in OpenAI and integrate OpenAI with other applications. n8n has built-in 
 * support for a wide range of OpenAI features, including creating images and assistants, as well as chatting with 
 * models. This node provides comprehensive access to OpenAI's powerful AI capabilities including GPT models, 
 * DALL-E image generation, Whisper audio processing, and the Assistants API.
 * 
 * ## Key Features
 * 
 * - **Advanced Language Models**: Access to GPT-4, GPT-3.5-turbo, and other state-of-the-art language models
 * - **Image Generation**: Create high-quality images from text descriptions using DALL-E
 * - **Image Analysis**: Analyze and describe images using vision-enabled models
 * - **Audio Processing**: Transcribe and translate audio files with Whisper
 * - **Text-to-Speech**: Generate natural-sounding audio from text
 * - **AI Assistants**: Create and manage stateful AI assistants with custom instructions
 * - **Content Moderation**: Classify text for policy violations and harmful content
 * - **File Management**: Upload, manage, and delete files for use with assistants
 * - **Tool Integration**: Connect external tools and functions to AI models
 * - **Conversation Management**: Maintain context across multiple interactions
 * - **Function Calling**: Enable AI models to call external functions and APIs
 * - **Fine-tuning Support**: Use custom fine-tuned models for specialized tasks
 * - **Embeddings**: Generate vector embeddings for semantic search and similarity
 * - **Streaming Responses**: Real-time streaming of model outputs for chat interfaces
 * - **Cost Optimization**: Token usage tracking and optimization features
 * 
 * ## Credentials
 * 
 * Refer to [OpenAI credentials](../../credentials/openai/) for guidance on setting up authentication.
 * Requires an OpenAI API key with appropriate usage limits and billing setup.
 * 
 * ## Replacement Notice
 * 
 * The OpenAI node replaces the OpenAI assistant node from version 1.29.0 on, providing enhanced 
 * functionality and better integration with the OpenAI ecosystem.
 * 
 * ## Operations
 * 
 * ### Assistant Operations
 * - **Create an Assistant**: Create a new AI assistant with custom instructions and capabilities
 * - **Delete an Assistant**: Remove an assistant and free up resources
 * - **List Assistants**: Retrieve all available assistants with metadata
 * - **Message an Assistant**: Send messages to assistants and receive intelligent responses
 * - **Update an Assistant**: Modify assistant settings, instructions, and capabilities
 * 
 * ### Text Operations
 * - **Message a Model**: Send prompts to language models and receive completions
 * - **Classify Text for Violations**: Check content against OpenAI's usage policies
 * 
 * ### Image Operations
 * - **Analyze Image**: Extract information and descriptions from images
 * - **Generate an Image**: Create images from text descriptions using DALL-E
 * 
 * ### Audio Operations
 * - **Generate Audio**: Convert text to natural-sounding speech
 * - **Transcribe a Recording**: Convert audio files to text transcriptions
 * - **Translate a Recording**: Transcribe and translate audio to English
 * 
 * ### File Operations
 * - **Delete a File**: Remove files from OpenAI storage
 * - **List Files**: View all uploaded files with metadata
 * - **Upload a File**: Store files for use with assistants and other operations
 * 
 * ## Tool Integration
 * 
 * The OpenAI node supports tool connectors that act like addons, allowing AI models to access 
 * extra context or resources. When tools are connected, the node becomes a root node forming 
 * cluster nodes with tool sub-nodes.
 * 
 * ### Operations Supporting Tools
 * - **Message an Assistant**: Assistants can use tools for enhanced capabilities
 * - **Message a Model**: Language models can call functions and access external data
 * 
 * ## Common Integration Patterns
 * 
 * ### Conversational AI and Chatbots
 * - Customer service chatbots with natural language understanding and response generation
 * - Virtual assistants for e-commerce with product recommendations and order assistance
 * - Educational tutoring systems with personalized learning and adaptive questioning
 * - Technical support bots with troubleshooting and solution recommendation capabilities
 * - Multi-language support chatbots with real-time translation and localization
 * - Voice-enabled assistants with speech-to-text and text-to-speech integration
 * - Context-aware conversation systems with memory and user preference tracking
 * - Escalation management with intelligent routing to human agents when needed
 * - Sentiment analysis integration for proactive customer experience management
 * - Integration with CRM systems for personalized customer interaction history
 * - Appointment scheduling and calendar management with natural language processing
 * - FAQ automation with dynamic answer generation and knowledge base integration
 * 
 * ### Content Creation and Analysis
 * - Automated blog post and article generation with SEO optimization and topic research
 * - Social media content creation with platform-specific formatting and hashtag suggestions
 * - Email campaign copywriting with A/B testing and personalization capabilities
 * - Product description generation for e-commerce with feature highlighting and benefit focus
 * - Technical documentation creation with code examples and troubleshooting guides
 * - Marketing copy optimization with conversion-focused language and call-to-action generation
 * - Content translation and localization with cultural adaptation and tone preservation
 * - Content moderation and policy compliance checking for user-generated content
 * - Summarization services for long documents, reports, and research papers
 * - Creative writing assistance with story development and character creation
 * - Academic paper analysis with citation checking and plagiarism detection
 * - Brand voice consistency checking across multiple content channels and formats
 * 
 * ### Business Intelligence and Automation
 * - Automated report generation with data analysis and insight extraction from databases
 * - Customer feedback analysis with sentiment tracking and actionable insight generation
 * - Market research automation with competitor analysis and trend identification
 * - Lead qualification and scoring with intelligent prospect evaluation and routing
 * - Contract analysis and risk assessment with clause identification and compliance checking
 * - Financial document processing with expense categorization and anomaly detection
 * - HR automation with resume screening and candidate evaluation assistance
 * - Sales enablement with personalized pitch generation and objection handling scripts
 * - Business process documentation with workflow optimization and bottleneck identification
 * - Competitive intelligence gathering with market positioning and strategy analysis
 * - Compliance monitoring with regulatory requirement tracking and violation detection
 * - Performance analytics with KPI interpretation and improvement recommendation generation
 * 
 * ### Creative and Media Applications
 * - Image generation for marketing materials with brand consistency and style matching
 * - Podcast transcription and content repurposing with chapter segmentation and highlight extraction
 * - Video content analysis with scene description and metadata generation for searchability
 * - Music and audio content creation with AI-generated voiceovers and sound effects
 * - Art and design concept generation with mood boards and style exploration
 * - Creative writing collaboration with plot development and character dialogue generation
 * - Brand asset creation with logo concepts and visual identity development
 * - Photography workflow automation with image tagging and album organization
 * - Content remix and adaptation for different platforms and audience segments
 * - Interactive storytelling with dynamic narrative generation and user choice integration
 * - Creative project management with idea development and iteration tracking
 * - Cultural content adaptation with local customs and preferences consideration
 * 
 * ## Example Use Cases
 * 
 * ### AI-Powered Customer Support System
 * ```typescript
 * // Create a specialized customer support assistant
 * const assistant = await openai.createAssistant({
 *   name: 'Customer Support Bot',
 *   instructions: `You are a helpful customer support representative for TechCorp. 
 *     You have access to our knowledge base and can help customers with:
 *     - Product information and specifications
 *     - Order status and tracking
 *     - Technical troubleshooting
 *     - Return and refund policies
 *     - Account management
 *     
 *     Always be polite, empathetic, and solution-focused. If you cannot resolve 
 *     an issue, escalate to a human agent.`,
 *   model: 'gpt-4-turbo-preview',
 *   tools: [
 *     { type: 'code_interpreter' },
 *     { type: 'function', function: { name: 'lookup_order_status' } },
 *     { type: 'function', function: { name: 'create_support_ticket' } }
 *   ]
 * });
 * 
 * // Process customer inquiry
 * const response = await openai.messageAssistant({
 *   assistantId: assistant.id,
 *   message: 'I ordered a laptop last week but haven\'t received any updates. Order #12345.',
 *   threadId: 'customer_thread_uuid'
 * });
 * ```
 * 
 * ### Content Generation and SEO Optimization
 * ```typescript
 * // Generate SEO-optimized blog content
 * const blogPost = await openai.messageModel({
 *   model: 'gpt-4-turbo-preview',
 *   messages: [
 *     {
 *       role: 'system',
 *       content: `You are an expert content writer and SEO specialist. Create engaging, 
 *         SEO-optimized blog posts that rank well in search engines while providing 
 *         genuine value to readers.`
 *     },
 *     {
 *       role: 'user',
 *       content: `Write a comprehensive blog post about "sustainable web development practices" 
 *         targeting the keyword "eco-friendly websites". Include:
 *         - Compelling headline with keyword
 *         - Introduction with hook
 *         - 5-7 main sections with subheadings
 *         - Practical tips and examples
 *         - Conclusion with call-to-action
 *         - Meta description
 *         Target length: 2000-2500 words`
 *     }
 *   ],
 *   temperature: 0.7,
 *   maxTokens: 3000
 * });
 * 
 * // Generate accompanying social media content
 * const socialContent = await openai.messageModel({
 *   model: 'gpt-3.5-turbo',
 *   messages: [
 *     {
 *       role: 'user',
 *       content: `Create 5 different social media posts to promote this blog post:
 *         "${blogPost.content}"
 *         
 *         Include:
 *         - LinkedIn post (professional tone)
 *         - Twitter thread (3-4 tweets)
 *         - Instagram caption with hashtags
 *         - Facebook post
 *         - Pinterest description`
 *     }
 *   ]
 * });
 * ```
 * 
 * ### Multi-Modal Content Analysis and Processing
 * ```typescript
 * // Analyze uploaded product images
 * const imageAnalysis = await openai.analyzeImage({
 *   imageUrl: 'https://example.com/product-image.jpg',
 *   prompt: `Analyze this product image and provide:
 *     1. Detailed product description
 *     2. Key features and benefits
 *     3. Target audience identification
 *     4. Suggested marketing angles
 *     5. Recommended product tags and categories
 *     6. Quality assessment and improvement suggestions`,
 *   maxTokens: 1000
 * });
 * 
 * // Generate marketing visuals
 * const marketingImage = await openai.generateImage({
 *   prompt: `Create a professional marketing banner for ${imageAnalysis.productName}. 
 *     Style: Modern, clean, premium. Colors: Blue and white gradient. 
 *     Include product benefits: ${imageAnalysis.keyFeatures.join(', ')}. 
 *     Target audience: ${imageAnalysis.targetAudience}`,
 *   size: '1792x1024',
 *   quality: 'hd',
 *   style: 'vivid'
 * });
 * 
 * // Process customer review audio
 * const audioTranscription = await openai.transcribeRecording({
 *   audioFile: 'customer-review-audio.mp3',
 *   language: 'en',
 *   responseFormat: 'verbose_json',
 *   timestampGranularities: ['word', 'segment']
 * });
 * 
 * // Analyze sentiment and extract insights
 * const reviewAnalysis = await openai.messageModel({
 *   model: 'gpt-4',
 *   messages: [
 *     {
 *       role: 'user',
 *       content: `Analyze this customer review transcription and provide:
 *         1. Sentiment score (1-10)
 *         2. Key positive points
 *         3. Areas for improvement
 *         4. Product suggestions
 *         5. Customer satisfaction level
 *         6. Recommended follow-up actions
 *         
 *         Transcription: "${audioTranscription.text}"`
 *     }
 *   ]
 * });
 * ```
 * 
 * ### Intelligent Document Processing Workflow
 * ```typescript
 * // Upload and process business documents
 * const uploadedFile = await openai.uploadFile({
 *   file: 'quarterly-report.pdf',
 *   purpose: 'assistants'
 * });
 * 
 * // Create specialized document analysis assistant
 * const documentAssistant = await openai.createAssistant({
 *   name: 'Document Analyzer',
 *   instructions: `You are a business analyst specializing in financial document analysis. 
 *     Extract key insights, identify trends, and provide actionable recommendations 
 *     from uploaded documents.`,
 *   model: 'gpt-4-turbo-preview',
 *   tools: [
 *     { type: 'code_interpreter' },
 *     { type: 'retrieval' }
 *   ],
 *   fileIds: [uploadedFile.id]
 * });
 * 
 * // Analyze document and generate executive summary
 * const analysis = await openai.messageAssistant({
 *   assistantId: documentAssistant.id,
 *   message: `Please analyze the quarterly report and provide:
 *     1. Executive summary (2-3 paragraphs)
 *     2. Key financial metrics and trends
 *     3. Performance against goals
 *     4. Risk factors identified
 *     5. Growth opportunities
 *     6. Recommended actions for next quarter
 *     7. Competitive positioning insights`,
 *   threadId: 'document_analysis_thread'
 * });
 * 
 * // Generate presentation slides content
 * const presentationContent = await openai.messageModel({
 *   model: 'gpt-4',
 *   messages: [
 *     {
 *       role: 'user',
 *       content: `Based on this analysis: "${analysis.content}"
 *         
 *         Create content for a 10-slide executive presentation:
 *         1. Title slide
 *         2. Executive summary
 *         3. Q3 highlights
 *         4. Financial performance
 *         5. Market analysis
 *         6. Operational metrics
 *         7. Challenges and risks
 *         8. Opportunities
 *         9. Q4 strategy
 *         10. Next steps
 *         
 *         For each slide, provide: Title, bullet points, speaker notes`
 *     }
 *   ]
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **AI Agent Chat**: Interactive conversational AI with memory and context management
 * - **WhatsApp Chatbot**: Automated messaging with natural language processing
 * - **Web Scraping + AI Summary**: Content extraction and intelligent summarization
 * - **Customer Support Automation**: Ticket classification and response generation
 * - **Content Creation Pipeline**: Automated blog writing and social media content
 * - **Document Analysis System**: PDF processing and insight extraction
 * - **Voice Assistant Integration**: Speech-to-text and text-to-speech workflows
 * - **Image Generation Service**: Automated visual content creation for marketing
 * - **Email Response Generator**: Intelligent email drafting and response suggestions
 * - **Product Description Creator**: E-commerce content generation and optimization
 * - **Meeting Transcription System**: Audio processing and action item extraction
 * - **Language Translation Service**: Multi-language content adaptation and localization
 * 
 * ## Best Practices
 * 
 * ### Prompt Engineering and Optimization
 * - Use clear, specific instructions with context and examples for consistent results
 * - Implement systematic prompt testing and iteration to optimize output quality
 * - Structure prompts with roles, context, task description, and output format specifications
 * - Use temperature and other parameters strategically to control creativity and consistency
 * - Implement prompt chaining for complex multi-step tasks and reasoning workflows
 * - Create prompt templates for recurring use cases to ensure consistency across applications
 * - Use few-shot examples to guide model behavior and improve output quality
 * - Implement prompt versioning and A/B testing to continuously improve performance
 * - Monitor prompt effectiveness and adjust based on user feedback and success metrics
 * - Create fallback prompts for edge cases and error handling scenarios
 * - Use system messages effectively to set context and behavioral guidelines
 * - Implement prompt injection prevention and security measures for user-facing applications
 * 
 * ### Cost Management and Efficiency
 * - Monitor token usage and implement cost tracking across different models and operations
 * - Use appropriate models for specific tasks (GPT-3.5 for simple tasks, GPT-4 for complex reasoning)
 * - Implement caching strategies for frequently requested content and responses
 * - Set appropriate max_tokens limits to prevent unnecessary token consumption
 * - Use streaming for real-time applications to improve user experience and cost efficiency
 * - Implement rate limiting and usage quotas to prevent unexpected cost spikes
 * - Optimize prompt length while maintaining effectiveness to reduce input token costs
 * - Use batch processing for large volumes of similar requests when possible
 * - Monitor and optimize assistant file usage and storage costs
 * - Implement intelligent retry logic with exponential backoff for failed requests
 * - Regular audit of API usage patterns and optimization opportunities
 * - Set up cost alerts and monitoring dashboards for proactive cost management
 * 
 * ### Security and Compliance
 * - Implement proper API key management with rotation and access control policies
 * - Use content filtering and moderation to ensure output compliance with policies
 * - Implement input validation and sanitization to prevent prompt injection attacks
 * - Set up audit logging for all API interactions and data processing activities
 * - Ensure data privacy compliance with regulations like GDPR and CCPA
 * - Implement secure file handling and storage practices for uploaded content
 * - Use environment-specific configurations for development, staging, and production
 * - Regular security audits and penetration testing of AI-powered applications
 * - Implement proper error handling and information disclosure prevention
 * - Set up monitoring and alerting for unusual usage patterns and potential security threats
 * - Ensure compliance with industry-specific regulations and standards
 * - Implement data retention and deletion policies according to regulatory requirements
 */

export const openaiNode = {
  displayName: 'OpenAI',
  name: 'openai',
  group: ['transform'],
  version: 1,
  icon: 'file:openai.svg',
  description: 'Access OpenAI models and services for text generation, image creation, and audio processing',
  defaults: {
    name: 'OpenAI',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'openAi',
      required: true,
    },
  ],
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Assistant',
          value: 'assistant',
          description: 'Manage AI assistants',
        },
        {
          name: 'Text',
          value: 'text',
          description: 'Text generation and classification',
        },
        {
          name: 'Image',
          value: 'image',
          description: 'Image generation and analysis',
        },
        {
          name: 'Audio',
          value: 'audio',
          description: 'Audio generation and transcription',
        },
        {
          name: 'File',
          value: 'file',
          description: 'File management',
        },
      ],
      default: 'text',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['assistant'],
        },
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create an assistant',
          action: 'Create an assistant',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete an assistant',
          action: 'Delete an assistant',
        },
        {
          name: 'List',
          value: 'list',
          description: 'List assistants',
          action: 'List assistants',
        },
        {
          name: 'Message',
          value: 'message',
          description: 'Message an assistant',
          action: 'Message an assistant',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an assistant',
          action: 'Update an assistant',
        },
      ],
      default: 'message',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['text'],
        },
      },
      options: [
        {
          name: 'Message a Model',
          value: 'message',
          description: 'Send a message to a model',
          action: 'Message a model',
        },
        {
          name: 'Classify Text for Violations',
          value: 'classify',
          description: 'Classify text for policy violations',
          action: 'Classify text for violations',
        },
      ],
      default: 'message',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['image'],
        },
      },
      options: [
        {
          name: 'Analyze Image',
          value: 'analyze',
          description: 'Analyze an image',
          action: 'Analyze an image',
        },
        {
          name: 'Generate an Image',
          value: 'generate',
          description: 'Generate an image',
          action: 'Generate an image',
        },
      ],
      default: 'generate',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['audio'],
        },
      },
      options: [
        {
          name: 'Generate Audio',
          value: 'generate',
          description: 'Generate audio from text',
          action: 'Generate audio',
        },
        {
          name: 'Transcribe a Recording',
          value: 'transcribe',
          description: 'Transcribe audio to text',
          action: 'Transcribe a recording',
        },
        {
          name: 'Translate a Recording',
          value: 'translate',
          description: 'Translate audio to English',
          action: 'Translate a recording',
        },
      ],
      default: 'transcribe',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['file'],
        },
      },
      options: [
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a file',
          action: 'Delete a file',
        },
        {
          name: 'List',
          value: 'list',
          description: 'List files',
          action: 'List files',
        },
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload a file',
          action: 'Upload a file',
        },
      ],
      default: 'upload',
    },
  ],
};
