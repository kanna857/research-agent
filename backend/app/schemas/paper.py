from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class PaperRankBreakdown(BaseModel):
    relevance_score: float = Field(default=0.0, description="Query relevance (0-100)")
    citation_score: float = Field(default=0.0, description="Citation metrics (0-100)")
    methodology_score: float = Field(default=0.0, description="Methodological quality (0-100)")
    reproducibility_score: float = Field(default=0.0, description="Reproducibility (0-100)")
    provenance_score: float = Field(default=0.0, description="Citation provenance (0-100)")
    recency_score: float = Field(default=0.0, description="Publication recency (0-100)")
    evidence_quality_score: float = Field(default=0.0, description="Evidence quality (0-100)")
    overall_rank_score: float = Field(default=0.0, description="Overall weighted rank score (0-100)")
    ranking_explanation: str = Field(default="", description="Detailed rationale explaining WHY this paper received its rank")

    model_config = ConfigDict(from_attributes=True)

class PaperAuditResult(BaseModel):
    paper_id: str
    traceability_chain: List[str] = Field(default_factory=list, description="Paper -> Claim -> Evidence -> Method -> Dataset -> Result")
    mismatches_found: List[str] = Field(default_factory=list, description="Identified discrepancies or unbacked claims")
    audit_passed: bool = Field(default=True)

    model_config = ConfigDict(from_attributes=True)

class ReplicationAnalysisResult(BaseModel):
    paper_id: str
    main_experiment: str
    required_datasets: List[str] = Field(default_factory=list)
    methods: List[str] = Field(default_factory=list)
    metrics: List[str] = Field(default_factory=list)
    implementation_requirements: List[str] = Field(default_factory=list)
    reproducibility_score: float = Field(default=0.0, description="Reproducibility index (0-100)")
    sufficient_info_available: bool = Field(default=True)
    missing_information: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class PaperBase(BaseModel):
    paper_id: str = Field(..., description="Normalized unique paper identifier")
    title: str = Field(..., description="Paper title")
    authors: List[str] = Field(default_factory=list, description="List of author names")
    year: Optional[int] = Field(None, description="Publication year")
    abstract: Optional[str] = Field(None, description="Paper abstract")
    doi: Optional[str] = Field(None, description="Digital Object Identifier")
    url: Optional[str] = Field(None, description="Link to full paper or landing page")
    source: str = Field(..., description="Source repository: OpenAlex, Semantic Scholar, or arXiv")
    citation_count: int = Field(default=0, description="Total citation count")
    reproducibility_score: Optional[float] = Field(None, description="Reproducibility score (0-100)")
    bias_score: Optional[float] = Field(None, description="Bias risk score (0-100)")
    rank_breakdown: Optional[PaperRankBreakdown] = None
    audit_result: Optional[PaperAuditResult] = None
    replication_analysis: Optional[ReplicationAnalysisResult] = None

class PaperCreate(PaperBase):
    pass

class PaperResponse(PaperBase):
    id: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
