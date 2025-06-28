# n8n Action Nodes

Action nodes perform operations and interact with external services. They execute tasks, make API calls, send messages, and manipulate data based on workflow logic.

## Node Categories

### Communication & Messaging
- **Send Email**: Send emails with attachments and formatting
- **Slack**: Send messages, create channels, manage workspace
- **Discord**: Send messages, manage servers and channels
- **Telegram**: Send messages, manage bots and channels
- **Microsoft Teams**: Send messages, manage teams and channels
- **WhatsApp**: Send messages through WhatsApp Business API
- **Twilio**: Send SMS, make calls, manage phone services

### Cloud Storage & Files
- **Google Drive**: Upload, download, manage files and folders
- **Dropbox**: File operations and synchronization
- **AWS S3**: Object storage operations
- **Azure Blob Storage**: Cloud storage management
- **Box**: Enterprise file sharing and collaboration
- **OneDrive**: Microsoft cloud storage operations

### Databases
- **PostgreSQL**: Execute queries, manage database operations
- **MySQL**: Database operations and queries
- **MongoDB**: Document database operations
- **Redis**: Key-value store operations
- **SQLite**: Local database operations
- **Supabase**: Backend-as-a-service operations

### Web APIs & Services
- **HTTP Request**: Make REST API calls and web requests
- **GraphQL**: Execute GraphQL queries and mutations
- **Webhook**: Send HTTP requests to external endpoints
- **FTP**: File transfer protocol operations
- **SSH**: Secure shell operations and file transfers

### Productivity & Office
- **Google Sheets**: Read, write, manage spreadsheets
- **Microsoft Excel**: Excel file operations
- **Google Docs**: Document creation and management
- **Notion**: Workspace and database operations
- **Airtable**: Database and workspace management

### E-commerce & Payments
- **Stripe**: Payment processing and management
- **PayPal**: Payment operations
- **Shopify**: E-commerce store management
- **WooCommerce**: WordPress e-commerce operations
- **Square**: Point of sale and payment processing

### CRM & Marketing
- **Salesforce**: Customer relationship management
- **HubSpot**: Marketing automation and CRM
- **Mailchimp**: Email marketing campaigns
- **Pipedrive**: Sales pipeline management
- **Zendesk**: Customer support and ticketing

### Development & DevOps
- **GitHub**: Repository management and operations
- **GitLab**: DevOps platform operations
- **Docker**: Container management
- **Kubernetes**: Container orchestration
- **Jenkins**: CI/CD pipeline operations

### AI & Machine Learning
- **OpenAI**: GPT and AI model operations
- **Anthropic**: Claude AI operations
- **Google AI**: Various Google AI services
- **Azure AI**: Microsoft AI services
- **Hugging Face**: Machine learning model operations

## Documentation Status

🚧 **In Progress** - Building comprehensive action node documentation

### Priority Actions for Documentation:
1. **HTTP Request** - Most fundamental action node
2. **Send Email** - Essential communication
3. **Google Sheets** - Popular productivity integration
4. **Slack** - Team communication
5. **GitHub** - Developer workflows

## Operation Types

### CRUD Operations
- **Create**: Add new records, files, or resources
- **Read**: Fetch data, download files, query information
- **Update**: Modify existing records or resources
- **Delete**: Remove records, files, or resources

### Authentication Methods
- **OAuth2**: Google, Microsoft, GitHub, Slack, etc.
- **API Keys**: Most REST APIs and services
- **Basic Auth**: Username/password authentication
- **Bearer Tokens**: JWT and similar token-based auth
- **Custom Headers**: Service-specific authentication

## Common Patterns

### API Integration Pattern
```
Trigger → HTTP Request → Transform → Store/Notify
```

### Data Synchronization
```
Trigger → Fetch Data → Transform → Update Database
```

### Notification Workflow
```
Trigger → Process → Send Email/Slack → Log
```

### File Processing Pipeline
```
File Trigger → Process File → Upload to Cloud → Notify
```

## Best Practices

1. **Error Handling**: Always include error handling for API failures
2. **Rate Limiting**: Respect API rate limits and implement backoff
3. **Authentication**: Securely store and manage API credentials
4. **Data Validation**: Validate data before sending to external services
5. **Logging**: Log important operations for debugging and monitoring
6. **Retries**: Implement retry logic for transient failures

## Quick Reference

### Most Used Action Nodes
1. **HTTP Request** - Generic API calls
2. **Send Email** - Email notifications
3. **Google Sheets** - Spreadsheet operations
4. **Slack** - Team messaging
5. **GitHub** - Code repository operations

### Integration Checklist
- [ ] Set up authentication credentials
- [ ] Configure required parameters
- [ ] Test with sample data
- [ ] Implement error handling
- [ ] Set up monitoring and logging
- [ ] Document the integration

## Rate Limits & Quotas

Different services have varying rate limits:
- **Google APIs**: Usually 100-1000 requests per 100 seconds
- **Slack**: Varies by method, typically 1+ requests per second
- **GitHub**: 5000 requests per hour for authenticated requests
- **OpenAI**: Varies by model and subscription tier

---

*This index provides an overview of all action nodes. Individual node documentation contains detailed configuration, authentication setup, and operation examples.*
