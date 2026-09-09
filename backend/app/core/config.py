import os
import json
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "KnowSure"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "knowsure_dev_secret_key_change_in_production"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    DATABASE_URL: str = "sqlite+aiosqlite:///./knowsure.db"

    # Qdrant Vector DB
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_API_KEY: Optional[str] = None

    # Neo4j Graph DB
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "knowsure_password"

    # Academic Integrations
    OPENALEX_EMAIL: str = "researcher@knowsure.ai"
    SEMANTIC_SCHOLAR_API_KEY: Optional[str] = None
    ARXIV_USER_AGENT: str = "KnowSure-ResearchAgent/1.0"

    # n8n Orchestration
    N8N_BASE_URL: str = "http://localhost:5678"
    N8N_RESEARCH_WEBHOOK: str = "http://localhost:5678/webhook/knowsure-research"
    N8N_API_KEY: str = "knowsure_n8n_secret_token"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
