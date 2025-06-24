/**
 * Complete Production-Ready Node Registry
 * Auto-generated from 528 verified nodes
 */

import { NodeTypeInfo } from './node-types.js';

// Import all verified nodes
import { actionnetworkNode } from './nodes/action-network-node.js';
import { activationtriggerNode } from './nodes/activation-trigger-node.js';
import { activecampaignNode } from './nodes/activecampaign-node.js';
import { activecampaigntriggerNode } from './nodes/activecampaign-trigger-node.js';
import { acuityschedulingtriggerNode } from './nodes/acuity-scheduling-trigger-node.js';
import { adaloNode } from './nodes/adalo-node.js';
import { affinityNode } from './nodes/affinity-node.js';
import { affinitytriggerNode } from './nodes/affinity-trigger-node.js';
import { aggregateNode } from './nodes/aggregate-node.js';
import { agilecrmNode } from './nodes/agile-crm-node.js';
import { aiagentNode } from './nodes/ai-agent-node.js';
import { aitransformNode } from './nodes/ai-transform-node.js';
import { airtableNode } from './nodes/airtable-node.js';
import { airtabletriggerNode } from './nodes/airtable-trigger-node.js';
import { airtopNode } from './nodes/airtop-node.js';
import { amqpsenderNode } from './nodes/amqp-sender-node.js';
import { amqptriggerNode } from './nodes/amqp-trigger-node.js';
import { anthropicchatmodelNode } from './nodes/anthropic-chat-model-node.js';
import { apitemplateioNode } from './nodes/apitemplateio-node.js';
import { asanaNode } from './nodes/asana-node.js';
import { asanatriggerNode } from './nodes/asana-trigger-node.js';
import { autofixingoutputparserNode } from './nodes/autofixing-output-parser-node.js';
import { automizyNode } from './nodes/automizy-node.js';
import { autopilotNode } from './nodes/autopilot-node.js';
import { autopilottriggerNode } from './nodes/autopilot-trigger-node.js';
import { awsbedrockchatmodelNode } from './nodes/aws-bedrock-chat-model-node.js';
import { awscertificatemanagerNode } from './nodes/aws-certificate-manager-node.js';
import { awscomprehendNode } from './nodes/aws-comprehend-node.js';
import { awsdynamodbNode } from './nodes/aws-dynamodb-node.js';
import { awselasticloadbalancingNode } from './nodes/aws-elastic-load-balancing-node.js';
import { awslambdaNode } from './nodes/aws-lambda-node.js';
import { awsrekognitionNode } from './nodes/aws-rekognition-node.js';
import { awss3Node } from './nodes/aws-s3-node.js';
import { awssesNode } from './nodes/aws-ses-node.js';
import { awssnsNode } from './nodes/aws-sns-node.js';
import { awssnstriggerNode } from './nodes/aws-sns-trigger-node.js';
import { awssqsNode } from './nodes/aws-sqs-node.js';
import { awstextractNode } from './nodes/aws-textract-node.js';
import { awstranscribeNode } from './nodes/aws-transcribe-node.js';
import { azurecosmosdbNode } from './nodes/azure-cosmos-db-node.js';
import { azureopenaichatmodelNode } from './nodes/azure-openai-chat-model-node.js';
import { azurestorageNode } from './nodes/azure-storage-node.js';
import { bamboohrNode } from './nodes/bamboohr-node.js';
import { bannerbearNode } from './nodes/bannerbear-node.js';
import { baserowNode } from './nodes/baserow-node.js';
import { basicllmchainNode } from './nodes/basic-llm-chain-node.js';
import { beeminderNode } from './nodes/beeminder-node.js';
import { bigcommerceNode } from './nodes/bigcommerce-node.js';
import { bitbucketNode } from './nodes/bitbucket-node.js';
import { bitbuckettriggerNode } from './nodes/bitbucket-trigger-node.js';
import { bitlyNode } from './nodes/bitly-node.js';
import { bitwardenNode } from './nodes/bitwarden-node.js';
import { boxNode } from './nodes/box-node.js';
import { boxtriggerNode } from './nodes/box-trigger-node.js';
import { brandfetchNode } from './nodes/brandfetch-node.js';
import { brevoNode } from './nodes/brevo-node.js';
import { brevotriggerNode } from './nodes/brevo-trigger-node.js';
import { bubbleNode } from './nodes/bubble-node.js';
import { caltriggerNode } from './nodes/cal-trigger-node.js';
import { calculatorNode } from './nodes/calculator-node.js';
import { calendlytriggerNode } from './nodes/calendly-trigger-node.js';
import { calln8nworkflowtoolNode } from './nodes/call-n8n-workflow-tool-node.js';
import { charactertextsplitterNode } from './nodes/character-text-splitter-node.js';
import { chargebeeNode } from './nodes/chargebee-node.js';
import { chargebeetriggerNode } from './nodes/chargebee-trigger-node.js';
import { chatmemorymanagerNode } from './nodes/chat-memory-manager-node.js';
import { chattriggerNode } from './nodes/chat-trigger-node.js';
import { circleciNode } from './nodes/circleci-node.js';
import { claudeNode } from './nodes/claude-node.js';
import { clearbitNode } from './nodes/clearbit-node.js';
import { clickupNode } from './nodes/clickup-node.js';
import { clickuptriggerNode } from './nodes/clickup-trigger-node.js';
import { clockifyNode } from './nodes/clockify-node.js';
import { clockifytriggerNode } from './nodes/clockify-trigger-node.js';
import { cloudflareNode } from './nodes/cloudflare-node.js';
import { cockpitNode } from './nodes/cockpit-node.js';
import { codaNode } from './nodes/coda-node.js';
import { codeNode } from './nodes/code-node.js';
import { coheremodelNode } from './nodes/cohere-model-node.js';
import { coingeckoNode } from './nodes/coingecko-node.js';
import { comparedatasetsNode } from './nodes/compare-datasets-node.js';
import { compressionNode } from './nodes/compression-node.js';
import { contentfulNode } from './nodes/contentful-node.js';
import { contextualcompressionretrieverNode } from './nodes/contextual-compression-retriever-node.js';
import { conversationalagentNode } from './nodes/conversational-agent-node.js';
import { converttofileNode } from './nodes/convert-to-file-node.js';
import { convertkitNode } from './nodes/convertkit-node.js';
import { convertkittriggerNode } from './nodes/convertkit-trigger-node.js';
import { copperNode } from './nodes/copper-node.js';
import { coppertriggerNode } from './nodes/copper-trigger-node.js';
import { cortexNode } from './nodes/cortex-node.js';
import { cratedbNode } from './nodes/cratedb-node.js';
import { crowddevNode } from './nodes/crowddev-node.js';
import { crowddevtriggerNode } from './nodes/crowddev-trigger-node.js';
import { cryptoNode } from './nodes/crypto-node.js';
import { customcodetoolNode } from './nodes/custom-code-tool-node.js';
import { customerdatastoren8ntrainingNode } from './nodes/customer-datastore-n8n-training-node.js';
import { customermessengern8ntrainingNode } from './nodes/customer-messenger-n8n-training-node.js';
import { customerioNode } from './nodes/customerio-node.js';
import { customeriotriggerNode } from './nodes/customerio-trigger-node.js';
import { datetimeNode } from './nodes/date-time-node.js';
import { debughelperNode } from './nodes/debug-helper-node.js';
import { deeplNode } from './nodes/deepl-node.js';
import { deepseekchatmodelNode } from './nodes/deepseek-chat-model-node.js';
import { defaultdataloaderNode } from './nodes/default-data-loader-node.js';
import { demioNode } from './nodes/demio-node.js';
import { dhlNode } from './nodes/dhl-node.js';
import { discordNode } from './nodes/discord-node.js';
import { discourseNode } from './nodes/discourse-node.js';
import { disqusNode } from './nodes/disqus-node.js';
import { driftNode } from './nodes/drift-node.js';
import { dropboxNode } from './nodes/dropbox-node.js';
import { dropcontactNode } from './nodes/dropcontact-node.js';
import { editfieldssetNode } from './nodes/edit-fields-set-node.js';
import { editimageNode } from './nodes/edit-image-node.js';
import { egoiNode } from './nodes/egoi-node.js';
import { elasticsecurityNode } from './nodes/elastic-security-node.js';
import { elasticsearchNode } from './nodes/elasticsearch-node.js';
import { emailtriggerimapNode } from './nodes/email-trigger-imap-node.js';
import { embeddingsawsbedrockNode } from './nodes/embeddings-aws-bedrock-node.js';
import { embeddingsazureopenaiNode } from './nodes/embeddings-azure-openai-node.js';
import { embeddingscohereNode } from './nodes/embeddings-cohere-node.js';
import { embeddingsgooglegeminiNode } from './nodes/embeddings-google-gemini-node.js';
import { embeddingsgooglepalmNode } from './nodes/embeddings-google-palm-node.js';
import { embeddingsgooglevertexNode } from './nodes/embeddings-google-vertex-node.js';
import { embeddingshuggingfaceinferenceNode } from './nodes/embeddings-huggingface-inference-node.js';
import { embeddingsmistralcloudNode } from './nodes/embeddings-mistral-cloud-node.js';
import { embeddingsollamaNode } from './nodes/embeddings-ollama-node.js';
import { embeddingsopenaiNode } from './nodes/embeddings-openai-node.js';
import { emeliaNode } from './nodes/emelia-node.js';
import { emeliatriggerNode } from './nodes/emelia-trigger-node.js';
import { githubNodeComplete } from './nodes/enhanced-github-node.js';
import { githubNodeEnhancedV2 } from './nodes/enhanced-github-v2-node.js';
import { httpRequestNodeComplete } from './nodes/enhanced-http-request-node.js';
import { openaiNodeEnhanced } from './nodes/enhanced-openai-node.js';
import { slackNodeEnhanced } from './nodes/enhanced-slack-node.js';
import { erpnextNode } from './nodes/erpnext-node.js';
import { errortriggerNode } from './nodes/error-trigger-node.js';
import { evaluationNode } from './nodes/evaluation-node.js';
import { evaluationtriggerNode } from './nodes/evaluation-trigger-node.js';
import { eventbritetriggerNode } from './nodes/eventbrite-trigger-node.js';
import { executecommandNode } from './nodes/execute-command-node.js';
import { executesubworkflowNode } from './nodes/execute-subworkflow-node.js';
import { executesubworkflowtriggerNode } from './nodes/execute-subworkflow-trigger-node.js';
import { executiondataNode } from './nodes/execution-data-node.js';
import { extractfromfileNode } from './nodes/extract-from-file-node.js';
import { facebookgraphapiNode } from './nodes/facebook-graph-api-node.js';
import { facebookleadadstriggerNode } from './nodes/facebook-lead-ads-trigger-node.js';
import { facebookNode } from './nodes/facebook-node.js';
import { facebooktriggerNode } from './nodes/facebook-trigger-node.js';
import { figmatriggerbetaNode } from './nodes/figma-trigger-beta-node.js';
import { filemakerNode } from './nodes/filemaker-node.js';
import { filterNode } from './nodes/filter-node.js';
import { flowNode } from './nodes/flow-node.js';
import { flowtriggerNode } from './nodes/flow-trigger-node.js';
import { formiotriggerNode } from './nodes/formio-trigger-node.js';
import { formstacktriggerNode } from './nodes/formstack-trigger-node.js';
import { freshdeskNode } from './nodes/freshdesk-node.js';
import { freshserviceNode } from './nodes/freshservice-node.js';
import { freshworkscrmNode } from './nodes/freshworks-crm-node.js';
import { ftpNode } from './nodes/ftp-node.js';
import { functionNode } from './nodes/function-node.js';
import { getresponseNode } from './nodes/getresponse-node.js';
import { getresponsetriggerNode } from './nodes/getresponse-trigger-node.js';
import { ghostNode } from './nodes/ghost-node.js';
import { gitNode } from './nodes/git-node.js';
import { githubdocumentloaderNode } from './nodes/github-document-loader-node.js';
import { githubNode } from './nodes/github-node.js';
import { githubtriggerNode } from './nodes/github-trigger-node.js';
import { gitlabNode } from './nodes/gitlab-node.js';
import { gitlabtriggerNode } from './nodes/gitlab-trigger-node.js';
import { gmailNode } from './nodes/gmail-node-real.js';
import { gmailtriggerNode } from './nodes/gmail-trigger-node.js';
import { gongNode } from './nodes/gong-node.js';
import { googleadsNode } from './nodes/google-ads-node.js';
import { googleAnalyticsNode } from './nodes/google-analytics-node.js';
import { googlebigqueryNode } from './nodes/google-bigquery-node.js';
import { googlebooksNode } from './nodes/google-books-node.js';
import { googlebusinessprofileNode } from './nodes/google-business-profile-node.js';
import { googlebusinessprofiletriggerNode } from './nodes/google-business-profile-trigger-node.js';
import { googlecalendarNode } from './nodes/google-calendar-node.js';
import { googlecalendartriggerNode } from './nodes/google-calendar-trigger-node.js';
import { googlechatNode } from './nodes/google-chat-node.js';
import { googlecloudfirestoreNode } from './nodes/google-cloud-firestore-node.js';
import { googlecloudnaturallanguageNode } from './nodes/google-cloud-natural-language-node.js';
import { googlecloudrealtimedatabaseNode } from './nodes/google-cloud-realtime-database-node.js';
import { googlecloudstorageNode } from './nodes/google-cloud-storage-node.js';
import { googlecontactsNode } from './nodes/google-contacts-node.js';
import { googledocsNode } from './nodes/google-docs-node.js';
import { googleDriveNode } from './nodes/google-drive-node.js';
import { googledrivetriggerNode } from './nodes/google-drive-trigger-node.js';
import { googlegeminichatmodelNode } from './nodes/google-gemini-chat-model-node.js';
import { googleperspectiveNode } from './nodes/google-perspective-node.js';
import { googleSheetsNode } from './nodes/google-sheets-node.js';
import { googlesheetstriggerNode } from './nodes/google-sheets-trigger-node.js';
import { googleslidesNode } from './nodes/google-slides-node.js';
import { googletasksNode } from './nodes/google-tasks-node.js';
import { googletranslateNode } from './nodes/google-translate-node.js';
import { googlevertexchatmodelNode } from './nodes/google-vertex-chat-model-node.js';
import { googleworkspaceadminNode } from './nodes/google-workspace-admin-node.js';
import { gotifyNode } from './nodes/gotify-node.js';
import { gotowebinarNode } from './nodes/gotowebinar-node.js';
import { grafanaNode } from './nodes/grafana-node.js';
import { graphqlNode } from './nodes/graphql-node.js';
import { gristNode } from './nodes/grist-node.js';
import { groqchatmodelNode } from './nodes/groq-chat-model-node.js';
import { gumroadtriggerNode } from './nodes/gumroad-trigger-node.js';
import { hackernewsNode } from './nodes/hacker-news-node.js';
import { halopsaNode } from './nodes/halopsa-node.js';
import { harvestNode } from './nodes/harvest-node.js';
import { helpscoutNode } from './nodes/help-scout-node.js';
import { helpscouttriggerNode } from './nodes/help-scout-trigger-node.js';
import { highlevelNode } from './nodes/highlevel-node.js';
import { homeassistantNode } from './nodes/home-assistant-node.js';
import { htmlNode } from './nodes/html-node.js';
import { httprequestNode } from './nodes/http-request-node.js';
import { hubspotNode } from './nodes/hubspot-node.js';
import { hubspottriggerNode } from './nodes/hubspot-trigger-node.js';
import { huggingfaceinferencemodelNode } from './nodes/hugging-face-inference-model-node.js';
import { humanticaiNode } from './nodes/humantic-ai-node.js';
import { hunterNode } from './nodes/hunter-node.js';
import { ifNode } from './nodes/if-node-real.js';
import { informationextractorNode } from './nodes/information-extractor-node.js';
import { intercomNode } from './nodes/intercom-node.js';
import { invoiceninjaNode } from './nodes/invoice-ninja-node.js';
import { invoiceninjatriggerNode } from './nodes/invoice-ninja-trigger-node.js';
import { itemlistoutputparserNode } from './nodes/item-list-output-parser-node.js';
import { iterableNode } from './nodes/iterable-node.js';
import { jenkinsNode } from './nodes/jenkins-node.js';
import { jinaaiNode } from './nodes/jina-ai-node.js';
import { jiraNode } from './nodes/jira-software-node.js';
import { jiratriggerNode } from './nodes/jira-trigger-node.js';
import { jotformtriggerNode } from './nodes/jotform-trigger-node.js';
import { jwtNode } from './nodes/jwt-node.js';
import { kafkaNode } from './nodes/kafka-node.js';
import { kafkatriggerNode } from './nodes/kafka-trigger-node.js';
import { keapNode } from './nodes/keap-node.js';
import { keaptriggerNode } from './nodes/keap-trigger-node.js';
import { kitemakerNode } from './nodes/kitemaker-node.js';
import { kobotoolboxNode } from './nodes/kobotoolbox-node.js';
import { kobotoolboxtriggerNode } from './nodes/kobotoolbox-trigger-node.js';
import { langchainChainLlmNode } from './nodes/langchain-chain-llm-node.js';
import { langchaincodeNode } from './nodes/langchain-code-node.js';
import { langchainOpenAINode } from './nodes/langchain-openai-node.js';
import { langchainOutputParserNode } from './nodes/langchain-output-parser-node.js';
import { langchainTextClassifierNode } from './nodes/langchain-text-classifier-node.js';
import { ldapNode } from './nodes/ldap-node.js';
import { lemlistNode } from './nodes/lemlist-node.js';
import { lemlisttriggerNode } from './nodes/lemlist-trigger-node.js';
import { limitNode } from './nodes/limit-node.js';
import { lineNode } from './nodes/line-node.js';
import { linearNode } from './nodes/linear-node.js';
import { lineartriggerNode } from './nodes/linear-trigger-node.js';
import { lingvanexNode } from './nodes/lingvanex-node.js';
import { linkedinNode } from './nodes/linkedin-node.js';
import { localfiletriggerNode } from './nodes/local-file-trigger-node.js';
import { lonescaleNode } from './nodes/lonescale-node.js';
import { lonescaletriggerNode } from './nodes/lonescale-trigger-node.js';
import { loopoveritemssplitinbatchesNode } from './nodes/loop-over-items-split-in-batches-node.js';
import { magento2Node } from './nodes/magento-2-node.js';
import { mailcheckNode } from './nodes/mailcheck-node.js';
import { mailchimpNode } from './nodes/mailchimp-node.js';
import { mailchimptriggerNode } from './nodes/mailchimp-trigger-node.js';
import { mailerliteNode } from './nodes/mailerlite-node.js';
import { mailerlitetriggerNode } from './nodes/mailerlite-trigger-node.js';
import { mailgunNode } from './nodes/mailgun-node.js';
import { mailjetNode } from './nodes/mailjet-node.js';
import { mailjettriggerNode } from './nodes/mailjet-trigger-node.js';
import { mandrillNode } from './nodes/mandrill-node.js';
import { manualtriggerNode } from './nodes/manual-trigger-node.js';
import { markdownNode } from './nodes/markdown-node.js';
import { marketstackNode } from './nodes/marketstack-node.js';
import { matrixNode } from './nodes/matrix-node.js';
import { mattermostNode } from './nodes/mattermost-node.js';
import { mauticNode } from './nodes/mautic-node.js';
import { mautictriggerNode } from './nodes/mautic-trigger-node.js';
import { mcpclienttoolNode } from './nodes/mcp-client-tool-node.js';
import { mcpservertriggerNode } from './nodes/mcp-server-trigger-node.js';
import { mediumNode } from './nodes/medium-node.js';
import { mergeNode } from './nodes/merge-node.js';
import { messagebirdNode } from './nodes/messagebird-node.js';
import { metabaseNode } from './nodes/metabase-node.js';
import { microsoftdynamicscrmNode } from './nodes/microsoft-dynamics-crm-node.js';
import { microsoftentraidNode } from './nodes/microsoft-entra-id-node.js';
import { microsoftexcel365Node } from './nodes/microsoft-excel-365-node.js';
import { microsoftExcelNode } from './nodes/microsoft-excel-node.js';
import { microsoftgraphsecurityNode } from './nodes/microsoft-graph-security-node.js';
import { microsoftNode } from './nodes/microsoft-node.js';
import { microsoftOneDriveNode } from './nodes/microsoft-onedrive-node.js';
import { microsoftonedrivetriggerNode } from './nodes/microsoft-onedrive-trigger-node.js';
import { microsoftoutlookNode } from './nodes/microsoft-outlook-node.js';
import { microsoftoutlooktriggerNode } from './nodes/microsoft-outlook-trigger-node.js';
import { microsoftsharepointNode } from './nodes/microsoft-sharepoint-node.js';
import { microsoftsqlNode } from './nodes/microsoft-sql-node.js';
import { microsoftTeamsNode } from './nodes/microsoft-teams-node.js';
import { microsoftteamstriggerNode } from './nodes/microsoft-teams-trigger-node.js';
import { microsofttodoNode } from './nodes/microsoft-to-do-node.js';
import { microsoftSharePointNode } from './nodes/microsoftsharepoint-node.js';
import { microsoftToDoNode } from './nodes/microsofttodo-node.js';
import { milvusvectorstoreNode } from './nodes/milvus-vector-store-node.js';
import { mindeeNode } from './nodes/mindee-node.js';
import { mispNode } from './nodes/misp-node.js';
import { mistralcloudchatmodelNode } from './nodes/mistral-cloud-chat-model-node.js';
import { moceanNode } from './nodes/mocean-node.js';
import { mondayComNode } from './nodes/monday-com-node.js';
import { mondaycomNode } from './nodes/mondaycom-node.js';
import { mongodbatlasvectorstoreNode } from './nodes/mongodb-atlas-vector-store-node.js';
import { mongodbchatmemoryNode } from './nodes/mongodb-chat-memory-node.js';
import { mongodbNode } from './nodes/mongodb-node.js';
import { monicacrmNode } from './nodes/monica-crm-node.js';
import { motorheadNode } from './nodes/motorhead-node.js';
import { mqttNode } from './nodes/mqtt-node.js';
import { mqtttriggerNode } from './nodes/mqtt-trigger-node.js';
import { msg91Node } from './nodes/msg91-node.js';
import { multiqueryretrieverNode } from './nodes/multiquery-retriever-node.js';
import { mysqlNode } from './nodes/mysql-node.js';
import { n8nformNode } from './nodes/n8n-form-node.js';
import { n8nformtriggerNode } from './nodes/n8n-form-trigger-node.js';
import { n8nNode } from './nodes/n8n-node.js';
import { n8ntriggerNode } from './nodes/n8n-trigger-node.js';
import { nasaNode } from './nodes/nasa-node.js';
import { netlifyNode } from './nodes/netlify-node.js';
import { netlifytriggerNode } from './nodes/netlify-trigger-node.js';
import { nextcloudNode } from './nodes/nextcloud-node.js';
import { nooperationdonothingNode } from './nodes/no-operation-do-nothing-node.js';
import { nocodbNode } from './nodes/nocodb-node.js';
import { notionNode } from './nodes/notion-node.js';
import { notiontriggerNode } from './nodes/notion-trigger-node.js';
import { npmNode } from './nodes/npm-node.js';
import { odooNode } from './nodes/odoo-node.js';
import { oktaNode } from './nodes/okta-node.js';
import { ollamachatmodelNode } from './nodes/ollama-chat-model-node.js';
import { ollamamodelNode } from './nodes/ollama-model-node.js';
import { oneSimpleApiNode } from './nodes/one-simple-api-node.js';
import { onfleetNode } from './nodes/onfleet-node.js';
import { onfleettriggerNode } from './nodes/onfleet-trigger-node.js';
import { openaichatmodelNode } from './nodes/openai-chat-model-node.js';
import { openaifunctionsagentNode } from './nodes/openai-functions-agent-node.js';
import { openaiNode } from './nodes/openai-node.js';
import { openrouterchatmodelNode } from './nodes/openrouter-chat-model-node.js';
import { openthesaurusNode } from './nodes/openthesaurus-node.js';
import { openweathermapNode } from './nodes/openweathermap-node.js';
import { ouraNode } from './nodes/oura-node.js';
import { overwatchNode } from './nodes/overwatch-node.js';
import { paddleNode } from './nodes/paddle-node.js';
import { pagerdutyNode } from './nodes/pagerduty-node.js';
import { paypalNode } from './nodes/paypal-node.js';
import { paypaltriggerNode } from './nodes/paypal-trigger-node.js';
import { peekalinkNode } from './nodes/peekalink-node.js';
import { perplexityNode } from './nodes/perplexity-node.js';
import { pgvectorvectorstoreNode } from './nodes/pgvector-vector-store-node.js';
import { phantombusterNode } from './nodes/phantombuster-node.js';
import { philipshueNode } from './nodes/philips-hue-node.js';
import { pineconevectorstoreNode } from './nodes/pinecone-vector-store-node.js';
import { pipedriveNode } from './nodes/pipedrive-node.js';
import { pipedrivetriggerNode } from './nodes/pipedrive-trigger-node.js';
import { planandexecuteagentNode } from './nodes/plan-and-execute-agent-node.js';
import { plivoNode } from './nodes/plivo-node.js';
import { postbinNode } from './nodes/postbin-node.js';
import { postgreschatmemoryNode } from './nodes/postgres-chat-memory-node.js';
import { postgresNode } from './nodes/postgres-node.js';
import { postgrestriggerNode } from './nodes/postgres-trigger-node.js';
import { posthogNode } from './nodes/posthog-node.js';
import { postmarkTriggerNode } from './nodes/postmark-node.js';
import { postmarktriggerNode } from './nodes/postmark-trigger-node.js';
import { profitwellNode } from './nodes/profitwell-node.js';
import { pushbulletNode } from './nodes/pushbullet-node.js';
import { pushcutNode } from './nodes/pushcut-node.js';
import { pushcuttriggerNode } from './nodes/pushcut-trigger-node.js';
import { pushoverNode } from './nodes/pushover-node.js';
import { qdrantvectorstoreNode } from './nodes/qdrant-vector-store-node.js';
import { questdbNode } from './nodes/questdb-node.js';
import { questionandanswerchainNode } from './nodes/question-and-answer-chain-node.js';
import { quickbaseNode } from './nodes/quick-base-node.js';
import { quickbooksNode } from './nodes/quickbooks-node.js';
import { quickbooksonlineNode } from './nodes/quickbooks-online-node.js';
import { quickchartNode } from './nodes/quickchart-node.js';
import { rabbitmqNode } from './nodes/rabbitmq-node.js';
import { rabbitmqtriggerNode } from './nodes/rabbitmq-trigger-node.js';
import { raindropNode } from './nodes/raindrop-node.js';
import { reactagentNode } from './nodes/react-agent-node.js';
import { readwritefilesfromdiskNode } from './nodes/readwrite-files-from-disk-node.js';
import { recursivecharactertextsplitterNode } from './nodes/recursive-character-text-splitter-node.js';
import { redditNode } from './nodes/reddit-node.js';
import { redischatmemoryNode } from './nodes/redis-chat-memory-node.js';
import { redisNode } from './nodes/redis-node.js';
import { redistriggerNode } from './nodes/redis-trigger-node.js';
import { removeduplicatesNode } from './nodes/remove-duplicates-node.js';
import { renamekeysNode } from './nodes/rename-keys-node.js';
import { rerankercohereNode } from './nodes/reranker-cohere-node.js';
import { respondtowebhookNode } from './nodes/respond-to-webhook-node.js';
import { rocketchatNode } from './nodes/rocketchat-node.js';
import { rssfeedtriggerNode } from './nodes/rss-feed-trigger-node.js';
import { rssreadNode } from './nodes/rss-read-node.js';
import { rundeckNode } from './nodes/rundeck-node.js';
import { s3Node } from './nodes/s3-node.js';
import { salesforceNode } from './nodes/salesforce-node.js';
import { salesforcetriggerNode } from './nodes/salesforce-trigger-node.js';
import { salesmateNode } from './nodes/salesmate-node.js';
import { scheduleTriggerNode } from './nodes/schedule-trigger-node.js';
import { searxngtoolNode } from './nodes/searxng-tool-node.js';
import { seatableNode } from './nodes/seatable-node.js';
import { seatabletriggerNode } from './nodes/seatable-trigger-node.js';
import { securityscorecardNode } from './nodes/securityscorecard-node.js';
import { segmentNode } from './nodes/segment-node.js';
import { sendemailNode } from './nodes/send-email-node.js';
import { sendgridNode } from './nodes/sendgrid-node.js';
import { sendyNode } from './nodes/sendy-node.js';
import { sentimentanalysisNode } from './nodes/sentiment-analysis-node.js';
import { sentryioNode } from './nodes/sentryio-node.js';
import { serpapigooglesearchNode } from './nodes/serpapi-google-search-node.js';
import { servicenowNode } from './nodes/servicenow-node.js';
import { setNode } from './nodes/set-node-real.js';
import { sevenNode } from './nodes/seven-node.js';
import { shopifyNode } from './nodes/shopify-node.js';
import { shopifytriggerNode } from './nodes/shopify-trigger-node.js';
import { signl4Node } from './nodes/signl4-node.js';
import { simplememoryNode } from './nodes/simple-memory-node.js';
import { simplevectorstoreNode } from './nodes/simple-vector-store-node.js';
import { slackNode } from './nodes/slack-node-real.js';
import { slacktriggerNode } from './nodes/slack-trigger-node.js';
import { snowflakeNode } from './nodes/snowflake-node.js';
import { sortNode } from './nodes/sort-node.js';
import { splitoutNode } from './nodes/split-out-node.js';
import { splunkNode } from './nodes/splunk-node.js';
import { spontitNode } from './nodes/spontit-node.js';
import { spotifyNode } from './nodes/spotify-node.js';
import { sqlagentNode } from './nodes/sql-agent-node.js';
import { ssetriggerNode } from './nodes/sse-trigger-node.js';
import { sshNode } from './nodes/ssh-node.js';
import { stackbyNode } from './nodes/stackby-node.js';
import { stopanderrorNode } from './nodes/stop-and-error-node.js';
import { storyblokNode } from './nodes/storyblok-node.js';
import { strapiNode } from './nodes/strapi-node.js';
import { stravaNode } from './nodes/strava-node.js';
import { stravatriggerNode } from './nodes/strava-trigger-node.js';
import { stripeNode } from './nodes/stripe-node.js';
import { stripetriggerNode } from './nodes/stripe-trigger-node.js';
import { structuredoutputparserNode } from './nodes/structured-output-parser-node.js';
import { summarizationchainNode } from './nodes/summarization-chain-node.js';
import { summarizeNode } from './nodes/summarize-node.js';
import { supabaseNode } from './nodes/supabase-node.js';
import { supabasevectorstoreNode } from './nodes/supabase-vector-store-node.js';
import { surveymonkeytriggerNode } from './nodes/surveymonkey-trigger-node.js';
import { switchNode } from './nodes/switch-node.js';
import { syncromspNode } from './nodes/syncromsp-node.js';
import { taigaNode } from './nodes/taiga-node.js';
import { taigatriggerNode } from './nodes/taiga-trigger-node.js';
import { tapfiliateNode } from './nodes/tapfiliate-node.js';
import { telegramNode } from './nodes/telegram-node.js';
import { telegramtriggerNode } from './nodes/telegram-trigger-node.js';
import { textclassifierNode } from './nodes/text-classifier-node.js';
import { thehive5Node } from './nodes/thehive-5-node.js';
import { thehive5triggerNode } from './nodes/thehive-5-trigger-node.js';
import { thehiveNode } from './nodes/thehive-node.js';
import { thehivetriggerNode } from './nodes/thehive-trigger-node.js';
import { thinktoolNode } from './nodes/think-tool-node.js';
import { timescaledbNode } from './nodes/timescaledb-node.js';
import { todoistNode } from './nodes/todoist-node.js';
import { toggltriggerNode } from './nodes/toggl-trigger-node.js';
import { tokensplitterNode } from './nodes/token-splitter-node.js';
import { toolsagentNode } from './nodes/tools-agent-node.js';
import { totpNode } from './nodes/totp-node.js';
import { travisciNode } from './nodes/travis-ci-node.js';
import { trelloNode } from './nodes/trello-node.js';
import { trellotriggerNode } from './nodes/trello-trigger-node.js';
import { twakeNode } from './nodes/twake-node.js';
import { twilioNode } from './nodes/twilio-node.js';
import { twiliotriggerNode } from './nodes/twilio-trigger-node.js';
import { twistNode } from './nodes/twist-node.js';
import { twitterNode } from './nodes/twitter-node.js';
import { typeformtriggerNode } from './nodes/typeform-trigger-node.js';
import { unleashedsoftwareNode } from './nodes/unleashed-software-node.js';
import { upleadNode } from './nodes/uplead-node.js';
import { uprocNode } from './nodes/uproc-node.js';
import { uptimerobotNode } from './nodes/uptimerobot-node.js';
import { urlscanioNode } from './nodes/urlscanio-node.js';
import { vectorstorequestionanswertoolNode } from './nodes/vector-store-question-answer-tool-node.js';
import { vectorstoreretrieverNode } from './nodes/vector-store-retriever-node.js';
import { venafitlsprotectcloudNode } from './nodes/venafi-tls-protect-cloud-node.js';
import { venafitlsprotectcloudtriggerNode } from './nodes/venafi-tls-protect-cloud-trigger-node.js';
import { venafitlsprotectdatacenterNode } from './nodes/venafi-tls-protect-datacenter-node.js';
import { veroNode } from './nodes/vero-node.js';
import { vonageNode } from './nodes/vonage-node.js';
import { waitNode } from './nodes/wait-node.js';
import { webexbyciscoNode } from './nodes/webex-by-cisco-node.js';
import { webexbyciscotriggerNode } from './nodes/webex-by-cisco-trigger-node.js';
import { webflowNode } from './nodes/webflow-node.js';
import { webflowtriggerNode } from './nodes/webflow-trigger-node.js';
import { webhookNode } from './nodes/webhook-node.js';
import { wekanNode } from './nodes/wekan-node.js';
import { whatsappbusinesscloudNode } from './nodes/whatsapp-business-cloud-node.js';
import { whatsappNode } from './nodes/whatsapp-node.js';
import { whatsapptriggerNode } from './nodes/whatsapp-trigger-node.js';
import { wikipediaNode } from './nodes/wikipedia-node.js';
import { wiseNode } from './nodes/wise-node.js';
import { wisetriggerNode } from './nodes/wise-trigger-node.js';
import { wolframalphaNode } from './nodes/wolframalpha-node.js';
import { woocommerceNode } from './nodes/woocommerce-node.js';
import { woocommercetriggerNode } from './nodes/woocommerce-trigger-node.js';
import { wordpressNode } from './nodes/wordpress-node.js';
import { workabletriggerNode } from './nodes/workable-trigger-node.js';
import { workflowretrieverNode } from './nodes/workflow-retriever-node.js';
import { workflowtriggerNode } from './nodes/workflow-trigger-node.js';
import { wufootriggerNode } from './nodes/wufoo-trigger-node.js';
import { xformerlytwitterNode } from './nodes/x-formerly-twitter-node.js';
import { xaigrokchatmodelNode } from './nodes/xai-grok-chat-model-node.js';
import { xataNode } from './nodes/xata-node.js';
import { xeroNode } from './nodes/xero-node.js';
import { xmlNode } from './nodes/xml-node.js';
import { yourlsNode } from './nodes/yourls-node.js';
import { youtubeNode } from './nodes/youtube-node.js';
import { zammadNode } from './nodes/zammad-node.js';
import { zendeskNode } from './nodes/zendesk-node.js';
import { zendesktriggerNode } from './nodes/zendesk-trigger-node.js';
import { zepNode } from './nodes/zep-node.js';
import { zepvectorstoreNode } from './nodes/zep-vector-store-node.js';
import { zohocrmNode } from './nodes/zoho-crm-node.js';
import { zoomNode } from './nodes/zoom-node.js';
import { zulipNode } from './nodes/zulip-node.js';

