import pytest
from app.agents.firewall import firewall_agent
from app.schemas.research import FinalJudgement
from app.schemas.claim import ClaimResponse
from app.schemas.paper import PaperResponse

@pytest.mark.asyncio
async def test_firewall_validation_pass():
    paper = PaperResponse(
        id="p1",
        paper_id="paper_1",
        title="Valid Test Paper",
        authors=["Author A"],
        year=2024,
        source="OpenAlex",
        citation_count=50,
        doi="10.1016/j.test.1"
    )
    claim = ClaimResponse(
        id="c1",
        claim_id="c1",
        statement="Test claim statement",
        paper_id="paper_1",
        evidence_text="Supporting evidence",
        verification_status="SUPPORTED",
        confidence_score=92.0,
        explanation="Strong empirical support"
    )
    judgement = FinalJudgement(
        status="HIGH_CONFIDENCE",
        main_conclusion="Supported conclusion",
        reasoning="All claims verified",
        firewall_passed=False
    )

    res = await firewall_agent.validate(judgement, [claim], [paper], "Report with paper_1 citation.")
    assert res.firewall_passed is True
    assert len(res.firewall_revisions) == 0

@pytest.mark.asyncio
async def test_firewall_synthesis_correction_loop():
    paper = PaperResponse(
        id="p1",
        paper_id="paper_1",
        title="Valid Test Paper",
        authors=["Author A"],
        year=2024,
        source="OpenAlex",
        citation_count=50
    )
    claim = ClaimResponse(
        id="c1",
        claim_id="c1",
        statement="Unbacked claim statement",
        paper_id="paper_invalid",
        evidence_text="No evidence",
        verification_status="INSUFFICIENT_EVIDENCE",
        confidence_score=20.0,
        explanation="Low confidence"
    )
    judgement = FinalJudgement(
        status="INSUFFICIENT_EVIDENCE",
        main_conclusion="Uncertain conclusion",
        reasoning="Unverified claims",
        firewall_passed=False
    )

    report, corrected_judgement = await firewall_agent.validate_and_correct_synthesis(
        "Report draft text.", judgement, [claim], [paper]
    )

    assert corrected_judgement.firewall_passed is True
    assert "[FIREWALL CORRECTION APPLIED]" in report
