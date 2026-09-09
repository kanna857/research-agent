import pytest
from app.agents.planner import planner_agent

@pytest.mark.asyncio
async def test_research_planner_agent():
    query = "Can large language models reliably detect misinformation across different languages and domains?"
    plan = await planner_agent.plan(query)

    assert plan.objective.startswith("Empirically investigate")
    assert len(plan.subquestions) >= 3
    assert len(plan.search_queries) >= 2
    assert len(plan.required_evidence) >= 2
    assert len(plan.ambiguities) >= 1
    assert any("misinformation" in q.lower() or "languages" in q.lower() for q in plan.search_queries)
