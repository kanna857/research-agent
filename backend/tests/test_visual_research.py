import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.agents.visual_agent import visual_agent

@pytest.mark.asyncio
async def test_visual_agent_direct_analysis():
    paper = {
        "paper_id": "test_paper_001",
        "title": "Cross-Domain Misinformation Detection using Large Language Models",
        "abstract": "We evaluate LLM robustness on misinformation across multi-language benchmark datasets.",
        "year": 2024,
        "doi": "10.1016/j.knowsure.test001"
    }
    claims = [
        {
            "claim_id": "c1",
            "statement": "LLMs achieve 87.4% precision on English misinformation corpus.",
            "evidence_text": "Experimental results demonstrate 87.4% precision on English datasets."
        }
    ]

    plan = await visual_agent.analyze_paper(paper, claims, "session_test")

    assert plan.paper_id == "test_paper_001"
    assert len(plan.concepts) >= 3
    assert len(plan.opportunities) >= 3
    assert len(plan.timeline) == 3
    assert len(plan.methodology_nodes) == 4
    assert len(plan.methodology_edges) == 3
    assert len(plan.animation_schema.keyframes) == 4
    assert plan.validation_passed is True

@pytest.mark.asyncio
async def test_visual_research_api_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "paper": {
                "paper_id": "paper_api_123",
                "title": "Empirical Study of LLM Hallucination Mitigation",
                "abstract": "We propose a citation firewall mechanism to eliminate hallucinations.",
                "year": 2024,
                "doi": "10.1016/j.knowsure.api123"
            },
            "claims": [
                {
                    "claim_id": "c_api_1",
                    "statement": "Citation firewalls reduce hallucination rate to zero.",
                    "evidence_text": "Zero unbacked claims passed validation."
                }
            ],
            "session_id": "session_api_val"
        }
        response = await ac.post("/api/v1/visual/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["paper_id"] == "paper_api_123"
        assert data["validation_passed"] is True
        assert len(data["concepts"]) > 0
        assert "animation_schema" in data