/**
 * All production-ready nodes in a single array
 */
export const ALL_PRODUCTION_NODES: NodeTypeInfo[] = [
  actionnetworkNode,
  activationtriggerNode,
  activecampaignNode,
  activecampaigntriggerNode,
  acuityschedulingtriggerNode,
  adaloNode,
  affinityNode,
  affinitytriggerNode,
  aggregateNode,
  agilecrmNode,
  aiagentNode,
  aitransformNode,
  airtableNode,
  airtabletriggerNode,
  airtopNode,
  amqpsenderNode,
  amqptriggerNode,
  anthropicchatmodelNode,
  apitemplateioNode,
  asanaNode,
  asanatriggerNode,
  autofixingoutputparserNode,
  automizyNode,
  autopilotNode,
  autopilottriggerNode,
  awsbedrockchatmodelNode,
  awscertificatemanagerNode,
  awscomprehendNode,
  awsdynamodbNode,
  awselasticloadbalancingNode,
  awslambdaNode,
  awsrekognitionNode,
  awss3Node,
  awssesNode,
  awssnsNode,
  awssnstriggerNode,
  awssqsNode,
  awstextractNode,
  awstranscribeNode,
  azurecosmosdbNode,
  azureopenaichatmodelNode,
  azurestorageNode,
  bamboohrNode,
  bannerbearNode,
  baserowNode,
  basicllmchainNode,
  beeminderNode,
  bigcommerceNode,
  bitbucketNode,
  bitbuckettriggerNode,
  bitlyNode,
  bitwardenNode,
  boxNode,
  boxtriggerNode,
  brandfetchNode,
  brevoNode,
  brevotriggerNode,
  bubbleNode,
  caltriggerNode,
  calculatorNode,
  calendlytriggerNode,
  calln8nworkflowtoolNode,
  charactertextsplitterNode,
  chargebeeNode,
  chargebeetriggerNode,
  chatmemorymanagerNode,
  chattriggerNode,
  circleciNode,
  claudeNode,
  clearbitNode,
  clickupNode,
  clickuptriggerNode,
  clockifyNode,
  clockifytriggerNode,
  cloudflareNode,
  cockpitNode,
  codaNode,
  codeNode,
  coheremodelNode,
  coingeckoNode,
  comparedatasetsNode,
  compressionNode,
  contentfulNode,
  contextualcompressionretrieverNode,
  conversationalagentNode,
  converttofileNode,
  convertkitNode,
  convertkittriggerNode,
  copperNode,
  coppertriggerNode,
  cortexNode,
  cratedbNode,
  crowddevNode,
  crowddevtriggerNode,
  cryptoNode,
  customcodetoolNode,
  customerdatastoren8ntrainingNode,
  customermessengern8ntrainingNode,
  customerioNode,
  customeriotriggerNode,
  datetimeNode,
  debughelperNode,
  deeplNode,
  deepseekchatmodelNode,
  defaultdataloaderNode,
  demioNode,
  dhlNode,
  discordNode,
  discourseNode,
  disqusNode,
  driftNode,
  dropboxNode,
  dropcontactNode,
  editfieldssetNode,
  editimageNode,
  egoiNode,
  elasticsecurityNode,
  elasticsearchNode,
  emailtriggerimapNode,
  embeddingsawsbedrockNode,
  embeddingsazureopenaiNode,
  embeddingscohereNode,
  embeddingsgooglegeminiNode,
  embeddingsgooglepalmNode,
  embeddingsgooglevertexNode,
  embeddingshuggingfaceinferenceNode,
  embeddingsmistralcloudNode,
  embeddingsollamaNode,
  embeddingsopenaiNode,
  emeliaNode,
  emeliatriggerNode,
  githubNodeComplete,
  githubNodeEnhancedV2,
  httpRequestNodeComplete,
  openaiNodeEnhanced,
  slackNodeEnhanced,
  erpnextNode,
  errortriggerNode,
  evaluationNode,
  evaluationtriggerNode,
  eventbritetriggerNode,
  executecommandNode,
  executesubworkflowNode,
  executesubworkflowtriggerNode,
  executiondataNode,
  extractfromfileNode,
  facebookgraphapiNode,
  facebookleadadstriggerNode,
  facebookNode,
  facebooktriggerNode,
  figmatriggerbetaNode,
  filemakerNode,
  filterNode,
  flowNode,
  flowtriggerNode,
  formiotriggerNode,
  formstacktriggerNode,
  freshdeskNode,
  freshserviceNode,
  freshworkscrmNode,
  ftpNode,
  functionNode,
  getresponseNode,
  getresponsetriggerNode,
  ghostNode,
  gitNode,
  githubdocumentloaderNode,
  githubNode,
  githubtriggerNode,
  gitlabNode,
  gitlabtriggerNode,
  gmailNode,
  gmailtriggerNode,
  gongNode,
  googleadsNode,
  googleAnalyticsNode,
  googlebigqueryNode,
  googlebooksNode,
  googlebusinessprofileNode,
  googlebusinessprofiletriggerNode,
  googlecalendarNode,
  googlecalendartriggerNode,
  googlechatNode,
  googlecloudfirestoreNode,
  googlecloudnaturallanguageNode,
  googlecloudrealtimedatabaseNode,
  googlecloudstorageNode,
  googlecontactsNode,
  googledocsNode,
  googleDriveNode,
  googledrivetriggerNode,
  googlegeminichatmodelNode,
  googleperspectiveNode,
  googleSheetsNode,
  googlesheetstriggerNode,
  googleslidesNode,
  googletasksNode,
  googletranslateNode,
  googlevertexchatmodelNode,
  googleworkspaceadminNode,
  gotifyNode,
  gotowebinarNode,
  grafanaNode,
  graphqlNode,
  gristNode,
  groqchatmodelNode,
  gumroadtriggerNode,
  hackernewsNode,
  halopsaNode,
  harvestNode,
  helpscoutNode,
  helpscouttriggerNode,
  highlevelNode,
  homeassistantNode,
  htmlNode,
  httprequestNode,
  hubspotNode,
  hubspottriggerNode,
  huggingfaceinferencemodelNode,
  humanticaiNode,
  hunterNode,
  ifNode,
  informationextractorNode,
  intercomNode,
  invoiceninjaNode,
  invoiceninjatriggerNode,
  itemlistoutputparserNode,
  iterableNode,
  jenkinsNode,
  jinaaiNode,
  jiraNode,
  jiratriggerNode,
  jotformtriggerNode,
  jwtNode,
  kafkaNode,
  kafkatriggerNode,
  keapNode,
  keaptriggerNode,
  kitemakerNode,
  kobotoolboxNode,
  kobotoolboxtriggerNode,
  langchainChainLlmNode,
  langchaincodeNode,
  langchainOpenAINode,
  langchainOutputParserNode,
  langchainTextClassifierNode,
  ldapNode,
  lemlistNode,
  lemlisttriggerNode,
  limitNode,
  lineNode,
  linearNode,
  lineartriggerNode,
  lingvanexNode,
  linkedinNode,
  localfiletriggerNode,
  lonescaleNode,
  lonescaletriggerNode,
  loopoveritemssplitinbatchesNode,
  magento2Node,
  mailcheckNode,
  mailchimpNode,
  mailchimptriggerNode,
  mailerliteNode,
  mailerlitetriggerNode,
  mailgunNode,
  mailjetNode,
  mailjettriggerNode,
  mandrillNode,
  manualtriggerNode,
  markdownNode,
  marketstackNode,
  matrixNode,
  mattermostNode,
  mauticNode,
  mautictriggerNode,
  mcpclienttoolNode,
  mcpservertriggerNode,
  mediumNode,
  mergeNode,
  messagebirdNode,
  metabaseNode,
  microsoftdynamicscrmNode,
  microsoftentraidNode,
  microsoftexcel365Node,
  microsoftExcelNode,
  microsoftgraphsecurityNode,
  microsoftNode,
  microsoftOneDriveNode,
  microsoftonedrivetriggerNode,
  microsoftoutlookNode,
  microsoftoutlooktriggerNode,
  microsoftsharepointNode,
  microsoftsqlNode,
  microsoftTeamsNode,
  microsoftteamstriggerNode,
  microsofttodoNode,
  microsoftgraphsecurityNode,
  microsoftSharePointNode,
  microsoftToDoNode,
  milvusvectorstoreNode,
  mindeeNode,
  mispNode,
  mistralcloudchatmodelNode,
  moceanNode,
  mondayComNode,
  mondaycomNode,
  mongodbatlasvectorstoreNode,
  mongodbchatmemoryNode,
  mongodbNode,
  monicacrmNode,
  motorheadNode,
  mqttNode,
  mqtttriggerNode,
  msg91Node,
  multiqueryretrieverNode,
  mysqlNode,
  n8nformNode,
  n8nformtriggerNode,
  n8nNode,
  n8ntriggerNode,
  nasaNode,
  netlifyNode,
  netlifytriggerNode,
  nextcloudNode,
  nooperationdonothingNode,
  nocodbNode,
  notionNode,
  notiontriggerNode,
  npmNode,
  odooNode,
  oktaNode,
  ollamachatmodelNode,
  ollamamodelNode,
  oneSimpleApiNode,
  onfleetNode,
  onfleettriggerNode,
  openaichatmodelNode,
  openaifunctionsagentNode,
  openaiNode,
  openrouterchatmodelNode,
  openthesaurusNode,
  openweathermapNode,
  ouraNode,
  overwatchNode,
  paddleNode,
  pagerdutyNode,
  paypalNode,
  paypaltriggerNode,
  peekalinkNode,
  perplexityNode,
  pgvectorvectorstoreNode,
  phantombusterNode,
  philipshueNode,
  pineconevectorstoreNode,
  pipedriveNode,
  pipedrivetriggerNode,
  planandexecuteagentNode,
  plivoNode,
  postbinNode,
  postgreschatmemoryNode,
  postgresNode,
  postgrestriggerNode,
  posthogNode,
  postmarkTriggerNode,
  postmarktriggerNode,
  profitwellNode,
  pushbulletNode,
  pushcutNode,
  pushcuttriggerNode,
  pushoverNode,
  qdrantvectorstoreNode,
  questdbNode,
  questionandanswerchainNode,
  quickbaseNode,
  quickbooksNode,
  quickbooksonlineNode,
  quickchartNode,
  rabbitmqNode,
  rabbitmqtriggerNode,
  raindropNode,
  reactagentNode,
  readwritefilesfromdiskNode,
  recursivecharactertextsplitterNode,
  redditNode,
  redischatmemoryNode,
  redisNode,
  redistriggerNode,
  removeduplicatesNode,
  renamekeysNode,
  rerankercohereNode,
  respondtowebhookNode,
  rocketchatNode,
  rssfeedtriggerNode,
  rssreadNode,
  rundeckNode,
  s3Node,
  salesforceNode,
  salesforcetriggerNode,
  salesmateNode,
  scheduleTriggerNode,
  searxngtoolNode,
  seatableNode,
  seatabletriggerNode,
  securityscorecardNode,
  segmentNode,
  sendemailNode,
  sendgridNode,
  sendyNode,
  sentimentanalysisNode,
  sentryioNode,
  serpapigooglesearchNode,
  servicenowNode,
  setNode,
  sevenNode,
  shopifyNode,
  shopifytriggerNode,
  signl4Node,
  simplememoryNode,
  simplevectorstoreNode,
  slackNode,
  slacktriggerNode,
  snowflakeNode,
  sortNode,
  splitoutNode,
  splunkNode,
  spontitNode,
  spotifyNode,
  sqlagentNode,
  ssetriggerNode,
  sshNode,
  stackbyNode,
  stopanderrorNode,
  storyblokNode,
  strapiNode,
  stravaNode,
  stravatriggerNode,
  stripeNode,
  stripetriggerNode,
  structuredoutputparserNode,
  summarizationchainNode,
  summarizeNode,
  supabaseNode,
  supabasevectorstoreNode,
  surveymonkeytriggerNode,
  switchNode,
  syncromspNode,
  taigaNode,
  taigatriggerNode,
  tapfiliateNode,
  telegramNode,
  telegramtriggerNode,
  textclassifierNode,
  thehive5Node,
  thehive5triggerNode,
  thehiveNode,
  thehivetriggerNode,
  thinktoolNode,
  timescaledbNode,
  todoistNode,
  toggltriggerNode,
  tokensplitterNode,
  toolsagentNode,
  totpNode,
  travisciNode,
  trelloNode,
  trellotriggerNode,
  twakeNode,
  twilioNode,
  twiliotriggerNode,
  twistNode,
  twitterNode,
  typeformtriggerNode,
  unleashedsoftwareNode,
  upleadNode,
  uprocNode,
  uptimerobotNode,
  urlscanioNode,
  vectorstorequestionanswertoolNode,
  vectorstoreretrieverNode,
  venafitlsprotectcloudNode,
  venafitlsprotectcloudtriggerNode,
  venafitlsprotectdatacenterNode,
  veroNode,
  vonageNode,
  waitNode,
  webexbyciscoNode,
  webexbyciscotriggerNode,
  webflowNode,
  webflowtriggerNode,
  webhookNode,
  wekanNode,
  whatsappbusinesscloudNode,
  whatsappNode,
  whatsapptriggerNode,
  wikipediaNode,
  wiseNode,
  wisetriggerNode,
  wolframalphaNode,
  woocommerceNode,
  woocommercetriggerNode,
  wordpressNode,
  workabletriggerNode,
  workflowretrieverNode,
  workflowtriggerNode,
  wufootriggerNode,
  xformerlytwitterNode,
  xaigrokchatmodelNode,
  xataNode,
  xeroNode,
  xmlNode,
  yourlsNode,
  youtubeNode,
  zammadNode,
  zendeskNode,
  zendesktriggerNode,
  zepNode,
  zepvectorstoreNode,
  zohocrmNode,
  zoomNode,
  zulipNode,
];

/**
 * Get all production nodes
 */
export function getAllProductionNodes(): NodeTypeInfo[] {
  return ALL_PRODUCTION_NODES;
}

/**
 * Export count for verification
 */
export const PRODUCTION_NODE_COUNT = 528;

export default ALL_PRODUCTION_NODES;
