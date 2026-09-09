-- PostgreSQL Initialization Script for KnowSure Platform

CREATE TABLE IF NOT EXISTS research_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    query TEXT NOT NULL,
    current_stage VARCHAR(32) DEFAULT 'IDLE',
    progress_percentage INTEGER DEFAULT 0,
    plan_json JSONB,
    papers_json JSONB,
    claims_json JSONB,
    contradictions_json JSONB,
    trust_json JSONB,
    red_team_json JSONB,
    research_gaps_json JSONB,
    judgement_json JSONB,
    report_markdown TEXT,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_stage ON research_sessions(current_stage);
