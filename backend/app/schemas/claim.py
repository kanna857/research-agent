from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict

class VerificationStatus(str, Enum):
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    CONTRADICTED = "CONTRADICTED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

class ClaimBase(BaseModel):
    claim_id: str = Field(..., description="Unique claim identifier")
    statement: str = Field(..., description="Text of extracted scientific claim")
    paper_id: str = Field(..., description="ID of paper containing this claim")
    paper_title: Optional[str] = Field(None, description="Title of source paper")
    evidence_text: str = Field(..., description="Exact textual evidence extracted from paper")
    methodology: Optional[str] = Field(None, description="Research methodology used")
    dataset: Optional[str] = Field(None, description="Dataset utilized")
    sample_size: Optional[str] = Field(None, description="Sample size or scale")
    metrics: Optional[str] = Field(None, description="Evaluation metrics reported")
    results: Optional[str] = Field(None, description="Numerical or qualitative result")
    limitations: Optional[str] = Field(None, description="Reported paper limitations")
    verification_status: VerificationStatus = Field(default=VerificationStatus.INSUFFICIENT_EVIDENCE)
    confidence_score: float = Field(default=0.0, description="Confidence score from 0 to 100")
    explanation: str = Field(default="", description="Detailed rationale for classification")
    contradicting_claim_ids: List[str] = Field(default_factory=list)

class ClaimCreate(ClaimBase):
    pass

class ClaimResponse(ClaimBase):
    id: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
