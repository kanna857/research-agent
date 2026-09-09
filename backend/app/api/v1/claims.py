from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import ResearchSessionModel

router = APIRouter()

@router.get("/research/{session_id}/claims")
async def get_session_claims(session_id: str, db: AsyncSession = Depends(get_db)):
    session_obj = await db.get(ResearchSessionModel, session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "claims": session_obj.claims_json or []}
