import pytest
from app.schemas.claim import ClaimResponse, VerificationStatus
from app.agents.verifier import verifier_agent

@pytest.mark.asyncio
async def test_unsupported_claim_detection():
    # Claim with missing evidence
    unbacked_claim = ClaimResponse(
        id="c_unbacked",
        claim_id="claim_test_1",
        statement="LLMs achieve 100% perfect misinformation detection everywhere",
        paper_id="paper_99",
        evidence_text="", # Empty evidence
        verification_status=VerificationStatus.INSUFFICIENT_EVIDENCE,
        confidence_score=0.0,
        explanation=""
    )

    verified = await verifier_agent.verify_claims([unbacked_claim])
    res = verified[0]
    assert res.verification_status == VerificationStatus.INSUFFICIENT_EVIDENCE
    assert "UNSUPPORTED CLAIM DETECTED" in res.explanation
    assert res.confidence_score <= 20.0

@pytest.mark.asyncio
async def test_supported_claim_verification():
    supported_claim = ClaimResponse(
        id="c_valid",
        claim_id="claim_test_2",
        statement="GPT-4 detects misinformation on English benchmarks",
        paper_id="openalex:W100",
        evidence_text="Provenance: [OpenAlex] Paper: 'Test Paper' | DOI: 10.1000/123. Results show high empirical precision.",
        verification_status=VerificationStatus.SUPPORTED,
        confidence_score=85.0,
        explanation=""
    )

    verified = await verifier_agent.verify_claims([supported_claim])
    res = verified[0]
    assert res.verification_status == VerificationStatus.SUPPORTED
    assert res.confidence_score >= 80.0
