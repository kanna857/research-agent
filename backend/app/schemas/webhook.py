from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.schemas.research import WorkflowStage

class N8nWebhookPayload(BaseModel):
    session_id: str = Field(..., description="Unique research session ID")
    stage: WorkflowStage = Field(..., description="Current agent workflow stage")
    data: Dict[str, Any] = Field(default_factory=dict, description="Stage payload payload data")
    error: Optional[str] = Field(None, description="Optional error message if stage failed")
