import pytest
from app.schemas.paper import PaperResponse
from app.schemas.claim import ClaimResponse, VerificationStatus
from app.schemas.trust import ConfidenceLevel
from app.agents.contradiction import contradiction_agent
from app.agents.trust_engine import trust_engine_agent
from app.agents.uncertainty_engine import uncertainty_engine_agent

@pytest.mark.asyncio
async def test_supporting_evidence_scenario():
    p1 = PaperResponse(
        id="p1", paper_id="openalex:W1", title="Supported Misinfo Detection Study",
        authors=["Alice"], year=2023, abstract="High accuracy achieved.",
        source="OpenAlex", citation_count=50, doi="10.1000/1"
    )
    p2 = PaperResponse(
        id="p2", paper_id="openalex:W2", title="Multilingual LLM Evaluation",
        authors=["Bob"], year=2023, abstract="Empirical evaluation shows strong performance.",
        source="OpenAlex", citation_count=40, doi="10.1000/2"
    )

    c1 = ClaimResponse(
        id="c1", claim_id="c1", statement="LLMs detect misinformation on English data",
        paper_id="openalex:W1", evidence_text="Provenance: [OpenAlex] Paper: 'Supported Study' | DOI: 10.1000/1",
        verification_status=VerificationStatus.SUPPORTED, confidence_score=90.0, explanation="Supported"
    )
    c2 = ClaimResponse(
        id="c2", claim_id="c2", statement="PaLM shows high accuracy on multilingual benchmark",
        paper_id="openalex:W2", evidence_text="Provenance: [OpenAlex] Paper: 'Multilingual Study' | DOI: 10.1000/2",
        verification_status=VerificationStatus.SUPPORTED, confidence_score=85.0, explanation="Supported"
    )

    trust = await trust_engine_agent.compute_trust([p1, p2], [c1, c2])
    assert trust.overall_trust_score >= 70.0
    assert trust.confidence_level in [ConfidenceLevel.HIGH_CONFIDENCE, ConfidenceLevel.MODERATE_CONFIDENCE]

    uncertainty = await uncertainty_engine_agent.evaluate_uncertainty(trust, [c1, c2])
    assert uncertainty["is_insufficient"] is False
    assert uncertainty["verdict_state"] in ["HIGH_CONFIDENCE", "MODERATE_CONFIDENCE"]

@pytest.mark.asyncio
async def test_conflicting_evidence_scenario():
    p1 = PaperResponse(
        id="p1", paper_id="openalex:W1", title="High Accuracy Detection Study",
        authors=["Alice"], year=2023, abstract="High accuracy achieved.", source="OpenAlex", citation_count=20
    )
    p2 = PaperResponse(
        id="p2", paper_id="openalex:W2", title="Low Accuracy Multilingual Failure Study",
        authors=["Charlie"], year=2023, abstract="Low accuracy observed on low-resource datasets.", source="OpenAlex", citation_count=10
    )

    c1 = ClaimResponse(
        id="c1", claim_id="c1", statement="High accuracy LLM detection on English dataset",
        paper_id="openalex:W1", evidence_text="Provenance: [OpenAlex] High accuracy 92%",
        verification_status=VerificationStatus.SUPPORTED, confidence_score=85.0, explanation="High accuracy"
    )
    c2 = ClaimResponse(
        id="c2", claim_id="c2", statement="Low accuracy LLM detection on low-resource languages",
        paper_id="openalex:W2", evidence_text="Provenance: [OpenAlex] Low accuracy 45%",
        verification_status=VerificationStatus.CONTRADICTED, confidence_score=40.0, explanation="Low accuracy"
    )

    contradictions = await contradiction_agent.detect_contradictions([c1, c2])
    assert len(contradictions) >= 1
    assert contradictions[0].type in ["direct_contradiction", "different_populations", "different_conditions"]

@pytest.mark.asyncio
async def test_insufficient_evidence_scenario():
    # Empty papers/claims -> Must trigger INSUFFICIENT_EVIDENCE
    trust = await trust_engine_agent.compute_trust([], [])
    assert trust.confidence_level == ConfidenceLevel.INSUFFICIENT_EVIDENCE
    assert trust.overall_trust_score == 0.0

    uncertainty = await uncertainty_engine_agent.evaluate_uncertainty(trust, [])
    assert uncertainty["is_insufficient"] is True
    assert uncertainty["verdict_state"] == "INSUFFICIENT_EVIDENCE"
    assert len(uncertainty["unknowns"]) > 0
    assert len(uncertainty["missing_evidence"]) > 0
