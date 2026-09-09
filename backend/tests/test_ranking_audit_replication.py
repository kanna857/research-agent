import pytest
from app.schemas.paper import PaperResponse
from app.agents.ranking_agent import ranking_agent
from app.agents.audit_agent import audit_agent
from app.agents.replication_agent import replication_agent

@pytest.mark.asyncio
async def test_paper_ranking_agent():
    p1 = PaperResponse(
        id="p1",
        paper_id="paper_1",
        title="Misinformation Detection in Social Media Data",
        authors=["Alice", "Bob"],
        year=2024,
        source="OpenAlex",
        citation_count=120,
        abstract="We present an open source method and dataset benchmark for misinformation detection."
    )
    p2 = PaperResponse(
        id="p2",
        paper_id="paper_2",
        title="Old Paper on Generic Classification",
        authors=["Charlie"],
        year=2018,
        source="arXiv",
        citation_count=10,
        abstract="Older methodology without benchmark datasets."
    )

    ranked = await ranking_agent.rank_papers([p2, p1], "misinformation detection dataset")

    assert len(ranked) == 2
    # p1 should be ranked higher due to higher relevance, recency, and reproducibility
    assert ranked[0].paper_id == "paper_1"
    assert ranked[0].rank_breakdown is not None
    assert ranked[0].rank_breakdown.overall_rank_score > ranked[1].rank_breakdown.overall_rank_score
    assert "Rank Score" in ranked[0].rank_breakdown.ranking_explanation

@pytest.mark.asyncio
async def test_paper_audit_agent():
    p = PaperResponse(
        id="p1",
        paper_id="paper_1",
        title="Misinformation Detection Study",
        authors=["Alice"],
        year=2024,
        source="OpenAlex",
        citation_count=50,
        abstract="We evaluate our dataset benchmark on 10,000 samples."
    )
    claims = [
        {
            "paper_id": "paper_1",
            "claim_id": "c1",
            "statement": "Achieved 100% accuracy on English dataset.",
            "evidence_text": "Accuracy reached 100%.",
            "confidence_score": 30.0
        }
    ]

    audit_res = await audit_agent.audit_paper(p, claims)

    assert audit_res.paper_id == "paper_1"
    assert len(audit_res.traceability_chain) == 6
    assert len(audit_res.mismatches_found) > 0

@pytest.mark.asyncio
async def test_replication_agent():
    p = PaperResponse(
        id="p1",
        paper_id="paper_1",
        title="Misinformation Detection Study",
        authors=["Alice"],
        year=2024,
        source="OpenAlex",
        citation_count=50,
        abstract="We evaluate our dataset benchmark on multi-language corpus."
    )

    repl_res = await replication_agent.analyze_replication(p)

    assert repl_res.paper_id == "paper_1"
    assert len(repl_res.required_datasets) > 0
    assert len(repl_res.methods) > 0
    assert len(repl_res.metrics) > 0
    assert repl_res.reproducibility_score > 0
