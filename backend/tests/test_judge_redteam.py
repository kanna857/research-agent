import pytest
from app.schemas.paper import PaperResponse
from app.schemas.claim import ClaimResponse, VerificationStatus
from app.schemas.trust import TrustAnalysis, TrustScoreBreakdown, ConfidenceLevel
from app.agents.pro_con_researcher import pro_researcher_agent, con_researcher_agent
from app.agents.red_team import red_team_agent
from app.agents.gap_finder import gap_finder_agent
from app.agents.judge import judge_agent

@pytest.mark.asyncio
async def test_pro_con_researchers():
    query = "Can LLMs detect misinformation?"
    p1 = PaperResponse(id="p1", paper_id="w1", title="Paper 1", authors=["Alice"], source="OpenAlex", citation_count=10)
    c1 = ClaimResponse(id="c1", claim_id="c1", statement="LLMs detect misinformation on English data", paper_id="w1", evidence_text="Evidence 1", verification_status=VerificationStatus.SUPPORTED, confidence_score=85.0, explanation="")
    c2 = ClaimResponse(id="c2", claim_id="c2", statement="LLMs struggle on low resource data", paper_id="w1", evidence_text="Evidence 2", verification_status=VerificationStatus.PARTIALLY_SUPPORTED, confidence_score=60.0, explanation="", limitations="Low resource limits")

    pro_args = await pro_researcher_agent.synthesize_pro_arguments(query, [c1, c2], [p1])
    con_args = await con_researcher_agent.synthesize_con_arguments(query, [c1, c2], [p1])

    assert pro_args["perspective"] == "PRO_HYPOTHESIS"
    assert pro_args["supporting_claims_count"] == 1
    assert len(pro_args["key_arguments"]) >= 1

    assert con_args["perspective"] == "CON_HYPOTHESIS"
    assert con_args["opposing_claims_count"] == 1
    assert len(con_args["key_arguments"]) >= 1

@pytest.mark.asyncio
async def test_red_team_audit():
    c1 = ClaimResponse(id="c1", claim_id="c1", statement="LLM misinformation detection", paper_id="w1", evidence_text="Evidence 1", verification_status=VerificationStatus.SUPPORTED, confidence_score=85.0, explanation="")
    findings = await red_team_agent.audit_hypothesis("Can LLMs detect misinformation?", [c1])

    assert len(findings) >= 3
    categories = {f.category for f in findings}
    assert "overgeneralization" in categories
    assert "reproducibility_concerns" in categories

@pytest.mark.asyncio
async def test_judge_verdict_decision_tree():
    query = "Can LLMs detect misinformation?"
    c1 = ClaimResponse(id="c1", claim_id="c1", statement="Supported claim", paper_id="w1", evidence_text="Ev 1", verification_status=VerificationStatus.SUPPORTED, confidence_score=85.0, explanation="")
    
    trust = TrustAnalysis(
        overall_trust_score=85.0,
        confidence_level=ConfidenceLevel.HIGH_CONFIDENCE,
        breakdown=TrustScoreBreakdown(evidence_quality=85, source_reliability=85, independent_agreement=85, methodology_quality=85, reproducibility=85, citation_support=85),
        explanation="High trust", knowns=[], unknowns=[], missing_evidence=[]
    )
    
    pro_args = {"supporting_claims_count": 2, "key_arguments": ["Strong PRO argument"]}
    con_args = {"opposing_claims_count": 0, "key_arguments": ["Minor CON argument"]}
    red_team = []

    judgement = await judge_agent.judge(query, [c1], trust, pro_args, con_args, red_team)
    assert judgement.status == ConfidenceLevel.HIGH_CONFIDENCE
    assert "strongly supports" in judgement.main_conclusion
