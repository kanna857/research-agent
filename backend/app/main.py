import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.session import init_db
from app.services.qdrant_service import qdrant_service
from app.services.neo4j_service import neo4j_service

from app.api.v1.health import router as health_router
from app.api.v1.research import router as research_router
from app.api.v1.webhooks import router as webhooks_router
from app.api.v1.papers import router as papers_router
from app.api.v1.claims import router as claims_router
from app.api.v1.graph import router as graph_router
from app.api.v1.visual import router as visual_router
from app.api.v1.commands import router as commands_router

logging.basicConfig(level=logging.INFO if not settings.DEBUG else logging.DEBUG)
logger = logging.getLogger("knowsure")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing KnowSure backend service...")
    await init_db()
    await qdrant_service.initialize()
    await neo4j_service.initialize()
    yield
    logger.info("Shutting down KnowSure backend service...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Advanced Autonomous AI Research Intelligence Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(research_router, prefix=settings.API_V1_STR, tags=["Research Pipeline"])
app.include_router(webhooks_router, prefix=settings.API_V1_STR, tags=["n8n Webhooks"])
app.include_router(papers_router, prefix=settings.API_V1_STR, tags=["Papers Explorer"])
app.include_router(claims_router, prefix=settings.API_V1_STR, tags=["Claims Verification"])
app.include_router(graph_router, prefix=settings.API_V1_STR, tags=["Evidence Graph"])
app.include_router(visual_router, prefix=f"{settings.API_V1_STR}/visual", tags=["Visual Research"])
app.include_router(commands_router, prefix=f"{settings.API_V1_STR}/commands", tags=["Feynman Workflows"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to KnowSure Advanced Autonomous AI Research Intelligence Platform API",
        "health_check": f"{settings.API_V1_STR}/health",
        "docs": "/docs"
    }
