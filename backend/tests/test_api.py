import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database.session import init_db

@pytest_asyncio.fixture(autouse=True)
async def prepare_db():
    await init_db()

@pytest.mark.asyncio
async def test_start_research_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/research", json={
            "query": "Can large language models reliably detect misinformation across different languages and domains?",
            "max_papers": 5
        })
        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert data["query"].startswith("Can large language models")

        session_id = data["session_id"]
        # Fetch status
        status_res = await ac.get(f"/api/v1/research/{session_id}")
        assert status_res.status_code == 200
        status_data = status_res.json()
        assert status_data["session_id"] == session_id
