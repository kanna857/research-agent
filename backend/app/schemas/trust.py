from typing import Dict, Any, List
from enum import Enum
from pydantic import BaseModel, Field

class ConfidenceLevel(str, Enum):
    HIGH_CONFIDENCE = "HIGH_CONFIDENCE"
    MODERATE_CONFIDENCE = "MODERATE_CONFIDENCE"
    UNCERTAIN = "UNCERTAIN"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

class TrustScoreBreakdown(BaseModel):
    evidence_quality: float = Field(..., description="Weight 0.25: Quality of extracted empirical evidence")
    source_reliability: float = Field(..., description="Weight 0.20: Source venue impact & citation count")
    independent_agreement: float = Field(..., description="Weight 0.20: Cross-paper replication and agreement")
    methodology_quality: float = Field(..., description="Weight 0.15: Rigor of dataset, metrics, sample size")
    reproducibility: float = Field(..., description="Weight 0.10: Availability of code, data, model details")
    citation_support: float = Field(..., description="Weight 0.10: Direct verification of citation context")

class TrustAnalysis(BaseModel):
    overall_trust_score: float = Field(..., description="Transparent Trust Score 0-100")
    confidence_level: ConfidenceLevel = Field(..., description="Calculated confidence state")
    breakdown: TrustScoreBreakdown
    explanation: str = Field(..., description="Human-readable explanation of score calculation")
    knowns: List[str] = Field(default_factory=list, description="Empirically verified findings")
    unknowns: List[str] = Field(default_factory=list, description="Unresolved empirical questions")
    missing_evidence: List[str] = Field(default_factory=list, description="Specific missing evidence required")
