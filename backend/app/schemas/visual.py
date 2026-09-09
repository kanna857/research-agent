from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class VisualConcept(BaseModel):
    concept_id: str
    name: str
    concept_type: str  # ENTITY, VARIABLE, METRIC, DATASET, METHOD
    description: str
    evidence_snippet: str
    paper_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class VisualOpportunity(BaseModel):
    opportunity_id: str
    visual_type: str  # METHODOLOGY_FLOW, RESEARCH_TIMELINE, EVIDENCE_NETWORK, CONCEPT_MATRIX
    confidence: float
    justification: str

    model_config = ConfigDict(from_attributes=True)

class TimelineMilestone(BaseModel):
    milestone_id: str
    year_or_date: str
    title: str
    description: str
    paper_id: Optional[str] = None
    doi: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DiagramNode(BaseModel):
    node_id: str
    label: str
    node_type: str  # INPUT, PROCESS, MODEL, OUTPUT, CLAIM, EVIDENCE
    description: str
    paper_id: Optional[str] = None
    evidence_text: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DiagramEdge(BaseModel):
    edge_id: str
    source_id: str
    target_id: str
    label: str
    relationship_type: str  # FEEDS_INTO, PRODUCES, SUPPORTS, CONTRADICTS

    model_config = ConfigDict(from_attributes=True)

class AnimationKeyframe(BaseModel):
    frame_index: int
    step_title: str
    description: str
    active_node_ids: List[str]
    camera_focus: str
    duration_ms: int = 2000

    model_config = ConfigDict(from_attributes=True)

class AnimationSchema(BaseModel):
    fps: int = 30
    total_duration_ms: int
    keyframes: List[AnimationKeyframe]

    model_config = ConfigDict(from_attributes=True)

class VisualResearchPlan(BaseModel):
    session_id: str
    paper_id: str
    paper_title: str
    concepts: List[VisualConcept]
    opportunities: List[VisualOpportunity]
    timeline: List[TimelineMilestone]
    methodology_nodes: List[DiagramNode]
    methodology_edges: List[DiagramEdge]
    evidence_nodes: List[DiagramNode]
    evidence_edges: List[DiagramEdge]
    animation_schema: AnimationSchema
    validation_passed: bool
    validation_notes: List[str]

    model_config = ConfigDict(from_attributes=True)
