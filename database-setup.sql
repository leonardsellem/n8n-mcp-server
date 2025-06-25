
-- AI Outlook Email Assistant Database Schema

-- Main emails table
CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    subject TEXT,
    sender TEXT,
    recipient TEXT,
    body TEXT,
    html_body TEXT,
    received_at TIMESTAMP,
    processed_at TIMESTAMP,
    email_type TEXT,
    priority TEXT,
    sentiment TEXT,
    urgency TEXT,
    confidence DECIMAL(3,2),
    entities JSONB,
    key_topics JSONB,
    suggested_actions JSONB,
    response_urgency TEXT,
    emotional_tone TEXT,
    business_value TEXT,
    risk_level TEXT,
    has_attachments BOOLEAN DEFAULT FALSE,
    attachments_data JSONB,
    conversation_id TEXT,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    ai_analysis JSONB,
    headers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history table
CREATE TABLE IF NOT EXISTS conversation_history (
    id SERIAL PRIMARY KEY,
    conversation_id TEXT,
    email_id TEXT,
    participant TEXT,
    message_type TEXT, -- 'received', 'sent', 'draft_response'
    subject TEXT,
    body TEXT,
    timestamp TIMESTAMP,
    ai_confidence DECIMAL(3,2),
    response_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email analytics table
CREATE TABLE IF NOT EXISTS email_analytics (
    id SERIAL PRIMARY KEY,
    date DATE,
    hour INTEGER,
    email_type TEXT,
    priority TEXT,
    sentiment TEXT,
    urgency TEXT,
    business_value TEXT,
    risk_level TEXT,
    response_time_seconds INTEGER,
    ai_confidence DECIMAL(3,2),
    has_attachments BOOLEAN,
    sender_domain TEXT,
    processing_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Draft responses table
CREATE TABLE IF NOT EXISTS draft_responses (
    id SERIAL PRIMARY KEY,
    email_id TEXT REFERENCES emails(id),
    subject TEXT,
    body TEXT,
    tone TEXT,
    next_steps JSONB,
    priority TEXT,
    review_required BOOLEAN DEFAULT TRUE,
    confidence DECIMAL(3,2),
    estimated_sentiment TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by TEXT,
    sent_at TIMESTAMP,
    status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'rejected', 'sent'
);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id SERIAL PRIMARY KEY,
    error_id TEXT,
    email_id TEXT,
    error_type TEXT,
    error_message TEXT,
    error_stack TEXT,
    retry_count INTEGER DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_emails_type ON emails(email_type);
CREATE INDEX IF NOT EXISTS idx_emails_priority ON emails(priority);
CREATE INDEX IF NOT EXISTS idx_emails_sentiment ON emails(sentiment);
CREATE INDEX IF NOT EXISTS idx_emails_conversation_id ON emails(conversation_id);
CREATE INDEX IF NOT EXISTS idx_emails_sender ON emails(sender);
CREATE INDEX IF NOT EXISTS idx_conversation_history_conversation_id ON conversation_history(conversation_id);
CREATE INDEX IF NOT EXISTS idx_email_analytics_date ON email_analytics(date);
CREATE INDEX IF NOT EXISTS idx_draft_responses_status ON draft_responses(status);

-- Create vector similarity search function (requires pgvector extension)
-- Enable pgvector extension first: CREATE EXTENSION IF NOT EXISTS vector;

-- Function to find similar emails
CREATE OR REPLACE FUNCTION find_similar_emails(
    query_embedding VECTOR(1536),
    similarity_threshold FLOAT DEFAULT 0.8,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE(
    email_id TEXT,
    subject TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.subject,
        (1 - (e.embedding <=> query_embedding)) as similarity
    FROM emails e
    WHERE (1 - (e.embedding <=> query_embedding)) > similarity_threshold
    ORDER BY e.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Analytics views
CREATE OR REPLACE VIEW email_summary_stats AS
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
GROUP BY DATE(received_at)
ORDER BY DATE(received_at) DESC;

-- Response time analytics
CREATE OR REPLACE VIEW response_time_analytics AS
SELECT 
    email_type,
    AVG(response_time_seconds) as avg_response_time,
    MIN(response_time_seconds) as min_response_time,
    MAX(response_time_seconds) as max_response_time,
    COUNT(*) as total_emails
FROM email_analytics
GROUP BY email_type
ORDER BY avg_response_time DESC;
