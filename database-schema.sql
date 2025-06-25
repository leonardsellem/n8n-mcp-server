-- AI Outlook Email Assistant - PostgreSQL Database Schema
-- This schema supports the comprehensive email processing workflow

-- Main emails table - stores processed email data with AI analysis
CREATE TABLE IF NOT EXISTS emails (
    id VARCHAR(255) PRIMARY KEY,
    subject TEXT,
    sender VARCHAR(500),
    recipient VARCHAR(500),
    cc TEXT,
    bcc TEXT,
    body TEXT,
    html_body TEXT,
    received_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    email_type VARCHAR(100), -- customer_inquiry, sales_prospect, support_request, etc.
    priority VARCHAR(20), -- high, medium, low
    sentiment VARCHAR(20), -- positive, negative, neutral
    urgency VARCHAR(20), -- urgent, high, medium, low
    confidence DECIMAL(3,2), -- AI confidence score 0.00-1.00
    entities JSONB, -- extracted entities (people, organizations, dates, etc.)
    key_topics JSONB, -- array of key topics identified
    suggested_actions JSONB, -- array of suggested actions
    response_urgency VARCHAR(50), -- within_1_hour, within_4_hours, etc.
    emotional_tone VARCHAR(50), -- frustrated, excited, concerned, etc.
    business_value VARCHAR(20), -- high, medium, low
    risk_level VARCHAR(20), -- high, medium, low, none
    has_attachments BOOLEAN DEFAULT FALSE,
    attachments_data JSONB, -- processed attachment information
    conversation_id VARCHAR(100), -- groups related emails
    embedding VECTOR(1536), -- OpenAI text-embedding-ada-002 vector (1536 dimensions)
    ai_analysis JSONB, -- full AI analysis response
    headers JSONB, -- original email headers
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation history table - tracks email conversations and responses
CREATE TABLE IF NOT EXISTS conversation_history (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    participant VARCHAR(500), -- email address of participant
    message_type VARCHAR(50), -- received, sent, draft_response
    subject TEXT,
    body TEXT,
    timestamp TIMESTAMPTZ,
    ai_confidence DECIMAL(3,2),
    response_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email analytics table - for reporting and insights
CREATE TABLE IF NOT EXISTS email_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour INTEGER, -- 0-23 for hourly analytics
    email_type VARCHAR(100),
    priority VARCHAR(20),
    sentiment VARCHAR(20),
    urgency VARCHAR(20),
    business_value VARCHAR(20),
    risk_level VARCHAR(20),
    response_time_seconds INTEGER, -- time from received to processed
    ai_confidence DECIMAL(3,2),
    has_attachments BOOLEAN,
    sender_domain VARCHAR(255),
    processing_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Draft responses table - stores AI-generated draft responses
CREATE TABLE IF NOT EXISTS draft_responses (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL,
    conversation_id VARCHAR(100),
    subject TEXT,
    body TEXT,
    tone VARCHAR(50), -- professional, friendly, formal, casual
    next_steps JSONB, -- array of recommended next steps
    priority VARCHAR(20),
    review_required BOOLEAN DEFAULT TRUE,
    confidence DECIMAL(3,2),
    estimated_sentiment VARCHAR(20),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255),
    approved BOOLEAN DEFAULT FALSE,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ
);

-- Email attachments table - detailed attachment processing
CREATE TABLE IF NOT EXISTS email_attachments (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL,
    filename VARCHAR(500),
    content_type VARCHAR(200),
    size_bytes INTEGER,
    file_type VARCHAR(20),
    extracted_text TEXT,
    processed BOOLEAN DEFAULT FALSE,
    extracted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error logs table - track processing errors for monitoring
CREATE TABLE IF NOT EXISTS processing_errors (
    id SERIAL PRIMARY KEY,
    error_id VARCHAR(255) UNIQUE,
    email_id VARCHAR(255),
    error_type VARCHAR(100),
    error_message TEXT,
    error_stack TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    resolved BOOLEAN DEFAULT FALSE,
    workflow_execution VARCHAR(255),
    node_execution VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Email templates table - for consistent response generation
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_type VARCHAR(100), -- matches email classification types
    subject_template TEXT,
    body_template TEXT,
    tone VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table - customizable AI behavior per user/department
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(500) UNIQUE,
    department VARCHAR(100),
    auto_response BOOLEAN DEFAULT FALSE,
    response_delay_minutes INTEGER DEFAULT 5,
    escalation_rules JSONB,
    signature TEXT,
    working_hours JSONB, -- {start: "09:00", end: "17:00", timezone: "UTC", days: [1,2,3,4,5]}
    out_of_office BOOLEAN DEFAULT FALSE,
    out_of_office_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_emails_conversation_id ON emails(conversation_id);
CREATE INDEX IF NOT EXISTS idx_emails_sender ON emails(sender);
CREATE INDEX IF NOT EXISTS idx_emails_type_priority ON emails(email_type, priority);
CREATE INDEX IF NOT EXISTS idx_emails_urgency ON emails(urgency);
CREATE INDEX IF NOT EXISTS idx_conversation_history_conv_id ON conversation_history(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_email_id ON conversation_history(email_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date_hour ON email_analytics(date, hour);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON email_analytics(email_type);
CREATE INDEX IF NOT EXISTS idx_draft_responses_email_id ON draft_responses(email_id);
CREATE INDEX IF NOT EXISTS idx_attachments_email_id ON email_attachments(email_id);
CREATE INDEX IF NOT EXISTS idx_errors_email_id ON processing_errors(email_id);
CREATE INDEX IF NOT EXISTS idx_errors_resolved ON processing_errors(resolved);

-- Enable Row Level Security (optional, for multi-tenant scenarios)
-- ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default email templates
INSERT INTO email_templates (name, email_type, subject_template, body_template, tone) VALUES
('Customer Inquiry Response', 'customer_inquiry', 'Re: {{ original_subject }}', 
'Dear {{ sender_name }},

Thank you for your inquiry. We have received your message and appreciate you taking the time to contact us.

{{ custom_response }}

We will review your request and respond within {{ response_time }}. If you have any urgent questions, please don''t hesitate to contact us directly.

Best regards,
{{ agent_name }}
{{ company_signature }}', 'professional'),

('Support Request Acknowledgment', 'support_request', 'Support Ticket #{{ ticket_id }}: {{ original_subject }}',
'Hello {{ sender_name }},

We have received your support request and created ticket #{{ ticket_id }} for tracking purposes.

Issue Summary: {{ issue_summary }}
Priority: {{ priority_level }}
Expected Response Time: {{ response_time }}

Our support team will investigate this matter and provide an update soon. You can track the progress of your ticket in our support portal.

Thank you for your patience.

Best regards,
{{ agent_name }}
Support Team
{{ company_signature }}', 'professional'),

('Sales Prospect Follow-up', 'sales_prospect', 'Thank you for your interest in {{ company_name }}',
'Hi {{ sender_name }},

Thank you for reaching out about {{ product_interest }}. We''re excited about the opportunity to work with {{ sender_company }}.

Based on your inquiry, I believe {{ solution_recommendation }} would be a great fit for your needs.

I''d love to schedule a brief call to discuss:
- Your specific requirements
- How our solution can help achieve your goals
- Next steps in the process

Are you available for a 15-minute call this week? I have availability on {{ available_times }}.

Looking forward to speaking with you!

Best regards,
{{ agent_name }}
Sales Team
{{ company_signature }}', 'friendly');

-- Create a view for email analytics dashboard
CREATE OR REPLACE VIEW email_dashboard AS
SELECT 
    DATE(received_at) as date,
    COUNT(*) as total_emails,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
    COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
    COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority,
    COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_sentiment,
    COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_sentiment,
    COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_sentiment,
    AVG(confidence) as avg_confidence,
    COUNT(CASE WHEN has_attachments THEN 1 END) as emails_with_attachments
FROM emails 
WHERE received_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(received_at)
ORDER BY date DESC;

-- Comments for documentation
COMMENT ON TABLE emails IS 'Main table storing processed email data with AI analysis and classifications';
COMMENT ON TABLE conversation_history IS 'Tracks conversation threads and response history';
COMMENT ON TABLE email_analytics IS 'Aggregated analytics data for reporting and insights';
COMMENT ON TABLE draft_responses IS 'AI-generated draft responses pending review and approval';
COMMENT ON TABLE email_attachments IS 'Detailed information about email attachments and extracted content';
COMMENT ON TABLE processing_errors IS 'Error tracking for monitoring and debugging workflow issues';
COMMENT ON TABLE email_templates IS 'Reusable email templates for consistent response generation';
COMMENT ON TABLE user_preferences IS 'User-specific settings and preferences for AI behavior';

-- Success message
SELECT 'AI Outlook Email Assistant database schema created successfully!' as status;