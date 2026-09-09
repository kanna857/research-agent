from fastapi import Header, HTTPException, status
from app.core.config import settings

async def verify_n8n_api_key(x_n8n_api_key: str = Header(None, alias="X-N8N-API-Key")):
    """
    Secures incoming n8n webhook triggers and callbacks.
    """
    if settings.N8N_API_KEY and x_n8n_api_key != settings.N8N_API_KEY:
        # In dev mode, log warning if header missing or mismatched
        if not settings.DEBUG:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing n8n API Key header"
            )
    return x_n8n_api_key
