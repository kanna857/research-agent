from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.paper import PaperResponse
from app.schemas.claim import ClaimResponse
from app.schemas.trust import TrustAnalysis, ConfidenceLevel

class WorkflowStage(str, Enum):
    IDLE = "IDLE"
    PLANNING = "PLANNING"
    RETRIEVAL = "RETRIEVAL"
    RANKING = "RANKING"
    EVIDENCE_EXTRACTION = "EVIDENCE_EXTRACTION"
    CLAIM_VERIFICATION = "CLAIM_VERIFICATION"
    CONTRADICTION_DETECTION = "CONTRADICTION_DETECTION"
    TRUST_ANALYSIS = "TRUST_ANALYSIS"
    RED_TEAM = "RED_TEAM"
    RESEARCH_GAPS = "RESEARCH_GAPS"
    JUDGE = "JUDGE"
    SYNTHESIS = "SYNTHESIS"
    FIREWALL = "FIREWALL"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class ResearchMode(str, Enum):
    QUICK_RESEARCH = "QUICK_RESEARCH"
    DEEP_RESEARCH = "DEEP_RESEARCH"
    LITERATURE_REVIEW = "LITERATURE_REVIEW"
    PAPER_RANKING = "PAPER_RANKING"
    PAPER_AUDIT = "PAPER_AUDIT"
    REPLICATION_ANALYSIS = "REPLICATION_ANALYSIS"
    RESEARCH_COMPARISON = "RESEARCH_COMPARISON"
    RESEARCH_GAP_FINDER = "RESEARCH_GAP_FINDER"

class ResearchRequest(BaseModel):
    query: str = Field(..., description="Research question to investigate", min_length=5)
    max_papers: int = Field(default=10, ge=1, le=50, description="Max academic papers to retrieve")
    mode: ResearchMode = Field(default=ResearchMode.DEEP_RESEARCH, description="Selected research mode")

class ResearchPlan(BaseModel):
    objective: str
    subquestions: List[str] = Field(default_factory=list)
    search_queries: List[str] = Field(default_factory=list)
    required_evidence: List[str] = Field(default_factory=list)
    ambiguities: List[str] = Field(default_factory=list)

class Contradiction(BaseModel):
    contradiction_id: str
    claim_a_id: str
    claim_b_id: str
    paper_a_id: str
    paper_b_id: str
    type: str = Field(..., description="direct_contradiction, partial_contradiction, different_datasets, different_metrics, different_populations, different_conditions")
    description: str

class RedTeamFinding(BaseModel):
    category: str = Field(..., description="weak_methodology, unsupported_assumptions, overgeneralization, dataset_limitations, citation_problems, reproducibility_concerns")
    challenge: str
    severity: str = Field(default="MEDIUM", description="HIGH, MEDIUM, LOW")
    target_claim_id: Optional[str] = None

class ResearchGap(BaseModel):
    gap_id: str
    title: str
    description: str
    understudied_area: str
    connected_paper_ids: List[str] = Field(default_factory=list)

class FinalJudgement(BaseModel):
    status: ConfidenceLevel
    main_conclusion: str
    reasoning: str
    firewall_passed: bool = Field(default=True)
    firewall_revisions: List[str] = Field(default_factory=list)

class ResearchStatusResponse(BaseModel):
    session_id: str
    query: str
    current_stage: WorkflowStage
    progress_percentage: int = Field(default=0, ge=0, le=100)
    papers_found_count: int = 0
    relevant_papers_count: int = 0
    claims_extracted_count: int = 0
    supported_claims_count: int = 0
    contradicted_claims_count: int = 0
    insufficient_claims_count: int = 0
    plan: Optional[ResearchPlan] = None
    papers: List[PaperResponse] = Field(default_factory=list)
    claims: List[ClaimResponse] = Field(default_factory=list)
    contradictions: List[Contradiction] = Field(default_factory=list)
    trust_analysis: Optional[TrustAnalysis] = None
    red_team_findings: List[RedTeamFinding] = Field(default_factory=list)
    research_gaps: List[ResearchGap] = Field(default_factory=list)
    final_judgement: Optional[FinalJudgement] = None
    report_markdown: Optional[str] = None
    error: Optional[str] = None
