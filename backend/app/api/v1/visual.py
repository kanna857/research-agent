from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.agents.visual_agent import visual_agent
from app.schemas.visual import VisualResearchPlan

router = APIRouter()

class VisualAnalyzeRequest(BaseModel):
    paper: Dict[str, Any]
    claims: Optional[List[Dict[str, Any]]] = []
    session_id: Optional[str] = "default_session"

@router.post("/analyze", response_model=VisualResearchPlan)
async def analyze_visual_research(request: VisualAnalyzeRequest):
    """
    Trigger Visual Research Analysis for a paper:
    Paper → Analyze → Identify concepts → Create visual plan → Generate visualization → Validate → Display
    """
    try:
        plan = await visual_agent.analyze_paper(
            paper=request.paper,
            claims=request.claims,
            session_id=request.session_id or "default_session"
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visual research analysis failed: {str(e)}")

@router.get("/paper/{paper_id}", response_model=VisualResearchPlan)
async def get_visual_research_for_paper(
    paper_id: str,
    title: Optional[str] = Query(default="Sample Research Paper"),
    session_id: Optional[str] = Query(default="default_session")
):
    """
    Get or compute a visual research plan for a specific paper_id.
    """
    sample_paper = {
        "paper_id": paper_id,
        "title": title,
        "abstract": "Evaluating cross-domain accuracy, precision, and empirical limitations in peer-reviewed models.",
        "year": 2024,
        "doi": f"10.1016/j.knowsure.{paper_id[:8]}"
    }
    plan = await visual_agent.analyze_paper(paper=sample_paper, session_id=session_id)
    return plan
