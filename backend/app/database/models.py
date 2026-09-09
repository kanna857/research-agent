import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, JSON, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database.session import Base

class ResearchSessionModel(Base):
    __tablename__ = "research_sessions"

    session_id = Column(String, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    current_stage = Column(String, default="IDLE")
    progress_percentage = Column(Integer, default=0)
    
    plan_json = Column(JSON, nullable=True)
    papers_json = Column(JSON, nullable=True)
    claims_json = Column(JSON, nullable=True)
    contradictions_json = Column(JSON, nullable=True)
    trust_json = Column(JSON, nullable=True)
    red_team_json = Column(JSON, nullable=True)
    research_gaps_json = Column(JSON, nullable=True)
    judgement_json = Column(JSON, nullable=True)
    report_markdown = Column(Text, nullable=True)
    error = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class PaperModel(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    paper_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(Text, nullable=False)
    authors = Column(JSON, nullable=True)
    year = Column(Integer, nullable=True)
    abstract = Column(Text, nullable=True)
    doi = Column(String, nullable=True, index=True)
    url = Column(String, nullable=True)
    source = Column(String, nullable=False)
    citation_count = Column(Integer, default=0)
    reproducibility_score = Column(Float, nullable=True)
    bias_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    claims = relationship("ClaimModel", back_populates="paper", cascade="all, delete-orphan")


class ClaimModel(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, autoincrement=True)
    claim_id = Column(String, unique=True, index=True, nullable=False)
    session_id = Column(String, ForeignKey("research_sessions.session_id"), nullable=False, index=True)
    paper_id = Column(String, ForeignKey("papers.paper_id"), nullable=False, index=True)
    statement = Column(Text, nullable=False)
    verification_status = Column(String, nullable=False, default="INSUFFICIENT_EVIDENCE")
    confidence_score = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    paper = relationship("PaperModel", back_populates="claims")
    evidence_items = relationship("EvidenceModel", back_populates="claim", cascade="all, delete-orphan")


class EvidenceModel(Base):
    __tablename__ = "evidence_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    evidence_id = Column(String, unique=True, index=True, nullable=False)
    claim_id = Column(String, ForeignKey("claims.claim_id"), nullable=False, index=True)
    paper_id = Column(String, ForeignKey("papers.paper_id"), nullable=False, index=True)
    evidence_text = Column(Text, nullable=False)
    methodology = Column(Text, nullable=True)
    dataset = Column(Text, nullable=True)
    sample_size = Column(String, nullable=True)
    metrics = Column(Text, nullable=True)
    results = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    citation_provenance = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    claim = relationship("ClaimModel", back_populates="evidence_items")
