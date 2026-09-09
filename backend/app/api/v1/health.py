from fastapi import APIRouter
from app.core.config import settings
from app.services.qdrant_service import qdrant_service
from app.services.neo4j_service import neo4j_service

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": "development" if settings.DEBUG else "production",
        "services": {
            "database": "connected",
            "qdrant_vector_db": "active" if qdrant_service.is_connected() else "fallback_in_memory",
            "neo4j_graph_db": "active" if neo4j_service.is_connected() else "fallback_in_memory",
            "n8n_orchestration": settings.N8N_RESEARCH_WEBHOOK
        }
    }
