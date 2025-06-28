# n8n Trigger Nodes

Trigger nodes start workflows automatically when specific events occur. They monitor external systems, schedules, or conditions to initiate workflow execution.

## Node Categories

### Core Triggers (Built-in)
- **Schedule Trigger**: Time-based workflow execution using cron expressions
- **Webhook**: HTTP endpoints for receiving external requests
- **Manual Trigger**: Manual workflow initiation for testing
- **Email Trigger (IMAP)**: Monitor email inboxes for new messages
- **RSS Feed Trigger**: Monitor RSS/Atom feeds for new content
- **Local File Trigger**: Monitor file system changes
- **SSE Trigger**: Server-Sent Events monitoring
- **n8n Trigger**: Inter-workflow dependencies
- **Error Trigger**: Handle workflow errors

### Application-Specific Triggers
- **Gmail Trigger**: Google Gmail monitoring
- **Slack Trigger**: Slack workspace monitoring  
- **Discord Trigger**: Discord server monitoring
- **Telegram Trigger**: Telegram bot triggers
- **Microsoft Outlook Trigger**: Outlook email monitoring
- **Google Sheets Trigger**: Spreadsheet change monitoring
- **Google Drive Trigger**: Drive file monitoring
- **Dropbox Trigger**: File change monitoring
- **GitHub Trigger**: Repository event monitoring

### Database Triggers
- **PostgreSQL Trigger**: Database change monitoring
- **MySQL Trigger**: Database event monitoring
- **MongoDB Trigger**: Document change streams
- **Redis Trigger**: Key/value change monitoring

### Communication Triggers
- **WhatsApp Trigger**: Message monitoring
- **Microsoft Teams Trigger**: Teams events
- **Zoom Trigger**: Meeting and webinar events
- **Twilio Trigger**: SMS and call events

### Cloud Storage Triggers
- **AWS S3 Trigger**: Bucket change monitoring
- **Google Cloud Storage Trigger**: Object change events
- **Azure Blob Trigger**: Storage account monitoring
- **Box Trigger**: File collaboration events

### E-commerce & CRM Triggers
- **Salesforce Trigger**: CRM event monitoring
- **HubSpot Trigger**: Marketing automation triggers
- **Stripe Trigger**: Payment event monitoring
- **Shopify Trigger**: E-commerce event monitoring

## Documentation Status

🚧 **In Progress** - Expanding from basic registry to detailed documentation

### Priority Triggers for Documentation:
1. **Schedule Trigger** - Most commonly used
2. **Webhook** - Essential for integrations
3. **Email Trigger (IMAP)** - Email automation
4. **RSS Feed Trigger** - Content monitoring
5. **Local File Trigger** - File processing

## Trigger Types

### Polling vs Webhook
- **Polling**: Node checks for changes at regular intervals
- **Webhook**: External system notifies n8n immediately
- **Hybrid**: Some nodes support both methods

### Authentication Methods
- **OAuth2**: Google, Microsoft, Slack, etc.
- **API Keys**: Many REST APIs
- **Basic Auth**: Simple username/password
- **Tokens**: JWT, Bearer tokens
- **None**: Public endpoints, local files

## Common Patterns

### Real-time Processing
```
Webhook → Process Data → Action Node
```

### Scheduled Batch Processing
```
Schedule Trigger → Fetch Data → Process → Store
```

### Event-Driven Workflows
```
App Trigger → Filter → Transform → Multiple Actions
```

### Error Handling
```
Any Trigger → Main Process → Error Trigger → Notification
```

## Best Practices

1. **Rate Limiting**: Respect API limits when using polling triggers
2. **Error Handling**: Always include error handling for trigger failures
3. **Filtering**: Use trigger filters to reduce unnecessary executions
4. **Monitoring**: Monitor trigger health and execution frequency
5. **Testing**: Use Manual Trigger for development and testing

## Quick Reference

### Most Used Triggers
1. **Schedule Trigger** - Time-based execution
2. **Webhook** - HTTP endpoint
3. **Gmail Trigger** - Email monitoring
4. **Slack Trigger** - Chat monitoring
5. **GitHub Trigger** - Code repository events

### Setup Checklist
- [ ] Configure authentication credentials
- [ ] Set appropriate polling intervals
- [ ] Configure filters to reduce noise
- [ ] Test trigger with manual execution
- [ ] Set up error handling
- [ ] Monitor execution logs

---

*This index provides an overview of all trigger nodes. Individual node documentation contains detailed configuration, authentication setup, and use cases.*
