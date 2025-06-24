# AI Outlook Email Assistant - Quick Setup Guide

## 🚀 Fast Track Deployment

### Prerequisites
- n8n instance (cloud or self-hosted)
- PostgreSQL database with pgvector extension
- OpenAI API account
- Microsoft Outlook with IMAP enabled
- Microsoft Teams workspace (optional)

### 1. Import Workflow (2 minutes)
```bash
# In n8n interface:
1. Go to Workflows → Import from File
2. Select 'ai-outlook-workflow.json'
3. Click Import
```

### 2. Database Setup (3 minutes)
```bash
# Connect to PostgreSQL
psql -h your-host -U your-user -d your-database

# Install pgvector extension (if not installed)
CREATE EXTENSION IF NOT EXISTS vector;

# Run setup script
\i database-setup.sql
```

### 3. Configure Credentials (5 minutes)

#### Outlook IMAP
```
Name: outlook_imap_credentials
Host: outlook.office365.com
Port: 993
User: your-email@outlook.com
Password: your-app-password
SSL: true
```

#### OpenAI API
```
Name: openai_credentials
API Key: sk-your-openai-api-key
Organization: your-org-id (optional)
```

#### PostgreSQL
```
Name: postgres_credentials
Host: your-postgres-host
Port: 5432
Database: your-database
User: your-user
Password: your-password
SSL: true
```

#### Microsoft Teams (Optional)
```
Name: teams_credentials
Client ID: your-azure-app-id
Client Secret: your-azure-app-secret
Tenant ID: your-azure-tenant-id
```

### 4. Test & Activate (2 minutes)
1. Click "Test workflow" button
2. Send a test email to your Outlook inbox
3. Verify execution in n8n
4. Check database for stored data
5. Activate workflow

## 🔧 Essential Configuration

### Environment Variables
```bash
# Add to your .env file
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
TEAMS_WEBHOOK_URL=https://your-teams-webhook
```

### Node-Specific Settings

#### Email Trigger (Node 1)
- **Mailbox**: INBOX (or specific folder)
- **Poll Interval**: 30 seconds for real-time processing
- **Mark as Read**: true (to avoid reprocessing)

#### OpenAI Classifier (Node 4)
- **Model**: gpt-4 (for best accuracy)
- **Temperature**: 0.1 (for consistent results)
- **Max Tokens**: 1000 (sufficient for classification)

#### Batch Manager (Node 16)
- **Batch Size**: 10 (increase to 25-50 for high volume)
- **Timeout**: 300 seconds per batch

### Performance Tuning for High Volume

#### For 900,000+ emails:
```javascript
// Increase batch size in Batch Processing Manager
const batchSize = 50; // Up from 10

// Increase execution timeout in workflow settings
"executionTimeout": 7200 // 2 hours

// Enable workflow concurrency
"settings": {
  "executionOrder": "v1",
  "saveExecutionProgress": false, // Disable for performance
  "saveManualExecutions": false
}
```

## 📊 Monitoring Setup

### Key Metrics to Track
```sql
-- Daily email volume
SELECT DATE(received_at), COUNT(*) FROM emails 
GROUP BY DATE(received_at) ORDER BY DATE(received_at) DESC;

-- Processing success rate
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN processed = true THEN 1 END) as processed,
  ROUND(COUNT(CASE WHEN processed = true THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM emails WHERE DATE(received_at) = CURRENT_DATE;

-- Average AI confidence
SELECT AVG(confidence) as avg_confidence FROM emails 
WHERE DATE(received_at) = CURRENT_DATE;
```

### Alerts Setup
Monitor these critical thresholds:
- Processing success rate < 95%
- Average AI confidence < 0.8
- Error rate > 5%
- Response time > 60 seconds per email

## 🛠️ Common Issues & Quick Fixes

### Issue 1: IMAP Connection Timeout
```javascript
// In Email Trigger node, increase timeout:
"options": {
  "connTimeout": 120000,  // 2 minutes
  "authTimeout": 10000    // 10 seconds
}
```

### Issue 2: OpenAI Rate Limits
```javascript
// Add delay between API calls:
"options": {
  "requestTimeout": 60000,
  "retryOnFailure": 3,
  "retryDelay": 1000
}
```

### Issue 3: Database Connection Pool Exhausted
```sql
-- Increase PostgreSQL connection limits:
ALTER SYSTEM SET max_connections = '200';
ALTER SYSTEM SET shared_buffers = '256MB';
SELECT pg_reload_conf();
```

### Issue 4: High Memory Usage
```javascript
// In function nodes, clear large objects:
// At end of function code:
delete processedData.largeAttachments;
return processedItems;
```

## 🔐 Security Checklist

### Essential Security Steps
- [ ] Use strong passwords for all credentials
- [ ] Enable SSL for all database connections
- [ ] Rotate API keys monthly
- [ ] Restrict database access to specific IPs
- [ ] Enable n8n webhook authentication
- [ ] Set up proper firewall rules
- [ ] Regular backup encryption verification

### Data Protection
```sql
-- Encrypt sensitive email data
ALTER TABLE emails ADD COLUMN encrypted_body BYTEA;

-- Set up automatic data retention
DELETE FROM emails WHERE received_at < NOW() - INTERVAL '2 years';
```

## 📈 Scaling for Production

### Horizontal Scaling
1. **Multiple n8n Instances**
   - Load balance across multiple n8n nodes
   - Use shared PostgreSQL database
   - Implement Redis for state management

2. **Database Optimization**
   ```sql
   -- Add indexes for performance
   CREATE INDEX CONCURRENTLY idx_emails_performance 
   ON emails(received_at, processed, priority);
   
   -- Partition large tables
   CREATE TABLE emails_2024 PARTITION OF emails 
   FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
   ```

3. **Queue Management**
   - Implement Redis queue for email processing
   - Use Bull or Agenda.js for job management
   - Set up dead letter queues for failed processing

### Monitoring & Alerting
```javascript
// Add to workflow for real-time monitoring
const metrics = {
  emailsProcessed: $input.all().length,
  averageProcessingTime: calculateAverageTime(),
  errorRate: calculateErrorRate(),
  timestamp: new Date().toISOString()
};

// Send to monitoring system
await sendToMetrics(metrics);
```

## 🆘 Support & Troubleshooting

### Log Analysis
```bash
# Check n8n logs
docker logs n8n-container | grep "AI Outlook"

# Monitor PostgreSQL performance
SELECT * FROM pg_stat_activity WHERE query LIKE '%emails%';

# Check OpenAI API usage
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/usage
```

### Performance Debugging
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;

-- Monitor table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public';
```

### Emergency Procedures
1. **High Error Rate**: Pause workflow, check logs, fix issues
2. **Database Full**: Archive old data, increase storage
3. **API Limits Hit**: Implement exponential backoff, reduce batch size
4. **Memory Issues**: Restart n8n instance, optimize function nodes

---

## 🎯 Success Metrics

After setup, you should achieve:
- **Processing Speed**: 100+ emails per minute
- **Accuracy**: 95%+ classification accuracy
- **Uptime**: 99.9% workflow availability
- **Response Time**: <30 seconds per email
- **Error Rate**: <2% processing failures

## 📞 Getting Help

If you encounter issues:
1. Check the comprehensive documentation: `AI-Outlook-Workflow-Documentation.md`
2. Review n8n logs for specific error messages
3. Test individual nodes to isolate problems
4. Use the database queries above for performance analysis
5. Monitor OpenAI API usage and limits

**Ready to process 900,000+ emails with AI intelligence!** 🚀