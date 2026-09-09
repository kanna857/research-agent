import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import ResearchSessionModel
from app.schemas.webhook import N8nWebhookPayload
from app.core.security import verify_n8n_api_key

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/webhooks/n8n/callback")
async def n8n_callback(
    payload: N8nWebhookPayload,
    db: AsyncSession = Depends(get_db),
    api_key: str = Depends(verify_n8n_api_key)
):
    """
    Receives async workflow progress and stage outputs from n8n orchestrator.
    Updates research session model state in real-time.
    """
    session_obj = await db.get(ResearchSessionModel, payload.session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session ID not found")

    session_obj.current_stage = payload.stage.value
    
    if payload.error:
        session_obj.error = payload.error
        session_obj.current_stage = "FAILED"
    else:
        # Merge payload data
        data = payload.data
        if "plan" in data:
            session_obj.plan_json = data["plan"]
        if "papers" in data:
            session_obj.papers_json = data["papers"]
        if "claims" in data:
            session_obj.claims_json = data["claims"]
        if "contradictions" in data:
            session_obj.contradictions_json = data["contradictions"]
        if "trust_analysis" in data:
            session_obj.trust_json = data["trust_analysis"]
        if "red_team_findings" in data:
            session_obj.red_team_json = data["red_team_findings"]
        if "research_gaps" in data:
            session_obj.research_gaps_json = data["research_gaps"]
        if "final_judgement" in data:
            session_obj.judgement_json = data["final_judgement"]
        if "report_markdown" in data:
            session_obj.report_markdown = data["report_markdown"]
        if "progress_percentage" in data:
            session_obj.progress_percentage = data["progress_percentage"]

    await db.commit()
    logger.info(f"Updated session {payload.session_id} via n8n webhook callback to stage {payload.stage}")
    return {"status": "success", "session_id": payload.session_id, "stage": payload.stage}
