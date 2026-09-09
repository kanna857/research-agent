import httpx
import logging
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class N8nClient:
    def __init__(self):
        self.webhook_url = settings.N8N_RESEARCH_WEBHOOK
        self.api_key = settings.N8N_API_KEY

    async def trigger_research_workflow(self, session_id: str, query: str, max_papers: int = 10) -> bool:
        """
        Triggers the n8n research workflow via HTTP POST webhook.
        """
        payload = {
            "session_id": session_id,
            "query": query,
            "max_papers": max_papers,
            "callback_url": f"http://localhost:{settings.PORT}/api/v1/webhooks/n8n/callback"
        }
        headers = {
            "Content-Type": "application/json",
            "X-N8N-API-Key": self.api_key
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.webhook_url, json=payload, headers=headers)
                if response.status_code in [200, 201, 202]:
                    logger.info(f"Successfully triggered n8n workflow for session {session_id}")
                    return True
                else:
                    logger.warning(f"n8n webhook returned status {response.status_code}: {response.text}")
                    return False
        except Exception as e:
            logger.warning(f"Could not reach n8n webhook at {self.webhook_url}: {e}. Local fallback will execute.")
            return False

n8n_client = N8nClient()
